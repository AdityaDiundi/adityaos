"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  X,
  Sparkles,
  Sliders,
  Check,
  Upload,
  Layers,
  Palette,
  Eye,
} from "lucide-react";
import {
  runPixelConversionPipeline,
  ConversionPipelineOptions,
  ConversionPipelineResult,
  NAMED_PALETTES,
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

  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(imageSrc);
  const [targetPreset, setTargetPreset] = useState<"char32" | "char48" | "scene160" | "canvas">("char48");
  const [paletteName, setPaletteName] = useState<"animeChibi" | "editorial" | "pico8" | "tokyoDusk">("animeChibi");
  const [maxPaletteColors, setMaxPaletteColors] = useState<number>(12);
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const [bgTolerance, setBgTolerance] = useState<number>(35);

  // Toggleable Cleanup Passes
  const [passRemoveOrphans, setPassRemoveOrphans] = useState<boolean>(true);
  const [passDarkOutline, setPassDarkOutline] = useState<boolean>(true);
  const [passSnapTwoTone, setPassSnapTwoTone] = useState<boolean>(true);
  const [passGradientDitherOnly, setPassGradientDitherOnly] = useState<boolean>(true);

  // View state: split comparison vs converted only
  const [previewMode, setPreviewMode] = useState<"split" | "pixel" | "original">("split");

  const [previewResult, setPreviewResult] = useState<ConversionPipelineResult | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageSrc) setActiveImageSrc(imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    if (!activeImageSrc) {
      setLoadedImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setLoadedImg(img);
    img.src = activeImageSrc;
  }, [activeImageSrc]);

  // Adjust default max palette colors based on target preset
  useEffect(() => {
    if (targetPreset === "char32" || targetPreset === "char48") {
      setMaxPaletteColors(12);
      setPaletteName("animeChibi");
    } else {
      setMaxPaletteColors(16);
      setPaletteName("editorial");
    }
  }, [targetPreset]);

  // Run conversion pipeline whenever options change
  useEffect(() => {
    if (!loadedImg) return;

    let cols = 48;
    let rows = 48;
    if (targetPreset === "char32") {
      cols = 32;
      rows = 32;
    } else if (targetPreset === "char48") {
      cols = 48;
      rows = 48;
    } else if (targetPreset === "scene160") {
      cols = 160;
      rows = 90;
    } else if (targetPreset === "canvas") {
      cols = canvasCols || 80;
      rows = canvasRows || 50;
    }

    const options: ConversionPipelineOptions = {
      targetCols: cols,
      targetRows: rows,
      paletteName,
      maxPaletteColors,
      removeBg,
      bgTolerance,
      passRemoveOrphans,
      passDarkOutline,
      passSnapTwoTone,
      passGradientDitherOnly,
    };

    const res = runPixelConversionPipeline(loadedImg, options);
    setPreviewResult(res);
  }, [
    loadedImg,
    targetPreset,
    paletteName,
    maxPaletteColors,
    removeBg,
    bgTolerance,
    passRemoveOrphans,
    passDarkOutline,
    passSnapTwoTone,
    passGradientDitherOnly,
    canvasCols,
    canvasRows,
  ]);

  // Render before/after onto preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !previewResult || !loadedImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const pw = previewResult.width;
    const ph = previewResult.height;
    const scale = Math.max(3, Math.min(8, Math.floor(320 / Math.max(pw, ph))));

    canvas.width = pw * scale;
    canvas.height = ph * scale;

    ctx.fillStyle = activeTheme.isDark ? "#0A0D14" : "#F5EFEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (previewMode === "original") {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
      return;
    }

    // Render pixel result
    previewResult.pixels.forEach((hex, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      if (previewMode === "split" && c < Math.floor(pw / 2)) {
        // Left half: original image
        return;
      }

      ctx.fillStyle = hex;
      ctx.fillRect(c * scale, r * scale, scale, scale);
    });

    if (previewMode === "split") {
      // Draw left half with original image
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, Math.floor(pw / 2) * scale, canvas.height);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = activeTheme.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.floor(pw / 2) * scale, 0);
      ctx.lineTo(Math.floor(pw / 2) * scale, canvas.height);
      ctx.stroke();
    }
  }, [previewResult, loadedImg, previewMode, activeTheme]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none font-mono text-xs">
      <div
        style={{
          backgroundColor: activeTheme.windowBg,
          borderColor: activeTheme.cardBorder,
          color: activeTheme.textPrimary,
        }}
        className="w-full max-w-3xl max-h-[90vh] rounded border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="h-10 border-b px-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-stone-900 dark:text-zinc-100">
              Image to Pixel Art Conversion Pipeline
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4 min-h-0">
          {/* Left: Canvas Preview */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 p-3 min-h-[300px] relative">
            {loadedImg ? (
              <div className="flex flex-col items-center gap-2">
                <canvas
                  ref={previewCanvasRef}
                  className="rounded shadow-md border border-black/10 dark:border-white/10"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="flex items-center gap-1.5 text-[10px] opacity-70">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("split")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      previewMode === "split" ? "bg-black/10 dark:bg-white/10 font-bold" : ""
                    }`}
                  >
                    Split Before/After
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("pixel")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      previewMode === "pixel" ? "bg-black/10 dark:bg-white/10 font-bold" : ""
                    }`}
                  >
                    Pixel Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("original")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      previewMode === "original" ? "bg-black/10 dark:bg-white/10 font-bold" : ""
                    }`}
                  >
                    Original Only
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-500 dark:text-zinc-400">
                <Upload className="w-8 h-8 opacity-40" />
                <span>Upload an image to start pixel pipeline</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded border border-current text-[11px] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer mt-1"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>

          {/* Right: Controls Strip */}
          <div className="w-full md:w-72 flex flex-col gap-3 text-[11px]">
            {/* Target Resolution */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold opacity-60">Target Grid</span>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: "char32", label: "Char 32×32" },
                  { id: "char48", label: "Char 48×48" },
                  { id: "scene160", label: "Scene 160×90" },
                  { id: "canvas", label: "Current Canvas" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetPreset(item.id as any)}
                    className={`px-2 py-1 rounded text-left border cursor-pointer transition-colors ${
                      targetPreset === item.id
                        ? "border-stone-900 dark:border-zinc-100 bg-black/5 dark:bg-white/10 font-bold"
                        : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Named Palette */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold opacity-60">Quantize Palette</span>
              <select
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value as any)}
                className="w-full p-1.5 rounded border border-black/10 dark:border-white/10 bg-transparent cursor-pointer font-mono text-[11px]"
              >
                <option value="animeChibi" className="bg-stone-900 text-white">Anime Chibi (12 colors)</option>
                <option value="editorial" className="bg-stone-900 text-white">Editorial Cream (12 colors)</option>
                <option value="pico8" className="bg-stone-900 text-white">PICO-8 Classic (16 colors)</option>
                <option value="tokyoDusk" className="bg-stone-900 text-white">Tokyo Dusk (16 colors)</option>
              </select>
            </div>

            {/* Palette Colors Clamping */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="uppercase font-bold opacity-60">Max Colors</span>
                <span>{maxPaletteColors} colors</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={maxPaletteColors}
                onChange={(e) => setMaxPaletteColors(+e.target.value)}
                className="w-full accent-stone-700 dark:accent-zinc-300 cursor-pointer"
              />
            </div>

            {/* Background Removal */}
            <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
              <span className="text-[10px] uppercase font-bold opacity-60">Isolate Subject</span>
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="cursor-pointer"
              />
            </div>

            {/* Cleanup Passes (Toggleable) */}
            <div className="flex flex-col gap-1.5 border-t border-black/5 dark:border-white/5 pt-2">
              <span className="text-[10px] uppercase font-bold opacity-60">Cleanup Passes</span>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>Remove orphan single pixels</span>
                <input
                  type="checkbox"
                  checked={passRemoveOrphans}
                  onChange={(e) => setPassRemoveOrphans(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>1px dark-shade outline</span>
                <input
                  type="checkbox"
                  checked={passDarkOutline}
                  onChange={(e) => setPassDarkOutline(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>2-tone cel shading snap</span>
                <input
                  type="checkbox"
                  checked={passSnapTwoTone}
                  onChange={(e) => setPassSnapTwoTone(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>Dither gradients & skies only</span>
                <input
                  type="checkbox"
                  checked={passGradientDitherOnly}
                  onChange={(e) => setPassGradientDitherOnly(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => setActiveImageSrc(ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }}
          accept="image/*"
          className="hidden"
        />

        {/* Footer Actions */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="h-11 border-t px-4 flex items-center justify-between"
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:underline cursor-pointer"
          >
            Change Image
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!previewResult || previewResult.pixels.size === 0}
              onClick={() => {
                if (previewResult) {
                  onApplyPixels(previewResult.pixels, previewResult.pixels.size);
                  onClose();
                }
              }}
              style={{
                backgroundColor: activeTheme.accent,
                color: activeTheme.isDark ? "#000" : "#FFF",
              }}
              className="px-4 py-1 rounded font-medium cursor-pointer disabled:opacity-50 transition-opacity"
            >
              Commit to Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
