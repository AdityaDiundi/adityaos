"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/osStore";
import { useThemeStore } from "@/store/themeStore";
import { useSoundStore } from "@/store/soundStore";
import {
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Wifi,
  Battery,
  Sparkles,
  User,
} from "lucide-react";

export const HyprlandBootScreen: React.FC = () => {
  const { isLocked, unlockSession, wallpaperUrl } = useOSStore();
  const { activeTheme } = useThemeStore();
  const { playBootChime, playClickChime } = useSoundStore();

  const [password, setPassword] = useState<string>("");
  const [timeStr, setTimeStr] = useState<string>("22:00");
  const [dateStr, setDateStr] = useState<string>("");
  const [isBooting, setIsBooting] = useState<boolean>(false);
  const [bootStep, setBootStep] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const bootLogs = [
    "[  OK  ] Reached target System Initialization",
    "[  OK  ] Started Wayland Compositor (Hyprland v0.42.0-git)",
    "[  OK  ] Initialized WebAudio DSP Sound Engine (Für Elise Music Box)",
    "[  OK  ] Mounted OneDark Canvas & 2D/3D Voxel Engine",
    "[  OK  ] Connected Vercel Analytics telemetry session",
    "[  OK  ] Authenticated session for Aditya Diundi. Spawning TWM...",
  ];

  // Update clock & date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto focus input when locked
  useEffect(() => {
    if (isLocked && !isBooting) {
      inputRef.current?.focus();
    }
  }, [isLocked, isBooting]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isBooting) return;

    setIsBooting(true);
    playBootChime();

    // Stagger boot logs
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setBootStep(currentStep);
      if (currentStep >= bootLogs.length) {
        clearInterval(interval);
        setTimeout(() => {
          unlockSession();
          setIsBooting(false);
          setBootStep(0);
          setPassword("");
        }, 350);
      }
    }, 120);
  };

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[3000] flex flex-col justify-between font-mono select-none overflow-hidden"
      >
        {/* Dynamic Wallpaper Backdrop with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : undefined,
            backgroundColor: activeTheme.desktopBg,
          }}
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-2xl pointer-events-none" />

        {/* Hyprland Top Bar Info */}
        <div className="relative z-10 h-10 px-4 sm:px-6 flex items-center justify-between text-xs border-b border-white/10 text-white/70 backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-2">
            <span style={{ color: activeTheme.accent }}>⟡</span>
            <span className="font-bold tracking-tight">aditya-os // hyprlock</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-cyan-400 font-medium">
              Wayland
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 opacity-80">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">online</span>
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <Battery className="w-3.5 h-3.5 text-cyan-400" />
              <span>100%</span>
            </div>
            <div className="hidden sm:inline opacity-60">
              aditya@noctalia
            </div>
          </div>
        </div>

        {/* Center Login & Clock Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full space-y-6">
          {/* Big Minimal Hyprland Clock */}
          <div className="text-center space-y-1">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
              {timeStr}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 tracking-wider font-medium uppercase">
              {dateStr}
            </p>
          </div>

          {/* Profile Card & Input Container */}
          <div className="w-full bg-neutral-950/80 border border-white/15 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center space-y-4">
            {/* Avatar with Glow Ring */}
            <div className="relative group">
              <div
                style={{ borderColor: activeTheme.accent }}
                className="w-20 h-20 rounded-full border-2 overflow-hidden shadow-xl p-0.5 bg-neutral-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/aditya_avatar_sq.jpg"
                  alt="Aditya Diundi"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                style={{ backgroundColor: activeTheme.accent }}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-black shadow-md"
              >
                <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>

            {/* User Title */}
            <div className="text-center">
              <div className="font-bold text-sm text-white tracking-tight flex items-center justify-center gap-1.5">
                <span>Aditya Diundi</span>
              </div>
              <div className="text-[11px] text-white/50 mt-0.5 font-mono">
                Product Designer & Systems Engineer
              </div>
            </div>

            {/* Boot Loader Animation OR Login Form */}
            {isBooting ? (
              <div className="w-full space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>LAUNCHING HYPRLAND SESSION...</span>
                  </div>
                  <span>{Math.min(100, Math.round((bootStep / bootLogs.length) * 100))}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(bootStep / bootLogs.length) * 100}%` }}
                    transition={{ ease: "easeOut", duration: 0.15 }}
                  />
                </div>

                {/* Boot Log Terminal Stream */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-white/80 font-mono space-y-1 h-20 overflow-hidden flex flex-col justify-end">
                  {bootLogs.slice(0, bootStep).map((log, idx) => (
                    <div key={idx} className="truncate text-emerald-400 animate-in fade-in duration-100">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="w-full space-y-3">
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Press [Enter] to login as guest..."
                    className="w-full bg-neutral-900/90 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-cyan-400 transition-colors pr-10 shadow-inner"
                  />
                  <button
                    type="submit"
                    title="Unlock Workspace"
                    style={{
                      backgroundColor: activeTheme.accent,
                    }}
                    className="absolute right-1.5 p-1.5 rounded-lg text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                  >
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/50 px-1">
                  <span>Guest session enabled</span>
                  <button
                    type="button"
                    onClick={() => handleLogin()}
                    className="text-cyan-400 hover:underline cursor-pointer font-semibold"
                  >
                    Quick Boot ↵
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom System Footer */}
        <div className="relative z-10 h-10 px-4 sm:px-6 flex items-center justify-between text-[11px] text-white/40 border-t border-white/10 backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-2">
            <span>Delhi, India</span>
            <span>•</span>
            <span className="text-emerald-400/80">Available for Opportunities</span>
          </div>
          <div className="text-[10px]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Enter</kbd> or click Quick Boot
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
