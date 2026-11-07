"use client";

import React from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { BookOpen, ExternalLink, Feather, Clock, ArrowUpRight, Sparkles } from "lucide-react";

export function EssaysSection() {
  const essays = FEATURED_ESSAYS.filter((item) => item.category === "Essay");
  const poems = FEATURED_ESSAYS.filter((item) => item.category === "Poem");

  return (
    <section id="essays" className="relative">
      {/* Outer Continuous Structural Grid Container */}
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/50">
        {/* Section Header Row */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-zinc-200 font-semibold uppercase tracking-wider">02 // WRITING & SYSTEMS THINKING</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">EPISTEMIC INQUIRIES & POETICS</span>
            </div>
            <a
              href="https://diundi.bearblog.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>diundi.bearblog.dev</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.05]">
              Writing to untangle mental models.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Long-form critical essays and micro-poetry published on Bear Blog and the India Fellow platform, examining inherited dogma, rural domestic hierarchies, and personal agency.
            </p>
          </div>
        </div>

        {/* 2-Column Split Snapped to Continuous Structural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 border-b border-zinc-800">
          {/* Left Column (7 Cols): Long-form Critical Essays */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest pb-2">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>Critical Long-Form Essays</span>
            </div>

            <div className="space-y-5">
              {essays.map((essay) => (
                <a
                  key={essay.id}
                  href={essay.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-purple-400/40 transition-all duration-300 space-y-3 hover:bg-zinc-900/40 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                      {essay.theme}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {essay.readTime} · {essay.year}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>{essay.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {essay.excerpt}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Published on {essay.source}</span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-1">
                      Read full essay <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column (5 Cols): Micro-Poetics & Lyrical Fragments */}
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-6 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest pb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Micro-Poetics & Lyrical Notes</span>
            </div>

            <div className="space-y-5">
              {poems.map((poem) => (
                <a
                  key={poem.id}
                  href={poem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-purple-400/40 transition-all duration-300 space-y-3 hover:bg-zinc-900/40 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px]">
                      {poem.theme}
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      {poem.readTime} · {poem.year}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>{poem.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 transition-transform" />
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans italic border-l-2 border-purple-500/40 pl-3">
                    {poem.excerpt}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{poem.source}</span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-1">
                      Read stanza <ExternalLink className="w-3 h-3" />
                    </span>
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
