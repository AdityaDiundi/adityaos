"use client";

import React from "react";
import { Terminal, Github, Youtube, Mail, ArrowUp, Globe } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioFooterProps {
  onLaunchOS: () => void;
}

export function PortfolioFooter({ onLaunchOS }: PortfolioFooterProps) {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`relative text-xs font-mono transition-colors ${
        isDark ? "bg-[#090b10] text-zinc-500" : "bg-[#FAF7F2] text-stone-500"
      }`}
    >
      <div
        className={`w-full border-b border-solid border-stone-200/60 dark:border-zinc-800/60 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative transition-colors ${
          isDark ? "border-zinc-800/80" : "border-stone-200/80"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div
            className={`font-sans font-medium text-sm ${
              isDark ? "text-zinc-200" : "text-stone-900"
            }`}
          >
            Aditya Diundi
          </div>
          <span
            className={`hidden sm:inline ${
              isDark ? "text-zinc-700" : "text-stone-300"
            }`}
          >
            ·
          </span>
          <div className={isDark ? "text-zinc-400" : "text-stone-600"}>
            Delhi, India
          </div>
        </div>

        {/* Links */}
        <div
          className={`flex flex-wrap items-center justify-center gap-5 ${
            isDark ? "text-zinc-400" : "text-stone-600"
          }`}
        >
          <a
            href="https://github.com/AdityaDiundi"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors flex items-center gap-1.5 ${
              isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors flex items-center gap-1.5 ${
              isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </a>
          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors flex items-center gap-1.5 ${
              isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bear Blog</span>
          </a>
          <a
            href="mailto:aditya15124@iiitd.ac.in"
            className={`transition-colors flex items-center gap-1.5 ${
              isDark ? "hover:text-white" : "hover:text-black"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchOS}
            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300"
                : "border-stone-200 hover:border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800"
            }`}
          >
            <Terminal className="w-3 h-3 text-cyan-500" />
            <span>adityaos Shell</span>
          </button>

          <button
            onClick={scrollToTop}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isDark
                ? "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                : "border-stone-200 hover:border-stone-300 hover:bg-stone-100 text-stone-600 hover:text-stone-900"
            }`}
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
