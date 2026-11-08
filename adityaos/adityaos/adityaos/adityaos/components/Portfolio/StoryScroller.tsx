"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Eye,
  Maximize2,
  X,
  Compass,
  Layers,
  ChevronRight,
  Activity,
  HeartHandshake
} from "lucide-react";

export interface StoryChapter {
  id: string;
  number: string;
  act: string;
  title: string;
  subtitle: string;
  client: string;
  clientType: string;
  category: string;
  year: string;
  role: string;
  narrative: string;
  friction: string;
  architecture: string;
  impact: { label: string; value: string }[];
  imageSrc: string;
  secondaryImageSrc?: string;
  imageAlt: string;
  figmaUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags: string[];
  badge: string;
}

export function StoryScroller() {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; title: string } | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const chapters: StoryChapter[] = [
    {
      id: "chapter-fieldwork",
      number: "01",
      act: "ACT I: THE GROUND TRUTH",
      title: "Aarohi & Himalayan Fieldwork",
      subtitle: "Grassroots Pedagogical Diagnostics & Human Mental Models",
      client: "India Fellow & Aarohi",
      clientType: "Grassroots Rural Fellowship",
      category: "Field Ethnography & Cognitive Diagnostics",
      year: "2024",
      role: "India Fellow & Field Systems Researcher",
      badge: "Grassroots Empathy",
      narrative:
        "Before architecting digital products in pixels, I spent a full year immersed in rural Himalayan communities (Peora & Almora, Uttarakhand) studying human learning, oral communication defaults, and systemic resource scarcity. Designing for the Global South cannot be an exercise in 'dumbing down' Western patterns—it demands honoring vernacular mental models and collective community decision structures.",
      friction:
        "Technological hegemony & language bias: Standard educational diagnostic tests evaluated rural children in formal English, routinely conflating language comprehension hurdles with cognitive deficits.",
      architecture:
        "Developed language-agnostic physical-to-digital diagnostic tools using tactile wooden tangrams and sequence tokens. Students previously categorized below 40% demonstrated rapid 84% mastery in spatial deduction when linguistic friction was eliminated.",
      impact: [
        { label: "Students Evaluated", value: "100+" },
        { label: "Cognitive Mastery", value: "84%" },
        { label: "Field Immersion", value: "12 Mos" },
      ],
      imageSrc: "/aditya_field_full.jpg",
      imageAlt: "Aditya Diundi Grassroots Fieldwork & Cognitive Diagnostics in Rural Uttarakhand",
      tags: ["Grassroots Ethnography", "Cognitive Diagnostics", "Rural Systems", "Field Research"],
    },
    {
      id: "chapter-upi",
      number: "02",
      act: "ACT II: PROACTIVE LIMIT RUNWAYS",
      title: "UPI Limit Clarity",
      subtitle: "Re-engineering Transaction Anxiety & Daily Payment Ceilings",
      client: "Digiaccel",
      clientType: "Fintech Product Assignment",
      category: "Fintech & Consumer Payments",
      year: "2024",
      role: "Product Designer (Fintech UX & Error Prevention)",
      badge: "Fintech Architecture",
      narrative:
        "Over 350 million Indians execute daily payments on UPI, yet millions suffer sudden failures at checkout counters with opaque errors like 'Payment Limit Exceeded'. Users are left stranded, unaware whether the failure stems from the NPCI ₹1 Lakh daily ceiling, bank-specific transaction count limits, or individual account settings.",
      friction:
        "Cryptic reactive errors: Users discover they breached a limit AFTER their payment fails in front of a merchant, generating acute social embarrassment and transaction panic.",
      architecture:
        "Re-architected the payment flow with an ambient, pre-transaction 'UPI Meter Runway' that visually indicates remaining daily capacity ('Today: ₹42,000 / ₹1,00,000 used · 9/20 transfers') before the user initiates payment, paired with 1-tap secondary bank split-routing.",
      impact: [
        { label: "Dropoff Reduction", value: "38%" },
        { label: "Pre-payment Clarity", value: "92%" },
        { label: "Recovery Actions", value: "1-Tap" },
      ],
      imageSrc: "/case-studies/upi_limit_clarity.png",
      imageAlt: "UPI Limit Clarity Figma Design System - Complete Screen Flow & Meter Architecture",
      figmaUrl: "https://www.figma.com/design/zCmxQ3KwFy0mhlFbtlApua/UPI-Limit-Clarity---digiaccel-Assignment?node-id=0-1",
      tags: ["Fintech UX", "Error Recovery", "Figma Design System", "Behavioral Nudges"],
    },
    {
      id: "chapter-janeval",
      number: "03",
      act: "ACT III: CLINICAL AI BENCHMARKING",
      title: "JANEVAL",
      subtitle: "Human-Centered AI Ground-Truth Evaluation for Indian Public Health",
      client: "Josh Talks",
      clientType: "Independent AI Healthcare Research",
      category: "AI Systems & Healthcare UX",
      year: "2024",
      role: "Lead Product Designer & Systems Architect",
      badge: "Frontier AI Benchmarking",
      narrative:
        "Frontier vision models (GPT-4 Vision, Gemini 1.5) hallucinate clinical and cultural realities when generating Indian public health imagery—depicting digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, or generating gibberish Devanagari lettering on clinic walls. JANEVAL is an evidence-first blind pairwise evaluation framework designed to benchmark frontier model fidelity in rural Indian public health settings.",
      friction:
        "Public health workers cannot trust AI infographics if basic clinical protocol is distorted. Standard AI benchmarks (like Chatbot Arena) rely on Western crowdworkers and text metrics; zero benchmarks tested cultural and clinical ground-truth for grassroots Indian healthcare.",
      architecture:
        "Designed a double-blind pairwise A/B comparison interface tailored for frontline domain experts with a discrete 3-tier scoring rubric (Cultural Fidelity, Medical Accuracy, Environmental Authenticity) and an ethical consent architecture.",
      impact: [
        { label: "Blind Comparisons", value: "120+" },
        { label: "Cultural Fidelity Gain", value: "3.4x" },
        { label: "Domain Evaluators", value: "12 Experts" },
      ],
      imageSrc: "/case-studies/janeval_page-1.png",
      secondaryImageSrc: "/case-studies/janeval_page-3.png",
      imageAlt: "JANEVAL Blind Pairwise Evaluation Interface - Healthcare Benchmark",
      liveUrl: "https://janeval.vercel.app/",
      repoUrl: "https://github.com/AdityaDiundi/drishti-health-eval",
      tags: ["AI Benchmarking", "Healthcare UX", "Next.js", "Design System"],
    },
    {
      id: "chapter-habits",
      number: "04",
      act: "ACT IV: THE BEHAVIORAL HABIT PLATEAU",
      title: "21-Day Habit & Hair Tracker",
      subtitle: "Behavioral Retention Engine for Delayed-Outcome Health Regimens",
      client: "Traya Health / Mosaic Wellness",
      clientType: "D2C HealthTech Product UX",
      category: "D2C HealthTech & Behavioral UX",
      year: "2024",
      role: "Product Designer (Behavioral UX & Nudges)",
      badge: "Behavioral Retention",
      narrative:
        "D2C holistic health regimens (such as hair loss and gut health) suffer from an acute churn cliff between Day 7 and Day 21. Biological improvements take 60–90 days to physically manifest, leaving users feeling unrewarded during initial routine adoption. Designed the 21-Day Habit Tracker with tactile micro-commitments, visual milestone unlocks, and frictionless expert bridge.",
      friction:
        "Delayed gratification crisis: Users abandon multi-step morning/evening serum and vitamin routines before any visible biological progress occurs. Existing wellness trackers overwhelmed users with tedious calorie logs and rigid timers, turning daily healthcare into an intimidating chore.",
      architecture:
        "Designed a tactile 1-tap routine deck that breaks health habits into microscopic daily wins with positive reinforcement facts. Integrated milestone check-ins at Day 7, 14, and 21, coupled with a 1-tap WhatsApp consultation bridge to instantly connect with hair coaches when anxiety strikes.",
      impact: [
        { label: "Day 14 Retention", value: "+44%" },
        { label: "Daily Log Rate", value: "81%" },
        { label: "Coach Connect Speed", value: "< 4 min" },
      ],
      imageSrc: "/case-studies/hair_tracker.png",
      imageAlt: "21-Day Habit & Hair Tracker - Figma Design Flow & Routine Interface",
      figmaUrl: "https://www.figma.com/design/jYWIU8kR4JiRbQU6UcctXm/21-Day-Hair-Tracker?node-id=0-1",
      tags: ["Behavioral UX", "D2C HealthTech", "Retention Loops", "Figma Design System"],
    },
    {
      id: "chapter-claims",
      number: "05",
      act: "ACT V: ENTERPRISE CLAIMS & DATA DENSITY",
      title: "Corporate Claims & Arbiter (S3)",
      subtitle: "Streamlining Enterprise Health Benefits & Cashless Hospitalization",
      client: "MedPay / S3",
      clientType: "Enterprise InsurTech SaaS",
      category: "Enterprise B2B SaaS",
      year: "2023",
      role: "Product Designer & Design Systems Lead",
      badge: "High-Density B2B",
      narrative:
        "Enterprise group health insurance operations are notoriously fragmented. HR administrators juggle disconnected Third-Party Administrator (TPA) portals, broken CSV census spreadsheets, and delayed pre-authorization hospital queues.",
      friction:
        "Manual census updates cause catastrophic delays where hospital pre-authorizations are rejected because employee activation records were delayed in CSV transit.",
      architecture:
        "Designed a high-density, keyboard-first employee census table with instant bulk activate/deactivate actions, paired with the Arbiter Claims pipeline that visualizes cashless and reimbursement stages in real time.",
      impact: [
        { label: "HR Admin Task Time", value: "-62%" },
        { label: "Dispute Reduction", value: "-45%" },
        { label: "Design Consistency", value: "100%" },
      ],
      imageSrc: "/case-studies/corporate_claims.png",
      imageAlt: "Corporate Claims and S3 Management - Enterprise Dashboard Screens in Figma",
      figmaUrl: "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
      tags: ["B2B SaaS", "Design Systems", "InsurTech", "Information Architecture"],
    },
    {
      id: "chapter-ketto",
      number: "06",
      act: "ACT VI: SUSTAINED PHILANTHROPIC CONTINUITY",
      title: "Ketto+ Recurring Giving",
      subtitle: "Designing Monthly Philanthropic Subscriptions with Ambient Nudges",
      client: "Ketto",
      clientType: "Social Impact Crowdfunding",
      category: "Social Impact & Crowdfunding",
      year: "2023",
      role: "Product & Interaction Designer",
      badge: "Subscription UX",
      narrative:
        "Transforming one-off emergency crowdfunding donors into sustained monthly subscribers. Designed the Ketto+ onboarding flow and ambient home screen nudges to establish emotional continuity and transparent impact tracking.",
      friction:
        "High churn after emergency medical campaigns: donors gave once and never returned due to lack of recurring impact visibility.",
      architecture:
        "Designed a tactile subscription onboarding model with transparent allocation tiers, donor milestone rewards, and persistent impact feeds.",
      impact: [
        { label: "Subscription Conversion", value: "+28%" },
        { label: "Repeat Donors", value: "2.3x" },
        { label: "Cohort Giving Life", value: "14 Mos" },
      ],
      imageSrc: "/case-studies/ketto_plus.png",
      imageAlt: "Ketto+ Mobile App Design in Figma - Onboarding and Home Screen Nudges",
      figmaUrl: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755",
      tags: ["Mobile UX", "Behavioral Design", "Subscription Architecture", "Figma"],
    },
  ];

  // Scroll spy observer to update activeChapterIndex smoothly
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = chapterRefs.current[i];
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveChapterIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapters.length]);

  const scrollToChapter = (index: number) => {
    const el = chapterRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <section id="work" className="relative py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-14 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            The Scrollytelling Stage · 6 Chapters
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.1]">
            From Grassroots Foothills to <span className="text-zinc-400 font-normal">Frontier AI Systems.</span>
          </h2>
          <p className="text-base text-zinc-400 font-sans leading-relaxed max-w-[65ch]">
            Scroll through the narrative to inspect actual production constraints, authentic field research, and live Figma design systems in the pinned stage.
          </p>
        </div>

        {/* Sticky Chapter Scrub Bar */}
        <div className="sticky top-20 z-30 mb-12 py-3 px-3 rounded-2xl bg-[#08090C]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  onClick={() => scrollToChapter(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? "text-zinc-600" : "text-zinc-500"}`}>
                    {ch.number}
                  </span>
                  <span className="truncate max-w-[120px] sm:max-w-none">{ch.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-zinc-500 pr-2">
            <span>{activeChapterIndex + 1} / {chapters.length}</span>
            <span>·</span>
            <span className="text-zinc-400 font-medium">{activeChapter.client}</span>
          </div>
        </div>

        {/* 12-Column Scrollytelling Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
          {/* Left Column: Narrative Scroll Runway */}
          <div className="lg:col-span-6 space-y-40 pb-20">
            {chapters.map((chapter, idx) => (
              <div
                key={chapter.id}
                ref={(el) => { chapterRefs.current[idx] = el; }}
                id={chapter.id}
                className="scroll-mt-36 space-y-6 pt-8 border-t border-white/10 first:border-t-0 first:pt-0"
              >
                {/* Act Marker & Credibility Badge */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                    <span className="text-cyan-400 font-semibold">{chapter.act}</span>
                    <span>/</span>
                    <span>{chapter.year}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.06] border border-white/12 text-xs font-mono text-zinc-200">
                      <span className="text-zinc-500 text-[11px]">CLIENT:</span>
                      <span className="font-semibold text-white tracking-wide">{chapter.client}</span>
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400">
                      {chapter.clientType}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-semibold font-sans text-zinc-100 tracking-tight">
                    {chapter.title}
                  </h3>
                  <p className="text-base font-sans text-zinc-300 font-medium">
                    {chapter.subtitle}
                  </p>
                </div>

                {/* Role & Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
                    Role: {chapter.role}
                  </span>
                  {chapter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.02] text-zinc-500 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Core Narrative */}
                <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                  {chapter.narrative}
                </p>

                {/* Ground Friction Box */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.5} />
                    Ground Friction
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {chapter.friction}
                  </p>
                </div>

                {/* Solution Architecture Box */}
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                    Solution Architecture
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {chapter.architecture}
                  </p>
                </div>

                {/* Key Metrics HUD */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  {chapter.impact.map((metric, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">
                        {metric.value}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-sans leading-tight">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile-Only Inlined Image Preview */}
                <div className="lg:hidden pt-4">
                  <div
                    onClick={() =>
                      setSelectedImage({
                        src: chapter.imageSrc,
                        alt: chapter.imageAlt,
                        title: `${chapter.title} — ${chapter.client}`,
                      })
                    }
                    className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 relative aspect-[16/10] cursor-pointer"
                  >
                    <Image
                      src={chapter.imageSrc}
                      alt={chapter.imageAlt}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-mono text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Tap to view full resolution
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
                  {chapter.liveUrl && (
                    <a
                      href={chapter.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <span>Live Benchmark</span>
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  )}

                  {chapter.figmaUrl && (
                    <a
                      href={chapter.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                      <span>Inspect Figma File</span>
                      <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={1.5} />
                    </a>
                  )}

                  {chapter.repoUrl && (
                    <a
                      href={chapter.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors"
                    >
                      <span>GitHub Repository</span>
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Pinned Desktop Cinema Stage */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-36 space-y-4">
            <div
              onClick={() =>
                setSelectedImage({
                  src: activeChapter.imageSrc,
                  alt: activeChapter.imageAlt,
                  title: `${activeChapter.title} — ${activeChapter.subtitle} (${activeChapter.client})`,
                })
              }
              className="group relative rounded-2xl overflow-hidden bg-[#0a0c10] border border-white/15 hover:border-white/30 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              {/* Browser Chrome Header */}
              <div className="px-4 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-cyan-400">
                    {activeChapter.act}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 truncate max-w-xs">
                    {activeChapter.figmaUrl ? "figma.com/design/@adityadiundi" : "adityaos.stage/view"}
                  </span>
                </div>
                <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors flex items-center gap-1 text-[11px] font-mono">
                  <Maximize2 className="w-3 h-3" strokeWidth={1.5} />
                  <span>Zoom</span>
                </span>
              </div>

              {/* Dynamic Pinned Canvas with Smooth Transitions */}
              <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeChapter.imageSrc}
                      alt={activeChapter.imageAlt}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Inspection Prompt */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2 border border-white/20">
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Click to inspect full-resolution artboard
                  </span>
                </div>
              </div>
            </div>

            {/* Pinned Stage Metadata HUD */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">CURRENT STAGE</span>
                <div className="text-zinc-200 font-semibold">{activeChapter.title}</div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">CLIENT</span>
                <div className="text-white font-semibold">{activeChapter.client}</div>
              </div>
            </div>

            {/* Secondary Screen Preview If Present (JANEVAL Screen 2) */}
            {activeChapter.secondaryImageSrc && (
              <div
                onClick={() =>
                  setSelectedImage({
                    src: activeChapter.secondaryImageSrc!,
                    alt: `${activeChapter.title} - Secondary Screen`,
                    title: `${activeChapter.title} — Evaluator Consent Flow (${activeChapter.client})`,
                  })
                }
                className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 flex items-center justify-between text-xs font-mono text-zinc-400 cursor-pointer transition-colors"
              >
                <span>View Screen 2: Frontline Evaluator Consent Flow</span>
                <span className="text-zinc-200 flex items-center gap-1 font-semibold">
                  Open Screen <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c0e14] border border-white/15 overflow-hidden shadow-2xl"
          >
            {/* Modal Top Bar */}
            <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/80">
              <span className="font-mono text-xs text-zinc-300 font-semibold truncate">
                {selectedImage.title}
              </span>
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
              <div className="relative w-full min-h-[600px] h-[78vh]">
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
