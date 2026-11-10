"use client";

import React from "react";
import { useOSStore } from "@/store/osStore";
import { DesktopQuoteWidget } from "./DesktopQuoteWidget";
import { TimeOnEarthWidget } from "./TimeOnEarthWidget";

export function EmptyDesktopDisplay() {
  const { openWindows, minimizedWindows } = useOSStore();

  // Desktop is empty when all open windows are minimized or no windows are open
  const activeUnminimizedWindows = openWindows.filter(
    (id) => !minimizedWindows.includes(id)
  );
  const isDesktopEmpty = activeUnminimizedWindows.length === 0;

  return (
    <div
      aria-hidden={!isDesktopEmpty}
      className={`absolute inset-0 z-0 flex flex-col items-center justify-center p-4 sm:p-12 transition-opacity duration-300 pointer-events-none mt-28 sm:mt-0 ${
        isDesktopEmpty ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Centered Editorial Stack: Quote above Time on Earth with generous whitespace */}
      <div className="flex flex-col items-center justify-center gap-7 sm:gap-9 max-w-3xl w-full">
        {/* Quote in Serif Editorial Style */}
        <DesktopQuoteWidget />

        {/* Subtle Horizontal Divider */}
        <div className="w-12 h-px bg-black/10 dark:bg-white/10 select-none" />

        {/* Time on Earth in Mono Small Caps */}
        <TimeOnEarthWidget />
      </div>
    </div>
  );
}
