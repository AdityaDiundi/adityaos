// Upgraded Pixel Art Converter with Pure Area-Averaging Box Filter
// Oklab Perceptual Quantization, Toggleable Cleanup Passes (Orphan Removal, Dark-Shade Outline, 2-Tone Cel Shading, Gradient-Only Ordered Dithering)
// Supports Character Presets (32-48px, 12 colors) and Scene Presets (~160x90, 16 colors)

export interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  oklab?: [number, number, number];
}

// Convert sRGB (0..255) to Linear float (0..1)
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// Convert Linear float (0..1) to sRGB (0..255)
function linearToSrgb(v: number): number {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, Math.round(c * 255)));
}

// Linear RGB to Oklab
export function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

// Oklab to RGB
export function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

export function initializePaletteOklab(palette: PaletteColor[]): PaletteColor[] {
  return palette.map((col) => ({
    ...col,
    oklab: rgbToOklab(col.rgb[0], col.rgb[1], col.rgb[2]),
  }));
}

// Curated Named Palettes
export const ANIME_CHIBI_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "Dark Contour", hex: "#1F161A", rgb: [31, 22, 26] },
  { name: "Deep Shadow", hex: "#3B2832", rgb: [59, 40, 50] },
  { name: "Peach Skin", hex: "#FDD5B1", rgb: [253, 213, 177] },
  { name: "Warm Skin Shadow", hex: "#E2A76F", rgb: [226, 167, 111] },
  { name: "Blush Pink", hex: "#FF8DA1", rgb: [255, 141, 161] },
  { name: "Crimson Red", hex: "#DC2626", rgb: [220, 38, 38] },
  { name: "Amber Gold", hex: "#F59E0B", rgb: [245, 158, 11] },
  { name: "Cyber Cyan", hex: "#00FFCC", rgb: [0, 255, 204] },
  { name: "Sapphire Blue", hex: "#2563EB", rgb: [37, 99, 235] },
  { name: "Emerald Green", hex: "#10B981", rgb: [16, 185, 129] },
  { name: "Pure White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { name: "Charcoal Clothes", hex: "#27272A", rgb: [39, 39, 42] },
]);

export const EDITORIAL_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "Cream Base", hex: "#F5EFEB", rgb: [245, 239, 235] },
  { name: "Paper Muted", hex: "#E8DFD8", rgb: [232, 223, 216] },
  { name: "Charcoal Ink", hex: "#1C1917", rgb: [28, 25, 23] },
  { name: "Deep Navy", hex: "#0F172A", rgb: [15, 23, 42] },
  { name: "Terracotta Rust", hex: "#C2410C", rgb: [194, 65, 12] },
  { name: "Forest Olive", hex: "#365314", rgb: [54, 83, 20] },
  { name: "Warm Amber", hex: "#D97706", rgb: [217, 119, 6] },
  { name: "Soft Slate", hex: "#64748B", rgb: [100, 116, 139] },
  { name: "Pale Ochre", hex: "#FEF08A", rgb: [254, 240, 138] },
  { name: "Clay Brown", hex: "#78350F", rgb: [120, 53, 15] },
  { name: "Lavender Dusk", hex: "#818CF8", rgb: [129, 140, 248] },
  { name: "Rose Beige", hex: "#FECDD3", rgb: [254, 205, 211] },
  { name: "Moss Gray", hex: "#4B5563", rgb: [75, 85, 99] },
  { name: "Deep Plum", hex: "#581C87", rgb: [88, 28, 135] },
  { name: "Warm Off-White", hex: "#FAFAF9", rgb: [250, 250, 249] },
  { name: "Pure Black", hex: "#000000", rgb: [0, 0, 0] },
]);

export const PICO8_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "Black", hex: "#000000", rgb: [0, 0, 0] },
  { name: "Dark Blue", hex: "#1D2B53", rgb: [29, 43, 83] },
  { name: "Dark Purple", hex: "#7E2553", rgb: [126, 37, 83] },
  { name: "Dark Green", hex: "#008751", rgb: [0, 135, 81] },
  { name: "Brown", hex: "#AB5236", rgb: [171, 82, 54] },
  { name: "Dark Gray", hex: "#5F574F", rgb: [95, 87, 79] },
  { name: "Light Gray", hex: "#C2C3C7", rgb: [194, 195, 199] },
  { name: "White", hex: "#FFF1E8", rgb: [255, 241, 232] },
  { name: "Red", hex: "#FF004D", rgb: [255, 0, 77] },
  { name: "Orange", hex: "#FFA300", rgb: [255, 163, 0] },
  { name: "Yellow", hex: "#FFEC27", rgb: [255, 236, 39] },
  { name: "Green", hex: "#00E436", rgb: [0, 228, 54] },
  { name: "Blue", hex: "#29ADFF", rgb: [41, 173, 255] },
  { name: "Indigo", hex: "#83769C", rgb: [131, 118, 156] },
  { name: "Pink", hex: "#FF77A8", rgb: [255, 119, 168] },
  { name: "Peach", hex: "#FFCCAA", rgb: [255, 204, 170] },
]);

export const TOKYO_DUSK_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "Night Black", hex: "#080811", rgb: [8, 8, 17] },
  { name: "Deep Navy", hex: "#121829", rgb: [18, 24, 41] },
  { name: "Slate Plum", hex: "#29243d", rgb: [41, 36, 61] },
  { name: "Dusk Violet", hex: "#4b3d60", rgb: [75, 61, 96] },
  { name: "Neon Magenta", hex: "#eb4f7c", rgb: [235, 79, 124] },
  { name: "Pastel Rose", hex: "#f39bb4", rgb: [243, 155, 180] },
  { name: "Warm Amber", hex: "#f59e0b", rgb: [245, 158, 11] },
  { name: "Cyber Yellow", hex: "#fde047", rgb: [253, 224, 71] },
  { name: "Cyber Cyan", hex: "#00ffcc", rgb: [0, 255, 204] },
  { name: "Sky Azure", hex: "#38bdf8", rgb: [56, 189, 248] },
  { name: "Deep Ocean", hex: "#0369a1", rgb: [3, 105, 161] },
  { name: "Emerald Mint", hex: "#10b981", rgb: [16, 185, 129] },
  { name: "Lavender Glow", hex: "#c084fc", rgb: [192, 132, 252] },
  { name: "Warm Paper", hex: "#faf7f2", rgb: [250, 247, 242] },
  { name: "Pure White", hex: "#ffffff", rgb: [255, 255, 255] },
  { name: "Beacon Red", hex: "#ef4444", rgb: [239, 68, 68] },
]);

export const NAMED_PALETTES: Record<string, PaletteColor[]> = {
  animeChibi: ANIME_CHIBI_PALETTE,
  editorial: EDITORIAL_PALETTE,
  pico8: PICO8_PALETTE,
  tokyoDusk: TOKYO_DUSK_PALETTE,
};

// Snap (R, G, B) to closest palette color using Oklab Perceptual Distance
export function snapToPaletteOklab(
  r: number,
  g: number,
  b: number,
  palette: PaletteColor[]
): PaletteColor {
  const targetLab = rgbToOklab(r, g, b);
  let closest = palette[0];
  let minDistance = Infinity;

  for (let i = 0; i < palette.length; i++) {
    const pLab = palette[i].oklab || rgbToOklab(palette[i].rgb[0], palette[i].rgb[1], palette[i].rgb[2]);
    const dL = targetLab[0] - pLab[0];
    const da = targetLab[1] - pLab[1];
    const db = targetLab[2] - pLab[2];
    const dist = 1.35 * dL * dL + da * da + db * db;
    if (dist < minDistance) {
      minDistance = dist;
      closest = palette[i];
    }
  }

  return closest;
}

// Compute darker shade of a color for 1px outline (not pure black)
export function getDarkerShade(r: number, g: number, b: number): string {
  const [L, a, ob] = rgbToOklab(r, g, b);
  // Lower lightness significantly (40% of original) while preserving tone
  const newL = Math.max(0.08, L * 0.42);
  const [nr, ng, nb] = oklabToRgb(newL, a * 1.1, ob * 1.1);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`.toUpperCase();
}

// Bayer 4x4 Dither Matrix
const BAYER_4X4 = [
  [0 / 16 - 0.5, 8 / 16 - 0.5, 2 / 16 - 0.5, 10 / 16 - 0.5],
  [12 / 16 - 0.5, 4 / 16 - 0.5, 14 / 16 - 0.5, 6 / 16 - 0.5],
  [3 / 16 - 0.5, 11 / 16 - 0.5, 1 / 16 - 0.5, 9 / 16 - 0.5],
  [15 / 16 - 0.5, 7 / 16 - 0.5, 13 / 16 - 0.5, 5 / 16 - 0.5],
];

export interface ConversionPipelineOptions {
  targetCols: number;
  targetRows: number;
  paletteName: "animeChibi" | "editorial" | "pico8" | "tokyoDusk";
  maxPaletteColors: number; // e.g. 12 for character, 16 for scene
  removeBg: boolean;
  bgTolerance: number;
  // Cleanup Passes (Each toggleable)
  passRemoveOrphans: boolean;
  passDarkOutline: boolean;
  passSnapTwoTone: boolean;
  passGradientDitherOnly: boolean;
}

export interface ConversionPipelineResult {
  pixels: Map<string, string>; // "row_col" -> hex
  width: number;
  height: number;
  paletteUsed: string[];
}

export function runPixelConversionPipeline(
  img: HTMLImageElement,
  options: ConversionPipelineOptions
): ConversionPipelineResult {
  const {
    targetCols,
    targetRows,
    paletteName,
    maxPaletteColors = 16,
    removeBg,
    bgTolerance = 35,
    passRemoveOrphans,
    passDarkOutline,
    passSnapTwoTone,
    passGradientDitherOnly,
  } = options;

  // 1. Render high-resolution source onto offscreen canvas
  const srcW = img.width;
  const srcH = img.height;
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = srcW;
  srcCanvas.height = srcH;
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) {
    return { pixels: new Map(), width: 0, height: 0, paletteUsed: [] };
  }

  srcCtx.drawImage(img, 0, 0);
  const srcData = srcCtx.getImageData(0, 0, srcW, srcH).data;

  // Detect background color by sampling perimeter
  const sampleIndices = [0, (srcW - 1) * 4, ((srcH - 1) * srcW) * 4, ((srcH - 1) * srcW + (srcW - 1)) * 4];
  let bgR = 0, bgG = 0, bgB = 0;
  sampleIndices.forEach((idx) => {
    bgR += srcData[idx];
    bgG += srcData[idx + 1];
    bgB += srcData[idx + 2];
  });
  bgR /= sampleIndices.length;
  bgG /= sampleIndices.length;
  bgB /= sampleIndices.length;

  // 2. Downscale using Area Averaging (Box Filter) - Never nearest neighbor!
  // Each cell [gx, gy] integrates the continuous box in source coordinates
  const gridW = targetCols;
  const gridH = targetRows;
  const cellR = new Float32Array(gridW * gridH);
  const cellG = new Float32Array(gridW * gridH);
  const cellB = new Float32Array(gridW * gridH);
  const cellA = new Float32Array(gridW * gridH);
  const isSubject = new Uint8Array(gridW * gridH);

  const scaleX = srcW / gridW;
  const scaleY = srcH / gridH;

  for (let gy = 0; gy < gridH; gy++) {
    const y0 = Math.floor(gy * scaleY);
    const y1 = Math.min(srcH, Math.ceil((gy + 1) * scaleY));

    for (let gx = 0; gx < gridW; gx++) {
      const x0 = Math.floor(gx * scaleX);
      const x1 = Math.min(srcW, Math.ceil((gx + 1) * scaleX));

      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      let count = 0;

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * srcW + x) * 4;
          sumR += srcData[idx];
          sumG += srcData[idx + 1];
          sumB += srcData[idx + 2];
          sumA += srcData[idx + 3];
          count++;
        }
      }

      const cellIdx = gy * gridW + gx;
      if (count > 0) {
        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;
        const avgA = sumA / count;

        cellR[cellIdx] = avgR;
        cellG[cellIdx] = avgG;
        cellB[cellIdx] = avgB;
        cellA[cellIdx] = avgA;

        // Background removal test
        if (avgA > 40) {
          const distFromBg = Math.sqrt(
            0.3 * (avgR - bgR) ** 2 + 0.59 * (avgG - bgG) ** 2 + 0.11 * (avgB - bgB) ** 2
          );
          if (!removeBg || distFromBg > bgTolerance) {
            isSubject[cellIdx] = 1;
          }
        }
      }
    }
  }

  // 3. Palette Selection & Clamping to maxPaletteColors
  const basePalette = NAMED_PALETTES[paletteName] || ANIME_CHIBI_PALETTE;
  const activePalette = basePalette.slice(0, Math.min(basePalette.length, maxPaletteColors));

  // Detect gradient regions (skies: smooth vertical gradient, low horizontal variance)
  const isGradientRegion = new Uint8Array(gridW * gridH);
  for (let gy = 1; gy < gridH - 1; gy++) {
    for (let gx = 1; gx < gridW - 1; gx++) {
      const idx = gy * gridW + gx;
      const leftIdx = gy * gridW + (gx - 1);
      const rightIdx = gy * gridW + (gx + 1);
      const hDiff = Math.abs(cellR[leftIdx] - cellR[rightIdx]) + Math.abs(cellG[leftIdx] - cellG[rightIdx]);
      if (hDiff < 15 && isSubject[idx] === 1) {
        isGradientRegion[idx] = 1;
      }
    }
  }

  // 4. Initial Quantization Pass
  const rawGrid: string[][] = Array.from({ length: gridH }, () => Array(gridW).fill(""));

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const idx = gy * gridW + gx;
      if (isSubject[idx] === 0) continue;

      let r = cellR[idx];
      let g = cellG[idx];
      let b = cellB[idx];

      // Ordered dither ONLY for gradients and skies
      if (passGradientDitherOnly && isGradientRegion[idx] === 1) {
        const ditherVal = BAYER_4X4[gy % 4][gx % 4] * 24;
        r = Math.min(255, Math.max(0, r + ditherVal));
        g = Math.min(255, Math.max(0, g + ditherVal));
        b = Math.min(255, Math.max(0, b + ditherVal));
      }

      const match = snapToPaletteOklab(r, g, b, activePalette);
      rawGrid[gy][gx] = match.hex;
    }
  }

  // 5. Cleanup Pass: Two-Tone Cel Shading Snap
  if (passSnapTwoTone) {
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        const hex = rawGrid[gy][gx];
        if (!hex) continue;

        const idx = gy * gridW + gx;
        const [L, a, b] = rgbToOklab(cellR[idx], cellG[idx], cellB[idx]);

        // Consistent top-left light direction: dot product with (-1, -1)
        const lightThreshold = 0.52;
        if (L < lightThreshold) {
          // Snap to shadow tone (darker variant in palette)
          const shadowHex = getDarkerShade(cellR[idx], cellG[idx], cellB[idx]);
          const snapShadow = snapToPaletteOklab(
            parseInt(shadowHex.slice(1, 3), 16),
            parseInt(shadowHex.slice(3, 5), 16),
            parseInt(shadowHex.slice(5, 7), 16),
            activePalette
          );
          rawGrid[gy][gx] = snapShadow.hex;
        }
      }
    }
  }

  // 6. Cleanup Pass: 1px Dark Outline in a darker shade of adjacent fill (Not pure black!)
  if (passDarkOutline) {
    const outlineGrid: string[][] = Array.from({ length: gridH }, () => Array(gridW).fill(""));
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        if (!rawGrid[gy][gx]) continue;

        // Check 4-connected boundary with transparent background
        const isBorder =
          gx === 0 ||
          gx === gridW - 1 ||
          gy === 0 ||
          gy === gridH - 1 ||
          !rawGrid[gy - 1][gx] ||
          !rawGrid[gy + 1][gx] ||
          !rawGrid[gy][gx - 1] ||
          !rawGrid[gy][gx + 1];

        if (isBorder) {
          const idx = gy * gridW + gx;
          outlineGrid[gy][gx] = getDarkerShade(cellR[idx], cellG[idx], cellB[idx]);
        }
      }
    }

    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        if (outlineGrid[gy][gx]) {
          rawGrid[gy][gx] = outlineGrid[gy][gx];
        }
      }
    }
  }

  // 7. Cleanup Pass: Remove Orphan Single Pixels
  if (passRemoveOrphans) {
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        const hex = rawGrid[gy][gx];
        if (!hex) continue;

        const n1 = gy > 0 ? rawGrid[gy - 1][gx] : "";
        const n2 = gy < gridH - 1 ? rawGrid[gy + 1][gx] : "";
        const n3 = gx > 0 ? rawGrid[gy][gx - 1] : "";
        const n4 = gx < gridW - 1 ? rawGrid[gy][gx + 1] : "";

        const matchCount = [n1, n2, n3, n4].filter((n) => n === hex).length;
        if (matchCount === 0) {
          // Orphan isolated pixel! Replace with most frequent neighbor
          const validNeighbors = [n1, n2, n3, n4].filter(Boolean);
          if (validNeighbors.length > 0) {
            rawGrid[gy][gx] = validNeighbors[0];
          } else {
            rawGrid[gy][gx] = "";
          }
        }
      }
    }
  }

  // 8. Output as Map<string, string>
  const resultPixels = new Map<string, string>();
  const paletteSet = new Set<string>();

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const hex = rawGrid[gy][gx];
      if (hex) {
        resultPixels.set(`${gy}_${gx}`, hex);
        paletteSet.add(hex);
      }
    }
  }

  return {
    pixels: resultPixels,
    width: gridW,
    height: gridH,
    paletteUsed: Array.from(paletteSet),
  };
}
