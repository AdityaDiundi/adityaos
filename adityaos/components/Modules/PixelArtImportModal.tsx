"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  X,
  Sparkles,
  Sliders,
  Scissors,
  Palette,
  Maximize2,
  Check,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  processImageToPixels,
  PixelConversionOptions,
  PixelConversionResult,
} from "./pixelArtConverter";

interface PixelArtImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  canvasCols: number;
  canvasRows: number;
  onApplyPixels: (pixels: Map<string, string>, count: number) => void;
}

export const PixelArtImportModal: React.FC<PixelArtImportModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  canvasCols,
  canvasRows,
  onApplyPixels,
}) => {
  const { activeTheme } = useThemeStore();
  const { playClickChime } = useSoundStore();

  const [paletteMode, setPaletteMode] = useState<"rplace" | "pico8" | "gameboy" | "original">("rplace");
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const [bgTolerance, setBgTolerance] = useState<number>(38);
  const [contrast, setContrast] = useState<number>(1.25);
  const [cropToSubject, setCropToSubject] = useState<boolean>(true);
  const [resolutionPreset, setResolutionPreset] = useState<number>(48);

  const [previewResult, setPreviewResult] = useState<PixelConversionResult | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load Image
  useEffect(() => {
    if (!imageSrc) {
      setLoadedImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLoadedImg(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Process image whenever settings or image changes
  useEffect(() => {
    if (!loadedImg) return;

    const targetCols = Math.min(resolutionPreset, canvasCols || 48);
    const targetRows = Math.min(resolutionPreset, canvasRows || 36);

    const options: PixelConversionOptions = {
      targetCols,
      targetRows,
      paletteMode,
      removeBg,
      bgTolerance,
      contrast,
      cropToSubject,
    };

    const res = processImageToPixels(loadedImg, options);
    setPreviewResult(res);
  }, [
    loadedImg,
    paletteMode,
    removeBg,
    bgTolerance,
    contrast,
    cropToSubject,
    resolutionPreset,
    canvasCols,
    canvasRows,
  ]);

  // Render Preview onto Canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !previewResult) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = Math.max(4, Math.floor(280 / Math.max(previewResult.width, previewResult.height, 1)));
    canvas.width = previewResult.width * cellSize;
    canvas.height = previewResult.height * cellSize;

    // Dark grid background
    ctx.fillStyle = "#0D0F14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw pixels
    previewResult.pixels.forEach((hex, key) => {
      const [rStr, cStr] = key.split("_");
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);

      const px = c * cellSize;
      const py = r * cellSize;

      ctx.fillStyle = hex;
      ctx.fillRect(px, py, cellSize, cellSize);
    });
  }, [previewResult]);

  const handleApply = () => {
    if (!previewResult || previewResult.pixels.size === 0) return;
    playClickChime(800);
    onApplyPixels(previewResult.pixels, previewResult.pixelCount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none font-mono">
      <div
        style={{
          backgroundColor: activeTheme.windowBg,
          borderColor: activeTheme.cardBorder,
          color: activeTheme.textPrimary,
        }}
        className="w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="h-11 px-4 border-b flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${activeTheme.accent}25`, color: activeTheme.accent }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>PIXEL ART CONVERTER</span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider opacity-75 hidden sm:inline"
              style={{ borderColor: activeTheme.cardBorder }}
            >
              r/place Engine
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col md:flex-row gap-4">
          {/* Left: Pixel Preview Stage */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/40 rounded-lg p-3 border border-white/5 relative min-h-[280px]">
            <canvas
              ref={previewCanvasRef}
              className="rounded shadow-lg border border-white/10 max-w-full max-h-[280px] object-contain"
            />

            {previewResult && (
              <div className="mt-3 flex items-center justify-between w-full text-[10px] opacity-75 px-1 font-mono">
                <span>
                  Grid: {previewResult.width}×{previewResult.height}
                </span>
                <span className="font-bold text-emerald-400">
                  {previewResult.pixelCount} Active Voxels
                </span>
              </div>
            )}
          </div>

          {/* Right: Fine-Tuning Controls */}
          <div className="w-full md:w-64 flex flex-col gap-3.5 text-xs">
            {/* 1. Background Cutout */}
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-2.5 rounded-lg border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  Auto Cutout Subject
                </span>
                <input
                  type="checkbox"
                  checked={removeBg}
                  onChange={(e) => setRemoveBg(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </div>

              {removeBg && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] opacity-70">
                    <span>Background Sensitivity</span>
                    <span>{bgTolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="75"
                    step="1"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded accent-cyan-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 2. Color Palette */}
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-2.5 rounded-lg border space-y-2"
            >
              <span className="font-bold text-[11px] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                Color Quantization
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "rplace", label: "r/place 32", desc: "Crisp & Punchy" },
                  { id: "pico8", label: "PICO-8", desc: "Retro 16-Color" },
                  { id: "gameboy", label: "GameBoy", desc: "4-Tone Green" },
                  { id: "original", label: "Original", desc: "Direct TrueColor" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaletteMode(p.id as any)}
                    style={{
                      borderColor: paletteMode === p.id ? activeTheme.accent : activeTheme.cardBorder,
                      backgroundColor: paletteMode === p.id ? `${activeTheme.accent}20` : "transparent",
                    }}
                    className="p-1.5 rounded border text-left transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-[10px] flex items-center justify-between">
                      <span>{p.label}</span>
                      {paletteMode === p.id && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                    </div>
                    <div className="text-[8px] opacity-60">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Detail & Density */}
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-2.5 rounded-lg border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  Target Density
                </span>
                <span className="text-[10px] font-bold text-cyan-400">{resolutionPreset}px</span>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {[28, 40, 52, 64].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setResolutionPreset(sz)}
                    style={{
                      borderColor: resolutionPreset === sz ? activeTheme.accent : activeTheme.cardBorder,
                      backgroundColor: resolutionPreset === sz ? `${activeTheme.accent}20` : "transparent",
                    }}
                    className="py-1 rounded border text-center font-bold text-[10px] transition-all cursor-pointer"
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Contrast Boost */}
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-2.5 rounded-lg border space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  Line & Edge Boost
                </span>
                <span className="text-[10px] opacity-75">{contrast.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded accent-pink-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: activeTheme.cardBg,
            borderColor: activeTheme.cardBorder,
          }}
          className="h-12 px-4 border-t flex items-center justify-between shrink-0"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            style={{
              backgroundColor: activeTheme.accent,
              color: activeTheme.isDark ? "#000" : "#fff",
            }}
            className="px-4 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>DRAW TO GRID ({previewResult?.pixelCount || 0} PIXELS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
