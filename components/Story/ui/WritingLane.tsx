"use client";

import React from "react";
import { WritingItem } from "@/content/journey";

export interface WritingLaneProps {
  currentYear: number;
  activeStationYear: number;
  writingItems: WritingItem[];
}

export function WritingLane({
  currentYear,
  activeStationYear,
  writingItems,
}: WritingLaneProps) {
  // Find essay matching active station year or current interpolated year
  const matchingEssay = writingItems.find(
    (w) => w.year === activeStationYear || w.year === currentYear
  );

  if (!matchingEssay) return null;

  return (
    <div
      aria-label="Writing Lane Note"
      className="fixed left-4 sm:left-10 bottom-24 z-30 max-w-xs sm:max-w-sm pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
    >
      <div className="bg-[#FAF7F2]/90 dark:bg-[#13161F]/90 backdrop-blur-md border border-[#E7E5E4] dark:border-[#2A303F] p-3.5 rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-mono text-[10px] tracking-widest text-[#78716C] dark:text-[#94A3B8] uppercase">
            Writing · {matchingEssay.publishDate}
          </span>
          {matchingEssay.placeholder && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
              Draft
            </span>
          )}
        </div>

        <h4 className="font-serif text-sm font-medium text-[#1C1917] dark:text-[#F1F5F9] line-clamp-1 mb-1">
          {matchingEssay.title}
        </h4>

        {matchingEssay.excerpt && (
          <p className="font-sans text-xs text-[#57534E] dark:text-[#CBD5E1] line-clamp-2 mb-2 leading-relaxed">
            {matchingEssay.excerpt}
          </p>
        )}

        {matchingEssay.url && (
          <a
            href={matchingEssay.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#0284C7] dark:text-[#38BDF8] hover:underline"
          >
            <span>read essay</span>
            <span>↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
