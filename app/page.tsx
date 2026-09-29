"use client";

import React, { useRef, useState, useEffect } from "react";
import { WindowFrame } from "@/components/System/WindowFrame";
import { CoreIntro } from "@/components/Modules/CoreIntro";
import { ArchiveReader } from "@/components/Modules/ArchiveReader";
import { StreamFeed } from "@/components/Modules/StreamFeed";
import { PixelEngine } from "@/components/Modules/PixelEngine";
import { TerminalDesktop } from "@/components/Modules/TerminalDesktop";
import { ResumeViewer } from "@/components/Modules/ResumeViewer";
import { GalleryViewer } from "@/components/Modules/GalleryViewer";
import { FieldJournal } from "@/components/Modules/FieldJournal";
import { LearnabilityLab } from "@/components/Modules/LearnabilityLab";
import { useOSStore } from "@/store/osStore";
import { useThemeStore, OS_THEMES, OSThemeId } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
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
  ChevronDown,
  Check,
  FileText,
  Volume2,
  VolumeX,
  ExternalLink,
  Layers,
  Terminal,
  Grid,
  Image as ImageIcon,
  Compass,
  Brain,
  Keyboard,
} from "lucide-react";

export default function Home() {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const { openWindows, activeWindow, restoreWindow, focusWindow, closeWindow } = useOSStore();
  const { activeTheme, currentThemeId, setTheme, toggleDarkLight } = useThemeStore();
  const { isSoundEnabled, toggleSound, playScrollNote, playClickChime } = useSoundStore();
  const [showKeysModal, setShowKeysModal] = useState<boolean>(false);

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

    const statInterval = setInterval(() => {
      setCpuUsage(Math.floor(10 + Math.random() * 15));
      setMemUsage(Math.floor(36 + Math.random() * 4));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(statInterval);
    };
  }, []);

  const openAndFocus = (id: string) => {
    playClickChime(560);
    restoreWindow(id);
    focusWindow(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.altKey || e.metaKey) {
        if (e.key === "1") { e.preventDefault(); openAndFocus("coreIntro"); }
        else if (e.key === "2") { e.preventDefault(); openAndFocus("archiveReader"); }
        else if (e.key === "3") { e.preventDefault(); openAndFocus("streamFeed"); }
        else if (e.key === "4") { e.preventDefault(); openAndFocus("pixelEngine"); }
        else if (e.key === "5") { e.preventDefault(); openAndFocus("resumeViewer"); }
        else if (e.key === "6") { e.preventDefault(); openAndFocus("galleryViewer"); }
        else if (e.key === "7") { e.preventDefault(); openAndFocus("fieldJournal"); }
        else if (e.key === "8") { e.preventDefault(); openAndFocus("learnabilityLab"); }
        else if (e.key.toLowerCase() === "q") {
          e.preventDefault();
          if (activeWindow) {
            closeWindow(activeWindow);
            playClickChime(420);
          }
        }
      } else if (e.key === "?") {
        setShowKeysModal((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindow, closeWindow]);

  return (
    <main
      ref={desktopContainerRef}
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.desktopBg,
        backgroundImage: `linear-gradient(to right, ${activeTheme.desktopGrid} 1px, transparent 1px), linear-gradient(to bottom, ${activeTheme.desktopGrid} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col font-mono"
    >
      {/* Top Riced Status Bar - Elevated z-[1000] so it ALWAYS stays above windows */}
      <header
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-8 border-b px-3 flex items-center justify-between text-xs z-[1000] backdrop-blur-md relative"
      >
        {/* Left: OS Branding & Clickable Workspace Tags */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => openAndFocus("coreIntro")}
            title="Focus AdityaOS Core"
            className="flex items-center gap-1.5 font-bold hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span style={{ color: activeTheme.accent }}>⟡</span>
            <span style={{ color: activeTheme.textPrimary }}>aditya-os</span>
            <span style={{ color: activeTheme.textMuted }} className="text-[10px] font-normal hidden sm:inline">
              v2.4
            </span>
          </button>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-3 w-px"
          />

          {/* Interactive Workspace Tags */}
          <div className="flex items-center gap-1 text-[11px]">
            {/* [1:SYS] -> coreIntro */}
            <button
              type="button"
              onClick={() => openAndFocus("coreIntro")}
              style={{
                backgroundColor:
                  activeWindow === "coreIntro" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "coreIntro" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "coreIntro" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer"
              title="Workspace 1: Identity & Core Intro"
            >
              [1:CORE]
            </button>

            {/* [2:ARCHIVE] -> archiveReader */}
            <button
              type="button"
              onClick={() => openAndFocus("archiveReader")}
              style={{
                backgroundColor:
                  activeWindow === "archiveReader" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "archiveReader" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "archiveReader" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer"
              title="Workspace 2: Essays & Poetry Archive"
            >
              [2:ARCHIVE]
            </button>

            {/* [3:MEDIA] -> streamFeed */}
            <button
              type="button"
              onClick={() => openAndFocus("streamFeed")}
              style={{
                backgroundColor:
                  activeWindow === "streamFeed" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "streamFeed" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "streamFeed" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer"
              title="Workspace 3: @falsepeek Media & Shorts Feed"
            >
              [3:MEDIA]
            </button>

            {/* [4:CANVAS] -> pixelEngine */}
            <button
              type="button"
              onClick={() => openAndFocus("pixelEngine")}
              style={{
                backgroundColor:
                  activeWindow === "pixelEngine" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "pixelEngine" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "pixelEngine" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer"
              title="Workspace 4: Pixel Engine 2D/3D Voxel Canvas"
            >
              [4:CANVAS]
            </button>

            {/* [5:RESUME] -> resumeViewer */}
            <button
              type="button"
              onClick={() => openAndFocus("resumeViewer")}
              style={{
                backgroundColor:
                  activeWindow === "resumeViewer" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "resumeViewer" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "resumeViewer" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer"
              title="Workspace 5: Resume & Experience Viewer"
            >
              [5:RESUME]
            </button>

            {/* [6:GALLERY] -> galleryViewer */}
            <button
              type="button"
              onClick={() => openAndFocus("galleryViewer")}
              style={{
                backgroundColor:
                  activeWindow === "galleryViewer" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "galleryViewer" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "galleryViewer" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer hidden md:inline-block"
              title="Workspace 6: Feh Image Gallery"
            >
              [6:GALLERY]
            </button>

            {/* [7:FIELD] -> fieldJournal */}
            <button
              type="button"
              onClick={() => openAndFocus("fieldJournal")}
              style={{
                backgroundColor:
                  activeWindow === "fieldJournal" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "fieldJournal" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "fieldJournal" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer hidden lg:inline-block"
              title="Workspace 7: Rajasthan Field Journal & Grassroots Leadership"
            >
              [7:FIELD]
            </button>

            {/* [8:DIAGNOSTICS] -> learnabilityLab */}
            <button
              type="button"
              onClick={() => openAndFocus("learnabilityLab")}
              style={{
                backgroundColor:
                  activeWindow === "learnabilityLab" ? activeTheme.cardBg : "transparent",
                borderColor:
                  activeWindow === "learnabilityLab" ? activeTheme.accent : "transparent",
                color:
                  activeWindow === "learnabilityLab" ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer hidden lg:inline-block"
              title="Workspace 8: Aarohi Bal Sansar Learnability Lab"
            >
              [8:DIAGNOSTICS]
            </button>
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

        {/* Right: Launchers + Theme Switcher + Audio + Telemetry + Clock */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[11px]">
          {/* Quick Taskbar Launchers */}
          <div className="flex items-center gap-1">
            {/* CoreIntro */}
            <button
              type="button"
              onClick={() => openAndFocus("coreIntro")}
              title="Launch CoreIntro"
              style={{
                borderColor:
                  openWindows.includes("coreIntro") && activeWindow === "coreIntro"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("coreIntro") && activeWindow === "coreIntro"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </button>

            {/* PixelEngine */}
            <button
              type="button"
              onClick={() => openAndFocus("pixelEngine")}
              title="Launch PixelEngine Canvas"
              style={{
                borderColor:
                  openWindows.includes("pixelEngine") && activeWindow === "pixelEngine"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("pixelEngine") && activeWindow === "pixelEngine"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
            </button>

            {/* ArchiveReader */}
            <button
              type="button"
              onClick={() => openAndFocus("archiveReader")}
              title="Launch ArchiveReader"
              style={{
                borderColor:
                  openWindows.includes("archiveReader") && activeWindow === "archiveReader"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("archiveReader") && activeWindow === "archiveReader"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* StreamFeed */}
            <button
              type="button"
              onClick={() => openAndFocus("streamFeed")}
              title="Launch @falsepeek StreamFeed"
              style={{
                borderColor:
                  openWindows.includes("streamFeed") && activeWindow === "streamFeed"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("streamFeed") && activeWindow === "streamFeed"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* ResumeViewer */}
            <button
              type="button"
              onClick={() => openAndFocus("resumeViewer")}
              title="Launch ResumeViewer"
              style={{
                borderColor:
                  openWindows.includes("resumeViewer") && activeWindow === "resumeViewer"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("resumeViewer") && activeWindow === "resumeViewer"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* GalleryViewer */}
            <button
              type="button"
              onClick={() => openAndFocus("galleryViewer")}
              title="Launch Feh/Nsxiv Gallery"
              style={{
                borderColor:
                  openWindows.includes("galleryViewer") && activeWindow === "galleryViewer"
                    ? activeTheme.accent
                    : "transparent",
              }}
              className={`p-1 rounded border transition-colors ${
                openWindows.includes("galleryViewer") && activeWindow === "galleryViewer"
                  ? "bg-white/10"
                  : "hover:opacity-80"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>

          <div
            style={{ backgroundColor: activeTheme.headerBorder }}
            className="h-3 w-px"
          />

          {/* Theme Selector Dropdown Menu with z-[1100] */}
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

            {/* Dropdown Popover - Elevated z-[1100] to always overlay active windows */}
            {isThemeMenuOpen && (
              <div
                style={{
                  backgroundColor: activeTheme.windowBg,
                  borderColor: activeTheme.windowBorder,
                  color: activeTheme.textPrimary,
                }}
                className="absolute right-0 top-7 w-52 rounded-md border shadow-2xl p-1.5 z-[1100] flex flex-col gap-1 backdrop-blur-xl"
              >
                <div
                  style={{ color: activeTheme.textMuted }}
                  className="px-2 py-1 text-[10px] font-bold border-b border-white/5 uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Linux Shell Themes</span>
                  <span className="text-[9px] opacity-60">7 themes</span>
                </div>
                {Object.values(OS_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setTheme(theme.id as OSThemeId);
                      setIsThemeMenuOpen(false);
                      playClickChime(660);
                    }}
                    style={{
                      backgroundColor:
                        currentThemeId === theme.id ? activeTheme.cardBg : "transparent",
                    }}
                    className="flex items-center justify-between px-2 py-1.5 rounded text-left text-xs hover:bg-white/5 transition-all"
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
            onClick={() => {
              toggleDarkLight();
              playClickChime(500);
            }}
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

          {/* Audio Synthesizer / Beethoven Für Elise Toggle */}
          <button
            type="button"
            onClick={() => {
              toggleSound();
              playClickChime(700);
            }}
            title={isSoundEnabled ? "Mute Beethoven Für Elise Music Box" : "Enable Beethoven Für Elise Music Box"}
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: isSoundEnabled ? activeTheme.accent : activeTheme.cardBorder,
              color: isSoundEnabled ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="p-1 rounded border hover:opacity-80 transition-colors flex items-center gap-1"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickChime(540);
              setShowKeysModal(!showKeysModal);
            }}
            title="TWM Keyboard Shortcuts (Press ?)"
            style={{
              backgroundColor: showKeysModal ? activeTheme.accent : activeTheme.cardBg,
              borderColor: showKeysModal ? activeTheme.accent : activeTheme.cardBorder,
              color: showKeysModal ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textMuted,
            }}
            className="p-1 rounded border hover:opacity-80 transition-colors hidden sm:flex items-center gap-1 text-[10px] font-bold"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">KEYS</span>
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
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>{cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
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
        {/* Desktop Background Shortcuts & Widgets (Visible on empty canvas) */}
        <div className="absolute inset-0 p-6 pb-16 pointer-events-none flex flex-col justify-between z-0">
          {/* Top-Left Desktop App Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 max-w-6xl pointer-events-auto">
            {/* Shortcut 1: Pixel Engine */}
            <button
              type="button"
              onClick={() => openAndFocus("pixelEngine")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-cyan-400/60 transition-all shadow-sm"
            >
              <div
                style={{ backgroundColor: `${activeTheme.accent}20` }}
                className="w-10 h-10 rounded-md flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors"
              >
                <Paintbrush className="w-5 h-5" style={{ color: activeTheme.accent }} />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">PixelEngine</div>
                <div className="text-[10px] opacity-60">2D/3D Voxel Canvas</div>
              </div>
            </button>

            {/* Shortcut 2: Essays & Poetry Archive */}
            <button
              type="button"
              onClick={() => openAndFocus("archiveReader")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-emerald-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">Archive</div>
                <div className="text-[10px] opacity-60">Essays & Poetry</div>
              </div>
            </button>

            {/* Shortcut 3: @falsepeek Media Feed */}
            <button
              type="button"
              onClick={() => openAndFocus("streamFeed")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-amber-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Tv className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">StreamFeed</div>
                <div className="text-[10px] opacity-60">@falsepeek MPV</div>
              </div>
            </button>

            {/* Shortcut 4: Resume Viewer */}
            <button
              type="button"
              onClick={() => openAndFocus("resumeViewer")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-cyan-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">Resume.pdf</div>
                <div className="text-[10px] opacity-60">IIIT Delhi Designer</div>
              </div>
            </button>

            {/* Shortcut 5: Gallery Viewer */}
            <button
              type="button"
              onClick={() => openAndFocus("galleryViewer")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-pink-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                <ImageIcon className="w-5 h-5 text-pink-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">Gallery</div>
                <div className="text-[10px] opacity-60">Feh Image Viewer</div>
              </div>
            </button>

            {/* Shortcut 6: System Core Intro */}
            <button
              type="button"
              onClick={() => openAndFocus("coreIntro")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-purple-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">CoreIntro</div>
                <div className="text-[10px] opacity-60">Identity & Bio</div>
              </div>
            </button>

            {/* Shortcut 7: YouTube Channel Link */}
            <a
              href="https://www.youtube.com/@falsepeek"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-red-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <ExternalLink className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-red-400">@falsepeek</div>
                <div className="text-[10px] opacity-60">YouTube Channel ↗</div>
              </div>
            </a>

            {/* Shortcut 8: Field Journal */}
            <button
              type="button"
              onClick={() => openAndFocus("fieldJournal")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-amber-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">FieldJournal</div>
                <div className="text-[10px] opacity-60">Rajasthan Impact</div>
              </div>
            </button>

            {/* Shortcut 9: LearnabilityLab */}
            <button
              type="button"
              onClick={() => openAndFocus("learnabilityLab")}
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-lg border backdrop-blur-sm flex flex-col items-center gap-2 text-center group hover:scale-[1.03] hover:border-cyan-400/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-md bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs">Learnability</div>
                <div className="text-[10px] opacity-60">Aarohi Diagnostics</div>
              </div>
            </button>
          </div>

          {/* Bottom Desktop System Info Widget */}
          <div className="hidden md:flex items-end justify-between pointer-events-auto">
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}99`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-3 rounded-md border text-[11px] backdrop-blur-md max-w-md space-y-1 shadow-md"
            >
              <div className="flex items-center gap-2 font-bold" style={{ color: activeTheme.accent }}>
                <Terminal className="w-3.5 h-3.5" />
                <span>ADITYA-OS // NOCTALIA TWM</span>
              </div>
              <p className="text-[10px] opacity-75 leading-relaxed">
                Riced Web OS workstation. Tactile voxel engine, dynamic shell theming, Beethoven Für Elise music box synth, and live telemetry.
              </p>
              <div className="flex items-center gap-3 text-[10px] opacity-60 pt-1">
                <span>Kernel: 6.11.0-zen</span>
                <span>•</span>
                <span>Audio: Beethoven Für Elise</span>
                <span>•</span>
                <span>Firebase: Live</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}99`,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-2.5 rounded-md border text-[10px] backdrop-blur-md text-right space-y-0.5"
            >
              <div className="font-semibold" style={{ color: activeTheme.accent }}>
                Quick Keys & Help
              </div>
              <div className="opacity-70">Click top tabs [1:SYS] - [6:GALLERY] to switch</div>
              <div className="opacity-70">Type &apos;help&apos;, &apos;feh&apos;, or &apos;theme list&apos; in dock below</div>
            </div>
          </div>
        </div>

        {/* Module 1: CoreIntro Window */}
        <WindowFrame
          id="coreIntro"
          title="identity // CoreIntro.tsx"
          icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
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
          defaultSize={{ width: 760, height: 520 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <PixelEngine />
        </WindowFrame>

        {/* Module 3: ArchiveReader Window */}
        <WindowFrame
          id="archiveReader"
          title="nvim // ArchiveReader.tsx"
          icon={<BookOpen className="w-3.5 h-3.5 text-emerald-400" />}
          defaultPosition={{ x: 340, y: 80 }}
          defaultSize={{ width: 700, height: 480 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <ArchiveReader />
        </WindowFrame>

        {/* Module 4: StreamFeed Window */}
        <WindowFrame
          id="streamFeed"
          title="mpv // StreamFeed.tsx"
          icon={<Tv className="w-3.5 h-3.5 text-amber-400" />}
          defaultPosition={{ x: 220, y: 130 }}
          defaultSize={{ width: 600, height: 430 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <StreamFeed />
        </WindowFrame>

        {/* Module 5: ResumeViewer Window */}
        <WindowFrame
          id="resumeViewer"
          title="pdf // ResumeViewer.tsx"
          icon={<FileText className="w-3.5 h-3.5 text-cyan-400" />}
          defaultPosition={{ x: 260, y: 70 }}
          defaultSize={{ width: 720, height: 530 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <ResumeViewer />
        </WindowFrame>

        {/* Module 6: GalleryViewer Window */}
        <WindowFrame
          id="galleryViewer"
          title="feh // GalleryViewer.tsx"
          icon={<ImageIcon className="w-3.5 h-3.5 text-pink-400" />}
          defaultPosition={{ x: 180, y: 90 }}
          defaultSize={{ width: 740, height: 500 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <GalleryViewer />
        </WindowFrame>

        {/* Module 7: FieldJournal Window */}
        <WindowFrame
          id="fieldJournal"
          title="field // FieldJournal.tsx"
          icon={<Compass className="w-3.5 h-3.5 text-amber-400" />}
          defaultPosition={{ x: 140, y: 40 }}
          defaultSize={{ width: 780, height: 520 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <FieldJournal />
        </WindowFrame>

        {/* Module 8: LearnabilityLab Window */}
        <WindowFrame
          id="learnabilityLab"
          title="diagnostics // LearnabilityLab.tsx"
          icon={<Brain className="w-3.5 h-3.5 text-cyan-400" />}
          defaultPosition={{ x: 220, y: 60 }}
          defaultSize={{ width: 780, height: 530 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <LearnabilityLab />
        </WindowFrame>
      </div>

      {/* Minimized Terminal Shell State Anchored to Bottom */}
      <TerminalDesktop />

      {/* TWM Keyboard Shortcuts Modal */}
      {showKeysModal && (
        <div
          onClick={() => setShowKeysModal(false)}
          className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: activeTheme.windowBg,
              borderColor: activeTheme.accent,
              color: activeTheme.textPrimary,
            }}
            className="w-full max-w-md p-4 rounded-xl border shadow-2xl space-y-3 font-mono text-xs select-none"
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: activeTheme.headerBorder }}>
              <div className="font-bold flex items-center gap-2" style={{ color: activeTheme.accent }}>
                <Keyboard className="w-4 h-4" />
                <span>ADITYA-OS // TWM SHORTCUTS</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeysModal(false)}
                className="opacity-60 hover:opacity-100 text-[11px]"
              >
                [ESC / ×]
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Core Intro</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 1</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Archive Reader (Vim)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 2</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Stream Feed (@falsepeek)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 3</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Pixel Engine (2D/3D Voxel)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 4</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Resume Viewer</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 5</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Image Gallery (Feh)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 6</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Rural Field Journal</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 7</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Switch to Learnability Diagnostics</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 font-bold">Alt + 8</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Close Active Window</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-red-400 font-bold">Alt + Q</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="opacity-75">Toggle Shortcuts Cheatsheet</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-amber-400 font-bold">?</kbd>
              </div>
            </div>

            <div className="pt-2 text-[10px] opacity-60 text-center">
              Press anywhere outside or click [ESC] to return to workspace.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
