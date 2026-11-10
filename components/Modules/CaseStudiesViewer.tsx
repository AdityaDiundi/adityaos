"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DESKTOP_CASE_STUDIES, DesktopCaseStudy } from "@/config/caseStudies";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import { ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CaseStudiesViewer() {
  const { activeTheme } = useThemeStore();
  const { playClickChime, playScrollNote } = useSoundStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Switch to specific index with crossfade
  const goToIndex = useCallback(
    (nextIdx: number) => {
      if (nextIdx === currentIndex) return;
      playScrollNote(460 + nextIdx * 25);

      if (reducedMotion) {
        setCurrentIndex(nextIdx);
        scrollContainerRef.current?.scrollTo({ top: 0 });
        return;
      }

      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        scrollContainerRef.current?.scrollTo({ top: 0 });
        setTimeout(() => {
          setIsFading(false);
        }, 40);
      }, 160);
    },
    [currentIndex, reducedMotion, playScrollNote]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % DESKTOP_CASE_STUDIES.length;
    goToIndex(nextIdx);
  }, [currentIndex, goToIndex]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + DESKTOP_CASE_STUDIES.length) % DESKTOP_CASE_STUDIES.length;
    goToIndex(prevIdx);
  }, [currentIndex, goToIndex]);

  // Deep-linking listener from desktop selector
  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ id?: string; slug?: string }>;
      const targetId = customEvent.detail?.id;
      const targetSlug = customEvent.detail?.slug;
      if (!targetId && !targetSlug) return;

      const idx = DESKTOP_CASE_STUDIES.findIndex(
        (c) => c.id === targetId || c.slug === targetSlug
      );
      if (idx !== -1) {
        goToIndex(idx);
      }
    };

    window.addEventListener("open-case-study", handleSelect);
    return () => window.removeEventListener("open-case-study", handleSelect);
  }, [goToIndex]);

  // Keyboard navigation inside the window: ArrowLeft & ArrowRight
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  const activeStudy: DesktopCaseStudy = DESKTOP_CASE_STUDIES[currentIndex] || DESKTOP_CASE_STUDIES[0];
  const nextStudy = DESKTOP_CASE_STUDIES[(currentIndex + 1) % DESKTOP_CASE_STUDIES.length];
  const prevStudy = DESKTOP_CASE_STUDIES[(currentIndex - 1 + DESKTOP_CASE_STUDIES.length) % DESKTOP_CASE_STUDIES.length];

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative flex flex-col h-full w-full outline-none select-text overflow-hidden"
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      aria-label={`Work: ${activeStudy.title}. Use Left and Right arrow keys to navigate.`}
    >
      {/* Subtle Row of 5 Position Dots at Top Edge (Quiet, non-essential) */}
      <div className="absolute top-3.5 right-5 z-20 flex items-center gap-1.5 pointer-events-none opacity-60">
        {DESKTOP_CASE_STUDIES.map((_, idx) => (
          <span
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              idx === currentIndex
                ? "bg-stone-800 dark:bg-zinc-200 scale-125"
                : "bg-black/15 dark:bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Main Single-Case-Study Scrollable Canvas */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12 transition-opacity duration-200 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <article className="max-w-2xl mx-auto flex flex-col">
          {/* Header Area */}
          <header className="border-b border-black/10 dark:border-white/10 pb-6 sm:pb-8">
            {/* Title in Large Serif */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.15] tracking-tight text-stone-900 dark:text-zinc-100">
              {activeStudy.title}
            </h1>

            {/* Dominant Headline Outcome */}
            <div className="font-mono text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400 mt-3 sm:mt-4 tracking-tight">
              {activeStudy.outcome}
            </div>

            {/* Role, Client & Timeframe in Small Mono */}
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{activeStudy.role}</span>
              {activeStudy.client && (
                <>
                  <span className="opacity-40">·</span>
                  <span>{activeStudy.client}</span>
                </>
              )}
              {activeStudy.timeline && (
                <>
                  <span className="opacity-40">·</span>
                  <span>{activeStudy.timeline}</span>
                </>
              )}
            </div>
          </header>

          {/* Impact Metrics Row (if present) */}
          {activeStudy.impactMetrics && activeStudy.impactMetrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-black/10 dark:border-white/10">
              {activeStudy.impactMetrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
                    {m.value}
                  </span>
                  <span className="font-mono text-[11px] text-stone-700 dark:text-zinc-300 font-medium mt-0.5">
                    {m.label}
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-500 mt-0.5">
                    {m.detail}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Narrative Overview (Comfortable ~60-75 character line length) */}
          <section className="py-7 sm:py-8 border-b border-black/10 dark:border-white/10">
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-3">
              Overview
            </h2>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-stone-700 dark:text-zinc-300">
              {activeStudy.overview || activeStudy.summary}
            </p>
          </section>

          {/* The Problem & The Solution */}
          {activeStudy.theProblem && (
            <section className="py-7 sm:py-8 border-b border-black/10 dark:border-white/10 space-y-4">
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
                Problem & Root Friction
              </h2>
              <div className="font-mono text-xs sm:text-[13px] leading-relaxed text-stone-600 dark:text-zinc-400 space-y-3">
                <p>
                  <strong className="text-stone-900 dark:text-zinc-100 font-semibold">Core Friction: </strong>
                  {activeStudy.theProblem.friction}
                </p>
                <p>
                  <strong className="text-stone-900 dark:text-zinc-100 font-semibold">Insight: </strong>
                  {activeStudy.theProblem.insight}
                </p>
              </div>
            </section>
          )}

          {activeStudy.theSolution && (
            <section className="py-7 sm:py-8 border-b border-black/10 dark:border-white/10 space-y-4">
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
                Solution Architecture
              </h2>
              <p className="font-serif text-base sm:text-[17px] leading-relaxed text-stone-800 dark:text-zinc-200">
                {activeStudy.theSolution.headline}
              </p>
              <div className="grid grid-cols-1 gap-3.5 mt-4">
                {activeStudy.theSolution.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-medium mb-1">
                      <span className="text-stone-900 dark:text-zinc-100">{pillar.title}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{pillar.tag}</span>
                    </div>
                    <p className="font-mono text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags & Artifact Links */}
          <footer className="py-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap gap-2">
              {activeStudy.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] border border-black/10 dark:border-white/10 text-stone-500 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {activeStudy.liveUrl && (
                <a
                  href={activeStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {activeStudy.figmaUrl && (
                <a
                  href={activeStudy.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-stone-600 dark:text-zinc-400 hover:underline"
                >
                  <span>Figma File</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <Link
                href={`/work/${activeStudy.slug}`}
                className="inline-flex items-center gap-1 text-stone-800 dark:text-zinc-200 hover:underline font-medium"
              >
                <span>Full Readout</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </footer>

          {/* Minimal Bottom Case Study Navigation: Previous & Quiet "next: <title>" link */}
          <nav
            aria-label="Case Study Pagination"
            className="pt-8 pb-12 mt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs select-none"
          >
            <button
              type="button"
              onClick={handlePrev}
              title={`Previous: ${prevStudy.title}`}
              className="group flex items-center gap-1.5 text-stone-400 dark:text-zinc-500 hover:text-stone-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{prevStudy.title}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              title={`Next: ${nextStudy.title}`}
              className="group flex items-center gap-1.5 text-stone-700 dark:text-zinc-300 hover:text-stone-950 dark:hover:text-zinc-50 font-medium transition-colors cursor-pointer"
            >
              <span>next: {nextStudy.title}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </nav>
        </article>
      </div>
    </div>
  );
}
