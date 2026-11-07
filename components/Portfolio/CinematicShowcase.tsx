"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight, ExternalLink, Sparkles, Eye, Maximize2, X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface CinematicProject {
  id: string;
  number: string;
  title: string;
  punchline: string;
  client: string;
  category: string;
  year: string;
  metric: { value: string; label: string };
  imageSrc: string;
  imageAlt: string;
  figmaUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  accentGlow: string;
}

function ProjectCard({
  project,
  index,
  total,
  onOpenImage,
}: {
  project: CinematicProject;
  index: number;
  total: number;
  onOpenImage: (project: CinematicProject) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme } = useThemeStore();

  // Scroll-linked progress for this specific project section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth cinematic transforms
  const scale = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], [0.88, 1, 1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.3, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], [60, 0, 0, -40]);
  const textY = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [40, 0, 0, -30]);

  // Interactive 3D cursor tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[95vh] md:min-h-[110vh] flex flex-col justify-center py-16 md:py-24 relative"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
        {/* Sleek Minimal Header: 1 line context + Counter */}
        <motion.div
          style={{ y: textY }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="font-semibold" style={{ color: activeTheme.accent }}>
                {project.number} / 0{total}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              <span className="uppercase tracking-widest text-[11px]" style={{ color: activeTheme.textMuted }}>
                {project.category} · {project.year}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-500 hidden sm:inline-block" />
              <span
                className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full border text-[11px]"
                style={{
                  backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  borderColor: activeTheme.cardBorder,
                  color: activeTheme.textPrimary,
                }}
              >
                CLIENT: {project.client}
              </span>
            </div>

            <h3
              className="text-3xl sm:text-5xl md:text-6xl font-sans font-semibold tracking-[-0.035em] leading-[1.08] transition-colors"
              style={{ color: activeTheme.textPrimary }}
            >
              {project.title}
            </h3>

            <p
              className="text-base sm:text-xl font-sans font-normal max-w-2xl leading-relaxed transition-colors"
              style={{ color: activeTheme.textSecondary }}
            >
              {project.punchline}
            </p>
          </div>

          {/* Single Impressive Key Metric Badge */}
          <div
            className="self-start md:self-end px-5 py-3 rounded-2xl border backdrop-blur-xl flex items-center gap-4 shadow-sm"
            style={{
              backgroundColor: activeTheme.isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
              borderColor: activeTheme.cardBorder,
            }}
          >
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white" style={{ color: activeTheme.accent }}>
                {project.metric.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: activeTheme.textMuted }}>
                {project.metric.label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3D Kinetic Device Frame with Scroll Scale */}
        <motion.div
          style={{ scale, opacity, y }}
          className="relative perspective-[1200px]"
        >
          {/* Ambient Glow Aura */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-20 blur-3xl pointer-events-none transition-opacity duration-700"
            style={{ background: project.accentGlow }}
          />

          <motion.div
            style={{
              rotateX,
              rotateY,
              backgroundColor: activeTheme.isDark ? "#090B10" : "#FFFFFF",
              borderColor: activeTheme.cardBorder,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onOpenImage(project)}
            className="group relative rounded-3xl overflow-hidden border cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-300"
          >
            {/* Minimal Browser Top Bar */}
            <div
              className="px-5 py-3 border-b flex items-center justify-between transition-colors"
              style={{
                backgroundColor: activeTheme.isDark ? "rgba(0,0,0,0.5)" : "rgba(240,240,240,0.7)",
                borderColor: activeTheme.cardBorder,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="ml-2 font-mono text-[11px] opacity-60 truncate max-w-xs" style={{ color: activeTheme.textMuted }}>
                  {project.figmaUrl ? "figma.com/design/@adityadiundi" : "adityaos.production/view"}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tap to inspect full artboard</span>
              </div>
            </div>

            {/* High-Resolution Media Canvas */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black/40">
              <Image
                src={project.imageSrc}
                alt={project.imageAlt}
                fill
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                priority={index < 2}
              />

              {/* Hover Inspection Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-mono text-xs font-semibold flex items-center gap-2 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                  <Eye className="w-4 h-4" /> Expand High-Resolution View
                </span>
              </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div
              className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
              style={{
                backgroundColor: activeTheme.isDark ? "rgba(10,12,18,0.7)" : "rgba(250,250,250,0.8)",
                borderColor: activeTheme.cardBorder,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
                <span>Production Shipped Design</span>
              </div>

              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    style={{
                      backgroundColor: activeTheme.textPrimary,
                      color: activeTheme.desktopBg,
                    }}
                  >
                    <span>Live Benchmark</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.figmaUrl && (
                  <a
                    href={project.figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border flex items-center gap-1.5 transition-all hover:bg-white/10"
                    style={{
                      borderColor: activeTheme.cardBorder,
                      color: activeTheme.textPrimary,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 opacity-70" />
                    <span>Inspect Figma</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border flex items-center gap-1.5 transition-all hover:bg-white/10 opacity-70 hover:opacity-100"
                    style={{
                      borderColor: activeTheme.cardBorder,
                      color: activeTheme.textPrimary,
                    }}
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function CinematicShowcase() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; title: string } | null>(null);
  const { activeTheme } = useThemeStore();

  const projects: CinematicProject[] = [
    {
      id: "upi-limit",
      number: "01",
      title: "UPI Limit Clarity",
      punchline: "Eliminating payment failure anxiety for 350M users through ambient pre-transaction runway meters.",
      client: "Digiaccel",
      category: "Fintech & Payments",
      year: "2024",
      metric: { value: "38%", label: "Anticipated Dropoff Reduction" },
      imageSrc: "/case-studies/upi_limit_clarity.png",
      imageAlt: "UPI Limit Clarity - Ambient Limit Runway & Split Route Flows",
      figmaUrl: "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
      accentGlow: "rgba(0, 240, 255, 0.4)",
    },
    {
      id: "janeval",
      number: "02",
      title: "JANEVAL Benchmark",
      punchline: "Benchmarking frontier vision models against clinical and cultural realities in rural Indian clinics.",
      client: "Josh Talks",
      category: "Frontier AI & Healthcare",
      year: "2024",
      metric: { value: "3.4x", label: "Cultural Fidelity Gain" },
      imageSrc: "/case-studies/janeval_page-1.png",
      imageAlt: "JANEVAL - Double Blind Pairwise Model Evaluation Arena",
      liveUrl: "https://janeval.vercel.app/",
      repoUrl: "https://github.com/AdityaDiundi/drishti-health-eval",
      accentGlow: "rgba(16, 185, 129, 0.4)",
    },
    {
      id: "habit-tracker",
      number: "03",
      title: "21-Day Habit & Hair Tracker",
      punchline: "Defeating the Day 7–21 churn cliff in delayed-gratification health regimens through tactile micro-wins.",
      client: "Traya Health / Mosaic Wellness",
      category: "Behavioral Retention",
      year: "2024",
      metric: { value: "+44%", label: "Day 14 Routine Adherence" },
      imageSrc: "/case-studies/hair_tracker.png",
      imageAlt: "21-Day Habit Tracker - Routine Log Deck and Milestone Checkpoints",
      figmaUrl: "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
      accentGlow: "rgba(245, 158, 11, 0.4)",
    },
    {
      id: "corporate-claims",
      number: "04",
      title: "Corporate Claims & Arbiter (S3)",
      punchline: "Keyboard-first enterprise census management preventing hospital cashless pre-authorization delays.",
      client: "MedPay / S3",
      category: "Enterprise B2B SaaS",
      year: "2023",
      metric: { value: "-62%", label: "HR Admin Operation Time" },
      imageSrc: "/case-studies/corporate_claims.png",
      imageAlt: "Corporate Claims and S3 Management - Enterprise Dashboard Screens in Figma",
      figmaUrl: "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
      accentGlow: "rgba(99, 102, 241, 0.4)",
    },
    {
      id: "ketto-plus",
      number: "05",
      title: "Ketto+ Recurring Giving",
      punchline: "Converting one-off emergency donors into sustained monthly champions with ambient impact feeds.",
      client: "Ketto",
      category: "Crowdfunding & Philanthropy",
      year: "2023",
      metric: { value: "2.3x", label: "Repeat Monthly Donors" },
      imageSrc: "/case-studies/ketto_plus.png",
      imageAlt: "Ketto+ Mobile App Design in Figma - Onboarding and Home Screen Nudges",
      figmaUrl: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755",
      accentGlow: "rgba(236, 72, 153, 0.4)",
    },
    {
      id: "field-research",
      number: "06",
      title: "Aarohi Fieldwork & Cognitive Study",
      punchline: "One year of grassroots ethnography in rural Uttarakhand decoupling language from cognitive aptitude.",
      client: "India Fellow & Aarohi",
      category: "Grassroots Ethnography",
      year: "2024",
      metric: { value: "84%", label: "Spatial Deduction Mastery" },
      imageSrc: "/aditya_field_full.jpg",
      imageAlt: "Aditya Diundi Grassroots Fieldwork in Rural Kumaon Foothills",
      accentGlow: "rgba(34, 197, 94, 0.4)",
    },
  ];

  return (
    <section id="work" className="relative py-12 border-t border-white/10">
      {/* Quiet Section Anchor Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em]" style={{ color: activeTheme.textMuted }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
          Selected Systems & Productions
        </div>
        <h2
          className="text-2xl sm:text-4xl font-sans font-semibold tracking-tight mt-2"
          style={{ color: activeTheme.textPrimary }}
        >
          Curated Works. Scroll to explore kinetic depth.
        </h2>
      </div>

      {/* Full Cinematic Scroll Runway */}
      <div className="divide-y divide-white/5">
        {projects.map((proj, idx) => (
          <ProjectCard
            key={proj.id}
            project={proj}
            index={idx}
            total={projects.length}
            onOpenImage={(p) =>
              setSelectedImage({
                src: p.imageSrc,
                alt: p.imageAlt,
                title: `${p.title} — ${p.client}`,
              })
            }
          />
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0c0e14] border border-white/15 overflow-hidden shadow-2xl"
          >
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/80 font-mono text-xs">
              <span className="text-zinc-200 font-semibold truncate">{selectedImage.title}</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Full-Res Image */}
            <div className="relative w-full overflow-y-auto flex-1 p-4 bg-zinc-950 flex items-center justify-center">
              <div className="relative w-full min-h-[500px] h-[78vh]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
