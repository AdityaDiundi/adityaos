"use client";

import React from "react";
import { JourneyStation, WritingItem } from "@/content/journey";

export interface YearRailProps {
  stations: JourneyStation[];
  writingItems: WritingItem[];
  activeStationIndex: number;
  currentYear: number;
  onSelectStation: (stationId: string) => void;
}

export function YearRail({
  stations,
  writingItems,
  activeStationIndex,
  currentYear,
  onSelectStation,
}: YearRailProps) {
  const writingYears = new Set(writingItems.map((w) => w.year));

  return (
    <aside
      aria-label="Timeline Year Rail"
      className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end select-none pointer-events-auto"
    >
      {/* Dynamic Ticking Year Display */}
      <div className="mb-4 pr-1 text-right">
        <span className="font-mono text-xs text-[#A8A29E] dark:text-[#64748B] block tracking-widest uppercase">
          Year
        </span>
        <span className="font-mono text-xl sm:text-2xl font-semibold tracking-tighter text-[#1C1917] dark:text-[#F8FAFC]">
          {currentYear}
        </span>
      </div>

      {/* Vertical Rail Track */}
      <div className="relative flex flex-col items-center gap-3 py-2 pl-3">
        {/* Subtle line background */}
        <div className="absolute right-[5px] top-0 bottom-0 w-[1px] bg-[#E7E5E4] dark:bg-[#334155]" />

        {stations.map((station, idx) => {
          const isActive = idx === activeStationIndex;
          const hasWriting = writingYears.has(station.year);

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              className="group relative flex items-center justify-end py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              aria-label={`Jump to ${station.title} (${station.year})`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Tooltip on hover/focus */}
              <div className="mr-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 pointer-events-none text-right whitespace-nowrap hidden sm:block">
                <span className="font-mono text-[11px] text-[#78716C] dark:text-[#94A3B8] block">
                  {station.dateStart}
                </span>
                <span className="font-serif text-xs text-[#1C1917] dark:text-[#F1F5F9] font-medium">
                  {station.title}
                </span>
              </div>

              {/* Writing lane indicator dot next to tick if applicable */}
              {hasWriting && (
                <span
                  title="Writing note available"
                  className="w-1.5 h-1.5 rounded-full bg-amber-500/70 mr-1.5"
                />
              )}

              {/* Station Tick Mark */}
              <div
                className={`relative z-10 transition-all duration-200 ${
                  isActive
                    ? "w-3.5 h-3.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8] ring-4 ring-[#0284C7]/20 dark:ring-[#38BDF8]/20"
                    : "w-2.5 h-2.5 rounded-full bg-[#D6D3D1] dark:bg-[#475569] group-hover:bg-[#78716C] dark:group-hover:bg-[#94A3B8]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
