"use client";

import React, { useState } from "react";
import {
  Download,
  Printer,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code,
  Layers,
  Sparkles,
  FileText,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

export const ResumeViewer: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote } = useSoundStore();
  const [activeTab, setActiveTab] = useState<"visual" | "markdown">("visual");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full font-mono text-xs select-text overflow-hidden"
    >
      {/* Top Action Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-9 border-b px-3 flex items-center justify-between flex-shrink-0 select-none"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
          <span className="font-bold text-[11px]">ADITYA_DIUNDI_RESUME.pdf</span>
          <span className="text-[10px] opacity-60">// 2026 Edition</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View Mode Toggle */}
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="flex items-center rounded border p-0.5 text-[10px]"
          >
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              style={{
                backgroundColor: activeTab === "visual" ? activeTheme.accent : "transparent",
                color:
                  activeTab === "visual"
                    ? activeTheme.isDark
                      ? "#000"
                      : "#fff"
                    : activeTheme.textMuted,
              }}
              className="px-2 py-0.5 rounded font-semibold transition-colors"
            >
              Formatted
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("markdown")}
              style={{
                backgroundColor: activeTab === "markdown" ? activeTheme.accent : "transparent",
                color:
                  activeTab === "markdown"
                    ? activeTheme.isDark
                      ? "#000"
                      : "#fff"
                    : activeTheme.textMuted,
              }}
              className="px-2 py-0.5 rounded font-semibold transition-colors"
            >
              RAW .MD
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            title="Print or Save PDF"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-semibold hover:opacity-80 transition-opacity"
          >
            <Printer className="w-3 h-3" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {activeTab === "visual" ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header / Identity */}
            <div
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-5 rounded-lg border shadow-sm relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: activeTheme.accent }}>
                    Aditya Diundi
                  </h1>
                  <p className="text-xs font-medium opacity-80 mt-0.5">
                    Design Engineer & System Architect // Tactile Software & Creative Computing
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-1.5 text-[11px] opacity-75">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" style={{ color: activeTheme.accent }} />
                    <span>India (Global Remote)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3" style={{ color: activeTheme.accent }} />
                    <a
                      href="https://github.com/AdityaDiundi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5"
                    >
                      github.com/AdityaDiundi <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-red-400" />
                    <a
                      href="https://youtube.com/@falsepeek"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5"
                    >
                      youtube.com/@falsepeek <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Competencies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2" style={{ color: activeTheme.accent }}>
                  <Code className="w-3.5 h-3.5" />
                  <span>CORE ENGINEERING</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• TypeScript / Next.js / React</div>
                  <div>• Canvas 2D / WebGL / Voxel Math</div>
                  <div>• Web Audio API & Synth DSP</div>
                  <div>• State Systems (Zustand, Redux)</div>
                  <div>• Node.js / Deno / REST / Firebase</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DESIGN & CRAFT</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• Tactile Desktop UI (TWM / Shells)</div>
                  <div>• Framer Motion & Micro-interactions</div>
                  <div>• Design Systems & Color Palettes</div>
                  <div>• Typography & Layout Hierarchy</div>
                  <div>• Hardware Acceleration & Perf</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-purple-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>SYSTEMS & MEDIA</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• Linux Ricing (Hyprland / i3 / BSPWM)</div>
                  <div>• Digital Video & MPV Workflows</div>
                  <div>• Realtime Physics & Particle Sim</div>
                  <div>• Gamification & Telemetry</div>
                  <div>• Bilingual Stories & Architecture</div>
                </div>
              </div>
            </div>

            {/* Experience & Projects */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.accent }}>
                <Briefcase className="w-3.5 h-3.5" />
                <span>Featured Systems & Projects</span>
              </div>

              {/* Project 1 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: activeTheme.accent }}>
                    AdityaOS // Noctalia Web TWM Desktop Environment
                  </span>
                  <span className="text-[10px] opacity-60">2024 — Present</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  Engineered an autonomous agentic Web OS modeled after Linux TWM rices (Noctalia, Caelestia, OneDark). Features draggable floating windows, interactive zsh terminal emulator with shell command execution, hardware-accelerated isometric pixel engine, and multi-theme live switching.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "Canvas API"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: activeTheme.tagBg,
                        color: activeTheme.tagText,
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project 2 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-400">
                    PixelEngine 2.0 // Isometric Voxel Engine & ASMR Synthesizer
                  </span>
                  <span className="text-[10px] opacity-60">2023 — 2026</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  Crafted an interactive voxel canvas with square/isometric matrix projections, directional 3D extrusion shading, Web Audio procedural sound synthesis, gravity drop physics, and live community stats syncing with Firebase Realtime Database.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["HTML5 Canvas", "Web Audio API", "Physics Particles", "Firebase RTDB", "Isometric Raycasting"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: activeTheme.tagBg,
                        color: activeTheme.tagText,
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project 3 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-red-400">
                    @falsepeek Media & Gaming Architecture
                  </span>
                  <span className="text-[10px] opacity-60">Active Channel</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  Digital gaming highlights and tactical analysis channel covering CS2, Valorant, and competitive gaming. Features high-frame-rate clip curation, precision video timing, and YouTube player integration.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.accent }}>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education & Philosophy</span>
              </div>
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">Computer Science & Design Systems</div>
                  <div className="text-[11px] opacity-70">Focus on Human-Computer Interaction & Tactile Interfaces</div>
                </div>
                <span className="text-[10px] opacity-60">Continuous Craft</span>
              </div>
            </div>
          </div>
        ) : (
          /* Raw Markdown View */
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-4 rounded border max-w-3xl mx-auto"
          >
            <pre className="text-xs whitespace-pre-wrap leading-relaxed opacity-90 select-text">
{`# Aditya Diundi
**Design Engineer & Systems Architect**
Global Remote • India • GitHub: @AdityaDiundi • YouTube: @falsepeek

---

### Core Specializations
- **Frontend Systems:** TypeScript, Next.js App Router, React 18, Zustand, Framer Motion
- **Graphics & Audio:** HTML5 2D Canvas, Isometric Voxel Projections, Web Audio API DSP
- **Infrastructure:** Linux TWM Shells (Hyprland, i3, BSPWM), Firebase Realtime DB, Vercel

---

### Featured Products
1. **AdityaOS (Noctalia Web TWM)**
   - Autonomous web operating system replicating riced Linux desktop workflows.
   - Draggable TWM tiling window manager with dynamic theme engine (Noctalia, Caelestia, OneDark, Tokyo Night).
   - Embedded interactive Kitty/Alacritty terminal emulator.

2. **PixelEngine 2.0**
   - Interactive voxel canvas with 2D/3D shading and square/isometric projection math.
   - Web Audio ASMR procedural sound synthesizer and particle physics gravity fall.
   - Connected live community telemetry via Firebase Realtime Database.

3. **@falsepeek Media Feed**
   - Curated competitive gaming highlights, tactical breakdown shorts, and telemetry feeds.
`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
