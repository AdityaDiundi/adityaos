"use client";

import React from "react";
import { ArrowDown, FileText, Terminal, MapPin } from "lucide-react";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
  const marqueeItems = [
    "FINTECH PAYMENTS",
    "AI EVALUATION",
    "BEHAVIORAL RETENTION",
    "ENTERPRISE B2B",
    "IIIT DELHI (B.TECH ECE)",
    "INDIA FELLOW FIELDWORK",
    "SYSTEMS DESIGN",
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative">
        <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-600 select-none z-20">+</span>
        <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-600 select-none z-20">+</span>

        {/* Hero Body */}
        <div className="px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-12 sm:pb-16 space-y-8">
          {/* Subtle Location & Status Tag */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Delhi, India</span>
            <span className="text-zinc-600">·</span>
            <span>Available for Full-Time & Consulting Roles</span>
          </div>

          {/* Clean, Massive Typographic Headline */}
          <div className="space-y-5 max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-sans font-semibold tracking-[-0.04em] leading-[1.02] text-zinc-100">
              Designing software systems, fintech payments, and AI evaluation tools.
            </h1>

            <p className="text-base sm:text-xl text-zinc-400 font-sans leading-relaxed max-w-3xl">
              I am <span className="text-white font-medium">Aditya Diundi</span>. I bring together engineering depth from IIIT Delhi, grassroots field ethnography, and high-density product craft to turn complex constraints into straightforward, tactile software.
            </p>
          </div>

          {/* Minimal Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={onExploreWork}
              className="px-5 py-3 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <span>Selected Works</span>
              <ArrowDown className="w-3.5 h-3.5 text-zinc-950" strokeWidth={2} />
            </button>

            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span>Resume (PDF)</span>
            </a>

            <button
              onClick={onLaunchOS}
              className="px-4 py-3 rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
              <span>Launch adityaos</span>
            </button>
          </div>
        </div>

        {/* 4-Cell Stats Bar Snapped into Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-zinc-800 divide-x divide-y md:divide-y-0 divide-zinc-800 bg-zinc-950/40 font-mono">
          <div className="p-6 space-y-1">
            <div className="text-[11px] text-zinc-500">EXPERIENCE</div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3+ Years</div>
            <div className="text-xs text-zinc-400 font-sans">Product & Systems Design</div>
          </div>

          <div className="p-6 space-y-1">
            <div className="text-[11px] text-zinc-500">SCALE</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight">100K+ DAU</div>
            <div className="text-xs text-zinc-400 font-sans">Claims & Benefits (MFine)</div>
          </div>

          <div className="p-6 space-y-1">
            <div className="text-[11px] text-zinc-500">AI BENCHMARK</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">120+ Evals</div>
            <div className="text-xs text-zinc-400 font-sans">Public Health (JANEVAL)</div>
          </div>

          <div className="p-6 space-y-1">
            <div className="text-[11px] text-zinc-500">CONVERSION</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">+12% Lift</div>
            <div className="text-xs text-zinc-400 font-sans">Habit Engine (Mosaic)</div>
          </div>
        </div>

        {/* Clean Marquee Ribbon */}
        <div className="w-full overflow-hidden border-t border-b border-zinc-800 py-3 bg-black/40">
          <div className="flex w-max animate-marquee space-x-8 font-mono text-xs tracking-widest uppercase text-zinc-400">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-8">
                <span>{item}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
