"use client";

import React, { useState } from "react";
import { FEATURED_CASE_STUDIES } from "./caseStudiesData";
import { CaseStudy } from "./types";
import {
  JanevalPreview,
  UPIMeterPreview,
  HairTrackerPreview,
  ClaimsPortalPreview,
  LearnabilityMatrixPreview,
} from "./CaseStudyPreviews";
import { CaseStudyModal } from "./CaseStudyModal";
import { ArrowUpRight, Sparkles, Layers, ShieldCheck, ChevronRight } from "lucide-react";

export function BentoCaseStudies() {
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudy | null>(null);

  const janeval = FEATURED_CASE_STUDIES.find((c) => c.id === "janeval")!;
  const upi = FEATURED_CASE_STUDIES.find((c) => c.id === "upi-limit-clarity")!;
  const hair = FEATURED_CASE_STUDIES.find((c) => c.id === "hair-tracker")!;
  const claims = FEATURED_CASE_STUDIES.find((c) => c.id === "corporate-claims")!;
  const aarohi = FEATURED_CASE_STUDIES.find((c) => c.id === "aarohi-lab")!;

  return (
    <section id="work" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Selected Design Systems & Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
              Crafting clarity from <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">complex constraints</span>.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-sm">
            Click any project card to inspect full problem framing, behavioral research, user flows, and Figma nodes.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: JANEVAL (7 Cols) */}
          <div
            onClick={() => setActiveModalStudy(janeval)}
            className="lg:col-span-7 group relative p-6 sm:p-8 rounded-2xl bg-[#0b0f0e] border border-emerald-500/25 hover:border-emerald-400/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {janeval.badge} // {janeval.year}
                </span>
                <span className="p-2 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-black text-zinc-400 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-sans text-white group-hover:text-emerald-300 transition-colors">
                  {janeval.title}
                </h3>
                <p className="text-sm text-zinc-300 font-sans mt-1 leading-relaxed">
                  {janeval.tagline}
                </p>
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <JanevalPreview />
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-6 pt-4 border-t border-emerald-500/15 grid grid-cols-3 gap-2 text-xs font-mono relative z-10">
              {janeval.impactMetrics.map((m, i) => (
                <div key={i}>
                  <div className="text-emerald-400 font-bold text-base">{m.value}</div>
                  <div className="text-[10px] text-zinc-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: UPI Limit Clarity (5 Cols) */}
          <div
            onClick={() => setActiveModalStudy(upi)}
            className="lg:col-span-5 group relative p-6 sm:p-8 rounded-2xl bg-[#090d14] border border-cyan-500/25 hover:border-cyan-400/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {upi.badge} // {upi.year}
                </span>
                <span className="p-2 rounded-full bg-white/5 group-hover:bg-cyan-400 group-hover:text-black text-zinc-400 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-sans text-white group-hover:text-cyan-300 transition-colors">
                  {upi.title}
                </h3>
                <p className="text-sm text-zinc-300 font-sans mt-1 leading-relaxed">
                  {upi.tagline}
                </p>
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <UPIMeterPreview />
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-6 pt-4 border-t border-cyan-500/15 grid grid-cols-3 gap-2 text-xs font-mono relative z-10">
              {upi.impactMetrics.map((m, i) => (
                <div key={i}>
                  <div className="text-cyan-400 font-bold text-base">{m.value}</div>
                  <div className="text-[10px] text-zinc-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: 3 Cards of 4 Cols each */}

          {/* Card 3: 21-Day Hair Tracker (4 Cols) */}
          <div
            onClick={() => setActiveModalStudy(hair)}
            className="lg:col-span-4 group relative p-6 rounded-2xl bg-[#120e0a] border border-amber-500/25 hover:border-amber-400/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {hair.badge}
                </span>
                <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-amber-400 group-hover:text-black text-zinc-400 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-amber-300 transition-colors">
                  {hair.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  {hair.tagline}
                </p>
              </div>

              <div className="pt-1">
                <HairTrackerPreview />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/15 flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Day 14 Retention</span>
              <span className="text-amber-400 font-bold">+44% Cohort Adherence</span>
            </div>
          </div>

          {/* Card 4: Corporate Claims Portal (4 Cols) */}
          <div
            onClick={() => setActiveModalStudy(claims)}
            className="lg:col-span-4 group relative p-6 rounded-2xl bg-[#0f0b18] border border-purple-500/25 hover:border-purple-400/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {claims.badge}
                </span>
                <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-purple-400 group-hover:text-black text-zinc-400 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-purple-300 transition-colors">
                  {claims.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  {claims.tagline}
                </p>
              </div>

              <div className="pt-1">
                <ClaimsPortalPreview />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-500/15 flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Admin Onboarding</span>
              <span className="text-purple-400 font-bold">-62% Task Completion Time</span>
            </div>
          </div>

          {/* Card 5: Aarohi Learnability Lab (4 Cols) */}
          <div
            onClick={() => setActiveModalStudy(aarohi)}
            className="lg:col-span-4 group relative p-6 rounded-2xl bg-[#091014] border border-sky-500/25 hover:border-sky-400/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {aarohi.badge}
                </span>
                <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-sky-400 group-hover:text-black text-zinc-400 transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-sky-300 transition-colors">
                  {aarohi.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  {aarohi.tagline}
                </p>
              </div>

              <div className="pt-1">
                <LearnabilityMatrixPreview />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-500/15 flex justify-between text-[11px] font-mono text-zinc-400">
              <span>Rural Assessment</span>
              <span className="text-sky-400 font-bold">100+ Students Diagnostic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Modal */}
      <CaseStudyModal
        caseStudy={activeModalStudy}
        onClose={() => setActiveModalStudy(null)}
      />
    </section>
  );
}
