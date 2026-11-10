// Crisp Integer Pixel Text Rasterizer
// Supports multiple bitmap fonts, integer scales (1x to 4x), alignment, outline/shadow,
// and 1-bit alpha-thresholded unicode/Devanagari rasterizer (zero antialiasing, crisp integer grid).

// 1. Classic 5x7 Bitmap Font
const FONT_5X7: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10011", "10101", "11001", "10001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["10001", "10001", "10001", "11111", "00001", "00001", "00001"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["01110", "10000", "11110", "10001", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  " ": ["000", "000", "000", "000", "000", "000", "000"],
  ".": ["0", "0", "0", "0", "0", "1", "1"],
  ",": ["0", "0", "0", "0", "0", "1", "1"],
  ":": ["0", "1", "0", "0", "0", "1", "0"],
  ";": ["0", "1", "0", "0", "0", "1", "1"],
  "!": ["1", "1", "1", "1", "0", "0", "1"],
  "?": ["01110", "10001", "00010", "00100", "00000", "00100", "00000"],
  "-": ["0000", "0000", "0000", "1111", "0000", "0000", "0000"],
  "+": ["0000", "0010", "0010", "1111", "0010", "0010", "0000"],
  "=": ["0000", "0000", "1111", "0000", "1111", "0000", "0000"],
  "/": ["00001", "00010", "00100", "01000", "10000", "00000", "00000"],
};

// 2. Micro 3x5 Bitmap Font
const FONT_3X5: Record<string, string[]> = {
  A: ["010", "101", "111", "101", "101"],
  B: ["110", "101", "110", "101", "110"],
  C: ["011", "100", "100", "100", "011"],
  D: ["110", "101", "101", "101", "110"],
  E: ["111", "100", "110", "100", "111"],
  F: ["111", "100", "110", "100", "100"],
  G: ["011", "100", "101", "101", "011"],
  H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"],
  J: ["001", "001", "001", "101", "010"],
  K: ["101", "110", "100", "110", "101"],
  L: ["100", "100", "100", "100", "111"],
  M: ["10001", "11011", "10101", "10001", "10001"],
  N: ["1001", "1101", "1011", "1001", "1001"],
  O: ["010", "101", "101", "101", "010"],
  P: ["110", "101", "110", "100", "100"],
  Q: ["010", "101", "101", "011", "001"],
  R: ["110", "101", "110", "101", "101"],
  S: ["011", "100", "010", "001", "110"],
  T: ["111", "010", "010", "010", "010"],
  U: ["101", "101", "101", "101", "011"],
  V: ["101", "101", "101", "101", "010"],
  W: ["10001", "10001", "10101", "11011", "10001"],
  X: ["101", "101", "010", "101", "101"],
  Y: ["101", "101", "010", "010", "010"],
  Z: ["111", "001", "010", "100", "111"],
  "0": ["010", "101", "101", "101", "010"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["110", "001", "010", "100", "111"],
  "3": ["110", "001", "110", "001", "110"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "110", "001", "110"],
  "6": ["011", "100", "110", "101", "010"],
  "7": ["111", "001", "001", "010", "010"],
  "8": ["010", "101", "010", "101", "010"],
  "9": ["010", "101", "011", "001", "110"],
  " ": ["00", "00", "00", "00", "00"],
  ".": ["0", "0", "0", "0", "1"],
  "-": ["000", "000", "111", "000", "000"],
  "+": ["000", "010", "111", "010", "000"],
};

export interface TextRasterOptions {
  text: string;
  startCol?: number;
  startRow?: number;
  col?: number;
  row?: number;
  scale?: number; // 1, 2, 3, 4
  fontId?: "classic5x7" | "micro3x5" | "unicode1bit";
  color: string;
  align?: "left" | "center" | "right";
  outline?: boolean;
  shadow?: boolean;
}

// 1-Bit Alpha Thresholded Unicode / Devanagari Offscreen Rasterizer
function rasterizeUnicodeGlyph(char: string, scale: number): { width: number; height: number; grid: boolean[][] } {
  const canvas = document.createElement("canvas");
  const baseSize = 10;
  canvas.width = baseSize * 2;
  canvas.height = baseSize * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { width: 4 * scale, height: 7 * scale, grid: [] };

  ctx.imageSmoothingEnabled = false;
  ctx.font = `${baseSize}px monospace, sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "top";
  ctx.fillText(char, 2, 2);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Find bounding box of glyph
  let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
  let hasPixel = false;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const a = data[(y * canvas.width + x) * 4 + 3];
      if (a > 120) { // Strict alpha threshold
        hasPixel = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixel) {
    // Space or missing glyph
    return { width: 4 * scale, height: 7 * scale, grid: [] };
  }

  const rawW = maxX - minX + 1;
  const rawH = maxY - minY + 1;

  const grid: boolean[][] = [];
  for (let y = minY; y <= maxY; y++) {
    const row: boolean[] = [];
    for (let x = minX; x <= maxX; x++) {
      const a = data[(y * canvas.width + x) * 4 + 3];
      row.push(a > 120);
    }
    grid.push(row);
  }

  return { width: rawW * scale, height: rawH * scale, grid };
}

export function rasterizeTextToPixels(options: TextRasterOptions): Map<string, string> {
  const {
    text,
    scale = 1,
    fontId = "classic5x7",
    color,
    align = "left",
    outline = false,
    shadow = false,
  } = options;
  const startCol = options.startCol ?? options.col ?? 0;
  const startRow = options.startRow ?? options.row ?? 0;

  const result = new Map<string, string>();
  if (!text) return result;

  const lines = text.split("\n");
  const fontDict = fontId === "micro3x5" ? FONT_3X5 : FONT_5X7;
  const baseLineHeight = (fontId === "micro3x5" ? 6 : 8) * scale;

  // First pass: measure line widths for alignment
  const lineMetrics = lines.map((line) => {
    let width = 0;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i].toUpperCase();
      if (fontId !== "unicode1bit" && fontDict[ch]) {
        width += (fontDict[ch][0].length + 1) * scale;
      } else {
        const uni = rasterizeUnicodeGlyph(line[i], scale);
        width += uni.width + scale;
      }
    }
    return Math.max(scale, width - scale);
  });

  const maxLineWidth = Math.max(...lineMetrics, 1);

  // Draw each line
  lines.forEach((line, lineIdx) => {
    const curRow = startRow + lineIdx * baseLineHeight;
    let curCol = startCol;

    const lineWidth = lineMetrics[lineIdx];
    if (align === "center") {
      curCol = startCol - Math.floor(lineWidth / 2);
    } else if (align === "right") {
      curCol = startCol - lineWidth;
    }

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const upperCh = ch.toUpperCase();

      if (fontId !== "unicode1bit" && fontDict[upperCh]) {
        const glyph = fontDict[upperCh];
        const gH = glyph.length;
        const gW = glyph[0].length;

        for (let r = 0; r < gH; r++) {
          for (let c = 0; c < gW; c++) {
            if (glyph[r][c] === "1") {
              for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                  const pr = curRow + r * scale + sy;
                  const pc = curCol + c * scale + sx;
                  result.set(`${pr}_${pc}`, color);
                }
              }
            }
          }
        }
        curCol += (gW + 1) * scale;
      } else {
        // Unicode / Devanagari 1-bit thresholded glyph
        const uni = rasterizeUnicodeGlyph(ch, scale);
        if (uni.grid.length > 0) {
          uni.grid.forEach((row, r) => {
            row.forEach((isPixel, c) => {
              if (isPixel) {
                for (let sy = 0; sy < scale; sy++) {
                  for (let sx = 0; sx < scale; sx++) {
                    const pr = curRow + r * scale + sy;
                    const pc = curCol + c * scale + sx;
                    result.set(`${pr}_${pc}`, color);
                  }
                }
              }
            });
          });
          curCol += uni.width + scale;
        } else {
          curCol += 4 * scale;
        }
      }
    }
  });

  // Apply Shadow (1px down-right offset with dark shade)
  if (shadow) {
    const shadowPixels = new Map<string, string>();
    const shadowColor = "#000000";
    result.forEach((_, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      const sKey = `${r + 1}_${c + 1}`;
      if (!result.has(sKey)) {
        shadowPixels.set(sKey, shadowColor);
      }
    });
    shadowPixels.forEach((hex, key) => {
      result.set(key, hex);
    });
  }

  // Apply 1px Outline (dark contour around text)
  if (outline) {
    const outlinePixels = new Map<string, string>();
    const outlineColor = "#000000";
    result.forEach((_, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const oKey = `${r + dr}_${c + dc}`;
          if (!result.has(oKey)) {
            outlinePixels.set(oKey, outlineColor);
          }
        }
      }
    });

    // Merge: outline underneath original text
    const finalMap = new Map<string, string>();
    outlinePixels.forEach((hex, key) => finalMap.set(key, hex));
    result.forEach((hex, key) => finalMap.set(key, hex));
    return finalMap;
  }

  return result;
}
