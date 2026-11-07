"use client";

import React, { useState, useRef } from "react";
import { PortfolioSidebar } from "./PortfolioSidebar";
import { BreakTheGridShowcase } from "./BreakTheGridShowcase";
import { EssaysSection } from "./EssaysSection";
import { YouTubeSection } from "./YouTubeSection";
import { ResumeSection } from "./ResumeSection";
import { PortfolioFooter } from "./PortfolioFooter";
import { useThemeStore } from "@/store/themeStore";
import { Terminal } from "lucide-react";

interface PortfolioViewProps {
  onLaunchOS: () => void;
}

export function PortfolioView({ onLaunchOS }: PortfolioViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme } = useThemeStore();

  const handleSelectFilter = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(filterId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-x-clip transition-colors duration-300"
      style={{
        backgroundColor: activeTheme.desktopBg,
        color: activeTheme.textPrimary,
      }}
    >
      {/* Outer Continuous Grid Frame */}
      <div className="max-w-[1520px] mx-auto border-x border-zinc-800 min-h-screen flex flex-col lg:flex-row relative">
        {/* Left Sticky Navigation & Identity Column */}
        <PortfolioSidebar
          activeFilter={activeFilter}
          onSelectFilter={handleSelectFilter}
          onLaunchOS={onLaunchOS}
        />

        {/* Right Scrollable Feed Column */}
        <main className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Quick Stats Ledger Strip Snapped to Top of Feed */}
            <div className="border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-zinc-800 bg-zinc-950/60 font-mono text-xs">
              <div className="p-4 sm:p-5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase">Experience</span>
                <div className="text-xl font-bold text-white tracking-tight">3+ Years</div>
                <div className="text-[11px] text-zinc-400 font-sans">Product & Systems</div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase">Scale</span>
                <div className="text-xl font-bold text-indigo-400 tracking-tight">100K+ DAU</div>
                <div className="text-[11px] text-zinc-400 font-sans">Claims UX (MFine)</div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase">AI Benchmark</span>
                <div className="text-xl font-bold text-emerald-400 tracking-tight">120+ Evals</div>
                <div className="text-[11px] text-zinc-400 font-sans">Health AI (JANEVAL)</div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase">Adherence</span>
                <div className="text-xl font-bold text-amber-400 tracking-tight">+12% Conv</div>
                <div className="text-[11px] text-zinc-400 font-sans">Habit Engine (Mosaic)</div>
              </div>
            </div>

            {/* Filter Mode Badge Notice if filtered */}
            {activeFilter !== "all" && (
              <div className="px-6 sm:px-10 py-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">
                  Filtering section: <strong className="text-white uppercase">{activeFilter}</strong>
                </span>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Show All Sections
                </button>
              </div>
            )}

            {/* Feed Modules */}
            {(activeFilter === "all" || activeFilter === "work") && (
              <BreakTheGridShowcase />
            )}

            {(activeFilter === "all" || activeFilter === "essays") && (
              <EssaysSection />
            )}

            {(activeFilter === "all" || activeFilter === "youtube") && (
              <YouTubeSection />
            )}

            {(activeFilter === "all" || activeFilter === "resume") && (
              <ResumeSection />
            )}
          </div>

          {/* Feed Footer */}
          <PortfolioFooter onLaunchOS={onLaunchOS} />
        </main>
      </div>

      {/* Floating Mode Switcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button
          onClick={onLaunchOS}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-950/90 hover:bg-zinc-900 text-xs font-mono shadow-2xl transition-all cursor-pointer backdrop-blur-md"
          title="Switch to adityaos interactive desktop sandbox"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Launch adityaos</span>
        </button>
      </div>
    </div>
  );
}
