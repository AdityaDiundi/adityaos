"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Terminal, Menu, X, Palette, Check } from "lucide-react";
import { useThemeStore, OSThemeId } from "@/store/themeStore";

interface PortfolioNavbarProps {
  onLaunchOS: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function PortfolioNavbar({ onLaunchOS, onNavigateSection }: PortfolioNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { currentThemeId, setTheme, activeTheme } = useThemeStore();

  const navLinks = [
    { num: "01", label: "Selected Works", target: "work" },
    { num: "02", label: "Writing & Thought", target: "essays" },
    { num: "03", label: "Trajectory", target: "resume" },
  ];

  const themeOptions: { id: OSThemeId; label: string; tag: string }[] = [
    { id: "noctalia", label: "Obsidian Void", tag: "Dark Luxury" },
    { id: "light", label: "Editorial Paper", tag: "Warm Alabaster" },
    { id: "caelestia", label: "Nordic Frost", tag: "Arctic Slate" },
    { id: "matrix", label: "Terminal Mono", tag: "Phosphor" },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/85 transition-colors duration-300">
      {/* Structural Container Framing (Aligned with Entire Page Grid) */}
      <div className="max-w-7xl mx-auto border-x border-b border-zinc-800 relative flex items-center justify-between text-xs font-mono">
        {/* Drafting Corner Crosshairs */}
        <span className="absolute -bottom-1.5 -left-1.5 text-zinc-600 select-none z-20">+</span>
        <span className="absolute -bottom-1.5 -right-1.5 text-zinc-600 select-none z-20">+</span>

        {/* Left Cell: Identity & Title */}
        <div className="flex items-center gap-3.5 px-6 sm:px-8 py-3.5 border-r border-zinc-800 h-full flex-shrink-0">
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-zinc-100 text-sm tracking-tight">
              Aditya Diundi
            </span>
            <span className="hidden xl:inline text-zinc-700">/</span>
            <span className="hidden xl:inline text-[11px] text-zinc-400">
              Product Designer & Systems Thinker
            </span>
          </div>
        </div>

        {/* Center Cell: Desktop Nav Links (Snapped into Structural Grid) */}
        <nav className="hidden md:flex items-center justify-center gap-1 sm:gap-2 px-4 py-3.5 flex-1">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="px-3.5 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <span className="text-[10px] text-zinc-600">{link.num}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Cell: Theme Selector & OS Launcher */}
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-2.5 border-l border-zinc-800 h-full flex-shrink-0">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer text-xs"
              title="Switch portfolio theme"
            >
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline font-sans text-zinc-400">Theme:</span>
              <span className="font-semibold text-cyan-400">
                {themeOptions.find((t) => t.id === currentThemeId)?.label.split(" ")[0] || "Obsidian"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl p-1.5 border border-zinc-800 bg-zinc-950/98 shadow-2xl backdrop-blur-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-zinc-800/80 mb-1">
                  Palette Options
                </div>
                {themeOptions.map((opt) => {
                  const isSelected = currentThemeId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTheme(opt.id);
                        setThemeDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer hover:bg-zinc-900"
                    >
                      <div>
                        <div className={`font-medium ${isSelected ? "text-cyan-400 font-semibold" : "text-zinc-200"}`}>
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-zinc-500">{opt.tag}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Launch adityaos */}
          <button
            onClick={onLaunchOS}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-300 transition-all cursor-pointer shadow-sm"
            title="Launch adityaos interactive desktop sandbox"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">adityaos</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">TWM</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Snapped to Structural Grid) */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto border-x border-b border-zinc-800 bg-zinc-950/98 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-left py-2 px-3 rounded-md hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="text-[10px] text-zinc-600">{link.num}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800 mt-2 flex items-center justify-between">
            <span className="text-zinc-500">Interactive Environment</span>
            <button
              onClick={() => {
                onLaunchOS();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
            >
              <Terminal className="w-3 h-3" />
              <span>Launch adityaos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
