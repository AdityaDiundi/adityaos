"use client";

import React, { useState } from "react";
import { FEATURED_YOUTUBE_VIDEOS, YouTubeItem } from "./caseStudiesData";
import { Youtube, Play, ArrowUpRight } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export function YouTubeSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeVideo: YouTubeItem =
    FEATURED_YOUTUBE_VIDEOS[currentIndex] || FEATURED_YOUTUBE_VIDEOS[0];

  return (
    <section id="youtube" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark ? "bg-[#090b10]/40" : "bg-[#FAF7F2]"
        }`}
      >
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        <div
          className={`border-b border-solid border-stone-200/60 dark:border-zinc-800/60 px-6 sm:px-8 lg:px-12 py-5 flex items-baseline justify-between transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-[#FAF7F2]"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-semibold text-red-500">03</span>
            <h2
              className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Watch Games
            </h2>
            <span
              className={`text-xs font-mono hidden sm:inline ${
                isDark ? "text-zinc-500" : "text-stone-400"
              }`}
            >
              — Top plays, clutches & highlights
            </span>
          </div>

          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs font-mono hover:underline ${
              isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>@falsepeek</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Minimal TV Player & Clean Medal.tv Style Clips List */}
        <div className="p-6 sm:p-8 lg:p-12 border-b border-solid border-stone-200/60 dark:border-zinc-800/60 border-stone-200/80 dark:border-zinc-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Minimal TV / Video Player (Pure video frame, zero button/pill clutter) */}
            <div className="lg:col-span-7 space-y-3">
              <div
                className={`relative aspect-video w-full rounded-2xl overflow-hidden border shadow-lg transition-all ${
                  isDark
                    ? "bg-black border-zinc-800 shadow-black/60"
                    : "bg-stone-900 border-stone-200 shadow-stone-200/70"
                }`}
              >
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="group relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-950"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`}
                      alt={activeVideo.title}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Subtle Overlay & Play Button */}
                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-white/90 group-hover:bg-red-600 text-stone-900 group-hover:text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimal Active Clip Info */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-zinc-400 px-1">
                <span className="truncate max-w-[70%] text-stone-800 dark:text-zinc-200 font-medium">
                  {activeVideo.title}
                </span>
                <span className="shrink-0">
                  {activeVideo.views} · {activeVideo.game}
                </span>
              </div>
            </div>

            {/* Right: Clean Clips / Top Plays List (Sorted by Views) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 dark:text-zinc-500 pb-1">
                <span className="uppercase tracking-wider">Top Plays · Most Viewed</span>
                <span>{FEATURED_YOUTUBE_VIDEOS.length} Clips</span>
              </div>

              <div
                className={`divide-y divide-stone-200/60 dark:divide-zinc-800/60 border border-solid border-stone-200/60 dark:border-zinc-800/60 rounded-xl max-h-[460px] overflow-y-auto transition-colors ${
                  isDark
                    ? "divide-zinc-800/80 border-zinc-800/80 bg-[#0c0e14]/40"
                    : "divide-stone-200/80 border-stone-200/80 bg-white"
                }`}
              >
                {FEATURED_YOUTUBE_VIDEOS.map((video, idx) => {
                  const isSelected = idx === currentIndex;

                  return (
                    <button
                      key={video.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`w-full p-3 text-left transition-colors flex items-baseline justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? isDark
                            ? "bg-zinc-800/60 text-white"
                            : "bg-stone-100 text-stone-900"
                          : isDark
                          ? "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span
                          className={`text-[11px] font-mono shrink-0 ${
                            isSelected
                              ? "text-red-500 font-bold"
                              : "text-stone-400 dark:text-zinc-600"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <div className="text-xs font-sans font-medium line-clamp-1 group-hover:underline">
                            {video.title}
                          </div>
                          <div className="text-[10px] font-mono opacity-60">
                            {video.game}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-[11px]">
                        <div className={isSelected ? "text-red-500 font-semibold" : "opacity-80"}>
                          {video.views}
                        </div>
                        <div className="text-[10px] opacity-50">
                          {video.duration}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
