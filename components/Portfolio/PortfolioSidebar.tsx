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
    { id: "all", label: "All Items", icon: Layers, count: "27" },
    { id: "work", label: "Selected Works", icon: Sparkles, count: "8" },
    { id: "essays", label: "Writeups & Notes", icon: BookOpen, count: "12" },
    { id: "youtube", label: "YouTube Streams", icon: PlaySquare, count: "7" },
    { id: "resume", label: "Experience & Specs", icon: Briefcase, count: "5" },
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
      <aside
        className={`hidden lg:flex w-80 xl:w-84 flex-shrink-0 sticky top-0 self-start h-screen max-h-screen border-r p-6 sm:p-7 xl:p-8 flex-col justify-between z-30 overflow-y-auto transition-colors ${
          isDark
            ? "bg-[#0b0d13]/95 border-zinc-800 text-zinc-100"
            : "bg-[#FBFBF9]/95 border-stone-200 text-stone-900"
        }`}
      >
        {/* Top Identity & Above-The-Fold Conversion Block */}
        <div className="space-y-5">
          {/* Profile Avatar & Title */}
          <div className="flex items-center gap-3.5">
            <div
              className={`relative w-12 h-12 rounded-full overflow-hidden border flex-shrink-0 shadow-md ${
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
                className={`font-sans font-bold text-lg tracking-tight ${
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
                Product Designer
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
            className={`flex items-center gap-2 text-xs font-mono ${
              isDark ? "text-zinc-400" : "text-stone-600"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Delhi NCR · Bangalore</span>
            <span className={isDark ? "text-zinc-600" : "text-stone-300"}>·</span>
            <span className="text-emerald-500 font-medium">Available</span>
          </div>

          {/* Systems Statement Bio */}
          <p
            className={`text-xs font-sans leading-relaxed ${
              isDark ? "text-zinc-400" : "text-stone-600"
            }`}
          >
            Bridging engineering depth from IIIT Delhi, grassroots ethnography, and systems craft to build straightforward software.
          </p>

          {/* Above-The-Fold High-Contrast Conversion Path for Recruiters */}
          <div className="space-y-2 pt-1 pb-1">
            <div className="flex flex-col gap-2 font-mono text-xs">
              {/* 1. Primary Resume Button */}
              <a
                href="/Aditya_Diundi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group/cta shadow-sm ${
                  isDark
                    ? "bg-white hover:bg-zinc-200 text-zinc-950"
                    : "bg-stone-900 hover:bg-black text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>View Resume (PDF)</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ml-auto font-medium ${
                    isDark ? "bg-zinc-200 text-zinc-800" : "bg-stone-800 text-stone-200"
                  }`}
                >
                  1.2MB
                </span>
              </a>

              {/* 2. Dual Connect Row: LinkedIn & Copy Email */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.linkedin.com/in/adityadiundi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 px-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? "border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/40 text-blue-300"
                      : "border-blue-600/30 bg-blue-50 hover:bg-blue-100 text-blue-700"
                  }`}
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`py-2 px-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    copiedEmail
                      ? isDark
                        ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                        : "border-emerald-600 bg-emerald-100 text-emerald-800"
                      : isDark
                      ? "border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300"
                      : "border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feed Section Toggles */}
          <div
            className={`space-y-2 pt-3 border-t ${
              isDark ? "border-zinc-800/80" : "border-stone-200"
            }`}
          >
            <div
              className={`text-[10px] font-mono uppercase tracking-wider pb-1 ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              Site Architecture
            </div>
            <div className="space-y-1">
              {feedToggles.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectFilter(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-zinc-100 text-zinc-950 font-semibold shadow-sm"
                          : "bg-stone-900 text-white font-semibold shadow-sm"
                        : isDark
                        ? "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? isDark
                            ? "bg-zinc-200 text-zinc-900"
                            : "bg-stone-800 text-white"
                          : isDark
                          ? "bg-zinc-900 text-zinc-500"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions & Controls */}
        <div
          className={`space-y-4 pt-6 mt-6 border-t ${
            isDark ? "border-zinc-800/80" : "border-stone-200"
          }`}
        >
          {/* Launch adityaos Terminal Engine */}
          <button
            onClick={onLaunchOS}
            className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-mono ${
              isDark
                ? "border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-300"
                : "border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Launch adityaos Shell</span>
          </button>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border font-mono text-[11px] cursor-pointer transition-colors ${
                isDark
                  ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300"
                  : "border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-800"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Palette className="w-3 h-3 text-zinc-400" />
                <span className={isDark ? "text-zinc-500" : "text-stone-500"}>Theme:</span>
                <span className={`font-medium ${isDark ? "text-zinc-200" : "text-stone-900"}`}>
                  {themeOptions.find((t) => t.id === currentThemeId)?.label.split(" ")[0] || "Editorial"}
                </span>
              </div>
              <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-stone-500"}`}>
                Switch
              </span>
            </button>

            {themeDropdownOpen && (
              <div
                className={`absolute bottom-full mb-1.5 left-0 right-0 rounded-lg p-1 border shadow-2xl backdrop-blur-2xl z-50 text-xs font-mono ${
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

          {/* Social Links & Email */}
          <div
            className={`flex items-center justify-between text-xs font-mono pt-0.5 ${
              isDark ? "text-zinc-400" : "text-stone-500"
            }`}
          >
            <a
              href="https://www.linkedin.com/in/adityadiundi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors p-1 hover:text-blue-500`}
              title="LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/AdityaDiundi"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors p-1 ${isDark ? "hover:text-white" : "hover:text-stone-900"}`}
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com/@falsepeek"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors p-1"
              title="YouTube @falsepeek"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://diundi.bearblog.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-500 transition-colors p-1"
              title="Bear Blog"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:aditya15124@iiitd.ac.in"
              className="hover:text-emerald-500 transition-colors p-1"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
