"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  Split,
  Image as ImageIcon,
} from "lucide-react";
import {
  runPixelConversionPipeline,
  analyzeSourceImage,
  calculateTargetGrid,
  snapToResolutionStep,
  RESOLUTION_STEPS,
  SourceType,
  SourceAnalysis,
  PaletteColor,
  NAMED_PALETTES,
  extractKMeansPalette,
  ConversionPipelineOptions,
  ConversionPipelineResult,
} from "./pixelArtConverter";

interface PixelArtImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  canvasCols: number;
  canvasRows: number;
  onApplyPixels: (pixels: Map<string, string>, count: number) => void;
}

type DebugStage =
  | "split"
  | "final"
  | "mask"
  | "downscaled"
  | "quantized"
  | "dithered"
  | "cleaned"
  | "outlined"
  | "original";

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
  const [cachedSourceData, setCachedSourceData] = useState<{
    data: Uint8ClampedArray;
    width: number;
    height: number;
  } | null>(null);

  // Analysis result
  const [analysis, setAnalysis] = useState<SourceAnalysis | null>(null);

  // 1. Source Type Selector
  const [selectedSourceType, setSelectedSourceType] = useState<SourceType>("illustration");

  // 2. Target Resolution (longest side)
  const [longestSide, setLongestSide] = useState<number>(96);

  // 3. Palette Controls
  const [paletteMode, setPaletteMode] = useState<"dynamic_kmeans" | "named" | "reference_image">("dynamic_kmeans");
  const [namedPaletteKey, setNamedPaletteKey] = useState<string>("animeChibi");
  const [maxPaletteColors, setMaxPaletteColors] = useState<number>(16);
  const [referencePalette, setReferencePalette] = useState<PaletteColor[] | null>(null);
  const [referenceImgSrc, setReferenceImgSrc] = useState<string | null>(null);

  // 4. Dither Controls
  const [ditherEnabled, setDitherEnabled] = useState<boolean>(true);
  const [ditherStrength, setDitherStrength] = useState<number>(0.55);

  // 5. Cleanup Controls
  const [isolateSubject, setIsolateSubject] = useState<boolean>(true);
  const [bgTolerance, setBgTolerance] = useState<number>(35);
  const [despeckleEnabled, setDespeckleEnabled] = useState<boolean>(true);
  const [despeckleMinSize, setDespeckleMinSize] = useState<number>(3);
  const [passDarkOutline, setPassDarkOutline] = useState<boolean>(true);
  const [passSnapTwoTone, setPassSnapTwoTone] = useState<boolean>(false);
  const [removeFloorLine, setRemoveFloorLine] = useState<boolean>(true);

  // 6. Debug Stage Inspector
  const [activeStage, setActiveStage] = useState<DebugStage>("split");

  // Conversion result & debouncing
  const [conversionResult, setConversionResult] = useState<ConversionPipelineResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (imageSrc) setActiveImageSrc(imageSrc);
  }, [imageSrc]);

  // Decode activeImageSrc into cachedSourceData and analyze
  useEffect(() => {
    if (!activeImageSrc) {
      setCachedSourceData(null);
      setAnalysis(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (w <= 0 || h <= 0) return;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);

      setCachedSourceData({
        data: imgData.data,
        width: w,
        height: h,
      });

      // Analyze source image
      const report = analyzeSourceImage(imgData.data, w, h);
      setAnalysis(report);
      setSelectedSourceType(report.detectedType);

      // Restore saved resolution for this source type or use suggested default
      const maxDim = Math.max(w, h);
      let initialRes = report.suggestedLongestSide;
      try {
        const saved = localStorage.getItem(`pixel_import_res_${report.detectedType}`);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= 16 && parsed <= 512) {
            initialRes = snapToResolutionStep(Math.min(parsed, maxDim));
          }
        }
      } catch {}

      // Clamp resolution: Never upscale past native size!
      setLongestSide(Math.min(initialRes, maxDim));
    };
    img.src = activeImageSrc;
  }, [activeImageSrc]);

  // When source type is manually changed, restore that type's last-used resolution
  const handleSelectSourceType = (type: SourceType) => {
    setSelectedSourceType(type);
    if (!cachedSourceData) return;
    const maxDim = Math.max(cachedSourceData.width, cachedSourceData.height);

    let targetRes = type === "photo" ? 160 : type === "pixel_art" ? 64 : 96;
    try {
      const saved = localStorage.getItem(`pixel_import_res_${type}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 16 && parsed <= 512) {
          targetRes = snapToResolutionStep(Math.min(parsed, maxDim));
        }
      }
    } catch {}

    setLongestSide(Math.min(targetRes, maxDim));
    playClickChime?.();
  };

  // Handle resolution slider change
  const handleResolutionChange = (newLongest: number) => {
    if (!cachedSourceData) return;
    const maxDim = Math.max(cachedSourceData.width, cachedSourceData.height);
    const clamped = Math.min(newLongest, maxDim);
    setLongestSide(clamped);

    try {
      localStorage.setItem(`pixel_import_res_${selectedSourceType}`, clamped.toString());
    } catch {}
  };

  // Reference image upload & palette extraction
  const handleReferenceImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setReferenceImgSrc(dataUrl);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(100, w);
        canvas.height = Math.min(100, h);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const samples: [number, number, number][] = [];
        for (let i = 0; i < imgData.data.length; i += 16) {
          if (imgData.data[i + 3] > 60) {
            samples.push([imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]]);
          }
        }
        if (samples.length > 0) {
          const extracted = extractKMeansPalette(samples, maxPaletteColors);
          setReferencePalette(extracted);
          setPaletteMode("reference_image");
          playClickChime?.(600);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Calculate target grid dimensions
  const targetGrid = useMemo(() => {
    if (!cachedSourceData) return { cols: 48, rows: 48 };
    return calculateTargetGrid(cachedSourceData.width, cachedSourceData.height, longestSide);
  }, [cachedSourceData, longestSide]);

  // Dynamic Resolution Advice Hint
  const resolutionAdvice = useMemo(() => {
    if (longestSide < 48) {
      return "Icon/sprite size — faces and fine text will be lost; best for simple shapes.";
    }
    if (longestSide <= 96) {
      return "Character size — readable faces and silhouettes, classic 16-bit look.";
    }
    if (longestSide <= 192) {
      return "Scene size — balanced detail and pixel aesthetic; recommended for most images.";
    }
    return "High-density — preserves fine detail, may look like a mosaic rather than pixel art.";
  }, [longestSide]);

  // Maximum allowed longest dimension (never upscale past native)
  const maxAllowedLongest = useMemo(() => {
    if (!cachedSourceData) return 512;
    return Math.max(16, Math.min(512, Math.max(cachedSourceData.width, cachedSourceData.height)));
  }, [cachedSourceData]);

  // Available snapped steps for current source image
  const availableSteps = useMemo(() => {
    return RESOLUTION_STEPS.filter((s) => s <= maxAllowedLongest);
  }, [maxAllowedLongest]);

  // Debounced pipeline execution
  useEffect(() => {
    if (!cachedSourceData) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsProcessing(true);
    debounceTimerRef.current = setTimeout(() => {
      const options: ConversionPipelineOptions = {
        sourceType: selectedSourceType,
        longestSide,
        paletteMode,
        paletteName: namedPaletteKey,
        referencePalette: referencePalette || undefined,
        maxPaletteColors,
        removeBg: isolateSubject,
        isolateSubject,
        bgTolerance,
        ditherEnabled,
        ditherStrength,
        despeckleEnabled,
        despeckleMinSize,
        passDarkOutline,
        passSnapTwoTone,
        removeFloorLine,
      };

      try {
        const result = runPixelConversionPipeline(cachedSourceData, options);
        setConversionResult(result);
      } catch (err) {
        console.error("Pixel conversion pipeline failed:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 65);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    cachedSourceData,
    selectedSourceType,
    longestSide,
    paletteMode,
    namedPaletteKey,
    referencePalette,
    maxPaletteColors,
    isolateSubject,
    bgTolerance,
    ditherEnabled,
    ditherStrength,
    despeckleEnabled,
    despeckleMinSize,
    passDarkOutline,
    passSnapTwoTone,
    removeFloorLine,
  ]);

  // Render on Preview Canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !conversionResult || !cachedSourceData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const pw = conversionResult.width;
    const ph = conversionResult.height;
    const scale = Math.max(2, Math.min(10, Math.floor(320 / Math.max(pw, ph))));

    canvas.width = pw * scale;
    canvas.height = ph * scale;

    ctx.fillStyle = activeTheme.isDark ? "#08090D" : "#F5EFEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (activeStage === "original") {
      ctx.imageSmoothingEnabled = true;
      const tempImg = new Image();
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
      };
      if (activeImageSrc) tempImg.src = activeImageSrc;
      return;
    }

    // Determine which pixel map to render based on active stage
    let targetMap: Map<string, string> = conversionResult.stages.final;
    if (activeStage === "mask") targetMap = conversionResult.stages.mask;
    else if (activeStage === "downscaled") targetMap = conversionResult.stages.downscaled;
    else if (activeStage === "quantized") targetMap = conversionResult.stages.quantized;
    else if (activeStage === "dithered") targetMap = conversionResult.stages.dithered;
    else if (activeStage === "cleaned") targetMap = conversionResult.stages.cleaned;
    else if (activeStage === "outlined") targetMap = conversionResult.stages.outlined;

    const splitCol = Math.floor(pw / 2);

    targetMap.forEach((hex, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      if (activeStage === "split" && c < splitCol) {
        // Left half is reserved for original image in split mode
        return;
      }

      ctx.fillStyle = hex;
      ctx.fillRect(c * scale, r * scale, scale, scale);
    });

    if (activeStage === "split" && activeImageSrc) {
      // Draw left half with original image
      const tempImg = new Image();
      tempImg.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitCol * scale, canvas.height);
        ctx.clip();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Divider Line
        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(splitCol * scale, 0);
        ctx.lineTo(splitCol * scale, canvas.height);
        ctx.stroke();
      };
      tempImg.src = activeImageSrc;
    }
  }, [conversionResult, cachedSourceData, activeStage, activeImageSrc, activeTheme]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm select-none font-mono text-xs">
      <div
        style={{
          backgroundColor: activeTheme.windowBg,
          borderColor: activeTheme.cardBorder,
          color: activeTheme.textPrimary,
        }}
        className="w-full max-w-4xl max-h-[92vh] rounded border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="h-10 border-b px-3.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-stone-900 dark:text-zinc-100">
              High-Fidelity Image to Pixel Art Pipeline
            </span>
            {analysis && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 dark:bg-white/10 opacity-75">
                Auto: {analysis.detectedType.toUpperCase()} ({Math.round(analysis.confidence * 100)}%)
              </span>
            )}
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
        <div className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Left: Interactive Canvas Preview & Stage Tabs */}
          <div className="flex-1 flex flex-col items-center justify-between bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 p-3 min-h-[360px] relative">
            {/* Stage Inspector Tabs */}
            <div className="w-full flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px] border-b border-black/5 dark:border-white/5">
              <span className="text-[9px] uppercase font-bold opacity-50 shrink-0">Stage:</span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { id: "split", label: "Split" },
                  { id: "final", label: "Final" },
                  { id: "mask", label: "Mask" },
                  { id: "downscaled", label: "Downscaled" },
                  { id: "quantized", label: "Quantized" },
                  { id: "dithered", label: "Dithered" },
                  { id: "cleaned", label: "Cleaned" },
                  { id: "outlined", label: "Outlined" },
                  { id: "original", label: "Original" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setActiveStage(st.id as DebugStage);
                      playClickChime?.();
                    }}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                      activeStage === st.id
                        ? "bg-black/15 dark:bg-white/20 font-bold border border-current"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 w-full flex items-center justify-center p-2 relative">
              {cachedSourceData ? (
                <canvas
                  ref={previewCanvasRef}
                  className="rounded shadow-lg border border-black/10 dark:border-white/10 max-h-[320px] max-w-full"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-500 dark:text-zinc-400">
                  <Upload className="w-8 h-8 opacity-40" />
                  <span>Upload an image to start high-fidelity pixel conversion</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded border border-current text-[11px] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer mt-1"
                  >
                    Choose Image File
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] animate-pulse">
                  Rendering...
                </div>
              )}
            </div>

            {/* Canvas Meta Info Footer */}
            {conversionResult && (
              <div className="w-full flex items-center justify-between text-[10px] opacity-75 pt-1 border-t border-black/5 dark:border-white/5">
                <span>
                  Grid: <b>{conversionResult.width} × {conversionResult.height}</b> ({conversionResult.pixels.size} px)
                </span>
                <span>
                  Palette: <b>{conversionResult.paletteUsed.length}</b> colors used
                </span>
              </div>
            )}
          </div>

          {/* Right: Controls Strip */}
          <div className="w-full lg:w-80 flex flex-col gap-3.5 text-[11px] overflow-y-auto pr-1">
            {/* 1. Source Type Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-60">Source Type</span>
                {analysis && (
                  <span className="text-[9px] opacity-60">
                    {analysis.uniqueColorCount} colors, edge {Math.round(analysis.edgeSharpness * 100)}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "photo", label: "Photo / Real", hint: "Edge-aware OKLab" },
                  { id: "illustration", label: "Cartoon / Anime", hint: "Dominant mode" },
                  { id: "ai_pixel", label: "AI Pixel-Style", hint: "Implicit grid snap" },
                  { id: "pixel_art", label: "Pixel Art", hint: "Nearest integer" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectSourceType(t.id as SourceType)}
                    className={`px-2 py-1.5 rounded text-left border cursor-pointer transition-all flex flex-col ${
                      selectedSourceType === t.id
                        ? "border-stone-900 dark:border-zinc-100 bg-black/10 dark:bg-white/10 font-bold"
                        : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="text-[9px] opacity-50 font-normal">{t.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Resolution Slider */}
            <div className="flex flex-col gap-1 border-t border-black/5 dark:border-white/5 pt-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold opacity-60">Target Resolution</span>
                <span className="font-bold text-stone-900 dark:text-zinc-100">
                  {targetGrid.cols} × {targetGrid.rows}
                  <span className="opacity-50 font-normal text-[10px] ml-1">
                    ({longestSide} max side)
                  </span>
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={availableSteps.length - 1}
                step="1"
                value={availableSteps.indexOf(snapToResolutionStep(longestSide))}
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  const stepVal = availableSteps[idx] || 96;
                  handleResolutionChange(stepVal);
                }}
                className="w-full accent-stone-700 dark:accent-zinc-300 cursor-pointer"
              />

              {/* Dynamic Resolution Advice Hint */}
              <p className="text-[10px] leading-tight opacity-70 italic text-stone-600 dark:text-zinc-400">
                {resolutionAdvice}
              </p>

              {/* Fit Current Canvas Viewport Shortcut */}
              {canvasCols > 0 && canvasRows > 0 && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      const canvasMax = Math.max(canvasCols, canvasRows);
                      handleResolutionChange(snapToResolutionStep(canvasMax));
                      playClickChime?.();
                    }}
                    title={`Snap longest side to fit current canvas viewport (${canvasCols} × ${canvasRows}) without zooming`}
                    className="px-2 py-0.5 rounded text-[10px] border border-black/10 dark:border-white/10 hover:border-current opacity-80 hover:opacity-100 cursor-pointer flex items-center gap-1"
                  >
                    <span>Fit Canvas Viewport ({canvasCols} × {canvasRows})</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Palette Reduction */}
            <div className="flex flex-col gap-2 border-t border-black/5 dark:border-white/5 pt-2.5">
              <span className="text-[10px] uppercase font-bold opacity-60">Palette & Quantization</span>

              {/* Palette Mode Selector */}
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                {[
                  { id: "dynamic_kmeans", label: "K-Means" },
                  { id: "named", label: "Named" },
                  { id: "reference_image", label: "Ref Image" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      setPaletteMode(pm.id as any);
                      playClickChime?.();
                    }}
                    className={`py-1 rounded border text-center cursor-pointer transition-colors ${
                      paletteMode === pm.id
                        ? "border-stone-900 dark:border-zinc-100 bg-black/10 dark:bg-white/10 font-bold"
                        : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Named Palette Options */}
              {paletteMode === "named" && (
                <select
                  value={namedPaletteKey}
                  onChange={(e) => setNamedPaletteKey(e.target.value)}
                  className="w-full p-1.5 rounded border border-black/15 dark:border-white/15 bg-transparent cursor-pointer font-mono text-[11px]"
                >
                  <option value="animeChibi" className="bg-stone-900 text-white">Anime Chibi (12 colors)</option>
                  <option value="editorial" className="bg-stone-900 text-white">Editorial Cream (16 colors)</option>
                  <option value="pico8" className="bg-stone-900 text-white">PICO-8 Classic (16 colors)</option>
                  <option value="tokyoDusk" className="bg-stone-900 text-white">Tokyo Dusk (16 colors)</option>
                  <option value="endesga32" className="bg-stone-900 text-white">Endesga 32 (32 colors)</option>
                  <option value="gameboy" className="bg-stone-900 text-white">Game Boy (4 colors)</option>
                </select>
              )}

              {/* Reference Image Upload */}
              {paletteMode === "reference_image" && (
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => refFileInputRef.current?.click()}
                    className="w-full py-1.5 rounded border border-dashed border-black/20 dark:border-white/20 hover:border-current flex items-center justify-center gap-1.5 cursor-pointer text-[10px]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{referencePalette ? "Change Reference Image" : "Upload Reference Image"}</span>
                  </button>
                  {referencePalette && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ Extracted {referencePalette.length} dominant colors
                    </span>
                  )}
                </div>
              )}

              {/* Max Palette Colors Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="opacity-60">Color Count</span>
                  <span className="font-bold">{maxPaletteColors} colors</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={maxPaletteColors}
                  onChange={(e) => setMaxPaletteColors(+e.target.value)}
                  className="w-full accent-stone-700 dark:accent-zinc-300 cursor-pointer"
                />
              </div>

              {/* Swatch Preview of Used Palette */}
              {conversionResult && conversionResult.paletteUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {conversionResult.paletteUsed.slice(0, 24).map((hex, i) => (
                    <div
                      key={i}
                      title={hex}
                      style={{ backgroundColor: hex }}
                      className="w-3.5 h-3.5 rounded-xs border border-black/20 shadow-xs"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 4. Selective Dithering */}
            <div className="flex flex-col gap-1.5 border-t border-black/5 dark:border-white/5 pt-2.5">
              <label className="flex items-center justify-between text-[11px] cursor-pointer font-bold">
                <span>Bayer 4×4 Gradient Dither</span>
                <input
                  type="checkbox"
                  checked={ditherEnabled}
                  onChange={(e) => setDitherEnabled(e.target.checked)}
                />
              </label>

              {ditherEnabled && (
                <div className="flex flex-col gap-1 pl-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="opacity-60">Dither Strength</span>
                    <span>{Math.round(ditherStrength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={ditherStrength}
                    onChange={(e) => setDitherStrength(+e.target.value)}
                    className="w-full accent-stone-700 dark:accent-zinc-300 cursor-pointer"
                  />
                  <span className="text-[9px] opacity-50">
                    Restricted to smooth gradients and skies; suppressed on faces and line-art.
                  </span>
                </div>
              )}
            </div>

            {/* 5. Cleanup Passes */}
            <div className="flex flex-col gap-1.5 border-t border-black/5 dark:border-white/5 pt-2.5">
              <span className="text-[10px] uppercase font-bold opacity-60">Cleanup & Artifact Removal</span>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>Isolate Subject (Remove background)</span>
                <input
                  type="checkbox"
                  checked={isolateSubject}
                  onChange={(e) => setIsolateSubject(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>Despeckle stray island specks</span>
                <input
                  type="checkbox"
                  checked={despeckleEnabled}
                  onChange={(e) => setDespeckleEnabled(e.target.checked)}
                />
              </label>

              {despeckleEnabled && (
                <div className="flex justify-between items-center text-[10px] pl-2">
                  <span className="opacity-60">Min cluster size</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 6].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setDespeckleMinSize(sz)}
                        className={`px-1.5 py-0.5 rounded text-[9px] cursor-pointer ${
                          despeckleMinSize === sz ? "bg-black/20 dark:bg-white/20 font-bold" : "opacity-60"
                        }`}
                      >
                        {sz}px
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>1px non-black darker outline</span>
                <input
                  type="checkbox"
                  checked={passDarkOutline}
                  onChange={(e) => setPassDarkOutline(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>2-tone cel-shading snap</span>
                <input
                  type="checkbox"
                  checked={passSnapTwoTone}
                  onChange={(e) => setPassSnapTwoTone(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-[11px] cursor-pointer">
                <span>Remove bottom floor line artifact</span>
                <input
                  type="checkbox"
                  checked={removeFloorLine}
                  onChange={(e) => setRemoveFloorLine(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Hidden File Inputs */}
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

        <input
          type="file"
          ref={refFileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleReferenceImageUpload(file);
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
              disabled={!conversionResult || conversionResult.pixels.size === 0}
              onClick={() => {
                if (conversionResult) {
                  onApplyPixels(conversionResult.pixels, conversionResult.pixels.size);
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
