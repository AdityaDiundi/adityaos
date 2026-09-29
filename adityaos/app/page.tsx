"use client";

import React, { useRef, useState, useEffect } from "react";
import { WindowFrame } from "@/components/System/WindowFrame";
import { CoreIntro } from "@/components/Modules/CoreIntro";
import { ArchiveReader } from "@/components/Modules/ArchiveReader";
import { StreamFeed } from "@/components/Modules/StreamFeed";
import { PixelEngine } from "@/components/Modules/PixelEngine";
import { TerminalDesktop } from "@/components/Modules/TerminalDesktop";
import { useOSStore } from "@/store/osStore";
import { useThemeStore, OS_THEMES, OSThemeId } from "@/store/themeStore";
import {
  Sparkles,
  BookOpen,
  Tv,
  Activity,
  Clock,
  Cpu,
  Paintbrush,
  Sun,
  Moon,
  Palette,
  ChevronDown,
  Check,
} from "lucide-react";

export default function Home() {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const { openWindows, activeWindow, restoreWindow, focusWindow } = useOSStore();
  const { activeTheme, currentThemeId, setTheme, toggleDarkLight } = useThemeStore();

  const [timeStr, setTimeStr] = useState<string>("12:00:00");
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [memUsage, setMemUsage] = useState<number>(38);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Subtle random fluctuation for riced telemetry
    const statInterval = setInterval(() => {
      setCpuUsage(Math.floor(10 + Math.random() * 15));
      setMemUsage(Math.floor(36 + Math.random() * 4));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(statInterval);
    };
  }, []);

  return (
    <main
      ref={desktopContainerRef}
      style={{
        backgroundColor: activeTheme.desktopBg,
        backgroundImage: `linear-gradient(to right, ${activeTheme.desktopGrid} 1px, transparent 1px), linear-gradient(to bottom, ${activeTheme.desktopGrid} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col font-mono"
    >
      {/* Top Riced Status Bar */}
      <header
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-8 border-b px-3 flex items-center justify-between text-xs z-50 backdrop-blur-md"
      >
        {/* Left: OS Branding & Workspace Tags */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span style={{ color: activeTheme.accent }}>⟡</span>
            <span style={{ color: activeTheme.textPrimary }}>aditya-os</span>
            <span style={{ color: activeTheme.textMuted }} className="text-[10px] font-normal">
              v2.4
            </span>
          </div>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-3 w-px"
          />

          {/* Workspaces */}
          <div className="flex items-center gap-1 text-[11px]">
            <span
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.accent,
                color: activeTheme.accent,
              }}
              className="px-1.5 py-0.2 rounded border font-bold"
            >
              [1:SYS]
            </span>
            <span
              style={{ color: activeTheme.textMuted }}
              className="px-1.5 py-0.2 rounded hover:opacity-100 cursor-pointer"
            >
              [2:ARCHIVE]
            </span>
            <span
              style={{ color: activeTheme.textMuted }}
              className="px-1.5 py-0.2 rounded hover:opacity-100 cursor-pointer"
            >
              [3:CANVAS]
            </span>
          </div>
        </div>

        {/* Center: Active Window Title Tag */}
        <div className="hidden md:flex items-center gap-2 text-[11px]" style={{ color: activeTheme.textMuted }}>
          <span>ACTIVE:</span>
          <span
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="px-2 py-0.5 rounded border font-semibold"
          >
            {activeWindow ? `twm://${activeWindow}` : "twm://root"}
          </span>
        </div>

        {/* Right: Theme Switcher + Quick Launchers + Hardware Telemetry & Clock */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          {/* Quick Taskbar Launchers */}
          <div className="flex items-center gap-1">
            {/* CoreIntro */}
            <button
              type="button"
              onClick={() => {
                restoreWindow("coreIntro");
                focusWindow("coreIntro");
              }}
              title="Launch CoreIntro"
              style={{
                borderColor:
                  openWindows.includes("coreIntro") && activeWindow === "coreIntro"
                    ? activeTheme.accent
                    : undefined,
              }}
              className={`p-1 rounded transition-colors ${
                openWindows.includes("coreIntro") && activeWindow === "coreIntro"
                  ? "bg-onedark-surface border"
                  : "hover:opacity-80"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-onedark-purple" />
            </button>

            {/* PixelEngine */}
            <button
              type="button"
              onClick={() => {
                restoreWindow("pixelEngine");
                focusWindow("pixelEngine");
              }}
              title="Launch PixelEngine Canvas"
              style={{
                borderColor:
                  openWindows.includes("pixelEngine") && activeWindow === "pixelEngine"
                    ? activeTheme.accent
                    : undefined,
              }}
              className={`p-1 rounded transition-colors ${
                openWindows.includes("pixelEngine") && activeWindow === "pixelEngine"
                  ? "bg-onedark-surface border"
                  : "hover:opacity-80"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
            </button>

            {/* ArchiveReader */}
            <button
              type="button"
              onClick={() => {
                restoreWindow("archiveReader");
                focusWindow("archiveReader");
              }}
              title="Launch ArchiveReader"
              style={{
                borderColor:
                  openWindows.includes("archiveReader") && activeWindow === "archiveReader"
                    ? activeTheme.accent
                    : undefined,
              }}
              className={`p-1 rounded transition-colors ${
                openWindows.includes("archiveReader") && activeWindow === "archiveReader"
                  ? "bg-onedark-surface border"
                  : "hover:opacity-80"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-onedark-green" />
            </button>

            {/* StreamFeed */}
            <button
              type="button"
              onClick={() => {
                restoreWindow("streamFeed");
                focusWindow("streamFeed");
              }}
              title="Launch StreamFeed"
              style={{
                borderColor:
                  openWindows.includes("streamFeed") && activeWindow === "streamFeed"
                    ? activeTheme.accent
                    : undefined,
              }}
              className={`p-1 rounded transition-colors ${
                openWindows.includes("streamFeed") && activeWindow === "streamFeed"
                  ? "bg-onedark-surface border"
                  : "hover:opacity-80"
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-onedark-yellow" />
            </button>
          </div>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-3 w-px"
          />

          {/* Theme Selector Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change OS Theme"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold hover:opacity-80 transition-opacity"
            >
              <span>{activeTheme.icon}</span>
              <span className="hidden sm:inline">{activeTheme.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Dropdown Popover */}
            {isThemeMenuOpen && (
              <div
                style={{
                  backgroundColor: activeTheme.windowBg,
                  borderColor: activeTheme.windowBorder,
                  color: activeTheme.textPrimary,
                }}
                className="absolute right-0 top-7 w-48 rounded-md border shadow-2xl p-1.5 z-50 flex flex-col gap-1 backdrop-blur-md"
              >
                <div
                  style={{ color: activeTheme.textMuted }}
                  className="px-2 py-1 text-[10px] font-bold border-b border-white/5 uppercase tracking-wider"
                >
                  Shell Themes
                </div>
                {Object.values(OS_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setTheme(theme.id as OSThemeId);
                      setIsThemeMenuOpen(false);
                    }}
                    style={{
                      backgroundColor:
                        currentThemeId === theme.id ? activeTheme.cardBg : "transparent",
                    }}
                    className="flex items-center justify-between px-2 py-1 rounded text-left text-xs hover:opacity-80 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>{theme.icon}</span>
                      <span
                        className="font-medium"
                        style={{
                          color: currentThemeId === theme.id ? theme.accent : undefined,
                        }}
                      >
                        {theme.name}
                      </span>
                    </div>
                    {currentThemeId === theme.id && (
                      <Check className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleDarkLight}
            title={activeTheme.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            className="p-1 rounded border hover:opacity-80 transition-colors"
          >
            {activeTheme.isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-500" />
            )}
          </button>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-3 w-px hidden lg:block"
          />

          {/* Telemetry Chips */}
          <div
            className="hidden lg:flex items-center gap-2 text-[10px]"
            style={{ color: activeTheme.textMuted }}
          >
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-onedark-purple" />
              <span>{cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-onedark-green" />
              <span>{memUsage}%</span>
            </div>
          </div>

          {/* Clock */}
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border font-semibold text-[11px]"
          >
            <Clock className="w-3 h-3" style={{ color: activeTheme.accent }} />
            <span>{timeStr}</span>
          </div>
        </div>
      </header>

      {/* TWM Window Workspace Canvas */}
      <div className="relative flex-1 w-full h-[calc(100vh-72px)] overflow-hidden">
        {/* Module 1: CoreIntro Window */}
        <WindowFrame
          id="coreIntro"
          title="identity // CoreIntro.tsx"
          icon={<Sparkles className="w-3.5 h-3.5 text-onedark-purple" />}
          defaultPosition={{ x: 50, y: 30 }}
          defaultSize={{ width: 620, height: 480 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <CoreIntro />
        </WindowFrame>

        {/* Module 2: PixelEngine Window */}
        <WindowFrame
          id="pixelEngine"
          title="canvas // PixelEngine.tsx"
          icon={<Paintbrush className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />}
          defaultPosition={{ x: 140, y: 60 }}
          defaultSize={{ width: 740, height: 500 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <PixelEngine />
        </WindowFrame>

        {/* Module 3: ArchiveReader Window */}
        <WindowFrame
          id="archiveReader"
          title="nvim // ArchiveReader.tsx"
          icon={<BookOpen className="w-3.5 h-3.5 text-onedark-green" />}
          defaultPosition={{ x: 380, y: 90 }}
          defaultSize={{ width: 680, height: 460 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <ArchiveReader />
        </WindowFrame>

        {/* Module 4: StreamFeed Window */}
        <WindowFrame
          id="streamFeed"
          title="mpv // StreamFeed.tsx"
          icon={<Tv className="w-3.5 h-3.5 text-onedark-yellow" />}
          defaultPosition={{ x: 220, y: 150 }}
          defaultSize={{ width: 560, height: 410 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <StreamFeed />
        </WindowFrame>
      </div>

      {/* Minimized Terminal Shell State Anchored to Bottom */}
      <TerminalDesktop />
    </main>
  );
}
