"use client";

import React, { useState } from "react";
import {
  Download,
  Printer,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code,
  Layers,
  Sparkles,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Eye,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

export const ResumeViewer: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote } = useSoundStore();
  const [activeTab, setActiveTab] = useState<"visual" | "pdf" | "markdown">("visual");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full font-mono text-xs select-text overflow-hidden"
    >
      {/* Top Action Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-9 border-b px-3 flex items-center justify-between flex-shrink-0 select-none"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
          <span className="font-bold text-[11px]">Aditya_Diundi_Resume.pdf</span>
          <span className="text-[10px] opacity-60 hidden sm:inline">// IIIT Delhi • Product Designer</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* View Mode Toggle */}
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="flex items-center rounded border p-0.5 text-[10px]"
          >
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              style={{
                backgroundColor: activeTab === "visual" ? activeTheme.accent : "transparent",
                color:
                  activeTab === "visual"
                    ? activeTheme.isDark
                      ? "#000"
                      : "#fff"
                    : activeTheme.textMuted,
              }}
              className="px-2 py-0.5 rounded font-semibold transition-colors"
            >
              Formatted
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pdf")}
              style={{
                backgroundColor: activeTab === "pdf" ? activeTheme.accent : "transparent",
                color:
                  activeTab === "pdf"
                    ? activeTheme.isDark
                      ? "#000"
                      : "#fff"
                    : activeTheme.textMuted,
              }}
              className="px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1"
            >
              <Eye className="w-2.5 h-2.5" />
              <span>PDF Embed</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("markdown")}
              style={{
                backgroundColor: activeTab === "markdown" ? activeTheme.accent : "transparent",
                color:
                  activeTab === "markdown"
                    ? activeTheme.isDark
                      ? "#000"
                      : "#fff"
                    : activeTheme.textMuted,
              }}
              className="px-2 py-0.5 rounded font-semibold transition-colors"
            >
              RAW .MD
            </button>
          </div>

          <a
            href="/Aditya_Diundi_Resume.pdf"
            download="Aditya_Diundi_Resume.pdf"
            title="Download PDF"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-semibold hover:opacity-80 transition-opacity"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">DOWNLOAD</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            title="Print or Save PDF"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: activeTheme.accent,
            }}
            className="flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-semibold hover:opacity-80 transition-opacity"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">PRINT</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {activeTab === "visual" ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header / Identity */}
            <div
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-5 rounded-lg border shadow-sm relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: activeTheme.accent }}>
                    Aditya Diundi
                  </h1>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    Product Designer & Systems Thinker
                  </p>
                  <p className="text-[11px] opacity-75 mt-1 max-w-lg leading-relaxed">
                    3+ years of experience designing and shipping user-centric digital products across startups, social impact, and freelance client work. Skilled at leading cross-functional initiatives, crafting intuitive user experiences, and applying product thinking.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-1.5 text-[11px] opacity-80 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" style={{ color: activeTheme.accent }} />
                    <a href="mailto:aditya15124@iiitd.ac.in" className="hover:underline">
                      aditya15124@iiitd.ac.in
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" style={{ color: activeTheme.accent }} />
                    <span>+91 8510860382</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" style={{ color: activeTheme.accent }} />
                    <span>India (Immediately Available)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <a
                      href="https://adityaos-delta.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5 text-cyan-400 font-semibold"
                    >
                      adityaos-delta.vercel.app <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-red-400" />
                    <a
                      href="https://youtube.com/@falsepeek"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5 text-red-400"
                    >
                      youtube.com/@falsepeek <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Competencies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>PRODUCT & DESIGN</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• Figma / Adobe XD / Sketch</div>
                  <div>• Rapid Prototyping & Wireframing</div>
                  <div>• Usability Testing & Research</div>
                  <div>• Systems Thinking & UI/UX</div>
                  <div>• Power BI / Tableau Analytics</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-emerald-400">
                  <Code className="w-3.5 h-3.5" />
                  <span>TECH & CREATIVE CODE</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• Next.js / TypeScript / React</div>
                  <div>• Google App Script & APIs</div>
                  <div>• HTML5 Canvas & Web Audio DSP</div>
                  <div>• Python / SQL / Linux Shells</div>
                  <div>• WordPress & Web Deployments</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-3.5 rounded border"
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LEADERSHIP & CRAFT</span>
                </div>
                <div className="space-y-1 text-[11px] opacity-80">
                  <div>• Cross-functional Collaboration</div>
                  <div>• Workshop Facilitation</div>
                  <div>• Bilingual Storytelling & Essays</div>
                  <div>• Stakeholder Management</div>
                  <div>• Visual Communication</div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.accent }}>
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Experience</span>
              </div>

              {/* Role 1 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm" style={{ color: activeTheme.accent }}>
                    Freelance Product Designer — Invenix & Independent Clients
                  </span>
                  <span className="text-[10px] opacity-60">Oct 2025 – Present</span>
                </div>
                <ul className="text-xs opacity-85 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Designed end-to-end website and product experiences for Invenix and clients across web and mobile platforms.</li>
                  <li>Owned projects independently from discovery through delivery — user research, wireframing, UI design, and engineer handoff.</li>
                  <li>Delivered live, production-shipped design work balancing brand identity with usability.</li>
                </ul>
              </div>

              {/* Role 2 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-emerald-400">
                    Product & Program Design — Project Potential x India Fellow
                  </span>
                  <span className="text-[10px] opacity-60">Feb 2024 – Oct 2025</span>
                </div>
                <ul className="text-xs opacity-85 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Built a real-time, no-code attendance tracker with live location validation using Google Sheets, App Script, and HERE API.</li>
                  <li>Co-authored a Youth Resource Manual and designed group activities and youth club layouts to foster leadership and civic participation.</li>
                  <li>Led visual design for program reports, decks, and communication materials shared with partners and funders.</li>
                  <li>Conducted district-wide data analysis on youth aspirations using Power BI to inform program strategy.</li>
                  <li>Facilitated design thinking workshops and participatory co-creation with rural youth and stakeholders.</li>
                </ul>
              </div>

              {/* Role 3 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-amber-400">
                    Product Designer — Mosaic Wellness
                  </span>
                  <span className="text-[10px] opacity-60">Jun 2022 – Dec 2022</span>
                </div>
                <ul className="text-xs opacity-85 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Led UX for habit tracker on ManMatters app; onboarded 100+ users in week one, with 22 regular weekly active users.</li>
                  <li>Increased tracker-to-product purchase conversion by 12% through nudge flows and simplified CTA redesigns.</li>
                  <li>Coordinated with PMs and engineers to define delivery TATs and feature prioritization; contributed to BeBodywise and LittleJoys.</li>
                </ul>
              </div>

              {/* Role 4 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-cyan-400">
                    Product Designer — MFine
                  </span>
                  <span className="text-[10px] opacity-60">Nov 2021 – May 2022</span>
                </div>
                <ul className="text-xs opacity-85 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Designed core patient-side app flows used by over 100K daily users.</li>
                  <li>Developed corporate onboarding and wallet management tools for B2B expansion.</li>
                  <li>Led UX revamp of user-facing claim settlement flow, reducing support tickets and enhancing patient satisfaction.</li>
                </ul>
              </div>

              {/* Role 5 */}
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-sm text-purple-400">
                    Product Designer — Gemini Solutions
                  </span>
                  <span className="text-[10px] opacity-60">Sep 2020 – May 2021</span>
                </div>
                <ul className="text-xs opacity-85 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Designed internal employee management tools and an in-house social media platform.</li>
                  <li>Collaborated on FinTech projects, leading redesigns to enhance usability and feature adoption.</li>
                </ul>
              </div>
            </div>

            {/* Internships & Early Work */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.accent }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Internships & Visual Media</span>
              </div>
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border space-y-3"
              >
                <div>
                  <div className="font-bold text-xs">Visual Design Intern — GeeksforGeeks</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Managed visual identity for YouTube and contest channels; increased content views and engagement. Designed digital assets for social media and marketing campaigns.
                  </div>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <div className="font-bold text-xs">Tech Intern & Graphic Designer — CampK12</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Taught app development and coding to school students during summer tech camps; created infographics and course content.
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.accent }}>
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education</span>
              </div>
              <div
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-4 rounded border flex flex-col sm:flex-row justify-between sm:items-center gap-2"
              >
                <div>
                  <div className="font-bold text-sm">B.Tech in Electronics and Communication Engineering</div>
                  <div className="text-xs text-emerald-400 font-semibold">IIIT Delhi (Indraprastha Institute of Information Technology Delhi)</div>
                  <div className="text-[11px] opacity-70">Focus on Human-Centered Design, Systems Engineering & Creative Computing</div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded border border-white/10 font-mono flex-shrink-0">
                  2015 – 2021
                </span>
              </div>
            </div>
          </div>
        ) : activeTab === "pdf" ? (
          /* Embedded PDF Viewer Mode */
          <div className="h-full w-full flex flex-col rounded-lg overflow-hidden border border-white/10">
            <iframe
              src="/Aditya_Diundi_Resume.pdf#toolbar=1&navpanes=0"
              title="Aditya Diundi Resume PDF"
              className="w-full h-[calc(100vh-220px)] border-none rounded-lg bg-neutral-900"
            />
          </div>
        ) : (
          /* Raw Markdown View */
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-4 rounded border max-w-3xl mx-auto"
          >
            <pre className="text-xs whitespace-pre-wrap leading-relaxed opacity-90 select-text font-mono">
{`# ADITYA DIUNDI
Product Designer & Systems Thinker
Portfolio: https://adityaos-delta.vercel.app/ | Email: aditya15124@iiitd.ac.in | Phone: +91 8510860382
YouTube: @falsepeek | Education: B.Tech in Electronics & Communication Engineering — IIIT Delhi (2015 – 2021)
Status: Immediately Available

---

### SUMMARY
Product Designer and Systems Thinker with 3+ years of experience designing and shipping user-centric digital products across startups, social impact, and freelance client work. Skilled at leading cross-functional initiatives, crafting intuitive user experiences, and applying product thinking in ambiguous, high-impact settings.

---

### EXPERIENCE

#### Freelance Product Designer — Invenix & Independent Clients
Oct 2025 – Present
- Designed end-to-end website and product experiences for Invenix and clients across web and mobile platforms
- Owned projects independently from discovery through delivery — user research, wireframing, UI design, and handoff
- Delivered live, production-shipped design work balancing brand identity with usability

#### Product & Program Design — Project Potential x India Fellow
Feb 2024 – Oct 2025
- Built a real-time, no-code attendance tracker with live location validation using Google Sheets, App Script, and HERE API
- Co-authored a Youth Resource Manual and designed group activities and youth club layouts to foster leadership and civic participation
- Led visual design for program reports, decks, and communication materials shared with partners and funders
- Conducted district-wide data analysis on youth aspirations using Power BI to inform program strategy
- Facilitated design thinking workshops and participatory co-creation with rural youth and stakeholders

#### Product Designer — Mosaic Wellness
Jun 2022 – Dec 2022
- Led UX for habit tracker on ManMatters app; onboarded 100+ users in week one, with 22 regular weekly users
- Increased tracker-to-product purchase conversion by 12% through nudge flows and simplified CTA redesigns
- Coordinated with PMs and engineers to define delivery TATs and feature prioritization
- Contributed to BeBodywise and LittleJoys with consistent UX delivery across platforms

#### Product Designer — MFine
Nov 2021 – May 2022
- Designed core patient-side app flows used by over 100K daily users
- Developed corporate onboarding and wallet management tools for B2B expansion
- Led UX revamp of user-facing claim settlement flow, reducing support tickets and enhancing satisfaction

#### Product Designer — Gemini Solutions
Sep 2020 – May 2021
- Designed internal employee management tools and an in-house social media platform
- Collaborated on FinTech projects, leading redesigns to enhance usability and feature adoption

---

### INTERNSHIPS
- Visual Design Intern — GeeksforGeeks (YouTube visual identity, digital assets)
- Tech Intern & Graphic Designer — CampK12 (App dev teaching, infographics)

---

### SKILLS & TOOLS
- Product & Design: Figma, Adobe XD, Sketch, Power BI, Tableau, Rapid Prototyping, Wireframing, Usability Testing, Branding, UI/UX, Systems Thinking
- Tech & Data: Next.js, TypeScript, Canvas API, Web Audio API, Google App Script, HTML/CSS, WordPress, Python, SQL, Linux
- Collaboration: Cross-functional Collaboration, Facilitation, Storytelling, Visual Communication, Stakeholder Management
`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
