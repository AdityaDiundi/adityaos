import * as THREE from "three";

/**
 * Minimal vertical speed streak lines for fast-forward warp.
 * No wireframe rings, rotating shapes, or visual debris.
 */
export class SpeedStreaks {
  public group: THREE.Group;
  private lineSegments: THREE.LineSegments;
  private geometry: THREE.BufferGeometry;
  private material: THREE.LineBasicMaterial;
  private positions: Float32Array;
  private readonly count = 160;
  private readonly radius = 14;
  private readonly length = 80;

  constructor() {
    this.group = new THREE.Group();
    this.positions = new Float32Array(this.count * 2 * 3);

    for (let i = 0; i < this.count; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const r = 2.0 + Math.random() * this.radius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * this.length;

      // Start point
      this.positions[idx] = x;
      this.positions[idx + 1] = y;
      this.positions[idx + 2] = z;

      // End point
      this.positions[idx + 3] = x;
      this.positions[idx + 4] = y;
      this.positions[idx + 5] = z - 1.2;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    this.lineSegments = new THREE.LineSegments(this.geometry, this.material);
    this.group.add(this.lineSegments);
  }

  public update(cameraPos: THREE.Vector3, velocity: number, threshold: number, intensity: number): void {
    const absVel = Math.abs(velocity);
    this.group.position.copy(cameraPos);

    if (absVel <= threshold) {
      if (this.material.opacity > 0.005) {
        this.material.opacity *= 0.85;
      } else {
        this.material.opacity = 0;
      }
      return;
    }

    // Smoothly ease in streaks
    const excess = (absVel - threshold) / 0.006;
    const targetOpacity = Math.min(excess * 0.75 * intensity, 0.8);
    this.material.opacity += (targetOpacity - this.material.opacity) * 0.2;

    const streakLen = Math.min(1.5 + excess * 15, 20);
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      const idx = i * 6;
      let z = arr[idx + 2];
      z += (velocity >= 0 ? -1 : 1) * Math.max(absVel * 60, 0.8);

      if (z < -this.length / 2) z += this.length;
      if (z > this.length / 2) z -= this.length;

      arr[idx + 2] = z;
      arr[idx + 5] = z - (velocity >= 0 ? streakLen : -streakLen);
    }

    posAttr.needsUpdate = true;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
