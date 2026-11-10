"use client";

import React, { useState, useEffect } from "react";
import { POETRY_LINES, PoetryLine } from "@/components/Portfolio/poetryData";
import { BookOpen, Clock, Pin, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { CaseStudyCard } from "@/components/System/CaseStudyCard";

interface DesktopObjectsProps {
  onOpenEssay: (essayPath: string) => void;
}

export function DesktopObjects({ onOpenEssay }: DesktopObjectsProps) {
  const { activeTheme } = useThemeStore();
  const { openWindows, minimizedWindows } = useOSStore();
  const isDesktopEmpty =
    openWindows.filter((id) => !minimizedWindows.includes(id)).length === 0;
  const isDark = activeTheme.isDark;

  // 1. Sticky Note Poetry Line
  const [poetryIndex, setPoetryIndex] = useState(0);
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * POETRY_LINES.length);
    setPoetryIndex(randomIdx);
  }, []);
  const currentPoetry: PoetryLine = POETRY_LINES[poetryIndex] || POETRY_LINES[0];

  // 2. Local Time Clock (Mono 12px+)
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* DESK OBJECT 1: Sticky Note with Random Poetry Line (Upper-center / Left-center) */}
      {/* ========================================================================= */}
      {!isDesktopEmpty && (
        <div className="hidden lg:block absolute top-16 left-32 z-0 pointer-events-auto select-none">
        <div
          onClick={() => setPoetryIndex((prev) => (prev + 1) % POETRY_LINES.length)}
          className={`w-64 p-4 rounded-sm shadow-md border rotate-[-1.5deg] hover:rotate-0 transition-transform duration-200 cursor-pointer ${
            isDark
              ? "bg-[#1C1F28] border-zinc-700/80 text-zinc-100 shadow-black/40"
              : "bg-[#FFFDE8] border-[#E8E2BE] text-[#1A1814] shadow-stone-300/40"
          }`}
          title="Click for another verse"
        >
          {/* Subtle paper tape strip at the top */}
          <div className="w-16 h-3 bg-stone-300/60 dark:bg-zinc-600/40 mx-auto -mt-5 mb-2 rounded-xs opacity-75" />

          <p
            className={`font-serif text-[15px] sm:text-[16px] leading-relaxed italic ${
              currentPoetry.lang === "hi" ? "font-normal" : "font-normal"
            }`}
          >
            &ldquo;{currentPoetry.text}&rdquo;
          </p>

          <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-stone-500 dark:text-zinc-400 border-t border-black/5 dark:border-white/5 pt-2">
            <span className="truncate">— {currentPoetry.source}</span>
            <span className="text-[10px] opacity-60">tap ↺</span>
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* DESK OBJECT 2: Case Studies Selector (Right Side of Desktop) */}
      {/* ========================================================================= */}
      <CaseStudyCard />

      {/* ========================================================================= */}
      {/* DESK OBJECT 3: Small Desk Clock (Bottom-Right above shell bar) */}
      {/* ========================================================================= */}
      <div
        className="hidden md:flex absolute bottom-14 right-6 sm:right-8 z-0 pointer-events-auto select-none items-center gap-2 group"
        title="Timezone: Asia/Kolkata (IST)"
      >
        <div
          className={`px-3 py-1.5 rounded-lg border shadow-sm backdrop-blur-md flex items-center gap-2.5 font-mono text-[12px] transition-colors ${
            isDark
              ? "bg-[#12141A]/90 border-zinc-800 text-zinc-300"
              : "bg-[#FAF7F2]/90 border-stone-200/90 text-stone-700"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold tracking-wider">{timeStr || "--:--:--"}</span>
          <span className="opacity-40">·</span>
          <span className="text-[11px] opacity-75">{dateStr}</span>
          <span className="text-[10px] opacity-0 group-hover:opacity-75 transition-opacity text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">
            IST
          </span>
        </div>
      </div>
    </>
  );
}
