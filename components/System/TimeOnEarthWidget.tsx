"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BIO } from "@/config/bio";
import {
  calculateTimeOnEarth,
  formatAriaDescription,
  formatPoliteLiveText,
  TimeOnEarthBreakdown,
} from "@/lib/timeOnEarth";
import { useThemeStore } from "@/store/themeStore";
import { Grid3X3, X } from "lucide-react";

export type AgeUnit = "years" | "days" | "hours" | "seconds";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export function TimeOnEarthWidget() {
  const { activeTheme } = useThemeStore();
  const [breakdown, setBreakdown] = useState<TimeOnEarthBreakdown>(() =>
    calculateTimeOnEarth(Date.now(), BIO.dobTimestamp)
  );
  const [unit, setUnit] = useState<AgeUnit>("days");
  const [politeText, setPoliteText] = useState<string>("");
  const [isHoveringAge, setIsHoveringAge] = useState<boolean>(false);
  const [showLifeInWeeks, setShowLifeInWeeks] = useState<boolean>(false);
  const [hasCelebratedBirthday, setHasCelebratedBirthday] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPoliteMinuteRef = useRef<number>(-1);

  // Restore chosen unit from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aditya_os_age_unit");
      if (saved && ["years", "days", "hours", "seconds"].includes(saved)) {
        setUnit(saved as AgeUnit);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Update loop: computes from Date.now() - BIO.dobTimestamp, pauses when document.hidden
  // If unit is seconds, updates every 1s. For calm units (years, days, hours), updates every 60s
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const tick = () => {
      if (document.hidden) return;
      const now = Date.now();
      const b = calculateTimeOnEarth(now, BIO.dobTimestamp);
      setBreakdown(b);

      const currentMinute = Math.floor(now / 60000);
      if (currentMinute !== lastPoliteMinuteRef.current) {
        lastPoliteMinuteRef.current = currentMinute;
        setPoliteText(formatPoliteLiveText(b));
      }
    };

    tick();
    const intervalMs = unit === "seconds" ? 1000 : 60000;
    timerId = setInterval(tick, intervalMs);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (timerId) clearInterval(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [unit]);

  // Birthday pixel-burst celebration: once per session on 29 Nov (IST)
  const triggerBirthdayCelebration = useCallback(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 120;

    const palette = ["#D97706", "#2563EB", "#059669", "#DC2626", "#7C3AED", "#E11D48"];
    const particles: Particle[] = [];

    for (let i = 0; i < 48; i++) {
      const angle = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: Math.random() > 0.5 ? 3 : 2,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1.0,
        life: 0,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / 70);

        if (p.alpha > 0) {
          alive = true;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      });

      if (alive) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }, []);

  useEffect(() => {
    if (breakdown.isBirthday && !hasCelebratedBirthday) {
      const key = "aditya_os_bday_celebrated";
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        setHasCelebratedBirthday(true);
        triggerBirthdayCelebration();
      }
    }
  }, [breakdown.isBirthday, hasCelebratedBirthday, triggerBirthdayCelebration]);

  // Cycle age unit on click: years -> days -> hours -> seconds
  const cycleUnit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOrder: Record<AgeUnit, AgeUnit> = {
      years: "days",
      days: "hours",
      hours: "seconds",
      seconds: "years",
    };
    const nextUnit = nextOrder[unit];
    setUnit(nextUnit);
    try {
      localStorage.setItem("aditya_os_age_unit", nextUnit);
    } catch {
      // Ignore storage errors
    }
  };

  // Compute text according to active unit
  const elapsedMs = Math.max(0, Date.now() - BIO.dobTimestamp);
  let ageFormattedText = "";
  if (unit === "years") {
    const yVal = (elapsedMs / (365.2425 * 24 * 60 * 60 * 1000)).toFixed(2);
    ageFormattedText = `${yVal} years on earth`;
  } else if (unit === "days") {
    const dVal = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)).toLocaleString("en-US");
    ageFormattedText = `${dVal} days on earth`;
  } else if (unit === "hours") {
    const hVal = Math.floor(elapsedMs / (60 * 60 * 1000)).toLocaleString("en-US");
    ageFormattedText = `${hVal} hours on earth`;
  } else {
    const sVal = Math.floor(elapsedMs / 1000).toLocaleString("en-US");
    ageFormattedText = `${sVal} seconds on earth`;
  }

  // Draw micro 52x80 dot-grid preview when hovering age
  useEffect(() => {
    if (!isHoveringAge || !miniCanvasRef.current) return;
    const canvas = miniCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = 52;
    const rows = 80;
    const dotWidth = 2;
    const dotHeight = 2;
    const pitchX = 3;
    const pitchY = 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const livedColor = activeTheme.isDark ? "#e4e4e7" : "#18181b";
    const currentColor = "#10b981";
    const aheadColor = activeTheme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = c * pitchX + 1;
        const y = r * pitchY + 1;
        if (idx < breakdown.totalWeeks) {
          ctx.fillStyle = livedColor;
        } else if (idx === breakdown.totalWeeks) {
          ctx.fillStyle = currentColor;
        } else {
          ctx.fillStyle = aheadColor;
        }
        ctx.fillRect(x, y, dotWidth, dotHeight);
      }
    }
  }, [isHoveringAge, breakdown.totalWeeks, activeTheme.isDark]);

  return (
    <section
      aria-label={formatAriaDescription(breakdown)}
      className="relative flex flex-col items-center justify-center select-none"
    >
      {/* Polite live region for screen readers, throttled to 1/min */}
      <div aria-live="polite" className="sr-only">
        {politeText}
      </div>

      {/* Birthday celebration canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-20 w-[300px] h-[120px]"
      />

      {/* Main Interactive Age Block (No border pills, no clock icons at rest) */}
      <div
        className="relative flex flex-col items-center pointer-events-auto"
        onMouseEnter={() => setIsHoveringAge(true)}
        onMouseLeave={() => setIsHoveringAge(false)}
      >
        {/* Calm Unit-Switchable Age Button */}
        <button
          type="button"
          onClick={cycleUnit}
          title="Click to cycle units: years · days · hours · seconds"
          className="font-mono text-xs sm:text-[13px] tracking-tight text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 transition-colors cursor-pointer select-none bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 rounded"
        >
          {ageFormattedText}
        </button>

        {/* Micro 52x80 Dot-Grid Popover Preview on Hover */}
        {isHoveringAge && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowLifeInWeeks(true);
            }}
            role="button"
            tabIndex={0}
            title="Click to open full life-in-weeks view"
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-30 p-3 rounded-xl border shadow-xl cursor-pointer transition-all animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: activeTheme.windowBg,
              borderColor: activeTheme.windowBorder,
              color: activeTheme.textPrimary,
            }}
          >
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono mb-2 pb-1.5 border-b border-black/10 dark:border-white/10">
              <span className="font-semibold uppercase tracking-wider">
                {breakdown.totalWeeks.toLocaleString()} WEEKS
              </span>
              <span className="text-[9px] text-stone-400 dark:text-zinc-500">
                CLICK TO EXPAND
              </span>
            </div>

            {/* 52 cols x 80 rows dot canvas */}
            <canvas
              ref={miniCanvasRef}
              width={158}
              height={242}
              className="w-[158px] h-[242px] mx-auto block"
            />

            <div className="text-[9px] font-mono text-stone-400 dark:text-zinc-500 text-center mt-2">
              52 weeks/row · 80-year horizon
            </div>
          </div>
        )}

        {/* Secondary Subline: since 29 Nov 1997 with subtle Jaipur hover reveal */}
        <div className="mt-1 flex items-center justify-center text-[11px] font-mono text-stone-400 dark:text-zinc-500 select-none group cursor-default transition-colors hover:text-stone-600 dark:hover:text-zinc-300">
          <span>since 29 Nov 1997</span>
          <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[80px] group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap">
            <span className="mx-1 opacity-50">·</span>Jaipur
          </span>
        </div>
      </div>

      {/* Full "Life in Weeks" Pixel Grid Modal (52 cols x 80 rows) */}
      {showLifeInWeeks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
          onClick={() => setShowLifeInWeeks(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto p-5 sm:p-6 rounded-2xl border shadow-2xl font-mono text-xs"
            style={{
              backgroundColor: activeTheme.windowBg,
              borderColor: activeTheme.windowBorder,
              color: activeTheme.textPrimary,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold tracking-tight text-sm">LIFE IN WEEKS (52 × 80)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLifeInWeeks(false)}
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Subtitle */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400 mb-3">
              <span>{breakdown.totalWeeks.toLocaleString()} weeks lived</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-[1px] bg-stone-800 dark:bg-zinc-200 inline-block" />
                  <span>lived</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-[1px] bg-emerald-500 animate-pulse inline-block" />
                  <span>current</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-[1px] border border-black/20 dark:border-white/20 inline-block" />
                  <span>ahead</span>
                </span>
              </div>
            </div>

            {/* Pixel Grid Canvas / Cells */}
            <div className="w-full flex justify-center py-2">
              <div
                className="grid gap-[2px] p-2 rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]"
                style={{
                  gridTemplateColumns: "repeat(52, minmax(0, 1fr))",
                  width: "100%",
                  maxWidth: "520px",
                }}
              >
                {Array.from({ length: 80 * 52 }).map((_, idx) => {
                  const isLived = idx < breakdown.totalWeeks;
                  const isCurrent = idx === breakdown.totalWeeks;
                  return (
                    <div
                      key={idx}
                      title={`Week ${idx + 1} (Year ${Math.floor(idx / 52) + 1})`}
                      className={`aspect-square rounded-[0.5px] transition-colors ${
                        isCurrent
                          ? "bg-emerald-500 animate-pulse ring-1 ring-emerald-400"
                          : isLived
                          ? "bg-stone-800 dark:bg-zinc-300"
                          : "bg-black/[0.06] dark:bg-white/[0.08]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-stone-400 dark:text-zinc-500 text-center mt-3">
              Each row represents one year (52 weeks) · 80 years total horizon
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

