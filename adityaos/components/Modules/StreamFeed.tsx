"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Volume2, VolumeX, Tv, ExternalLink, Film, Youtube } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<Record<string, unknown>>;

interface StreamItem {
  id: string;
  title: string;
  category: "SHORTS" | "MATCH" | "HIGHLIGHT";
  url: string;
  duration: string;
  codec: string;
}

const FALSEPEEK_STREAMS: StreamItem[] = [
  {
    id: "gnzulGkZYDQ",
    title: "Don’t worry, I am here. Hard Hitting Boom Bot",
    category: "SHORTS",
    url: "https://www.youtube.com/watch?v=gnzulGkZYDQ",
    duration: "0:30",
    codec: "AV01 // 1080x1920 60FPS",
  },
  {
    id: "k3goWR93wbo",
    title: "Playing against aim god chamber 🌪️🥴",
    category: "SHORTS",
    url: "https://www.youtube.com/watch?v=k3goWR93wbo",
    duration: "0:45",
    codec: "VP9 // 1080x1920 60FPS",
  },
  {
    id: "pVAsX76IOgw",
    title: "1v4 Clutch 🕺☺️🌪️ #donk #cs2",
    category: "HIGHLIGHT",
    url: "https://www.youtube.com/watch?v=pVAsX76IOgw",
    duration: "0:52",
    codec: "VP9 // 1080P 60FPS",
  },
  {
    id: "3Xe_lpRTBDs",
    title: "Trainspotting everybody #falsepeek #cs2",
    category: "MATCH",
    url: "https://www.youtube.com/watch?v=3Xe_lpRTBDs",
    duration: "0:48",
    codec: "VP9.2 // 1440P",
  },
  {
    id: "Ap8IwdhArQ4",
    title: "Another savage 🕺 #mlbb",
    category: "SHORTS",
    url: "https://www.youtube.com/watch?v=Ap8IwdhArQ4",
    duration: "0:34",
    codec: "H.264 // 1080P",
  },
  {
    id: "RFq3SF1kN18",
    title: "Savage Highlight 🕺 #mobalegends",
    category: "HIGHLIGHT",
    url: "https://www.youtube.com/watch?v=RFq3SF1kN18",
    duration: "0:40",
    codec: "AV01 // 1080P",
  },
  {
    id: "l6kADNHmNDc",
    title: "Monica 👯‍♂️💃🕺 #cs2",
    category: "MATCH",
    url: "https://www.youtube.com/watch?v=l6kADNHmNDc",
    duration: "0:35",
    codec: "VP9 // 1080P",
  },
];

export const StreamFeed: React.FC = () => {
  const { activeTheme } = useThemeStore();
  const { playScrollNote, playClickChime } = useSoundStore();
  const [mounted, setMounted] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playedFraction, setPlayedFraction] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const playerRef = useRef<{ seekTo: (fraction: number) => void } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stream = FALSEPEEK_STREAMS[currentStreamIndex];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    setPlayedFraction(newFraction);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(newFraction);
    }
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
      {/* MPV Top Header Bar */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="h-8 border-b px-3 flex items-center justify-between text-[11px] flex-shrink-0"
      >
        <div className="flex items-center gap-2 truncate">
          <Tv className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
          <span className="font-semibold truncate">
            mpv://falsepeek/{stream.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.youtube.com/@falsepeek"
            target="_blank"
            rel="noopener noreferrer"
            title="Open YouTube Channel"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.cardBorder,
              color: "#FF0000",
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold hover:opacity-80 transition-opacity"
          >
            <Youtube className="w-3 h-3 text-red-500" />
            <span>@falsepeek</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
        {mounted ? (
          <ReactPlayer
            ref={playerRef}
            url={stream.url}
            playing={playing}
            muted={muted}
            width="100%"
            height="100%"
            controls={true}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onProgress={(state: { played: number; playedSeconds: number }) => {
              setPlayedFraction(state.played);
              setPlayedSeconds(Math.floor(state.playedSeconds));
            }}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 0,
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
        ) : (
          <div className="text-onedark-muted text-xs animate-pulse">
            [MPV]: Initializing hardware stream decoders...
          </div>
        )}
      </div>

      {/* MPV Control Deck */}
      <div
        style={{
          backgroundColor: activeTheme.headerBg,
          borderColor: activeTheme.headerBorder,
        }}
        className="border-t p-2 sm:p-2.5 flex flex-col gap-2 flex-shrink-0"
      >
        {/* Progress Timeline Scrubber */}
        <div
          onClick={handleProgressBarClick}
          style={{ backgroundColor: activeTheme.cardBg }}
          className="w-full h-2 rounded cursor-pointer relative overflow-hidden"
        >
          <div
            style={{
              width: `${playedFraction * 100}%`,
              backgroundColor: activeTheme.accent,
            }}
            className="h-full rounded transition-all duration-100"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => {
                setPlaying(!playing);
                playClickChime(480);
              }}
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-1.5 rounded border hover:opacity-80 transition-colors"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Mute/Unmute */}
            <button
              type="button"
              onClick={() => {
                setMuted(!muted);
                playClickChime(560);
              }}
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: activeTheme.textPrimary,
              }}
              className="p-1.5 rounded border hover:opacity-80 transition-colors"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-onedark-red" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Telemetry Timestamp */}
            <span className="font-mono text-[10px] opacity-75">
              {formatTime(playedSeconds)} / {stream.duration}
            </span>
          </div>

          {/* Active Track Title */}
          <div className="hidden sm:flex items-center gap-1.5 truncate max-w-xs font-semibold text-[10px]" style={{ color: activeTheme.accent }}>
            <Film className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{stream.title}</span>
          </div>

          {/* Codec Flag */}
          <div className="text-[10px] opacity-60 font-mono hidden md:block">
            {stream.codec}
          </div>
        </div>

        {/* Video Playlist Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          {FALSEPEEK_STREAMS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setCurrentStreamIndex(idx);
                setPlayedFraction(0);
                setPlayedSeconds(0);
                setPlaying(true);
                playClickChime(620);
              }}
              style={{
                backgroundColor:
                  currentStreamIndex === idx ? activeTheme.tagBg : activeTheme.cardBg,
                borderColor:
                  currentStreamIndex === idx ? activeTheme.accent : activeTheme.cardBorder,
                color:
                  currentStreamIndex === idx ? activeTheme.accent : activeTheme.textMuted,
              }}
              className="px-2 py-1 rounded border text-[10px] whitespace-nowrap flex items-center gap-1.5 hover:opacity-90 transition-all font-semibold"
            >
              <span className="text-[9px] opacity-60">[{s.category}]</span>
              <span className="truncate max-w-[140px]">{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
