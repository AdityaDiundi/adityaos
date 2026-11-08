# Noctalia Desktop // Aditya

A Minimal Riced Dark Mode (OneDark palette) desktop environment built with Next.js App Router, Framer Motion, Zustand, Tailwind CSS, and React Player.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/framework-Next.js%2014-black)
![Tailwind](https://img.shields.io/badge/styles-Tailwind%20OneDark-blueviolet)

---

## ⟡ System Architecture

```
├── app/
│   ├── globals.css                       # Subtle grid background & scroll locking
│   ├── layout.tsx                        # Global metadata & dark theme wrapper
│   └── page.tsx                          # Full-bleed desktop container, status bar, TWM canvas
├── components/
│   ├── System/
│   │   └── WindowFrame.tsx               # Reusable TWM window with Framer Motion drag & controls
│   └── Modules/
│       ├── CoreIntro.tsx                 # Primary identity module (first-person singular voice)
│       ├── ArchiveReader.tsx             # Terminal-style 2-column Vim/Nano text reader
│       ├── StreamFeed.tsx                # MPV-style media player wrapper for YouTube with faux telemetry
│       └── TerminalDesktop.tsx           # Minimized shell state anchored to bottom with Quick Chips
├── store/
│   └── osStore.ts                        # Zustand global state (windows, z-index, minimization, maximization)
├── tailwind.config.ts                    # OneDark palette & monospace typography
└── package.json
```

---

## ⚡ Features

1. **Full-Bleed Desktop Environment (`app/page.tsx`)**:
   - Scroll-locked full viewport container with subtle mathematical dot/line grid background.
   - Top status bar featuring workspace tags (`[1:SYS]`, `[2:ARCHIVE]`, `[3:MEDIA]`), active window indicator, CPU/Memory telemetry, and digital clock.

2. **TWM Window Wrapper (`components/System/WindowFrame.tsx`)**:
   - Draggable with boundary constraints using Framer Motion.
   - Window management: minimize (`-`), maximize/restore (`+`), and close (`x`).
   - Dynamic z-index layering and active window focus glows.

3. **Core Identity Module (`components/Modules/CoreIntro.tsx`)**:
   - Written strictly from a single-author perspective using first-person singular pronouns (`I`, `me`, `my`).
   - Minimalist benchmark cards: `4+ Years Experience`, `3+ Products Shipped`, `2 Design Systems Built`.
   - Hardware telemetry header and technical focus badges.

4. **Archive Reader (`components/Modules/ArchiveReader.tsx`)**:
   - Terminal-style Vim/Nano aesthetic with dual-column flexbox layout.
   - Left: Directory tree explorer with collapsible folders (`essays/`, `poetry/`).
   - Right: Syntax-highlighted text reader with line numbers gutter and Vim statusline.
   - Pre-loaded with authentic literature:
     - `essays/Daughters_of_Misogyny.md`
     - `poetry/तस्वीरें_छोटी_होनी_चाहिए.txt`
     - `poetry/गंजे_लोगों_की_पंचायत.txt`

5. **Stream Feed (`components/Modules/StreamFeed.tsx`)**:
   - MPV-style media player wrapper powered by `react-player`.
   - YouTube UI cleanly suppressed (`controls=0, modestbranding=1, rel=0`).
   - Absolute-positioned faux telemetry overlays (`[DECODE: VP9]`, `[BUFFER: STABLE]`, `[SYNC: +0.02ms]`).
   - Custom div-based scrubber progress bar and playback controls.

6. **Terminal Desktop (`components/Modules/TerminalDesktop.tsx`)**:
   - Minimized shell state anchored to the bottom.
   - Shell prompt: `aditya@noctalia-shell:~$`.
   - Interactive Quick Chips:
     - `cat poetry.txt` &rarr; Opens ArchiveReader
     - `./play_latest_match` &rarr; Opens StreamFeed
     - `fetch core_intro` &rarr; Restores CoreIntro
   - Supports interactive terminal commands (`help`, `ls`, `whoami`, `clear`, `neofetch`).

7. **Zustand Global State (`store/osStore.ts`)**:
   - Centralized state for `activeWindow`, `openWindows`, `minimizedWindows`, `maximizedWindows`, and dynamic `zIndexMap`.

---

## 🎨 Theme: Minimal Riced OneDark Palette

| Role | Hex | Preview |
| :--- | :--- | :--- |
| **Background** | `#1e222a` | Desktop Canvas |
| **Dark Header** | `#181b21` | Window Bar & Top Bar |
| **Surface** | `#21252b` | Cards & Explorer |
| **Border** | `#3e4451` | Subtle Window Borders |
| **Blue Accent** | `#61afef` | Active Focus & Core Buttons |
| **Green Accent** | `#98c379` | Telemetry & Success Indicators |
| **Yellow Accent** | `#e5c07b` | Warning & Poetry Badges |
| **Purple Accent** | `#c678dd` | Identity & Vim Tags |
| **Cyan Accent** | `#56b6c2` | Codecs & Sub-telemetry |

---

## 🚀 Getting Started

### Using Node / pnpm / yarn / bun:
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Using Deno:
```bash
deno install
deno task dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
