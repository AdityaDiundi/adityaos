"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Sparkles, Layers, ShieldAlert, CheckCircle2, Eye, Maximize2, X } from "lucide-react";

interface ProjectShowcase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  problem: string;
  solution: string;
  impact: { label: string; value: string }[];
  imageSrc: string;
  secondaryImageSrc?: string;
  imageAlt: string;
  figmaUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags: string[];
}

export function EditorialCaseStudies() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  const projects: ProjectShowcase[] = [
    {
      id: "janeval",
      number: "01",
      title: "JANEVAL",
      subtitle: "Human-Centered AI Benchmarking for Indian Public Health",
      category: "AI Systems & Healthcare UX",
      year: "2024",
      role: "Lead Product Designer & Systems Architect",
      summary:
        "Frontier AI models (GPT-4 Vision, Gemini 1.5) hallucinate clinical and cultural realities when generating Indian public health imagery—depicting digital bathroom scales in primary Anganwadi clinics where hanging spring scales are mandatory, or generating gibberish Devanagari lettering on clinic walls. JANEVAL is an evidence-first blind pairwise evaluation framework designed to benchmark frontier model fidelity in rural Indian public health settings.",
      problem:
        "Public health workers cannot trust AI infographics if basic clinical protocol is distorted. Standard AI benchmarks (like Chatbot Arena) rely on Western crowdworkers and text metrics; zero benchmarks tested cultural and clinical ground-truth for grassroots Indian healthcare.",
      solution:
        "Designed a blind pairwise A/B comparison interface tailored for frontline domain experts with a discrete 3-tier scoring rubric (Cultural Fidelity, Medical Accuracy, Environmental Authenticity) and an ethical consent architecture.",
      impact: [
        { label: "Blind Comparisons", value: "100+" },
        { label: "Cultural Fidelity Gain", value: "3.4x" },
        { label: "Domain Evaluators", value: "10 Experts" },
      ],
      imageSrc: "/case-studies/janeval_page-1.png",
      secondaryImageSrc: "/case-studies/janeval_page-3.png",
      imageAlt: "Janeval AI Healthcare Evaluation Interface - Blind Pairwise Comparison",
      liveUrl: "https://janeval.vercel.app/",
      repoUrl: "https://github.com/AdityaDiundi/drishti-health-eval",
      tags: ["AI Benchmarking", "Healthcare UX", "Next.js", "Design System"],
    },
    {
      id: "upi-limit-clarity",
      number: "02",
      title: "UPI Limit Clarity",
      subtitle: "Re-engineering Transaction Anxiety & Daily Payment Limits in India",
      category: "Fintech & Consumer Payments",
      year: "2024",
      role: "Product Designer (Fintech UX & Error Prevention)",
      summary:
        "Over 350 million Indians execute daily payments on UPI, yet millions suffer sudden failures at checkout counters with opaque errors like 'Payment Limit Exceeded'. Users are left stranded, unaware whether the failure stems from the NPCI ₹1 Lakh daily cap, bank-specific caps, or daily transaction-count caps.",
      problem:
        "Cryptic reactive errors: Users only discover they breached a limit AFTER their payment fails in front of a merchant, generating acute social embarrassment and transaction panic.",
      solution:
        "Re-architected the payment flow with an ambient, pre-transaction 'UPI Meter Runway' that visually shows remaining daily capacity ('Today: ₹42,000 / ₹1,00,000 used · 9/20 transfers') before the user initiates payment, paired with 1-tap secondary bank split-routing.",
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
      id: "corporate-claims",
      number: "03",
      title: "Corporate Claims & Arbiter (S3)",
      subtitle: "Streamlining Enterprise Health Benefits & Cashless Hospitalization",
      category: "Enterprise B2B SaaS",
      year: "2023",
      role: "Product Designer & Design Systems Lead",
      summary:
        "Enterprise group health insurance operations are notoriously fragmented. HR administrators juggle disconnected Third-Party Administrator (TPA) portals, broken CSV census spreadsheets, and delayed pre-authorization hospital queues.",
      problem:
        "Manual census updates cause catastrophic delays where hospital pre-authorizations are rejected because employee activation records were delayed in CSV transit.",
      solution:
        "Designed a high-density, keyboard-first employee census table with instant bulk activate/deactivate actions, paired with the Arbiter Claims pipeline that visualizes cashless and reimbursement stages in real time.",
      impact: [
        { label: "HR Admin Task Time", value: "-62%" },
        { label: "Dispute Reduction", value: "-45%" },
        { label: "Design Token Consistency", value: "100%" },
      ],
      imageSrc: "/case-studies/corporate_claims.png",
      imageAlt: "Corporate Claims and S3 Management - Enterprise Dashboard Screens in Figma",
      figmaUrl: "https://www.figma.com/design/pr9NQjBDkyZqALFcPkm4tJ/Corporate-S3--_-Management?node-id=704-211",
      tags: ["B2B SaaS", "Design Systems", "InsurTech", "Information Architecture"],
    },
    {
      id: "ketto-plus",
      number: "04",
      title: "Ketto+ Recurring Giving",
      subtitle: "Designing Monthly Philanthropic Subscriptions with Ambient Nudges",
      category: "Social Impact & Crowdfunding",
      year: "2023",
      role: "Product & Interaction Designer",
      summary:
        "Transforming one-off emergency crowdfunding donors into sustained monthly subscribers. Designed the Ketto+ onboarding flow and ambient home screen nudges to establish emotional continuity and transparent impact tracking.",
      problem:
        "High churn after emergency medical campaigns: donors gave once and never returned due to lack of recurring impact visibility.",
      solution:
        "Designed a tactile subscription onboarding model with transparent allocation tiers, donor milestone rewards, and persistent impact feeds.",
      impact: [
        { label: "Subscription Conversion", value: "+28%" },
        { label: "Repeat Donors", value: "2.3x" },
      ],
      imageSrc: "/case-studies/ketto_plus.png",
      imageAlt: "Ketto+ Mobile App Design in Figma - Onboarding and Home Screen Nudges",
      figmaUrl: "https://www.figma.com/design/zSSrngf4wlhPPxg0cHlFRE/Ketto-?node-id=29-755",
      tags: ["Mobile UX", "Behavioral Design", "Subscription Architecture", "Figma"],
    },
    {
      id: "tutedude",
      number: "05",
      title: "Tutedude Mentorship",
      subtitle: "Structured Upskilling & Real-time Mentor Touchpoints for Tech Students",
      category: "EdTech & Learning UX",
      year: "2023",
      role: "Product Designer",
      summary:
        "Comprehensive overhaul of course progression, interactive code walkthroughs, and 1-on-1 mentor guidance touchpoints to combat online course dropouts.",
      problem:
        "Self-paced learning fatigue: students get stuck on debugging exercises without immediate feedback, leading to silent dropouts.",
      solution:
        "Integrated contextual mentor help drawers and micro-milestone progression trackers directly beside code exercises.",
      impact: [
        { label: "Module Completion", value: "+34%" },
        { label: "Mentor Response", value: "< 5 min" },
      ],
      imageSrc: "/case-studies/tutedude_assignment.png",
      imageAlt: "Tutedude Course Progression and Mentorship Screens in Figma",
      figmaUrl: "https://www.figma.com/design/hOmOAB7mZGXb8HBAy9TpHw/Tutedude-Assignment?node-id=220-1386",
      tags: ["EdTech", "Interaction Design", "Figma Flows"],
    },
  ];

  return (
    <section id="work" className="py-24 relative border-t border-white/10 bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header with Tasteful Typography */}
        <div className="mb-24 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Selected Design Systems & Case Studies
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.08]">
            Real systems. Grounded constraints. <span className="text-zinc-500 font-normal">Authentic craft.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-[65ch]">
            Every project below is grounded in actual production constraints, authentic user research, and comprehensive Figma design systems. Click any screen to inspect full-resolution artboards.
          </p>
        </div>

        {/* Editorial Project Walkthrough */}
        <div className="space-y-36">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start border-t border-white/10 pt-16 first:border-t-0 first:pt-0"
            >
              {/* Left Column: Editorial Narrative & Strategy */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <span className="text-zinc-300 font-semibold">{project.number}</span>
                  <span>/</span>
                  <span className="uppercase tracking-wider">{project.category}</span>
                  <span>/</span>
                  <span>{project.year}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-semibold font-sans text-zinc-100 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-base font-sans text-zinc-300 font-medium">
                    {project.subtitle}
                  </p>
                </div>

                {/* Role & Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
                    Role: {project.role}
                  </span>
                  {project.tags.map((tag) => (
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
                  {project.summary}
                </p>

                {/* Ground Friction */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.5} />
                    Ground Friction
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                {/* Solution Architecture */}
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                    Solution Architecture
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {project.solution}
                  </p>
                </div>

                {/* Impact Metrics (No boxed cards, clean division) */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  {project.impact.map((metric, i) => (
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

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <span>Live Benchmark</span>
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  )}

                  {project.figmaUrl && (
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
                      <span>Inspect Figma File</span>
                      <ExternalLink className="w-3 h-3 opacity-60" strokeWidth={1.5} />
                    </a>
                  )}

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
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

              {/* Right Column: Real Design Screenshot in Clean Browser Frame */}
              <div className="lg:col-span-7 space-y-3">
                <div
                  onClick={() =>
                    setSelectedImage({
                      src: project.imageSrc,
                      alt: project.imageAlt,
                      title: `${project.title} — ${project.subtitle}`,
                    })
                  }
                  className="group relative rounded-2xl overflow-hidden bg-[#0a0c10] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  {/* Browser Chrome Header */}
                  <div className="px-4 py-3 bg-black/60 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 truncate max-w-xs">
                      {project.figmaUrl ? "figma.com/design/@adityadiundi" : "janeval.vercel.app"}
                    </span>
                    <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors flex items-center gap-1 text-[11px] font-mono">
                      <Maximize2 className="w-3 h-3" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Expand</span>
                    </span>
                  </div>

                  {/* High-Resolution Design Asset */}
                  <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden">
                    <Image
                      src={project.imageSrc}
                      alt={project.imageAlt}
                      fill
                      className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                      priority={idx < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2 border border-white/20">
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Click to view full-resolution artboard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary Image Preview if available */}
                {project.secondaryImageSrc && (
                  <div
                    onClick={() =>
                      setSelectedImage({
                        src: project.secondaryImageSrc!,
                        alt: `${project.title} - Secondary Screen`,
                        title: `${project.title} — Evaluator Consent Flow`,
                      })
                    }
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 flex items-center justify-between text-xs font-mono text-zinc-400 cursor-pointer transition-colors"
                  >
                    <span>View Screen 2: Frontline Evaluator Consent & Onboarding</span>
                    <span className="text-zinc-200 flex items-center gap-1 font-semibold">
                      Open Preview <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1 pt-1">
                  <span>{project.imageAlt}</span>
                  <span className="text-zinc-400">Authentic Figma Artboard</span>
                </div>
              </div>
            </article>
          ))}
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
