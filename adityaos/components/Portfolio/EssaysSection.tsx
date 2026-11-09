"use client";

import React, { useState } from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { ArrowUpRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";
import { EssayItem } from "./types";

export function EssaysSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [filter, setFilter] = useState<"all" | "essay" | "poem">("all");
  const [readingEssay, setReadingEssay] = useState<EssayItem | null>(null);

  const essays = FEATURED_ESSAYS.filter((item) =>
    filter === "all"
      ? true
      : filter === "essay"
      ? item.category === "Essay"
      : item.category === "Poem"
  );

  const essayCount = FEATURED_ESSAYS.filter((e) => e.category === "Essay").length;
  const poemCount = FEATURED_ESSAYS.filter((e) => e.category === "Poem").length;

  return (
    <section id="essays" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark ? "bg-[#090b10]/40" : "bg-[#FBFBF9]"
        }`}
      >
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        <div
          className={`border-b border-dashed px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-semibold text-emerald-500">02</span>
            <h2
              className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Writing & Fieldwork
            </h2>
            <span
              className={`text-xs font-mono hidden sm:inline ${
                isDark ? "text-zinc-500" : "text-stone-400"
              }`}
            >
              — Grassroots governance & behavioral essays
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href="https://indiafellow.org/blog/all-posts/author/adityadiundi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 hover:underline ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>indiafellow.org</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
            <span className={isDark ? "text-zinc-700" : "text-stone-300"}>·</span>
            <a
              href="https://adityadiundi.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 hover:underline ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>medium.com</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
            <span className={isDark ? "text-zinc-700" : "text-stone-300"}>·</span>
            <a
              href="https://diundi.bearblog.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 hover:underline ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>bearblog.dev</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* 12-Column Balanced Editorial Split (Eliminates Right-Side Empty White Space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-dashed border-stone-200/80 dark:border-zinc-800/80">
          
          {/* LEFT: Fieldwork Context & Catalog Filters (Col Span 4) */}
          <div
            className={`lg:col-span-4 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-dashed transition-colors ${
              isDark ? "border-zinc-800/80" : "border-stone-200/80"
            }`}
          >
            <div className="lg:sticky lg:top-20 space-y-8">
              {/* Context Summary */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                  Fieldwork Immersion
                </div>
                <p className="text-xs sm:text-sm font-sans leading-relaxed text-stone-700 dark:text-zinc-300">
                  20 months of grassroots governance, rural education, and behavioral ethnography across Rajasthan and Bihar with India Fellow and Project Potential.
                </p>
              </div>

              {/* Filter Switcher */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                  Filter Catalog
                </div>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <button
                    onClick={() => setFilter("all")}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left cursor-pointer ${
                      filter === "all"
                        ? isDark
                          ? "bg-zinc-800 text-white font-medium"
                          : "bg-stone-200/80 text-stone-900 font-medium"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                        : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    <span>All Writeups</span>
                    <span className="opacity-60">{FEATURED_ESSAYS.length}</span>
                  </button>

                  <button
                    onClick={() => setFilter("essay")}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left cursor-pointer ${
                      filter === "essay"
                        ? isDark
                          ? "bg-zinc-800 text-white font-medium"
                          : "bg-stone-200/80 text-stone-900 font-medium"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                        : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    <span>Field Essays</span>
                    <span className="opacity-60">{essayCount}</span>
                  </button>

                  <button
                    onClick={() => setFilter("poem")}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left cursor-pointer ${
                      filter === "poem"
                        ? isDark
                          ? "bg-zinc-800 text-white font-medium"
                          : "bg-stone-200/80 text-stone-900 font-medium"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                        : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    <span>Poetics & Notes</span>
                    <span className="opacity-60">{poemCount}</span>
                  </button>
                </div>
              </div>

              {/* Research Vectors */}
              <div className="space-y-2 pt-4 border-t border-dashed border-stone-200/80 dark:border-zinc-800/80">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                  Core Inquiries
                </div>
                <div className="space-y-1.5 text-xs font-mono text-stone-500 dark:text-zinc-400">
                  <div>· Water Commons & Drought Resilience</div>
                  <div>· First-Gen Rural Aptitude & Logic</div>
                  <div>· Community Motivation in Youth Clubs</div>
                  <div>· ISABS Experiential Human Process</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: The Single-Column Stream of Articles (Col Span 8) */}
          <div
            className={`lg:col-span-8 divide-y divide-dashed transition-colors ${
              isDark ? "divide-zinc-800/80" : "divide-stone-200/80"
            }`}
          >
            {essays.map((essay) => {
              const hasContent = Boolean(essay.content && essay.content.length > 0);

              const cardContent = (
                <article className="p-6 sm:p-8 space-y-2.5 transition-colors group">
                  {/* Top Metadata: Flat monospace, category & reading time/year */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                      {essay.theme}
                    </span>
                    <span className={isDark ? "text-zinc-500" : "text-stone-400"}>
                      {essay.readTime} · {essay.year}
                    </span>
                  </div>

                  {/* Title with Inline Arrow */}
                  <h3
                    className={`text-lg sm:text-xl font-serif font-medium transition-colors leading-snug ${
                      isDark
                        ? "text-white group-hover:text-emerald-400"
                        : "text-stone-900 group-hover:text-emerald-600"
                    }`}
                  >
                    <span>{essay.title}</span>
                    <ArrowUpRight className="inline-block w-4 h-4 ml-1.5 align-middle text-zinc-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-40 group-hover:opacity-100" />
                  </h3>

                  {/* Excerpt */}
                  <p
                    className={`text-sm sm:text-base font-sans leading-relaxed ${
                      isDark ? "text-zinc-400" : "text-stone-600"
                    }`}
                  >
                    {essay.excerpt}
                  </p>

                  {/* Bottom: Clean Source */}
                  <div
                    className={`pt-1 text-xs font-mono flex items-center gap-2.5 ${
                      isDark ? "text-zinc-500" : "text-stone-400"
                    }`}
                  >
                    <span>{essay.source}</span>
                    {hasContent && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">
                          Read on site
                        </span>
                      </>
                    )}
                  </div>
                </article>
              );

              if (hasContent) {
                return (
                  <motion.div
                    key={essay.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setReadingEssay(essay)}
                    className="block cursor-pointer transition-colors"
                  >
                    {cardContent}
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={essay.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  href={essay.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors"
                >
                  {cardContent}
                </motion.a>
              );
            })}
          </div>

        </div>
      </div>

      {/* Reading Modal for Authentic Essays & Poems */}
      {readingEssay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setReadingEssay(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
              isDark
                ? "bg-[#0d1017] border-zinc-700 text-zinc-100"
                : "bg-stone-50 border-stone-300 text-stone-900"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex items-center justify-between gap-4 ${
                isDark ? "border-zinc-800 bg-[#090b10]" : "border-stone-200 bg-white"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isDark
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {readingEssay.category}
                  </span>
                  <span className={isDark ? "text-zinc-600" : "text-stone-400"}>•</span>
                  <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                    {readingEssay.theme}
                  </span>
                  <span className={isDark ? "text-zinc-600" : "text-stone-400"}>•</span>
                  <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                    {readingEssay.year}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
                  {readingEssay.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingEssay(null)}
                aria-label="Close reading view"
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  isDark
                    ? "border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    : "border-stone-200 hover:bg-stone-200 text-stone-600 hover:text-stone-900"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-4">
              {readingEssay.content && readingEssay.content.length > 0 ? (
                <div
                  className={`font-serif text-base sm:text-lg leading-relaxed space-y-2 select-text ${
                    isDark ? "text-zinc-200" : "text-stone-800"
                  }`}
                >
                  {readingEssay.content.map((line, idx) =>
                    line === "" ? (
                      <div key={idx} className="h-4" />
                    ) : (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm font-sans">{readingEssay.excerpt}</p>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 sm:px-8 border-t flex items-center justify-between text-xs font-mono ${
                isDark ? "border-zinc-800 bg-[#090b10] text-zinc-500" : "border-stone-200 bg-white text-stone-500"
              }`}
            >
              <span>{readingEssay.source} · Authentic Writing</span>
              <button
                onClick={() => setReadingEssay(null)}
                className={`px-4 py-1.5 rounded-lg border font-sans font-medium transition-colors cursor-pointer ${
                  isDark
                    ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    : "border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800"
                }`}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
