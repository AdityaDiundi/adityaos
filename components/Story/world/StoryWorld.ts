import * as THREE from "three";
import { JourneyStation } from "@/content/journey";
import { JourneyConfig } from "@/content/journey.config";
import { ParallaxBackdrop } from "./ParallaxBackdrop";
import { PixelHeroProps } from "./PixelHeroProps";
import { SpeedStreaks } from "../warp/SpeedStreaks";

export interface StoryWorldOptions {
  canvas: HTMLCanvasElement;
  stations: JourneyStation[];
  config: JourneyConfig;
  isDark?: boolean;
}

// Background era mood colors across station progression
const ERA_BG_COLORS: { progress: number; colorHex: number }[] = [
  { progress: 0.00, colorHex: 0x060C1A }, // Boot: Deep midnight blue
  { progress: 0.12, colorHex: 0x0D0518 }, // Arcade: Neon arcade dark purple
  { progress: 0.25, colorHex: 0x020208 }, // Timeskip: Pure deep space black
  { progress: 0.38, colorHex: 0x0A1526 }, // MFine: Corporate dusk blue
  { progress: 0.50, colorHex: 0x0F1A26 }, // Mosaic: Deep teal slate
  { progress: 0.65, colorHex: 0x0D1A10 }, // Field: Forest deep green
  { progress: 0.78, colorHex: 0x141418 }, // Studio: Graphite workstation
  { progress: 0.88, colorHex: 0x0A0C14 }, // Builds: Contrast midnight
  { progress: 1.00, colorHex: 0xFAF7F2 }, // Landing: Warm paper desktop
];

export class StoryWorld {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  private backdrop: ParallaxBackdrop;
  private heroProps: PixelHeroProps;
  private streaks: SpeedStreaks;

  private ambientLight: THREE.AmbientLight;
  private dirLight: THREE.DirectionalLight;
  private fog: THREE.FogExp2;

  private isDark: boolean = false;
  private isDisposed: boolean = false;
  private config: JourneyConfig;

  // Reusable colors to prevent per-frame allocation
  private currentBgColor: THREE.Color = new THREE.Color(0x060C1A);
  private targetBgColor: THREE.Color = new THREE.Color(0x060C1A);
  private colorA: THREE.Color = new THREE.Color();
  private colorB: THREE.Color = new THREE.Color();

  constructor(options: StoryWorldOptions) {
    const { canvas, stations, config, isDark = false } = options;
    this.config = config;
    this.isDark = isDark;

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = this.currentBgColor;
    this.fog = new THREE.FogExp2(0x060C1A, 0.012);
    this.scene.fog = this.fog;

    // 2. Camera
    const aspect = canvas.clientWidth / (canvas.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(config.baseFov, aspect, 0.1, 1000);

    // 3. Renderer with NearestFilter pixel aesthetics and capped DPR
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const maxDpr = isMobile ? config.dprCapMobile : config.dprCapDesktop;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, maxDpr) : 1;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // 4. Lighting: Flat shading, one directional key light + ambient
    this.ambientLight = new THREE.AmbientLight(0xE2D7C3, 1.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    this.dirLight.position.set(15, 30, 20);
    this.scene.add(this.dirLight);

    // 5. 2.5D Visual Layers
    this.backdrop = new ParallaxBackdrop();
    this.scene.add(this.backdrop.group);

    this.heroProps = new PixelHeroProps(stations);
    this.scene.add(this.heroProps.group);

    this.streaks = new SpeedStreaks();
    this.scene.add(this.streaks.group);

    this.setTheme(isDark);
  }

  public updateConfig(config: JourneyConfig): void {
    this.config = config;
  }

  public setRenderScale(scale: number): void {
    const canvas = this.renderer.domElement;
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? this.config.dprCapMobile : this.config.dprCapDesktop;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  }

  public setTheme(isDark: boolean): void {
    this.isDark = isDark;
    this.backdrop.updateTheme(isDark);
  }

  public handleResize(width: number, height: number): void {
    if (this.isDisposed || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  /**
   * Pre-compiles and warms up textures on the GPU before revealing the canvas.
   */
  public async preloadGPU(): Promise<void> {
    for (const tex of this.heroProps.createdTextures) {
      this.renderer.initTexture(tex);
    }
    // Render 2 warmup frames
    this.renderer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  private updateEraMood(tau: number): void {
    const p = Math.max(0, Math.min(1, tau));

    // Find era segment
    let low = ERA_BG_COLORS[0];
    let high = ERA_BG_COLORS[ERA_BG_COLORS.length - 1];

    for (let i = 0; i < ERA_BG_COLORS.length - 1; i++) {
      if (p >= ERA_BG_COLORS[i].progress && p <= ERA_BG_COLORS[i + 1].progress) {
        low = ERA_BG_COLORS[i];
        high = ERA_BG_COLORS[i + 1];
        break;
      }
    }

    const span = high.progress - low.progress || 1;
    const frac = (p - low.progress) / span;

    this.colorA.setHex(low.colorHex);
    this.colorB.setHex(high.colorHex);
    this.targetBgColor.lerpColors(this.colorA, this.colorB, frac);

    // If light theme is active, blend towards paper tone at later stations
    if (!this.isDark && p > 0.85) {
      this.targetBgColor.setHex(0xFAF7F2);
    }

    this.currentBgColor.lerp(this.targetBgColor, 0.1);
    this.scene.background = this.currentBgColor;
    this.fog.color.copy(this.currentBgColor);
  }

  public render(tau: number, smoothedVelocity: number, dt: number): void {
    if (this.isDisposed) return;

    // 1. Crossfade color mood per era
    this.updateEraMood(tau);

    // 2. Update parallax layers following camera
    this.backdrop.updateParallax(this.camera.position);

    // 3. Update minimal speed streak lines
    this.streaks.update(
      this.camera.position,
      smoothedVelocity,
      this.config.warpVelocityThreshold,
      this.config.warpIntensity
    );

    // 4. Update hero props ambient animations
    this.heroProps.update(performance.now() * 0.001);

    // 5. Render to screen
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;
    this.backdrop.dispose();
    this.heroProps.dispose();
    this.streaks.dispose();
    this.renderer.dispose();
  }
}
