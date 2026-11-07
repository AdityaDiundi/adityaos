"use client";

import React, { useState } from "react";
import { ArrowDown, FileText, Terminal, MapPin, Activity, Cpu, ShieldCheck, ArrowUpRight, Zap, CheckCircle2 } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
  const { activeTheme } = useThemeStore();
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<"fintech" | "janeval" | "insurtech">("fintech");

  const marqueeItems = [
    "FINTECH ERROR PREVENTION",
    "AI CULTURAL BENCHMARKING",
    "BEHAVIORAL RETENTION ARCHITECTURE",
    "ENTERPRISE B2B INSURTECH",
    "IIIT DELHI ALUMNUS",
    "INDIA FELLOW ETHNOGRAPHY",
    "SYSTEMS THINKING",
    "TACTILE INTERACTION DESIGN",
  ];

  return (
    <section className="relative min-h-[92dvh] flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Identification Badge Track */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs font-mono">
          <span
            className="px-3.5 py-1 rounded-full border transition-colors flex items-center gap-2"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Product Designer & Systems Thinker</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600 hidden sm:inline-block" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
            Delhi, India · Available for Core Roles
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600 hidden md:inline-block" />
          <span className="hidden md:inline-block text-zinc-500 font-mono">
            IIIT Delhi (B.Tech ECE) · India Fellow
          </span>
        </div>

        {/* 12-Column Asymmetric Hero: Left Text (7 Cols), Right System Telemetry (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center mb-16">
          {/* Left Column: Massive Persuasive Typography */}
          <div className="lg:col-span-7 space-y-6">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-sans font-semibold tracking-[-0.04em] leading-[1.03] text-zinc-100"
            >
              Architecting friction-free digital systems, fintech payments, and grounded AI benchmarks.
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 font-sans leading-relaxed max-w-[62ch]">
              I am <span className="text-white font-semibold">Aditya Diundi</span>. I bridge engineering depth, grassroots human empathy, and high-density product UX to turn complex, ambiguous technical constraints into elegant, tactile software.
            </p>

            {/* High-Conversion Bold Primary Call-to-Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-4 font-mono text-xs">
              <button
                onClick={onExploreWork}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]"
              >
                <span>Explore Flagship Work</span>
                <ArrowDown className="w-4 h-4 text-zinc-950" strokeWidth={2} />
              </button>

              <a
                href="/Aditya_Diundi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                <span>Resume (PDF)</span>
              </a>

              <button
                onClick={onLaunchOS}
                className="px-4 py-3.5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
                <span>Launch adityaos Shell</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive System Visualization */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 space-y-6">
              {/* Telemetry Console Top Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold">
                    Live System Telemetry
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  NODE: ADITYA_SYS
                </span>
              </div>

              {/* Interactive Module Switcher Tabs */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTelemetryTab("fintech")}
                  className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTelemetryTab === "fintech"
                      ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="text-[10px] opacity-60">01 / FINTECH</div>
                  <div>UPI Runway</div>
                </button>

                <button
                  onClick={() => setActiveTelemetryTab("janeval")}
                  className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTelemetryTab === "janeval"
                      ? "bg-emerald-500/10 border-emerald-400/50 text-emerald-300 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="text-[10px] opacity-60">02 / AI BENCH</div>
                  <div>JANEVAL</div>
                </button>

                <button
                  onClick={() => setActiveTelemetryTab("insurtech")}
                  className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    activeTelemetryTab === "insurtech"
                      ? "bg-indigo-500/10 border-indigo-400/50 text-indigo-300 font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="text-[10px] opacity-60">03 / B2B SAAS</div>
                  <div>Arbiter S3</div>
                </button>
              </div>

              {/* Dynamic Telemetry Display Node */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                {activeTelemetryTab === "fintech" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">NPCI / SBI DAILY RUNWAY</span>
                      <span className="text-cyan-400 font-semibold">₹58,000 Remaining</span>
                    </div>

                    {/* Ambient Progress Runway Meter */}
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-[42%]" />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                        <span>Used: ₹42,000 / ₹1,00,000</span>
                        <span>Transfers: 9 / 20</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Split-Route Failover Active
                      </span>
                      <span className="text-zinc-500 text-[11px]">Digiaccel UX</span>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === "janeval" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">DOUBLE-BLIND PAIRWISE ARENA</span>
                      <span className="text-emerald-400 font-semibold">120 Verified Votes</span>
                    </div>

                    {/* Model Bradley-Terry Ratings */}
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">OpenAI GPT-Image-1</span>
                        <span className="text-emerald-400 font-bold">Elo 1142 · 68.4% Win</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full w-[68%]" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span>Clinical Ground-Truth Rubric</span>
                        <span className="text-emerald-300">3.4x Fidelity Gain</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        10 Frontline Anganwadi Evaluators
                      </span>
                      <span className="text-zinc-500 text-[11px]">Josh Talks</span>
                    </div>
                  </div>
                )}

                {activeTelemetryTab === "insurtech" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">ARBITER CLAIMS ENGINE</span>
                      <span className="text-indigo-400 font-semibold">1,420 Active Employees</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="text-[10px] text-zinc-500 uppercase">Hospital Pre-Auth</div>
                        <div className="text-white font-bold text-base mt-0.5">&lt; 15 mins</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <div className="text-[10px] text-zinc-500 uppercase">Census Delay</div>
                        <div className="text-indigo-300 font-bold text-base mt-0.5">0% Error</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        Keyboard-First Enterprise Table
                      </span>
                      <span className="text-zinc-500 text-[11px]">MedPay / S3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Spec Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1 pt-1">
                <span>Production Shipped Design Systems</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> 100% Token Consistency
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Marquee Banner */}
      <div className="w-full overflow-hidden border-y border-white/10 py-3.5 bg-black/40">
        <div className="flex w-max animate-marquee space-x-8 font-mono text-xs tracking-widest uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8">
              <span className="text-zinc-400">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
