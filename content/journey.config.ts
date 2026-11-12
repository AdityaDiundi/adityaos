/**
 * AdityaOS 3D Story Journey — Feel & Engine Tuning Configuration
 * All parameters can be tuned in real-time via the ?debug=1 tuning panel on localhost.
 */

export interface JourneyConfig {
  // A. Scroll & Page Geometry
  totalScrollLengthVhDesktop: number; // Tall spacer height on desktop (default: 600vh)
  totalScrollLengthVhMobile: number;  // Shorter spacer height on mobile (default: 400vh)
  lenisLerp: number;                  // Lenis interpolation damping (default: 0.09)
  lenisWheelMultiplier: number;       // Wheel input multiplier (default: 1.0)
  syncTouch: boolean;                 // Whether Lenis syncs touch on mobile (default: false for native touch)

  // B. Progress & Dwell Plateaus
  dwellFraction: number;              // Plateau fraction where camera rests per station (default: 0.35)
  stationDwellOverrides: Record<string, number>; // Per-station dwell overrides if needed
  hysteresisSpan: number;             // Station index transition hysteresis to prevent boundary flicker (default: 0.04)

  // C. Camera Physics & Spring
  cameraDampLambda: number;           // Critically damped spring speed: pos += (target - pos) * (1 - e^(-lambda * dt)) (default: 7.0)
  lookAtDampLambda: number;           // Look-at target damping lambda (default: 8.5)
  maxCameraSpeed: number;             // Speed clamp (world units/sec) to avoid violent moves (default: 80.0)
  baseFov: number;                    // Normal resting FOV (default: 48.0)
  maxRollDegrees: number;             // Maximum lateral roll angle (default: 3.5 deg)

  // D. Warp & Speed Effects
  warpVelocityThreshold: number;      // Scroll velocity threshold to engage warp streaks and FOV widen (default: 0.0035)
  warpFovMax: number;                 // Maximum FOV during warp (default: 68.0)
  warpIntensity: number;              // Multiplier for streak opacity and length (default: 1.0)

  // E. Settle & Snap
  snapProximity: number;              // Snap radius around station rest point (default: 0.30 of station span)
  snapDelayMs: number;                // Inactivity delay before settling eases to nearest station (default: 260ms)
  snapDurationSec: number;            // Duration of settle ease (default: 1.1s)

  // F. Performance & Rendering
  dprCapDesktop: number;              // Maximum Device Pixel Ratio on desktop (default: 1.5)
  dprCapMobile: number;               // Maximum Device Pixel Ratio on mobile (default: 1.25)
  renderScale: number;                // Internal resolution render scale (default: 1.0)
  autoScaleEnabled: boolean;          // Auto-lower render scale if p95 frame time > 20ms for 2s (default: true)
  skipRenderWhenSettled: boolean;     // Skip Three.js render calls when settled and not moving (default: true)
}

export const DEFAULT_JOURNEY_CONFIG: JourneyConfig = {
  totalScrollLengthVhDesktop: 1350, // ~150vh per station so milestones don't flash by
  totalScrollLengthVhMobile: 850,
  lenisLerp: 0.065,                 // Smooth weighted glide with controlled momentum
  lenisWheelMultiplier: 0.85,       // Controlled wheel step to prevent accidental skips
  syncTouch: false,

  dwellFraction: 0.52,              // Generous 52% dwell plateau for reading & inspecting
  stationDwellOverrides: {
    boot: 0.60,
    timeskip: 0.40,
    landing: 0.60,
  },
  hysteresisSpan: 0.04,

  cameraDampLambda: 5.5,            // Silky cinematic camera spring convergence
  lookAtDampLambda: 6.5,
  maxCameraSpeed: 45.0,             // Clamped to avoid fast whiplash fly-throughs
  baseFov: 48.0,
  maxRollDegrees: 0.0,              // Strictly level horizon

  warpVelocityThreshold: 0.008,     // Engages only during rapid continuous scrolling
  warpFovMax: 50.0,                 // Subtle 2-degree max expansion, zero distortion
  warpIntensity: 0.25,

  snapProximity: 0.35,              // Gently eases into station rest when user stops near
  snapDelayMs: 300,
  snapDurationSec: 1.2,

  dprCapDesktop: 1.5,
  dprCapMobile: 1.25,
  renderScale: 1.0,
  autoScaleEnabled: true,
  skipRenderWhenSettled: true,
};
