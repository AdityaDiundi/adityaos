"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
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
      className={`w-full rounded-xl overflow-hidden border shadow-sm transition-all duration-300 group-hover/stage:shadow-md ${
        isDark
          ? "bg-[#111318] border-zinc-800 shadow-black/40"
          : "bg-white border-stone-200/90 shadow-stone-200/50"
      }`}
    >
      {/* Top Browser Bar */}
      <div
        className={`px-3 py-1.5 border-b flex items-center justify-between gap-3 text-xs font-mono select-none ${
          isDark
            ? "bg-[#14171f] border-zinc-800 text-zinc-400"
            : "bg-stone-50 border-stone-200 text-stone-500"
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0 opacity-60">
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="w-2 h-2 rounded-full bg-current" />
        </div>

        {/* Minimalist Address Pill */}
        <div
          className={`px-2.5 py-0.5 rounded text-[10px] flex items-center justify-center gap-1.5 truncate border ${
            isDark
              ? "bg-[#0d0e12] border-zinc-800 text-zinc-300"
              : "bg-white border-stone-200 text-stone-700"
          }`}
        >
          <span className="opacity-50 text-[9px]">🔒</span>
          <span className="truncate">{url}</span>
        </div>

        <div className="w-6 shrink-0" />
      </div>

      {/* Frame Body */}
      <div className="relative overflow-hidden bg-stone-900/5 dark:bg-black/30 aspect-[16/10]">
        {children}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. Minimal Border-Contained Mobile Viewport */
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
      className={`w-full max-w-[210px] sm:max-w-[230px] mx-auto rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 group-hover/stage:shadow-md ${
        isDark
          ? "bg-[#0f1117] border-zinc-800 shadow-black/50"
          : "bg-stone-100 border-stone-200 shadow-stone-200/60"
      }`}
    >
      <div className="relative overflow-hidden aspect-[9/18] w-full">
        {children}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. Stage Canvas with Tactile 3D Tilt & Specular Sheen (Framer Design) */
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

  // 3D tactile perspective physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 260,
    damping: 28,
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: accentTint ? `0 0 50px -12px ${accentTint}` : undefined,
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`group/stage relative rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center border border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-[#11131a] to-[#0a0b0f] border-zinc-800 hover:border-zinc-600"
            : "bg-gradient-to-b from-stone-100/90 to-stone-50/50 border-stone-200 hover:border-stone-300"
        }`}
      >
        {/* Specular glare tracking mouse movement */}
        {mousePos.active && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 opacity-60"
            style={{
              background: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, ${
                isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.65)"
              }, transparent 80%)`,
            }}
          />
        )}

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
              <Maximize2 className="w-3 h-3" /> Interactive Sandbox ↗
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function BreakTheGridShowcase({ onLaunchOS }: BreakTheGridShowcaseProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [modalData, setModalData] = useState<PrototypeModalData | null>(null);

  // Fluid hover-driven mockup states (no rigid button clicking required)
  const [mfineHoverState, setMfineHoverState] = useState<"admin" | "claim">("admin");
  const [tutedudeHoverState, setTutedudeHoverState] = useState<"learn" | "resources" | "support">("learn");

  return (
    <section id="work" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark ? "bg-[#090b10]/40" : "bg-[#FBFBF9]"
        }`}
      >
        {/* ========================================================================= */}
        {/* Section Header: Minimal One Single Persuasive Thesis */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
          }`}
        >
          <div className="space-y-2 max-w-3xl">
            <div
              className={`text-[11px] font-mono uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              01 // Selected Works
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Case studies & shipped software.
            </h2>
            <p
              className={`text-sm sm:text-base font-sans leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Seven production systems spanning frontier AI benchmarks, low-level browser graphics engines, and high-stakes healthcare infrastructure.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 01: JANEVAL BENCHMARK — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
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
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>2024 · AI Healthcare Benchmark</span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                isDark
                  ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/20"
                  : "text-emerald-700 border-emerald-200 bg-emerald-50"
              }`}
            >
              3.4x Accuracy Lift
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
                Catching AI medical mistakes before they reach rural clinics.
              </h3>

              {/* Single High-Impact Persuasive Statement */}
              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Benchmarked frontier vision models across 120+ localized clinical scenarios with frontline healthcare workers, eliminating diagnostic hallucinations before grassroots deployment.
              </p>

              {/* Monospace Domain Tokens */}
              <div
                className={`text-xs font-mono pt-1 ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Frontier AI Eval · LLM Benchmarks · Next.js · TypeScript
              </div>

              {/* Action CTAs: Solid Primary + Clean Text Secondary */}
              <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
                <Link
                  href="/work/janeval"
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-stone-900 text-white hover:bg-black"
                  }`}
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://janeval.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Arena</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right: Designed Desktop Browser Frame */}
            <div className="lg:col-span-6">
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
        </motion.article>

        {/* ========================================================================= */}
        {/* 02: ADITYAOS / PIXEL STUDIO — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
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
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>In-Browser Creative Studio & Canvas</span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                isDark
                  ? "text-cyan-400 border-cyan-900/40 bg-cyan-950/20"
                  : "text-cyan-700 border-cyan-200 bg-cyan-50"
              }`}
            >
              60 FPS Canvas · 1:1 Pixel Lock
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
                A retro pixel art studio and sandbox built directly in the browser.
              </h3>

              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Engineered a zero-dependency 60 FPS deterministic canvas with cellular automata, procedural WebAudio synthesis, and modular windowing.
              </p>

              <div
                className={`text-xs font-mono pt-1 ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Interactive Graphics · Cellular Automata · WebAudio · Canvas API
              </div>

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
                  <span>Read Case Study</span>
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
                    <span>Launch Sandbox</span>
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

            {/* Right: Pixel Studio Browser Frame */}
            <div className="lg:col-span-6">
              <StageCanvas
                accentTint="rgba(6, 182, 212, 0.15)"
                label="Pixel Engine 60 FPS Deterministic Canvas"
                onClick={() =>
                  setModalData({
                    title: "AdityaOS & Pixel Engine Studio",
                    client: "Personal System",
                    category: "Canvas Architecture & Cellular Automata",
                    isPixelEngine: true,
                    onLaunchOS: onLaunchOS,
                    primaryImage: "/case-studies/adityaos_pixel_engine_studio.png",
                    primaryLabel: "Pixel Studio Viewport",
                    defaultMode: "pixel",
                  })
                }
              >
                <BrowserFrame url="aditya-os.live/pixel">
                  <Image
                    src="/case-studies/adityaos_pixel_engine_studio.png"
                    alt="AdityaOS Pixel Engine Canvas Interface"
                    fill
                    className="object-cover object-top"
                  />
                </BrowserFrame>
              </StageCanvas>
            </div>
          </div>
        </motion.article>

        {/* ========================================================================= */}
        {/* 03: MFINE CORPORATE HEALTH & CLAIMS — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
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
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>B2B Benefits & Claims Architecture</span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                isDark
                  ? "text-indigo-400 border-indigo-900/40 bg-indigo-950/20"
                  : "text-indigo-700 border-indigo-200 bg-indigo-50"
              }`}
            >
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
                Speeding up emergency hospital pre-authorizations to under 15 minutes.
              </h3>

              <p
                className={`text-sm sm:text-base font-sans leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-700"
                }`}
              >
                Architected a unified B2B benefits console and cashless claim engine for 100,000+ enterprise lives, slashing emergency clearance delays by 85%.
              </p>

              <div
                className={`text-xs font-mono pt-1 ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Enterprise InsurTech · Design Systems · B2B Console · Cashless OPD
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
                  <span>Read Case Study</span>
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
                  <span>Figma Workspace</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Right: Tactile Dual-Screen Stage with Fluid Hover Peek (No Click Toggles) */}
            <div className="lg:col-span-6 space-y-2">
              {/* Minimal Hover Scrubber Pills */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span
                    onMouseEnter={() => setMfineHoverState("admin")}
                    className={`cursor-pointer transition-colors ${
                      mfineHoverState === "admin"
                        ? isDark
                          ? "text-indigo-400 font-semibold"
                          : "text-indigo-700 font-semibold"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    ✦ B2B Admin Console
                  </span>
                  <span className="opacity-30">/</span>
                  <span
                    onMouseEnter={() => setMfineHoverState("claim")}
                    className={`cursor-pointer transition-colors ${
                      mfineHoverState === "claim"
                        ? isDark
                          ? "text-indigo-400 font-semibold"
                          : "text-indigo-700 font-semibold"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    ✦ Cashless Claim Dispute
                  </span>
                </div>
                <span className={`text-[10px] hidden sm:inline ${isDark ? "text-zinc-500" : "text-stone-400"}`}>
                  Hover to preview state
                </span>
              </div>

              <StageCanvas
                accentTint="rgba(99, 102, 241, 0.15)"
                label={
                  mfineHoverState === "admin"
                    ? "MFine Corporate B2B Policy Console · BHEL"
                    : "Cashless Claim Dispute & Triage · Kini's Clinic"
                }
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
                <AnimatePresence mode="wait">
                  {mfineHoverState === "admin" ? (
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <BrowserFrame url="mfine.co/admin/bhel/contacts">
                        <Image
                          src="/case-studies/mfine_bhel_admin_contacts.png"
                          alt="MFine Corporate B2B Admin Console"
                          fill
                          priority
                          unoptimized
                          className="object-cover object-top"
                        />
                      </BrowserFrame>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="claim"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <MobileDeviceFrame>
                        <Image
                          src="/case-studies/mfine_rejected_transaction.png"
                          alt="MFine Cashless Claim Dispute Interface"
                          fill
                          priority
                          unoptimized
                          className="object-cover object-top"
                        />
                      </MobileDeviceFrame>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StageCanvas>
            </div>
          </div>
        </motion.article>

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
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">04 / DIGIACCEL · FINTECH</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "text-cyan-400 border-cyan-900/40 bg-cyan-950/20"
                      : "text-cyan-700 border-cyan-200 bg-cyan-50"
                  }`}
                >
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

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Preventing failed UPI payments before users tap &apos;Pay&apos;.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Designed dynamic bank server health meters and real-time spend runways, rescuing high-intent fintech checkouts from silent gateway failures.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Fintech UX · Payments · UPI · Error Prevention
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
              <Link
                href="/work/digiaccel"
                className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                <span>Read Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                <span>Figma Workspace</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>

          {/* 05: Mosaic Wellness / ManMatters */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-500 font-bold">05 / MOSAIC WELLNESS</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "text-amber-400 border-amber-900/40 bg-amber-950/20"
                      : "text-amber-700 border-amber-200 bg-amber-50"
                  }`}
                >
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

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Helping patients build daily clinical habits in their first 21 days.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Created a friction-free regimen engine pairing micro-commitment habit logs with milestone streaks and embedded doctor touchpoints.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  HealthTech D2C · Habit Loops · Behavioral UX · Patient Retention
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
                <span>Read Case Study</span>
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
                <span>Figma Workspace</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>
        </div>

        {/* ========================================================================= */}
        {/* ROW: 2-COLUMN MINIFIED MOBILE PRODUCTS (KETTO + TUTEDUDE) */}
        {/* ========================================================================= */}
        <div
          className={`border-b border-dashed grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed relative ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {/* 06: Ketto Crowdfunding */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-pink-500 font-bold">06 / KETTO · PHILANTHROPY</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "text-pink-400 border-pink-900/40 bg-pink-950/20"
                      : "text-pink-700 border-pink-200 bg-pink-50"
                  }`}
                >
                  2.3x REPEAT LIFT
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

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
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
                  Re-engineered medical crowdfunding with UPI Autopay micro-giving mandates and transparent recovery milestone tracking.
                </p>
                <div
                  className={`text-[11px] font-mono pt-1 ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  Fintech Philanthropy · Recurring Mandates · Trust UX · UPI Autopay
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
                <span>Read Case Study</span>
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
                <span>Figma Workspace</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>

          {/* 07: TuteDude EdTech Mentorship */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 transition-colors ${
              isDark
                ? "bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
                : "bg-white hover:bg-stone-50/50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-500 font-bold">07 / TUTEDUDE · EDTECH</span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "text-sky-400 border-sky-900/40 bg-sky-950/20"
                      : "text-sky-700 border-sky-200 bg-sky-50"
                  }`}
                >
                  +34% COMPLETION · &lt;3m MENTOR
                </span>
              </div>

              {/* Minimal Hover Scrubber Pills (Fluid preview without click toggles) */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                  <span
                    onMouseEnter={() => setTutedudeHoverState("learn")}
                    className={`cursor-pointer transition-colors ${
                      tutedudeHoverState === "learn"
                        ? isDark
                          ? "text-sky-400 font-semibold"
                          : "text-sky-700 font-semibold"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    ✦ IDE
                  </span>
                  <span className="opacity-30">/</span>
                  <span
                    onMouseEnter={() => setTutedudeHoverState("resources")}
                    className={`cursor-pointer transition-colors ${
                      tutedudeHoverState === "resources"
                        ? isDark
                          ? "text-sky-400 font-semibold"
                          : "text-sky-700 font-semibold"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    ✦ Notes
                  </span>
                  <span className="opacity-30">/</span>
                  <span
                    onMouseEnter={() => setTutedudeHoverState("support")}
                    className={`cursor-pointer transition-colors ${
                      tutedudeHoverState === "support"
                        ? isDark
                          ? "text-sky-400 font-semibold"
                          : "text-sky-700 font-semibold"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    ✦ Mentor (3m)
                  </span>
                </div>
                <span className={`text-[10px] hidden sm:inline ${isDark ? "text-zinc-500" : "text-stone-400"}`}>
                  Hover to scrub
                </span>
              </div>

              {/* Designed Smartphone Mockup with Fluid AnimatePresence Hover */}
              <StageCanvas
                accentTint="rgba(14, 165, 233, 0.12)"
                label={
                  tutedudeHoverState === "learn"
                    ? "Lecture Player & Progress Runway"
                    : tutedudeHoverState === "resources"
                    ? "Course Resources & Modular Cheat Sheets"
                    : "Live 1-on-1 Mentor Queue (<3m Wait)"
                }
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
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tutedudeHoverState}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={
                            tutedudeHoverState === "learn"
                              ? "/case-studies/tutedude_course_player.png"
                              : tutedudeHoverState === "resources"
                              ? "/case-studies/tutedude_study_resources.png"
                              : "/case-studies/tutedude_mentor_support.png"
                          }
                          alt="TuteDude Learning Experience Screen"
                          fill
                          priority
                          unoptimized
                          className="object-cover object-top"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </MobileDeviceFrame>
              </StageCanvas>

              <div className="space-y-2 max-w-[54ch]">
                <h4
                  className={`text-lg font-semibold font-sans tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Connecting stuck coding students to live mentors in under 3 minutes.
                </h4>
                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  Integrated instant 1-on-1 mentor queues and gamified refund runways directly into the video player, preventing drop-offs during core blockers.
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
                <span>Read Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
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
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-700 hover:text-cyan-900"
                }`}
              >
                <span>Interactive Preview</span>
                <span className="text-[10px]">↗</span>
              </button>

              <a
                href="https://www.figma.com/design/hOmOAB7mZGXb8HBAy9TpHw/Tutedude-Assignment?node-id=220-1386"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 transition-colors cursor-pointer hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                <span>Figma Workspace</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.article>
        </div>

        {/* ========================================================================= */}
        {/* 08: RAJASTHAN FIELDWORK & ETHNOGRAPHY — VIEWPORT STAGE */}
        {/* ========================================================================= */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 min-h-[68vh] lg:min-h-[76vh] flex flex-col justify-center space-y-6 transition-colors ${
            isDark
              ? "border-zinc-800/80 bg-[#0c0e14]/30 hover:bg-[#0c0e14]/50"
              : "border-stone-200/80 bg-white hover:bg-stone-50/50"
          }`}
        >
          {/* Top Meta Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-500">08</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span className={isDark ? "text-zinc-300" : "text-stone-700"}>Project Potential x India Fellow</span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>20 Months Grassroots Fieldwork</span>
            </div>
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                isDark
                  ? "text-emerald-400 border-emerald-900/40 bg-emerald-950/20"
                  : "text-emerald-700 border-emerald-200 bg-emerald-50"
              }`}
            >
              40+ Panchayats · Rural Rajasthan & Bihar
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
                  <span>Read Field Essays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/work"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:underline ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                  }`}
                >
                  <span>All Projects Archive</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </div>
            </div>

            {/* Right: Fieldwork Photo Frame */}
            <div className="lg:col-span-6">
              <StageCanvas
                accentTint="rgba(16, 185, 129, 0.12)"
                label="Grassroots Ethnography · Mewar Belt, Rural Rajasthan"
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
                <div className="w-full max-w-[360px] rounded-xl overflow-hidden border border-stone-200/80 dark:border-zinc-700/60 shadow-xl aspect-[4/3] relative">
                  <Image
                    src="/aditya_field_full.jpg"
                    alt="Rural Fieldwork Photo in Rajasthan"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-mono text-emerald-300 font-medium">
                      Mewar Belt · Water Commons Stewardship
                    </span>
                  </div>
                </div>
              </StageCanvas>
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
