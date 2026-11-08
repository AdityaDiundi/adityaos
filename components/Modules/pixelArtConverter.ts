// True Grid Pixel Art Converter & Palette Quantizer
// Formats images into crisp, locked-grid voxel maps (r/place, PICO-8, GameBoy)
// Implements Multi-Scale Feature Preservation, Sobel Outline Injection, Cel-Shading, and Curated Iconic Presets

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
  outlineStrength: number; // 0.0 (off) to 1.0 (bold dark contours)
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
    outlineStrength = 0.6,
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

  // Determine source cropping rect (zooms tightly onto subject)
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
  const aspect = cropW / Math.max(cropH, 1);
  let finalCols = targetCols;
  let finalRows = Math.round(targetCols / aspect);

  if (finalRows > targetRows) {
    finalRows = targetRows;
    finalCols = Math.round(targetRows * aspect);
  }
  finalCols = Math.max(8, finalCols);
  finalRows = Math.max(8, finalRows);

  // 2. High-Resolution Multi-Scale Sampling Canvas (4x sub-sampling for fine lines & features)
  const subScale = 4;
  const interW = finalCols * subScale;
  const interH = finalRows * subScale;
  const intermediateCanvas = document.createElement("canvas");
  intermediateCanvas.width = interW;
  intermediateCanvas.height = interH;
  const interCtx = intermediateCanvas.getContext("2d");
  if (!interCtx) {
    return { pixels: new Map(), width: 0, height: 0, pixelCount: 0 };
  }

  interCtx.imageSmoothingEnabled = true;
  interCtx.imageSmoothingQuality = "high";
  interCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, interW, interH);
  const interData = interCtx.getImageData(0, 0, interW, interH).data;

  // Selected Palette
  let activePalette: PaletteColor[] | null = null;
  if (paletteMode === "rplace") activePalette = RPLACE_PALETTE;
  else if (paletteMode === "pico8") activePalette = PICO8_PALETTE;
  else if (paletteMode === "gameboy") activePalette = GAMEBOY_PALETTE;

  // Build cell luminance and feature maps across the target grid
  const cellAvgLum = new Float32Array(finalCols * finalRows);
  const cellMinLum = new Float32Array(finalCols * finalRows);
  const cellMaxLum = new Float32Array(finalCols * finalRows);
  const cellAvgR = new Uint8Array(finalCols * finalRows);
  const cellAvgG = new Uint8Array(finalCols * finalRows);
  const cellAvgB = new Uint8Array(finalCols * finalRows);
  const cellAvgA = new Uint8Array(finalCols * finalRows);
  const cellFeatureR = new Uint8Array(finalCols * finalRows);
  const cellFeatureG = new Uint8Array(finalCols * finalRows);
  const cellFeatureB = new Uint8Array(finalCols * finalRows);

  for (let gy = 0; gy < finalRows; gy++) {
    for (let gx = 0; gx < finalCols; gx++) {
      let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
      let minLum = 255;
      let maxLum = 0;
      let featR = 0, featG = 0, featB = 0;
      const count = subScale * subScale;

      for (let sy = 0; sy < subScale; sy++) {
        for (let sx = 0; sx < subScale; sx++) {
          const px = gx * subScale + sx;
          const py = gy * subScale + sy;
          const idx = (py * interW + px) * 4;

          const r = interData[idx];
          const g = interData[idx + 1];
          const b = interData[idx + 2];
          const a = interData[idx + 3];

          sumR += r;
          sumG += g;
          sumB += b;
          sumA += a;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < minLum) {
            minLum = lum;
            featR = r;
            featG = g;
            featB = b;
          }
          if (lum > maxLum) {
            maxLum = lum;
          }
        }
      }

      const cellIdx = gy * finalCols + gx;
      const avgR = Math.round(sumR / count);
      const avgG = Math.round(sumG / count);
      const avgB = Math.round(sumB / count);
      const avgA = Math.round(sumA / count);

      cellAvgR[cellIdx] = avgR;
      cellAvgG[cellIdx] = avgG;
      cellAvgB[cellIdx] = avgB;
      cellAvgA[cellIdx] = avgA;
      cellFeatureR[cellIdx] = featR;
      cellFeatureG[cellIdx] = featG;
      cellFeatureB[cellIdx] = featB;

      cellAvgLum[cellIdx] = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
      cellMinLum[cellIdx] = minLum;
      cellMaxLum[cellIdx] = maxLum;
    }
  }

  // Compute 2D Sobel edge gradients across the grid
  const cellSobel = new Float32Array(finalCols * finalRows);
  for (let gy = 0; gy < finalRows; gy++) {
    for (let gx = 0; gx < finalCols; gx++) {
      const getLum = (x: number, y: number) => {
        const cx = Math.max(0, Math.min(finalCols - 1, x));
        const cy = Math.max(0, Math.min(finalRows - 1, y));
        return cellAvgLum[cy * finalCols + cx];
      };

      const gxVal =
        -getLum(gx - 1, gy - 1) - 2 * getLum(gx - 1, gy) - getLum(gx - 1, gy + 1) +
        getLum(gx + 1, gy - 1) + 2 * getLum(gx + 1, gy) + getLum(gx + 1, gy + 1);

      const gyVal =
        -getLum(gx - 1, gy - 1) - 2 * getLum(gx, gy - 1) - getLum(gx + 1, gy - 1) +
        getLum(gx - 1, gy + 1) + 2 * getLum(gx, gy + 1) + getLum(gx + 1, gy + 1);

      cellSobel[gy * finalCols + gx] = Math.sqrt(gxVal * gxVal + gyVal * gyVal);
    }
  }

  const resultPixels = new Map<string, string>();
  const startCol = Math.max(0, Math.floor((targetCols - finalCols) / 2));
  const startRow = Math.max(0, Math.floor((targetRows - finalRows) / 2));

  for (let gy = 0; gy < finalRows; gy++) {
    for (let gx = 0; gx < finalCols; gx++) {
      const cellIdx = gy * finalCols + gx;
      const a = cellAvgA[cellIdx];
      let r = cellAvgR[cellIdx];
      let g = cellAvgG[cellIdx];
      let b = cellAvgB[cellIdx];

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

      // Feature Preservation & Sobel Outline Injection
      let isOutline = false;
      if (outlineStrength > 0) {
        const minL = cellMinLum[cellIdx];
        const maxL = cellMaxLum[cellIdx];
        const contrastRange = maxL - minL;
        const grad = cellSobel[cellIdx];
        const curLum = cellAvgLum[cellIdx];

        // 1. Dark micro-features (eyes, pupils, nostrils, eyelashes, eyebrows)
        // If a sub-pixel in this cell is very dark while contrast is high, preserve it!
        if (minL < 50 && contrastRange > 45 * (1.1 - outlineStrength * 0.4)) {
          if (curLum < 165 || outlineStrength >= 0.6) {
            isOutline = true;
          } else {
            // Blend cell toward the dark feature
            r = cellFeatureR[cellIdx];
            g = cellFeatureG[cellIdx];
            b = cellFeatureB[cellIdx];
          }
        }

        // 2. High Sobel Edge gradient on contour boundaries
        if (!isOutline && grad > 75 * (1.2 - outlineStrength * 0.5) && curLum < 155) {
          isOutline = true;
        }
      }

      // S-curve contrast boost
      if (contrast !== 1.0) {
        r = Math.min(255, Math.max(0, Math.round(((r / 255 - 0.5) * contrast + 0.5) * 255)));
        g = Math.min(255, Math.max(0, Math.round(((g / 255 - 0.5) * contrast + 0.5) * 255)));
        b = Math.min(255, Math.max(0, Math.round(((b / 255 - 0.5) * contrast + 0.5) * 255)));
      }

      let hexColor: string;
      if (isOutline) {
        // Crisp 1-pixel dark outline anchor
        hexColor = "#000000";
      } else if (activePalette) {
        hexColor = snapToPalette(r, g, b, activePalette);
      } else {
        hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }

      const gridR = gy + startRow;
      const gridC = gx + startCol;
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

// Iconic Presets with High-Fidelity SVG Embeds
export interface MasterpiecePreset {
  id: string;
  name: string;
  category: string;
  emoji: string;
  author: string;
  dataUrl: string;
}

// Clean SVG Data URLs
const DOGE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" fill="#caa568"/>
  <ellipse cx="60" cy="62" rx="42" ry="38" fill="#d99b38"/>
  <polygon points="26,45 18,15 42,28" fill="#c48628"/>
  <polygon points="28,42 22,20 40,30" fill="#f4b2b2"/>
  <polygon points="94,45 102,15 78,28" fill="#c48628"/>
  <polygon points="92,42 98,20 80,30" fill="#f4b2b2"/>
  <ellipse cx="60" cy="74" rx="28" ry="22" fill="#fff4d0"/>
  <ellipse cx="38" cy="65" rx="16" ry="18" fill="#fff4d0"/>
  <ellipse cx="82" cy="65" rx="16" ry="18" fill="#fff4d0"/>
  <ellipse cx="60" cy="48" rx="20" ry="10" fill="#d99b38"/>
  <ellipse cx="44" cy="52" rx="7" ry="9" fill="#1b120c"/>
  <ellipse cx="76" cy="52" rx="7" ry="9" fill="#1b120c"/>
  <circle cx="42" cy="50" r="2.5" fill="#ffffff"/>
  <circle cx="74" cy="50" r="2.5" fill="#ffffff"/>
  <path d="M 38 42 Q 44 38 50 42" stroke="#8a5314" stroke-width="2.5" fill="none"/>
  <path d="M 82 42 Q 76 38 70 42" stroke="#8a5314" stroke-width="2.5" fill="none"/>
  <ellipse cx="60" cy="68" rx="8" ry="6" fill="#111111"/>
  <ellipse cx="58" cy="66" rx="2.5" ry="1.5" fill="#ffffff" opacity="0.7"/>
  <path d="M 60 74 L 60 80 M 52 80 Q 60 84 68 80" stroke="#111111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`
)}`;

const ZENITSU_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" fill="#1a1c23"/>
  <polygon points="32,45 88,45 80,95 60,105 40,95" fill="#fedcc2"/>
  <ellipse cx="46" cy="62" rx="9" ry="11" fill="#151515"/>
  <ellipse cx="74" cy="62" rx="9" ry="11" fill="#151515"/>
  <ellipse cx="46" cy="63" rx="7" ry="9" fill="#f59e0b"/>
  <ellipse cx="74" cy="63" rx="7" ry="9" fill="#f59e0b"/>
  <circle cx="44" cy="60" r="3" fill="#ffffff"/>
  <circle cx="72" cy="60" r="3" fill="#ffffff"/>
  <path d="M 36 50 L 54 54" stroke="#111111" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 84 50 L 66 54" stroke="#111111" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="60" cy="74" r="1.5" fill="#a0522d"/>
  <path d="M 54 84 Q 60 88 66 84" stroke="#8b0000" stroke-width="2" fill="none" stroke-linecap="round"/>
  <polygon points="15,40 30,12 50,25 60,8 70,25 90,12 105,40 100,65 92,48 85,75 75,45 60,70 45,45 35,75 28,48 20,65" fill="#ffd000"/>
  <polygon points="15,40 20,25 30,12 38,20" fill="#ff6b00"/>
  <polygon points="50,25 60,8 70,25 60,18" fill="#ff6b00"/>
  <polygon points="90,12 100,25 105,40 95,28" fill="#ff6b00"/>
  <polygon points="35,75 28,62 38,62" fill="#ff6b00"/>
  <polygon points="85,75 78,62 88,62" fill="#ff6b00"/>
  <polygon points="30,100 60,120 15,120" fill="#f59e0b"/>
  <polygon points="90,100 60,120 105,120" fill="#f59e0b"/>
  <polygon points="45,108 55,108 50,118" fill="#ffffff"/>
  <polygon points="75,108 65,108 70,118" fill="#ffffff"/>
</svg>`
)}`;

const CYBERPUNK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" fill="#090a14"/>
  <circle cx="60" cy="55" r="30" fill="#ff007f"/>
  <rect x="25" y="48" width="70" height="2" fill="#090a14"/>
  <rect x="25" y="54" width="70" height="3" fill="#090a14"/>
  <rect x="25" y="62" width="70" height="4" fill="#090a14"/>
  <rect x="25" y="70" width="70" height="5" fill="#090a14"/>
  <rect x="5" y="55" width="20" height="65" fill="#00ffff"/>
  <rect x="18" y="40" width="22" height="80" fill="#120c2b"/>
  <rect x="35" y="65" width="15" height="55" fill="#00ffff" opacity="0.8"/>
  <rect x="45" y="32" width="28" height="88" fill="#0b081c"/>
  <rect x="70" y="50" width="20" height="70" fill="#120c2b"/>
  <rect x="85" y="60" width="25" height="60" fill="#ff007f" opacity="0.7"/>
  <rect x="98" y="45" width="18" height="75" fill="#0b081c"/>
  <rect x="50" y="38" width="4" height="4" fill="#00ffff"/>
  <rect x="62" y="44" width="4" height="4" fill="#ffea00"/>
  <rect x="50" y="52" width="4" height="4" fill="#ff007f"/>
  <rect x="24" y="48" width="3" height="3" fill="#00ffff"/>
  <rect x="76" y="58" width="3" height="3" fill="#ffea00"/>
</svg>`
)}`;

const PEPE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" fill="#1f232b"/>
  <path d="M 20 70 Q 15 35 45 35 Q 60 42 75 35 Q 105 35 100 70 Q 100 100 60 100 Q 20 100 20 70 Z" fill="#588e36"/>
  <circle cx="42" cy="40" r="16" fill="#588e36"/>
  <circle cx="78" cy="40" r="16" fill="#588e36"/>
  <ellipse cx="42" cy="40" rx="12" ry="10" fill="#ffffff"/>
  <ellipse cx="78" cy="40" rx="12" ry="10" fill="#ffffff"/>
  <path d="M 30 36 Q 42 30 54 36" stroke="#375522" stroke-width="4" fill="none"/>
  <path d="M 66 36 Q 78 30 90 36" stroke="#375522" stroke-width="4" fill="none"/>
  <circle cx="46" cy="40" r="4.5" fill="#111111"/>
  <circle cx="82" cy="40" r="4.5" fill="#111111"/>
  <ellipse cx="60" cy="76" rx="30" ry="10" fill="#a44336"/>
  <ellipse cx="60" cy="78" rx="26" ry="7" fill="#c95648"/>
  <path d="M 32 75 Q 60 85 88 75" stroke="#222222" stroke-width="2.5" fill="none"/>
</svg>`
)}`;

export const MASTERPIECE_PRESETS: MasterpiecePreset[] = [
  {
    id: "doge-shiba",
    name: "Doge (Shiba Inu)",
    category: "Meme",
    emoji: "🐕",
    author: "r/place Doge Legend",
    dataUrl: DOGE_SVG,
  },
  {
    id: "zenitsu-thunder",
    name: "Zenitsu (Demon Slayer)",
    category: "Anime",
    emoji: "⚡",
    author: "Demon Slayer 16-Bit",
    dataUrl: ZENITSU_SVG,
  },
  {
    id: "cyber-skyline",
    name: "Neo-Tokyo Skyline",
    category: "Cyberpunk",
    emoji: "🌃",
    author: "Noctalia Core",
    dataUrl: CYBERPUNK_SVG,
  },
  {
    id: "pepe-pixel",
    name: "Pepe Comfy",
    category: "Meme",
    emoji: "🐸",
    author: "Retro Internet",
    dataUrl: PEPE_SVG,
  },
];
