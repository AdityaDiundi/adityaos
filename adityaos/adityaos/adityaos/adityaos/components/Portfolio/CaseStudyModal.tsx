"use client";

import React, { useEffect } from "react";
import { CaseStudy } from "./types";
import { X, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Layers } from "lucide-react";

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
}

export function CaseStudyModal({ caseStudy, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0e14] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-zinc-200 p-6 sm:p-8 space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
              style={{
                backgroundColor: `${caseStudy.accentColor}20`,
                color: caseStudy.accentColor,
                border: `1px solid ${caseStudy.accentColor}40`,
              }}
            >
              {caseStudy.number} // {caseStudy.category}
            </span>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {caseStudy.timeline}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            {caseStudy.title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
            {caseStudy.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span>Role: <strong className="text-zinc-200">{caseStudy.role}</strong></span>
            <span>Year: <strong className="text-zinc-200">{caseStudy.year}</strong></span>
          </div>
        </div>

        {/* Impact Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
          {caseStudy.impactMetrics.map((metric, idx) => (
            <div key={idx} className="space-y-0.5">
              <div
                className="text-2xl font-bold font-mono tracking-tight"
                style={{ color: caseStudy.accentColor }}
              >
                {metric.value}
              </div>
              <div className="text-xs font-sans font-semibold text-white">{metric.label}</div>
              {metric.detail && (
                <div className="text-[11px] text-zinc-400 font-sans">{metric.detail}</div>
              )}
            </div>
          ))}
        </div>

        {/* Executive Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: caseStudy.accentColor }} />
            Executive Summary
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {caseStudy.overview}
          </p>
        </div>

        {/* The Problem Section */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            The Friction & Ground Realities
          </h3>
          <div className="space-y-2 text-sm text-zinc-300 leading-relaxed font-sans">
            <div>
              <strong className="text-white">User Friction: </strong>
              {caseStudy.theProblem.friction}
            </div>
            <div>
              <strong className="text-white">Context & Blindspots: </strong>
              {caseStudy.theProblem.context}
            </div>
            <div className="pt-2 text-xs font-mono text-rose-300 bg-black/30 p-2.5 rounded border border-rose-500/20">
              💡 Core Insight: {caseStudy.theProblem.insight}
            </div>
          </div>
        </div>

        {/* The Solution & Architecture */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            {caseStudy.theSolution.headline}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {caseStudy.theSolution.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                    {pillar.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">0{idx + 1}</span>
                </div>
                <h4 className="font-semibold text-sm text-white font-sans">{pillar.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Figma Direct Link Action */}
        {caseStudy.figmaUrl && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-blue-950/30 border border-purple-500/30">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-sm font-semibold text-white font-sans flex items-center gap-2 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Explore Original Figma Canvas
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Inspect complete design flows, artboards, and interaction states.
              </div>
            </div>

            <a
              href={caseStudy.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex-shrink-0"
            >
              <span>Open in Figma</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Bottom Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
}
