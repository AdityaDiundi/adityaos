// Upgraded High-Fidelity Pixel Art Conversion Engine
// Supports 4 Source Types (Photo, Illustration, AI Pixel-Style, Existing Pixel Art)
// Edge-aware downsampling, k-centroid mode preservation, AI block run snapping, nearest-neighbor
// k-means++ in OKLab with Hue-Aware Metric, Bayer gradient dithering,
// Morphological mask cleanup, connected-component despeckling, and multi-stage debug inspector.

export type SourceType = "photo" | "illustration" | "ai_pixel" | "pixel_art";

export const RESOLUTION_STEPS = [16, 24, 32, 48, 64, 96, 128, 160, 192, 256, 384, 512] as const;

export interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
  oklab?: [number, number, number];
}

export interface SourceAnalysis {
  detectedType: SourceType;
  confidence: number;
  uniqueColorCount: number;
  edgeSharpness: number;
  detectedBlockSize?: number;
  suggestedLongestSide: number;
  isSubjectLike: boolean;
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

// Linear RGB to OKLab
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

// OKLab to RGB
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

// Hue-Aware OKLab Distance Metric:
// Never merges visually distinct hues (e.g. saturated cyan vs pink) just because their lightness is close
export function hueAwareOklabDistance(
  lab1: [number, number, number],
  lab2: [number, number, number],
  hueWeight = 1.45
): number {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  const c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]);
  const c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);

  let dH2 = 0;
  if (c1 > 0.025 && c2 > 0.025) {
    const cosDTheta = (lab1[1] * lab2[1] + lab1[2] * lab2[2]) / (c1 * c2);
    const cosClamped = Math.max(-1, Math.min(1, cosDTheta));
    dH2 = 2 * c1 * c2 * (1 - cosClamped);
  }

  return 1.4 * dL * dL + da * da + db * db + hueWeight * dH2;
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
  { name: "Slate Plum", hex: "#29243D", rgb: [41, 36, 61] },
  { name: "Dusk Violet", hex: "#4B3D60", rgb: [75, 61, 96] },
  { name: "Neon Magenta", hex: "#EB4F7C", rgb: [235, 79, 124] },
  { name: "Pastel Rose", hex: "#F39BB4", rgb: [243, 155, 180] },
  { name: "Warm Amber", hex: "#F59E0B", rgb: [245, 158, 11] },
  { name: "Cyber Yellow", hex: "#FDE047", rgb: [253, 224, 71] },
  { name: "Cyber Cyan", hex: "#00FFCC", rgb: [0, 255, 204] },
  { name: "Sky Azure", hex: "#38BDF8", rgb: [56, 189, 248] },
  { name: "Deep Ocean", hex: "#0369A1", rgb: [3, 105, 161] },
  { name: "Emerald Mint", hex: "#10B981", rgb: [16, 185, 129] },
  { name: "Lavender Glow", hex: "#C084FC", rgb: [192, 132, 252] },
  { name: "Warm Paper", hex: "#FAF7F2", rgb: [250, 247, 242] },
  { name: "Pure White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { name: "Beacon Red", hex: "#EF4444", rgb: [239, 68, 68] },
]);

export const GAMEBOY_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "GB Darkest", hex: "#0F380F", rgb: [15, 56, 15] },
  { name: "GB Dark", hex: "#306230", rgb: [48, 98, 48] },
  { name: "GB Light", hex: "#8BAC0F", rgb: [139, 172, 15] },
  { name: "GB Lightest", hex: "#9BBC0F", rgb: [155, 188, 15] },
]);

export const ENDESGA32_PALETTE: PaletteColor[] = initializePaletteOklab([
  { name: "Black", hex: "#BE4A2F", rgb: [190, 74, 47] },
  { name: "Dark Red", hex: "#D77643", rgb: [215, 118, 67] },
  { name: "Orange", hex: "#EAD4AA", rgb: [234, 212, 170] },
  { name: "Light Peach", hex: "#E4A672", rgb: [228, 166, 114] },
  { name: "Brown", hex: "#B86F50", rgb: [184, 111, 80] },
  { name: "Dark Brown", hex: "#733E39", rgb: [115, 62, 57] },
  { name: "Deep Maroon", hex: "#3E2731", rgb: [62, 39, 49] },
  { name: "Plum", hex: "#A22633", rgb: [162, 38, 51] },
  { name: "Crimson", hex: "#E43B44", rgb: [228, 59, 68] },
  { name: "Coral", hex: "#F77622", rgb: [247, 118, 34] },
  { name: "Yellow", hex: "#FEE761", rgb: [254, 231, 97] },
  { name: "Lime", hex: "#63C74D", rgb: [99, 199, 77] },
  { name: "Green", hex: "#3E8948", rgb: [62, 137, 72] },
  { name: "Dark Green", hex: "#265C42", rgb: [38, 92, 66] },
  { name: "Deep Teal", hex: "#193C3E", rgb: [25, 60, 62] },
  { name: "Navy", hex: "#124E89", rgb: [18, 78, 137] },
  { name: "Cyan", hex: "#0099DB", rgb: [0, 153, 219] },
  { name: "Sky", hex: "#2CE8F5", rgb: [44, 232, 245] },
  { name: "White", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { name: "Light Gray", hex: "#C0CBDC", rgb: [192, 203, 220] },
  { name: "Gray", hex: "#8B9BB4", rgb: [139, 155, 180] },
  { name: "Dark Gray", hex: "#5A6988", rgb: [90, 105, 136] },
  { name: "Slate", hex: "#3A4466", rgb: [58, 68, 102] },
  { name: "Midnight", hex: "#262B44", rgb: [38, 43, 68] },
  { name: "Ink", hex: "#181425", rgb: [24, 20, 37] },
  { name: "Violet", hex: "#FF0044", rgb: [255, 0, 68] },
  { name: "Magenta", hex: "#68386C", rgb: [104, 56, 108] },
  { name: "Purple", hex: "#B55088", rgb: [181, 80, 136] },
  { name: "Pink", hex: "#F6757A", rgb: [246, 117, 122] },
  { name: "Lavender", hex: "#E8B796", rgb: [232, 183, 150] },
  { name: "Tan", hex: "#C28569", rgb: [194, 133, 105] },
  { name: "Sand", hex: "#523B40", rgb: [82, 59, 64] },
]);

export const NAMED_PALETTES: Record<string, PaletteColor[]> = {
  animeChibi: ANIME_CHIBI_PALETTE,
  editorial: EDITORIAL_PALETTE,
  pico8: PICO8_PALETTE,
  tokyoDusk: TOKYO_DUSK_PALETTE,
  endesga32: ENDESGA32_PALETTE,
  gameboy: GAMEBOY_PALETTE,
};

// Calculate aspect-ratio preserving target dimensions
export function calculateTargetGrid(
  srcW: number,
  srcH: number,
  longestSide: number
): { cols: number; rows: number } {
  if (srcW <= 0 || srcH <= 0) return { cols: 48, rows: 48 };

  if (srcW >= srcH) {
    const cols = longestSide;
    const rows = Math.max(1, Math.round(longestSide * (srcH / srcW)));
    return { cols, rows };
  } else {
    const rows = longestSide;
    const cols = Math.max(1, Math.round(longestSide * (srcW / srcH)));
    return { cols, rows };
  }
}

// Snap arbitrary number to closest step in RESOLUTION_STEPS
export function snapToResolutionStep(value: number): (typeof RESOLUTION_STEPS)[number] {
  let closest: (typeof RESOLUTION_STEPS)[number] = RESOLUTION_STEPS[0];
  let minDiff = Math.abs(value - closest);
  for (let i = 1; i < RESOLUTION_STEPS.length; i++) {
    const diff = Math.abs(value - RESOLUTION_STEPS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = RESOLUTION_STEPS[i];
    }
  }
  return closest;
}

// Heuristic Source Type Auto-Detection
export function analyzeSourceImage(
  data: Uint8ClampedArray,
  width: number,
  height: number
): SourceAnalysis {
  if (width <= 0 || height <= 0 || data.length === 0) {
    return {
      detectedType: "photo",
      confidence: 0.5,
      uniqueColorCount: 256,
      edgeSharpness: 0.5,
      suggestedLongestSide: 96,
      isSubjectLike: true,
    };
  }

  // 1. Color set & edge sharpness sampling (up to 200x200 sample)
  const stepX = Math.max(1, Math.floor(width / 200));
  const stepY = Math.max(1, Math.floor(height / 200));

  const colorSet = new Set<number>();
  let totalGrad = 0;
  let edgeSampleCount = 0;

  for (let y = 0; y < height - stepY; y += stepY) {
    for (let x = 0; x < width - stepX; x += stepX) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a < 50) continue; // ignore transparent
      const rgb24 = (r << 16) | (g << 8) | b;
      colorSet.add(rgb24);

      // Horizontal and vertical gradient
      const rightIdx = (y * width + (x + stepX)) * 4;
      const downIdx = ((y + stepY) * width + x) * 4;

      const dr = Math.abs(r - data[rightIdx]);
      const dg = Math.abs(g - data[rightIdx + 1]);
      const db = Math.abs(b - data[rightIdx + 2]);
      const dDownR = Math.abs(r - data[downIdx]);
      const dDownG = Math.abs(g - data[downIdx + 1]);
      const dDownB = Math.abs(b - data[downIdx + 2]);

      const grad = (dr + dg + db + dDownR + dDownG + dDownB) / 6;
      totalGrad += grad;
      edgeSampleCount++;
    }
  }

  const avgGrad = edgeSampleCount > 0 ? totalGrad / edgeSampleCount : 0;
  const uniqueColors = colorSet.size;

  // 2. Block run-length analysis to detect AI "pixel-style" scaled images
  // Check horizontal consecutive runs of exact colors
  const runLengths: Record<number, number> = {};
  const scanRows = Math.min(60, height);
  const rowStep = Math.max(1, Math.floor(height / scanRows));

  for (let y = 0; y < height; y += rowStep) {
    let curRun = 1;
    let prevColor = -1;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] < 50) {
        if (curRun > 1) runLengths[curRun] = (runLengths[curRun] || 0) + 1;
        curRun = 1;
        prevColor = -1;
        continue;
      }
      const c = (data[idx] << 16) | (data[idx + 1] << 8) | data[idx + 2];
      if (c === prevColor) {
        curRun++;
      } else {
        if (curRun > 1) runLengths[curRun] = (runLengths[curRun] || 0) + 1;
        curRun = 1;
        prevColor = c;
      }
    }
    if (curRun > 1) runLengths[curRun] = (runLengths[curRun] || 0) + 1;
  }

  // Find candidate block size B >= 2 with high frequency
  let detectedB = 0;
  let maxRunScore = 0;
  for (let b = 2; b <= 16; b++) {
    const direct = runLengths[b] || 0;
    const doubleB = runLengths[b * 2] || 0;
    const tripleB = runLengths[b * 3] || 0;
    const score = direct * 1.5 + doubleB * 1.0 + tripleB * 0.8;
    if (score > 120 && score > maxRunScore) {
      maxRunScore = score;
      detectedB = b;
    }
  }

  // Heuristics Decision Tree
  let detectedType: SourceType = "photo";
  let confidence = 0.75;
  const maxDim = Math.max(width, height);
  const aspectRatio = width / height;
  const isSubjectLike = aspectRatio >= 0.75 && aspectRatio <= 1.33;

  if (maxDim <= 128 && uniqueColors <= 48) {
    detectedType = "pixel_art";
    confidence = 0.95;
  } else if (detectedB >= 2 && maxRunScore > 180) {
    detectedType = "ai_pixel";
    confidence = 0.88;
  } else if (uniqueColors < 1200 && avgGrad > 14) {
    detectedType = "illustration";
    confidence = 0.82;
  } else {
    detectedType = "photo";
    confidence = 0.80;
  }

  let suggestedLongestSide = 96;
  if (detectedType === "pixel_art") {
    suggestedLongestSide = Math.min(maxDim, 128); // Never upscale past native size
  } else if (detectedType === "ai_pixel" && detectedB > 1) {
    suggestedLongestSide = snapToResolutionStep(Math.round(maxDim / detectedB));
  } else if (detectedType === "illustration" || isSubjectLike) {
    suggestedLongestSide = 96;
  } else {
    suggestedLongestSide = 160;
  }

  return {
    detectedType,
    confidence,
    uniqueColorCount: uniqueColors,
    edgeSharpness: avgGrad / 100,
    detectedBlockSize: detectedB > 1 ? detectedB : undefined,
    suggestedLongestSide,
    isSubjectLike,
  };
}

// 1. Photo: Contrast-Aware / Edge-Aware Downsampling
function downscalePhotoEdgeAware(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  gridW: number,
  gridH: number
): { r: Float32Array; g: Float32Array; b: Float32Array; a: Float32Array } {
  const cellR = new Float32Array(gridW * gridH);
  const cellG = new Float32Array(gridW * gridH);
  const cellB = new Float32Array(gridW * gridH);
  const cellA = new Float32Array(gridW * gridH);

  const scaleX = srcW / gridW;
  const scaleY = srcH / gridH;

  for (let gy = 0; gy < gridH; gy++) {
    const y0 = Math.floor(gy * scaleY);
    const y1 = Math.min(srcH, Math.ceil((gy + 1) * scaleY));

    for (let gx = 0; gx < gridW; gx++) {
      const x0 = Math.floor(gx * scaleX);
      const x1 = Math.min(srcW, Math.ceil((gx + 1) * scaleX));

      let weightedSumR = 0;
      let weightedSumG = 0;
      let weightedSumB = 0;
      let weightedSumA = 0;
      let totalWeight = 0;

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * srcW + x) * 4;
          const a = srcData[idx + 3] / 255;
          if (a <= 0.01) continue;

          // Local edge contrast (Sobel-like difference with horizontal/vertical neighbors)
          const rx = Math.min(srcW - 1, x + 1);
          const dy = Math.min(srcH - 1, y + 1);
          const rIdx = (y * srcW + rx) * 4;
          const dIdx = (dy * srcW + x) * 4;

          const grad =
            Math.abs(srcData[idx] - srcData[rIdx]) +
            Math.abs(srcData[idx + 1] - srcData[rIdx + 1]) +
            Math.abs(srcData[idx + 2] - srcData[rIdx + 2]) +
            Math.abs(srcData[idx] - srcData[dIdx]) +
            Math.abs(srcData[idx + 1] - srcData[dIdx + 1]) +
            Math.abs(srcData[idx + 2] - srcData[dIdx + 2]);

          const edgeWeight = 1.0 + Math.min(3.5, grad / 48);
          const effectiveW = edgeWeight * a;

          // Premultiplied linear RGB
          weightedSumR += srgbToLinear(srcData[idx]) * effectiveW;
          weightedSumG += srgbToLinear(srcData[idx + 1]) * effectiveW;
          weightedSumB += srgbToLinear(srcData[idx + 2]) * effectiveW;
          weightedSumA += a;
          totalWeight += effectiveW;
        }
      }

      const cellIdx = gy * gridW + gx;
      const count = (y1 - y0) * (x1 - x0);
      if (totalWeight > 0.001) {
        cellR[cellIdx] = linearToSrgb(weightedSumR / totalWeight);
        cellG[cellIdx] = linearToSrgb(weightedSumG / totalWeight);
        cellB[cellIdx] = linearToSrgb(weightedSumB / totalWeight);
        cellA[cellIdx] = Math.min(255, Math.round((weightedSumA / count) * 255));
      } else {
        cellA[cellIdx] = 0;
      }
    }
  }

  return { r: cellR, g: cellG, b: cellB, a: cellA };
}

// 2. Illustration: Dominant Mode / k-Centroid Sampling
function downscaleIllustrationDominant(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  gridW: number,
  gridH: number
): { r: Float32Array; g: Float32Array; b: Float32Array; a: Float32Array } {
  const cellR = new Float32Array(gridW * gridH);
  const cellG = new Float32Array(gridW * gridH);
  const cellB = new Float32Array(gridW * gridH);
  const cellA = new Float32Array(gridW * gridH);

  const scaleX = srcW / gridW;
  const scaleY = srcH / gridH;

  for (let gy = 0; gy < gridH; gy++) {
    const y0 = Math.floor(gy * scaleY);
    const y1 = Math.min(srcH, Math.ceil((gy + 1) * scaleY));

    for (let gx = 0; gx < gridW; gx++) {
      const x0 = Math.floor(gx * scaleX);
      const x1 = Math.min(srcW, Math.ceil((gx + 1) * scaleX));

      // Histogram of colors in block (quantized to 5-bit per channel for fast mode selection)
      const colorBins: Record<number, { count: number; r: number; g: number; b: number; a: number }> = {};
      let totalAlpha = 0;
      let darkCount = 0;
      let totalCount = 0;

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * srcW + x) * 4;
          const a = srcData[idx + 3];
          if (a < 50) continue;

          const r = srcData[idx];
          const g = srcData[idx + 1];
          const b = srcData[idx + 2];
          totalAlpha += a;
          totalCount++;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 90) darkCount++; // potential line-art pixel

          const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
          if (!colorBins[key]) {
            colorBins[key] = { count: 0, r: 0, g: 0, b: 0, a };
          }
          colorBins[key].count++;
          colorBins[key].r += r;
          colorBins[key].g += g;
          colorBins[key].b += b;
        }
      }

      const cellIdx = gy * gridW + gx;
      if (totalCount === 0) {
        cellA[cellIdx] = 0;
        continue;
      }

      // If ink / line-art represents at least 22% of cell, prioritize darkest prominent mode
      let bestKey = -1;
      let bestCount = -1;
      const prioritizeDark = darkCount / totalCount >= 0.22;

      for (const [kStr, entry] of Object.entries(colorBins)) {
        const k = Number(kStr);
        const avgR = entry.r / entry.count;
        const avgG = entry.g / entry.count;
        const avgB = entry.b / entry.count;
        const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

        let weight = entry.count;
        if (prioritizeDark && lum < 100) {
          weight *= 2.8; // boost ink line weight
        }

        if (weight > bestCount) {
          bestCount = weight;
          bestKey = k;
        }
      }

      if (bestKey !== -1 && colorBins[bestKey]) {
        const best = colorBins[bestKey];
        cellR[cellIdx] = Math.round(best.r / best.count);
        cellG[cellIdx] = Math.round(best.g / best.count);
        cellB[cellIdx] = Math.round(best.b / best.count);
        cellA[cellIdx] = Math.round(totalAlpha / totalCount);
      } else {
        cellA[cellIdx] = 0;
      }
    }
  }

  return { r: cellR, g: cellG, b: cellB, a: cellA };
}

// 3. AI Pixel-Style: Snap to Implicit Pixel Grid
function downscaleAIPixelGrid(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  gridW: number,
  gridH: number,
  blockSize = 8
): { r: Float32Array; g: Float32Array; b: Float32Array; a: Float32Array } {
  const cellR = new Float32Array(gridW * gridH);
  const cellG = new Float32Array(gridW * gridH);
  const cellB = new Float32Array(gridW * gridH);
  const cellA = new Float32Array(gridW * gridH);

  const B = Math.max(1, blockSize);
  const numBlocksX = Math.floor(srcW / B);
  const numBlocksY = Math.floor(srcH / B);

  for (let gy = 0; gy < gridH; gy++) {
    const by = Math.min(numBlocksY - 1, Math.floor((gy / gridH) * numBlocksY));
    const midY = Math.min(srcH - 1, Math.floor((by + 0.5) * B));

    for (let gx = 0; gx < gridW; gx++) {
      const bx = Math.min(numBlocksX - 1, Math.floor((gx / gridW) * numBlocksX));
      const midX = Math.min(srcW - 1, Math.floor((bx + 0.5) * B));

      const idx = (midY * srcW + midX) * 4;
      const cellIdx = gy * gridW + gx;

      cellR[cellIdx] = srcData[idx];
      cellG[cellIdx] = srcData[idx + 1];
      cellB[cellIdx] = srcData[idx + 2];
      cellA[cellIdx] = srcData[idx + 3];
    }
  }

  return { r: cellR, g: cellG, b: cellB, a: cellA };
}

// 4. Existing Pixel Art: Exact Nearest Neighbor Sampling
function downscalePixelArtNearest(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  gridW: number,
  gridH: number
): { r: Float32Array; g: Float32Array; b: Float32Array; a: Float32Array } {
  const cellR = new Float32Array(gridW * gridH);
  const cellG = new Float32Array(gridW * gridH);
  const cellB = new Float32Array(gridW * gridH);
  const cellA = new Float32Array(gridW * gridH);

  for (let gy = 0; gy < gridH; gy++) {
    const srcY = Math.min(srcH - 1, Math.floor((gy + 0.5) * (srcH / gridH)));
    for (let gx = 0; gx < gridW; gx++) {
      const srcX = Math.min(srcW - 1, Math.floor((gx + 0.5) * (srcW / gridW)));
      const idx = (srcY * srcW + srcX) * 4;
      const cellIdx = gy * gridW + gx;

      cellR[cellIdx] = srcData[idx];
      cellG[cellIdx] = srcData[idx + 1];
      cellB[cellIdx] = srcData[idx + 2];
      cellA[cellIdx] = srcData[idx + 3];
    }
  }

  return { r: cellR, g: cellG, b: cellB, a: cellA };
}

// Extract k-means++ Palette in OKLab space
export function extractKMeansPalette(
  samples: [number, number, number][],
  k: number,
  maxIters = 10
): PaletteColor[] {
  if (samples.length === 0) return EDITORIAL_PALETTE.slice(0, k);

  const K = Math.min(k, samples.length);
  const labs: [number, number, number][] = samples.map(([r, g, b]) => rgbToOklab(r, g, b));

  // 1. k-means++ initialization
  const centroids: [number, number, number][] = [];
  centroids.push(labs[Math.floor(Math.random() * labs.length)]);

  while (centroids.length < K) {
    const distances: number[] = [];
    let sumD2 = 0;

    for (let i = 0; i < labs.length; i++) {
      let minD = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const d = hueAwareOklabDistance(labs[i], centroids[c], 1.6);
        if (d < minD) minD = d;
      }
      const d2 = minD * minD;
      distances.push(d2);
      sumD2 += d2;
    }

    if (sumD2 <= 0.0001) break;

    const target = Math.random() * sumD2;
    let running = 0;
    let chosenIdx = 0;
    for (let i = 0; i < distances.length; i++) {
      running += distances[i];
      if (running >= target) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push(labs[chosenIdx]);
  }

  // 2. Lloyd iterations
  const assignments = new Int32Array(labs.length);
  for (let iter = 0; iter < maxIters; iter++) {
    let changed = false;
    for (let i = 0; i < labs.length; i++) {
      let bestC = 0;
      let minD = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const d = hueAwareOklabDistance(labs[i], centroids[c], 1.5);
        if (d < minD) {
          minD = d;
          bestC = c;
        }
      }
      if (assignments[i] !== bestC) {
        assignments[i] = bestC;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Update centroids
    const sumL = new Float64Array(centroids.length);
    const sumA = new Float64Array(centroids.length);
    const sumB = new Float64Array(centroids.length);
    const counts = new Int32Array(centroids.length);

    for (let i = 0; i < labs.length; i++) {
      const c = assignments[i];
      sumL[c] += labs[i][0];
      sumA[c] += labs[i][1];
      sumB[c] += labs[i][2];
      counts[c]++;
    }

    for (let c = 0; c < centroids.length; c++) {
      if (counts[c] > 0) {
        centroids[c] = [sumL[c] / counts[c], sumA[c] / counts[c], sumB[c] / counts[c]];
      }
    }
  }

  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return centroids.map((lab, idx) => {
    const [r, g, b] = oklabToRgb(lab[0], lab[1], lab[2]);
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return {
      name: `Color ${idx + 1}`,
      hex,
      rgb: [r, g, b],
      oklab: lab,
    };
  });
}

// Snap RGB to closest palette color using hue-aware OKLab distance
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
    const dist = hueAwareOklabDistance(targetLab, pLab, 1.4);
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
  const newL = Math.max(0.08, L * 0.42);
  const [nr, ng, nb] = oklabToRgb(newL, a * 1.1, ob * 1.1);
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

// Morphological open/close & Connected-Component Island Filtering on Mask
function cleanupAlphaMask(
  mask: Uint8Array,
  w: number,
  h: number,
  isolateSubject: boolean
): Uint8Array {
  const cleaned = new Uint8Array(mask);

  // 1. Morphological Close (Fill 1px holes inside solid mask)
  const dilated = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let active = false;
      for (let dy = -1; dy <= 1 && !active; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w && mask[ny * w + nx] === 1) {
            active = true;
            break;
          }
        }
      }
      dilated[y * w + x] = active ? 1 : 0;
    }
  }

  // Erosion
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let keep = true;
      for (let dy = -1; dy <= 1 && keep; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || ny >= h || nx < 0 || nx >= w || dilated[ny * w + nx] === 0) {
            keep = false;
            break;
          }
        }
      }
      cleaned[y * w + x] = keep ? 1 : 0;
    }
  }

  // 2. Connected Component Labeling (Keep largest + significant islands)
  if (isolateSubject) {
    const visited = new Uint8Array(w * h);
    const components: { size: number; coords: number[] }[] = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (cleaned[idx] === 1 && !visited[idx]) {
          const queue = [idx];
          visited[idx] = 1;
          const coords = [idx];

          let qHead = 0;
          while (qHead < queue.length) {
            const cur = queue[qHead++];
            const cy = Math.floor(cur / w);
            const cx = cur % w;

            const neighbors = [
              [cy - 1, cx],
              [cy + 1, cx],
              [cy, cx - 1],
              [cy, cx + 1],
            ];

            for (const [ny, nx] of neighbors) {
              if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
                const nIdx = ny * w + nx;
                if (cleaned[nIdx] === 1 && !visited[nIdx]) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                  coords.push(nIdx);
                }
              }
            }
          }

          components.push({ size: coords.length, coords });
        }
      }
    }

    if (components.length > 0) {
      components.sort((a, b) => b.size - a.size);
      const largestSize = components[0].size;
      const minKeepSize = Math.max(4, Math.floor(largestSize * 0.05));

      const finalMask = new Uint8Array(w * h);
      components.forEach((comp) => {
        if (comp.size >= minKeepSize) {
          comp.coords.forEach((idx) => {
            finalMask[idx] = 1;
          });
        }
      });
      return finalMask;
    }
  }

  return cleaned;
}

// Despeckle: 4-Connected Component Fragment Removal on 2D Quantized Grid
function despeckleQuantizedGrid(
  grid: string[][],
  w: number,
  h: number,
  minSize = 3
): string[][] {
  const result: string[][] = grid.map((row) => [...row]);
  const visited = Array.from({ length: h }, () => new Uint8Array(w));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = result[y][x];
      if (!color || visited[y][x]) continue;

      const queue: [number, number][] = [[x, y]];
      visited[y][x] = 1;
      const component: [number, number][] = [[x, y]];
      const neighborColors: Record<string, number> = {};

      let qHead = 0;
      while (qHead < queue.length) {
        const [cx, cy] = queue[qHead++];
        const deltas = [
          [0, -1],
          [0, 1],
          [-1, 0],
          [1, 0],
        ];

        for (const [dx, dy] of deltas) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nCol = result[ny][nx];
            if (nCol === color && !visited[ny][nx]) {
              visited[ny][nx] = 1;
              queue.push([nx, ny]);
              component.push([nx, ny]);
            } else if (nCol && nCol !== color) {
              neighborColors[nCol] = (neighborColors[nCol] || 0) + 1;
            }
          }
        }
      }

      // If fragment is smaller than minSize, merge with dominant neighbor
      if (component.length < minSize) {
        let bestColor = "";
        let bestCount = -1;
        for (const [nCol, count] of Object.entries(neighborColors)) {
          if (count > bestCount) {
            bestCount = count;
            bestColor = nCol;
          }
        }

        if (bestColor) {
          component.forEach(([cx, cy]) => {
            result[cy][cx] = bestColor;
          });
        }
      }
    }
  }

  return result;
}

// Bayer 4x4 Dither Matrix
const BAYER_4X4 = [
  [0 / 16 - 0.5, 8 / 16 - 0.5, 2 / 16 - 0.5, 10 / 16 - 0.5],
  [12 / 16 - 0.5, 4 / 16 - 0.5, 14 / 16 - 0.5, 6 / 16 - 0.5],
  [3 / 16 - 0.5, 11 / 16 - 0.5, 1 / 16 - 0.5, 9 / 16 - 0.5],
  [15 / 16 - 0.5, 7 / 16 - 0.5, 13 / 16 - 0.5, 5 / 16 - 0.5],
];

export interface ConversionPipelineOptions {
  sourceType: SourceType;
  longestSide: number;
  paletteMode: "dynamic_kmeans" | "named" | "reference_image";
  paletteName: string;
  referencePalette?: PaletteColor[];
  maxPaletteColors: number;
  removeBg: boolean;
  isolateSubject: boolean;
  bgTolerance: number;
  // Cleanup & Dither
  ditherEnabled: boolean;
  ditherStrength: number; // 0.0 to 1.0
  despeckleEnabled: boolean;
  despeckleMinSize: number; // default 3
  passDarkOutline: boolean;
  passSnapTwoTone: boolean;
  removeFloorLine: boolean;
}

export interface ConversionPipelineResult {
  pixels: Map<string, string>; // "row_col" -> hex
  width: number;
  height: number;
  paletteUsed: string[];
  analysis: SourceAnalysis;
  // Debug stages for the inspector
  stages: {
    mask: Map<string, string>;
    downscaled: Map<string, string>;
    quantized: Map<string, string>;
    dithered: Map<string, string>;
    cleaned: Map<string, string>;
    outlined: Map<string, string>;
    final: Map<string, string>;
  };
}

export function runPixelConversionPipeline(
  source: HTMLImageElement | ImageData | { data: Uint8ClampedArray; width: number; height: number },
  options: ConversionPipelineOptions
): ConversionPipelineResult {
  const {
    sourceType,
    longestSide,
    paletteMode,
    paletteName,
    referencePalette,
    maxPaletteColors = 16,
    removeBg,
    isolateSubject,
    bgTolerance = 35,
    ditherEnabled,
    ditherStrength = 0.55,
    despeckleEnabled,
    despeckleMinSize = 3,
    passDarkOutline,
    passSnapTwoTone,
    removeFloorLine = true,
  } = options;

  let srcW: number;
  let srcH: number;
  let srcData: Uint8ClampedArray;

  if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) {
    srcW = source.naturalWidth || source.width;
    srcH = source.naturalHeight || source.height;
    const canvas = document.createElement("canvas");
    canvas.width = srcW;
    canvas.height = srcH;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(source, 0, 0);
      const imgData = ctx.getImageData(0, 0, srcW, srcH);
      srcData = imgData.data;
    } else {
      srcData = new Uint8ClampedArray(srcW * srcH * 4);
    }
  } else {
    const rawSource = source as { width: number; height: number; data: Uint8ClampedArray };
    srcW = rawSource.width;
    srcH = rawSource.height;
    srcData = rawSource.data;
  }

  // 1. Calculate Target Grid Dimensions Preserving Aspect Ratio
  const { cols: gridW, rows: gridH } = calculateTargetGrid(srcW, srcH, longestSide);

  // 2. Analyze Source
  const analysis = analyzeSourceImage(srcData, srcW, srcH);

  // 3. Downscale according to Source Type
  let downscaled: { r: Float32Array; g: Float32Array; b: Float32Array; a: Float32Array };
  if (sourceType === "photo") {
    downscaled = downscalePhotoEdgeAware(srcData, srcW, srcH, gridW, gridH);
  } else if (sourceType === "illustration") {
    downscaled = downscaleIllustrationDominant(srcData, srcW, srcH, gridW, gridH);
  } else if (sourceType === "ai_pixel") {
    downscaled = downscaleAIPixelGrid(srcData, srcW, srcH, gridW, gridH, analysis.detectedBlockSize || 8);
  } else {
    downscaled = downscalePixelArtNearest(srcData, srcW, srcH, gridW, gridH);
  }

  // 4. Background Detection & Alpha Mask
  const rawMask = new Uint8Array(gridW * gridH);
  let bgR = 0, bgG = 0, bgB = 0;
  if (removeBg) {
    const corners = [0, (srcW - 1) * 4, ((srcH - 1) * srcW) * 4, ((srcH - 1) * srcW + (srcW - 1)) * 4];
    corners.forEach((idx) => {
      bgR += srcData[idx];
      bgG += srcData[idx + 1];
      bgB += srcData[idx + 2];
    });
    bgR /= corners.length;
    bgG /= corners.length;
    bgB /= corners.length;
  }

  for (let i = 0; i < gridW * gridH; i++) {
    const a = downscaled.a[i];
    if (a < 80) {
      rawMask[i] = 0;
      continue;
    }
    if (removeBg) {
      const diff =
        Math.abs(downscaled.r[i] - bgR) +
        Math.abs(downscaled.g[i] - bgG) +
        Math.abs(downscaled.b[i] - bgB);
      rawMask[i] = diff < bgTolerance ? 0 : 1;
    } else {
      rawMask[i] = 1;
    }
  }

  // 5. Morphological Cleanup on Mask
  const finalMask = cleanupAlphaMask(rawMask, gridW, gridH, isolateSubject);

  // Optional: remove bottom floor line artifact if detected
  if (removeFloorLine && gridH > 10) {
    const lastRow = gridH - 1;
    let filledCount = 0;
    for (let gx = 0; gx < gridW; gx++) {
      if (finalMask[lastRow * gridW + gx] === 1 && finalMask[(lastRow - 1) * gridW + gx] === 0) {
        filledCount++;
      }
    }
    if (filledCount > gridW * 0.45) {
      for (let gx = 0; gx < gridW; gx++) {
        finalMask[lastRow * gridW + gx] = 0;
      }
    }
  }

  // Debug Stage: Mask Map
  const stageMask = new Map<string, string>();
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const idx = gy * gridW + gx;
      stageMask.set(`${gy}_${gx}`, finalMask[idx] === 1 ? "#FFFFFF" : "#000000");
    }
  }

  // Debug Stage: Downscaled Raw Color Map
  const stageDownscaled = new Map<string, string>();
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const idx = gy * gridW + gx;
      if (finalMask[idx] === 1) {
        const hex = `#${toHex(Math.round(downscaled.r[idx]))}${toHex(Math.round(downscaled.g[idx]))}${toHex(Math.round(downscaled.b[idx]))}`;
        stageDownscaled.set(`${gy}_${gx}`, hex);
      }
    }
  }

  // 6. Active Palette Resolution
  let activePalette: PaletteColor[] = [];
  if (paletteMode === "reference_image" && referencePalette && referencePalette.length > 0) {
    activePalette = referencePalette.slice(0, maxPaletteColors);
  } else if (paletteMode === "named" && NAMED_PALETTES[paletteName]) {
    activePalette = NAMED_PALETTES[paletteName].slice(0, maxPaletteColors);
  } else {
    // Dynamic k-means++ in OKLab from downscaled subject pixels
    const samplePixels: [number, number, number][] = [];
    for (let i = 0; i < gridW * gridH; i++) {
      if (finalMask[i] === 1) {
        samplePixels.push([downscaled.r[i], downscaled.g[i], downscaled.b[i]]);
      }
    }
    activePalette = extractKMeansPalette(samplePixels, maxPaletteColors);
  }

  if (activePalette.length === 0) {
    activePalette = EDITORIAL_PALETTE.slice(0, maxPaletteColors);
  }

  // 7. Palette Quantization
  const gridQuantized: string[][] = Array.from({ length: gridH }, () => Array(gridW).fill(""));
  const stageQuantized = new Map<string, string>();

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const idx = gy * gridW + gx;
      if (finalMask[idx] === 1) {
        const snapped = snapToPaletteOklab(
          downscaled.r[idx],
          downscaled.g[idx],
          downscaled.b[idx],
          activePalette
        );
        gridQuantized[gy][gx] = snapped.hex;
        stageQuantized.set(`${gy}_${gx}`, snapped.hex);
      }
    }
  }

  // 8. Selective Bayer Dithering (Smooth gradients only, never on lines or faces)
  const gridDithered: string[][] = gridQuantized.map((row) => [...row]);
  const stageDithered = new Map<string, string>();

  if (ditherEnabled && ditherStrength > 0.05) {
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        const idx = gy * gridW + gx;
        if (finalMask[idx] !== 1) continue;

        // Compute local 3x3 variance in OKLab lightness
        let sumL = 0, sumL2 = 0, count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = gy + dy;
            const nx = gx + dx;
            if (ny >= 0 && ny < gridH && nx >= 0 && nx < gridW && finalMask[ny * gridW + nx] === 1) {
              const nIdx = ny * gridW + nx;
              const [L] = rgbToOklab(downscaled.r[nIdx], downscaled.g[nIdx], downscaled.b[nIdx]);
              sumL += L;
              sumL2 += L * L;
              count++;
            }
          }
        }

        const variance = count > 1 ? (sumL2 - (sumL * sumL) / count) / count : 0;

        // Apply Bayer dither ONLY if variance is low (smooth gradient, sky, backdrop)
        if (variance < 0.035) {
          const bayerShift = BAYER_4X4[gy % 4][gx % 4] * ditherStrength * 36;
          const [curL, curA, curB] = rgbToOklab(downscaled.r[idx], downscaled.g[idx], downscaled.b[idx]);
          const ditheredL = Math.max(0.05, Math.min(0.95, curL + bayerShift / 255));
          const [dr, dg, db] = oklabToRgb(ditheredL, curA, curB);
          const snapped = snapToPaletteOklab(dr, dg, db, activePalette);
          gridDithered[gy][gx] = snapped.hex;
        }

        stageDithered.set(`${gy}_${gx}`, gridDithered[gy][gx]);
      }
    }
  } else {
    gridQuantized.forEach((row, gy) => {
      row.forEach((hex, gx) => {
        if (hex) stageDithered.set(`${gy}_${gx}`, hex);
      });
    });
  }

  // 9. Cleanup: Despeckle & Connected-Component Island Removal
  let gridCleaned: string[][] = gridDithered.map((row) => [...row]);
  if (despeckleEnabled) {
    gridCleaned = despeckleQuantizedGrid(gridCleaned, gridW, gridH, despeckleMinSize);
  }

  // Two-tone cel shading snap if requested
  if (passSnapTwoTone) {
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        const hex = gridCleaned[gy][gx];
        if (!hex) continue;
        const idx = gy * gridW + gx;
        const [L] = rgbToOklab(downscaled.r[idx], downscaled.g[idx], downscaled.b[idx]);
        if (L < 0.48) {
          const darker = getDarkerShade(downscaled.r[idx], downscaled.g[idx], downscaled.b[idx]);
          const snappedShadow = snapToPaletteOklab(
            parseInt(darker.slice(1, 3), 16),
            parseInt(darker.slice(3, 5), 16),
            parseInt(darker.slice(5, 7), 16),
            activePalette
          );
          gridCleaned[gy][gx] = snappedShadow.hex;
        }
      }
    }
  }

  const stageCleaned = new Map<string, string>();
  gridCleaned.forEach((row, gy) => {
    row.forEach((hex, gx) => {
      if (hex) stageCleaned.set(`${gy}_${gx}`, hex);
    });
  });

  // 10. 1-cell Darker Outline around Main Subject Only
  const gridOutlined: string[][] = gridCleaned.map((row) => [...row]);
  if (passDarkOutline) {
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        if (!gridCleaned[gy][gx]) continue;

        const isBorder =
          gx === 0 ||
          gx === gridW - 1 ||
          gy === 0 ||
          gy === gridH - 1 ||
          !gridCleaned[gy - 1][gx] ||
          !gridCleaned[gy + 1][gx] ||
          !gridCleaned[gy][gx - 1] ||
          !gridCleaned[gy][gx + 1];

        if (isBorder) {
          const idx = gy * gridW + gx;
          const darkHex = getDarkerShade(downscaled.r[idx], downscaled.g[idx], downscaled.b[idx]);
          gridOutlined[gy][gx] = darkHex;
        }
      }
    }

    // Run despeckle once more post-outline to ensure zero stray outline specks
    if (despeckleEnabled) {
      gridCleaned = despeckleQuantizedGrid(gridOutlined, gridW, gridH, 2);
    }
  }

  const stageOutlined = new Map<string, string>();
  gridOutlined.forEach((row, gy) => {
    row.forEach((hex, gx) => {
      if (hex) stageOutlined.set(`${gy}_${gx}`, hex);
    });
  });

  // Final Result Map
  const finalPixels = new Map<string, string>();
  const paletteSet = new Set<string>();

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const hex = (passDarkOutline ? gridOutlined : gridCleaned)[gy][gx];
      if (hex) {
        finalPixels.set(`${gy}_${gx}`, hex);
        paletteSet.add(hex);
      }
    }
  }

  return {
    pixels: finalPixels,
    width: gridW,
    height: gridH,
    paletteUsed: Array.from(paletteSet),
    analysis,
    stages: {
      mask: stageMask,
      downscaled: stageDownscaled,
      quantized: stageQuantized,
      dithered: stageDithered,
      cleaned: stageCleaned,
      outlined: stageOutlined,
      final: finalPixels,
    },
  };
}
