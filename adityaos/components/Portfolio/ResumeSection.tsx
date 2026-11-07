"use client";

import React from "react";
import { Download, Mail, Phone, ExternalLink, Briefcase, GraduationCap, Code2, Sparkles } from "lucide-react";

export function ResumeSection() {
  const experiences = [
    {
      role: "Freelance Product Designer",
      company: "Invenix & Independent Clients",
      period: "Oct 2025 — Present",
      location: "Delhi, India (Immediately Available)",
      highlights: [
        "Partnering with founders and research labs to design 0-to-1 systems, developer tools, and consumer platforms.",
        "Architected JANEVAL: an evidence-backed double-blind AI evaluation framework benchmarking multimodal vision models for Indian public health.",
        "Designed UPI Limit Clarity payment flows reducing checkout dropoff via proactive daily spend runway meters and 1-tap bank split routing.",
      ],
    },
    {
      role: "Product & Program Design",
      company: "Project Potential x India Fellow",
      period: "Feb 2024 — Oct 2025",
      location: "Kumaon & Bihar, India",
      highlights: [
        "Designed and deployed a real-time attendance tracker with live location validation using HERE API and Google Apps Script.",
        "Authored the comprehensive Youth Resource Manual comprising 12 structured modules on career readiness and experiential learning.",
        "Led quantitative data analysis of student attendance and dropout patterns using Power BI to inform rural policy interventions.",
      ],
    },
    {
      role: "Product Designer",
      company: "Mosaic Wellness (ManMatters, BeBodywise)",
      period: "Jun 2022 — Dec 2022",
      location: "Mumbai, India / Remote",
      highlights: [
        "Designed and shipped the 21-Day Habit & Hair Tracker on the ManMatters app: onboarded 100+ users in week 1, 22 weekly active users, and drove a +12% increase in purchase conversion.",
        "Redesigned the BeBodywise e-commerce cart, checkout, and product detail pages to optimize D2C cross-selling and reduce cart abandonment.",
        "Conducted user interviews with health consumers to map delayed-gratification churn and engineered tactile streak-lock mechanics.",
      ],
    },
    {
      role: "Product Designer",
      company: "MFine (HealthTech & InsurTech)",
      period: "Nov 2021 — May 2022",
      location: "Bengaluru, India / Hybrid",
      highlights: [
        "Designed B2B corporate onboarding and wallet management tools enabling HR admins to seamlessly manage employee policy allowances and benefits.",
        "Overhauled the patient claim settlement and cashless hospitalization triage flow for 100K+ daily active users, eliminating TPA latency and minimizing claim rejections.",
        "Created scalable Figma component libraries adhering strictly to token-based design systems and accessibility standards.",
      ],
    },
    {
      role: "Product Designer",
      company: "Gemini Solutions",
      period: "Sep 2020 — May 2021",
      location: "Gurugram, India",
      highlights: [
        "Designed internal HRMS enterprise portal and interactive FinTech transaction flows.",
        "Collaborated with front-end engineers to ensure pixel-perfect design token parity across complex table interactions.",
      ],
    },
  ];

  const skillCategories = [
    {
      name: "Product Design & Systems",
      skills: ["Information Architecture", "Wireframing & High-Fidelity Prototyping", "Design Systems (Figma)", "Edge-Case Analysis", "Usability Testing", "Design Tokens"],
    },
    {
      name: "Research & Ethnography",
      skills: ["Grassroots Fieldwork", "Qualitative Synthesis", "Cognitive Walkthroughs", "Behavioral Nudges", "Power BI Data Analysis", "A/B Testing"],
    },
    {
      name: "Technical Foundations",
      skills: ["B.Tech ECE (IIIT Delhi)", "React & Next.js", "TypeScript", "Tailwind CSS", "Python (Data/Scraping)", "HERE Maps & REST APIs"],
    },
  ];

  return (
    <section id="resume" className="relative">
      {/* Outer Continuous Structural Grid Container */}
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header Row */}
        <div className="border-b border-zinc-800 p-6 sm:p-10 lg:p-12 relative">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-200 font-semibold uppercase tracking-wider">03 // EXPERIENCE & CREDENTIALS</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">VERIFIED CAREER TRAJECTORY</span>
            </div>

            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-semibold font-mono text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-950" />
              <span>Download Official Resume (PDF)</span>
            </a>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-zinc-100 tracking-[-0.035em] leading-[1.05]">
              Experience, education & verified execution.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Grounding user empathy in engineering rigor across B2B enterprise SaaS, consumer health, and grassroots field deployments.
            </p>
          </div>
        </div>

        {/* 2-Column Split Snapped into Continuous Structural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 border-b border-zinc-800">
          {/* Experience Column (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 pb-2">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Work History</span>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-colors shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-cyan-400 font-semibold text-base font-sans">{exp.role}</span>
                    <span className="text-zinc-500">{exp.period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <strong className="text-zinc-200">{exp.company}</strong>
                    <span>·</span>
                    <span>{exp.location}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1 flex-shrink-0">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education, Skills & Contact (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-8 bg-zinc-950/40">
            {/* Education Card */}
            <div className="p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Education</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm sm:text-base text-white font-sans">
                  B.Tech in Electronics & Communication Engineering
                </h4>
                <div className="text-xs font-mono text-emerald-400">
                  Indraprastha Institute of Information Technology Delhi (IIIT Delhi)
                </div>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  2015 — 2021 · Rigorous foundation in Signal Processing, Human-Computer Interaction & Embedded Systems.
                </div>
              </div>
            </div>

            {/* Skills Matrix */}
            <div className="p-6 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Competency Matrix</span>
              </div>

              <div className="space-y-4">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-xs font-mono font-semibold text-zinc-300">{cat.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300"
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
            <div className="p-6 rounded-xl bg-zinc-950/90 border border-cyan-500/30 space-y-3 text-xs font-mono shadow-sm">
              <div className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Open for Core Design Roles</span>
              </div>
              <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                Based in Delhi, India. Open to full-time Product Designer roles, Lead Systems UX, and high-impact design systems consulting.
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
