"use client";

import React, { useState } from "react";
import { FEATURED_YOUTUBE_VIDEOS, YouTubeItem } from "./caseStudiesData";
import { Youtube, Play, ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

export function YouTubeSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [activeVideo, setActiveVideo] = useState<YouTubeItem | null>(null);

  return (
    <section id="youtube" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark
            ? "bg-[#090b10]/40"
            : "bg-[#FBFBF9]"
        }`}
      >
        {/* Section Header: Minimal Single Persuasive Statement */}
        <div
          className={`border-b border-dashed p-6 sm:p-8 lg:p-12 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
          }`}
        >
          <div className="space-y-2 max-w-2xl">
            <div
              className={`text-[11px] font-mono uppercase tracking-wider ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              03 // Media & Streams
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              YouTube & video logs.
            </h2>
            <p
              className={`text-sm sm:text-base font-sans leading-relaxed ${
                isDark ? "text-zinc-400" : "text-stone-600"
              }`}
            >
              Deep-dive visual essays dissecting game engine architecture, interface ergonomics, and creative coding philosophy.
            </p>
          </div>

          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3.5 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer group/ytlink shadow-sm ${
              isDark
                ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-500/50 text-zinc-300 hover:text-white"
                : "bg-stone-100 hover:bg-stone-200 border-stone-200 hover:border-red-500/50 text-stone-800"
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>@falsepeek Channel</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>
        </div>

        {/* Video Grid */}
        <div
          className={`p-6 sm:p-8 lg:p-12 border-b border-dashed ${
            isDark ? "border-zinc-800/80" : "border-stone-200/80"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURED_YOUTUBE_VIDEOS.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveVideo(video)}
                className={`group rounded-xl border overflow-hidden transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
                  isDark
                    ? "border-zinc-800/80 bg-[#0c0e14] hover:border-zinc-700 hover:bg-[#10131b]"
                    : "border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/50"
                }`}
              >
                {/* Muted Monochrome Video Thumbnail Frame (Reveals brand color only on hover) */}
                <div className="relative aspect-video bg-zinc-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover filter grayscale contrast-125 opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-zinc-300 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 font-mono text-[10px] text-zinc-300 border border-zinc-800">
                    {video.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div
                    className={`flex items-center justify-between text-xs font-mono ${
                      isDark ? "text-zinc-500" : "text-stone-500"
                    }`}
                  >
                    <span className={isDark ? "text-zinc-400 font-medium" : "text-stone-600 font-medium"}>
                      {video.category}
                    </span>
                    <span>@falsepeek</span>
                  </div>

                  <h3
                    className={`font-sans font-medium text-sm line-clamp-2 leading-snug transition-colors ${
                      isDark
                        ? "text-zinc-200 group-hover:text-white"
                        : "text-stone-900 group-hover:text-black"
                    }`}
                  >
                    {video.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 sm:p-8 flex flex-col justify-between items-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl flex items-center justify-between pb-3 border-b border-zinc-800 font-mono text-xs text-zinc-300"
          >
            <span className="font-semibold text-white truncate max-w-lg">{activeVideo.title}</span>
            <button
              onClick={() => setActiveVideo(null)}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl my-4 aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl"
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500"
          >
            <a
              href={activeVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline flex items-center gap-1"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
