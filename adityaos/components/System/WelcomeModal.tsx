"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, BookOpen, Briefcase } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface WelcomeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onOpenWork: () => void;
  onOpenWriting: () => void;
  onOpenAbout: () => void;
}

export function WelcomeModal({
  isOpen,
  onDismiss,
  onOpenWork,
  onOpenWriting,
  onOpenAbout,
}: WelcomeModalProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? "#12141A" : "#FAF7F2",
          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
          color: activeTheme.textPrimary,
        }}
        className="w-full max-w-[560px] rounded-2xl border shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center relative select-none animate-in zoom-in-95 duration-200"
      >
        {/* Subtle decorative window bar dots */}
        <div className="w-full flex items-center justify-between pb-4 mb-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 opacity-40">
            <span className="w-2.5 h-2.5 rounded-full bg-current" />
            <span className="w-2.5 h-2.5 rounded-full bg-current" />
            <span className="w-2.5 h-2.5 rounded-full bg-current" />
          </div>
          <span className="text-[11px] font-mono text-stone-500 dark:text-zinc-400">
            Desk of Aditya Diundi
          </span>
          <button
            onClick={onDismiss}
            className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            title="Press Esc to close"
          >
            [esc]
          </button>
        </div>

        {/* 1. Portrait (96px, rounded) */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-stone-300 dark:border-zinc-700 shadow-md mb-4 mt-2">
          <Image
            src="/aditya_avatar_sq.jpg"
            alt="Aditya Diundi"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 2. Name in display serif (28px) */}
        <h2
          id="welcome-modal-title"
          className="font-serif text-[28px] sm:text-[30px] font-normal leading-tight tracking-tight text-[#1A1814] dark:text-[#F4F4F5] mb-1"
        >
          Aditya Diundi
        </h2>

        {/* 3. One-line role in 13px mono */}
        <p className="font-mono text-[13px] text-stone-600 dark:text-zinc-400 mb-6">
          Product Designer &amp; Design Technologist
        </p>

        {/* 4. Three large doors as buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Door 1: Work */}
          <button
            type="button"
            onClick={() => {
              onOpenWork();
              onDismiss();
            }}
            className={`group p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
              isDark
                ? "bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700"
                : "bg-white hover:bg-stone-50 border-stone-200/90 hover:border-stone-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? "bg-zinc-800 group-hover:bg-zinc-700 text-emerald-400" : "bg-stone-100 group-hover:bg-emerald-50 text-emerald-600"
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="font-serif text-base font-medium block text-stone-900 dark:text-zinc-100">
                Work
              </span>
              <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-400 block mt-0.5">
                Shipped Systems
              </span>
            </div>
          </button>

          {/* Door 2: Writing */}
          <button
            type="button"
            onClick={() => {
              onOpenWriting();
              onDismiss();
            }}
            className={`group p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
              isDark
                ? "bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700"
                : "bg-white hover:bg-stone-50 border-stone-200/90 hover:border-stone-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? "bg-zinc-800 group-hover:bg-zinc-700 text-sky-400" : "bg-stone-100 group-hover:bg-sky-50 text-sky-600"
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="font-serif text-base font-medium block text-stone-900 dark:text-zinc-100">
                Writing
              </span>
              <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-400 block mt-0.5">
                Essays &amp; Poetry
              </span>
            </div>
          </button>

          {/* Door 3: About */}
          <button
            type="button"
            onClick={() => {
              onOpenAbout();
              onDismiss();
            }}
            className={`group p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
              isDark
                ? "bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700"
                : "bg-white hover:bg-stone-50 border-stone-200/90 hover:border-stone-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? "bg-zinc-800 group-hover:bg-zinc-700 text-amber-400" : "bg-stone-100 group-hover:bg-amber-50 text-amber-600"
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="font-serif text-base font-medium block text-stone-900 dark:text-zinc-100">
                About
              </span>
              <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-400 block mt-0.5">
                Bio &amp; Specs
              </span>
            </div>
          </button>
        </div>

        {/* 5. Quiet skip link */}
        <button
          type="button"
          onClick={onDismiss}
          className="font-mono text-xs text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Skip to desktop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
