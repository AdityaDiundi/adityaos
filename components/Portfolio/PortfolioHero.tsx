"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, FileText, Terminal, MapPin } from "lucide-react";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
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
    <section className="relative min-h-[92dvh] flex flex-col justify-between pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Top Identification Track */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs font-mono text-zinc-400">
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-200">
            Portfolio 2024
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600 hidden sm:inline-block" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
            Delhi, India · Immediately Available
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600 hidden md:inline-block" />
          <span className="hidden md:inline-block text-zinc-500">
            IIIT Delhi (B.Tech ECE) · India Fellow
          </span>
        </div>

        {/* Asymmetric Split Layout: Left Content (8 Cols), Right Image (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-semibold tracking-[-0.035em] text-zinc-100 leading-[1.05]">
              Architecting friction-free digital systems, fintech payments, and grounded AI benchmarks.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-[65ch]">
              I am <span className="text-zinc-100 font-medium">Aditya Diundi</span>—a Product Designer and Systems Thinker with 3+ years designing intuitive digital products across fintech, healthtech, and grassroots social impact. I translate complex, ambiguous technical constraints into clear, tactile human experiences.
            </p>

            {/* Quiet, Purposeful Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
              <button
                onClick={onExploreWork}
                className="px-5 py-3 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium flex items-center gap-2 transition-all cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.1)] active:scale-[0.98]"
              >
                <span>Selected Work</span>
                <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <a
                href="/Aditya_Diundi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                <span>Resume (PDF)</span>
              </a>

              <button
                onClick={onLaunchOS}
                className="px-4 py-3 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Launch adityaos Shell</span>
              </button>
            </div>
          </div>

          {/* Right Portrait Column: Restrained, Film-Grade Visual */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="relative group w-full max-w-[280px] rounded-2xl overflow-hidden bg-[#0c0e14] border border-white/10 shadow-2xl">
              <div className="relative h-72 w-full">
                <Image
                  src="/aditya_portrait.jpg"
                  alt="Aditya Diundi"
                  fill
                  className="object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent opacity-70" />
              </div>

              <div className="p-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-zinc-200 font-medium">Aditya Diundi</span>
                <span className="text-zinc-500">Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Quiet Marquee Ticker */}
      <div className="w-full py-3 overflow-hidden border-y border-white/10 bg-[#0a0c10]/60 backdrop-blur-md">
        <div className="flex w-max animate-marquee space-x-12 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <span className="text-zinc-700">/</span>
              <span className="hover:text-zinc-200 transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
