"use client";

import React from "react";
import { Download, Mail, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

export function ResumeSection() {
  const { activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  const experiences = [
    {
      role: "Lead Product Designer & Systems Architect",
      company: "JANEVAL · Independent Research",
      location: "Delhi / Remote",
      period: "2024",
      highlights: [
        "Architected an evidence-backed AI evaluation framework benchmarking cultural and clinical fidelity in rural Indian public health.",
        "Conducted 120+ pairwise blind evaluations with frontline health workers, achieving a 3.4x cultural fidelity lift over baseline frontier models.",
        "Engineered full frontend and evaluation scoring pipeline in Next.js, TypeScript, and Tailwind CSS.",
      ],
    },
    {
      role: "Product Designer (B2B Benefits & Claims)",
      company: "MFine",
      location: "Bengaluru / Remote",
      period: "2022 — 2023",
      highlights: [
        "Engineered patient claim settlement and cashless triage workflows handling 100K+ DAU, reducing pre-auth triage time to <15 mins.",
        "Redesigned corporate health benefits onboarding and allowance wallet management for enterprise HR admins.",
        "Authored multi-brand corporate component library maintaining 99.2% design-to-code audit reliability.",
      ],
    },
    {
      role: "Product Designer (Fintech UX)",
      company: "Digiaccel",
      location: "Gurugram / Remote",
      period: "2023",
      highlights: [
        "Architected ambient UPI limit runway meter and 1-tap split-payment failover, driving a 38% reduction in checkout drop-offs.",
        "Formulated proactive error recovery patterns across Tier-1 and PSU bank daily transaction counters.",
      ],
    },
    {
      role: "Product Designer (D2C Retention)",
      company: "Mosaic Wellness (ManMatters)",
      location: "Mumbai / Remote",
      period: "2023",
      highlights: [
        "Architected 21-Day Habit & Hair Regimen Engine to combat drop-off in delayed-gratification health regimens.",
        "Implemented 1-tap micro-commitment logs, milestone streaks, and WhatsApp doctor hotline, lifting cohort continuation by +12%.",
      ],
    },
    {
      role: "Systems Designer & Fellow",
      company: "Project Potential x India Fellow",
      location: "Kishangarh, Rajasthan",
      period: "2021 — 2022",
      highlights: [
        "Completed 20 months of grassroots rural immersion leading community systems development and ethnographic research across 40+ panchayats.",
        "Built real-time attendance tracking tool with live GPS validation (HERE API) and authored 12-module Youth Resource Manual.",
      ],
    },
  ];

  const skillCategories = [
    {
      name: "Product Design & Systems",
      skills: ["Interaction Design", "Figma Design Tokens", "Information Architecture", "Rapid Prototyping", "Design Specifications"],
    },
    {
      name: "Research & Behavioral Analytics",
      skills: ["Grassroots Ethnography", "Qualitative Synthesis", "Cognitive Walkthroughs", "Behavioral Nudges", "Power BI", "A/B Testing"],
    },
    {
      name: "Engineering & Stack",
      skills: ["Next.js & React", "TypeScript", "HTML5 Canvas 2D", "Web Audio API", "Tailwind CSS", "REST APIs", "Python"],
    },
  ];

  return (
    <section id="resume" className="relative w-full">
      <div
        className={`w-full relative transition-colors ${
          isDark
            ? "bg-[#090b10]/40"
            : "bg-[#FBFBF9]"
        }`}
      >
        {/* Section Header: Minimal Single-Tier Editorial Header */}
        <div
          className={`border-b border-solid border-stone-200/60 dark:border-zinc-800/60 px-6 sm:px-8 lg:px-12 py-5 flex items-baseline justify-between transition-colors ${
            isDark ? "border-zinc-800/80 bg-[#0c0e14]/70" : "border-stone-200/80 bg-white"
          }`}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-mono font-semibold text-emerald-500">04</span>
            <h2
              className={`text-lg sm:text-xl font-sans font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-stone-900"
              }`}
            >
              Experience
            </h2>
            <span
              className={`text-xs font-mono hidden sm:inline ${
                isDark ? "text-zinc-500" : "text-stone-400"
              }`}
            >
              — Career history & credentials
            </span>
          </div>

          <a
            href="/Aditya_Diundi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs font-mono hover:underline ${
              isDark ? "text-zinc-300 hover:text-white" : "text-stone-700 hover:text-stone-900"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Resume (PDF)</span>
          </a>
        </div>

        {/* 2-Column Split */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`grid grid-cols-1 lg:grid-cols-12 divide-y divide-stone-200/60 dark:divide-zinc-800/60 lg:divide-y-0 lg:divide-x lg:divide-stone-200/60 dark:divide-zinc-800/60 border-b border-solid border-stone-200/60 dark:border-zinc-800/60 transition-colors ${
            isDark
              ? "border-zinc-800/80 divide-zinc-800/80"
              : "border-stone-200/80 divide-stone-200/80"
          }`}
        >
          {/* Work History (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div
              className={`text-xs font-mono uppercase tracking-wider pb-1 ${
                isDark ? "text-zinc-500" : "text-stone-500"
              }`}
            >
              Work History
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="pb-6 border-b border-solid border-stone-200/60 dark:border-zinc-800/60 border-stone-200/70 dark:border-zinc-800/70 last:border-b-0 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono">
                    <span
                      className={`font-bold text-base font-sans tracking-tight ${
                        isDark ? "text-white" : "text-stone-900"
                      }`}
                    >
                      {exp.role}
                    </span>
                    <span className={isDark ? "text-zinc-500" : "text-stone-400"}>
                      {exp.period}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs font-mono ${
                      isDark ? "text-zinc-400" : "text-stone-600"
                    }`}
                  >
                    <strong
                      className={`font-semibold ${
                        isDark ? "text-zinc-200" : "text-stone-800"
                      }`}
                    >
                      {exp.company}
                    </strong>
                    <span>·</span>
                    <span>{exp.location}</span>
                  </div>

                  <ul
                    className={`space-y-1.5 text-xs sm:text-sm font-sans leading-relaxed pt-1 ${
                      isDark ? "text-zinc-400" : "text-stone-600"
                    }`}
                  >
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1 flex-shrink-0 text-xs">
                          ›
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Skills (5 Cols) */}
          <div
            className={`lg:col-span-5 p-6 sm:p-8 space-y-7 transition-colors ${
              isDark ? "bg-[#090b10]/40" : "bg-stone-50/50"
            }`}
          >
            {/* Education */}
            <div className="pb-6 border-b border-solid border-stone-200/60 dark:border-zinc-800/60 border-stone-200/70 dark:border-zinc-800/70 space-y-2">
              <div
                className={`text-xs font-mono uppercase tracking-wider ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Education
              </div>
              <h4
                className={`font-bold text-base font-sans ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                B.Tech in Electronics & Communication Engineering
              </h4>
              <div
                className={`text-xs font-mono ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Indraprastha Institute of Information Technology Delhi (IIIT Delhi)
              </div>
              <div
                className={`text-xs font-sans pt-0.5 leading-relaxed ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                2015 — 2021 · Foundation in Signal Processing, Human-Computer Interaction & Systems.
              </div>
            </div>

            {/* Skills & Toolkit */}
            <div className="pb-6 border-b border-solid border-stone-200/60 dark:border-zinc-800/60 border-stone-200/70 dark:border-zinc-800/70 space-y-3">
              <div
                className={`text-xs font-mono uppercase tracking-wider ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Skills & Toolkit
              </div>
              <div className="space-y-3">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className={`text-xs font-mono font-medium ${
                        isDark ? "text-zinc-300" : "text-stone-700"
                      }`}
                    >
                      {cat.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
                      {cat.skills.map((s, i) => (
                        <span key={i} className="flex items-center gap-2">
                          <span className={isDark ? "text-zinc-400" : "text-stone-600"}>
                            {s}
                          </span>
                          {i < cat.skills.length - 1 && (
                            <span className={isDark ? "text-zinc-600" : "text-stone-300"}>
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact */}
            <div className="space-y-2.5 text-xs font-mono">
              <div
                className={`uppercase tracking-wider ${
                  isDark ? "text-zinc-500" : "text-stone-500"
                }`}
              >
                Direct Contact
              </div>
              <p
                className={`text-xs font-sans leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                Delhi NCR. Available for full-time Product Designer & Design Technologist roles (Remote / Hybrid / Relocation).
              </p>
              <div className="space-y-1.5 pt-1 font-mono">
                <a
                  href="https://www.linkedin.com/in/adityadiundi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 transition-colors text-xs hover:underline ${
                    isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-900"
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>linkedin.com/in/adityadiundi</span>
                </a>
                <a
                  href="mailto:aditya15124@iiitd.ac.in"
                  className={`flex items-center gap-2 transition-colors text-xs hover:underline ${
                    isDark ? "text-zinc-300 hover:text-white" : "text-stone-800 hover:text-black"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>aditya15124@iiitd.ac.in</span>
                </a>
                <div
                  className={`flex items-center gap-2 text-xs ${
                    isDark ? "text-zinc-400" : "text-stone-600"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>+91 8510860382</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
