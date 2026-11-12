import * as THREE from "three";

/**
 * Procedural streak particle warp effect.
 * Engages when scroll velocity exceeds threshold, stretching lines along camera travel.
 */
export class WarpEffect {
  public group: THREE.Group;
  private lineSegments: THREE.LineSegments;
  private geometry: THREE.BufferGeometry;
  private material: THREE.LineBasicMaterial;
  private readonly particleCount = 280;
  private readonly radius = 18;
  private readonly length = 120;
  private positions: Float32Array;

  constructor() {
    this.group = new THREE.Group();
    this.positions = new Float32Array(this.particleCount * 2 * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 6;
      const angle = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * this.radius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * this.length;

      // Start point
      this.positions[idx] = x;
      this.positions[idx + 1] = y;
      this.positions[idx + 2] = z;

      // End point (initially short)
      this.positions[idx + 3] = x;
      this.positions[idx + 4] = y;
      this.positions[idx + 5] = z - 0.8;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });

    this.lineSegments = new THREE.LineSegments(this.geometry, this.material);
    this.group.add(this.lineSegments);
  }

  public update(cameraPos: THREE.Vector3, velocity: number): void {
    const absVel = Math.abs(velocity);
    // Position effect around camera
    this.group.position.copy(cameraPos);

    // Fade in streaks when velocity rises
    const targetOpacity = Math.min(Math.max((absVel - 0.0015) / 0.006, 0), 0.85);
    this.material.opacity = THREE.MathUtils.lerp(this.material.opacity, targetOpacity, 0.15);

    if (this.material.opacity <= 0.01) return;

    // Stretch line lengths based on speed
    const streakLength = Math.min(2.0 + absVel * 300, 24);
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 6;
      let z1 = array[idx + 2];
      // Move particles past the camera
      z1 += (velocity >= 0 ? -1 : 1) * Math.max(absVel * 80, 0.5);

      if (z1 < -this.length / 2) z1 += this.length;
      if (z1 > this.length / 2) z1 -= this.length;

      array[idx + 2] = z1;
      array[idx + 5] = z1 - (velocity >= 0 ? streakLength : -streakLength);
    }

    posAttr.needsUpdate = true;
  }

  public updateTheme(isDark: boolean): void {
    this.material.color.setHex(isDark ? 0x38BDF8 : 0x0284C7);
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
