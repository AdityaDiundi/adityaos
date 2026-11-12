"use client";

import React, { useEffect, useState, useRef } from "react";
import { JourneyStation } from "@/content/journey";

export interface MinimalCaptionProps {
  station: JourneyStation;
  stationIndex?: number;
  totalStations?: number;
  isSettled?: boolean;
}

export function MinimalCaption({
  station,
  stationIndex = 0,
  totalStations = 9,
  isSettled = true,
}: MinimalCaptionProps) {
  const [displayStation, setDisplayStation] = useState<JourneyStation>(station);
  const [isFading, setIsFading] = useState<boolean>(false);
  const prevIdRef = useRef<string>(station.id);

  useEffect(() => {
    if (station.id === prevIdRef.current) return;

    setIsFading(true);
    const timer = setTimeout(() => {
      setDisplayStation(station);
      prevIdRef.current = station.id;
      setIsFading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [station]);

  const dateStr = displayStation.dateEnd
    ? `${displayStation.dateStart} — ${displayStation.dateEnd}`
    : displayStation.dateStart;

  const textShadowStyle = { textShadow: "0 2px 12px rgba(0,0,0,0.9)" };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-8 left-6 sm:left-10 max-w-sm pointer-events-none z-20"
      style={{
        opacity: isFading ? 0 : 1,
        transform: isFading ? "translateY(8px)" : "translateY(0px)",
        transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
      }}
    >
      {/* Date in tiny monospace */}
      <p
        className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-1.5"
        style={textShadowStyle}
      >
        {dateStr}
      </p>

      {/* Station title in large bold white serif */}
      <h2
        className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight mb-2 drop-shadow-lg"
        style={textShadowStyle}
      >
        {displayStation.title}
      </h2>

      {/* Narrative one-liner in small sans text-white/70 */}
      <p
        className="font-sans text-sm text-white/70 leading-relaxed line-clamp-2"
        style={textShadowStyle}
      >
        {displayStation.line}
      </p>

      {/* Outcome in text-[11px] font-mono text-cyan-400 mt-2 */}
      {displayStation.outcome && (
        <p
          className="text-[11px] font-mono text-cyan-400 mt-2"
          style={textShadowStyle}
        >
          ✓ {displayStation.outcome}
        </p>
      )}
    </div>
  );
}
