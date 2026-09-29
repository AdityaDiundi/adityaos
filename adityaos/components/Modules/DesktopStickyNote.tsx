"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  Pin,
  PinOff,
  Copy,
  Check,
  Trash2,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface DesktopStickyNoteProps {
  dragConstraintsRef?: React.RefObject<HTMLDivElement>;
}

const DEFAULT_NOTE_CONTENT = `👋 Welcome to AdityaOS!

Feel free to write notes, feedback, or ideas here while exploring my portfolio. Everything you type is automatically saved to your browser.

— Aditya Diundi (Delhi, India)`;

export const DesktopStickyNote: React.FC<DesktopStickyNoteProps> = ({
  dragConstraintsRef,
}) => {
  const { isStickyNoteOpen, toggleStickyNote } = useOSStore();
  const { activeTheme } = useThemeStore();
  const { playClickChime } = useSoundStore();

  const [content, setContent] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aditya_os_visitor_note");
    if (saved !== null) {
      setContent(saved);
    } else {
      setContent(DEFAULT_NOTE_CONTENT);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    localStorage.setItem("aditya_os_visitor_note", val);
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    playClickChime(750);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setContent("");
    localStorage.removeItem("aditya_os_visitor_note");
    playClickChime(400);
  };

  const setTemplate = (tmpl: string) => {
    playClickChime(600);
    const updated = content.trim() ? `${content}\n\n${tmpl}` : tmpl;
    setContent(updated);
    localStorage.setItem("aditya_os_visitor_note", updated);
  };

  if (!isStickyNoteOpen) return null;

  return (
    <motion.div
      drag={!isPinned}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      style={{
        zIndex: 50,
      }}
      className="fixed bottom-14 right-4 sm:right-6 w-80 sm:w-88 rounded-xl font-mono text-xs select-none shadow-2xl border border-amber-500/30 backdrop-blur-xl"
    >
      {/* Amber / Golden Post-It Gradient Shell */}
      <div className="bg-neutral-950/90 rounded-xl overflow-hidden border border-amber-400/25 flex flex-col shadow-inner">
        {/* Top Header / Pushpin Strip */}
        <div className="h-8 bg-amber-500/15 border-b border-amber-500/20 px-3 flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-amber-400" />
              VISITOR SCRATCHPAD
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickChime(500);
                setIsPinned(!isPinned);
              }}
              title={isPinned ? "Unpin (Enable Dragging)" : "Pin to bottom right"}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                isPinned ? "text-amber-400 font-bold" : "opacity-60"
              }`}
            >
              {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
            </button>

            {/* Collapse Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickChime(520);
                setIsCollapsed(!isCollapsed);
              }}
              title={isCollapsed ? "Expand note" : "Collapse note"}
              className="p-1 rounded hover:bg-white/10 transition-colors opacity-75 hover:opacity-100"
            >
              {isCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>

            {/* Close Toggle */}
            <button
              type="button"
              onClick={() => {
                playClickChime(420);
                toggleStickyNote();
              }}
              title="Close sticky note (can re-open from top bar or context menu)"
              className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isCollapsed && (
          <div className="p-3 space-y-2.5 flex flex-col">
            {/* Quick Template Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1 border-b border-white/5 scrollbar-none">
              <span className="text-amber-400/80 font-bold text-[9px] uppercase tracking-wider shrink-0">
                Quick:
              </span>
              <button
                type="button"
                onClick={() => setTemplate("👋 Loved the OS architecture and rural field research!")}
                className="px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 whitespace-nowrap transition-colors"
              >
                👋 Loved the OS!
              </button>
              <button
                type="button"
                onClick={() =>
                  setTemplate("💼 Reaching out regarding a Product Design / AI opportunity. Email me at: ")
                }
                className="px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 whitespace-nowrap transition-colors"
              >
                💼 Opportunity
              </button>
              <button
                type="button"
                onClick={() => setTemplate("💡 Suggestion for next AdityaOS update: ")}
                className="px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/20 whitespace-nowrap transition-colors"
              >
                💡 Feedback
              </button>
            </div>

            {/* Note Textarea */}
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="Leave a note, contact info, or thoughts while you browse..."
              rows={6}
              className="w-full bg-neutral-900/70 border border-amber-500/20 rounded-lg p-2.5 text-xs text-amber-100 placeholder:text-amber-500/40 outline-none focus:border-amber-400 transition-colors resize-none font-mono leading-relaxed select-text"
            />

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between text-[10px] text-amber-400/70 pt-0.5">
              <span className="text-[9px] opacity-75">
                {content.length} chars • Saved to LocalStorage
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear note"
                  className="px-1.5 py-0.5 rounded hover:bg-white/10 text-amber-400/60 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy note to clipboard"
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
