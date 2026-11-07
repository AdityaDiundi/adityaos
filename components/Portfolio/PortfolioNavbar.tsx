"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Terminal, Sparkles, Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";

interface PortfolioNavbarProps {
  onLaunchOS: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function PortfolioNavbar({ onLaunchOS, onNavigateSection }: PortfolioNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Work", target: "work" },
    { label: "Research", target: "research" },
    { label: "Essays", target: "essays" },
    { label: "Resume", target: "resume" },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-full bg-[#0a0c10]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Brand / Profile */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400/30 flex-shrink-0">
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans font-medium text-sm text-zinc-100 tracking-tight">
                Aditya Diundi
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Product Designer & Systems Thinker
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="px-3.5 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Launch adityaos Button */}
          <button
            onClick={onLaunchOS}
            className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/30 hover:border-cyan-400/70 text-cyan-300 text-xs font-mono transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer"
            title="Launch adityaos TWM desktop sandbox"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Launch</span>
            <span className="font-semibold text-white">adityaos</span>
            <span className="text-[10px] opacity-75 font-mono px-1 py-0.2 rounded bg-cyan-400/20">OS</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm px-4 py-3 rounded-2xl bg-[#0e1117]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-2 font-mono text-sm">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-left px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Immediately Available
            </span>
            <button
              onClick={onLaunchOS}
              className="text-cyan-400 font-semibold flex items-center gap-1 hover:underline"
            >
              Enter OS <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
