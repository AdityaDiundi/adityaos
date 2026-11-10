"use client";

import React from "react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

export const ResumeViewer: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote } = useSoundStore();

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="h-full overflow-y-auto select-text px-6 sm:px-12 md:px-16 py-10 sm:py-12"
    >
      <article className="max-w-2xl mx-auto space-y-10">
        {/* Document Header Zone */}
        <header className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-900 dark:text-zinc-100 leading-tight">
                Aditya Diundi
              </h1>
              <p className="font-mono text-xs text-stone-500 dark:text-zinc-400 mt-1">
                Product Designer &amp; Design Technologist · Delhi, India
              </p>
            </div>
            <a
              href="/Aditya_Diundi_Resume.pdf"
              download="Aditya_Diundi_Resume.pdf"
              className="font-mono text-xs text-stone-800 dark:text-zinc-200 hover:underline cursor-pointer flex-shrink-0 self-start sm:self-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 dark:focus-visible:ring-zinc-500"
            >
              Download PDF
            </a>
          </div>

          <div className="font-mono text-xs text-stone-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <a
              href="mailto:aditya15124@iiitd.ac.in"
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline"
            >
              aditya15124@iiitd.ac.in
            </a>
            <span>·</span>
            <a
              href="https://linkedin.com/in/adityadiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://github.com/AdityaDiundi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline"
            >
              GitHub
            </a>
            <span>·</span>
            <a
              href="https://diundi.space"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-950 dark:hover:text-zinc-100 hover:underline"
            >
              diundi.space
            </a>
          </div>
        </header>

        {/* Experience Section */}
        <section className="space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-zinc-100 border-b border-black/10 dark:border-white/10 pb-2">
            Experience
          </h2>

          {/* Role 1 */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                Freelance Product Designer
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                Oct 2025 – Present
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              Invenix &amp; Independent Clients
            </div>
            <p className="font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              Designed end-to-end web and mobile product experiences across discovery, user research, wireframing, and production engineering handoff. Delivered shipped interfaces balancing brand identity with functional usability for client ventures.
            </p>
          </div>

          {/* Role 2 */}
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                Product &amp; Program Design
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                Feb 2024 – Oct 2025
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              Project Potential (India Fellow Residency)
            </div>
            <div className="space-y-2 font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              <p>
                Built a real-time field attendance tracking tool with live location validation using Google Sheets, Apps Script, and HERE API across rural panchayats.
              </p>
              <p>
                Co-authored the Youth Resource Manual and designed community spaces to support youth leadership, peer learning, and civic participation. Conducted district-wide youth aspiration analysis with Power BI to guide program strategy.
              </p>
            </div>
          </div>

          {/* Role 3 */}
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                Product Designer
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                Jun 2022 – Dec 2022
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              Mosaic Wellness
            </div>
            <div className="space-y-2 font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              <p>
                Led product design for the habit tracker on the Man Matters app, onboarding 100+ users in week one with 22 regular weekly active users.
              </p>
              <p>
                Increased tracker-to-purchase conversion by 12 percent through contextual nudges and simplified checkout flows. Collaborated with engineering and product teams to define feature prioritization across Man Matters, Be Bodywise, and Little Joys.
              </p>
            </div>
          </div>

          {/* Role 4 */}
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                Product Designer
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                Nov 2021 – May 2022
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              MFine
            </div>
            <div className="space-y-2 font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              <p>
                Designed core patient-facing telehealth flows serving more than 100K daily active users across India.
              </p>
              <p>
                Streamlined the patient insurance claim settlement flow, reducing customer support tickets and accelerating verification cycles. Designed corporate onboarding and wallet management tools for B2B expansion.
              </p>
            </div>
          </div>

          {/* Role 5 */}
          <div className="space-y-1.5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                Product Designer
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                Sep 2020 – May 2021
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              Gemini Solutions
            </div>
            <p className="font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              Designed internal team management tools and an in-house community platform. Collaborated on financial technology projects, improving user onboarding and transaction flow completion.
            </p>
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-zinc-100 border-b border-black/10 dark:border-white/10 pb-2">
            Education
          </h2>

          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="font-serif text-base sm:text-[17px] font-medium text-stone-900 dark:text-zinc-100">
                B.Tech in Electronics and Communication Engineering
              </h3>
              <span className="font-mono text-xs text-stone-400 dark:text-zinc-500">
                2015 – 2021
              </span>
            </div>
            <div className="font-mono text-xs text-stone-500 dark:text-zinc-400">
              IIIT Delhi (Indraprastha Institute of Information Technology Delhi)
            </div>
            <p className="font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300 pt-1">
              Coursework focused on human-centered design, systems engineering, and creative computing.
            </p>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-zinc-100 border-b border-black/10 dark:border-white/10 pb-2">
            Capabilities
          </h2>

          <div className="space-y-3 font-serif text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-zinc-300">
            <div>
              <span className="font-mono text-xs text-stone-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Design &amp; Architecture
              </span>
              Product design from 0 to 1, interaction design, systems thinking, user research, wireframing, rapid prototyping, Figma design systems.
            </div>
            <div>
              <span className="font-mono text-xs text-stone-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Code &amp; Technology
              </span>
              TypeScript, Next.js, React, HTML5 Canvas, Web Audio DSP, Python, SQL, Linux shell environments, Google Workspace APIs, agentic AI development with Google Antigravity.
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <footer className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs text-stone-400 dark:text-zinc-500">
          <span>Aditya Diundi · Typeset Portfolio</span>
          <a
            href="/Aditya_Diundi_Resume.pdf"
            download="Aditya_Diundi_Resume.pdf"
            className="text-stone-700 dark:text-zinc-300 hover:underline"
          >
            Download PDF
          </a>
        </footer>
      </article>
    </div>
  );
};
