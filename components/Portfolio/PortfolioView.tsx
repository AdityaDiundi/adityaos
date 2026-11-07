"use client";

import React, { useRef } from "react";
import { PortfolioNavbar } from "./PortfolioNavbar";
import { PortfolioHero } from "./PortfolioHero";
import { BreakTheGridShowcase } from "./BreakTheGridShowcase";
import { EssaysSection } from "./EssaysSection";
import { ResumeSection } from "./ResumeSection";
import { PortfolioFooter } from "./PortfolioFooter";
import { Terminal } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioViewProps {
  onLaunchOS: () => void;
}

export function PortfolioView({ onLaunchOS }: PortfolioViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme } = useThemeStore();

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-x-hidden transition-colors duration-300"
      style={{
        backgroundColor: activeTheme.desktopBg,
        color: activeTheme.textPrimary,
      }}
    >
      {/* Top Floating Glass Dock with Theme Switcher */}
      <PortfolioNavbar
        onLaunchOS={onLaunchOS}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Sections */}
      <main>
        <PortfolioHero
          onExploreWork={() => handleNavigateSection("work")}
          onLaunchOS={onLaunchOS}
        />

        {/* Break The Grid Showcase: 2 Flagships + Asymmetric Bento Grid */}
        <BreakTheGridShowcase />

        <EssaysSection />

        <ResumeSection />
      </main>

      {/* Footer */}
      <PortfolioFooter onLaunchOS={onLaunchOS} />

      {/* Floating Mode Switcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onLaunchOS}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-mono shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          style={{
            backgroundColor: activeTheme.isDark ? "rgba(14, 18, 25, 0.92)" : "rgba(255, 255, 255, 0.92)",
            borderColor: activeTheme.cardBorder,
            color: activeTheme.textPrimary,
          }}
          title="Switch to adityaos interactive desktop sandbox"
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeTheme.accent }} />
          <Terminal className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" style={{ color: activeTheme.accent }} />
          <span className="hidden sm:inline">Launch</span>
          <span className="font-semibold">adityaos</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
              color: activeTheme.textMuted,
            }}
          >
            TWM
          </span>
        </button>
      </div>
    </div>
  );
}
