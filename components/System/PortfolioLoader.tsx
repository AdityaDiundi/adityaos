"use client";

import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioLoaderProps {
  minDurationMs?: number;
}

export const PortfolioLoader: React.FC<PortfolioLoaderProps> = ({ minDurationMs = 600 }) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500); // 500ms smooth fade transition
      return () => clearTimeout(removeTimer);
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs]);

  if (!visible) return null;

  return (
    <div
      aria-label="Loading portfolio"
      style={{
        backgroundColor: isDark ? "#0A0D14" : "#FAF7F2",
        color: isDark ? "#F3F4F6" : "#1C1917",
      }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ease-out select-none ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Circular Profile Picture with Spinning Aura */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer subtle spinning accent ring */}
        <div
          className="absolute inset-0 rounded-full border-[2px] border-black/10 dark:border-white/10 border-t-stone-900 dark:border-t-zinc-100 animate-spin"
          style={{ animationDuration: "1.1s" }}
        />
        {/* Secondary counter-spin delicate dashed aura */}
        <div
          className="absolute inset-1 rounded-full border border-dashed border-black/15 dark:border-white/15 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        />

        {/* Circular Profile Picture */}
        <div className="relative w-18 h-18 rounded-full overflow-hidden shadow-md ring-2 ring-black/5 dark:ring-white/10">
          <img
            src="/aditya_avatar_sq.jpg"
            alt="Aditya Diundi"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Identity Label */}
      <div className="mt-5 text-center flex flex-col items-center gap-1">
        <span
          style={{ fontFamily: "Newsreader, Georgia, serif" }}
          className="text-lg tracking-tight font-serif text-stone-900 dark:text-zinc-100"
        >
          Aditya Diundi
        </span>
        <span className="text-[11px] font-mono text-stone-500 dark:text-zinc-400 flex items-center gap-1.5 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INITIALIZING</span>
        </span>
      </div>
    </div>
  );
};
