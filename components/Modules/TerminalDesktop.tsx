"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, ChevronUp, ChevronDown } from "lucide-react";
import { useOSStore } from "@/store/osStore";

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalDesktop: React.FC = () => {
  const { restoreWindow, focusWindow } = useOSStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("");
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: "noctalia --init",
      output: (
        <span className="text-onedark-muted">
          Noctalia Shell v2.4 (x86_64-linux-gnu). Type <span className="text-onedark-yellow font-bold">help</span> or click Quick Chips below.
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

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    if (trimmed === "cat poetry.txt" || trimmed === "open archive" || trimmed === "archive") {
      restoreWindow("archiveReader");
      focusWindow("archiveReader");
      output = (
        <span className="text-onedark-green">
          [OK] Spawning ArchiveReader window (Vim/Nano buffer attached).
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
    } else if (trimmed === "help") {
      output = (
        <div className="space-y-1 text-onedark-text">
          <div>Available commands:</div>
          <div>  <span className="text-onedark-yellow">cat poetry.txt</span>      - Open ArchiveReader (Vim editor)</div>
          <div>  <span className="text-onedark-yellow">./play_latest_match</span>  - Open StreamFeed (MPV player)</div>
          <div>  <span className="text-onedark-yellow">fetch core_intro</span>     - Restore CoreIntro module</div>
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
        <div className="flex gap-4 text-onedark-text">
          <span className="text-onedark-blue font-bold">essays/</span>
          <span className="text-onedark-green font-bold">poetry/</span>
          <span className="text-onedark-yellow">CoreIntro.tsx</span>
          <span className="text-onedark-purple font-bold">play_latest_match*</span>
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
          <div className="text-onedark-blue leading-tight select-none">
            {`       /\\
      /  \\
     /\\   \\
    /      \\
   /   ,,   \\
  /   |  |  -\\
 /_-''    ''-_\\`}
          </div>
          <div className="space-y-0.5">
            <div><span className="text-onedark-blue font-bold">aditya</span>@<span className="text-onedark-blue font-bold">noctalia-shell</span></div>
            <div className="text-onedark-border">-----------------------</div>
            <div><span className="text-onedark-yellow">OS:</span> Noctalia Linux x86_64</div>
            <div><span className="text-onedark-yellow">Host:</span> Riced Custom ThinkPad</div>
            <div><span className="text-onedark-yellow">Kernel:</span> 6.11.0-zen1-1-zen</div>
            <div><span className="text-onedark-yellow">Uptime:</span> 4 years, 3 products</div>
            <div><span className="text-onedark-yellow">WM:</span> Noctalia-TWM</div>
            <div><span className="text-onedark-yellow">Theme:</span> OneDark Minimal</div>
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
      label: "cat poetry.txt",
      action: "cat poetry.txt",
      desc: "Open Archive",
      color: "text-onedark-green border-onedark-green/40 hover:bg-onedark-green/10",
    },
    {
      label: "./play_latest_match",
      action: "./play_latest_match",
      desc: "Stream Feed",
      color: "text-onedark-blue border-onedark-blue/40 hover:bg-onedark-blue/10",
    },
    {
      label: "fetch core_intro",
      action: "fetch core_intro",
      desc: "Restore Intro",
      color: "text-onedark-purple border-onedark-purple/40 hover:bg-onedark-purple/10",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col font-mono select-none">
      {/* Expanded Terminal Panel */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="h-64 bg-onedark-dark/95 border-t border-l border-r border-onedark-border mx-2 md:mx-4 rounded-t-lg p-3 overflow-y-auto shadow-2xl backdrop-blur-md select-text"
        >
          {history.map((item, idx) => (
            <div key={idx} className="mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-onedark-green font-bold">aditya@noctalia-shell</span>
                <span className="text-onedark-muted">:</span>
                <span className="text-onedark-blue font-bold">~</span>
                <span className="text-onedark-muted">$</span>
                <span className="text-onedark-textBright">{item.command}</span>
              </div>
              <div className="mt-1 ml-4">{item.output}</div>
            </div>
          ))}
        </div>
      )}

      {/* Minimized Dock / Shell Bar Anchored to Bottom */}
      <div className="h-10 bg-onedark-surface/95 border-t border-onedark-border px-3 md:px-4 flex items-center justify-between shadow-lg backdrop-blur-md">
        {/* Left: Shell prompt & interactive input */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse shell" : "Expand shell"}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-onedark-surface2 hover:bg-onedark-borderMuted text-onedark-text text-[11px] border border-onedark-border transition-colors flex-shrink-0"
          >
            <Terminal className="w-3.5 h-3.5 text-onedark-blue" />
            <span className="hidden sm:inline font-semibold">SHELL</span>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-onedark-muted" />
            ) : (
              <ChevronUp className="w-3 h-3 text-onedark-muted" />
            )}
          </button>

          {/* Prompt */}
          <div className="flex items-center gap-1.5 text-xs text-onedark-muted flex-1 truncate">
            <span className="text-onedark-green font-bold hidden sm:inline">aditya@noctalia-shell</span>
            <span className="text-onedark-muted hidden sm:inline">:</span>
            <span className="text-onedark-blue font-bold hidden sm:inline">~</span>
            <span className="text-onedark-muted font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type command or click chip..."
              className="bg-transparent border-none outline-none text-onedark-textBright placeholder:text-onedark-muted/60 text-xs w-full font-mono select-text"
            />
          </div>
        </div>

        {/* Right: Quick Chips (cat poetry.txt, ./play_latest_match, fetch core_intro) */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                executeCommand(chip.action);
              }}
              title={chip.desc}
              className={`px-2 py-0.5 rounded text-[11px] border font-mono tracking-tight transition-all active:scale-95 shadow-chip flex items-center gap-1 ${chip.color}`}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
