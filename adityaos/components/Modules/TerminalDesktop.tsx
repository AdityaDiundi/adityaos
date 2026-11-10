"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, ChevronUp, ChevronDown, Palette, Paintbrush, FileText, Image as ImageIcon } from "lucide-react";
import { useOSStore } from "@/store/osStore";
import { useThemeStore, OS_THEMES, OSThemeId } from "@/store/themeStore";

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalDesktop: React.FC = () => {
  const { restoreWindow, focusWindow, toggleStickyNote, lockSession } = useOSStore();
  const { activeTheme, currentThemeId, setTheme, nextTheme, toggleDarkLight } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "noctalia --init",
      output: (
        <span className="text-onedark-muted">
          Noctalia Shell v2.4 (x86_64-linux-gnu). Type <span className="text-onedark-yellow font-bold">help</span>, <span className="text-onedark-cyan font-bold">theme list</span>, or click Quick Chips below.
        </span>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isExpanded, history]);

  useEffect(() => {
    const handleToggleTerminal = () => {
      setIsExpanded((prev) => {
        if (!prev) setTimeout(() => inputRef.current?.focus(), 60);
        return !prev;
      });
    };
    window.addEventListener("open-terminal", handleToggleTerminal);
    return () => window.removeEventListener("open-terminal", handleToggleTerminal);
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let output: React.ReactNode = null;
    const lowerCmd = trimmed.toLowerCase();

    if (trimmed === "cat poetry.txt" || trimmed === "poetry" || trimmed === "open archive" || trimmed === "archive") {
      restoreWindow("archiveReader");
      focusWindow("archiveReader");
      output = (
        <span className="text-onedark-green">
          [OK] Spawning ArchiveReader window (Writing buffer attached).
        </span>
      );
    } else if (trimmed === "./play_latest_match" || trimmed === "play" || trimmed === "stream") {
      restoreWindow("streamFeed");
      focusWindow("streamFeed");
      output = (
        <span className="text-onedark-blue">
          [OK] Initializing MPV stream feed (VP9/4K telemetry active).
        </span>
      );
    } else if (trimmed === "fetch core_intro" || trimmed === "core_intro" || trimmed === "intro") {
      restoreWindow("coreIntro");
      focusWindow("coreIntro");
      output = (
        <span className="text-onedark-purple">
          [OK] Restoring CoreIntro identity module.
        </span>
      );
    } else if (
      trimmed === "cat resume.pdf" ||
      trimmed === "resume" ||
      trimmed === "open resume" ||
      trimmed === "./resume" ||
      trimmed === "cv"
    ) {
      restoreWindow("resumeViewer");
      focusWindow("resumeViewer");
      output = (
        <span className="text-onedark-yellow">
          [OK] Spawning ResumeViewer window (typst/pdf renderer attached).
        </span>
      );
    } else if (
      trimmed === "feh" ||
      trimmed === "nsxiv" ||
      trimmed === "./gallery" ||
      trimmed === "gallery" ||
      trimmed === "open gallery"
    ) {
      restoreWindow("galleryViewer");
      focusWindow("galleryViewer");
      output = (
        <span className="text-onedark-purple">
          [OK] Launching Feh/Nsxiv Image Gallery (public/gallery/ buffer loaded).
        </span>
      );
    } else if (
      trimmed === "./pixel_engine" ||
      trimmed === "pixel" ||
      trimmed === "pixel_engine" ||
      trimmed === "draw" ||
      trimmed === "canvas"
    ) {
      restoreWindow("pixelEngine");
      focusWindow("pixelEngine");
      output = (
        <span style={{ color: activeTheme.accent }}>
          [OK] Initializing PixelEngine hardware canvas (2D/3D Voxel buffer attached).
        </span>
      );
    } else if (
      trimmed === "./field_journal" ||
      trimmed === "field" ||
      trimmed === "journal" ||
      trimmed === "rajasthan" ||
      trimmed === "fellow"
    ) {
      restoreWindow("fieldJournal");
      focusWindow("fieldJournal");
      output = (
        <span className="text-amber-400">
          [OK] Loading Rajasthan Field Journal & Grassroots Dispatches (India Fellow residency buffer).
        </span>
      );
    } else if (
      trimmed === "./learnability" ||
      trimmed === "learn" ||
      trimmed === "aarohi" ||
      trimmed === "diagnostics" ||
      trimmed === "fieldlab"
    ) {
      restoreWindow("learnabilityLab");
      focusWindow("learnabilityLab");
      output = (
        <span className="text-cyan-400">
          [OK] Mounting Aarohi Bal Sansar Learnability Lab (Rural school inquiry diagnostics & curiosity cliff analysis).
        </span>
      );
    } else if (
      trimmed === "./change_wallpaper" ||
      trimmed === "wallpaper" ||
      trimmed === "bg" ||
      trimmed === "./wallpaper"
    ) {
      restoreWindow("wallpaperManager");
      focusWindow("wallpaperManager");
      output = (
        <span className="text-pink-400">
          [OK] Opening WallpaperManager (Unsplash CDN presets & custom URLs).
        </span>
      );
    } else if (
      trimmed === "./note" ||
      trimmed === "note" ||
      trimmed === "scratchpad" ||
      trimmed === "sticky" ||
      trimmed === "memo"
    ) {
      toggleStickyNote();
      output = (
        <span className="text-amber-400">
          [OK] Toggling Visitor Scratchpad / Pinned Sticky Note on desktop.
        </span>
      );
    } else if (
      trimmed === "hyprlock" ||
      trimmed === "lock" ||
      trimmed === "./lock" ||
      trimmed === "logout"
    ) {
      lockSession();
      output = (
        <span className="text-yellow-400">
          [OK] Locking desktop session (Hyprlock display manager active).
        </span>
      );
    } else if (
      trimmed === "snake" ||
      trimmed === "life" ||
      trimmed === "sand" ||
      trimmed === "game" ||
      trimmed === "arcade"
    ) {
      restoreWindow("pixelEngine");
      focusWindow("pixelEngine");
      output = (
        <span style={{ color: activeTheme.accent }}>
          [OK] Launching PixelEngine Mini-Games Deck ({trimmed.toUpperCase()} mode).
        </span>
      );
    } else if (lowerCmd.startsWith("theme")) {
      const parts = trimmed.split(" ").filter(Boolean);
      if (parts.length === 1 || parts[1] === "list") {
        output = (
          <div className="space-y-1.5 text-xs py-1">
            <div className="text-onedark-muted font-bold mb-1">
              Available Linux Desktop Themes:
            </div>
            {Object.values(OS_THEMES).map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span
                  className={`font-semibold ${
                    t.id === currentThemeId ? "underline font-bold" : ""
                  }`}
                  style={{ color: t.accent }}
                >
                  {t.id.padEnd(14, " ")}
                </span>
                <span className="text-onedark-muted">- {t.label}</span>
                {t.id === currentThemeId && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-onedark-surface text-onedark-yellow font-bold">
                    [ACTIVE]
                  </span>
                )}
              </div>
            ))}
            <div className="text-[11px] text-onedark-muted mt-2 pt-1 border-t border-onedark-borderMuted">
              Usage: <span className="text-onedark-yellow">theme &lt;name&gt;</span> (e.g. <span className="text-onedark-cyan">theme caelestia</span>, <span className="text-onedark-cyan">theme matrix</span>, <span className="text-onedark-cyan">theme light</span>) | <span className="text-onedark-yellow">theme next</span>
            </div>
          </div>
        );
      } else if (parts[1] === "next") {
        nextTheme();
        output = (
          <span style={{ color: activeTheme.accent }}>
            [OK] Cycled to next theme.
          </span>
        );
      } else if (parts[1] === "toggle" || parts[1] === "mode") {
        toggleDarkLight();
        output = (
          <span style={{ color: activeTheme.accent }}>
            [OK] Toggled dark/light mode.
          </span>
        );
      } else {
        const themeId = parts[1].toLowerCase() as OSThemeId;
        if (OS_THEMES[themeId]) {
          setTheme(themeId);
          const newTheme = OS_THEMES[themeId];
          output = (
            <span style={{ color: newTheme.accent }}>
              [OK] Applied theme: {newTheme.icon} {newTheme.label}
            </span>
          );
        } else {
          output = (
            <span className="text-onedark-red">
              Unknown theme &apos;{parts[1]}&apos;. Run &apos;theme list&apos; for available themes.
            </span>
          );
        }
      }
    } else if (trimmed === "help") {
      output = (
        <div className="space-y-1 text-onedark-text">
          <div>Available commands:</div>
          <div>  <span className="text-onedark-yellow">./pixel_engine</span>      - Open PixelEngine (2D/3D Voxel Canvas)</div>
          <div>  <span className="text-onedark-yellow">snake | life | sand</span> - Launch Pixel Mini-Games (Snake, Conway Life, Sand)</div>
          <div>  <span className="text-onedark-yellow">note | scratchpad</span>   - Toggle Visitor Scratchpad / Pinned Sticky Note</div>
          <div>  <span className="text-onedark-yellow">hyprlock | lock</span>     - Lock Session (Hyprland Boot & Login Screen)</div>
          <div>  <span className="text-onedark-yellow">wallpaper | bg</span>      - Open Wallpaper Manager (Unsplash CDN & Custom URLs)</div>
          <div>  <span className="text-onedark-yellow">field | journal</span>     - Open Rural Field Journal (Aarohi & India Fellow)</div>
          <div>  <span className="text-onedark-yellow">learn | aarohi</span>      - Open Learnability Lab (School inquiry diagnostics)</div>
          <div>  <span className="text-onedark-yellow">cat resume.pdf</span>      - Open ResumeViewer (CV & Experience)</div>
          <div>  <span className="text-onedark-yellow">feh</span>                   - Open Feh/Nsxiv Image Gallery (public/gallery/)</div>
          <div>  <span className="text-onedark-yellow">theme &lt;name&gt;</span>        - Switch OS theme (noctalia, caelestia, tokyo-night, catppuccin, matrix, onedark, light)</div>
          <div>  <span className="text-onedark-yellow">theme next</span>          - Cycle to next theme</div>
          <div>  <span className="text-onedark-yellow">theme list</span>          - List all available Linux shell themes</div>
          <div>  <span className="text-onedark-yellow">cat poetry.txt</span>      - Open ArchiveReader (Vim editor)</div>
          <div>  <span className="text-onedark-yellow">./play_latest_match</span>  - Open StreamFeed (MPV player)</div>
          <div>  <span className="text-onedark-yellow">fetch core_intro</span>     - Restore CoreIntro identity module</div>
          <div>  <span className="text-onedark-yellow">ls</span>                   - List virtual directory contents</div>
          <div>  <span className="text-onedark-yellow">clear</span>                - Clear shell buffer</div>
          <div>  <span className="text-onedark-yellow">whoami</span>               - Print author identity</div>
          <div>  <span className="text-onedark-yellow">neofetch</span>             - Display riced system telemetry</div>
        </div>
      );
    } else if (trimmed === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (trimmed === "ls") {
      output = (
        <div className="flex flex-wrap gap-4 text-onedark-text">
          <span className="text-onedark-blue font-bold">content/</span>
          <span className="text-onedark-purple font-bold">gallery/</span>
          <span className="text-amber-400 font-bold">note.txt</span>
          <span className="text-onedark-yellow font-bold">Aditya_Diundi_Resume.pdf</span>
          <span className="text-onedark-yellow">CoreIntro.tsx</span>
          <span style={{ color: activeTheme.accent }} className="font-bold">pixel_engine*</span>
          <span className="text-pink-400 font-bold">change_wallpaper*</span>
          <span className="text-onedark-purple font-bold">play_latest_match*</span>
          <span className="text-onedark-cyan">theme.config</span>
        </div>
      );
    } else if (trimmed === "whoami") {
      output = (
        <div className="text-onedark-text">
          aditya // Design Engineer & System Architect. Writing bilingual stories & tactile software.
        </div>
      );
    } else if (trimmed === "neofetch") {
      output = (
        <div className="grid grid-cols-2 gap-4 my-2 text-xs">
          <div style={{ color: activeTheme.accent }} className="leading-tight select-none">
            {`       /\\
      /  \\
     /\\   \\
    /      \\
   /   ,,   \\
  /   |  |  -\\
 /_-''    ''-_\\`}
          </div>
          <div className="space-y-0.5">
            <div><span style={{ color: activeTheme.accent }} className="font-bold">aditya</span>@<span style={{ color: activeTheme.accent }} className="font-bold">{activeTheme.shellName}</span></div>
            <div className="text-onedark-border">-----------------------</div>
            <div><span className="text-onedark-yellow">OS:</span> {activeTheme.name} Linux x86_64</div>
            <div><span className="text-onedark-yellow">Host:</span> Riced Custom ThinkPad</div>
            <div><span className="text-onedark-yellow">Kernel:</span> 6.11.0-zen1-1-zen</div>
            <div><span className="text-onedark-yellow">Uptime:</span> 4 years, 3 products</div>
            <div><span className="text-onedark-yellow">WM:</span> Noctalia-TWM</div>
            <div><span className="text-onedark-yellow">Theme:</span> {activeTheme.label}</div>
            <div><span className="text-onedark-yellow">Terminal:</span> Kitty // Alacritty</div>
          </div>
        </div>
      );
    } else {
      output = (
        <span className="text-onedark-red">
          zsh: command not found: {trimmed}. Type &apos;help&apos; for list of commands.
        </span>
      );
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
    }
  };

  const chips = [
    {
      label: "resume",
      action: "resume",
      desc: "Open Resume",
      accent: activeTheme.isDark ? "#eab308" : "#b45309",
      icon: <FileText className="w-3 h-3 mr-1" />,
    },
    {
      label: "theme next",
      action: "theme next",
      desc: "Cycle Theme",
      accent: activeTheme.isDark ? "#c084fc" : "#7c3aed",
      icon: <Palette className="w-3 h-3 mr-1" />,
    },
    {
      label: "poetry",
      action: "poetry",
      desc: "Open Poetry Archive",
      accent: activeTheme.isDark ? "#34d399" : "#059669",
      icon: null,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[900] flex flex-col font-mono select-none">
      {/* Expanded Terminal Panel */}
      {isExpanded && (
        <div
          ref={scrollRef}
          style={{
            backgroundColor: activeTheme.terminalBg,
            borderColor: activeTheme.terminalBorder,
          }}
          className="h-64 border-t border-l border-r mx-2 md:mx-4 rounded-t-lg p-3 overflow-y-auto shadow-2xl backdrop-blur-md select-text"
        >
          {history.map((item, idx) => (
            <div key={idx} className="mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span style={{ color: activeTheme.accent }} className="font-bold">
                  aditya@{activeTheme.shellName}
                </span>
                <span style={{ color: activeTheme.textMuted }}>:</span>
                <span style={{ color: activeTheme.accent }} className="font-bold">~</span>
                <span style={{ color: activeTheme.textMuted }}>$</span>
                <span style={{ color: activeTheme.textPrimary }}>{item.command}</span>
              </div>
              <div className="mt-1 ml-4">{item.output}</div>
            </div>
          ))}
        </div>
      )}

      {/* Minimized Dock / Shell Bar Anchored to Bottom */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-10 border-t px-3 md:px-4 flex items-center justify-between shadow-lg backdrop-blur-md"
      >
        {/* Left: Shell prompt & interactive input */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse shell" : "Expand shell"}
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border transition-colors flex-shrink-0"
          >
            <Terminal className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
            <span className="hidden sm:inline font-semibold">SHELL</span>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 opacity-60" />
            ) : (
              <ChevronUp className="w-3 h-3 opacity-60" />
            )}
          </button>

          {/* Prompt */}
          <div className="flex items-center gap-1.5 text-xs flex-1 truncate" style={{ color: activeTheme.textMuted }}>
            <span style={{ color: activeTheme.accent }} className="font-bold hidden sm:inline">
              aditya@{activeTheme.shellName}
            </span>
            <span className="hidden sm:inline" style={{ color: activeTheme.textMuted }}>:</span>
            <span style={{ color: activeTheme.accent }} className="font-bold hidden sm:inline">~</span>
            <span style={{ color: activeTheme.textMuted }} className="font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type command or click chip..."
              style={{ color: activeTheme.textPrimary }}
              className="bg-transparent border-none outline-none placeholder:opacity-50 text-xs w-full font-mono select-text"
            />
          </div>
        </div>

        {/* Right: Quick Chips (pixel, theme, cat poetry, stream, intro) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2 overflow-x-auto">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                executeCommand(chip.action);
              }}
              title={chip.desc}
              style={{
                backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="px-2 py-0.5 rounded text-[11px] border font-mono tracking-tight transition-all hover:scale-[1.02] active:scale-95 shadow-sm flex items-center group cursor-pointer"
            >
              {chip.icon && (
                <span style={{ color: chip.accent }} className="transition-transform group-hover:scale-110">
                  {chip.icon}
                </span>
              )}
              <span className="group-hover:opacity-100 opacity-90">{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
