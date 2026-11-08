"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink, Eye, Layers, Maximize2, Sparkles, Figma } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export interface PrototypeModalData {
  title: string;
  client: string;
  category: string;
  overview?: string;
  figmaUrl?: string;
  liveUrl?: string;
  primaryImage: string;
  secondaryImage?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  defaultMode?: "figma" | "screens" | "live";
}

interface InteractivePrototypeModalProps {
  data: PrototypeModalData | null;
  onClose: () => void;
}

export function InteractivePrototypeModal({ data, onClose }: InteractivePrototypeModalProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const [viewMode, setViewMode] = useState<"figma" | "screens" | "live">("screens");
  const [activeScreenTab, setActiveScreenTab] = useState<"primary" | "secondary">("primary");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.defaultMode) {
        setViewMode(data.defaultMode);
      } else if (data.figmaUrl) {
        setViewMode("figma");
      } else if (data.liveUrl) {
        setViewMode("live");
      } else {
        setViewMode("screens");
      }
      setActiveScreenTab("primary");
      setIframeLoaded(false);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  // Compute Figma embed URL
  const figmaEmbedUrl = data.figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(data.figmaUrl)}`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-6xl max-h-[92vh] h-[88vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border transition-colors ${
          isDark
            ? "bg-[#0c0e14] border-zinc-800 text-zinc-100"
            : "bg-white border-stone-200 text-stone-900"
        }`}
      >
        {/* Modal Top Header Bar */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b flex-shrink-0 ${
            isDark ? "bg-[#090a0f] border-zinc-800/80" : "bg-stone-50 border-stone-200"
          }`}
        >
          {/* Identity & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span
                className={`font-semibold uppercase tracking-wider ${
                  isDark ? "text-cyan-400" : "text-stone-700"
                }`}
              >
                {data.client}
              </span>
              <span className={isDark ? "text-zinc-600" : "text-stone-300"}>/</span>
              <span className={isDark ? "text-zinc-400" : "text-stone-500"}>
                {data.category}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-sans tracking-tight">
              {data.title}
            </h3>
          </div>

          {/* Mode Tabs & External CTAs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* View Mode Pill Selector */}
            <div
              className={`p-1 rounded-lg border flex items-center gap-1 ${
                isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-stone-100 border-stone-200"
              }`}
            >
              {data.figmaUrl && (
                <button
                  onClick={() => setViewMode("figma")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "figma"
                      ? isDark
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "bg-white text-stone-900 shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Interactive Figma</span>
                </button>
              )}

              {data.liveUrl && (
                <button
                  onClick={() => setViewMode("live")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "live"
                      ? isDark
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "bg-white text-stone-900 shadow-sm"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live App Build</span>
                </button>
              )}

              <button
                onClick={() => setViewMode("screens")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "screens"
                    ? isDark
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "bg-white text-stone-900 shadow-sm"
                    : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Curated Screens</span>
              </button>
            </div>

            {/* External Links */}
            {data.figmaUrl && (
              <a
                href={data.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800"
                }`}
                title="Open directly in Figma in a new tab"
              >
                <span>Figma</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {data.liveUrl && (
              <a
                href={data.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span>Open Live</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900"
              }`}
              title="Close modal [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Viewport Canvas */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-black/50">
          {/* 1. Interactive Figma Embed Mode */}
          {viewMode === "figma" && figmaEmbedUrl && (
            <div className="w-full h-full relative flex flex-col">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-400 font-mono text-xs z-10">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading interactive Figma canvas...</span>
                </div>
              )}
              <iframe
                src={figmaEmbedUrl}
                title={`${data.title} Figma Prototype`}
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0"
                allowFullScreen
              />
              <div
                className={`px-5 py-2 border-t font-mono text-[11px] flex items-center justify-between ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800 text-zinc-400"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Interactive Figma Canvas: Pan, zoom, and test clickable states live.</span>
                </div>
                <a
                  href={data.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-cyan-400"
                >
                  Open in Figma app <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* 2. Live Web App Mode */}
          {viewMode === "live" && data.liveUrl && (
            <div className="w-full h-full relative flex flex-col">
              <iframe
                src={data.liveUrl}
                title={`${data.title} Live App`}
                className="w-full h-full border-0 bg-white"
                allowFullScreen
              />
              <div
                className={`px-5 py-2 border-t font-mono text-[11px] flex items-center justify-between ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800 text-zinc-400"
                    : "bg-stone-50 border-stone-200 text-stone-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live App Build ({data.liveUrl})</span>
                </div>
                <a
                  href={data.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-emerald-400"
                >
                  Launch full screen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* 3. Curated High-Res Screens Mode */}
          {viewMode === "screens" && (
            <div className="w-full h-full flex flex-col justify-between overflow-hidden">
              {data.secondaryImage && (
                <div
                  className={`px-5 py-2.5 border-b flex items-center gap-2 font-mono text-xs ${
                    isDark ? "bg-[#090a0f] border-zinc-800" : "bg-stone-50 border-stone-200"
                  }`}
                >
                  <span className={isDark ? "text-zinc-500" : "text-stone-400"}>View Screen:</span>
                  <button
                    onClick={() => setActiveScreenTab("primary")}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      activeScreenTab === "primary"
                        ? isDark
                          ? "bg-zinc-800 text-white font-semibold"
                          : "bg-white text-stone-900 font-semibold shadow-sm"
                        : isDark
                        ? "text-zinc-400 hover:text-white"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {data.primaryLabel || "Primary Flow"}
                  </button>
                  <button
                    onClick={() => setActiveScreenTab("secondary")}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      activeScreenTab === "secondary"
                        ? isDark
                          ? "bg-zinc-800 text-white font-semibold"
                          : "bg-white text-stone-900 font-semibold shadow-sm"
                        : isDark
                        ? "text-zinc-400 hover:text-white"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {data.secondaryLabel || "Full Specification"}
                  </button>
                </div>
              )}

              <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center">
                <div className="relative w-full h-full min-h-[400px]">
                  <Image
                    src={
                      activeScreenTab === "primary"
                        ? data.primaryImage
                        : data.secondaryImage || data.primaryImage
                    }
                    alt={data.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div
                className={`px-5 py-2.5 border-t font-mono text-xs flex items-center justify-between ${
                  isDark
                    ? "bg-[#090a0f] border-zinc-800 text-zinc-500"
                    : "bg-stone-50 border-stone-200 text-stone-500"
                }`}
              >
                <span>Curated Retina Capture · Click outside or ESC to close</span>
                <button
                  onClick={onClose}
                  className={`hover:underline cursor-pointer ${
                    isDark ? "text-zinc-300" : "text-stone-700"
                  }`}
                >
                  Close [ESC]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
