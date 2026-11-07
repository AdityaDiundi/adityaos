"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, FileText, Terminal, MapPin } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
  const { activeTheme } = useThemeStore();

  const marqueeItems = [
    "FINTECH ERROR PREVENTION",
    "AI CULTURAL BENCHMARKING",
    "BEHAVIORAL RETENTION ARCHITECTURE",
    "ENTERPRISE B2B INSURTECH",
    "IIIT DELHI ALUMNUS",
    "INDIA FELLOW ETHNOGRAPHY",
    "SYSTEMS THINKING",
    "TACTILE INTERACTION DESIGN",
  ];

  return (
    <section className="relative min-h-[90dvh] flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Identification Track */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs font-mono">
          <span
            className="px-3 py-1 rounded-full border transition-colors"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
              borderColor: activeTheme.cardBorder,
              color: activeTheme.textPrimary,
            }}
          >
            Portfolio 2024
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-500 hidden sm:inline-block" />
          <span className="hidden sm:inline-flex items-center gap-1.5" style={{ color: activeTheme.textMuted }}>
            <MapPin className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
            Delhi, India · Immediately Available
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-500 hidden md:inline-block" />
          <span className="hidden md:inline-block" style={{ color: activeTheme.textMuted }}>
            IIIT Delhi (B.Tech ECE) · India Fellow
          </span>
        </div>

        {/* Asymmetric Split Layout: Left Content (8 Cols), Right Image (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-6">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-sans font-semibold tracking-[-0.035em] leading-[1.05] transition-colors"
              style={{ color: activeTheme.textPrimary }}
            >
              Architecting friction-free digital systems, fintech payments, and grounded AI benchmarks.
            </h1>

            <p
              className="text-base sm:text-lg font-sans leading-relaxed max-w-[65ch] transition-colors"
              style={{ color: activeTheme.textSecondary }}
            >
              I am <span className="font-semibold" style={{ color: activeTheme.textPrimary }}>Aditya Diundi</span>—a Product Designer and Systems Thinker with 3+ years designing intuitive digital products across fintech, healthtech, and grassroots social impact. I translate complex, ambiguous technical constraints into clear, tactile human experiences.
            </p>

            {/* Quiet, Purposeful Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
              <button
                onClick={onExploreWork}
                className="px-5 py-3 rounded-full font-medium flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                style={{
                  backgroundColor: activeTheme.textPrimary,
                  color: activeTheme.desktopBg,
                }}
              >
                <span>Scrollytelling Journey</span>
                <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <a
                href="/Aditya_Diundi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full border flex items-center gap-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
              >
                <FileText className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
                <span>Resume (PDF)</span>
              </a>

              <button
                onClick={onLaunchOS}
                className="px-4 py-3 rounded-full border flex items-center gap-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textMuted,
                }}
              >
                <Terminal className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
                <span>Launch adityaos Shell</span>
              </button>
            </div>
          </div>

          {/* Right Portrait Column: Restrained, Film-Grade Visual */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div
              className="relative group w-full max-w-[280px] rounded-2xl overflow-hidden border shadow-2xl transition-all"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
              }}
            >
              <div className="relative h-72 w-full">
                <Image
                  src="/aditya_portrait.jpg"
                  alt="Aditya Diundi"
                  fill
                  className="object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-500"
                  priority
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${activeTheme.desktopBg}, transparent)`,
                  }}
                />
              </div>

              <div
                className="p-3.5 border-t flex items-center justify-between text-xs font-mono"
                style={{
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textMuted,
                }}
              >
                <span className="font-medium" style={{ color: activeTheme.textPrimary }}>Aditya Diundi</span>
                <span>Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Marquee Banner */}
      <div
        className="w-full overflow-hidden border-y py-3.5"
        style={{
          borderColor: activeTheme.cardBorder,
          backgroundColor: activeTheme.isDark ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <div className="flex w-max animate-marquee space-x-8 font-mono text-xs tracking-widest uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8">
              <span style={{ color: activeTheme.textMuted }}>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
