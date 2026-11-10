"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import quotesData from "@/data/quotes.json";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";
import { Quote } from "@/scripts/extract-quotes";
// No extra icons needed for clean editorial quote widget

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
  const [isFading, setIsFading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  // Helper to pick next non-repeated quote index
  const getNextIndex = useCallback(
    (currIdx: number, currHistory: string[]) => {
      const currentId = quotes[currIdx]?.id;
      const updatedHistory = currentId ? [...currHistory, currentId].slice(-20) : currHistory;

      const unseenIndices = quotes
        .map((q, idx) => ({ q, idx }))
        .filter(({ q, idx }) => idx !== currIdx && !updatedHistory.includes(q.id));

      let nextIdx: number;
      if (unseenIndices.length > 0) {
        const pick = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
        nextIdx = pick.idx;
      } else {
        const valid = quotes.map((_, i) => i).filter((i) => i !== currIdx);
        nextIdx = valid[Math.floor(Math.random() * valid.length)] ?? 0;
      }
      return { nextIdx, updatedHistory };
    },
    [quotes]
  );

  // Rotate to next quote with gentle crossfade or instant for reduced motion
  const handleNextQuote = useCallback(() => {
    if (quotes.length <= 1) return;
    playClickChime(520);

    const { nextIdx, updatedHistory } = getNextIndex(currentIndex, history);

    if (reducedMotion) {
      setCurrentIndex(nextIdx);
      const newHistory = [...updatedHistory, quotes[nextIdx].id].slice(-20);
      setHistory(newHistory);
      saveStoredHistory(newHistory);
      return;
    }

    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      const newHistory = [...updatedHistory, quotes[nextIdx].id].slice(-20);
      setHistory(newHistory);
      saveStoredHistory(newHistory);
      setTimeout(() => {
        setIsFading(false);
      }, 50);
    }, 220);
  }, [quotes, currentIndex, history, reducedMotion, getNextIndex, playClickChime]);

  // Auto-rotate on calm timer (~20s), paused on hover or when prefers-reduced-motion
  useEffect(() => {
    if (reducedMotion || isHovered || quotes.length <= 1) return;
    const timer = setInterval(() => {
      handleNextQuote();
    }, 20000);
    return () => clearInterval(timer);
  }, [reducedMotion, isHovered, quotes.length, handleNextQuote]);

  // Open quote source in Writing app (archiveReader) or external URL
  const handleOpenSource = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
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
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("open-archive-file", {
              detail: { path: url },
            })
          );
        }
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [currentQuote, openWindow, focusWindow, playClickChime]
  );

  if (!currentQuote) return null;

  const isHindi = currentQuote.lang === "hi";

  return (
    <article
      aria-label={`Quote by Aditya Diwakar: ${currentQuote.text} from ${currentQuote.sourceTitle}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative max-w-2xl w-full flex flex-col items-center text-center px-4 sm:px-6 pointer-events-auto select-none"
    >
      {/* Primary Quote Text in Editorial Display Serif */}
      {/* Clicking the quote advances it immediately with subtle hover affordance */}
      <blockquote
        tabIndex={0}
        role="button"
        onClick={handleNextQuote}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNextQuote();
          }
        }}
        title="Click to advance to another quote"
        className={`font-serif text-base sm:text-xl md:text-2xl font-normal leading-relaxed tracking-tight cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-stone-400 rounded transition-all duration-300 ${
          isHindi
            ? "break-words leading-loose font-normal [text-wrap:balance]"
            : "italic [text-wrap:balance]"
        } ${isFading ? "opacity-0 scale-[0.99]" : "opacity-100 scale-100"} hover:opacity-80`}
        style={{
          color: activeTheme.textPrimary,
          hyphens: isHindi ? "none" : "auto",
        }}
        lang={currentQuote.lang}
      >
        {currentQuote.text}
      </blockquote>

      {/* Attribution Source Line: Plain muted text with underline only on hover */}
      <div className="mt-3.5 flex items-center justify-center">
        <button
          type="button"
          onClick={handleOpenSource}
          title={`Read in Writing app: ${currentQuote.sourceTitle}`}
          className={`text-xs sm:text-[13px] text-stone-500 dark:text-zinc-500 hover:text-stone-800 dark:hover:text-zinc-200 transition-colors cursor-pointer no-underline hover:underline underline-offset-4 decoration-stone-300 dark:decoration-zinc-700 ${
            isHindi ? "font-serif" : "font-mono"
          }`}
        >
          {currentQuote.sourceTitle}
        </button>
      </div>
    </article>
  );
}
