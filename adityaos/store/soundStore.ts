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

// Beethoven - Für Elise (Linear Classical Music Box Sequence from legacy monolithic project)
// Encodes frequency (f) and relative duration / intonation multiplier (d)
const BEETHOVEN_FUR_ELISE: { f: number; d: number }[] = [
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 1 },
  { f: 440, d: 3 },
  { f: 261.63, d: 1 },
  { f: 329.63, d: 1 },
  { f: 440, d: 1 },
  { f: 493.88, d: 3 },
  { f: 329.63, d: 1 },
  { f: 415.3, d: 1 },
  { f: 493.88, d: 1 },
  { f: 523.25, d: 3 },
  { f: 329.63, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 1 },
  { f: 440, d: 3 },
  { f: 261.63, d: 1 },
  { f: 329.63, d: 1 },
  { f: 440, d: 1 },
  { f: 493.88, d: 3 },
  { f: 329.63, d: 1 },
  { f: 523.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 440, d: 6 },
  { f: 493.88, d: 1 },
  { f: 523.25, d: 1 },
  { f: 587.33, d: 1 },
  { f: 659.25, d: 3 },
  { f: 392, d: 1 },
  { f: 698.46, d: 1 },
  { f: 659.25, d: 1 },
  { f: 587.33, d: 3 },
  { f: 349.23, d: 1 },
  { f: 659.25, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 3 },
  { f: 329.63, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 1 },
  { f: 493.88, d: 3 },
  { f: 329.63, d: 1 },
  { f: 659.25, d: 1 },
  { f: 329.63, d: 1 },
  { f: 659.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 1 },
  { f: 440, d: 3 },
  { f: 261.63, d: 1 },
  { f: 329.63, d: 1 },
  { f: 440, d: 1 },
  { f: 493.88, d: 3 },
  { f: 329.63, d: 1 },
  { f: 415.3, d: 1 },
  { f: 493.88, d: 1 },
  { f: 523.25, d: 3 },
  { f: 329.63, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 622.25, d: 1 },
  { f: 659.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 587.33, d: 1 },
  { f: 523.25, d: 1 },
  { f: 440, d: 3 },
  { f: 261.63, d: 1 },
  { f: 329.63, d: 1 },
  { f: 440, d: 1 },
  { f: 493.88, d: 3 },
  { f: 329.63, d: 1 },
  { f: 523.25, d: 1 },
  { f: 493.88, d: 1 },
  { f: 440, d: 6 },
];

let globalAudioCtx: AudioContext | null = null;
let lastScrollTime = 0;
let melodyIndex = 0;

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
  volume: 0.025,

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
    // Throttle slightly to avoid harsh clipping during high-speed trackpad scrolling
    if (now - lastScrollTime < 40) return;
    lastScrollTime = now;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const audioNow = ctx.currentTime + 0.005;

      // Advance Beethoven Für Elise Music Box linearly
      if (delta >= 0) {
        melodyIndex = (melodyIndex + 1) % BEETHOVEN_FUR_ELISE.length;
      } else {
        melodyIndex =
          (melodyIndex - 1 + BEETHOVEN_FUR_ELISE.length) % BEETHOVEN_FUR_ELISE.length;
      }

      const note = BEETHOVEN_FUR_ELISE[melodyIndex];
      const freq = note.f;
      const durationMult = note.d;

      // Authentic Cinematic Hybrid Synth (Triangle + Sub Sine + Warm Lowpass)
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Main melodic voice: Triangle (gentle grand piano / music box timbre)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioNow);

      // Sub voice: Sine 1 octave down for rich tactile body
      sub.type = "sine";
      sub.frequency.setValueAtTime(freq / 2, audioNow);

      // Warm lowpass filter with gentle resonance
      filter.type = "lowpass";
      filter.Q.value = 1.0;
      filter.frequency.setValueAtTime(freq * 1.1, audioNow);
      filter.frequency.exponentialRampToValueAtTime(freq * 2.0, audioNow + 0.08);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.1, audioNow + 0.9);

      // Tail decays according to note intonation multiplier
      const tail = Math.min(1.4 * durationMult, 2.5);

      gain.gain.setValueAtTime(0, audioNow);
      gain.gain.linearRampToValueAtTime(volume, audioNow + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + tail);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(audioNow);
      sub.start(audioNow);
      osc.stop(audioNow + tail);
      sub.stop(audioNow + tail);
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
      gain.gain.linearRampToValueAtTime(volume * 1.2, audioNow + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(audioNow);
      osc.stop(audioNow + 0.07);
    } catch {
      // Audio unavailable
    }
  },
}));
