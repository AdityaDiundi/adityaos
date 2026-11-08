"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Eye, Maximize2, X, Globe, Sparkles } from "lucide-react";

interface LightboxState {
  src: string;
  alt: string;
  title: string;
}

export function BreakTheGridShowcase() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [janevalTab, setJanevalTab] = useState<"live" | "architecture">("live");
  const [corpTab, setCorpTab] = useState<"cluster" | "full">("cluster");

  return (
    <section id="work" className="relative">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header */}
        <div className="border-b border-zinc-800 p-8 sm:p-12 lg:p-14 relative">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="space-y-3">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              01 // Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Case studies & shipped software.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl pt-1 leading-relaxed">
              Projects spanning frontier AI evaluation, enterprise B2B benefits, fintech payment flows, and grassroots field tools.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 lg:grid-cols-12 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Left Column: Story & Data */}
          <div className="lg:col-span-5 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-7 bg-zinc-950/70">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 font-semibold">01</span>
                <span>/</span>
                <span>Josh Talks</span>
                <span>·</span>
                <span>AI Evaluation Arena</span>
              </div>

              {/* Persistent Live Build Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE BENCHMARK BUILD</span>
                  <span className="text-emerald-700">|</span>
                  <span className="text-zinc-300">janeval.vercel.app</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  JANEVAL Benchmark
                </h3>
                <p className="text-sm font-sans text-zinc-300 font-medium">
                  Ground-truth AI evaluation arena for Indian public health.
                </p>
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed pt-1">
                Frontier vision models frequently hallucinate clinical realities in rural India—substituting digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, or generating unintelligible Devanagari script. JANEVAL introduces an evidence-backed double-blind pairwise evaluation arena tested directly with frontline public health workers.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800 font-mono text-xs">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">120+</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Pairwise Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">3.4x</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Fidelity Lift</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-300">12</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Evaluators</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
              <a
                href="https://janeval.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(52,211,153,0.35)] hover:shadow-[0_0_35px_rgba(52,211,153,0.55)] transition-all cursor-pointer group/btn"
              >
                <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Launch Live Arena</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://github.com/AdityaDiundi/drishti-health-eval"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Screen Frame */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-4 bg-zinc-950/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 p-1 rounded bg-black/60 border border-zinc-800">
                <button
                  onClick={() => setJanevalTab("live")}
                  className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                    janevalTab === "live" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Production Capture
                </button>
                <button
                  onClick={() => setJanevalTab("architecture")}
                  className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                    janevalTab === "architecture" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  3-Stage Pipeline
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">1600 × 1000 Retina</span>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: janevalTab === "live" ? "/case-studies/janeval_live.png" : "/case-studies/janeval_page-3.png",
                  alt: "JANEVAL AI Healthcare Evaluation Arena",
                  title: janevalTab === "live" ? "JANEVAL — Live Production Elo Arena" : "JANEVAL — Evaluation Pipeline",
                })
              }
              className="group/screen relative rounded-lg overflow-hidden bg-black border border-zinc-800 cursor-pointer shadow-xl hover:border-emerald-500/40 transition-colors"
            >
              <div className="px-3.5 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">Live Build</span>
                  <span className="text-zinc-600">·</span>
                  <span>janeval.vercel.app</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 group-hover/screen:text-white text-[11px]">
                    <Maximize2 className="w-3 h-3" /> Zoom
                  </span>
                </div>
              </div>

              <div className="relative aspect-[16/10] bg-zinc-950">
                <Image
                  src={janevalTab === "live" ? "/case-studies/janeval_live.png" : "/case-studies/janeval_page-3.png"}
                  alt="JANEVAL Double Blind Pairwise Arena"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1">
              Verified pairwise Elo rating and frontline healthcare worker consensus criteria.
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 02: CORPORATE HEALTH BENEFITS & CLAIMS (MFINE) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 lg:grid-cols-12 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* Left Column */}
          <div className="lg:col-span-5 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-7 bg-zinc-950/70">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-indigo-400 font-semibold">02</span>
                <span>/</span>
                <span>MFine</span>
                <span>·</span>
                <span>B2B Benefits & Claims</span>
              </div>

              {/* Persistent Prototype Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 font-mono text-[11px] font-semibold tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>INTERACTIVE FIGMA SPEC</span>
                  <span className="text-indigo-700">|</span>
                  <span className="text-zinc-300">Design System Architecture</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  Corporate Health Benefits & Claim Settlement
                </h3>
                <p className="text-sm font-sans text-zinc-300 font-medium">
                  B2B onboarding, wallet management & cashless triage for 100K+ DAU.
                </p>
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed pt-1">
                At MFine, designed B2B corporate onboarding and wallet management tools enabling HR enterprise admins to configure employee health allowances. Redesigned the patient claim settlement flow for 100K+ daily active users to eliminate TPA delays and cashless hospitalization rejections.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800 font-mono text-xs">
                <div>
                  <div className="text-2xl font-bold text-indigo-400">&lt; 15 Mins</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Pre-Auth Triage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100K+</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Daily Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-300">99.2%</div>
                  <div className="text-[11px] text-zinc-500 font-sans">Audit Reliability</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
              <a
                href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all cursor-pointer group/btn"
              >
                <span>Explore Figma System</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-4 bg-zinc-950/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 p-1 rounded bg-black/60 border border-zinc-800">
                <button
                  onClick={() => setCorpTab("cluster")}
                  className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                    corpTab === "cluster" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Modal Policy Matrix
                </button>
                <button
                  onClick={() => setCorpTab("full")}
                  className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                    corpTab === "full" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  Full Board
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">Enterprise Design System</span>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: corpTab === "cluster" ? "/case-studies/corporate_claims_cluster.png" : "/case-studies/corporate_claims.png",
                  alt: "Corporate Claims & Benefits Dashboard (MFine)",
                  title: corpTab === "cluster" ? "MFine — Corporate Wallet Policy Matrix" : "MFine — Full Canvas",
                })
              }
              className="group/screen relative rounded-lg overflow-hidden bg-black border border-zinc-800 cursor-pointer shadow-xl hover:border-indigo-500/40 transition-colors"
            >
              <div className="px-3.5 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>mfine.co/corporate-benefits</span>
                <span className="flex items-center gap-1 group-hover/screen:text-white text-[11px]">
                  <Maximize2 className="w-3 h-3" /> Zoom
                </span>
              </div>

              <div className="relative aspect-[16/10] bg-zinc-950">
                <Image
                  src={corpTab === "cluster" ? "/case-studies/corporate_claims_cluster.png" : "/case-studies/corporate_claims.png"}
                  alt="MFine Corporate Claims and Benefits Architecture"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1">
              Corporate wallet rules, coverage tables, and hospitalization settlement flows.
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 2-COLUMN CELLS (UPI + HABIT TRACKER) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* 03: UPI Limit Clarity */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-cyan-400 font-semibold">03 / DIGIACCEL</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  INTERACTIVE PROTOTYPE
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                UPI Limit Clarity & Spend Runway
              </h4>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Reduced checkout payment anxiety by replacing reactive failure screens with an ambient pre-transaction limit meter and 1-tap bank split failover.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-800 font-mono text-xs">
                <div>
                  <span className="text-xl font-bold text-cyan-400">38%</span>
                  <span className="block text-zinc-500 text-[11px]">Dropoff Reduction</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">92%</span>
                  <span className="block text-zinc-500 text-[11px]">Limit Awareness</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-300">1 Tap</span>
                  <span className="block text-zinc-500 text-[11px]">Bank Failover</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/upi_limit_meter_flow.png",
                    alt: "UPI Limit Clarity Flow",
                    title: "UPI Limit Clarity (Digiaccel) — Full Prototype Flow",
                  })
                }
                className="relative rounded-lg overflow-hidden aspect-[16/9] border border-zinc-800 bg-black cursor-pointer group hover:border-cyan-500/40 transition-colors shadow-lg"
              >
                <Image
                  src="/case-studies/upi_limit_meter_flow.png"
                  alt="UPI Limit Clarity Screens"
                  fill
                  className="object-cover object-left-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3.5 text-xs font-mono text-white">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Zoom Interactive Flow
                  </span>
                  <span className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    Figma Prototype
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/upi_limit_meter_flow.png",
                    alt: "UPI Limit Clarity Flow",
                    title: "UPI Limit Clarity (Digiaccel) — Full Prototype Flow",
                  })
                }
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch Prototype Flow</span>
              </button>
            </div>
          </div>

          {/* 04: Habit Tracker */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-amber-400 font-semibold">04 / MOSAIC WELLNESS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(251,191,36,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  PRODUCTION APP FLOW
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                21-Day Habit & Regimen Engine
              </h4>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Shipped habit tracking on ManMatters to combat treatment churn with 1-tap daily routine logs, streak locks, and personalized WhatsApp coach checkpoints.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-800 font-mono text-xs">
                <div>
                  <span className="text-xl font-bold text-amber-400">+12%</span>
                  <span className="block text-zinc-500 text-[11px]">Purchase Conv</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">100+</span>
                  <span className="block text-zinc-500 text-[11px]">Week 1 Users</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-300">22</span>
                  <span className="block text-zinc-500 text-[11px]">Weekly Actives</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/hair_tracker.png",
                    alt: "21-Day Habit Tracker Design",
                    title: "Mosaic Wellness (ManMatters) — 21-Day Habit & Regimen Architecture",
                  })
                }
                className="relative rounded-lg p-5 border border-zinc-800 bg-black cursor-pointer group hover:border-amber-500/40 transition-colors space-y-3 font-mono text-xs shadow-lg"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-semibold text-amber-300">Regimen Stages</span>
                  <span className="text-[11px] text-zinc-500">Playbook Architecture</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-300">Days 01–07</span>
                    <span className="text-amber-400 font-medium">1-Tap Log & Cue</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-300">Days 08–14</span>
                    <span className="text-amber-400 font-medium">Coach Hotline & Streak</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-300">Days 15–21</span>
                    <span className="text-emerald-400 font-medium">Habit Anchor & Reorder</span>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5 text-zinc-400 group-hover:text-amber-300 transition-colors">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Tap to inspect screens
                  </span>
                  <span className="text-zinc-400">Expand</span>
                </div>
              </div>

              <button
                onClick={() =>
                  setLightbox({
                    src: "/case-studies/hair_tracker.png",
                    alt: "21-Day Habit Tracker Design",
                    title: "Mosaic Wellness (ManMatters) — 21-Day Habit & Regimen Architecture",
                  })
                }
                className="w-full py-2.5 px-4 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Regimen Spec</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: 3-COLUMN CELLS (FIELDWORK + KETTO + TUTEDUDE) */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800 relative">
          <span className="absolute -top-1.5 -left-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>
          <span className="absolute -top-1.5 -right-1.5 font-mono text-xs text-zinc-700 select-none z-10">+</span>

          {/* 05: Fieldwork */}
          <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 font-semibold">05 / FIELDWORK</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  Field Automation
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold font-sans text-white tracking-tight">
                Field Attendance & Geolocation
              </h4>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Project Potential x India Fellow: Built a real-time attendance tracker with live location validation (HERE API, Apps Script) and authored the 12-module Youth Resource Manual.
              </p>

              <div className="font-mono text-xs pt-2 border-t border-zinc-800/80">
                <span className="text-lg font-bold text-emerald-400">20 Months</span>
                <span className="text-zinc-500 text-xs ml-2">Rural Immersion</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/aditya_field_full.jpg",
                  alt: "Aditya Diundi Grassroots Fieldwork in Uttarakhand",
                  title: "Field Systems & Ethnography — Project Potential x India Fellow",
                })
              }
              className="relative rounded-lg overflow-hidden aspect-[4/3] border border-zinc-800 bg-black cursor-pointer group hover:border-emerald-500/40 transition-colors shadow-lg"
            >
              <Image
                src="/aditya_field_full.jpg"
                alt="Rural Fieldwork Photo"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> Kumaon (2,100m MSL)
                </span>
              </div>
            </div>
          </div>

          {/* 06: Ketto+ */}
          <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-pink-400 font-semibold">06 / KETTO</span>
                <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-semibold">
                  Recurring Giving
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold font-sans text-white tracking-tight">
                Ketto+ Recurring Crowdfunding
              </h4>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Transformed emergency one-off medical crowdfunding donors into recurring monthly subscribers with transparent impact progress feeds and 1-tap giving tiers.
              </p>

              <div className="font-mono text-xs pt-2 border-t border-zinc-800/80">
                <span className="text-lg font-bold text-pink-400">2.3x</span>
                <span className="text-zinc-500 text-xs ml-2">Repeat Donors</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/ketto_curated_flow.png",
                  alt: "Ketto+ Mobile App UI Mockup",
                  title: "Ketto+ Recurring Giving (Ketto) — Mobile Donation Flow",
                })
              }
              className="relative rounded-lg overflow-hidden aspect-[4/3] border border-zinc-800 bg-black cursor-pointer group hover:border-pink-500/40 transition-colors shadow-lg"
            >
              <Image
                src="/case-studies/ketto_curated_flow.png"
                alt="Ketto+ Mobile App Screens"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-pink-400" /> Zoom Mobile Flow
                </span>
              </div>
            </div>
          </div>

          {/* 07: TuteDude */}
          <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 bg-zinc-950/60 hover:bg-zinc-950/80 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-sky-400 font-semibold">07 / TUTEDUDE</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-semibold">
                  EdTech Web
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold font-sans text-white tracking-tight">
                Mobile Web Lecture Redesign
              </h4>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Engineered a distraction-free mobile web lecture experience with contextual note-taking drawers, code progression, and adaptive bandwidth optimization.
              </p>

              <div className="font-mono text-xs pt-2 border-t border-zinc-800/80">
                <span className="text-lg font-bold text-sky-400">+34%</span>
                <span className="text-zinc-500 text-xs ml-2">Completion Rate</span>
              </div>
            </div>

            <div
              onClick={() =>
                setLightbox({
                  src: "/case-studies/tutedude_curated_flow.png",
                  alt: "Tutedude Mentorship UI Mockup",
                  title: "TuteDude EdTech — Lecture Clutter Redesign",
                })
              }
              className="relative rounded-lg overflow-hidden aspect-[4/3] border border-zinc-800 bg-black cursor-pointer group hover:border-sky-500/40 transition-colors shadow-lg"
            >
              <Image
                src="/case-studies/tutedude_curated_flow.png"
                alt="Tutedude Mentorship Screens"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> Zoom Lecture Flow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 sm:p-8 flex flex-col justify-between items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between pb-3 border-b border-zinc-800 font-mono text-xs text-zinc-300"
          >
            <span className="font-semibold text-white">{lightbox.title}</span>
            <button
              onClick={() => setLightbox(null)}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500"
          >
            <span>Click outside or press close to exit.</span>
            <button
              onClick={() => setLightbox(null)}
              className="text-white hover:underline cursor-pointer"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
