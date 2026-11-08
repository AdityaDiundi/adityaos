"use client";

import React, { useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useThemeStore } from "@/store/themeStore";
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
  const { activeTheme } = useThemeStore();

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);

  // Dynamic window resizing state
  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    const w = typeof defaultSize.width === "number" ? defaultSize.width : 640;
    const h = typeof defaultSize.height === "number" ? defaultSize.height : 460;
    return { width: w, height: h };
  });

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const newW = Math.max(340, startW + (moveEvent.clientX - startX));
      const newH = Math.max(220, startH + (moveEvent.clientY - startY));
      setSize({ width: newW, height: newH });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

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
              width: size.width,
              height: size.height,
              position: "absolute",
            }
      }
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      onPointerDown={() => focusWindow(id)}
      style={{
        zIndex: currentZIndex,
        backgroundColor: activeTheme.windowBg,
        borderColor: isActive ? activeTheme.windowActiveBorder : activeTheme.windowBorder,
        boxShadow: isActive ? `0 12px 36px -8px ${activeTheme.accentGlow}` : undefined,
      }}
      className={`flex flex-col border rounded-md shadow-window overflow-hidden backdrop-blur-md relative ${className}`}
    >
      {/* TWM Title Bar */}
      <div
        onPointerDown={(e) => {
          dragControls.start(e);
          focusWindow(id);
        }}
        style={{
          backgroundColor: isActive ? activeTheme.windowTitleBg : activeTheme.headerBg,
          borderColor: activeTheme.windowBorder,
          color: isActive ? activeTheme.textPrimary : activeTheme.textMuted,
        }}
        className="h-8 px-3 flex items-center justify-between border-b select-none cursor-move transition-colors"
      >
        {/* Left: Window identity & breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono truncate">
          <span className="opacity-80">{icon}</span>
          <span
            style={{ color: isActive ? activeTheme.textPrimary : activeTheme.textMuted }}
            className="font-semibold tracking-tight truncate"
          >
            {title}
          </span>
          <span className="text-[10px] opacity-60 hidden sm:inline">
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
            className="w-5 h-5 flex items-center justify-center rounded opacity-70 hover:opacity-100 hover:text-onedark-yellow transition-all text-xs"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Maximize (+) */}
          <button
            type="button"
            onClick={() => toggleMaximize(id)}
            title={isMaximized ? "Restore" : "Maximize (+)"}
            className="w-5 h-5 flex items-center justify-center rounded opacity-70 hover:opacity-100 hover:text-onedark-green transition-all text-xs"
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
            className="w-5 h-5 flex items-center justify-center rounded opacity-70 hover:opacity-100 hover:text-onedark-red transition-all text-xs"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div
        style={{
          backgroundColor: activeTheme.windowBg,
          color: activeTheme.textPrimary,
        }}
        className="flex-1 overflow-auto relative font-mono text-sm"
      >
        {children}
      </div>

      {/* Interactive Bottom-Right Corner Resize Grip */}
      {!isMaximized && (
        <div
          onPointerDown={handleResizePointerDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 select-none opacity-40 hover:opacity-100 transition-opacity"
          title="Drag to resize window"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className="fill-current" style={{ color: activeTheme.accent }}>
            <path d="M7 1v6H1l6-6z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
};
