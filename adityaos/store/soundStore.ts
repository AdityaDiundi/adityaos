import { create } from "zustand";

interface SoundState {
  isSoundEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (vol: number) => void;
  playScrollNote: (delta?: number) => void;
  playClickChime: (freq?: number) => void;
}

// Pentatonic & Beethoven Für Elise Note Sequences for ASMR tactile feedback
const SCROLL_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
];

let globalAudioCtx: AudioContext | null = null;
let lastScrollTime = 0;
let noteIndex = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!globalAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        globalAudioCtx = new AudioCtx({ latencyHint: "interactive" });
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isSoundEnabled: true,
  volume: 0.04,

  toggleSound: () => {
    set((state) => ({ isSoundEnabled: !state.isSoundEnabled }));
  },

  setSoundEnabled: (enabled: boolean) => {
    set({ isSoundEnabled: enabled });
  },

  setVolume: (vol: number) => {
    set({ volume: vol });
  },

  playScrollNote: (delta = 1) => {
    const { isSoundEnabled, volume } = get();
    if (!isSoundEnabled) return;

    const now = performance.now();
    // Throttle to avoid audio clipping during rapid wheel scroll
    if (now - lastScrollTime < 45) return;
    lastScrollTime = now;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const audioNow = ctx.currentTime + 0.005;

      // Advance note in scale according to scroll direction
      if (delta > 0) {
        noteIndex = (noteIndex + 1) % SCROLL_SCALE.length;
      } else {
        noteIndex = (noteIndex - 1 + SCROLL_SCALE.length) % SCROLL_SCALE.length;
      }

      const freq = SCROLL_SCALE[noteIndex];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioNow);

      gain.gain.setValueAtTime(0, audioNow);
      gain.gain.linearRampToValueAtTime(volume * 0.7, audioNow + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(audioNow);
      osc.stop(audioNow + 0.08);
    } catch {
      // Audio unavailable
    }
  },

  playClickChime: (freq = 520) => {
    const { isSoundEnabled, volume } = get();
    if (!isSoundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const audioNow = ctx.currentTime + 0.005;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioNow);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioNow + 0.05);

      gain.gain.setValueAtTime(0, audioNow);
      gain.gain.linearRampToValueAtTime(volume, audioNow + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(audioNow);
      osc.stop(audioNow + 0.06);
    } catch {
      // Audio unavailable
    }
  },
}));
