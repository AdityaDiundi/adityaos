"use client";

import React, { useState } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Compass, Eye, HelpCircle } from "lucide-react";
import { ViewportControlState } from "../engine/ViewportControls";

export interface ViewportHudProps {
  state: ViewportControlState;
  onToggleInspect: () => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ViewportHud({
  state,
  onToggleInspect,
  onResetCamera,
  onZoomIn,
  onZoomOut,
}: ViewportHudProps) {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <aside
      aria-label="3D Viewport Navigation Controls"
      className="fixed bottom-6 right-14 sm:right-20 z-40 flex flex-col items-end gap-2 select-none pointer-events-auto"
    >
      {/* Expanded Help Card */}
      {showHelp && (
        <div className="mb-1 p-3 rounded-lg bg-[#0e1117]/90 dark:bg-[#0e1117]/95 border border-[#30363d] text-[#c9d1d9] text-[11px] font-mono shadow-xl backdrop-blur-md max-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="font-semibold text-white mb-1.5 flex items-center justify-between border-b border-[#30363d] pb-1">
            <span>3D VIEWPORT CONTROLS</span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-[#8b949e] hover:text-white px-1"
              aria-label="Close Help"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1 text-[#8b949e]">
            <li className="flex justify-between">
              <span className="text-[#c9d1d9]">Left Click + Drag</span>
              <span>Orbit</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[#c9d1d9]">Shift / Right Drag</span>
              <span>Pan</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[#c9d1d9]">Wheel / Pinch</span>
              <span>Zoom</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[#c9d1d9]">Press &apos;I&apos;</span>
              <span>Toggle Inspect</span>
            </li>
            <li className="flex justify-between">
              <span className="text-[#c9d1d9]">Press &apos;R&apos; / Esc</span>
              <span>Reset to Track</span>
            </li>
          </ul>
        </div>
      )}

      {/* Main HUD Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#161b22]/85 dark:bg-[#161b22]/90 border border-[#30363d] text-[#c9d1d9] shadow-lg backdrop-blur-sm text-xs font-mono transition-all duration-200">
        {/* Inspect Toggle */}
        <button
          onClick={onToggleInspect}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium transition-colors ${
            state.isInspectMode
              ? "bg-[#238636] text-white shadow-sm"
              : "hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]"
          }`}
          title="Toggle 3D Inspect Mode (Key: I)"
          aria-label={state.isInspectMode ? "Exit 3D Inspect Mode" : "Enter 3D Inspect Mode"}
        >
          {state.isInspectMode ? (
            <>
              <Eye className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>INSPECTING</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5" />
              <span>3D ORBIT</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-3.5 bg-[#30363d] mx-0.5" />

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
          title="Zoom Out (Key: -)"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          className="p-1 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
          title="Zoom In (Key: +)"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera Button */}
        {state.hasOffsets && (
          <>
            <div className="w-[1px] h-3.5 bg-[#30363d] mx-0.5" />
            <button
              onClick={onResetCamera}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] hover:text-[#79c0ff] text-[11px] font-medium transition-all animate-in fade-in duration-200"
              title="Reset Camera to Track (Key: R)"
              aria-label="Reset Camera to Director Track"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </>
        )}

        {/* Help Toggle */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={`p-1 rounded hover:bg-[#21262d] transition-colors ml-0.5 ${
            showHelp ? "text-[#58a6ff]" : "text-[#8b949e] hover:text-white"
          }`}
          title="Viewport Shortcuts Help"
          aria-label="Viewport Shortcuts Help"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
