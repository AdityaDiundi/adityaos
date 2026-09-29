"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Zap,
  Activity,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

type LogicGateType = "AND" | "OR" | "XOR" | "NAND" | "NOR" | "NOT";

export const LogicLab: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playClickChime, playScrollNote } = useSoundStore();

  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);
  const [selectedGate, setSelectedGate] = useState<LogicGateType>("XOR");
  const [clockFrequency, setClockFrequency] = useState<number>(2); // Hz
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);
  const [clockTick, setClockTick] = useState<number>(0);

  // Clock Pulse Simulation
  useEffect(() => {
    if (!isClockRunning) return;
    const intervalTime = Math.max(100, Math.floor(1000 / clockFrequency));
    const timer = setInterval(() => {
      setClockTick((prev) => (prev + 1) % 100);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isClockRunning, clockFrequency]);

  // Compute Output based on Gate
  const computeGateOutput = (gate: LogicGateType, a: boolean, b: boolean): boolean => {
    switch (gate) {
      case "AND":
        return a && b;
      case "OR":
        return a || b;
      case "XOR":
        return a !== b;
      case "NAND":
        return !(a && b);
      case "NOR":
        return !(a || b);
      case "NOT":
        return !a;
      default:
        return false;
    }
  };

  const output = computeGateOutput(selectedGate, inputA, inputB);

  // Truth Table Generator for Selected Gate
  const truthTableRows: { a: boolean; b: boolean; out: boolean }[] =
    selectedGate === "NOT"
      ? [
          { a: false, b: false, out: computeGateOutput("NOT", false, false) },
          { a: true, b: false, out: computeGateOutput("NOT", true, false) },
        ]
      : [
          { a: false, b: false, out: computeGateOutput(selectedGate, false, false) },
          { a: false, b: true, out: computeGateOutput(selectedGate, false, true) },
          { a: true, b: false, out: computeGateOutput(selectedGate, true, false) },
          { a: true, b: true, out: computeGateOutput(selectedGate, true, true) },
        ];

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full font-mono text-xs select-none overflow-hidden"
    >
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-9 border-b px-3 flex items-center justify-between text-[11px] flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold tracking-tight">
            LOGIC_LAB // IIIT DELHI ECE WORKBENCH
          </span>
          <span className="text-[10px] opacity-60 hidden sm:inline">
            // Digital Logic, Boolean Gates & Oscilloscope
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsClockRunning(!isClockRunning);
              playClickChime(500);
            }}
            style={{
              backgroundColor: isClockRunning ? `${activeTheme.accent}20` : activeTheme.cardBg,
              borderColor: isClockRunning ? activeTheme.accent : activeTheme.cardBorder,
              color: isClockRunning ? activeTheme.accent : activeTheme.textMuted,
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold hover:opacity-80 transition-all"
          >
            <Zap className={`w-3 h-3 ${isClockRunning ? "text-amber-400 animate-pulse" : "opacity-50"}`} />
            <span>CLK: {isClockRunning ? `${clockFrequency}Hz` : "HALT"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Breadboard */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {/* Academic / Hardware Background Note */}
        <div
          style={{
            backgroundColor: `${activeTheme.cardBg}80`,
            borderColor: activeTheme.cardBorder,
          }}
          className="p-3 rounded-md border flex items-start gap-3"
        >
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 flex-shrink-0 mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-xs flex items-center gap-2">
              <span className="text-white">IIIT Delhi B.Tech in Electronics & Communication</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                Hardware Core
              </span>
            </div>
            <p className="text-[11px] opacity-75 leading-relaxed">
              Before leading product design at scale (100K+ DAU at MFine), my foundational thinking was forged in silicon: digital logic synthesis, Verilog, semiconductor physics, and signal processing. This workbench models interactive boolean gates in real-time.
            </p>
          </div>
        </div>

        {/* Gate Selection Chips */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
            Select Logic Gate IC:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["AND", "OR", "XOR", "NAND", "NOR", "NOT"] as LogicGateType[]).map((gate) => {
              const isSelected = selectedGate === gate;
              return (
                <button
                  key={gate}
                  type="button"
                  onClick={() => {
                    setSelectedGate(gate);
                    playClickChime(600);
                  }}
                  style={{
                    backgroundColor: isSelected ? activeTheme.accent : activeTheme.cardBg,
                    borderColor: isSelected ? activeTheme.accent : activeTheme.cardBorder,
                    color: isSelected
                      ? activeTheme.isDark
                        ? "#000"
                        : "#fff"
                      : activeTheme.textPrimary,
                  }}
                  className="px-3 py-1 rounded border font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {gate} GATE
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Circuit Canvas */}
        <div
          style={{
            backgroundColor: `${activeTheme.cardBg}60`,
            borderColor: activeTheme.cardBorder,
          }}
          className="p-5 rounded-lg border relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner"
        >
          {/* Inputs Section */}
          <div className="flex flex-col gap-3 items-center md:items-start w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
              Input Terminals
            </div>

            {/* Input A Switch */}
            <button
              type="button"
              onClick={() => {
                setInputA(!inputA);
                playClickChime(inputA ? 350 : 700);
              }}
              style={{
                backgroundColor: inputA ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                borderColor: inputA ? "#10B981" : "#EF4444",
                color: inputA ? "#34D399" : "#F87171",
              }}
              className="flex items-center justify-between gap-4 px-3 py-2 rounded-md border w-44 hover:opacity-90 transition-all font-mono font-bold"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[10px] opacity-60">IN_A:</span>
                <span>{inputA ? "HIGH (1)" : "LOW (0)"}</span>
              </span>
              <span className={`w-3 h-3 rounded-full ${inputA ? "bg-emerald-400 shadow-md shadow-emerald-500/50" : "bg-red-500"}`} />
            </button>

            {/* Input B Switch (Disabled if NOT gate) */}
            {selectedGate !== "NOT" ? (
              <button
                type="button"
                onClick={() => {
                  setInputB(!inputB);
                  playClickChime(inputB ? 350 : 700);
                }}
                style={{
                  backgroundColor: inputB ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  borderColor: inputB ? "#10B981" : "#EF4444",
                  color: inputB ? "#34D399" : "#F87171",
                }}
                className="flex items-center justify-between gap-4 px-3 py-2 rounded-md border w-44 hover:opacity-90 transition-all font-mono font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-60">IN_B:</span>
                  <span>{inputB ? "HIGH (1)" : "LOW (0)"}</span>
                </span>
                <span className={`w-3 h-3 rounded-full ${inputB ? "bg-emerald-400 shadow-md shadow-emerald-500/50" : "bg-red-500"}`} />
              </button>
            ) : (
              <div className="w-44 px-3 py-2 rounded border border-dashed border-white/20 text-[10px] opacity-40 text-center">
                [IN_B: N/A for NOT]
              </div>
            )}
          </div>

          {/* Central Gate Representation */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 shadow-lg space-y-2 min-w-[140px]">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              TTL IC 74LS{selectedGate === "AND" ? "08" : selectedGate === "OR" ? "32" : selectedGate === "XOR" ? "86" : selectedGate === "NAND" ? "00" : selectedGate === "NOR" ? "02" : "04"}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
              [{selectedGate}]
            </div>
            <div className="text-[9px] opacity-60">5.0V VCC / GND</div>
          </div>

          {/* Output Section with glowing LED indicator */}
          <div className="flex flex-col gap-3 items-center md:items-end w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
              Output Line (Q)
            </div>

            <div
              style={{
                backgroundColor: output ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.15)",
                borderColor: output ? "#10B981" : "#EF4444",
                color: output ? "#34D399" : "#F87171",
              }}
              className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-md border w-44 font-mono font-bold transition-all shadow-md"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[10px] opacity-60">OUT_Q:</span>
                <span className="text-sm">{output ? "TRUE (1)" : "FALSE (0)"}</span>
              </span>
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  output
                    ? "bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse"
                    : "bg-red-500 opacity-60"
                }`}
              />
            </div>

            <div className="text-[10px] opacity-60 font-mono">
              Signal: {output ? "+5.00V (V_HIGH)" : "0.00V (V_LOW)"}
            </div>
          </div>
        </div>

        {/* Truth Table & Oscilloscope Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Truth Table */}
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-3.5 rounded-md border space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-bold border-b pb-1.5" style={{ borderColor: activeTheme.cardBorder }}>
              <span className="flex items-center gap-1 text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Truth Table: {selectedGate}</span>
              </span>
              <span className="text-[10px] opacity-60">Standard TTL Logic</span>
            </div>

            <table className="w-full text-center text-[11px] font-mono">
              <thead>
                <tr className="opacity-60 border-b border-white/10">
                  <th className="py-1">IN_A</th>
                  {selectedGate !== "NOT" && <th className="py-1">IN_B</th>}
                  <th className="py-1 text-cyan-400 font-bold">OUT_Q</th>
                  <th className="py-1">STATE</th>
                </tr>
              </thead>
              <tbody>
                {truthTableRows.map((row, idx) => {
                  const isCurrentState =
                    row.a === inputA && (selectedGate === "NOT" || row.b === inputB);
                  return (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: isCurrentState ? `${activeTheme.accent}20` : "transparent",
                        fontWeight: isCurrentState ? "bold" : "normal",
                      }}
                      className="border-b border-white/5 transition-colors"
                    >
                      <td className="py-1">{row.a ? "1" : "0"}</td>
                      {selectedGate !== "NOT" && <td className="py-1">{row.b ? "1" : "0"}</td>}
                      <td className={`py-1 ${row.out ? "text-emerald-400 font-bold" : "text-red-400"}`}>
                        {row.out ? "1" : "0"}
                      </td>
                      <td className="py-1 text-[10px]">
                        {isCurrentState ? (
                          <span className="text-amber-400 font-bold">● ACTIVE</span>
                        ) : (
                          <span className="opacity-40">idle</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Realtime Logic Waveform / Oscilloscope */}
          <div
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-3.5 rounded-md border space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[11px] font-bold border-b pb-1.5" style={{ borderColor: activeTheme.cardBorder }}>
              <span className="flex items-center gap-1 text-amber-400">
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulated Logic Waveform (DSO)</span>
              </span>
              <span className="text-[10px] font-mono opacity-60">CH1: OUT_Q</span>
            </div>

            {/* Oscilloscope Square Wave Graphic */}
            <div className="h-20 bg-black/60 rounded border border-white/10 p-2 flex items-center justify-center font-mono relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(to right, #00FF88 1px, transparent 1px), linear-gradient(to bottom, #00FF88 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              />
              <div className="w-full flex items-center text-emerald-400 text-xs tracking-widest font-black select-none">
                {output ? (
                  <span className="text-emerald-400 animate-pulse">
                    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ [HIGH 5V]
                  </span>
                ) : (
                  <span className="text-red-400">
                    ___________________________________________ [LOW 0V]
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] opacity-60 pt-1">
              <span>Timebase: 50ms/div</span>
              <span>Trigger: Auto Edge</span>
              <span>Vpp: 5.0V</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
