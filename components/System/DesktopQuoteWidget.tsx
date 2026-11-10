"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import quotesData from "@/data/quotes.json";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";
import { Quote } from "@/scripts/extract-quotes";
import { RotateCw, BookOpen, ExternalLink } from "lucide-react";

// Safe local storage helper
function getStoredHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("aditya_os_quote_history");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredHistory(history: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("aditya_os_quote_history", JSON.stringify(history.slice(-20)));
  } catch {
    // Ignore storage quota / incognito errors
  }
}

// Simple deterministic hash for Quote of the Day
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function DesktopQuoteWidget() {
  const { activeTheme } = useThemeStore();
  const { openWindow, focusWindow } = useOSStore();
  const { playClickChime } = useSoundStore();

  const quotes: Quote[] = useMemo(() => {
    return (quotesData as Quote[]).filter((q) => q.approved !== false);
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Initialize deterministic quote of the day
  useEffect(() => {
    if (quotes.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const dayIndex = hashString(today) % quotes.length;
    setCurrentIndex(dayIndex);

    const saved = getStoredHistory();
    setHistory(saved);
  }, [quotes]);

  const currentQuote = quotes[currentIndex] || quotes[0];

  // Rotate to next quote without repeating until full cycle
  const handleNextQuote = useCallback(() => {
    if (quotes.length <= 1) return;
    playClickChime(520);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 250);

    const currentId = currentQuote?.id;
    const updatedHistory = currentId ? [...history, currentId].slice(-20) : history;

    // Filter out quotes in recent history
    const unseenIndices = quotes
      .map((q, idx) => ({ q, idx }))
      .filter(({ q, idx }) => idx !== currentIndex && !updatedHistory.includes(q.id));

    let nextIdx: number;
    if (unseenIndices.length > 0) {
      const pick = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
      nextIdx = pick.idx;
    } else {
      // All have been seen in history, pick any random index different from current
      const valid = quotes.map((_, i) => i).filter((i) => i !== currentIndex);
      nextIdx = valid[Math.floor(Math.random() * valid.length)] ?? 0;
    }

    setCurrentIndex(nextIdx);
    const newHistory = [...updatedHistory, quotes[nextIdx].id].slice(-20);
    setHistory(newHistory);
    saveStoredHistory(newHistory);
  }, [quotes, currentIndex, currentQuote, history, playClickChime]);

  // Open quote source in Writing app (archiveReader) or external URL
  const handleOpenSource = useCallback(() => {
    if (!currentQuote) return;
    playClickChime(450);

    const url = currentQuote.sourceUrl;
    const isInternal =
      url.startsWith("essays/") ||
      url.startsWith("poetry/") ||
      url.includes(".md") ||
      url.includes(".txt");

    if (isInternal) {
      openWindow("archiveReader");
      focusWindow("archiveReader");
      // Dispatch custom event to select exact file in ArchiveReader
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-archive-file", {
            detail: { path: url },
          })
        );
      }
    } else {
      // External link (Medium, Bear Blog, etc.)
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [currentQuote, openWindow, focusWindow, playClickChime]);

  if (!currentQuote) return null;

  const isHindi = currentQuote.lang === "hi";

  return (
    <article
      aria-label={`Quote by Aditya Diwakar: ${currentQuote.text} from ${currentQuote.sourceTitle}`}
      className="relative max-w-2xl w-full flex flex-col items-center text-center px-4 sm:px-6 pointer-events-none"
    >
      {/* Decorative Quiet Quotation Glyph */}
      <span
        aria-hidden="true"
        className="font-serif text-3xl sm:text-4xl select-none leading-none opacity-20 -mb-2"
        style={{ color: activeTheme.textPrimary }}
      >
        &ldquo;
      </span>

      {/* Primary Quote Text in Editorial Display Serif */}
      <blockquote
        className={`font-serif text-base sm:text-xl md:text-2xl font-normal leading-relaxed tracking-tight select-text transition-opacity duration-200 ${
          isHindi ? "break-words leading-loose font-normal" : "italic"
        }`}
        style={{
          color: activeTheme.textPrimary,
          hyphens: isHindi ? "none" : "auto",
        }}
        lang={currentQuote.lang}
      >
        {currentQuote.text}
      </blockquote>

      {/* Attribution & Controls Bar */}
      <div
        className={`mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-[13px] pointer-events-auto ${
          isHindi ? "font-sans" : "font-mono"
        }`}
      >
        {/* Source Link (opens writing app or link) */}
        <button
          type="button"
          onClick={handleOpenSource}
          title={`Read full piece in Writing app: ${currentQuote.sourceTitle}`}
          className="group flex items-center gap-1.5 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          <span
            className={`underline underline-offset-4 decoration-black/20 dark:decoration-white/20 group-hover:decoration-current ${
              isHindi ? "font-serif text-xs sm:text-[13px]" : "font-mono"
            }`}
          >
            {currentQuote.sourceTitle}
          </span>
          {currentQuote.sourceUrl.startsWith("http") && (
            <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
          )}
        </button>

        <span className="text-stone-300 dark:text-zinc-600 select-none">·</span>

        {/* Rotate Button (↺) */}
        <button
          type="button"
          onClick={handleNextQuote}
          title="Rotate to next quote without repeats"
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 font-mono"
          style={{
            backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
          }}
        >
          <RotateCw
            className={`w-3 h-3 transition-transform duration-250 ${
              isRotating ? "rotate-180" : ""
            }`}
          />
          <span className="text-[11px] font-medium tracking-tight">rotate</span>
        </button>

        {/* Quiet Language Tag */}
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500 opacity-60 select-none">
          [{currentQuote.lang}]
        </span>
      </div>
    </article>
  );
}
