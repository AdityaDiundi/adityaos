import wave
import struct
import math
import random

SAMPLE_RATE = 44100
DURATION = 14.5
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

# Stereo buffer initialized to zero
left = [0.0] * TOTAL_SAMPLES
right = [0.0] * TOTAL_SAMPLES

def add_tone(start_time, duration, freq, volume=0.25, wave_type="sine", pan=0.0):
    start_sample = int(start_time * SAMPLE_RATE)
    num_samples = int(duration * SAMPLE_RATE)
    
    for i in range(num_samples):
        idx = start_sample + i
        if idx >= TOTAL_SAMPLES:
            break
        t = i / SAMPLE_RATE
        # Exponential decay envelope
        env = math.exp(-i / (num_samples * 0.4)) * (1.0 - math.exp(-i / (SAMPLE_RATE * 0.005)))
        
        if wave_type == "sine":
            val = math.sin(2.0 * math.pi * freq * t)
        elif wave_type == "triangle":
            val = (2.0 / math.pi) * math.asin(math.sin(2.0 * math.pi * freq * t))
        elif wave_type == "noise":
            val = (random.random() * 2.0 - 1.0)
        else:
            val = math.sin(2.0 * math.pi * freq * t)
            
        sample_val = val * env * volume
        l_mult = 0.5 * (1.0 - pan)
        r_mult = 0.5 * (1.0 + pan)
        left[idx] += sample_val * l_mult
        right[idx] += sample_val * r_mult

# Phase 0: Ambient soft low hum
for i in range(TOTAL_SAMPLES):
    t = i / SAMPLE_RATE
    hum = math.sin(2.0 * math.pi * 110.0 * t) * 0.015 * min(1.0, t / 1.0)
    left[i] += hum
    right[i] += hum

# Phase 1: Sprite drawing pops (0.6s to 2.8s)
heart_times = [0.6 + i * 0.05 for i in range(26)]
for idx, st in enumerate(heart_times):
    freq = 440.0 + idx * 16.0
    pan = ((idx % 7) - 3) / 4.0
    add_tone(st, 0.07, freq, volume=0.22, wave_type="sine", pan=pan)

# Phase 2: Rainbow Brush activation chime (2.9s)
for offset, f in zip([0.0, 0.04, 0.08, 0.12], [523.25, 659.25, 783.99, 1046.50]):
    add_tone(2.9 + offset, 0.18, f, volume=0.18, wave_type="sine")

# Rainbow wave sweeps (3.3s to 4.7s)
wave_times = [3.3 + i * 0.04 for i in range(24)]
for idx, st in enumerate(wave_times):
    freq = 520.0 + (idx * 28.0) % 600.0
    pan = math.sin(idx * 0.3)
    add_tone(st, 0.08, freq, volume=0.20, wave_type="triangle", pan=pan)

# Phase 3: Game of Life mode switch & evolve (4.9s - 7.8s)
add_tone(4.9, 0.15, 880.0, volume=0.25, wave_type="sine")
add_tone(5.05, 0.20, 1174.66, volume=0.28, wave_type="sine")

life_ticks = [5.3 + i * 0.13 for i in range(18)]
for idx, st in enumerate(life_ticks):
    freq = 380.0 + ((idx * 47) % 320)
    pan = ((idx % 5) - 2) / 3.0
    add_tone(st, 0.09, freq, volume=0.22, wave_type="sine", pan=pan)

# Phase 4: Sand simulation switch & cascade (8.0s - 10.5s)
add_tone(8.0, 0.12, 650.0, volume=0.22, wave_type="sine")
sand_particles = [8.3 + i * 0.055 for i in range(28)]
for idx, st in enumerate(sand_particles):
    freq = 280.0 + (idx * 15.0)
    add_tone(st, 0.045, freq, volume=0.16, wave_type="triangle")
    add_tone(st, 0.03, freq * 2, volume=0.08, wave_type="noise")

# Phase 5: Outro Resolution Chord (10.8s)
chord = [349.23, 440.0, 523.25, 659.25, 1046.50]
for idx, f in enumerate(chord):
    add_tone(10.8 + idx * 0.03, 2.8, f, volume=0.16, wave_type="sine")

# Write WAV file
wav_path = "/home/aditya/Antigravity/public/studio_soundscape.wav"
with wave.open(wav_path, "w") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for l, r in zip(left, right):
        # Soft limiter / clamp
        cl = max(-0.95, min(0.95, l))
        cr = max(-0.95, min(0.95, r))
        il = int(cl * 32767.0)
        ir = int(cr * 32767.0)
        frames.extend(struct.pack("<hh", il, ir))
    wf.writeframes(frames)

print(f"Synthesized stereo soundscape written to: {wav_path}")
