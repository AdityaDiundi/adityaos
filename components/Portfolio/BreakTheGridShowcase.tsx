"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Eye,
  Maximize2,
  X,
  Layers,
  Activity,
  Compass,
  FileText,
  Sliders,
  CheckCircle2,
  Zap,
  Globe
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface LightboxState {
  src: string;
  alt: string;
  title: string;
}

export function BreakTheGridShowcase() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [janevalTab, setJanevalTab] = useState<"live" | "architecture">("live");
  const [corpTab, setCorpTab] = useState<"cluster" | "full">("cluster");
  const { activeTheme } = useThemeStore();

  return (
    <section id="work" className="py-24 relative border-t border-white/10">
      {/* Background Architectural Drafting Paper Grid */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Canvas Header & Technical Drafting Coordinates */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-zinc-500 mb-6 tracking-wider">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-300 font-semibold">[CANVAS_ENGINE // SYSTEM_MODULES]</span>
              <span className="text-zinc-700">|</span>
              <span>GRID: 32px · SCALE: 1:1</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>COORD_REF: 28°36&apos;N / 77°12&apos;E</span>
              <span className="text-zinc-700">|</span>
              <span className="text-emerald-400 font-medium">STATUS: VERIFIED PRODUCTION BLUEPRINTS</span>
            </div>
          </div>

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Architectural Blueprint Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.05]">
              Breaking complex constraints into <span className="text-zinc-400 font-normal">tactile human systems.</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-[68ch]">
              Each module below is an engineered case study grounded in real production metrics, live client deliverables, and high-fidelity Figma design architecture.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 1: THE TWO FLAGSHIP PROJECTS (FULL-WIDTH IMMERSIVE CONTAINERS) */}
        {/* ========================================================================= */}
        <div className="space-y-16 mb-24">
          {/* Flagship 01: JANEVAL Benchmark */}
          <article className="relative rounded-3xl bg-[#0C1019]/90 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-emerald-500/40 group">
            {/* Corner Crosshairs */}
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-10 lg:p-12 items-center">
              {/* Left Column: Problem, Thesis, Architecture & Metrics */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      FIG_01 // FLAGSHIP
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400">AI SYSTEMS & HEALTHCARE UX</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-200">
                    <span className="text-zinc-500">CLIENT:</span>
                    <span className="font-semibold text-white">Josh Talks</span>
                    <span className="text-zinc-500">· Independent AI Research</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                    JANEVAL Benchmark
                  </h3>
                  <p className="text-base text-zinc-300 font-sans font-medium">
                    Human-Centered Ground-Truth AI Evaluation for Indian Public Health
                  </p>
                </div>

                <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                  Frontier AI models (GPT-4 Vision, Gemini 1.5) hallucinate critical clinical realities in Indian public health—placing digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, or generating gibberish Devanagari lettering. JANEVAL establishes an evidence-backed double-blind pairwise evaluation framework tested with frontline public health workers.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400">120+</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Pairwise Votes</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">3.4x</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Cultural Fidelity</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-zinc-300">12</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Domain Experts</div>
                  </div>
                </div>

                {/* Direct Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
                  <a
                    href="https://janeval.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Launch Live Benchmark</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://github.com/AdityaDiundi/drishti-health-eval"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 text-zinc-300 flex items-center gap-2 transition-colors"
                  >
                    <span>GitHub Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Full-Bleed High-Res UI Artboard Frame */}
              <div className="lg:col-span-7 space-y-3">
                {/* View Switcher Tabs */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 p-1 rounded-lg bg-black/60 border border-white/10">
                    <button
                      onClick={() => setJanevalTab("live")}
                      className={`px-3 py-1 rounded transition-colors ${
                        janevalTab === "live"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      ● Live Production App
                    </button>
                    <button
                      onClick={() => setJanevalTab("architecture")}
                      className={`px-3 py-1 rounded transition-colors ${
                        janevalTab === "architecture"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Evaluation Pipeline
                    </button>
                  </div>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">1600 × 1000 Retina Capture</span>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src:
                        janevalTab === "live"
                          ? "/case-studies/janeval_live.png"
                          : "/case-studies/janeval_page-3.png",
                      alt: "JANEVAL AI Healthcare Evaluation Arena",
                      title:
                        janevalTab === "live"
                          ? "JANEVAL — Live Production Benchmark & Pairwise Elo Arena (1600x1000)"
                          : "JANEVAL — Three-Stage Evaluation Pipeline & Frontline Consent Flow",
                    })
                  }
                  className="group/screen relative rounded-2xl overflow-hidden bg-black/80 border border-white/15 cursor-pointer shadow-2xl transition-all duration-300 hover:border-emerald-500/50"
                >
                  {/* Browser Chrome Header */}
                  <div className="px-4 py-3 bg-black/90 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      </div>
                      <span className="ml-2 text-emerald-400 text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        janeval.vercel.app · Production Benchmark
                      </span>
                    </div>
                    <span className="text-zinc-400 group-hover/screen:text-white flex items-center gap-1 text-[11px]">
                      <Maximize2 className="w-3 h-3" /> Full Res
                    </span>
                  </div>

                  {/* Real Screen Image */}
                  <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                    <Image
                      src={
                        janevalTab === "live"
                          ? "/case-studies/janeval_live.png"
                          : "/case-studies/janeval_page-3.png"
                      }
                      alt="JANEVAL Double Blind Pairwise Arena"
                      fill
                      className="object-cover object-top group-hover/screen:scale-[1.01] transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-end p-4">
                      <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2 border border-white/20">
                        <Eye className="w-3.5 h-3.5" /> Tap to inspect full-resolution capture
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-label */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
                  <span>Double-blind A/B pipeline, verified pairwise Elo rating, and frontline Indian public-health criteria.</span>
                  <a
                    href="https://janeval.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Visit site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Flagship 02: Corporate Claims & Arbiter (MedPay / S3) */}
          <article className="relative rounded-3xl bg-[#0B0E17]/90 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 hover:border-indigo-500/40 group">
            {/* Corner Crosshairs */}
            <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-10 lg:p-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      FIG_02 // FLAGSHIP
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400">ENTERPRISE B2B INSURTECH</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-200">
                    <span className="text-zinc-500">CLIENT:</span>
                    <span className="font-semibold text-white">MedPay / S3</span>
                    <span className="text-zinc-500">· Group Health Benefits</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                    Corporate Claims & Arbiter (S3)
                  </h3>
                  <p className="text-base text-zinc-300 font-sans font-medium">
                    Streamlining Enterprise Group Health & Cashless Hospitalization
                  </p>
                </div>

                <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                  Enterprise insurance operations are plagued by disconnected TPA portals and delayed CSV census updates. When an employee is admitted to a hospital, claims are frequently rejected because their activation records were stuck in transit. Arbiter provides a high-density, keyboard-first census table paired with real-time cashless settlement stages.
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-400">18 Mins</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Down from 14 Days</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">₹38Cr+</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Automated Triage</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-zinc-300">99.2%</div>
                    <div className="text-[11px] text-zinc-500 font-sans">Audit Reliability</div>
                  </div>
                </div>

                {/* Direct Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
                  <a
                    href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Inspect Figma Architecture</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Right Column: High-Res UI Artboard */}
              <div className="lg:col-span-7 space-y-3">
                {/* View Switcher Tabs */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 p-1 rounded-lg bg-black/60 border border-white/10">
                    <button
                      onClick={() => setCorpTab("cluster")}
                      className={`px-3 py-1 rounded transition-colors ${
                        corpTab === "cluster"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      ● Modal Policy Matrix
                    </button>
                    <button
                      onClick={() => setCorpTab("full")}
                      className={`px-3 py-1 rounded transition-colors ${
                        corpTab === "full"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Entire System Board
                    </button>
                  </div>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">High-Density Enterprise SaaS</span>
                </div>

                <div
                  onClick={() =>
                    setLightbox({
                      src:
                        corpTab === "cluster"
                          ? "/case-studies/corporate_claims_cluster.png"
                          : "/case-studies/corporate_claims.png",
                      alt: "Corporate Claims & Arbiter Enterprise Dashboard",
                      title:
                        corpTab === "cluster"
                          ? "Corporate Claims & Arbiter — Modal State Matrix & Selector Interaction Flows"
                          : "Corporate Claims & Arbiter (MedPay / S3) — Full Enterprise Canvas",
                    })
                  }
                  className="group/screen relative rounded-2xl overflow-hidden bg-black/80 border border-white/15 cursor-pointer shadow-2xl transition-all duration-300 hover:border-indigo-500/50"
                >
                  <div className="px-4 py-3 bg-black/90 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      </div>
                      <span className="ml-2 text-zinc-400 text-[11px]">arbiter.s3.internal/corporate-management</span>
                    </div>
                    <span className="text-zinc-400 group-hover/screen:text-white flex items-center gap-1 text-[11px]">
                      <Maximize2 className="w-3 h-3" /> Full Res
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                    <Image
                      src={
                        corpTab === "cluster"
                          ? "/case-studies/corporate_claims_cluster.png"
                          : "/case-studies/corporate_claims.png"
                      }
                      alt="Corporate Claims and S3 Management Screens"
                      fill
                      className="object-contain p-2 group-hover/screen:scale-[1.01] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-end p-4">
                      <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2 border border-white/20">
                        <Eye className="w-3.5 h-3.5" /> Tap to inspect full-resolution artboard
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
                  <span>Enterprise multi-stakeholder corporate creation, coverage rules, and TPA reconciliation flows.</span>
                  <a
                    href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Figma Canvas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: SECONDARY PROJECTS (ASYMMETRIC BENTO-BOX GRID) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>CANVAS_TILES // SECONDARY MODULES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight mt-1">
                Asymmetric Architecture Grid
              </h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 max-w-sm">
              Engineered payment runways, habit retention loops, rural diagnostics, and crowdfunding architectures.
            </p>
          </div>

          {/* Bento Grid: 12-Column System */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Bento Card 1 (7 Cols): UPI Limit Clarity */}
            <div className="relative md:col-span-7 rounded-3xl bg-[#0A0D15]/90 backdrop-blur-md border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-cyan-400/40 transition-all shadow-xl group">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <span>FIG_03 // FINTECH PAYMENTS</span>
                  </div>
                  <span className="text-zinc-400">CLIENT: Digiaccel</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-bold font-sans text-white tracking-tight">
                    UPI Limit Clarity & Payment Runway
                  </h4>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    Over 350M Indians experience payment limit anxiety at checkouts. Re-architected reactive post-failure errors into an ambient pre-transaction limit meter with 1-tap bank split routing.
                  </p>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs pt-2">
                  <div>
                    <span className="text-xl font-bold text-cyan-400">38%</span>
                    <span className="block text-zinc-500 text-[10px]">Dropoff Reduction</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">92%</span>
                    <span className="block text-zinc-500 text-[10px]">Limit Awareness</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-zinc-300">1 Tap</span>
                    <span className="block text-zinc-500 text-[10px]">Bank Failover</span>
                  </div>
                </div>
              </div>

              {/* Bento Image Preview: Crisp Cropped Before vs After UPI Limit Meter */}
              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/upi_limit_meter_flow.png",
                    alt: "UPI Limit Clarity Before vs After Flow",
                    title: "UPI Limit Clarity (Digiaccel) — Before vs With Limit Meter & Warning Nudge",
                  })
                }
                className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-black/80 cursor-pointer shadow-lg"
              >
                <Image
                  src="/case-studies/upi_limit_meter_flow.png"
                  alt="UPI Limit Clarity Screens"
                  fill
                  className="object-cover object-left-top group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                  <span className="text-xs font-mono text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Tap to zoom high-res Before/After flow
                  </span>
                  <a
                    href="https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bento Card 2 (5 Cols): 21-Day Habit & Hair Tracker */}
            <div className="relative md:col-span-5 rounded-3xl bg-[#0D0F14]/90 backdrop-blur-md border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-amber-400/40 transition-all shadow-xl group">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span>FIG_04 // BEHAVIORAL RETENTION</span>
                  </div>
                  <span className="text-zinc-400">CLIENT: Traya / Mosaic</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-bold font-sans text-white tracking-tight">
                    21-Day Habit & Hair Tracker
                  </h4>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    Overcoming the delayed-gratification churn cliff in clinical health through tactile 1-tap routine logging, streak locks, and ambient WhatsApp coach hotlines.
                  </p>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs pt-2">
                  <div>
                    <span className="text-xl font-bold text-amber-400">+44%</span>
                    <span className="block text-zinc-500 text-[10px]">Day 14 Retention</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">81%</span>
                    <span className="block text-zinc-500 text-[10px]">Daily Log Rate</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-zinc-300">1 Tap</span>
                    <span className="block text-zinc-500 text-[10px]">Photo Proof</span>
                  </div>
                </div>
              </div>

              {/* Engineered Habit Lifecycle Architecture Card */}
              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/hair_tracker.png",
                    alt: "21-Day Habit Tracker Design",
                    title: "21-Day Habit & Hair Tracker (Traya Health / Mosaic Wellness) — 21-Day Playbook & Tasks",
                  })
                }
                className="relative rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-black/60 to-black/80 cursor-pointer shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                  <span className="font-semibold">HABIT COMPLIANCE ENGINE</span>
                  <span className="text-[10px] text-zinc-500">PHASED SYSTEM</span>
                </div>

                {/* 3 Step Phase Runway */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/5">
                    <span className="text-zinc-300">Day 01–07</span>
                    <span className="text-amber-400">Dopamine Setup & 1-Tap Log</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/5">
                    <span className="text-zinc-300">Day 08–14</span>
                    <span className="text-amber-400">Churn Prevention & Coach Hook</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/5">
                    <span className="text-zinc-300">Day 15–21</span>
                    <span className="text-emerald-400">Regimen Lock-in & Photo Audit</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Tap to view Figma master sheet
                  </span>
                  <span className="text-amber-400 flex items-center gap-1">
                    Expand <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 3 (4 Cols): Himalayan Fieldwork & Qualitative Study */}
            <div className="relative md:col-span-4 rounded-3xl bg-[#0B0D12]/90 backdrop-blur-md border border-white/15 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-400/40 transition-all shadow-xl group">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">FIG_05 // ETHNOGRAPHY</span>
                  <span className="text-zinc-500">India Fellow</span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white tracking-tight">
                  Himalayan Field Research
                </h4>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Immersive grassroots fieldwork with Aarohi across remote Kumaon villages to map cognitive load in frontline rural telemedicine.
                </p>

                <div className="font-mono text-xs pt-1">
                  <span className="text-lg font-bold text-emerald-400">12 Months</span>
                  <span className="text-zinc-500 text-[11px] ml-2">Village Immersion</span>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: "/aditya_field_full.jpg",
                    alt: "Aditya Diundi Grassroots Fieldwork in Uttarakhand",
                    title: "Himalayan Fieldwork & Rural Healthcare Diagnostics — Aarohi & India Fellow",
                  })
                }
                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-black/60 cursor-pointer shadow-lg"
              >
                <Image
                  src="/aditya_field_full.jpg"
                  alt="Rural Fieldwork Photo"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-white flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Inspect Photo (2,100m MSL)
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 4 (4 Cols): Ketto+ Recurring Giving */}
            <div className="relative md:col-span-4 rounded-3xl bg-[#100C14]/90 backdrop-blur-md border border-white/15 p-6 flex flex-col justify-between space-y-4 hover:border-pink-400/40 transition-all shadow-xl group">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-pink-400 font-semibold">FIG_06 // SUBSCRIPTION UX</span>
                  <span className="text-zinc-500">CLIENT: Ketto</span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white tracking-tight">
                  Ketto+ Recurring Giving
                </h4>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Transforming emergency one-off crowdfunding donors into recurring monthly champions with ambient impact feeds.
                </p>

                <div className="font-mono text-xs pt-1">
                  <span className="text-lg font-bold text-pink-400">2.3x</span>
                  <span className="text-zinc-500 text-[11px] ml-2">Repeat Monthly Donors</span>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/ketto_curated_flow.png",
                    alt: "Ketto+ Mobile App UI Mockup",
                    title: "Ketto+ Recurring Giving (Ketto) — Mobile Recurring Donation Journey",
                  })
                }
                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-black/80 cursor-pointer shadow-lg"
              >
                <Image
                  src="/case-studies/ketto_curated_flow.png"
                  alt="Ketto+ Mobile App Screens"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-white flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Zoom Mobile Flow
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 5 (4 Cols): Tutedude Mentorship */}
            <div className="relative md:col-span-4 rounded-3xl bg-[#090E14]/90 backdrop-blur-md border border-white/15 p-6 flex flex-col justify-between space-y-4 hover:border-sky-400/40 transition-all shadow-xl group">
              <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] text-zinc-600 select-none">+</span>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-400 font-semibold">FIG_07 // EDTECH LEARNING</span>
                  <span className="text-zinc-500">CLIENT: Tutedude</span>
                </div>

                <h4 className="text-xl font-bold font-sans text-white tracking-tight">
                  Tutedude Mentorship
                </h4>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Contextual mentor guidance drawers and code exercise progression to combat online course dropouts.
                </p>

                <div className="font-mono text-xs pt-1">
                  <span className="text-lg font-bold text-sky-400">+34%</span>
                  <span className="text-zinc-500 text-[11px] ml-2">Module Completion</span>
                </div>
              </div>

              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/tutedude_curated_flow.png",
                    alt: "Tutedude Mentorship UI Mockup",
                    title: "Tutedude Mentorship Platform (Tutedude) — Lecture Page & Variant Comparisons",
                  })
                }
                className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-black/80 cursor-pointer shadow-lg"
              >
                <Image
                  src="/case-studies/tutedude_curated_flow.png"
                  alt="Tutedude Mentorship Screens"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-white flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Zoom Lecture Flow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0C1017] border border-white/20 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/80 font-mono text-xs">
              <span className="text-zinc-200 font-semibold truncate">{lightbox.title}</span>
              <button
                onClick={() => setLightbox(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative w-full overflow-y-auto flex-1 p-4 bg-zinc-950 flex items-center justify-center">
              <div className="relative w-full min-h-[500px] h-[78vh]">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
