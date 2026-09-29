"use client";

import React, { useRef, useState, useEffect } from "react";
import { WindowFrame } from "@/components/System/WindowFrame";
import { CoreIntro } from "@/components/Modules/CoreIntro";
import { ArchiveReader } from "@/components/Modules/ArchiveReader";
import { StreamFeed } from "@/components/Modules/StreamFeed";
import { TerminalDesktop } from "@/components/Modules/TerminalDesktop";
import { useOSStore } from "@/store/osStore";
import {
  Sparkles,
  BookOpen,
  Tv,
  Activity,
  Clock,
  Cpu,
} from "lucide-react";

export default function Home() {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const { openWindows, activeWindow, restoreWindow, focusWindow } = useOSStore();

  const [timeStr, setTimeStr] = useState<string>("12:00:00");
  const [cpuUsage, setCpuUsage] = useState<number>(14);
  const [memUsage, setMemUsage] = useState<number>(38);

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
      className="relative w-screen h-screen overflow-hidden desktop-grid select-none flex flex-col font-mono"
    >
      {/* Top Riced Status Bar */}
      <header className="h-8 bg-onedark-dark/90 border-b border-onedark-border px-3 flex items-center justify-between text-xs z-50 backdrop-blur-md text-onedark-text">
        {/* Left: OS Branding & Workspace Tags */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-onedark-textBright">
            <span className="text-onedark-blue">⟡</span>
            <span>noctalia-os</span>
            <span className="text-[10px] text-onedark-muted font-normal">v2.4</span>
          </div>

          <div className="h-3 w-px bg-onedark-borderMuted" />

          {/* Workspaces */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="px-1.5 py-0.2 rounded bg-onedark-surface border border-onedark-blue/40 text-onedark-blue font-bold">
              [1:SYS]
            </span>
            <span className="px-1.5 py-0.2 rounded text-onedark-muted hover:text-onedark-text cursor-pointer">
              [2:ARCHIVE]
            </span>
            <span className="px-1.5 py-0.2 rounded text-onedark-muted hover:text-onedark-text cursor-pointer">
              [3:MEDIA]
            </span>
          </div>
        </div>

        {/* Center: Active Window Title Tag */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-onedark-muted">
          <span>ACTIVE:</span>
          <span className="px-2 py-0.5 rounded bg-onedark-surface text-onedark-cyan border border-onedark-border font-semibold">
            {activeWindow ? `twm://${activeWindow}` : "twm://root"}
          </span>
        </div>

        {/* Right: Quick Launchers + Hardware Telemetry & Clock */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Quick Taskbar Launchers */}
          <div className="flex items-center gap-1 mr-1">
            <button
              type="button"
              onClick={() => {
                restoreWindow("coreIntro");
                focusWindow("coreIntro");
              }}
              title="Launch CoreIntro"
              className={`p-1 rounded transition-colors ${
                openWindows.includes("coreIntro") && activeWindow === "coreIntro"
                  ? "bg-onedark-surface text-onedark-blue border border-onedark-blue/40"
                  : "text-onedark-muted hover:text-onedark-text"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                restoreWindow("archiveReader");
                focusWindow("archiveReader");
              }}
              title="Launch ArchiveReader"
              className={`p-1 rounded transition-colors ${
                openWindows.includes("archiveReader") && activeWindow === "archiveReader"
                  ? "bg-onedark-surface text-onedark-green border border-onedark-green/40"
                  : "text-onedark-muted hover:text-onedark-text"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                restoreWindow("streamFeed");
                focusWindow("streamFeed");
              }}
              title="Launch StreamFeed"
              className={`p-1 rounded transition-colors ${
                openWindows.includes("streamFeed") && activeWindow === "streamFeed"
                  ? "bg-onedark-surface text-onedark-yellow border border-onedark-yellow/40"
                  : "text-onedark-muted hover:text-onedark-text"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-3 w-px bg-onedark-borderMuted" />

          {/* Telemetry Chips */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-onedark-muted">
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
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-onedark-surface border border-onedark-border text-onedark-textBright font-semibold text-[11px]">
            <Clock className="w-3 h-3 text-onedark-blue" />
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
          defaultPosition={{ x: 60, y: 40 }}
          defaultSize={{ width: 620, height: 480 }}
          dragConstraintsRef={desktopContainerRef}
        >
          <CoreIntro />
        </WindowFrame>

        {/* Module 2: ArchiveReader Window */}
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

        {/* Module 3: StreamFeed Window */}
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
