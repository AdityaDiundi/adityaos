"use client";

import React, { useState, useRef, useCallback } from "react";
import { DESKTOP_CASE_STUDIES, DesktopCaseStudy } from "@/config/caseStudies";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";

export function CaseStudyCard() {
  const { openWindow, focusWindow } = useOSStore();
  const { playClickChime, playScrollNote } = useSoundStore();

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
      aria-label="Featured Case Studies"
      className="hidden xl:flex flex-col items-end text-right absolute top-16 right-8 sm:right-12 z-0 pointer-events-auto select-none"
    >
      {/* Quiet Section Label */}
      <span className="text-[11px] font-mono tracking-tight text-stone-400 dark:text-zinc-500 mb-2">
        Case studies
      </span>

      {/* Plain Text List of Titles (No index numbers, no arrow icons, no card chrome) */}
      <ul
        ref={listRef}
        role="listbox"
        aria-label="Case studies list"
        className="flex flex-col items-end gap-1.5 my-0.5"
      >
        {DESKTOP_CASE_STUDIES.map((study, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <li key={study.id} role="option" aria-selected={isSelected}>
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
                className={`text-right font-serif text-[15px] sm:text-[16px] cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500 rounded px-1.5 py-0.5 ${
                  isSelected
                    ? "text-stone-900 dark:text-zinc-100 font-medium opacity-100"
                    : "text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300 font-normal opacity-70 hover:opacity-100"
                }`}
              >
                {study.title}
              </button>
            </li>
          );
        })}
      </ul>

      {/* One-Line Headline Outcome Beneath List (Fades in, no ellipsis truncation) */}
      <div className="mt-2.5 min-h-[20px] flex items-center justify-end">
        {activeStudy.outcome ? (
          <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-400 whitespace-nowrap transition-opacity duration-200 animate-in fade-in">
            {activeStudy.outcome}
          </span>
        ) : null}
      </div>
    </aside>
  );
}
