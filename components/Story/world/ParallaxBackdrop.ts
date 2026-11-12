import * as THREE from "three";

/**
 * Creates procedural pixel-art backdrop planes matching PaperPixelWallpaper.tsx
 * Staggered along Z with parallax response.
 */
export class ParallaxBackdrop {
  public group: THREE.Group;
  private starFieldMesh!: THREE.Mesh;
  private sunMesh!: THREE.Mesh;
  private ridgeFarMesh!: THREE.Mesh;
  private ridgeMidMesh!: THREE.Mesh;
  private ridgeNearMesh!: THREE.Mesh;
  private gridMesh!: THREE.Mesh;

  private isDark: boolean = true;

  // Mountain ridge profile configurations
  private readonly farHeights = [24, 38, 55, 80, 68, 42, 60, 80, 72, 45, 32, 58, 76, 64, 48, 30];
  private readonly midHeights = [18, 18, 38, 38, 52, 52, 30, 30, 58, 58, 42, 42, 26, 26, 36, 36];
  private readonly nearHeights = [10, 34, 14, 44, 18, 48, 20, 38, 12, 40, 16, 46, 22, 36, 14, 8];

  constructor() {
    this.group = new THREE.Group();
    this.initLayers();
  }

  private createStarFieldTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillStyle = "#FFFFFF";

      // Deterministic scattered white 1px dots
      const seedPoints: [number, number, number][] = [
        [12, 18, 0.9], [45, 8, 0.6], [82, 24, 1.0], [110, 14, 0.7],
        [22, 44, 0.8], [64, 52, 0.5], [98, 38, 0.9], [120, 60, 0.8],
        [8, 76, 0.6], [38, 88, 1.0], [74, 70, 0.7], [104, 84, 0.6],
        [28, 108, 0.8], [58, 118, 0.7], [88, 102, 0.9], [118, 114, 1.0],
        [50, 32, 0.5], [70, 12, 0.8], [15, 124, 0.6], [90, 62, 0.7],
        [34, 68, 0.9], [122, 98, 0.8], [6, 36, 0.6], [84, 120, 0.8],
      ];

      for (const [x, y, op] of seedPoints) {
        ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 4);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createDotGridTexture(isDark: boolean): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (isDark) {
        // Warm dark blue (#0A1628) transitioning to warm dark (#040814)
        const grad = ctx.createLinearGradient(0, 0, 0, 128);
        grad.addColorStop(0, "#0A1628");
        grad.addColorStop(1, "#040814");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(0, 0, 2, 2);
        ctx.fillRect(64, 64, 2, 2);
      } else {
        ctx.fillStyle = "#FAF7F2";
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = "rgba(26, 24, 20, 0.08)";
        ctx.fillRect(0, 0, 2, 2);
        ctx.fillRect(64, 64, 2, 2);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 10);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createPixelSunTexture(isDark: boolean): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 160, 160);

      // Cream-white circular texture (8px pixel circles)
      const cellSize = 8;
      const radius = 64;
      const cx = 80;
      const cy = 80;

      for (let x = 0; x < 160; x += cellSize) {
        for (let y = 0; y < 160; y += cellSize) {
          const dx = x + cellSize / 2 - cx;
          const dy = y + cellSize / 2 - cy;
          const dist = Math.hypot(dx, dy);

          if (dist <= radius) {
            if (isDark) {
              // Cream-white pixel moon with subtle crater/depth texture
              if (dist > radius - 10) {
                ctx.fillStyle = "#FAF7F2"; // Bright rim
              } else if ((x === 64 && y === 64) || (x === 72 && y === 88) || (x === 96 && y === 56)) {
                ctx.fillStyle = "#E5DECF"; // Subtle crater pixel
              } else {
                ctx.fillStyle = "#FFFDF7"; // Cream white body
              }
            } else {
              // Daytime sun
              ctx.fillStyle = dist > radius - 12 ? "#FDE047" : "#FEF08A";
            }
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private createSteppedRidgeTexture(
    heights: number[],
    fillColor: string,
    width = 256,
    height = 128
  ): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fillColor;

      const stepWidth = width / heights.length;
      for (let i = 0; i < heights.length; i++) {
        const h = heights[i];
        ctx.fillRect(i * stepWidth, height - h, stepWidth + 1, h);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(4, 1);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private initLayers(): void {
    // 0. Distant Starfield Layer behind everything at z=-360
    const starGeo = new THREE.PlaneGeometry(800, 400);
    const starMat = new THREE.MeshBasicMaterial({
      map: this.createStarFieldTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    this.starFieldMesh = new THREE.Mesh(starGeo, starMat);
    this.starFieldMesh.position.set(0, 60, -360);
    this.group.add(this.starFieldMesh);

    // 1. Distant Dot Grid Sky Plane (Warm dark blue transitioning to warm dark)
    const gridGeo = new THREE.PlaneGeometry(800, 400);
    const gridMat = new THREE.MeshBasicMaterial({
      map: this.createDotGridTexture(true),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    this.gridMesh = new THREE.Mesh(gridGeo, gridMat);
    this.gridMesh.position.set(0, 60, -350);
    this.group.add(this.gridMesh);

    // 2. Pixel Moon/Sun: 100-unit plane at top-right of sky
    const sunGeo = new THREE.PlaneGeometry(100, 100);
    const sunMat = new THREE.MeshBasicMaterial({
      map: this.createPixelSunTexture(true),
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.position.set(45, 60, -340);
    this.group.add(this.sunMesh);

    // 3. Distant Stepped Mountain Ridge (Dramatic peaks up to 80 units)
    const farTex = this.createSteppedRidgeTexture(this.farHeights, "#101726");
    const farGeo = new THREE.PlaneGeometry(800, 180);
    const farMat = new THREE.MeshBasicMaterial({
      map: farTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.ridgeFarMesh = new THREE.Mesh(farGeo, farMat);
    this.ridgeFarMesh.position.set(0, 5, -330);
    this.group.add(this.ridgeFarMesh);

    // 4. Mid Ridge (More stepped, distinct terraces)
    const midTex = this.createSteppedRidgeTexture(this.midHeights, "#162032");
    const midGeo = new THREE.PlaneGeometry(800, 150);
    const midMat = new THREE.MeshBasicMaterial({
      map: midTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.ridgeMidMesh = new THREE.Mesh(midGeo, midMat);
    this.ridgeMidMesh.position.set(0, -10, -310);
    this.group.add(this.ridgeMidMesh);

    // 5. Near Foothills (Sharper peaks)
    const nearTex = this.createSteppedRidgeTexture(this.nearHeights, "#1D2A40");
    const nearGeo = new THREE.PlaneGeometry(800, 130);
    const nearMat = new THREE.MeshBasicMaterial({
      map: nearTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.ridgeNearMesh = new THREE.Mesh(nearGeo, nearMat);
    this.ridgeNearMesh.position.set(0, -25, -290);
    this.group.add(this.ridgeNearMesh);
  }

  public updateTheme(isDark: boolean): void {
    if (this.isDark === isDark) return;
    this.isDark = isDark;

    // Refresh textures
    (this.gridMesh.material as THREE.MeshBasicMaterial).map = this.createDotGridTexture(isDark);
    (this.sunMesh.material as THREE.MeshBasicMaterial).map = this.createPixelSunTexture(isDark);
    this.starFieldMesh.visible = isDark;

    (this.ridgeFarMesh.material as THREE.MeshBasicMaterial).map = this.createSteppedRidgeTexture(
      this.farHeights,
      isDark ? "#101726" : "#EFE9DE"
    );
    (this.ridgeMidMesh.material as THREE.MeshBasicMaterial).map = this.createSteppedRidgeTexture(
      this.midHeights,
      isDark ? "#162032" : "#E5DECF"
    );
    (this.ridgeNearMesh.material as THREE.MeshBasicMaterial).map = this.createSteppedRidgeTexture(
      this.nearHeights,
      isDark ? "#1D2A40" : "#DDD4C3"
    );
  }

  public updateParallax(cameraPos: THREE.Vector3): void {
    // Anchor the backdrop to follow the camera Z with subtle parallax lag
    this.group.position.z = cameraPos.z;
    this.sunMesh.position.x = 45 + cameraPos.x * 0.05;
    this.ridgeFarMesh.position.x = cameraPos.x * 0.1;
    this.ridgeMidMesh.position.x = cameraPos.x * 0.2;
    this.ridgeNearMesh.position.x = cameraPos.x * 0.35;
  }

  public dispose(): void {
    const meshes = [
      this.starFieldMesh,
      this.gridMesh,
      this.sunMesh,
      this.ridgeFarMesh,
      this.ridgeMidMesh,
      this.ridgeNearMesh,
    ];
    for (const mesh of meshes) {
      if (mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    }
  }
}
