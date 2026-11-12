"use client";

import React, { useState } from "react";
import { JourneyStation } from "@/content/journey";

export interface MinimalRailProps {
  stations: JourneyStation[];
  activeStationIndex: number;
  onSelectStation: (stationId: string) => void;
}

export function MinimalRail({
  stations,
  activeStationIndex,
  onSelectStation,
}: MinimalRailProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const currentStation = stations[activeStationIndex] || stations[0];
  const activeYear = currentStation?.year || 2000;

  return (
    <aside
      aria-label="Timeline Year Rail"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-end select-none pointer-events-auto"
    >
      {/* Year Numeral derived strictly from active station */}
      <div className="mb-4 pr-0.5 text-right">
        <span
          className="font-mono text-xl sm:text-2xl font-semibold tracking-tighter text-[#F8FAFC]"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
        >
          {activeYear}
        </span>
      </div>

      {/* Thin Vertical Progress Line with Hidden-by-Default Dots */}
      <div className="relative flex flex-col items-center gap-3 py-1 pl-3">
        {/* Subtle 1px progress track */}
        <div className="absolute right-[4px] top-0 bottom-0 w-[1px] bg-[#E7E5E4]/60 dark:bg-[#334155]/60" />

        {stations.map((station, idx) => {
          const isActive = idx === activeStationIndex;

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              className="group relative flex items-center justify-end py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 rounded"
              aria-label={`Jump to ${station.title} (${station.year})`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Tooltip visible only when rail is hovered/focused */}
              <div
                className={`mr-3 transition-opacity duration-150 pointer-events-none text-right whitespace-nowrap hidden sm:block ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="font-mono text-[10px] text-[#A8A29E] dark:text-[#94A3B8] block">
                  {station.dateStart}
                </span>
                <span className="font-serif text-xs text-[#1C1917] dark:text-[#F1F5F9]">
                  {station.title}
                </span>
              </div>

              {/* Station Dot: Active dot illuminated, inactive dots subtly visible for full gauge */}
              <div
                className={`relative z-10 transition-all duration-200 ${
                  isActive
                    ? "w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-2 ring-[#38BDF8]/40 scale-110 opacity-100"
                    : `w-1.5 h-1.5 rounded-full bg-[#78716C] dark:bg-[#64748B] ${
                        isHovered ? "opacity-80 group-hover:opacity-100 group-hover:scale-125" : "opacity-35"
                      }`
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
