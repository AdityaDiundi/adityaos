"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, FileText, Terminal, Sparkles, MapPin, Layers, Award } from "lucide-react";

interface PortfolioHeroProps {
  onExploreWork: () => void;
  onLaunchOS: () => void;
}

export function PortfolioHero({ onExploreWork, onLaunchOS }: PortfolioHeroProps) {
  const marqueeItems = [
    "FINTECH ERROR PREVENTION",
    "AI CULTURAL BENCHMARKING",
    "BEHAVIORAL RETENTION UX",
    "ENTERPRISE INSURTECH",
    "IIIT DELHI ALUMNUS",
    "INDIA FELLOW ETHNOGRAPHY",
    "SYSTEMS ARCHITECTURE",
    "TACTILE INTERACTION DESIGN",
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Ambient Cyber Lighting Blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-blue-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Product Design & Systems Thinking
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-mono text-xs">
            <MapPin className="w-3 h-3 text-rose-400" />
            Delhi, India · Immediately Available
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-xs">
            <Award className="w-3 h-3 text-amber-400" />
            IIIT Delhi · India Fellow
          </div>
        </div>

        {/* Main Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          <div className="lg:col-span-8 space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-semibold tracking-[-0.03em] text-white leading-[1.08]">
              Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-white">friction-free systems</span>, fintech payments, and grounded AI benchmarks.
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl">
              I am <span className="text-white font-medium">Aditya Diundi</span>—a Product Designer and Systems Thinker with 3+ years designing intuitive digital products across fintech, healthtech, and social impact. I translate complex, ambiguous technical constraints into clear, tactile human experiences.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreWork}
                className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-medium text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <span>Explore Selected Work</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href="/Aditya_Diundi_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Resume (PDF)</span>
              </a>

              <button
                onClick={onLaunchOS}
                className="px-4 py-2.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Launch adityaos Shell</span>
              </button>
            </div>
          </div>

          {/* Portrait & System Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group p-2 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-sm max-w-xs w-full">
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-white/10">
                <Image
                  src="/aditya_portrait.jpg"
                  alt="Aditya Diundi Portrait"
                  fill
                  className="object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Digital Desi
                  </span>
                  <span className="text-zinc-400">Delhi, IN</span>
                </div>
              </div>

              {/* Quick stats mini-bar */}
              <div className="mt-3 px-2 py-2 rounded-lg bg-black/40 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <div className="text-white font-semibold">3+ Yrs</div>
                  <div className="text-[10px] text-zinc-400">Experience</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-semibold">IIIT-D</div>
                  <div className="text-[10px] text-zinc-400">B.Tech ECE</div>
                </div>
                <div>
                  <div className="text-emerald-400 font-semibold">100+</div>
                  <div className="text-[10px] text-zinc-400">Field Tests</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Infinite-Scroll Marquee Banner */}
        <div className="relative w-full py-3.5 overflow-hidden border-y border-white/10 bg-black/30 backdrop-blur-md rounded-xl">
          <div className="flex w-max animate-marquee space-x-8 text-xs font-mono tracking-widest text-zinc-400">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-cyan-400">✦</span>
                <span className="hover:text-white transition-colors">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
