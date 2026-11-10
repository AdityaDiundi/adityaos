"use client";

import React, { useState, useRef, useCallback } from "react";
import { DESKTOP_CASE_STUDIES, DesktopCaseStudy } from "@/config/caseStudies";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";
import { Briefcase, ArrowUpRight } from "lucide-react";

export function CaseStudyCard() {
  const { activeTheme } = useThemeStore();
  const { openWindow, focusWindow } = useOSStore();
  const { playClickChime, playScrollNote } = useSoundStore();
  const isDark = activeTheme.isDark;

  // Default active item is the most recent / featured one (index 0)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeStudy: DesktopCaseStudy = DESKTOP_CASE_STUDIES[activeIndex] || DESKTOP_CASE_STUDIES[0];

  const handleOpenStudy = useCallback(
    (study: DesktopCaseStudy) => {
      playClickChime(500);
      openWindow("caseStudies");
      focusWindow("caseStudies");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-case-study", {
            detail: { id: study.id, slug: study.slug },
          })
        );
      }
    },
    [openWindow, focusWindow, playClickChime]
  );

  // Keyboard navigation: ArrowUp, ArrowDown, Enter
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % DESKTOP_CASE_STUDIES.length;
      setSelectedIndex(next);
      playScrollNote(440 + next * 30);
      const nextBtn = listRef.current?.querySelectorAll("button")[next];
      nextBtn?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + DESKTOP_CASE_STUDIES.length) % DESKTOP_CASE_STUDIES.length;
      setSelectedIndex(prev);
      playScrollNote(440 + prev * 30);
      const prevBtn = listRef.current?.querySelectorAll("button")[prev];
      prevBtn?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenStudy(DESKTOP_CASE_STUDIES[index]);
    }
  };

  return (
    <aside
      aria-label="Featured Case Studies Selector"
      className="hidden xl:block absolute top-16 right-8 sm:right-12 z-0 pointer-events-auto select-none"
    >
      <div
        className={`w-72 p-4 rounded-xl border shadow-lg transition-all duration-200 hover:shadow-xl ${
          isDark
            ? "bg-[#12141A]/95 border-zinc-800 text-zinc-100 hover:border-zinc-700"
            : "bg-[#FAF7F2]/95 border-stone-200 text-[#1A1814] hover:border-stone-300"
        }`}
        style={{ backdropFilter: "blur(12px)" }}
      >
        {/* Card Header: Mono label */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-zinc-400 mb-2.5">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-3 h-3" />
            CASE STUDIES
          </span>
          <span className="text-[10px] opacity-60">
            {activeStudy.number} / 0{DESKTOP_CASE_STUDIES.length}
          </span>
        </div>

        {/* Text-Only Vertical List of Titles */}
        <ul ref={listRef} role="listbox" aria-label="Case studies list" className="flex flex-col gap-1 my-2">
          {DESKTOP_CASE_STUDIES.map((study, idx) => {
            const isHighlighted = idx === activeIndex;
            return (
              <li key={study.id} role="option" aria-selected={isHighlighted}>
                <button
                  type="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedIndex(idx);
                    handleOpenStudy(study);
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setSelectedIndex(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-colors flex items-center justify-between group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                    isHighlighted
                      ? isDark
                        ? "bg-white/10 text-zinc-100"
                        : "bg-black/5 text-stone-900 font-medium"
                      : "text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate text-xs">
                    <span
                      className={`font-mono text-[10px] ${
                        isHighlighted ? "text-emerald-600 dark:text-emerald-400 font-bold" : "opacity-50"
                      }`}
                    >
                      {study.number}
                    </span>
                    <span className="truncate">{study.title}</span>
                  </span>

                  <ArrowUpRight
                    className={`w-3 h-3 shrink-0 transition-opacity ${
                      isHighlighted ? "opacity-100 text-emerald-500" : "opacity-0 group-hover:opacity-60"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Secondary Summary Line: Swaps on hover/focus */}
        <div
          className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 transition-all duration-150 min-h-[44px] flex flex-col justify-center"
        >
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate font-semibold">
            {activeStudy.outcome}
          </div>
          <div className="font-mono text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
            {activeStudy.role}
          </div>
        </div>

        {/* Card Footer Call to Action */}
        <div
          onClick={() => handleOpenStudy(activeStudy)}
          className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline"
        >
          <span>Open in Work app</span>
          <span>→</span>
        </div>
      </div>
    </aside>
  );
}
