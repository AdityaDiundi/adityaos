"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Grid,
  Box,
  Layers,
  Sparkles,
  Maximize2,
  Activity,
  Check,
  Volume2,
  VolumeX,
  Type,
  FlipHorizontal,
  ChevronRight,
  ChevronLeft,
  Flame,
  Palette,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Sliders,
  Globe,
  Gamepad2,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  subscribeToFirebaseStats,
  recordPixelDrawn,
  recordPixelPopped,
  GlobalCommunityStats,
} from "@/lib/firebaseStats";

// 5x5 and 5x3 Pixel Bitmap Font from homesec.tsx / pixel.tsx
const PIXEL_FONT: Record<string, string[]> = {
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
  " ": ["00", "00", "00", "00", "00"],
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
  "!": ["1", "1", "1", "0", "1"],
  "?": ["110", "001", "010", "000", "010"],
  "-": ["000", "000", "111", "000", "000"],
  "+": ["000", "010", "111", "010", "000"],
};

export const PixelEngine: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote, isSoundEnabled } = useSoundStore();

  // Tool & Canvas State
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "bucket" | "picker" | "type">("pencil");
  const [currentColor, setCurrentColor] = useState<string>(activeTheme.drawColor || "#00FFCC");
  const [pixelSize, setPixelSize] = useState<number>(20);
  const [perspective, setPerspective] = useState<"square" | "isometric">("square");
  const [is3D, setIs3D] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isSymmetry, setIsSymmetry] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(!isSoundEnabled);
  const [typeString, setTypeString] = useState<string>("ADITYA");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(false);
  const [hoverCoord, setHoverCoord] = useState<{ col: number; row: number } | null>(null);
  const [stats, setStats] = useState<{ drawn: number; undos: number; score: number }>({
    drawn: 0,
    undos: 0,
    score: 0,
  });

  // Global Community Stats synced via Firebase
  const [globalStats, setGlobalStats] = useState<GlobalCommunityStats>({
    totalPixelsDrawn: 0,
    totalPixelsPopped: 0,
    totalNotesPlayed: 0,
  });

  // Docked Stats Sidebar Collapsed state (from homesec.tsx lines 11360-11440)
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(false);

  // Update drawColor when theme changes
  useEffect(() => {
    setCurrentColor(activeTheme.drawColor);
  }, [activeTheme.drawColor]);

  // Subscribe to live Firebase community stats
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseStats((newStats) => {
      setGlobalStats(newStats);
    });
    return () => unsubscribe();
  }, []);

  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const artworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Pixel Map State (Key: "row_col" -> hex/rgb color)
  const pixelsRef = useRef<Map<string, string>>(new Map());
  const historyRef = useRef<Map<string, string>[]>([new Map()]);
  const historyIndexRef = useRef<number>(0);
  const isDrawingRef = useRef<boolean>(false);
  const lastCoordRef = useRef<{ col: number; row: number } | null>(null);
  const gravityPixelsRef = useRef<any[]>([]);
  const isGravityActiveRef = useRef<boolean>(false);
  // Engine Modes & Mini-Games State
  const [engineMode, setEngineMode] = useState<"draw" | "arcade" | "life" | "snake" | "sand">("draw");

  // Arcade Collectibles Mini-Game State
  const [isArcadeMode, setIsArcadeMode] = useState<boolean>(true);
  const [arcadeScore, setArcadeScore] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const lastPopTimeRef = useRef<number>(0);
  const collectiblesRef = useRef<Map<string, { createdAt: number; sizeMult: number; type: "gold" | "neon" | "rainbow" }>>(new Map());

  // Conway's Game of Life State
  const [isLifeRunning, setIsLifeRunning] = useState<boolean>(false);
  const [lifeGeneration, setLifeGeneration] = useState<number>(0);

  // Retro Voxel Snake State
  const [snakeScore, setSnakeScore] = useState<number>(0);
  const [snakeHighScore, setSnakeHighScore] = useState<number>(0);
  const [isSnakeRunning, setIsSnakeRunning] = useState<boolean>(false);
  const [isSnakeGameOver, setIsSnakeGameOver] = useState<boolean>(false);
  const snakeBodyRef = useRef<{ col: number; row: number }[]>([]);
  const snakeDirRef = useRef<{ col: number; row: number }>({ col: 1, row: 0 });
  const nextSnakeDirRef = useRef<{ col: number; row: number }>({ col: 1, row: 0 });
  const snakeFoodRef = useRef<{ col: number; row: number }>({ col: 10, row: 10 });

  // Falling Sand Simulation State
  const [sandElement, setSandElement] = useState<"sand" | "water" | "wood" | "acid">("sand");
  const [isSandSimRunning, setIsSandSimRunning] = useState<boolean>(true);

  // Web Audio Synthesizer (from homesec.tsx & pixel.tsx)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass({ latencyHint: "interactive" });
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch {
      // AudioContext unavailable
    }
  }, []);

  const playPopSound = useCallback(
    (freq = 600) => {
      if (isAudioMuted) return;
      try {
        initAudio();
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const now = ctx.currentTime + 0.01;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.06);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
        // audio fail
      }
    },
    [isAudioMuted, initAudio]
  );

  const playShatterBloom = useCallback(() => {
    if (isAudioMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = [196.0, 261.63, 329.63, 392.0, 523.25];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i < 2 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5), now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        filter.frequency.exponentialRampToValueAtTime(250, now + 1.8);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.2 + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
      });
    } catch {
      // Audio fail
    }
  }, [isAudioMuted, initAudio]);

  // Unified Isometric Metrics (from homesec.tsx)
  const getIsoMetrics = useCallback(
    (size: number, width: number, height: number, cols: number, rows: number) => {
      const totalSpan = (cols + rows) * size;
      const canvasW = Math.max(width, totalSpan);
      const canvasH = Math.max(height, totalSpan);
      const isoScale = Math.min(1, (width - 40) / canvasW, (height - 40) / (canvasH * 0.55));
      const isoSize = size * isoScale;
      const hx = isoSize;
      const hy = isoSize * 0.5;
      const isoTopX = width / 2 - ((cols - rows) * isoSize) / 2;
      const isoTopY = height / 2 - ((cols + rows) * hy) / 2;

      return { isoScale, isoSize, hx, hy, isoTopX, isoTopY };
    },
    []
  );

  // Projection: Grid (col, row) -> Screen (x, y)
  const projectToScreen = useCallback(
    (col: number, row: number, size: number, width: number, height: number, cols: number, rows: number) => {
      if (perspective === "square") {
        return { x: col * size, y: row * size };
      }
      const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(size, width, height, cols, rows);
      return {
        x: isoTopX + (col - row) * hx,
        y: isoTopY + (col + row) * hy,
      };
    },
    [perspective, getIsoMetrics]
  );

  // Projection: Screen (x, y) -> Grid (col, row)
  const projectToGrid = useCallback(
    (x: number, y: number, size: number, width: number, height: number, cols: number, rows: number) => {
      if (perspective === "square") {
        return {
          col: Math.floor(x / size),
          row: Math.floor(y / size),
        };
      }
      const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(size, width, height, cols, rows);
      const adjX = x - isoTopX;
      const adjY = y - isoTopY;
      const EPSILON = 0.0001;
      const col = (adjX / hx + adjY / hy) / 2;
      const row = (adjY / hy - adjX / hx) / 2;

      return {
        col: Math.floor(col + EPSILON),
        row: Math.floor(row + EPSILON),
      };
    },
    [perspective, getIsoMetrics]
  );

  // Render a Single Voxel / Pixel (2D or 3D Bevel with shading)
  const renderPixel = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      col: number,
      row: number,
      color: string,
      size: number,
      width: number,
      height: number,
      cols: number,
      rows: number
    ) => {
      const { x, y } = projectToScreen(col, row, size, width, height, cols, rows);

      if (perspective === "isometric") {
        const { hx, hy } = getIsoMetrics(size, width, height, cols, rows);
        const cx = x;
        const cy = y + hy;

        // Top diamond face
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + hx, y + hy);
        ctx.lineTo(x, y + 2 * hy);
        ctx.lineTo(x - hx, y + hy);
        ctx.closePath();
        ctx.fill();

        if (is3D) {
          // Left face (shading)
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.beginPath();
          ctx.moveTo(x - hx, y + hy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(x, y + 2 * hy);
          ctx.closePath();
          ctx.fill();

          // Right face (deep shadow)
          ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
          ctx.beginPath();
          ctx.moveTo(x - hx, y + hy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(x + hx, y + hy);
          ctx.lineTo(x, y + 2 * hy);
          ctx.closePath();
          ctx.fill();
        }

        // Top face border
        if (size > 6) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + hx, y + hy);
          ctx.lineTo(x, y + 2 * hy);
          ctx.lineTo(x - hx, y + hy);
          ctx.closePath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      } else {
        // Square
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);

        if (is3D && size >= 8) {
          const offset = Math.max(1, Math.floor(size * 0.2));
          // Top highlight
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fillRect(x, y, size, offset);
          ctx.fillRect(x, y, offset, size);

          // Shadow
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(x, y + size - offset, size, offset);
          ctx.fillRect(x + size - offset, y, offset, size);
        }
      }
    },
    [perspective, is3D, projectToScreen, getIsoMetrics]
  );

  // Redraw All Pixels
  const redrawAll = useCallback(() => {
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width / pixelSize) + 2;
    const rows = Math.ceil(canvas.height / pixelSize) + 2;

    const entries: { col: number; row: number; color: string; depth: number }[] = [];
    pixelsRef.current.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      entries.push({ col: c, row: r, color, depth: r + c });
    });

    if (perspective === "isometric") {
      entries.sort((a, b) => a.depth - b.depth);
    }

    entries.forEach((item) => {
      renderPixel(ctx, item.col, item.row, item.color, pixelSize, canvas.width, canvas.height, cols, rows);
    });

    // Render Arcade Collectibles (Gems)
    if (isArcadeMode && collectiblesRef.current.size > 0) {
      collectiblesRef.current.forEach((data, ckey) => {
        const idx = ckey.indexOf("_");
        const r = +ckey.slice(0, idx);
        const c = +ckey.slice(idx + 1);
        const color = data.type === "rainbow" ? "#06b6d4" : data.type === "neon" ? "#ec4899" : "#fbbf24";
        const { x, y } = projectToScreen(c, r, pixelSize, canvas.width, canvas.height, cols, rows);

        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        if (perspective === "isometric") {
          const { hx, hy } = getIsoMetrics(pixelSize, canvas.width, canvas.height, cols, rows);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + hx, y + hy);
          ctx.lineTo(x, y + 2 * hy);
          ctx.lineTo(x - hx, y + hy);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.fillRect(x, y, pixelSize, pixelSize);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.2;
          ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
        ctx.restore();
      });
    }
  }, [pixelSize, perspective, renderPixel, isArcadeMode, projectToScreen, getIsoMetrics]);

  // Redraw Grid
  const drawGrid = useCallback(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!showGrid) return;

    ctx.strokeStyle = activeTheme.gridColor || "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    const cols = Math.ceil(canvas.width / pixelSize) + 2;
    const rows = Math.ceil(canvas.height / pixelSize) + 2;

    if (perspective === "square") {
      for (let x = 0; x <= canvas.width; x += pixelSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += pixelSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
    } else {
      // Isometric diamond grid
      const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(pixelSize, canvas.width, canvas.height, cols, rows);
      for (let r = 0; r <= rows; r++) {
        const startX = isoTopX - r * hx;
        const startY = isoTopY + r * hy;
        const endX = startX + cols * hx;
        const endY = startY + cols * hy;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      for (let c = 0; c <= cols; c++) {
        const startX = isoTopX + c * hx;
        const startY = isoTopY + c * hy;
        const endX = startX - rows * hx;
        const endY = startY + rows * hy;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
    }
    ctx.stroke();
  }, [showGrid, activeTheme.gridColor, pixelSize, perspective, getIsoMetrics]);

  // FIX ISSUE 1: Exact dynamic canvas resizing via ResizeObserver on containerRef
  // Automatically resizes when telemetry log is minimized/expanded or window is maximized
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeCanvases = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      [gridCanvasRef, artworkCanvasRef, previewCanvasRef].forEach((ref) => {
        if (ref.current) {
          ref.current.width = width;
          ref.current.height = height;
        }
      });

      drawGrid();
      redrawAll();
    };

    // Execute immediately on mount & when isStatsCollapsed or pixelSize changes
    resizeCanvases();

    // ResizeObserver watches for ANY container size change (including CSS transitions & window maximizations)
    const observer = new ResizeObserver(() => {
      resizeCanvases();
    });
    observer.observe(container);

    window.addEventListener("resize", resizeCanvases);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvases);
    };
  }, [drawGrid, redrawAll, isStatsCollapsed, pixelSize]);

  // Re-render when theme changes
  useEffect(() => {
    drawGrid();
    redrawAll();
  }, [drawGrid, redrawAll, activeTheme]);

  // History Undo / Redo
  const saveStep = useCallback(() => {
    const clone = new Map(pixelsRef.current);
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(clone);
    if (newHistory.length > 30) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setStats((prev) => ({
      ...prev,
      drawn: pixelsRef.current.size,
      score: prev.score + 5,
    }));
  }, []);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      pixelsRef.current = new Map(historyRef.current[historyIndexRef.current]);
      redrawAll();
      setStats((prev) => ({
        ...prev,
        drawn: pixelsRef.current.size,
        undos: prev.undos + 1,
      }));
      playPopSound(420);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      pixelsRef.current = new Map(historyRef.current[historyIndexRef.current]);
      redrawAll();
      setStats((prev) => ({
        ...prev,
        drawn: pixelsRef.current.size,
      }));
      playPopSound(580);
    }
  };

  // Stamp Text with PIXEL_FONT
  const stampText = useCallback(
    (text: string, startCol: number, startRow: number) => {
      const upper = text.toUpperCase();
      let currentC = startCol;
      let drawnCount = 0;

      for (let i = 0; i < upper.length; i++) {
        const char = upper[i];
        const glyph = PIXEL_FONT[char] || PIXEL_FONT["?"];
        if (glyph) {
          const charHeight = glyph.length;
          const charWidth = glyph[0].length;

          for (let r = 0; r < charHeight; r++) {
            const rowStr = glyph[r];
            for (let c = 0; c < rowStr.length; c++) {
              if (rowStr[c] === "1") {
                const targetR = startRow + r;
                const targetC = currentC + c;
                pixelsRef.current.set(`${targetR}_${targetC}`, currentColor);
                drawnCount++;

                if (isSymmetry) {
                  const symC = startCol - (targetC - startCol);
                  pixelsRef.current.set(`${targetR}_${symC}`, currentColor);
                  drawnCount++;
                }
              }
            }
          }
          currentC += charWidth + 1; // 1 pixel letter-spacing
        }
      }
      recordPixelDrawn(drawnCount);
      redrawAll();
      saveStep();
      playPopSound(750);
    },
    [currentColor, isSymmetry, redrawAll, saveStep, playPopSound]
  );

  // Gravity Physics Simulation
  const triggerGravityPhysics = useCallback(() => {
    if (pixelsRef.current.size === 0 || isGravityActiveRef.current) return;
    isGravityActiveRef.current = true;
    playShatterBloom();

    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const entries = Array.from(pixelsRef.current.entries());
    const cols = Math.ceil(canvas.width / pixelSize) + 2;
    const rows = Math.ceil(canvas.height / pixelSize) + 2;

    recordPixelPopped(entries.length);

    gravityPixelsRef.current = entries.map(([key, color]) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      const { x, y } = projectToScreen(c, r, pixelSize, canvas.width, canvas.height, cols, rows);
      return {
        x,
        y,
        vy: 1 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 4,
        color,
        size: pixelSize,
        settled: false,
      };
    });

    let frameId = 0;
    const animateGravity = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allSettled = true;

      gravityPixelsRef.current.forEach((p) => {
        if (!p.settled) {
          p.vy += 0.45; // gravity
          p.y += p.vy;
          p.x += p.vx;

          if (p.y >= canvas.height - p.size) {
            p.y = canvas.height - p.size;
            p.vy *= -0.3; // bounce
            p.vx *= 0.8;
            if (Math.abs(p.vy) < 0.5) {
              p.settled = true;
            }
          }
          allSettled = false;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      if (!allSettled) {
        frameId = requestAnimationFrame(animateGravity);
      } else {
        isGravityActiveRef.current = false;
        // Keep particles on canvas, reset pixel map
        pixelsRef.current.clear();
        saveStep();
      }
    };

    frameId = requestAnimationFrame(animateGravity);
  }, [pixelSize, playShatterBloom, projectToScreen, saveStep]);

  // Flood Fill Bucket
  const floodFill = useCallback(
    (startCol: number, startRow: number, targetColor: string, newColor: string) => {
      if (targetColor === newColor) return;
      const key = `${startRow}_${startCol}`;
      const initial = pixelsRef.current.get(key) || null;

      const queue: [number, number][] = [[startCol, startRow]];
      const visited = new Set<string>();
      const maxFill = 2000;
      let count = 0;

      while (queue.length > 0 && count < maxFill) {
        const [c, r] = queue.pop()!;
        const currKey = `${r}_${c}`;
        if (visited.has(currKey)) continue;
        visited.add(currKey);

        const currVal = pixelsRef.current.get(currKey) || null;
        if (currVal === initial) {
          pixelsRef.current.set(currKey, newColor);
          count++;

          queue.push([c + 1, r]);
          queue.push([c - 1, r]);
          queue.push([c, r + 1]);
          queue.push([c, r - 1]);
        }
      }
      recordPixelDrawn(count);
      redrawAll();
      saveStep();
      playPopSound(500);
    },
    [redrawAll, saveStep, playPopSound]
  );

  // Spawning arcade collectibles
  useEffect(() => {
    if (engineMode !== "arcade") {
      collectiblesRef.current.clear();
      redrawAll();
      return;
    }

    const trySpawnCollectible = () => {
      if (collectiblesRef.current.size >= 4) return;
      const canvas = artworkCanvasRef.current;
      if (!canvas) return;
      const cols = Math.ceil(canvas.width / pixelSize);
      const rows = Math.ceil(canvas.height / pixelSize);
      if (cols <= 4 || rows <= 4) return;

      for (let i = 0; i < 30; i++) {
        const r = Math.floor(2 + Math.random() * (rows - 4));
        const c = Math.floor(2 + Math.random() * (cols - 4));
        const key = `${r}_${c}`;
        if (!pixelsRef.current.has(key) && !collectiblesRef.current.has(key)) {
          const rand = Math.random();
          const type: "gold" | "neon" | "rainbow" = rand > 0.85 ? "rainbow" : rand > 0.6 ? "neon" : "gold";
          collectiblesRef.current.set(key, {
            createdAt: Date.now(),
            sizeMult: 1,
            type,
          });
          redrawAll();
          break;
        }
      }
    };

    const timer = setTimeout(trySpawnCollectible, 400);
    const interval = setInterval(trySpawnCollectible, 2500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [engineMode, pixelSize, redrawAll]);

  // Conway's Game of Life Engine
  const stepConwayLife = useCallback(() => {
    const currentPixels = pixelsRef.current;
    if (currentPixels.size === 0) return;

    const neighborCounts = new Map<string, { count: number; dominantColor: string }>();

    currentPixels.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nKey = `${r + dr}_${c + dc}`;
          const existing = neighborCounts.get(nKey);
          if (existing) {
            existing.count++;
          } else {
            neighborCounts.set(nKey, { count: 1, dominantColor: color });
          }
        }
      }
    });

    const nextPixels = new Map<string, string>();
    neighborCounts.forEach((info, key) => {
      const isAlive = currentPixels.has(key);
      if (isAlive) {
        if (info.count === 2 || info.count === 3) {
          nextPixels.set(key, currentPixels.get(key)!);
        }
      } else {
        if (info.count === 3) {
          nextPixels.set(key, info.dominantColor || currentColor);
        }
      }
    });

    pixelsRef.current = nextPixels;
    setLifeGeneration((g) => g + 1);
    redrawAll();
    playPopSound(480 + (nextPixels.size % 8) * 40);
  }, [currentColor, playPopSound, redrawAll]);

  const seedConwayPreset = (preset: "glider" | "pulsar" | "random") => {
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const cols = Math.ceil(canvas.width / pixelSize);
    const rows = Math.ceil(canvas.height / pixelSize);
    const midR = Math.floor(rows / 2);
    const midC = Math.floor(cols / 2);

    pixelsRef.current.clear();
    setLifeGeneration(0);

    if (preset === "glider") {
      const gliderCoords = [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
      gliderCoords.forEach(([dr, dc]) => {
        pixelsRef.current.set(`${midR + dr}_${midC + dc}`, currentColor);
      });
    } else if (preset === "pulsar") {
      for (let i = -2; i <= 2; i++) {
        pixelsRef.current.set(`${midR}_${midC + i}`, currentColor);
        pixelsRef.current.set(`${midR + 3}_${midC + i}`, activeTheme.accent);
        pixelsRef.current.set(`${midR - 3}_${midC + i}`, activeTheme.accent);
      }
    } else if (preset === "random") {
      for (let i = 0; i < 90; i++) {
        const r = Math.floor(midR - 8 + Math.random() * 16);
        const c = Math.floor(midC - 12 + Math.random() * 24);
        pixelsRef.current.set(`${r}_${c}`, currentColor);
      }
    }
    recordPixelDrawn(pixelsRef.current.size);
    redrawAll();
    saveStep();
    playPopSound(700);
  };

  useEffect(() => {
    if (engineMode !== "life" || !isLifeRunning) return;
    const interval = setInterval(() => {
      stepConwayLife();
    }, 160);
    return () => clearInterval(interval);
  }, [engineMode, isLifeRunning, stepConwayLife]);

  // Retro Voxel Snake Game Engine
  const renderSnakeToCanvas = useCallback(() => {
    pixelsRef.current.clear();
    const body = snakeBodyRef.current;
    const food = snakeFoodRef.current;

    // Render food in glowing neon
    pixelsRef.current.set(`${food.row}_${food.col}`, "#FF2A85");

    // Render snake
    body.forEach((seg, idx) => {
      if (idx === 0) {
        pixelsRef.current.set(`${seg.row}_${seg.col}`, "#F59E0B"); // Head
      } else {
        pixelsRef.current.set(`${seg.row}_${seg.col}`, activeTheme.drawColor || "#00FFCC"); // Body
      }
    });

    redrawAll();
  }, [activeTheme.drawColor, redrawAll]);

  const initSnakeGame = useCallback(() => {
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const cols = Math.max(12, Math.ceil(canvas.width / pixelSize));
    const rows = Math.max(12, Math.ceil(canvas.height / pixelSize));
    const midR = Math.floor(rows / 2);
    const midC = Math.floor(cols / 2);

    snakeBodyRef.current = [
      { col: midC, row: midR },
      { col: midC - 1, row: midR },
      { col: midC - 2, row: midR },
    ];
    snakeDirRef.current = { col: 1, row: 0 };
    nextSnakeDirRef.current = { col: 1, row: 0 };
    snakeFoodRef.current = {
      col: Math.floor(2 + Math.random() * (cols - 4)),
      row: Math.floor(2 + Math.random() * (rows - 4)),
    };
    setSnakeScore(0);
    setIsSnakeGameOver(false);
    setIsSnakeRunning(true);

    renderSnakeToCanvas();
    playPopSound(800);
  }, [pixelSize, playPopSound, renderSnakeToCanvas]);

  // Keyboard navigation for Snake
  useEffect(() => {
    if (engineMode !== "snake") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const curr = snakeDirRef.current;
      if ((key === "arrowup" || key === "w") && curr.row !== 1) {
        nextSnakeDirRef.current = { col: 0, row: -1 };
      } else if ((key === "arrowdown" || key === "s") && curr.row !== -1) {
        nextSnakeDirRef.current = { col: 0, row: 1 };
      } else if ((key === "arrowleft" || key === "a") && curr.col !== 1) {
        nextSnakeDirRef.current = { col: -1, row: 0 };
      } else if ((key === "arrowright" || key === "d") && curr.col !== -1) {
        nextSnakeDirRef.current = { col: 1, row: 0 };
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [engineMode]);

  // Snake Tick Loop
  useEffect(() => {
    if (engineMode !== "snake" || !isSnakeRunning || isSnakeGameOver) return;

    const tickSnake = () => {
      const canvas = artworkCanvasRef.current;
      if (!canvas) return;
      const cols = Math.max(12, Math.ceil(canvas.width / pixelSize));
      const rows = Math.max(12, Math.ceil(canvas.height / pixelSize));

      snakeDirRef.current = nextSnakeDirRef.current;
      const dir = snakeDirRef.current;
      const body = [...snakeBodyRef.current];
      const head = body[0];
      if (!head) return;

      let newCol = head.col + dir.col;
      let newRow = head.row + dir.row;
      if (newCol < 0) newCol = cols - 1;
      if (newCol >= cols) newCol = 0;
      if (newRow < 0) newRow = rows - 1;
      if (newRow >= rows) newRow = 0;

      // Check self-collision
      const selfHit = body.slice(1).some((seg) => seg.col === newCol && seg.row === newRow);
      if (selfHit) {
        setIsSnakeGameOver(true);
        setIsSnakeRunning(false);
        playPopSound(250);
        return;
      }

      const newHead = { col: newCol, row: newRow };
      body.unshift(newHead);

      const food = snakeFoodRef.current;
      if (newCol === food.col && newRow === food.row) {
        setSnakeScore((prev) => {
          const next = prev + 10;
          setSnakeHighScore((hs) => Math.max(hs, next));
          return next;
        });
        playPopSound(950);
        recordPixelPopped(1);

        snakeFoodRef.current = {
          col: Math.floor(2 + Math.random() * (cols - 4)),
          row: Math.floor(2 + Math.random() * (rows - 4)),
        };
      } else {
        body.pop();
      }

      snakeBodyRef.current = body;
      renderSnakeToCanvas();
    };

    const interval = setInterval(tickSnake, 120);
    return () => clearInterval(interval);
  }, [engineMode, isSnakeRunning, isSnakeGameOver, pixelSize, playPopSound, renderSnakeToCanvas]);

  // Falling Sand Simulation Engine
  const stepSandPhysics = useCallback(() => {
    const currentPixels = pixelsRef.current;
    if (currentPixels.size === 0) return;

    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const cols = Math.ceil(canvas.width / pixelSize);
    const rows = Math.ceil(canvas.height / pixelSize);

    const newMap = new Map<string, string>();
    const entries: { r: number; c: number; color: string }[] = [];
    currentPixels.forEach((color, key) => {
      const idx = key.indexOf("_");
      entries.push({ r: +key.slice(0, idx), c: +key.slice(idx + 1), color });
    });

    entries.sort((a, b) => b.r - a.r);

    entries.forEach(({ r, c, color }) => {
      const lower = color.toLowerCase();
      const isSand = lower.includes("f59e") || lower.includes("fbbf") || color === "#f59e0b";
      const isWater = lower.includes("06b6") || lower.includes("38bd") || color === "#06b6d4";
      const isAcid = lower.includes("10b9") || lower.includes("4ade") || color === "#10b981";

      if (isSand) {
        if (r + 1 < rows && !newMap.has(`${r + 1}_${c}`) && !currentPixels.has(`${r + 1}_${c}`)) {
          newMap.set(`${r + 1}_${c}`, color);
        } else if (r + 1 < rows && c - 1 >= 0 && !newMap.has(`${r + 1}_${c - 1}`) && !currentPixels.has(`${r + 1}_${c - 1}`)) {
          newMap.set(`${r + 1}_${c - 1}`, color);
        } else if (r + 1 < rows && c + 1 < cols && !newMap.has(`${r + 1}_${c + 1}`) && !currentPixels.has(`${r + 1}_${c + 1}`)) {
          newMap.set(`${r + 1}_${c + 1}`, color);
        } else {
          newMap.set(`${r}_${c}`, color);
        }
      } else if (isWater) {
        if (r + 1 < rows && !newMap.has(`${r + 1}_${c}`) && !currentPixels.has(`${r + 1}_${c}`)) {
          newMap.set(`${r + 1}_${c}`, color);
        } else {
          const dir = Math.random() > 0.5 ? 1 : -1;
          if (c + dir >= 0 && c + dir < cols && !newMap.has(`${r}_${c + dir}`) && !currentPixels.has(`${r}_${c + dir}`)) {
            newMap.set(`${r}_${c + dir}`, color);
          } else {
            newMap.set(`${r}_${c}`, color);
          }
        }
      } else if (isAcid) {
        let dissolved = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const target = `${r + dr}_${c + dc}`;
            if (currentPixels.has(target)) {
              currentPixels.delete(target);
              dissolved = true;
              break;
            }
          }
          if (dissolved) break;
        }
        if (!dissolved) {
          if (r + 1 < rows && !newMap.has(`${r + 1}_${c}`) && !currentPixels.has(`${r + 1}_${c}`)) {
            newMap.set(`${r + 1}_${c}`, color);
          } else {
            newMap.set(`${r}_${c}`, color);
          }
        }
      } else {
        newMap.set(`${r}_${c}`, color);
      }
    });

    pixelsRef.current = newMap;
    redrawAll();
  }, [pixelSize, redrawAll]);

  useEffect(() => {
    if (engineMode !== "sand" || !isSandSimRunning) return;
    const interval = setInterval(() => {
      stepSandPhysics();
    }, 60);
    return () => clearInterval(interval);
  }, [engineMode, isSandSimRunning, stepSandPhysics]);

  // Bresenham line algorithm for continuous uninterrupted drawing during fast mouse drags
  const getLinePoints = (x0: number, y0: number, x1: number, y1: number) => {
    const points: { col: number; row: number }[] = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let currX = x0;
    let currY = y0;

    while (true) {
      points.push({ col: currX, row: currY });
      if (currX === x1 && currY === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        currX += sx;
      }
      if (e2 < dx) {
        err += dx;
        currY += sy;
      }
    }
    return points;
  };

  // Hit-test and pop collectibles during drawing or clicking
  const checkAndPopCollectible = useCallback((c: number, r: number) => {
    if (collectiblesRef.current.size === 0) return;
    let poppedKey: string | null = null;
    let poppedData: { type: "gold" | "neon" | "rainbow"; sizeMult: number } | null = null;

    collectiblesRef.current.forEach((data, ckey) => {
      if (poppedKey) return;
      const idx = ckey.indexOf("_");
      const cr = +ckey.slice(0, idx);
      const cc = +ckey.slice(idx + 1);
      if (Math.abs(r - cr) <= 1 && Math.abs(c - cc) <= 1) {
        poppedKey = ckey;
        poppedData = data;
      }
    });

    const targetData = poppedData as { type: "gold" | "neon" | "rainbow"; sizeMult: number } | null;
    if (poppedKey && targetData) {
      collectiblesRef.current.delete(poppedKey);
      recordPixelPopped(1);
      const now = performance.now();
      let mult = 1;
      if (now - lastPopTimeRef.current < 2500) {
        setComboCount((prev) => {
          const next = prev + 1;
          mult = next > 12 ? 5 : next > 6 ? 3 : next > 2 ? 2 : 1;
          return next;
        });
      } else {
        setComboCount(1);
      }
      lastPopTimeRef.current = now;

      const basePts = targetData.type === "rainbow" ? 50 : targetData.type === "neon" ? 30 : 15;
      const awarded = basePts * mult;
      setArcadeScore((prev) => prev + awarded);

      playPopSound(targetData.type === "rainbow" ? 1200 : targetData.type === "neon" ? 900 : 700);
    }
  }, [playPopSound]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const cols = Math.ceil(canvas.width / pixelSize) + 2;
    const rows = Math.ceil(canvas.height / pixelSize) + 2;

    const { col, row } = projectToGrid(mx, my, pixelSize, canvas.width, canvas.height, cols, rows);
    const key = `${row}_${col}`;
    lastCoordRef.current = { col, row };

    if (activeTool === "picker") {
      const picked = pixelsRef.current.get(key);
      if (picked) {
        setCurrentColor(picked);
        setActiveTool("pencil");
        playPopSound(650);
      }
      return;
    }

    if (activeTool === "type") {
      stampText(typeString || "ADITYA", col, row);
      return;
    }

    if (activeTool === "bucket") {
      const initial = pixelsRef.current.get(key) || "";
      floodFill(col, row, initial, currentColor);
      return;
    }

    isDrawingRef.current = true;
    if (activeTool === "eraser" || e.buttons === 2) {
      if (pixelsRef.current.has(key)) {
        pixelsRef.current.delete(key);
        recordPixelPopped(1);
      }
      if (isSymmetry) {
        const centerCol = Math.floor(cols / 2);
        const symCol = 2 * centerCol - col;
        if (pixelsRef.current.has(`${row}_${symCol}`)) {
          pixelsRef.current.delete(`${row}_${symCol}`);
          recordPixelPopped(1);
        }
      }
      playPopSound(340);
    } else {
      pixelsRef.current.set(key, currentColor);
      recordPixelDrawn(1);
      if (isSymmetry) {
        const centerCol = Math.floor(cols / 2);
        const symCol = 2 * centerCol - col;
        pixelsRef.current.set(`${row}_${symCol}`, currentColor);
        recordPixelDrawn(1);
      }
      playPopSound(520 + (col % 8) * 40);
    }

    if (isArcadeMode) {
      checkAndPopCollectible(col, row);
    }

    redrawAll();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const cols = Math.ceil(canvas.width / pixelSize) + 2;
    const rows = Math.ceil(canvas.height / pixelSize) + 2;

    const { col, row } = projectToGrid(mx, my, pixelSize, canvas.width, canvas.height, cols, rows);
    setHoverCoord({ col, row });

    // Draw hover outline on preview canvas
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        const { x, y } = projectToScreen(col, row, pixelSize, canvas.width, canvas.height, cols, rows);

        pCtx.strokeStyle = activeTheme.accent;
        pCtx.lineWidth = 1.5;
        if (perspective === "isometric") {
          const { hx, hy } = getIsoMetrics(pixelSize, canvas.width, canvas.height, cols, rows);
          pCtx.beginPath();
          pCtx.moveTo(x, y);
          pCtx.lineTo(x + hx, y + hy);
          pCtx.lineTo(x, y + 2 * hy);
          pCtx.lineTo(x - hx, y + hy);
          pCtx.closePath();
          pCtx.stroke();
        } else {
          pCtx.strokeRect(x, y, pixelSize, pixelSize);
        }
      }
    }

    if (!isDrawingRef.current) return;

    // Continuous Bresenham line interpolation between previous and current coordinate
    const prevCoord = lastCoordRef.current || { col, row };
    const points = getLinePoints(prevCoord.col, prevCoord.row, col, row);
    lastCoordRef.current = { col, row };

    points.forEach((pt) => {
      const key = `${pt.row}_${pt.col}`;
      if (activeTool === "eraser" || e.buttons === 2) {
        if (pixelsRef.current.has(key)) {
          pixelsRef.current.delete(key);
          recordPixelPopped(1);
        }
        if (isSymmetry) {
          const centerCol = Math.floor(cols / 2);
          const symCol = 2 * centerCol - pt.col;
          if (pixelsRef.current.has(`${pt.row}_${symCol}`)) {
            pixelsRef.current.delete(`${pt.row}_${symCol}`);
            recordPixelPopped(1);
          }
        }
      } else if (activeTool === "pencil") {
        pixelsRef.current.set(key, currentColor);
        recordPixelDrawn(1);
        if (isSymmetry) {
          const centerCol = Math.floor(cols / 2);
          const symCol = 2 * centerCol - pt.col;
          pixelsRef.current.set(`${pt.row}_${symCol}`, currentColor);
          recordPixelDrawn(1);
        }
      }

      if (isArcadeMode) {
        checkAndPopCollectible(pt.col, pt.row);
      }
    });

    redrawAll();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastCoordRef.current = null;
      saveStep();
    }
  };

  // Download Canvas as PNG
  const handleDownload = () => {
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const eCtx = exportCanvas.getContext("2d");
    if (!eCtx) return;

    eCtx.fillStyle = activeTheme.canvasBg;
    eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    eCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `pixel-artwork-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    playPopSound(800);
  };

  // Clear Canvas
  const handleClear = () => {
    recordPixelPopped(pixelsRef.current.size);
    pixelsRef.current.clear();
    redrawAll();
    saveStep();
    playPopSound(300);
  };

  // Swatch Palette (Combines active theme + cyberpunk palette)
  const palette = useMemo(() => {
    return [
      activeTheme.accent,
      activeTheme.accentSecondary,
      "#00FFCC",
      "#61AFEF",
      "#98C379",
      "#E5C07B",
      "#E06C75",
      "#C678DD",
      "#FFFFFF",
      "#5C6370",
      "#181B21",
      "#D19A66",
    ];
  }, [activeTheme]);

  // Telemetry rank title computation (from homesec.tsx)
  const userRankTitle = useMemo(() => {
    const px = stats.drawn;
    if (px > 200) return "Pixel Architect";
    if (px > 80) return "Grid Explorer";
    if (px > 20) return "Active Builder";
    return "Canvas Visitor";
  }, [stats.drawn]);

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full select-none font-mono text-xs overflow-hidden"
    >
      {/* Pixel Engine Header Controls Toolbar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-9 border-b px-2 sm:px-3 flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto flex-shrink-0"
      >
        {/* Left: Tool buttons */}
        <div className="flex items-center gap-1">
          {/* Pencil */}
          <button
            type="button"
            onClick={() => setActiveTool("pencil")}
            title="Pencil Tool"
            style={{
              backgroundColor: activeTool === "pencil" ? activeTheme.accent : "transparent",
              color:
                activeTool === "pencil"
                  ? activeTheme.isDark
                    ? "#000"
                    : "#fff"
                  : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded transition-all font-bold shadow-sm hover:opacity-80"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => setActiveTool("eraser")}
            title="Eraser Tool"
            style={{
              backgroundColor: activeTool === "eraser" ? "#E06C75" : "transparent",
              color: activeTool === "eraser" ? "#fff" : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded transition-all font-bold shadow-sm hover:opacity-80"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          {/* Bucket */}
          <button
            type="button"
            onClick={() => setActiveTool("bucket")}
            title="Paint Bucket"
            style={{
              backgroundColor: activeTool === "bucket" ? activeTheme.accentSecondary : "transparent",
              color:
                activeTool === "bucket"
                  ? activeTheme.isDark
                    ? "#000"
                    : "#fff"
                  : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded transition-all font-bold shadow-sm hover:opacity-80"
          >
            <PaintBucket className="w-3.5 h-3.5" />
          </button>

          {/* Eyedropper */}
          <button
            type="button"
            onClick={() => setActiveTool("picker")}
            title="Eyedropper"
            style={{
              backgroundColor: activeTool === "picker" ? activeTheme.accent : "transparent",
              color:
                activeTool === "picker"
                  ? activeTheme.isDark
                    ? "#000"
                    : "#fff"
                  : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded transition-all font-bold shadow-sm hover:opacity-80"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>

          {/* Type / Stamp Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("type");
              setIsTypeModalOpen(!isTypeModalOpen);
            }}
            title="Type Tool (Stamp Text with PIXEL_FONT)"
            style={{
              backgroundColor: activeTool === "type" ? activeTheme.accent : "transparent",
              color:
                activeTool === "type"
                  ? activeTheme.isDark
                    ? "#000"
                    : "#fff"
                  : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded transition-all font-bold shadow-sm hover:opacity-80"
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Symmetry Mirror */}
          <button
            type="button"
            onClick={() => setIsSymmetry(!isSymmetry)}
            title="Symmetry Mirror Tool"
            style={{
              backgroundColor: isSymmetry ? activeTheme.tagBg : "transparent",
              borderColor: isSymmetry ? activeTheme.accent : "transparent",
              color: isSymmetry ? activeTheme.accent : activeTheme.textPrimary,
            }}
            className="p-1.5 rounded border transition-all hover:opacity-80"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-4 w-px mx-1"
          />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            style={{ color: activeTheme.textPrimary }}
            className="p-1.5 rounded hover:opacity-70 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            title="Redo"
            style={{ color: activeTheme.textPrimary }}
            className="p-1.5 rounded hover:opacity-70 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-4 w-px mx-1"
          />

          {/* Gravity Physics */}
          <button
            type="button"
            onClick={triggerGravityPhysics}
            title="Trigger Gravity Physics (Drop Pixels)"
            style={{ color: activeTheme.accent }}
            className="p-1.5 rounded hover:opacity-80 transition-colors font-bold flex items-center gap-1"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Arcade Mini-Game Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsArcadeMode(!isArcadeMode);
              playPopSound(720);
            }}
            title={isArcadeMode ? "Arcade Collectibles Game: ON (Click to Disable)" : "Arcade Collectibles Game: OFF (Click to Enable)"}
            style={{
              backgroundColor: isArcadeMode ? `${activeTheme.accent}25` : "transparent",
              borderColor: isArcadeMode ? activeTheme.accent : "transparent",
              color: isArcadeMode ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="px-2 py-1 rounded border text-[10px] font-bold hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GAME</span>
            {isArcadeMode && (
              <span className="bg-amber-400 text-black px-1 rounded text-[9px] font-mono font-bold">
                {arcadeScore}
              </span>
            )}
          </button>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? "Unmute Audio Synth" : "Mute Audio Synth"}
            style={{ color: isAudioMuted ? activeTheme.textMuted : activeTheme.accent }}
            className="p-1.5 rounded hover:opacity-80 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Clear & Download */}
          <button
            type="button"
            onClick={handleClear}
            title="Clear Canvas"
            style={{ color: activeTheme.textPrimary }}
            className="p-1.5 rounded hover:text-red-400 hover:opacity-80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            title="Download PNG"
            style={{ color: activeTheme.accent }}
            className="p-1.5 rounded hover:opacity-80 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Perspective & 3D Extrusion toggles */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {/* Perspective: Square vs Isometric */}
          <button
            type="button"
            onClick={() => setPerspective(perspective === "square" ? "isometric" : "square")}
            style={{
              backgroundColor: perspective === "isometric" ? activeTheme.tagBg : activeTheme.cardBg,
              borderColor: perspective === "isometric" ? activeTheme.accent : activeTheme.cardBorder,
              color: perspective === "isometric" ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="px-2 py-0.5 rounded border transition-all flex items-center gap-1 font-semibold"
          >
            <Grid className="w-3 h-3" />
            <span>{perspective.toUpperCase()}</span>
          </button>

          {/* 3D Voxel Extrusion */}
          <button
            type="button"
            onClick={() => setIs3D(!is3D)}
            style={{
              backgroundColor: is3D ? activeTheme.tagBg : activeTheme.cardBg,
              borderColor: is3D ? activeTheme.accent : activeTheme.cardBorder,
              color: is3D ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="px-2 py-0.5 rounded border transition-all flex items-center gap-1 font-semibold"
          >
            <Box className="w-3 h-3" />
            <span>3D: {is3D ? "ON" : "OFF"}</span>
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: showGrid ? activeTheme.textPrimary : activeTheme.textMuted,
            }}
            className="px-2 py-0.5 rounded border transition-all"
          >
            GRID: {showGrid ? "ON" : "OFF"}
          </button>
        </div>

        {/* Right: Grid Size Range Slider & Telemetry Toggle */}
        <div className="flex items-center gap-2 text-[11px]" style={{ color: activeTheme.textMuted }}>
          {/* Grid Size Slider (Issue 4) */}
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded border border-white/5">
            <Sliders className="w-3 h-3 opacity-60" />
            <span className="text-[10px] hidden sm:inline">SIZE:</span>
            <input
              type="range"
              min="8"
              max="48"
              step="2"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              title={`Grid voxel size: ${pixelSize}px`}
              className="w-16 sm:w-20 h-1.5 rounded-lg appearance-none cursor-pointer bg-white/20 accent-cyan-400"
            />
            <span className="font-mono font-bold text-[10px] w-5 text-right" style={{ color: activeTheme.accent }}>
              {pixelSize}
            </span>
          </div>

          {/* Toggle Sidebar (Issue 1) */}
          <button
            type="button"
            onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
            title={isStatsCollapsed ? "Expand Engine Telemetry" : "Collapse Engine Telemetry"}
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="p-1 rounded border hover:opacity-80 transition-colors flex items-center gap-1 font-semibold text-[10px]"
          >
            {isStatsCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isStatsCollapsed ? "STATS" : "HIDE"}</span>
          </button>
        </div>
      </div>

      {/* Mini-Games & Modes Selector Deck */}
      <div
        style={{
          backgroundColor: `${activeTheme.cardBg}88`,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-8 border-b px-2 sm:px-3 flex items-center justify-between text-[11px] gap-2 overflow-x-auto flex-shrink-0 backdrop-blur-sm"
      >
        {/* Left: Mode Selection Tabs */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[10px] font-bold opacity-60 mr-1 hidden sm:inline">MODE:</span>
          <button
            type="button"
            onClick={() => {
              setEngineMode("draw");
              playPopSound(500);
            }}
            style={{
              backgroundColor: engineMode === "draw" ? activeTheme.accent : "transparent",
              color: engineMode === "draw" ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
              borderColor: engineMode === "draw" ? activeTheme.accent : "transparent",
            }}
            className="px-2 py-0.5 rounded border text-[10px] font-bold transition-all"
          >
            🎨 DRAW
          </button>
          <button
            type="button"
            onClick={() => {
              setEngineMode("arcade");
              playPopSound(600);
            }}
            style={{
              backgroundColor: engineMode === "arcade" ? activeTheme.accent : "transparent",
              color: engineMode === "arcade" ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
              borderColor: engineMode === "arcade" ? activeTheme.accent : "transparent",
            }}
            className="px-2 py-0.5 rounded border text-[10px] font-bold transition-all"
          >
            🎮 ARCADE
          </button>
          <button
            type="button"
            onClick={() => {
              setEngineMode("life");
              playPopSound(700);
            }}
            style={{
              backgroundColor: engineMode === "life" ? activeTheme.accent : "transparent",
              color: engineMode === "life" ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
              borderColor: engineMode === "life" ? activeTheme.accent : "transparent",
            }}
            className="px-2 py-0.5 rounded border text-[10px] font-bold transition-all"
          >
            🧬 GAME OF LIFE
          </button>
          <button
            type="button"
            onClick={() => {
              setEngineMode("snake");
              initSnakeGame();
            }}
            style={{
              backgroundColor: engineMode === "snake" ? activeTheme.accent : "transparent",
              color: engineMode === "snake" ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
              borderColor: engineMode === "snake" ? activeTheme.accent : "transparent",
            }}
            className="px-2 py-0.5 rounded border text-[10px] font-bold transition-all"
          >
            🐍 SNAKE
          </button>
          <button
            type="button"
            onClick={() => {
              setEngineMode("sand");
              playPopSound(550);
            }}
            style={{
              backgroundColor: engineMode === "sand" ? activeTheme.accent : "transparent",
              color: engineMode === "sand" ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
              borderColor: engineMode === "sand" ? activeTheme.accent : "transparent",
            }}
            className="px-2 py-0.5 rounded border text-[10px] font-bold transition-all"
          >
            ⏳ SAND SIM
          </button>
        </div>

        {/* Right: Mode-Specific Interactive Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px]">
          {engineMode === "draw" && (
            <span className="opacity-60 hidden md:inline">
              Click & drag to paint • Continuous Bresenham interpolation active
            </span>
          )}

          {engineMode === "arcade" && (
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold">
                SCORE: {arcadeScore}
              </span>
              {comboCount > 1 && (
                <span className="text-pink-400 font-bold animate-pulse">
                  COMBO x{comboCount > 12 ? 5 : comboCount > 6 ? 3 : comboCount > 2 ? 2 : 1}!
                </span>
              )}
              <span className="opacity-60 hidden sm:inline">
                Pop gold/neon gems on canvas
              </span>
            </div>
          )}

          {engineMode === "life" && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsLifeRunning(!isLifeRunning);
                  playPopSound(isLifeRunning ? 400 : 700);
                }}
                className={`px-2 py-0.5 rounded border font-bold flex items-center gap-1 ${
                  isLifeRunning ? "bg-emerald-500/20 text-emerald-400 border-emerald-500" : "bg-white/5 text-white/80 border-white/10"
                }`}
              >
                {isLifeRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isLifeRunning ? "PAUSE" : "EVOLVE"}</span>
              </button>

              <button
                type="button"
                onClick={stepConwayLife}
                title="Advance 1 Generation"
                className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 flex items-center gap-1"
              >
                <StepForward className="w-3 h-3" />
                <span>STEP</span>
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("glider")}
                className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Glider
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("pulsar")}
                className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Pulsar
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("random")}
                className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 hidden sm:inline"
              >
                Random
              </button>

              <span className="font-mono opacity-60 text-[9px]">Gen: {lifeGeneration}</span>
            </div>
          )}

          {engineMode === "snake" && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-bold">
                SCORE: {snakeScore}
              </span>
              <span className="font-mono opacity-60 hidden sm:inline">
                HIGH: {snakeHighScore}
              </span>
              {isSnakeGameOver && (
                <span className="text-red-400 font-bold animate-pulse">
                  GAME OVER!
                </span>
              )}
              <button
                type="button"
                onClick={initSnakeGame}
                className="px-2 py-0.5 rounded border border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESTART</span>
              </button>
              <span className="opacity-50 text-[9px] hidden md:inline">
                WASD / Arrow Keys
              </span>
            </div>
          )}

          {engineMode === "sand" && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSandElement("sand");
                  setCurrentColor("#F59E0B");
                }}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                  sandElement === "sand" ? "bg-amber-400 text-black border-amber-400" : "bg-white/5 border-white/10 text-amber-300"
                }`}
              >
                Sand
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("water");
                  setCurrentColor("#06B6D4");
                }}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                  sandElement === "water" ? "bg-cyan-400 text-black border-cyan-400" : "bg-white/5 border-white/10 text-cyan-300"
                }`}
              >
                Water
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("wood");
                  setCurrentColor("#854D0E");
                }}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                  sandElement === "wood" ? "bg-amber-800 text-white border-amber-700" : "bg-white/5 border-white/10 text-amber-600"
                }`}
              >
                Wood
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("acid");
                  setCurrentColor("#10B981");
                }}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                  sandElement === "acid" ? "bg-emerald-400 text-black border-emerald-400" : "bg-white/5 border-white/10 text-emerald-300"
                }`}
              >
                Acid
              </button>

              <button
                type="button"
                onClick={() => setIsSandSimRunning(!isSandSimRunning)}
                className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-semibold"
              >
                {isSandSimRunning ? "PAUSE" : "RESUME"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area with Swatch Bar & Docked Stats Panel */}
      <div className="flex-1 flex overflow-hidden relative w-full h-full min-w-0 min-h-0">
        {/* Left Vertical Color Palette Swatches */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="w-10 border-r p-1.5 flex flex-col items-center gap-1.5 z-10 select-none flex-shrink-0"
        >
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            title="Custom Color Picker"
            className="w-6 h-6 rounded cursor-pointer border bg-transparent p-0 mb-1"
            style={{ borderColor: activeTheme.cardBorder }}
          />

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="w-full h-px my-0.5"
          />

          {palette.map((col, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentColor(col)}
              title={col}
              style={{ backgroundColor: col }}
              className={`w-5 h-5 rounded-sm transition-transform border ${
                currentColor.toLowerCase() === col.toLowerCase()
                  ? "scale-110 border-white shadow-md"
                  : "border-black/30 hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Viewport Canvas Container (100% flex-1 to fill vacant space upon sidebar minimize) */}
        <div
          ref={containerRef}
          style={{ backgroundColor: activeTheme.canvasBg }}
          className="flex-1 w-full h-full relative overflow-hidden cursor-crosshair min-w-0 min-h-0"
        >
          {/* Grid Canvas Layer */}
          <canvas ref={gridCanvasRef} className="absolute inset-0 pointer-events-none block w-full h-full" />

          {/* Main Artwork Canvas Layer */}
          <canvas
            ref={artworkCanvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => {
              isDrawingRef.current = false;
              setHoverCoord(null);
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 touch-none block w-full h-full"
          />

          {/* Hover Preview Canvas Layer */}
          <canvas ref={previewCanvasRef} className="absolute inset-0 pointer-events-none block w-full h-full" />

          {/* Type Stamp Text Modal Popover */}
          {isTypeModalOpen && (
            <div
              style={{
                backgroundColor: activeTheme.headerBg,
                borderColor: activeTheme.headerBorder,
                color: activeTheme.textPrimary,
              }}
              className="absolute top-4 left-4 p-3 rounded-md border shadow-2xl z-30 flex flex-col gap-2 backdrop-blur-md"
            >
              <div className="font-bold text-[11px] flex items-center justify-between">
                <span>STAMP_TEXT (PIXEL_FONT)</span>
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={typeString}
                onChange={(e) => setTypeString(e.target.value)}
                placeholder="TYPE TEXT..."
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-2 py-1 rounded text-xs border outline-none font-mono"
              />
              <div className="text-[10px] opacity-60">
                Click anywhere on canvas to stamp letters in 5x5 bitmap voxels.
              </div>
            </div>
          )}
        </div>

        {/* DOCKED CYBERPUNK STATS BOX (Reused from homesec.tsx lines 11360-11440) */}
        {!isStatsCollapsed && (
          <aside
            style={{
              width: 230,
              backgroundColor: activeTheme.headerBg,
              borderLeft: `1px solid ${activeTheme.headerBorder}`,
              color: activeTheme.textPrimary,
            }}
            className="h-full flex flex-col z-20 overflow-hidden select-none transition-all flex-shrink-0"
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.headerBorder,
                color: activeTheme.accent,
              }}
              className="h-8 border-b px-3 flex items-center justify-between text-[11px] font-bold"
            >
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>ENGINE_TELEMETRY</span>
              </div>
              <button
                type="button"
                onClick={() => setIsStatsCollapsed(true)}
                className="opacity-60 hover:opacity-100"
              >
                ◀
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-[11px]">
              {/* Metric 1: System Level */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1"
              >
                <div className="text-[10px] opacity-60 flex justify-between">
                  <span>RANK</span>
                  <span style={{ color: activeTheme.accent }}>LVL 1</span>
                </div>
                <div className="font-bold text-xs" style={{ color: activeTheme.accent }}>
                  {userRankTitle}
                </div>
              </div>

              {/* Metric 2: Live Coordinates & Pixels */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1.5"
              >
                <div className="text-[10px] opacity-60 uppercase font-semibold">GRID STATE</div>
                <div className="flex justify-between">
                  <span className="opacity-70">COORD:</span>
                  <span className="font-mono font-bold">
                    [{hoverCoord ? `${hoverCoord.col}, ${hoverCoord.row}` : "--, --"}]
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SESSION PX:</span>
                  <span className="font-mono font-bold" style={{ color: activeTheme.accent }}>
                    {stats.drawn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">GRID SIZE:</span>
                  <span className="font-mono font-bold">{pixelSize}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SYMMETRY:</span>
                  <span className="font-mono font-bold">
                    {isSymmetry ? "ON" : "OFF"}
                  </span>
                </div>
              </div>

              {/* Metric 3: Live Firebase Global Community Stats (Issue 3) */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1.5"
              >
                <div className="text-[10px] opacity-60 uppercase font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>FIREBASE TELEMETRY</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">GLOBAL DRAWN:</span>
                  <span className="font-bold text-emerald-400">
                    {(globalStats.totalPixelsDrawn + stats.drawn).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">GLOBAL POPPED:</span>
                  <span className="font-bold text-amber-400">
                    {globalStats.totalPixelsPopped.toLocaleString()}
                  </span>
                </div>
                <div className="text-[9px] opacity-50 pt-0.5">
                  Connected to Realtime Database
                </div>
              </div>

              {/* Metric 4: Buffer Memory */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1"
              >
                <div className="text-[10px] opacity-60 uppercase font-semibold">BUFFER MEMORY</div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">VOXEL CACHE:</span>
                  <span>{(stats.drawn * 0.12).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">RENDER RATE:</span>
                  <span className="text-emerald-400">60 FPS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={triggerGravityPhysics}
                  style={{
                    backgroundColor: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.accent,
                  }}
                  className="w-full py-1.5 rounded border text-[11px] font-bold hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>DROP GRAVITY</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    backgroundColor: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                  }}
                  className="w-full py-1.5 rounded border text-[11px] font-bold text-red-400 hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>PURGE CANVAS</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textMuted,
        }}
        className="h-6 border-t px-3 flex items-center justify-between text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold" style={{ color: activeTheme.accent }}>
            <Activity className="w-3 h-3" />
            ENGINE: ACTIVE
          </span>
          <span className="opacity-40">•</span>
          <span>
            COORD: [{hoverCoord ? `${hoverCoord.col}, ${hoverCoord.row}` : "--, --"}]
          </span>
          <span className="opacity-40">•</span>
          <span>PIXELS: {stats.drawn}</span>
          <span className="opacity-40">•</span>
          <span>AUDIO: {isAudioMuted ? "MUTED" : "44.1kHz SYNTH"}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>THEME: {activeTheme.name.toUpperCase()}</span>
          <span className="opacity-40">•</span>
          <span className="font-semibold" style={{ color: activeTheme.accentSecondary }}>
            PERSPECTIVE: {perspective.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
