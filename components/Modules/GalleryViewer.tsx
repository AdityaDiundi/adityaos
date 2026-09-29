"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  ExternalLink,
  RefreshCw,
  Sparkles,
  FolderOpen,
} from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.images && data.images.length > 0) {
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

  const handlePrev = () => {
    if (images.length === 0) return;
    playClickChime(480);
    setSelectedIndex((prev) => {
      const current = prev ?? 0;
      return (current - 1 + images.length) % images.length;
    });
    setZoomLevel(1);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    playClickChime(540);
    setSelectedIndex((prev) => {
      const current = prev ?? 0;
      return (current + 1) % images.length;
    });
    setZoomLevel(1);
  };

  const activeImage = selectedIndex !== null && images[selectedIndex] ? images[selectedIndex] : null;

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full font-mono text-xs select-none overflow-hidden"
    >
      {/* Top Feh/Nsxiv Toolbar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-9 border-b px-3 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <span
            style={{
              backgroundColor: `${activeTheme.accent}20`,
              color: activeTheme.accent,
            }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
          >
            FEH // NSXIV
          </span>
          <span className="font-semibold text-[11px] truncate">
            {activeImage ? activeImage.filename : "gallery/"}
          </span>
          {activeImage && (
            <span style={{ color: activeTheme.textMuted }} className="text-[10px] hidden sm:inline">
              [{selectedIndex! + 1}/{images.length}]
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={fetchGallery}
            title="Reload images from public/gallery/"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="p-1 rounded border hover:opacity-80 transition-opacity"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
            title="Zoom Out"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-1 rounded border hover:opacity-80 transition-opacity"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          <span className="text-[10px] px-1 font-semibold">{Math.round(zoomLevel * 100)}%</span>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
            title="Zoom In"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-1 rounded border hover:opacity-80 transition-opacity"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            title="Toggle File Info"
            style={{
              backgroundColor: showInfo ? activeTheme.accent : activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: showInfo ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
            }}
            className="p-1 rounded border hover:opacity-80 transition-opacity"
          >
            <Info className="w-3 h-3" />
          </button>

          {activeImage && (
            <a
              href={activeImage.url}
              download={activeImage.filename}
              title="Download Image"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.accent,
              }}
              className="p-1 rounded border hover:opacity-80 transition-opacity flex items-center gap-1 text-[10px] font-semibold"
            >
              <Download className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Main View Area: Split between Main Viewer and Thumbnail Strip */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Main Canvas / Image Lightbox */}
        <div
          style={{ backgroundColor: activeTheme.desktopBg }}
          className="flex-1 relative flex items-center justify-center p-4 overflow-hidden"
        >
          {activeImage ? (
            <div className="relative max-w-full max-h-full flex items-center justify-center overflow-auto">
              <img
                src={activeImage.url}
                alt={activeImage.name}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.15s ease-out",
                }}
                className="max-h-[calc(100vh-280px)] max-w-full object-contain rounded shadow-2xl border border-white/10"
              />

              {/* Floating Prev / Next Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                title="Previous image (Left arrow)"
                className="absolute left-3 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                title="Next image (Right arrow)"
                className="absolute right-3 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10 backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2 opacity-60">
              <ImageIcon className="w-10 h-10 mx-auto" />
              <div className="text-xs">No images loaded yet.</div>
            </div>
          )}

          {/* Overlay File Info Card */}
          {activeImage && showInfo && (
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}ee`,
                borderColor: activeTheme.cardBorder,
              }}
              className="absolute bottom-3 left-3 p-2.5 rounded-lg border backdrop-blur-md max-w-xs space-y-1 shadow-lg pointer-events-auto"
            >
              <div className="font-bold text-xs truncate" style={{ color: activeTheme.accent }}>
                {activeImage.name}
              </div>
              <div className="text-[10px] opacity-75 space-y-0.5">
                <div>File: {activeImage.filename}</div>
                <div>Size: {activeImage.size} • Modified: {activeImage.date}</div>
                <div className="text-emerald-400 font-semibold pt-0.5">
                  Path: public/gallery/{activeImage.filename}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right / Bottom Thumbnail Strip */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="w-full md:w-56 border-t md:border-t-0 md:border-l p-2.5 flex flex-row md:flex-col gap-2 overflow-auto flex-shrink-0"
        >
          <div
            style={{ color: activeTheme.textMuted }}
            className="text-[10px] font-bold uppercase tracking-wider hidden md:flex items-center justify-between pb-1 border-b border-white/5"
          >
            <span>Thumbnails</span>
            <span>{images.length} files</span>
          </div>

          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  playClickChime(500);
                  setSelectedIndex(idx);
                  setZoomLevel(1);
                }}
                style={{
                  borderColor: isSelected ? activeTheme.accent : "transparent",
                  backgroundColor: isSelected ? `${activeTheme.accent}15` : "transparent",
                }}
                className="flex items-center gap-2 p-1.5 rounded-md border text-left hover:bg-white/5 transition-all flex-shrink-0 md:w-full group"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-12 h-10 object-cover rounded border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="hidden md:block truncate min-w-0">
                  <div
                    className="font-semibold text-[11px] truncate"
                    style={{ color: isSelected ? activeTheme.accent : activeTheme.textPrimary }}
                  >
                    {img.name}
                  </div>
                  <div className="text-[9px] opacity-60 truncate">{img.size}</div>
                </div>
              </button>
            );
          })}

          {/* Curation Note Footer */}
          <div
            style={{ 
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textMuted 
            }}
            className="hidden md:block mt-auto p-2 rounded border border-white/5 text-[10px] leading-relaxed opacity-75"
          >
            <div className="font-semibold text-[11px] mb-0.5" style={{ color: activeTheme.textPrimary }}>
              Visual Archives
            </div>
            Interface artifacts, generative voxels, and field photography captured across projects.
          </div>
        </div>
      </div>
    </div>
  );
};
