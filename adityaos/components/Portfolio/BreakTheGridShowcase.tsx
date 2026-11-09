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
  const [pixelTab, setPixelTab] = useState<"canvas" | "voxel">("canvas");
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
              className={`text-xl sm:text-2xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Case studies & shipped software.
            </h2>
            <p
              className={`text-xs sm:text-sm font-sans max-w-2xl pt-0.5 leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Proof-of-work across frontier AI evaluation, in-browser graphics engines, enterprise
              B2B health claims, fintech payments, and grassroots systems.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK — VISUAL-FIRST HERO SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-6 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2.5">
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
                AI Healthcare Benchmark
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>3.4x ACCURACY LIFT</span>
              </span>
            </div>
          </div>

          {/* HERO VISUAL MOCKUP — 70%+ Area */}
          <div className="space-y-3">
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
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    janevalTab === "live"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Production Interface
                </button>
                <button
                  onClick={() => setJanevalTab("architecture")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
                Click image to launch interactive sandbox
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
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-xl transition-all ${
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

          {/* Underneath: Crisp Systems Craft Copy & Action Buttons */}
          <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h3
                className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Catching AI medical mistakes before they reach rural clinics.
              </h3>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Built an evaluation arena where village healthcare workers test and score AI models side-by-side. Pairwise blind evaluations established ground-truth clinical data, lifting diagnostic accuracy by 3.4x across primary health centers.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
              <a
                href="https://janeval.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
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
                className={`px-3.5 py-2.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
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
        </div>

        {/* ========================================================================= */}
        {/* 02: PIXEL ENGINE & VOXEL STUDIO — VISUAL-FIRST HERO SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-6 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2.5">
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
                In-Browser Creative Studio & Canvas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>60 FPS CANVAS · 1:1 PIXEL LOCK</span>
              </span>
            </div>
          </div>

          {/* HERO VISUAL MOCKUP — 70%+ Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div
                className={`flex items-center gap-1.5 p-1 rounded-lg border ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800"
                    : "bg-stone-100 border-stone-200"
                }`}
              >
                <button
                  onClick={() => setPixelTab("canvas")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    pixelTab === "canvas"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Normal Grid Studio
                </button>
                <button
                  onClick={() => setPixelTab("voxel")}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    pixelTab === "voxel"
                      ? isDark
                        ? "bg-zinc-800 text-white font-semibold"
                        : "bg-white text-stone-900 font-semibold shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  adityaos Desktop Shell
                </button>
              </div>
              <span
                className={`text-[11px] hidden sm:inline ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                Click canvas to launch live interactive studio
              </span>
            </div>

            <div
              onClick={() =>
                setModalData({
                  title: "Pixel Engine — Grid-Locked Canvas & Studio",
                  client: "adityaos",
                  category: "Creative Graphics & Grid Matrix",
                  overview:
                    "Interactive in-browser pixel matrix synthesis with locked orthogonal grids, procedural bitmap fonts, cellular automata, and real-time canvas serialization.",
                  isPixelEngine: true,
                  onLaunchOS,
                  primaryImage: "/case-studies/adityaos_pixel_engine_studio.png",
                  secondaryImage: "/case-studies/adityaos_pixel_engine_desktop.png",
                  primaryLabel: "Normal Grid Studio",
                  secondaryLabel: "adityaos Desktop Shell",
                  defaultMode: "pixel",
                })
              }
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-xl transition-all ${
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

              <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-black/80 flex items-center justify-center overflow-hidden">
                <Image
                  src={
                    pixelTab === "canvas"
                      ? "/case-studies/adityaos_pixel_engine_studio.png"
                      : "/case-studies/adityaos_pixel_engine_desktop.png"
                  }
                  alt="adityaos Pixel Engine & Normal Grid Studio"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Underneath: Crisp Systems Craft Copy & Action Buttons */}
          <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h3
                className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                A retro pixel art studio and sandbox built right into the browser.
              </h3>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Built as a native HTML5 Canvas subsystem operating directly within the AdityaOS desktop environment. Paint on a crisp pixel grid, simulate falling sand, and create 8-bit sound effects at a stable 60 FPS without external libraries.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
              <button
                onClick={() =>
                  setModalData({
                    title: "Pixel Engine — Grid-Locked Canvas & Studio",
                    client: "adityaos",
                    category: "Creative Graphics & Grid Matrix",
                    overview:
                      "Interactive in-browser pixel matrix synthesis with locked orthogonal grids, procedural bitmap fonts, cellular automata, and real-time canvas serialization.",
                    isPixelEngine: true,
                    onLaunchOS,
                    primaryImage: "/case-studies/adityaos_pixel_engine_studio.png",
                    secondaryImage: "/case-studies/adityaos_pixel_engine_desktop.png",
                    primaryLabel: "Normal Grid Studio",
                    secondaryLabel: "adityaos Desktop Shell",
                    defaultMode: "pixel",
                  })
                }
                className="px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
              >
                <Gamepad2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Launch Interactive Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  setModalData({
                    title: "Pixel Engine — Grid-Locked Canvas & Studio",
                    client: "adityaos",
                    category: "Creative Graphics & Grid Matrix",
                    isPixelEngine: true,
                    onLaunchOS,
                    primaryImage: "/case-studies/adityaos_pixel_engine_studio.png",
                    secondaryImage: "/case-studies/adityaos_pixel_engine_desktop.png",
                    primaryLabel: "Normal Grid Studio",
                    secondaryLabel: "adityaos Desktop Shell",
                    defaultMode: "screens",
                  })
                }
                className={`px-3.5 py-2.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
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
        </div>

        {/* ========================================================================= */}
        {/* 03: CORPORATE HEALTH BENEFITS & CLAIMS (MFINE) — VISUAL-FIRST HERO SHOWCASE */}
        {/* ========================================================================= */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 space-y-6 relative transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/50 hover:bg-[#0c0e14]/70"
              : "border-stone-200 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2.5">
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
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>100K+ DAU · &lt; 15M APPROVALS</span>
              </span>
            </div>
          </div>

          {/* HERO VISUAL MOCKUP — 70%+ Area */}
          <div className="space-y-3">
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
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
                Click image to launch interactive Figma prototype
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
                  defaultMode: "screens",
                })
              }
              className={`group/screen relative rounded-xl overflow-hidden border cursor-pointer shadow-xl transition-all ${
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

          {/* Underneath: Crisp Systems Craft Copy & Action Buttons */}
          <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h3
                className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Speeding up emergency hospital approvals to under 15 minutes.
              </h3>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Designed the corporate benefits wallet and claim submission flow for 100,000+ employees. Real-time policy validation replaced paperwork delays with instant cashless triage, reducing emergency hospital approval wait times below 15 minutes.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
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
                className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group/btn"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Test Figma Prototype</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>

              <a
                href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-2.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800"
                }`}
              >
                <span>Figma</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 2-COLUMN VISUAL-FIRST CARDS (UPI CLARITY + HABIT TRACKER) */}
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
            className={`p-8 sm:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            {/* Visual Hero Mockup First */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">04 / DIGIACCEL · FINTECH</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  -38% DROPOFFS
                </span>
              </div>

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
                    defaultMode: "screens",
                  })
                }
                className={`relative rounded-xl overflow-hidden aspect-[16/10] border cursor-pointer group shadow-md transition-all ${
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3.5 text-xs font-mono text-white">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Tap to preview
                  </span>
                  <span className="text-[11px] text-cyan-300 font-semibold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    Figma Interactive
                  </span>
                </div>
              </div>
            </div>

            {/* Copy & Actions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4
                  className={`text-base sm:text-lg font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Preventing failed UPI payments before users tap 'Pay'.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Added an ambient bank balance runway meter and 1-tap failover checkout flow. Alerts users of daily transaction caps before payment initiation, cutting checkout drop-offs by 38%.
                </p>
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
            className={`p-8 sm:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            {/* Visual Hero Mockup First */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold">05 / MOSAIC WELLNESS · HEALTHTECH</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  +12% CONTINUATION
                </span>
              </div>

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
                    defaultMode: "screens",
                  })
                }
                className={`relative rounded-xl p-4 border cursor-pointer group space-y-2 font-mono text-xs shadow-md transition-all ${
                  isDark
                    ? "border-zinc-800 bg-[#090b10] hover:border-amber-500/50"
                    : "border-stone-200 bg-stone-50 hover:border-amber-600/50"
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-semibold text-amber-400">Regimen Playbook Flow</span>
                  <span className="text-[11px] text-zinc-500">3-Stage Micro-Commitments</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Days 01–07</span>
                    <span className="text-amber-400 font-medium">1-Tap Routine Log</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Days 08–14</span>
                    <span className="text-amber-400 font-medium">Doctor WhatsApp Check-in</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white border-stone-200"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Days 15–21</span>
                    <span className="text-emerald-500 font-medium">Habit Anchor Milestone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy & Actions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4
                  className={`text-base sm:text-lg font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Helping patients stick to medical routines during the first three weeks.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Paired 1-tap daily habit logs with milestone streaks and automated WhatsApp doctor check-ins. Micro-commitments resolved early treatment churn, driving a +12% lift in treatment continuation.
                </p>
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
        {/* ROW 3: 3-COLUMN VISUAL-FIRST CARDS (FIELDWORK + KETTO + TUTEDUDE) */}
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
            className={`p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">06 / PROJECT POTENTIAL</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                  20 MOS FIELDWORK
                </span>
              </div>

              <div
                onClick={() =>
                  setModalData({
                    title: "Grassroots Fieldwork & Ethnography",
                    client: "Project Potential x India Fellow",
                    category: "Rural Systems & Youth Manual",
                    primaryImage: "/aditya_field_full.jpg",
                    primaryLabel: "Rajasthan Fieldwork",
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
                  alt="Rural Fieldwork Photo in Rajasthan"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Rajasthan Fieldwork
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4
                className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Offline GPS check-ins for field teams in rural operations.
              </h4>
              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Designed a lightweight attendance tool that logs verified location check-ins without internet and auto-syncs when signal returns. Eliminated ghost attendance across 20 months of rural operations.
              </p>
            </div>
          </div>

          {/* 07: Ketto+ */}
          <div
            className={`p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-500 font-bold">07 / KETTO · CROWDFUNDING</span>
                <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-semibold">
                  2.3X REPEAT DONORS
                </span>
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
                    defaultMode: "screens",
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-pink-400" /> Test Figma Prototype
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4
                className={`text-base sm:text-lg font-semibold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Turning one-time emergency donors into monthly patient sponsors.
              </h4>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Replaced one-off donation asks with recurring micro-giving tiers and transparent patient recovery updates, doubling repeat donor retention for urgent surgeries.
              </p>
            </div>
          </div>

          {/* 08: TuteDude */}
          <div
            className={`p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/70"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-500 font-bold">08 / TUTEDUDE · EDTECH</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-semibold">
                  +34% COMPLETION
                </span>
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
                    defaultMode: "screens",
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-mono text-white flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-sky-400" /> Test Figma Prototype
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4
                className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Connecting stuck coding students to live mentors in under 5 minutes.
              </h4>
              <p
                className={`text-sm font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Streamlined the mobile lecture player with prioritized doubt resolution queues, connecting students directly to code mentors and lifting weekly course completion by +34%.
              </p>
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
