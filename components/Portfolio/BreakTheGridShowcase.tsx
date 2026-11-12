"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Globe,
  Terminal,
  Check,
  Sparkles,
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
/* 1. Sleek Frameless Desktop Asset Viewport */
/* ========================================================================= */
function BrowserFrame({
  children,
  aspectClass = "aspect-[16/10]",
}: {
  url?: string;
  children: React.ReactNode;
  aspectClass?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${aspectClass}`}
    >
      {children}
    </div>
  );
}

/* ========================================================================= */
/* 2. Sleek Frameless Mobile Asset Viewport */
/* ========================================================================= */
function MobileDeviceFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full max-w-[210px] sm:max-w-[240px] mx-auto rounded-xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden aspect-[9/18] w-full">
        {children}
      </div>
    </div>
  );
}

export function BreakTheGridShowcase({ onLaunchOS }: BreakTheGridShowcaseProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [modalData, setModalData] = useState<PrototypeModalData | null>(null);


  return (
    <section id="work" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark ? "bg-[#090b10]/40" : "bg-[#FBFBF9]"
        }`}
      >
        {/* ========================================================================= */}
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        {/* ========================================================================= */}
        <div
          className={`border-b px-6 sm:px-8 lg:px-12 py-5 flex items-baseline justify-between transition-colors ${
            isDark ? "border-zinc-800/60 bg-[#0E1015]" : "border-stone-200/60 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-semibold text-emerald-500">01</span>
            <h2
              className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-[#1A1814]"
              }`}
            >
              Shipped Systems
            </h2>
            <span
              className={`text-xs font-mono hidden sm:inline ${
                isDark ? "text-zinc-500" : "text-stone-400"
              }`}
            >
              — Production architectures & verifiable metrics
            </span>
          </div>
          <span className="text-xs font-mono text-stone-400 dark:text-zinc-500">
            8 Systems
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK — VIEWPORT HERO CARD */}
        {/* ========================================================================= */}
        <motion.article
          id="project-janeval"
          data-project-id="janeval"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border-b px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14 min-h-[60vh] lg:min-h-[64vh] flex flex-col justify-center transition-colors ${
            isDark
              ? "border-zinc-800/60 bg-[#0E1015]"
              : "border-stone-200/60 bg-[#FAF7F2]"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (40%): Metric + Display Serif Title + Meta + Statement + CTAs */}
            <div className="lg:col-span-5 space-y-4">
              {/* Headline Metric as large number (64px+) with 13px label */}
              <div className="flex items-baseline gap-3">
                <span className="text-[64px] lg:text-[72px] font-mono font-bold leading-none text-emerald-600 dark:text-emerald-400 tracking-tight">
                  3.4x
                </span>
                <span className="text-[13px] font-mono uppercase tracking-wider text-stone-500 dark:text-zinc-400 font-medium">
                  Cultural Fidelity Lift
                </span>
              </div>

              {/* Project title in a display serif, 48 to 56px, max 2 lines */}
              <h3
                className={`font-serif text-[42px] sm:text-[48px] lg:text-[52px] font-normal leading-[1.08] tracking-tight ${
                  isDark ? "text-[#F4F4F5]" : "text-[#1A1814]"
                }`}
              >
                Frontier AI medical evaluation framework.
              </h3>

              {/* One quiet meta line: Client or type · Role · Timeline */}
              <p className="text-[13px] font-mono text-stone-500 dark:text-zinc-400">
                Independent Research · Lead Product Designer &amp; System Architect · 6 Weeks
              </p>

              {/* Persuasive Statement */}
              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Benchmarked frontier vision models across 120+ clinical scenarios with frontline ASHA workers, eliminating diagnostic hallucinations prior to rural deployment.
              </p>

              {/* Action CTAs: Solid Primary + Clean Text Secondary */}
              <div className="pt-2 flex items-center gap-5 font-mono text-[13px]">
                <Link
                  href="/work/janeval"
                  className={`px-5 py-2.5 rounded font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-[#1A1814] text-white hover:bg-black"
                  }`}
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://janeval.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline underline-offset-4 transition-colors cursor-pointer ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-[#1A1814]"
                  }`}
                >
                  Live Arena ↗
                </a>
              </div>
            </div>

            {/* Right: Asset Viewport */}
            <div className="lg:col-span-7 -mr-6 sm:-mr-8 lg:-mr-12 overflow-visible">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setModalData({
                    title: "JANEVAL — Human-Centered AI Benchmark",
                    client: "Independent Research",
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
                <BrowserFrame aspectClass="aspect-[16/10]">
                  <Image
                    src="/case-studies/janeval_live.png"
                    alt="JANEVAL AI Healthcare Evaluation Arena"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </BrowserFrame>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ========================================================================= */}
        {/* 02: ADITYAOS / PIXEL STUDIO — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          id="project-adityaos"
          data-project-id="adityaos"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border-b border-stone-200/60 dark:border-zinc-800/60 px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-10 min-h-[56vh] lg:min-h-[60vh] flex flex-col justify-center space-y-4 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0E1015]"
              : "border-stone-200/80 bg-[#FAF7F2]"
          }`}
        >
          {/* Top Meta Line: Clean unboxed metadata */}
          <div className="flex items-center justify-between text-[13px] font-mono">
            <span className={isDark ? "text-zinc-300 font-medium" : "text-stone-700 font-semibold"}>
              Personal System · AdityaOS & Pixel Engine (2024)
            </span>
            <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
              SYS-02
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Narrative: One Single Persuasive Statement */}
            <div className="lg:col-span-5 space-y-3.5 max-w-[52ch]">
              <h3
                className={`text-xl sm:text-2xl font-sans font-semibold tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                In-browser retro operating system & creative pixel engine.
              </h3>

              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Zero-dependency 60 FPS deterministic canvas with Conway&apos;s Game of Life, falling sand physics, procedural WebAudio synth, and modular windowing.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
                <Link
                  href="/work/adityaos"
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-stone-900 text-white hover:bg-black"
                  }`}
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onLaunchOS && (
                  <button
                    onClick={onLaunchOS}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                      isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-900"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Launch Shell</span>
                    <span className="text-[10px]">↗</span>
                  </button>
                )}

                <Link
                  href="/pixel"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  <span>Pixel Studio</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </div>
            </div>

            {/* Right: Pixel Studio Asset Frame */}
            <div className="lg:col-span-7 -mr-6 sm:-mr-8 lg:-mr-12 overflow-visible">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setModalData({
                    title: "AdityaOS & Pixel Engine Studio",
                    client: "Personal System",
                    category: "Canvas Architecture & Cellular Automata",
                    isPixelEngine: true,
                    onLaunchOS: onLaunchOS,
                    primaryImage: "/case-studies/pixel_engine_portfolio.png",
                    primaryLabel: "Pixel Studio Viewport",
                    defaultMode: "pixel",
                  })
                }
              >
                <BrowserFrame aspectClass="aspect-[1721/1026]">
                  <Image
                    src="/case-studies/pixel_engine_portfolio.png"
                    alt="AdityaOS Pixel Engine Canvas Interface"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </BrowserFrame>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ========================================================================= */}
        {/* 03: MFINE CORPORATE HEALTH & CLAIMS — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          id="project-mfine"
          data-project-id="mfine"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border-b border-stone-200/60 dark:border-zinc-800/60 p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0E1015]"
              : "border-stone-200/80 bg-[#FAF7F2]"
          }`}
        >
          {/* Top Meta Line: Clean unboxed metadata */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
              MFine · 2022—2023
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              100K+ DAU · &lt;15m Approvals
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative: One Single Persuasive Statement */}
            <div className="lg:col-span-6 space-y-4 max-w-[60ch]">
              <h3
                className={`text-xl sm:text-2xl font-sans font-semibold tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Unified B2B healthcare benefits console & cashless claim engine.
              </h3>

              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Architected enterprise claims orchestration and employee census engines for 100K+ lives, slashing hospital pre-authorization delays by 85%.
              </p>

              <div
                className={`text-xs font-mono pt-1 ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                InsurTech · Design Systems (Figma) · B2B Console · Cashless OPD
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
                <Link
                  href="/work/mfine"
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-stone-900 text-white hover:bg-black"
                  }`}
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  <span>Figma Specs</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right: Clean Browser Frame without extra outer box */}
            <div className="lg:col-span-6">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setModalData({
                    title: "Corporate Health Benefits & Claim Settlement",
                    client: "MFine",
                    category: "B2B InsurTech & Enterprise Design System",
                    figmaUrl:
                      "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
                    primaryImage: "/case-studies/mfine_bhel_admin_contacts.png",
                    secondaryImage: "/case-studies/mfine_rejected_transaction.png",
                    tertiaryImage: "/case-studies/mfine_patient_offerings.jpg",
                    primaryLabel: "B2B Admin Console (BHEL)",
                    secondaryLabel: "Cashless Dispute Resolution",
                    tertiaryLabel: "Patient Offerings Flow",
                    defaultMode: "screens",
                  })
                }
              >
                <BrowserFrame aspectClass="aspect-[1366/768]">
                  <Image
                    src="/case-studies/mfine_bhel_admin_contacts.png"
                    alt="MFine Corporate B2B Admin Console"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                  />
                </BrowserFrame>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ========================================================================= */}
        {/* ROW: 3-COLUMN MINIFIED MOBILE PRODUCTS (MOSAIC + KETTO + TUTEDUDE) */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-stone-200/60 dark:border-zinc-800/60 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200/60 dark:divide-zinc-800/60 relative ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {/* 04: Mosaic Wellness / ManMatters */}
          <motion.article
            id="project-mosaic"
            data-project-id="mosaic"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0E1015]"
                : "bg-[#FAF7F2]"
            }`}
          >
            <div className="space-y-4">
              {/* Top Meta Line: Clean unboxed metadata */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
                  Mosaic Wellness · 2023
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  +12% Retention Lift
                </span>
              </div>

              {/* Designed Smartphone Mockup for 21-Day Habit Engine (Clean without outer box) */}
              <div
                className="cursor-pointer py-2 flex justify-center"
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
              </div>

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Behavioral retention engine for delayed-gratification health regimens.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Paired 1-tap micro-commitment habit logs with milestone streaks and embedded doctor WhatsApp check-ins to halt early patient drop-off.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  HealthTech D2C · Habit Loops · Behavioral UX · Regimen Adherence
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href="/work/mosaic"
                className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                <span>Figma Specs</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>

          {/* 06: Ketto Crowdfunding */}
          <motion.article
            id="project-ketto"
            data-project-id="ketto"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0E1015]"
                : "bg-[#FAF7F2]"
            }`}
          >
            <div className="space-y-4">
              {/* Top Meta Line: Clean unboxed metadata */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
                  Ketto · 2023
                </span>
                <span className="text-pink-600 dark:text-pink-400 font-medium">
                  2.3x Repeat Giving Lift
                </span>
              </div>

              {/* Designed Smartphone Mockup for Ketto+ Giving (Clean without outer box) */}
              <div
                className="cursor-pointer py-2 flex justify-center"
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
                  <div className="relative w-full h-full bg-[#1e1b2e]">
                    <Image
                      src="/case-studies/ketto_phone_clean.png"
                      alt="Ketto Mobile Donation Flow Screen"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </MobileDeviceFrame>
              </div>

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Recurring medical crowdfunding & recovery milestones.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Engineered UPI Autopay micro-giving mandates and transparent recovery timelines, converting one-off crisis donors into recurring monthly sponsors.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Fintech Philanthropy · Recurring Mandates · Trust Architecture · UPI Autopay
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href="/work/ketto"
                className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                <span>Figma Specs</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>

          {/* 07: TuteDude EdTech Mentorship */}
          <motion.article
            id="project-tutedude"
            data-project-id="tutedude"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0E1015]"
                : "bg-[#FAF7F2]"
            }`}
          >
            <div className="space-y-4">
              {/* Top Meta Line: Clean unboxed metadata */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
                  TuteDude · 2023
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">
                  +34% Completion · &lt;3m Mentor Queue
                </span>
              </div>

              {/* Designed Smartphone Mockup (Clean without outer box) */}
              <div
                className="cursor-pointer py-2 flex justify-center"
                onClick={() =>
                  setModalData({
                    title: "TuteDude Course Architecture & 1-on-1 Mentorship",
                    client: "TuteDude",
                    category: "EdTech Learning Experience",
                    figmaUrl:
                      "https://www.figma.com/design/hOmOAB7mZGXb8HBAy9TpHw/Tutedude-Assignment?node-id=220-1386",
                    primaryImage: "/case-studies/tutedude_course_player.png",
                    secondaryImage: "/case-studies/tutedude_study_resources.png",
                    tertiaryImage: "/case-studies/tutedude_mentor_support.png",
                    primaryLabel: "1. Lecture & Refund Runway",
                    secondaryLabel: "2. Study Resources",
                    tertiaryLabel: "3. Live Mentor Queue",
                    defaultMode: "screens",
                  })
                }
              >
                <MobileDeviceFrame>
                  <div className="relative w-full h-full bg-[#120a1f]">
                    <Image
                      src="/case-studies/tutedude_course_player.png"
                      alt="TuteDude Learning Experience Screen"
                      fill
                      priority
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                </MobileDeviceFrame>
              </div>

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Interactive video lecture player with instant mentor triage.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Embedded sub-3-minute 1-on-1 mentor queues and progress-backed refund runways directly into video lectures to eliminate student syntax drop-offs.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  EdTech · Interactive Video · Mentorship Queue · Gamified Runway
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href="/work/tutedude"
                className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://www.figma.com/design/hOmOAB7mZGXb8HBAy9TpHw/Tutedude-Assignment?node-id=220-1386"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                <span>Figma Specs</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>
        </div>

        {/* ========================================================================= */}
        {/* 08: RAJASTHAN FIELDWORK & ETHNOGRAPHY — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          id="project-fieldwork"
          data-project-id="fieldwork"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border-b border-stone-200/60 dark:border-zinc-800/60 p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0E1015]"
              : "border-stone-200/80 bg-[#FAF7F2]"
          }`}
        >
          {/* Top Meta Line: Clean unboxed metadata */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
              Project Potential x India Fellow · 2021—2022
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              40+ Panchayats · Rajasthan & Bihar
            </span>
          </div>

          {/* Symmetrical 12-Col Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative: One Single Persuasive Statement */}
            <div className="lg:col-span-6 space-y-4 max-w-[60ch]">
              <h3
                className={`text-xl sm:text-2xl font-sans font-semibold tracking-tight leading-snug ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                20 months of grassroots systems and rural youth ethnography.
              </h3>

              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Conducted ethnographic research across rural Rajasthan and Bihar to co-design experiential community curricula and water commons stewardship frameworks.
              </p>

              <div
                className={`text-xs font-mono pt-1 ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Fieldwork Ethnography · Systems Design · Youth Leadership · Rajasthan & Bihar
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
                <a
                  href="#essays"
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-stone-900 text-white hover:bg-black"
                  }`}
                >
                  <span>Field Essays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/work"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  <span>Project Archive</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </div>
            </div>

            {/* Right: Fieldwork Photo Frame (Clean without outer box) */}
            <div className="lg:col-span-6">
              <div
                className="w-full max-w-[420px] rounded-xl overflow-hidden border border-stone-200/80 dark:border-zinc-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] aspect-[4/3] relative cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
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
                <Image
                  src="/aditya_field_full.jpg"
                  alt="Rural Fieldwork Photo in Rajasthan"
                  fill
                  priority
                  unoptimized
                  className="object-cover object-top hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-emerald-300 font-medium">
                    Mewar Belt · Water Commons Stewardship
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Interactive Prototype Modal */}
      <InteractivePrototypeModal
        data={modalData}
        onClose={() => setModalData(null)}
      />
    </section>
  );
}
