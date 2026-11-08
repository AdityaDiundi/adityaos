"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  Maximize2,
  Globe,
  Sparkles,
  Layers,
  Gamepad2,
  Terminal,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import {
  InteractivePrototypeModal,
  PrototypeModalData,
} from "./InteractivePrototypeModal";

interface BreakTheGridShowcaseProps {
  onLaunchOS?: () => void;
}

export function BreakTheGridShowcase({ onLaunchOS }: BreakTheGridShowcaseProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [modalData, setModalData] = useState<PrototypeModalData | null>(null);
  const [janevalTab, setJanevalTab] = useState<"live" | "architecture">("live");
  const [pixelTab, setPixelTab] = useState<"voxel" | "canvas">("voxel");
  const [corpTab, setCorpTab] = useState<"cluster" | "full">("cluster");

  return (
    <section id="work" className="relative">
      <div
        className={`max-w-7xl mx-auto border-x relative transition-colors ${
          isDark
            ? "border-zinc-800 bg-[#090b10]/40"
            : "border-stone-200 bg-[#FBFBF9]"
        }`}
      >
        {/* ========================================================================= */}
        {/* Section Header */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 relative ${
            isDark ? "border-zinc-800" : "border-stone-200"
          }`}
        >
          <div className="space-y-3">
            <div
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              01 // Selected Works
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Case studies & shipped software.
            </h2>
            <p
              className={`text-sm sm:text-base font-sans max-w-2xl pt-1 leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Proof-of-work across frontier AI evaluation, in-browser graphics engines, enterprise
              B2B health claims, fintech payments, and grassroots systems.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK — UNIFIED COHESIVE SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-8 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Project Meta & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="text-emerald-500 font-bold">01</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span
                className={`font-semibold uppercase tracking-wider ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Josh Talks
              </span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                AI Evaluation Arena
              </span>

              {/* Live Build Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE BENCHMARK</span>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <a
                href="https://janeval.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
              >
                <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Launch Live Arena</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={() =>
                  setModalData({
                    title: "JANEVAL — Human-Centered AI Benchmark",
                    client: "Josh Talks",
                    category: "Frontier AI Evaluation",
                    overview:
                      "A double-blind pairwise evaluation framework benchmarking whether generative AI models depict rural Indian public health with medical and sociological fidelity.",
                    liveUrl: "https://janeval.vercel.app/",
                    primaryImage: "/case-studies/janeval_live.png",
                    secondaryImage: "/case-studies/janeval_page-3.png",
                    primaryLabel: "Live Arena Interface",
                    secondaryLabel: "3-Stage Pipeline Architecture",
                    defaultMode: "live",
                  })
                }
                className={`px-3.5 py-2 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Sandbox</span>
              </button>
            </div>
          </div>

          {/* Project Title, Summary, and Key Proof Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h3
                className={`text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                JANEVAL Benchmark
              </h3>
              <p
                className={`text-sm sm:text-base font-medium font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Ground-truth AI evaluation arena for Indian public health.
              </p>
              <p
                className={`text-sm font-sans leading-relaxed max-w-3xl ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Frontier vision models frequently hallucinate clinical realities in rural
                India—substituting digital bathroom scales in primary Anganwadi clinics
                where hanging spring scales are mandatory, or generating garbled Devanagari
                script. JANEVAL introduces an evidence-backed double-blind pairwise
                evaluation arena tested directly with frontline public health workers.
              </p>
            </div>

            {/* Metrics Trio */}
            <div
              className={`lg:col-span-4 grid grid-cols-3 gap-3 p-4 rounded-xl border font-mono ${
                isDark
                  ? "bg-[#090b10] border-zinc-800/80"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div>
                <div className="text-2xl font-bold text-emerald-500">120+</div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Pairwise Votes
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  3.4x
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Fidelity Lift
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-zinc-300" : "text-stone-700"
                  }`}
                >
                  12
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Evaluators
                </div>
              </div>
            </div>
          </div>

          {/* Unified Showcase Window */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div
                className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800"
                    : "bg-stone-100 border-stone-200"
                }`}
              >
                <button
                  onClick={() => setJanevalTab("live")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    janevalTab === "live"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Production Capture
                </button>
                <button
                  onClick={() => setJanevalTab("architecture")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    janevalTab === "architecture"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  3-Stage Pipeline
                </button>
              </div>
              <span
                className={`text-[11px] hidden sm:inline ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                Click image to launch interactive sandbox modal
              </span>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "JANEVAL — Human-Centered AI Benchmark",
                  client: "Josh Talks",
                  category: "Frontier AI Evaluation",
                  overview:
                    "Ground-truth AI evaluation arena for Indian public health, tested with frontline healthcare workers.",
                  liveUrl: "https://janeval.vercel.app/",
                  primaryImage:
                    janevalTab === "live"
                      ? "/case-studies/janeval_live.png"
                      : "/case-studies/janeval_page-3.png",
                  secondaryImage:
                    janevalTab === "live"
                      ? "/case-studies/janeval_page-3.png"
                      : "/case-studies/janeval_live.png",
                  primaryLabel: "Production Interface",
                  secondaryLabel: "Pipeline Architecture",
                  defaultMode: "live",
                })
              }
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-lg transition-all ${
                isDark
                  ? "bg-black border-zinc-800 hover:border-emerald-500/50"
                  : "bg-stone-100 border-stone-200 hover:border-emerald-600/50"
              }`}
            >
              <div
                className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
                  isDark
                    ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-emerald-500">
                    Live Production Elo Arena
                  </span>
                  <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
                  <span>janeval.vercel.app</span>
                </div>
                <span className="flex items-center gap-1 group-hover/screen:text-emerald-500 transition-colors text-[11px]">
                  <Maximize2 className="w-3.5 h-3.5" /> Launch Sandbox
                </span>
              </div>

              <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-black/60">
                <Image
                  src={
                    janevalTab === "live"
                      ? "/case-studies/janeval_live.png"
                      : "/case-studies/janeval_page-3.png"
                  }
                  alt="JANEVAL AI Healthcare Evaluation Arena"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 02: PIXEL ENGINE & VOXEL STUDIO — UNIFIED COHESIVE SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-8 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Project Meta & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="text-cyan-400 font-bold">02</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span
                className={`font-semibold uppercase tracking-wider ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                adityaos
              </span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                Creative Tooling & Graphics Engine
              </span>

              {/* Live Sandbox Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>LIVE SANDBOX ENGINE</span>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <button
                onClick={() =>
                  setModalData({
                    title: "Pixel Engine & 2.5D Voxel Studio",
                    client: "adityaos",
                    category: "Creative Graphics & Voxel Engine",
                    overview:
                      "Interactive in-browser pixel & voxel synthesis with real-time 3D projection, procedural bitmap fonts, and cellular automata.",
                    isPixelEngine: true,
                    onLaunchOS,
                    primaryImage: "/gallery/voxel_3d_projection.png",
                    secondaryImage: "/gallery/pixel_engine_canvas.png",
                    primaryLabel: "Voxel 3D Projection",
                    secondaryLabel: "Pixel Canvas Specification",
                    defaultMode: "pixel",
                  })
                }
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
              >
                <Gamepad2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Launch Interactive Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  setModalData({
                    title: "Pixel Engine & 2.5D Voxel Studio",
                    client: "adityaos",
                    category: "Creative Graphics & Voxel Engine",
                    isPixelEngine: true,
                    onLaunchOS,
                    primaryImage: "/gallery/voxel_3d_projection.png",
                    secondaryImage: "/gallery/pixel_engine_canvas.png",
                    primaryLabel: "Voxel 3D Projection",
                    secondaryLabel: "Pixel Canvas Specification",
                    defaultMode: "screens",
                  })
                }
                className={`px-3.5 py-2 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Specs</span>
              </button>
            </div>
          </div>

          {/* Project Title, Summary, and Key Proof Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h3
                className={`text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Pixel Engine & 2.5D Voxel Studio
              </h3>
              <p
                className={`text-sm sm:text-base font-medium font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                In-browser isometric voxel synthesis, procedural bitmap fonts, and interactive canvas audio.
              </p>
              <p
                className={`text-sm font-sans leading-relaxed max-w-3xl ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Engineered as a lightweight, zero-dependency creative studio subsystem for adityaos.
                Features real-time 2D-to-2.5D isometric voxel projection, procedural typography stamping
                with a custom 5×5 bitmap font, bilateral symmetry drawing, Conway&apos;s Game of Life
                simulation, falling sand cellular automata, and interactive Web Audio harmonic synthesis.
              </p>
            </div>

            {/* Metrics Trio */}
            <div
              className={`lg:col-span-4 grid grid-cols-3 gap-3 p-4 rounded-xl border font-mono ${
                isDark
                  ? "bg-[#090b10] border-zinc-800/80"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div>
                <div className="text-2xl font-bold text-cyan-400">60 FPS</div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Canvas Rate
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  2.5D
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Voxel Projection
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-zinc-300" : "text-stone-700"
                  }`}
                >
                  5 Modes
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Draw & Cellular
                </div>
              </div>
            </div>
          </div>

          {/* Unified Showcase Window */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div
                className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800"
                    : "bg-stone-100 border-stone-200"
                }`}
              >
                <button
                  onClick={() => setPixelTab("voxel")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    pixelTab === "voxel"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Voxel 3D Projection
                </button>
                <button
                  onClick={() => setPixelTab("canvas")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    pixelTab === "canvas"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Pixel Canvas Studio
                </button>
              </div>
              <span
                className={`text-[11px] hidden sm:inline ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                Click image to launch live interactive studio sandbox
              </span>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "Pixel Engine & 2.5D Voxel Studio",
                  client: "adityaos",
                  category: "Creative Graphics & Voxel Engine",
                  isPixelEngine: true,
                  onLaunchOS,
                  primaryImage: "/gallery/voxel_3d_projection.png",
                  secondaryImage: "/gallery/pixel_engine_canvas.png",
                  primaryLabel: "Voxel 3D Projection",
                  secondaryLabel: "Pixel Canvas Specification",
                  defaultMode: "pixel",
                })
              }
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-lg transition-all ${
                isDark
                  ? "bg-black border-zinc-800 hover:border-cyan-500/50"
                  : "bg-stone-100 border-stone-200 hover:border-cyan-600/50"
              }`}
            >
              <div
                className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
                  isDark
                    ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold text-cyan-400">
                    Live Interactive Studio
                  </span>
                  <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
                  <span>adityaos Pixel Engine</span>
                </div>
                <span className="flex items-center gap-1 group-hover/screen:text-cyan-400 transition-colors text-[11px]">
                  <Maximize2 className="w-3.5 h-3.5" /> Launch Live Studio
                </span>
              </div>

              <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-black/80 flex items-center justify-center p-2">
                <Image
                  src={
                    pixelTab === "voxel"
                      ? "/gallery/voxel_3d_projection.png"
                      : "/gallery/pixel_engine_canvas.png"
                  }
                  alt="Pixel Engine & Voxel Studio"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 03: CORPORATE HEALTH BENEFITS & CLAIMS (MFINE) — UNIFIED COHESIVE SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-8 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Project Meta & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <span className="text-indigo-400 font-bold">03</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span
                className={`font-semibold uppercase tracking-wider ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                MFine
              </span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                B2B Benefits & Claims Architecture
              </span>

              {/* Interactive Spec Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>INTERACTIVE FIGMA SPEC</span>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <button
                onClick={() =>
                  setModalData({
                    title: "Corporate Health Benefits & Claim Settlement",
                    client: "MFine",
                    category: "B2B InsurTech & Enterprise Design System",
                    figmaUrl:
                      "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
                    primaryImage: "/case-studies/corporate_claims_cluster.png",
                    secondaryImage: "/case-studies/corporate_claims.png",
                    primaryLabel: "Wallet Policy Matrix",
                    secondaryLabel: "Full Canvas Architecture",
                    defaultMode: "figma",
                  })
                }
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Test Figma Prototype</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-2 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800"
                }`}
              >
                <span>Open in Figma</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Project Title, Summary, and Key Proof Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h3
                className={`text-2xl sm:text-3xl lg:text-4xl font-sans font-bold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Corporate Health Benefits & Claim Settlement
              </h3>
              <p
                className={`text-sm sm:text-base font-medium font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                B2B onboarding, wallet management & cashless triage for 100K+ DAU.
              </p>
              <p
                className={`text-sm font-sans leading-relaxed max-w-3xl ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                At MFine, designed B2B corporate onboarding and wallet management tools
                enabling HR enterprise admins to configure employee health allowances.
                Redesigned the patient claim settlement flow for 100K+ daily active users to
                eliminate TPA delays and cashless hospitalization rejections.
              </p>
            </div>

            {/* Metrics Trio */}
            <div
              className={`lg:col-span-4 grid grid-cols-3 gap-3 p-4 rounded-xl border font-mono ${
                isDark
                  ? "bg-[#090b10] border-zinc-800/80"
                  : "bg-stone-50 border-stone-200"
              }`}
            >
              <div>
                <div className="text-2xl font-bold text-indigo-400">&lt; 15m</div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Pre-Auth Triage
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  100K+
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Daily Users
                </div>
              </div>
              <div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-zinc-300" : "text-stone-700"
                  }`}
                >
                  99.2%
                </div>
                <div
                  className={`text-[11px] font-sans pt-0.5 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Audit Reliability
                </div>
              </div>
            </div>
          </div>

          {/* Unified Showcase Window */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div
                className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800"
                    : "bg-stone-100 border-stone-200"
                }`}
              >
                <button
                  onClick={() => setCorpTab("cluster")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    corpTab === "cluster"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Modal Policy Matrix
                </button>
                <button
                  onClick={() => setCorpTab("full")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    corpTab === "full"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Full Board Architecture
                </button>
              </div>
              <span
                className={`text-[11px] hidden sm:inline ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                Click image to launch interactive Figma prototype embed
              </span>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "Corporate Health Benefits & Claim Settlement",
                  client: "MFine",
                  category: "B2B InsurTech & Enterprise Design System",
                  figmaUrl:
                    "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
                  primaryImage:
                    corpTab === "cluster"
                      ? "/case-studies/corporate_claims_cluster.png"
                      : "/case-studies/corporate_claims.png",
                  secondaryImage:
                    corpTab === "cluster"
                      ? "/case-studies/corporate_claims.png"
                      : "/case-studies/corporate_claims_cluster.png",
                  primaryLabel: "Wallet Policy Matrix",
                  secondaryLabel: "Full Canvas",
                  defaultMode: "figma",
                })
              }
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-lg transition-all ${
                isDark
                  ? "bg-black border-zinc-800 hover:border-indigo-500/50"
                  : "bg-stone-100 border-stone-200 hover:border-indigo-600/50"
              }`}
            >
              <div
                className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
                  isDark
                    ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <span>mfine.co/corporate-benefits — Design System Specification</span>
                <span className="flex items-center gap-1 group-hover/screen:text-indigo-400 transition-colors text-[11px]">
                  <Maximize2 className="w-3.5 h-3.5" /> Launch Interactive Figma Embed
                </span>
              </div>

              <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-black/80 flex items-center justify-center p-3 sm:p-5">
                <Image
                  src={
                    corpTab === "cluster"
                      ? "/case-studies/corporate_claims_cluster.png"
                      : "/case-studies/corporate_claims.png"
                  }
                  alt="MFine Corporate Claims and Benefits Architecture"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 2-COLUMN UNIFIED CARDS (UPI CLARITY + HABIT TRACKER) */}
        {/* ========================================================================= */}
        <div
          className={`border-b grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x relative ${
            isDark
              ? "border-zinc-800 divide-zinc-800"
              : "border-stone-200 divide-stone-200"
          }`}
        >
          {/* 04: UPI Limit Clarity */}
          <div
            className={`p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">04 / DIGIACCEL</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  INTERACTIVE PROTOTYPE
                </span>
              </div>

              <h4
                className={`text-xl sm:text-2xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                UPI Limit Clarity & Spend Runway
              </h4>
              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Reduced checkout payment anxiety by replacing reactive failure screens with
                an ambient pre-transaction limit meter and 1-tap bank split failover.
              </p>

              <div
                className={`grid grid-cols-3 gap-3 pt-3 border-t font-mono text-xs ${
                  isDark ? "border-zinc-800/80" : "border-stone-200"
                }`}
              >
                <div>
                  <span className="text-xl font-bold text-cyan-400">38%</span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Dropoff Reduction
                  </span>
                </div>
                <div>
                  <span
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    92%
                  </span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Limit Awareness
                  </span>
                </div>
                <div>
                  <span
                    className={`text-xl font-bold ${
                      isDark ? "text-zinc-300" : "text-stone-700"
                    }`}
                  >
                    1 Tap
                  </span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Bank Failover
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div
                onClick={() =>
                  setModalData({
                    title: "UPI Limit Clarity & Spend Runway",
                    client: "Digiaccel",
                    category: "Fintech Payments & Error Recovery",
                    figmaUrl:
                      "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
                    primaryImage: "/case-studies/upi_limit_meter_flow.png",
                    primaryLabel: "Full Screen Flow Stages",
                    defaultMode: "figma",
                  })
                }
                className={`relative rounded-xl overflow-hidden aspect-[16/9] border cursor-pointer group shadow-md transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-cyan-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-cyan-600/50"
                }`}
              >
                <Image
                  src="/case-studies/upi_limit_meter_flow.png"
                  alt="UPI Limit Clarity Screens"
                  fill
                  className="object-cover object-left-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3.5 text-xs font-mono text-white">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Test Figma Prototype
                  </span>
                  <span className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    Interactive
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setModalData({
                    title: "UPI Limit Clarity & Spend Runway",
                    client: "Digiaccel",
                    category: "Fintech Payments & Error Recovery",
                    figmaUrl:
                      "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
                    primaryImage: "/case-studies/upi_limit_meter_flow.png",
                    primaryLabel: "Full Screen Flow Stages",
                    defaultMode: "figma",
                  })
                }
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch Interactive Prototype</span>
              </button>
            </div>
          </div>

          {/* 05: Habit Tracker */}
          <div
            className={`p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-7 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold">05 / MOSAIC WELLNESS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  PRODUCTION APP FLOW
                </span>
              </div>

              <h4
                className={`text-xl sm:text-2xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                21-Day Habit & Regimen Engine
              </h4>
              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Shipped habit tracking on ManMatters to combat treatment churn with 1-tap
                daily routine logs, streak locks, and personalized WhatsApp coach
                checkpoints.
              </p>

              <div
                className={`grid grid-cols-3 gap-3 pt-3 border-t font-mono text-xs ${
                  isDark ? "border-zinc-800/80" : "border-stone-200"
                }`}
              >
                <div>
                  <span className="text-xl font-bold text-amber-400">+12%</span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Purchase Conv
                  </span>
                </div>
                <div>
                  <span
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    100+
                  </span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Week 1 Users
                  </span>
                </div>
                <div>
                  <span
                    className={`text-xl font-bold ${
                      isDark ? "text-zinc-300" : "text-stone-700"
                    }`}
                  >
                    22
                  </span>
                  <span
                    className={`block text-[11px] font-sans ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    Weekly Actives
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div
                onClick={() =>
                  setModalData({
                    title: "21-Day Habit & Hair Tracker",
                    client: "Mosaic Wellness (ManMatters)",
                    category: "D2C HealthTech Retention",
                    figmaUrl:
                      "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
                    primaryImage: "/case-studies/hair_tracker.png",
                    primaryLabel: "Habit Engine Specification",
                    defaultMode: "figma",
                  })
                }
                className={`relative rounded-xl p-5 border cursor-pointer group space-y-3 font-mono text-xs shadow-md transition-all ${
                  isDark
                    ? "border-zinc-800 bg-[#090b10] hover:border-amber-500/50"
                    : "border-stone-200 bg-stone-50 hover:border-amber-600/50"
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-semibold text-amber-400">Regimen Stages</span>
                  <span
                    className={`text-[11px] ${
                      isDark ? "text-zinc-500" : "text-stone-400"
                    }`}
                  >
                    Playbook Architecture
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isDark
                        ? "bg-zinc-900/80 border-zinc-800"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>
                      Days 01–07
                    </span>
                    <span className="text-amber-400 font-medium">1-Tap Log & Cue</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isDark
                        ? "bg-zinc-900/80 border-zinc-800"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>
                      Days 08–14
                    </span>
                    <span className="text-amber-400 font-medium">
                      Coach Hotline & Streak
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      isDark
                        ? "bg-zinc-900/80 border-zinc-800"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>
                      Days 15–21
                    </span>
                    <span className="text-emerald-500 font-medium">
                      Habit Anchor & Reorder
                    </span>
                  </div>
                </div>
                <div
                  className={`pt-1 flex items-center justify-between text-[11px] ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  <span className="flex items-center gap-1.5 group-hover:text-amber-400 transition-colors">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> Tap to test Figma prototype
                  </span>
                  <span>Interactive</span>
                </div>
              </div>

              <button
                onClick={() =>
                  setModalData({
                    title: "21-Day Habit & Hair Tracker",
                    client: "Mosaic Wellness (ManMatters)",
                    category: "D2C HealthTech Retention",
                    figmaUrl:
                      "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
                    primaryImage: "/case-studies/hair_tracker.png",
                    primaryLabel: "Habit Engine Specification",
                    defaultMode: "figma",
                  })
                }
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch Interactive Prototype</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: 3-COLUMN UNIFIED CARDS (FIELDWORK + KETTO + TUTEDUDE) */}
        {/* ========================================================================= */}
        <div
          className={`border-b grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x relative ${
            isDark
              ? "border-zinc-800 divide-zinc-800"
              : "border-stone-200 divide-stone-200"
          }`}
        >
          {/* 06: Fieldwork */}
          <div
            className={`p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">06 / FIELDWORK</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                  Field Automation
                </span>
              </div>

              <h4
                className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Field Attendance & Geolocation
              </h4>

              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Project Potential x India Fellow: Built a real-time attendance tracker with
                live location validation (HERE API, Apps Script) and authored the 12-module
                Youth Resource Manual.
              </p>

              <div
                className={`font-mono text-xs pt-2 border-t ${
                  isDark ? "border-zinc-800/80" : "border-stone-200"
                }`}
              >
                <span className="text-lg font-bold text-emerald-500">20 Months</span>
                <span
                  className={`text-xs ml-2 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Rural Immersion
                </span>
              </div>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "Grassroots Fieldwork & Ethnography",
                  client: "Project Potential x India Fellow",
                  category: "Rural Systems & Youth Manual",
                  primaryImage: "/aditya_field_full.jpg",
                  primaryLabel: "Kumaon Fieldwork (2,100m MSL)",
                  defaultMode: "screens",
                })
              }
              className={`relative rounded-xl overflow-hidden aspect-[4/3] border cursor-pointer group shadow-md transition-all ${
                isDark
                  ? "border-zinc-800 bg-black hover:border-emerald-500/50"
                  : "border-stone-200 bg-stone-100 hover:border-emerald-600/50"
              }`}
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

          {/* 07: Ketto+ */}
          <div
            className={`p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-500 font-bold">07 / KETTO</span>
                <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-semibold">
                  Recurring Giving
                </span>
              </div>

              <h4
                className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Ketto+ Recurring Crowdfunding
              </h4>

              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Transformed emergency one-off medical crowdfunding donors into recurring
                monthly subscribers with transparent impact progress feeds and 1-tap
                giving tiers.
              </p>

              <div
                className={`font-mono text-xs pt-2 border-t ${
                  isDark ? "border-zinc-800/80" : "border-stone-200"
                }`}
              >
                <span className="text-lg font-bold text-pink-500">2.3x</span>
                <span
                  className={`text-xs ml-2 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Repeat Donors
                </span>
              </div>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "Ketto+ Recurring Crowdfunding Platform",
                  client: "Ketto",
                  category: "Fintech Crowdfunding & Recurring Giving",
                  figmaUrl:
                    "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755",
                  primaryImage: "/case-studies/ketto_curated_flow.png",
                  primaryLabel: "Mobile Donation Flow",
                  defaultMode: "figma",
                })
              }
              className={`relative rounded-xl overflow-hidden aspect-[4/3] border cursor-pointer group shadow-md transition-all ${
                isDark
                  ? "border-zinc-800 bg-black hover:border-pink-500/50"
                  : "border-stone-200 bg-stone-100 hover:border-pink-600/50"
              }`}
            >
              <Image
                src="/case-studies/ketto_curated_flow.png"
                alt="Ketto+ Mobile App Screens"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-pink-400" /> Test Figma Prototype
                </span>
              </div>
            </div>
          </div>

          {/* 08: TuteDude */}
          <div
            className={`p-7 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-500 font-bold">08 / TUTEDUDE</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-semibold">
                  EdTech Web
                </span>
              </div>

              <h4
                className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Mobile Web Lecture Redesign
              </h4>

              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Engineered a distraction-free mobile web lecture experience with
                contextual note-taking drawers, code progression, and adaptive bandwidth
                optimization.
              </p>

              <div
                className={`font-mono text-xs pt-2 border-t ${
                  isDark ? "border-zinc-800/80" : "border-stone-200"
                }`}
              >
                <span className="text-lg font-bold text-sky-500">+34%</span>
                <span
                  className={`text-xs ml-2 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Completion Rate
                </span>
              </div>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "TuteDude EdTech Web Clutter Redesign",
                  client: "TuteDude",
                  category: "EdTech Learning Experience",
                  figmaUrl:
                    "https://www.figma.com/design/hOmOAB7mZGXb8HBAy9TpHw/Tutedude-Assignment?node-id=220-1386",
                  primaryImage: "/case-studies/tutedude_curated_flow.png",
                  primaryLabel: "Lecture Interface Flow",
                  defaultMode: "figma",
                })
              }
              className={`relative rounded-xl overflow-hidden aspect-[4/3] border cursor-pointer group shadow-md transition-all ${
                isDark
                  ? "border-zinc-800 bg-black hover:border-sky-500/50"
                  : "border-stone-200 bg-stone-100 hover:border-sky-600/50"
              }`}
            >
              <Image
                src="/case-studies/tutedude_curated_flow.png"
                alt="Tutedude Mentorship Screens"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> Test Figma Prototype
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Prototype Modal */}
      <InteractivePrototypeModal
        data={modalData}
        onClose={() => setModalData(null)}
      />
    </section>
  );
}
