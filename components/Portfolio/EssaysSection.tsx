"use client";

import React, { useState } from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { BookOpen, ExternalLink, Feather, Clock, ArrowUpRight, Sparkles } from "lucide-react";

export function EssaysSection() {
  const essays = FEATURED_ESSAYS.filter((item) => item.category === "Essay");
  const poems = FEATURED_ESSAYS.filter((item) => item.category === "Poem");

  return (
    <section id="essays" className="py-24 relative border-t border-white/10 bg-[#07090E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-purple-400">
              <Feather className="w-3.5 h-3.5" />
              Epistemic Inquiries & Poetics
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-white tracking-[-0.035em] leading-[1.08]">
              Writing to untangle mental models.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Long-form critical essays and micro-poetry published on Bear Blog and the India Fellow platform, examining inherited dogma, rural domestic hierarchies, and personal agency.
            </p>
          </div>

          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 text-zinc-200 text-xs font-mono flex items-center gap-2 transition-all self-start md:self-end"
          >
            <span>Visit Bear Blog</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
          </a>
        </div>

        {/* 2-Column Split: Essays on Left (7 Cols), Micro-Poetry on Right (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Long-form Critical Essays */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest pb-2">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>Critical Long-Form Essays</span>
            </div>

            <div className="space-y-6">
              {essays.map((essay) => (
                <a
                  key={essay.id}
                  href={essay.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-7 rounded-3xl bg-[#0B0D14] border border-white/10 hover:border-purple-400/40 transition-all duration-300 space-y-4 hover:bg-[#0E111A] shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {essay.theme}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {essay.readTime} · {essay.year}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>{essay.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {essay.excerpt}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>Published on {essay.source}</span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-1 font-medium">
                      Read full essay <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Micro-Poetics & Lyrical Fragments */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest pb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Micro-Poetics & Lyrical Notes</span>
            </div>

            <div className="space-y-6">
              {poems.map((poem) => (
                <a
                  key={poem.id}
                  href={poem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-7 rounded-3xl bg-[#0A0C13] border border-white/10 hover:border-purple-400/40 transition-all duration-300 space-y-4 hover:bg-[#0D0F18] shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                      {poem.theme}
                    </span>
                    <span className="text-zinc-500">
                      {poem.readTime} · {poem.year}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>{poem.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 transition-transform" />
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans italic border-l-2 border-purple-500/40 pl-3">
                    {poem.excerpt}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>{poem.source}</span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-1 font-medium">
                      Read Stanza <ExternalLink className="w-3 h-3" />
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
