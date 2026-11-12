"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Lenis from "lenis";
import {
  JourneyStation,
  WritingItem,
  getActiveStations,
  DEFAULT_WRITING_ITEMS,
} from "@/content/journey";
import { JourneyConfig, DEFAULT_JOURNEY_CONFIG } from "@/content/journey.config";
import { DwellMapper } from "./engine/DwellMapper";
import { SpringCamera } from "./engine/SpringCamera";
import { StoryTicker, TickerState } from "./engine/StoryTicker";
import { ViewportControls, ViewportControlState } from "./engine/ViewportControls";
import { StoryWorld } from "./world/StoryWorld";
import { MinimalCaption } from "./ui/MinimalCaption";
import { MinimalRail } from "./ui/MinimalRail";
import { TimelineGauge } from "./ui/TimelineGauge";
import { ViewportHud } from "./ui/ViewportHud";
import { TuningPanel, PerfResult } from "./ui/TuningPanel";
import { StoryTimelineFallback } from "./ui/StoryTimelineFallback";
import { AdityaOSDesktop } from "@/components/System/AdityaOSDesktop";
import { useThemeStore } from "@/store/themeStore";

export interface StoryLandingProps {
  stations?: JourneyStation[];
  writingItems?: WritingItem[];
  defaultAppOnLanding?: string;
}

export function StoryLanding({
  stations = getActiveStations(),
  writingItems = DEFAULT_WRITING_ITEMS,
  defaultAppOnLanding,
}: StoryLandingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<StoryWorld | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const tickerRef = useRef<StoryTicker | null>(null);
  const mapperRef = useRef<DwellMapper | null>(null);
  const cameraRef = useRef<SpringCamera | null>(null);
  const controlsRef = useRef<ViewportControls | null>(null);

  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [config, setConfig] = useState<JourneyConfig>(DEFAULT_JOURNEY_CONFIG);
  const [viewportState, setViewportState] = useState<ViewportControlState>({
    isInteracting: false,
    isInspectMode: false,
    hasOffsets: false,
    activeMode: "idle",
  });
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);
  const [showScrollHint, setShowScrollHint] = useState<boolean>(true);

  // Active station state for minimal caption and rail
  const [activeStationIndex, setActiveStationIndex] = useState<number>(0);

  // Live telemetry state for debug tuning panel
  const [tickerState, setTickerState] = useState<TickerState>({
    rawProgress: 0,
    mappedTau: 0,
    velocity: 0,
    activeStationIndex: 0,
    currentYear: stations[0]?.year || 2000,
    fps: 60,
    p50Ms: 16.6,
    p95Ms: 16.6,
    droppedFrames: 0,
    longTasks: 0,
    renderScale: 1.0,
    isSettled: false,
    cameraState: {} as any,
  });

  // Check URL parameters (?debug=1, ?perf=1), reduced motion, and WebGL support
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mql.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener("change", handleMotionChange);

    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") === "1" || params.get("debug") === "true" || params.get("perf") === "1") {
      setIsDebug(true);
    }

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Auto-fade initial scroll hint after 4 seconds
    const hintTimer = setTimeout(() => {
      setShowScrollHint(false);
    }, 4000);

    return () => {
      mql.removeEventListener("change", handleMotionChange);
      clearTimeout(hintTimer);
    };
  }, []);

  // Update feel configuration dynamically
  const handleUpdateConfig = useCallback((newConfig: JourneyConfig) => {
    setConfig(newConfig);
    if (tickerRef.current) tickerRef.current.updateConfig(newConfig);
    if (mapperRef.current) mapperRef.current.updateConfig(newConfig);
    if (cameraRef.current) cameraRef.current.updateConfig(newConfig);
    if (worldRef.current) worldRef.current.updateConfig(newConfig);
  }, []);

  // Smooth scroll to station helper using lenis.scrollTo (never a competing tween)
  const scrollToStation = useCallback(
    (stationId: string) => {
      if (!lenisRef.current || !mapperRef.current) return;
      const idx = stations.findIndex((s) => s.id === stationId);
      if (idx === -1) return;

      const targetProgress = mapperRef.current.getStationRawProgress(idx);
      const limit = lenisRef.current.limit;
      lenisRef.current.scrollTo(targetProgress * limit, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    },
    [stations]
  );

  // Initialize unified engine: Lenis + Three.js + GSAP Ticker
  useEffect(() => {
    if (isReducedMotion || !hasWebGL || !canvasRef.current || hasLanded) return;

    let isDisposed = false;
    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;

    // 1. Initialize Lenis (native scroll as single source of truth)
    const lenis = new Lenis({
      lerp: config.lenisLerp,
      wheelMultiplier: config.lenisWheelMultiplier,
      syncTouch: config.syncTouch, // Native touch scroll on mobile
      autoResize: true,
    });
    lenisRef.current = lenis;

    // 2. Initialize 2.5D World
    const world = new StoryWorld({
      canvas,
      stations,
      config,
      isDark,
    });
    worldRef.current = world;

    // 3. Initialize Dwell Mapper & Spring Camera
    const mapper = new DwellMapper(stations, config);
    mapperRef.current = mapper;

    const camera = new SpringCamera(world.camera, stations, config);
    cameraRef.current = camera;

    // 4. Initialize Unified GSAP Ticker (The Single Clock)
    const ticker = new StoryTicker(lenis, world, camera, mapper, config);
    tickerRef.current = ticker;

    // 4b. Initialize 3D Viewport Controls (Orbit, Pan, Zoom)
    const controls = new ViewportControls({
      element: canvas,
      camera,
      ticker,
      lenis,
      onStateChange: (vState) => {
        if (!isDisposed) {
          setViewportState({ ...vState });
        }
      },
    });
    controlsRef.current = controls;

    // Subscribe to ticker updates without per-frame React re-render
    let lastReportedIndex = -1;
    const unsubscribe = ticker.subscribe((state) => {
      if (isDisposed) return;

      // Only update React activeStationIndex when station actually changes with hysteresis
      if (state.activeStationIndex !== lastReportedIndex) {
        lastReportedIndex = state.activeStationIndex;
        setActiveStationIndex(state.activeStationIndex);
      }

      // If debug panel is active, mirror telemetry state throttled
      if (isDebug) {
        setTickerState({ ...state });
      }

      // Fade out scroll hint once user scrolls past 1%
      if (state.rawProgress > 0.01) {
        setShowScrollHint(false);
      }

      // Seamless AdityaOS desktop landing transition at end of journey
      if (state.rawProgress >= 0.985 && !hasLanded) {
        setHasLanded(true);
      }
    });

    // 5. Preloading: Await fonts, warm up GPU textures, then reveal
    (async () => {
      try {
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }
        await world.preloadGPU();
      } catch (err) {
        console.warn("Preload warning:", err);
      } finally {
        if (!isDisposed) {
          setIsPreloading(false);
          ticker.start();
        }
      }
    })();

    // 6. Responsive resize listener
    const handleResize = () => {
      if (canvas && world) {
        world.handleResize(canvas.clientWidth, canvas.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // 7. Settle Snap: Ease to nearest station rest if within snap proximity
    let snapTimeout: NodeJS.Timeout | null = null;
    const onScrollSettle = () => {
      if (snapTimeout) clearTimeout(snapTimeout);

      snapTimeout = setTimeout(() => {
        if (!lenisRef.current || !mapperRef.current || hasLanded) return;
        const currentP = lenisRef.current.progress;
        const snapCheck = mapperRef.current.checkSnapProximity(currentP);

        if (snapCheck.canSnap) {
          const limit = lenisRef.current.limit;
          lenisRef.current.scrollTo(snapCheck.targetProgress * limit, {
            duration: config.snapDurationSec,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, config.snapDelayMs);
    };

    lenis.on("scroll", onScrollSettle);

    // Cancel snap on any user interaction
    const cancelSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
    };
    window.addEventListener("wheel", cancelSnap, { passive: true });
    window.addEventListener("touchstart", cancelSnap, { passive: true });
    window.addEventListener("keydown", cancelSnap, { passive: true });

    return () => {
      isDisposed = true;
      if (snapTimeout) clearTimeout(snapTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", cancelSnap);
      window.removeEventListener("touchstart", cancelSnap);
      window.removeEventListener("keydown", cancelSnap);
      unsubscribe();
      controls.dispose();
      controlsRef.current = null;
      ticker.dispose();
      world.dispose();
      lenis.destroy();
      lenisRef.current = null;
      worldRef.current = null;
      tickerRef.current = null;
    };
  }, [isReducedMotion, hasWebGL, stations, isDark, hasLanded, isDebug]);

  // Keyboard navigation calling lenis.scrollTo (never competing with scroll)
  useEffect(() => {
    if (hasLanded || isPreloading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        const nextIdx = Math.min(activeStationIndex + 1, stations.length - 1);
        scrollToStation(stations[nextIdx].id);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prevIdx = Math.max(activeStationIndex - 1, 0);
        scrollToStation(stations[prevIdx].id);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToStation(stations[0].id);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToStation(stations[stations.length - 1].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStationIndex, stations, scrollToStation, hasLanded, isPreloading]);

  // Automated Perf Benchmark (?perf=1)
  const handleRunBenchmark = useCallback(async (): Promise<PerfResult[]> => {
    if (!lenisRef.current) return [];
    const lenis = lenisRef.current;
    const limit = lenis.limit;

    const speeds: { name: "Slow (0.5x)" | "Normal (1.0x)" | "Fast (2.5x)"; duration: number }[] = [
      { name: "Slow (0.5x)", duration: 4.5 },
      { name: "Normal (1.0x)", duration: 2.2 },
      { name: "Fast (2.5x)", duration: 0.9 },
    ];

    const results: PerfResult[] = [];

    for (const s of speeds) {
      // Reset to top
      lenis.scrollTo(0, { immediate: true });
      await new Promise((r) => setTimeout(r, 400));

      const samples: number[] = [];
      let dropped = 0;
      let longTasks = 0;
      const startTime = performance.now();

      // Scroll to bottom
      lenis.scrollTo(limit, { duration: s.duration });

      while (performance.now() - startTime < s.duration * 1000 + 400) {
        const frameStart = performance.now();
        await new Promise((r) => requestAnimationFrame(r));
        const dt = performance.now() - frameStart;
        samples.push(dt);
        if (dt > 33.3) dropped++;
        if (dt > 50.0) longTasks++;
      }

      const sorted = [...samples].sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length * 0.5)] || 16.6;
      const p95 = sorted[Math.floor(sorted.length * 0.95)] || 16.6;
      const avgFps = Math.round(1000 / (samples.reduce((a, b) => a + b, 0) / (samples.length || 1)));

      results.push({
        speed: s.name,
        avgFps,
        p50Ms: parseFloat(p50.toFixed(1)),
        p95Ms: parseFloat(p95.toFixed(1)),
        droppedFrames: dropped,
        longTasks,
      });
    }

    // Reset back
    lenis.scrollTo(0, { immediate: true });
    return results;
  }, []);

  // Reduced motion / No-JS / No-WebGL fallback
  if (isReducedMotion || !hasWebGL) {
    return (
      <StoryTimelineFallback
        stations={stations}
        writingItems={writingItems}
        onEnterDesktop={() => setHasLanded(true)}
      />
    );
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const spacerHeightVh = isMobile ? config.totalScrollLengthVhMobile : config.totalScrollLengthVhDesktop;
  const currentStation = stations[activeStationIndex] || stations[0];

  return (
    <div className="relative bg-[#060C1A] text-white">
      {/* Minimal Preloading Screen */}
      {isPreloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060C1A]">
          <div className="w-1 h-1 rounded-full bg-white/60 mb-6 animate-ping" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
            initializing
          </span>
        </div>
      )}


      {/* Tall Spacer Setting Native Scroll Length (Single Source of Truth) */}
      <div style={{ height: `${spacerHeightVh}vh` }} className="relative w-full">
        {/* Sticky Fullscreen Canvas Viewport */}
        <div
          className={`sticky top-0 left-0 w-full h-screen overflow-hidden transition-opacity duration-700 ${
            hasLanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="w-full h-full block"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Wordmark (top-left) + Skip (top-right) */}
          <header className="fixed top-6 left-6 right-6 sm:top-7 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-auto select-none">
            <span
              className="font-mono text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "rgba(255,255,255,0.35)", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              aditya diundi
            </span>
            <button
              onClick={() => setHasLanded(true)}
              className="font-mono text-[10px] tracking-widest uppercase transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.35)", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              skip →
            </button>
          </header>

          {/* Top Timeline Gauge */}
          <TimelineGauge
            stations={stations}
            activeStationIndex={activeStationIndex}
            rawProgress={tickerState.rawProgress}
            onSelectStation={scrollToStation}
          />

          {/* Station Caption — bottom left, no card */}
          <MinimalCaption
            station={currentStation}
            stationIndex={activeStationIndex}
            totalStations={stations.length}
            isSettled={tickerState.isSettled}
          />

          {/* Year Rail — right edge */}
          <MinimalRail
            stations={stations}
            activeStationIndex={activeStationIndex}
            onSelectStation={scrollToStation}
          />

          {/* 3D Viewport Controls HUD */}
          <ViewportHud
            state={viewportState}
            onToggleInspect={() => controlsRef.current?.toggleInspectMode()}
            onResetCamera={() => controlsRef.current?.resetCamera()}
            onZoomIn={() => controlsRef.current?.zoomIn()}
            onZoomOut={() => controlsRef.current?.zoomOut()}
          />

          {/* Scroll hint — bottom center, one-time */}
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-700 ${
              showScrollHint ? "opacity-60" : "opacity-0"
            }`}
          >
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.6)", textShadow: "0 1px 8px rgba(0,0,0,0.95)" }}
            >
              scroll ↓
            </span>
          </div>

          {/* Debug Tuning Panel */}
          {isDebug && (
            <TuningPanel
              config={config}
              tickerState={tickerState}
              onUpdateConfig={handleUpdateConfig}
              onRunBenchmark={handleRunBenchmark}
            />
          )}
        </div>
      </div>

      {/* Seamless AdityaOS Desktop Mount on Arrival */}
      {hasLanded && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-500 bg-[#FAF7F2] dark:bg-[#0E1015]">
          <AdityaOSDesktop initialViewMode="os" defaultApp={defaultAppOnLanding} />
        </div>
      )}
    </div>
  );
}
