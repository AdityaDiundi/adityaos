"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BIO } from "@/config/bio";
import {
  calculateTimeOnEarth,
  formatAriaDescription,
  formatPoliteLiveText,
  TimeOnEarthBreakdown,
} from "@/lib/timeOnEarth";
import { OdometerText } from "./OdometerDigit";
import { useThemeStore } from "@/store/themeStore";
import { Sparkles, Calendar, Grid3X3, Clock, X } from "lucide-react";

export type DisplayFormat = "ymdhms" | "days" | "decimal" | "birthday";

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
  const [format, setFormat] = useState<DisplayFormat>("ymdhms");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [politeText, setPoliteText] = useState<string>("");
  const [showLifeInWeeks, setShowLifeInWeeks] = useState<boolean>(false);
  const [hasCelebratedBirthday, setHasCelebratedBirthday] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPoliteMinuteRef = useRef<number>(-1);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Update loop: computes from Date.now() - BIO.dobTimestamp, pauses when document.hidden
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const tick = () => {
      if (document.hidden) return;
      const now = Date.now();
      const b = calculateTimeOnEarth(now, BIO.dobTimestamp);
      setBreakdown(b);

      // Low-frequency polite live region: update at most once per minute
      const currentMinute = Math.floor(now / 60000);
      if (currentMinute !== lastPoliteMinuteRef.current) {
        lastPoliteMinuteRef.current = currentMinute;
        setPoliteText(formatPoliteLiveText(b));
      }
    };

    tick();
    timerId = setInterval(tick, 1000);

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
  }, []);

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
        p.vy += 0.08; // subtle gravity
        p.life += 1;
        p.alpha = Math.max(0, 1 - p.life / 70);

        if (p.alpha > 0) {
          alive = true;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          // Crisp pixel rects matching Pixel Studio style
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

  // Cycle display formats on tap / click
  const cycleFormat = () => {
    setFormat((prev) => {
      switch (prev) {
        case "ymdhms":
          return "days";
        case "days":
          return "decimal";
        case "decimal":
          return "birthday";
        case "birthday":
        default:
          return "ymdhms";
      }
    });
  };

  // Formatter for primary line
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const timeString = `${pad2(breakdown.hours)}:${pad2(breakdown.minutes)}:${pad2(breakdown.seconds)}`;

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

      {/* Main Interactive Widget Pill */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={cycleFormat}
          title="Click to cycle display format (Y/M/D/h/m/s · Total Days · Decimal Years · Next Birthday)"
          className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: activeTheme.isDark ? "rgba(24, 24, 27, 0.85)" : "rgba(255, 255, 255, 0.88)",
            borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)",
            color: activeTheme.textPrimary,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Status Indicator / Icon */}
          {breakdown.isBirthday ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Day 1 of year {breakdown.years}</span>
            </span>
          ) : (
            <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 group-hover:text-emerald-500 transition-colors" />
          )}

          {/* Dynamic Value per Format */}
          <div className="font-mono text-xs sm:text-[13px] tracking-tight tabular-nums flex items-center font-medium">
            {format === "ymdhms" && (
              <span className="flex items-center gap-1.5">
                <span className="flex items-center">
                  <OdometerText text={breakdown.years.toString()} reducedMotion={reducedMotion} />
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 ml-0.5 mr-1 font-semibold">Y</span>
                  <OdometerText text={pad2(breakdown.months)} reducedMotion={reducedMotion} />
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 ml-0.5 mr-1 font-semibold">M</span>
                  <OdometerText text={pad2(breakdown.days)} reducedMotion={reducedMotion} />
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 ml-0.5 mr-1 font-semibold">D</span>
                </span>
                <span className="text-stone-300 dark:text-zinc-600">·</span>
                <span className="flex items-center">
                  <OdometerText text={timeString} reducedMotion={reducedMotion} />
                </span>
              </span>
            )}

            {format === "days" && (
              <span className="flex items-center gap-1.5">
                <OdometerText
                  text={breakdown.totalDays.toLocaleString("en-US")}
                  reducedMotion={reducedMotion}
                />
                <span className="text-[10px] tracking-widest text-stone-400 dark:text-zinc-500 font-semibold uppercase">
                  DAYS ON EARTH
                </span>
              </span>
            )}

            {format === "decimal" && (
              <span className="flex items-center gap-1.5">
                <OdometerText text={breakdown.decimalYears} reducedMotion={reducedMotion} />
                <span className="text-[10px] tracking-widest text-stone-400 dark:text-zinc-500 font-semibold uppercase">
                  YEARS
                </span>
              </span>
            )}

            {format === "birthday" && (
              <span className="flex items-center gap-1.5">
                {breakdown.isBirthday ? (
                  <span className="text-amber-500 font-bold uppercase tracking-wider text-xs">
                    CELEBRATING BIRTHDAY TODAY
                  </span>
                ) : (
                  <>
                    <span className="text-[10px] tracking-wider text-stone-400 dark:text-zinc-500 font-semibold uppercase">
                      NEXT BIRTHDAY IN
                    </span>
                    <OdometerText text={breakdown.daysToNextBirthday.toString()} reducedMotion={reducedMotion} />
                    <span className="text-[10px] tracking-wider text-stone-400 dark:text-zinc-500 font-semibold uppercase">
                      DAYS
                    </span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Quiet format helper legend */}
          <span className="text-[10px] font-mono text-stone-400 dark:text-zinc-500 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
            ⇄
          </span>
        </button>

        {/* Quiet Subline: Anchor + Life-in-weeks button */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 dark:text-zinc-500">
          <span>SINCE 29 NOV 1997</span>
          <span>·</span>
          <span>JAIPUR, IST</span>
          <span>·</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLifeInWeeks((prev) => !prev);
            }}
            className="hover:text-stone-700 dark:hover:text-zinc-300 underline underline-offset-2 cursor-pointer transition-colors"
          >
            {showLifeInWeeks ? "hide grid" : "life in weeks"}
          </button>
        </div>
      </div>

      {/* Stretch: "Life in Weeks" Pixel Grid (52 cols x 80 rows) */}
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
