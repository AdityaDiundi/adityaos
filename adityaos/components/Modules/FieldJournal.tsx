"use client";

import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  BookOpen,
  Volume2,
  VolumeX,
  ExternalLink,
  Users,
  Droplet,
  Sparkles,
  ArrowRight,
  Bookmark,
  Layers,
  Brain,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useOSStore } from "@/store/osStore";
import { useSoundStore } from "@/store/soundStore";

interface Dispatch {
  id: string;
  location: string;
  region: string;
  coordinates: string;
  date: string;
  title: string;
  category: "Education Diagnostics" | "Youth Leadership" | "Water Commons" | "Self Discovery" | "Grassroots Art";
  summary: string;
  excerpt: string;
  essayLink: string;
  stats: { label: string; value: string }[];
  audioLabel: string;
  tags: string[];
}

const DISPATCHES: Dispatch[] = [
  {
    id: "aarohi-learnability",
    location: "Kabhra, Peora",
    region: "Kumaon Himalayas, Uttarakhand",
    coordinates: "29.4975° N, 79.5768° E",
    date: "School Diagnostic Study",
    title: "Learnability at Aarohi: Inquiry & The Curiosity Cliff",
    category: "Education Diagnostics",
    summary:
      "Conducting an empirical diagnostic at Aarohi Bal Sansar across Grades 8–10. Mapping student learning preferences (50% hands-on) against institutional chalk-and-talk, and uncovering the 82% drop in curiosity under board exam conditioning.",
    excerpt:
      "While students showed 100% resilience in persisting through confusion, question-asking plummeted from 70% in Grade 9 to just 12.5% in Grade 10. The study led to our systemic framework of zero-cost daily inquiry huddles and hands-on experimentation in rural mountain schools.",
    essayLink: "Learnability_Aarohi_Bal_Sansar.md",
    stats: [
      { label: "Cohort Surveyed", value: "36 Students" },
      { label: "Hands-on Demand", value: "50.0%" },
      { label: "Grade 10 Resilience", value: "100%" },
    ],
    audioLabel: "Pine Forest Breeze / Mountain Bell Chimes",
    tags: ["Rural Education", "Learnability Diagnostic", "Himalayan Fieldwork"],
  },
  {
    id: "youth-clubs",
    location: "Bhilwara",
    region: "Southern Rajasthan",
    coordinates: "25.3462° N, 74.6364° E",
    date: "India Fellow Residency",
    title: "Identity in Youth Clubs: Mobilizing Rural Collectives",
    category: "Youth Leadership",
    summary:
      "Establishing community-led youth organizations across rural hamlets. Moving beyond structured top-down administration to foster organic peer belonging, self-worth, and civic action.",
    excerpt:
      "When we convened the first circle of ten young men and women in the panchayat hall, silence was the default state. Within five weeks of participatory problem-solving, that silence transformed into organized community action—from organizing local blood donation drives to tutoring primary students.",
    essayLink: "Identity_In_Youth_Clubs.md",
    stats: [
      { label: "Youth Mobilized", value: "450+" },
      { label: "Active Hamlets", value: "14" },
      { label: "Panchayat Dialogues", value: "28" },
    ],
    audioLabel: "Panchayat Chopal Ambient / Evening Chimes",
    tags: ["Grassroots", "Youth Mobilization", "Community Agency"],
  },
  {
    id: "water-crisis",
    location: "Aravalli Foothills",
    region: "Rural Mewar",
    coordinates: "24.5854° N, 73.7125° E",
    date: "Resource Mapping",
    title: "Balancing Act: The Rajasthan Water Crisis & The Commons",
    category: "Water Commons",
    summary:
      "Investigating water sovereignty, traditional johad conservation systems, and the socio-economic burdens placed on village women traveling miles for potable water.",
    excerpt:
      "Water in the arid belt is not merely a utility—it is currency, social standing, and caste demarcator. Restoring local community check-dams and participatory water testing required dismantling generations of ingrained resource hoarding.",
    essayLink: "Balancing_Act_Rajasthan_Water_Crisis.md",
    stats: [
      { label: "Water Commons Mapped", value: "19 Sites" },
      { label: "Johad Water Tables", value: "+1.8m" },
      { label: "Household Surveys", value: "320" },
    ],
    audioLabel: "Stepwell Echoes / Wind through Keekar Trees",
    tags: ["Ecology", "Resource Commons", "Field Research"],
  },
  {
    id: "human-process-lab",
    location: "Kumbhalgarh Ridge",
    region: "Western Ghats / Aravalli",
    coordinates: "25.1528° N, 73.5872° E",
    date: "Reflective Residency",
    title: "Self Discovery in Human Process Lab",
    category: "Self Discovery",
    summary:
      "T-Group laboratory and sensitivity training analyzing personal biases, active listening postures, and emotional vulnerability when working with marginalized communities.",
    excerpt:
      "In the process lab, there is nowhere to hide behind technical jargon or urban privilege. You are stripped down to your authentic emotional responses. It rewired my entire approach to design empathy.",
    essayLink: "Self_Discovery_Human_Process_Lab.md",
    stats: [
      { label: "Lab Duration", value: "7 Days" },
      { label: "Peer Cohort", value: "22 Fellows" },
      { label: "Empathy Metric", value: "100%" },
    ],
    audioLabel: "Bonfire Night / Mountain Stillness",
    tags: ["Introspection", "Empathy", "Behavioral Dynamics"],
  },
  {
    id: "rural-leadership",
    location: "Rajsamand",
    region: "Central Rajasthan",
    coordinates: "25.0747° N, 73.8824° E",
    date: "Leadership Fellowship",
    title: "Motivation in Rural Leadership & Village Agency",
    category: "Youth Leadership",
    summary:
      "Understanding what drives rural leaders to persist against entrenched systemic inertia without immediate financial reward or social validation.",
    excerpt:
      "True community leaders do not seek the spotlight. They operate as catalysts—quietly resolving conflicts between rival caste factions, securing ration cards for widows, and coaching adolescents.",
    essayLink: "Motivation_In_Rural_Leadership.md",
    stats: [
      { label: "Fellow Mentorship", value: "12 Mos" },
      { label: "Gram Sabha Sessions", value: "40+" },
      { label: "Youth Mentored", value: "60+" },
    ],
    audioLabel: "Morning Temple Bells / Sarangi Melodies",
    tags: ["Leadership", "Governance", "Public Agency"],
  },
];

export const FieldJournal: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { restoreWindow, focusWindow } = useOSStore();
  const { playScrollNote, playClickChime } = useSoundStore();

  const [activeDispatchId, setActiveDispatchId] = useState<string>("aarohi-learnability");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const activeDispatch = DISPATCHES.find((d) => d.id === activeDispatchId) || DISPATCHES[0];

  const handleOpenEssayInArchive = (essayName: string) => {
    playClickChime(640);
    restoreWindow("archiveReader");
    focusWindow("archiveReader");
  };

  const handleOpenLearnabilityLab = () => {
    playClickChime(720);
    restoreWindow("learnabilityLab");
    focusWindow("learnabilityLab");
  };

  const toggleFieldAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    playClickChime(isPlayingAudio ? 400 : 720);
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
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-9 border-b px-3 flex items-center justify-between text-[11px] flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tracking-tight">
            FIELD_DISPATCHES // INDIA FELLOW (RAJASTHAN)
          </span>
          <span className="text-[10px] opacity-60 hidden md:inline">
            // Grassroots Social Impact & Ethnographic Research
          </span>
        </div>

        {/* Ambient Audio Simulation Button */}
        <button
          type="button"
          onClick={toggleFieldAudio}
          style={{
            backgroundColor: isPlayingAudio ? `${activeTheme.accent}25` : activeTheme.cardBg,
            borderColor: isPlayingAudio ? activeTheme.accent : activeTheme.cardBorder,
            color: isPlayingAudio ? activeTheme.accent : activeTheme.textMuted,
          }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold hover:opacity-80 transition-all"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
          ) : (
            <VolumeX className="w-3 h-3 opacity-60" />
          )}
          <span>{isPlayingAudio ? "AUDIO: ON" : "FIELD AUDIO"}</span>
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Dispatch Index & Map Waypoints */}
        <div
          style={{
            borderColor: activeTheme.headerBorder,
            backgroundColor: `${activeTheme.cardBg}40`,
          }}
          className="w-full md:w-64 border-b md:border-b-0 md:border-r overflow-y-auto flex-shrink-0 p-2 space-y-1.5"
        >
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center justify-between">
            <span>Hamlets & Waypoints</span>
            <span>{DISPATCHES.length} logs</span>
          </div>

          {DISPATCHES.map((d) => {
            const isSelected = d.id === activeDispatchId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveDispatchId(d.id);
                  playClickChime(520);
                }}
                style={{
                  backgroundColor: isSelected ? `${activeTheme.accent}18` : "transparent",
                  borderColor: isSelected ? activeTheme.accent : "transparent",
                  color: isSelected ? activeTheme.accent : activeTheme.textPrimary,
                }}
                className="w-full text-left p-2 rounded border transition-all hover:bg-white/5 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {d.location}
                  </span>
                  <span className="opacity-50 text-[9px]">{d.coordinates}</span>
                </div>
                <div className="font-semibold text-[11px] leading-tight line-clamp-1">
                  {d.title}
                </div>
                <div className="text-[10px] opacity-60 flex items-center gap-1.5">
                  <span className="px-1 py-0.2 rounded bg-amber-400/10 text-amber-300 text-[9px]">
                    {d.category}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Fellowship Overview Card */}
          <div
            style={{
              backgroundColor: `${activeTheme.cardBg}80`,
              borderColor: activeTheme.cardBorder,
            }}
            className="p-2.5 rounded border text-[10px] space-y-1 mt-4"
          >
            <div className="font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>THE INDIA FELLOW EXPERIENCE</span>
            </div>
            <p className="opacity-70 leading-relaxed text-[9px]">
              12-month experiential leadership program combining immersive rural work with non-profit organizations, training workshops, and social entrepreneurship research across India.
            </p>
          </div>
        </div>

        {/* Right: Selected Dispatch Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Header Metadata */}
          <div className="space-y-1.5 pb-3 border-b" style={{ borderColor: activeTheme.cardBorder }}>
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <MapPin className="w-3 h-3" />
                {activeDispatch.location}, {activeDispatch.region}
              </span>
              <span className="opacity-40">•</span>
              <span className="opacity-70 font-mono">{activeDispatch.coordinates}</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Calendar className="w-3 h-3" />
                {activeDispatch.date}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              {activeDispatch.title}
            </h2>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeDispatch.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: activeTheme.cardBg,
                    borderColor: activeTheme.cardBorder,
                  }}
                  className="px-1.5 py-0.5 rounded border text-[9px] opacity-80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Key Metrics / Impact Counters */}
          <div className="grid grid-cols-3 gap-2">
            {activeDispatch.stats.map((s, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border text-center space-y-0.5 shadow-sm"
              >
                <div className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                  {s.value}
                </div>
                <div className="text-[9px] opacity-60 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Core Summary & Narrative Excerpt */}
          <div className="space-y-3 leading-relaxed">
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}60`,
                borderColor: activeTheme.cardBorder,
              }}
              className="p-3 rounded border text-[11px] space-y-1.5"
            >
              <div className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Bookmark className="w-3 h-3" />
                <span>Field Observation & Context</span>
              </div>
              <p className="opacity-90">{activeDispatch.summary}</p>
            </div>

            <div
              style={{
                backgroundColor: `${activeTheme.accent}0d`,
                borderColor: `${activeTheme.accent}40`,
              }}
              className="p-3.5 rounded border-l-2 text-[11px] italic opacity-95 relative space-y-1"
            >
              <span className="text-amber-400 font-serif text-lg leading-none select-none">“</span>
              <p className="pl-2">{activeDispatch.excerpt}</p>
            </div>
          </div>

          {/* Audio Telemetry Banner */}
          {isPlayingAudio && (
            <div
              style={{
                backgroundColor: `${activeTheme.cardBg}99`,
                borderColor: activeTheme.accent,
              }}
              className="p-2.5 rounded border flex items-center justify-between text-[10px] animate-pulse"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Playing ambient tape: <strong className="text-amber-300">{activeDispatch.audioLabel}</strong></span>
              </div>
              <span className="text-[9px] font-mono opacity-60">48kHz / Stereo binaural</span>
            </div>
          )}

          {/* Action Footer: Read Full Markdown in Archive or Open Diagnostics Lab */}
          <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
            {activeDispatch.id === "aarohi-learnability" ? (
              <button
                type="button"
                onClick={handleOpenLearnabilityLab}
                style={{
                  backgroundColor: activeTheme.accent,
                  color: activeTheme.isDark ? "#000" : "#fff",
                }}
                className="px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Launch Interactive Learnability Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenEssayInArchive(activeDispatch.essayLink)}
                style={{
                  backgroundColor: activeTheme.accent,
                  color: activeTheme.isDark ? "#000" : "#fff",
                }}
                className="px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Full Essay in ArchiveReader</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="text-[10px] opacity-50 hidden sm:inline">
              Source: Aarohi & India Fellow Field Telemetry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
