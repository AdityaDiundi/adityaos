"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Terminal,
  FileText,
  Mail,
  Github,
  Youtube,
  Globe,
  Palette,
  Check,
  Copy,
  Layers,
  BookOpen,
  Briefcase,
  PlaySquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useThemeStore, OSThemeId } from "@/store/themeStore";

interface PortfolioSidebarProps {
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
  onLaunchOS: () => void;
}

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

export function PortfolioSidebar({
  activeFilter,
  onSelectFilter,
  onLaunchOS,
}: PortfolioSidebarProps) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { currentThemeId, setTheme, activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("aditya15124@iiitd.ac.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const feedToggles = [
    { id: "all", prefix: "00", label: "All Modules", count: "27" },
    { id: "work", prefix: "01", label: "Shipped Systems", count: "7" },
    { id: "essays", prefix: "02", label: "Fieldwork & Essays", count: "14" },
    { id: "youtube", prefix: "03", label: "Watch Games", count: "20" },
    { id: "resume", prefix: "04", label: "Experience & Specs", count: "5" },
  ];

  const themeOptions: { id: OSThemeId; label: string; tag: string }[] = [
    { id: "light", label: "Editorial Newspaper", tag: "Light" },
    { id: "noctalia", label: "Obsidian Void", tag: "Dark" },
    { id: "caelestia", label: "Nordic Frost", tag: "Slate" },
    { id: "matrix", label: "Terminal Mono", tag: "Phosphor" },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. Mobile Compact Header (Screens < 1024px — Eliminates Scroll Debt) */}
      {/* ========================================================================= */}
      <header
        className={`lg:hidden w-full sticky top-0 z-40 border-b px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl transition-colors ${
          isDark
            ? "bg-[#0b0d13]/90 border-zinc-800 text-zinc-100"
            : "bg-[#FBFBF9]/90 border-stone-200 text-stone-900"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0 ${
              isDark ? "border-zinc-700" : "border-stone-300"
            }`}
          >
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs sm:text-sm tracking-tight truncate">
              Aditya Diundi
            </div>
            <div
              className={`text-[10px] font-mono truncate ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              Product Designer & Design Technologist
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-xs">
          <a
            href="/Aditya_Diundi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all ${
              isDark ? "bg-white text-zinc-950" : "bg-stone-900 text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
          <a
            href="https://www.linkedin.com/in/adityadiundi/"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isDark
                ? "border-blue-500/30 bg-blue-950/20 text-blue-300"
                : "border-blue-600/30 bg-blue-50 text-blue-700"
            }`}
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              copiedEmail
                ? isDark
                  ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                  : "border-emerald-600 bg-emerald-100 text-emerald-800"
                : isDark
                ? "border-zinc-800 bg-zinc-900 text-zinc-300"
                : "border-stone-200 bg-stone-100 text-stone-700"
            }`}
            title="Copy email to clipboard"
          >
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. Desktop Full Sticky Sidebar (Screens >= 1024px) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. Desktop Full Sticky Sidebar (Screens >= 1024px) — Concept 3 Minimalist */}
      {/* ========================================================================= */}
      <aside
        className={`hidden lg:flex w-64 xl:w-72 flex-shrink-0 sticky top-0 self-start h-screen max-h-screen border-r border-dashed p-6 flex-col justify-between z-30 overflow-y-auto transition-colors ${
          isDark
            ? "bg-[#0b0d13]/95 border-zinc-800/80 text-zinc-100"
            : "bg-[#FBFBF9]/95 border-stone-200/80 text-stone-900"
        }`}
      >
        {/* Top Identity & Navigation Block */}
        <div className="space-y-4">
          {/* Profile Avatar & Title */}
          <div className="flex items-center gap-3">
            <div
              className={`relative w-10 h-10 rounded-full overflow-hidden border flex-shrink-0 ${
                isDark ? "border-zinc-700" : "border-stone-300"
              }`}
            >
              <Image
                src="/aditya_avatar_sq.jpg"
                alt="Aditya Diundi"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1
                className={`font-sans font-bold text-base tracking-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Aditya Diundi
              </h1>
              <p
                className={`text-xs font-mono font-medium ${
                  isDark ? "text-cyan-400" : "text-cyan-700"
                }`}
              >
                Product Designer & Design Technologist
              </p>
              <p
                className={`text-[11px] font-mono opacity-70 ${
                  isDark ? "text-zinc-400" : "text-stone-500"
                }`}
              >
                IIIT Delhi · B.Tech ECE
              </p>
            </div>
          </div>

          {/* Location & Status */}
          <div
            className={`flex items-center gap-1.5 text-xs font-mono ${
              isDark ? "text-zinc-400" : "text-stone-500"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Delhi NCR</span>
            <span className="opacity-40">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Full-Time Available</span>
          </div>

          {/* Systems Statement Bio */}
          <p
            className={`text-xs sm:text-[13px] font-sans leading-relaxed ${
              isDark ? "text-zinc-300" : "text-stone-700"
            }`}
          >
            Design technologist & systems engineer. Next.js, React, Web Audio, canvas engines. 20mo grassroots field research + zero-to-one product architectures.
          </p>

          {/* Clean Monospace Action Row (No heavy container boxes) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono pt-1">
            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`whitespace-nowrap font-semibold transition-colors hover:underline ${
                isDark ? "text-white hover:text-cyan-300" : "text-stone-900 hover:text-cyan-800"
              }`}
            >
              Resume ↗
            </a>
            <span className="opacity-30">·</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`whitespace-nowrap transition-colors hover:underline cursor-pointer ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
              }`}
            >
              {copiedEmail ? (
                <span className="text-emerald-500 font-bold">Copied!</span>
              ) : (
                "Email"
              )}
            </button>
            <span className="opacity-30">·</span>
            <a
              href="https://www.linkedin.com/in/adityadiundi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`whitespace-nowrap transition-colors hover:underline ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
              }`}
            >
              LinkedIn ↗
            </a>
            <span className="opacity-30">·</span>
            <a
              href="https://github.com/AdityaDiundi"
              target="_blank"
              rel="noopener noreferrer"
              className={`whitespace-nowrap transition-colors hover:underline ${
                isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
              }`}
            >
              GitHub ↗
            </a>
          </div>

          {/* Feed Section Toggles (Pure typographical index) */}
          <div
            className={`space-y-2 pt-5 border-t border-dashed ${
              isDark ? "border-zinc-800/80" : "border-stone-200/80"
            }`}
          >
            <div
              className={`text-[10px] font-mono uppercase tracking-widest ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              System Index
            </div>
            <nav className="space-y-0.5">
              {feedToggles.map((item) => {
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectFilter(item.id)}
                    className={`w-full flex items-center justify-between py-1 text-xs font-mono transition-all cursor-pointer text-left ${
                      isActive
                        ? isDark
                          ? "text-cyan-400 font-semibold"
                          : "text-stone-950 font-bold"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono transition-colors ${
                          isActive
                            ? isDark
                              ? "text-cyan-400 font-bold"
                              : "text-stone-950 font-bold"
                            : "opacity-40"
                        }`}
                      >
                        {item.prefix}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-40">
                      ({item.count})
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Unified Minimal Footer & Runtime Strip (Single-line hierarchy) */}
        <div
          className={`space-y-2 pt-4 mt-4 border-t border-dashed ${
            isDark ? "border-zinc-800/80" : "border-stone-200/80"
          }`}
        >
          {/* Launch adityaos Terminal Trigger */}
          <button
            onClick={onLaunchOS}
            className={`w-full py-1 flex items-center justify-between text-xs font-mono transition-colors cursor-pointer group ${
              isDark
                ? "text-zinc-400 hover:text-cyan-400"
                : "text-stone-600 hover:text-cyan-700"
            }`}
            title="Launch interactive adityaos desktop sandbox"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-cyan-500 font-bold">&gt;_</span>
              <span>adityaos</span>
              <span className="text-[10px] opacity-40 font-normal">[sandbox]</span>
            </span>
            <span className="text-xs opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              ↵
            </span>
          </button>

          {/* Theme Switcher & Secondary Channels (Single clean horizontal row) */}
          <div
            className={`flex items-center justify-between text-[11px] font-mono pt-1 ${
              isDark ? "text-zinc-500" : "text-stone-500"
            }`}
          >
            {/* Theme Trigger */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className={`flex items-center gap-1 hover:underline cursor-pointer transition-colors ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>theme:</span>
                <span className={`font-medium ${isDark ? "text-zinc-300" : "text-stone-800"}`}>
                  {themeOptions.find((t) => t.id === currentThemeId)?.label.split(" ")[0].toLowerCase() || "editorial"}
                </span>
                <span className="opacity-40">▾</span>
              </button>

              {themeDropdownOpen && (
                <div
                  className={`absolute bottom-full mb-2 left-0 w-44 rounded-lg p-1 border shadow-2xl backdrop-blur-2xl z-50 text-xs font-mono ${
                    isDark
                      ? "border-zinc-800 bg-[#090b10] text-zinc-300"
                      : "border-stone-200 bg-white text-stone-800"
                  }`}
                >
                  {themeOptions.map((opt) => {
                    const isSelected = currentThemeId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer text-[11px] ${
                          isSelected
                            ? isDark
                              ? "bg-zinc-800 text-white font-medium"
                              : "bg-stone-100 text-stone-900 font-semibold"
                            : isDark
                            ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Micro presence links */}
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com/@falsepeek"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline transition-colors ${
                  isDark ? "hover:text-zinc-200" : "hover:text-stone-900"
                }`}
                title="YouTube @falsepeek"
              >
                yt ↗
              </a>
              <span className="opacity-30">·</span>
              <a
                href="https://diundi.bearblog.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline transition-colors ${
                  isDark ? "hover:text-zinc-200" : "hover:text-stone-900"
                }`}
                title="Bear Blog"
              >
                blog ↗
              </a>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}
