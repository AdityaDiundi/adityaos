"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Volume2, VolumeX, Tv } from "lucide-react";

// Dynamically import ReactPlayer to prevent Next.js SSR hydration mismatches
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<Record<string, unknown>>;

interface StreamItem {
  id: string;
  title: string;
  series: string;
  url: string;
  duration: string;
  codec: string;
}

const STREAMS: StreamItem[] = [
  {
    id: "terrace-theory",
    title: "TERRACE THEORY // Architecture Breakdown",
    series: "TERRACE THEORY",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Safe fallback embeddable
    duration: "14:20",
    codec: "VP9.0 // 4K 60FPS",
  },
  {
    id: "anjuri-sessions",
    title: "ANJURI // Acoustic & Poetic Experiments",
    series: "ANJURI",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Lofi Girl stream
    duration: "LIVE",
    codec: "AV01 // 1080P",
  },
];

export const StreamFeed: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playedFraction, setPlayedFraction] = useState(0.24);
  const [playedSeconds, setPlayedSeconds] = useState(86);
  const [volume] = useState(0.8);

  const playerRef = useRef<{ seekTo: (fraction: number) => void } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stream = STREAMS[currentStreamIndex];

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
    <div className="flex flex-col h-full bg-onedark-dark font-mono text-xs select-none">
      {/* MPV Top Header Bar */}
      <div className="h-7 bg-onedark-surface border-b border-onedark-border px-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 truncate">
          <Tv className="w-3.5 h-3.5 text-onedark-green" />
          <span className="text-onedark-textBright font-semibold truncate">
            MPV // {stream.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {STREAMS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setCurrentStreamIndex(idx);
                setPlayedFraction(0);
              }}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                currentStreamIndex === idx
                  ? "bg-onedark-green/20 text-onedark-green border border-onedark-green/40"
                  : "text-onedark-muted hover:text-onedark-text hover:bg-onedark-surface2"
              }`}
            >
              {s.series}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Viewport & Telemetry Layer */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden group">
        {mounted ? (
          <div className="w-full h-full pointer-events-none opacity-85">
            <ReactPlayer
              ref={playerRef}
              url={stream.url}
              playing={playing}
              muted={muted}
              volume={volume}
              width="100%"
              height="100%"
              controls={false}
              onProgress={(p: { played: number; playedSeconds: number }) => {
                setPlayedFraction(p.played);
                setPlayedSeconds(p.playedSeconds);
              }}
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1,
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center text-onedark-muted text-xs">
            [INITIALIZING MPV BACKEND...]
          </div>
        )}

        {/* Faux Telemetry Overlays (Absolute Positioned) */}
        {/* Top-Left Telemetry */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none text-[10px] tracking-wide text-onedark-cyan bg-onedark-dark/80 px-2 py-1 rounded border border-onedark-borderMuted/60 backdrop-blur-sm">
          <span>[DECODE: VP9 // HARDWARE_ACCEL]</span>
          <span className="text-onedark-muted">[RENDER: VO=GPU-NEXT]</span>
        </div>

        {/* Top-Right Telemetry */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-none text-[10px] tracking-wide text-onedark-green bg-onedark-dark/80 px-2 py-1 rounded border border-onedark-borderMuted/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-onedark-green animate-ping" />
            <span>[BUFFER: STABLE]</span>
          </div>
          <span className="text-onedark-muted">[SYNC: +0.02ms // 60.00fps]</span>
        </div>

        {/* Center Big Play Button Overlay on Hover/Paused */}
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-onedark-blue/90 text-onedark-dark flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </button>
        )}

        {/* Bottom Telemetry HUD */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-onedark-muted pointer-events-none">
          <span className="bg-onedark-dark/80 px-2 py-0.5 rounded border border-onedark-borderMuted/50">
            AUDIO: PCM 24bit/48kHz // STEREO
          </span>
          <span className="bg-onedark-dark/80 px-2 py-0.5 rounded border border-onedark-borderMuted/50 text-onedark-yellow">
            TRACK: {stream.series}
          </span>
        </div>
      </div>

      {/* MPV Custom Div-Based Progress Bar */}
      <div
        onClick={handleProgressBarClick}
        className="h-2 w-full bg-onedark-surface hover:h-3 transition-all cursor-pointer relative group flex items-center border-t border-b border-onedark-border"
      >
        {/* Buffered subtle background */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-onedark-muted/20"
          style={{ width: `${Math.min(100, (playedFraction + 0.15) * 100)}%` }}
        />
        {/* Played track */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-onedark-blue transition-all"
          style={{ width: `${playedFraction * 100}%` }}
        />
        {/* Scrubber head */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-onedark-textBright -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${playedFraction * 100}%` }}
        />
      </div>

      {/* Bottom MPV Controls Bar */}
      <div className="h-10 bg-onedark-surface2 border-t border-onedark-border px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="p-1 rounded text-onedark-text hover:text-onedark-blue hover:bg-onedark-surface transition-colors"
          >
            {playing ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="p-1 rounded text-onedark-text hover:text-onedark-yellow hover:bg-onedark-surface transition-colors"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-onedark-red" />
            ) : (
              <Volume2 className="w-4 h-4 text-onedark-green" />
            )}
          </button>

          {/* Time Counter */}
          <span className="text-[11px] text-onedark-text">
            {formatTime(playedSeconds)} / {stream.duration}
          </span>
        </div>

        {/* Right Info / Quality */}
        <div className="flex items-center gap-3 text-[11px] text-onedark-muted">
          <span className="hidden sm:inline">{stream.codec}</span>
          <span className="px-1.5 py-0.5 rounded bg-onedark-dark text-onedark-cyan font-bold text-[10px] border border-onedark-borderMuted">
            MPV // ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};
