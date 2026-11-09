"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useThemeStore, OSThemeId } from "@/store/themeStore";
import { WRITING_LINES } from "./poetryData";
import { SHIPPED_PROJECTS } from "./projectsData";

interface PortfolioSidebarProps {
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
  onLaunchOS: () => void;
}

export function PortfolioSidebar({
  activeFilter,
  onSelectFilter,
  onLaunchOS,
}: PortfolioSidebarProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeObservedModule, setActiveObservedModule] = useState<string>("work");
  const { currentThemeId, setTheme, activeTheme } = useThemeStore();
  const isDark = activeTheme.isDark;

  // Single writing line at the bottom - picked at random on page load
  const [writingLine, setWritingLine] = useState<string>(WRITING_LINES[0]);

  // Command Palette State (Cmd+K or '/')
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteInput, setPaletteInput] = useState("");
  const [paletteLogs, setPaletteLogs] = useState<string[]>([
    "Welcome to Aditya Diundi's terminal.",
    "Type 'help' for commands, or press Esc to close.",
  ]);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * WRITING_LINES.length);
    setWritingLine(WRITING_LINES[idx]);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("aditya15124@iiitd.ac.in");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // 5 Modules: simple list without counts or project expansions
  const modules = [
    { id: "all", prefix: "00", label: "All Modules" },
    { id: "work", prefix: "01", label: "Shipped Systems" },
    { id: "essays", prefix: "02", label: "Fieldwork & Essays" },
    { id: "youtube", prefix: "03", label: "Watch Games" },
    { id: "resume", prefix: "04", label: "Experience & Specs" },
  ];

  // Scroll-Spy: determine active module
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const sectionIds = ["work", "essays", "youtube", "resume"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveObservedModule(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0.15 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  // Global Keyboard Listener for Cmd+K or '/' Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K or '/' (when not typing in an input/textarea)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        setIsPaletteOpen(true);
        return;
      }

      if (e.key === "Escape" && isPaletteOpen) {
        e.preventDefault();
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaletteOpen]);

  // Focus palette input when opened
  useEffect(() => {
    if (isPaletteOpen) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
    }
  }, [isPaletteOpen]);

  // Command Palette execution
  const executeCommand = (cmd: string) => {
    const raw = cmd.trim();
    if (!raw) return;

    const parts = raw.split(" ");
    const action = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    setPaletteLogs((prev) => [...prev, `$ ${raw}`]);

    switch (action) {
      case "help":
        setPaletteLogs((prev) => [
          ...prev,
          "Available commands:",
          "  whoami          Display identity and bio",
          "  open <project>  Navigate to a project (e.g. open janeval, open mfine)",
          "  theme <name>    Set theme: editorial, dark, nord, matrix",
          "  resume          Open resume in new tab",
          "  yt              Watch games channel",
          "  blog            Open writing / bear blog",
          "  ls              List all shipped systems",
          "  clear           Clear output",
        ]);
        break;

      case "whoami":
        setPaletteLogs((prev) => [
          ...prev,
          "Aditya Diundi — Product Designer & Design Technologist",
          "IIIT Delhi B.Tech ECE · 4+ yrs healthcare & systems engineering.",
        ]);
        break;

      case "ls":
        setPaletteLogs((prev) => [
          ...prev,
          "Shipped Systems:",
          ...SHIPPED_PROJECTS.map(
            (p) => `  ${p.number} ${p.title.split(" ")[0].padEnd(10)} [${p.metricNumber} ${p.metricLabel}]`
          ),
        ]);
        break;

      case "open": {
        if (!arg) {
          setPaletteLogs((prev) => [
            ...prev,
            "Usage: open <project|module> (e.g. open janeval, open work, open essays)",
          ]);
          break;
        }

        const foundProject = SHIPPED_PROJECTS.find(
          (p) =>
            p.id.toLowerCase() === arg ||
            p.title.toLowerCase().includes(arg) ||
            p.number === arg
        );

        if (foundProject) {
          const el = document.getElementById(foundProject.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setPaletteLogs((prev) => [...prev, `Navigating to ${foundProject.title}...`]);
            setTimeout(() => setIsPaletteOpen(false), 300);
          }
          break;
        }

        const foundModule = modules.find(
          (m) => m.id === arg || m.prefix === arg || m.label.toLowerCase().includes(arg)
        );

        if (foundModule) {
          onSelectFilter(foundModule.id);
          setPaletteLogs((prev) => [...prev, `Opening module: ${foundModule.label}...`]);
          setTimeout(() => setIsPaletteOpen(false), 300);
          break;
        }

        if (arg === "yt" || arg === "games") {
          onSelectFilter("youtube");
          setTimeout(() => setIsPaletteOpen(false), 300);
          break;
        }

        if (arg === "blog" || arg === "writing") {
          window.open("https://adityadiundi.bearblog.dev", "_blank");
          break;
        }

        setPaletteLogs((prev) => [...prev, `Project or module '${arg}' not found. Type 'ls' to view all.`]);
        break;
      }

      case "theme": {
        if (!arg || arg === "editorial" || arg === "light") {
          setTheme("light");
          setPaletteLogs((prev) => [...prev, "Theme set to: Editorial (Warm Paper)."]);
        } else if (arg === "dark" || arg === "noctalia") {
          setTheme("noctalia");
          setPaletteLogs((prev) => [...prev, "Theme set to: Noctalia (Dark)."]);
        } else if (arg === "nord" || arg === "caelestia") {
          setTheme("caelestia");
          setPaletteLogs((prev) => [...prev, "Theme set to: Nordic Frost."]);
        } else if (arg === "matrix") {
          setTheme("matrix");
          setPaletteLogs((prev) => [...prev, "Theme set to: Terminal Mono."]);
        } else {
          setPaletteLogs((prev) => [...prev, `Unknown theme '${arg}'. Options: editorial, dark, nord, matrix.`]);
        }
        break;
      }

      case "resume":
        window.open("/Aditya_Diundi_Resume.pdf", "_blank");
        setPaletteLogs((prev) => [...prev, "Opening resume PDF..."]);
        break;

      case "yt":
        onSelectFilter("youtube");
        setTimeout(() => setIsPaletteOpen(false), 200);
        break;

      case "blog":
        window.open("https://adityadiundi.bearblog.dev", "_blank");
        break;

      case "clear":
        setPaletteLogs([]);
        break;

      default:
        setPaletteLogs((prev) => [
          ...prev,
          `Unknown command: '${action}'. Type 'help' for available commands.`,
        ]);
        break;
    }

    setPaletteInput("");
  };

  const effectiveModule =
    activeFilter !== "all" ? activeFilter : activeObservedModule;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. Mobile Header (Hidden on Desktop) */}
      {/* ========================================================================= */}
      <header
        className={`lg:hidden w-full border-b px-5 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${
          isDark
            ? "bg-[#0E1015]/95 border-zinc-800/60 text-zinc-100"
            : "bg-[#FAF7F2]/95 border-stone-200/60 text-[#1A1814]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone-300 dark:border-zinc-700 shrink-0">
            <Image
              src="/aditya_avatar_sq.jpg"
              alt="Aditya Diundi"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif text-lg leading-tight font-normal text-[#1A1814] dark:text-white">
              Aditya Diundi
            </h1>
            <p className="text-xs font-mono text-stone-600 dark:text-zinc-400">
              Product Designer & Design Technologist
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPaletteOpen(true)}
          className="px-2.5 py-1 rounded border border-stone-300 dark:border-zinc-700 text-xs font-mono"
        >
          Cmd+K
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 2. Desktop Left Pane (Exactly 4 Things with generous spacing) */}
      {/* ========================================================================= */}
      <aside
        className={`hidden lg:flex w-[260px] flex-shrink-0 sticky top-0 self-start h-screen max-h-screen border-r px-7 py-8 flex-col justify-between z-30 transition-colors ${
          isDark
            ? "bg-[#0E1015] border-zinc-800/60 text-zinc-100"
            : "bg-[#FAF7F2] border-stone-200/60 text-[#1A1814]"
        }`}
      >
        {/* Top Group: 1. Portrait + Name + Role */}
        <div className="space-y-8">
          {/* ===================================================================== */}
          {/* ITEM 1: Portrait (96px, rounded), Name (display serif 28px), Role (13px mono) */}
          {/* ===================================================================== */}
          <div>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-stone-200/80 dark:border-zinc-700/80 mb-5">
              <Image
                src="/aditya_avatar_sq.jpg"
                alt="Aditya Diundi"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight text-[#1A1814] dark:text-[#F4F4F5]">
              Aditya Diundi
            </h1>

            <p className="text-[13px] font-mono text-stone-600 dark:text-zinc-400 mt-1.5 leading-snug">
              Product Designer &amp; Design Technologist
            </p>
          </div>

          {/* ===================================================================== */}
          {/* ITEM 2: Availability line (green dot, no pill) + Outlined Resume + Plain text links */}
          {/* ===================================================================== */}
          <div className="space-y-3.5">
            {/* Availability with small green dot (no pill container) */}
            <div className="flex items-center text-[13px] font-mono text-stone-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0 animate-pulse" />
              <span>Available for full-time roles</span>
            </div>

            {/* Outlined Resume button (not filled black) */}
            <a
              href="/Aditya_Diundi_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2 px-3.5 rounded border text-[13px] font-mono flex items-center justify-between transition-colors ${
                isDark
                  ? "border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40"
                  : "border-stone-300 text-[#1A1814] hover:border-stone-500 hover:bg-stone-100/60"
              }`}
            >
              <span>Resume (PDF)</span>
              <span className="opacity-60 text-xs">↗</span>
            </a>

            {/* Email / LinkedIn / GitHub as plain text links */}
            <div className="flex items-center gap-2 text-[13px] font-mono text-stone-600 dark:text-zinc-400 pt-0.5 whitespace-nowrap">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`transition-colors hover:underline cursor-pointer ${
                  isDark ? "hover:text-white" : "hover:text-[#1A1814]"
                }`}
              >
                {copiedEmail ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                ) : (
                  "Email"
                )}
              </button>
              <span className="opacity-30">/</span>
              <a
                href="https://www.linkedin.com/in/adityadiundi/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:underline ${
                  isDark ? "hover:text-white" : "hover:text-[#1A1814]"
                }`}
              >
                LinkedIn ↗
              </a>
              <span className="opacity-30">/</span>
              <a
                href="https://github.com/AdityaDiundi"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:underline ${
                  isDark ? "hover:text-white" : "hover:text-[#1A1814]"
                }`}
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ITEM 3: Index of the 5 modules as a simple list, 14px (No counts, no expansion) */}
          {/* ===================================================================== */}
          <nav aria-label="Portfolio index" className="space-y-2 pt-2">
            {modules.map((item) => {
              const isModuleActive = effectiveModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFilter(item.id)}
                  aria-current={isModuleActive ? "page" : undefined}
                  className={`w-full flex items-center text-[14px] transition-colors text-left cursor-pointer py-0.5 ${
                    isModuleActive
                      ? isDark
                        ? "text-white font-medium"
                        : "text-[#1A1814] font-semibold"
                      : isDark
                      ? "text-zinc-500 hover:text-zinc-300"
                      : "text-stone-500 hover:text-[#1A1814]"
                  }`}
                >
                  {/* Small active marker */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all ${
                      isModuleActive
                        ? isDark
                          ? "bg-white opacity-100"
                          : "bg-[#1A1814] opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  <span className="font-mono text-xs opacity-50 mr-2 shrink-0">
                    {item.prefix}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===================================================================== */}
        {/* ITEM 4: At the bottom: One line of writing in a serif (14px, authentic Hindi) */}
        {/* ===================================================================== */}
        <div className="pt-8">
          <p className="font-serif italic text-[14px] leading-relaxed text-stone-600 dark:text-stone-400 select-text">
            &ldquo;{writingLine}&rdquo;
          </p>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* Command Palette Modal (Cmd+K or '/') */}
      {/* ========================================================================= */}
      {isPaletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setIsPaletteOpen(false)}
        >
          <div
            className={`w-full max-w-xl rounded-xl border shadow-2xl p-4 space-y-3 font-mono transition-colors ${
              isDark
                ? "bg-[#12141A] border-zinc-800 text-zinc-100"
                : "bg-[#FAF7F2] border-stone-300 text-[#1A1814]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCommand(paletteInput);
              }}
              className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-zinc-800"
            >
              <span className="text-emerald-500 font-bold select-none">$</span>
              <input
                ref={paletteInputRef}
                type="text"
                value={paletteInput}
                onChange={(e) => setPaletteInput(e.target.value)}
                placeholder="type help, ls, open, theme, resume, yt, blog..."
                className="w-full bg-transparent outline-none text-[13px] placeholder:opacity-40"
              />
              <button
                type="button"
                onClick={() => setIsPaletteOpen(false)}
                className="text-xs opacity-50 hover:opacity-100 px-1.5 py-0.5 rounded border border-inherit"
              >
                Esc
              </button>
            </form>

            {/* Terminal Output Logs */}
            <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1 leading-relaxed">
              {paletteLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith("$") ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "opacity-80"}>
                  {log}
                </div>
              ))}
            </div>

            {/* Quick action chips */}
            <div className="pt-2 border-t border-stone-200 dark:border-zinc-800 flex flex-wrap items-center gap-1.5 text-[11px] opacity-70">
              <span className="mr-1">shortcuts:</span>
              {["help", "whoami", "open janeval", "open adityaos", "theme editorial", "resume", "yt", "blog"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  className="px-2 py-0.5 rounded border border-stone-300 dark:border-zinc-700 hover:border-stone-500 hover:opacity-100 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
