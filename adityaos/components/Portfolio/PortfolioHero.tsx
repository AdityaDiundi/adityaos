"use client";

import React from "react";
import { ArrowDown, FileText, Terminal, MapPin, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
  const { activeTheme } = useThemeStore();

  const marqueeItems = [
    "FINTECH ERROR PREVENTION",
    "AI CULTURAL BENCHMARKING",
    "BEHAVIORAL RETENTION ARCHITECTURE",
    "ENTERPRISE B2B SAAS",
    "IIIT DELHI ALUMNUS",
    "INDIA FELLOW ETHNOGRAPHY",
    "SYSTEMS THINKING",
    "TACTILE INTERACTION DESIGN",
  ];

  return (
    <section className="relative pt-28 md:pt-36 overflow-hidden">
      {/* Outer Continuous Grid Container */}
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative">
        {/* Corner Crosshairs */}
        <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none z-20">+</span>
        <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none z-20">+</span>

        {/* Hero Content Body */}
        <div className="px-6 sm:px-10 lg:px-14 pt-8 pb-16 space-y-10">
          {/* Metadata Track */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span
              className="px-3 py-1 rounded-full border transition-colors flex items-center gap-2"
              style={{
                backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Product Designer & Systems Thinker</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline-block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
              Delhi, India · Immediately Available
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden md:inline-block" />
            <span className="hidden md:inline-block text-zinc-500 font-mono">
              IIIT Delhi (B.Tech ECE) · India Fellow
            </span>
          </div>

          {/* Main Headline & Narrative */}
          <div className="space-y-6 max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sans font-semibold tracking-[-0.04em] leading-[1.02] text-zinc-100">
              Architecting friction-free digital systems, fintech payments, and grounded AI benchmarks.
            </h1>

            <p className="text-base sm:text-xl text-zinc-400 font-sans leading-relaxed max-w-3xl">
              I am <span className="text-white font-medium">Aditya Diundi</span>. I bridge engineering depth, grassroots ethnography, and high-density product craft to turn complex, ambiguous technical constraints into elegant, tactile software.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
            <button
              onClick={onExploreWork}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.18)] active:scale-[0.98]"
            >
              <span>Explore Selected Works</span>
              <ArrowDown className="w-4 h-4 text-zinc-950" strokeWidth={2} />
            </button>

            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-zinc-700 text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
              <span>Resume (PDF)</span>
            </a>

            <button
              onClick={onLaunchOS}
              className="px-4 py-3.5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
              <span>Launch adityaos Shell</span>
            </button>
          </div>
        </div>

        {/* 4-Cell Technical Stats Grid snapped into continuous border containers */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-zinc-800 divide-x divide-y md:divide-y-0 divide-zinc-800 bg-zinc-950/60 font-mono">
          <div className="p-6 sm:p-7 space-y-1">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Domain Practice</div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3+ Years</div>
            <div className="text-xs text-zinc-400 font-sans">Product Design & Systems</div>
          </div>

          <div className="p-6 sm:p-7 space-y-1">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Scale Impact</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight">100K+ DAU</div>
            <div className="text-xs text-zinc-400 font-sans">Claims & Benefits (MFine)</div>
          </div>

          <div className="p-6 sm:p-7 space-y-1">
            <div className="text-xs uppercase tracking-widest text-zinc-500">AI Evaluation</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">120+ Evals</div>
            <div className="text-xs text-zinc-400 font-sans">Public Health (JANEVAL)</div>
          </div>

          <div className="p-6 sm:p-7 space-y-1">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Behavioral Lift</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">+12% Conv</div>
            <div className="text-xs text-zinc-400 font-sans">Habit Engine (Mosaic)</div>
          </div>
        </div>

        {/* Marquee Banner Snapped into Grid Container */}
        <div className="w-full overflow-hidden border-t border-b border-zinc-800 py-3.5 bg-black/40">
          <div className="flex w-max animate-marquee space-x-8 font-mono text-xs tracking-widest uppercase">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-8">
                <span className="text-zinc-400">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
