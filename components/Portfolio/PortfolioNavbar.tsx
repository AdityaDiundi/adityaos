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
    { label: "Works", target: "work" },
    { label: "Writing", target: "essays" },
    { label: "Experience", target: "resume" },
  ];

  const themeOptions: { id: OSThemeId; label: string; tag: string }[] = [
    { id: "noctalia", label: "Obsidian Void", tag: "Dark" },
    { id: "light", label: "Editorial Paper", tag: "Light" },
    { id: "caelestia", label: "Nordic Frost", tag: "Slate" },
    { id: "matrix", label: "Terminal Mono", tag: "Phosphor" },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto border-x border-b border-zinc-800 relative flex items-center justify-between text-xs font-mono">

        {/* Identity */}
        <div className="flex items-center gap-3 px-6 sm:px-8 py-3.5 border-r border-zinc-800 h-full flex-shrink-0">
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
            <span className="hidden sm:inline text-zinc-600">·</span>
            <span className="hidden sm:inline text-xs text-zinc-400">
              Product Designer
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 px-6 py-3.5 flex-1 text-xs">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 px-6 py-2.5 border-l border-zinc-800 h-full flex-shrink-0">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer text-xs"
            >
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline text-zinc-400">Theme:</span>
              <span className="text-zinc-200">
                {themeOptions.find((t) => t.id === currentThemeId)?.label.split(" ")[0] || "Obsidian"}
              </span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg p-1 border border-zinc-800 bg-zinc-950 shadow-2xl backdrop-blur-2xl z-50 text-xs">
                {themeOptions.map((opt) => {
                  const isSelected = currentThemeId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTheme(opt.id);
                        setThemeDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                      <span className={isSelected ? "text-white font-medium" : "text-zinc-400"}>
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Launch adityaos */}
          <button
            onClick={onLaunchOS}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 transition-all cursor-pointer text-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Launch OS</span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto border-x border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-2 font-mono text-xs">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-left py-2 px-3 rounded hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800 mt-2 flex items-center justify-between">
            <span className="text-zinc-500">Desktop sandbox</span>
            <button
              onClick={() => {
                onLaunchOS();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded bg-white text-zinc-950 font-semibold flex items-center gap-1.5"
            >
              <Terminal className="w-3 h-3" />
              <span>Launch OS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
