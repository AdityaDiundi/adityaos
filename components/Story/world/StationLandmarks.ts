import * as THREE from "three";
import type { JourneyStation } from "../../../content/journey";

export interface StationTransform {
  position: THREE.Vector3;
  cameraOffset: THREE.Vector3;
  lookAtOffset: THREE.Vector3;
}

/**
 * Standardized 3D world anchors for all 10 stations along the journey spline.
 * Configured as a straight, stable cinematic corridor along the Z axis (X ~ 0)
 * to eliminate jarring lateral swings and motion disorientation.
 */
export const STATION_COORDINATES: Record<string, StationTransform> = {
  boot: {
    position: new THREE.Vector3(0, 0, 0),
    cameraOffset: new THREE.Vector3(0, 1.2, 5.2),
    lookAtOffset: new THREE.Vector3(0, 0.6, 0),
  },
  arcade: {
    position: new THREE.Vector3(0, 0.4, -45),
    cameraOffset: new THREE.Vector3(0.5, 1.4, 5.8),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  timeskip: {
    position: new THREE.Vector3(0, 0.8, -95),
    cameraOffset: new THREE.Vector3(0, 1.4, 6.2),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  mfine: {
    position: new THREE.Vector3(0, 0.5, -145),
    cameraOffset: new THREE.Vector3(-0.5, 1.4, 5.8),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  mosaic: {
    position: new THREE.Vector3(0, 0.6, -195),
    cameraOffset: new THREE.Vector3(0.5, 1.4, 5.8),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  "quiet-year": {
    position: new THREE.Vector3(0, 0.5, -245),
    cameraOffset: new THREE.Vector3(0, 1.4, 6.5),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  field: {
    position: new THREE.Vector3(0, 0.8, -295),
    cameraOffset: new THREE.Vector3(-0.5, 1.5, 6.0),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  studio: {
    position: new THREE.Vector3(0, 0.6, -345),
    cameraOffset: new THREE.Vector3(0.5, 1.4, 5.8),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  builds: {
    position: new THREE.Vector3(0, 0.8, -395),
    cameraOffset: new THREE.Vector3(0, 1.5, 6.2),
    lookAtOffset: new THREE.Vector3(0, 0.8, 0),
  },
  landing: {
    position: new THREE.Vector3(0, 0, -445),
    cameraOffset: new THREE.Vector3(0, 0.4, 4.6), // Direct frontal alignment into AdityaOS desktop
    lookAtOffset: new THREE.Vector3(0, 0.4, 0),
  },
};

/**
 * Creates pixelated canvas textures helper
 */
function createPixelCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

export class StationLandmarks {
  public group: THREE.Group;
  private animatedMeshes: { mesh: THREE.Object3D; update: (t: number) => void }[] = [];
  private isDark: boolean = false;

  constructor(stations: JourneyStation[]) {
    this.group = new THREE.Group();
    this.buildStations(stations);
  }

  private buildStations(stations: JourneyStation[]): void {
    for (const station of stations) {
      const transform = STATION_COORDINATES[station.id];
      if (!transform) continue;

      const stationGroup = new THREE.Group();
      stationGroup.position.copy(transform.position);

      switch (station.id) {
        case "boot":
          this.buildBootStation(stationGroup);
          break;
        case "arcade":
          this.buildArcadeStation(stationGroup);
          break;
        case "timeskip":
          this.buildTimeskipStation(stationGroup);
          break;
        case "mfine":
          this.buildMFineStation(stationGroup);
          break;
        case "mosaic":
          this.buildMosaicStation(stationGroup);
          break;
        case "quiet-year":
          this.buildQuietStation(stationGroup);
          break;
        case "field":
          this.buildFieldStation(stationGroup);
          break;
        case "studio":
          this.buildStudioStation(stationGroup);
          break;
        case "builds":
          this.buildBuildsStation(stationGroup);
          break;
        case "landing":
          this.buildLandingStation(stationGroup);
          break;
      }

      this.group.add(stationGroup);
    }
  }

  // 0. Boot CRT Monitor
  private buildBootStation(group: THREE.Group): void {
    // CRT Cabinet
    const bodyGeo = new THREE.BoxGeometry(2.4, 2.0, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    group.add(body);

    // Bezel & Screen
    const screenGeo = new THREE.PlaneGeometry(1.9, 1.4);
    const screenTex = createPixelCanvasTexture(256, 192, (ctx) => {
      ctx.fillStyle = "#0A0D0B";
      ctx.fillRect(0, 0, 256, 192);
      ctx.fillStyle = "#22C55E";
      ctx.font = "14px monospace";
      ctx.fillText("> ADITYA_OS v2.4", 20, 40);
      ctx.fillText("> SYSTEM OK", 20, 65);
      ctx.fillText("> SCROLL TO TRAVEL", 20, 100);
      ctx.fillText("  THROUGH TIME", 20, 120);
      ctx.fillRect(20, 140, 10, 15); // Blinking cursor placeholder
    });
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.5, 0.91);
    group.add(screen);

    // Subtle breathing glow
    this.animatedMeshes.push({
      mesh: screen,
      update: (t) => {
        screen.position.z = 0.91 + Math.sin(t * 3) * 0.005;
      },
    });
  }

  // 1. Arcade Cabinet (Virtua Cop 2)
  private buildArcadeStation(group: THREE.Group): void {
    // Cabinet Body
    const cabGeo = new THREE.BoxGeometry(2.0, 4.2, 2.2);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x22262E,
      roughness: 0.6,
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.y = 1.6;
    group.add(cab);

    // Marquee Header
    const marqueeTex = createPixelCanvasTexture(256, 64, (ctx) => {
      ctx.fillStyle = "#1E3A8A";
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("VIRTUA COP 2", 128, 38);
    });
    const marqueeGeo = new THREE.PlaneGeometry(1.8, 0.5);
    const marqueeMat = new THREE.MeshBasicMaterial({ map: marqueeTex });
    const marquee = new THREE.Mesh(marqueeGeo, marqueeMat);
    marquee.position.set(0, 3.3, 1.11);
    group.add(marquee);

    // Arcade Screen
    const screenTex = createPixelCanvasTexture(256, 200, (ctx) => {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 256, 200);
      ctx.fillStyle = "#EF4444";
      ctx.strokeRect(100, 70, 56, 56);
      ctx.fillStyle = "#38BDF8";
      ctx.font = "12px monospace";
      ctx.fillText("STAGE 1: DOWNTOWN", 30, 40);
      ctx.fillText("INSERT COIN", 80, 170);
    });
    const screenGeo = new THREE.PlaneGeometry(1.6, 1.3);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.1, 1.11);
    screen.rotation.x = -0.1;
    group.add(screen);

    // Coin Door
    const coinGeo = new THREE.BoxGeometry(0.8, 0.9, 0.1);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.position.set(0, 0.7, 1.12);
    group.add(coin);
  }

  // 2. Timeskip Warp Tunnel
  private buildTimeskipStation(group: THREE.Group): void {
    // Concentric rotating warp rings
    const ringGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const ringGeo = new THREE.TorusGeometry(3.5 + i * 0.7, 0.08, 6, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x38BDF8 : 0xA855F7,
        wireframe: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -i * 6;
      ringGroup.add(ring);
    }
    group.add(ringGroup);

    // Warp Card Billboard
    const cardTex = createPixelCanvasTexture(256, 128, (ctx) => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(0, 0, 256, 128);
      ctx.strokeStyle = "#38BDF8";
      ctx.strokeRect(4, 4, 248, 120);
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TIME ACCELERATION", 128, 45);
      ctx.fillStyle = "#38BDF8";
      ctx.font = "12px monospace";
      ctx.fillText(">> FAST FORWARD 2021 >>", 128, 75);
    });
    const cardGeo = new THREE.PlaneGeometry(4, 2);
    const cardMat = new THREE.MeshBasicMaterial({
      map: cardTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(0, 0, 0);
    group.add(card);

    this.animatedMeshes.push({
      mesh: ringGroup,
      update: (t) => {
        ringGroup.rotation.z = t * 0.4;
      },
    });
  }

  // 3. MFine Healthcare Claims Flow
  private buildMFineStation(group: THREE.Group): void {
    const pedestalGeo = new THREE.BoxGeometry(4.2, 0.4, 3.0);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1E293B });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.6;
    group.add(pedestal);

    // Isometric UI Display Plane
    const uiTex = createPixelCanvasTexture(320, 220, (ctx) => {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 320, 220);
      // Teal header
      ctx.fillStyle = "#0D9488";
      ctx.fillRect(0, 0, 320, 32);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("MFINE CORPORATE CLAIMS", 16, 22);

      // Claim items
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(16, 48, 288, 38);
      ctx.fillRect(16, 94, 288, 38);

      ctx.fillStyle = "#2DD4BF";
      ctx.font = "11px monospace";
      ctx.fillText("CLAIM #8849 — APPROVED", 26, 72);
      ctx.fillText("CLAIM #8850 — DISBURSED", 26, 118);

      // Metric callout
      ctx.fillStyle = "#0284C7";
      ctx.fillRect(16, 146, 288, 54);
      ctx.fillStyle = "#F0FDF4";
      ctx.font = "bold 12px monospace";
      ctx.fillText("-62% HR ADMIN TASK TIME", 26, 178);
    });

    const uiGeo = new THREE.PlaneGeometry(3.6, 2.5);
    const uiMat = new THREE.MeshBasicMaterial({ map: uiTex });
    const uiMesh = new THREE.Mesh(uiGeo, uiMat);
    uiMesh.position.set(0, 1.0, 0);
    uiMesh.rotation.y = 0.2;
    group.add(uiMesh);

    this.animatedMeshes.push({
      mesh: uiMesh,
      update: (t) => {
        uiMesh.position.y = 1.0 + Math.sin(t * 1.5) * 0.08;
      },
    });
  }

  // 4. Mosaic Wellness Habit Tracker
  private buildMosaicStation(group: THREE.Group): void {
    const boardTex = createPixelCanvasTexture(320, 220, (ctx) => {
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, 320, 220);
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("MANMATTERS HABIT STREAK", 20, 32);

      // Habit dot grid matrix (4 weeks x 7 days)
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 7; c++) {
          const filled = (r * 7 + c) % 3 !== 0;
          ctx.fillStyle = filled ? "#10B981" : "#374151";
          ctx.fillRect(20 + c * 38, 55 + r * 26, 28, 18);
        }
      }

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 12px monospace";
      ctx.fillText("+44% DAY 14 RETENTION", 20, 195);
    });

    const boardGeo = new THREE.PlaneGeometry(3.6, 2.5);
    const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.set(0, 1.1, 0);
    boardMesh.rotation.y = -0.25;
    group.add(boardMesh);

    this.animatedMeshes.push({
      mesh: boardMesh,
      update: (t) => {
        boardMesh.position.y = 1.1 + Math.cos(t * 1.4) * 0.08;
      },
    });
  }

  // 5. Quiet Year
  private buildQuietStation(group: THREE.Group): void {
    const benchGeo = new THREE.BoxGeometry(2.4, 0.3, 0.8);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, 0.4, 0);
    group.add(bench);

    // Pixel Pine Tree
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.8, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5C3A21 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(1.6, 0.9, -0.5);
    group.add(trunk);

    const foliageGeo = new THREE.ConeGeometry(1.1, 2.4, 5);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x2D5A3A,
      flatShading: true,
    });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(1.6, 2.4, -0.5);
    group.add(foliage);
  }

  // 6. Grassroots Fieldwork (India Fellow x Project Potential)
  private buildFieldStation(group: THREE.Group): void {
    // Terraced Hill Plateau
    const hillGeo = new THREE.BoxGeometry(4.8, 0.6, 3.6);
    const hillMat = new THREE.MeshStandardMaterial({
      color: 0x3F4F38,
      roughness: 0.9,
    });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.y = -0.3;
    group.add(hill);

    // Bamboo Frame Pavilion
    const frameGroup = new THREE.Group();
    for (let x = -1.6; x <= 1.6; x += 3.2) {
      for (let z = -1.2; z <= 1.2; z += 2.4) {
        const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 5);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xD4A373 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, 1.1, z);
        frameGroup.add(pole);
      }
    }
    group.add(frameGroup);

    // Field Diagnostics Matrix Board
    const boardTex = createPixelCanvasTexture(300, 200, (ctx) => {
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, 300, 200);
      ctx.fillStyle = "#78350F";
      ctx.font = "bold 13px serif";
      ctx.fillText("AAROHI COGNITIVE LAB", 20, 30);
      ctx.strokeStyle = "#D1D5DB";
      ctx.strokeRect(20, 45, 260, 95);

      ctx.fillStyle = "#1F2937";
      ctx.font = "11px monospace";
      ctx.fillText("V1: SPATIAL REASONING", 30, 70);
      ctx.fillText("V2: NUMERICAL FLUENCY", 30, 95);
      ctx.fillText("V3: VISUAL ATTENTION", 30, 120);

      ctx.fillStyle = "#047857";
      ctx.font = "bold 11px monospace";
      ctx.fillText("LIVE ATTENDANCE: SHEETS + APPSCRIPT", 20, 170);
    });

    const boardGeo = new THREE.PlaneGeometry(3.2, 2.1);
    const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.set(0, 1.2, 0);
    group.add(boardMesh);
  }

  // 7. Independent Studio
  private buildStudioStation(group: THREE.Group): void {
    // Desk Surface
    const deskGeo = new THREE.BoxGeometry(4.4, 0.2, 2.2);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.5,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.y = 0.6;
    group.add(desk);

    // Primary Display
    const monitorGeo = new THREE.BoxGeometry(2.4, 1.5, 0.1);
    const screenTex = createPixelCanvasTexture(256, 160, (ctx) => {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(0, 0, 256, 20);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "10px monospace";
      ctx.fillText("INVENIX / CLIENT STUDIO", 10, 14);

      ctx.strokeStyle = "#334155";
      ctx.strokeRect(10, 30, 110, 115);
      ctx.strokeRect(130, 30, 115, 115);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "9px monospace";
      ctx.fillText("// PRODUCTION SHIPPED", 15, 50);
    });
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.4), screenMat);
    screen.position.set(0, 1.6, 0.06);

    const monitor = new THREE.Mesh(monitorGeo, deskMat);
    monitor.position.set(0, 1.6, 0);
    group.add(monitor);
    group.add(screen);
  }

  // 8. Personal Builds (Pixel Studio, JANEVAL, AdityaOS)
  private buildBuildsStation(group: THREE.Group): void {
    const trioGroup = new THREE.Group();

    // Left: Pixel Studio Card
    const pixelTex = createPixelCanvasTexture(180, 140, (ctx) => {
      ctx.fillStyle = "#18181B";
      ctx.fillRect(0, 0, 180, 140);
      ctx.fillStyle = "#EC4899";
      ctx.font = "bold 11px monospace";
      ctx.fillText("PIXEL STUDIO", 15, 25);
      // Pixel smiley
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(50, 45, 20, 20);
      ctx.fillRect(110, 45, 20, 20);
      ctx.fillRect(50, 95, 80, 15);
    });
    const pixelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 1.6),
      new THREE.MeshBasicMaterial({ map: pixelTex, side: THREE.DoubleSide })
    );
    pixelMesh.position.set(-2.6, 1.2, 0);
    pixelMesh.rotation.y = 0.25;
    trioGroup.add(pixelMesh);

    // Center: JANEVAL Card
    const janevalTex = createPixelCanvasTexture(180, 140, (ctx) => {
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, 180, 140);
      ctx.fillStyle = "#22C55E";
      ctx.font = "bold 11px monospace";
      ctx.fillText("JANEVAL BENCHMARK", 15, 25);
      ctx.fillStyle = "#E4E4E7";
      ctx.font = "10px monospace";
      ctx.fillText("> ACCURACY: 94.2%", 15, 60);
      ctx.fillText("> LATENCY: 180ms", 15, 85);
      ctx.fillText("> PASS@1 RATE", 15, 110);
    });
    const janevalMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.7),
      new THREE.MeshBasicMaterial({ map: janevalTex, side: THREE.DoubleSide })
    );
    janevalMesh.position.set(0, 1.4, 0.4);
    trioGroup.add(janevalMesh);

    // Right: AdityaOS Card
    const osTex = createPixelCanvasTexture(180, 140, (ctx) => {
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, 180, 140);
      ctx.fillStyle = "#18181B";
      ctx.font = "bold 11px serif";
      ctx.fillText("ADITYA OS", 15, 25);
      ctx.strokeStyle = "#D4D4D8";
      ctx.strokeRect(15, 40, 150, 80);
      ctx.fillStyle = "#71717A";
      ctx.font = "9px monospace";
      ctx.fillText("A Web Desktop Env", 25, 75);
    });
    const osMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 1.6),
      new THREE.MeshBasicMaterial({ map: osTex, side: THREE.DoubleSide })
    );
    osMesh.position.set(2.6, 1.2, 0);
    osMesh.rotation.y = -0.25;
    trioGroup.add(osMesh);

    group.add(trioGroup);

    this.animatedMeshes.push({
      mesh: trioGroup,
      update: (t) => {
        trioGroup.rotation.y = Math.sin(t * 0.8) * 0.08;
      },
    });
  }

  // 9. Landing Station (AdityaOS Desktop Screen)
  private buildLandingStation(group: THREE.Group): void {
    // Outer monitor frame sized to 16:9 ratio matching screen
    const frameGeo = new THREE.BoxGeometry(6.6, 4.0, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1A1D24,
      roughness: 0.7,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Desktop Screen Surface that camera moves straight into
    const desktopTex = createPixelCanvasTexture(640, 360, (ctx) => {
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, 640, 360);

      // Top menu bar
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, 640, 24);
      ctx.fillStyle = "#1A1814";
      ctx.font = "bold 10px monospace";
      ctx.fillText("ADITYA_OS", 14, 16);
      ctx.fillText("12:00:00", 580, 16);

      // Centered Desktop quote
      ctx.fillStyle = "#1A1814";
      ctx.font = "italic 16px serif";
      ctx.textAlign = "center";
      ctx.fillText('"The quietest things create the longest waves."', 320, 165);

      ctx.font = "12px monospace";
      ctx.fillStyle = "#78716C";
      ctx.fillText("TIME ON EARTH: 22Y 140D", 320, 205);

      // Bottom taskbar icons preview
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(200, 320, 240, 30);
    });

    const screenGeo = new THREE.PlaneGeometry(6.4, 3.8);
    const screenMat = new THREE.MeshBasicMaterial({ map: desktopTex });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.11;
    group.add(screenMesh);
  }

  public update(time: number): void {
    for (const item of this.animatedMeshes) {
      item.update(time);
    }
  }

  public updateTheme(isDark: boolean): void {
    this.isDark = isDark;
    // Station materials retain their authentic tone with theme-aware lighting
  }

  public dispose(): void {
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
