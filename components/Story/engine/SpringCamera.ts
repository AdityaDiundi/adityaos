import * as THREE from "three";
import type { JourneyStation } from "../../../content/journey";
import type { JourneyConfig } from "../../../content/journey.config";
import { STATION_COORDINATES, type StationTransform } from "../world/StationLandmarks.ts";

export interface SpringCameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  roll: number;
  isSettled: boolean;
}

// Strictly level horizon across all stations to eliminate motion sickness
const STATION_ROLL_DEGREES: Record<string, number> = {
  boot: 0.0,
  arcade: 0.0,
  timeskip: 0.0,
  mfine: 0.0,
  mosaic: 0.0,
  "quiet-year": 0.0,
  field: 0.0,
  studio: 0.0,
  builds: 0.0,
  landing: 0.0,
};

export class SpringCamera {
  private camera: THREE.PerspectiveCamera;
  private stations: JourneyStation[];
  private config: JourneyConfig;

  // Catmull-Rom Splines
  private posSpline: THREE.CatmullRomCurve3;
  private targetSpline: THREE.CatmullRomCurve3;

  // Reusable vectors for zero per-frame garbage
  private currentPos: THREE.Vector3 = new THREE.Vector3();
  private currentLookAt: THREE.Vector3 = new THREE.Vector3();
  private targetPosSample: THREE.Vector3 = new THREE.Vector3();
  private targetLookAtSample: THREE.Vector3 = new THREE.Vector3();
  private displacement: THREE.Vector3 = new THREE.Vector3();
  private lookAtDisplacement: THREE.Vector3 = new THREE.Vector3();
  private upVector: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  // Reusable orientation objects
  private rotMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private rotQuat: THREE.Quaternion = new THREE.Quaternion();
  private rollQuat: THREE.Quaternion = new THREE.Quaternion();

  // Current values
  private currentFov: number;
  private currentRoll: number = 0;
  private targetFov: number;
  private targetRoll: number = 0;

  // Interactive Viewport State (Orbit, Pan, Zoom)
  private targetOrbitAzimuth: number = 0;
  private currentOrbitAzimuth: number = 0;
  private targetOrbitElevation: number = 0;
  private currentOrbitElevation: number = 0;

  private targetPanOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  private currentPanOffset: THREE.Vector2 = new THREE.Vector2(0, 0);

  private targetZoomRatio: number = 1.0;
  private currentZoomRatio: number = 1.0;

  // Viewport mode & decay
  private isInspectMode: boolean = false;
  private autoDecayOnScroll: boolean = true;

  // Reusable vectors for zero per-frame garbage
  private splineOffsetVector: THREE.Vector3 = new THREE.Vector3();
  private orbitedOffset: THREE.Vector3 = new THREE.Vector3();
  private panVector: THREE.Vector3 = new THREE.Vector3();
  private camRight: THREE.Vector3 = new THREE.Vector3();
  private camUp: THREE.Vector3 = new THREE.Vector3();

  // Settled state tracking
  private settled: boolean = false;

  constructor(camera: THREE.PerspectiveCamera, stations: JourneyStation[], config: JourneyConfig) {
    this.camera = camera;
    this.stations = stations;
    this.config = config;
    this.currentFov = config.baseFov;
    this.targetFov = config.baseFov;

    const posPoints: THREE.Vector3[] = [];
    const lookAtPoints: THREE.Vector3[] = [];

    for (const station of stations) {
      const transform: StationTransform = STATION_COORDINATES[station.id] || {
        position: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 1.8, 6.5),
        lookAtOffset: new THREE.Vector3(0, 0.8, 0),
      };

      // Ensure the lower 25-30% of viewport is clear for the caption
      // by placing the lookAt point slightly above the hero prop ground
      const camPos = transform.position.clone().add(transform.cameraOffset);
      const lookPos = transform.position.clone().add(transform.lookAtOffset);

      posPoints.push(camPos);
      lookAtPoints.push(lookPos);
    }

    // Centripetal spline ensures natural tension without overshoot
    this.posSpline = new THREE.CatmullRomCurve3(posPoints, false, "centripetal", 0.5);
    this.targetSpline = new THREE.CatmullRomCurve3(lookAtPoints, false, "centripetal", 0.5);

    if (posPoints.length > 0) {
      this.currentPos.copy(posPoints[0]);
      this.currentLookAt.copy(lookAtPoints[0]);
      this.camera.position.copy(this.currentPos);
      this.camera.lookAt(this.currentLookAt);
      this.camera.fov = config.baseFov;
      this.camera.updateProjectionMatrix();
    }
  }

  public updateConfig(config: JourneyConfig): void {
    this.config = config;
  }

  /**
   * Samples roll angle (radians) along stations.
   */
  private getTargetRoll(tau: number): number {
    const N = this.stations.length;
    if (N <= 1) return 0;

    const scaled = Math.max(0, Math.min(1, tau)) * (N - 1);
    const lowIdx = Math.floor(scaled);
    const highIdx = Math.min(lowIdx + 1, N - 1);
    const frac = scaled - lowIdx;

    const stationA = this.stations[lowIdx];
    const stationB = this.stations[highIdx];

    const degA = STATION_ROLL_DEGREES[stationA.id] ?? 0;
    const degB = STATION_ROLL_DEGREES[stationB.id] ?? 0;

    const deg = degA + (degB - degA) * frac;
    const maxAllowed = this.config.maxRollDegrees;
    const clampedDeg = Math.max(-maxAllowed, Math.min(maxAllowed, deg));

    return (clampedDeg * Math.PI) / 180;
  }

  /**
   * Updates camera with critically damped spring and speed clamp.
   */
  public update(tau: number, smoothedVelocity: number, dt: number): SpringCameraState {
    const safeDt = Math.min(Math.max(dt, 0.001), 0.1);

    // 0. Smoothly damp user interactive offsets
    const userDamp = 1.0 - Math.exp(-12.0 * safeDt);
    this.currentOrbitAzimuth += (this.targetOrbitAzimuth - this.currentOrbitAzimuth) * userDamp;
    this.currentOrbitElevation += (this.targetOrbitElevation - this.currentOrbitElevation) * userDamp;
    this.currentZoomRatio += (this.targetZoomRatio - this.currentZoomRatio) * userDamp;
    this.currentPanOffset.lerp(this.targetPanOffset, userDamp);

    // If scrolling while not locked in inspect mode, gently decay manual offsets back to track
    const absVelocity = Math.abs(smoothedVelocity);
    if (absVelocity > 0.0003 && this.autoDecayOnScroll && !this.isInspectMode) {
      const decay = 1.0 - Math.exp(-5.0 * safeDt);
      this.targetOrbitAzimuth *= (1.0 - decay);
      this.targetOrbitElevation *= (1.0 - decay);
      this.targetPanOffset.multiplyScalar(1.0 - decay);
      this.targetZoomRatio += (1.0 - this.targetZoomRatio) * decay;
    }

    // 1. Sample spline targets using dwell-mapped parameter tau
    this.posSpline.getPoint(tau, this.targetPosSample);
    this.targetSpline.getPoint(tau, this.targetLookAtSample);
    this.targetRoll = this.getTargetRoll(tau);

    // 1b. Apply interactive Pan in camera view plane to targetLookAtSample
    this.camera.matrixWorld.extractBasis(this.camRight, this.camUp, this.displacement);
    this.panVector.set(0, 0, 0);
    this.panVector.addScaledVector(this.camRight, this.currentPanOffset.x);
    this.panVector.addScaledVector(this.camUp, this.currentPanOffset.y);
    this.targetLookAtSample.add(this.panVector);

    // 1c. Apply interactive Orbit and Zoom relative to modified targetLookAtSample
    this.splineOffsetVector.subVectors(this.targetPosSample, this.targetLookAtSample);
    const baseRadius = Math.max(0.5, this.splineOffsetVector.length());
    const currentRadius = Math.max(0.8, Math.min(80.0, baseRadius * this.currentZoomRatio));

    // Spherical coordinates of base spline vector
    const baseElevation = Math.acos(Math.max(-0.999, Math.min(0.999, this.splineOffsetVector.y / baseRadius)));
    const baseAzimuth = Math.atan2(this.splineOffsetVector.x, this.splineOffsetVector.z);

    const finalElevation = Math.max(0.08, Math.min(Math.PI - 0.08, baseElevation + this.currentOrbitElevation));
    const finalAzimuth = baseAzimuth + this.currentOrbitAzimuth;

    const sinElev = Math.sin(finalElevation);
    this.orbitedOffset.set(
      currentRadius * sinElev * Math.sin(finalAzimuth),
      currentRadius * Math.cos(finalElevation),
      currentRadius * sinElev * Math.cos(finalAzimuth)
    );
    this.targetPosSample.copy(this.targetLookAtSample).add(this.orbitedOffset);

    // 2. Subtle FOV breathing (clamped to max 2 degrees, no whiplash snap)
    const warpEngaged = absVelocity > this.config.warpVelocityThreshold;
    if (warpEngaged) {
      const warpSpeed = (absVelocity - this.config.warpVelocityThreshold) * 60 * this.config.warpIntensity;
      this.targetFov = Math.min(this.config.baseFov + warpSpeed, this.config.warpFovMax);
    } else {
      this.targetFov = this.config.baseFov;
    }

    // 3. Critically damped spring integration for camera position:
    // pos += (target - pos) * (1 - exp(-lambda * dt))
    this.displacement.subVectors(this.targetPosSample, this.currentPos);
    const dist = this.displacement.length();

    // Speed clamp
    const maxStep = this.config.maxCameraSpeed * safeDt;
    if (dist > maxStep && dist > 0.0001) {
      this.displacement.multiplyScalar(maxStep / dist);
    }

    const posDamp = 1.0 - Math.exp(
      -(this.isInspectMode ? this.config.cameraDampLambda * 1.5 : this.config.cameraDampLambda) * safeDt
    );
    this.currentPos.addScaledVector(this.displacement, posDamp);

    // 4. Critically damped spring integration for look-at target:
    this.lookAtDisplacement.subVectors(this.targetLookAtSample, this.currentLookAt);
    const lookAtDamp = 1.0 - Math.exp(
      -(this.isInspectMode ? this.config.lookAtDampLambda * 1.5 : this.config.lookAtDampLambda) * safeDt
    );
    this.currentLookAt.addScaledVector(this.lookAtDisplacement, lookAtDamp);

    // 5. Smooth FOV and roll damping
    const scalarDamp = 1.0 - Math.exp(-6.0 * safeDt);
    this.currentFov += (this.targetFov - this.currentFov) * scalarDamp;
    this.currentRoll += (this.targetRoll - this.currentRoll) * scalarDamp;

    // 6. Apply position and orientation to camera
    this.camera.position.copy(this.currentPos);

    // Build lookAt orientation with roll without matrix allocations
    this.upVector.set(0, 1, 0);
    this.rotMatrix.lookAt(this.currentPos, this.currentLookAt, this.upVector);
    this.rotQuat.setFromRotationMatrix(this.rotMatrix);

    if (Math.abs(this.currentRoll) > 0.0005) {
      // Apply subtle Z roll in camera local space
      this.rollQuat.setFromAxisAngle(this.displacement.set(0, 0, 1), this.currentRoll);
      this.rotQuat.multiply(this.rollQuat);
    }

    this.camera.quaternion.copy(this.rotQuat);

    if (Math.abs(this.camera.fov - this.currentFov) > 0.01) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }

    // 7. Settle detection for render-on-demand
    const userIsMoving =
      Math.abs(this.targetOrbitAzimuth - this.currentOrbitAzimuth) > 0.001 ||
      Math.abs(this.targetOrbitElevation - this.currentOrbitElevation) > 0.001 ||
      Math.abs(this.targetZoomRatio - this.currentZoomRatio) > 0.005 ||
      this.targetPanOffset.distanceToSquared(this.currentPanOffset) > 0.001;

    const isMoving = dist > 0.0008 || this.lookAtDisplacement.length() > 0.0008 || absVelocity > 0.0002 || userIsMoving;
    this.settled = !isMoving;

    return {
      position: this.currentPos,
      target: this.currentLookAt,
      fov: this.currentFov,
      roll: this.currentRoll,
      isSettled: this.settled,
    };
  }

  // --- 3D Viewport Interaction Methods ---

  public addOrbitDelta(deltaAzimuth: number, deltaElevation: number): void {
    this.targetOrbitAzimuth += deltaAzimuth;
    // Clamp target elevation offset to prevent vertical flipping (+/- ~75 degrees)
    this.targetOrbitElevation = Math.max(-1.3, Math.min(1.3, this.targetOrbitElevation + deltaElevation));
  }

  public addPanDelta(deltaX: number, deltaY: number): void {
    this.targetPanOffset.x += deltaX;
    this.targetPanOffset.y += deltaY;
    // Bound pan range so camera doesn't fly off into infinity
    this.targetPanOffset.x = Math.max(-25, Math.min(25, this.targetPanOffset.x));
    this.targetPanOffset.y = Math.max(-20, Math.min(20, this.targetPanOffset.y));
  }

  public addZoomDelta(delta: number): void {
    // delta > 0 is zoom out, delta < 0 is zoom in
    const zoomMultiplier = 1.0 + delta;
    this.targetZoomRatio = Math.max(0.25, Math.min(3.5, this.targetZoomRatio * zoomMultiplier));
  }

  public setZoomRatio(ratio: number): void {
    this.targetZoomRatio = Math.max(0.25, Math.min(3.5, ratio));
  }

  public resetInteractiveOffsets(): void {
    this.targetOrbitAzimuth = 0;
    this.targetOrbitElevation = 0;
    this.targetPanOffset.set(0, 0);
    this.targetZoomRatio = 1.0;
  }

  public hasInteractiveOffsets(): boolean {
    return (
      Math.abs(this.targetOrbitAzimuth) > 0.005 ||
      Math.abs(this.targetOrbitElevation) > 0.005 ||
      this.targetPanOffset.lengthSq() > 0.005 ||
      Math.abs(this.targetZoomRatio - 1.0) > 0.01
    );
  }

  public setInspectMode(active: boolean): void {
    this.isInspectMode = active;
  }

  public getInspectMode(): boolean {
    return this.isInspectMode;
  }

  public setAutoDecayOnScroll(decay: boolean): void {
    this.autoDecayOnScroll = decay;
  }

  public getInteractiveState(): {
    orbitAzimuth: number;
    orbitElevation: number;
    zoomRatio: number;
    pan: { x: number; y: number };
    hasOffset: boolean;
    isInspectMode: boolean;
  } {
    return {
      orbitAzimuth: this.currentOrbitAzimuth,
      orbitElevation: this.currentOrbitElevation,
      zoomRatio: this.currentZoomRatio,
      pan: { x: this.currentPanOffset.x, y: this.currentPanOffset.y },
      hasOffset: this.hasInteractiveOffsets(),
      isInspectMode: this.isInspectMode,
    };
  }
}
