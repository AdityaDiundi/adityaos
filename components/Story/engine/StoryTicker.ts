import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { JourneyConfig } from "@/content/journey.config";
import { DwellMapper } from "./DwellMapper";
import { SpringCamera, SpringCameraState } from "./SpringCamera";
import { StoryWorld } from "../world/StoryWorld";

gsap.registerPlugin(ScrollTrigger);

export interface TickerState {
  rawProgress: number;
  mappedTau: number;
  velocity: number;
  activeStationIndex: number;
  currentYear: number;
  fps: number;
  p50Ms: number;
  p95Ms: number;
  droppedFrames: number;
  longTasks: number;
  renderScale: number;
  isSettled: boolean;
  cameraState: SpringCameraState;
}

export type TickerListener = (state: TickerState) => void;

export class StoryTicker {
  private lenis: Lenis;
  private world: StoryWorld;
  private camera: SpringCamera;
  private mapper: DwellMapper;
  private config: JourneyConfig;

  private isRunning: boolean = false;
  private isTabVisible: boolean = true;
  private listeners: Set<TickerListener> = new Set();

  // Smoothed velocity
  private smoothedVelocity: number = 0;

  // Performance telemetry (circular buffer of last 120 frames)
  private frameTimes: number[] = new Array(120).fill(16.6);
  private frameTimeIdx: number = 0;
  private droppedFrames: number = 0;
  private longTasks: number = 0;
  private highLatencyAccumulator: number = 0;
  private headroomAccumulator: number = 0;
  private currentRenderScale: number = 1.0;

  // Settled render-on-demand gate
  private settledFramesCount: number = 0;
  private forceRenderDirty: boolean = true;

  // Cached state object to prevent per-tick allocation
  private stateCache: TickerState;

  private tickerCallback: (time: number, deltaTime: number, frame: number) => void;

  constructor(
    lenis: Lenis,
    world: StoryWorld,
    camera: SpringCamera,
    mapper: DwellMapper,
    config: JourneyConfig
  ) {
    this.lenis = lenis;
    this.world = world;
    this.camera = camera;
    this.mapper = mapper;
    this.config = config;
    this.currentRenderScale = config.renderScale;

    this.stateCache = {
      rawProgress: 0,
      mappedTau: 0,
      velocity: 0,
      activeStationIndex: 0,
      currentYear: 2000,
      fps: 60,
      p50Ms: 16.6,
      p95Ms: 16.6,
      droppedFrames: 0,
      longTasks: 0,
      renderScale: this.currentRenderScale,
      isSettled: false,
      cameraState: {
        position: camera["currentPos"],
        target: camera["currentLookAt"],
        fov: config.baseFov,
        roll: 0,
        isSettled: false,
      },
    };

    // Ensure GSAP ticker never adds artificial lag
    gsap.ticker.lagSmoothing(0);

    // Single unified tick callback
    this.tickerCallback = (time: number, deltaTime: number) => {
      this.onTick(time, deltaTime / 1000);
    };

    this.initVisibilityListener();
  }

  private initVisibilityListener(): void {
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
      this.isTabVisible = !document.hidden;
      if (this.isTabVisible) {
        this.markDirty();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility, { passive: true });
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    gsap.ticker.add(this.tickerCallback);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    gsap.ticker.remove(this.tickerCallback);
  }

  public markDirty(): void {
    this.forceRenderDirty = true;
    this.settledFramesCount = 0;
  }

  public subscribe(listener: TickerListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public updateConfig(config: JourneyConfig): void {
    this.config = config;
    this.markDirty();
  }

  public setRenderScale(scale: number): void {
    this.currentRenderScale = Math.max(0.5, Math.min(1.5, scale));
    this.world.setRenderScale(this.currentRenderScale);
    this.markDirty();
  }

  private onTick(time: number, dt: number): void {
    if (!this.isTabVisible) return;

    const frameStart = performance.now();
    const safeDt = Math.min(Math.max(dt, 0.001), 0.1);

    // 1. Advance Lenis smooth scroll from the unified ticker
    this.lenis.raf(time * 1000);

    // 2. Refresh ScrollTrigger
    ScrollTrigger.update();

    // 3. Obtain raw progress and smooth velocity from Lenis
    const limit = this.lenis.limit || 1;
    const rawProgress = Math.max(0, Math.min(1, this.lenis.scroll / limit));

    // Smooth velocity with exponential falloff
    const rawVel = (this.lenis.velocity || 0) / limit;
    this.smoothedVelocity += (rawVel - this.smoothedVelocity) * (1.0 - Math.exp(-12.0 * safeDt));

    // 4. Map raw progress through Dwell Plateaus
    const mappedTau = this.mapper.mapProgress(rawProgress);
    const stationIndex = this.mapper.getStationIndexWithHysteresis(rawProgress);

    // 5. Update Camera physics (critically damped spring)
    const cameraState = this.camera.update(mappedTau, this.smoothedVelocity, safeDt);

    // 6. Check if rendering can be skipped on demand
    const isStationary = cameraState.isSettled && Math.abs(this.smoothedVelocity) < 0.0001;

    if (isStationary && !this.forceRenderDirty && this.config.skipRenderWhenSettled) {
      this.settledFramesCount++;
    } else {
      this.settledFramesCount = 0;
      this.forceRenderDirty = false;
    }

    const shouldRender = this.settledFramesCount < 3 || this.forceRenderDirty;

    if (shouldRender) {
      // 7. Update 3D World (world, 2.5D pixel planes, hero props, speed streaks) and Render
      this.world.render(mappedTau, this.smoothedVelocity, safeDt);
    }

    // 8. Performance telemetry computation
    const frameElapsed = performance.now() - frameStart;
    this.frameTimes[this.frameTimeIdx] = frameElapsed;
    this.frameTimeIdx = (this.frameTimeIdx + 1) % this.frameTimes.length;

    if (frameElapsed > 33.3) this.droppedFrames++;
    if (frameElapsed > 50.0) this.longTasks++;

    // Calculate p50 and p95
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const p50Ms = sorted[Math.floor(sorted.length * 0.5)];
    const p95Ms = sorted[Math.floor(sorted.length * 0.95)];
    const fps = Math.round(1000 / (frameElapsed || 16.6));

    // 9. Auto-lower render scale if p95 > 20ms for 2s
    if (this.config.autoScaleEnabled) {
      if (p95Ms > 20.0) {
        this.highLatencyAccumulator += safeDt;
        this.headroomAccumulator = 0;
        if (this.highLatencyAccumulator >= 2.0 && this.currentRenderScale > 0.65) {
          this.setRenderScale(this.currentRenderScale - 0.15);
          this.highLatencyAccumulator = 0;
        }
      } else if (p95Ms < 14.0 && this.currentRenderScale < 1.0) {
        this.headroomAccumulator += safeDt;
        this.highLatencyAccumulator = 0;
        if (this.headroomAccumulator >= 4.0) {
          this.setRenderScale(Math.min(1.0, this.currentRenderScale + 0.05));
          this.headroomAccumulator = 0;
        }
      }
    }

    // 10. Populate state cache
    this.stateCache.rawProgress = rawProgress;
    this.stateCache.mappedTau = mappedTau;
    this.stateCache.velocity = this.smoothedVelocity;
    this.stateCache.activeStationIndex = stationIndex;
    this.stateCache.fps = fps;
    this.stateCache.p50Ms = p50Ms;
    this.stateCache.p95Ms = p95Ms;
    this.stateCache.droppedFrames = this.droppedFrames;
    this.stateCache.longTasks = this.longTasks;
    this.stateCache.renderScale = this.currentRenderScale;
    this.stateCache.isSettled = isStationary;
    this.stateCache.cameraState = cameraState;

    // 11. Broadcast to micro-subscribers (DOM caption, rail, tuning panel)
    for (const listener of this.listeners) {
      listener(this.stateCache);
    }
  }

  public dispose(): void {
    this.stop();
    this.listeners.clear();
  }
}
