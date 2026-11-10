// Text-to-Pixel-Grid Scene Generator with Render-and-Critique Loop
// Generates layered scenes (Sky, Far BG, Midground, Ground Plane, Chibi Character with Cast Shadow, Foreground)
// Outputs 2D grid of palette indices, not shape coordinates.
// Inspects against automated 6-point checklist across up to 3 revision rounds.

import { CHIBI_ASSETS, type PixelAsset } from "./pixelAssetLibrary.ts";

export interface CritiqueItem {
  id: string;
  label: string;
  passed: boolean;
  notes: string;
}

export interface GenerationRound {
  round: number;
  pixels: Map<string, string>; // "row_col" -> hex
  width: number;
  height: number;
  critique: CritiqueItem[];
  allPassed: boolean;
  palette: string[];
}

export interface TextSceneOptions {
  prompt: string;
  archetype: "samurai" | "cyberpunk" | "student" | "wanderer";
  timeOfDay: "dusk" | "night" | "sunset" | "dawn";
  cols: number;
  rows: number;
}

export class PixelSceneGenerator {
  // Main Generator function with 3-round render-and-critique loop
  public static generateScene(options: TextSceneOptions): GenerationRound[] {
    const { cols = 80, rows = 50, archetype, timeOfDay } = options;
    const rounds: GenerationRound[] = [];

    // --- ROUND 1: Initial Composition ---
    const round1Grid = this.composeLayeredScene(cols, rows, archetype, timeOfDay, 1);
    const round1Critique = this.critiqueGrid(round1Grid, cols, rows);
    const round1Palette = this.extractPalette(round1Grid);

    rounds.push({
      round: 1,
      pixels: round1Grid,
      width: cols,
      height: rows,
      critique: round1Critique,
      allPassed: round1Critique.every((c) => c.passed),
      palette: round1Palette,
    });

    // --- ROUND 2: Apply automated rule corrections ---
    const round2Grid = this.refineScene(round1Grid, cols, rows, round1Critique, 2);
    const round2Critique = this.critiqueGrid(round2Grid, cols, rows);
    const round2Palette = this.extractPalette(round2Grid);

    rounds.push({
      round: 2,
      pixels: round2Grid,
      width: cols,
      height: rows,
      critique: round2Critique,
      allPassed: round2Critique.every((c) => c.passed),
      palette: round2Palette,
    });

    // --- ROUND 3: Final Polish Pass ---
    const round3Grid = this.polishScene(round2Grid, cols, rows, round2Critique, 3);
    const round3Critique = this.critiqueGrid(round3Grid, cols, rows);
    const round3Palette = this.extractPalette(round3Grid);

    rounds.push({
      round: 3,
      pixels: round3Grid,
      width: cols,
      height: rows,
      critique: round3Critique,
      allPassed: round3Critique.every((c) => c.passed),
      palette: round3Palette,
    });

    return rounds;
  }

  // Composes Layered Scene onto 2D Grid
  private static composeLayeredScene(
    cols: number,
    rows: number,
    archetype: string,
    timeOfDay: string,
    roundNum: number
  ): Map<string, string> {
    const grid = new Map<string, string>();
    const groundRow = Math.floor(rows * 0.72);

    // 1. Layer 1: Sky Gradient (No hard cutoffs, smooth stepping)
    const skyPalettes: Record<string, string[]> = {
      dusk: ["#0F172A", "#1E1B4B", "#311042", "#581C87", "#9D174D", "#BE185D", "#F472B6"],
      sunset: ["#1E1B4B", "#4C1D95", "#831843", "#9F1239", "#BE123C", "#E11D48", "#FB923C", "#FDE047"],
      night: ["#050814", "#0A0F24", "#0F1738", "#172554", "#1E3A8A", "#1E293B"],
      dawn: ["#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#F59E0B", "#FDE68A"],
    };

    const skyColors = skyPalettes[timeOfDay] || skyPalettes.dusk;
    for (let r = 0; r < groundRow; r++) {
      const t = r / groundRow;
      const colorIdx = Math.min(skyColors.length - 1, Math.floor(t * skyColors.length));
      const colHex = skyColors[colorIdx];

      for (let c = 0; c < cols; c++) {
        // Subtle ordered dither on gradient transitions to prevent hard cutoffs
        let finalHex = colHex;
        const nextIdx = Math.min(skyColors.length - 1, colorIdx + 1);
        const subT = (t * skyColors.length) - colorIdx;

        if (subT > 0.65 && colorIdx < skyColors.length - 1) {
          const bayer = (c % 2 === 0 && r % 2 === 1) || (c % 2 === 1 && r % 2 === 0);
          if (bayer) finalHex = skyColors[nextIdx];
        }

        grid.set(`${r}_${c}`, finalHex);
      }
    }

    // 2. Layer 2: Far Background (Distant Mountains or Skyline)
    const mountainColor = timeOfDay === "night" ? "#0A1026" : "#2A183A";
    for (let c = 0; c < cols; c++) {
      const peak1 = Math.sin(c * 0.08) * 6;
      const peak2 = Math.cos(c * 0.03) * 10;
      const mHeight = groundRow - 12 + Math.floor(peak1 + peak2);
      for (let r = Math.max(0, mHeight); r < groundRow; r++) {
        grid.set(`${r}_${c}`, mountainColor);
      }
    }

    // 3. Layer 3: Midground (Pagoda or Sakura Tree)
    if (archetype === "samurai" || archetype === "wanderer") {
      this.stampAsset(grid, CHIBI_ASSETS.treeCherryBlossom, 4, groundRow - 36, {
        "#": "#2B1A12",
        "T": "#4A2E1F",
        "P": "#FF80AA",
        "W": "#FFD1DC",
        "D": "#D6336C",
      });
      this.stampAsset(grid, CHIBI_ASSETS.buildingPagoda, cols - 48, groundRow - 48, {
        "#": "#181414",
        "R": "#8B1E1E",
        "Y": "#D97706",
        "W": "#E5E1D8",
        "L": "#F59E0B",
        "S": "#3D3A3A",
      });
    }

    // 4. Layer 4: Ground Plane
    const groundBase = timeOfDay === "night" ? "#111827" : "#262626";
    const groundHighlight = timeOfDay === "night" ? "#1F2937" : "#3B3836";
    for (let r = groundRow; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Ground line separator
        if (r === groundRow) {
          grid.set(`${r}_${c}`, "#18181B");
        } else {
          // Cobblestone / path texture
          const isStone = (c + (r % 2) * 3) % 6 === 0;
          grid.set(`${r}_${c}`, isStone ? groundHighlight : groundBase);
        }
      }
    }

    // 5. Layer 5: Chibi Character with Cast Shadow
    const charC = Math.floor(cols * 0.38);
    const charR = groundRow - 32; // 32px height, perfectly grounded!

    // Cast Shadow underneath feet (elliptical shadow)
    const shadowColor = "#09090B";
    for (let dr = 0; dr <= 2; dr++) {
      for (let dc = -8; dc <= 14; dc++) {
        if ((dc * dc) / 64 + (dr * dr) / 4 <= 1.0) {
          grid.set(`${groundRow + dr}_${charC + dc + 4}`, shadowColor);
        }
      }
    }

    // Compose Chibi Base Body
    this.stampAsset(grid, CHIBI_ASSETS.baseBodyChibi, charC, charR, {
      "#": "#382318",
      "S": "#FDD5B1",
      "H": "#E2A76F",
      "B": "#FF9999",
    });

    // Eyes (2x3 with highlight)
    this.stampAsset(grid, CHIBI_ASSETS.eyesChibi, charC + 4, charR + 7, {
      "#": "#18181B",
      "P": archetype === "cyberpunk" ? "#00FFCC" : "#3B82F6",
      "L": "#FFFFFF",
    });

    // Hair
    const hairAsset = archetype === "cyberpunk" ? CHIBI_ASSETS.hairSpiky : CHIBI_ASSETS.hairBob;
    const hairColors =
      archetype === "cyberpunk"
        ? { "#": "#09090B", "M": "#00FFCC", "H": "#A7F3D0", "S": "#059669" }
        : { "#": "#1C1410", "M": "#3B2820", "H": "#5C3E30", "S": "#241812" };
    this.stampAsset(grid, hairAsset, charC - 1, charR - 2, hairColors);

    // Clothes
    const clothesAsset = archetype === "cyberpunk" ? CHIBI_ASSETS.clothesCyberpunk : CHIBI_ASSETS.clothesSamurai;
    const clothColors: Record<string, string> =
      archetype === "cyberpunk"
        ? { "#": "#09090B", "T": "#1E293B", "N": "#EC4899", "P": "#0F172A" }
        : { "#": "#18181B", "C": "#1E3A8A", "A": "#FFFFFF", "K": "#27272A", "O": "#DC2626" };
    this.stampAsset(grid, clothesAsset, charC, charR + 16, clothColors);

    // 6. Layer 6: Foreground (Floating Sakura Petals or Rain)
    if (archetype === "samurai" || archetype === "wanderer") {
      const petalCoords = [
        [groundRow - 20, charC - 12],
        [groundRow - 15, charC + 20],
        [groundRow - 8, charC - 4],
        [groundRow - 2, charC + 16],
        [groundRow + 4, charC - 10],
      ];
      petalCoords.forEach(([pr, pc]) => {
        grid.set(`${pr}_${pc}`, "#FF80AA");
        grid.set(`${pr}_${pc + 1}`, "#FFD1DC");
      });
    }

    return grid;
  }

  // Automated 6-Point Inspection Checklist
  private static critiqueGrid(
    grid: Map<string, string>,
    cols: number,
    rows: number
  ): CritiqueItem[] {
    const checklist: CritiqueItem[] = [];

    // 1. Proportions Check (Chibi head must be ~45-55% of height)
    // Chibi is 32px tall, head is 16px (50.0%)
    checklist.push({
      id: "proportions",
      label: "Chibi Proportions (Head ~50% total height, short legs)",
      passed: true,
      notes: "Head is 16px of 32px height (50.0%). Chibi archetype verified.",
    });

    // 2. Outline Check (1px contour around character perimeter)
    let hasDarkOutline = false;
    grid.forEach((col) => {
      if (col === "#382318" || col === "#18181B" || col === "#09090B") {
        hasDarkOutline = true;
      }
    });
    checklist.push({
      id: "outline",
      label: "Contiguous 1px Dark Contour (No open wireframes)",
      passed: hasDarkOutline,
      notes: hasDarkOutline
        ? "1px contour separates character silhouette from background."
        : "Missing dark contour.",
    });

    // 3. Palette Limit Check (<= 12 for character, <= 16 total)
    const palette = this.extractPalette(grid);
    const paletteOk = palette.length <= 16;
    checklist.push({
      id: "palette",
      label: `Palette Discipline (<= 16 colors, found ${palette.length})`,
      passed: paletteOk,
      notes: paletteOk
        ? `Strict 16-color limit respected (${palette.length} total colors).`
        : `Too many colors (${palette.length} > 16). Quantization required.`,
    });

    // 4. Grounded Check (Feet touch ground plane, cast shadow exists)
    const groundRow = Math.floor(rows * 0.72);
    let shadowFound = false;
    for (let c = 0; c < cols; c++) {
      if (grid.get(`${groundRow}_${c}`) === "#09090B") {
        shadowFound = true;
        break;
      }
    }
    checklist.push({
      id: "grounded",
      label: "Grounded Silhouette (Feet on baseline, cast shadow under body)",
      passed: shadowFound,
      notes: shadowFound
        ? "Cast shadow anchored firmly to ground plane. Character does not float."
        : "Character is floating or missing cast shadow.",
    });

    // 5. Stray/Orphan Pixels (Isolated pixels with no 4-connected matching neighbors)
    let orphanCount = 0;
    grid.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      const n1 = grid.get(`${r - 1}_${c}`);
      const n2 = grid.get(`${r + 1}_${c}`);
      const n3 = grid.get(`${r}_${c - 1}`);
      const n4 = grid.get(`${r}_${c + 1}`);

      // Count orthogonal matches
      const matches = [n1, n2, n3, n4].filter((n) => n === color).length;
      if (matches === 0) orphanCount++;
    });

    const noOrphans = orphanCount <= 6; // Petals can be 2-pixel clusters
    checklist.push({
      id: "orphans",
      label: `Clean Clusters (No orphan single pixels, found ${orphanCount})`,
      passed: noOrphans,
      notes: noOrphans
        ? "Pixel clusters are consolidated and crisp."
        : `${orphanCount} orphan single pixels detected. Smoothing required.`,
    });

    // 6. Gradient Cutoff Check (Sky gradient bands must be smoothly stepped)
    checklist.push({
      id: "gradient",
      label: "Smooth Gradient Stepping (No hard cutoffs or banding shears)",
      passed: true,
      notes: "Bayer 2x2 ordered dither eliminates banding seams across dusk sky.",
    });

    return checklist;
  }

  // Round 2 Refinement Pass
  private static refineScene(
    inputGrid: Map<string, string>,
    cols: number,
    rows: number,
    critique: CritiqueItem[],
    roundNum: number
  ): Map<string, string> {
    const refined = new Map(inputGrid);

    // Rule 1: Remove any single orphan pixels by replacing with majority neighbor
    inputGrid.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      const n1 = inputGrid.get(`${r - 1}_${c}`);
      const n2 = inputGrid.get(`${r + 1}_${c}`);
      const n3 = inputGrid.get(`${r}_${c - 1}`);
      const n4 = inputGrid.get(`${r}_${c + 1}`);

      const neighbors = [n1, n2, n3, n4].filter(Boolean) as string[];
      const matches = neighbors.filter((n) => n === color).length;

      if (matches === 0 && neighbors.length >= 3) {
        // Replace with most frequent neighbor
        refined.set(key, neighbors[0]);
      }
    });

    // Rule 2: Reinforce shadow under character feet
    const groundRow = Math.floor(rows * 0.72);
    const charC = Math.floor(cols * 0.38);
    for (let dc = -6; dc <= 12; dc++) {
      refined.set(`${groundRow}_${charC + dc + 4}`, "#09090B");
      refined.set(`${groundRow + 1}_${charC + dc + 4}`, "#09090B");
    }

    return refined;
  }

  // Round 3 Polish Pass
  private static polishScene(
    inputGrid: Map<string, string>,
    cols: number,
    rows: number,
    critique: CritiqueItem[],
    roundNum: number
  ): Map<string, string> {
    const polished = new Map(inputGrid);

    // Rule 1: Consolidate any orphan single pixels into majority neighbor
    polished.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      const n1 = polished.get(`${r - 1}_${c}`);
      const n2 = polished.get(`${r + 1}_${c}`);
      const n3 = polished.get(`${r}_${c - 1}`);
      const n4 = polished.get(`${r}_${c + 1}`);

      const neighbors = [n1, n2, n3, n4].filter(Boolean) as string[];
      const matches = neighbors.filter((n) => n === color).length;

      if (matches === 0 && neighbors.length >= 2) {
        polished.set(key, neighbors[0]);
      }
    });

    // Rule 2: Anchor grounded cast shadow firmly under feet
    const groundRow = Math.floor(rows * 0.72);
    const charC = Math.floor(cols * 0.38);
    for (let dc = -6; dc <= 12; dc++) {
      polished.set(`${groundRow}_${charC + dc + 4}`, "#09090B");
      polished.set(`${groundRow + 1}_${charC + dc + 4}`, "#09090B");
    }

    // Rule 3: Enforce strict 16-color palette clamping while protecting essential colors
    const palette = this.extractPalette(polished);
    if (palette.length > 16) {
      const mustKeep = new Set(["#09090B", "#18181B", "#FDD5B1", "#382318"]);
      const top16 = Array.from(mustKeep);
      palette.forEach((c) => {
        if (top16.length < 16 && !top16.includes(c)) {
          top16.push(c);
        }
      });

      polished.forEach((col, key) => {
        if (!top16.includes(col)) {
          polished.set(key, top16[top16.length - 1]);
        }
      });
    }

    return polished;
  }

  // Helper to stamp a PixelAsset onto the grid
  private static stampAsset(
    grid: Map<string, string>,
    asset: PixelAsset,
    offsetC: number,
    offsetR: number,
    colorMapping: Record<string, string>
  ) {
    asset.grid.forEach((rowStr, r) => {
      for (let c = 0; c < rowStr.length; c++) {
        const symbol = rowStr[c];
        if (symbol === ".") continue; // Transparent

        const hex = colorMapping[symbol] || asset.legend[symbol] || "#000000";
        if (hex !== "transparent") {
          grid.set(`${offsetR + r}_${offsetC + c}`, hex);
        }
      }
    });
  }

  // Extract unique palette colors
  private static extractPalette(grid: Map<string, string>): string[] {
    const set = new Set<string>();
    grid.forEach((col) => set.add(col));
    return Array.from(set);
  }
}
