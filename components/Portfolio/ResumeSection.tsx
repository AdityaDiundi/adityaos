"use client";

import React from "react";
import { Download, Mail, Phone, ExternalLink } from "lucide-react";

export function ResumeSection() {
  const experiences = [
    {
      role: "Freelance Product Designer",
      company: "Invenix & Independent Clients",
      period: "Oct 2025 — Present",
      location: "Delhi, India",
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
      location: "Bihar & Kumaon, India",
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
      location: "Mumbai / Remote",
      highlights: [
        "Designed and shipped the 21-Day Habit & Hair Tracker on the ManMatters app: onboarded 100+ users in week 1, 22 weekly active users, and drove a +12% increase in purchase conversion.",
        "Redesigned the BeBodywise e-commerce cart, checkout, and product detail pages to optimize D2C cross-selling.",
        "Conducted user interviews with health consumers to map delayed-gratification churn and engineered tactile streak-lock mechanics.",
      ],
    },
    {
      role: "Product Designer",
      company: "MFine (HealthTech & InsurTech)",
      period: "Nov 2021 — May 2022",
      location: "Bengaluru / Hybrid",
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
      name: "Product & Systems",
      skills: ["Information Architecture", "Wireframing & Prototyping", "Design Systems (Figma)", "Edge-Case Analysis", "Usability Testing", "Design Tokens"],
    },
    {
      name: "Research & Field",
      skills: ["Grassroots Fieldwork", "Qualitative Synthesis", "Cognitive Walkthroughs", "Behavioral Nudges", "Power BI Analysis", "A/B Testing"],
    },
    {
      name: "Technical Depth",
      skills: ["B.Tech ECE (IIIT Delhi)", "React & Next.js", "TypeScript", "Tailwind CSS", "Python (Data/Scraping)", "REST APIs"],
    },
  ];

  return (
    <section id="resume" className="relative">
      <div className="max-w-7xl mx-auto border-x border-zinc-800 relative bg-zinc-950/40">
        {/* Section Header */}
        <div className="border-b border-zinc-800 p-8 sm:p-12 lg:p-14 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <span className="absolute -top-2 -left-2 font-mono text-xs text-zinc-600 select-none">+</span>
          <span className="absolute -top-2 -right-2 font-mono text-xs text-zinc-600 select-none">+</span>

          <div className="space-y-3">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              04 // Experience & Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
              Career history & credentials.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl pt-1 leading-relaxed">
              Over 3 years designing product architectures across healthcare, fintech, and rural education.
            </p>
          </div>

          <a
            href="/Aditya_Diundi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-mono text-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Resume (PDF)</span>
          </a>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 border-b border-zinc-800">
          {/* Work History (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-8">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider pb-1">
              Work History
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-7 sm:p-8 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
                    <span className="text-white font-bold text-lg font-sans tracking-tight">{exp.role}</span>
                    <span className="text-zinc-500">{exp.period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <strong className="text-zinc-200 font-semibold">{exp.company}</strong>
                    <span>·</span>
                    <span>{exp.location}</span>
                  </div>

                  <ul className="space-y-2 text-sm text-zinc-400 font-sans leading-relaxed pt-2">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-emerald-500/80 mt-1 flex-shrink-0 text-xs">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Skills (5 Cols) */}
          <div className="lg:col-span-5 p-8 sm:p-12 space-y-8 bg-zinc-950/40">
            {/* Education */}
            <div className="p-7 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 shadow-sm">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Education
              </div>
              <h4 className="font-bold text-base text-white font-sans">
                B.Tech in Electronics & Communication Engineering
              </h4>
              <div className="text-xs font-mono text-zinc-400">
                Indraprastha Institute of Information Technology Delhi (IIIT Delhi)
              </div>
              <div className="text-xs font-sans text-zinc-500 pt-1 leading-relaxed">
                2015 — 2021 · Foundation in Signal Processing, Human-Computer Interaction & Systems.
              </div>
            </div>

            {/* Skills */}
            <div className="p-7 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-4 shadow-sm">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Skills & Toolkit
              </div>
              <div className="space-y-4">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-xs font-mono text-zinc-400 font-medium">{cat.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="p-7 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 text-xs font-mono shadow-sm">
              <div className="text-zinc-500 uppercase tracking-wider">
                Direct Contact
              </div>
              <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                Based in Delhi. Open for full-time product designer roles, systems architecture, and design advisory.
              </p>
              <div className="space-y-2 pt-1 text-zinc-300">
                <a
                  href="mailto:aditya15124@iiitd.ac.in"
                  className="flex items-center gap-2 hover:text-white transition-colors text-xs"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>aditya15124@iiitd.ac.in</span>
                </a>
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Phone className="w-4 h-4 text-zinc-500" />
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
