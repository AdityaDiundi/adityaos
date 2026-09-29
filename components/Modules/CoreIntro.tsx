"use client";

import React from "react";
import {
  Sparkles,
  Cpu,
  Activity,
  ShieldCheck,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Bot,
  Brain,
  MessageSquare,
  Compass,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";

export const CoreIntro: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { restoreWindow, focusWindow, toggleStickyNote } = useOSStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const stats = [
    {
      value: "Delhi, India",
      label: "Current Base",
      sub: "Open for Opportunities",
      accent: "text-amber-400",
    },
    {
      value: "IIIT Delhi",
      label: "B.Tech in ECE",
      sub: "2015 – 2021",
      accent: "text-cyan-400",
    },
    {
      value: "100K+ DAU",
      label: "Products Shipped",
      sub: "MFine & Mosaic Wellness",
      accent: "text-emerald-400",
    },
    {
      value: "India Fellow",
      label: "Grassroots Systems",
      sub: "Rural Leadership & Youth",
      accent: "text-purple-400",
    },
  ];

  const badges = [
    "Product Design (0-to-1)",
    "Agentic AI Development",
    "Google Antigravity & LLM Tools",
    "Systems Thinking",
    "Figma & Design Systems",
    "Next.js / TypeScript",
    "Canvas 2D / Voxel Engine",
    "User Research & Wireframing",
    "Bilingual Storytelling & Hindi Poetry",
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
      className="p-5 md:p-7 flex flex-col justify-between h-full font-mono text-xs overflow-y-auto selection:bg-cyan-500/30 space-y-6"
    >
      {/* Telemetry Header Line */}
      <div
        style={{ borderColor: activeTheme.headerBorder }}
        className="flex items-center justify-between pb-3 border-b text-[11px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold" style={{ color: activeTheme.accent }}>
            ADITYA DIUNDI // IDENTITY MODULE
          </span>
        </div>
        <div style={{ color: activeTheme.textMuted }} className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            DELHI, INDIA
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">OPEN FOR OPPORTUNITIES</span>
        </div>
      </div>

      {/* Hero Header with Portrait & Core Positioning */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Real Authenticated Field Portrait */}
        <div className="relative group shrink-0 self-center sm:self-start">
          <div
            style={{
              borderColor: activeTheme.accent,
            }}
            className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 shadow-xl relative bg-neutral-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/aditya_portrait.jpg"
              alt="Aditya Diundi Portrait in Field"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[8px] text-white/90 font-mono tracking-tight text-center leading-tight">
              Rural Field Residency
            </div>
          </div>
          <div
            style={{ backgroundColor: activeTheme.accent }}
            className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold text-black shadow-md flex items-center gap-0.5"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI + UX</span>
          </div>
        </div>

        {/* Identity & Overview */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Aditya Diundi
            </h1>
            <span
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.accent,
              }}
              className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border font-semibold flex items-center gap-1"
            >
              <Bot className="w-3 h-3" />
              Agentic AI & Product Design
            </span>
          </div>

          <p className="text-xs leading-relaxed opacity-90">
            Currently based out of <strong>Delhi, India</strong> and actively <strong>open for new high-impact opportunities</strong>. Building my hands-on brain repository for agentic AI applications, multi-agent systems, and full-stack software experiences with Google Antigravity.
          </p>

          {/* Action CTA Bar */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={openResume}
              style={{
                backgroundColor: activeTheme.accent,
                color: activeTheme.isDark ? "#000" : "#fff",
              }}
              className="px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow hover:opacity-90 transition-opacity cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Resume (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickChime(500);
                toggleStickyNote();
              }}
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: "rgba(245, 158, 11, 0.4)",
                color: "#fbbf24",
              }}
              className="px-3 py-1.5 rounded font-semibold text-xs border flex items-center gap-1.5 hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pin Sticky Note</span>
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
        </div>
      </div>

      {/* Design Philosophy Manifesto */}
      <div
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.cardBorder,
        }}
        className="p-4 md:p-5 rounded-lg border space-y-3 leading-relaxed text-xs shadow-sm"
      >
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider" style={{ color: activeTheme.accent }}>
          <Brain className="w-4 h-4" />
          <span>The Human Distinction in the Age of Generative AI</span>
        </div>

        <p className="opacity-90">
          The digital design landscape is changing rapidly. What was earlier deemed an innate, gatekept skill—or vague axioms like having an <em>&ldquo;eye for design&rdquo;</em>—are no longer impassable restrictions. Generative engines and foundational models can now output baseline interfaces with ease.
        </p>

        <p className="opacity-90">
          However, <strong>human distinction and the ability to hold high-dimensional visions in your brain</strong> remains a disciplined craft that must be practiced and polished daily. The ability to conceptualize an entirely novel interaction, harmonize visceral human emotion, and synthesize systems from first principles is precisely what makes you unique—from machines as well as from passive consensus.
        </p>

        <p className="opacity-90">
          I consider myself to possess that distinct vision for software and digital media. I do not just actively consume technology—<strong>I build and ship as much as I can</strong>. My daily practice completely integrates modern agentic workflows, autonomous tooling, and Google Antigravity into my own end-to-end design and engineering pipeline.
        </p>

        <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] text-amber-300/80">
          <Compass className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Ground truth: From agricultural pond linings in rural Rajasthan to 100K+ DAU healthtech flows at MFine.</span>
        </div>
      </div>

      {/* Key Benchmarks Cards */}
      <div>
        <div
          style={{ color: activeTheme.textMuted }}
          className="text-[11px] uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5"
        >
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Career Milestones & Foundations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-3 rounded-md border transition-all hover:scale-[1.02]"
            >
              <div className={`text-sm md:text-base font-bold ${stat.accent}`}>
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
          <span>Integrated Stack & Capabilities</span>
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

      {/* Footer System Telemetry */}
      <div
        style={{ borderColor: activeTheme.headerBorder, color: activeTheme.textMuted }}
        className="pt-3 border-t flex items-center justify-between text-[10px] select-none flex-shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>VERIFIED PORTFOLIO // ADITYA DIUNDI</span>
        </div>
        <div>
          DELHI, IN • 2026
        </div>
      </div>
    </div>
  );
};
