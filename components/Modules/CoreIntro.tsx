"use client";

import React from "react";
import { Sparkles, Cpu, Activity, ShieldCheck } from "lucide-react";

export const CoreIntro: React.FC = () => {
  const stats = [
    {
      value: "4+ Years",
      label: "Experience",
      sub: "System Architecture & UI",
      accent: "text-onedark-blue",
      border: "hover:border-onedark-blue/50",
    },
    {
      value: "3+ Products",
      label: "Shipped",
      sub: "0-to-1 Production Apps",
      accent: "text-onedark-green",
      border: "hover:border-onedark-green/50",
    },
    {
      value: "2 Design Systems",
      label: "Built",
      sub: "Tokenized & Component-driven",
      accent: "text-onedark-yellow",
      border: "hover:border-onedark-yellow/50",
    },
  ];

  const badges = [
    "TypeScript",
    "React 19 / Next.js",
    "WebGL / HTML5 Canvas",
    "State Machines",
    "Design Engineering",
    "Bilingual Literature",
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-onedark-dark/95 selection:bg-onedark-blue/30">
      {/* Telemetry Header Line */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-onedark-borderMuted text-[11px] text-onedark-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-onedark-green animate-pulse" />
          <span className="font-semibold text-onedark-textBright">IDENTITY MODULE // PERS-01</span>
        </div>
        <div className="flex items-center gap-3">
          <span>HOST: NOCTALIA-ARCH</span>
          <span className="text-onedark-border">•</span>
          <span className="text-onedark-cyan">STATUS: ACTIVE</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Headline */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-onedark-surface border border-onedark-border text-onedark-cyan mb-3">
            <Sparkles className="w-3 h-3 text-onedark-cyan" />
            Core Directive
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-onedark-textBright leading-snug">
            Architecting precise systems.{" "}
            <span className="text-onedark-blue">Crafting tactile stories.</span>
          </h1>
        </div>

        {/* Narrative Body - strictly first-person singular (I, me, my) */}
        <div className="p-4 rounded-md bg-onedark-surface/40 border border-onedark-borderMuted/80 text-sm leading-relaxed text-onedark-text font-mono">
          <p>
            I engineer scalable React architectures and hardware-accelerated canvas interfaces. 
            But beyond the token pipelines, I am a storyteller at heart. Whether I am structuring 
            complex data density for power users or writing bilingual micro-poetry, my core 
            directive remains the same: making the intricate feel intuitive, tactile, and deeply human.
          </p>
        </div>

        {/* Minimalistic Stat Cards */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-onedark-muted mb-2.5 font-semibold flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-onedark-blue" />
            Key Benchmarks
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-md bg-onedark-surface/60 border border-onedark-borderMuted transition-all duration-200 ${stat.border}`}
              >
                <div className={`text-xl font-bold font-mono ${stat.accent}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-onedark-textBright mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[10px] text-onedark-muted mt-1 truncate">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Tags / Capabilities */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-onedark-muted mb-2 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-onedark-purple" />
            Technical Focus
          </div>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-onedark-surface text-[11px] text-onedark-text border border-onedark-border hover:border-onedark-blue/50 hover:text-onedark-blue transition-colors cursor-default"
              >
                #{badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div className="pt-4 mt-6 border-t border-onedark-borderMuted flex items-center justify-between text-[11px] text-onedark-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-onedark-green" />
          <span>VERIFIED SINGLE-AUTHOR IDENTITY</span>
        </div>
        <div className="text-[10px] text-onedark-muted/80">
          SYS_TIME: {new Date().getFullYear()} // REV_2.4
        </div>
      </div>
    </div>
  );
};
