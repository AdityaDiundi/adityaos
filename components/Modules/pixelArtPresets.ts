// Full-Canvas Procedural Pixel Art Masterpieces for PixelEngine
// Generates rich, atmospheric, layered retro pixel scenes scaled to canvas dimensions.
// Features: Bayer-dithered twilight skies, celestial bodies, parallax mountain ridges,
// illuminated skyscraper window matrices, water reflections, and retro PC-98 scanline sunsets.

export type SceneType = "himalayanNight" | "tokyoDusk" | "pc98Sunset";

// Bayer 4x4 threshold matrix for retro halftone dither transitions
const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];

function shouldDither(r: number, c: number, threshold: number): boolean {
  return BAYER_4X4[r % 4][c % 4] < threshold;
}

/**
 * 1. HIMALAYAN PINE FOREST & STARRY NIGHT
 * Inspired by rural Himalayan fieldwork in Peora & Almora, Uttarakhand.
 * Layered snow-capped Himalayan peaks, silhouette pine forests, starry sky with crescent moon,
 * and a cozy mountain stone cottage with a glowing amber window and chimney smoke.
 */
export function generateHimalayanNight(cols: number = 72, rows: number = 44): Map<string, string> {
  const map = new Map<string, string>();
  const set = (r: number, c: number, col: string) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      map.set(`${r}_${c}`, col);
    }
  };

  const horizonRow = Math.floor(rows * 0.46);

  // 1. Dithered Night Sky (Deep Navy -> Midnight Blue -> Alpine Slate)
  for (let r = 0; r <= horizonRow + 8; r++) {
    const t = r / (horizonRow + 8);
    for (let c = 0; c < cols; c++) {
      let skyCol: string;
      if (t < 0.25) {
        skyCol = "#050914"; // Pitch night
      } else if (t < 0.45) {
        const threshold = (t - 0.25) / 0.2;
        skyCol = shouldDither(r, c, threshold) ? "#0C1428" : "#050914";
      } else if (t < 0.7) {
        const threshold = (t - 0.45) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#14233D" : "#0C1428";
      } else {
        const threshold = (t - 0.7) / 0.3;
        skyCol = shouldDither(r, c, threshold) ? "#1E3554" : "#14233D";
      }
      set(r, c, skyCol);
    }
  }

  // 2. Stars & Constellations
  // Deterministic star placement across upper sky
  for (let c = 2; c < cols - 2; c += 3) {
    const starRow = Math.floor(Math.sin(c * 17.3 + 5) * 6 + (rows * 0.16));
    if (starRow >= 1 && starRow < horizonRow - 4) {
      const isBright = (c * 7) % 5 === 0;
      set(starRow, c, isBright ? "#F8FAFC" : "#94A3B8");
      if (isBright && (c % 11 === 0)) {
        // Star glimmer cross
        set(starRow - 1, c, "#64748B");
        set(starRow + 1, c, "#64748B");
        set(starRow, c - 1, "#64748B");
        set(starRow, c + 1, "#64748B");
      }
    }
  }

  // 3. Crescent Moon (Upper Right)
  const moonCenterR = Math.floor(rows * 0.13);
  const moonCenterC = Math.floor(cols * 0.82);
  const moonRadius = Math.max(3, Math.floor(rows * 0.08));

  for (let dr = -moonRadius; dr <= moonRadius; dr++) {
    for (let dc = -moonRadius; dc <= moonRadius; dc++) {
      const dist1 = Math.sqrt(dr * dr + dc * dc);
      const dist2 = Math.sqrt((dr + 1) * (dr + 1) + (dc - 1.5) * (dc - 1.5));
      if (dist1 <= moonRadius && dist2 > moonRadius * 0.72) {
        set(moonCenterR + dr, moonCenterC + dc, "#FEF08A");
      } else if (dist1 <= moonRadius + 1 && dist1 > moonRadius && dist2 > moonRadius * 0.7) {
        set(moonCenterR + dr, moonCenterC + dc, "#F59E0B"); // Moon halo
      }
    }
  }

  // 4. Distant Snow Peaks (Himalayan Range: Nanda Devi / Trishul)
  const peakRow = (c: number): number => {
    // Multi-octave mountain silhouette
    const wave1 = Math.sin(c * 0.12) * (rows * 0.1);
    const wave2 = Math.sin(c * 0.28 + 1.2) * (rows * 0.05);
    const wave3 = Math.cos(c * 0.05 - 0.8) * (rows * 0.08);
    return Math.floor(rows * 0.42 - Math.abs(wave1 + wave2 + wave3));
  };

  for (let c = 0; c < cols; c++) {
    const topY = peakRow(c);
    for (let r = topY; r < rows; r++) {
      // Snow cap at summits
      if (r < topY + Math.max(2, Math.floor(rows * 0.07))) {
        set(r, c, (c % 2 === 0) ? "#F8FAFC" : "#E2E8F0");
      } else if (r < topY + Math.max(4, Math.floor(rows * 0.14))) {
        set(r, c, (c % 3 === 0) ? "#CBD5E1" : "#475569"); // Shaded rock crevices
      } else {
        set(r, c, "#1E293B"); // Mountain body
      }
    }
  }

  // 5. Midground Pine Ridge (Dark Forest Slopes)
  const ridgeRow = (c: number): number => {
    return Math.floor(rows * 0.58 + Math.sin(c * 0.08 + 2.5) * (rows * 0.09));
  };

  for (let c = 0; c < cols; c++) {
    const topY = ridgeRow(c);
    for (let r = topY; r < rows; r++) {
      set(r, c, "#0B1D16"); // Deep evergreen shadow
    }
    // Pine tree silhouettes along the ridge crest
    if (c % 3 === 0) {
      const treeH = 3 + (c % 4);
      for (let th = 0; th < treeH; th++) {
        set(topY - th, c, "#0F2E22");
        if (th > 0 && th < treeH - 1) {
          set(topY - th, c - 1, "#0F2E22");
          set(topY - th, c + 1, "#0F2E22");
        }
      }
    }
  }

  // 6. Foreground Slope & Mountain Cottage (Peora Field Station)
  const fgRow = (c: number): number => {
    return Math.floor(rows * 0.76 - (c / cols) * (rows * 0.12));
  };

  for (let c = 0; c < cols; c++) {
    const topY = fgRow(c);
    for (let r = topY; r < rows; r++) {
      set(r, c, (r === topY) ? "#163829" : "#0A1712"); // Earth ground
    }
  }

  // Cozy Mountain Cottage (Bottom Left)
  const houseC = Math.max(8, Math.floor(cols * 0.18));
  const houseR = fgRow(houseC) - 1;
  const houseW = Math.max(10, Math.floor(cols * 0.16));
  const houseH = Math.max(6, Math.floor(rows * 0.14));

  // Cottage Roof (Traditional Kumaoni Slate Roof)
  for (let dr = 0; dr < 4; dr++) {
    const roofSpan = houseW + (3 - dr) * 2;
    const startC = houseC - (3 - dr);
    for (let c = startC; c < startC + roofSpan; c++) {
      set(houseR - houseH - dr, c, "#334155");
    }
  }

  // Chimney & Smoke
  const chimC = houseC + houseW - 3;
  const chimTop = houseR - houseH - 6;
  for (let r = chimTop; r <= houseR - houseH; r++) {
    set(r, chimC, "#475569");
    set(r, chimC + 1, "#475569");
  }
  // Smoke puffs rising into the cold night air
  set(chimTop - 1, chimC + 1, "#94A3B8");
  set(chimTop - 2, chimC + 2, "#CBD5E1");
  set(chimTop - 3, chimC + 3, "#E2E8F0");
  set(chimTop - 4, chimC + 3, "#F8FAFC");
  set(chimTop - 5, chimC + 4, "#CBD5E1");

  // Cottage Timber Walls
  for (let r = houseR - houseH + 1; r <= houseR; r++) {
    for (let c = houseC; c < houseC + houseW; c++) {
      set(r, c, (r % 2 === 0) ? "#78350F" : "#92400E"); // Wood logs
    }
  }

  // Warm Glowing Golden Window (Heart of the scene)
  const winW = Math.max(3, Math.floor(houseW * 0.35));
  const winH = Math.max(2, Math.floor(houseH * 0.45));
  const winC = houseC + Math.floor((houseW - winW) / 2);
  const winR = houseR - houseH + 2;

  for (let r = winR; r < winR + winH; r++) {
    for (let c = winC; c < winC + winW; c++) {
      set(r, c, "#FDE047"); // Bright interior lantern
    }
  }
  // Window frame cross
  set(winR + Math.floor(winH / 2), winC + Math.floor(winW / 2), "#78350F");

  // Warm amber spill on the snow/grass outside the cabin door
  for (let dr = 1; dr <= 3; dr++) {
    for (let dc = -dr; dc < winW + dr; dc++) {
      set(houseR + dr, winC + dc, "#B45309");
    }
  }

  // Tall Deodar Pine Trees framing the scene (Right side)
  const treeC = Math.floor(cols * 0.88);
  const treeBaseR = fgRow(treeC);
  const treeH = Math.floor(rows * 0.35);

  // Trunk
  for (let r = treeBaseR - treeH; r <= treeBaseR; r++) {
    set(r, treeC, "#29180E");
  }
  // Layered Pine Foliage
  for (let tier = 0; tier < 5; tier++) {
    const tierR = treeBaseR - treeH + tier * Math.floor(treeH / 5);
    const span = tier * 2 + 1;
    for (let dc = -span; dc <= span; dc++) {
      set(tierR, treeC + dc, "#0B2618");
      set(tierR + 1, treeC + dc, "#123B26");
    }
  }

  return map;
}

/**
 * 2. CYBERPUNK NEO-TOKYO DUSK
 * Towering high-rises with illuminated window matrices, neon billboards,
 * warning beacon spires, and a reflective harbor waterline with dithered ripples.
 */
export function generateTokyoDusk(cols: number = 72, rows: number = 44): Map<string, string> {
  const map = new Map<string, string>();
  const set = (r: number, c: number, col: string) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      map.set(`${r}_${c}`, col);
    }
  };

  const waterRow = Math.floor(rows * 0.74);

  // 1. Dithered Dusk Sky (Deep Violet -> Magenta -> Amber Sunset Horizon)
  for (let r = 0; r < waterRow; r++) {
    const t = r / waterRow;
    for (let c = 0; c < cols; c++) {
      let skyCol: string;
      if (t < 0.25) {
        skyCol = "#0B0716"; // Deep space violet
      } else if (t < 0.5) {
        const threshold = (t - 0.25) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#27123A" : "#0B0716";
      } else if (t < 0.75) {
        const threshold = (t - 0.5) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#5B1847" : "#27123A";
      } else {
        const threshold = (t - 0.75) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#9E2A4B" : "#5B1847";
      }
      set(r, c, skyCol);
    }
  }

  // 2. Distant Backdrop Towers (Silhouettes in Deep Purple)
  const bldgWidths = [6, 8, 5, 9, 7, 8, 6, 9, 7, 8, 10];
  let curC = 0;
  let bIdx = 0;

  while (curC < cols) {
    const bw = bldgWidths[bIdx % bldgWidths.length];
    const bh = Math.floor(rows * 0.35 + Math.sin(bIdx * 3.7) * (rows * 0.15));
    const topR = waterRow - bh;

    for (let c = curC; c < curC + bw && c < cols; c++) {
      for (let r = topR; r < waterRow; r++) {
        set(r, c, "#151024");
      }
    }
    curC += bw + 1;
    bIdx++;
  }

  // 3. Main Skyscraper Layer (Detailed architecture & window matrices)
  const foregroundBldgs = [
    { c: 2, w: 9, h: 0.55, col: "#0C111C" },
    { c: 13, w: 12, h: 0.68, col: "#080D18" },
    { c: 27, w: 14, h: 0.58, col: "#0F1626" },
    { c: 43, w: 11, h: 0.64, col: "#0A101D" },
    { c: 56, w: 14, h: 0.52, col: "#0E1524" },
  ];

  foregroundBldgs.forEach((b, idx) => {
    const actualW = Math.min(b.w, cols - b.c);
    const topR = Math.floor(waterRow - rows * b.h);

    // Antenna & Red Warning Beacon
    const spireC = b.c + Math.floor(actualW / 2);
    for (let r = topR - 6; r < topR; r++) {
      set(r, spireC, "#64748B");
    }
    set(topR - 6, spireC, "#EF4444"); // Glowing beacon
    set(topR - 5, spireC, "#EF4444");

    // Building Mass
    for (let r = topR; r < waterRow; r++) {
      for (let c = b.c; c < b.c + actualW; c++) {
        set(r, c, b.col);
      }
    }

    // Illuminated Window Matrix
    for (let r = topR + 3; r < waterRow - 2; r += 2) {
      for (let c = b.c + 2; c < b.c + actualW - 2; c += 2) {
        const hash = (r * 13 + c * 37 + idx * 7) % 100;
        if (hash < 35) {
          set(r, c, "#FDE047"); // Warm yellow window
        } else if (hash < 50) {
          set(r, c, "#00FFCC"); // Cyber cyan window
        } else if (hash < 60) {
          set(r, c, "#EC4899"); // Magenta neon window
        }
      }
    }

    // Cyber Neon Billboard Strip on center tower
    if (idx === 1) {
      const bannerTop = topR + 8;
      const bannerC = b.c + 3;
      for (let r = bannerTop; r < bannerTop + 10; r++) {
        set(r, bannerC, "#00FFCC");
        set(r, bannerC + 1, "#EC4899");
      }
    }
  });

  // 4. Harbor Waterline & Reflections (Bottom 26%)
  for (let r = waterRow; r < rows; r++) {
    const depthT = (r - waterRow) / (rows - waterRow);
    for (let c = 0; c < cols; c++) {
      // Base dark water
      set(r, c, "#020D1A");

      // Wave ripples with dithered reflection from buildings above
      const waveOffset = Math.sin(c * 0.4 + r * 1.8) * 1.5;
      const srcC = Math.round(c + waveOffset);
      const srcR = waterRow - (r - waterRow) - 1;

      const srcPix = map.get(`${srcR}_${srcC}`);
      if (srcPix && (srcPix === "#00FFCC" || srcPix === "#EC4899" || srcPix === "#FDE047" || srcPix === "#EF4444")) {
        // Horizontal ripple spread
        if ((c + r) % 2 === 0 && depthT < 0.85) {
          set(r, c, srcPix);
        }
      } else if (srcPix && srcPix === "#9E2A4B") {
        if (shouldDither(r, c, 0.4)) {
          set(r, c, "#0369A1"); // Sky reflection on water
        }
      }
    }
  }

  // Waterline barrier / pier edge
  for (let c = 0; c < cols; c++) {
    set(waterRow, c, "#1E293B");
    if (c % 8 === 0) {
      set(waterRow - 1, c, "#F59E0B"); // Pier warning bollards
    }
  }

  return map;
}

/**
 * 3. RETRO JAPANESE PC-98 SEASIDE SUNSET
 * Iconic vintage 16-color PC-98 anime adventure game aesthetic:
 * Golden dithered sunset, giant low sun with scanline cuts,
 * rhythmic ocean wave bands, and flying migratory birds.
 */
export function generatePC98Sunset(cols: number = 72, rows: number = 44): Map<string, string> {
  const map = new Map<string, string>();
  const set = (r: number, c: number, col: string) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      map.set(`${r}_${c}`, col);
    }
  };

  const horizonRow = Math.floor(rows * 0.52);

  // 1. Sunset Gradient Sky (Royal Purple -> Crimson -> Tangerine -> Lemon Gold)
  for (let r = 0; r < horizonRow; r++) {
    const t = r / horizonRow;
    for (let c = 0; c < cols; c++) {
      let skyCol: string;
      if (t < 0.2) {
        skyCol = "#2E1065"; // Deep dusk violet
      } else if (t < 0.45) {
        const threshold = (t - 0.2) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#831843" : "#2E1065";
      } else if (t < 0.75) {
        const threshold = (t - 0.45) / 0.3;
        skyCol = shouldDither(r, c, threshold) ? "#EA580C" : "#831843";
      } else {
        const threshold = (t - 0.75) / 0.25;
        skyCol = shouldDither(r, c, threshold) ? "#FDE047" : "#EA580C";
      }
      set(r, c, skyCol);
    }
  }

  // 2. Giant Low Setting Sun (with authentic PC-98 scanline slits)
  const sunCenterR = horizonRow - 2;
  const sunCenterC = Math.floor(cols * 0.5);
  const sunRadius = Math.max(6, Math.floor(rows * 0.18));

  for (let dr = -sunRadius; dr <= sunRadius; dr++) {
    const curR = sunCenterR + dr;
    if (curR >= horizonRow) continue; // Cut off at ocean horizon

    for (let dc = -sunRadius; dc <= sunRadius; dc++) {
      const dist = Math.sqrt(dr * dr + dc * dc);
      if (dist <= sunRadius) {
        // Retro Horizontal Scanline Slits on lower half of the sun
        if (dr > 0 && dr % 2 === 0) {
          continue; // Leave transparent scan slit!
        }
        set(curR, sunCenterC + dc, (dist < sunRadius * 0.6) ? "#FFFBEB" : "#FBBF24");
      }
    }
  }

  // 3. Migratory Birds flying in the warm sky
  const birdPositions: [number, number][] = [
    [Math.floor(rows * 0.18), Math.floor(cols * 0.25)],
    [Math.floor(rows * 0.21), Math.floor(cols * 0.29)],
    [Math.floor(rows * 0.24), Math.floor(cols * 0.23)],
    [Math.floor(rows * 0.15), Math.floor(cols * 0.7)],
    [Math.floor(rows * 0.18), Math.floor(cols * 0.74)],
  ];
  birdPositions.forEach(([br, bc]) => {
    set(br, bc, "#1F1338");
    set(br - 1, bc - 1, "#1F1338");
    set(br - 1, bc + 1, "#1F1338");
  });

  // 4. Ocean Horizon & Layered Rhythmic Wave Planes
  for (let r = horizonRow; r < rows; r++) {
    const waveT = (r - horizonRow) / (rows - horizonRow);
    const sunGlowWidth = Math.max(8, Math.floor(cols * (0.28 + waveT * 0.4)));
    const sunLeft = sunCenterC - Math.floor(sunGlowWidth / 2);
    const sunRight = sunCenterC + Math.floor(sunGlowWidth / 2);

    for (let c = 0; c < cols; c++) {
      // Base dark ocean depth
      let oceanCol = (r % 2 === 0) ? "#0F172A" : "#1E293B";

      // Sun reflection corridor across the water
      if (c >= sunLeft && c <= sunRight) {
        const glowPhase = (c - sunLeft) / sunGlowWidth;
        const isWaveCrest = (r + Math.floor(c * 0.3)) % 3 === 0;

        if (isWaveCrest) {
          if (glowPhase > 0.35 && glowPhase < 0.65) {
            oceanCol = "#FEF08A"; // Bright golden foam
          } else {
            oceanCol = "#F59E0B"; // Amber reflection
          }
        } else if (r % 2 === 0) {
          oceanCol = "#B45309";
        }
      }

      set(r, c, oceanCol);
    }
  }

  // Distant Coastal Lighthouse on Left Edge
  const lhC = Math.max(4, Math.floor(cols * 0.12));
  const lhBase = horizonRow;
  for (let r = lhBase - 8; r <= lhBase; r++) {
    set(r, lhC, "#1F2937");
    set(r, lhC + 1, "#1F2937");
  }
  set(lhBase - 9, lhC, "#FDE047"); // Lantern glow
  set(lhBase - 9, lhC + 1, "#FDE047");

  // Soft light beam sweeping to the right
  for (let step = 1; step <= 8; step++) {
    if (step % 2 === 0) {
      set(lhBase - 9, lhC + 1 + step, "#FEF08A");
    }
  }

  return map;
}

export interface ScenePreset {
  id: SceneType;
  name: string;
  description: string;
  generate: (cols?: number, rows?: number) => Map<string, string>;
}

export const SCENE_PRESETS: Record<SceneType, ScenePreset> = {
  himalayanNight: {
    id: "himalayanNight",
    name: "Himalayan Night",
    description: "Starry peaks, pine forest & glowing cottage",
    generate: generateHimalayanNight,
  },
  tokyoDusk: {
    id: "tokyoDusk",
    name: "Tokyo Dusk",
    description: "Cyberpunk skyline, neon signs & harbor reflections",
    generate: generateTokyoDusk,
  },
  pc98Sunset: {
    id: "pc98Sunset",
    name: "PC-98 Sunset",
    description: "Retro Japanese scanline sun & ocean horizon",
    generate: generatePC98Sunset,
  },
};

export const SCENE_GENERATORS = SCENE_PRESETS;

// Backward-compatible default export: generates a full-canvas masterpiece
export const createInitialPixelArt = (
  rowOffset: number = 0,
  colOffset: number = 0,
  cols: number = 100,
  rows: number = 70
): Map<string, string> => {
  // Returns the Himalayan Night landscape
  return generateHimalayanNight(cols, rows);
};

// Retain legacy coordinate matrix export for backward compatibility
export const INITIAL_PIXELS: [number, number, string][] = [];
