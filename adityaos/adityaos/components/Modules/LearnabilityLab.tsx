"use client";

import React, { useState } from "react";
import {
  Brain,
  GraduationCap,
  TrendingDown,
  TrendingUp,
  Compass,
  Search,
  Filter,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Users,
  Activity,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  LEARNABILITY_STUDENTS,
  LEARNABILITY_SCORECARD,
  AnonymizedStudent,
} from "./learnabilityData";

type CohortFilter = "all" | "class8" | "class9" | "class10";
type ActiveTab = "scorecard" | "curiosityCliff" | "pedagogy" | "cohort" | "interventions";

export const LearnabilityLab: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>("scorecard");
  const [selectedCohort, setSelectedCohort] = useState<CohortFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<AnonymizedStudent | null>(null);

  // Filter students based on cohort and search query
  const filteredStudents = LEARNABILITY_STUDENTS.filter((stu) => {
    const matchesCohort =
      selectedCohort === "all" ||
      (selectedCohort === "class8" && stu.grade === 8) ||
      (selectedCohort === "class9" && stu.grade === 9) ||
      (selectedCohort === "class10" && stu.grade === 10);

    const matchesSearch =
      stu.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.learningPreference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.enjoyedActivity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.archetype.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCohort && matchesSearch;
  });

  const getMetricValue = (metricName: string) => {
    const metric = LEARNABILITY_SCORECARD.find((m) => m.name.includes(metricName));
    if (!metric) return 0;
    if (selectedCohort === "class8") return metric.class8;
    if (selectedCohort === "class9") return metric.class9;
    if (selectedCohort === "class10") return metric.class10;
    return metric.school;
  };

  return (
    <div
      onWheel={(e) => playScrollNote(e.deltaY)}
      style={{
        backgroundColor: activeTheme.windowBg,
        color: activeTheme.textPrimary,
      }}
      className="flex flex-col h-full font-mono text-xs select-none overflow-hidden"
    >
      {/* Top Header & Institutional Metadata */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-10 border-b px-3 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <span
            style={{
              backgroundColor: `${activeTheme.accent}20`,
              color: activeTheme.accent,
            }}
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"
          >
            <Brain className="w-3 h-3" />
            <span>LEARNABILITY // LAB</span>
          </span>
          <span className="font-semibold text-[11px] truncate">
            Aarohi Bal Sansar (Kabhra, Uttarakhand)
          </span>
          <span
            style={{ backgroundColor: "#10b98120", color: "#10b981" }}
            className="hidden sm:flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20"
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>N=36 ANONYMIZED</span>
          </span>
        </div>

        {/* Cohort Switcher */}
        <div className="flex items-center gap-1">
          <span style={{ color: activeTheme.textMuted }} className="text-[10px] mr-1 hidden md:inline">
            COHORT:
          </span>
          {(
            [
              { id: "all", label: "School (N=36)" },
              { id: "class8", label: "Gr 8 (N=18)" },
              { id: "class9", label: "Gr 9 (N=10)" },
              { id: "class10", label: "Gr 10 (N=8)" },
            ] as const
          ).map((c) => {
            const isSelected = selectedCohort === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  playClickChime(480);
                  setSelectedCohort(c.id);
                }}
                style={{
                  backgroundColor: isSelected ? activeTheme.accent : activeTheme.cardBg,
                  color: isSelected ? (activeTheme.isDark ? "#000" : "#fff") : activeTheme.textPrimary,
                  borderColor: activeTheme.cardBorder,
                }}
                className="px-2 py-0.5 rounded border text-[10px] font-semibold transition-all hover:opacity-90"
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-header */}
      <div
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.cardBorder,
        }}
        className="h-8 border-b px-3 flex items-center gap-1 overflow-x-auto flex-shrink-0"
      >
        {[
          { id: "scorecard", label: "📊 Scorecard & Indices", count: "6 Metrics" },
          { id: "curiosityCliff", label: "📉 The Curiosity Cliff", count: "70% → 12.5%" },
          { id: "pedagogy", label: "🧩 Pedagogical Gap", count: "50% Hands-On" },
          { id: "cohort", label: "👥 Cohort Explorer", count: `${filteredStudents.length} Students` },
          { id: "interventions", label: "💡 Systemic Actions", count: "Zero-Cost" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playClickChime(520);
                setActiveTab(tab.id as ActiveTab);
              }}
              style={{
                borderColor: isActive ? activeTheme.accent : "transparent",
                color: isActive ? activeTheme.accent : activeTheme.textMuted,
                backgroundColor: isActive ? `${activeTheme.accent}15` : "transparent",
              }}
              className="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 border hover:opacity-100 transition-all flex-shrink-0"
            >
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: `${activeTheme.cardBorder}`,
                  color: activeTheme.textMuted,
                }}
                className="text-[9px] px-1 py-0.2 rounded font-normal hidden sm:inline"
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4">
        {/* TAB 1: SCORECARD & INDICES */}
        {activeTab === "scorecard" && (
          <div className="space-y-4 max-w-5xl mx-auto">
            {/* Overview Intro Banner */}
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}cc`,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-3.5 rounded-lg border backdrop-blur-sm space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: activeTheme.accent }}>
                  <GraduationCap className="w-4 h-4" />
                  <span>Aarohi Bal Sansar Diagnostic Framework</span>
                </span>
                <span style={{ color: activeTheme.textMuted }} className="text-[10px]">
                  Cohort Scope: {selectedCohort.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                Empirical diagnostic conducted at <strong>Aarohi Bal Sansar</strong> (Kabhra, Uttarakhand) across Grades 8, 9, and 10. Assesses student readiness, self-initiated inquiry, stress-resilience, and informal cultural learning vectors in high-altitude rural education.
              </p>
            </div>

            {/* 6 Core Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LEARNABILITY_SCORECARD.map((metric) => {
                const currentVal =
                  selectedCohort === "class8"
                    ? metric.class8
                    : selectedCohort === "class9"
                    ? metric.class9
                    : selectedCohort === "class10"
                    ? metric.class10
                    : metric.school;

                const isCuriosityCliff = metric.name.includes("Curiosity") && selectedCohort === "class10";

                return (
                  <div
                    key={metric.name}
                    style={{
                      backgroundColor: activeTheme.cardBg,
                      borderColor: isCuriosityCliff ? "#ef4444" : activeTheme.cardBorder,
                    }}
                    className="p-3 rounded-lg border flex flex-col justify-between space-y-2 relative overflow-hidden"
                  >
                    {isCuriosityCliff && (
                      <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded-bl font-bold">
                        ALERT: -82% DROP
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold" style={{ color: activeTheme.textPrimary }}>
                        {metric.name}
                      </div>
                      <div className="text-[10px] opacity-70 leading-normal font-sans">
                        {metric.explainer}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black" style={{ color: activeTheme.accent }}>
                          {currentVal}%
                        </span>
                        <span style={{ color: activeTheme.textMuted }} className="text-[10px]">
                          School Avg: {metric.school}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(100, currentVal)}%`,
                            backgroundColor: isCuriosityCliff ? "#ef4444" : activeTheme.accent,
                          }}
                          className="h-full rounded-full transition-all duration-500"
                        />
                      </div>

                      {/* Grade Comparison Mini Badges */}
                      <div className="flex items-center justify-between text-[9px] opacity-60 font-mono pt-0.5">
                        <span>Gr 8: {metric.class8}%</span>
                        <span>Gr 9: {metric.class9}%</span>
                        <span className={metric.class10 < 30 ? "text-red-400 font-bold" : ""}>
                          Gr 10: {metric.class10}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composite Summary Formula Box */}
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}88`,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-3 rounded border text-[11px] space-y-1 leading-relaxed"
            >
              <div className="font-semibold text-amber-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Weighted Composite Synthesis: 64.0% School Average</span>
              </div>
              <div className="text-[10px] opacity-70 font-sans">
                Computed via weighted cohort sum:{" "}
                <code>((Gr8 × 18) + (Gr9 × 10) + (Gr10 × 8)) ÷ 36</code>. Grade 8 displays the highest composite learnability (68.2%) driven by broad engagement diversity, whereas Grade 10 drops to 54.5% due to curriculum constriction.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: THE CURIOSITY CLIFF */}
        {activeTab === "curiosityCliff" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* The Dropdown Visualizer */}
            <div
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: "#ef4444",
              }}
              className="p-4 rounded-xl border border-red-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span>The "Curiosity Cliff": Class 9 (70.0%) → Class 10 (12.5%)</span>
                </span>
                <span className="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded font-bold">
                  CRITICAL ANOMALY
                </span>
              </div>

              <p className="text-[11px] opacity-85 leading-relaxed font-sans">
                While analyzing the question-asking frequency question (<em>"How often do you ask questions in class or at home?"</em>), the data reveals a catastrophic collapse in student inquiry between Grade 9 and Grade 10:
              </p>

              {/* Visual Trajectory Graph */}
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-[10px] opacity-60">CLASS 8 (N=18)</div>
                  <div className="text-2xl font-bold text-emerald-400">66.7%</div>
                  <div className="text-[10px] opacity-75">Active Inquirers</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] opacity-60">CLASS 9 (N=10)</div>
                  <div className="text-2xl font-bold text-cyan-400">70.0%</div>
                  <div className="text-[10px] opacity-75">Peak Curiosity</div>
                </div>
                <div className="space-y-1 border-l border-red-500/30 pl-2">
                  <div className="text-[10px] text-red-400 font-bold">CLASS 10 (N=8)</div>
                  <div className="text-2xl font-bold text-red-500">12.5%</div>
                  <div className="text-[10px] text-red-400 font-bold">Board Exam Cliff</div>
                </div>
              </div>

              {/* The Paradox with Resilience */}
              <div
                style={{ borderColor: activeTheme.cardBorder }}
                className="p-3 rounded-lg border bg-white/5 space-y-2"
              >
                <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Resilience Paradox: 100% Persistence, 0% Inquiry</span>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                  Remarkably, Grade 10 students scored <strong>100% on Resilience</strong> (when encountering confusion, 100% either ask for help or try again; zero students give up). This proves Grade 10 students are not disengaged—rather, <strong>board examination conditioning actively trains them to stop asking spontaneous questions</strong>. Asking questions outside the prescribed syllabus is internalized as a waste of revision time or a sign of syllabus deficiency.
                </p>
              </div>
            </div>

            {/* Qualitative Root Causes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-1.5"
              >
                <div className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Systemic Exam Anxiety</span>
                </div>
                <p className="text-[10px] opacity-75 leading-relaxed font-sans">
                  In rural mountain belts, passing 10th Board examinations represents the singular gateway to senior secondary school and government employment. The pressure eliminates the luxury of curiosity.
                </p>
              </div>

              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-1.5"
              >
                <div className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rote Memorization Incentives</span>
                </div>
                <p className="text-[10px] opacity-75 leading-relaxed font-sans">
                  Grading schemes award marks for reproduction of exact guidebook answers. Students deduce that inquiry carries zero reward on test day, shifting entirely into rote compliance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PEDAGOGICAL DIVERGENCE GAP */}
        {activeTab === "pedagogy" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-3.5 rounded-lg border space-y-2"
            >
              <div className="font-bold text-xs" style={{ color: activeTheme.accent }}>
                How Rural Himalayan Students Actually Want to Learn vs. Institutional Reality
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                The survey cross-referenced student learning preferences against their primary learning sources. There is a glaring divergence between <strong>kinesthetic hands-on drive</strong> and <strong>chalk-and-talk classroom delivery</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Desired Learning Modality */}
              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-3"
              >
                <div className="font-bold text-xs text-emerald-400">
                  Desired Learning Preferences (N=36)
                </div>

                <div className="space-y-2 font-sans">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Hands-On / Trying it out</span>
                      <span className="font-bold font-mono">18 students (50.0%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded" style={{ width: "50%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Listening to an explanation</span>
                      <span className="font-bold font-mono">12 students (33.3%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded" style={{ width: "33.3%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Watching video / demo</span>
                      <span className="font-bold font-mono">4 students (11.1%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded" style={{ width: "11.1%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Reading text / textbook</span>
                      <span className="font-bold font-mono">2 students (5.6%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-purple-400 rounded" style={{ width: "5.6%" }} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] opacity-60 italic pt-1">
                  Only 5.6% of students prefer reading a book or textbook, yet 90% of school hours are spent reading textbooks.
                </div>
              </div>

              {/* Navigation Through Confusion */}
              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-3"
              >
                <div className="font-bold text-xs text-amber-400">
                  Response to Confusion (N=36)
                </div>

                <div className="space-y-2 font-sans">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Ask teacher, parent, or friend</span>
                      <span className="font-bold font-mono">20 students (55.6%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded" style={{ width: "55.6%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Try again by myself</span>
                      <span className="font-bold font-mono">11 students (30.6%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded" style={{ width: "30.6%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Search online or in a book</span>
                      <span className="font-bold font-mono">4 students (11.1%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded" style={{ width: "11.1%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Leave it / Abandon</span>
                      <span className="font-bold font-mono">1 student (2.8%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden">
                      <div className="h-full bg-red-400 rounded" style={{ width: "2.8%" }} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] opacity-60 italic pt-1">
                  86.2% of students rely on relational inquiry or self-iteration, with virtually zero task abandonment.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANONYMIZED COHORT EXPLORER */}
        {activeTab === "cohort" && (
          <div className="space-y-3 max-w-5xl mx-auto">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 opacity-60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by archetype, activity, or student ID..."
                  style={{
                    backgroundColor: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                    color: activeTheme.textPrimary,
                  }}
                  className="w-full px-2.5 py-1 rounded border text-[11px] outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="text-[10px] opacity-60">
                Displaying {filteredStudents.length} of {LEARNABILITY_STUDENTS.length} anonymized records
              </div>
            </div>

            {/* Students Table */}
            <div
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
              }}
              className="rounded-lg border overflow-hidden"
            >
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead
                    style={{
                      backgroundColor: activeTheme.headerBg,
                      borderColor: activeTheme.headerBorder,
                      color: activeTheme.textMuted,
                    }}
                    className="border-b sticky top-0 z-10 text-[10px] uppercase font-bold"
                  >
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Class</th>
                      <th className="p-2.5">Learning Preference</th>
                      <th className="p-2.5">Confusion Strategy</th>
                      <th className="p-2.5">Questioning</th>
                      <th className="p-2.5">Archetype</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((stu) => {
                      const isSelected = selectedStudent?.id === stu.id;
                      return (
                        <tr
                          key={stu.id}
                          onClick={() => {
                            playClickChime(500);
                            setSelectedStudent(stu);
                          }}
                          style={{
                            backgroundColor: isSelected ? `${activeTheme.accent}20` : "transparent",
                          }}
                          className="hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <td className="p-2.5 font-bold" style={{ color: activeTheme.accent }}>
                            {stu.id}
                          </td>
                          <td className="p-2.5 font-semibold">{stu.class}</td>
                          <td className="p-2.5 max-w-[200px] truncate" title={stu.learningPreference}>
                            {stu.learningPreference}
                          </td>
                          <td className="p-2.5 max-w-[180px] truncate" title={stu.confusionResponse}>
                            {stu.confusionResponse}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                stu.questionFrequency === "Very often"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : stu.questionFrequency === "Sometimes"
                                  ? "bg-cyan-500/20 text-cyan-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {stu.questionFrequency}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span
                              style={{
                                backgroundColor: `${activeTheme.cardBorder}`,
                                color: activeTheme.textPrimary,
                              }}
                              className="px-1.5 py-0.5 rounded text-[9px]"
                            >
                              {stu.archetype}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Student Detail Drawer */}
            {selectedStudent && (
              <div
                style={{
                  backgroundColor: `${activeTheme.cardBg}ee`,
                  borderColor: activeTheme.accent,
                }}
                className="p-3 rounded-lg border backdrop-blur-md space-y-2 text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-2" style={{ color: activeTheme.accent }}>
                    <span>Profile: {selectedStudent.id}</span>
                    <span className="text-white/60">({selectedStudent.class})</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px]">
                      {selectedStudent.archetype}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="text-[10px] opacity-60 hover:opacity-100"
                  >
                    [Close ×]
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-sans text-[10px]">
                  <div>
                    <span className="opacity-60 block">Preferred Mode:</span>
                    <strong>{selectedStudent.learningPreference}</strong>
                  </div>
                  <div>
                    <span className="opacity-60 block">When Confused:</span>
                    <strong>{selectedStudent.confusionResponse}</strong>
                  </div>
                  <div>
                    <span className="opacity-60 block">Enjoys Most:</span>
                    <strong>{selectedStudent.enjoyedActivity}</strong>
                  </div>
                  <div>
                    <span className="opacity-60 block">Learns Most From:</span>
                    <strong>{selectedStudent.primaryLearningSource}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SYSTEMIC ACTION FRAMEWORK */}
        {activeTab === "interventions" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
              className="p-3.5 rounded-lg border space-y-2"
            >
              <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Zero-Cost Immediate Interventions vs. Long-Term Systemic Shifts</span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                Derived directly from field inquiry notes at Aarohi Bal Sansar: What can a rural Himalayan school do <em>right now without incurring additional financial overhead</em> to reverse the curiosity cliff?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Zero-Cost Interventions */}
              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-3"
              >
                <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zero-Cost Immediate Classroom Shifts</span>
                </div>

                <div className="space-y-2.5 font-sans text-[11px]">
                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-cyan-400">1. The 5-Minute Student Question Huddle</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      Begin every class period by inviting 3 student questions before touching textbooks. Reward inquiry over correctness to dismantle the fear of judgment.
                    </div>
                  </div>

                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-cyan-400">2. Anonymous "Confusion Post" Board</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      Place a cardboard chart in the hallway where students pin sticky doubts anonymously. The teacher reviews top questions at the start of Friday assemblies.
                    </div>
                  </div>

                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-cyan-400">3. Kinesthetic Peer Experimentation</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      With 50% demanding hands-on learning, repurpose discarded local mountain materials (leaves, river stones, pulleys) for practical physics and botany demos.
                    </div>
                  </div>
                </div>
              </div>

              {/* Long-Term Systemic Shifts */}
              <div
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.cardBorder }}
                className="p-3.5 rounded-lg border space-y-3"
              >
                <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Institutional & Curriculum Shifts</span>
                </div>

                <div className="space-y-2.5 font-sans text-[11px]">
                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-emerald-400">1. Decoupling Grade 10 from Rote Prep</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      Prevent the full conversion of Class 10 into a testing assembly line. Preserve at least 2 weekly project blocks dedicated to open-ended inquiry.
                    </div>
                  </div>

                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-emerald-400">2. Himalayan Living Ecology Integration</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      Bridge cultural learning (25%) with formal sciences—studying local water recharge springs, terraced agriculture, and indigenous solar drying systems.
                    </div>
                  </div>

                  <div className="p-2 rounded bg-white/5 space-y-1">
                    <div className="font-bold text-emerald-400">3. Formative Inquiry Rubrics</div>
                    <div className="text-[10px] opacity-75 leading-relaxed">
                      Assess students on the quality and depth of questions they formulate about problems, not merely their speed in reciting pre-packaged solutions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
