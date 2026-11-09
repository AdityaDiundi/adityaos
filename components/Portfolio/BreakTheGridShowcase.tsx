"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Maximize2,
  Globe,
  Terminal,
  Check,
  ShieldCheck,
  Activity,
  Zap,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import {
  InteractivePrototypeModal,
  PrototypeModalData,
} from "./InteractivePrototypeModal";

interface BreakTheGridShowcaseProps {
  onLaunchOS?: () => void;
}

/* ========================================================================= */
/* 1. Sleek Minimalist Browser Window Frame */
/* ========================================================================= */
function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  return (
    <div
      className={`w-full rounded-xl overflow-hidden border shadow-lg transition-all duration-300 group-hover/stage:shadow-2xl group-hover/stage:-translate-y-1 ${
        isDark
          ? "bg-[#111318] border-zinc-700/60 shadow-black/80"
          : "bg-white border-stone-200/90 shadow-stone-300/40"
      }`}
    >
      {/* Top Browser Bar */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between gap-3 text-xs font-mono select-none ${
          isDark
            ? "bg-[#181a20] border-zinc-800 text-zinc-400"
            : "bg-stone-100 border-stone-200 text-stone-500"
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        {/* Minimalist Address Pill */}
        <div
          className={`flex-1 max-w-[220px] mx-auto px-2.5 py-0.5 rounded-md text-[10px] flex items-center justify-center gap-1.5 truncate border ${
            isDark
              ? "bg-[#0d0e12] border-zinc-800 text-zinc-300"
              : "bg-white border-stone-200 text-stone-700"
          }`}
        >
          <span className="opacity-50 text-[9px]">🔒</span>
          <span className="truncate">{url}</span>
        </div>

        <div className="w-10 shrink-0 flex justify-end">
          <span className="w-1.5 h-1.5 rounded-full opacity-40 bg-current" />
        </div>
      </div>

      {/* Frame Body */}
      <div className="relative overflow-hidden bg-black/40 aspect-[16/10]">
        {children}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. Sleek Floating Mobile Device Frame */
/* ========================================================================= */
function MobileDeviceFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  return (
    <div
      className={`w-full max-w-[210px] sm:max-w-[230px] mx-auto rounded-[28px] p-2 border-2 shadow-xl transition-all duration-300 group-hover/stage:-translate-y-1.5 group-hover/stage:shadow-2xl ${
        isDark
          ? "bg-[#181a22] border-zinc-700/70 shadow-black/90"
          : "bg-stone-200 border-stone-300 shadow-stone-300/50"
      }`}
    >
      <div className="relative rounded-[20px] overflow-hidden bg-black border border-black/40 aspect-[9/18]">
        {/* Dynamic Island Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800 mr-1.5" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
        </div>

        {/* Screen Content */}
        <div className="w-full h-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. Stage Canvas (The surrounding designed backdrop) */
/* ========================================================================= */
function StageCanvas({
  children,
  accentTint,
  label,
  onClick,
}: {
  children: React.ReactNode;
  accentTint?: string;
  label?: string;
  onClick?: () => void;
}) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  return (
    <div
      onClick={onClick}
      className={`group/stage relative rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center border border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-[#11131a] to-[#0a0b0f] border-zinc-800 hover:border-zinc-600"
          : "bg-gradient-to-b from-stone-100/90 to-stone-50/50 border-stone-200 hover:border-stone-300"
      }`}
      style={{
        boxShadow: accentTint ? `0 0 40px -10px ${accentTint}` : undefined,
      }}
    >
      {/* Delicate Micro-Dot Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="w-full relative z-10 flex items-center justify-center">
        {children}
      </div>

      {label && (
        <div className="w-full mt-3 pt-2 border-t border-dashed border-stone-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-zinc-500">
          <span className="truncate">{label}</span>
          <span className="flex items-center gap-1 group-hover/stage:text-stone-900 dark:group-hover/stage:text-zinc-200 transition-colors shrink-0">
            <Maximize2 className="w-3 h-3" /> Expand
          </span>
        </div>
      )}
    </div>
  );
}

export function BreakTheGridShowcase({ onLaunchOS }: BreakTheGridShowcaseProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [modalData, setModalData] = useState<PrototypeModalData | null>(null);

  return (
    <section id="work" className="relative">
      <div
        className={`max-w-7xl mx-auto border-x border-dashed relative transition-colors ${
          isDark
            ? "border-zinc-800/80 bg-[#090b10]/40"
            : "border-stone-200/80 bg-[#FBFBF9]"
        }`}
      >
        {/* ========================================================================= */}
        {/* Section Header */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-dashed p-6 sm:p-8 transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
          }`}
        >
          <div className="space-y-1.5">
            <div
              className={`text-[11px] font-mono uppercase tracking-wider ${
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
              className={`text-xs sm:text-sm font-sans max-w-2xl leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Frontier AI evaluation benchmarks, interactive browser graphics engines, enterprise
              health claims, fintech payment clarity, and grassroots field systems.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK — DESIGNED DESKTOP BROWSER FRAME */}
        {/* ========================================================================= */}
        <article
          className={`border-b border-dashed p-6 sm:p-8 space-y-5 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
              : "border-stone-200/80 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-500">01</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Josh Talks</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                2024 · AI Healthcare Benchmark
              </span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}
            >
              3.4x Accuracy Lift
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-3">
              <h3
                className={`text-base sm:text-lg font-sans font-semibold tracking-tight ${
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
                A blind pairwise evaluation framework designed to benchmark frontier vision models
                on clinical and cultural accuracy across rural Indian public health scenarios. Built
                an arena where frontline health workers score models side-by-side with ground-truth
                rubrics.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <Link
                  href="/work/janeval"
                  className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm"
                      : "bg-stone-900 text-white hover:bg-black shadow-sm"
                  }`}
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://janeval.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                      : "border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Arena</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right: Designed Desktop Browser Frame */}
            <div className="lg:col-span-5">
              <StageCanvas
                accentTint="rgba(16, 185, 129, 0.15)"
                label="JANEVAL Pairwise Blind Elo Arena"
                onClick={() =>
                  setModalData({
                    title: "JANEVAL — Human-Centered AI Benchmark",
                    client: "Josh Talks",
                    category: "Frontier AI Evaluation",
                    overview:
                      "Ground-truth AI evaluation arena for Indian public health, tested with frontline healthcare workers.",
                    liveUrl: "https://janeval.vercel.app/",
                    primaryImage: "/case-studies/janeval_live.png",
                    secondaryImage: "/case-studies/janeval_page-3.png",
                    primaryLabel: "Production Interface",
                    secondaryLabel: "Pipeline Architecture",
                    defaultMode: "live",
                  })
                }
              >
                <BrowserFrame url="janeval.org/arena">
                  <Image
                    src="/case-studies/janeval_live.png"
                    alt="JANEVAL AI Healthcare Evaluation Arena"
                    fill
                    className="object-cover object-top"
                  />
                </BrowserFrame>
              </StageCanvas>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* 02: ADITYAOS / PIXEL STUDIO — DESIGNED DESKTOP BROWSER FRAME */}
        {/* ========================================================================= */}
        <article
          className={`border-b border-dashed p-6 sm:p-8 space-y-5 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
              : "border-stone-200/80 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400">02</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span className={isDark ? "text-zinc-300" : "text-stone-700"}>adityaos</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                In-Browser Creative Studio & Canvas
              </span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              60 FPS Canvas · 1:1 Pixel Lock
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-3">
              <h3
                className={`text-base sm:text-lg font-sans font-semibold tracking-tight ${
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
                Interactive pixel matrix engine featuring Conway&apos;s Game of Life, falling sand
                cellular automata, procedural bitmap fonts, and an algorithmic WebAudio synthesizer
                running entirely client-side without external runtime dependencies.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <Link
                  href="/work/adityaos"
                  className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm"
                      : "bg-stone-900 text-white hover:bg-black shadow-sm"
                  }`}
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onLaunchOS && (
                  <button
                    onClick={onLaunchOS}
                    className={`px-3 py-2 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? "border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-300"
                        : "border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Launch Sandbox 🕹️</span>
                  </button>
                )}

                <Link
                  href="/pixel"
                  className={`px-3 py-2 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                      : "border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  <span>Fullscreen Canvas</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </div>
            </div>

            {/* Right: Designed Desktop Browser Frame */}
            <div className="lg:col-span-5">
              <StageCanvas
                accentTint="rgba(6, 182, 212, 0.15)"
                label="Pixel Studio & Conway Life Matrix"
                onClick={() =>
                  setModalData({
                    title: "Pixel Engine — Grid-Locked Canvas & Studio",
                    client: "adityaos",
                    category: "Creative Graphics & Grid Matrix",
                    isPixelEngine: true,
                    onLaunchOS,
                    primaryImage: "/case-studies/adityaos_pixel_engine_studio.png",
                    secondaryImage: "/case-studies/adityaos_pixel_engine_desktop.png",
                    primaryLabel: "Grid Studio",
                    secondaryLabel: "Desktop Shell",
                    defaultMode: "screens",
                  })
                }
              >
                <BrowserFrame url="adityaos.io/studio">
                  <Image
                    src="/case-studies/adityaos_pixel_engine_studio.png"
                    alt="Pixel Engine Creative Studio"
                    fill
                    className="object-cover object-top"
                  />
                </BrowserFrame>
              </StageCanvas>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* 03: CORPORATE CLAIMS (MFINE) — DESIGNED DESKTOP BROWSER FRAME */}
        {/* ========================================================================= */}
        <article
          className={`border-b border-dashed p-6 sm:p-8 space-y-5 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
              : "border-stone-200/80 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-400">03</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span className={isDark ? "text-zinc-300" : "text-stone-700"}>MFine</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                B2B Benefits & Claims Architecture
              </span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium ${
                isDark ? "text-indigo-400" : "text-indigo-700"
              }`}
            >
              100K+ DAU · &lt;15m Approvals
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-3">
              <h3
                className={`text-base sm:text-lg font-sans font-semibold tracking-tight ${
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
                Designed the corporate benefits wallet and claim submission flow for 100,000+
                employees. Real-time policy validation replaced paperwork delays with instant
                cashless triage, reducing emergency hospital approval wait times below 15 minutes.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                <Link
                  href="/work/mfine"
                  className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm"
                      : "bg-stone-900 text-white hover:bg-black shadow-sm"
                  }`}
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDark
                      ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                      : "border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  <span>Figma File</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right: Designed Desktop Browser Frame with Clean Claims UI */}
            <div className="lg:col-span-5">
              <StageCanvas
                accentTint="rgba(99, 102, 241, 0.15)"
                label="MFine Corporate Benefits & Claims Triage"
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
              >
                <BrowserFrame url="mfine.co/claims/triage">
                  <div className="w-full h-full bg-[#0d1017] p-3 flex flex-col justify-between text-white font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold text-zinc-200 text-[11px]">Cashless Claims Triage</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        &lt; 15 min SLA
                      </span>
                    </div>

                    <div className="space-y-1.5 py-1">
                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 text-[11px] flex justify-between items-center">
                        <div>
                          <div className="font-medium text-zinc-200">Apollo Hospitals · Pre-Auth</div>
                          <div className="text-[10px] text-zinc-400">Cardiology Admission (₹45,000)</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold">
                          Approved (12m)
                        </span>
                      </div>

                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 text-[11px] flex justify-between items-center opacity-85">
                        <div>
                          <div className="font-medium text-zinc-200">Fortis Healthcare · OPD Claim</div>
                          <div className="text-[10px] text-zinc-400">Diagnostics Wallet Triage</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                          Auto-Validated
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Live Census: 100K+ Lives</span>
                      <span className="text-zinc-400">Policy Rules: Active</span>
                    </div>
                  </div>
                </BrowserFrame>
              </StageCanvas>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* ROW: 2-COLUMN MINIFIED MOBILE PRODUCTS (DIGIACCEL + MOSAIC) */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-dashed grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed relative ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {/* 04: Digiaccel UPI Clarity */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">04 / DIGIACCEL · FINTECH</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
                  -38% DROPOFFS
                </span>
              </div>

              {/* Designed Smartphone Mockup */}
              <StageCanvas
                accentTint="rgba(6, 182, 212, 0.12)"
                label="UPI Limit Meter & Daily Spend Runway"
                onClick={() =>
                  setModalData({
                    title: "UPI Limit Clarity & Spend Runway",
                    client: "Digiaccel",
                    category: "Fintech Payments & Error Recovery",
                    figmaUrl:
                      "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
                    primaryImage: "/case-studies/upi_phone_clean.png",
                    primaryLabel: "UPI Limit Meter Interface",
                    defaultMode: "screens",
                  })
                }
              >
                <MobileDeviceFrame>
                  <div className="relative w-full h-full bg-[#121214]">
                    <Image
                      src="/case-studies/upi_phone_clean.png"
                      alt="Digiaccel UPI Limit Meter Screen"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </MobileDeviceFrame>
              </StageCanvas>

              <div className="space-y-2 pt-1">
                <h4
                  className={`text-base font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Preventing failed UPI payments before users tap &apos;Pay&apos;.
                </h4>
                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Proactive bank server health meters and daily spend runway indicators, cutting
                  payment dropoffs by 38% across transaction flows.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
              <Link
                href="/work/digiaccel"
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Read Case Study</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>

          {/* 05: Mosaic Wellness / ManMatters */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold">05 / MOSAIC WELLNESS</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                  +12% RETENTION
                </span>
              </div>

              {/* Designed Smartphone Mockup for 21-Day Habit Engine */}
              <StageCanvas
                accentTint="rgba(245, 158, 11, 0.12)"
                label="21-Day Habit Engine & Streak Tracker"
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
              >
                <MobileDeviceFrame>
                  <div className="w-full h-full bg-[#0a1118] p-3 flex flex-col justify-between text-white font-sans text-xs">
                    <div className="border-b border-zinc-800 pb-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                        <span>DAY 14 OF 21</span>
                        <span className="flex items-center gap-1">🔥 14-Day Streak</span>
                      </div>
                      <div className="font-semibold text-sm text-zinc-100 pt-0.5">
                        Morning Health Regimen
                      </div>
                    </div>

                    <div className="space-y-2 py-1">
                      <div className="bg-zinc-900/90 p-2 rounded-lg border border-emerald-900/40 text-[11px]">
                        <div className="flex items-center justify-between text-emerald-400 font-medium">
                          <span>Biotin Supplement</span>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[9px] text-zinc-400">Logged at 8:30 AM</div>
                      </div>

                      <div className="bg-zinc-900/90 p-2 rounded-lg border border-amber-900/40 text-[11px]">
                        <div className="flex items-center justify-between text-amber-300 font-medium">
                          <span>Scalp Tonic Application</span>
                          <span className="text-[9px] font-mono text-amber-400">5 Mins</span>
                        </div>
                        <div className="text-[9px] text-zinc-400">Due tonight before 10 PM</div>
                      </div>

                      <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60 text-[10px] text-zinc-400 flex items-center justify-between">
                        <span>Doctor Touchpoint</span>
                        <span className="text-zinc-300">In 2 Days</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span>Cohort Retention: +12%</span>
                      <span className="text-amber-400">Phase 2 Active</span>
                    </div>
                  </div>
                </MobileDeviceFrame>
              </StageCanvas>

              <div className="space-y-2 pt-1">
                <h4
                  className={`text-base font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Helping patients stick to medical routines during the first three weeks.
                </h4>
                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Paired 1-tap daily habit logs with milestone streaks and doctor check-ins, driving
                  a +12% lift in 90-day treatment continuation.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
              <Link
                href="/work/mosaic"
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Read Case Study</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        </div>

        {/* ========================================================================= */}
        {/* ROW: 2-COLUMN MINIFIED MOBILE & FIELD PRODUCTS (KETTO + RAJASTHAN) */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-dashed grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed relative ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {/* 06: Ketto+ Recurring Crowdfunding */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-500 font-bold">06 / KETTO · CROWDFUNDING</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-pink-400" : "text-pink-700"}`}>
                  2.3X REPEAT DONORS
                </span>
              </div>

              {/* Designed Smartphone Mockup for Ketto+ Giving */}
              <StageCanvas
                accentTint="rgba(236, 72, 153, 0.12)"
                label="Ketto+ Recurring Giving Onboarding"
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
              >
                <MobileDeviceFrame>
                  <div className="w-full h-full bg-[#1e1b2e] p-3 flex flex-col justify-between text-white font-sans text-xs">
                    <div className="border-b border-purple-900/50 pb-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-pink-400">
                        <span>KETTO+ SPONSOR</span>
                        <span className="font-semibold text-emerald-400">Monthly</span>
                      </div>
                      <div className="font-semibold text-sm text-zinc-100 pt-0.5">
                        Start Giving, Start Healing
                      </div>
                    </div>

                    <div className="space-y-2 py-1">
                      <div className="bg-purple-950/60 p-2 rounded-lg border border-purple-800/40 text-[11px]">
                        <div className="flex items-center justify-between text-pink-300 font-medium">
                          <span>Pediatric Oncology Fund</span>
                          <span className="text-emerald-400 font-mono">₹750/mo</span>
                        </div>
                        <div className="text-[9px] text-purple-300/80">Funds ongoing chemotherapy cycles</div>
                      </div>

                      <div className="bg-purple-950/40 p-2 rounded-lg border border-purple-900/40 text-[10px] text-zinc-300">
                        <div className="font-medium text-pink-200">Patient Recovery Timeline</div>
                        <div className="text-[9px] text-purple-400">Cycle 3 of 6 completed this week</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-purple-900/50 flex items-center justify-between text-[9px] font-mono text-purple-400">
                      <span>UPI Autopay: Active</span>
                      <span className="text-pink-300">2.3x Repeat Lift</span>
                    </div>
                  </div>
                </MobileDeviceFrame>
              </StageCanvas>

              <div className="space-y-2 pt-1">
                <h4
                  className={`text-base font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Turning one-time emergency donors into monthly patient sponsors.
                </h4>
                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Designed the Ketto+ recurring micro-giving subscription flow and ambient home
                  screen recovery milestones, doubling repeat donor retention.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
              <Link
                href="/work/ketto"
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Read Case Study</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>

          {/* 07: Rajasthan Fieldwork */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-5 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">07 / PROJECT POTENTIAL</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                  20 MOS FIELDWORK
                </span>
              </div>

              {/* Designed Photo Frame */}
              <StageCanvas
                accentTint="rgba(16, 185, 129, 0.12)"
                label="Grassroots Ethnography · Rural Rajasthan"
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
              >
                <div className="w-full max-w-[280px] rounded-xl overflow-hidden border border-stone-200/80 dark:border-zinc-700/60 shadow-xl aspect-[4/3] relative">
                  <Image
                    src="/aditya_field_full.jpg"
                    alt="Rural Fieldwork Photo in Rajasthan"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-emerald-300 font-medium">
                      Mewar Belt · Water Commons
                    </span>
                  </div>
                </div>
              </StageCanvas>

              <div className="space-y-2 pt-1">
                <h4
                  className={`text-base font-semibold font-sans tracking-tight ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  20 months of grassroots systems & youth leadership ethnography.
                </h4>
                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Field immersion across 40+ panchayats in rural Rajasthan and Bihar. Authored the
                  Youth Resource Manual for local community leadership and water commons stewardship.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
              <a
                href="#essays"
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Read Field Essays</span>
                <ArrowRight className="w-3 h-3" />
              </a>

              <Link
                href="/work"
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                    : "border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800"
                }`}
              >
                <span>All Projects Archive</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </article>
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
