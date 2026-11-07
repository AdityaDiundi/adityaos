"use client";

import React from "react";
import { Terminal, Github, Youtube, Mail, ArrowUp, Globe } from "lucide-react";

interface PortfolioFooterProps {
  onLaunchOS: () => void;
}

export function PortfolioFooter({ onLaunchOS }: PortfolioFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-zinc-950 text-xs font-mono text-zinc-500 pb-16">
      <div className="max-w-7xl mx-auto border-x border-b border-zinc-800 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <span className="absolute -bottom-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
        <span className="absolute -bottom-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="text-zinc-200 font-sans font-medium text-sm">
            Aditya Diundi
          </div>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <div className="text-zinc-400">Delhi, India</div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-zinc-400">
          <a
            href="https://github.com/AdityaDiundi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </a>
          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bear Blog</span>
          </a>
          <a
            href="mailto:aditya15124@iiitd.ac.in"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchOS}
            className="px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3 h-3 text-zinc-400" />
            <span>Launch OS</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-1.5 rounded border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
