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
  organization: string;
  date: string;
  title: string;
  category: "Education Diagnostics" | "Youth Leadership" | "Water Commons" | "Self Discovery" | "Grassroots Art";
  summary: string;
  excerpt: string;
  essayLink: string;
  meta: { label: string; value: string }[];
  audioLabel: string;
  tags: string[];
}

const DISPATCHES: Dispatch[] = [
  {
    id: "aarohi-learnability",
    location: "Kabhra, Peora",
    region: "Kumaon Himalayas, Uttarakhand",
    organization: "Aarohi Bal Sansar",
    date: "School Diagnostic Study",
    title: "Learnability at Aarohi: Inquiry & The Curiosity Cliff",
    category: "Education Diagnostics",
    summary:
      "Empirical field diagnostic conducted at Aarohi Bal Sansar across Grades 8, 9, and 10. Analyzing student learning autonomy, hands-on preferences, and uncovering the 82% curiosity drop under board exam pressure.",
    excerpt:
      "While Grade 10 students scored 100% on persistence when facing confusion, spontaneous question-asking collapsed from 70% in Grade 9 to just 12.5% in Grade 10. With 50% demanding hands-on learning, the findings prompted our framework for zero-cost daily inquiry huddles in rural schools.",
    essayLink: "Learnability_Aarohi_Bal_Sansar.md",
    meta: [
      { label: "Partner", value: "Aarohi" },
      { label: "Cohort", value: "N=36 Students (Gr 8-10)" },
      { label: "Focus", value: "Curiosity & Autonomy" },
    ],
    audioLabel: "Himalayan Pine Forest Breeze",
    tags: ["Rural Education", "Learnability Diagnostic", "Himalayas"],
  },
  {
    id: "youth-clubs",
    location: "Thakurganj",
    region: "Kishanganj, Bihar",
    organization: "Project Potential",
    date: "India Fellow Field Work",
    title: "Identity In Youth Clubs In India",
    category: "Youth Leadership",
    summary:
      "Working on the ground in Thakurganj to build a network of 400+ youth by establishing clubs across neighbouring panchayats for youth empowerment, peer belonging, and collective agency.",
    excerpt:
      "Currently, in youth clubs, although there is togetherness and a sense of belonging among participants, these clubs are not operating at their full potential. The formation of identity in youth clubs is essential to creating a space that feels truly collective. For the past six months, I have lived in Thakurganj, Bihar, working with Project Potential to build a strong network of 400+ youths by forming clubs in neighbouring panchayats...",
    essayLink: "Identity_In_Youth_Clubs_In_India.md",
    meta: [
      { label: "Partner", value: "Project Potential" },
      { label: "Location", value: "Thakurganj, Bihar" },
      { label: "Network", value: "400+ Rural Youth" },
    ],
    audioLabel: "Panchayat Evening Field Recordings",
    tags: ["Youth Empowerment", "Community Identity", "Panchayats"],
  },
  {
    id: "water-crisis",
    location: "Rural Rajasthan",
    region: "Mewar Belt, Rajasthan",
    organization: "India Fellow Immersion",
    date: "Field Observations",
    title: "Balancing Act: Navigating Choices In Rural Rajasthan's Water Crisis",
    category: "Water Commons",
    summary:
      "Deep dive into the lived reality of rural water scarcity in Rajasthan, examining household survival choices, social dynamics, and what water rationing means on the ground.",
    excerpt:
      "Rural Rajasthan's water crisis is real. Believe me, there are people who are only drinking a litre of water a day. There I met the husband of Manbhar Devi. One doesn't go and start asking a ton of questions and trouble them in an already difficult time... Looking closely at community choices reveals the human side of survival that scientific metrics alone cannot capture.",
    essayLink: "Balancing_Act_Navigating_Choices_In_Rural_Rajasthans_Water_Crisis.md",
    meta: [
      { label: "Field", value: "Rural Rajasthan" },
      { label: "Context", value: "Water Scarcity & Lived Reality" },
      { label: "Publication", value: "India Fellow Journal" },
    ],
    audioLabel: "Arid Wind & Stepwell Echoes",
    tags: ["Water Commons", "Field Immersion", "Rajasthan"],
  },
  {
    id: "human-process-lab",
    location: "ISABS Residency",
    region: "Indian Society For Applied Behaviour Science",
    organization: "ISABS",
    date: "Sensitivity & Behavioural Lab",
    title: "Questions For Self-Discovery From A Human Process Lab",
    category: "Self Discovery",
    summary:
      "Reflections and inquiry arising from the Basic Human Process Lab (BHPL) at ISABS. Interrogating self-awareness, active listening, and open communication.",
    excerpt:
      "During the Basic Human Process Lab at Indian Society For Applied Behaviour Science (ISABS), I encountered foundational questions: How do I perceive others, and how does that influence my listening? Am I genuinely hearing, or merely waiting to respond? It reshaped how I engage with individuals and communities without pre-constructed biases.",
    essayLink: "Questions_For_Self_Discovery_From_A_Human_Process_Lab.md",
    meta: [
      { label: "Institution", value: "ISABS" },
      { label: "Program", value: "Basic Human Process Lab" },
      { label: "Core Focus", value: "Interpersonal Dynamics & Empathy" },
    ],
    audioLabel: "Stillness & Mountain Ambience",
    tags: ["Self-Discovery", "Active Listening", "ISABS"],
  },
  {
    id: "youth-art",
    location: "Thakurganj",
    region: "Kishanganj, Bihar",
    organization: "Project Potential",
    date: "Youth Resource Manual",
    title: "Youth Masterpiece: Fostering Collaboration Through Art",
    category: "Grassroots Art",
    summary:
      "Designing collaborative creative interventions in the Youth Resource Manual (YRM), including 'Midline Masterpiece', to spark non-verbal communication and collective creation among rural youth.",
    excerpt:
      "We're developing Midline Masterpiece as one of the many activities in the Youth Resource Manual (YRM). 'Alright folks, time to get artsy! Who is ready to Picasso their way through this?' When two creative minds collide across a shared canvas, hierarchical barriers melt away. Art becomes a bridge for rural youth who often struggle to articulate their agency in words.",
    essayLink: "Youth_Masterpiece_Fostering_Collaboration_Through_Art.md",
    meta: [
      { label: "Project", value: "Youth Resource Manual (YRM)" },
      { label: "Activity", value: "Midline Masterpiece" },
      { label: "Method", value: "Collaborative Art" },
    ],
    audioLabel: "Youth Circle Discussions & Laughter",
    tags: ["Grassroots Art", "Collaboration", "Youth Expression"],
  },
  {
    id: "rural-leadership",
    location: "Rural Community Centers",
    region: "Community Spaces",
    organization: "Project Potential & India Fellow",
    date: "Leadership Analysis",
    title: "Motivation In Rural Leadership Programs",
    category: "Youth Leadership",
    summary:
      "Examining what sustains the motivation of rural youth volunteers who commit to year-long community programs, gathering in makeshift tin-roof spaces across harsh weather.",
    excerpt:
      "What drives motivation in rural leadership programs, prompting people to sit in a temporary space with tin roofs through changing seasons, working for community transformation? The members are youth volunteers who engage in these clubs for a year. Understanding intrinsic motivation versus extrinsic validation is the key to sustaining grassroots movements.",
    essayLink: "Motivation_In_Rural_Leadership_Programs.md",
    meta: [
      { label: "Context", value: "Youth Volunteers" },
      { label: "Setting", value: "Community Spaces" },
      { label: "Insight", value: "Intrinsic Motivation & Sustainability" },
    ],
    audioLabel: "Monsoon Rain on Tin Roof Ambience",
    tags: ["Rural Leadership", "Volunteer Agency", "Community"],
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
                  <span className="opacity-60 text-[9px] truncate max-w-[100px]">{d.organization}</span>
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
              <span className="text-cyan-400 font-semibold">{activeDispatch.organization}</span>
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

          {/* Key Context & Authentic Metadata Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeDispatch.meta.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.cardBg,
                  borderColor: activeTheme.cardBorder,
                }}
                className="p-2.5 rounded border text-center space-y-0.5 shadow-sm"
              >
                <div className="text-[11px] font-bold text-amber-400 font-mono">
                  {m.value}
                </div>
                <div className="text-[9px] opacity-60 uppercase tracking-wider">
                  {m.label}
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
