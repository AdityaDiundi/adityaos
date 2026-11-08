"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, AlertTriangle, Shield, Check, ArrowRight, MessageSquare, RefreshCw, Smartphone } from "lucide-react";

export function JanevalPreview() {
  const [selected, setSelected] = useState<"A" | "B" | null>("A");

  return (
    <div className="w-full p-4 rounded-xl bg-[#0c1310] border border-emerald-500/20 text-xs font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2 text-[11px] text-zinc-400">
        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          BLIND ARENA · SCENARIO 04
        </span>
        <span>10 Evaluators Voting</span>
      </div>

      <div className="text-zinc-200 text-xs font-sans">
        &ldquo;Which depiction captures a real rural Anganwadi growth monitoring visit?&rdquo;
      </div>

      {/* A/B Comparison Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => setSelected("A")}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            selected === "A"
              ? "bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs text-emerald-300">Model A</span>
            {selected === "A" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <p className="text-[10px] leading-tight text-zinc-300">
            Hanging spring scale, blue ASHA uniform, Devanagari nutrition chart on wall.
          </p>
          <div className="mt-2 text-[9px] text-emerald-400 uppercase tracking-wider font-semibold">
            ✓ 5/5 Cultural Fidelity
          </div>
        </div>

        <div
          onClick={() => setSelected("B")}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
            selected === "B"
              ? "bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs text-zinc-300">Model B</span>
            {selected === "B" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <p className="text-[10px] leading-tight text-zinc-400">
            Digital bathroom scale, generic white lab coat, scrambled illegible lettering.
          </p>
          <div className="mt-2 text-[9px] text-rose-400 uppercase tracking-wider font-semibold">
            ✕ 1/5 Hazard Artifact
          </div>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
        <span>Evaluator consensus: Model A picked 68%</span>
        <span className="text-emerald-400 font-semibold">Verified Ground Truth</span>
      </div>
    </div>
  );
}

export function UPIMeterPreview() {
  const [amount, setAmount] = useState("₹2,500");

  return (
    <div className="w-full p-4 rounded-xl bg-[#090d12] border border-cyan-500/20 text-xs font-mono space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 text-[11px] text-zinc-400">
        <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          UPI METER RUNWAY
        </span>
        <span className="text-emerald-400">Safe Runway</span>
      </div>

      {/* Proactive Meter */}
      <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-zinc-400">Today&apos;s Spend</span>
          <span className="text-white font-semibold">₹42,000 / ₹1,00,000</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-[42%]" />
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1">
          <span>9 of 20 transfers used</span>
          <span className="text-cyan-300 font-semibold">₹58,000 remaining</span>
        </div>
      </div>

      {/* Interactive Transfer Input */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Pay to:</span>
          <span className="text-zinc-200 font-semibold">kirana-store@sbi</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300 font-semibold text-[11px]">
          {amount}
        </span>
      </div>

      {/* Success / Guardrail message */}
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
        <span>Within daily cap. No transaction failure risk.</span>
      </div>
    </div>
  );
}

export function HairTrackerPreview() {
  const [day14Done, setDay14Done] = useState(true);

  return (
    <div className="w-full p-4 rounded-xl bg-[#141008] border border-amber-500/20 text-xs font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/15 pb-2 text-[11px] text-zinc-400">
        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          DAY 14 OF 21 · STREAK ACTIVE
        </span>
        <span className="text-amber-300 font-bold">🔥 14 Days</span>
      </div>

      {/* Daily Routine Check */}
      <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDay14Done(!day14Done)}
              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                day14Done ? "bg-amber-500 border-amber-400 text-black" : "border-zinc-600 bg-transparent"
              }`}
            >
              {day14Done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span className="text-zinc-200 text-xs font-sans">Morning Hair Serum Applied</span>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">+10 Pts</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-300">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-zinc-400 text-xs font-sans">Biotin Supplement Logged</span>
          </div>
          <span className="text-[10px] text-zinc-500">8:30 AM</span>
        </div>
      </div>

      {/* Wellness Coach Hotline */}
      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-zinc-300 font-sans">Chat with Dr. Meera (Wellness Coach)</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold">Replies &lt; 3m</span>
      </div>
    </div>
  );
}

export function ClaimsPortalPreview() {
  return (
    <div className="w-full p-4 rounded-xl bg-[#0f0c18] border border-purple-500/20 text-xs font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-purple-500/15 pb-2 text-[11px] text-zinc-400">
        <span className="text-purple-400 font-semibold">ARBITER CLAIMS #4092</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
          Cashless Approved
        </span>
      </div>

      {/* Dense Table Row Preview */}
      <div className="space-y-1.5">
        <div className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-white font-medium">Rajesh Verma</span>
            <span className="text-zinc-500 ml-2">ID: #EMP-8104</span>
          </div>
          <span className="text-zinc-300 font-semibold">₹1,45,000</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-white font-medium">Ananya Sen</span>
            <span className="text-zinc-500 ml-2">ID: #EMP-9210</span>
          </div>
          <span className="text-purple-300">TPA Query Answered</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
        <span>Bulk Census Sync: 1,420 Active</span>
        <span className="text-purple-400 font-semibold">Zero CSV Failures</span>
      </div>
    </div>
  );
}

export function LearnabilityMatrixPreview() {
  const vectors = [
    { name: "Spatial Reasoning", value: 84, color: "bg-cyan-400" },
    { name: "Pattern Sequencing", value: 78, color: "bg-emerald-400" },
    { name: "Logical Deduction", value: 71, color: "bg-blue-400" },
    { name: "Formal English Test", value: 39, color: "bg-rose-500" },
  ];

  return (
    <div className="w-full p-4 rounded-xl bg-[#0a1014] border border-sky-500/20 text-xs font-mono space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/15 pb-2 text-[11px] text-zinc-400">
        <span className="text-sky-400 font-semibold">AAROHI DIAGNOSTIC (N=100)</span>
        <span className="text-zinc-400">Peora, Uttarakhand</span>
      </div>

      <div className="space-y-2">
        {vectors.map((vec) => (
          <div key={vec.name} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-300">{vec.name}</span>
              <span className="text-zinc-400 font-semibold">{vec.value}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div className={`h-full ${vec.color} rounded-full`} style={{ width: `${vec.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 text-[10px] text-sky-300 leading-tight">
        Insight: Non-verbal spatial reasoning exceeds standard language test scores by 2.1x.
      </div>
    </div>
  );
}
