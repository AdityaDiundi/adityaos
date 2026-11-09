"use client";

import React, { useState } from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { ArrowUpRight, BookOpen, Feather, X, ExternalLink } from "lucide-react";
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
          isDark
            ? "bg-[#090b10]/40"
            : "bg-[#FBFBF9]"
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

        {/* Filter Navigation Bar */}
        <div
          className={`px-6 sm:px-8 py-3.5 border-b border-dashed flex items-center justify-between text-xs font-mono transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#090b10]/60" : "border-stone-200/80 bg-stone-50/50"
          }`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                filter === "all"
                  ? isDark
                    ? "text-white font-semibold underline underline-offset-8 decoration-emerald-500 decoration-2"
                    : "text-stone-900 font-semibold underline underline-offset-8 decoration-emerald-600 decoration-2"
                  : isDark
                  ? "text-zinc-500 hover:text-zinc-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <span>All Writeups</span>
              <span className="opacity-60 text-[11px]">({FEATURED_ESSAYS.length})</span>
            </button>
            <button
              onClick={() => setFilter("essay")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                filter === "essay"
                  ? isDark
                    ? "text-white font-semibold underline underline-offset-8 decoration-emerald-500 decoration-2"
                    : "text-stone-900 font-semibold underline underline-offset-8 decoration-emerald-600 decoration-2"
                  : isDark
                  ? "text-zinc-500 hover:text-zinc-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <span>Essays</span>
              <span className="opacity-60 text-[11px]">({essayCount})</span>
            </button>
            <button
              onClick={() => setFilter("poem")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                filter === "poem"
                  ? isDark
                    ? "text-white font-semibold underline underline-offset-8 decoration-emerald-500 decoration-2"
                    : "text-stone-900 font-semibold underline underline-offset-8 decoration-emerald-600 decoration-2"
                  : isDark
                  ? "text-zinc-500 hover:text-zinc-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <span>Poetics & Notes</span>
              <span className="opacity-60 text-[11px]">({poemCount})</span>
            </button>
          </div>
          <span
            className={`text-[11px] font-mono hidden sm:inline ${
              isDark ? "text-zinc-500" : "text-stone-400"
            }`}
          >
            {essays.length} {essays.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Articles Feed - Clean Single Column Blog Stream Aligned to Grid */}
        <div
          className={`border-b border-dashed divide-y divide-dashed transition-colors ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {essays.map((essay) => {
            const hasContent = Boolean(essay.content && essay.content.length > 0);

            const cardContent = (
              <article className="p-6 sm:p-8 space-y-2.5 transition-colors group">
                {/* Top Metadata: Flat monospace, category & reading time/year */}
                <div className="flex items-center justify-between text-xs font-mono max-w-3xl">
                  <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                    {essay.theme}
                  </span>
                  <span className={isDark ? "text-zinc-500" : "text-stone-400"}>
                    {essay.readTime} · {essay.year}
                  </span>
                </div>

                {/* Title with Inline Arrow */}
                <h3
                  className={`text-lg sm:text-xl font-serif font-medium transition-colors leading-snug max-w-3xl ${
                    isDark
                      ? "text-white group-hover:text-emerald-400"
                      : "text-stone-900 group-hover:text-emerald-600"
                  }`}
                >
                  <span>{essay.title}</span>
                  <ArrowUpRight className="inline-block w-4 h-4 ml-1.5 align-middle text-zinc-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-40 group-hover:opacity-100" />
                </h3>

                {/* Excerpt with optimal measure */}
                <p
                  className={`text-sm sm:text-base font-sans leading-relaxed max-w-3xl ${
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
