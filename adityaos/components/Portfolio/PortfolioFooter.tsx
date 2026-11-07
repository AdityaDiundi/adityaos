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
    <footer className="py-12 border-t border-white/10 bg-[#050608] text-xs font-mono text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="text-zinc-300 font-sans font-medium text-sm">
            Aditya Diundi
          </div>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <div>Product Designer & Systems Thinker · Delhi, India</div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href="https://github.com/AdityaDiundi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>@falsepeek</span>
          </a>
          <a
            href="https://diundi.bearblog.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bear Blog</span>
          </a>
          <a
            href="mailto:aditya15124@iiitd.ac.in"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>

        {/* Back to top and OS trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchOS}
            className="px-3 py-1.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 transition-all"
          >
            <Terminal className="w-3 h-3" />
            <span>Open adityaos</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
