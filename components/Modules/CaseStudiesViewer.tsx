"use client";

import React, { useState, useEffect } from "react";
import { DESKTOP_CASE_STUDIES, DesktopCaseStudy } from "@/config/caseStudies";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import { ExternalLink, ArrowUpRight, CheckCircle2, Layers, Briefcase, FileText } from "lucide-react";
import Link from "next/link";

export function CaseStudiesViewer() {
  const { activeTheme } = useThemeStore();
  const { playClickChime } = useSoundStore();
  const [selectedId, setSelectedId] = useState<string>(DESKTOP_CASE_STUDIES[0].id);

  // Listen for open-case-study events from desktop selector
  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; slug?: string }>;
      if (customEvent.detail?.id) {
        setSelectedId(customEvent.detail.id);
      }
    };
    window.addEventListener("open-case-study", handleSelect);
    return () => window.removeEventListener("open-case-study", handleSelect);
  }, []);

  const activeStudy: DesktopCaseStudy =
    DESKTOP_CASE_STUDIES.find((c) => c.id === selectedId) || DESKTOP_CASE_STUDIES[0];

  return (
    <div
      className="flex flex-col md:flex-row h-full w-full font-mono text-xs select-none overflow-hidden"
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
    >
      {/* Left Sidebar: Case Studies Index */}
      <aside
        className="w-full md:w-60 border-b md:border-b-0 md:border-r flex flex-col shrink-0"
        style={{
          borderColor: activeTheme.windowBorder,
          backgroundColor: activeTheme.isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <div
          className="p-3 border-b flex items-center justify-between text-[11px] font-bold uppercase tracking-wider"
          style={{
            borderColor: activeTheme.windowBorder,
            color: activeTheme.textMuted,
          }}
        >
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span>Shipped Work ({DESKTOP_CASE_STUDIES.length})</span>
          </span>
          <span className="text-[10px] opacity-60">2023–2024</span>
        </div>

        <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1">
          {DESKTOP_CASE_STUDIES.map((study) => {
            const isSelected = study.id === selectedId;
            return (
              <button
                key={study.id}
                type="button"
                onClick={() => {
                  playClickChime(500);
                  setSelectedId(study.id);
                }}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? "border font-medium shadow-xs"
                    : "hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isSelected ? activeTheme.cardBg : "transparent",
                  borderColor: isSelected ? activeTheme.accent : "transparent",
                  color: isSelected ? activeTheme.textPrimary : activeTheme.textMuted,
                }}
              >
                <span
                  className="font-mono text-[10px] font-bold opacity-60 pt-0.5"
                  style={{ color: isSelected ? activeTheme.accent : undefined }}
                >
                  {study.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate text-[12px]">{study.title}</div>
                  <div className="text-[10px] opacity-70 truncate mt-0.5">{study.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Link to Full Web Work Archive */}
        <div
          className="p-2.5 border-t text-[11px] flex items-center justify-between"
          style={{ borderColor: activeTheme.windowBorder }}
        >
          <a
            href="/work"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline text-emerald-600 dark:text-emerald-400 font-medium"
          >
            <span>Open /work archive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Right Detail Pane */}
      <main className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: activeTheme.windowBorder }}>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Case Study {activeStudy.number}
              </span>
              {activeStudy.client && (
                <span className="text-[11px] text-stone-500 dark:text-zinc-400">
                  Client: <strong className="font-semibold text-stone-700 dark:text-zinc-200">{activeStudy.client}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <Link
                href={`/work/${activeStudy.slug}`}
                className="px-2.5 py-1 rounded border hover:opacity-80 transition-colors flex items-center gap-1 font-semibold"
                style={{
                  backgroundColor: activeTheme.accent,
                  borderColor: activeTheme.accent,
                  color: activeTheme.isDark ? "#000" : "#fff",
                }}
              >
                <span>Read Full Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Title & Role */}
          <div>
            <h2 className="font-serif text-2xl font-normal leading-tight text-stone-900 dark:text-zinc-100">
              {activeStudy.title}
            </h2>
            <p className="font-mono text-xs text-stone-500 dark:text-zinc-400 mt-1">
              Role: <span className="font-medium text-stone-700 dark:text-zinc-200">{activeStudy.role}</span>
            </p>
          </div>

          {/* Outcome Metric Callout */}
          <div
            className="p-3.5 rounded-xl border flex items-center gap-3"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verified Impact Outcome
              </div>
              <div className="font-semibold text-stone-800 dark:text-zinc-100 text-xs mt-0.5">
                {activeStudy.outcome}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-1.5">
              Overview & Architecture
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-stone-600 dark:text-zinc-300">
              {activeStudy.summary}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {activeStudy.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] border border-black/10 dark:border-white/10 opacity-75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t flex flex-wrap items-center justify-between gap-3 text-[11px]" style={{ borderColor: activeTheme.windowBorder }}>
          <div className="text-stone-400 dark:text-zinc-500">
            diundi.space/work/{activeStudy.slug}
          </div>
          <div className="flex items-center gap-2">
            {activeStudy.liveUrl && (
              <a
                href={activeStudy.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                style={{ borderColor: activeTheme.cardBorder }}
              >
                <span>Live Prototype</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {activeStudy.figmaUrl && (
              <a
                href={activeStudy.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
                style={{ borderColor: activeTheme.cardBorder }}
              >
                <span>Figma Systems</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
