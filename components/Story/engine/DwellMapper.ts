import type { JourneyStation } from "../../../content/journey.ts";
import type { JourneyConfig } from "../../../content/journey.config.ts";

/**
 * Maps raw scroll progress (0..1) through configurable Dwell Plateaus.
 * During dwell windows, the camera rests completely at station centers.
 * During transition windows, progress ramps smoothly with quintic smootherstep.
 */
export class DwellMapper {
  private stations: JourneyStation[];
  private config: JourneyConfig;
  private stationCount: number;
  private currentHysteresisIndex: number = 0;

  constructor(stations: JourneyStation[], config: JourneyConfig) {
    this.stations = stations;
    this.config = config;
    this.stationCount = stations.length;
  }

  public updateConfig(config: JourneyConfig): void {
    this.config = config;
  }

  /**
   * Returns the canonical raw progress corresponding to a station rest center.
   */
  public getStationRawProgress(index: number): number {
    if (this.stationCount <= 1) return 0;
    return Math.max(0, Math.min(1, index / (this.stationCount - 1)));
  }

  /**
   * Quintic smootherstep easing (continuous 1st and 2nd derivatives).
   */
  private smootherstep(t: number): number {
    const clamped = Math.max(0, Math.min(1, t));
    return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
  }

  /**
   * Converts raw progress p in [0, 1] to mapped camera progress tau in [0, 1] with dwell plateaus.
   */
  public mapProgress(p: number): number {
    const N = this.stationCount;
    if (N <= 1) return 0;
    const clampedP = Math.max(0, Math.min(1, p));

    const totalSegments = N - 1;
    const scaled = clampedP * totalSegments;
    const segIdx = Math.min(Math.floor(scaled), totalSegments - 1);
    const u = scaled - segIdx; // 0..1 within current segment between station segIdx and segIdx + 1

    const stationA = this.stations[segIdx];
    const stationB = this.stations[segIdx + 1];

    const dwellA = this.config.stationDwellOverrides[stationA.id] ?? this.config.dwellFraction;
    const dwellB = this.config.stationDwellOverrides[stationB.id] ?? this.config.dwellFraction;

    // Split dwell between the two stations
    const startDwell = dwellA * 0.5;
    const endDwell = 1.0 - dwellB * 0.5;

    let segmentTau: number;

    if (u <= startDwell) {
      // Resting on station A's plateau
      segmentTau = 0;
    } else if (u >= endDwell) {
      // Resting on station B's plateau
      segmentTau = 1;
    } else {
      // Smooth eased transition between plateaus
      const travelFraction = (u - startDwell) / (endDwell - startDwell);
      segmentTau = this.smootherstep(travelFraction);
    }

    return (segIdx + segmentTau) / totalSegments;
  }

  /**
   * Determines active station index with hysteresis to eliminate boundary flicker.
   */
  public getStationIndexWithHysteresis(p: number): number {
    const N = this.stationCount;
    if (N <= 1) return 0;

    const clampedP = Math.max(0, Math.min(1, p));
    const totalSegments = N - 1;
    const exact = clampedP * totalSegments;
    const nearest = Math.round(exact);
    const distanceToNearest = Math.abs(exact - nearest);

    const h = this.config.hysteresisSpan;

    // Only switch if distance to nearest is well within boundary or significantly closer than current
    if (nearest === this.currentHysteresisIndex) {
      return this.currentHysteresisIndex;
    }

    // Switch when comfortably past the midpoint with hysteresis buffer
    if (distanceToNearest < 0.5 - h) {
      this.currentHysteresisIndex = nearest;
    }

    return this.currentHysteresisIndex;
  }

  /**
   * Checks if current scroll progress is within snap proximity of any station rest point.
   */
  public checkSnapProximity(p: number): {
    canSnap: boolean;
    targetProgress: number;
    stationIndex: number;
  } {
    const N = this.stationCount;
    if (N <= 1) {
      return { canSnap: false, targetProgress: 0, stationIndex: 0 };
    }

    const totalSegments = N - 1;
    const scaled = Math.max(0, Math.min(1, p)) * totalSegments;
    const nearestIdx = Math.round(scaled);
    const distance = Math.abs(scaled - nearestIdx); // Distance in station units (0..0.5)

    // Snap proximity is a fraction of a station's span (e.g. 0.30)
    const canSnap = distance > 0.005 && distance <= this.config.snapProximity;
    const targetProgress = nearestIdx / totalSegments;

    return {
      canSnap,
      targetProgress,
      stationIndex: nearestIdx,
    };
  }
}
