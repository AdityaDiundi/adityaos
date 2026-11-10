"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Wand2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  PixelSceneGenerator,
  GenerationRound,
  TextSceneOptions,
} from "./pixelSceneGenerator";

interface PixelSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasCols: number;
  canvasRows: number;
  onApplyPixels: (pixels: Map<string, string>, count: number) => void;
}

export const PixelSceneModal: React.FC<PixelSceneModalProps> = ({
  isOpen,
  onClose,
  canvasCols,
  canvasRows,
  onApplyPixels,
}) => {
  const { activeTheme } = useThemeStore();
  const { playClickChime } = useSoundStore();

  const [prompt, setPrompt] = useState<string>("Samurai under blooming sakura tree at dusk");
  const [archetype, setArchetype] = useState<"samurai" | "cyberpunk" | "student" | "wanderer">("samurai");
  const [timeOfDay, setTimeOfDay] = useState<"dusk" | "sunset" | "night" | "dawn">("dusk");
  const [rounds, setRounds] = useState<GenerationRound[]>([]);
  const [activeRoundIdx, setActiveRoundIdx] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate on initial open if empty
  const handleGenerate = () => {
    setIsGenerating(true);
    playClickChime?.(700);

    const cols = canvasCols || 80;
    const rows = canvasRows || 50;

    setTimeout(() => {
      const generatedRounds = PixelSceneGenerator.generateScene({
        prompt,
        archetype,
        timeOfDay,
        cols,
        rows,
      });
      setRounds(generatedRounds);
      setActiveRoundIdx(generatedRounds.length - 1); // Select final round by default
      setIsGenerating(false);
      playClickChime?.(850);
    }, 150);
  };

  useEffect(() => {
    if (isOpen && rounds.length === 0) {
      handleGenerate();
    }
  }, [isOpen]);

  // Render active round onto preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || rounds.length === 0) return;
    const currentRound = rounds[activeRoundIdx];
    if (!currentRound) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const pw = currentRound.width;
    const ph = currentRound.height;
    const scale = Math.max(3, Math.min(8, Math.floor(400 / Math.max(pw, ph))));

    canvas.width = pw * scale;
    canvas.height = ph * scale;

    ctx.fillStyle = activeTheme.isDark ? "#0A0D14" : "#F5EFEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    currentRound.pixels.forEach((hex, key) => {
      const idx = key.indexOf("_");
      const r = +key.slice(0, idx);
      const c = +key.slice(idx + 1);

      ctx.fillStyle = hex;
      ctx.fillRect(c * scale, r * scale, scale, scale);
    });
  }, [rounds, activeRoundIdx, activeTheme]);

  if (!isOpen) return null;

  const currentRound = rounds[activeRoundIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm select-none font-mono text-xs">
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
          className="h-10 border-b px-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-stone-900 dark:text-zinc-100">
              Text-to-Pixel-Grid Scene Generator
            </span>
            <span className="text-[10px] opacity-60">
              (Layered composition & 3-round critique loop)
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
        <div className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Left: Interactive Canvas Preview & Round Tabs */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded border border-black/5 dark:border-white/5 p-3 min-h-[360px] relative">
            {/* Rounds Selector Tabs */}
            {rounds.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {rounds.map((r, idx) => {
                  const isSelected = activeRoundIdx === idx;
                  return (
                    <button
                      key={r.round}
                      type="button"
                      onClick={() => {
                        setActiveRoundIdx(idx);
                        playClickChime?.(600);
                      }}
                      className={`px-3 py-1 rounded border text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "border-stone-900 dark:border-zinc-100 bg-black/10 dark:bg-white/15 font-bold"
                          : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span>Round {r.round}</span>
                      {r.allPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Canvas */}
            <canvas
              ref={previewCanvasRef}
              className="rounded shadow-md border border-black/10 dark:border-white/10"
              style={{ imageRendering: "pixelated" }}
            />

            <div className="mt-2 text-[10px] opacity-60">
              Output: Pure 2D palette-indexed pixel grid (6-16 colors, Chibi 32px height, grounded cast shadow)
            </div>
          </div>

          {/* Right: Controls & Critique Inspector */}
          <div className="w-full lg:w-80 flex flex-col gap-3 text-[11px]">
            {/* Archetype & Time of Day */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold opacity-60">Archetype & Environment</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "samurai", label: "Samurai (Blossom)" },
                  { id: "cyberpunk", label: "Cyberpunk Hacker" },
                  { id: "wanderer", label: "Mountain Wanderer" },
                  { id: "student", label: "Student with Bag" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setArchetype(item.id as any)}
                    className={`px-2 py-1 rounded text-left border cursor-pointer transition-colors ${
                      archetype === item.id
                        ? "border-stone-900 dark:border-zinc-100 bg-black/5 dark:bg-white/10 font-bold"
                        : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1 mt-1">
                {(["dusk", "sunset", "night", "dawn"] as const).map((tod) => (
                  <button
                    key={tod}
                    type="button"
                    onClick={() => setTimeOfDay(tod)}
                    className={`px-1.5 py-0.5 rounded text-center border capitalize cursor-pointer transition-colors ${
                      timeOfDay === tod
                        ? "border-stone-900 dark:border-zinc-100 bg-black/5 dark:bg-white/10 font-bold"
                        : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {tod}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-1.5 py-1.5 rounded border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                <span>{isGenerating ? "Synthesizing Grid..." : "Re-generate 3 Rounds"}</span>
              </button>
            </div>

            {/* Critique Checklist Scorecard */}
            <div className="flex flex-col gap-1.5 border-t border-black/5 dark:border-white/5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-60">
                  Critique Inspector (Round {activeRoundIdx + 1})
                </span>
                <span className="text-[9px] opacity-70">
                  {currentRound?.critique.filter((c) => c.passed).length}/6 Passed
                </span>
              </div>

              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px]">
                {currentRound?.critique.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 rounded border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col gap-0.5"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[10px]">
                      {item.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] opacity-60 pl-4">{item.notes}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Palette Breakdown */}
            {currentRound && (
              <div className="flex flex-col gap-1 border-t border-black/5 dark:border-white/5 pt-2">
                <span className="text-[10px] uppercase font-bold opacity-60">
                  Scene Palette ({currentRound.palette.length} colors)
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentRound.palette.map((hex, idx) => (
                    <div
                      key={idx}
                      title={hex}
                      style={{ backgroundColor: hex }}
                      className="w-4 h-4 rounded-xs border border-black/20 dark:border-white/20"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            backgroundColor: activeTheme.headerBg,
            borderColor: activeTheme.headerBorder,
          }}
          className="h-11 border-t px-4 flex items-center justify-between"
        >
          <span className="text-[10px] opacity-60 font-mono">
            Writes to canvas buffer & commits as single undo step
          </span>

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
              disabled={!currentRound || currentRound.pixels.size === 0}
              onClick={() => {
                if (currentRound) {
                  onApplyPixels(currentRound.pixels, currentRound.pixels.size);
                  onClose();
                }
              }}
              style={{
                backgroundColor: activeTheme.accent,
                color: activeTheme.isDark ? "#000" : "#FFF",
              }}
              className="px-4 py-1 rounded font-medium cursor-pointer disabled:opacity-50 transition-opacity"
            >
              Commit Scene to Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
