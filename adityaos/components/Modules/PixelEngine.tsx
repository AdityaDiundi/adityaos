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
  Bot,
  Upload,
  FileCode,
  Video,
  VideoOff,
  Zap,
  HelpCircle,
  X,
  Minus,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Wand2,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  subscribeToFirebaseStats,
  recordPixelDrawn,
  recordCanvasEdit,
  recordPixelPopped,
  GlobalCommunityStats,
} from "@/lib/firebaseStats";
import { createInitialPixelArt, INITIAL_PIXELS, SCENE_GENERATORS, SCENE_PRESETS } from "./pixelArtPresets";
import { PixelArtImportModal } from "./PixelArtImportModal";
import { PixelSceneModal } from "./PixelSceneModal";
import {
  rasterizeLine,
  rasterizeRectangle,
  rasterizeEllipse,
  rasterizeTriangle,
  rasterizePolygon,
  rasterizeRoundedRectangle,
  ShapeOptions,
} from "./pixelShapes";
import {
  rasterizeTextToPixels,
  TextRasterOptions,
} from "./pixelTextRasterizer";

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
  const [activeTool, setActiveTool] = useState<
    | "pencil"
    | "eraser"
    | "bucket"
    | "picker"
    | "type"
    | "line"
    | "rect"
    | "ellipse"
    | "triangle"
    | "polygon"
    | "roundedRect"
  >("pencil");
  const [currentColor, setCurrentColor] = useState<string>(activeTheme.drawColor || "#00FFCC");
  const [customHexInput, setCustomHexInput] = useState<string>(activeTheme.drawColor || "#00FFCC");
  const [pixelSize, setPixelSize] = useState<number>(8);
  const [perspective, setPerspective] = useState<"square" | "isometric">("square");
  const [is3D, setIs3D] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isSymmetry, setIsSymmetry] = useState<boolean>(false);

  // Shape Tools Options State
  const [shapeMode, setShapeMode] = useState<"outline" | "fill" | "both">("outline");
  const [shapeThickness, setShapeThickness] = useState<number>(1);
  const [shapeFillColor, setShapeFillColor] = useState<string>("#FAF7F2");
  const [shapeOutlineColor, setShapeOutlineColor] = useState<string>(activeTheme.drawColor || "#00FFCC");
  const [polygonVertices, setPolygonVertices] = useState<[number, number][]>([]);
  const shapeStartRef = useRef<{ col: number; row: number } | null>(null);
  const isDrawingShapeRef = useRef<boolean>(false);

  // Live On-Canvas Text Tool State
  interface LiveTextSession {
    active: boolean;
    col: number;
    row: number;
    text: string;
    scale: number;
    fontId: "classic5x7" | "micro3x5" | "unicode1bit";
    color: string;
    align: "left" | "center" | "right";
    outline: boolean;
    shadow: boolean;
    cursorIndex: number;
  }
  const [liveText, setLiveText] = useState<LiveTextSession | null>(null);
  const [textScale, setTextScale] = useState<number>(1);
  const [textFontId, setTextFontId] = useState<"classic5x7" | "micro3x5" | "unicode1bit">("classic5x7");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [textOutline, setTextOutline] = useState<boolean>(false);
  const [textShadow, setTextShadow] = useState<boolean>(false);
  const [cursorBlink, setCursorBlink] = useState<boolean>(true);

  // Text-to-Pixel-Grid Scene Generator Modal State
  const [isSceneModalOpen, setIsSceneModalOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pixel_audio_muted");
      if (saved !== null) return saved === "true";
    }
    return !isSoundEnabled;
  });

  const toggleAudioMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("pixel_audio_muted", String(next));
      }
      return next;
    });
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [typeString, setTypeString] = useState<string>("ADITYA");
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState<boolean>(false);
  const [importImageSrc, setImportImageSrc] = useState<string | null>(null);
  const [hoverCoord, setHoverCoord] = useState<{ col: number; row: number } | null>(null);
  const [canvasPixelCount, setCanvasPixelCount] = useState<number>(639);
  const [undoToast, setUndoToast] = useState<{ active: boolean; seconds: number; count?: number } | null>(null);
  const purgedPixelsRef = useRef<Map<string, string> | null>(null);
  const hasCenteredRef = useRef<boolean>(false);
  const [stats, setStats] = useState<{ drawn: number; undos: number; score: number }>({
    drawn: 639,
    undos: 0,
    score: 3195,
  });

  // Dual-buffer state to protect user's artwork across all game & simulation modes
  const drawingBufferRef = useRef<Map<string, string>>(new Map(createInitialPixelArt()));
  const drawingHistoryRef = useRef<Map<string, string>[]>([new Map(createInitialPixelArt())]);
  const drawingHistoryIndexRef = useRef<number>(0);

  // Docked Stats Sidebar Collapsed state (collapsed by default to maximize drawing canvas)
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(true);

  // Update drawColor when theme changes
  useEffect(() => {
    setCurrentColor(activeTheme.drawColor);
  }, [activeTheme.drawColor]);

  // Global Community Stats synced via Firebase
  const [globalStats, setGlobalStats] = useState<GlobalCommunityStats>({
    totalPixelsDrawn: 0,
    totalCanvasEdits: 0,
    totalNotesPlayed: 0,
  });

  // Subscribe to live Firebase community stats
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseStats((newStats) => {
      setGlobalStats(newStats);
    });
    return () => unsubscribe();
  }, []);

  // Respect prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(media.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  // 5-Second Undo Toast Timer for Purge Canvas
  useEffect(() => {
    if (!undoToast || !undoToast.active) return;
    if (undoToast.seconds <= 0) {
      setUndoToast(null);
      return;
    }
    const timer = setTimeout(() => {
      setUndoToast((prev) => (prev && prev.seconds > 1 ? { ...prev, seconds: prev.seconds - 1 } : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [undoToast]);

  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const artworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Pixel Map State (Key: "row_col" -> hex/rgb color)
  const pixelsRef = useRef<Map<string, string>>(createInitialPixelArt());
  const historyRef = useRef<Map<string, string>[]>([createInitialPixelArt()]);
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
  const [lifeSpeed, setLifeSpeed] = useState<number>(140);

  // Rainbow / Chroma Brush State
  const [isRainbowBrush, setIsRainbowBrush] = useState<boolean>(false);
  const rainbowHueRef = useRef<number>(0);

  // Automated Interactive Showcase Demo & Virtual Cursor
  const [isShowcasePlaying, setIsShowcasePlaying] = useState<boolean>(false);
  const [virtualCursor, setVirtualCursor] = useState<{
    x: number;
    y: number;
    visible: boolean;
    label?: string;
    clicking?: boolean;
  } | null>(null);
  const showcaseAbortRef = useRef<boolean>(false);
  const showcaseTimeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Video Recording State (MediaRecorder)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

  // Dynamic Draw Color (Standard vs Rainbow Chroma Brush)
  const getActiveDrawColor = useCallback(() => {
    if (isRainbowBrush) {
      rainbowHueRef.current = (rainbowHueRef.current + 14) % 360;
      return `hsl(${rainbowHueRef.current}, 100%, 55%)`;
    }
    return currentColor;
  }, [isRainbowBrush, currentColor]);

  // Unified Isometric Metrics covering 100% of canvas space
  const getIsoMetrics = useCallback(
    (size: number, width: number, height: number, cols: number, rows: number) => {
      const isoSize = size;
      const hx = isoSize;
      const hy = isoSize * 0.5;
      const isoTopX = width / 2;
      const isoTopY = height / 2;

      return { isoScale: 1, isoSize, hx, hy, isoTopX, isoTopY };
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
      // Isometric diamond grid covering 100% of the canvas area
      const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(pixelSize, canvas.width, canvas.height, cols, rows);
      const span = Math.ceil(Math.max(canvas.width / (2 * hx), canvas.height / (2 * hy))) + 10;

      for (let r = -span; r <= span; r++) {
        const startX = isoTopX - r * hx - span * hx;
        const startY = isoTopY + r * hy - span * hy;
        const endX = isoTopX - r * hx + span * hx;
        const endY = isoTopY + r * hy + span * hy;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      for (let c = -span; c <= span; c++) {
        const startX = isoTopX + c * hx - span * hx;
        const startY = isoTopY + c * hy + span * hy;
        const endX = isoTopX + c * hx + span * hx;
        const endY = isoTopY + c * hy - span * hy;
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

      // Automatically fit the initial scene to the full canvas while pristine
      if (historyRef.current.length <= 1) {
        const cols = Math.floor(width / pixelSize);
        const rows = Math.floor(height / pixelSize);
        if (cols > 0 && rows > 0) {
          const initialScene = createInitialPixelArt(0, 0, cols, rows);
          pixelsRef.current = initialScene;
          drawingBufferRef.current = new Map(initialScene);
          historyRef.current = [new Map(initialScene)];
          historyIndexRef.current = 0;
          setCanvasPixelCount(initialScene.size);
        }
      }

      drawGrid();
      redrawAll();
    };

    // Execute immediately on mount & when isStatsCollapsed or pixelSize changes
    resizeCanvases();
    const t1 = setTimeout(resizeCanvases, 60);
    const t2 = setTimeout(resizeCanvases, 300);

    // ResizeObserver watches for ANY container size change (including CSS transitions & window maximizations)
    const observer = new ResizeObserver(() => {
      resizeCanvases();
    });
    observer.observe(container);

    window.addEventListener("resize", resizeCanvases);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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
    if (newHistory.length > 50) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setCanvasPixelCount(pixelsRef.current.size);
    if (engineMode === "draw") {
      drawingBufferRef.current = new Map(pixelsRef.current);
    }
    setStats((prev) => ({
      ...prev,
      drawn: prev.drawn + 1,
      score: prev.score + 5,
    }));
    recordCanvasEdit(1);
  }, [engineMode]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      pixelsRef.current = new Map(historyRef.current[historyIndexRef.current]);
      setCanvasPixelCount(pixelsRef.current.size);
      if (engineMode === "draw") {
        drawingBufferRef.current = new Map(pixelsRef.current);
      }
      redrawAll();
      setStats((prev) => ({
        ...prev,
        undos: prev.undos + 1,
      }));
      playPopSound(420);
      recordCanvasEdit(1);
    }
  }, [redrawAll, playPopSound, engineMode]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      pixelsRef.current = new Map(historyRef.current[historyIndexRef.current]);
      setCanvasPixelCount(pixelsRef.current.size);
      if (engineMode === "draw") {
        drawingBufferRef.current = new Map(pixelsRef.current);
      }
      redrawAll();
      playPopSound(580);
      recordCanvasEdit(1);
    }
  }, [redrawAll, playPopSound, engineMode]);

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

  // Commit Live On-Canvas Text Session
  const commitLiveText = useCallback(() => {
    if (!liveText || !liveText.active || !liveText.text) {
      setLiveText(null);
      const pCanvas = previewCanvasRef.current;
      if (pCanvas) {
        const pCtx = pCanvas.getContext("2d");
        pCtx?.clearRect(0, 0, pCanvas.width, pCanvas.height);
      }
      return;
    }

    const textPixels = rasterizeTextToPixels(liveText);
    textPixels.forEach((hex, key) => {
      pixelsRef.current.set(key, hex);
    });

    setLiveText(null);
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      pCtx?.clearRect(0, 0, pCanvas.width, pCanvas.height);
    }

    recordPixelDrawn(textPixels.size);
    redrawAll();
    saveStep();
    playPopSound(750);
  }, [liveText, redrawAll, saveStep, playPopSound]);

  // Commit Polygon Shape
  const commitPolygon = useCallback(() => {
    if (polygonVertices.length < 3) {
      setPolygonVertices([]);
      const pCanvas = previewCanvasRef.current;
      pCanvas?.getContext("2d")?.clearRect(0, 0, pCanvas.width, pCanvas.height);
      return;
    }

    const shapeOpt: ShapeOptions = {
      mode: shapeMode,
      strokeThickness: shapeThickness,
      outlineColor: shapeOutlineColor || currentColor,
      fillColor: shapeFillColor,
    };

    const pts = rasterizePolygon(polygonVertices, shapeOpt);
    pts.forEach((pt) => {
      pixelsRef.current.set(`${pt.row}_${pt.col}`, pt.color);
    });

    setPolygonVertices([]);
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      pCtx?.clearRect(0, 0, pCanvas.width, pCanvas.height);
    }

    recordPixelDrawn(pts.length);
    redrawAll();
    saveStep();
    playPopSound(700);
  }, [
    polygonVertices,
    shapeMode,
    shapeThickness,
    shapeOutlineColor,
    currentColor,
    shapeFillColor,
    redrawAll,
    saveStep,
    playPopSound,
  ]);

  // Caret Blinking Timer for Live Text
  useEffect(() => {
    if (!liveText || !liveText.active) return;
    const interval = setInterval(() => {
      setCursorBlink((b) => !b);
    }, 450);
    return () => clearInterval(interval);
  }, [liveText]);

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
    }, lifeSpeed);
    return () => clearInterval(interval);
  }, [engineMode, isLifeRunning, stepConwayLife, lifeSpeed]);

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

  // Safe mode switching: preserves user artwork across all game & sim modes
  const switchMode = useCallback(
    (newMode: "draw" | "arcade" | "life" | "snake" | "sand") => {
      if (newMode === engineMode) return;

      // 1. Snapshot artwork & history buffer whenever leaving DRAW mode
      if (engineMode === "draw") {
        drawingBufferRef.current = new Map(pixelsRef.current);
        drawingHistoryRef.current = historyRef.current.map((m) => new Map(m));
        drawingHistoryIndexRef.current = historyIndexRef.current;
      }

      // 2. Stop running loops from outgoing modes
      if (engineMode === "snake") setIsSnakeRunning(false);
      if (engineMode === "life") setIsLifeRunning(false);
      if (engineMode === "sand") setIsSandSimRunning(false);

      setEngineMode(newMode);

      // 3. Setup incoming mode
      if (newMode === "draw") {
        // Completely restore user's drawing buffer and history
        pixelsRef.current = new Map(drawingBufferRef.current);
        historyRef.current = drawingHistoryRef.current.map((m) => new Map(m));
        historyIndexRef.current = drawingHistoryIndexRef.current;
        setCanvasPixelCount(pixelsRef.current.size);
        redrawAll();
      } else if (newMode === "arcade") {
        pixelsRef.current = new Map(drawingBufferRef.current);
        setCanvasPixelCount(pixelsRef.current.size);
        redrawAll();
      } else if (newMode === "life") {
        setIsLifeRunning(true);
        setCanvasPixelCount(pixelsRef.current.size);
      } else if (newMode === "snake") {
        initSnakeGame();
      } else if (newMode === "sand") {
        setIsSandSimRunning(true);
        setCanvasPixelCount(pixelsRef.current.size);
      }

      playPopSound(550);
    },
    [engineMode, redrawAll, initSnakeGame, playPopSound]
  );

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

  // Download Canvas as PNG
  const handleDownload = useCallback(() => {
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
  }, [activeTheme.canvasBg, playPopSound]);

  // Clear Canvas with 5-Second Undo Protection
  const handleClear = useCallback(() => {
    if (pixelsRef.current.size === 0) return;
    purgedPixelsRef.current = new Map(pixelsRef.current);
    recordPixelPopped(pixelsRef.current.size);
    const count = pixelsRef.current.size;
    pixelsRef.current.clear();
    drawingBufferRef.current.clear();
    setCanvasPixelCount(0);
    redrawAll();
    saveStep();
    playPopSound(300);
    setUndoToast({ active: true, seconds: 5, count });
  }, [redrawAll, saveStep, playPopSound]);

  const handleRestorePurged = useCallback(() => {
    if (purgedPixelsRef.current) {
      pixelsRef.current = new Map(purgedPixelsRef.current);
      drawingBufferRef.current = new Map(purgedPixelsRef.current);
      setCanvasPixelCount(pixelsRef.current.size);
      redrawAll();
      saveStep();
      playPopSound(700);
    }
    setUndoToast(null);
  }, [redrawAll, saveStep, playPopSound]);

  // Fit artwork to screen viewport
  const handleFitToScreen = useCallback(() => {
    if (pixelsRef.current.size === 0) return;
    const canvas = artworkCanvasRef.current;
    if (!canvas) return;

    const physW = canvas.width;
    const physH = canvas.height;

    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
    pixelsRef.current.forEach((_, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
    });

    const artW = isFinite(maxC - minC) ? maxC - minC + 1 : 0;
    const artH = isFinite(maxR - minR) ? maxR - minR + 1 : 0;
    if (artW <= 0 || artH <= 0) return;

    const idealSize = Math.max(4, Math.min(32, Math.floor(Math.min((physW * 0.85) / artW, (physH * 0.85) / artH))));

    const nextCols = Math.max(1, Math.floor(physW / idealSize));
    const nextRows = Math.max(1, Math.floor(physH / idealSize));
    const nextOffsetC = Math.max(0, Math.floor((nextCols - artW) / 2));
    const nextOffsetR = Math.max(0, Math.floor((nextRows - artH) / 2));

    const shifted = new Map<string, string>();
    pixelsRef.current.forEach((hex, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx) - minR + nextOffsetR;
      const c = +key.slice(idx + 1) - minC + nextOffsetC;
      shifted.set(`${r}_${c}`, hex);
    });

    pixelsRef.current = shifted;
    drawingBufferRef.current = new Map(shifted);
    setPixelSize(idealSize);
    redrawAll();
    saveStep();
    playPopSound(750);
  }, [redrawAll, saveStep, playPopSound]);

  // Global Keyboard Shortcuts for Pixel Engine
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Ignore keystrokes when typing in inputs or textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Handle Active On-Canvas Live Text Typing
      if (liveText && liveText.active) {
        if (key === "escape") {
          e.preventDefault();
          setLiveText(null);
          const pCanvas = previewCanvasRef.current;
          pCanvas?.getContext("2d")?.clearRect(0, 0, pCanvas.width, pCanvas.height);
          return;
        }

        if (isCmdOrCtrl && key === "enter") {
          e.preventDefault();
          commitLiveText();
          return;
        }

        if (key === "enter") {
          e.preventDefault();
          setLiveText((prev) => {
            if (!prev) return null;
            const t = prev.text;
            const idx = prev.cursorIndex;
            return {
              ...prev,
              text: t.slice(0, idx) + "\n" + t.slice(idx),
              cursorIndex: idx + 1,
            };
          });
          return;
        }

        if (key === "backspace") {
          e.preventDefault();
          setLiveText((prev) => {
            if (!prev || prev.cursorIndex <= 0) return prev;
            const t = prev.text;
            const idx = prev.cursorIndex;
            return {
              ...prev,
              text: t.slice(0, idx - 1) + t.slice(idx),
              cursorIndex: idx - 1,
            };
          });
          return;
        }

        if (key === "arrowleft") {
          e.preventDefault();
          setLiveText((prev) =>
            prev ? { ...prev, cursorIndex: Math.max(0, prev.cursorIndex - 1) } : null
          );
          return;
        }

        if (key === "arrowright") {
          e.preventDefault();
          setLiveText((prev) =>
            prev ? { ...prev, cursorIndex: Math.min(prev.text.length, prev.cursorIndex + 1) } : null
          );
          return;
        }

        if (e.key.length === 1 && !isCmdOrCtrl && !e.altKey) {
          e.preventDefault();
          setLiveText((prev) => {
            if (!prev) return null;
            const t = prev.text;
            const idx = prev.cursorIndex;
            return {
              ...prev,
              text: t.slice(0, idx) + e.key + t.slice(idx),
              cursorIndex: idx + 1,
            };
          });
          return;
        }
        return;
      }

      // Handle Active Polygon Vertex Session
      if (activeTool === "polygon" && polygonVertices.length > 0) {
        if (key === "enter") {
          e.preventDefault();
          commitPolygon();
          return;
        }
        if (key === "escape") {
          e.preventDefault();
          setPolygonVertices([]);
          const pCanvas = previewCanvasRef.current;
          pCanvas?.getContext("2d")?.clearRect(0, 0, pCanvas.width, pCanvas.height);
          return;
        }
      }

      if (key === "?" || (key === "/" && !isCmdOrCtrl)) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
        return;
      }
      if (key === "escape") {
        setShowShortcutsModal(false);
        setIsImportModalOpen(false);
        setIsTypeModalOpen(false);
        setIsSceneModalOpen(false);
        isDrawingShapeRef.current = false;
        shapeStartRef.current = null;
        const pCanvas = previewCanvasRef.current;
        pCanvas?.getContext("2d")?.clearRect(0, 0, pCanvas.width, pCanvas.height);
        return;
      }

      if (isCmdOrCtrl) {
        if (key === "z") {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
          return;
        }
        if (key === "y") {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (key === "s") {
          e.preventDefault();
          handleDownload();
          return;
        }
      }

      if (key === "b" || key === "p") {
        setActiveTool("pencil");
        playPopSound(500);
      } else if (key === "e") {
        setActiveTool("eraser");
        playPopSound(450);
      } else if (key === "g") {
        setActiveTool("bucket");
        playPopSound(550);
      } else if (key === "i") {
        setActiveTool("picker");
        playPopSound(600);
      } else if (key === "t") {
        setActiveTool("type");
        playPopSound(650);
      } else if (key === "l") {
        setActiveTool("line");
        playPopSound(550);
      } else if (key === "u") {
        setActiveTool("rect");
        playPopSound(550);
      } else if (key === "c") {
        setActiveTool("ellipse");
        playPopSound(550);
      } else if (key === "y") {
        setActiveTool("triangle");
        playPopSound(550);
      } else if (key === "x") {
        setActiveTool("polygon");
        playPopSound(550);
      } else if (key === "k") {
        setActiveTool("roundedRect");
        playPopSound(550);
      } else if (key === "m") {
        setIsSymmetry((prev) => !prev);
        playPopSound(700);
      } else if (key === "d") {
        setIsStatsCollapsed((prev) => !prev);
      } else if (e.shiftKey && key === "g") {
        setShowGrid((prev) => !prev);
        playPopSound(500);
      } else if (e.shiftKey && key === "p") {
        setPerspective((prev) => (prev === "square" ? "isometric" : "square"));
        playPopSound(650);
      } else if (key === "3" && !isCmdOrCtrl) {
        setIs3D((prev) => !prev);
        playPopSound(700);
      } else if ((e.shiftKey && key === "f") || key === "0") {
        e.preventDefault();
        handleFitToScreen();
      } else if (key === "delete" || key === "backspace") {
        handleClear();
      } else if (key === "1") {
        switchMode("draw");
      } else if (key === "2") {
        switchMode("arcade");
      } else if (key === "3" && isCmdOrCtrl) {
        switchMode("life");
      } else if (key === "4") {
        switchMode("snake");
      } else if (key === "5") {
        switchMode("sand");
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [
    liveText,
    commitLiveText,
    activeTool,
    polygonVertices,
    commitPolygon,
    handleUndo,
    handleRedo,
    handleDownload,
    handleClear,
    handleFitToScreen,
    switchMode,
    playPopSound,
  ]);

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

  // Unified Preview Renderer for Hover, Shapes, Polygon, and Live Text
  const renderPreview = useCallback(
    (hoverC: number, hoverR: number, e?: React.PointerEvent<HTMLCanvasElement>) => {
      const pCanvas = previewCanvasRef.current;
      const canvas = artworkCanvasRef.current;
      if (!pCanvas || !canvas) return;
      const pCtx = pCanvas.getContext("2d");
      if (!pCtx) return;

      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      const cols = Math.ceil(canvas.width / pixelSize) + 2;
      const rows = Math.ceil(canvas.height / pixelSize) + 2;

      // 1. Live Text Session Preview
      if (liveText && liveText.active) {
        const textPixels = rasterizeTextToPixels(liveText);
        textPixels.forEach((hex, key) => {
          const idx = key.indexOf("_");
          const r = +key.slice(0, idx);
          const c = +key.slice(idx + 1);
          const { x, y } = projectToScreen(c, r, pixelSize, canvas.width, canvas.height, cols, rows);
          pCtx.fillStyle = hex;
          pCtx.fillRect(x, y, pixelSize, pixelSize);
        });

        // Blinking 1px Caret at Caret Offset
        if (cursorBlink) {
          const lines = liveText.text.slice(0, liveText.cursorIndex).split("\n");
          const curLineIdx = lines.length - 1;
          const curLineText = lines[curLineIdx];
          const fontH = (liveText.fontId === "micro3x5" ? 6 : 8) * liveText.scale;
          const fontW = (liveText.fontId === "micro3x5" ? 4 : 6) * liveText.scale;
          const caretC = liveText.col + curLineText.length * fontW;
          const caretR = liveText.row + curLineIdx * fontH;
          const { x, y } = projectToScreen(caretC, caretR, pixelSize, canvas.width, canvas.height, cols, rows);

          pCtx.fillStyle = activeTheme.accent;
          pCtx.fillRect(x, y, Math.max(2, Math.floor(pixelSize * 0.25)), fontH * pixelSize);
        }
        return;
      }

      // 2. Interactive Shape Drag Preview
      if (isDrawingShapeRef.current && shapeStartRef.current) {
        const start = shapeStartRef.current;
        let c0 = start.col;
        let r0 = start.row;
        let c1 = hoverC;
        let r1 = hoverR;

        const isShift = e?.shiftKey;
        const isAlt = e?.altKey;

        if (isAlt) {
          const dc = c1 - c0;
          const dr = r1 - r0;
          c0 = start.col - dc;
          r0 = start.row - dr;
          c1 = start.col + dc;
          r1 = start.row + dr;
        }

        if (isShift) {
          if (activeTool === "line") {
            const dc = c1 - start.col;
            const dr = r1 - start.row;
            const angle = Math.atan2(dr, dc);
            const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
            const dist = Math.sqrt(dc * dc + dr * dr);
            c1 = Math.round(start.col + Math.cos(snapped) * dist);
            r1 = Math.round(start.row + Math.sin(snapped) * dist);
          } else if (["rect", "ellipse", "triangle", "roundedRect"].includes(activeTool)) {
            const side = Math.max(Math.abs(c1 - c0), Math.abs(r1 - r0));
            c1 = c0 + (c1 >= c0 ? side : -side);
            r1 = r0 + (r1 >= r0 ? side : -side);
          }
        }

        const shapeOpt: ShapeOptions = {
          mode: shapeMode,
          strokeThickness: shapeThickness,
          outlineColor: shapeOutlineColor || currentColor,
          fillColor: shapeFillColor,
        };

        let previewPts: { col: number; row: number; color: string }[] = [];
        if (activeTool === "line") {
          previewPts = rasterizeLine(c0, r0, c1, r1, shapeOpt.outlineColor, shapeOpt.strokeThickness);
        } else if (activeTool === "rect") {
          previewPts = rasterizeRectangle(c0, r0, c1, r1, shapeOpt);
        } else if (activeTool === "ellipse") {
          previewPts = rasterizeEllipse(c0, r0, c1, r1, shapeOpt);
        } else if (activeTool === "triangle") {
          const apexC = Math.round((c0 + c1) / 2);
          previewPts = rasterizeTriangle([apexC, r0], [c0, r1], [c1, r1], shapeOpt);
        } else if (activeTool === "roundedRect") {
          previewPts = rasterizeRoundedRectangle(c0, r0, c1, r1, Math.max(2, shapeThickness * 3), shapeOpt);
        }

        previewPts.forEach((pt) => {
          const { x, y } = projectToScreen(pt.col, pt.row, pixelSize, canvas.width, canvas.height, cols, rows);
          pCtx.fillStyle = pt.color;
          pCtx.fillRect(x, y, pixelSize, pixelSize);
        });
        return;
      }

      // 3. Polygon Multi-Point Preview
      if (activeTool === "polygon" && polygonVertices.length > 0) {
        for (let i = 0; i < polygonVertices.length - 1; i++) {
          const [vx0, vy0] = polygonVertices[i];
          const [vx1, vy1] = polygonVertices[i + 1];
          const edgePts = rasterizeLine(vx0, vy0, vx1, vy1, shapeOutlineColor || currentColor, shapeThickness);
          edgePts.forEach((pt) => {
            const { x, y } = projectToScreen(pt.col, pt.row, pixelSize, canvas.width, canvas.height, cols, rows);
            pCtx.fillStyle = pt.color;
            pCtx.fillRect(x, y, pixelSize, pixelSize);
          });
        }

        const lastV = polygonVertices[polygonVertices.length - 1];
        const rubberBand = rasterizeLine(lastV[0], lastV[1], hoverC, hoverR, activeTheme.accent, 1);
        rubberBand.forEach((pt) => {
          const { x, y } = projectToScreen(pt.col, pt.row, pixelSize, canvas.width, canvas.height, cols, rows);
          pCtx.fillStyle = pt.color;
          pCtx.fillRect(x, y, pixelSize, pixelSize);
        });

        const startV = polygonVertices[0];
        const { x: sx, y: sy } = projectToScreen(startV[0], startV[1], pixelSize, canvas.width, canvas.height, cols, rows);
        pCtx.strokeStyle = "#F59E0B";
        pCtx.lineWidth = 1.5;
        pCtx.strokeRect(sx - 2, sy - 2, pixelSize + 4, pixelSize + 4);
        return;
      }

      // 4. Standard Hover Grid Cursor
      const { x, y } = projectToScreen(hoverC, hoverR, pixelSize, canvas.width, canvas.height, cols, rows);
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
    },
    [
      liveText,
      cursorBlink,
      activeTool,
      shapeMode,
      shapeThickness,
      shapeOutlineColor,
      shapeFillColor,
      currentColor,
      polygonVertices,
      pixelSize,
      perspective,
      activeTheme,
      projectToScreen,
      getIsoMetrics,
    ]
  );

  // Redraw preview whenever liveText or cursorBlink changes
  useEffect(() => {
    if (liveText && liveText.active) {
      renderPreview(liveText.col, liveText.row);
    }
  }, [liveText, cursorBlink, renderPreview]);

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isShowcasePlaying) {
      stopShowcase();
    }

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

    // Shape Tools Initiation
    if (["line", "rect", "ellipse", "triangle", "roundedRect"].includes(activeTool)) {
      if (liveText && liveText.active) {
        commitLiveText();
      }
      isDrawingShapeRef.current = true;
      shapeStartRef.current = { col, row };
      renderPreview(col, row, e);
      return;
    }

    // Polygon Vertex Insertion / Closing
    if (activeTool === "polygon") {
      if (liveText && liveText.active) {
        commitLiveText();
      }
      if (polygonVertices.length >= 2) {
        const startV = polygonVertices[0];
        if (Math.abs(col - startV[0]) <= 1 && Math.abs(row - startV[1]) <= 1) {
          commitPolygon();
          return;
        }
      }
      setPolygonVertices((prev) => [...prev, [col, row]]);
      playPopSound(550);
      renderPreview(col, row, e);
      return;
    }

    // On-Canvas Text Placement
    if (activeTool === "type") {
      if (liveText && liveText.active) {
        commitLiveText();
      }
      setLiveText({
        active: true,
        col,
        row,
        text: "",
        scale: textScale,
        fontId: textFontId,
        color: currentColor,
        align: textAlign,
        outline: textOutline,
        shadow: textShadow,
        cursorIndex: 0,
      });
      playPopSound(600);
      return;
    }

    if (activeTool === "picker") {
      const picked = pixelsRef.current.get(key);
      if (picked) {
        setCurrentColor(picked);
        setActiveTool("pencil");
        playPopSound(650);
      }
      return;
    }

    if (activeTool === "bucket") {
      const initial = pixelsRef.current.get(key) || "";
      floodFill(col, row, initial, currentColor);
      return;
    }

    isDrawingRef.current = true;
    if (activeTool === "eraser" || e.buttons === 2 || e.button === 2) {
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
      const drawCol = getActiveDrawColor();
      pixelsRef.current.set(key, drawCol);
      recordPixelDrawn(1);
      if (isSymmetry) {
        const centerCol = Math.floor(cols / 2);
        const symCol = 2 * centerCol - col;
        pixelsRef.current.set(`${row}_${symCol}`, drawCol);
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

    // Draw hover / shape / text preview
    renderPreview(col, row, e);

    if (!isDrawingRef.current) return;

    // Continuous Bresenham line interpolation between previous and current coordinate
    const prevCoord = lastCoordRef.current || { col, row };
    const points = getLinePoints(prevCoord.col, prevCoord.row, col, row);
    lastCoordRef.current = { col, row };

    points.forEach((pt) => {
      const key = `${pt.row}_${pt.col}`;
      if (activeTool === "eraser" || (e.buttons & 2) === 2 || e.buttons === 2) {
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
        const drawCol = getActiveDrawColor();
        pixelsRef.current.set(key, drawCol);
        recordPixelDrawn(1);
        if (isSymmetry) {
          const centerCol = Math.floor(cols / 2);
          const symCol = 2 * centerCol - pt.col;
          pixelsRef.current.set(`${pt.row}_${symCol}`, drawCol);
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

    // Shape Drawing Commit
    if (isDrawingShapeRef.current && shapeStartRef.current) {
      const start = shapeStartRef.current;
      let c0 = start.col;
      let r0 = start.row;
      let c1 = lastCoordRef.current ? lastCoordRef.current.col : start.col;
      let r1 = lastCoordRef.current ? lastCoordRef.current.row : start.row;

      const isShift = e.shiftKey;
      const isAlt = e.altKey;

      if (isAlt) {
        const dc = c1 - c0;
        const dr = r1 - r0;
        c0 = start.col - dc;
        r0 = start.row - dr;
        c1 = start.col + dc;
        r1 = start.row + dr;
      }

      if (isShift) {
        if (activeTool === "line") {
          const dc = c1 - start.col;
          const dr = r1 - start.row;
          const angle = Math.atan2(dr, dc);
          const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
          const dist = Math.sqrt(dc * dc + dr * dr);
          c1 = Math.round(start.col + Math.cos(snapped) * dist);
          r1 = Math.round(start.row + Math.sin(snapped) * dist);
        } else if (["rect", "ellipse", "triangle", "roundedRect"].includes(activeTool)) {
          const side = Math.max(Math.abs(c1 - c0), Math.abs(r1 - r0));
          c1 = c0 + (c1 >= c0 ? side : -side);
          r1 = r0 + (r1 >= r0 ? side : -side);
        }
      }

      const shapeOpt: ShapeOptions = {
        mode: shapeMode,
        strokeThickness: shapeThickness,
        outlineColor: shapeOutlineColor || currentColor,
        fillColor: shapeFillColor,
      };

      let pts: { col: number; row: number; color: string }[] = [];
      if (activeTool === "line") {
        pts = rasterizeLine(c0, r0, c1, r1, shapeOpt.outlineColor, shapeOpt.strokeThickness);
      } else if (activeTool === "rect") {
        pts = rasterizeRectangle(c0, r0, c1, r1, shapeOpt);
      } else if (activeTool === "ellipse") {
        pts = rasterizeEllipse(c0, r0, c1, r1, shapeOpt);
      } else if (activeTool === "triangle") {
        const apexC = Math.round((c0 + c1) / 2);
        pts = rasterizeTriangle([apexC, r0], [c0, r1], [c1, r1], shapeOpt);
      } else if (activeTool === "roundedRect") {
        pts = rasterizeRoundedRectangle(c0, r0, c1, r1, Math.max(2, shapeThickness * 3), shapeOpt);
      }

      pts.forEach((pt) => {
        pixelsRef.current.set(`${pt.row}_${pt.col}`, pt.color);
      });

      isDrawingShapeRef.current = false;
      shapeStartRef.current = null;

      const pCanvas = previewCanvasRef.current;
      if (pCanvas) {
        const pCtx = pCanvas.getContext("2d");
        pCtx?.clearRect(0, 0, pCanvas.width, pCanvas.height);
      }

      recordPixelDrawn(pts.length);
      redrawAll();
      saveStep();
      playPopSound(700);
      return;
    }

    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastCoordRef.current = null;
      saveStep();
    }
  };

  // Automated Bot Placement Engine (r/place bot simulation)
  const [isBotDrawing, setIsBotDrawing] = useState<boolean>(false);
  const [activeBotScene, setActiveBotScene] = useState<string>("");
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  const runBotPlacement = useCallback(() => {
    if (isBotDrawing) {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
      setIsBotDrawing(false);
      setActiveBotScene("");
      return;
    }

    const sceneKeys = Object.keys(SCENE_PRESETS);
    const randomKey = sceneKeys[Math.floor(Math.random() * sceneKeys.length)];
    const chosenPreset = SCENE_PRESETS[randomKey] || SCENE_PRESETS.himalayanNight;
    setActiveBotScene(chosenPreset.name);

    const canvas = artworkCanvasRef.current;
    const cols = canvas ? Math.floor(canvas.width / pixelSize) : 80;
    const rows = canvas ? Math.floor(canvas.height / pixelSize) : 50;

    const generatedMap = chosenPreset.generate(cols, rows);
    const pixelEntries: [number, number, string][] = [];
    generatedMap.forEach((color: string, key: string) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      pixelEntries.push([r, c, color]);
    });

    // Organic scanline ordering with slight horizontal jitter for realistic bot drawing
    pixelEntries.sort((a, b) => a[0] - b[0] + (Math.sin(a[1] * 0.4) - Math.sin(b[1] * 0.4)) * 3);

    pixelsRef.current.clear();
    redrawAll();
    setStats((prev) => ({ ...prev, drawn: 0, score: 0 }));
    setIsBotDrawing(true);

    let idx = 0;
    const batchSize = Math.max(12, Math.floor(pixelEntries.length / 100));
    botTimerRef.current = setInterval(() => {
      const nextBatch = pixelEntries.slice(idx, idx + batchSize);
      if (nextBatch.length === 0) {
        if (botTimerRef.current) clearInterval(botTimerRef.current);
        setIsBotDrawing(false);
        setActiveBotScene("");
        saveStep();
        playPopSound(880);
        return;
      }

      nextBatch.forEach(([r, c, col]) => {
        pixelsRef.current.set(`${r}_${c}`, col);
      });
      idx += batchSize;
      redrawAll();
      setStats((prev) => ({ ...prev, drawn: idx, score: idx * 5 }));
      if (idx % (batchSize * 2) === 0) {
        playPopSound(260 + (idx % 540));
      }
    }, 16);
  }, [isBotDrawing, pixelSize, redrawAll, saveStep, playPopSound]);

  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearInterval(botTimerRef.current);
    };
  }, []);

  // Stop and Reset Automated Showcase Tour
  const stopShowcase = useCallback(() => {
    showcaseAbortRef.current = true;
    showcaseTimeoutRefs.current.forEach((t) => clearTimeout(t));
    showcaseTimeoutRefs.current = [];
    setIsShowcasePlaying(false);
    setVirtualCursor(null);
  }, []);

  // Run Automated Showcase Demo Tour
  const runShowcaseTour = useCallback(() => {
    stopShowcase();
    showcaseAbortRef.current = false;
    setIsShowcasePlaying(true);

    const canvas = artworkCanvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);
    const midR = Math.floor(rows / 2);
    const midC = Math.floor(cols / 2);

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!showcaseAbortRef.current) fn();
      }, delay);
      showcaseTimeoutRefs.current.push(id);
    };

    // Stage 0: Initial clean state
    setEngineMode("draw");
    setIsLifeRunning(false);
    pixelsRef.current.clear();
    redrawAll();

    const startX = Math.max(20, width * 0.15);
    const startY = Math.max(40, height * 0.7);
    setVirtualCursor({ x: startX, y: startY, visible: true, label: "Booting Pixel Studio..." });

    // Stage 1: Draw 8-bit Heart
    const heartCoords = [
      [-3, -2], [-3, -1], [-3, 1], [-3, 2],
      [-2, -3], [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2], [-2, 3],
      [-1, -3], [-1, -2], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3],
      [0, -2], [0, -1], [0, 0], [0, 1], [0, 2],
      [1, -1], [1, 0], [1, 1],
      [2, 0],
    ];

    let t = 500;
    schedule(() => {
      setVirtualCursor({ x: width / 2, y: height / 2 - 30, visible: true, label: "Drawing 8-bit Sprite..." });
    }, t);

    heartCoords.forEach(([dr, dc], idx) => {
      t += 50;
      schedule(() => {
        const r = midR + dr;
        const c = midC + dc;
        const key = `${r}_${c}`;
        const color = idx % 2 === 0 ? "#FF2A85" : "#00FFCC";
        pixelsRef.current.set(key, color);
        redrawAll();
        const screen = projectToScreen(c, r, pixelSize, width, height, cols, rows);
        setVirtualCursor({ x: screen.x + pixelSize / 2, y: screen.y + pixelSize / 2, visible: true, label: "8-bit Sprite", clicking: true });
        if (idx % 3 === 0) playPopSound(440 + idx * 15);
      }, t);
    });

    // Stage 2: Rainbow Chroma Brush
    t += 300;
    schedule(() => {
      setIsRainbowBrush(true);
      setVirtualCursor({ x: width * 0.3, y: height * 0.3, visible: true, label: "🌈 Rainbow Chroma Brush Enabled" });
      playPopSound(720);
    }, t);

    const wavePoints: [number, number][] = [];
    for (let c = -9; c <= 9; c += 1) {
      const r = Math.round(Math.sin(c * 0.45) * 3) - 5;
      wavePoints.push([r, c]);
    }

    wavePoints.forEach(([dr, dc], idx) => {
      t += 40;
      schedule(() => {
        const r = midR + dr;
        const c = midC + dc;
        const hue = (idx * 22) % 360;
        const color = `hsl(${hue}, 100%, 60%)`;
        pixelsRef.current.set(`${r}_${c}`, color);
        redrawAll();
        const screen = projectToScreen(c, r, pixelSize, width, height, cols, rows);
        setVirtualCursor({ x: screen.x + pixelSize / 2, y: screen.y + pixelSize / 2, visible: true, label: "Rainbow Chroma", clicking: true });
        if (idx % 2 === 0) playPopSound(520 + idx * 25);
      }, t);
    });

    // Stage 3: Conway's Game of Life (Autoplay)
    t += 400;
    schedule(() => {
      setEngineMode("life");
      setIsLifeRunning(true);
      setVirtualCursor({ x: width / 2, y: 35, visible: true, label: "🧬 Conway's Game of Life (Autoplay)" });
      playPopSound(880);
    }, t);

    // Let life run for 2.6s
    t += 2600;

    // Stage 4: Falling Sand Simulation
    schedule(() => {
      setIsLifeRunning(false);
      setEngineMode("sand");
      setSandElement("sand");
      setVirtualCursor({ x: width / 2, y: height * 0.2, visible: true, label: "⏳ Falling Sand Physics Particles" });
      playPopSound(650);
    }, t);

    for (let s = 0; s < 14; s++) {
      t += 55;
      schedule(() => {
        const r = Math.floor(midR - 8);
        const c = Math.floor(midC - 7 + (s % 14));
        pixelsRef.current.set(`${r}_${c}`, s % 2 === 0 ? "#FBBF24" : "#38BDF8");
        redrawAll();
        const screen = projectToScreen(c, r, pixelSize, width, height, cols, rows);
        setVirtualCursor({ x: screen.x, y: screen.y, visible: true, label: "Cellular Sand", clicking: true });
        playPopSound(320 + s * 25);
      }, t);
    }

    // Stage 5: Finish tour
    t += 1000;
    schedule(() => {
      setVirtualCursor({ x: width / 2, y: height / 2, visible: true, label: "✨ Click anywhere to draw & explore!" });
      playPopSound(950);
    }, t);

    t += 2000;
    schedule(() => {
      stopShowcase();
    }, t);
  }, [stopShowcase, pixelSize, redrawAll, projectToScreen, playPopSound]);

  // Video Recording Engine (HTML5 Canvas MediaRecorder)
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      playPopSound(440);
    } else {
      const canvas = artworkCanvasRef.current;
      if (!canvas) return;
      try {
        const stream = canvas.captureStream(30);
        const mimeType =
          typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9"
            : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("video/webm")
            ? "video/webm"
            : "video/mp4";

        const recorder = new MediaRecorder(stream, { mimeType });
        recordedChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `adityaos-pixel-demo-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        playPopSound(800);
      } catch (err) {
        console.error("Recording not supported or failed", err);
      }
    }
  }, [isRecording, playPopSound]);

  // Auto-launch showcase if URL has ?demo=1 or ?showcase=1
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("demo") === "1" || p.get("showcase") === "1") {
        const timer = setTimeout(() => {
          runShowcaseTour();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [runShowcaseTour]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      showcaseTimeoutRefs.current.forEach((t) => clearTimeout(t));
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Export Matrix JSON to Clipboard
  const [isExportCopied, setIsExportCopied] = useState<boolean>(false);
  const handleExportMatrixJSON = useCallback(() => {
    const entries: { col: number; row: number; color: string }[] = [];
    pixelsRef.current.forEach((color, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);
      entries.push({ col: c, row: r, color });
    });
    const jsonStr = JSON.stringify(entries, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setIsExportCopied(true);
    playPopSound(800);
    setTimeout(() => setIsExportCopied(false), 2000);
  }, [playPopSound]);

  // Image Upload -> Triggers Interactive Pixel Art Import Studio
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          setImportImageSrc(src);
          setIsImportModalOpen(true);
          playPopSound(650);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [playPopSound]
  );

  const loadProceduralScene = useCallback(
    (sceneKey: string) => {
      const canvas = artworkCanvasRef.current;
      const cols = canvas ? Math.floor(canvas.width / pixelSize) : 80;
      const rows = canvas ? Math.floor(canvas.height / pixelSize) : 50;

      const preset = SCENE_PRESETS[sceneKey] || SCENE_PRESETS.himalayanNight;
      const generator = preset.generate || SCENE_PRESETS.himalayanNight.generate;
      const generatedPixels = generator(cols, rows);

      pixelsRef.current.clear();
      generatedPixels.forEach((hex: string, key: string) => {
        pixelsRef.current.set(key, hex);
      });
      drawingBufferRef.current = new Map(generatedPixels);
      setCanvasPixelCount(generatedPixels.size);
      saveStep();
      redrawAll();
      playPopSound(750);
      setIsSceneMenuOpen(false);
    },
    [pixelSize, redrawAll, saveStep, playPopSound]
  );

  const handleApplyImportPixels = useCallback(
    (newPixels: Map<string, string>, count: number) => {
      const canvas = artworkCanvasRef.current;
      const physW = canvas ? canvas.width : 1200;
      const physH = canvas ? canvas.height : 800;

      let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
      newPixels.forEach((_, key) => {
        const [rStr, cStr] = key.split("_");
        const r = parseInt(rStr, 10);
        const c = parseInt(cStr, 10);
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      });

      const importW = isFinite(maxC - minC) ? maxC - minC + 1 : 0;
      const importH = isFinite(maxR - minR) ? maxR - minR + 1 : 0;

      // Auto-Fit: Calculate ideal pixelSize so imported artwork fits inside the visible canvas with margin
      let targetPixelSize = pixelSize;
      if (importW > 0 && importH > 0) {
        const idealW = Math.floor((physW * 0.88) / importW);
        const idealH = Math.floor((physH * 0.88) / importH);
        const computedIdeal = Math.max(4, Math.min(32, Math.min(idealW, idealH)));
        if (computedIdeal < pixelSize || importW * pixelSize > physW * 0.9 || importH * pixelSize > physH * 0.9) {
          targetPixelSize = computedIdeal;
          setPixelSize(computedIdeal);
        }
      }

      const canvasWidth = Math.max(1, Math.floor(physW / targetPixelSize));
      const canvasHeight = Math.max(1, Math.floor(physH / targetPixelSize));

      const offsetC = Math.max(0, Math.floor((canvasWidth - importW) / 2));
      const offsetR = Math.max(0, Math.floor((canvasHeight - importH) / 2));

      pixelsRef.current.clear();
      newPixels.forEach((hex, key) => {
        const [rStr, cStr] = key.split("_");
        const r = parseInt(rStr, 10) - minR + offsetR;
        const c = parseInt(cStr, 10) - minC + offsetC;
        pixelsRef.current.set(`${r}_${c}`, hex);
      });
      drawingBufferRef.current = new Map(pixelsRef.current);
      setCanvasPixelCount(pixelsRef.current.size);
      setStats((prev) => ({
        ...prev,
        drawn: prev.drawn + pixelsRef.current.size,
        score: prev.score + pixelsRef.current.size * 5,
      }));
      redrawAll();
      saveStep();
      playPopSound(800);
    },
    [pixelSize, redrawAll, saveStep, playPopSound]
  );

  // Curated, high-contrast palette without near-duplicate dark swatches
  const palette = useMemo(() => {
    return [
      "#FFFFFF", // Pure White
      "#FAF7F2", // Paper Cream
      "#090D16", // Deep Ink Black
      "#EF4444", // Crimson Red
      "#F59E0B", // Amber Gold
      "#10B981", // Emerald Green
      "#00FFCC", // Cyber Cyan
      "#38BDF8", // Sky Blue
      "#8B5CF6", // Violet Purple
      "#EC4899", // Neon Magenta
      "#92400E", // Warm Terracotta / Wood
    ];
  }, []);

  // Meaningful Rank & XP progression system
  const userLevelInfo = useMemo(() => {
    const px = stats.drawn;
    if (px >= 500) {
      return {
        level: 4,
        title: "Pixel Architect",
        nextUnlock: "Master Rank (All tools unlocked)",
        progress: 100,
        current: px,
        max: 500,
      };
    }
    if (px >= 200) {
      return {
        level: 3,
        title: "Grid Explorer",
        nextUnlock: "Matrix JSON Export at 500 px",
        progress: Math.min(100, Math.floor(((px - 200) / 300) * 100)),
        current: px,
        max: 500,
      };
    }
    if (px >= 50) {
      return {
        level: 2,
        title: "Active Builder",
        nextUnlock: "Sand Physics Lab at 200 px",
        progress: Math.min(100, Math.floor(((px - 50) / 150) * 100)),
        current: px,
        max: 200,
      };
    }
    return {
      level: 1,
      title: "Canvas Visitor",
      nextUnlock: "Chroma Rainbow Brush at 50 px",
      progress: Math.min(100, Math.floor((px / 50) * 100)),
      current: px,
      max: 50,
    };
  }, [stats.drawn]);

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      onContextMenu={(e) => {
        // Prevent desktop context menu from opening when interacting with Pixel Engine
        e.stopPropagation();
      }}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="pixel-engine flex flex-col h-full select-none font-mono text-xs overflow-hidden relative"
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
            onClick={() => {
              setActiveTool("pencil");
              playPopSound(500);
            }}
            title="Pencil Tool (B / P)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "pencil"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("eraser");
              playPopSound(450);
            }}
            title="Eraser Tool (E)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "eraser"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          {/* Bucket */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("bucket");
              playPopSound(550);
            }}
            title="Paint Bucket (G)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "bucket"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <PaintBucket className="w-3.5 h-3.5" />
          </button>

          {/* Eyedropper */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("picker");
              playPopSound(600);
            }}
            title="Eyedropper (I)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "picker"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>

          {/* Shape Tools Separator */}
          <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />

          {/* Line Tool (L) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("line");
              playPopSound(520);
            }}
            title="Line Tool (L)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "line"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Rectangle Tool (U) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("rect");
              playPopSound(530);
            }}
            title="Rectangle Tool (U)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "rect"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          {/* Ellipse Tool (C) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("ellipse");
              playPopSound(540);
            }}
            title="Ellipse / Circle Tool (C)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "ellipse"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
          </button>

          {/* Triangle Tool (Y) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("triangle");
              playPopSound(550);
            }}
            title="Triangle Tool (Y)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "triangle"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Triangle className="w-3.5 h-3.5" />
          </button>

          {/* Polygon Tool (X) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("polygon");
              playPopSound(560);
            }}
            title="Polygon Tool (X) - Click points, Enter/Double-click to close"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "polygon"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Hexagon className="w-3.5 h-3.5" />
          </button>

          {/* Rounded Rectangle Tool (K) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("roundedRect");
              playPopSound(570);
            }}
            title="Rounded Rectangle Tool (K)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "roundedRect"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <div className="w-3.5 h-3.5 rounded border-[1.5px] border-current" />
          </button>

          {/* Text Tool Separator */}
          <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />

          {/* On-Canvas Text Tool (T) */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("type");
              playPopSound(650);
            }}
            title="On-Canvas Text Tool (T) - Click canvas to type directly"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              activeTool === "type"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>

          {/* Symmetry Mirror */}
          <button
            type="button"
            onClick={() => {
              setIsSymmetry(!isSymmetry);
              playPopSound(700);
            }}
            title="Symmetry Mirror Tool (M)"
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              isSymmetry
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Rainbow / Chroma Brush */}
          <button
            type="button"
            onClick={() => {
              setIsRainbowBrush(!isRainbowBrush);
              playPopSound(isRainbowBrush ? 400 : 700);
            }}
            title={isRainbowBrush ? "Rainbow Chroma Brush: ON" : "Rainbow Chroma Brush: OFF"}
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1 ${
              isRainbowBrush
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRainbowBrush ? "text-amber-500 animate-spin" : ""}`} />
            <span className="text-xs font-mono hidden xl:inline">Rainbow</span>
          </button>

          <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            title="Undo (Cmd/Ctrl+Z)"
            className="p-1.5 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            title="Redo (Cmd/Ctrl+Y)"
            className="p-1.5 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={toggleAudioMute}
            title={isAudioMuted ? "Unmute Audio Synth" : "Mute Audio Synth"}
            className="p-1.5 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer"
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard Shortcuts Help Button */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard Shortcuts (?)"
            className="px-2 py-0.5 rounded text-xs font-mono text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keys</span>
          </button>

          <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />

          {/* Purge Canvas (Destructive with 5s Undo Toast) */}
          <button
            type="button"
            onClick={handleClear}
            title="Purge Canvas (Del)"
            className="p-1.5 rounded text-stone-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownload}
            title="Download PNG (Cmd/Ctrl+S)"
            className="p-1.5 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Record Video Clip */}
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? "Stop Video Recording & Download" : "Record Video Clip"}
            className={`p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1 ${
              isRecording
                ? "text-red-500 bg-red-500/10"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            {isRecording ? (
              <>
                <VideoOff className="w-3.5 h-3.5 animate-pulse text-red-500" />
                <span className="text-[11px] font-mono text-red-500 hidden sm:inline">Rec...</span>
              </>
            ) : (
              <Video className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Center: Perspective & 3D Extrusion toggles */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {/* Perspective: Square vs Isometric */}
          <button
            type="button"
            onClick={() => {
              setPerspective((prev) => (prev === "square" ? "isometric" : "square"));
              playPopSound(650);
            }}
            title="Toggle Perspective (Shift+P)"
            className={`px-2 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1 ${
              perspective === "isometric"
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>{perspective === "isometric" ? "Isometric" : "Square"}</span>
          </button>

          {/* 3D Voxel Extrusion */}
          <button
            type="button"
            onClick={() => {
              setIs3D(!is3D);
              playPopSound(700);
            }}
            title="Toggle 3D Voxel Extrusion (3)"
            className={`px-2 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1 ${
              is3D
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            <Box className="w-3 h-3" />
            <span>3D: {is3D ? "on" : "off"}</span>
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowGrid(!showGrid);
              playPopSound(500);
            }}
            title="Toggle Grid Lines (Shift+G)"
            className={`px-2 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
              showGrid
                ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100"
                : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            Grid: {showGrid ? "on" : "off"}
          </button>
        </div>

        {/* Right: Grid Size Range Slider & Telemetry Toggle */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-zinc-400">
          {/* Grid Size Slider */}
          <div className="flex items-center gap-1.5 px-1 py-0.5">
            <Sliders className="w-3 h-3 opacity-70" />
            <span className="hidden sm:inline opacity-70">Size</span>
            <input
              type="range"
              min="4"
              max="48"
              step="2"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              title={`Brush / Voxel footprint: ${pixelSize}px (4px - 48px)`}
              className="w-14 sm:w-20 h-1 rounded appearance-none cursor-pointer accent-stone-700 dark:accent-zinc-300 bg-stone-300 dark:bg-stone-700"
            />
            <span className="min-w-[28px] text-right text-stone-800 dark:text-zinc-200">
              {pixelSize}px
            </span>
          </div>

          {/* Fit Artwork to Viewport Button */}
          <button
            type="button"
            onClick={handleFitToScreen}
            title="Fit Artwork to Viewport (Shift+F or 0)"
            className="px-1.5 py-0.5 rounded text-xs font-mono text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Fit</span>
          </button>

          {/* Toggle Telemetry Sidebar (Overlay) */}
          <button
            type="button"
            onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
            title={isStatsCollapsed ? "Expand Engine Telemetry (D)" : "Collapse Engine Telemetry (D)"}
            className="px-2 py-0.5 rounded text-xs font-mono text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer flex items-center gap-1"
          >
            {isStatsCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isStatsCollapsed ? "Stats" : "Hide stats"}</span>
          </button>
        </div>
      </div>

      {/* Contextual Tool Options Strip: Shape Tools */}
      {["line", "rect", "ellipse", "triangle", "polygon", "roundedRect"].includes(activeTool) && (
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
            color: activeTheme.textPrimary,
          }}
          className="h-8 border-b px-2 sm:px-3 flex items-center justify-between text-[11px] gap-2 overflow-x-auto flex-shrink-0 select-none z-20"
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
              {activeTool === "line" ? "Line" : activeTool === "rect" ? "Rectangle" : activeTool === "ellipse" ? "Ellipse" : activeTool === "triangle" ? "Triangle" : activeTool === "polygon" ? "Polygon" : "Rounded Rect"}
            </span>

            {activeTool !== "line" && (
              <div className="flex items-center rounded bg-black/5 dark:bg-white/5 p-0.5 gap-0.5">
                {(["outline", "fill", "both"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setShapeMode(mode)}
                    className={`px-1.5 py-0.5 rounded text-[10px] capitalize transition-colors ${
                      shapeMode === mode
                        ? "bg-black/10 dark:bg-white/15 font-semibold text-stone-900 dark:text-zinc-100"
                        : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}

            {/* Thickness */}
            {(shapeMode !== "fill" || activeTool === "line") && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] opacity-60">Stroke:</span>
                <div className="flex items-center rounded bg-black/5 dark:bg-white/5 p-0.5 gap-0.5">
                  {[1, 2, 3, 4].map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setShapeThickness(th)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        shapeThickness === th
                          ? "bg-black/10 dark:bg-white/15 font-bold text-stone-900 dark:text-zinc-100"
                          : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      {th}px
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fill Color swatch (when fill or both) */}
            {(shapeMode === "fill" || shapeMode === "both") && activeTool !== "line" && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] opacity-60">Fill:</span>
                <div className="relative w-4 h-4 rounded border border-black/20 dark:border-white/20 overflow-hidden cursor-pointer">
                  <input
                    type="color"
                    value={shapeFillColor.startsWith("#") ? shapeFillColor : "#38bdf8"}
                    onChange={(e) => setShapeFillColor(e.target.value)}
                    className="absolute -inset-1 w-8 h-8 opacity-0 cursor-pointer"
                    title="Pick Fill Color"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: shapeFillColor }} />
                </div>
              </div>
            )}

            {/* Polygon Controls */}
            {activeTool === "polygon" && polygonVertices.length > 0 && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[10px] text-amber-500 font-bold">{polygonVertices.length} vertices</span>
                <button
                  type="button"
                  onClick={commitPolygon}
                  className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                >
                  Close (Enter)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPolygonVertices([]);
                    redrawAll();
                  }}
                  className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[10px] cursor-pointer"
                >
                  Cancel (Esc)
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] opacity-50 hidden md:inline">
            Shift: 1:1 / 45° · Alt: From center · Esc: Cancel
          </div>
        </div>
      )}

      {/* Contextual Tool Options Strip: On-Canvas Text Tool */}
      {activeTool === "type" && (
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
            color: activeTheme.textPrimary,
          }}
          className="h-8 border-b px-2 sm:px-3 flex items-center justify-between text-[11px] gap-2 overflow-x-auto flex-shrink-0 select-none z-20"
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Text</span>

            {/* Font selector */}
            <select
              value={textFontId}
              onChange={(e) => setTextFontId(e.target.value as any)}
              className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-mono cursor-pointer"
            >
              <option value="classic5x7">5x7 Classic (ASCII)</option>
              <option value="micro3x5">3x5 Micro</option>
              <option value="unicode1bit">1-Bit Unicode (Devanagari/Intl)</option>
            </select>

            {/* Scale */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-60">Scale:</span>
              <div className="flex items-center rounded bg-black/5 dark:bg-white/5 p-0.5 gap-0.5">
                {[1, 2, 3, 4].map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setTextScale(sc)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                      textScale === sc
                        ? "bg-black/10 dark:bg-white/15 font-bold text-stone-900 dark:text-zinc-100"
                        : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {sc}x
                  </button>
                ))}
              </div>
            </div>

            {/* Align */}
            <div className="flex items-center rounded bg-black/5 dark:bg-white/5 p-0.5 gap-0.5">
              {(["left", "center", "right"] as const).map((al) => (
                <button
                  key={al}
                  type="button"
                  onClick={() => setTextAlign(al)}
                  className={`px-1.5 py-0.5 rounded text-[10px] capitalize cursor-pointer ${
                    textAlign === al
                      ? "bg-black/10 dark:bg-white/15 font-semibold text-stone-900 dark:text-zinc-100"
                      : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {al}
                </button>
              ))}
            </div>

            {/* 1px Outline */}
            <button
              type="button"
              onClick={() => setTextOutline((prev) => !prev)}
              className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                textOutline
                  ? "bg-black/10 dark:bg-white/15 border-stone-400 font-semibold text-stone-900 dark:text-zinc-100"
                  : "border-transparent text-stone-500 dark:text-zinc-400 hover:bg-black/5"
              }`}
            >
              Outline
            </button>

            {/* 1px Shadow */}
            <button
              type="button"
              onClick={() => setTextShadow((prev) => !prev)}
              className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                textShadow
                  ? "bg-black/10 dark:bg-white/15 border-stone-400 font-semibold text-stone-900 dark:text-zinc-100"
                  : "border-transparent text-stone-500 dark:text-zinc-400 hover:bg-black/5"
              }`}
            >
              Shadow
            </button>

            {/* Live typing session commit/cancel */}
            {liveText?.active && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={commitLiveText}
                  className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                >
                  Commit (Ctrl+Enter)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLiveText(null);
                    const pCanvas = previewCanvasRef.current;
                    if (pCanvas) pCanvas.getContext("2d")?.clearRect(0, 0, pCanvas.width, pCanvas.height);
                  }}
                  className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[10px] cursor-pointer"
                >
                  Cancel (Esc)
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] opacity-50 hidden md:inline">
            {liveText?.active ? "Type on canvas · Enter: newline · Arrows: move caret" : "Click anywhere on canvas to type directly"}
          </div>
        </div>
      )}

      {/* Mini-Games & Modes Selector Deck */}
      <div
        style={{
          backgroundColor: `${activeTheme.cardBg}88`,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-8 border-b px-2 sm:px-3 flex items-center justify-between text-[11px] gap-2 relative z-30 flex-shrink-0 backdrop-blur-sm"
      >
        {/* Left: Mode Selection Tabs with Clean Soft Wash */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {[
            { id: "draw", label: "Draw" },
            { id: "arcade", label: "Arcade" },
            { id: "life", label: "Game of Life" },
            { id: "snake", label: "Snake" },
            { id: "sand", label: "Sand Sim" },
          ].map((m) => {
            const isSelected = engineMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => switchMode(m.id as "draw" | "arcade" | "life" | "snake" | "sand")}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 cursor-pointer ${
                  isSelected
                    ? "bg-black/[0.08] dark:bg-white/[0.1] text-stone-900 dark:text-zinc-100 font-medium"
                    : "text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Mode-Specific Interactive Controls */}
        <div className="flex items-center gap-2 flex-shrink-0 text-xs font-mono">
          {engineMode === "draw" && (
            <div className="flex items-center gap-2.5">
              {/* Procedural Scenes Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSceneMenuOpen((prev) => !prev)}
                  title="Generate dynamic full-canvas procedural scenes"
                  className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 flex items-center gap-1"
                >
                  <span>Scenes</span>
                  <span className="text-[10px] opacity-70">{isSceneMenuOpen ? "▴" : "▾"}</span>
                </button>

                {isSceneMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSceneMenuOpen(false)}
                    />
                    <div
                      style={{
                        backgroundColor: activeTheme.windowBg,
                        borderColor: activeTheme.cardBorder,
                      }}
                      className="absolute right-0 top-full mt-1.5 w-72 max-h-[420px] overflow-y-auto rounded border shadow-2xl py-1 z-50 text-left font-mono text-[11px] animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider opacity-50 font-bold border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                        <span>21 Iconic Scenes</span>
                        <span>{Object.keys(SCENE_PRESETS).length} Presets</span>
                      </div>

                      {/* Group 1: Iconic Anime */}
                      <div className="px-2.5 pt-2 pb-0.5 text-[9px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                        Iconic Anime
                      </div>
                      {Object.values(SCENE_PRESETS)
                        .filter((s) => s.category === "anime")
                        .map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => loadProceduralScene(s.id as any)}
                            className="w-full text-left px-2.5 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex flex-col cursor-pointer"
                          >
                            <span className="font-semibold text-stone-900 dark:text-zinc-100">{s.name}</span>
                            <span className="text-[9px] opacity-60 leading-tight truncate">{s.description}</span>
                          </button>
                        ))}

                      {/* Group 2: Modern & Ghibli Masterpieces */}
                      <div className="px-2.5 pt-2 pb-0.5 text-[9px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 border-t border-black/5 dark:border-white/5 mt-1">
                        Ghibli & Masterpieces
                      </div>
                      {Object.values(SCENE_PRESETS)
                        .filter((s) => s.category === "ghibli")
                        .map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => loadProceduralScene(s.id as any)}
                            className="w-full text-left px-2.5 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex flex-col cursor-pointer"
                          >
                            <span className="font-semibold text-stone-900 dark:text-zinc-100">{s.name}</span>
                            <span className="text-[9px] opacity-60 leading-tight truncate">{s.description}</span>
                          </button>
                        ))}

                      {/* Group 3: Landscapes & Cyberpunk */}
                      <div className="px-2.5 pt-2 pb-0.5 text-[9px] uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 border-t border-black/5 dark:border-white/5 mt-1">
                        Landscapes & Cyberpunk
                      </div>
                      {Object.values(SCENE_PRESETS)
                        .filter((s) => s.category === "landscape" || s.category === "cyberpunk")
                        .map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => loadProceduralScene(s.id as any)}
                            className="w-full text-left px-2.5 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex flex-col cursor-pointer"
                          >
                            <span className="font-semibold text-stone-900 dark:text-zinc-100">{s.name}</span>
                            <span className="text-[9px] opacity-60 leading-tight truncate">{s.description}</span>
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* Automated Showcase Tour Button */}
              <button
                type="button"
                onClick={isShowcasePlaying ? stopShowcase : runShowcaseTour}
                title="Automated Interactive Showcase Tour"
                className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
              >
                <span>{isShowcasePlaying ? "Stop tour" : "Showcase tour"}</span>
              </button>

              {/* Bot Playback Button */}
              <button
                type="button"
                onClick={runBotPlacement}
                title={isBotDrawing ? "Stop automated bot drawing" : "Let automated bot paint a random anime or landscape scene"}
                className={`text-xs font-mono transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 ${
                  isBotDrawing
                    ? "text-amber-500 font-bold animate-pulse hover:text-amber-400"
                    : "text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline"
                }`}
              >
                <span>{isBotDrawing ? `■ Stop (${activeBotScene ? activeBotScene.split(" ")[0] : "Bot"})` : "Auto-bot"}</span>
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* AI Text Scene Generator */}
              <button
                type="button"
                onClick={() => {
                  setIsSceneModalOpen(true);
                  playPopSound(700);
                }}
                title="AI Text-to-Pixel-Grid Scene Generator with 3-round critique"
                className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3 text-amber-500" />
                <span>Text Scene</span>
              </button>

              {/* Import Image Button */}
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                title="Import & Convert Image to Pixel Art Pipeline"
                className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
              >
                <span>Import</span>
              </button>

              {/* Export JSON Matrix Button */}
              <button
                type="button"
                onClick={handleExportMatrixJSON}
                title="Export Coordinates Matrix as JSON"
                className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
              >
                <span>{isExportCopied ? "Copied JSON" : "Matrix JSON"}</span>
              </button>
            </div>
          )}

          {engineMode === "arcade" && (
            <div className="flex items-center gap-2 font-mono">
              <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded font-bold">
                ARCADE SCORE: {arcadeScore}
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
                style={{
                  backgroundColor: isLifeRunning
                    ? (activeTheme.isDark ? "#065f46" : "#047857")
                    : (activeTheme.isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6"),
                  borderColor: isLifeRunning
                    ? (activeTheme.isDark ? "#10b981" : "#065f46")
                    : activeTheme.cardBorder,
                  color: isLifeRunning ? "#ffffff" : activeTheme.textPrimary,
                }}
                className="px-2.5 py-0.5 rounded border font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {isLifeRunning ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping inline-block" />
                    <Pause className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold tracking-wide">PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className={`w-3 h-3 ${activeTheme.isDark ? "text-cyan-400" : "text-cyan-700"}`} />
                    <span className="text-[10px] font-bold tracking-wide">AUTOPLAY (EVOLVE)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={stepConwayLife}
                title="Advance 1 Generation manually"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-2 py-0.5 rounded border flex items-center gap-1 font-semibold hover:opacity-85 transition-colors"
              >
                <StepForward className="w-3 h-3" />
                <span>STEP</span>
              </button>

              {/* Speed Toggle */}
              <button
                type="button"
                onClick={() => {
                  setLifeSpeed((prev) => (prev === 280 ? 140 : prev === 140 ? 70 : 280));
                  playPopSound(600);
                }}
                title="Toggle Evolution Speed"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-2 py-0.5 rounded border flex items-center gap-1 text-[9px] font-mono font-bold hover:opacity-85 transition-colors"
              >
                <Zap className={`w-2.5 h-2.5 ${activeTheme.isDark ? "text-amber-400" : "text-amber-600"}`} />
                <span>{lifeSpeed === 70 ? "3x" : lifeSpeed === 140 ? "1x" : "0.5x"}</span>
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("glider")}
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-1.5 py-0.5 rounded border hover:opacity-85 transition-colors font-medium"
              >
                Glider
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("pulsar")}
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-1.5 py-0.5 rounded border hover:opacity-85 transition-colors font-medium"
              >
                Pulsar
              </button>

              <button
                type="button"
                onClick={() => seedConwayPreset("random")}
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-1.5 py-0.5 rounded border hover:opacity-85 transition-colors font-medium hidden sm:inline"
              >
                Random
              </button>

              <span
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#e5e7eb",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="font-mono font-semibold text-[9px] px-1.5 py-0.5 rounded border"
              >
                GEN: {lifeGeneration}
              </span>
            </div>
          )}

          {engineMode === "snake" && (
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${activeTheme.isDark ? "text-amber-400" : "text-amber-700"}`}>
                SNAKE SCORE: {snakeScore}
              </span>
              <span className={`font-mono text-[9px] ${activeTheme.isDark ? "text-zinc-400" : "text-stone-500"} hidden sm:inline`}>
                HIGH: {snakeHighScore}
              </span>
              {isSnakeGameOver && (
                <span className="text-red-500 font-bold animate-pulse text-[10px]">
                  GAME OVER!
                </span>
              )}
              <button
                type="button"
                onClick={initSnakeGame}
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(245,158,11,0.15)" : "#fef3c7",
                  borderColor: activeTheme.isDark ? "rgba(245,158,11,0.4)" : "#f59e0b",
                  color: activeTheme.isDark ? "#fbbf24" : "#92400e",
                }}
                className="px-2 py-0.5 rounded border font-bold flex items-center gap-1 hover:opacity-90 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESTART</span>
              </button>
              <span className={`text-[9px] ${activeTheme.isDark ? "text-zinc-500" : "text-stone-400"} hidden md:inline`}>
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
                style={{
                  backgroundColor: sandElement === "sand" ? "#d97706" : (activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"),
                  borderColor: sandElement === "sand" ? "#b45309" : activeTheme.cardBorder,
                  color: sandElement === "sand" ? "#ffffff" : (activeTheme.isDark ? "#fbbf24" : "#b45309"),
                }}
                className="px-2 py-0.5 rounded border text-[10px] font-bold transition-colors"
              >
                Sand
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("water");
                  setCurrentColor("#06B6D4");
                }}
                style={{
                  backgroundColor: sandElement === "water" ? "#0284c7" : (activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"),
                  borderColor: sandElement === "water" ? "#0369a1" : activeTheme.cardBorder,
                  color: sandElement === "water" ? "#ffffff" : (activeTheme.isDark ? "#38bdf8" : "#0369a1"),
                }}
                className="px-2 py-0.5 rounded border text-[10px] font-bold transition-colors"
              >
                Water
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("wood");
                  setCurrentColor("#854D0E");
                }}
                style={{
                  backgroundColor: sandElement === "wood" ? "#78350f" : (activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"),
                  borderColor: sandElement === "wood" ? "#451a03" : activeTheme.cardBorder,
                  color: sandElement === "wood" ? "#ffffff" : (activeTheme.isDark ? "#d97706" : "#78350f"),
                }}
                className="px-2 py-0.5 rounded border text-[10px] font-bold transition-colors"
              >
                Wood
              </button>
              <button
                type="button"
                onClick={() => {
                  setSandElement("acid");
                  setCurrentColor("#10B981");
                }}
                style={{
                  backgroundColor: sandElement === "acid" ? "#047857" : (activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"),
                  borderColor: sandElement === "acid" ? "#065f46" : activeTheme.cardBorder,
                  color: sandElement === "acid" ? "#ffffff" : (activeTheme.isDark ? "#34d399" : "#047857"),
                }}
                className="px-2 py-0.5 rounded border text-[10px] font-bold transition-colors"
              >
                Acid
              </button>

              <button
                type="button"
                onClick={() => setIsSandSimRunning(!isSandSimRunning)}
                style={{
                  backgroundColor: isSandSimRunning
                    ? (activeTheme.isDark ? "#065f46" : "#047857")
                    : (activeTheme.isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"),
                  borderColor: isSandSimRunning ? "#10b981" : activeTheme.cardBorder,
                  color: isSandSimRunning ? "#ffffff" : activeTheme.textPrimary,
                }}
                className="px-2 py-0.5 rounded border font-bold text-[10px] tracking-wide transition-colors"
              >
                {isSandSimRunning ? "PAUSE" : "RESUME"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area with Swatch Bar & Floating Stats Overlay */}
      <div className="flex-1 flex overflow-hidden relative w-full h-full min-w-0 min-h-0">
        {/* Left Vertical Color Palette Swatches */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="w-12 border-r p-1 flex flex-col items-center gap-1.5 z-10 select-none flex-shrink-0"
        >
          {/* Active color chip with uppercase HEX label */}
          <div
            className="w-8 h-8 rounded border shadow-inner relative flex items-center justify-center cursor-pointer group"
            style={{ backgroundColor: currentColor, borderColor: activeTheme.cardBorder }}
            title={`Active Color: ${currentColor.toUpperCase()}`}
          >
            <input
              type="color"
              value={currentColor.startsWith("#") && currentColor.length === 7 ? currentColor : "#00FFCC"}
              onChange={(e) => {
                setCurrentColor(e.target.value);
                setCustomHexInput(e.target.value.toUpperCase());
              }}
              title="Pick Custom Color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          <span
            className="text-[7.5px] font-mono tracking-tighter uppercase opacity-70"
            title={currentColor}
          >
            {currentColor.slice(0, 7)}
          </span>

          {/* Custom HEX text input with validation */}
          <input
            type="text"
            value={customHexInput}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setCustomHexInput(val);
              if (/^#[0-9A-F]{6}$/i.test(val)) {
                setCurrentColor(val);
              }
            }}
            placeholder="#HEX"
            maxLength={7}
            title="Custom HEX Color Input"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            className="w-10 px-0.5 py-0.5 text-[8px] font-mono text-center rounded border outline-none uppercase"
          />

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="w-full h-px my-0.5"
          />

          {/* Curated Swatches (No Near-Duplicate Darks) */}
          <div className="flex flex-col gap-1 items-center overflow-y-auto max-h-[calc(100vh-230px)]">
            {palette.map((col, idx) => {
              const isActive = currentColor.toLowerCase() === col.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentColor(col);
                    setCustomHexInput(col.toUpperCase());
                    playPopSound(500);
                  }}
                  title={col}
                  style={{ backgroundColor: col }}
                  className={`w-6 h-6 rounded-xs transition-transform border ${
                    isActive
                      ? "ring-2 ring-offset-1 ring-amber-500 scale-105 border-white shadow-sm"
                      : "border-black/30 hover:scale-105"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Viewport Canvas Container (Remains 100% width/height regardless of stats open/close) */}
        <div
          ref={containerRef}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{ backgroundColor: activeTheme.canvasBg }}
          className="flex-1 w-full h-full relative overflow-hidden cursor-crosshair min-w-0 min-h-0 pixel-engine-viewport"
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
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute inset-0 touch-none block w-full h-full pixel-engine-canvas"
          />

          {/* Hover Preview Canvas Layer */}
          <canvas ref={previewCanvasRef} className="absolute inset-0 pointer-events-none block w-full h-full" />

          {/* Animated Virtual Cursor for Automated Showcase Demo */}
          {virtualCursor && virtualCursor.visible && (
            <div
              className="pointer-events-none absolute z-40 transition-all duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${virtualCursor.x}px`,
                top: `${virtualCursor.y}px`,
              }}
            >
              <div
                className={`relative flex items-center gap-1.5 ${
                  virtualCursor.clicking ? "scale-90" : "scale-100"
                } transition-transform`}
              >
                {/* Glowing Retro Pointer SVG */}
                <div className="w-5 h-5 relative filter drop-shadow-[0_0_8px_rgba(0,255,204,0.9)]">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path
                      d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                      fill="#00FFCC"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {virtualCursor.label && (
                  <div className="bg-black/90 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-cyan-400/60 shadow-lg whitespace-nowrap animate-pulse">
                    {virtualCursor.label}
                  </div>
                )}
              </div>
            </div>
          )}

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

        {/* FLOATING ABSOLUTE OVERLAY STATS PANEL (0 Canvas Resize or Shift) */}
        {!isStatsCollapsed && (
          <aside
            style={{
              backgroundColor: activeTheme.headerBg,
              borderLeft: `1px solid ${activeTheme.headerBorder}`,
              color: activeTheme.textPrimary,
            }}
            className="absolute top-0 right-0 h-full w-[250px] shadow-2xl flex flex-col z-30 overflow-hidden select-none backdrop-blur-md"
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
                className="opacity-60 hover:opacity-100 p-1"
                title="Collapse (D)"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-[11px]">
              {/* Metric 1: Meaningful System Rank & Progression */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1.5"
              >
                <div className="text-[10px] opacity-60 flex justify-between font-bold">
                  <span>RANK</span>
                  <span style={{ color: activeTheme.accent }}>LVL {userLevelInfo.level}</span>
                </div>
                <div className="font-bold text-xs" style={{ color: activeTheme.accent }}>
                  {userLevelInfo.title}
                </div>
                {/* XP Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-stone-300 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${userLevelInfo.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] opacity-60">
                    <span>{userLevelInfo.current} / {userLevelInfo.max} px</span>
                    <span>{userLevelInfo.progress}%</span>
                  </div>
                </div>
                <div className="text-[9px] opacity-70 pt-0.5">
                  Next: {userLevelInfo.nextUnlock}
                </div>
              </div>

              {/* Metric 2: Grid State & Internal Readouts */}
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
                  <span className="opacity-70">CANVAS PX:</span>
                  <span className="font-mono font-bold" style={{ color: activeTheme.accent }}>
                    {canvasPixelCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">SESSION PX:</span>
                  <span className="font-mono font-bold" style={{ color: activeTheme.accent }}>
                    {stats.drawn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">ENGINE STATUS:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ACTIVE (TWM:ACTIVE)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">AUDIO SYNTH:</span>
                  <span className="font-mono font-bold">
                    {isAudioMuted ? "MUTED" : "44.1kHz DSP"}
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

              {/* Metric 3: Live Firebase Global Community Stats */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border space-y-1.5"
              >
                <div className="text-[10px] opacity-70 uppercase font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className={`w-3 h-3 ${activeTheme.isDark ? "text-cyan-400" : "text-cyan-700"}`} />
                    COMMUNITY TELEMETRY
                  </span>
                  <span className={`text-[9px] ${activeTheme.isDark ? "text-emerald-400" : "text-emerald-700"} font-mono flex items-center gap-1 font-bold`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.isDark ? "bg-emerald-400" : "bg-emerald-600"} animate-pulse`} />
                    LIVE
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="opacity-70">PIXELS PAINTED:</span>
                  <span className={`font-bold ${activeTheme.isDark ? "text-emerald-400" : "text-emerald-800"}`}>
                    {(globalStats.totalPixelsDrawn + stats.drawn).toLocaleString()} PX
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="opacity-70">CANVAS EDITS:</span>
                  <span className={`font-bold ${activeTheme.isDark ? "text-cyan-400" : "text-cyan-800"}`}>
                    {(globalStats.totalCanvasEdits + stats.undos + (stats.drawn > 0 ? 1 : 0)).toLocaleString()} EDITS
                  </span>
                </div>
                <div className="text-[9px] opacity-60 pt-0.5">
                  Synchronized via Realtime Database
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
                <div className="text-[10px] opacity-70 uppercase font-semibold">BUFFER MEMORY</div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">VOXEL CACHE:</span>
                  <span className="font-semibold">{(canvasPixelCount * 0.12).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="opacity-70">RENDER RATE:</span>
                  <span className={`font-bold ${activeTheme.isDark ? "text-emerald-400" : "text-emerald-800"}`}>60 FPS</span>
                </div>
              </div>

              {/* Action Buttons: Drop Gravity lives here exclusively */}
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
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>DROP GRAVITY</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    backgroundColor: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                  }}
                  className="w-full py-1.5 rounded border text-[11px] font-bold text-red-500 hover:bg-red-500/10 hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>PURGE CANVAS</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Telemetry Bar: Coordinates, Pixel Counts, Mode */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textMuted,
        }}
        className="h-6 border-t px-3 flex items-center justify-between text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ color: activeTheme.accent }}>
            MODE: {engineMode.toUpperCase()}
          </span>
          <span className="opacity-40">•</span>
          <span>
            COORD: [{hoverCoord ? `${hoverCoord.col}, ${hoverCoord.row}` : "--, --"}]
          </span>
          <span className="opacity-40">•</span>
          <span>CANVAS: {canvasPixelCount} PX</span>
          <span className="opacity-40">•</span>
          <span>SESSION: {stats.drawn} PX</span>
        </div>

        <div className="flex items-center gap-3">
          <span>THEME: {activeTheme.name.toUpperCase()}</span>
        </div>
      </div>

      {/* 5-Second Undo Toast for Destructive Purge Canvas */}
      {undoToast && undoToast.active && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.accent,
            color: activeTheme.textPrimary,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-md border shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-bottom-2 duration-200 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 text-red-500 font-bold">
            <Trash2 className="w-4 h-4" />
            <span>Canvas purged ({undoToast.count ?? 0} px)</span>
          </div>
          <span className="text-[10px] opacity-70">Undo expires in {undoToast.seconds}s</span>
          <button
            type="button"
            onClick={handleRestorePurged}
            style={{
              backgroundColor: activeTheme.accent,
              color: activeTheme.isDark ? "#000" : "#fff",
            }}
            className="px-2.5 py-1 rounded font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            RESTORE
          </button>
          <button
            type="button"
            onClick={() => setUndoToast(null)}
            className="opacity-50 hover:opacity-100 p-0.5 ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Modal (?) */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            style={{
              backgroundColor: activeTheme.windowBg,
              borderColor: activeTheme.headerBorder,
              color: activeTheme.textPrimary,
            }}
            className="w-full max-w-lg rounded-lg border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: activeTheme.headerBg,
                borderColor: activeTheme.headerBorder,
              }}
              className="h-10 border-b px-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 font-bold text-xs" style={{ color: activeTheme.accent }}>
                <HelpCircle className="w-4 h-4" />
                <span>KEYBOARD SHORTCUTS</span>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded hover:opacity-70 opacity-60"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-2">
                  Drawing Tools
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Pencil</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">B / P</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Eraser</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">E</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Paint Bucket</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">G</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Eyedropper</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">I</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>On-Canvas Text</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">T</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Line</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">L</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Rectangle</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">U</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Ellipse / Circle</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">C</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Triangle</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Y</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Polygon</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">X</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Rounded Rect</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">K</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Symmetry Mirror</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">M</kbd>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-2">
                  Canvas & View
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Fit to Viewport</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Shift + F / 0</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Toggle Grid</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Shift + G</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Isometric View</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Shift + P</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>3D Extrusion</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">3</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Telemetry Stats</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">D</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Undo</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Cmd / Ctrl + Z</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Redo</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Cmd + Y / Shift+Z</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Download PNG</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Cmd / Ctrl + S</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Purge Canvas</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold text-red-500">Del / Backspace</kbd>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-2">
                  Modes (Safe Artwork Preservation)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Draw Studio</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">1</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Arcade Mode</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">2</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Conway&apos;s Life</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">Ctrl + 3</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Voxel Snake</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">4</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Falling Sand Sim</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">5</kbd>
                  </div>
                  <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded">
                    <span>Shortcuts Help</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">?</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundColor: activeTheme.headerBg,
                borderColor: activeTheme.headerBorder,
              }}
              className="px-4 py-2 border-t text-[11px] opacity-70 flex justify-between items-center"
            >
              <span>Tip: Artwork in Draw mode is never lost when switching modes.</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]">Esc to close</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Pixel Art Importer & r/place Quantizer Modal */}
      <PixelArtImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        imageSrc={importImageSrc}
        canvasCols={artworkCanvasRef.current ? Math.floor(artworkCanvasRef.current.width / pixelSize) : 48}
        canvasRows={artworkCanvasRef.current ? Math.floor(artworkCanvasRef.current.height / pixelSize) : 36}
        onApplyPixels={handleApplyImportPixels}
      />

      {/* AI Text-to-Pixel-Grid Scene Generator Modal */}
      <PixelSceneModal
        isOpen={isSceneModalOpen}
        onClose={() => setIsSceneModalOpen(false)}
        canvasCols={artworkCanvasRef.current ? Math.floor(artworkCanvasRef.current.width / pixelSize) : 80}
        canvasRows={artworkCanvasRef.current ? Math.floor(artworkCanvasRef.current.height / pixelSize) : 50}
        onApplyPixels={handleApplyImportPixels}
      />
    </div>
  );
};
