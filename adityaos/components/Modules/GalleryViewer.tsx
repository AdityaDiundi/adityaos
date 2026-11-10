"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

interface GalleryItem {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: string;
  date: string;
}

export const GalleryViewer: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLargeIndex, setActiveLargeIndex] = useState<number | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        setImages(data.images);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    playClickChime(520);
    setActiveLargeIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length, playClickChime]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    playClickChime(460);
    setActiveLargeIndex((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));
  }, [images.length, playClickChime]);

  // Arrow key navigation when viewing an image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLargeIndex === null) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setActiveLargeIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLargeIndex, handleNext, handlePrev]);

  const activeImage = activeLargeIndex !== null ? images[activeLargeIndex] : null;

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="h-full overflow-y-auto select-none"
    >
      {/* Focused Large Image View Overlay */}
      {activeImage ? (
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          {/* Top Bar with Back Control and Image Name */}
          <div className="flex items-center justify-between font-mono text-xs border-b border-black/10 dark:border-white/10 pb-4 mb-4">
            <button
              type="button"
              onClick={() => {
                playClickChime(440);
                setActiveLargeIndex(null);
              }}
              className="text-stone-500 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400"
            >
              ← Back to grid
            </button>
            <span className="font-serif text-sm text-stone-900 dark:text-zinc-100">
              {activeImage.name}
            </span>
            <span className="text-stone-400 dark:text-zinc-500">
              {activeLargeIndex! + 1} / {images.length}
            </span>
          </div>

          {/* Large Image Frame */}
          <div className="flex-1 flex items-center justify-center p-2 min-h-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.name}
              className="max-h-[calc(100vh-260px)] max-w-full object-contain rounded-xs shadow-lg"
            />
          </div>

          {/* Bottom Navigation & Metadata */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs text-stone-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={handlePrev}
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer"
            >
              previous
            </button>
            <div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-zinc-500">
              <span>{activeImage.filename}</span>
              <span>·</span>
              <span>{activeImage.size}</span>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline cursor-pointer"
            >
              next
            </button>
          </div>
        </div>
      ) : (
        /* Borderless Image Grid with Consistent Gutters */
        <div className="p-6 sm:p-8 space-y-6">
          <header className="border-b border-black/10 dark:border-white/10 pb-4">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-stone-900 dark:text-zinc-100">
              Gallery
            </h1>
            <p className="font-mono text-xs text-stone-500 dark:text-zinc-400 mt-1">
              Visual artifacts, interface experiments, and generative captures
            </p>
          </header>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => {
                    playClickChime(500);
                    setActiveLargeIndex(idx);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      playClickChime(500);
                      setActiveLargeIndex(idx);
                    }
                  }}
                  className="group relative aspect-square overflow-hidden rounded-xs cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 bg-black/5 dark:bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                  {/* Caption appears only on hover or keyboard focus */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 flex flex-col justify-end">
                    <span className="font-serif text-xs font-normal leading-tight truncate">
                      {img.name}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-300 mt-0.5 truncate">
                      {img.size}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-xs text-stone-400 dark:text-zinc-500 py-12">
              {loading ? "Scanning gallery..." : "No images in gallery."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
