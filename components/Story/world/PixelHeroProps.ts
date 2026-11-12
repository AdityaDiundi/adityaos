import * as THREE from "three";
import { JourneyStation } from "@/content/journey";
import { STATION_COORDINATES } from "./StationLandmarks";

export const PIXEL_PALETTE_24 = {
  inkBlack: "#0A0D0E",
  graphite: "#161922",
  charcoal: "#232836",
  slate: "#3D4457",
  stoneGrey: "#6B7280",
  cloudMuted: "#9CA3AF",
  paperTone: "#FAF7F2",
  pureWhite: "#FFFFFF",
  paperWarm: "#F3EDE2",
  terracotta: "#C86446",
  bambooOchre: "#D4A373",
  clayBrown: "#78350F",
  pineDeep: "#2D5A3A",
  mossGreen: "#4B7C59",
  cyanPhosphor: "#38BDF8",
  tealClinical: "#0D9488",
  mintHighlight: "#2DD4BF",
  emeraldStreak: "#10B981",
  amberWarning: "#F59E0B",
  arcadeRed: "#EF4444",
  neonViolet: "#8B5CF6",
  cobaltBlue: "#1D4ED8",
  shadowOutline: "#0F1117",
  highlightOutline: "#F8FAFC",
};

/**
 * Creates 2.5D pixel texture with NearestFilter, no mipmaps, and integer pixel grid.
 */
export function create2DPixelTexture(
  width: number,
  height: number,
  render: (ctx: CanvasRenderingContext2D) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    render(ctx);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

export class PixelHeroProps {
  public group: THREE.Group;
  private animatedProps: { mesh: THREE.Object3D; update: (t: number) => void }[] = [];
  public createdTextures: THREE.Texture[] = [];

  constructor(stations: JourneyStation[]) {
    this.group = new THREE.Group();
    this.buildProps(stations);
  }

  private buildProps(stations: JourneyStation[]): void {
    for (const station of stations) {
      const transform = STATION_COORDINATES[station.id];
      if (!transform) continue;

      const stationGroup = new THREE.Group();
      stationGroup.position.copy(transform.position);

      switch (station.id) {
        case "boot":
          this.buildBootProp(stationGroup);
          break;
        case "arcade":
          this.buildArcadeProp(stationGroup);
          break;
        case "timeskip":
          this.buildTimeskipProp(stationGroup);
          break;
        case "mfine":
          this.buildMFineProp(stationGroup);
          break;
        case "mosaic":
          this.buildMosaicProp(stationGroup);
          break;
        case "quiet-year":
          this.buildQuietProp(stationGroup);
          break;
        case "field":
          this.buildFieldProp(stationGroup);
          break;
        case "studio":
          this.buildStudioProp(stationGroup);
          break;
        case "builds":
          this.buildBuildsProp(stationGroup);
          break;
        case "landing":
          this.buildLandingProp(stationGroup);
          break;
      }

      this.group.add(stationGroup);
    }
  }

  // 0. Boot CRT Monitor (2.5D Layered Plane)
  private buildBootProp(group: THREE.Group): void {
    const tex = create2DPixelTexture(320, 240, (ctx) => {
      // Background: Deep dark star-field sky
      ctx.fillStyle = "#040814";
      ctx.fillRect(0, 0, 320, 240);

      // Star-field dots
      const stars: [number, number, string, number][] = [
        [15, 20, "#FFFFFF", 2], [42, 12, "#38BDF8", 1], [78, 30, "#FFFFFF", 1],
        [110, 15, "#FFFFFF", 2], [145, 8, "#FAF7F2", 1], [180, 22, "#38BDF8", 1],
        [220, 14, "#FFFFFF", 2], [265, 28, "#FAF7F2", 1], [295, 10, "#FFFFFF", 2],
        [25, 60, "#FAF7F2", 1], [305, 50, "#38BDF8", 1], [18, 110, "#FFFFFF", 1],
        [302, 115, "#FAF7F2", 1], [12, 150, "#38BDF8", 2], [308, 160, "#FFFFFF", 1],
        [35, 175, "#FFFFFF", 1], [290, 180, "#FAF7F2", 1], [50, 45, "#FFFFFF", 1],
        [275, 75, "#FFFFFF", 1], [195, 12, "#38BDF8", 1], [125, 22, "#FFFFFF", 1]
      ];
      for (const [sx, sy, col, size] of stars) {
        ctx.fillStyle = col;
        ctx.fillRect(sx, sy, size, size);
      }

      // Pixel-art desk surface extending to sides (y: 196 to 240)
      ctx.fillStyle = "#333C4E";
      ctx.fillRect(0, 196, 320, 2); // Highlight edge on top
      ctx.fillStyle = "#151924";
      ctx.fillRect(0, 198, 320, 42); // Desk body
      ctx.fillStyle = "#1C2230";
      for (let x = 0; x < 320; x += 16) {
        ctx.fillRect(x, 202, 8, 38); // Subtle panel grain
      }

      // Small keyboard sprite below monitor (x: 104 to 216, y: 204 to 226)
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(102, 203, 116, 25); // Outline
      ctx.fillStyle = "#262C38";
      ctx.fillRect(104, 204, 112, 22); // Chassis
      ctx.fillStyle = "#3D4457";
      ctx.fillRect(104, 204, 112, 1); // Keydeck top highlight
      // Key rows with key-row dividers
      const keyCols = 13;
      for (let r = 0; r < 3; r++) {
        const ry = 207 + r * 5;
        for (let c = 0; c < keyCols; c++) {
          if (r === 2 && c >= 4 && c <= 8) continue; // Space for spacebar
          const kx = 107 + c * 8;
          ctx.fillStyle = "#1A1E29";
          ctx.fillRect(kx, ry, 6, 4);
          ctx.fillStyle = "#333A48";
          ctx.fillRect(kx, ry, 5, 1);
        }
      }
      // Spacebar
      ctx.fillStyle = "#1A1E29";
      ctx.fillRect(139, 217, 42, 4);
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(139, 217, 42, 1);

      // CRT Pedestal / Base
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(118, 190, 84, 10);
      ctx.fillStyle = PIXEL_PALETTE_24.charcoal;
      ctx.fillRect(120, 191, 80, 8);
      ctx.fillStyle = PIXEL_PALETTE_24.slate;
      ctx.fillRect(138, 178, 44, 14); // Neck
      ctx.fillStyle = PIXEL_PALETTE_24.graphite;
      ctx.fillRect(146, 178, 28, 14);

      // CRT Main Bezel Outer Shadow
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(40, 20, 240, 160);

      // Heavy chunky bezel in charcoal with rounded corner pixels
      ctx.fillStyle = PIXEL_PALETTE_24.charcoal;
      ctx.fillRect(42, 22, 236, 156);
      // Notch out 4 corner pixels for rounded CRT silhouette
      ctx.fillStyle = "#040814";
      // Top-left
      ctx.fillRect(40, 20, 4, 2); ctx.fillRect(40, 20, 2, 4);
      // Top-right
      ctx.fillRect(276, 20, 4, 2); ctx.fillRect(278, 20, 2, 4);
      // Bottom-left
      ctx.fillRect(40, 176, 4, 2); ctx.fillRect(40, 174, 2, 4);
      // Bottom-right
      ctx.fillRect(276, 176, 4, 2); ctx.fillRect(278, 174, 2, 4);

      // Bezel highlight edges
      ctx.fillStyle = PIXEL_PALETTE_24.slate;
      ctx.fillRect(44, 23, 232, 2);
      ctx.fillRect(43, 24, 2, 152);
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(44, 176, 232, 2);
      ctx.fillRect(276, 24, 2, 152);

      // Screen glow: subtle lighter halo around screen edges
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(52, 32, 216, 126);

      // Inner Screen area with phosphor background
      ctx.fillStyle = "#02140D";
      ctx.fillRect(56, 36, 208, 118);

      // Green phosphor scanlines (alternating dark/bright rows every 2px)
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      for (let y = 36; y < 154; y += 2) {
        ctx.fillRect(56, y, 208, 1);
      }

      // Terminal text
      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.font = "bold 11px monospace";
      ctx.fillText("> ADITYA_OS v2.4", 68, 64);
      ctx.fillText("> SYSTEM: ONLINE", 68, 88);
      ctx.fillText(">", 116, 118); // Aligned prompt for 3D blinking cursor
      ctx.fillText("> SCROLL TO TRAVEL", 68, 140);

      // Two round bumps at bottom-center of bezel (speakers)
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(140, 163, 10, 8);
      ctx.fillRect(170, 163, 10, 8);
      ctx.fillStyle = PIXEL_PALETTE_24.slate;
      ctx.fillRect(141, 164, 8, 6);
      ctx.fillRect(171, 164, 8, 6);
      ctx.fillStyle = PIXEL_PALETTE_24.inkBlack;
      ctx.fillRect(143, 166, 4, 2);
      ctx.fillRect(173, 166, 4, 2);

      // Power LED: amber pixel dot
      ctx.fillStyle = PIXEL_PALETTE_24.amberWarning;
      ctx.fillRect(256, 165, 4, 4);
      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(257, 166, 2, 2);
    });
    this.createdTextures.push(tex);

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 4.0), mat);
    mesh.position.set(0, 1.5, 0);
    group.add(mesh);

    // Blinking cursor secondary plane at cursor position (x=-0.5, y=0.1 offset from center)
    const cursorGeo = new THREE.PlaneGeometry(0.12, 0.18);
    const cursorMat = new THREE.MeshBasicMaterial({
      color: 0x2DD4BF,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });
    const cursorMesh = new THREE.Mesh(cursorGeo, cursorMat);
    cursorMesh.position.set(-0.5, 1.5 + 0.1, 0.02);
    group.add(cursorMesh);

    this.animatedProps.push({
      mesh: cursorMesh,
      update: (t) => {
        cursorMat.opacity = Math.sin(t * 4.5) > 0 ? 1.0 : 0.0;
      },
    });
  }

  // 1. Arcade Cabinet (2.5D Sprite with 1px Darker Outline)
  private buildArcadeProp(group: THREE.Group): void {
    const tex = create2DPixelTexture(192, 280, (ctx) => {
      // Outline silhouette
      ctx.fillStyle = PIXEL_PALETTE_24.shadowOutline;
      ctx.fillRect(18, 6, 156, 268);

      // Cabinet Body: very dark charcoal
      ctx.fillStyle = "#12151D";
      ctx.fillRect(20, 8, 152, 264);

      // 2px highlight edge on left and top
      ctx.fillStyle = "#3D4457";
      ctx.fillRect(20, 8, 152, 2);
      ctx.fillRect(20, 8, 2, 264);

      // Side panel decoration: diagonal stripe pattern in slightly lighter color
      ctx.fillStyle = "#222736";
      for (let s = -20; s < 120; s += 8) {
        // Left side flange
        ctx.fillRect(22, 60 + s, 14, 3);
        // Right side flange
        ctx.fillRect(156, 60 + s, 14, 3);
      }

      // Marquee at top: cobalt blue panel
      ctx.fillStyle = PIXEL_PALETTE_24.cobaltBlue;
      ctx.fillRect(34, 16, 124, 36);
      ctx.fillStyle = PIXEL_PALETTE_24.amberWarning;
      ctx.strokeRect(35, 17, 122, 34);

      // Decorative star pixels on marquee
      const drawStar = (cx: number, cy: number) => {
        ctx.fillStyle = "#FDE047";
        ctx.fillRect(cx, cy - 2, 2, 6);
        ctx.fillRect(cx - 2, cy, 6, 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(cx, cy, 2, 2);
      };
      drawStar(44, 34);
      drawStar(148, 34);

      // Yellow/amber pixel text "VIRTUA COP 2"
      ctx.fillStyle = "#FCD34D";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("VIRTUA COP 2", 96, 38);

      // Inset bezel around screen
      ctx.fillStyle = PIXEL_PALETTE_24.inkBlack;
      ctx.fillRect(44, 58, 104, 70);

      // Screen: 60x44px inset black area
      const sx = 66;
      const sy = 70;
      const sw = 60;
      const sh = 44;
      ctx.fillStyle = "#020617";
      ctx.fillRect(sx, sy, sw, sh);

      // Blue gradient pixel city skyline silhouette
      const buildings = [
        { w: 8, h: 18, col: "#1E3A8A", win: true },
        { w: 9, h: 26, col: "#1D4ED8", win: true },
        { w: 7, h: 14, col: "#2563EB", win: false },
        { w: 10, h: 22, col: "#1E40AF", win: true },
        { w: 8, h: 16, col: "#1D4ED8", win: true },
        { w: 10, h: 28, col: "#2563EB", win: true },
        { w: 8, h: 12, col: "#1E3A8A", win: false },
      ];
      let curX = sx;
      for (const b of buildings) {
        ctx.fillStyle = b.col;
        ctx.fillRect(curX, sy + sh - b.h, b.w, b.h);
        if (b.win) {
          ctx.fillStyle = "#FCD34D";
          ctx.fillRect(curX + 2, sy + sh - b.h + 4, 2, 2);
          if (b.h > 20) {
            ctx.fillRect(curX + 2, sy + sh - b.h + 10, 2, 2);
          }
        }
        curX += b.w;
      }

      // Red reticle crosshair (4-pixel arms, center dot)
      const rx = sx + 30;
      const ry = sy + 22;
      ctx.fillStyle = PIXEL_PALETTE_24.arcadeRed;
      ctx.fillRect(rx - 1, ry - 1, 2, 2); // Center dot
      ctx.fillRect(rx - 1, ry - 6, 2, 4); // Top arm
      ctx.fillRect(rx - 1, ry + 2, 2, 4); // Bottom arm
      ctx.fillRect(rx - 6, ry - 1, 4, 2); // Left arm
      ctx.fillRect(rx + 2, ry - 1, 4, 2); // Right arm

      // Score HUD: P1: 08900 in white monospace
      ctx.fillStyle = PIXEL_PALETTE_24.pureWhite;
      ctx.font = "bold 6px monospace";
      ctx.textAlign = "left";
      ctx.fillText("P1: 08900", sx + 2, sy + 7);

      // Control panel: lighter gray slab
      ctx.fillStyle = "#374151";
      ctx.fillRect(30, 134, 132, 34);
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(30, 134, 132, 2); // Top bevel highlight
      ctx.fillStyle = "#1F2937";
      ctx.fillRect(30, 166, 132, 2);

      // Joystick dot
      ctx.fillStyle = "#111827";
      ctx.fillRect(56, 150, 10, 4); // Base
      ctx.fillStyle = "#9CA3AF";
      ctx.fillRect(60, 144, 2, 7); // Shaft
      ctx.fillStyle = PIXEL_PALETTE_24.arcadeRed;
      ctx.fillRect(58, 140, 6, 6); // Ball knob

      // 3 colored buttons (red, yellow, blue)
      const buttons = [
        { bx: 104, by: 147, col: PIXEL_PALETTE_24.arcadeRed },
        { bx: 118, by: 143, col: PIXEL_PALETTE_24.amberWarning },
        { bx: 132, by: 147, col: PIXEL_PALETTE_24.cyanPhosphor },
      ];
      for (const btn of buttons) {
        ctx.fillStyle = "#111827";
        ctx.fillRect(btn.bx - 1, btn.by, 8, 8); // Shadow
        ctx.fillStyle = btn.col;
        ctx.fillRect(btn.bx, btn.by - 1, 6, 6); // Button face
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(btn.bx + 1, btn.by, 2, 2); // Specular highlight
      }

      // Coin door: dark panel center
      ctx.fillStyle = "#0A0D0E";
      ctx.fillRect(52, 178, 88, 56);
      ctx.fillStyle = "#1F2937";
      ctx.strokeRect(53, 179, 86, 54);

      // Two coin slots as horizontal slits
      ctx.fillStyle = "#000000";
      ctx.fillRect(68, 194, 18, 4);
      ctx.fillRect(106, 194, 18, 4);
      // Amber illuminated reject buttons
      ctx.fillStyle = PIXEL_PALETTE_24.amberWarning;
      ctx.fillRect(73, 204, 8, 10);
      ctx.fillRect(111, 204, 8, 10);

      // Standing base / pedestal
      ctx.fillStyle = "#0A0D0E";
      ctx.fillRect(24, 240, 144, 28);
      ctx.fillStyle = "#161922";
      ctx.fillRect(28, 246, 136, 18);
    });
    this.createdTextures.push(tex);

    // Main cabinet mesh
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      alphaTest: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mainMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 5.2), mat);
    mainMesh.position.set(0, 1.6, 0);
    group.add(mainMesh);

    // Second sprite: mirrored arcade cabinet to the right, slightly behind and smaller (0.7x scale)
    const secondMat = mat.clone();
    const secondMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 5.2), secondMat);
    secondMesh.scale.set(-0.7, 0.7, 0.7);
    secondMesh.position.set(2.2, 1.6, -1);
    group.add(secondMesh);

    // Floor: floor plane with subtle checker pattern extending left/right
    const floorTex = create2DPixelTexture(64, 64, (ctx) => {
      ctx.fillStyle = "#0D1117";
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = "#161B22";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillRect(32, 32, 32, 32);
    });
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(8, 4);
    this.createdTextures.push(floorTex);

    const floorMat = new THREE.MeshBasicMaterial({ map: floorTex });
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 4), floorMat);
    floorMesh.position.set(0, -0.5, 0);
    group.add(floorMesh);

    // Neon glow spots: 3 small square planes with cyan/pink at y=1.8 around cabinets
    const glowDefs = [
      { pos: new THREE.Vector3(-1.9, 1.8, 0.2), color: 0x00FFFF },
      { pos: new THREE.Vector3(1.1, 1.8, -0.4), color: 0xFF2E93 },
      { pos: new THREE.Vector3(3.2, 1.8, -0.8), color: 0x00FFFF },
    ];
    for (const gd of glowDefs) {
      const glowMat = new THREE.MeshBasicMaterial({
        color: gd.color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), glowMat);
      glowMesh.position.copy(gd.pos);
      group.add(glowMesh);
    }

    // Animation: screen content flickers (opacity pulse 0.95-1.0 at 8Hz)
    this.animatedProps.push({
      mesh: mainMesh,
      update: (t) => {
        // 8Hz oscillation: 8 * 2 * PI ≈ 50.26
        mat.opacity = 0.95 + 0.05 * (0.5 + 0.5 * Math.sin(t * 50.26));
      },
    });
  }

  // 2. Timeskip Warp Portal (3D Concentric Torus Warp Tunnel)
  private buildTimeskipProp(group: THREE.Group): void {
    // 6 concentric torus rings centered around station 2 (z = +8 to -12)
    // Alternating electric cyan (#00FFFF) and violet (#8B5CF6), wireframe: true
    for (let i = 0; i < 6; i++) {
      const radius = 3.6 + i * 0.5;
      const tube = 0.05;
      const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 32);
      const ringColor = i % 2 === 0 ? 0x00FFFF : 0x8B5CF6;
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        wireframe: true,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 0, 8 - i * 4);
      group.add(ringMesh);

      // Rings rotate on Z axis together (t * 0.5), alternating +/- direction
      const dir = i % 2 === 0 ? 1 : -1;
      this.animatedProps.push({
        mesh: ringMesh,
        update: (t) => {
          ringMesh.rotation.z = dir * (t * 0.5);
        },
      });
    }

    // 40 star particles: tiny BoxGeometry(0.05, 0.05, 0.05) localized around the tunnel
    const starGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let s = 0; s < 40; s++) {
      const starMesh = new THREE.Mesh(starGeo, starMat);
      const r = Math.pow(Math.random(), 0.5) * 16;
      const angle = Math.random() * Math.PI * 2;
      starMesh.position.x = Math.cos(angle) * r;
      starMesh.position.y = Math.sin(angle) * r;
      starMesh.position.z = 10 - Math.random() * 24;
      group.add(starMesh);

      // Stars drift toward camera slightly
      this.animatedProps.push({
        mesh: starMesh,
        update: () => {
          starMesh.position.z += 0.03;
          if (starMesh.position.z > 12) {
            starMesh.position.z = -14;
          }
        },
      });
    }

    // Center vortex: a PlaneGeometry(3, 3) canvas texture placed at the end of the tunnel
    const vortexTex = create2DPixelTexture(256, 256, (ctx) => {
      // Black background
      ctx.fillStyle = "#020208";
      ctx.fillRect(0, 0, 256, 256);

      // 5 concentric squares drawn outward in cyan->white gradient
      const squareColors = [
        { size: 28, col: "#FFFFFF" },
        { size: 56, col: "#E0F2FE" },
        { size: 88, col: "#67E8F9" },
        { size: 124, col: "#22D3EE" },
        { size: 164, col: "#00FFFF" },
      ];
      ctx.lineWidth = 2;
      for (const sq of squareColors) {
        ctx.strokeStyle = sq.col;
        const offset = sq.size / 2;
        ctx.strokeRect(128 - offset, 128 - offset, sq.size, sq.size);
      }

      // Center: glowing white 4px square
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(126, 126, 4, 4);

      // Text: >> FAST FORWARD 2021 >> in cyan monospace
      ctx.fillStyle = "#00FFFF";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(">> FAST FORWARD 2021 >>", 128, 224);
    });
    this.createdTextures.push(vortexTex);

    const vortexMat = new THREE.MeshBasicMaterial({
      map: vortexTex,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const vortexMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), vortexMat);
    vortexMesh.position.set(0, 0, -12);
    group.add(vortexMesh);
  }

  // 3. MFine Healthcare Claims Flow (2.5D High-Tech B2B Hospital Console)
  private buildMFineProp(group: THREE.Group): void {
    // Main Console Canvas: 320x240
    const mainTex = create2DPixelTexture(320, 240, (ctx) => {
      // 1. Dark silhouette chassis
      ctx.fillStyle = PIXEL_PALETTE_24.inkBlack;
      ctx.fillRect(0, 0, 320, 240);

      // 2. Bevelled graphite/slate outer frame
      ctx.fillStyle = "#141A24";
      ctx.fillRect(2, 2, 316, 236);

      // Light catchers (top & left) and shadow edges (bottom & right)
      ctx.fillStyle = "#2D3848";
      ctx.fillRect(2, 2, 316, 2);
      ctx.fillRect(2, 2, 2, 236);
      ctx.fillStyle = "#0A0D14";
      ctx.fillRect(2, 236, 316, 2);
      ctx.fillRect(316, 2, 2, 236);

      // 3. Top Console Header Bar
      ctx.fillStyle = "#0B2626";
      ctx.fillRect(8, 8, 304, 26);
      ctx.fillStyle = PIXEL_PALETTE_24.tealClinical;
      ctx.fillRect(8, 8, 304, 1);
      ctx.fillRect(8, 33, 304, 1);

      // Status indicator dot (pulsing green)
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillRect(16, 17, 8, 8);
      ctx.fillStyle = "#A7F3D0";
      ctx.fillRect(18, 19, 4, 4);

      // Header Title
      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.font = "bold 9px monospace";
      ctx.fillText("MFINE HEALTHCARE B2B // CLAIMS ENGINE", 30, 23);

      ctx.fillStyle = PIXEL_PALETTE_24.cloudMuted;
      ctx.font = "7px monospace";
      ctx.fillText("NODE #48: ONLINE", 232, 23);

      // 4. Live Claims Table Area
      ctx.fillStyle = "#080D14";
      ctx.fillRect(8, 38, 304, 88);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(8.5, 38.5, 303, 87);

      // Table Header Row
      ctx.fillStyle = "#111827";
      ctx.fillRect(9, 39, 302, 16);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 7px monospace";
      ctx.fillText("PATIENT / EMP", 16, 50);
      ctx.fillText("CORP CODE", 102, 50);
      ctx.fillText("DISBURSED", 182, 50);
      ctx.fillText("STATUS", 248, 50);

      // 3 Claim Rows
      const rows = [
        { name: "PRIYA S.", code: "BHEL-CORP", amt: "₹42,500", badge: "APPROVED", col: "#0D9488" },
        { name: "ARUN K.", code: "INFOSYS-BLR", amt: "₹18,200", badge: "DISBURSED", col: "#10B981" },
        { name: "MEERA D.", code: "TCS-GLOBAL", amt: "₹65,000", badge: "APPROVED", col: "#0D9488" },
      ];

      rows.forEach((row, i) => {
        const y = 59 + i * 22;
        // Zebra row stripe
        if (i % 2 === 1) {
          ctx.fillStyle = "#0D131D";
          ctx.fillRect(9, y - 2, 302, 20);
        }

        ctx.fillStyle = PIXEL_PALETTE_24.pureWhite;
        ctx.font = "bold 8px monospace";
        ctx.fillText(row.name, 16, y + 11);

        ctx.fillStyle = PIXEL_PALETTE_24.cloudMuted;
        ctx.fillText(row.code, 102, y + 11);

        ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
        ctx.fillText(row.amt, 182, y + 11);

        // Badge pill
        ctx.fillStyle = row.col;
        ctx.fillRect(244, y + 2, 60, 14);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 7px monospace";
        ctx.fillText(row.badge, 249, y + 12);
      });

      // 5. Sparkline Graph Panel (Processing time plummeting 48h -> 4h)
      ctx.fillStyle = "#060A10";
      ctx.fillRect(8, 130, 304, 56);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(8.5, 130.5, 303, 55);

      ctx.fillStyle = PIXEL_PALETTE_24.cyanPhosphor;
      ctx.font = "bold 7px monospace";
      ctx.fillText("PROCESSING LATENCY // BULK CLAIMS", 16, 142);

      // Sparkline grid
      ctx.strokeStyle = "#142032";
      ctx.lineWidth = 1;
      for (let gy = 148; gy <= 176; gy += 9) {
        ctx.beginPath();
        ctx.moveTo(16, gy);
        ctx.lineTo(296, gy);
        ctx.stroke();
      }

      // Sparkline line (48h high at left down to 4h at right)
      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 7px monospace";
      ctx.fillText("48h", 18, 155);

      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillText("4h [INSTANT]", 238, 178);

      // Draw line path
      ctx.strokeStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(42, 153);
      ctx.lineTo(95, 154);
      ctx.lineTo(150, 168);
      ctx.lineTo(210, 174);
      ctx.lineTo(235, 175);
      ctx.stroke();

      // Sparkline points
      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.fillRect(40, 151, 4, 4);
      ctx.fillRect(93, 152, 4, 4);
      ctx.fillRect(148, 166, 4, 4);
      ctx.fillRect(208, 172, 4, 4);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(233, 173, 5, 5); // End glowing point

      // 6. Highlight Callout Banner
      ctx.fillStyle = "#042F2E";
      ctx.fillRect(8, 190, 304, 42);
      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.fillRect(8, 190, 4, 42); // Left accent bar
      ctx.fillRect(8, 190, 304, 1);
      ctx.fillRect(8, 231, 304, 1);

      ctx.font = "bold 13px monospace";
      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.fillText("▼ -62% HR ADMIN TIME", 22, 212);

      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "#A7F3D0";
      ctx.fillText("100K DAILY HEALTH USERS • ZERO RECONCILIATION ERRORS", 22, 224);
    });
    this.createdTextures.push(mainTex);

    const mainMat = new THREE.MeshBasicMaterial({
      map: mainTex,
      side: THREE.DoubleSide,
    });
    const mainMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.15), mainMat);
    mainMesh.position.set(0, 1.4, 0);
    group.add(mainMesh);

    // Dual Satellite Screens
    // Left Screen: Network Nodes
    const leftTex = create2DPixelTexture(140, 100, (ctx) => {
      ctx.fillStyle = "#090D14";
      ctx.fillRect(0, 0, 140, 100);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(1, 1, 138, 98);

      ctx.fillStyle = PIXEL_PALETTE_24.tealClinical;
      ctx.fillRect(2, 2, 136, 18);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 7px monospace";
      ctx.fillText("HOSPITAL NODES", 8, 14);

      // Node mesh diagram
      const nodes = [
        { x: 30, y: 40, label: "APOLLO" },
        { x: 105, y: 38, label: "MANIPAL" },
        { x: 70, y: 65, label: "FORTIS" },
      ];
      ctx.strokeStyle = "#0D9488";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 40);
      ctx.lineTo(105, 38);
      ctx.lineTo(70, 65);
      ctx.closePath();
      ctx.stroke();

      for (const n of nodes) {
        ctx.fillStyle = "#10B981";
        ctx.fillRect(n.x - 3, n.y - 3, 6, 6);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "6px monospace";
        ctx.fillText(n.label, n.x - 14, n.y + 12);
      }

      ctx.fillStyle = PIXEL_PALETTE_24.mintHighlight;
      ctx.font = "6px monospace";
      ctx.fillText("LATENCY: 12ms // 48 HUBS", 10, 92);
    });
    this.createdTextures.push(leftTex);

    const leftMat = new THREE.MeshBasicMaterial({ map: leftTex, side: THREE.DoubleSide });
    const leftMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.35), leftMat);
    leftMesh.position.set(-2.6, 1.5, 0.3);
    leftMesh.rotation.y = 0.28;
    group.add(leftMesh);

    // Right Screen: Policy Rules
    const rightTex = create2DPixelTexture(140, 100, (ctx) => {
      ctx.fillStyle = "#090D14";
      ctx.fillRect(0, 0, 140, 100);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(1, 1, 138, 98);

      ctx.fillStyle = PIXEL_PALETTE_24.tealClinical;
      ctx.fillRect(2, 2, 136, 18);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 7px monospace";
      ctx.fillText("POLICY ENGINE", 8, 14);

      const rules = [
        "[✓] ICD-10 VALIDATED",
        "[✓] SUM INSURED OK",
        "[✓] CO-PAY 10% APPLIED",
        "[✓] AUTO-DISBURSED",
      ];
      ctx.font = "7px monospace";
      rules.forEach((r, idx) => {
        ctx.fillStyle = idx === 3 ? PIXEL_PALETTE_24.mintHighlight : "#94A3B8";
        ctx.fillText(r, 8, 38 + idx * 14);
      });

      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.font = "bold 6px monospace";
      ctx.fillText("ADJUDICATION: PASS", 8, 92);
    });
    this.createdTextures.push(rightTex);

    const rightMat = new THREE.MeshBasicMaterial({ map: rightTex, side: THREE.DoubleSide });
    const rightMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.35), rightMat);
    rightMesh.position.set(2.6, 1.5, 0.3);
    rightMesh.rotation.y = -0.28;
    group.add(rightMesh);

    // Dark tiled pedestal floor
    const floorGeo = new THREE.BoxGeometry(8, 0.1, 4);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x111622 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.4, 0);
    group.add(floorMesh);

    // Pedestal accent rim
    const rimGeo = new THREE.BoxGeometry(8.1, 0.02, 4.1);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x0D9488 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.set(0, -0.35, 0);
    group.add(rimMesh);

    // Animation: Sparkline glowing pulsing dot along claim line
    const pulseGeo = new THREE.PlaneGeometry(0.12, 0.12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x2DD4BF,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const pulseDot = new THREE.Mesh(pulseGeo, pulseMat);
    pulseDot.position.set(1.0, 0.85, 0.02);
    group.add(pulseDot);

    this.animatedProps.push({
      mesh: pulseDot,
      update: (t) => {
        const s = 1.0 + 0.35 * Math.sin(t * 6);
        pulseDot.scale.set(s, s, 1);
        pulseMat.opacity = 0.6 + 0.4 * Math.sin(t * 6);
      },
    });
  }

  // 4. Mosaic Wellness Habit Tracker (2.5D Mobile Streak Engine)
  private buildMosaicProp(group: THREE.Group): void {
    // Phone screen texture: 200x360
    const phoneTex = create2DPixelTexture(200, 360, (ctx) => {
      // 1. Phone outer bezel
      ctx.fillStyle = "#121721";
      ctx.fillRect(0, 0, 200, 360);

      // Bezel corners rounded styling
      ctx.fillStyle = "#0A0D14";
      ctx.fillRect(0, 0, 8, 8);
      ctx.fillRect(192, 0, 8, 8);
      ctx.fillRect(0, 352, 8, 8);
      ctx.fillRect(192, 352, 8, 8);

      // Top speaker notch & front camera
      ctx.fillStyle = "#222938";
      ctx.fillRect(75, 8, 50, 4);
      ctx.fillStyle = "#1E2533";
      ctx.fillRect(60, 8, 4, 4); // camera dot

      // 2. Active Screen Area
      ctx.fillStyle = "#0A0F17";
      ctx.fillRect(8, 22, 184, 326);

      // Status Bar
      ctx.fillStyle = "#64748B";
      ctx.font = "bold 7px monospace";
      ctx.fillText("09:41", 16, 34);
      ctx.fillText("5G 100%", 150, 34);

      // Header Tag & Title
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillRect(16, 42, 6, 6);
      ctx.font = "bold 8px monospace";
      ctx.fillText("MAN MATTERS", 26, 48);

      ctx.fillStyle = PIXEL_PALETTE_24.pureWhite;
      ctx.font = "bold 10px monospace";
      ctx.fillText("DAILY RITUAL TRACKER", 16, 64);

      // 3. Circular Progress Ring (Streak Display)
      const cx = 100;
      const cy = 118;
      const r = 38;

      // Dark track ring
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Progress active ring (approx 85% full)
      ctx.strokeStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI * 1.3);
      ctx.stroke();

      // Flame pixel art icon inside ring
      const fx = cx - 5;
      const fy = cy - 26;
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(fx + 2, fy, 6, 8);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(fx + 1, fy + 4, 8, 8);
      ctx.fillStyle = "#FCD34D";
      ctx.fillRect(fx + 3, fy + 6, 4, 5);

      // Center streak text
      ctx.fillStyle = PIXEL_PALETTE_24.pureWhite;
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("28", cx, cy + 8);

      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.font = "bold 7px monospace";
      ctx.fillText("DAYS STREAK", cx, cy + 20);
      ctx.textAlign = "left";

      // 4. 4x7 Calendar Dot Matrix
      ctx.fillStyle = "#111827";
      ctx.fillRect(16, 172, 168, 82);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(16.5, 172.5, 167, 81);

      // Days labels
      const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
      ctx.fillStyle = "#64748B";
      ctx.font = "bold 7px monospace";
      dayNames.forEach((d, idx) => {
        ctx.fillText(d, 26 + idx * 22, 185);
      });

      // 4 rows x 7 days
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          const dx = 24 + col * 22;
          const dy = 192 + row * 14;
          const isStreak = !(row === 3 && col > 4); // 26 of 28 completed

          if (isStreak) {
            ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
            ctx.fillRect(dx, dy, 14, 10);
            ctx.fillStyle = "#A7F3D0";
            ctx.fillRect(dx + 4, dy + 3, 6, 4); // Center shine
          } else {
            ctx.fillStyle = "#1E293B";
            ctx.fillRect(dx, dy, 14, 10);
          }
        }
      }

      // 5. Metric Outcome Card
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(16, 264, 168, 54);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillRect(16, 264, 4, 54); // Green accent
      ctx.fillRect(16, 264, 168, 1);
      ctx.fillRect(16, 317, 168, 1);

      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("▲ +44% RETENTION", 26, 284);

      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "#A7F3D0";
      ctx.fillText("DAY 14 COHORT CONVERSION", 26, 298);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillText("DELAYED-OUTCOME HEALTH", 26, 309);

      // Home Indicator
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(70, 340, 60, 3);
    });
    this.createdTextures.push(phoneTex);

    const phoneMat = new THREE.MeshBasicMaterial({
      map: phoneTex,
      side: THREE.DoubleSide,
    });
    const phoneMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.68), phoneMat);
    phoneMesh.position.set(0, 1.5, 0);
    group.add(phoneMesh);

    // Floating Badge 1: Hair Tracker V1
    const badge1Tex = create2DPixelTexture(120, 80, (ctx) => {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 120, 80);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.strokeRect(1, 1, 118, 78);

      // Tonic bottle sprite
      ctx.fillStyle = "#10B981";
      ctx.fillRect(14, 25, 12, 28);
      ctx.fillStyle = "#34D399";
      ctx.fillRect(18, 18, 4, 7);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 7px monospace";
      ctx.fillText("HAIR TRACKER V1", 34, 32);

      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.font = "bold 8px monospace";
      ctx.fillText("DAY 90 READY", 34, 46);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "6px monospace";
      ctx.fillText("CLINICAL REGIMEN", 34, 60);
    });
    this.createdTextures.push(badge1Tex);

    const badge1Mat = new THREE.MeshBasicMaterial({ map: badge1Tex, side: THREE.DoubleSide });
    const badge1Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), badge1Mat);
    badge1Mesh.position.set(-1.8, 2.2, 0.4);
    group.add(badge1Mesh);

    // Floating Badge 2: Streak Master
    const badge2Tex = create2DPixelTexture(120, 80, (ctx) => {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 120, 80);
      ctx.fillStyle = PIXEL_PALETTE_24.amberWarning;
      ctx.strokeRect(1, 1, 118, 78);

      // Gold Trophy Sprite
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(14, 22, 14, 10);
      ctx.fillRect(18, 32, 6, 12);
      ctx.fillRect(12, 44, 18, 4);
      ctx.fillStyle = "#FDE047";
      ctx.fillRect(16, 24, 10, 6);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 7px monospace";
      ctx.fillText("STREAK MASTER", 36, 32);

      ctx.fillStyle = PIXEL_PALETTE_24.amberWarning;
      ctx.font = "bold 8px monospace";
      ctx.fillText("28D UNBROKEN", 36, 46);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "6px monospace";
      ctx.fillText("TOP 1% COHORT", 36, 60);
    });
    this.createdTextures.push(badge2Tex);

    const badge2Mat = new THREE.MeshBasicMaterial({ map: badge2Tex, side: THREE.DoubleSide });
    const badge2Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), badge2Mat);
    badge2Mesh.position.set(1.8, 1.0, 0.4);
    group.add(badge2Mesh);

    // Dark pedestal floor
    const floorGeo = new THREE.BoxGeometry(6, 0.1, 3.5);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x111622 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.4, 0);
    group.add(floorMesh);

    // Animation: Badges bob up and down
    this.animatedProps.push({
      mesh: badge1Mesh,
      update: (t) => {
        badge1Mesh.position.y = 2.2 + Math.sin(t * 2.2) * 0.08;
        badge1Mesh.rotation.z = Math.sin(t * 1.5) * 0.03;
      },
    });

    this.animatedProps.push({
      mesh: badge2Mesh,
      update: (t) => {
        badge2Mesh.position.y = 1.0 + Math.cos(t * 2.2) * 0.08;
        badge2Mesh.rotation.z = -Math.sin(t * 1.5) * 0.03;
      },
    });
  }

  // 5. Quiet Year (3D Voxel Environment: Mossy Stone, Wood Bench, Voxel Pines & Glowing Lantern)
  private buildQuietProp(group: THREE.Group): void {
    // 1. Mossy stone platform: BoxGeometry(7, 0.3, 4) at y = -0.4
    const stoneTex = create2DPixelTexture(128, 128, (ctx) => {
      // Base weathered stone
      ctx.fillStyle = "#333D4B";
      ctx.fillRect(0, 0, 128, 128);

      // Stone grid blocks
      ctx.strokeStyle = "#252D37";
      ctx.lineWidth = 2;
      for (let x = 0; x < 128; x += 32) {
        for (let y = 0; y < 128; y += 32) {
          ctx.strokeRect(x, y, 32, 32);
        }
      }

      // Clumps of moss in earthy greens
      const mossPatches = [
        [12, 14, 18, 12], [48, 8, 14, 16], [82, 38, 22, 14],
        [20, 68, 16, 18], [55, 80, 24, 16], [90, 95, 20, 15],
        [4, 105, 12, 12], [98, 10, 16, 12]
      ];
      for (const [mx, my, mw, mh] of mossPatches) {
        ctx.fillStyle = "#2D5A3A";
        ctx.fillRect(mx, my, mw, mh);
        ctx.fillStyle = "#4B7C59";
        ctx.fillRect(mx + 2, my + 2, mw - 4, mh - 4);
      }

      // Autumn fallen leaves
      const leaves: [number, number, string][] = [
        [35, 45, "#C86446"], [70, 25, "#D4A373"], [110, 60, "#B45309"],
        [45, 115, "#C86446"], [85, 75, "#D4A373"], [15, 90, "#B45309"]
      ];
      for (const [lx, ly, col] of leaves) {
        ctx.fillStyle = col;
        ctx.fillRect(lx, ly, 4, 3);
      }
    });
    this.createdTextures.push(stoneTex);

    const stoneMat = new THREE.MeshBasicMaterial({ map: stoneTex });
    const stonePlatform = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 4), stoneMat);
    stonePlatform.position.set(0, -0.4, 0);
    group.add(stonePlatform);

    // 2. Pixel Wood Bench at (0, 0.4, 0)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 0.4, 0);

    const woodMat = new THREE.MeshBasicMaterial({ color: 0x8C5228 });
    const woodLightMat = new THREE.MeshBasicMaterial({ color: 0xB46835 });
    const legMat = new THREE.MeshBasicMaterial({ color: 0x3F2212 });

    // Seat plank
    const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.7), woodLightMat);
    seatMesh.position.set(0, -0.05, 0);
    benchGroup.add(seatMesh);

    // Backrest plank
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.08), woodMat);
    backMesh.position.set(0, 0.25, -0.3);
    benchGroup.add(backMesh);

    // Bench legs (4 legs)
    const legGeo = new THREE.BoxGeometry(0.1, 0.45, 0.1);
    const legPositions = [
      [-0.95, -0.3, -0.25],
      [0.95, -0.3, -0.25],
      [-0.95, -0.3, 0.25],
      [0.95, -0.3, 0.25],
    ];
    for (const [lx, ly, lz] of legPositions) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      benchGroup.add(leg);
    }
    group.add(benchGroup);

    // 3. Helper to build stepped voxel pine tree
    const createVoxelPine = (x: number, y: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, y, z);
      tree.scale.set(scale, scale, scale);

      // Trunk
      const trunkMat = new THREE.MeshBasicMaterial({ color: 0x5C2E15 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.4, 8), trunkMat);
      trunk.position.set(0, 0.7, 0);
      tree.add(trunk);

      // Stepped foliage tiers (deep pine green layers)
      const tiers = [
        { w: 2.2, h: 0.5, y: 1.3, col: 0x1E3A2B },
        { w: 1.7, h: 0.5, y: 1.7, col: 0x244B36 },
        { w: 1.2, h: 0.5, y: 2.1, col: 0x2D5A3A },
        { w: 0.7, h: 0.5, y: 2.5, col: 0x3E7B52 },
        { w: 0.35, h: 0.35, y: 2.85, col: 0x4B7C59 },
      ];

      tiers.forEach((t) => {
        const tierMat = new THREE.MeshBasicMaterial({ color: t.col });
        const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.w), tierMat);
        tierMesh.position.set(0, t.y, 0);
        tree.add(tierMesh);
      });

      return tree;
    };

    // Pine 1 at (-2.4, 0, -0.8)
    const pine1 = createVoxelPine(-2.4, 0, -0.8, 1.05);
    group.add(pine1);

    // Pine 2 at (2.5, 0, -0.6)
    const pine2 = createVoxelPine(2.5, 0, -0.6, 1.15);
    group.add(pine2);

    // 4. Warm Glowing Lantern
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(1.2, 0.4, 0.3);

    // Lantern post
    const postMat = new THREE.MeshBasicMaterial({ color: 0x1F2937 });
    const postMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.1, 8), postMat);
    postMesh.position.set(0, 0.35, 0);
    lanternGroup.add(postMesh);

    // Lantern frame housing
    const lampMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const lampHousing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.25), lampMat);
    lampHousing.position.set(0, 0.95, 0);
    lanternGroup.add(lampHousing);

    // Amber glowing light plane
    const glowTex = create2DPixelTexture(64, 64, (ctx) => {
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, "#FEF3C7");
      grad.addColorStop(0.3, "#F59E0B");
      grad.addColorStop(0.7, "rgba(245, 158, 11, 0.3)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    });
    this.createdTextures.push(glowTex);

    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), glowMat);
    glowPlane.position.set(0, 0.4, 0.05);
    lanternGroup.add(glowPlane);
    group.add(lanternGroup);

    // 5. Inscribed Stone Sign
    const signTex = create2DPixelTexture(140, 70, (ctx) => {
      ctx.fillStyle = "#2D3748";
      ctx.fillRect(0, 0, 140, 70);
      ctx.fillStyle = "#1A202C";
      ctx.strokeRect(1, 1, 138, 68);

      ctx.fillStyle = PIXEL_PALETTE_24.paperWarm;
      ctx.font = "italic bold 8px serif";
      ctx.fillText("Quiet Year // 2023", 12, 22);

      ctx.font = "7px monospace";
      ctx.fillStyle = "#A0AEC0";
      ctx.fillText("Hills of reflection.", 12, 38);
      ctx.fillText("Reading, walking, unlearning.", 12, 52);
    });
    this.createdTextures.push(signTex);

    const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), signMat);
    signMesh.position.set(-1.1, 0.15, 0.9);
    signMesh.rotation.x = -0.3;
    group.add(signMesh);

    // Animation: Lantern glow flickers subtly
    this.animatedProps.push({
      mesh: glowPlane,
      update: (t) => {
        glowMat.opacity = 0.85 + 0.15 * Math.sin(t * 8);
      },
    });
  }

  // 6. Grassroots Fieldwork (2.5D Bamboo Pavilion & Cognitive Lab Matrix)
  private buildFieldProp(group: THREE.Group): void {
    // 1. Terracotta plateau ground: BoxGeometry(7.5, 0.25, 4.5) at y = -0.4
    const groundTex = create2DPixelTexture(128, 128, (ctx) => {
      ctx.fillStyle = "#B8583B";
      ctx.fillRect(0, 0, 128, 128);

      // Earth clay cracks and dry grass streaks
      ctx.fillStyle = "#9C4329";
      for (let i = 0; i < 128; i += 16) {
        ctx.fillRect(i, (i * 3) % 128, 8, 4);
      }
      ctx.fillStyle = "#D4A373";
      for (let j = 0; j < 128; j += 24) {
        ctx.fillRect((j * 7) % 128, j, 6, 2);
      }
    });
    this.createdTextures.push(groundTex);

    const groundMat = new THREE.MeshBasicMaterial({ map: groundTex });
    const groundMesh = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.25, 4.5), groundMat);
    groundMesh.position.set(0, -0.4, 0);
    group.add(groundMesh);

    // 2. Bamboo Pavilion Structure
    const bambooMat = new THREE.MeshBasicMaterial({ color: 0xD4A373 });
    const jointMat = new THREE.MeshBasicMaterial({ color: 0x78350F });

    // 4 vertical bamboo poles
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
    const polePositions = [
      [-2.3, 1.2, -1.5],
      [2.3, 1.2, -1.5],
      [-2.3, 1.2, 1.5],
      [2.3, 1.2, 1.5],
    ];

    for (const [px, py, pz] of polePositions) {
      const pole = new THREE.Mesh(poleGeo, bambooMat);
      pole.position.set(px, py, pz);
      group.add(pole);

      // Bamboo joint ring rings
      for (let r = 0; r < 4; r++) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 8), jointMat);
        ring.position.set(px, 0.2 + r * 0.7, pz);
        group.add(ring);
      }
    }

    // Horizontal bamboo roof rafters at y = 2.8
    // Front and back along X (length 4.8)
    const beamGeoX = new THREE.CylinderGeometry(0.07, 0.07, 4.8, 8);
    const beamFront = new THREE.Mesh(beamGeoX, bambooMat);
    beamFront.rotation.z = Math.PI / 2;
    beamFront.position.set(0, 2.8, 1.5);
    group.add(beamFront);

    const beamBack = new THREE.Mesh(beamGeoX, bambooMat);
    beamBack.rotation.z = Math.PI / 2;
    beamBack.position.set(0, 2.8, -1.5);
    group.add(beamBack);

    // Left and right along Z (length 3.2)
    const beamGeoZ = new THREE.CylinderGeometry(0.07, 0.07, 3.2, 8);
    const beamLeft = new THREE.Mesh(beamGeoZ, bambooMat);
    beamLeft.rotation.x = Math.PI / 2;
    beamLeft.position.set(-2.3, 2.8, 0);
    group.add(beamLeft);

    const beamRight = new THREE.Mesh(beamGeoZ, bambooMat);
    beamRight.rotation.x = Math.PI / 2;
    beamRight.position.set(2.3, 2.8, 0);
    group.add(beamRight);

    // Cross roof rafters
    const rafterGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
    [-1.15, 0, 1.15].forEach((rx) => {
      const rafter = new THREE.Mesh(rafterGeo, bambooMat);
      rafter.rotation.x = Math.PI / 2;
      rafter.position.set(rx, 2.85, 0);
      group.add(rafter);
    });

    // 3. Cognitive Lab Clipboard & Matrix: 300x210 canvas
    const matrixTex = create2DPixelTexture(300, 210, (ctx) => {
      // Hardboard clipboard base
      ctx.fillStyle = "#6B3A19";
      ctx.fillRect(0, 0, 300, 210);

      // Metal clip at top
      ctx.fillStyle = "#D4A373";
      ctx.fillRect(110, 4, 80, 14);
      ctx.fillStyle = "#451A03";
      ctx.fillRect(125, 8, 50, 4);

      // Warm kraft paper sheet
      ctx.fillStyle = PIXEL_PALETTE_24.paperWarm;
      ctx.fillRect(10, 18, 280, 184);

      // Header
      ctx.fillStyle = "#78350F";
      ctx.font = "bold 9px serif";
      ctx.fillText("PROJECT POTENTIAL // AAROHI COGNITIVE LAB", 20, 36);

      ctx.fillStyle = "#A24D33";
      ctx.font = "bold 7px monospace";
      ctx.fillText("BIHAR FIELD DEPLOYMENT • 4-VECTOR DIAGNOSTIC", 20, 48);

      // Grid header
      ctx.fillStyle = "#E7DBC8";
      ctx.fillRect(20, 54, 260, 14);
      ctx.fillStyle = "#78350F";
      ctx.font = "bold 6px monospace";
      ctx.fillText("BATTERY / VECTOR", 24, 64);
      ctx.fillText("PROGRESS", 150, 64);
      ctx.fillText("MASTERY", 232, 64);

      // 4 Vector Diagnostic Rows
      const batteries = [
        { name: "V1: SPATIAL REASONING", score: "88%", fill: 9 },
        { name: "V2: NUMERICAL FLUENCY", score: "92%", fill: 10 },
        { name: "V3: VISUAL ATTENTION", score: "84%", fill: 8 },
        { name: "V4: WORKING MEMORY", score: "79%", fill: 7 },
      ];

      batteries.forEach((b, idx) => {
        const y = 73 + idx * 18;
        ctx.fillStyle = idx % 2 === 1 ? "#EFE7DA" : "#F8F3EA";
        ctx.fillRect(20, y - 2, 260, 16);

        ctx.fillStyle = "#1C1917";
        ctx.font = "bold 7px monospace";
        ctx.fillText(b.name, 24, y + 9);

        // Stepped progress blocks
        for (let blk = 0; blk < 10; blk++) {
          ctx.fillStyle = blk < b.fill ? "#2D5A3A" : "#D1C7B7";
          ctx.fillRect(150 + blk * 7, y + 2, 5, 8);
        }

        ctx.fillStyle = "#15803D";
        ctx.font = "bold 7px monospace";
        ctx.fillText(b.score, 236, y + 9);
      });

      // Field Deployment Note Banner
      ctx.fillStyle = "#ECFDF5";
      ctx.fillRect(20, 148, 260, 46);
      ctx.fillStyle = "#059669";
      ctx.fillRect(20, 148, 4, 46);
      ctx.fillRect(20, 148, 260, 1);
      ctx.fillRect(20, 193, 260, 1);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "#047857";
      ctx.fillText("● ATTENDANCE: GOOGLE SHEETS + OFFLINE SYNC", 30, 166);

      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "#065F46";
      ctx.fillText("LOW-BANDWIDTH ARCHITECTURE • ZERO DATA LOSS", 30, 180);
    });
    this.createdTextures.push(matrixTex);

    const matrixMat = new THREE.MeshBasicMaterial({
      map: matrixTex,
      side: THREE.DoubleSide,
    });
    const matrixMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.8), matrixMat);
    matrixMesh.position.set(0, 1.4, 0);
    group.add(matrixMesh);

    // Animation: sync indicator pulse on clipboard
    const syncDotGeo = new THREE.PlaneGeometry(0.1, 0.1);
    const syncDotMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const syncDot = new THREE.Mesh(syncDotGeo, syncDotMat);
    syncDot.position.set(-1.42, 0.88, 0.02);
    group.add(syncDot);

    this.animatedProps.push({
      mesh: syncDot,
      update: (t) => {
        syncDotMat.opacity = 0.5 + 0.5 * Math.sin(t * 5);
      },
    });
  }

  // 7. Independent Studio (2.5D Dual Ultra-wide Workstation, Code & Figma Displays, Mug & Lamp)
  private buildStudioProp(group: THREE.Group): void {
    // 1. Desk Surface: BoxGeometry(6.5, 0.15, 3.0) at y = 0.4
    const deskMat = new THREE.MeshBasicMaterial({ color: 0x1A1E27 });
    const deskMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.15, 3.0), deskMat);
    deskMesh.position.set(0, 0.4, 0);
    group.add(deskMesh);

    // Desk rim highlight
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x2D3748 });
    const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(6.54, 0.02, 3.04), rimMat);
    rimMesh.position.set(0, 0.47, 0);
    group.add(rimMesh);

    // 4 Sleek black metal desk legs
    const legGeo = new THREE.BoxGeometry(0.12, 0.9, 0.12);
    const legMat = new THREE.MeshBasicMaterial({ color: 0x0F1117 });
    const legPositions = [
      [-3.0, -0.05, -1.3],
      [3.0, -0.05, -1.3],
      [-3.0, -0.05, 1.3],
      [3.0, -0.05, 1.3],
    ];
    for (const [lx, ly, lz] of legPositions) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    }

    // 2. Left Monitor: Code Editor Canvas (VS Code Aesthetic 250x160)
    const codeTex = create2DPixelTexture(250, 160, (ctx) => {
      // Editor background
      ctx.fillStyle = "#0D1117";
      ctx.fillRect(0, 0, 250, 160);

      // Window title bar with dots
      ctx.fillStyle = "#161B22";
      ctx.fillRect(0, 0, 250, 16);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(6, 5, 5, 5);
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(14, 5, 5, 5);
      ctx.fillStyle = "#10B981";
      ctx.fillRect(22, 5, 5, 5);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 7px monospace";
      ctx.fillText("INVENIX // orchestrator.ts", 36, 11);

      // Left sidebar
      ctx.fillStyle = "#111620";
      ctx.fillRect(0, 16, 32, 144);
      ctx.fillStyle = "#4B5563";
      ctx.fillRect(6, 24, 20, 2);
      ctx.fillRect(6, 30, 16, 2);
      ctx.fillRect(6, 36, 18, 2);
      ctx.fillRect(6, 42, 14, 2);

      // Code lines
      const codeLines = [
        { num: "01", text: "import { Engine } from '@invenix/core';", col: "#8B5CF6" },
        { num: "02", text: "export async function deployAgent(cfg) {", col: "#38BDF8" },
        { num: "03", text: "  const session = await Engine.init(cfg);", col: "#FAF7F2" },
        { num: "04", text: "  const stream = await session.stream();", col: "#FAF7F2" },
        { num: "05", text: "  return { status: 200, stream };", col: "#2DD4BF" },
        { num: "06", text: "}", col: "#38BDF8" },
      ];

      codeLines.forEach((line, i) => {
        const y = 32 + i * 13;
        ctx.fillStyle = "#475569";
        ctx.font = "7px monospace";
        ctx.fillText(line.num, 38, y);

        ctx.fillStyle = line.col;
        ctx.fillText(line.text, 54, y);
      });

      // Terminal drawer at bottom
      ctx.fillStyle = "#080C14";
      ctx.fillRect(32, 114, 218, 46);
      ctx.fillStyle = "#1E293B";
      ctx.strokeRect(32.5, 114.5, 217, 45);

      ctx.fillStyle = "#10B981";
      ctx.font = "bold 7px monospace";
      ctx.fillText("✓ BUILD PASSING • 48 TESTS GREEN [0.4s]", 38, 128);

      ctx.fillStyle = "#38BDF8";
      ctx.fillText("DEPLOYED TO PRODUCTION // LATENCY: 42ms", 38, 142);
    });
    this.createdTextures.push(codeTex);

    const codeMat = new THREE.MeshBasicMaterial({ map: codeTex, side: THREE.DoubleSide });
    const leftMonitor = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.6), codeMat);
    leftMonitor.position.set(-1.45, 1.35, 0);
    leftMonitor.rotation.y = 0.18;
    group.add(leftMonitor);

    // Left monitor stand
    const standMat = new THREE.MeshBasicMaterial({ color: 0x2A303C });
    const leftStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.7, 8), standMat);
    leftStand.position.set(-1.45, 0.8, -0.05);
    group.add(leftStand);

    // 3. Right Monitor: Design Editor Canvas (Figma Aesthetic 250x160)
    const figmaTex = create2DPixelTexture(250, 160, (ctx) => {
      // Dark graphite design workspace
      ctx.fillStyle = "#181D26";
      ctx.fillRect(0, 0, 250, 160);

      // Figma toolbar
      ctx.fillStyle = "#222734";
      ctx.fillRect(0, 0, 250, 16);
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(6, 4, 8, 8); // selection tool
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(18, 4, 8, 8); // frame tool
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(30, 4, 8, 8); // pen tool

      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "#FAF7F2";
      ctx.fillText("Invenix Design System // Landing UI", 48, 11);

      // Dotted alignment grid on canvas
      ctx.fillStyle = "#283142";
      for (let gx = 10; gx < 190; gx += 16) {
        for (let gy = 24; gy < 150; gy += 16) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Wireframe layout card
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(24, 28, 150, 116);
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(32, 36, 60, 8); // Heading wireframe

      // 3 feature boxes wireframe
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(32, 52, 38, 40);
      ctx.fillRect(78, 52, 38, 40);
      ctx.fillRect(124, 52, 38, 40);

      // Primary CTA button in cyan
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(32, 102, 54, 14);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 6px monospace";
      ctx.fillText("GET STARTED", 36, 112);

      // Vector pen path with bezier anchor diamond
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(32, 128);
      ctx.quadraticCurveTo(80, 140, 150, 124);
      ctx.stroke();

      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(78, 132, 6, 6); // Selected anchor point

      // Right properties panel
      ctx.fillStyle = "#1F2532";
      ctx.fillRect(190, 16, 60, 144);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 6px monospace";
      ctx.fillText("PROPERTIES", 196, 28);
      ctx.fillText("W: 1440", 196, 44);
      ctx.fillText("H: 900", 196, 56);
      ctx.fillText("FILL: #FAF7F2", 196, 70);
      ctx.fillText("RADIUS: 8px", 196, 84);
    });
    this.createdTextures.push(figmaTex);

    const figmaMat = new THREE.MeshBasicMaterial({ map: figmaTex, side: THREE.DoubleSide });
    const rightMonitor = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.6), figmaMat);
    rightMonitor.position.set(1.45, 1.35, 0);
    rightMonitor.rotation.y = -0.18;
    group.add(rightMonitor);

    // Right monitor stand
    const rightStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.7, 8), standMat);
    rightStand.position.set(1.45, 0.8, -0.05);
    group.add(rightStand);

    // 4. Studio Desk Props: Ceramic Coffee Mug with Pixel Steam
    const mugMat = new THREE.MeshBasicMaterial({ color: 0xC86446 });
    const mugMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 12), mugMat);
    mugMesh.position.set(-2.4, 0.58, 0.5);
    group.add(mugMesh);

    // Pixel Steam Plane
    const steamTex = create2DPixelTexture(32, 64, (ctx) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      const steamPixels = [
        [14, 50], [16, 46], [18, 42], [14, 36], [12, 30],
        [16, 24], [18, 18], [14, 12], [16, 6],
      ];
      for (const [sx, sy] of steamPixels) {
        ctx.fillRect(sx, sy, 3, 3);
      }
    });
    this.createdTextures.push(steamTex);

    const steamMat = new THREE.MeshBasicMaterial({
      map: steamTex,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const steamMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.48), steamMat);
    steamMesh.position.set(-2.4, 0.85, 0.5);
    group.add(steamMesh);

    // 5. Studio Desk Lamp with warm amber glow
    const lampMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 12), lampMat);
    lampBase.position.set(2.4, 0.49, 0.3);
    group.add(lampBase);

    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), lampMat);
    lampPole.position.set(2.4, 0.78, 0.3);
    group.add(lampPole);

    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 8), lampMat);
    lampHead.rotation.x = Math.PI / 4;
    lampHead.position.set(2.4, 1.05, 0.4);
    group.add(lampHead);

    // Amber illumination plane on desk
    const lampGlowTex = create2DPixelTexture(64, 64, (ctx) => {
      const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.45)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    });
    this.createdTextures.push(lampGlowTex);

    const lampGlowMat = new THREE.MeshBasicMaterial({
      map: lampGlowTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const lampGlowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), lampGlowMat);
    lampGlowMesh.rotation.x = -Math.PI / 2;
    lampGlowMesh.position.set(2.2, 0.48, 0.5);
    group.add(lampGlowMesh);

    // Animation: Coffee steam floats gently upward and wraps
    this.animatedProps.push({
      mesh: steamMesh,
      update: (t) => {
        const progress = (t * 0.3) % 0.35;
        steamMesh.position.y = 0.8 + progress;
        steamMat.opacity = Math.sin((progress / 0.35) * Math.PI) * 0.85;
      },
    });
  }

  // 8. Personal Builds (2.5D Showcase Trio in Arc: Pixel Studio, JANEVAL AI, AdityaOS)
  private buildBuildsProp(group: THREE.Group): void {
    // 1. Left Card: Pixel Studio at (-2.7, 1.4, 0) rotated Y = 0.2
    const pixelTex = create2DPixelTexture(220, 280, (ctx) => {
      // Chassis
      ctx.fillStyle = "#12151D";
      ctx.fillRect(0, 0, 220, 280);
      ctx.fillStyle = PIXEL_PALETTE_24.neonViolet;
      ctx.strokeRect(1, 1, 218, 278);

      // Header
      ctx.fillStyle = "#22193A";
      ctx.fillRect(4, 4, 212, 28);
      ctx.fillStyle = PIXEL_PALETTE_24.neonViolet;
      ctx.fillRect(10, 10, 16, 16);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px monospace";
      ctx.fillText("PIXEL STUDIO", 32, 21);

      ctx.fillStyle = "#C4B5FD";
      ctx.font = "6px monospace";
      ctx.fillText("IN-BROWSER SPRITE ENGINE", 32, 29);

      // Color Palette Swatches row
      const swatches = [
        "#EF4444", "#F59E0B", "#FCD34D", "#10B981",
        "#06B6D4", "#3B82F6", "#8B5CF6", "#FAF7F2",
      ];
      swatches.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.fillRect(12 + idx * 24, 38, 18, 12);
        ctx.strokeStyle = idx === 3 ? "#FFFFFF" : "#000000";
        ctx.strokeRect(12 + idx * 24, 38, 18, 12);
      });

      // 16x16 Pixel Drawing Grid with Cute Pixel Mascot Character
      ctx.fillStyle = "#0A0D14";
      ctx.fillRect(20, 56, 180, 160);
      ctx.strokeStyle = "#1A2234";
      ctx.strokeRect(20.5, 56.5, 179, 159);

      // Mascot sprite pixels (chunky wizard/cyber adventurer)
      const pxBaseX = 76;
      const pxBaseY = 80;
      const p = (ox: number, oy: number, col: string, w = 6, h = 6) => {
        ctx.fillStyle = col;
        ctx.fillRect(pxBaseX + ox * 6, pxBaseY + oy * 6, w, h);
      };

      // Pointy wizard hat (indigo/violet)
      p(5, 0, "#8B5CF6");
      p(4, 1, "#8B5CF6", 18);
      p(3, 2, "#6366F1", 30);
      p(2, 3, "#4338CA", 42);
      p(1, 4, "#FCD34D", 54); // Gold hat ribbon

      // Face
      p(2, 5, "#FED7AA", 42);
      p(3, 6, "#1E1B4B"); // Left eye
      p(7, 6, "#1E1B4B"); // Right eye
      p(5, 7, "#F43F5E", 12); // Smile

      // Robe body
      p(2, 8, "#6366F1", 42);
      p(1, 9, "#4338CA", 54);
      p(1, 10, "#4338CA", 54);
      p(1, 11, "#312E81", 54);

      // Star Wand
      p(11, 6, "#F59E0B", 12, 12); // Star head
      p(11, 8, "#D4A373", 6, 24); // Wand handle
      p(12, 7, "#FFFFFF", 6, 6); // Star glow center

      // Boots & Shadow
      p(2, 12, "#78350F", 18);
      p(6, 12, "#78350F", 18);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(pxBaseX + 6, pxBaseY + 13 * 6, 54, 4);

      // Tool icons row at bottom
      ctx.fillStyle = "#1E2536";
      ctx.fillRect(20, 222, 180, 20);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 7px monospace";
      ctx.fillText("[PEN]  [FILL]  [PICK]  [LAYER]", 28, 235);

      // Callout footer
      ctx.fillStyle = "#2E1065";
      ctx.fillRect(4, 248, 212, 28);
      ctx.fillStyle = "#A78BFA";
      ctx.font = "bold 7px monospace";
      ctx.fillText("60FPS CANVAS • ZERO DEPENDENCIES", 12, 265);
    });
    this.createdTextures.push(pixelTex);

    const pixelMat = new THREE.MeshBasicMaterial({ map: pixelTex, side: THREE.DoubleSide });
    const pixelCard = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.92), pixelMat);
    pixelCard.position.set(-2.7, 1.4, 0);
    pixelCard.rotation.y = 0.2;
    group.add(pixelCard);

    // 2. Center Card: JANEVAL AI Benchmark at (0, 1.55, 0.4) scale 1.1
    const evalTex = create2DPixelTexture(220, 280, (ctx) => {
      // Deep obsidian chassis
      ctx.fillStyle = "#0A0F17";
      ctx.fillRect(0, 0, 220, 280);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.strokeRect(1, 1, 218, 278);

      // Header
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(4, 4, 212, 28);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillRect(10, 10, 16, 16);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 9px monospace";
      ctx.fillText("JANEVAL AI", 32, 21);

      ctx.fillStyle = "#A7F3D0";
      ctx.font = "6px monospace";
      ctx.fillText("FRONTIER BENCHMARK ENGINE", 32, 29);

      // Neural Network Graph Visual (y: 38 to 110)
      ctx.fillStyle = "#061A14";
      ctx.fillRect(12, 38, 196, 74);
      ctx.strokeStyle = "#10B981";
      ctx.strokeRect(12.5, 38.5, 195, 73);

      const layers = [
        [{ x: 30, y: 55 }, { x: 30, y: 75 }, { x: 30, y: 95 }],
        [{ x: 80, y: 48 }, { x: 80, y: 66 }, { x: 80, y: 84 }, { x: 80, y: 102 }],
        [{ x: 135, y: 48 }, { x: 135, y: 66 }, { x: 135, y: 84 }, { x: 135, y: 102 }],
        [{ x: 185, y: 62 }, { x: 185, y: 88 }],
      ];

      // Synapse connections
      ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      ctx.lineWidth = 1;
      for (let l = 0; l < layers.length - 1; l++) {
        for (const n1 of layers[l]) {
          for (const n2 of layers[l + 1]) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const layer of layers) {
        for (const n of layer) {
          ctx.fillStyle = "#10B981";
          ctx.fillRect(n.x - 3, n.y - 3, 6, 6);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(n.x - 1, n.y - 1, 2, 2);
        }
      }

      // Latency metric row (y: 118 to 154)
      ctx.fillStyle = "#0F281E";
      ctx.fillRect(12, 118, 196, 38);
      ctx.fillStyle = "#34D399";
      ctx.font = "bold 7px monospace";
      ctx.fillText("EVALUATION HARNESS // REASONING", 18, 131);

      ctx.fillStyle = "#A7F3D0";
      ctx.fillText("P95 LATENCY: 180ms  •  50K TESTS", 18, 145);

      // Huge Headline Stat Card (y: 162 to 240)
      ctx.fillStyle = "#042F2E";
      ctx.fillRect(12, 162, 196, 78);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillRect(12, 162, 4, 78);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px monospace";
      ctx.fillText("94.2%", 24, 194);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.fillText("PASS@1 ACCURACY", 24, 212);

      ctx.font = "6px monospace";
      ctx.fillStyle = "#A7F3D0";
      ctx.fillText("AUTONOMOUS AGENT BENCHMARK", 24, 226);

      // Footer
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(4, 248, 212, 28);
      ctx.fillStyle = "#6EE7B7";
      ctx.font = "bold 7px monospace";
      ctx.fillText("BENCHMARK ENGINE // SHIPPED 2025", 12, 265);
    });
    this.createdTextures.push(evalTex);

    const evalMat = new THREE.MeshBasicMaterial({ map: evalTex, side: THREE.DoubleSide });
    const evalCard = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.05), evalMat);
    evalCard.scale.set(1.1, 1.1, 1.1);
    evalCard.position.set(0, 1.55, 0.4);
    group.add(evalCard);

    // 3. Right Card: AdityaOS Desktop at (2.7, 1.4, 0) rotated Y = -0.2
    const osTex = create2DPixelTexture(220, 280, (ctx) => {
      // Paper tone background
      ctx.fillStyle = PIXEL_PALETTE_24.paperTone;
      ctx.fillRect(0, 0, 220, 280);
      ctx.fillStyle = "#3D4457";
      ctx.strokeRect(1, 1, 218, 278);

      // Classic Retro Window Title Bar
      ctx.fillStyle = "#3D4457";
      ctx.fillRect(4, 4, 212, 20);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 8px serif";
      ctx.fillText("ADITYA_OS // DESKTOP v2.4", 12, 17);

      // Window controls
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(185, 8, 8, 8);
      ctx.fillRect(198, 8, 8, 8);

      // Tiling Window Manager Layout (y: 30 to 220)
      // Left Sub-Window: Terminal
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(10, 30, 96, 185);
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(10, 30, 96, 12);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "6px monospace";
      ctx.fillText("term // zsh", 14, 39);

      ctx.fillStyle = "#10B981";
      ctx.fillText("aditya@os:~$", 14, 54);
      ctx.fillStyle = "#FAF7F2";
      ctx.fillText("run build", 14, 66);
      ctx.fillStyle = "#38BDF8";
      ctx.fillText("3D journey: OK", 14, 78);
      ctx.fillText("VFS indexed: OK", 14, 90);
      ctx.fillText("Desktop ready.", 14, 102);

      // Right Upper Sub-Window: Markdown Note
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(112, 30, 98, 92);
      ctx.fillStyle = "#E2D9CC";
      ctx.fillRect(112, 30, 98, 12);
      ctx.fillStyle = "#451A03";
      ctx.font = "bold 6px serif";
      ctx.fillText("Note // Philosophy", 116, 39);

      ctx.fillStyle = "#1C1917";
      ctx.font = "italic 7px serif";
      ctx.fillText('"Build places', 116, 55);
      ctx.fillText(' worth living in."', 116, 68);

      // Right Lower Sub-Window: Canvas preview
      ctx.fillStyle = "#1E2533";
      ctx.fillRect(112, 128, 98, 87);
      ctx.fillStyle = "#2D3748";
      ctx.fillRect(112, 128, 98, 12);
      ctx.fillStyle = "#FAF7F2";
      ctx.font = "6px monospace";
      ctx.fillText("Canvas // View", 116, 137);

      // Mini sun and mountain preview
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(150, 155, 18, 18);
      ctx.fillStyle = "#3D4457";
      ctx.beginPath();
      ctx.moveTo(116, 205);
      ctx.lineTo(145, 175);
      ctx.lineTo(175, 205);
      ctx.fill();

      // Bottom taskbar preview
      ctx.fillStyle = "#E5DCCE";
      ctx.fillRect(10, 222, 200, 18);
      ctx.fillStyle = "#3D4457";
      ctx.font = "bold 7px monospace";
      ctx.fillText("START  |  [T]  [P]  [N]  12:00", 18, 234);

      // Callout footer
      ctx.fillStyle = "#3D4457";
      ctx.fillRect(4, 248, 212, 28);
      ctx.fillStyle = "#FAF7F2";
      ctx.font = "bold 8px monospace";
      ctx.fillText("A FULL WEB OPERATING SYSTEM", 14, 265);
    });
    this.createdTextures.push(osTex);

    const osMat = new THREE.MeshBasicMaterial({ map: osTex, side: THREE.DoubleSide });
    const osCard = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.92), osMat);
    osCard.position.set(2.7, 1.4, 0);
    osCard.rotation.y = -0.2;
    group.add(osCard);

    // Floor pedestal: BoxGeometry(8, 0.1, 3.5) at y = -0.4
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x111622 });
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 3.5), floorMat);
    floorMesh.position.set(0, -0.4, 0);
    group.add(floorMesh);

    // Animation: The trio gently float with staggered sine waves
    this.animatedProps.push({
      mesh: pixelCard,
      update: (t) => {
        pixelCard.position.y = 1.4 + Math.sin(t * 1.2) * 0.08;
        pixelCard.rotation.z = Math.sin(t * 1.0) * 0.02;
      },
    });

    this.animatedProps.push({
      mesh: evalCard,
      update: (t) => {
        evalCard.position.y = 1.55 + Math.sin(t * 1.2 + 1.2) * 0.1;
        evalCard.rotation.z = Math.sin(t * 1.0 + 1.0) * 0.02;
      },
    });

    this.animatedProps.push({
      mesh: osCard,
      update: (t) => {
        osCard.position.y = 1.4 + Math.sin(t * 1.2 + 2.4) * 0.08;
        osCard.rotation.z = Math.sin(t * 1.0 + 2.0) * 0.02;
      },
    });
  }

  // 9. Landing Station (Grand Gateway to AdityaOS Desktop)
  private buildLandingProp(group: THREE.Group): void {
    // 1. Cinema Monitor Frame: BoxGeometry(6.8, 4.2, 0.2) at (0, 1.2, 0)
    const monitorFrameMat = new THREE.MeshBasicMaterial({ color: 0x161922 });
    const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(6.8, 4.2, 0.2), monitorFrameMat);
    monitorFrame.position.set(0, 1.2, 0);
    group.add(monitorFrame);

    // Monitor stand neck and base
    const standMat = new THREE.MeshBasicMaterial({ color: 0x2D3748 });
    const standNeck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.15), standMat);
    standNeck.position.set(0, -0.4, -0.1);
    group.add(standNeck);

    const standBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), standMat);
    standBase.position.set(0, -0.96, 0.2);
    group.add(standBase);

    // 2. High-Resolution Screen Surface: 640x360 canvas on PlaneGeometry(6.6, 4.0) at (0, 1.2, 0.11)
    const screenTex = create2DPixelTexture(640, 360, (ctx) => {
      // Wallpaper background: Warm paper tone
      ctx.fillStyle = PIXEL_PALETTE_24.paperTone;
      ctx.fillRect(0, 0, 640, 360);

      // Top Desktop Menu Bar
      ctx.fillStyle = PIXEL_PALETTE_24.paperWarm;
      ctx.fillRect(0, 0, 640, 24);
      ctx.fillStyle = "#E5DCCE";
      ctx.fillRect(0, 23, 640, 1);

      // Retro Apple/AdityaOS icon
      ctx.fillStyle = "#161922";
      ctx.fillRect(14, 7, 10, 10);
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(17, 9, 4, 3);

      ctx.fillStyle = "#161922";
      ctx.font = "bold 9px monospace";
      ctx.fillText("ADITYA_OS", 32, 16);

      // Menu links
      ctx.fillStyle = "#4B5563";
      ctx.font = "8px monospace";
      ctx.fillText("File", 112, 16);
      ctx.fillText("View", 152, 16);
      ctx.fillText("Projects", 192, 16);
      ctx.fillText("Terminal", 252, 16);
      ctx.fillText("About", 316, 16);

      // Status Bar Clock & Icons on right
      ctx.fillStyle = "#161922";
      ctx.font = "bold 8px monospace";
      ctx.fillText("WIFI 100%  •  12:00:00 PM", 480, 16);

      // Central Desktop Artwork: Warm Mountains & Radiant Sun
      const sunCx = 320;
      const sunCy = 145;

      // Radiant pixel sun
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(sunCx, sunCy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FDE047";
      ctx.beginPath();
      ctx.arc(sunCx, sunCy, 20, 0, Math.PI * 2);
      ctx.fill();

      // Sun rays
      ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        const rx = sunCx + Math.cos(angle) * 44;
        const ry = sunCy + Math.sin(angle) * 44;
        ctx.fillRect(rx - 2, ry - 2, 4, 4);
      }

      // Layered Mountain Silhouettes
      // Far mountain range (warm ochre/terracotta muted)
      ctx.fillStyle = "#E0BC9B";
      ctx.beginPath();
      ctx.moveTo(120, 205);
      ctx.lineTo(240, 125);
      ctx.lineTo(360, 205);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(280, 205);
      ctx.lineTo(400, 135);
      ctx.lineTo(520, 205);
      ctx.closePath();
      ctx.fill();

      // Mid mountain range (terracotta)
      ctx.fillStyle = "#C86446";
      ctx.beginPath();
      ctx.moveTo(60, 210);
      ctx.lineTo(180, 140);
      ctx.lineTo(310, 210);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(330, 210);
      ctx.lineTo(460, 145);
      ctx.lineTo(580, 210);
      ctx.closePath();
      ctx.fill();

      // Near mountain ridge (deep slate/charcoal)
      ctx.fillStyle = "#3D4457";
      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.lineTo(130, 165);
      ctx.lineTo(260, 220);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(220, 220);
      ctx.lineTo(340, 175);
      ctx.lineTo(480, 220);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(420, 220);
      ctx.lineTo(540, 168);
      ctx.lineTo(640, 220);
      ctx.closePath();
      ctx.fill();

      // Lake waterline
      ctx.fillStyle = "#F3EDE2";
      ctx.fillRect(0, 220, 640, 2);

      // Central Quote & Subtitle
      ctx.fillStyle = "#161922";
      ctx.font = "italic bold 16px serif";
      ctx.textAlign = "center";
      ctx.fillText('"The quietest things create the longest waves."', 320, 92);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#6B7280";
      ctx.fillText("TIME ON EARTH: 22Y 140D", 320, 110);
      ctx.textAlign = "left";

      // Frosted Bottom App Dock (y: 295 to 345)
      const dockW = 280;
      const dockH = 46;
      const dockX = 320 - dockW / 2;
      const dockY = 295;

      ctx.fillStyle = "rgba(243, 237, 226, 0.9)";
      ctx.fillRect(dockX, dockY, dockW, dockH);
      ctx.strokeStyle = "#D5CCBD";
      ctx.strokeRect(dockX + 0.5, dockY + 0.5, dockW - 1, dockH - 1);

      // 5 App Icons
      const icons = [
        { name: "Terminal", col: "#0F172A", char: ">_" },
        { name: "Pixel", col: "#8B5CF6", char: "PX" },
        { name: "Notes", col: "#FAF7F2", char: "NT" },
        { name: "Work", col: "#1D4ED8", char: "CS" },
        { name: "Settings", col: "#374151", char: "⚙" },
      ];

      icons.forEach((ic, i) => {
        const ix = dockX + 22 + i * 50;
        const iy = dockY + 8;
        // Icon base
        ctx.fillStyle = ic.col;
        ctx.fillRect(ix, iy, 30, 24);
        ctx.strokeStyle = "#2D3748";
        ctx.strokeRect(ix, iy, 30, 24);

        // Icon text/symbol
        ctx.fillStyle = ic.col === "#FAF7F2" ? "#161922" : "#FFFFFF";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(ic.char, ix + 15, iy + 15);

        // App name
        ctx.fillStyle = "#4B5563";
        ctx.font = "6px monospace";
        ctx.fillText(ic.name, ix + 15, iy + 31);
      });
      ctx.textAlign = "left";

      // Pulsing Cue Callout
      ctx.fillStyle = "#0A0D14";
      ctx.fillRect(220, 258, 200, 24);
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.strokeRect(220.5, 258.5, 199, 23);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = PIXEL_PALETTE_24.emeraldStreak;
      ctx.textAlign = "center";
      ctx.fillText("▼ CLICK OR SCROLL TO ENTER ▼", 320, 274);
      ctx.textAlign = "left";
    });
    this.createdTextures.push(screenTex);

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      side: THREE.DoubleSide,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.0), screenMat);
    screenMesh.position.set(0, 1.2, 0.11);
    group.add(screenMesh);

    // Glowing cue overlay plane for crisp 3D pulsating feedback
    const cueGeo = new THREE.PlaneGeometry(2.1, 0.28);
    const cueMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const cueOverlay = new THREE.Mesh(cueGeo, cueMat);
    cueOverlay.position.set(0, 1.2 - 0.95, 0.13);
    group.add(cueOverlay);

    this.animatedProps.push({
      mesh: cueOverlay,
      update: (t) => {
        cueMat.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 4.5));
      },
    });
  }

  public update(time: number): void {
    for (const item of this.animatedProps) {
      item.update(time);
    }
  }

  public dispose(): void {
    for (const tex of this.createdTextures) {
      tex.dispose();
    }
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
