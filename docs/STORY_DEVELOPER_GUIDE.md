# 3D Story Landing — Developer Guide

This guide explains how to add or remove stations, configure timeline copy, adjust camera splines and presets, and manage the parallel writing lane for the scroll-driven 3D story traversal on `diundi.space`.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │                 Native Scroll                │
                      │         (800vh - 900vh Lenis Track)          │
                      └──────────────────────┬───────────────────────┘
                                             │ normalized progress p ∈ [0, 1]
                      ┌──────────────────────▼───────────────────────┐
                      │              StoryLanding.tsx                │
                      ├──────────────────────┬───────────────────────┤
                      │                      │                       │
           ┌──────────▼──────────┐ ┌─────────▼─────────┐ ┌───────────▼───────────┐
           │   StoryWorld.ts     │ │ StoryOverlay.tsx  │ │     YearRail.tsx      │
           │ (Three.js WebGL)    │ │ (DOM Text Layer)  │ │ (Right-side Ticker)   │
           └──────────┬──────────┘ └───────────────────┘ └───────────────────────┘
                      │
     ┌────────────────┼────────────────┬────────────────┐
     ▼                ▼                ▼                ▼
CameraController  Landmarks       ParallaxBackdrop  WarpEffect
(Catmull-Rom)    (10 Stations)   (Layered Ridges)  (Streak Lines)
```

- **Content & Config**: [`content/journey.ts`](file:///home/aditya/Antigravity/content/journey.ts)
- **World & Scene**: [`components/Story/world/StoryWorld.ts`](file:///home/aditya/Antigravity/components/Story/world/StoryWorld.ts)
- **Camera Spline**: [`components/Story/camera/CameraController.ts`](file:///home/aditya/Antigravity/components/Story/camera/CameraController.ts)
- **3D Landmarks**: [`components/Story/world/StationLandmarks.ts`](file:///home/aditya/Antigravity/components/Story/world/StationLandmarks.ts)
- **Overlay UI**: [`components/Story/ui/StoryOverlay.tsx`](file:///home/aditya/Antigravity/components/Story/ui/StoryOverlay.tsx)
- **Year Rail**: [`components/Story/ui/YearRail.tsx`](file:///home/aditya/Antigravity/components/Story/ui/YearRail.tsx)
- **Writing Lane**: [`components/Story/ui/WritingLane.tsx`](file:///home/aditya/Antigravity/components/Story/ui/WritingLane.tsx)
- **Accessible Fallback**: [`components/Story/ui/StoryTimelineFallback.tsx`](file:///home/aditya/Antigravity/components/Story/ui/StoryTimelineFallback.tsx)

---

## 1. Adding or Removing a Station

### Step 1: Add Station Entry in `content/journey.ts`
Add an item to the `JOURNEY_STATIONS` array:
```ts
{
  id: "new-station-id",
  kind: "product",
  dateStart: "Mar 2023",
  dateEnd: "Aug 2023",
  year: 2023,
  title: "New Station Title",
  line: "One punchy sentence describing what was created or discovered.",
  outcome: "+50% performance improvement",
  assetKey: "new_asset_key",
  cameraPreset: "pan-left", // "dolly-in" | "pan-left" | "pan-right" | "slow-orbit" | "pull-back" | "warp"
  openTarget: "case-study-slug", // ID in caseStudies.ts or null
  placeholder: false,
  enabled: true, // set to false to disable without deleting
}
```

### Step 2: Define 3D World Coordinates in `StationLandmarks.ts`
In `components/Story/world/StationLandmarks.ts`, define the station's 3D anchor and camera offsets:
```ts
export const STATION_COORDINATES: Record<string, StationTransform> = {
  // ...
  "new-station-id": {
    position: new THREE.Vector3(-10, 2, -230),
    cameraOffset: new THREE.Vector3(4, 2.5, 7.5),
    lookAtOffset: new THREE.Vector3(0, 0, 0),
  },
};
```

### Step 3: Add Visual Landmark Representation
In `StationLandmarks.ts`, add a build method:
```ts
private buildNewStation(group: THREE.Group): void {
  // Add boxes, planes, canvas textures, or loaded models
}
```
And register it in `switch (station.id)` inside `buildStations()`.

---

## 2. Tuning Camera Trajectory and Presets

The camera moves along a 3D centripetal Catmull-Rom spline generated automatically through each station's `position + cameraOffset`.

### Camera Presets
Each station specifies a `cameraPreset` in `content/journey.ts`:
- **`dolly-in`**: Pushes the camera forward into the landmark as scroll centers on the station (ideal for screens and focused objects).
- **`pan-left` / `pan-right`**: Displaces the camera laterally to open up whitespace for reading text overlay.
- **`slow-orbit`**: Gently arcs the camera around the landmark as you scroll through its threshold.
- **`pull-back` / `warp`**: Widens the frame and pulls back along Z for transitions and timeskips.

Tune preset damping in `CameraController.ts -> applyPreset()`.

---

## 3. Configuring the Parallel Writing Lane

The writing lane automatically surfaces notes, essays, or field journals matching the active station's year.
- **Static / Local**: Edit `DEFAULT_WRITING_ITEMS` in `content/journey.ts`.
- **Dynamic Feed**: Set `WRITING_FEED_URL` in `.env.local` to a JSON endpoint returning an array of `WritingItem` objects:
  ```json
  [
    {
      "id": "my-essay",
      "title": "On Quiet Software",
      "publishDate": "2024-03",
      "year": 2024,
      "url": "https://diundi.bearblog.dev/on-quiet-software/",
      "excerpt": "A short note on building tools with durable visual weight."
    }
  ]
  ```

---

## 4. Testing & Verification Shortcuts

- **URL Flags**:
  - `http://localhost:3000/story`: Direct story route.
  - `http://localhost:3000/?mode=story`: Home page in story mode.
  - `http://localhost:3000/story?debug=1`: Enables the real-time HUD with scroll progress, scroll velocity, active station ID, camera preset, and live FPS.
- **Keyboard Controls**:
  - `Space` / `PageDown` / `ArrowDown`: Step forward to next station.
  - `PageUp` / `ArrowUp`: Step back to previous station.
  - `Home`: Jump to station 0 (`boot`).
  - `End`: Jump to station 9 (`landing`).
- **Reduced Motion**:
  - Emulate in Chrome DevTools -> Rendering -> Emulate CSS media feature `prefers-reduced-motion: reduce`.
  - Automatically loads `<StoryTimelineFallback />` with zero WebGL overhead.
