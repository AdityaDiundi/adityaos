"use client";

import React from "react";
import Link from "next/link";
import { JourneyStation } from "@/content/journey";

export interface StoryOverlayProps {
  station: JourneyStation;
  progress: number;
  velocity: number;
  fps?: number;
  isDebug?: boolean;
  onSkipToDesktop: () => void;
  onOpenTarget?: (target: string) => void;
}

export function StoryOverlay({
  station,
  progress,
  velocity,
  fps = 60,
  isDebug = false,
  onSkipToDesktop,
  onOpenTarget,
}: StoryOverlayProps) {
  const dateDisplay = station.dateEnd
    ? `${station.dateStart} — ${station.dateEnd}`
    : station.dateStart;

  const handleOpenClick = (e: React.MouseEvent) => {
    if (station.openTarget) {
      if (onOpenTarget) {
        e.preventDefault();
        onOpenTarget(station.openTarget);
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-12">
      {/* Top Header Navigation */}
      <header className="relative z-40 flex items-center justify-between pointer-events-auto gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/?mode=os"
            className="font-mono text-xs font-semibold tracking-wider text-[#1C1917] dark:text-[#F8FAFC] hover:opacity-75 transition-opacity"
          >
            ADITYA_OS
          </Link>
          <span className="text-[#A8A29E] dark:text-[#64748B] text-xs hidden sm:inline">/</span>
          <span className="font-serif text-xs text-[#78716C] dark:text-[#94A3B8] hidden sm:inline">
            Story
          </span>
        </div>

        {/* Global Skip Controls */}
        <nav aria-label="Skip shortcuts" className="flex items-center gap-2 sm:gap-6 shrink-0">
          <Link
            href="/work"
            className="font-mono text-[11px] sm:text-xs text-[#78716C] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#F8FAFC] underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Work ↗
          </Link>
          <button
            onClick={onSkipToDesktop}
            className="font-mono text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded bg-[#E7E5E4]/80 dark:bg-[#1E293B]/80 hover:bg-[#D6D3D1] dark:hover:bg-[#334155] text-[#1C1917] dark:text-[#F8FAFC] transition-colors border border-[#D6D3D1] dark:border-[#334155] whitespace-nowrap"
          >
            Desktop ↓
          </button>
        </nav>
      </header>

      {/* Main Station Story Text (Real Accessible DOM) */}
      <main
        key={station.id}
        aria-live="polite"
        className="pointer-events-auto max-w-xl my-auto sm:my-0 sm:mb-12 animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <div className="space-y-3 bg-[#FAF7F2]/75 dark:bg-[#0E1015]/75 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-[#E7E5E4]/60 dark:border-[#1E293B]/60 shadow-sm">
          {/* Station Date */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium tracking-widest text-[#78716C] dark:text-[#94A3B8] uppercase">
              {dateDisplay}
            </span>
            {station.placeholder && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
                Placeholder
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1917] dark:text-[#F8FAFC] tracking-tight leading-tight">
            {station.title}
          </h2>

          {/* Story Line */}
          <p className="font-sans text-sm sm:text-base text-[#44403C] dark:text-[#CBD5E1] leading-relaxed">
            {station.line}
          </p>

          {/* Outcome / Metric */}
          {station.outcome && (
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8]" />
              <span className="font-mono text-xs font-medium text-[#0284C7] dark:text-[#38BDF8]">
                {station.outcome}
              </span>
            </div>
          )}

          {/* Quiet Open Link */}
          {station.openTarget && (
            <div className="pt-2">
              <a
                href={
                  station.openTarget.startsWith("http")
                    ? station.openTarget
                    : `/work#${station.openTarget}`
                }
                onClick={handleOpenClick}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#1C1917] dark:text-[#F8FAFC] hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors"
              >
                <span>explore project</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="flex items-center justify-between text-[#A8A29E] dark:text-[#64748B] font-mono text-xs pointer-events-auto">
        <div className="flex items-center gap-2">
          <span>↓ Scroll to traverse</span>
          <span className="hidden sm:inline">· Space / Arrows to step</span>
        </div>
        <div className="text-right">
          <span>{station.id.toUpperCase()}</span>
        </div>
      </footer>

      {/* Optional Debug HUD when ?debug=1 is enabled */}
      {isDebug && (
        <aside
          aria-label="Debug Telemetry"
          className="fixed bottom-4 left-4 z-50 bg-black/90 text-green-400 font-mono text-[11px] p-3 rounded border border-green-500/30 space-y-1 pointer-events-auto shadow-lg"
        >
          <div className="font-bold text-white border-b border-zinc-700 pb-1 mb-1">
            STORY DEBUG HUD
          </div>
          <div>Progress: {(progress * 100).toFixed(1)}%</div>
          <div>Velocity: {velocity.toFixed(5)}</div>
          <div>FPS: {Math.round(fps)}</div>
          <div>Station: {station.id} ({station.year})</div>
          <div>Preset: {station.cameraPreset}</div>
        </aside>
      )}
    </div>
  );
}
