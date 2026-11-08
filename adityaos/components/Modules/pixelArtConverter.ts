// True Grid Pixel Art Converter & Palette Quantizer
// Formats images into crisp, locked-grid voxel maps (r/place, PICO-8, GameBoy)

export interface PaletteColor {
  name: string;
  hex: string;
  rgb: [number, number, number];
}

export const RPLACE_PALETTE: PaletteColor[] = [
  // Monochromes
  { name: "Black", hex: "#000000", rgb: [0, 0, 0] },
  { name: "Dark Charcoal", hex: "#222222", rgb: [34, 34, 34] },
  { name: "Dark Gray", hex: "#515252", rgb: [81, 82, 82] },
  { name: "Medium Gray", hex: "#898D90", rgb: [137, 141, 144] },
  { name: "Light Gray", hex: "#D4D7D9", rgb: [212, 215, 217] },
  { name: "White", hex: "#FFFFFF", rgb: [255, 255, 255] },

  // Golds, Yellows & Oranges (Critical for Doge, Zenitsu & Anime)
  { name: "Deep Amber", hex: "#7E3A00", rgb: [126, 58, 0] },
  { name: "Rust Brown", hex: "#A05A2C", rgb: [160, 90, 44] },
  { name: "Vivid Orange", hex: "#FF4500", rgb: [255, 69, 0] },
  { name: "Golden Orange", hex: "#FFA800", rgb: [255, 168, 0] },
  { name: "Doge Yellow", hex: "#FFD635", rgb: [255, 214, 53] },
  { name: "Cream / Vanilla", hex: "#FFF8B8", rgb: [255, 248, 184] },

  // Browns & Skin Tones
  { name: "Dark Umber", hex: "#49301F", rgb: [73, 48, 31] },
  { name: "Rich Brown", hex: "#6D432F", rgb: [109, 67, 47] },
  { name: "Tan / Caramel", hex: "#9C6926", rgb: [156, 105, 38] },
  { name: "Peach Skin", hex: "#FFDDAA", rgb: [255, 221, 170] },

  // Reds & Pinks
  { name: "Dark Burgundy", hex: "#6D001A", rgb: [109, 0, 26] },
  { name: "Pure Red", hex: "#BE0039", rgb: [190, 0, 57] },
  { name: "Bright Red", hex: "#FF3881", rgb: [255, 56, 129] },
  { name: "Soft Pink", hex: "#FF99AA", rgb: [255, 153, 170] },
  { name: "Bubblegum Pink", hex: "#FFA4D0", rgb: [255, 164, 208] },

  // Blues & Cyans
  { name: "Deep Navy", hex: "#001D42", rgb: [0, 29, 66] },
  { name: "Dark Blue", hex: "#2450A4", rgb: [36, 80, 164] },
  { name: "Electric Blue", hex: "#3690EA", rgb: [54, 144, 234] },
  { name: "Sky Cyan", hex: "#51E9F4", rgb: [81, 233, 244] },
  { name: "Teal", hex: "#00A3A3", rgb: [0, 163, 163] },
  { name: "Cyber Cyan", hex: "#00CCC0", rgb: [0, 204, 192] },

  // Greens
  { name: "Forest Green", hex: "#00756F", rgb: [0, 117, 111] },
  { name: "Emerald Green", hex: "#00A368", rgb: [0, 163, 104] },
  { name: "Neon Green", hex: "#00CC78", rgb: [0, 204, 120] },
  { name: "Lime Glow", hex: "#7EED56", rgb: [126, 237, 86] },

  // Purples
  { name: "Deep Purple", hex: "#362078", rgb: [54, 32, 120] },
  { name: "Violet", hex: "#6A5CFF", rgb: [106, 92, 255] },
  { name: "Lavender", hex: "#94B3FF", rgb: [148, 179, 255] },
];

export const PICO8_PALETTE: PaletteColor[] = [
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
];

export const GAMEBOY_PALETTE: PaletteColor[] = [
  { name: "Darkest Green", hex: "#0F380F", rgb: [15, 56, 15] },
  { name: "Dark Green", hex: "#306230", rgb: [48, 98, 48] },
  { name: "Light Green", hex: "#8BAC0F", rgb: [139, 172, 15] },
  { name: "Lightest Green", hex: "#9BBC0F", rgb: [155, 188, 15] },
];

// Perceptual Euclidean Color Snapping
export function snapToPalette(r: number, g: number, b: number, palette: PaletteColor[]): string {
  let closestHex = palette[0].hex;
  let minDistance = Infinity;

  for (let i = 0; i < palette.length; i++) {
    const [pr, pg, pb] = palette[i].rgb;
    // Human eye perceptual weighting (Red: 0.3, Green: 0.59, Blue: 0.11)
    const dr = r - pr;
    const dg = g - pg;
    const db = b - pb;
    const distance = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;
    if (distance < minDistance) {
      minDistance = distance;
      closestHex = palette[i].hex;
    }
  }

  return closestHex;
}

export interface PixelConversionOptions {
  targetCols: number;
  targetRows: number;
  paletteMode: "rplace" | "pico8" | "gameboy" | "original";
  removeBg: boolean;
  bgTolerance: number; // 10 to 80
  contrast: number; // 1.0 to 2.2
  cropToSubject: boolean;
}

export interface PixelConversionResult {
  pixels: Map<string, string>; // "row_col" -> hex
  width: number;
  height: number;
  pixelCount: number;
}

export function processImageToPixels(
  img: HTMLImageElement,
  options: PixelConversionOptions
): PixelConversionResult {
  const {
    targetCols,
    targetRows,
    paletteMode,
    removeBg,
    bgTolerance,
    contrast,
    cropToSubject,
  } = options;

  // 1. Initial High-res scan for background color detection & subject bounding box
  const scanCanvas = document.createElement("canvas");
  const scanW = Math.min(img.width, 360);
  const scanH = Math.min(img.height, Math.round((360 * img.height) / img.width));
  scanCanvas.width = scanW;
  scanCanvas.height = scanH;
  const scanCtx = scanCanvas.getContext("2d");

  if (!scanCtx) {
    return { pixels: new Map(), width: 0, height: 0, pixelCount: 0 };
  }

  scanCtx.drawImage(img, 0, 0, scanW, scanH);
  const scanData = scanCtx.getImageData(0, 0, scanW, scanH).data;

  // Sample perimeter pixels to establish the background color
  const samplePoints: [number, number][] = [
    [0, 0],
    [scanW - 1, 0],
    [0, scanH - 1],
    [scanW - 1, scanH - 1],
    [Math.floor(scanW / 2), 0],
    [Math.floor(scanW / 2), scanH - 1],
    [0, Math.floor(scanH / 2)],
    [scanW - 1, Math.floor(scanH / 2)],
  ];

  let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
  for (const [sx, sy] of samplePoints) {
    const idx = (sy * scanW + sx) * 4;
    sumR += scanData[idx];
    sumG += scanData[idx + 1];
    sumB += scanData[idx + 2];
    sumA += scanData[idx + 3];
  }
  const bgR = sumR / samplePoints.length;
  const bgG = sumG / samplePoints.length;
  const bgB = sumB / samplePoints.length;
  const bgA = sumA / samplePoints.length;

  const isBgTransparent = bgA < 40;

  // Find subject bounding box (where pixels differ from background)
  let minX = scanW, minY = scanH, maxX = 0, maxY = 0;
  let hasSubject = false;

  for (let y = 0; y < scanH; y++) {
    for (let x = 0; x < scanW; x++) {
      const idx = (y * scanW + x) * 4;
      const a = scanData[idx + 3];
      const r = scanData[idx];
      const g = scanData[idx + 1];
      const b = scanData[idx + 2];

      if (a < 30) continue;

      let isDifferent = true;
      if (!isBgTransparent) {
        const dist = Math.sqrt(
          0.3 * (r - bgR) ** 2 + 0.59 * (g - bgG) ** 2 + 0.11 * (b - bgB) ** 2
        );
        if (dist <= bgTolerance) {
          isDifferent = false;
        }
      }

      if (isDifferent) {
        hasSubject = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Determine source cropping rect
  let cropX = 0, cropY = 0, cropW = img.width, cropH = img.height;
  if (cropToSubject && hasSubject && maxX > minX && maxY > minY) {
    const padRatio = 0.04;
    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const padX = spanX * padRatio;
    const padY = spanY * padRatio;

    cropX = Math.max(0, Math.floor(((minX - padX) / scanW) * img.width));
    cropY = Math.max(0, Math.floor(((minY - padY) / scanH) * img.height));
    cropW = Math.min(img.width - cropX, Math.ceil(((spanX + 2 * padX) / scanW) * img.width));
    cropH = Math.min(img.height - cropY, Math.ceil(((spanY + 2 * padY) / scanH) * img.height));
  }

  // Compute final grid dimensions (preserving subject aspect ratio)
  const aspect = cropW / cropH;
  let finalCols = targetCols;
  let finalRows = Math.round(targetCols / aspect);

  if (finalRows > targetRows) {
    finalRows = targetRows;
    finalCols = Math.round(targetRows * aspect);
  }
  finalCols = Math.max(8, finalCols);
  finalRows = Math.max(8, finalRows);

  // 2. Downscale using two-pass sharp sampling (box-average then nearest-neighbor)
  const intermediateCanvas = document.createElement("canvas");
  // Intermediate size: 2x final grid to preserve sharp high-contrast features
  intermediateCanvas.width = finalCols * 2;
  intermediateCanvas.height = finalRows * 2;
  const interCtx = intermediateCanvas.getContext("2d");
  if (!interCtx) {
    return { pixels: new Map(), width: 0, height: 0, pixelCount: 0 };
  }

  interCtx.imageSmoothingEnabled = true;
  interCtx.imageSmoothingQuality = "high";
  interCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, finalCols * 2, finalRows * 2);

  // Target grid canvas (Nearest-Neighbor downscale!)
  const gridCanvas = document.createElement("canvas");
  gridCanvas.width = finalCols;
  gridCanvas.height = finalRows;
  const gridCtx = gridCanvas.getContext("2d");
  if (!gridCtx) {
    return { pixels: new Map(), width: 0, height: 0, pixelCount: 0 };
  }

  gridCtx.imageSmoothingEnabled = false; // TRUE NEAREST-NEIGHBOR!
  gridCtx.drawImage(intermediateCanvas, 0, 0, finalCols * 2, finalRows * 2, 0, 0, finalCols, finalRows);

  const rawData = gridCtx.getImageData(0, 0, finalCols, finalRows).data;

  // Selected Palette
  let activePalette: PaletteColor[] | null = null;
  if (paletteMode === "rplace") activePalette = RPLACE_PALETTE;
  else if (paletteMode === "pico8") activePalette = PICO8_PALETTE;
  else if (paletteMode === "gameboy") activePalette = GAMEBOY_PALETTE;

  const resultPixels = new Map<string, string>();

  // Center on available canvas grid
  const startCol = Math.max(0, Math.floor((targetCols - finalCols) / 2));
  const startRow = Math.max(0, Math.floor((targetRows - finalRows) / 2));

  for (let y = 0; y < finalRows; y++) {
    for (let x = 0; x < finalCols; x++) {
      const idx = (y * finalCols + x) * 4;
      const a = rawData[idx + 3];
      let r = rawData[idx];
      let g = rawData[idx + 1];
      let b = rawData[idx + 2];

      if (a < 35) continue;

      // Background removal check
      if (removeBg && !isBgTransparent) {
        const dist = Math.sqrt(
          0.3 * (r - bgR) ** 2 + 0.59 * (g - bgG) ** 2 + 0.11 * (b - bgB) ** 2
        );
        if (dist <= bgTolerance) {
          continue; // Strip background!
        }
      }

      // S-curve contrast boost
      if (contrast !== 1.0) {
        r = Math.min(255, Math.max(0, Math.round(((r / 255 - 0.5) * contrast + 0.5) * 255)));
        g = Math.min(255, Math.max(0, Math.round(((g / 255 - 0.5) * contrast + 0.5) * 255)));
        b = Math.min(255, Math.max(0, Math.round(((b / 255 - 0.5) * contrast + 0.5) * 255)));
      }

      let hexColor: string;
      if (activePalette) {
        hexColor = snapToPalette(r, g, b, activePalette);
      } else {
        hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }

      const gridR = y + startRow;
      const gridC = x + startCol;
      resultPixels.set(`${gridR}_${gridC}`, hexColor);
    }
  }

  return {
    pixels: resultPixels,
    width: finalCols,
    height: finalRows,
    pixelCount: resultPixels.size,
  };
}
