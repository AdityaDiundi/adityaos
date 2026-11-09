"use client";

import React, { useState, useRef, useEffect } from "react";
import { PortfolioSidebar } from "./PortfolioSidebar";
import { BreakTheGridShowcase } from "./BreakTheGridShowcase";
import { EssaysSection } from "./EssaysSection";
import { YouTubeSection } from "./YouTubeSection";
import { ResumeSection } from "./ResumeSection";
import { PortfolioFooter } from "./PortfolioFooter";
import { useThemeStore, OSThemeId, OS_THEMES } from "@/store/themeStore";
import { Terminal } from "lucide-react";

interface PortfolioViewProps {
  onLaunchOS: () => void;
}

export function PortfolioView({ onLaunchOS }: PortfolioViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme, setTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme");
      if (themeParam === "light" || themeParam === "editorial") {
        setTheme("light");
      } else if (themeParam && OS_THEMES[themeParam as OSThemeId]) {
        setTheme(themeParam as OSThemeId);
      }
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = activeTheme.desktopBg;
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = activeTheme.desktopBg;
      }
    }
  }, [isDark, activeTheme.desktopBg]);

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
      className="min-h-screen w-full relative transition-colors duration-300"
      style={{
        backgroundColor: activeTheme.desktopBg,
        color: activeTheme.textPrimary,
      }}
    >
      {/* Outer Continuous Grid Frame */}
      <div
        className={`max-w-[1520px] mx-auto border-x border-dashed min-h-screen flex flex-col lg:flex-row relative transition-colors ${
          isDark ? "border-zinc-800/80" : "border-stone-200/80"
        }`}
      >
        {/* Left Sticky Navigation & Identity Column */}
        <PortfolioSidebar
          activeFilter={activeFilter}
          onSelectFilter={handleSelectFilter}
          onLaunchOS={onLaunchOS}
        />

        {/* Right Scrollable Feed Column */}
        <main
          className="flex-1 min-w-0 flex flex-col justify-between relative"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(circle, rgba(255, 255, 255, 0.035) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div>
            {/* Quick Stats Ledger Strip Snapped to Top of Feed */}
            <div
              className={`border-b border-dashed grid grid-cols-2 sm:grid-cols-4 divide-x divide-dashed divide-y sm:divide-y-0 font-mono text-xs transition-colors ${
                isDark
                  ? "border-zinc-800/80 divide-zinc-800/80 bg-[#0c0e14]/60"
                  : "border-stone-200/80 divide-stone-200/80 bg-white/90"
              }`}
            >
              <div className="p-4 sm:p-5 space-y-0.5">
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Experience
                </span>
                <div
                  className={`text-lg font-semibold tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  3+ Years
                </div>
                <div
                  className={`text-[11px] font-sans ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Product & Systems
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Scale
                </span>
                <div className="text-lg font-semibold text-indigo-400 tracking-tight">
                  100K+ DAU
                </div>
                <div
                  className={`text-[11px] font-sans ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Claims UX (MFine)
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  AI Benchmark
                </span>
                <div className="text-lg font-semibold text-emerald-500 tracking-tight">
                  3.4x Lift
                </div>
                <div
                  className={`text-[11px] font-sans ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Health AI (JANEVAL)
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-0.5">
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Adherence
                </span>
                <div className="text-lg font-semibold text-amber-500 tracking-tight">
                  +12% Conv
                </div>
                <div
                  className={`text-[11px] font-sans ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Habit Engine (Mosaic)
                </div>
              </div>
            </div>

            {/* Filter Mode Badge Notice if filtered */}
            {activeFilter !== "all" && (
              <div
                className={`px-6 sm:px-10 py-3 border-b flex items-center justify-between text-xs font-mono transition-colors ${
                  isDark
                    ? "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                    : "bg-stone-100 border-stone-200 text-stone-700"
                }`}
              >
                <span>
                  Filtering section:{" "}
                  <strong className={isDark ? "text-white" : "text-stone-900"}>
                    {activeFilter.toUpperCase()}
                  </strong>
                </span>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="text-cyan-500 hover:underline cursor-pointer"
                >
                  Show All Sections
                </button>
              </div>
            )}

            {/* Feed Modules */}
            {(activeFilter === "all" || activeFilter === "work") && (
              <BreakTheGridShowcase onLaunchOS={onLaunchOS} />
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
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-mono shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
            isDark
              ? "border-zinc-800 bg-[#090b10]/90 hover:bg-zinc-900 text-zinc-300"
              : "border-stone-200 bg-white/90 hover:bg-stone-50 text-stone-800"
          }`}
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
