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
import { WallpaperManager } from "@/components/Modules/WallpaperManager";
import { DesktopStickyNote } from "@/components/Modules/DesktopStickyNote";
import { HyprlandBootScreen } from "@/components/System/HyprlandBootScreen";
import { PortfolioView } from "@/components/Portfolio/PortfolioView";
import { useOSStore } from "@/store/osStore";
import { useThemeStore, OS_THEMES, OSThemeId } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import { WelcomeModal } from "@/components/System/WelcomeModal";
import { PaperPixelWallpaper } from "@/components/System/PaperPixelWallpaper";
import { DesktopObjects } from "@/components/System/DesktopObjects";
import {
  PixelWorkIcon,
  PixelWritingIcon,
  PixelAboutIcon,
  PixelResumeIcon,
  PixelGalleryIcon,
  PixelTerminalIcon,
  PixelStudioIcon,
} from "@/components/System/PixelIcons";
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
  MessageSquare,
  StickyNote,
  Lock,
  Folder,
  FileCode,
  SlidersHorizontal,
} from "lucide-react";

const APP_LABELS: Record<string, string> = {
  coreIntro: "About",
  archiveReader: "Writing",
  streamFeed: "Media",
  pixelEngine: "PixelStudio",
  resumeViewer: "Resume",
  galleryViewer: "Gallery",
  fieldJournal: "Field Journal",
  learnabilityLab: "Diagnostic Lab",
  wallpaperManager: "Wallpaper Gallery",
};

export function AdityaOSDesktop({
  initialViewMode = "os",
  defaultApp,
}: {
  initialViewMode?: "portfolio" | "os";
  defaultApp?: string;
} = {}) {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const {
    openWindows,
    activeWindow,
    restoreWindow,
    focusWindow,
    maximizeWindow,
    closeWindow,
    wallpaperUrl,
    showDesktopGrid,
    toggleDesktopGrid,
    isStickyNoteOpen,
    toggleStickyNote,
    isLocked,
    lockSession,
    minimizeAllWindows,
    closeAllWindows,
  } = useOSStore();
  const { activeTheme, currentThemeId, setTheme, toggleDarkLight } = useThemeStore();
  const { isSoundEnabled, toggleSound, playScrollNote, playClickChime } = useSoundStore();
  const [showKeysModal, setShowKeysModal] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number } | null>(null);

  const [timeStr, setTimeStr] = useState<string>("12:00:00");
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [memUsage, setMemUsage] = useState<number>(38);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("welcome") === "0" || params.get("welcome") === "false") {
        setShowWelcomeModal(false);
        return;
      }
      const dismissed = localStorage.getItem("adityaos_welcome_dismissed");
      if (!dismissed) {
        setShowWelcomeModal(true);
      }
    } catch {
      // Fallback if localStorage is disabled or throws
    }
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem("adityaos_welcome_dismissed", "true");
    } catch {}
  };

  const [viewMode, setViewMode] = useState<"portfolio" | "os">(() => {
    if (initialViewMode) return initialViewMode;
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get("app");
      const isPixel =
        hostname.includes("pixel-engine") ||
        hostname.includes("pixel-studio") ||
        pathname.startsWith("/pixel") ||
        pathname.startsWith("/studio") ||
        pathname.startsWith("/pixelengine") ||
        params.get("mode") === "os" ||
        appParam === "pixel" ||
        appParam === "pixelEngine" ||
        defaultApp === "pixelEngine";
      if (isPixel) return "os";
    }
    return "portfolio";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname;
      const appParam = params.get("app");
      const hostname = window.location.hostname;
      const isPixelDomain = hostname.includes("pixel-engine") || hostname.includes("pixel-studio");
      const isPixelLink =
        isPixelDomain ||
        pathname === "/pixel" ||
        pathname === "/studio" ||
        pathname === "/pixelengine" ||
        appParam === "pixel" ||
        appParam === "pixelEngine" ||
        appParam === "studio" ||
        defaultApp === "pixelEngine";

      if (isPixelLink) {
        setViewMode("os");
        restoreWindow("pixelEngine");
        focusWindow("pixelEngine");
        maximizeWindow("pixelEngine");
        closeWindow("coreIntro");
      } else if (params.get("mode") === "os") {
        setViewMode("os");
      }

      if (appParam && APP_LABELS[appParam] && appParam !== "pixelEngine") {
        restoreWindow(appParam);
        focusWindow(appParam);
      }

      const themeParam = params.get("theme");
      if (themeParam === "light" || themeParam === "editorial") {
        setTheme("light");
      } else if (themeParam && OS_THEMES[themeParam as OSThemeId]) {
        setTheme(themeParam as OSThemeId);
      }
    }
  }, [setTheme, restoreWindow, focusWindow, maximizeWindow]);

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
        else if (e.key === "9") { e.preventDefault(); openAndFocus("wallpaperManager"); }
        else if (e.key.toLowerCase() === "l") {
          e.preventDefault();
          lockSession();
        }
        else if (e.key.toLowerCase() === "q") {
          e.preventDefault();
          if (activeWindow) {
            closeWindow(activeWindow);
            playClickChime(420);
          }
        }
      } else if (e.key === "?") {
        setShowKeysModal((prev) => !prev);
      } else if (e.key === "Escape") {
        setContextMenu(null);
        setShowKeysModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindow, closeWindow]);

  // Dismiss context menu whenever clicking outside the menu
  useEffect(() => {
    if (!contextMenu) return;
    const handleGlobalPointerDown = (e: PointerEvent | MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("#desktop-context-menu")) return;
      setContextMenu(null);
    };
    window.addEventListener("pointerdown", handleGlobalPointerDown);
    return () => window.removeEventListener("pointerdown", handleGlobalPointerDown);
  }, [contextMenu]);

  // Dismiss theme menu whenever clicking outside the theme selector
  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const handleOutsideClick = (e: PointerEvent | MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("#theme-selector-container")) return;
      setIsThemeMenuOpen(false);
    };
    window.addEventListener("pointerdown", handleOutsideClick);
    return () => window.removeEventListener("pointerdown", handleOutsideClick);
  }, [isThemeMenuOpen]);

  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't intercept right clicks if inside an active window frame, canvas, header, or interactive controls
    if (
      target.closest(".window-frame") ||
      target.closest("[data-window-id]") ||
      target.closest("canvas") ||
      target.closest(".pixel-engine") ||
      target.closest(".pixel-engine-viewport") ||
      target.closest(".pixel-engine-canvas") ||
      target.closest("header") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("button")
    ) {
      return;
    }
    e.preventDefault();
    const menuWidth = 240;
    const menuHeight = 360;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);
    setContextMenu({ isOpen: true, x, y });
    playClickChime(500);
  };

  if (viewMode === "portfolio") {
    return (
      <PortfolioView
        onLaunchOS={() => {
          closeAllWindows();
          setViewMode("os");
        }}
      />
    );
  }

  return (
    <main
      ref={desktopContainerRef}
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu) setContextMenu(null);
        if (isThemeMenuOpen) setIsThemeMenuOpen(false);
      }}
      onWheel={(e) => playScrollNote(e.deltaY)}
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col font-mono"
    >
      {/* Dynamic Wallpaper Layer */}
      {wallpaperUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out pointer-events-none"
            style={{
              backgroundImage: `url(${wallpaperUrl})`,
              backgroundColor: activeTheme.desktopBg,
            }}
          />
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
              activeTheme.isDark
                ? "bg-black/40 backdrop-blur-[0.5px]"
                : "bg-white/20 backdrop-blur-[0.5px]"
            }`}
          />
        </>
      ) : (
        <PaperPixelWallpaper />
      )}

      {/* Desktop Grid Lines (Toggled via showDesktopGrid) */}
      {showDesktopGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to right, ${activeTheme.desktopGrid} 1px, transparent 1px), linear-gradient(to bottom, ${activeTheme.desktopGrid} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {/* Top Bar - Elevated z-[1000] without horizontal clipping */}
      <header
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
          color: activeTheme.textPrimary,
        }}
        className="h-8 border-b px-3 sm:px-4 flex items-center justify-between text-xs z-[1000] backdrop-blur-md relative whitespace-nowrap select-none overflow-visible"
      >
        {/* Left: OS Branding & Clickable Workspace Tabs (if >= 2 windows) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setShowWelcomeModal(true)}
            title="Desk of Aditya Diundi (Click to open Welcome door)"
            className="flex items-center gap-1.5 font-bold hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            <span style={{ color: activeTheme.accent }}>⟡</span>
            <span className="whitespace-nowrap" style={{ color: activeTheme.textPrimary }}>aditya-os</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.location.pathname.startsWith("/os")) {
                window.location.href = "/";
              } else {
                if (typeof window !== "undefined" && window.location.search) {
                  window.history.pushState(null, "", window.location.pathname);
                }
                setViewMode("portfolio");
              }
            }}
            className="px-2 py-0.5 rounded border font-semibold flex items-center gap-1 hover:opacity-100 transition-all cursor-pointer text-[10px] whitespace-nowrap shrink-0"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(0, 255, 204, 0.15)" : "rgba(18, 19, 22, 0.08)",
              borderColor: activeTheme.isDark ? "#00FFCC" : "rgba(0, 0, 0, 0.18)",
              color: activeTheme.isDark ? "#00FFCC" : "#121316",
            }}
            title="Exit back to Portfolio"
          >
            <span>← Portfolio</span>
          </button>

          {/* Workspace Tabs: Shown only when 2 or more windows are open */}
          {openWindows.length >= 2 && (
            <>
              <div
                style={{ backgroundColor: activeTheme.headerBorder }}
                className="h-3 w-px shrink-0 hidden sm:block"
              />

              <div className="flex items-center gap-1 text-[11px] shrink-0 whitespace-nowrap">
                {openWindows.map((winId) => {
                  const label = (APP_LABELS[winId] || winId).toUpperCase();
                  const isActive = activeWindow === winId;
                  return (
                    <button
                      key={winId}
                      type="button"
                      onClick={() => openAndFocus(winId)}
                      style={{
                        backgroundColor: isActive ? activeTheme.cardBg : "transparent",
                        borderColor: isActive ? activeTheme.accent : "transparent",
                        color: isActive ? activeTheme.accent : activeTheme.textMuted,
                      }}
                      className="px-1.5 py-0.2 rounded border font-semibold hover:opacity-100 transition-all cursor-pointer shrink-0"
                    >
                      [{label}]
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Center: Current Window Title */}
        <div className="hidden md:flex items-center gap-2 text-[11px] truncate px-3" style={{ color: activeTheme.textMuted }}>
          <span className="font-serif italic text-[12px] opacity-80">
            {activeWindow ? (APP_LABELS[activeWindow] || activeWindow) : "Aditya Diundi // Desk"}
          </span>
        </div>

        {/* Right: Theme Selector + Keys Button + Settings Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] shrink-0 whitespace-nowrap">
          {/* Theme Selector Dropdown Menu */}
          <div className="relative" id="theme-selector-container">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsThemeMenuOpen((prev) => !prev);
                setIsSettingsMenuOpen(false);
              }}
              title="Change OS Theme"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span>{activeTheme.icon}</span>
              <span className="hidden sm:inline">{activeTheme.name}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isThemeMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: activeTheme.windowBg,
                  borderColor: activeTheme.windowBorder,
                  color: activeTheme.textPrimary,
                }}
                className="absolute right-0 top-full mt-1.5 w-56 rounded-md border shadow-2xl p-1.5 z-[1200] flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
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

          {/* Keyboard Shortcuts Trigger (Keys) */}
          <button
            type="button"
            onClick={() => {
              playClickChime(540);
              setShowKeysModal(!showKeysModal);
            }}
            title="Keyboard Shortcuts (Press ?)"
            style={{
              backgroundColor: showKeysModal ? activeTheme.accent : activeTheme.cardBg,
              borderColor: showKeysModal ? activeTheme.accent : activeTheme.cardBorder,
              color: showKeysModal ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textMuted,
            }}
            className="p-1 px-1.5 rounded border hover:opacity-80 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KEYS</span>
          </button>

          {/* Settings / Overflow Menu (Contains Audio, Dark/Light mode, Lock) */}
          <div className="relative" id="settings-menu-container">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsMenuOpen((prev) => !prev);
                setIsThemeMenuOpen(false);
              }}
              title="Desktop Controls & Overflow"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-1 px-1.5 rounded border hover:opacity-80 transition-opacity cursor-pointer flex items-center"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {isSettingsMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: activeTheme.windowBg,
                  borderColor: activeTheme.windowBorder,
                  color: activeTheme.textPrimary,
                }}
                className="absolute right-0 top-full mt-1.5 w-52 rounded-md border shadow-2xl p-1.5 z-[1200] flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 font-mono text-xs"
              >
                {/* Dark/Light toggle */}
                <button
                  type="button"
                  onClick={() => {
                    toggleDarkLight();
                    playClickChime(500);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {activeTheme.isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-500" />}
                    <span>{activeTheme.isDark ? "Light Mode" : "Dark Mode"}</span>
                  </span>
                </button>

                {/* Sound / Für Elise toggle */}
                <button
                  type="button"
                  onClick={() => {
                    toggleSound();
                    playClickChime(700);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
                    <span>Für Elise Music Box</span>
                  </span>
                  <span className="text-[10px] opacity-60">{isSoundEnabled ? "ON" : "OFF"}</span>
                </button>

                {/* Lock session */}
                <button
                  type="button"
                  onClick={() => {
                    lockSession();
                    setIsSettingsMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer border-t border-white/5 mt-0.5 pt-1.5"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Lock Screen</span>
                  </span>
                  <kbd className="text-[9px] opacity-60">Alt+L</kbd>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TWM Window Workspace Canvas */}
      <div className="relative flex-1 w-full h-[calc(100vh-72px)] overflow-hidden">
        {/* Three Quiet Desk Objects (Sticky Note with Poetry, Pinned Latest Essay, Desk Clock) */}
        <DesktopObjects onOpenEssay={() => openAndFocus("archiveReader")} />

        {/* Desktop Background Shortcuts & Widgets (Visible on canvas) */}
        <div className="absolute inset-0 p-6 pb-16 pointer-events-none flex flex-col justify-between z-0">
          {/* Left Desktop App Icons Column - High-craft Pixel Art Icons */}
          <div className="flex flex-col flex-wrap max-h-[calc(100vh-140px)] gap-y-5 gap-x-6 pointer-events-auto w-fit z-10 pt-2 pl-2">
            {/* 1: Work */}
            <button
              type="button"
              onClick={() => {
                playClickChime(450);
                openAndFocus("archiveReader");
              }}
              title="Work // Shipped Systems"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelWorkIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                Work
              </span>
            </button>

            {/* 2: Writing */}
            <button
              type="button"
              onClick={() => {
                playClickChime(450);
                openAndFocus("archiveReader");
              }}
              title="Writing // Essays & Poetry"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelWritingIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                Writing
              </span>
            </button>

            {/* 3: About */}
            <button
              type="button"
              onClick={() => {
                playClickChime(460);
                openAndFocus("coreIntro");
              }}
              title="About // Bio & Identity"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelAboutIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                About
              </span>
            </button>

            {/* 4: Resume */}
            <button
              type="button"
              onClick={() => {
                playClickChime(400);
                openAndFocus("resumeViewer");
              }}
              title="Resume // Document & Experience"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelResumeIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                Resume
              </span>
            </button>

            {/* 5: Gallery */}
            <button
              type="button"
              onClick={() => {
                playClickChime(480);
                openAndFocus("galleryViewer");
              }}
              title="Gallery // Visual Fieldwork"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelGalleryIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                Gallery
              </span>
            </button>

            {/* 6: Terminal */}
            <button
              type="button"
              onClick={() => {
                playClickChime(420);
                window.dispatchEvent(new CustomEvent("open-terminal"));
              }}
              title="Terminal // Noctalia Shell"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelTerminalIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                Terminal
              </span>
            </button>

            {/* 7: PixelStudio */}
            <button
              type="button"
              onClick={() => {
                playClickChime(500);
                openAndFocus("pixelEngine");
              }}
              title="PixelStudio // Creative Canvas"
              className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-transform active:scale-95 w-18"
            >
              <div
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(240, 240, 243, 0.9)",
                  borderColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-105 group-hover:shadow-md transition-all duration-150"
              >
                <PixelStudioIcon size={30} className="text-stone-800 dark:text-zinc-200" />
              </div>
              <span
                style={{ color: activeTheme.textPrimary }}
                className="font-mono text-xs font-medium tracking-tight text-center select-none truncate max-w-[80px] opacity-90 group-hover:opacity-100 transition-opacity"
              >
                PixelStudio
              </span>
            </button>
          </div>
        </div>

        {/* Module 1: CoreIntro Window */}
        <WindowFrame
          id="coreIntro"
          title="About // Design Technologist Bio"
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
          title="PixelStudio // Canvas & Sand Simulation"
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
          title="Writing // Fieldwork, Essays & Poetry"
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
          title="Media Feed // Videos & Visual Experiments"
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
          title="Resume // Experience & Education"
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
          title="Photo Gallery // Visual & Fieldwork"
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
          title="Field Journal // Rural Immersion & Impact"
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
          title="Diagnostic Lab // Aarohi Bal Sansar"
          icon={<Brain className="w-3.5 h-3.5 text-cyan-400" />}
          defaultPosition={{ x: 220, y: 60 }}
          defaultSize={{ width: 780, height: 530 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <LearnabilityLab />
        </WindowFrame>

        {/* Module 9: WallpaperManager Window */}
        <WindowFrame
          id="wallpaperManager"
          title="Wallpaper Gallery // Desktop Wallpapers"
          icon={<ImageIcon className="w-3.5 h-3.5 text-pink-400" />}
          defaultPosition={{ x: 200, y: 70 }}
          defaultSize={{ width: 760, height: 530 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <WallpaperManager />
        </WindowFrame>
      </div>

      {/* Minimized Terminal Shell State Anchored to Bottom */}
      <TerminalDesktop />

      {/* Floating Desktop Sticky Note / Visitor Scratchpad */}
      <DesktopStickyNote dragConstraintsRef={desktopContainerRef} />

      {/* Hyprland Boot & Lock / Login Screen */}
      <HyprlandBootScreen />

      {/* Desktop Right-Click Context Menu */}
      {contextMenu && (
        <div
          id="desktop-context-menu"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.stopPropagation()}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: activeTheme.windowBg,
            borderColor: activeTheme.windowBorder,
            color: activeTheme.textPrimary,
          }}
          className="fixed z-[1600] w-64 rounded-xl border shadow-2xl p-1.5 font-mono text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 select-none"
        >
          {/* Header / Brand */}
          <div
            className="px-2.5 py-1.5 border-b mb-1 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase opacity-75"
            style={{ borderColor: activeTheme.headerBorder, color: activeTheme.accent }}
          >
            <div className="flex items-center gap-1.5">
              <span>⟡</span>
              <span>ADITYA-OS DESKTOP</span>
            </div>
            <span className="opacity-60 text-[9px]">v2.4</span>
          </div>

          {/* Section 1: Appearance & Desktop Customization */}
          <div className="space-y-0.5 pb-1 mb-1 border-b" style={{ borderColor: activeTheme.headerBorder }}>
            <button
              type="button"
              onClick={() => {
                lockSession();
                playClickChime(400);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Lock Screen</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] text-yellow-400">Alt+L</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                toggleStickyNote();
                playClickChime(500);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                <span>Sticky Note</span>
              </span>
              <span className={`text-[10px] font-bold ${isStickyNoteOpen ? "text-amber-400" : "opacity-40"}`}>
                {isStickyNoteOpen ? "PINNED" : "OFF"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("wallpaperManager");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Change Wallpaper...</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] text-pink-400">Alt+9</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                toggleDesktopGrid();
                playClickChime(500);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Toggle Desktop Grid</span>
              </span>
              {showDesktopGrid ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> ON
                </span>
              ) : (
                <span className="text-[10px] opacity-40">OFF</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                toggleSound();
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isSoundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 opacity-40" />
                )}
                <span>8-Bit Music Box Audio</span>
              </span>
              <span className={`text-[10px] font-bold ${isSoundEnabled ? "text-emerald-400" : "opacity-40"}`}>
                {isSoundEnabled ? "ACTIVE" : "MUTED"}
              </span>
            </button>
          </div>

          {/* Section 2: Quick Launch Apps / Workspaces */}
          <div className="space-y-0.5 pb-1 mb-1 border-b" style={{ borderColor: activeTheme.headerBorder }}>
            <button
              type="button"
              onClick={() => {
                openAndFocus("coreIntro");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>About Aditya</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+1</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("archiveReader");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Case Studies & Essays</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+2</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("pixelEngine");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Paintbrush className="w-3.5 h-3.5 text-amber-400" />
                <span>Pixel Studio</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+4</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("resumeViewer");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Resume & Experience</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+5</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("fieldJournal");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Rural Field Journal</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+7</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                openAndFocus("learnabilityLab");
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Learnability Lab</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] opacity-60">Alt+8</kbd>
            </button>
          </div>

          {/* Section 3: Window Management */}
          <div className="space-y-0.5 pb-1 mb-1 border-b" style={{ borderColor: activeTheme.headerBorder }}>
            <button
              type="button"
              onClick={() => {
                minimizeAllWindows();
                playClickChime(420);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 opacity-60" />
                <span>Minimize All Windows</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeAllWindows();
                playClickChime(380);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 text-red-400 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>✕</span>
                <span>Close All Windows</span>
              </span>
            </button>
          </div>

          {/* Section 4: Shortcuts / Help */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setShowKeysModal(true);
                setContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Keyboard className="w-3.5 h-3.5 text-yellow-400" />
                <span>Keyboard Shortcuts</span>
              </span>
              <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] text-yellow-400 font-bold">?</kbd>
            </button>
          </div>
        </div>
      )}

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
                <span className="opacity-75">Switch to Wallpaper Engine</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-rose-400 font-bold">Alt + 9</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="opacity-75">Lock Session (Hyprlock Boot Screen)</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-yellow-400 font-bold">Alt + L</kbd>
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
              Right-click anywhere on empty desktop for quick options or press [ESC] to return.
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal on first load */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onDismiss={handleDismissWelcome}
        onOpenWork={() => openAndFocus("archiveReader")}
        onOpenWriting={() => openAndFocus("archiveReader")}
        onOpenAbout={() => openAndFocus("coreIntro")}
      />
    </main>
  );
}
