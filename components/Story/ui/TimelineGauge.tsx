"use client";

import React from "react";
import { JourneyStation } from "@/content/journey";

export interface TimelineGaugeProps {
  stations: JourneyStation[];
  activeStationIndex: number;
  rawProgress: number;
  onSelectStation: (stationId: string) => void;
}

export function TimelineGauge({
  stations,
  activeStationIndex,
  rawProgress,
  onSelectStation,
}: TimelineGaugeProps) {
  const textShadow = "0 1px 6px rgba(0,0,0,0.9)";

  return (
    <nav
      aria-label="Story Journey Timeline"
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-center pt-6 sm:pt-7 pointer-events-none select-none"
    >
      {/* Minimal pip row — no background card */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {stations.map((st, idx) => {
          const isActive = idx === activeStationIndex;
          const isPassed = idx < activeStationIndex;

          return (
            <button
              key={st.id}
              onClick={() => onSelectStation(st.id)}
              className="group relative flex items-center justify-center p-1 focus:outline-none"
              title={`${st.title} · ${st.year}`}
              aria-label={`Jump to ${st.title} (${st.year})`}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 24 : 6,
                  height: 4,
                  background: isActive
                    ? "rgba(255,255,255,0.90)"
                    : isPassed
                    ? "rgba(255,255,255,0.40)"
                    : "rgba(255,255,255,0.18)",
                  boxShadow: isActive ? textShadow : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
