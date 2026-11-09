"use client";

import React, { useState } from "react";
import { FEATURED_YOUTUBE_VIDEOS, YouTubeItem } from "./caseStudiesData";
import { Youtube, Play, Pause, ExternalLink, ChevronUp, ChevronDown, Tv, Radio, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

export function YouTubeSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);

  const activeVideo: YouTubeItem = FEATURED_YOUTUBE_VIDEOS[currentIndex] || FEATURED_YOUTUBE_VIDEOS[0];

  const handleSelectChannel = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_YOUTUBE_VIDEOS.length - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < FEATURED_YOUTUBE_VIDEOS.length - 1 ? prev + 1 : 0));
    setIsPlaying(false);
  };

  return (
    <section id="youtube" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark ? "bg-[#090b10]/40" : "bg-[#FBFBF9]"
        }`}
      >
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        <div
          className={`border-b border-dashed px-6 sm:px-8 lg:px-12 py-5 flex items-baseline justify-between transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
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
              — Streams, mechanics & tactical gameplay
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

        {/* Interactive TV & Vertical Scroller Console */}
        <div className="p-6 sm:p-8 lg:p-12 border-b border-dashed border-stone-200/80 dark:border-zinc-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT: The Interactive CRT Monitor TV (Col Span 7) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div
                className={`relative rounded-2xl overflow-hidden border p-3 sm:p-4 shadow-xl transition-all ${
                  isDark
                    ? "bg-[#0b0d13] border-zinc-800 shadow-black/80"
                    : "bg-stone-900 border-stone-800 shadow-stone-300/60 text-white"
                }`}
              >
                {/* TV Hardware Top Bezel */}
                <div className="flex items-center justify-between pb-2.5 px-1 text-xs font-mono border-b border-zinc-800/80 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-400">
                      CH 0{currentIndex + 1}
                    </span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-300 uppercase tracking-wide">
                      {activeVideo.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="hidden sm:inline">NTSC 60FPS</span>
                    <span className="font-medium text-zinc-300">{activeVideo.duration}</span>
                  </div>
                </div>

                {/* CRT Screen Frame */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mt-2.5 flex items-center justify-center border border-zinc-900">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full relative z-10"
                    />
                  ) : (
                    <div
                      onClick={() => setIsPlaying(true)}
                      className="group/screen relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
                    >
                      {/* Video Thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg`}
                        onError={(e) => {
                          // Fallback to hqdefault if maxresdefault is missing
                          (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${activeVideo.id}/hqdefault.jpg`;
                        }}
                        alt={activeVideo.title}
                        className="w-full h-full object-cover filter contrast-110 brightness-90 group-hover/screen:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Subtle CRT Scanlines Overlay */}
                      {scanlinesActive && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-25"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 2px)",
                            backgroundSize: "100% 2px",
                          }}
                        />
                      )}

                      {/* Vignette Overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

                      {/* Center Tactile Play Button */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 group-hover/screen:bg-black/10 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover/screen:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-0.5 fill-current" />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-white/90 bg-black/70 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                          Tune In & Play
                        </span>
                      </div>

                      {/* Screen Bottom Title Banner */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between">
                        <span className="text-xs font-mono text-zinc-200 line-clamp-1 max-w-[80%] font-medium">
                          {activeVideo.title}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-black/80 px-1.5 py-0.5 rounded border border-zinc-800">
                          {activeVideo.duration}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TV Bottom Control Deck */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Previous Channel"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>CH PREV</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Next Channel"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>CH NEXT</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setScanlinesActive(!scanlinesActive)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        scanlinesActive
                          ? "border-emerald-800 text-emerald-400 bg-emerald-950/40"
                          : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      CRT Scanlines: {scanlinesActive ? "ON" : "OFF"}
                    </button>

                    <a
                      href={activeVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Open in YouTube</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: The Vertical Scroller Channel Guide (Col Span 5) */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-1.5 text-xs font-mono text-stone-500 dark:text-zinc-400">
                <span className="uppercase tracking-wider font-semibold">
                  Channel Guide
                </span>
                <span>{FEATURED_YOUTUBE_VIDEOS.length} Broadcasts</span>
              </div>

              {/* Vertical Scroll List */}
              <div
                className={`divide-y divide-dashed border border-dashed rounded-xl overflow-hidden max-h-[460px] overflow-y-auto transition-colors ${
                  isDark
                    ? "border-zinc-800 divide-zinc-800 bg-[#0c0e14]/50"
                    : "border-stone-200 divide-stone-200 bg-white"
                }`}
              >
                {FEATURED_YOUTUBE_VIDEOS.map((video, idx) => {
                  const isSelected = idx === currentIndex;

                  return (
                    <button
                      key={video.id}
                      onClick={() => handleSelectChannel(idx)}
                      className={`w-full p-3.5 sm:p-4 text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        isSelected
                          ? isDark
                            ? "bg-zinc-900/90 border-l-2 border-l-emerald-500"
                            : "bg-stone-100/90 border-l-2 border-l-emerald-600"
                          : isDark
                          ? "hover:bg-zinc-900/40"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      {/* Channel Number */}
                      <span
                        className={`text-xs font-mono font-bold shrink-0 pt-0.5 ${
                          isSelected
                            ? "text-emerald-500"
                            : isDark
                            ? "text-zinc-600 group-hover:text-zinc-400"
                            : "text-stone-400 group-hover:text-stone-700"
                        }`}
                      >
                        CH 0{idx + 1}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <span
                            className={
                              isSelected
                                ? "text-emerald-500 font-medium"
                                : isDark
                                ? "text-zinc-400"
                                : "text-stone-500"
                            }
                          >
                            {video.category}
                          </span>
                          <span className={isDark ? "text-zinc-500" : "text-stone-400"}>
                            {video.duration}
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-sans line-clamp-2 leading-snug transition-colors ${
                            isSelected
                              ? isDark
                                ? "text-white font-medium"
                                : "text-stone-900 font-semibold"
                              : isDark
                              ? "text-zinc-300 group-hover:text-white"
                              : "text-stone-700 group-hover:text-stone-900"
                          }`}
                        >
                          {video.title}
                        </h4>
                      </div>

                      {/* Status indicator */}
                      <div className="shrink-0 pt-1">
                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                        ) : (
                          <Play className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                        )}
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
