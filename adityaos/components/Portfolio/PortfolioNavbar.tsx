"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Terminal, Menu, X, ArrowUpRight } from "lucide-react";

interface PortfolioNavbarProps {
  onLaunchOS: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function PortfolioNavbar({ onLaunchOS, onNavigateSection }: PortfolioNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Selected Work", target: "work" },
    { label: "Field Ethnography", target: "research" },
    { label: "Writing", target: "essays" },
    { label: "Trajectory", target: "resume" },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-full bg-[#0a0c10]/90 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-sans font-medium text-sm text-zinc-100 tracking-tight">
              Aditya Diundi
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-600" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
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
              className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Status Indicator (No Emojis per Taste Skill) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Available for Hire</span>
          </div>

          {/* Launch adityaos Button */}
          <button
            onClick={onLaunchOS}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-zinc-200 text-xs font-mono transition-all duration-200 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            title="Launch adityaos interactive desktop sandbox"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
            <span className="font-medium text-white">adityaos</span>
            <span className="text-[10px] text-zinc-400 font-mono px-1 py-0.2 rounded bg-white/10">TWM</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm px-5 py-4 rounded-2xl bg-[#0c0e14]/98 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2.5 font-mono text-sm">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-left px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Available for Hire
            </span>
            <button
              onClick={onLaunchOS}
              className="text-white font-semibold flex items-center gap-1 hover:underline"
            >
              Launch OS <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
