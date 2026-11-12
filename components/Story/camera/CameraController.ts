import * as THREE from "three";
import { JourneyStation, CameraPreset } from "@/content/journey";
import { STATION_COORDINATES } from "../world/StationLandmarks";

export interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private cameraSpline: THREE.CatmullRomCurve3;
  private lookAtSpline: THREE.CatmullRomCurve3;
  private stations: JourneyStation[];

  private currentPos: THREE.Vector3 = new THREE.Vector3();
  private currentLookAt: THREE.Vector3 = new THREE.Vector3();
  private targetPos: THREE.Vector3 = new THREE.Vector3();
  private targetLookAt: THREE.Vector3 = new THREE.Vector3();

  private baseFov: number = 50;
  private targetFov: number = 50;

  constructor(camera: THREE.PerspectiveCamera, stations: JourneyStation[]) {
    this.camera = camera;
    this.stations = stations;

    const cameraPoints: THREE.Vector3[] = [];
    const lookAtPoints: THREE.Vector3[] = [];

    for (const station of stations) {
      const transform = STATION_COORDINATES[station.id] || {
        position: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 1.5, 6),
        lookAtOffset: new THREE.Vector3(0, 0, 0),
      };

      const camPt = transform.position.clone().add(transform.cameraOffset);
      const lookPt = transform.position.clone().add(transform.lookAtOffset);

      cameraPoints.push(camPt);
      lookAtPoints.push(lookPt);
    }

    // Centripetal CatmullRom ensures smooth non-looping curve without sharp overshoot
    this.cameraSpline = new THREE.CatmullRomCurve3(cameraPoints, false, "centripetal", 0.5);
    this.lookAtSpline = new THREE.CatmullRomCurve3(lookAtPoints, false, "centripetal", 0.5);

    if (cameraPoints.length > 0) {
      this.currentPos.copy(cameraPoints[0]);
      this.currentLookAt.copy(lookAtPoints[0]);
      this.camera.position.copy(this.currentPos);
      this.camera.lookAt(this.currentLookAt);
    }
  }

  public getStationIndexAtProgress(progress: number): number {
    const clamped = Math.max(0, Math.min(1, progress));
    const count = this.stations.length;
    if (count <= 1) return 0;
    return Math.min(Math.floor(clamped * count), count - 1);
  }

  public getProgressForStationIndex(index: number): number {
    const count = this.stations.length;
    if (count <= 1) return 0;
    return index / (count - 1);
  }

  public getProgressForStationId(id: string): number {
    const idx = this.stations.findIndex((s) => s.id === id);
    if (idx === -1) return 0;
    return this.getProgressForStationIndex(idx);
  }

  public getInterpolatedYear(progress: number): number {
    const count = this.stations.length;
    if (count <= 1) return this.stations[0]?.year || 2026;

    const scaled = Math.max(0, Math.min(1, progress)) * (count - 1);
    const lowIdx = Math.floor(scaled);
    const highIdx = Math.min(lowIdx + 1, count - 1);
    const fraction = scaled - lowIdx;

    const y0 = this.stations[lowIdx].year;
    const y1 = this.stations[highIdx].year;

    return Math.round(y0 + (y1 - y0) * fraction);
  }

  public update(progress: number, velocity: number, delta: number): CameraState {
    const p = Math.max(0, Math.min(1, progress));

    // Sample primary spline positions
    this.cameraSpline.getPoint(p, this.targetPos);
    this.lookAtSpline.getPoint(p, this.targetLookAt);

    // Apply preset dynamics around the nearest station
    const count = this.stations.length;
    const scaled = p * (count - 1);
    const activeIdx = Math.round(scaled);
    const currentStation = this.stations[activeIdx];
    const localProgress = scaled - activeIdx; // -0.5 to +0.5 around station center

    if (currentStation) {
      this.applyPreset(currentStation.cameraPreset, localProgress);
    }

    // Dynamic FOV widening on high scroll velocity
    const absVelocity = Math.abs(velocity);
    const fovWarp = Math.min(absVelocity * 2200, 25);
    this.targetFov = this.baseFov + fovWarp;

    // Smooth damping (frame-rate independent lerp)
    const damp = Math.min(1, delta * 12);
    this.currentPos.lerp(this.targetPos, damp);
    this.currentLookAt.lerp(this.targetLookAt, damp);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, damp);
    this.camera.updateProjectionMatrix();

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);

    return {
      position: this.currentPos.clone(),
      target: this.currentLookAt.clone(),
      fov: this.camera.fov,
    };
  }

  private applyPreset(preset: CameraPreset, localP: number): void {
    switch (preset) {
      case "dolly-in":
        // Push slightly in towards target as you center on the station
        const dollyAmt = (1 - Math.abs(localP) * 2) * 0.8;
        if (dollyAmt > 0) {
          const dir = new THREE.Vector3().subVectors(this.targetLookAt, this.targetPos).normalize();
          this.targetPos.addScaledVector(dir, dollyAmt);
        }
        break;

      case "pan-left":
        // Lateral shift left to reveal right reading space
        this.targetPos.x += (1 - Math.abs(localP)) * -1.2;
        break;

      case "pan-right":
        // Lateral shift right to reveal left reading space
        this.targetPos.x += (1 - Math.abs(localP)) * 1.2;
        break;

      case "slow-orbit":
        // Gentle rotational arc around the subject
        const angle = localP * 0.4;
        const radius = 6;
        this.targetPos.x += Math.sin(angle) * radius * 0.25;
        this.targetPos.z += Math.cos(angle) * 0.4;
        break;

      case "pull-back":
      case "warp":
        // Pull back camera slightly to show breadth
        this.targetPos.z += (1 - Math.abs(localP)) * 2.0;
        break;
    }
  }

  public dispose(): void {
    // No persistent resources to unbind
  }
}
