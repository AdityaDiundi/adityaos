"use client";

import React, { useState } from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { ArrowUpRight, BookOpen, Feather } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export function EssaysSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [filter, setFilter] = useState<"all" | "essay" | "poem">("all");

  const essays = FEATURED_ESSAYS.filter((item) =>
    filter === "all"
      ? true
      : filter === "essay"
      ? item.category === "Essay"
      : item.category === "Poem"
  );

  return (
    <section id="essays" className="relative">
      <div
        className={`max-w-7xl mx-auto border-x relative transition-colors ${
          isDark
            ? "border-zinc-800 bg-[#090b10]/40"
            : "border-stone-200 bg-[#FBFBF9]"
        }`}
      >
        {/* Section Header */}
        <div
          className={`border-b p-8 sm:p-12 lg:p-14 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-colors ${
            isDark ? "border-zinc-800" : "border-stone-200"
          }`}
        >
          <div className="space-y-3">
            <div
              className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              02 // Writing & Reflections
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Essays, fieldwork & poetry.
            </h2>
            <p
              className={`text-sm sm:text-base font-sans max-w-xl pt-1 leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Reflections on mental models, rural ethnography, youth systems, and personal agency published on Bear Blog and India Fellow.
            </p>
          </div>

          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-mono flex items-center gap-1.5 hover:underline py-1 ${
              isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>diundi.bearblog.dev</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Filter Bar */}
        <div
          className={`px-8 sm:px-12 py-3.5 border-b flex items-center justify-between text-xs font-mono transition-colors ${
            isDark
              ? "border-zinc-800 bg-[#0c0e14]/60"
              : "border-stone-200 bg-stone-50/80"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter === "all"
                  ? isDark
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-stone-900 text-white font-semibold shadow-sm"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All Writeups ({FEATURED_ESSAYS.length})
            </button>
            <button
              onClick={() => setFilter("essay")}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter === "essay"
                  ? isDark
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-stone-900 text-white font-semibold shadow-sm"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Essays (7)
            </button>
            <button
              onClick={() => setFilter("poem")}
              className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter === "poem"
                  ? isDark
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-stone-900 text-white font-semibold shadow-sm"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Poetics & Notes (5)
            </button>
          </div>
          <span
            className={`text-xs hidden sm:inline ${
              isDark ? "text-zinc-500" : "text-stone-500"
            }`}
          >
            Bear Blog · India Fellow
          </span>
        </div>

        {/* Articles Feed with Relieved Typographic Spacing */}
        <div
          className={`p-8 sm:p-12 lg:p-14 border-b ${
            isDark ? "border-zinc-800" : "border-stone-200"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {essays.map((essay) => (
              <a
                key={essay.id}
                href={essay.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block p-7 sm:p-8 rounded-xl border transition-all space-y-4 shadow-sm ${
                  isDark
                    ? "bg-[#0c0e14] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#10131b]"
                    : "bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs font-mono ${
                    isDark ? "text-zinc-500" : "text-stone-500"
                  }`}
                >
                  <span
                    className={`px-2.5 py-0.5 rounded border text-xs ${
                      isDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                        : "bg-stone-100 border-stone-200 text-stone-700"
                    }`}
                  >
                    {essay.theme}
                  </span>
                  <span>
                    {essay.readTime} · {essay.year}
                  </span>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-bold font-sans transition-colors flex items-center justify-between gap-3 leading-snug ${
                    isDark
                      ? "text-white group-hover:text-emerald-400"
                      : "text-stone-900 group-hover:text-emerald-600"
                  }`}
                >
                  <span>{essay.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                </h3>

                <p
                  className={`text-sm font-sans leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  {essay.excerpt}
                </p>

                <div
                  className={`pt-2 flex items-center justify-between text-xs font-mono ${
                    isDark ? "text-zinc-500" : "text-stone-400"
                  }`}
                >
                  <span>{essay.source}</span>
                  <span
                    className={`group-hover:underline ${
                      isDark ? "text-zinc-400" : "text-stone-600"
                    }`}
                  >
                    Read on Bear Blog &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
