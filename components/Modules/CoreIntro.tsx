"use client";

import React from "react";
import { Sparkles, Cpu, Activity, ShieldCheck, ExternalLink, FileText, Globe, GraduationCap } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";

export const CoreIntro: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { restoreWindow, focusWindow } = useOSStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const stats = [
    {
      value: "IIIT Delhi",
      label: "B.Tech in ECE",
      sub: "2015 – 2021",
      accent: "text-onedark-blue",
      border: "hover:border-onedark-blue/50",
    },
    {
      value: "100K+ DAU",
      label: "Products Shipped",
      sub: "MFine & Mosaic Wellness",
      accent: "text-onedark-green",
      border: "hover:border-onedark-green/50",
    },
    {
      value: "India Fellow",
      label: "Social Impact Design",
      sub: "Rural Leadership & Youth",
      accent: "text-onedark-yellow",
      border: "hover:border-onedark-yellow/50",
    },
  ];

  const badges = [
    "Product Design",
    "Systems Thinking",
    "Figma & Design Systems",
    "Next.js / TypeScript",
    "Canvas 2D / Web Audio",
    "User Research & Wireframing",
    "Bilingual Storytelling",
  ];

  const openResume = () => {
    playClickChime(600);
    restoreWindow("resumeViewer");
    focusWindow("resumeViewer");
  };

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="p-5 md:p-7 flex flex-col justify-between h-full font-mono text-xs overflow-y-auto selection:bg-cyan-500/30"
    >
      {/* Telemetry Header Line */}
      <div
        style={{ borderColor: activeTheme.headerBorder }}
        className="flex items-center justify-between pb-3 mb-4 border-b text-[11px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold" style={{ color: activeTheme.accent }}>
            ADITYA DIUNDI // IDENTITY MODULE
          </span>
        </div>
        <div style={{ color: activeTheme.textMuted }} className="flex items-center gap-3 text-[10px]">
          <span>IIIT DELHI</span>
          <span>•</span>
          <span className="text-emerald-400">STATUS: AVAILABLE</span>
        </div>
      </div>

      {/* Main Narrative Area */}
      <div className="space-y-5 flex-1">
        {/* Headline */}
        <div>
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border mb-2 font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            Product Designer & Systems Thinker
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-snug">
            Designing 0-to-1 systems.{" "}
            <span style={{ color: activeTheme.accent }}>Crafting tactile experiences.</span>
          </h1>
        </div>

        {/* Narrative Body */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="p-4 rounded-md border text-xs leading-relaxed opacity-90 space-y-2.5"
        >
          <p>
            I am a <strong>Product Designer</strong> and <strong>Systems Thinker</strong> with 3+ years of experience designing and shipping user-centric digital products across high-growth startups, social impact initiatives, and freelance clients.
          </p>
          <p>
            From designing core patient apps used by <strong>over 100K daily active users at MFine</strong> and driving +12% conversion at <strong>Mosaic Wellness</strong> (ManMatters), to building no-code trackers and authoring youth leadership manuals with <strong>India Fellow</strong>, my directive is to make complex systems feel intuitive, tactile, and deeply human.
          </p>
          <p>
            Beyond pixels, I write bilingual essays and Hindi poetry, bridge product thinking with creative code (Next.js, Canvas, Web Audio DSP), and engineer minimal desktop workflows.
          </p>
        </div>

        {/* Action CTA Bar */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={openResume}
            style={{
              backgroundColor: activeTheme.accent,
              color: activeTheme.isDark ? "#000" : "#fff",
            }}
            className="px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-opacity"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Resume & Credentials</span>
          </button>

          <a
            href="https://adityaos-delta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="px-3 py-1.5 rounded font-semibold text-xs border flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>adityaos-delta.vercel.app</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Key Benchmarks Cards */}
        <div>
          <div
            style={{ color: activeTheme.textMuted }}
            className="text-[11px] uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Career Milestones</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3 rounded-md border transition-all hover:scale-[1.02]"
              >
                <div className={`text-base font-bold ${stat.accent}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold mt-0.5">
                  {stat.label}
                </div>
                <div style={{ color: activeTheme.textMuted }} className="text-[10px] mt-0.5 truncate">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical & Design Competencies */}
        <div>
          <div
            style={{ color: activeTheme.textMuted }}
            className="text-[11px] uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5"
          >
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>Competencies & Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
                className="px-2 py-0.5 rounded text-[10px] border opacity-85 hover:opacity-100 transition-opacity"
              >
                #{badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div
        style={{ borderColor: activeTheme.headerBorder, color: activeTheme.textMuted }}
        className="pt-3 mt-4 border-t flex items-center justify-between text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>VERIFIED PORTFOLIO // ADITYA DIUNDI</span>
        </div>
        <div>
          REV: 2026 // NOCTALIA-TWM
        </div>
      </div>
    </div>
  );
};
