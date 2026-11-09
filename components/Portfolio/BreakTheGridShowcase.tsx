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
          className={`border-b p-6 sm:p-8 transition-colors ${
            isDark ? "border-zinc-800 bg-[#0c0e14]/70" : "border-stone-200 bg-white"
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
        {/* 01: JANEVAL BENCHMARK */}
        {/* ========================================================================= */}
        <article
          className={`border-b p-6 sm:p-8 space-y-4 transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
              : "border-stone-200 bg-white hover:bg-stone-50/60"
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

          {/* Content Split: 7 Cols Text / 5 Cols Media */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
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

            {/* Media Thumbnail */}
            <div className="lg:col-span-5">
              <div
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
                className={`relative rounded-lg overflow-hidden border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-emerald-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-emerald-600/50"
                }`}
              >
                <div className="relative aspect-[16/10] max-h-[200px]">
                  <Image
                    src="/case-studies/janeval_live.png"
                    alt="JANEVAL AI Healthcare Evaluation Arena"
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div
                  className={`px-3 py-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                    isDark
                      ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                      : "bg-stone-50 border-stone-200 text-stone-600"
                  }`}
                >
                  <span>Live Production Elo Arena</span>
                  <span className="flex items-center gap-1 opacity-75">
                    <Maximize2 className="w-3 h-3" /> Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* 02: ADITYAOS / PIXEL STUDIO */}
        {/* ========================================================================= */}
        <article
          className={`border-b p-6 sm:p-8 space-y-4 transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
              : "border-stone-200 bg-white hover:bg-stone-50/60"
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

          {/* Content Split: 7 Cols Text / 5 Cols Media */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
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

            {/* Media Thumbnail */}
            <div className="lg:col-span-5">
              <div
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
                className={`relative rounded-lg overflow-hidden border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-cyan-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-cyan-600/50"
                }`}
              >
                <div className="relative aspect-[16/10] max-h-[200px]">
                  <Image
                    src="/case-studies/adityaos_pixel_engine_studio.png"
                    alt="Pixel Engine Creative Studio"
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div
                  className={`px-3 py-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                    isDark
                      ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                      : "bg-stone-50 border-stone-200 text-stone-600"
                  }`}
                >
                  <span>Pixel Studio & Simulation</span>
                  <span className="flex items-center gap-1 opacity-75">
                    <Maximize2 className="w-3 h-3" /> Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* 03: CORPORATE CLAIMS (MFINE) */}
        {/* ========================================================================= */}
        <article
          className={`border-b p-6 sm:p-8 space-y-4 transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
              : "border-stone-200 bg-white hover:bg-stone-50/60"
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

          {/* Content Split: 7 Cols Text / 5 Cols Media */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
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

            {/* Media Thumbnail */}
            <div className="lg:col-span-5">
              <div
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
                className={`relative rounded-lg overflow-hidden border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-indigo-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-indigo-600/50"
                }`}
              >
                <div className="relative aspect-[16/10] max-h-[200px]">
                  <Image
                    src="/case-studies/corporate_claims_cluster.png"
                    alt="MFine Corporate Claims System"
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div
                  className={`px-3 py-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                    isDark
                      ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                      : "bg-stone-50 border-stone-200 text-stone-600"
                  }`}
                >
                  <span>Modal Policy Matrix</span>
                  <span className="flex items-center gap-1 opacity-75">
                    <Maximize2 className="w-3 h-3" /> Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* ROW: 2-COLUMN MINIFIED CARDS (DIGIACCEL + MOSAIC) */}
        {/* ========================================================================= */}
        <div
          className={`border-b grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x relative ${
            isDark
              ? "border-zinc-800 divide-zinc-800"
              : "border-stone-200 divide-stone-200"
          }`}
        >
          {/* 04: Digiaccel UPI */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-4 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
                : "bg-white hover:bg-stone-50/60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">04 / DIGIACCEL · FINTECH</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
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
                className={`relative rounded-lg overflow-hidden aspect-[16/10] max-h-[180px] border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-cyan-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-cyan-600/50"
                }`}
              >
                <Image
                  src="/case-studies/upi_limit_meter_flow.png"
                  alt="UPI Limit Clarity Screens"
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5 pt-1">
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

          {/* 05: Mosaic Wellness */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-4 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
                : "bg-white hover:bg-stone-50/60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold">05 / MOSAIC WELLNESS</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                  +12% RETENTION
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
                    defaultMode: "figma",
                  })
                }
                className={`relative rounded-lg overflow-hidden aspect-[16/10] max-h-[180px] border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-amber-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-amber-600/50"
                }`}
              >
                <Image
                  src="/case-studies/hair_tracker.png"
                  alt="Mosaic Wellness Habit Tracker"
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5 pt-1">
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
        {/* ROW: 2-COLUMN MINIFIED CARDS (KETTO + RAJASTHAN FIELDWORK) */}
        {/* ========================================================================= */}
        <div
          className={`border-b grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x relative ${
            isDark
              ? "border-zinc-800 divide-zinc-800"
              : "border-stone-200 divide-stone-200"
          }`}
        >
          {/* 06: Ketto+ */}
          <article
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-4 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
                : "bg-white hover:bg-stone-50/60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-500 font-bold">06 / KETTO · CROWDFUNDING</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-pink-400" : "text-pink-700"}`}>
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
                className={`relative rounded-lg overflow-hidden aspect-[16/10] max-h-[180px] border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-pink-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-pink-600/50"
                }`}
              >
                <Image
                  src="/case-studies/ketto_curated_flow.png"
                  alt="Ketto+ Mobile App Screens"
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5 pt-1">
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
            className={`p-6 sm:p-8 flex flex-col justify-between space-y-4 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/40 hover:bg-[#0c0e14]/60"
                : "bg-white hover:bg-stone-50/60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">07 / PROJECT POTENTIAL</span>
                <span className={`text-[11px] font-mono ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
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
                className={`relative rounded-lg overflow-hidden aspect-[16/10] max-h-[180px] border cursor-pointer group shadow-sm transition-all ${
                  isDark
                    ? "border-zinc-800 bg-black hover:border-emerald-500/50"
                    : "border-stone-200 bg-stone-100 hover:border-emerald-600/50"
                }`}
              >
                <Image
                  src="/aditya_field_full.jpg"
                  alt="Rural Fieldwork Photo in Rajasthan"
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5 pt-1">
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
