"use client";

import React from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { ArrowUpRight } from "lucide-react";

export function EssaysSection() {
  const essays = FEATURED_ESSAYS.filter((item) => item.category === "Essay");
  const poems = FEATURED_ESSAYS.filter((item) => item.category === "Poem");

  return (
    <section id="essays" className="relative">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/50">
        {/* Section Header */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="space-y-2">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              02 // Writing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Essays & notes.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl pt-1">
              Reflections on mental models, rural ethnography, and personal agency published on Bear Blog and India Fellow.
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

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 border-b border-zinc-800">
          {/* Essays (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider pb-2">
              Long-Form Essays
            </div>

            <div className="space-y-4">
              {essays.map((essay) => (
                <a
                  key={essay.id}
                  href={essay.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>{essay.theme}</span>
                    <span>{essay.readTime} · {essay.year}</span>
                  </div>

                  <h3 className="text-lg font-bold font-sans text-white group-hover:text-zinc-300 transition-colors flex items-center justify-between">
                    <span>{essay.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {essay.excerpt}
                  </p>

                  <div className="pt-2 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                    Published on {essay.source}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Poetry (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-4 bg-zinc-950/40">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider pb-2">
              Micro-Poetics & Notes
            </div>

            <div className="space-y-4">
              {poems.map((poem) => (
                <a
                  key={poem.id}
                  href={poem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>{poem.theme}</span>
                    <span>{poem.year}</span>
                  </div>

                  <h3 className="text-base font-bold font-sans text-white group-hover:text-zinc-300 transition-colors flex items-center justify-between">
                    <span>{poem.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans italic border-l border-zinc-700 pl-3">
                    {poem.excerpt}
                  </p>

                  <div className="pt-2 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                    {poem.source}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
