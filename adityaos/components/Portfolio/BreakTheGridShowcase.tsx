"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  Maximize2,
  X,
  Compass,
  Sparkles,
  Globe,
  CheckCircle2,
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
    <section id="work" className="relative">
      {/* Outer Continuous Structural Grid Container */}
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header Row */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-200 font-semibold uppercase tracking-wider">01 // SELECTED WORKS</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">ENGINEERED SYSTEMS & PRODUCT ARCHITECTURE</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
              <span>SCALE: PRODUCTION</span>
              <span className="text-zinc-700">|</span>
              <span className="text-emerald-400 font-medium">VERIFIED CASE STUDIES</span>
            </div>
          </div>

          <div className="max-w-4xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.05]">
              Architectural Blueprints & Production Systems
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-3xl">
              Each module is an end-to-end engineered case study grounded in real production metrics, verified client deployments, and high-fidelity Figma architecture.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 1: FLAGSHIP 01 — JANEVAL BENCHMARK (JOSH TALKS) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 lg:grid-cols-12 relative group">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Left Column: Narrative, Problem & Metrics */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-6 bg-zinc-950/70">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  SYS_01 // AI BENCHMARKING
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">CLIENT: Josh Talks</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  JANEVAL Benchmark
                </h3>
                <p className="text-sm font-medium text-emerald-400/90 font-mono">
                  Ground-Truth AI Evaluation Arena for Indian Public Health
                </p>
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Frontier multimodal AI models frequently hallucinate clinical realities in rural India—placing digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, or generating unintelligible Devanagari lettering. JANEVAL establishes an evidence-backed double-blind pairwise evaluation framework tested with frontline public health workers.
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800 font-mono">
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
                  <div className="text-[11px] text-zinc-500 font-sans">Domain Evaluators</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="https://janeval.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-950" />
                <span>Launch Live Benchmark</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/AdityaDiundi/drishti-health-eval"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-zinc-700 text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>GitHub Source</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Right Column: High-Res Live Artifact View */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-4 bg-zinc-950/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 p-1 rounded-lg bg-black/60 border border-zinc-800">
                <button
                  onClick={() => setJanevalTab("live")}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    janevalTab === "live"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ● Live Production Capture
                </button>
                <button
                  onClick={() => setJanevalTab("architecture")}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    janevalTab === "architecture"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  3-Stage Pipeline
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">1600 × 1000 Retina Production</span>
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
              className="group/screen relative rounded-xl overflow-hidden bg-black/90 border border-zinc-800 cursor-pointer shadow-2xl transition-all duration-300 hover:border-emerald-500/50"
            >
              {/* Browser Header Bar */}
              <div className="px-4 py-2.5 bg-black/95 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
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
                  <Maximize2 className="w-3 h-3" /> Full View
                </span>
              </div>

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
                  <span className="px-3 py-1.5 rounded-full bg-black/90 text-white font-mono text-xs flex items-center gap-2 border border-zinc-700">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Click to inspect full-resolution capture
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Double-blind A/B pipeline, verified pairwise Elo rating, and frontline Indian public-health criteria.</span>
              <a
                href="https://janeval.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: FLAGSHIP 02 — CORPORATE HEALTH BENEFITS & CLAIMS SETTLEMENT (MFine) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 lg:grid-cols-12 relative group">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Left Column: Narrative, Problem & Metrics */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-6 bg-zinc-950/70">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  SYS_02 // B2B HEALTHCARE & FINTECH
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">COMPANY: MFine</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  Corporate Health Benefits & Claim Settlement
                </h3>
                <p className="text-sm font-medium text-indigo-400/90 font-mono">
                  B2B Corporate Onboarding, Wallet Management & Cashless Triage
                </p>
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                At MFine, designed B2B corporate onboarding and wallet management tools enabling HR admins to seamlessly manage employee policy allowances and benefits. Overhauled the patient claim settlement flow for 100K+ daily active users, eliminating TPA latency and minimizing cashless hospitalization rejections.
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800 font-mono">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-400">&lt; 15 Mins</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Pre-Auth Triage</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">100K+</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Daily Active Users</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-300">99.2%</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Audit Reliability</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span>Inspect Figma Architecture</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right Column: High-Res Crop and System Board View */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-4 bg-zinc-950/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 p-1 rounded-lg bg-black/60 border border-zinc-800">
                <button
                  onClick={() => setCorpTab("cluster")}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    corpTab === "cluster"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  ● Modal Policy Matrix
                </button>
                <button
                  onClick={() => setCorpTab("full")}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    corpTab === "full"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Full System Board
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">MFine Corporate & Cashless UX</span>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src:
                    corpTab === "cluster"
                      ? "/case-studies/corporate_claims_cluster.png"
                      : "/case-studies/corporate_claims.png",
                  alt: "Corporate Claims & Benefits Dashboard (MFine)",
                  title:
                    corpTab === "cluster"
                      ? "MFine — Corporate Wallet Policy Matrix & Modal Settlement Flows"
                      : "MFine — Full Enterprise Claims and Benefits Architecture Canvas",
                })
              }
              className="group/screen relative rounded-xl overflow-hidden bg-black/90 border border-zinc-800 cursor-pointer shadow-2xl transition-all duration-300 hover:border-indigo-500/50"
            >
              <div className="px-4 py-2.5 bg-black/95 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="ml-2 text-zinc-400 text-[11px]">mfine.co/corporate-benefits/wallet-admin</span>
                </div>
                <span className="text-zinc-400 group-hover/screen:text-white flex items-center gap-1 text-[11px]">
                  <Maximize2 className="w-3 h-3" /> Full View
                </span>
              </div>

              <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                <Image
                  src={
                    corpTab === "cluster"
                      ? "/case-studies/corporate_claims_cluster.png"
                      : "/case-studies/corporate_claims.png"
                  }
                  alt="MFine Corporate Claims and Benefits Architecture"
                  fill
                  className="object-contain p-2 group-hover/screen:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-end p-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/90 text-white font-mono text-xs flex items-center gap-2 border border-zinc-700">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" /> Click to inspect high-resolution architecture
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>B2B multi-stakeholder employee wallet management, coverage rules, and TPA pre-authorization.</span>
              <a
                href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Figma Board</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: TWO-COLUMN SECONDARY MODULES (UPI + HABIT TRACKER) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Module 03: UPI Limit Clarity (Digiaccel) */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  SYS_03 // FINTECH PAYMENTS
                </span>
                <span className="text-zinc-400">CLIENT: Digiaccel</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                  UPI Limit Clarity & Spend Runway
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  Over 350M Indians experience payment limit anxiety at checkouts. Re-architected reactive post-failure errors into an ambient pre-transaction limit meter with 1-tap bank split routing.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 font-mono text-xs">
                <div>
                  <span className="text-lg font-bold text-cyan-400">38%</span>
                  <span className="block text-zinc-500 text-[10px]">Dropoff Reduction</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">92%</span>
                  <span className="block text-zinc-500 text-[10px]">Limit Awareness</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-zinc-300">1 Tap</span>
                  <span className="block text-zinc-500 text-[10px]">Bank Failover</span>
                </div>
              </div>
            </div>

            {/* High-res Before vs After preview */}
            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/upi_limit_meter_flow.png",
                  alt: "UPI Limit Clarity Before vs After Flow",
                  title: "UPI Limit Clarity (Digiaccel) — Before vs With Limit Meter & Warning Nudge",
                })
              }
              className="relative rounded-xl overflow-hidden aspect-[16/9] border border-zinc-800 bg-black/80 cursor-pointer shadow-lg group-hover:border-cyan-500/40 transition-colors"
            >
              <Image
                src="/case-studies/upi_limit_meter_flow.png"
                alt="UPI Limit Clarity Screens"
                fill
                className="object-cover object-left-top group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> High-Res Flow
                </span>
                <a
                  href="https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Module 04: Habit Tracker & Regimen Engine (Mosaic Wellness / ManMatters) */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  SYS_04 // BEHAVIORAL RETENTION
                </span>
                <span className="text-zinc-400">COMPANY: Mosaic Wellness</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                  21-Day Habit Tracker & Regimen Engine
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  Shipped on the ManMatters app to combat clinical treatment dropouts. Replaced delayed-gratification churn with 1-tap routine logging, streak locks, and personalized WhatsApp coach hotlines.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 font-mono text-xs">
                <div>
                  <span className="text-lg font-bold text-amber-400">+12%</span>
                  <span className="block text-zinc-500 text-[10px]">Purchase Conv</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-white">100+</span>
                  <span className="block text-zinc-500 text-[10px]">Onboarded Wk 1</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-zinc-300">22</span>
                  <span className="block text-zinc-500 text-[10px]">Weekly Actives</span>
                </div>
              </div>
            </div>

            {/* Habit Compliance Engine */}
            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/hair_tracker.png",
                  alt: "21-Day Habit Tracker Design",
                  title: "Mosaic Wellness (ManMatters) — 21-Day Habit & Regimen Engine Playbook",
                })
              }
              className="relative rounded-xl p-4 border border-zinc-800 bg-black/80 cursor-pointer shadow-lg space-y-2 group-hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                <span className="font-semibold">REGIMEN ADHERENCE STAGES</span>
                <span className="text-[10px] text-zinc-500">MANMATTERS APP</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-300">Days 01–07</span>
                  <span className="text-amber-400">1-Tap Log & Dopamine Cue</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-300">Days 08–14</span>
                  <span className="text-amber-400">Coach Hotline & Streak Lock</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-300">Days 15–21</span>
                  <span className="text-emerald-400">Habit Anchor & Regimen Reorder</span>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Eye className="w-3 h-3 text-amber-400" /> Tap to view Figma master sheet
                </span>
                <span className="text-amber-400 text-xs">Expand</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 4: THREE-COLUMN SECONDARY MODULES (FIELDWORK + KETTO + TUTEDUDE) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Module 05: Fieldwork & Geolocation Tracker (Project Potential x India Fellow) */}
          <div className="p-6 flex flex-col justify-between space-y-4 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">SYS_05 // FIELD SYSTEMS</span>
                <span className="text-zinc-500 text-[11px]">India Fellow</span>
              </div>

              <h4 className="text-lg font-bold font-sans text-white tracking-tight">
                Field Systems & Geolocation Tracker
              </h4>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Project Potential x India Fellow: Built a real-time attendance tracker with live location validation (HERE API, App Script) and authored the 12-module Youth Resource Manual.
              </p>

              <div className="font-mono text-xs pt-1">
                <span className="text-base font-bold text-emerald-400">20 Months</span>
                <span className="text-zinc-500 text-[11px] ml-2">Rural Immersion</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/aditya_field_full.jpg",
                  alt: "Aditya Diundi Grassroots Fieldwork in Uttarakhand",
                  title: "Field Systems & Qualitative Ethnography — Project Potential x India Fellow",
                })
              }
              className="relative rounded-xl overflow-hidden aspect-[4/3] border border-zinc-800 bg-black/60 cursor-pointer shadow-lg group-hover:border-emerald-500/40 transition-colors"
            >
              <Image
                src="/aditya_field_full.jpg"
                alt="Rural Fieldwork Photo"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  <Eye className="w-3 h-3 text-emerald-400" /> High-Res Photo (2,100m MSL)
                </span>
              </div>
            </div>
          </div>

          {/* Module 06: Ketto+ Recurring Crowdfunding (Ketto) */}
          <div className="p-6 flex flex-col justify-between space-y-4 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-400 font-semibold">SYS_06 // SUBSCRIPTION UX</span>
                <span className="text-zinc-500 text-[11px]">CLIENT: Ketto</span>
              </div>

              <h4 className="text-lg font-bold font-sans text-white tracking-tight">
                Ketto+ Recurring Crowdfunding
              </h4>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Transformed emergency one-off medical crowdfunding donors into recurring monthly subscribers with transparent impact progress feeds and 1-tap giving tiers.
              </p>

              <div className="font-mono text-xs pt-1">
                <span className="text-base font-bold text-pink-400">2.3x</span>
                <span className="text-zinc-500 text-[11px] ml-2">Repeat Monthly Donors</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/ketto_curated_flow.png",
                  alt: "Ketto+ Mobile App UI Mockup",
                  title: "Ketto+ Recurring Giving (Ketto) — Mobile Subscription Donation Flow",
                })
              }
              className="relative rounded-xl overflow-hidden aspect-[4/3] border border-zinc-800 bg-black/80 cursor-pointer shadow-lg group-hover:border-pink-500/40 transition-colors"
            >
              <Image
                src="/case-studies/ketto_curated_flow.png"
                alt="Ketto+ Mobile App Screens"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  <Eye className="w-3 h-3 text-pink-400" /> Zoom Mobile Flow
                </span>
              </div>
            </div>
          </div>

          {/* Module 07: Mobile Web Lecture Architecture (TuteDude) */}
          <div className="p-6 flex flex-col justify-between space-y-4 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors group">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-400 font-semibold">SYS_07 // EDTECH LEARNING</span>
                <span className="text-zinc-500 text-[11px]">CLIENT: TuteDude</span>
              </div>

              <h4 className="text-lg font-bold font-sans text-white tracking-tight">
                Mobile Web Lecture Architecture
              </h4>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Engineered a distraction-free mobile web lecture experience with contextual note-taking drawers, code progression, and adaptive bandwidth optimization.
              </p>

              <div className="font-mono text-xs pt-1">
                <span className="text-base font-bold text-sky-400">+34%</span>
                <span className="text-zinc-500 text-[11px] ml-2">Lecture Completion</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/tutedude_curated_flow.png",
                  alt: "Tutedude Mentorship UI Mockup",
                  title: "TuteDude EdTech (TuteDude) — Lecture Clutter Redesign & Flow Comparison",
                })
              }
              className="relative rounded-xl overflow-hidden aspect-[4/3] border border-zinc-800 bg-black/80 cursor-pointer shadow-lg group-hover:border-sky-500/40 transition-colors"
            >
              <Image
                src="/case-studies/tutedude_curated_flow.png"
                alt="Tutedude Mentorship Screens"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-mono text-white flex items-center gap-1">
                  <Eye className="w-3 h-3 text-sky-400" /> Zoom Lecture Flow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-RES LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-4 sm:p-8 flex flex-col justify-between items-center animate-in fade-in duration-200"
        >
          {/* Modal Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between pb-4 border-b border-zinc-800 font-mono text-xs text-zinc-300"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-white tracking-wider">{lightbox.title}</span>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Image View */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl flex-1 my-4 flex items-center justify-center overflow-auto"
          >
            <div className="relative w-full h-full max-h-[82vh]">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500"
          >
            <span>Retina production artboard capture. Click outside or press close to exit.</span>
            <button
              onClick={() => setLightbox(null)}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
