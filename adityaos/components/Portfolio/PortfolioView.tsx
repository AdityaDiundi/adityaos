"use client";

import React, { useRef } from "react";
import { PortfolioNavbar } from "./PortfolioNavbar";
import { PortfolioHero } from "./PortfolioHero";
import { EditorialCaseStudies } from "./EditorialCaseStudies";
import { FieldResearchSection } from "./FieldResearchSection";
import { EssaysSection } from "./EssaysSection";
import { ResumeSection } from "./ResumeSection";
import { PortfolioFooter } from "./PortfolioFooter";
import { Terminal } from "lucide-react";

interface PortfolioViewProps {
  onLaunchOS: () => void;
}

export function PortfolioView({ onLaunchOS }: PortfolioViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#08090C] text-zinc-100 selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden"
    >
      {/* Top Floating Glass Dock */}
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

        <EditorialCaseStudies />

        <FieldResearchSection />

        <EssaysSection />

        <ResumeSection />
      </main>

      {/* Footer */}
      <PortfolioFooter onLaunchOS={onLaunchOS} />

      {/* Floating Mode Switcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onLaunchOS}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0e1219]/90 hover:bg-[#141b26] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs shadow-[0_8px_25px_rgba(0,240,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Switch to adityaos interactive desktop sandbox"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <Terminal className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Launch</span>
          <span className="font-semibold text-white">adityaos</span>
          <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded">TWM</span>
        </button>
      </div>
    </div>
  );
}
