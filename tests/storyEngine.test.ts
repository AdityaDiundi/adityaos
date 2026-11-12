import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { getActiveStations } from "../content/journey.ts";
import { DEFAULT_JOURNEY_CONFIG } from "../content/journey.config.ts";
import { DwellMapper } from "../components/Story/engine/DwellMapper.ts";
import { SpringCamera } from "../components/Story/engine/SpringCamera.ts";

describe("Story Engine: DwellMapper & Plateaus", () => {
  const stations = getActiveStations();
  const mapper = new DwellMapper(stations, DEFAULT_JOURNEY_CONFIG);

  it("holds mapped tau constant at station centers during dwell windows", () => {
    const N = stations.length;
    for (let i = 0; i < N; i++) {
      const centerP = mapper.getStationRawProgress(i);
      const expectedTau = i / (N - 1);

      // Center
      const tauCenter = mapper.mapProgress(centerP);
      assert.ok(
        Math.abs(tauCenter - expectedTau) < 0.0001,
        `Station ${i} center tau ${tauCenter} should equal ${expectedTau}`
      );

      // Within dwell window (e.g. +/- 10% of span)
      const span = 1 / (N - 1);
      const dwellOffset = (DEFAULT_JOURNEY_CONFIG.dwellFraction * span) * 0.4;
      const tauLeft = mapper.mapProgress(Math.max(0, centerP - dwellOffset));
      const tauRight = mapper.mapProgress(Math.min(1, centerP + dwellOffset));

      assert.ok(
        Math.abs(tauLeft - expectedTau) < 0.0001,
        `Station ${i} left dwell plateau ${tauLeft} should equal ${expectedTau}`
      );
      assert.ok(
        Math.abs(tauRight - expectedTau) < 0.0001,
        `Station ${i} right dwell plateau ${tauRight} should equal ${expectedTau}`
      );
    }
  });

  it("produces strictly monotonic progression across the entire track", () => {
    let lastTau = -1;
    for (let p = 0; p <= 1.0; p += 0.005) {
      const tau = mapper.mapProgress(p);
      assert.ok(
        tau >= lastTau - 0.00001,
        `Tau decreased at p=${p}: ${tau} < ${lastTau}`
      );
      lastTau = tau;
    }
  });

  it("prevents boundary flicker using hysteresis", () => {
    const N = stations.length;
    const span = 1 / (N - 1);
    const midPoint = span * 0.5;

    // Approaching midpoint from left
    const idx1 = mapper.getStationIndexWithHysteresis(midPoint - span * 0.02);
    assert.equal(idx1, 0, "Should remain on station 0 before crossing hysteresis threshold");

    // Crossing midpoint slightly (within 2% buffer)
    const idx2 = mapper.getStationIndexWithHysteresis(midPoint + span * 0.02);
    assert.equal(idx2, 0, "Should still remain on station 0 due to hysteresis buffer");

    // Crossing solidly past midpoint (past hysteresis buffer)
    const idx3 = mapper.getStationIndexWithHysteresis(midPoint + span * 0.15);
    assert.equal(idx3, 1, "Should transition to station 1 once solidly past buffer");
  });

  it("correctly identifies snap proximity targets", () => {
    const N = stations.length;
    const span = 1 / (N - 1);

    // Far from rest point: should not snap
    const checkFar = mapper.checkSnapProximity(span * 0.5);
    assert.equal(checkFar.canSnap, false);

    // Close to station 1 rest point (e.g. 15% offset): should snap
    const checkClose = mapper.checkSnapProximity(span + span * 0.15);
    assert.equal(checkClose.canSnap, true);
    assert.equal(checkClose.stationIndex, 1);
    assert.ok(Math.abs(checkClose.targetProgress - span) < 0.0001);
  });
});

describe("SpringCamera: 3D Viewport Orbit, Pan, and Zoom Interaction", () => {
  const stations = getActiveStations();

  it("initializes with zero interactive offsets and pure spline alignment", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    assert.equal(springCam.hasInteractiveOffsets(), false);
    const state = springCam.getInteractiveState();
    assert.equal(state.orbitAzimuth, 0);
    assert.equal(state.orbitElevation, 0);
    assert.equal(state.zoomRatio, 1.0);
    assert.equal(state.pan.x, 0);
    assert.equal(state.pan.y, 0);
  });

  it("modulates camera position with orbit offsets around the station anchor", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    // Initial update at station 0
    const initial = springCam.update(0, 0, 0.1);
    const initialPos = initial.position.clone();

    // Orbit 45 degrees horizontally
    springCam.addOrbitDelta(Math.PI / 4, 0);
    assert.equal(springCam.hasInteractiveOffsets(), true);

    // Step physics forward
    let stepped = initial;
    for (let i = 0; i < 20; i++) {
      stepped = springCam.update(0, 0, 0.016);
    }

    assert.ok(
      Math.abs(stepped.position.x - initialPos.x) > 0.1,
      "Camera X position should displace during horizontal orbit"
    );
  });

  it("pans target across the view plane", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    const initial = springCam.update(0, 0, 0.1);
    const initialTarget = initial.target.clone();

    // Pan 5 units horizontally, 3 units vertically
    springCam.addPanDelta(5, 3);
    for (let i = 0; i < 20; i++) {
      springCam.update(0, 0, 0.016);
    }

    const state = springCam.getInteractiveState();
    assert.ok(state.pan.x > 3, "Pan X should be updated");
    assert.ok(state.pan.y > 1.5, "Pan Y should be updated");
  });

  it("zooms in and out by scaling camera distance", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    springCam.update(0, 0, 0.1);

    // Zoom in (delta < 0)
    springCam.addZoomDelta(-0.4);
    assert.ok(springCam.hasInteractiveOffsets());

    for (let i = 0; i < 20; i++) {
      springCam.update(0, 0, 0.016);
    }
    const zoomInState = springCam.getInteractiveState();
    assert.ok(zoomInState.zoomRatio < 0.9, "Zoom ratio should decrease when zooming in");

    // Zoom out
    springCam.addZoomDelta(0.8);
    for (let i = 0; i < 20; i++) {
      springCam.update(0, 0, 0.016);
    }
    const zoomOutState = springCam.getInteractiveState();
    assert.ok(zoomOutState.zoomRatio > 1.0, "Zoom ratio should increase when zooming out");
  });

  it("resets all interactive offsets back to track on resetInteractiveOffsets()", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    springCam.addOrbitDelta(0.5, 0.3);
    springCam.addPanDelta(2, -2);
    springCam.addZoomDelta(-0.3);
    assert.equal(springCam.hasInteractiveOffsets(), true);

    springCam.resetInteractiveOffsets();
    assert.equal(springCam.hasInteractiveOffsets(), false);

    // After spring convergence, values should converge to 0 and zoom to 1.0
    for (let i = 0; i < 30; i++) {
      springCam.update(0, 0, 0.016);
    }
    const state = springCam.getInteractiveState();
    assert.ok(Math.abs(state.orbitAzimuth) < 0.01);
    assert.ok(Math.abs(state.zoomRatio - 1.0) < 0.01);
  });

  it("preserves offsets when inspect mode is active during scroll", () => {
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 1000);
    const springCam = new SpringCamera(cam, stations, DEFAULT_JOURNEY_CONFIG);

    springCam.addOrbitDelta(0.8, 0.2);
    springCam.setInspectMode(true);
    assert.equal(springCam.getInspectMode(), true);

    // Simulate high scroll velocity
    for (let i = 0; i < 15; i++) {
      springCam.update(0.2, 0.005, 0.016);
    }

    const state = springCam.getInteractiveState();
    assert.ok(state.orbitAzimuth > 0.5, "Inspect mode should prevent scroll decay");
  });
});

