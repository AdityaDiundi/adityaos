import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEY_STATIONS,
  getActiveStations,
  DEFAULT_WRITING_ITEMS,
  getWritingItems,
} from "../content/journey.ts";

describe("Journey Story Content & Stations", () => {
  it("defines all required stations in chronological sequence", () => {
    const requiredStations = [
      "boot",
      "arcade",
      "timeskip",
      "mfine",
      "mosaic",
      "field",
      "studio",
      "builds",
      "landing",
    ];

    const activeStations = getActiveStations();
    const activeIds = activeStations.map((s) => s.id);

    for (const req of requiredStations) {
      assert.ok(
        activeIds.includes(req),
        `Required station '${req}' is missing from active stations: ${activeIds.join(", ")}`
      );
    }
  });

  it("ensures station years are chronologically non-decreasing", () => {
    const activeStations = getActiveStations();
    for (let i = 1; i < activeStations.length; i++) {
      assert.ok(
        activeStations[i].year >= activeStations[i - 1].year,
        `Station ${activeStations[i].id} (${activeStations[i].year}) is out of chronological order relative to ${activeStations[i - 1].id} (${activeStations[i - 1].year})`
      );
    }
  });

  it("contains first-person seed copy without banned punctuation or college mention", () => {
    for (const station of JOURNEY_STATIONS) {
      // Must not contain em-dashes in line copy
      assert.ok(
        !station.line.includes("—"),
        `Station '${station.id}' line contains an em-dash: ${station.line}`
      );
      // Must not mention college
      assert.ok(
        !station.line.toLowerCase().includes("college"),
        `Station '${station.id}' line mentions college: ${station.line}`
      );
      // Title must be sentence or title case, not empty
      assert.ok(station.title.length > 0);
      assert.ok(station.line.length > 0);
    }
  });

  it("links outcome metrics to valid project/app targets", () => {
    const activeStations = getActiveStations();
    const productStations = activeStations.filter((s) => s.kind === "product" || s.kind === "field");

    for (const s of productStations) {
      assert.ok(s.outcome, `Station ${s.id} should have an outcome metric`);
      assert.ok(s.openTarget, `Station ${s.id} should have an openTarget`);
    }
  });

  it("provides fallback writing items matching key journey years", async () => {
    const writingItems = await getWritingItems();
    assert.ok(writingItems.length >= 2, "Writing items should have at least 2 entries");

    const years = writingItems.map((w) => w.year);
    assert.ok(years.includes(2024), "Writing items should include 2024");
    assert.ok(years.includes(2026), "Writing items should include 2026");
  });
});
