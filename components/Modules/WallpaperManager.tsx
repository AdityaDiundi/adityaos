"use client";

import React, { useState } from "react";
import { useOSStore } from "@/store/osStore";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  Image as ImageIcon,
  Check,
  Grid,
  Shuffle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";

export interface WallpaperPreset {
  id: string;
  name: string;
  category: "Atmospheric" | "Cyber" | "Minimal" | "Himalaya" | "System";
  url: string;
  thumb: string;
  author: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: "cyberpunk-rain",
    name: "Neo-Tokyo Rain Reflections",
    category: "Cyber",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=70&w=400&auto=format&fit=crop",
    author: "Aleksandar Pasaric",
  },
  {
    id: "obsidian-fluid",
    name: "Obsidian Liquid Wave (Sonoma Dark)",
    category: "Minimal",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=70&w=400&auto=format&fit=crop",
    author: "Milad Fakurian",
  },
  {
    id: "shibuya-cyber",
    name: "Cyber Neon Shibuya Alley",
    category: "Cyber",
    url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=70&w=400&auto=format&fit=crop",
    author: "Clay Banks",
  },
  {
    id: "milky-way-alpine",
    name: "Milky Way Over Alpine Peaks",
    category: "Atmospheric",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=70&w=400&auto=format&fit=crop",
    author: "Benjamin Davies",
  },
  {
    id: "aurora-fjord",
    name: "Emerald Aurora Borealis",
    category: "Atmospheric",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=70&w=400&auto=format&fit=crop",
    author: "Vincent Guth",
  },
  {
    id: "abstract-geometry",
    name: "Dark Obsidian Prisms",
    category: "Minimal",
    url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=70&w=400&auto=format&fit=crop",
    author: "Milad Fakurian",
  },
  {
    id: "moody-forest",
    name: "Indigo Forest Fog & Pines",
    category: "Atmospheric",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=70&w=400&auto=format&fit=crop",
    author: "Sebastian Unrau",
  },
  {
    id: "himalayan-peaks",
    name: "Kumaon Himalayan Ridge",
    category: "Himalaya",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=70&w=400&auto=format&fit=crop",
    author: "Kaloyan Christov",
  },
  {
    id: "tokyo-cyber",
    name: "Tokyo Cyber Twilight",
    category: "Cyber",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=70&w=400&auto=format&fit=crop",
    author: "Aleksandar Pasaric",
  },
  {
    id: "deep-cosmos",
    name: "Deep Cosmos Nebula (JWST)",
    category: "Atmospheric",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=70&w=400&auto=format&fit=crop",
    author: "Vincentiu Solomon",
  },
  {
    id: "matrix-grid",
    name: "Retro Digital Stream (Matrix Fall)",
    category: "Cyber",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=70&w=400&auto=format&fit=crop",
    author: "Markus Spiske",
  },
  {
    id: "minimal-horizon",
    name: "Midnight Calm Horizon",
    category: "Minimal",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=70&w=400&auto=format&fit=crop",
    author: "Sean Oulashin",
  },
  {
    id: "clean-slate",
    name: "Pure OneDark Canvas (No Image)",
    category: "System",
    url: "",
    thumb: "",
    author: "Solid Dark Theme Default",
  },
];

export const WallpaperManager: React.FC = () => {
  const { wallpaperUrl, setWallpaper, showDesktopGrid, toggleDesktopGrid } = useOSStore();
  const { activeTheme } = useThemeStore();
  const { playClickChime } = useSoundStore();

  const [customInput, setCustomInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Atmospheric", "Cyber", "Minimal", "Himalaya", "System"];

  const filteredPresets = selectedCategory === "All"
    ? WALLPAPER_PRESETS
    : WALLPAPER_PRESETS.filter((p) => p.category === selectedCategory);

  const handleApplyPreset = (url: string) => {
    playClickChime(640);
    setWallpaper(url);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    playClickChime(720);
    setWallpaper(customInput.trim());
    setCustomInput("");
  };

  const handleRandomize = () => {
    const valid = WALLPAPER_PRESETS.filter((p) => p.url !== "");
    const randomItem = valid[Math.floor(Math.random() * valid.length)];
    if (randomItem) {
      handleApplyPreset(randomItem.url);
    }
  };

  const isCurrentActive = (url: string) => {
    if (!url && !wallpaperUrl) return true;
    return wallpaperUrl === url;
  };

  return (
    <div
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="h-full flex flex-col font-mono text-xs select-none overflow-hidden"
    >
      {/* Top Controller Bar */}
      <div
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.cardBorder,
        }}
        className="p-3 border-b flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center font-bold text-black"
            style={{ backgroundColor: activeTheme.accent }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5" style={{ color: activeTheme.textPrimary }}>
              WALLPAPER ENGINE
              <span className="text-[10px] font-normal px-1 rounded opacity-75 border" style={{ borderColor: activeTheme.cardBorder }}>
                Unsplash CDN
              </span>
            </div>
            <div className="text-[10px]" style={{ color: activeTheme.textMuted }}>
              Curated minimal dark wallpapers & dynamic custom URLs
            </div>
          </div>
        </div>

        {/* Global toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickChime(500);
              toggleDesktopGrid();
            }}
            style={{
              backgroundColor: showDesktopGrid ? `${activeTheme.accent}20` : "transparent",
              borderColor: showDesktopGrid ? activeTheme.accent : activeTheme.cardBorder,
              color: showDesktopGrid ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="px-2 py-1 rounded border flex items-center gap-1.5 hover:opacity-100 transition-all cursor-pointer text-[11px]"
            title="Toggle desktop 24px grid overlay"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid: {showDesktopGrid ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={handleRandomize}
            style={{
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            className="px-2 py-1 rounded border flex items-center gap-1.5 hover:bg-white/5 transition-all cursor-pointer text-[11px]"
            title="Pick a random wallpaper preset"
          >
            <Shuffle className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
            <span>Random</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset("")}
            style={{
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textMuted,
            }}
            className="px-2 py-1 rounded border flex items-center gap-1.5 hover:bg-white/5 transition-all cursor-pointer text-[11px]"
            title="Reset to default solid OneDark desktop"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div
        style={{
          borderColor: activeTheme.headerBorder,
        }}
        className="px-3 py-2 border-b flex items-center gap-1 overflow-x-auto text-[11px]"
      >
        <span className="text-[10px] uppercase font-bold mr-1" style={{ color: activeTheme.textMuted }}>
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              playClickChime(480);
              setSelectedCategory(cat);
            }}
            style={{
              backgroundColor:
                selectedCategory === cat ? activeTheme.cardBg : "transparent",
              borderColor:
                selectedCategory === cat ? activeTheme.accent : "transparent",
              color:
                selectedCategory === cat ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="px-2 py-0.5 rounded border transition-all cursor-pointer font-medium"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset Cards Grid */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPresets.map((preset) => {
            const active = isCurrentActive(preset.url);

            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset.url)}
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: active ? activeTheme.accent : activeTheme.cardBorder,
                }}
                className={`relative group rounded-lg border p-2 flex flex-col justify-between transition-all cursor-pointer hover:border-white/40 ${
                  active ? "ring-2 shadow-lg" : ""
                }`}
              >
                {/* Wallpaper Preview Container */}
                <div
                  className="w-full h-28 rounded overflow-hidden relative border border-white/5 flex items-center justify-center"
                  style={{
                    backgroundColor: activeTheme.desktopBg,
                  }}
                >
                  {preset.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preset.thumb}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Layers className="w-6 h-6 mx-auto mb-1 opacity-40" />
                      <span className="text-[10px] opacity-60">Pure Desktop Theme Grid</span>
                    </div>
                  )}

                  {/* Active Indicator Badge */}
                  {active && (
                    <div
                      style={{ backgroundColor: activeTheme.accent }}
                      className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-black flex items-center gap-1 shadow-md"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <div className="font-bold truncate text-[11px]" style={{ color: activeTheme.textPrimary }}>
                      {preset.name}
                    </div>
                    <div className="text-[10px] opacity-60 truncate">
                      {preset.author}
                    </div>
                  </div>

                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0"
                    style={{ borderColor: activeTheme.cardBorder, color: activeTheme.textMuted }}
                  >
                    {preset.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom URL Input Section */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="p-3 rounded-lg border mt-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5" style={{ color: activeTheme.accent }}>
              <Sparkles className="w-3.5 h-3.5" />
              Custom Wallpaper Image URL
            </span>
            <span className="text-[10px] opacity-60">Unsplash, Imgur, or direct CDN links</span>
          </div>

          <form onSubmit={handleApplyCustom} className="flex gap-2">
            <input
              type="url"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
              style={{
                backgroundColor: activeTheme.windowBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="flex-1 px-3 py-1.5 rounded border text-xs outline-none focus:border-cyan-400 placeholder:opacity-40"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              style={{
                backgroundColor: customInput.trim() ? activeTheme.accent : activeTheme.cardBorder,
                color: customInput.trim() ? "#000" : activeTheme.textMuted,
              }}
              className="px-3 py-1.5 rounded font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Apply
            </button>
          </form>

          {/* Quick instructions / tips */}
          <div className="text-[10px] opacity-60 leading-relaxed pt-1">
            Tip: All wallpapers automatically receive a calibrated OneDark contrast overlay (65% dark tint) so code windows, terminal, and status bars remain 100% readable.
          </div>
        </div>
      </div>
    </div>
  );
};
