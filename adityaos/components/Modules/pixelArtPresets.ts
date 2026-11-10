// Full-Canvas Procedural Pixel Art Masterpieces for PixelEngine
// 21 Rich, Atmospheric, Layered Retro Pixel Scenes:
// - Iconic Shonen Anime: One Piece (Luffy G5, Sunny, Zoro), Death Note (Ryuk, L), Naruto (Valley of End, Sharingan), Dragon Ball (Goku SSJ), Attack on Titan (Colossal Titan), Demon Slayer (Tanjiro Water Dragon)
// - Modern & Ghibli Masterpieces: Jujutsu Kaisen (Gojo Infinite Void), Spirited Away (Sea Train), Princess Mononoke (Forest Spirit), Evangelion (EVA-01 Berserk), Akira (Kaneda Slide)
// - Landscapes & Cyberpunk: Himalayan Night, Tokyo Dusk, PC-98 Sunset, Cyberpunk Koi, Gargantua Black Hole, Great Wave of Kanagawa

export type SceneCategory = "anime" | "ghibli" | "landscape" | "cyberpunk";

export interface ScenePreset {
  id: string;
  name: string;
  category: SceneCategory;
  categoryLabel: string;
  description: string;
  generate: (cols?: number, rows?: number) => Map<string, string>;
}

// Bayer 4x4 threshold matrix for retro halftone dither transitions
const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];

function shouldDither(r: number, c: number, threshold: number): boolean {
  return BAYER_4X4[((r % 4) + 4) % 4][((c % 4) + 4) % 4] < threshold;
}

// Helper to create canvas map and drawing context
function createCanvasContext(cols: number, rows: number) {
  const map = new Map<string, string>();
  const set = (r: number, c: number, col: string) => {
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      map.set(`${r}_${c}`, col);
    }
  };
  const setDisc = (cr: number, cc: number, radius: number, col: string) => {
    const radInt = Math.ceil(radius);
    for (let dr = -radInt; dr <= radInt; dr++) {
      for (let dc = -radInt; dc <= radInt; dc++) {
        if (dr * dr + dc * dc <= radius * radius) {
          set(cr + dr, cc + dc, col);
        }
      }
    }
  };
  const setBox = (r1: number, c1: number, r2: number, c2: number, col: string) => {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
        set(r, c, col);
      }
    }
  };
  return { map, set, setDisc, setBox };
}

// ==========================================
// 1. HIMALAYAN PINE FOREST & STARRY NIGHT
// ==========================================
export function generateHimalayanNight(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set } = createCanvasContext(cols, rows);
  const horizonRow = Math.floor(rows * 0.46);

  // 1. Dithered Night Sky (Deep Navy -> Midnight Blue)
  for (let r = 0; r <= horizonRow + 8; r++) {
    const t = r / (horizonRow + 8);
    for (let c = 0; c < cols; c++) {
      let skyCol: string;
      if (t < 0.25) skyCol = "#050914";
      else if (t < 0.45) skyCol = shouldDither(r, c, (t - 0.25) / 0.2) ? "#0C1428" : "#050914";
      else if (t < 0.7) skyCol = shouldDither(r, c, (t - 0.45) / 0.25) ? "#14233D" : "#0C1428";
      else skyCol = shouldDither(r, c, (t - 0.7) / 0.3) ? "#1E3554" : "#14233D";
      set(r, c, skyCol);
    }
  }

  // 2. Stars
  for (let c = 2; c < cols - 2; c += 3) {
    const starRow = Math.floor(Math.sin(c * 17.3 + 5) * 6 + (rows * 0.16));
    if (starRow >= 1 && starRow < horizonRow - 4) {
      const isBright = (c * 7) % 5 === 0;
      set(starRow, c, isBright ? "#F8FAFC" : "#94A3B8");
      if (isBright && c % 11 === 0) {
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
      const d1 = Math.sqrt(dr * dr + dc * dc);
      const d2 = Math.sqrt((dr + 1) * (dr + 1) + (dc - 1.5) * (dc - 1.5));
      if (d1 <= moonRadius && d2 > moonRadius * 0.72) set(moonCenterR + dr, moonCenterC + dc, "#FEF08A");
      else if (d1 <= moonRadius + 1 && d1 > moonRadius && d2 > moonRadius * 0.7) set(moonCenterR + dr, moonCenterC + dc, "#F59E0B");
    }
  }

  // 4. Distant Snow Peaks
  const peakRow = (c: number): number => {
    const w1 = Math.sin(c * 0.12) * (rows * 0.1);
    const w2 = Math.sin(c * 0.28 + 1.2) * (rows * 0.05);
    const w3 = Math.cos(c * 0.05 - 0.8) * (rows * 0.08);
    return Math.floor(rows * 0.42 - Math.abs(w1 + w2 + w3));
  };
  for (let c = 0; c < cols; c++) {
    const topY = peakRow(c);
    for (let r = topY; r < rows; r++) {
      let mountainCol: string;
      if (r < topY + 4) mountainCol = (c % 2 === 0) ? "#FFFFFF" : "#E2E8F0";
      else if (r < topY + 9) mountainCol = (c % 3 === 0) ? "#CBD5E1" : "#94A3B8";
      else mountainCol = "#1E293B";
      set(r, c, mountainCol);
    }
  }

  // 5. Pine Ridge
  const ridgeRow = (c: number): number => Math.floor(rows * 0.58 + Math.sin(c * 0.08 + 2.5) * (rows * 0.09));
  for (let c = 0; c < cols; c++) {
    const topY = ridgeRow(c);
    for (let r = topY; r < rows; r++) set(r, c, "#0B1D16");
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

  // 6. Foreground Slope & Cottage
  const fgRow = (c: number): number => Math.floor(rows * 0.74 - (c / cols) * (rows * 0.1));
  for (let c = 0; c < cols; c++) {
    const topY = fgRow(c);
    for (let r = topY; r < rows; r++) set(r, c, (r === topY) ? "#163829" : "#0A1712");
  }

  // Cottage
  const houseC = Math.max(8, Math.floor(cols * 0.18));
  const houseR = fgRow(houseC) - 1;
  const houseW = Math.max(10, Math.floor(cols * 0.16));
  const houseH = Math.max(6, Math.floor(rows * 0.14));
  for (let dr = 0; dr < 4; dr++) {
    const span = houseW + (3 - dr) * 2;
    for (let c = houseC - (3 - dr); c < houseC - (3 - dr) + span; c++) set(houseR - houseH - dr, c, "#334155");
  }
  // Chimney & Smoke
  const chimC = houseC + houseW - 3;
  for (let r = houseR - houseH - 5; r <= houseR - houseH; r++) {
    set(r, chimC, "#475569");
    set(r, chimC + 1, "#475569");
  }
  set(houseR - houseH - 6, chimC + 1, "#94A3B8");
  set(houseR - houseH - 7, chimC + 2, "#CBD5E1");
  set(houseR - houseH - 8, chimC + 3, "#E2E8F0");
  for (let r = houseR - houseH + 1; r <= houseR; r++) {
    for (let c = houseC; c < houseC + houseW; c++) set(r, c, "#78350F");
  }
  // Glowing Window
  const winR = houseR - Math.floor(houseH * 0.55);
  const winC = houseC + Math.floor(houseW * 0.35);
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -2; dc <= 2; dc++) set(winR + dr, winC + dc, "#FDE047");
  }
  set(winR, winC, "#78350F"); // Window frame cross

  // Tall Pine on Right
  const treeC = Math.floor(cols * 0.86);
  const treeBase = fgRow(treeC);
  for (let r = treeBase - 18; r <= treeBase; r++) set(r, treeC, "#451A03");
  for (let tier = 0; tier < 5; tier++) {
    const tierR = treeBase - 8 - tier * 3;
    const tierW = 7 - tier;
    for (let dc = -tierW; dc <= tierW; dc++) {
      set(tierR, treeC + dc, "#064E3B");
      if (Math.abs(dc) < tierW - 1) set(tierR - 1, treeC + dc, "#047857");
    }
  }

  return map;
}

// ==========================================
// 2. TOKYO DUSK: CYBERPUNK SKYLINE
// ==========================================
export function generateTokyoDusk(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set } = createCanvasContext(cols, rows);
  const waterline = Math.floor(rows * 0.68);

  // Dusk Sky
  for (let r = 0; r < waterline; r++) {
    const t = r / waterline;
    for (let c = 0; c < cols; c++) {
      let col: string;
      if (t < 0.3) col = "#0F0B1A";
      else if (t < 0.6) col = shouldDither(r, c, (t - 0.3) / 0.3) ? "#2E1065" : "#0F0B1A";
      else if (t < 0.85) col = shouldDither(r, c, (t - 0.6) / 0.25) ? "#701A75" : "#2E1065";
      else col = shouldDither(r, c, (t - 0.85) / 0.15) ? "#BE185D" : "#701A75";
      set(r, c, col);
    }
  }

  // Buildings
  const towers = [
    { c: Math.floor(cols * 0.05), w: 10, h: Math.floor(rows * 0.45) },
    { c: Math.floor(cols * 0.16), w: 8, h: Math.floor(rows * 0.58) },
    { c: Math.floor(cols * 0.28), w: 12, h: Math.floor(rows * 0.5) },
    { c: Math.floor(cols * 0.42), w: 9, h: Math.floor(rows * 0.62) },
    { c: Math.floor(cols * 0.55), w: 11, h: Math.floor(rows * 0.38) },
    { c: Math.floor(cols * 0.7), w: 8, h: Math.floor(rows * 0.52) },
    { c: Math.floor(cols * 0.82), w: 10, h: Math.floor(rows * 0.42) },
  ];

  towers.forEach((tw, idx) => {
    const topR = waterline - tw.h;
    for (let r = topR; r < waterline; r++) {
      for (let c = tw.c; c < tw.c + tw.w; c++) {
        set(r, c, idx % 2 === 0 ? "#111827" : "#0F172A");
      }
    }
    // Antenna & warning light
    const antC = tw.c + Math.floor(tw.w / 2);
    for (let r = topR - 4; r < topR; r++) set(r, antC, "#64748B");
    set(topR - 5, antC, "#EF4444");

    // Illuminated Windows Matrix
    for (let r = topR + 2; r < waterline - 2; r += 2) {
      for (let c = tw.c + 1; c < tw.c + tw.w - 1; c += 2) {
        if ((r * 7 + c * 13) % 5 > 1) {
          const winColor = ((r + c) % 6 === 0) ? "#06B6D4" : ((r + c) % 7 === 0) ? "#F43F5E" : "#FDE047";
          set(r, c, winColor);
        }
      }
    }
  });

  // Harbor Waterline & Reflections
  for (let c = 0; c < cols; c++) set(waterline, c, (c % 5 === 0) ? "#F59E0B" : "#0284C7");
  for (let r = waterline + 1; r < rows; r++) {
    const depth = (r - waterline) / (rows - waterline);
    for (let c = 0; c < cols; c++) {
      let col = (depth < 0.4) ? "#082F49" : "#031C2D";
      if ((r + c) % 4 === 0 && Math.sin(r * 0.8 + c * 0.3) > 0.4) {
        col = (c % 7 === 0) ? "#38BDF8" : (c % 11 === 0) ? "#F472B6" : "#0284C7";
      }
      set(r, c, col);
    }
  }

  return map;
}

// ==========================================
// 3. PC-98 RETRO SUNSET
// ==========================================
export function generatePC98Sunset(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set } = createCanvasContext(cols, rows);
  const horizonRow = Math.floor(rows * 0.52);

  // Gradient Sky
  for (let r = 0; r < horizonRow; r++) {
    const t = r / horizonRow;
    for (let c = 0; c < cols; c++) {
      let skyCol: string;
      if (t < 0.2) skyCol = "#2E1065";
      else if (t < 0.45) skyCol = shouldDither(r, c, (t - 0.2) / 0.25) ? "#831843" : "#2E1065";
      else if (t < 0.75) skyCol = shouldDither(r, c, (t - 0.45) / 0.3) ? "#EA580C" : "#831843";
      else skyCol = shouldDither(r, c, (t - 0.75) / 0.25) ? "#FDE047" : "#EA580C";
      set(r, c, skyCol);
    }
  }

  // Giant Low Setting Sun with Scanline Slits
  const sunR = horizonRow - 2;
  const sunC = Math.floor(cols * 0.5);
  const sunRad = Math.max(6, Math.floor(rows * 0.18));
  for (let dr = -sunRad; dr <= sunRad; dr++) {
    const curR = sunR + dr;
    if (curR >= horizonRow) continue;
    for (let dc = -sunRad; dc <= sunRad; dc++) {
      const dist = Math.sqrt(dr * dr + dc * dc);
      if (dist <= sunRad) {
        if (dr > 0 && dr % 2 === 0) continue; // Scanline slit
        set(curR, sunC + dc, dist < sunRad * 0.6 ? "#FFFBEB" : "#FBBF24");
      }
    }
  }

  // Birds
  const birds: [number, number][] = [
    [Math.floor(rows * 0.18), Math.floor(cols * 0.25)],
    [Math.floor(rows * 0.21), Math.floor(cols * 0.29)],
    [Math.floor(rows * 0.15), Math.floor(cols * 0.7)],
  ];
  birds.forEach(([br, bc]) => {
    set(br, bc, "#1F1338");
    set(br - 1, bc - 1, "#1F1338");
    set(br - 1, bc + 1, "#1F1338");
  });

  // Ocean Wave Planes with Golden Sun Glare
  for (let r = horizonRow; r < rows; r++) {
    const waveT = (r - horizonRow) / (rows - horizonRow);
    const glowW = Math.max(8, Math.floor(cols * (0.28 + waveT * 0.4)));
    const left = sunC - Math.floor(glowW / 2);
    const right = sunC + Math.floor(glowW / 2);
    for (let c = 0; c < cols; c++) {
      let oceanCol = (r % 2 === 0) ? "#0C1B33" : "#081224";
      if (c >= left && c <= right) {
        const glowThreshold = 1 - Math.abs(c - sunC) / (glowW / 2);
        if (shouldDither(r, c, glowThreshold)) {
          oceanCol = (waveT > 0.6 && (r % 2 === 0)) ? "#FEF08A" : "#F59E0B";
        }
      }
      set(r, c, oceanCol);
    }
  }

  // Lighthouse
  const lhC = Math.max(4, Math.floor(cols * 0.12));
  for (let r = horizonRow - 8; r <= horizonRow; r++) {
    set(r, lhC, "#1F2937");
    set(r, lhC + 1, "#1F2937");
  }
  set(horizonRow - 9, lhC, "#FDE047");
  set(horizonRow - 9, lhC + 1, "#FDE047");
  for (let step = 1; step <= 8; step++) {
    if (step % 2 === 0) set(horizonRow - 9, lhC + 1 + step, "#FEF08A");
  }

  return map;
}

// ==========================================
// 4. ONE PIECE: LUFFY GEAR 5 (SUN GOD NIKA)
// ==========================================
export function generateLuffyGear5(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Wano Purple Night Sky & Full Moon
  for (let r = 0; r < rows; r++) {
    const t = r / rows;
    for (let c = 0; c < cols; c++) {
      set(r, c, shouldDither(r, c, t) ? "#1E1035" : "#0A0314");
    }
  }

  // Huge Glowing Moon in background
  const moonR = Math.floor(rows * 0.38);
  const moonC = Math.floor(cols * 0.5);
  const moonRad = Math.min(Math.floor(rows * 0.35), Math.floor(cols * 0.22));
  setDisc(moonR, moonC, moonRad, "#FEF3C7");
  setDisc(moonR, moonC, moonRad * 0.88, "#FFFFFF");

  // Nika Cloud Aura (Swirling Pure White Hair)
  const headR = Math.floor(rows * 0.42);
  const headC = Math.floor(cols * 0.5);

  // Billowing cloud curls around head
  for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
    const curlR = headR + Math.sin(angle) * (moonRad * 0.65);
    const curlC = headC + Math.cos(angle) * (moonRad * 0.7);
    setDisc(Math.floor(curlR), Math.floor(curlC), 4, "#FFFFFF");
    setDisc(Math.floor(curlR), Math.floor(curlC), 5, "#F1F5F9");
  }

  // Face Silhouette & Iconic Giant Nika Grin
  setDisc(headR, headC, 10, "#FFFBEB");
  // Red Vest
  for (let r = headR + 9; r < headR + 20; r++) {
    for (let c = headC - 10; c <= headC + 10; c++) {
      if (Math.abs(c - headC) < (r - headR)) set(r, c, "#DC2626");
    }
  }
  // Straw Hat Behind Neck
  setDisc(headR + 6, headC, 13, "#F59E0B");
  setDisc(headR + 6, headC, 10, "#DC2626"); // Hat Ribbon

  // Giant Happy Grin (Nika Joy)
  for (let c = headC - 7; c <= headC + 7; c++) {
    const dr = Math.floor(Math.sin((c - (headC - 7)) / 14 * Math.PI) * 4);
    set(headR + 2 + dr, c, "#1E1B4B");
    set(headR + 3 + dr, c, "#FFFFFF"); // White teeth
    set(headR + 4 + dr, c, "#F43F5E"); // Tongue
  }
  // Spiraling Eyes
  set(headR - 2, headC - 4, "#DC2626");
  set(headR - 2, headC - 3, "#FEF08A");
  set(headR - 2, headC + 4, "#DC2626");
  set(headR - 2, headC + 3, "#FEF08A");

  // Floating Purple Steam Ribbon
  for (let c = 0; c < cols; c += 2) {
    const sR = Math.floor(rows * 0.55 + Math.sin(c * 0.15) * 8);
    set(sR, c, "#C084FC");
    set(sR + 1, c, "#E879F9");
  }

  return map;
}

// ==========================================
// 5. ONE PIECE: THOUSAND SUNNY AT SUNSET
// ==========================================
export function generateThousandSunny(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);
  const seaLevel = Math.floor(rows * 0.65);

  // Grand Line Sunset
  for (let r = 0; r < seaLevel; r++) {
    const t = r / seaLevel;
    for (let c = 0; c < cols; c++) {
      let col = (t < 0.3) ? "#4C1D95" : (t < 0.6) ? "#BE185D" : (t < 0.85) ? "#EA580C" : "#FDE047";
      set(r, c, shouldDither(r, c, (t % 0.3) / 0.3) ? col : "#311042");
    }
  }

  // Ship Hull
  const shipC = Math.floor(cols * 0.48);
  const hullTop = seaLevel - 8;
  const hullBot = seaLevel + 4;
  for (let r = hullTop; r <= hullBot; r++) {
    const w = 22 - (r - hullTop) * 1.2;
    for (let c = Math.floor(shipC - w); c <= Math.floor(shipC + w); c++) {
      set(r, c, (r % 2 === 0) ? "#78350F" : "#B45309");
    }
  }

  // Lion Figurehead (Sunny's Mane & Face)
  const lionC = shipC + 20;
  const lionR = seaLevel - 6;
  // Golden Petal Mane
  setDisc(lionR, lionC, 7, "#F59E0B");
  setDisc(lionR, lionC, 5, "#FEF08A");
  set(lionR - 1, lionC + 2, "#1E293B"); // Eyes
  set(lionR + 1, lionC + 3, "#DC2626"); // Smile

  // Twin Masts & Big Straw Hat Skull Sail
  for (let r = seaLevel - 32; r < hullTop; r++) {
    set(r, shipC - 4, "#451A03");
    set(r, shipC + 10, "#451A03");
  }
  // Billowing Canvas Sail
  for (let r = seaLevel - 28; r <= seaLevel - 12; r++) {
    for (let c = shipC - 16; c <= shipC + 4; c++) {
      set(r, c, "#FFFBEB");
    }
  }
  // Straw Hat Skull on Sail
  const skullR = seaLevel - 20;
  const skullC = shipC - 6;
  setDisc(skullR, skullC, 4, "#1E1B4B");
  setDisc(skullR - 4, skullC, 5, "#F59E0B"); // Straw Hat on skull
  for (let dc = -7; dc <= 7; dc++) set(skullR - 3, skullC + dc, "#F59E0B");

  // Waves & Reflections
  for (let r = seaLevel; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      set(r, c, (r % 2 === 0) ? "#0369A1" : "#075985");
    }
  }

  return map;
}

// ==========================================
// 6. ONE PIECE: ZORO THREE-SWORD STYLE
// ==========================================
export function generateZoroAsura(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Dark Bamboo Forest at Midnight
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#05100B");
  }
  // Bamboo Stems
  for (let b = 4; b < cols; b += 9) {
    for (let r = 0; r < rows; r++) {
      set(r, b, "#0A2818");
      set(r, b + 1, "#0F3D24");
      if (r % 12 === 0) {
        set(r, b - 1, "#0F3D24");
        set(r, b + 2, "#0F3D24");
      }
    }
  }

  // Zoro's Head & Green Bandana
  const zoroR = Math.floor(rows * 0.48);
  const zoroC = Math.floor(cols * 0.45);
  setDisc(zoroR, zoroC, 8, "#166534"); // Green Bandana
  setDisc(zoroR + 3, zoroC, 6, "#FED7AA"); // Face

  // Eye with Red Demonic Glow / Scar
  set(zoroR + 2, zoroC - 2, "#EF4444");
  set(zoroR + 2, zoroC + 2, "#000000"); // Closed scarred left eye

  // Wado Ichimonji (Sword in Mouth)
  for (let dc = -24; dc <= 24; dc++) {
    set(zoroR + 5, zoroC + dc, "#F8FAFC");
    set(zoroR + 6, zoroC + dc, "#10B981"); // Emerald aura
  }

  // Hand Blade Slashes (Crossing Diagonal Slashes with Emerald Glow)
  for (let i = -22; i <= 22; i++) {
    // Slash 1: Diagonal Right
    set(zoroR + i, zoroC + i, "#FFFFFF");
    set(zoroR + i + 1, zoroC + i, "#10B981");
    set(zoroR + i - 1, zoroC + i, "#059669");
    // Slash 2: Diagonal Left
    set(zoroR + i, zoroC - i, "#FFFFFF");
    set(zoroR + i + 1, zoroC - i, "#10B981");
    set(zoroR + i - 1, zoroC - i, "#059669");
  }

  // Swirling Demon Ki Aura
  for (let c = 0; c < cols; c += 3) {
    const auraR = Math.floor(rows * 0.7 + Math.sin(c * 0.25) * 6);
    set(auraR, c, "#10B981");
    set(auraR + 1, c, "#047857");
  }

  return map;
}

// ==========================================
// 7. DEATH NOTE: RYUK & SHINIGAMI APPLE
// ==========================================
export function generateRyukDeathNote(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Bleak Midnight Rain
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, (r % 2 === 0) ? "#07090E" : "#020408");
  }
  // Rain streaks
  for (let r = 0; r < rows; r += 4) {
    for (let c = 0; c < cols; c += 7) {
      set(r + (c % 3), c, "#334155");
    }
  }

  // Massive Bat Wings Silhouette
  const ryukC = Math.floor(cols * 0.45);
  const ryukR = Math.floor(rows * 0.4);
  for (let dc = -32; dc <= 32; dc++) {
    const wingH = Math.floor(Math.sin((dc + 32) / 64 * Math.PI) * 16);
    for (let r = ryukR - wingH; r <= ryukR; r++) {
      set(r, ryukC + dc, "#0F172A");
    }
  }

  // Ryuk's Spiky Feather Silhouette
  setDisc(ryukR, ryukC, 9, "#0F172A");
  for (let spike = -12; spike <= 12; spike += 3) {
    set(ryukR - 9 - Math.abs(spike) / 2, ryukC + spike, "#1E293B");
  }

  // Piercing Glowing Eyes (Yellow & Crimson Iris)
  set(ryukR - 2, ryukC - 4, "#FACC15");
  set(ryukR - 2, ryukC - 3, "#EF4444");
  set(ryukR - 2, ryukC + 3, "#EF4444");
  set(ryukR - 2, ryukC + 4, "#FACC15");

  // Creepy Maniacal Grin
  for (let c = ryukC - 6; c <= ryukC + 6; c++) {
    set(ryukR + 3, c, "#F8FAFC");
    set(ryukR + 4, c, (c % 2 === 0) ? "#020617" : "#F8FAFC"); // Stitched sharp teeth
  }

  // Shinigami Glowing Red Apple Held Forward
  const appleC = ryukC + 16;
  const appleR = ryukR + 10;
  setDisc(appleR, appleC, 6, "#DC2626");
  setDisc(appleR, appleC, 4, "#EF4444");
  set(appleR - 2, appleC - 1, "#F87171"); // Specular highlight
  set(appleR - 6, appleC, "#78350F"); // Apple stem
  set(appleR - 7, appleC + 1, "#15803D"); // Apple leaf

  return map;
}

// ==========================================
// 8. DEATH NOTE: L LAWLIET IN CRT GLOW
// ==========================================
export function generateLLawliet(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc, setBox } = createCanvasContext(cols, rows);

  // Dark Room with Cold Cyan CRT Computer Glow
  const crtC = Math.floor(cols * 0.2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.abs(c - crtC);
      const intensity = Math.max(0, 1 - dist / (cols * 0.7));
      set(r, c, shouldDither(r, c, intensity * 0.5) ? "#082F49" : "#030712");
    }
  }

  // Signature Old-English Gothic 'L' on Monitor Screen
  setBox(Math.floor(rows * 0.2), crtC - 8, Math.floor(rows * 0.5), crtC + 8, "#000000");
  for (let r = Math.floor(rows * 0.25); r <= Math.floor(rows * 0.45); r++) {
    set(r, crtC - 3, "#38BDF8");
    if (r >= Math.floor(rows * 0.42)) {
      for (let c = crtC - 3; c <= crtC + 4; c++) set(r, c, "#38BDF8");
    }
  }

  // L's Crouched Silhouette
  const lC = Math.floor(cols * 0.58);
  const lR = Math.floor(rows * 0.48);

  // Wild Shaggy Black Hair
  setDisc(lR - 6, lC, 10, "#09090B");
  for (let dr = -12; dr <= -6; dr++) {
    set(lR + dr, lC + dr + 6, "#09090B");
    set(lR + dr, lC - dr - 6, "#09090B");
  }

  // Pale Face with Heavy Dark Circles
  setDisc(lR - 2, lC, 6, "#F5F5F4");
  set(lR - 3, lC - 3, "#18181B"); // Left eye
  set(lR - 3, lC + 3, "#18181B"); // Right eye
  set(lR - 2, lC - 3, "#71717A"); // Dark circle
  set(lR - 2, lC + 3, "#71717A");

  // Baggy White Long Sleeve Shirt (Crouched posture)
  for (let r = lR + 4; r <= lR + 18; r++) {
    const w = 12 - (r - (lR + 4)) * 0.4;
    for (let c = Math.floor(lC - w); c <= Math.floor(lC + w); c++) {
      set(r, c, "#E7E5E4");
    }
  }
  // Blue Jeans & Bare Feet
  for (let r = lR + 19; r < rows - 2; r++) {
    set(r, lC - 6, "#1D4ED8");
    set(r, lC + 6, "#1D4ED8");
  }
  set(lR + 2, lC + 1, "#F5F5F4"); // Thumb on lip

  return map;
}

// ==========================================
// 9. NARUTO: VALLEY OF THE END
// ==========================================
export function generateValleyOfTheEnd(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set } = createCanvasContext(cols, rows);
  const riverLevel = Math.floor(rows * 0.72);

  // Sky & Thunder Clouds
  for (let r = 0; r < riverLevel; r++) {
    const t = r / riverLevel;
    for (let c = 0; c < cols; c++) {
      set(r, c, shouldDither(r, c, t) ? "#1E293B" : "#0F172A");
    }
  }

  // Central Roaring Waterfall
  const fallC = Math.floor(cols * 0.5);
  for (let r = 8; r < riverLevel; r++) {
    for (let c = fallC - 5; c <= fallC + 5; c++) {
      set(r, c, (c % 2 === 0) ? "#E0F2FE" : "#38BDF8");
    }
  }

  // Left Cliff Statue: Hashirama Senju
  for (let r = 12; r < riverLevel; r++) {
    for (let c = 0; c < fallC - 8; c++) {
      set(r, c, (c % 3 === 0) ? "#475569" : "#334155");
    }
  }
  // Right Cliff Statue: Madara Uchiha
  for (let r = 12; r < riverLevel; r++) {
    for (let c = fallC + 8; c < cols; c++) {
      set(r, c, (c % 3 === 0) ? "#475569" : "#334155");
    }
  }

  // Clash in Mid-Air: Chidori (Lightning Cyan/Blue) vs Rasengan (Swirling Orange/White)
  const clashR = Math.floor(rows * 0.38);
  // Rasengan (Left)
  for (let dr = -4; dr <= 4; dr++) {
    for (let dc = -4; dc <= 4; dc++) {
      if (dr * dr + dc * dc <= 16) set(clashR + dr, fallC - 3 + dc, "#38BDF8");
    }
  }
  set(clashR, fallC - 3, "#FFFFFF");
  // Chidori (Right)
  for (let dr = -4; dr <= 4; dr++) {
    for (let dc = -4; dc <= 4; dc++) {
      if (dr * dr + dc * dc <= 16) set(clashR + dr, fallC + 3 + dc, "#A855F7");
    }
  }
  set(clashR, fallC + 3, "#F43F5E");

  // River Basin
  for (let r = riverLevel; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      set(r, c, (r % 2 === 0) ? "#0369A1" : "#0C4A6E");
    }
  }

  return map;
}

// ==========================================
// 10. NARUTO: MANGEKYO SHARINGAN
// ==========================================
export function generateSharinganEye(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Black Void with Amaterasu Flames
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#09090B");
  }

  const eyeR = Math.floor(rows * 0.5);
  const eyeC = Math.floor(cols * 0.5);
  const rad = Math.min(Math.floor(rows * 0.38), Math.floor(cols * 0.24));

  // Outer Eye Silhouette
  setDisc(eyeR, eyeC, rad + 2, "#18181B");
  // Blood-Red Iris
  setDisc(eyeR, eyeC, rad, "#DC2626");
  setDisc(eyeR, eyeC, rad * 0.85, "#EF4444");

  // 3 Curved Tomoe Blades (Mangekyo Pinwheel)
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    for (let d = 0; d < rad * 0.75; d += 0.8) {
      const curA = angle + (d / rad) * 1.2;
      const bR = Math.floor(eyeR + Math.sin(curA) * d);
      const bC = Math.floor(eyeC + Math.cos(curA) * d);
      setDisc(bR, bC, 2.5, "#000000");
    }
  }

  // Central Black Pupil
  setDisc(eyeR, eyeC, 4, "#000000");

  // Black Flame Wisps (Amaterasu)
  for (let c = 0; c < cols; c += 2) {
    if (c < eyeC - rad || c > eyeC + rad) {
      const flameR = eyeR + Math.floor(Math.sin(c * 0.3) * 8);
      set(flameR, c, "#000000");
      set(flameR - 1, c, "#4C1D95");
      set(flameR - 2, c, "#7E22CE");
    }
  }

  return map;
}

// ==========================================
// 11. DRAGON BALL: GOKU SUPER SAIYAN
// ==========================================
export function generateGokuSuperSaiyan(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Stormy Namek Sky
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#064E3B");
  }

  const gokuR = Math.floor(rows * 0.55);
  const gokuC = Math.floor(cols * 0.5);

  // Giant Fiery Golden Ki Aura
  for (let r = 4; r < rows - 4; r++) {
    for (let c = gokuC - 28; c <= gokuC + 28; c++) {
      const dist = Math.abs(c - gokuC);
      const noise = Math.sin(r * 0.5 + c * 0.2) * 5;
      if (dist + noise < 22) {
        set(r, c, (dist < 12) ? "#FEF08A" : "#F59E0B");
      }
    }
  }

  // Spiky Golden Hair
  const hairSpikes = [
    { dr: -22, dc: -14 }, { dr: -26, dc: -7 }, { dr: -28, dc: 0 },
    { dr: -26, dc: 7 }, { dr: -22, dc: 14 }, { dr: -16, dc: -18 }, { dr: -16, dc: 18 }
  ];
  hairSpikes.forEach((sp) => {
    for (let t = 0; t <= 1; t += 0.1) {
      const pr = Math.floor(gokuR - 10 + sp.dr * t);
      const pc = Math.floor(gokuC + sp.dc * t);
      setDisc(pr, pc, 4 * (1 - t * 0.6), "#FBBF24");
    }
  });

  // Face & Fierce Teal Eyes
  setDisc(gokuR - 8, gokuC, 7, "#FED7AA");
  set(gokuR - 9, gokuC - 3, "#2DD4BF"); // Teal Eye
  set(gokuR - 9, gokuC + 3, "#2DD4BF");
  set(gokuR - 6, gokuC, "#EA580C"); // Serious mouth

  // Orange Gi & Muscular Stance
  for (let r = gokuR; r < rows - 4; r++) {
    const w = 14 + (r - gokuR) * 0.2;
    for (let c = Math.floor(gokuC - w); c <= Math.floor(gokuC + w); c++) {
      set(r, c, Math.abs(c - gokuC) < 4 ? "#1E3A8A" : "#EA580C"); // Blue undershirt + Orange Gi
    }
  }

  // Lightning Sparks
  for (let s = 0; s < 6; s++) {
    const spR = Math.floor(rows * 0.2 + s * 5);
    const spC = gokuC + ((s % 2 === 0) ? 18 : -18);
    set(spR, spC, "#38BDF8");
    set(spR + 1, spC + 1, "#FFFFFF");
    set(spR + 2, spC, "#38BDF8");
  }

  return map;
}

// ==========================================
// 12. ATTACK ON TITAN: COLOSSAL OVER WALL MARIA
// ==========================================
export function generateColossalTitan(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc, setBox } = createCanvasContext(cols, rows);
  const wallTop = Math.floor(rows * 0.6);

  // Sunset Red Sky with Billowing White Steam
  for (let r = 0; r < wallTop; r++) {
    const t = r / wallTop;
    for (let c = 0; c < cols; c++) {
      set(r, c, shouldDither(r, c, t) ? "#EA580C" : "#991B1B");
    }
  }

  // Giant Steam Clouds
  for (let c = 4; c < cols; c += 8) {
    const steamH = Math.floor(Math.sin(c * 0.2) * 12 + 16);
    setDisc(wallTop - steamH, c, 7, "#F1F5F9");
    setDisc(wallTop - steamH + 4, c + 2, 8, "#E2E8F0");
  }

  // Colossal Titan's Massive Muscle Face
  const titanC = Math.floor(cols * 0.5);
  const titanR = wallTop - 12;
  setDisc(titanR, titanC, 16, "#991B1B"); // Deep muscle red
  for (let dr = -14; dr <= 14; dr++) {
    for (let dc = -14; dc <= 14; dc++) {
      if (dr * dr + dc * dc <= 196) {
        // Exposed sinew muscle striations
        if ((dr + dc) % 3 === 0) set(titanR + dr, titanC + dc, "#DC2626");
        if ((dr + dc) % 5 === 0) set(titanR + dr, titanC + dc, "#F87171");
      }
    }
  }
  // Skull Bones & Exposed Teeth
  setBox(titanR + 4, titanC - 8, titanR + 8, titanC + 8, "#FEF3C7");
  for (let c = titanC - 8; c <= titanC + 8; c += 2) set(titanR + 6, c, "#450A0A");
  // Sunken Hollow Eyes
  set(titanR - 3, titanC - 5, "#450A0A");
  set(titanR - 3, titanC + 5, "#450A0A");

  // Giant Wall Maria (Bottom Half)
  setBox(wallTop, 0, rows - 1, cols - 1, "#78716C");
  for (let r = wallTop; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r % 6 === 0 || c % 8 === 0) set(r, c, "#57534E"); // Stone brick blocks
    }
  }

  return map;
}

// ==========================================
// 13. DEMON SLAYER: TANJIRO WATER DRAGON
// ==========================================
export function generateTanjiroWaterDragon(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Dark Night Forest
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#050B14");
  }

  // Ukiyo-e Water Dragon Spiral
  for (let c = 0; c < cols; c++) {
    const angle = (c / cols) * Math.PI * 3;
    const centerR = Math.floor(rows * 0.5 + Math.sin(angle) * (rows * 0.28));
    for (let dr = -6; dr <= 6; dr++) {
      const col = (Math.abs(dr) < 2) ? "#FFFFFF" : (Math.abs(dr) < 4) ? "#38BDF8" : "#0284C7";
      set(centerR + dr, c, col);
    }
    // Cresting white foam splashes
    if (c % 4 === 0) {
      set(centerR - 7, c, "#FFFFFF");
      set(centerR - 8, c + 1, "#E0F2FE");
    }
  }

  // Dragon Head on Right
  const headC = Math.floor(cols * 0.82);
  const headR = Math.floor(rows * 0.45);
  setDisc(headR, headC, 10, "#0284C7");
  setDisc(headR, headC + 4, 7, "#38BDF8");
  setDisc(headR, headC + 8, 4, "#FFFFFF");
  set(headR - 2, headC + 3, "#DC2626"); // Dragon Red Eye
  // Whiskers
  for (let dc = 0; dc < 12; dc++) {
    set(headR - 3 - Math.floor(dc / 3), headC + 8 + dc, "#FFFFFF");
  }

  // Tanjiro Silhouette on Left
  const tanjiroC = Math.floor(cols * 0.2);
  const tanjiroR = Math.floor(rows * 0.65);
  // Checkered Haori (Green & Black)
  for (let r = tanjiroR - 10; r <= tanjiroR; r++) {
    for (let c = tanjiroC - 6; c <= tanjiroC + 6; c++) {
      const isGreen = ((Math.floor(r / 2) + Math.floor(c / 2)) % 2 === 0);
      set(r, c, isGreen ? "#15803D" : "#0F172A");
    }
  }
  // Black Nichirin Blade Strike
  for (let i = -14; i <= 14; i++) {
    set(tanjiroR - 6 - i / 2, tanjiroC + 6 + i, "#000000");
    set(tanjiroR - 7 - i / 2, tanjiroC + 6 + i, "#38BDF8"); // Water aura along edge
  }

  return map;
}

// ==========================================
// 14. JUJUTSU KAISEN: GOJO INFINITE VOID
// ==========================================
export function generateGojoDomain(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  const gojoC = Math.floor(cols * 0.5);
  const gojoR = Math.floor(rows * 0.52);

  // Infinite Cosmic Starfield & Cosmic Void
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.sqrt((r - gojoR) * (r - gojoR) + (c - gojoC) * (c - gojoC));
      let col = "#030206";
      if (dist < rows * 0.4) col = shouldDither(r, c, 1 - dist / (rows * 0.4)) ? "#3B0764" : "#030206";
      set(r, c, col);
    }
  }

  // Spiraling Galaxy Stars
  for (let i = 0; i < 40; i++) {
    const angle = i * 0.4;
    const rad = 6 + i * 0.8;
    const r = Math.floor(gojoR + Math.sin(angle) * rad);
    const c = Math.floor(gojoC + Math.cos(angle) * rad * 1.6);
    set(r, c, (i % 3 === 0) ? "#E879F9" : "#38BDF8");
  }

  // Gojo White Hair
  setDisc(gojoR - 8, gojoC, 10, "#FFFFFF");
  setDisc(gojoR - 10, gojoC, 11, "#F8FAFC");
  for (let dr = -16; dr <= -8; dr++) {
    set(gojoR + dr, gojoC - 4, "#FFFFFF");
    set(gojoR + dr, gojoC + 4, "#FFFFFF");
  }

  // Six Eyes (Glowing Radiant Cerulean Eyes)
  setDisc(gojoR - 4, gojoC - 4, 3, "#38BDF8");
  set(gojoR - 4, gojoC - 4, "#FFFFFF");
  setDisc(gojoR - 4, gojoC + 4, 3, "#38BDF8");
  set(gojoR - 4, gojoC + 4, "#FFFFFF");

  // Black High-Collar Jujutsu High Uniform
  for (let r = gojoR + 2; r < rows; r++) {
    const w = 12 + (r - gojoR) * 0.3;
    for (let c = Math.floor(gojoC - w); c <= Math.floor(gojoC + w); c++) {
      set(r, c, "#0F0F1A");
    }
  }

  // Domain Hand Sign (Mudra with Cyan & Purple Energy Spark)
  setDisc(gojoR + 8, gojoC, 4, "#FED7AA");
  set(gojoR + 8, gojoC, "#38BDF8");
  set(gojoR + 7, gojoC, "#A855F7");

  return map;
}

// ==========================================
// 15. GHIBLI: SPIRITED AWAY COASTAL TRAIN
// ==========================================
export function generateSpiritedAwayTrain(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setBox } = createCanvasContext(cols, rows);
  const seaLevel = Math.floor(rows * 0.58);

  // Pastel Sunset Sky (Peach / Pink / Lavender)
  for (let r = 0; r < seaLevel; r++) {
    const t = r / seaLevel;
    for (let c = 0; c < cols; c++) {
      let col = (t < 0.3) ? "#DDD6FE" : (t < 0.6) ? "#FBCFE8" : (t < 0.85) ? "#FED7AA" : "#FEF08A";
      set(r, c, col);
    }
  }

  // Ghibli Fluffy Sunset Clouds
  for (let c = 6; c < cols; c += 14) {
    for (let dr = -4; dr <= 4; dr++) {
      for (let dc = -8; dc <= 8; dc++) {
        if (dr * dr + (dc * 0.5) * (dc * 0.5) <= 16) {
          set(Math.floor(seaLevel * 0.35) + dr, c + dc, "#FFFFFF");
        }
      }
    }
  }

  // Classic Red Train Carriage
  const trainW = Math.floor(cols * 0.6);
  const trainLeft = Math.floor(cols * 0.2);
  const trainTop = seaLevel - 14;
  setBox(trainTop, trainLeft, seaLevel + 1, trainLeft + trainW, "#DC2626"); // Red Body
  setBox(trainTop - 2, trainLeft - 2, trainTop, trainLeft + trainW + 2, "#475569"); // Roof

  // Train Windows (Glowing Soft Yellow Inside)
  const winW = 8;
  for (let c = trainLeft + 4; c < trainLeft + trainW - 8; c += winW + 4) {
    setBox(trainTop + 3, c, seaLevel - 4, c + winW, "#FEF9C3");
    // No-Face Silhouette sitting inside first window!
    if (c === trainLeft + 4) {
      const nfC = c + 4;
      const nfR = seaLevel - 8;
      for (let dr = -4; dr <= 4; dr++) {
        for (let dc = -3; dc <= 3; dc++) set(nfR + dr, nfC + dc, "#0F172A");
      }
      set(nfR - 3, nfC, "#F8FAFC"); // White Mask
      set(nfR - 4, nfC, "#9333EA"); // Purple Mask Marking
    }
  }

  // Calm Glassy Turquoise Sea
  for (let r = seaLevel; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      set(r, c, (r % 2 === 0) ? "#0D9488" : "#0F766E");
    }
  }
  // Submerged Railway Track Tracks
  for (let c = 0; c < cols; c += 4) {
    set(seaLevel + 2, c, "#334155");
    set(seaLevel + 3, c, "#475569");
  }

  return map;
}

// ==========================================
// 16. GHIBLI: PRINCESS MONONOKE FOREST SPIRIT
// ==========================================
export function generateMononokeForest(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);
  const pondLevel = Math.floor(rows * 0.7);

  // Deep Ancient Mossy Forest
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#062816");
  }

  // Giant Cedar Trunks
  for (let trunkC of [Math.floor(cols * 0.1), Math.floor(cols * 0.35), Math.floor(cols * 0.85)]) {
    for (let r = 0; r < pondLevel; r++) {
      set(r, trunkC, "#1B432A");
      set(r, trunkC + 1, "#143320");
      set(r, trunkC - 1, "#235A38");
    }
  }

  // Sun Rays Filtering Down (God Rays)
  for (let r = 0; r < pondLevel; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c * 2) % 18 === 0) set(r, c, "#A7F3D0");
    }
  }

  // Forest Spirit (Shishigami Golden Stag Silhouette)
  const deerC = Math.floor(cols * 0.55);
  const deerR = pondLevel - 6;

  // Multi-Branched Coral Antlers
  for (let a = -12; a <= 12; a += 3) {
    for (let r = deerR - 16; r <= deerR - 8; r++) {
      if (Math.abs(r - (deerR - 12)) < Math.abs(a)) {
        set(r, deerC + a, "#FDE047");
      }
    }
  }
  // Head & Translucent Body
  setDisc(deerR - 6, deerC, 5, "#FEF08A");
  setDisc(deerR, deerC - 6, 8, "#FACC15");
  // Slender Legs on Water
  for (let r = deerR; r <= pondLevel; r++) {
    set(r, deerC - 10, "#CA8A04");
    set(r, deerC - 3, "#CA8A04");
  }

  // Bobbing White Kodama Spirits
  const kodamas = [
    [pondLevel - 14, Math.floor(cols * 0.12)],
    [pondLevel - 8, Math.floor(cols * 0.38)],
    [pondLevel - 10, Math.floor(cols * 0.82)],
    [pondLevel - 4, Math.floor(cols * 0.76)],
  ];
  kodamas.forEach(([kr, kc]) => {
    setDisc(kr, kc, 2, "#F8FAFC");
    set(kr, kc - 1, "#0F172A"); // Hollow eye
    set(kr, kc + 1, "#0F172A");
    set(kr + 1, kc, "#0F172A"); // Hollow mouth
  });

  // Mirror Pond Surface with Green Water Lilies
  for (let r = pondLevel; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      set(r, c, (r % 2 === 0) ? "#064E3B" : "#022C22");
    }
  }

  return map;
}

// ==========================================
// 17. EVANGELION: EVA-01 BERSERK
// ==========================================
export function generateEvangelionUnit01(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Blood Red Moonlit Sky
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, shouldDither(r, c, r / rows) ? "#450A0A" : "#1C0505");
  }

  // Giant Crimson Blood Moon
  const moonR = Math.floor(rows * 0.35);
  const moonC = Math.floor(cols * 0.65);
  setDisc(moonR, moonC, Math.floor(rows * 0.28), "#DC2626");
  setDisc(moonR, moonC, Math.floor(rows * 0.22), "#EF4444");

  // EVA-01 Angular Biomechanical Head (Roaring at Moon)
  const evaC = Math.floor(cols * 0.38);
  const evaR = Math.floor(rows * 0.55);

  // Long Forward Horn
  for (let i = 0; i < 18; i++) {
    set(evaR - 14 - i / 2, evaC + i, "#F97316"); // Orange Horn
    set(evaR - 13 - i / 2, evaC + i, "#EA580C");
  }

  // Purple Helmet Armor Plates
  setDisc(evaR - 6, evaC, 12, "#7E22CE");
  setDisc(evaR - 4, evaC + 4, 10, "#6B21A8");

  // Neon-Green Stripe & Glowing Eye
  for (let dc = -8; dc <= 8; dc++) set(evaR - 5, evaC + dc, "#22C55E");
  set(evaR - 6, evaC + 6, "#4ADE80"); // Piercing Neon Eye
  set(evaR - 6, evaC + 7, "#FFFFFF");

  // Roaring Open Jaw with Teeth
  for (let dr = 0; dr <= 8; dr++) {
    for (let dc = 0; dc <= 10; dc++) {
      if (dr > dc * 0.5) set(evaR + dr, evaC + dc, "#581C87");
    }
  }
  for (let dc = 2; dc <= 8; dc += 2) {
    set(evaR + 2, evaC + dc, "#F8FAFC"); // Upper teeth
    set(evaR + 6, evaC + dc, "#F8FAFC"); // Lower teeth
  }

  // Neo-Tokyo Fortress City Skyline Silhouettes
  for (let c = 0; c < cols; c++) {
    const bldH = Math.floor(Math.sin(c * 0.4) * 8 + 12);
    for (let r = rows - bldH; r < rows; r++) set(r, c, "#09090B");
  }

  return map;
}

// ==========================================
// 18. AKIRA: KANEDA'S MOTORCYCLE SLIDE
// ==========================================
export function generateAkiraSlide(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);
  const roadLevel = Math.floor(rows * 0.62);

  // Neo-Tokyo Dark Cityscape
  for (let r = 0; r < roadLevel; r++) {
    for (let c = 0; c < cols; c++) set(r, c, "#05050A");
  }
  // Neon Highway Billboards in distance
  setDisc(Math.floor(roadLevel * 0.3), Math.floor(cols * 0.2), 6, "#06B6D4");
  setDisc(Math.floor(roadLevel * 0.4), Math.floor(cols * 0.75), 5, "#EC4899");

  // Wet Asphalt Highway
  for (let r = roadLevel; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, (r % 2 === 0) ? "#1E293B" : "#0F172A");
  }

  // Kaneda's Iconic Red Bike (Sideways Drift Angle)
  const bikeC = Math.floor(cols * 0.5);
  const bikeR = roadLevel + 4;

  // Front & Rear Wheels
  setDisc(bikeR, bikeC - 16, 8, "#020617");
  setDisc(bikeR, bikeC - 16, 5, "#475569");
  setDisc(bikeR + 2, bikeC + 14, 8, "#020617");
  setDisc(bikeR + 2, bikeC + 14, 5, "#475569");

  // Streamlined Cherry-Red Chassis
  for (let dc = -14; dc <= 14; dc++) {
    const h = 7 - Math.abs(dc) * 0.3;
    for (let dr = -h; dr <= 2; dr++) {
      set(bikeR - 2 + dr, bikeC + dc, "#DC2626");
      if (dr === -h) set(bikeR - 2 + dr, bikeC + dc, "#F87171"); // Gloss highlight
    }
  }

  // Blazing Red Tail-Light Streak (Trailing Sideways across the road)
  for (let c = 0; c < bikeC - 10; c++) {
    set(bikeR - 4, c, "#EF4444");
    set(bikeR - 3, c, "#F87171");
    set(bikeR - 2, c, "#DC2626");
  }

  // Cyan Electrostatic Spark Arcs along Asphalt
  for (let c = bikeC - 14; c <= bikeC + 16; c += 2) {
    set(bikeR + 8, c, "#22D3EE");
    set(bikeR + 9, c + 1, "#E0F2FE");
  }

  return map;
}

// ==========================================
// 19. CYBERPUNK 2077: NIGHT CITY HOLOGRAPHIC KOI
// ==========================================
export function generateCyberpunkKoi(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  // Rainy Megacity Fog
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) set(r, c, (r % 2 === 0) ? "#070D18" : "#02050B");
  }

  // Megabuildings Silhouette on flanks
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < Math.floor(cols * 0.25); c++) set(r, c, "#0B132B");
    for (let c = Math.floor(cols * 0.78); c < cols; c++) set(r, c, "#0B132B");
  }

  // Giant Glowing Neon Hologram Koi Fish swimming in air
  const koiC = Math.floor(cols * 0.52);
  const koiR = Math.floor(rows * 0.44);

  // S-Curve Swimming Body
  for (let i = -24; i <= 24; i++) {
    const curR = Math.floor(koiR + Math.sin(i * 0.12) * 8);
    const curC = koiC + i;
    const bodyW = Math.floor(7 - Math.abs(i) * 0.22);
    for (let dr = -bodyW; dr <= bodyW; dr++) {
      const isCore = Math.abs(dr) < bodyW * 0.5;
      set(curR + dr, curC, isCore ? "#06B6D4" : "#EC4899");
    }
  }

  // Glowing Fins & Tail Ribbons
  for (let f = 0; f < 14; f++) {
    set(koiR + 6 + f, koiC - 8 + f, "#F43F5E");
    set(koiR - 6 - f, koiC - 8 + f, "#F43F5E");
    set(koiR + Math.floor(f / 2), koiC - 24 - f, "#06B6D4"); // Tail fin
  }

  // Scanline Glitch Grid Overlay
  for (let r = 0; r < rows; r += 3) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 8 === 0) set(r, c, "#38BDF8");
    }
  }

  return map;
}

// ==========================================
// 20. SCI-FI: GARGANTUA ACCRETION DISK BLACK HOLE
// ==========================================
export function generateGargantuaBlackHole(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);

  const holeC = Math.floor(cols * 0.5);
  const holeR = Math.floor(rows * 0.5);
  const radius = Math.min(Math.floor(rows * 0.24), Math.floor(cols * 0.16));

  // Deep Starfield Space
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      set(r, c, (r * 11 + c * 17) % 31 === 0 ? "#F8FAFC" : "#020205");
    }
  }

  // Gravitational Lensing Upper & Lower Halo
  for (let dr = -Math.floor(radius * 1.8); dr <= Math.floor(radius * 1.8); dr++) {
    for (let dc = -Math.floor(radius * 2.8); dc <= Math.floor(radius * 2.8); dc++) {
      const d = Math.sqrt(dr * dr + dc * dc * 0.4);
      if (d > radius * 0.8 && d < radius * 1.6) {
        const col = (d < radius * 1.1) ? "#FEF08A" : (d < radius * 1.4) ? "#F59E0B" : "#EA580C";
        set(holeR + dr, holeC + dc, col);
      }
    }
  }

  // Central Event Horizon (Absolute Pitch Black Sphere)
  setDisc(holeR, holeC, radius, "#000000");

  // Fiery Horizontal Equator Accretion Disk (Passing directly in front)
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -Math.floor(radius * 2.8); dc <= Math.floor(radius * 2.8); dc++) {
      set(holeR + dr, holeC + dc, (Math.abs(dr) === 0) ? "#FFFFFF" : "#FBBF24");
    }
  }

  return map;
}

// ==========================================
// 21. UKIYO-E: THE GREAT WAVE OF KANAGAWA
// ==========================================
export function generateGreatWave(cols: number = 80, rows: number = 50): Map<string, string> {
  const { map, set, setDisc } = createCanvasContext(cols, rows);
  const seaLevel = Math.floor(rows * 0.62);

  // Muted Cream Sky
  for (let r = 0; r < seaLevel; r++) {
    for (let c = 0; c < cols; c++) set(r, c, (r % 2 === 0) ? "#FAF5EC" : "#F4EBD9");
  }

  // Distant Snow-Capped Mount Fuji (Framed inside the wave trough)
  const fujiC = Math.floor(cols * 0.55);
  const fujiBase = seaLevel;
  for (let r = fujiBase - 12; r <= fujiBase; r++) {
    const w = (r - (fujiBase - 12)) * 1.1;
    for (let c = Math.floor(fujiC - w); c <= Math.floor(fujiC + w); c++) {
      set(r, c, (r < fujiBase - 7) ? "#FFFFFF" : "#1E3A8A");
    }
  }

  // Giant Curling Wave Crest from the Left
  for (let c = 0; c < Math.floor(cols * 0.75); c++) {
    const waveH = Math.floor(Math.sin((c / cols) * Math.PI) * (rows * 0.5) + (c / cols) * 8);
    const topR = seaLevel - waveH;
    for (let r = topR; r < rows; r++) {
      const col = (r < topR + 3) ? "#FFFFFF" : (r < topR + 8) ? "#0284C7" : "#0C4A6E";
      set(r, c, col);
    }
    // Wave Claw Claws (Iconic Hokusai Foam Claws)
    if (c % 3 === 0 && topR > 4) {
      set(topR - 1, c, "#FFFFFF");
      set(topR - 2, c + 1, "#FFFFFF");
      set(topR - 3, c + 2, "#E0F2FE");
    }
  }

  // Traditional Oared Boat Caught in Trough
  const boatC = Math.floor(cols * 0.42);
  const boatR = seaLevel + 4;
  for (let dc = -10; dc <= 10; dc++) {
    set(boatR + Math.floor(dc * 0.2), boatC + dc, "#D97706");
  }

  return map;
}

// ==========================================
// MASTER SCENE PRESETS CATALOG (21 SCENES)
// ==========================================
export const SCENE_PRESETS: Record<string, ScenePreset> = {
  // --- Iconic Shonen Anime ---
  luffyGear5: {
    id: "luffyGear5",
    name: "Luffy Gear 5 (Nika)",
    category: "anime",
    categoryLabel: "Anime",
    description: "Sun God Nika billowing cloud hair & grinning full moon",
    generate: generateLuffyGear5,
  },
  thousandSunny: {
    id: "thousandSunny",
    name: "Thousand Sunny",
    category: "anime",
    categoryLabel: "Anime",
    description: "Straw Hat pirate ship sailing into Grand Line sunset",
    generate: generateThousandSunny,
  },
  zoroAsura: {
    id: "zoroAsura",
    name: "Zoro: Demon Aura",
    category: "anime",
    categoryLabel: "Anime",
    description: "Three-Sword Style stance with emerald ki slashes",
    generate: generateZoroAsura,
  },
  ryukDeathNote: {
    id: "ryukDeathNote",
    name: "Ryuk & Apple",
    category: "anime",
    categoryLabel: "Anime",
    description: "Shinigami silhouette with glowing red eyes in midnight rain",
    generate: generateRyukDeathNote,
  },
  lLawliet: {
    id: "lLawliet",
    name: "L Lawliet",
    category: "anime",
    categoryLabel: "Anime",
    description: "L crouched in room illuminated by cold cyan CRT glow",
    generate: generateLLawliet,
  },
  valleyOfTheEnd: {
    id: "valleyOfTheEnd",
    name: "Valley of the End",
    category: "anime",
    categoryLabel: "Anime",
    description: "Naruto vs Sasuke clash at the giant stone waterfalls",
    generate: generateValleyOfTheEnd,
  },
  sharinganEye: {
    id: "sharinganEye",
    name: "Mangekyo Sharingan",
    category: "anime",
    categoryLabel: "Anime",
    description: "Curved tomoe pinwheel iris with Amaterasu black flames",
    generate: generateSharinganEye,
  },
  gokuSuperSaiyan: {
    id: "gokuSuperSaiyan",
    name: "Goku Super Saiyan",
    category: "anime",
    categoryLabel: "Anime",
    description: "Golden spiky hair with fiery ki aura & blue sparks",
    generate: generateGokuSuperSaiyan,
  },
  colossalTitan: {
    id: "colossalTitan",
    name: "Colossal Titan",
    category: "anime",
    categoryLabel: "Anime",
    description: "Giant muscle face peering over Wall Maria with steam",
    generate: generateColossalTitan,
  },
  tanjiroWaterDragon: {
    id: "tanjiroWaterDragon",
    name: "Tanjiro: Water Dragon",
    category: "anime",
    categoryLabel: "Anime",
    description: "Checkered haori with spiraling ukiyo-e azure dragon",
    generate: generateTanjiroWaterDragon,
  },

  // --- Modern & Ghibli Masterpieces ---
  gojoDomain: {
    id: "gojoDomain",
    name: "Gojo: Infinite Void",
    category: "anime",
    categoryLabel: "Anime",
    description: "Six Eyes glowing in cosmic domain expansion starfield",
    generate: generateGojoDomain,
  },
  spiritedAwayTrain: {
    id: "spiritedAwayTrain",
    name: "Spirited Away: Sea Train",
    category: "ghibli",
    categoryLabel: "Ghibli",
    description: "Red coastal train over turquoise water with No-Face",
    generate: generateSpiritedAwayTrain,
  },
  mononokeForest: {
    id: "mononokeForest",
    name: "Mononoke Forest Spirit",
    category: "ghibli",
    categoryLabel: "Ghibli",
    description: "Golden Shishigami stag on moss pond with white Kodamas",
    generate: generateMononokeForest,
  },
  evangelionUnit01: {
    id: "evangelionUnit01",
    name: "EVA-01 Berserk",
    category: "anime",
    categoryLabel: "Anime",
    description: "Purple & neon-green cybernetic head roaring at blood moon",
    generate: generateEvangelionUnit01,
  },
  akiraSlide: {
    id: "akiraSlide",
    name: "Akira: Bike Slide",
    category: "cyberpunk",
    categoryLabel: "Cyberpunk",
    description: "Kaneda's red bike sideways drift with red light trails",
    generate: generateAkiraSlide,
  },

  // --- Landscapes & Retro Sci-Fi ---
  himalayanNight: {
    id: "himalayanNight",
    name: "Himalayan Night",
    category: "landscape",
    categoryLabel: "Landscape",
    description: "Starry peaks, pine forest & warm glowing Peora cottage",
    generate: generateHimalayanNight,
  },
  tokyoDusk: {
    id: "tokyoDusk",
    name: "Tokyo Dusk",
    category: "cyberpunk",
    categoryLabel: "Cyberpunk",
    description: "Cyberpunk neon skyscraper matrix & harbor reflections",
    generate: generateTokyoDusk,
  },
  pc98Sunset: {
    id: "pc98Sunset",
    name: "PC-98 Sunset",
    category: "landscape",
    categoryLabel: "Landscape",
    description: "Retro Japanese scanline sun, lighthouse & ocean waves",
    generate: generatePC98Sunset,
  },
  cyberpunkKoi: {
    id: "cyberpunkKoi",
    name: "Night City Koi",
    category: "cyberpunk",
    categoryLabel: "Cyberpunk",
    description: "Giant holographic neon cyan/pink koi swimming in the rain",
    generate: generateCyberpunkKoi,
  },
  gargantuaBlackHole: {
    id: "gargantuaBlackHole",
    name: "Gargantua Singularity",
    category: "landscape",
    categoryLabel: "Sci-Fi",
    description: "Accretion disk black hole bending golden starlight",
    generate: generateGargantuaBlackHole,
  },
  greatWave: {
    id: "greatWave",
    name: "Great Wave of Kanagawa",
    category: "landscape",
    categoryLabel: "Art Classic",
    description: "Hokusai's cresting Prussian blue wave curling over Mt Fuji",
    generate: generateGreatWave,
  },
};

export const SCENE_GENERATORS = SCENE_PRESETS;

// Backward-compatible default export: generates the Himalayan Night landscape
export const createInitialPixelArt = (
  rowOffset: number = 0,
  colOffset: number = 0,
  cols: number = 100,
  rows: number = 70
): Map<string, string> => {
  return generateHimalayanNight(cols, rows);
};

// Retain legacy coordinate matrix export for backward compatibility
export const INITIAL_PIXELS: [number, number, string][] = [];
