"use client";

import React, { useState } from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { ArrowUpRight, BookOpen, Feather } from "lucide-react";

export function EssaysSection() {
  const [filter, setFilter] = useState<"all" | "essay" | "poem">("all");

  const essays = FEATURED_ESSAYS.filter((item) =>
    filter === "all" ? true : filter === "essay" ? item.category === "Essay" : item.category === "Poem"
  );

  return (
    <section id="essays" className="relative">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="space-y-2">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              02 // Writing & Reflections
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Essays, fieldwork & poetry.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl pt-1">
              Reflections on mental models, rural ethnography, youth systems, and personal agency published on Bear Blog and India Fellow.
            </p>
          </div>

          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 hover:underline"
          >
            <span>diundi.bearblog.dev</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Filter Bar */}
        <div className="px-6 sm:px-10 py-3 border-b border-zinc-800 flex items-center justify-between text-xs font-mono bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filter === "all" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Writeups ({FEATURED_ESSAYS.length})
            </button>
            <button
              onClick={() => setFilter("essay")}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filter === "essay" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Essays (7)
            </button>
            <button
              onClick={() => setFilter("poem")}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filter === "poem" ? "bg-white text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Poetics & Notes (5)
            </button>
          </div>
          <span className="text-zinc-500 text-[11px] hidden sm:inline">Bear Blog · India Fellow</span>
        </div>

        {/* Articles Feed */}
        <div className="p-6 sm:p-10 border-b border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {essays.map((essay) => (
              <a
                key={essay.id}
                href={essay.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3 shadow-sm hover:bg-zinc-900/30"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
                    {essay.theme}
                  </span>
                  <span>
                    {essay.readTime} · {essay.year}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-sans text-white group-hover:text-zinc-300 transition-colors flex items-center justify-between">
                  <span>{essay.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans line-clamp-3">
                  {essay.excerpt}
                </p>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Published on {essay.source}</span>
                  <span className="text-zinc-400 group-hover:underline">Read →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
