"use client";

import React, { useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";
import { Plus, X } from "lucide-react";

interface DesktopStickyNoteProps {
  dragConstraintsRef?: React.RefObject<HTMLDivElement>;
}

export const DesktopStickyNote: React.FC<DesktopStickyNoteProps> = ({
  dragConstraintsRef,
}) => {
  const { isStickyNoteOpen, toggleStickyNote } = useOSStore();
  const { playClickChime } = useSoundStore();
  const dragControls = useDragControls();

  const [content, setContent] = useState<string>("");

  // Load user's note from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aditya_os_sticky_note");
    if (saved !== null) {
      setContent(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    localStorage.setItem("aditya_os_sticky_note", val);
  };

  const handleNewNote = () => {
    playClickChime(600);
    setContent("");
    localStorage.removeItem("aditya_os_sticky_note");
  };

  if (!isStickyNoteOpen) return null;

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={dragConstraintsRef}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="fixed bottom-16 right-6 sm:right-8 w-72 sm:w-80 h-72 sm:h-80 rounded-lg font-sans select-none shadow-2xl border border-amber-300/80 bg-[#FFF9A6] text-[#1C1917] z-[850] flex flex-col overflow-hidden"
    >
      {/* Windows Sticky Notes Draggable Header */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="h-8 bg-[#FFF176] border-b border-amber-300/70 px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing text-neutral-800"
      >
        <button
          type="button"
          onClick={handleNewNote}
          title="New note (Clear)"
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/10 transition-colors text-neutral-700 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center font-medium text-[11px] text-amber-950/70 tracking-wide select-none">
          Sticky Note
        </div>

        <button
          type="button"
          onClick={() => {
            playClickChime(420);
            toggleStickyNote();
          }}
          title="Close note"
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-black/10 hover:text-red-600 transition-colors text-neutral-700 active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Windows Sticky Notes Textarea Body */}
      <div className="flex-1 p-3.5 flex flex-col">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Take a note..."
          autoFocus
          className="w-full h-full bg-transparent border-none outline-none resize-none text-[13px] leading-relaxed text-[#1C1917] placeholder:text-amber-900/40 font-normal select-text selection:bg-amber-300/80 font-sans"
        />
      </div>
    </motion.div>
  );
};
