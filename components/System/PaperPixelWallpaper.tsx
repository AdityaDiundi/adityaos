"use client";

import React from "react";
import { useThemeStore } from "@/store/themeStore";

/**
 * Editorial Newspaper default wallpaper.
 * Renders a subtle low-contrast pixel landscape in the warm paper palette (#FAF7F2).
 * Styled like Japanese woodblock stationery / quiet desk mat.
 */
export function PaperPixelWallpaper() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Base warm paper tone */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: isDark ? "#0E1015" : "#FAF7F2",
        }}
      />

      {/* Subtle fine stationery dot grid (24px) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(26, 24, 20, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Low-contrast pixel-art landscape horizon anchored at bottom */}
      <div className="absolute bottom-10 left-0 right-0 h-72 pointer-events-none opacity-60 dark:opacity-25 transition-opacity">
        <svg
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
        >
          {/* Subtle Dithered Pixel Sun */}
          <g fill={isDark ? "#38BDF8" : "#E2D7C3"} opacity={isDark ? "0.2" : "0.5"}>
            <rect x="700" y="30" width="40" height="4" />
            <rect x="680" y="34" width="80" height="4" />
            <rect x="670" y="38" width="100" height="4" />
            <rect x="660" y="42" width="120" height="4" />
            <rect x="656" y="46" width="128" height="4" />
            <rect x="650" y="50" width="140" height="16" />
            <rect x="656" y="66" width="128" height="4" />
            <rect x="660" y="70" width="120" height="4" />
            <rect x="670" y="74" width="100" height="4" />
            <rect x="680" y="78" width="80" height="4" />
            <rect x="700" y="82" width="40" height="4" />
          </g>

          {/* Distant Mountain Range (stepped pixels) */}
          <path
            d="M0 160 L120 160 L120 140 L240 140 L360 110 L440 110 L480 90 L560 90 L640 120 L760 120 L840 80 L960 80 L1040 130 L1180 130 L1260 100 L1360 100 L1440 130 L1440 280 L0 280 Z"
            fill={isDark ? "#171B24" : "#EFE9DE"}
          />

          {/* Mid Ridge */}
          <path
            d="M0 190 L160 190 L200 170 L320 170 L400 145 L480 145 L540 165 L680 165 L760 135 L880 135 L980 170 L1120 170 L1200 140 L1320 140 L1440 175 L1440 280 L0 280 Z"
            fill={isDark ? "#1D222E" : "#E5DECFA0"}
          />

          {/* Near Rolling Foothills */}
          <path
            d="M0 220 L100 220 L180 205 L280 205 L380 225 L500 225 L620 195 L720 195 L840 215 L960 215 L1060 185 L1180 185 L1280 210 L1440 210 L1440 280 L0 280 Z"
            fill={isDark ? "#232A39" : "#DDD4C3"}
          />

          {/* Flat ground horizon line */}
          <rect
            x="0"
            y="260"
            width="1440"
            height="20"
            fill={isDark ? "#293245" : "#D2C7B3"}
          />
        </svg>
      </div>
    </div>
  );
}
