"use client";

import React, { useState } from "react";
import { LEARNABILITY_METRICS } from "./caseStudiesData";
import { Compass, BookOpen, MapPin, CheckCircle2, ChevronRight, Activity } from "lucide-react";

export function FieldResearchSection() {
  const [activeTab, setActiveTab] = useState(0);

  const dispatches = [
    {
      title: "Decoupling Language from Cognitive Aptitude",
      location: "Peora, Uttarakhand (Kumaon Hills)",
      date: "India Fellow Fieldwork",
      excerpt:
        "When a child in a rural village is tested in formal English, a low score is routinely conflated with low intelligence. By swapping language-heavy questions with tactile wooden tangrams and sequence tokens, students who previously scored below 40% demonstrated rapid 84% mastery in spatial deduction.",
      tag: "Pedagogical UX",
    },
    {
      title: "Participatory Systems Mapping in Village Clinics",
      location: "Almora District, Uttarakhand",
      date: "Grassroots Ethnography",
      excerpt:
        "Shadowing frontline health workers revealed that digital data entry tools created a 45-minute administrative penalty per village visit. Community adoption only succeeded when interfaces matched physical health registers and prioritized offline, one-thumb data sync.",
      tag: "Field Systems",
    },
    {
      title: "The Friction of Technological Hegemony",
      location: "Rural Himalayan Communities",
      date: "Cultural Critique",
      excerpt:
        "Designing for the Global South cannot be an exercise in 'dumbing down' Silicon Valley patterns. It demands examining oral communication defaults, collective familial decision-making, and respecting vernacular mental models.",
      tag: "Epistemic Design",
    },
  ];

  return (
    <section id="research" className="py-20 relative border-t border-white/10 bg-[#07090c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            Grassroots Fieldwork & Participatory Research
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-semibold text-zinc-100 tracking-tight">
            Human empathy forged in the field, not the lab.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed">
            A full year of immersive grassroots work as an India Fellow in rural Uttarakhand, researching human-scale systems, rural education diagnostics, and community mental models.
          </p>
        </div>

        {/* 2-Column Grid: Left Dispatches, Right Diagnostic Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispatches Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Field Ethnography & Observational Insights
            </h3>

            {dispatches.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-base font-semibold text-white font-sans">{item.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{item.excerpt}</p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0b0e14] border border-white/10 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Aarohi Diagnostic Study (N=100)
              </span>
              <h4 className="text-lg font-bold text-white font-sans">
                Cognitive Interventions vs Standard Testing
              </h4>
              <p className="text-xs text-zinc-400 font-sans">
                Measured pre/post intervention impact across 3 cohorts in rural primary schools.
              </p>
            </div>

            <div className="space-y-4">
              {LEARNABILITY_METRICS.map((metric, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeTab === idx
                      ? "bg-cyan-950/20 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="font-semibold text-white">{metric.category}</span>
                    <span className="text-zinc-500 text-[10px]">N={metric.sampleSize}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="text-zinc-400">Base: <span className="text-rose-400">{metric.baseline}</span></div>
                    <span className="text-zinc-600">→</span>
                    <div className="text-zinc-400">Post: <span className="text-emerald-400 font-bold">{metric.postIntervention}</span></div>
                  </div>

                  <p className="mt-2 text-[11px] text-zinc-300 font-sans leading-relaxed">
                    {metric.insight}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full raw dataset verified & integrated in adityaos Learnability Lab.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
