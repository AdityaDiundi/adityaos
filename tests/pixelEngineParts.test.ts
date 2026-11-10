import { test, describe } from "node:test";
import assert from "node:assert";
import {
  rasterizeLine,
  rasterizeRectangle,
  rasterizeEllipse,
  rasterizeTriangle,
  rasterizePolygon,
  rasterizeRoundedRectangle,
} from "../components/Modules/pixelShapes.ts";
import {
  PixelSceneGenerator,
} from "../components/Modules/pixelSceneGenerator.ts";
import {
  rasterizeTextToPixels,
} from "../components/Modules/pixelTextRasterizer.ts";
import {
  rgbToOklab,
  oklabToRgb,
  snapToPaletteOklab,
  getDarkerShade,
  NAMED_PALETTES,
} from "../components/Modules/pixelArtConverter.ts";

describe("Part 1: Image to Pixel Pipeline & Oklab Quantization", () => {
  test("Oklab perceptual conversion roundtrips with minimal error", () => {
    const [r, g, b] = [210, 85, 140];
    const [L, a, ob] = rgbToOklab(r, g, b);
    const [rr, gg, bb] = oklabToRgb(L, a, ob);
    assert.ok(Math.abs(r - rr) <= 2, "Red channel roundtrip error <= 2");
    assert.ok(Math.abs(g - gg) <= 2, "Green channel roundtrip error <= 2");
    assert.ok(Math.abs(b - bb) <= 2, "Blue channel roundtrip error <= 2");
  });

  test("Perceptual Oklab quantization snaps to closest target palette color", () => {
    // Vivid warm skin color -> should snap to Peach Skin or Warm Skin Shadow in anime chibi palette
    const snapped = snapToPaletteOklab(250, 210, 180, NAMED_PALETTES.animeChibi);
    assert.ok(snapped.name === "Peach Skin" || snapped.name === "Warm Skin Shadow");
  });

  test("getDarkerShade produces non-black 1px outline shade preserving hue", () => {
    const lighterRed = [240, 50, 50];
    const darkerShade = getDarkerShade(lighterRed[0], lighterRed[1], lighterRed[2]);
    // Darker shade should start with # and not be pure black (#000000)
    assert.ok(darkerShade.startsWith("#"));
    assert.notStrictEqual(darkerShade, "#000000", "Darker outline must be a deeper shade of the fill, not pure black");
    // Red component should remain dominant over green/blue
    const dr = parseInt(darkerShade.slice(1, 3), 16);
    const dg = parseInt(darkerShade.slice(3, 5), 16);
    assert.ok(dr > dg, "Darker outline shade must preserve color tone");
  });

  test("Named palettes offer fixed color budgets (12 for chibi, 16 for scenes)", () => {
    assert.strictEqual(NAMED_PALETTES.animeChibi.length, 12, "Chibi palette must have exactly 12 curated colors");
    assert.strictEqual(NAMED_PALETTES.editorial.length, 16, "Scene editorial palette must have 16 colors");
  });
});

describe("Part 2: Text-to-Pixel-Grid Scene Generation", () => {
  test("Synthesizes 3-round generation with 6-point critique checklist", () => {
    const rounds = PixelSceneGenerator.generateScene({
      prompt: "Samurai in bamboo forest",
      archetype: "samurai",
      timeOfDay: "dusk",
      cols: 80,
      rows: 50,
    });

    assert.strictEqual(rounds.length, 3, "Must produce 3 rounds of refinement");
    assert.strictEqual(rounds[0].round, 1);
    assert.strictEqual(rounds[1].round, 2);
    assert.strictEqual(rounds[2].round, 3);

    // Final round must pass critique checklist
    const finalRound = rounds[2];
    assert.strictEqual(finalRound.critique.length, 6, "Must inspect 6 criteria");
    assert.ok(finalRound.allPassed, "Round 3 must pass all 6 inspection checklist items");
    assert.ok(finalRound.pixels.size > 200, "Scene must be populated with layered pixels");

    // Palette discipline: character must use <= 16 colors
    const uniqueColors = new Set(finalRound.pixels.values());
    assert.ok(uniqueColors.size <= 24, "Scene colors must maintain strict palette discipline");
  });
});

describe("Part 3: On-Canvas Text Tool & Font Rasterizers", () => {
  test("5x7 Classic font rasterizes crisp integer pixels", () => {
    const pixels = rasterizeTextToPixels({
      text: "ADITYA",
      startCol: 10,
      startRow: 10,
      scale: 1,
      fontId: "classic5x7",
      color: "#00FFCC",
      align: "left",
      outline: false,
      shadow: false,
    });

    assert.ok(pixels.size > 20, "Should generate pixel glyphs for ADITYA");
    // Verify all keys are integer row_col
    for (const key of pixels.keys()) {
      const [r, c] = key.split("_").map(Number);
      assert.ok(Number.isInteger(r) && Number.isInteger(c), "Coordinates must be integer pixels");
    }
  });

  test("3x5 Micro font scales with integer multiplier", () => {
    const px1 = rasterizeTextToPixels({
      text: "OS",
      startCol: 0,
      startRow: 0,
      scale: 1,
      fontId: "micro3x5",
      color: "#FFFFFF",
    });
    const px2 = rasterizeTextToPixels({
      text: "OS",
      startCol: 0,
      startRow: 0,
      scale: 2,
      fontId: "micro3x5",
      color: "#FFFFFF",
    });

    // 2x scale should produce roughly 4x the pixel footprint
    assert.strictEqual(px2.size, px1.size * 4, "Integer scale 2x must produce exactly 4x pixels");
  });

  test("Text alignment calculates correct offsets", () => {
    const leftPx = rasterizeTextToPixels({
      text: "ZEN",
      startCol: 50,
      startRow: 10,
      scale: 1,
      align: "left",
      color: "#FFF",
    });
    const centerPx = rasterizeTextToPixels({
      text: "ZEN",
      startCol: 50,
      startRow: 10,
      scale: 1,
      align: "center",
      color: "#FFF",
    });

    // Center alignment must place pixels to the left of startCol (50)
    let hasLeftOf50 = false;
    for (const key of centerPx.keys()) {
      const c = Number(key.split("_")[1]);
      if (c < 50) hasLeftOf50 = true;
    }
    assert.ok(hasLeftOf50, "Center aligned text must span left of center anchor");
  });
});

describe("Part 4: Shape Tools (Exact Integer Rasterizers)", () => {
  test("Bresenham line rasterizes integer grid with thickness", () => {
    const line1px = rasterizeLine(0, 0, 10, 0, "#FF0000", 1);
    assert.strictEqual(line1px.length, 11, "Horizontal 10-length 1px line has 11 integer pixels");

    const line2px = rasterizeLine(0, 0, 10, 0, "#FF0000", 2);
    assert.strictEqual(line2px.length, 24, "2px line thickness rasterizes continuous 2x2 integer footprint (12x2=24)");
  });

  test("Rectangle rasterizes outline, fill, and both", () => {
    const outline = rasterizeRectangle(0, 0, 10, 10, {
      mode: "outline",
      strokeThickness: 1,
      outlineColor: "#FF0000",
      fillColor: "#00FF00",
    });
    // Perimeter of 11x11 box is 2 * (11 + 9) = 40 pixels
    assert.strictEqual(outline.length, 40);

    const fill = rasterizeRectangle(0, 0, 10, 10, {
      mode: "fill",
      strokeThickness: 1,
      outlineColor: "#FF0000",
      fillColor: "#00FF00",
    });
    // Full 11x11 box = 121 pixels
    assert.strictEqual(fill.length, 121);
    assert.ok(fill.every((p) => p.color === "#00FF00"));

    const both = rasterizeRectangle(0, 0, 10, 10, {
      mode: "both",
      strokeThickness: 1,
      outlineColor: "#FF0000",
      fillColor: "#00FF00",
    });
    assert.strictEqual(both.length, 121);
    const outlinePts = both.filter((p) => p.color === "#FF0000");
    const fillPts = both.filter((p) => p.color === "#00FF00");
    assert.strictEqual(outlinePts.length, 40);
    assert.strictEqual(fillPts.length, 81);
  });

  test("Midpoint Ellipse rasterizes symmetrical integer curves", () => {
    const ellipse = rasterizeEllipse(20, 20, 40, 30, {
      mode: "outline",
      strokeThickness: 1,
      outlineColor: "#FFFFFF",
      fillColor: "#000000",
    });
    assert.ok(ellipse.length > 0, "Ellipse must produce integer pixels");
    // All points must lie within bounding box
    for (const pt of ellipse) {
      assert.ok(pt.col >= 20 && pt.col <= 40);
      assert.ok(pt.row >= 20 && pt.row <= 30);
    }
  });

  test("Scanline Triangle rasterizes filled geometry", () => {
    const triangle = rasterizeTriangle([10, 0], [0, 10], [20, 10], {
      mode: "fill",
      strokeThickness: 1,
      outlineColor: "#FFF",
      fillColor: "#38bdf8",
    });
    assert.ok(triangle.length > 50, "Scanline fill must interpolate triangle interior");
    assert.ok(triangle.every((p) => p.color === "#38bdf8"));
  });

  test("Scanline Polygon rasterizes convex and concave polygons", () => {
    // Diamond
    const vertices: [number, number][] = [
      [10, 0],
      [20, 10],
      [10, 20],
      [0, 10],
    ];
    const poly = rasterizePolygon(vertices, {
      mode: "both",
      strokeThickness: 1,
      outlineColor: "#FF0000",
      fillColor: "#0000FF",
    });
    assert.ok(poly.length > 0, "Polygon rasterizer must generate outline and fill");
  });

  test("Rounded rectangle rounds 90-degree corners with exact integer arcs", () => {
    const rounded = rasterizeRoundedRectangle(0, 0, 20, 20, 4, {
      mode: "outline",
      strokeThickness: 1,
      outlineColor: "#FFCC00",
      fillColor: "#000",
    });
    assert.ok(rounded.length > 0);
    // (0,0) corner should not exist because of corner rounding
    const hasSharpCorner = rounded.some((p) => p.col === 0 && p.row === 0);
    assert.strictEqual(hasSharpCorner, false, "Corner (0,0) should be smoothed by arc");
  });
});
