"use client";

import React, { useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { Minus, Plus, X, Square, Terminal } from "lucide-react";

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number | string; height: number | string };
  children: React.ReactNode;
  className?: string;
  dragConstraintsRef?: React.RefObject<HTMLDivElement>;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  icon = <Terminal className="w-3.5 h-3.5 text-onedark-blue" />,
  defaultPosition = { x: 50, y: 60 },
  defaultSize = { width: 620, height: 440 },
  children,
  className = "",
  dragConstraintsRef,
}) => {
  const {
    activeWindow,
    minimizedWindows,
    maximizedWindows,
    openWindows,
    zIndexMap,
    focusWindow,
    toggleMinimize,
    toggleMaximize,
    closeWindow,
  } = useOSStore();

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  const isOpen = openWindows.includes(id);
  const isMinimized = minimizedWindows.includes(id);
  const isMaximized = maximizedWindows.includes(id);
  const isActive = activeWindow === id;
  const currentZIndex = zIndexMap[id] || 1;

  if (!isOpen || isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={dragConstraintsRef}
      dragElastic={0.06}
      dragMomentum={false}
      initial={{
        opacity: 0,
        scale: 0.95,
        x: defaultPosition.x,
        y: defaultPosition.y,
      }}
      animate={
        isMaximized
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              width: "calc(100vw - 24px)",
              height: "calc(100vh - 120px)",
              top: 36,
              left: 12,
              position: "fixed",
            }
          : {
              opacity: 1,
              scale: 1,
              width: defaultSize.width,
              height: defaultSize.height,
              position: "absolute",
            }
      }
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      onPointerDown={() => focusWindow(id)}
      style={{ zIndex: currentZIndex }}
      className={`flex flex-col bg-onedark-surface border rounded-md shadow-window overflow-hidden ${
        isActive
          ? "border-onedark-blue/60 shadow-windowActive"
          : "border-onedark-border"
      } ${className}`}
    >
      {/* TWM Title Bar */}
      <div
        onPointerDown={(e) => {
          dragControls.start(e);
          focusWindow(id);
        }}
        className={`h-8 px-3 flex items-center justify-between border-b select-none cursor-move transition-colors ${
          isActive
            ? "bg-onedark-surface2/90 border-onedark-border"
            : "bg-onedark-dark/80 border-onedark-borderMuted text-onedark-muted"
        }`}
      >
        {/* Left: Window identity & breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono truncate">
          <span className="opacity-80">{icon}</span>
          <span
            className={`font-semibold tracking-tight truncate ${
              isActive ? "text-onedark-textBright" : "text-onedark-muted"
            }`}
          >
            {title}
          </span>
          <span className="text-[10px] text-onedark-muted hidden sm:inline">
            // twm:active
          </span>
        </div>

        {/* Right: Window Controls: Minimize (-), Maximize (+), Close (x) */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          {/* Minimize (-) */}
          <button
            type="button"
            onClick={() => toggleMinimize(id)}
            title="Minimize (-)"
            className="w-5 h-5 flex items-center justify-center rounded text-onedark-muted hover:text-onedark-yellow hover:bg-onedark-surface border border-transparent hover:border-onedark-border/50 transition-all text-xs"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Maximize (+) */}
          <button
            type="button"
            onClick={() => toggleMaximize(id)}
            title={isMaximized ? "Restore" : "Maximize (+)"}
            className="w-5 h-5 flex items-center justify-center rounded text-onedark-muted hover:text-onedark-green hover:bg-onedark-surface border border-transparent hover:border-onedark-border/50 transition-all text-xs"
          >
            {isMaximized ? (
              <Square className="w-2.5 h-2.5" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </button>

          {/* Close (x) */}
          <button
            type="button"
            onClick={() => closeWindow(id)}
            title="Close (x)"
            className="w-5 h-5 flex items-center justify-center rounded text-onedark-muted hover:text-onedark-red hover:bg-onedark-surface border border-transparent hover:border-onedark-border/50 transition-all text-xs"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 bg-onedark-dark overflow-auto relative font-mono text-onedark-text text-sm">
        {children}
      </div>
    </motion.div>
  );
};
