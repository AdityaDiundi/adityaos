"use client";

import React, { useState } from "react";
import { FEATURED_YOUTUBE_VIDEOS, YouTubeItem } from "./caseStudiesData";
import { Youtube, Play, ExternalLink, X } from "lucide-react";

export function YouTubeSection() {
  const [activeVideo, setActiveVideo] = useState<YouTubeItem | null>(null);

  return (
    <section id="youtube" className="relative">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="space-y-2">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              03 // Media & Streams
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              YouTube & video logs.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl pt-1">
              Gaming highlights, clutch gameplay analysis, and stream shorts from the @falsepeek channel.
            </p>
          </div>

          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>@falsepeek Channel</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Video Grid */}
        <div className="p-6 sm:p-10 border-b border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_YOUTUBE_VIDEOS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden hover:border-zinc-700 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
              >
                {/* Video Thumbnail Frame */}
                <div className="relative aspect-video bg-zinc-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-zinc-300">
                    {video.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {video.category}
                    </span>
                    <span>@falsepeek</span>
                  </div>

                  <h3 className="font-sans font-medium text-sm text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                </div>
              </div>
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
