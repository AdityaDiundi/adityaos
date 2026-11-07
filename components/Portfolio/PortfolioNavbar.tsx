"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Terminal, Menu, X, ArrowUpRight, Palette, Check } from "lucide-react";
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
    { label: "Scrollytelling Work", target: "work" },
    { label: "Field Ethnography", target: "research" },
    { label: "Writing", target: "essays" },
    { label: "Trajectory", target: "resume" },
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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-full backdrop-blur-xl border transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        style={{
          backgroundColor: activeTheme.isDark ? "rgba(10, 12, 16, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: activeTheme.cardBorder,
        }}
      >
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
            <span
              className="font-sans font-medium text-sm tracking-tight transition-colors"
              style={{ color: activeTheme.textPrimary }}
            >
              Aditya Diundi
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-500" />
            <span
              className="hidden sm:inline-block text-xs font-mono transition-colors"
              style={{ color: activeTheme.textMuted }}
            >
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
              className="px-4 py-1.5 rounded-full transition-colors cursor-pointer hover:opacity-100 opacity-70"
              style={{ color: activeTheme.textPrimary }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Custom Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-mono cursor-pointer"
              style={{
                backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              title="Select custom portfolio theme"
            >
              <Palette className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
              <span className="hidden sm:inline font-medium">Theme:</span>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>
                {themeOptions.find((t) => t.id === currentThemeId)?.label || "Obsidian"}
              </span>
            </button>

            {/* Theme Dropdown Menu */}
            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl p-1.5 border shadow-2xl backdrop-blur-2xl z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-150"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(12, 14, 20, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  borderColor: activeTheme.cardBorder,
                }}
              >
                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold border-b border-white/5 mb-1">
                  Custom Aesthetic Themes
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
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer hover:bg-white/10"
                      style={{ color: activeTheme.textPrimary }}
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[10px] opacity-50">{opt.tag}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Launch adityaos Sandbox Button */}
          <button
            onClick={onLaunchOS}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
            title="Launch adityaos interactive desktop sandbox"
          >
            <Terminal className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
            <span className="font-medium">adityaos</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/10 opacity-70">TWM</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg opacity-70 hover:opacity-100"
            style={{ color: activeTheme.textPrimary }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden mt-2 mx-auto max-w-sm px-5 py-4 rounded-2xl border shadow-2xl flex flex-col gap-2.5 font-mono text-sm backdrop-blur-2xl"
          style={{
            backgroundColor: activeTheme.isDark ? "rgba(12, 14, 20, 0.98)" : "rgba(255, 255, 255, 0.98)",
            borderColor: activeTheme.cardBorder,
            color: activeTheme.textPrimary,
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
