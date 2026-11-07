"use client";

import React from "react";
import { FEATURED_ESSAYS } from "./caseStudiesData";
import { BookOpen, ExternalLink, Feather, Clock, ArrowUpRight } from "lucide-react";

export function EssaysSection() {
  return (
    <section id="essays" className="py-20 relative border-t border-white/10 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
              <Feather className="w-3.5 h-3.5" />
              Essays, Epistemic Inquiries & Poetics
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Writing to untangle mental models.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-sm">
            Selected long-form essays published on Bear Blog & the India Fellow platform examining systemic conditioning and personal agency.
          </p>
        </div>

        {/* Essays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_ESSAYS.map((essay) => (
            <a
              key={essay.id}
              href={essay.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-400/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:bg-white/[0.04]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {essay.category} // {essay.theme}
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>{essay.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>{essay.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {essay.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Published on {essay.source}</span>
                <span className="text-purple-400 group-hover:underline flex items-center gap-1">
                  Read Piece <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
