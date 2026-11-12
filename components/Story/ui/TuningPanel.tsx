"use client";

import React, { useState, useEffect, useCallback } from "react";
import { JourneyConfig, DEFAULT_JOURNEY_CONFIG } from "@/content/journey.config";
import { TickerState } from "../engine/StoryTicker";

export interface TuningPanelProps {
  config: JourneyConfig;
  tickerState: TickerState;
  onUpdateConfig: (newConfig: JourneyConfig) => void;
  onRunBenchmark: () => Promise<PerfResult[]>;
}

export interface PerfResult {
  speed: "Slow (0.5x)" | "Normal (1.0x)" | "Fast (2.5x)";
  avgFps: number;
  p50Ms: number;
  p95Ms: number;
  droppedFrames: number;
  longTasks: number;
}

export function TuningPanel({
  config,
  tickerState,
  onUpdateConfig,
  onRunBenchmark,
}: TuningPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResults, setBenchmarkResults] = useState<PerfResult[] | null>(null);

  // Check ?perf=1 in URL to auto-trigger benchmark
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("perf") === "1" || params.get("perf") === "true") {
      setIsCollapsed(false);
      handleBenchmarkRun();
    }
  }, []);

  const handleChange = (key: keyof JourneyConfig, value: number | boolean) => {
    onUpdateConfig({
      ...config,
      [key]: value,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReset = () => {
    onUpdateConfig({ ...DEFAULT_JOURNEY_CONFIG });
  };

  const handleBenchmarkRun = useCallback(async () => {
    setIsBenchmarking(true);
    try {
      const results = await onRunBenchmark();
      setBenchmarkResults(results);
      console.table(results);
    } finally {
      setIsBenchmarking(false);
    }
  }, [onRunBenchmark]);

  return (
    <div
      aria-label="Engine Tuning Panel"
      className="fixed bottom-4 left-4 z-50 font-mono text-[11px] text-[#22C55E] select-none max-w-sm pointer-events-auto"
    >
      {/* Header bar toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between gap-3 bg-black/90 px-3 py-1.5 rounded-t cursor-pointer border border-[#22C55E]/40 hover:bg-black transition-colors"
      >
        <span className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          JOURNEY TUNING
        </span>
        <span className="text-[#9CA3AF] text-[10px]">
          {isCollapsed ? "[+ EXPAND]" : "[- COLLAPSE]"}
        </span>
      </div>

      {/* Expanded Controls Body */}
      {!isCollapsed && (
        <div className="bg-black/95 p-3 rounded-b border-x border-b border-[#22C55E]/40 space-y-3 max-h-[80vh] overflow-y-auto">
          {/* Live Telemetry Box */}
          <div className="bg-[#111827] p-2 rounded border border-gray-800 space-y-0.5 text-gray-300">
            <div className="text-white font-bold mb-1 border-b border-gray-700 pb-0.5">
              TELEMETRY
            </div>
            <div>Raw Scroll Progress: {(tickerState.rawProgress * 100).toFixed(1)}%</div>
            <div>Mapped Parameter (tau): {(tickerState.mappedTau * 100).toFixed(1)}%</div>
            <div>Velocity: {tickerState.velocity.toFixed(5)}</div>
            <div>Station: Index {tickerState.activeStationIndex} ({tickerState.currentYear})</div>
            <div>FPS: {tickerState.fps} (p50: {tickerState.p50Ms.toFixed(1)}ms, p95: {tickerState.p95Ms.toFixed(1)}ms)</div>
            <div>Dropped (&gt;33ms): {tickerState.droppedFrames} | Long Tasks (&gt;50ms): {tickerState.longTasks}</div>
            <div>Render Scale: {tickerState.renderScale.toFixed(2)}x | Settled: {tickerState.isSettled ? "YES" : "NO"}</div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={handleCopy}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] border border-zinc-600 transition-colors"
            >
              {copySuccess ? "COPIED!" : "COPY JSON"}
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] border border-zinc-600 transition-colors"
            >
              RESET
            </button>
            <button
              onClick={handleBenchmarkRun}
              disabled={isBenchmarking}
              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded text-[10px] border border-emerald-600 disabled:opacity-50 transition-colors"
            >
              {isBenchmarking ? "TESTING..." : "RUN PERF"}
            </button>
          </div>

          {/* Benchmark Results Display */}
          {benchmarkResults && (
            <div className="bg-black p-2 rounded border border-emerald-700 space-y-1">
              <div className="text-emerald-400 font-bold border-b border-emerald-800 pb-0.5">
                BENCHMARK RESULTS
              </div>
              {benchmarkResults.map((res, i) => (
                <div key={i} className="text-[10px] text-gray-300 border-b border-gray-900 pb-1">
                  <div className="text-white font-semibold">{res.speed}</div>
                  <div>FPS: {res.avgFps} | p50: {res.p50Ms}ms | p95: {res.p95Ms}ms</div>
                  <div>Dropped: {res.droppedFrames} | Long Tasks: {res.longTasks}</div>
                </div>
              ))}
            </div>
          )}

          {/* Live Sliders */}
          <div className="space-y-2 pt-1">
            <div className="text-white font-bold border-b border-gray-800 pb-0.5">
              FEEL PARAMETERS
            </div>

            {/* Dwell Fraction */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Dwell Plateau Fraction:</span>
                <span className="text-white">{config.dwellFraction.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.05"
                value={config.dwellFraction}
                onChange={(e) => handleChange("dwellFraction", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Camera Damp Lambda */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Camera Damp Lambda:</span>
                <span className="text-white">{config.cameraDampLambda.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="16.0"
                step="0.5"
                value={config.cameraDampLambda}
                onChange={(e) => handleChange("cameraDampLambda", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Lenis Lerp */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Lenis Lerp:</span>
                <span className="text-white">{config.lenisLerp.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.03"
                max="0.25"
                step="0.01"
                value={config.lenisLerp}
                onChange={(e) => handleChange("lenisLerp", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Max Camera Speed */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Max Camera Speed:</span>
                <span className="text-white">{config.maxCameraSpeed.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                step="5"
                value={config.maxCameraSpeed}
                onChange={(e) => handleChange("maxCameraSpeed", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Warp Velocity Threshold */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Warp Velocity Threshold:</span>
                <span className="text-white">{config.warpVelocityThreshold.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.010"
                step="0.0005"
                value={config.warpVelocityThreshold}
                onChange={(e) => handleChange("warpVelocityThreshold", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Snap Proximity */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Snap Proximity:</span>
                <span className="text-white">{config.snapProximity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.45"
                step="0.05"
                value={config.snapProximity}
                onChange={(e) => handleChange("snapProximity", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Total Height Desktop */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Track Height Desktop:</span>
                <span className="text-white">{config.totalScrollLengthVhDesktop}vh</span>
              </div>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={config.totalScrollLengthVhDesktop}
                onChange={(e) => handleChange("totalScrollLengthVhDesktop", parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Render Scale */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-400">
                <span>Render Scale:</span>
                <span className="text-white">{config.renderScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={config.renderScale}
                onChange={(e) => handleChange("renderScale", parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
