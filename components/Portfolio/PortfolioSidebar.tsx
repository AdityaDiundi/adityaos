"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FileText,
  Mail,
  Github,
  Youtube,
  Globe,
  Palette,
  Check,
  Copy,
  Terminal as TerminalIcon,
} from "lucide-react";
import { useThemeStore, OSThemeId } from "@/store/themeStore";
import { SHIPPED_PROJECTS, ProjectSpec } from "./projectsData";
import { POETRY_LINES, PoetryLine } from "./poetryData";

interface PortfolioSidebarProps {
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
  onLaunchOS: () => void;
}

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

export function PortfolioSidebar({
  activeFilter,
  onSelectFilter,
  onLaunchOS,
}: PortfolioSidebarProps) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>("janeval");
  const [activeObservedModule, setActiveObservedModule] = useState<string>("work");
  const { currentThemeId, setTheme, activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  // Terminal Log State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "mounted module 01 (7 systems)",
    "focus: janeval/arena",
    "idle... try: help",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Poetry Accent State (Rotates on page load only)
  const [currentPoem, setCurrentPoem] = useState<PoetryLine>(POETRY_LINES[0]);

  useEffect(() => {
    // Deterministic or page-load random rotation
    const idx = Math.floor(Math.random() * POETRY_LINES.length);
    setCurrentPoem(POETRY_LINES[idx]);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("aditya15124@iiitd.ac.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const feedToggles = [
    { id: "all", prefix: "00", label: "All Modules", count: "27" },
    { id: "work", prefix: "01", label: "Shipped Systems", count: "7" },
    { id: "essays", prefix: "02", label: "Fieldwork & Essays", count: "14" },
    { id: "youtube", prefix: "03", label: "Watch Games", count: "20" },
    { id: "resume", prefix: "04", label: "Experience & Specs", count: "5" },
  ];

  const themeOptions: { id: OSThemeId; label: string; tag: string }[] = [
    { id: "light", label: "Editorial Newspaper", tag: "Light" },
    { id: "noctalia", label: "Obsidian Void", tag: "Dark" },
    { id: "caelestia", label: "Nordic Frost", tag: "Slate" },
    { id: "matrix", label: "Terminal Mono", tag: "Phosphor" },
  ];

  // =========================================================================
  // Scroll-Spy: Observe sections & projects to synchronize left & right panes
  // =========================================================================
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const projectElements = document.querySelectorAll("[data-project-id]");
    const projectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pId = entry.target.getAttribute("data-project-id");
            if (pId && pId !== "fieldwork") {
              setActiveProjectId(pId);
              setActiveObservedModule("work");
              setTerminalLogs((prev) => [
                ...prev.slice(-2),
                `focus: ${pId}`,
              ]);
            }
          }
        });
      },
      { rootMargin: "-15% 0px -40% 0px", threshold: 0.2 }
    );

    projectElements.forEach((el) => projectObserver.observe(el));

    const sectionIds = ["work", "essays", "youtube", "resume"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sId = entry.target.id;
            if (sId) {
              setActiveObservedModule(sId);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      projectObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  // =========================================================================
  // Keyboard Navigation: j/k to navigate between projects, / or Cmd+K for terminal
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus terminal on '/' or 'Cmd+K'
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && document.activeElement !== terminalInputRef.current) {
        e.preventDefault();
        terminalInputRef.current?.focus();
        return;
      }

      // Escape to blur terminal
      if (e.key === "Escape" && document.activeElement === terminalInputRef.current) {
        terminalInputRef.current?.blur();
        return;
      }

      // Ignore j/k if user is typing
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "j" || e.key === "k") {
        e.preventDefault();
        const currentIndex = SHIPPED_PROJECTS.findIndex((p) => p.id === activeProjectId);
        if (currentIndex === -1) return;

        let targetIndex = currentIndex;
        if (e.key === "j") {
          targetIndex = (currentIndex + 1) % SHIPPED_PROJECTS.length;
        } else if (e.key === "k") {
          targetIndex = (currentIndex - 1 + SHIPPED_PROJECTS.length) % SHIPPED_PROJECTS.length;
        }

        const nextProject = SHIPPED_PROJECTS[targetIndex];
        if (nextProject) {
          setActiveProjectId(nextProject.id);
          const el = document.getElementById(nextProject.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProjectId]);

  // Terminal Command Executor
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();
    setTerminalInput("");

    if (cmd === "help") {
      setTerminalLogs((prev) => [
        ...prev.slice(-2),
        "cmds: help, whoami, open <sys>, theme <name>, resume, ls, clear",
      ]);
    } else if (cmd === "whoami") {
      setTerminalLogs((prev) => [
        ...prev.slice(-2),
        "aditya diundi: product designer & design technologist (iiit delhi)",
      ]);
    } else if (cmd === "resume") {
      window.open("/Aditya_Diundi_Resume.pdf", "_blank");
      setTerminalLogs((prev) => [...prev.slice(-2), "opened /Aditya_Diundi_Resume.pdf"]);
    } else if (cmd.startsWith("open ")) {
      const target = cmd.replace("open ", "").trim();
      const proj = SHIPPED_PROJECTS.find(
        (p) => p.id === target || p.title.toLowerCase().includes(target)
      );
      if (proj) {
        document.getElementById(proj.sectionId)?.scrollIntoView({ behavior: "smooth" });
        setActiveProjectId(proj.id);
        setTerminalLogs((prev) => [...prev.slice(-2), `jumped to ${proj.id}`]);
      } else {
        setTerminalLogs((prev) => [...prev.slice(-2), `unknown system '${target}'. try: ls`]);
      }
    } else if (cmd.startsWith("theme ")) {
      const t = cmd.replace("theme ", "").trim();
      if (t === "light" || t === "editorial") {
        setTheme("light");
        setTerminalLogs((prev) => [...prev.slice(-2), "switched to editorial light"]);
      } else if (t === "dark" || t === "noctalia") {
        setTheme("noctalia");
        setTerminalLogs((prev) => [...prev.slice(-2), "switched to obsidian void"]);
      } else if (t === "slate" || t === "caelestia") {
        setTheme("caelestia");
        setTerminalLogs((prev) => [...prev.slice(-2), "switched to nordic frost"]);
      } else if (t === "matrix" || t === "mono") {
        setTheme("matrix");
        setTerminalLogs((prev) => [...prev.slice(-2), "switched to terminal phosphor"]);
      } else {
        setTerminalLogs((prev) => [...prev.slice(-2), `unknown theme. try: light, dark, slate, matrix`]);
      }
    } else if (cmd === "ls") {
      setTerminalLogs((prev) => [
        ...prev.slice(-2),
        "01 janeval · 02 adityaos · 03 mfine · 04 digiaccel · 05 mosaic · 06 ketto · 07 tutedude",
      ]);
    } else if (cmd === "clear") {
      setTerminalLogs([]);
    } else {
      setTerminalLogs((prev) => [
        ...prev.slice(-2),
        `unknown command: ${raw}. try: help`,
      ]);
    }
  };

  const activeProject: ProjectSpec =
    SHIPPED_PROJECTS.find((p) => p.id === activeProjectId) || SHIPPED_PROJECTS[0];

  const effectiveModule = activeFilter !== "all" ? activeFilter : activeObservedModule;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. Mobile Compact Header (Screens < 1024px) */}
      {/* ========================================================================= */}
      <header
        className={`lg:hidden w-full sticky top-0 z-40 border-b px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl transition-colors ${
          isDark
            ? "bg-[#0b0d13]/90 border-zinc-800 text-zinc-100"
            : "bg-[#FBFBF9]/90 border-stone-200 text-stone-900"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0 ${
              isDark ? "border-zinc-700" : "border-stone-300"
            }`}
          >
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs sm:text-sm tracking-tight truncate">
              Aditya Diundi
            </div>
            <div
              className={`text-[10px] font-mono truncate ${
                isDark ? "text-cyan-400" : "text-cyan-700"
              }`}
            >
              Product Designer & Design Technologist
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-xs">
          <a
            href="/Aditya_Diundi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all ${
              isDark ? "bg-white text-zinc-950" : "bg-stone-900 text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
          <a
            href="https://www.linkedin.com/in/adityadiundi/"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isDark
                ? "border-blue-500/30 bg-blue-950/20 text-blue-300"
                : "border-blue-600/30 bg-blue-50 text-blue-700"
            }`}
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              copiedEmail
                ? isDark
                  ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                  : "border-emerald-600 bg-emerald-100 text-emerald-800"
                : isDark
                ? "border-zinc-800 bg-zinc-900 text-zinc-300"
                : "border-stone-200 bg-stone-100 text-stone-700"
            }`}
            title="Copy email to clipboard"
          >
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. Desktop Sticky Column (240px - 280px Width Constraint) */}
      {/* ========================================================================= */}
      <aside
        className={`hidden lg:flex w-[268px] flex-shrink-0 sticky top-0 self-start h-screen max-h-screen border-r border-dashed p-3 xl:p-3.5 flex-col justify-between z-30 overflow-y-auto transition-colors ${
          isDark
            ? "bg-[#0b0d13]/95 border-zinc-800/80 text-zinc-100"
            : "bg-[#FBFBF9]/95 border-stone-200/80 text-stone-900"
        }`}
      >
        <div className="space-y-2">
          {/* ===================================================================== */}
          {/* 1. Identity Block */}
          {/* ===================================================================== */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`relative w-9 h-9 rounded-full overflow-hidden border flex-shrink-0 ${
                  isDark ? "border-zinc-700" : "border-stone-300"
                }`}
              >
                <Image
                  src="/aditya_avatar_sq.jpg"
                  alt="Aditya Diundi"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1
                  className={`font-sans font-bold text-sm tracking-tight truncate ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  Aditya Diundi
                </h1>
                <p
                  className={`text-[11px] font-mono font-medium leading-tight ${
                    isDark ? "text-cyan-400" : "text-cyan-700"
                  }`}
                >
                  Product Designer & Design Technologist
                </p>
                <p
                  className={`text-[10px] font-mono opacity-60 truncate pt-0.5 ${
                    isDark ? "text-zinc-400" : "text-stone-500"
                  }`}
                >
                  IIIT Delhi · B.Tech ECE
                </p>
              </div>
            </div>

            {/* Location & Status Pill (Clean justify-between) */}
            <div className="flex items-center justify-between pt-0.5">
              <span className={`text-[11px] font-mono ${isDark ? "text-zinc-400" : "text-stone-500"}`}>
                Delhi NCR
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Full-Time Available</span>
              </div>
            </div>

            {/* 2-Line Tightened Bio */}
            <p
              className={`text-[10.5px] font-sans leading-snug ${
                isDark ? "text-zinc-300" : "text-stone-700"
              }`}
            >
              Systems engineer building zero-to-one architectures across Next.js, canvas engines, and Web Audio. 20mo grassroots field research.
            </p>

            {/* Primary Resume Button */}
            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-1 px-3 rounded-lg font-mono text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                isDark
                  ? "bg-white hover:bg-zinc-200 text-zinc-950"
                  : "bg-stone-900 hover:bg-black text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume (PDF)</span>
              </span>
              <span className="text-[10px] opacity-70 font-normal">47 KB ↗</span>
            </a>

            {/* Secondary Action Links below Resume */}
            <div className="flex items-center justify-between text-[10.5px] font-mono pt-0.5 px-0.5">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`transition-colors hover:underline cursor-pointer ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                {copiedEmail ? (
                  <span className="text-emerald-500 font-bold">Email Copied!</span>
                ) : (
                  "Copy Email"
                )}
              </button>
              <span className="opacity-30">·</span>
              <a
                href="https://www.linkedin.com/in/adityadiundi/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                LinkedIn ↗
              </a>
              <span className="opacity-30">·</span>
              <a
                href="https://github.com/AdityaDiundi"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:underline ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-black"
                }`}
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. Scroll-Spy Index (Expands active module inline with progress rail) */}
          {/* ===================================================================== */}
          <div
            className={`pt-2.5 border-t border-dashed space-y-1 ${
              isDark ? "border-zinc-800/80" : "border-stone-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] font-mono uppercase tracking-widest ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                System Index
              </span>
              <span className="text-[9px] font-mono opacity-40">[Scroll Spy]</span>
            </div>

            <nav aria-label="Portfolio index" className="space-y-0.5">
              {feedToggles.map((item) => {
                const isModuleActive = effectiveModule === item.id;
                const isWorkModule = item.id === "work";

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      onClick={() => onSelectFilter(item.id)}
                      aria-current={isModuleActive ? "page" : undefined}
                      className={`w-full flex items-center justify-between py-0.5 text-xs font-mono transition-all cursor-pointer text-left ${
                        isModuleActive
                          ? isDark
                            ? "text-cyan-400 font-semibold"
                            : "text-stone-950 font-bold"
                          : isDark
                          ? "text-zinc-400 hover:text-zinc-200"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono ${
                            isModuleActive
                              ? isDark
                                ? "text-cyan-400 font-bold"
                                : "text-stone-950 font-bold"
                              : "opacity-40"
                          }`}
                        >
                          {item.prefix}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-40">
                        ({item.count})
                      </span>
                    </button>

                    {/* Inline Expanded Project List (Only for module 01: Shipped Systems) */}
                    {isWorkModule && (
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-out"
                        style={{
                          gridTemplateRows: isModuleActive ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={`border-l ml-3 pl-2.5 my-0.5 space-y-0.5 relative transition-colors ${
                              isDark ? "border-zinc-800" : "border-stone-200"
                            }`}
                          >
                            {SHIPPED_PROJECTS.map((proj) => {
                              const isCurrentProject = activeProjectId === proj.id;
                              return (
                                <button
                                  key={proj.id}
                                  onClick={() => {
                                    setActiveProjectId(proj.id);
                                    const el = document.getElementById(proj.sectionId);
                                    if (el) {
                                      el.scrollIntoView({ behavior: "smooth" });
                                    }
                                  }}
                                  className={`w-full text-left flex items-center justify-between py-0.5 text-[10.5px] font-mono transition-colors relative cursor-pointer ${
                                    isCurrentProject
                                      ? isDark
                                        ? "text-white font-medium"
                                        : "text-stone-950 font-bold"
                                      : isDark
                                      ? "text-zinc-500 hover:text-zinc-300"
                                      : "text-stone-400 hover:text-stone-700"
                                  }`}
                                >
                                  {isCurrentProject && (
                                    <span
                                      className={`absolute -left-[14px] w-1.5 h-1.5 rounded-full ${
                                        isDark ? "bg-cyan-400" : "bg-stone-900"
                                      }`}
                                    />
                                  )}
                                  <span className="truncate pr-1">
                                    {proj.number} {proj.title.split(" ")[0]}
                                  </span>
                                  <span
                                    className={`text-[9px] shrink-0 font-mono ${
                                      isCurrentProject
                                        ? isDark
                                          ? "text-cyan-400"
                                          : "text-emerald-600 font-semibold"
                                        : "opacity-30"
                                    }`}
                                  >
                                    {proj.metricNumber}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ===================================================================== */}
          {/* 3. Project Inspector (Live spec sheet) */}
          {/* ===================================================================== */}
          <div
            className={`pt-1.5 border-t border-dashed space-y-1 transition-colors ${
              isDark ? "border-zinc-800/80" : "border-stone-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[9px] font-mono uppercase tracking-widest ${
                  isDark ? "text-zinc-500" : "text-stone-400"
                }`}
              >
                Project Inspector
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900/50 text-cyan-400"
                    : "border-stone-200 bg-stone-100 text-stone-700"
                }`}
              >
                SYS-{activeProject.number}
              </span>
            </div>

            <div
              key={activeProject.id}
              className={`p-2 rounded-lg border transition-all duration-200 min-h-[125px] flex flex-col justify-between ${
                isDark
                  ? "border-zinc-800/80 bg-[#0d0f15]/80 text-zinc-300"
                  : "border-stone-200/80 bg-white text-stone-800 shadow-sm"
              }`}
            >
              {/* Headline Metric as Large Number */}
              <div className="border-b border-dashed pb-1 mb-0.5 transition-colors border-inherit">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-xl font-bold font-mono tracking-tight ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    {activeProject.metricNumber}
                  </span>
                  <span className="text-[10px] font-mono leading-tight font-medium opacity-80 truncate">
                    {activeProject.metricLabel}
                  </span>
                </div>
                {activeProject.metricDetail && (
                  <div className="text-[9px] font-mono opacity-50 truncate pt-0.5">
                    {activeProject.metricDetail}
                  </div>
                )}
              </div>

              {/* Spec Rows */}
              <div className="space-y-0.5 text-[10px] font-mono">
                <div className="flex items-start justify-between gap-2">
                  <span className="opacity-40 shrink-0">CLIENT:</span>
                  <span className="text-right truncate font-medium">
                    {activeProject.client}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="opacity-40 shrink-0">YEAR:</span>
                  <span className="text-right font-medium">{activeProject.year}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="opacity-40 shrink-0">ROLE:</span>
                  <span className="text-right truncate font-medium">
                    {activeProject.role.split("(")[0]}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="opacity-40 shrink-0">TIMELINE:</span>
                  <span className="text-right font-medium">{activeProject.timeline}</span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-0.5 border-t border-dashed border-inherit">
                  <span className="opacity-40 shrink-0">STACK:</span>
                  <span className="text-right truncate opacity-80">
                    {activeProject.stack.slice(0, 3).join(" · ")}
                  </span>
                </div>
              </div>

              {/* Keyboard legend hint */}
              <div
                className={`pt-1 border-t border-dashed border-inherit flex items-center justify-between text-[9px] font-mono opacity-40`}
              >
                <span>[j/k] nav · [/] shell</span>
                <span>{activeProject.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4 & 5: Poetry Accent + Pinned Interactive Terminal Log + Micro Links */}
        {/* ===================================================================== */}
        <div
          className={`space-y-1.5 pt-2 mt-1 border-t border-dashed ${
            isDark ? "border-zinc-800/80" : "border-stone-200/80"
          }`}
        >
          {/* 5. Poetry Accent: Rotates on page load only */}
          <div className="px-1 text-[10.5px] font-serif italic opacity-75">
            <p className="line-clamp-2 leading-tight">
              &ldquo;{currentPoem.text}&rdquo;
            </p>
            <span className="block text-[8.5px] font-mono not-italic opacity-40 pt-0.5 tracking-tight">
              — {currentPoem.source}
            </span>
          </div>

          {/* 4. Pinned Interactive Terminal Log */}
          <div
            className={`p-1.5 rounded-lg border font-mono text-[10px] space-y-1 transition-all ${
              isDark
                ? "bg-[#090b10] border-zinc-800 text-zinc-400"
                : "bg-stone-100 border-stone-200 text-stone-700"
            }`}
          >
            {/* Last 2 log lines */}
            <div className="space-y-0.5 select-none opacity-80 min-h-[26px] flex flex-col justify-end">
              {terminalLogs.slice(-2).map((log, idx) => (
                <div key={idx} className="truncate">
                  <span className="text-cyan-500 mr-1">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Prompt form */}
            <form
              onSubmit={handleTerminalSubmit}
              className="flex items-center gap-1 pt-1 border-t border-dashed border-inherit"
            >
              <span className="text-cyan-500 font-bold text-xs select-none">$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type help, ls, open..."
                className={`w-full bg-transparent outline-none text-[10px] font-mono placeholder:opacity-40 ${
                  isDark ? "text-zinc-200" : "text-stone-900"
                }`}
              />
            </form>
          </div>

          {/* Minimal unobtrusive footer row of icon links */}
          <div
            className={`flex items-center justify-between text-[11px] font-mono px-1 ${
              isDark ? "text-zinc-500" : "text-stone-500"
            }`}
          >
            {/* Theme Trigger */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className={`flex items-center gap-1 hover:underline cursor-pointer transition-colors ${
                  isDark ? "text-zinc-400 hover:text-zinc-200" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>theme:</span>
                <span className={`font-medium ${isDark ? "text-zinc-300" : "text-stone-800"}`}>
                  {themeOptions.find((t) => t.id === currentThemeId)?.label.split(" ")[0].toLowerCase() || "editorial"}
                </span>
                <span className="opacity-40">▾</span>
              </button>

              {themeDropdownOpen && (
                <div
                  className={`absolute bottom-full mb-2 left-0 w-44 rounded-lg p-1 border shadow-2xl backdrop-blur-2xl z-50 text-xs font-mono ${
                    isDark
                      ? "border-zinc-800 bg-[#090b10] text-zinc-300"
                      : "border-stone-200 bg-white text-stone-800"
                  }`}
                >
                  {themeOptions.map((opt) => {
                    const isSelected = currentThemeId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer text-[11px] ${
                          isSelected
                            ? isDark
                              ? "bg-zinc-800 text-white font-medium"
                              : "bg-stone-100 text-stone-900 font-semibold"
                            : isDark
                            ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Micro presence links + OS Shell trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={onLaunchOS}
                className={`hover:underline transition-colors flex items-center gap-1 ${
                  isDark ? "hover:text-cyan-400 text-zinc-400" : "hover:text-cyan-800 text-stone-600"
                }`}
                title="Launch adityaos"
              >
                <span>os ↗</span>
              </button>
              <span className="opacity-30">·</span>
              <a
                href="https://youtube.com/@falsepeek"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline transition-colors ${
                  isDark ? "hover:text-zinc-200" : "hover:text-stone-900"
                }`}
                title="YouTube @falsepeek"
              >
                yt ↗
              </a>
              <span className="opacity-30">·</span>
              <a
                href="https://diundi.bearblog.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline transition-colors ${
                  isDark ? "hover:text-zinc-200" : "hover:text-stone-900"
                }`}
                title="Bear Blog"
              >
                blog ↗
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
