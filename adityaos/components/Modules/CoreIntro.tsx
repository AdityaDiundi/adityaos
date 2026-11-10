"use client";

import React from "react";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";

export const CoreIntro: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { restoreWindow, focusWindow } = useOSStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const handleOpenResume = () => {
    playClickChime(500);
    restoreWindow("resumeViewer");
    focusWindow("resumeViewer");
  };

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="h-full overflow-y-auto select-text px-8 sm:px-12 py-10 flex flex-col justify-between"
    >
      {/* Single Column Content */}
      <div className="max-w-[560px] space-y-6">
        {/* Identity Zone */}
        <div className="space-y-1.5">
          <h1 className="font-serif text-[28px] sm:text-[32px] font-normal tracking-tight text-stone-900 dark:text-zinc-100 leading-tight">
            Aditya Diundi
          </h1>
          <p className="font-mono text-[13px] text-stone-500 dark:text-zinc-400">
            Product Designer &amp; Design Technologist
          </p>
          <div className="flex items-center gap-2 pt-1 font-mono text-[12px] text-stone-600 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open to full-time roles</span>
            <span className="text-stone-300 dark:text-zinc-700">·</span>
            <span>Delhi, India</span>
          </div>
        </div>

        {/* Narrative Zone (Comfortable 60-75ch measure) */}
        <div className="space-y-4 font-serif text-[15px] sm:text-[16px] leading-[1.7] text-stone-700 dark:text-zinc-300">
          <p>
            I design and build software systems from zero to one. My work sits at the intersection of product architecture, interaction design, and agentic AI tooling, turning complex multi-step workflows into calm, reliable software.
          </p>
          <p>
            Previously, I designed healthcare flows for 100K+ daily active users at MFine and Mosaic Wellness, and spent a year as an India Fellow working on grassroots systems and rural youth networks across Rajasthan and Bihar.
          </p>
        </div>

        {/* Action & Contact Zone: Plain text links in mono */}
        <div className="pt-2">
          <div className="font-mono text-xs text-stone-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
            Connect
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
            <button
              type="button"
              onClick={handleOpenResume}
              className="text-stone-900 dark:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              Open resume
            </button>
            <a
              href="mailto:aditya15124@iiitd.ac.in"
              className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              Email
            </a>
            <a
              href="https://linkedin.com/in/adityadiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/AdityaDiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              GitHub
            </a>
            <a
              href="https://diundi.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              diundi.space
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
