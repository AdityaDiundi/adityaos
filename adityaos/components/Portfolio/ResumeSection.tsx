"use client";

import React from "react";
import { FileText, Download, Mail, Phone, ExternalLink, Briefcase, GraduationCap, Code2, Sparkles } from "lucide-react";

export function ResumeSection() {
  const experiences = [
    {
      role: "Product Designer & Systems Thinker",
      company: "Independent / High-Agency Products",
      period: "2023 — Present",
      location: "Delhi, India (Immediately Available)",
      highlights: [
        "Architected JANEVAL: an evidence-backed AI evaluation framework benchmarking LLM image models for Indian public health.",
        "Designed UPI Limit Clarity payment flows reducing transaction anxiety via proactive daily spend runway meters.",
        "Built behavioral habit-retention loop for D2C hair health regimens lifting Day 14 cohort adherence by +44%.",
      ],
    },
    {
      role: "Grassroots Fellow & Field Systems Researcher",
      company: "India Fellow · Aarohi (Rural Uttarakhand)",
      period: "2022 — 2023",
      location: "Peora, Nainital, Uttarakhand",
      highlights: [
        "Led 1-year immersive ethnographic study on first-generation learners and rural health infrastructure.",
        "Authored the Learnability Diagnostic Framework across 100+ students, decoupling cognitive aptitude from language barriers.",
        "Facilitated participatory design sessions with ASHA workers to optimize village health data workflows.",
      ],
    },
    {
      role: "Product & UI/UX Designer",
      company: "Tech Startups & Design Consultancies",
      period: "2021 — 2022",
      location: "Remote / Hybrid",
      highlights: [
        "Designed high-density enterprise SaaS benefits management portal (Corporate Claims & Arbiter).",
        "Streamlined onboarding and recurring donor flows for social crowdfunding platforms (Ketto+).",
        "Created full design systems and component libraries in Figma with strict accessibility tokens.",
      ],
    },
  ];

  const skillCategories = [
    {
      name: "Product Design & Craft",
      skills: ["Information Architecture", "Wireframing & Prototyping", "Figma Design Systems", "Edge-Case Analysis", "Usability Testing", "Design Tokens"],
    },
    {
      name: "Systems & Field Research",
      skills: ["Grassroots Ethnography", "Qualitative Synthesis", "Cognitive Walkthroughs", "Behavioral Nudges", "Participatory Mapping", "A/B Testing"],
    },
    {
      name: "Technical & Agentic AI",
      skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Python (Data/Scraping)", "Git & Shell Scripting", "Agentic AI Orchestration"],
    },
  ];

  return (
    <section id="resume" className="py-20 relative border-t border-white/10 bg-[#07090c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5" />
              Verified Career Trajectory
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Experience, education & proven execution.
            </h2>
          </div>

          {/* Direct Download Button */}
          <div className="flex items-center gap-3">
            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-semibold font-mono text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)]"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Resume (PDF)</span>
            </a>
          </div>
        </div>

        {/* 2-Column: Left Experience, Right Skills & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Experience Column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Work History
            </h3>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-cyan-400 font-semibold text-sm font-sans">{exp.role}</span>
                    <span className="text-zinc-500">{exp.period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <strong className="text-zinc-200">{exp.company}</strong>
                    <span>·</span>
                    <span>{exp.location}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education & Skills */}
          <div className="lg:col-span-5 space-y-6">
            {/* Education Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Education
              </h3>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-white font-sans">
                  B.Tech in Electronics & Communication Engineering
                </h4>
                <div className="text-xs font-mono text-emerald-400">
                  Indraprastha Institute of Information Technology (IIIT Delhi)
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  2015 — 2021 · Focus on Signal Systems, Human-Computer Interaction & Systems
                </div>
              </div>
            </div>

            {/* Skills Matrix */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Competency Matrix
              </h3>

              <div className="space-y-4">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-xs font-mono font-semibold text-zinc-300">{cat.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-emerald-950/30 border border-cyan-500/30 space-y-3 text-xs font-mono">
              <div className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Let&apos;s Connect
              </div>
              <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                Currently in Delhi, open to full-time Product Designer roles, Lead UX, and high-impact design systems consulting.
              </p>
              <div className="space-y-2 pt-1 text-zinc-300">
                <a
                  href="mailto:aditya15124@iiitd.ac.in"
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>aditya15124@iiitd.ac.in</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 8510860382</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
