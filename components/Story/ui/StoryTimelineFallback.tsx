"use client";

import React from "react";
import Link from "next/link";
import { JourneyStation, WritingItem } from "@/content/journey";

export interface StoryTimelineFallbackProps {
  stations: JourneyStation[];
  writingItems: WritingItem[];
  onEnterDesktop?: () => void;
}

export function StoryTimelineFallback({
  stations,
  writingItems,
  onEnterDesktop,
}: StoryTimelineFallbackProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1015] text-[#1C1917] dark:text-[#F8FAFC] py-16 px-6 sm:px-12 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-16 border-b border-[#E7E5E4] dark:border-[#1E293B] pb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="font-mono text-xs tracking-widest text-[#78716C] dark:text-[#94A3B8] uppercase">
            Aditya Diwakar · Timeline
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/work"
              className="font-mono text-xs text-[#78716C] dark:text-[#94A3B8] hover:underline"
            >
              Work ↗
            </Link>
            <Link
              href="/?mode=os"
              onClick={onEnterDesktop}
              className="font-mono text-xs px-2.5 py-1 rounded bg-[#E7E5E4] dark:bg-[#1E293B] hover:opacity-80 transition-opacity"
            >
              Desktop ↓
            </Link>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
          A Journey in Screens & Ground
        </h1>
        <p className="mt-2 text-sm text-[#57534E] dark:text-[#94A3B8] font-sans">
          Accessible linear timeline view.
        </p>
      </header>

      {/* Vertical Timeline List */}
      <div className="relative border-l border-[#E7E5E4] dark:border-[#1E293B] ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
        {stations.map((station) => {
          const matchingWriting = writingItems.filter((w) => w.year === station.year);

          return (
            <article key={station.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3 h-3 rounded-full bg-[#0284C7] dark:bg-[#38BDF8] ring-4 ring-[#FAF7F2] dark:ring-[#0E1015]" />

              {/* Station Date */}
              <div className="flex items-center gap-2 mb-1.5">
                <time className="font-mono text-xs tracking-wider text-[#78716C] dark:text-[#94A3B8] uppercase">
                  {station.dateEnd ? `${station.dateStart} — ${station.dateEnd}` : station.dateStart}
                </time>
                {station.placeholder && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
                    Placeholder
                  </span>
                )}
              </div>

              {/* Station Title */}
              <h2 className="font-serif text-2xl text-[#1C1917] dark:text-[#F8FAFC] tracking-tight">
                {station.title}
              </h2>

              {/* Station Line */}
              <p className="mt-2 font-sans text-sm sm:text-base text-[#44403C] dark:text-[#CBD5E1] leading-relaxed">
                {station.line}
              </p>

              {/* Station Outcome */}
              {station.outcome && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8]" />
                  <span className="font-mono text-xs text-[#0284C7] dark:text-[#38BDF8]">
                    {station.outcome}
                  </span>
                </div>
              )}

              {/* Station Project Link */}
              {station.openTarget && (
                <div className="mt-3">
                  <a
                    href={
                      station.openTarget.startsWith("http")
                        ? station.openTarget
                        : `/work#${station.openTarget}`
                    }
                    className="inline-flex items-center gap-1 font-mono text-xs text-[#1C1917] dark:text-[#F8FAFC] hover:underline"
                  >
                    <span>explore project</span>
                    <span>↗</span>
                  </a>
                </div>
              )}

              {/* Inlined Writing Notes for this year */}
              {matchingWriting.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#F5F5F4] dark:border-[#1E293B]/50 space-y-2">
                  {matchingWriting.map((essay) => (
                    <div
                      key={essay.id}
                      className="bg-[#F5F5F4] dark:bg-[#13161F] p-3 rounded-lg border border-[#E7E5E4] dark:border-[#2A303F]"
                    >
                      <span className="font-mono text-[10px] uppercase text-[#78716C] dark:text-[#94A3B8] block mb-1">
                        Writing · {essay.publishDate}
                      </span>
                      <h3 className="font-serif text-sm font-medium text-[#1C1917] dark:text-[#F8FAFC]">
                        {essay.title}
                      </h3>
                      {essay.excerpt && (
                        <p className="font-sans text-xs text-[#57534E] dark:text-[#CBD5E1] mt-1">
                          {essay.excerpt}
                        </p>
                      )}
                      {essay.url && (
                        <a
                          href={essay.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 font-mono text-[11px] text-[#0284C7] dark:text-[#38BDF8] hover:underline"
                        >
                          read essay ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Footer Call to Action */}
      <footer className="mt-20 pt-8 border-t border-[#E7E5E4] dark:border-[#1E293B] text-center">
        <Link
          href="/?mode=os"
          onClick={onEnterDesktop}
          className="inline-block px-6 py-3 rounded-md bg-[#1C1917] dark:bg-[#F8FAFC] text-[#FAF7F2] dark:text-[#0E1015] font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Launch AdityaOS Desktop
        </Link>
      </footer>
    </div>
  );
}
