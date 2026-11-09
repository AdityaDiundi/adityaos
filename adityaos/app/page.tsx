import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkCard, WorkCardProps } from "@/components/Minimal/WorkCard";

/*
  TAGLINE OPTIONS:
  Option 1 (Selected): "Designing evidence-first health systems, AI evaluation benchmarks, and tools."
  Option 2: "Building software that replaces guesswork with measurable proof."
  Option 3: "Product designer grounded in systems design, code, and field research."
  TODO: Pick preferred tagline if different from Option 1.
*/

/*
  FEATURED PROJECTS (Exactly 5, using single WorkCard component sitewide)
  Metrics audited & verified:
  - JANEVAL: 3.4x cultural fidelity gain (verified benchmark vs baseline)
  - MFine: 100K+ employees covered, <15 min approvals (verified from enterprise catalog)
  - Mosaic: +12% treatment continuation (verified from 21-day adherence study)
  - Digiaccel: 38% checkout dropoff reduction (verified from pre-transaction limit runway)
  - AdityaOS: 60 FPS in-browser canvas with 0 external dependencies
*/
const FEATURED_PROJECTS: WorkCardProps[] = [
  {
    id: "janeval",
    title: "JANEVAL — Human-Centered AI Benchmark",
    client: "Josh Talks",
    year: "2024",
    role: "Lead Product Designer & Systems Architect",
    tags: ["AI Benchmark", "Healthcare UX", "Interaction Design"],
    summary:
      "A blind pairwise evaluation framework designed to benchmark frontier vision models on clinical and cultural accuracy across rural Indian public health scenarios.",
    metric: {
      value: "3.4x",
      label: "cultural fidelity gain over generic prompts",
    },
    imageSrc: "/case-studies/janeval_live.png",
    imageAlt: "JANEVAL AI Healthcare Evaluation Arena Interface",
    caseStudyUrl: "/work/janeval",
    liveUrl: "https://janeval.vercel.app/",
    priority: true,
  },
  {
    id: "mfine",
    title: "Corporate Benefits & Claims Settlement",
    client: "MFine",
    year: "2023",
    role: "Product Designer & Design Systems Lead",
    tags: ["Enterprise SaaS", "InsurTech", "Design Systems"],
    summary:
      "A unified claims orchestration portal and design system for HR teams and TPAs, automating employee census onboarding and cashless hospital pre-authorizations.",
    metric: {
      value: "100K+",
      label: "employees covered with <15 min approvals",
    },
    imageSrc: "/case-studies/corporate_claims.png",
    imageAlt: "MFine Corporate Claims and Benefits Architecture",
    caseStudyUrl: "/work/mfine",
  },
  {
    id: "mosaic",
    title: "21-Day Habit & Hair Regimen Tracker",
    client: "Mosaic Wellness (ManMatters)",
    year: "2024",
    role: "UX Researcher & Product Designer",
    tags: ["D2C HealthTech", "Behavioral Retention", "Habit Loops"],
    summary:
      "A routine retention engine pairing 1-tap daily micro-logs with automated doctor WhatsApp check-ins to prevent churn during delayed-gratification health regimens.",
    metric: {
      value: "+12%",
      label: "lift in treatment continuation past Day 21",
    },
    imageSrc: "/case-studies/hair_tracker.png",
    imageAlt: "21-Day Regimen Playbook Flow in Figma",
    caseStudyUrl: "/work/mosaic",
  },
  {
    id: "digiaccel",
    title: "UPI Limit Clarity & Spend Runway",
    client: "Digiaccel",
    year: "2024",
    role: "Product Designer (Fintech UX)",
    tags: ["Fintech", "Payments", "Error Recovery"],
    summary:
      "An ambient bank balance runway meter and 1-tap failover checkout flow that alerts users of daily transaction caps before payment initiation to eliminate payment failure anxiety.",
    metric: {
      value: "-38%",
      label: "dropoff reduction at checkout",
    },
    imageSrc: "/case-studies/upi_limit_meter_flow.png",
    imageAlt: "UPI Limit Clarity Screen Flow Stages",
    caseStudyUrl: "/work/digiaccel",
  },
  {
    id: "adityaos",
    title: "AdityaOS & Pixel Studio",
    client: "Independent System",
    year: "2024",
    role: "Creator & Systems Engineer",
    tags: ["Creative Sandbox", "Canvas Graphics", "Web Audio"],
    summary:
      "An in-browser retro operating system and pixel sandbox built with zero external runtime libraries, featuring Conway's Game of Life, falling sand physics, and WebAudio synth.",
    metric: {
      value: "60 FPS",
      label: "client-side rendering with zero canvas dependencies",
    },
    imageSrc: "/pixel_studio_og.png",
    imageAlt: "AdityaOS Interactive Web Desktop and Pixel Studio",
    caseStudyUrl: "/work/adityaos",
    liveUrl: "/os",
  },
];

interface EssaySummary {
  title: string;
  venue: string;
  year: string;
  url: string;
}

const FEATURED_WRITING: EssaySummary[] = [
  {
    title: "Identity In Youth Clubs In India",
    venue: "India Fellow",
    year: "2024",
    url: "https://indiafellow.org/blog/all-posts/identity-in-youth-clubs-in-india/",
  },
  {
    title: "Motivation In Rural Leadership Programs",
    venue: "India Fellow",
    year: "2024",
    url: "https://indiafellow.org/blog/all-posts/motivation-in-rural-leadership-programs/",
  },
  {
    title: "Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
    venue: "India Fellow",
    year: "2024",
    url: "https://indiafellow.org/blog/all-posts/balancing-act-navigating-choices-in-rural-rajasthans-water-crisis/",
  },
  {
    title: "Questions For Self-Discovery From A Human Process Lab",
    venue: "India Fellow",
    year: "2024",
    url: "https://indiafellow.org/blog/all-posts/questions-for-self-discovery-from-a-human-process-lab/",
  },
  {
    title: "Youth Masterpiece: Fostering Collaboration Through Art",
    venue: "India Fellow",
    year: "2024",
    url: "https://indiafellow.org/blog/all-posts/youth-masterpiece-fostering-collaboration-through-art/",
  },
  {
    title: "Why Online Gaming in India Feels So Toxic",
    venue: "Medium",
    year: "2024",
    url: "https://adityadiundi.medium.com/why-online-gaming-in-india-feels-so-toxic-1d506b87acf8",
  },
  {
    title: "On Borrowed Beliefs",
    venue: "Personal Essay",
    year: "2024",
    url: "/writing#on-borrowed-beliefs",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-stone-900 dark:text-stone-100 px-6 sm:px-8 py-12 sm:py-20 transition-colors">
      <main className="max-w-[700px] mx-auto space-y-20 sm:space-y-28">
        {/* ================================================================= */}
        {/* 1. HEADER */}
        {/* ================================================================= */}
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Aditya Diundi
            </h1>
            {/* TODO: Title decision - Product Designer vs Design Engineer */}
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Product Designer
            </p>
          </div>

          <nav aria-label="Main Navigation" className="flex items-center gap-6 text-sm">
            <a
              href="#work"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Work
            </a>
            <a
              href="#writing"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Writing
            </a>
            <a
              href="#about"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              About
            </a>
            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>
        </header>

        {/* ================================================================= */}
        {/* 2. HERO */}
        {/* ================================================================= */}
        <section aria-labelledby="hero-heading" className="space-y-6 pt-4">
          <div className="space-y-3">
            <h2 id="hero-heading" className="sr-only">
              Introduction
            </h2>
            <p className="text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
              Designing evidence-first health systems, AI evaluation benchmarks, and tools.
            </p>
            <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Designing software since 2021. Available for product design roles & select
              design engineering projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm pt-2">
            {/* TODO: Verify preferred contact email address (replacing college address adityadiundi.des21@iitr.ac.in) */}
            <a
              href="mailto:adityadiundi@gmail.com"
              className="font-medium text-stone-900 dark:text-stone-100 underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700 hover:decoration-stone-900 dark:hover:decoration-stone-100 transition-colors"
            >
              Email (adityadiundi@gmail.com)
            </a>
            <a
              href="https://www.linkedin.com/in/adityadiundi/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors inline-flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. WORK (5 FEATURED PROJECTS) */}
        {/* ================================================================= */}
        <section id="work" aria-labelledby="work-heading" className="space-y-8">
          <div className="flex items-baseline justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h2
              id="work-heading"
              className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100"
            >
              Selected Work
            </h2>
            <Link
              href="/work"
              className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              More work (archive) →
            </Link>
          </div>

          <div className="space-y-4">
            {FEATURED_PROJECTS.map((project) => (
              <WorkCard key={project.id} {...project} />
            ))}
          </div>

          <div className="pt-4 text-center sm:text-left">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-4"
            >
              <span>View additional projects: Ketto+, Aarohi Learnability Lab, Fieldwork →</span>
            </Link>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. WRITING (PLAIN LIST, 6–8 ITEMS) */}
        {/* ================================================================= */}
        <section id="writing" aria-labelledby="writing-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h2
              id="writing-heading"
              className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100"
            >
              Writing
            </h2>
            <Link
              href="/writing"
              className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              All essays →
            </Link>
          </div>

          <ul className="divide-y divide-stone-200 dark:divide-stone-800">
            {FEATURED_WRITING.map((essay, idx) => (
              <li key={idx} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 group">
                <a
                  href={essay.url}
                  target={essay.url.startsWith("http") ? "_blank" : undefined}
                  rel={essay.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-base font-medium text-stone-900 dark:text-stone-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{essay.title}</span>
                  {essay.url.startsWith("http") && (
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  )}
                </a>
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-shrink-0 font-mono">
                  <span>{essay.venue}</span>
                  <span>·</span>
                  <span>{essay.year}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ================================================================= */}
        {/* 5. ABOUT (BACKGROUND, EXPERIENCE, EDUCATION, SKILLS) */}
        {/* ================================================================= */}
        <section id="about" aria-labelledby="about-heading" className="space-y-8">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
            <h2
              id="about-heading"
              className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100"
            >
              About
            </h2>
          </div>

          <div className="space-y-4 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            <p>
              I am a product designer and design engineer based in India. Designing software
              since 2021, I work at the intersection of human-centered research, system architecture,
              and front-end code.
            </p>
            <p>
              My work spans frontier AI benchmarking for rural public health (JANEVAL), high-density
              enterprise claims pipelines (MFine), behavioral habit loops (Mosaic Wellness), and
              zero-dependency canvas engines (AdityaOS).
            </p>
          </div>

          {/* Experience List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono text-xs">
              Experience
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  {/* TODO: Verify exact current status / organization for 2024–Present */}
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Independent Product Designer
                  </span>
                  <span className="text-stone-500 dark:text-stone-400"> · Self-employed</span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  2024–Present
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Design Lead & Social Innovator
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {" "}
                    · India Fellow / Project Potential
                  </span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  2023–2024
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Product Design Intern
                  </span>
                  <span className="text-stone-500 dark:text-stone-400"> · MFine</span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  2023
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    Design Consultant
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {" "}
                    · Digiaccel / Mosaic Wellness
                  </span>
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  2022–2023
                </span>
              </li>
            </ul>
          </div>

          {/* Education */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono text-xs">
              Education
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  Bachelor of Design (B.Des)
                </span>
                <span className="text-stone-500 dark:text-stone-400">
                  {" "}
                  · Department of Design, IIT Roorkee
                </span>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                2021–2025
              </span>
            </div>
          </div>

          {/* Skills Line (Plain Comma-Separated, No Pills) */}
          <div className="pt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-200 dark:border-stone-800 pt-4">
            <span className="font-medium text-stone-900 dark:text-stone-200">Skills: </span>
            Systems Design, Interaction Design, Prototyping (Figma, React, TypeScript), Design
            Systems, Field Ethnography, Quantitative Benchmarking.
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. FOOTER */}
        {/* ================================================================= */}
        <footer className="border-t border-stone-200 dark:border-stone-800 pt-10 pb-16 space-y-6 text-sm">
          {/* Primary Text Links */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.linkedin.com/in/adityadiundi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/AdityaDiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://adityadiundi.bearblog.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Bear Blog
            </a>
            <a
              href="mailto:adityadiundi@gmail.com"
              className="text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Email
            </a>
          </div>

          {/* Understated Side Projects Line */}
          <div className="text-xs text-stone-500 dark:text-stone-400 space-x-1">
            <span>Side projects:</span>
            <Link
              href="/os"
              className="hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-2"
            >
              AdityaOS
            </Link>
            <span>·</span>
            <Link
              href="/pixel"
              className="hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-2"
            >
              Pixel Studio
            </Link>
            <span>·</span>
            <a
              href="https://youtube.com/@adityadiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-2"
            >
              YouTube Gaming
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-stone-400 dark:text-stone-600 font-mono">
            © 2021–{new Date().getFullYear()} Aditya Diundi · Typeset with system typography
          </div>
        </footer>
      </main>
    </div>
  );
}
