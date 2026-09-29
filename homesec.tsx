import * as React from "react"
import {
    useState,
    useCallback,
    useRef,
    useEffect,
    useLayoutEffect,
    startTransition,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType } from "framer"
import {
    Pencil,
    Eraser,
    PaintBucket,
    Undo2,
    Redo2,
    Play,
    Pause,
    Trash2,
    Download,
    FlipHorizontal,
    Pipette,
    Palette,
    Type,
    Box,
    Grid,
    MousePointer2,
    Monitor,
    VolumeX,
    Volume2,
} from "lucide-react"

import {
    initializeApp,
    getApps,
    getApp,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import {
    getDatabase,
    ref as fbRef,
    runTransaction,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import {
    getAnalytics,
    logEvent,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 720
 */

const BLACK = "#090A0C"
const BODY = "#191B20"
const MUTED = "#6D7178"
const BLUE = "#245BFF"

function playCyberHeroBlip(freq = 880, duration = 0.08) {
    if (typeof window === "undefined") return
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + duration)
    } catch {}
}

function CyberHero(props: any) {
    const {
        theme = "dark",
        accent = BLUE,
        workSection = "work",
        scrollOffset = 0,
        resumeLink = "",
        resumeNewTab = true,
        onOpenProjects,
        style,
    } = props

    const [copiedEmail, setCopiedEmail] = React.useState(false)
    const [hoveredCard, setHoveredCard] = React.useState<number | null>(null)

    /* =====================================================
       LOAD GOOGLE FONTS
    ===================================================== */
    React.useEffect(() => {
        const id = "aditya-cyber-fonts"
        if (!document.getElementById(id)) {
            const link = document.createElement("link")
            link.id = id
            link.rel = "stylesheet"
            link.href =
                "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
            document.head.appendChild(link)
        }
    }, [])

    const handleCopyEmail = () => {
        playCyberHeroBlip(1200, 0.12)
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText("adityadiundi@gmail.com")
            setCopiedEmail(true)
            setTimeout(() => setCopiedEmail(false), 2500)
        }
    }

    const handleExploreWork = React.useCallback(() => {
        playCyberHeroBlip(780, 0.09)
        if (onOpenProjects) {
            onOpenProjects()
            return
        }

        if (typeof window === "undefined") return
        const raw = String(workSection || "").trim().replace(/^#/, "")
        if (!raw) return

        let target = document.getElementById(raw)
        if (!target) {
            try {
                target = document.querySelector(`[data-framer-name="${CSS.escape(raw)}"]`) as HTMLElement | null
            } catch {}
        }
        if (!target) {
            try {
                target = document.querySelector(`[name="${CSS.escape(raw)}"]`) as HTMLElement | null
            } catch {}
        }
        if (!target) return

        const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        const top = target.getBoundingClientRect().top + window.scrollY - Number(scrollOffset || 0)
        window.scrollTo({
            top,
            behavior: reduced ? "auto" : "smooth",
        })
    }, [onOpenProjects, workSection, scrollOffset])

    const capabilities = [
        {
            num: "01",
            title: "DESIGN SYSTEMS & TOKEN ARCHITECTURE",
            sub: "Multi-brand Token Pipelines & UI Kits",
            desc: "Architecting multi-tier token taxonomy (Global → Alias → Component), automated Figma variable extraction, CSS theme engines, and strict WCAG AAA accessibility across large-scale repositories.",
            tags: ["Tokens Studio", "Multi-Brand", "Headless UI", "Figma API"],
        },
        {
            num: "02",
            title: "CREATIVE CODE & CANVAS ENGINES",
            sub: "Hardware-Accelerated Interaction Design",
            desc: "Building 60 FPS interactive canvas tools, WebGL acceleration layers, procedural audio synthesis, and physics-based spring models that make software tactile and delightful.",
            tags: ["Canvas API", "WebGL", "Web Audio", "Micro-Interactions"],
        },
        {
            num: "03",
            title: "COMPLEX WORKFLOWS & DATA DENSITY",
            sub: "High-Throughput Interfaces for Power Users",
            desc: "Designing ergonomic data-dense workspaces: tiling window managers, real-time telemetry monitors, node graphs, and low-latency dashboards engineered for cognitive clarity.",
            tags: ["Window Managers", "Data Telemetry", "Graph Workflows", "i3 / Hyprland UX"],
        },
        {
            num: "04",
            title: "PRODUCTION REACT & TYPESCRIPT",
            sub: "Zero-Jank Frontend Engineering",
            desc: "Engineering scalable React architectures with strict TypeScript schemas, state machines, Web Workers for off-main-thread compute, and resilient error boundary fault-isolation.",
            tags: ["React 19", "Strict TS", "Web Workers", "Fault Isolation"],
        },
    ]

    const isLight = theme === "light"
    const heroBg = isLight ? "#FFFFFF" : "#07080C"
    const heroText = isLight ? "#0F172A" : "#F1E9DD"
    const heroHeading = isLight ? "#0F172A" : "#FFFFFF"
    const heroMuted = isLight ? "#64748B" : "#8E929B"
    const heroBorder = isLight ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.08)"
    const heroCardBg = isLight ? "rgba(248, 250, 252, 0.9)" : "rgba(10, 14, 20, 0.6)"
    const heroCardHoverBg = isLight ? "rgba(37, 99, 235, 0.05)" : "rgba(0, 255, 204, 0.04)"
    const heroAccent = accent || (isLight ? "#2563EB" : "#00FFCC")

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100%",
                backgroundColor: heroBg,
                color: heroText,
                fontFamily: "'Space Mono', 'IBM Plex Mono', 'Chakra Petch', monospace",
                position: "relative",
                padding: "clamp(20px, 3.5vw, 40px)",
                boxSizing: "border-box",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                userSelect: "text",
                pointerEvents: "auto",
                ...style,
            }}
        >
            {/* Top Identity & Status Ribbon */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    borderBottom: `1px solid ${heroBorder}`,
                    paddingBottom: 14,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                    <span style={{ color: heroAccent }}>&gt;</span>
                    <span style={{ color: heroHeading }}>[ IDENTITY // ADITYA DIUNDI ]</span>
                    <span
                        style={{
                            display: "inline-block",
                            width: 6,
                            height: 12,
                            backgroundColor: heroAccent,
                            animation: "cyberBlink 1.1s steps(1) infinite",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 10,
                        color: heroMuted,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22C55E", display: "inline-block", boxShadow: "0 0 8px #22C55E" }} />
                        <span style={{ color: "#22C55E", fontWeight: 700 }}>AVAILABLE FOR DESIGN SYSTEMS & HIGH-CRAFT ROLES</span>
                    </div>
                    <span style={{ opacity: 0.3 }}>//</span>
                    <span style={{ color: isLight ? "#D97706" : "#FFD700" }}>DELHI, INDIA (UTC+05:30)</span>
                </div>
            </div>

            {/* Hero Main Statement & Kicker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: heroAccent,
                        letterSpacing: "0.14em",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span>[ 00 // DESIGN ENGINEERING // INTERACTION ARCHITECTURE ]</span>
                </div>

                <h1
                    style={{
                        fontFamily: "'Chakra Petch', sans-serif",
                        fontSize: "clamp(26px, 3.4vw, 42px)",
                        fontWeight: 700,
                        lineHeight: 1.15,
                        margin: 0,
                        color: heroHeading,
                        letterSpacing: "-0.01em",
                        maxWidth: 900,
                    }}
                >
                    Bridging high-craft design and <span style={{ color: heroAccent }}>high-velocity code</span>.
                </h1>

                <p
                    style={{
                        fontSize: "clamp(12px, 1.15vw, 14px)",
                        lineHeight: 1.7,
                        color: heroMuted,
                        margin: "4px 0 0 0",
                        maxWidth: 780,
                        fontFamily: "'IBM Plex Mono', monospace",
                    }}
                >
                    I don't just hand off static Figma files or wire up generic components. I engineer multi-brand design systems, hardware-accelerated canvas interfaces, and data-dense tools where mathematical precision meets human tactile feel.
                </p>
            </div>

            {/* Quick Actions Strip */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                <button
                    onClick={handleExploreWork}
                    className="cyber-os-btn"
                    style={{
                        backgroundColor: heroAccent,
                        color: isLight ? "#FFFFFF" : "#07080C",
                        border: `1px solid ${heroAccent}`,
                        padding: "10px 18px",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: `0 0 15px ${isLight ? "rgba(37, 99, 235, 0.25)" : "rgba(0, 255, 204, 0.25)"}`,
                    }}
                >
                    <span>[ EXPLORE PROJECTS ]</span>
                    <ArrowRight />
                </button>

                <button
                    onClick={handleCopyEmail}
                    className="cyber-os-btn"
                    style={{
                        backgroundColor: copiedEmail ? "rgba(34, 197, 94, 0.15)" : isLight ? "rgba(0,0,0,0.03)" : "rgba(255, 255, 255, 0.04)",
                        color: copiedEmail ? "#22C55E" : heroHeading,
                        border: `1px solid ${copiedEmail ? "#22C55E" : heroBorder}`,
                        padding: "10px 16px",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    title="Click to copy email"
                >
                    <span>{copiedEmail ? "✓" : "✉"}</span>
                    <span>{copiedEmail ? "[ ✓ COPIED: adityadiundi@gmail.com ]" : "[ CONTACT: adityadiundi@gmail.com ]"}</span>
                </button>

                <a
                    href={resumeLink || undefined}
                    target={resumeLink && resumeNewTab ? "_blank" : undefined}
                    rel={resumeLink && resumeNewTab ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                        playCyberHeroBlip(900, 0.08)
                        if (!resumeLink) e.preventDefault()
                    }}
                    className="cyber-os-btn"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: heroMuted,
                        textDecoration: "none",
                        padding: "10px 14px",
                        border: `1px solid ${heroBorder}`,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        transition: "all 0.15s ease",
                    }}
                >
                    <span>[ RÉSUMÉ ]</span>
                    <ArrowUpRight />
                </a>
            </div>

            {/* Proof & Velocity Rail */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                    borderTop: `1px solid ${heroBorder}`,
                    borderBottom: `1px solid ${heroBorder}`,
                    padding: "16px 0",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 9, color: heroAccent, fontWeight: 700 }}>01 // EXPERIENCE</span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 24, fontWeight: 700, color: heroHeading }}>4+ Years</span>
                    <span style={{ fontSize: 10, color: heroMuted }}>Bridging Figma to Production</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 9, color: heroAccent, fontWeight: 700 }}>02 // DELIVERED</span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 24, fontWeight: 700, color: heroHeading }}>3+ Products</span>
                    <span style={{ fontSize: 10, color: heroMuted }}>Shipped from 0 to 1 at Scale</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 9, color: heroAccent, fontWeight: 700 }}>03 // FRAME BUDGET</span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 24, fontWeight: 700, color: isLight ? "#D97706" : "#FFD700" }}>&lt;16ms</span>
                    <span style={{ fontSize: 10, color: heroMuted }}>Zero-Jank 60 FPS Standard</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 9, color: heroAccent, fontWeight: 700 }}>04 // CRAFTSMANSHIP</span>
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: 24, fontWeight: 700, color: heroAccent }}>100%</span>
                    <span style={{ fontSize: 10, color: heroMuted }}>Type-Safe & A11y Compliant</span>
                </div>
            </div>

            {/* Core Capability Matrix */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: heroMuted, letterSpacing: "0.08em" }}>
                    <span>{"[ CAPABILITIES // ARCHITECTURAL SPECIALIZATIONS ]"}</span>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 14,
                    }}
                >
                    {capabilities.map((cap, idx) => {
                        const isHovered = hoveredCard === idx
                        return (
                            <div
                                key={cap.num}
                                onMouseEnter={() => {
                                    setHoveredCard(idx)
                                    playCyberHeroBlip(950 + idx * 80, 0.04)
                                }}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    border: `1px solid ${isHovered ? heroAccent : heroBorder}`,
                                    backgroundColor: isHovered ? heroCardHoverBg : heroCardBg,
                                    padding: "16px 18px",
                                    transition: "all 0.18s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    position: "relative",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 9, color: isHovered ? heroAccent : heroMuted, fontWeight: 700 }}>
                                        {`// MODULE ${cap.num}`}
                                    </span>
                                    <span style={{ fontSize: 9, color: isHovered ? heroAccent : heroMuted, opacity: isHovered ? 1 : 0.4 }}>
                                        {isHovered ? "ACTIVE" : "READY"}
                                    </span>
                                </div>

                                <h3
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: isHovered ? heroAccent : heroHeading,
                                        margin: 0,
                                        letterSpacing: "0.03em",
                                    }}
                                >
                                    {cap.title}
                                </h3>

                                <div style={{ fontSize: 10, color: isLight ? "#D97706" : "#FFD700", fontWeight: 600 }}>
                                    {cap.sub}
                                </div>

                                <p style={{ fontSize: 11, color: heroMuted, lineHeight: 1.55, margin: 0 }}>
                                    {cap.desc}
                                </p>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
                                    {cap.tags.map((t) => (
                                        <span
                                            key={t}
                                            style={{
                                                fontSize: 9,
                                                padding: "2px 6px",
                                                border: `1px solid ${heroBorder}`,
                                                backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                                                color: isHovered ? heroHeading : heroMuted,
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Bottom Tech Marquee */}
            <div
                style={{
                    borderTop: `1px solid ${heroBorder}`,
                    paddingTop: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                    fontSize: 10,
                    color: heroMuted,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ color: heroAccent, fontWeight: 700 }}>STACK:</span>
                    <span>TypeScript</span>
                    <span>•</span>
                    <span>React 19</span>
                    <span>•</span>
                    <span>Canvas 2D</span>
                    <span>•</span>
                    <span>WebGL</span>
                    <span>•</span>
                    <span>Figma Variables</span>
                    <span>•</span>
                    <span>Tokens Studio</span>
                    <span>•</span>
                    <span>Tailwind / Tokens</span>
                    <span>•</span>
                    <span>Framer Motion</span>
                    <span>•</span>
                    <span>Web Audio</span>
                </div>

                <div style={{ color: "#8E929B" }}>
                    <span>[ SYSTEM: OPERATIONAL ]</span>
                </div>
            </div>
        </div>
    )
}

function Proof({
    index,
    number,
    label,
    detail,
}: {
    index: string
    number: string
    label: string
    detail: string
}) {
    return (
        <div className="proof-item">
            <span className="proof-index">{index}</span>
            <strong className="proof-number">{number}</strong>
            <div className="proof-copy">
                <span>{label}</span>
                <small>{detail}</small>
            </div>
        </div>
    )
}

function ArrowRight() {
    return (
        <svg
            className="explore-arrow"
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 9H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
            />
            <path
                d="M10.5 5.5L14 9L10.5 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
        </svg>
    )
}

function ArrowUpRight() {
    return (
        <svg
            className="resume-arrow"
            width="12"
            height="12"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M4 11L11 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="square"
            />
            <path
                d="M5.5 4H11V9.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
            />
        </svg>
    )
}

/* ==========================================================
   DEFAULTS
========================================================== */

CyberHero.defaultProps = {
    width: 1200,
    height: 720,

    theme: "dark",
    accent: BLUE,

    workSection: "work",

    scrollOffset: 0,

    resumeLink: "",

    resumeNewTab: true,
}

/* ==========================================================
   FRAMER CONTROLS
========================================================== */

addPropertyControls(CyberHero, {
    theme: {
        type: ControlType.Enum,
        title: "Theme",
        options: ["dark", "light"],
        optionTitles: ["Dark", "Light"],
        defaultValue: "dark",
    },

    workSection: {
        type: ControlType.String,

        title: "Work Section",

        defaultValue: "work",

        placeholder: "work",
    },

    scrollOffset: {
        type: ControlType.Number,

        title: "Scroll Offset",

        defaultValue: 0,

        min: 0,
        max: 300,

        step: 1,

        unit: "px",

        displayStepper: true,
    },

    resumeLink: {
        type: ControlType.Link,

        title: "Résumé",

        defaultValue: "",
    },

    resumeNewTab: {
        type: ControlType.Boolean,

        title: "New Tab",

        defaultValue: true,

        enabledTitle: "Yes",

        disabledTitle: "No",
    },

    accent: {
        type: ControlType.Color,

        title: "Accent",

        defaultValue: BLUE,
    },
})

/* ==========================================================
   CSS
========================================================== */

const CSS_STYLES = `

/* ==========================================================
   RESET
========================================================== */

.hero-shell,
.hero-shell * {
    box-sizing: border-box;
}


.hero-shell {

    position: relative;

    width: 100%;
    height: 100%;

    min-height: 520px;

    color:
        var(--text-primary);

}


.hero-shell.theme-dark {

    --text-primary: #F3F4F6;
    --text-secondary: #C0C4CC;
    --text-muted: #7E838D;

    --border-color: rgba(255, 255, 255, 0.15);
    --border-subtle: rgba(255, 255, 255, 0.08);

    --btn-bg: #F3F4F6;
    --btn-text: #090A0C;
    --btn-border: #F3F4F6;
    --btn-cell-border: rgba(9, 10, 12, 0.2);

    --rail-divider: rgba(255, 255, 255, 0.12);

    --cursor-color: #F3F4F6;
    --tick-color: rgba(255, 255, 255, 0.35);

}


.hero-shell.theme-light {

    --text-primary: #090A0C;
    --text-secondary: #191B20;
    --text-muted: #6D7178;

    --border-color: rgba(9, 10, 12, 0.18);
    --border-subtle: rgba(9, 10, 12, 0.12);

    --btn-bg: #090A0C;
    --btn-text: #FFFFFF;
    --btn-border: #090A0C;
    --btn-cell-border: rgba(255, 255, 255, 0.22);

    --rail-divider: rgba(9, 10, 12, 0.12);

    --cursor-color: #090A0C;
    --tick-color: rgba(9, 10, 12, 0.47);

}


/* ==========================================================
   FONT SYSTEM
========================================================== */

.hero-shell,
.hero-shell * {

    font-family:
        "IBM Plex Mono",
        monospace;

}


.hero-heading,
.hero-heading * {

    font-family:
        "Chakra Petch",
        sans-serif;

}


/* ==========================================================
   MAIN COMPOSITION
========================================================== */

.hero-main {

    position: absolute;

    /*
     * Accounts for the actual toolbar
     * visually living to the left.
     */

    left: 9.5%;

    top: 13%;

    width:
        min(
            61%,
            760px
        );

}


/* ==========================================================
   KICKER
========================================================== */

.hero-kicker {

    font-size:
        clamp(
            10px,
            .82cqw,
            13px
        );

    line-height: 1.85;

    font-weight: 500;

    letter-spacing: .13em;

}


.hero-kicker span {

    color:
        var(--accent);

    font-weight: 600;

}


.kicker-rule {

    width: 31px;

    height: 2px;

    margin-top: 7px;

    background:
        var(--accent);

}


/* ==========================================================
   HEADLINE
========================================================== */

.hero-heading {

    pointer-events: none;

    margin-top:
        clamp(
            26px,
            3.1cqw,
            40px
        );

}


.heading-word {

    font-family:
        "Chakra Petch",
        sans-serif;

    color:
        var(--text-primary);

    font-size:
        clamp(
            54px,
            6.2cqw,
            86px
        );

    line-height: .94;

    font-weight: 500;

    letter-spacing: .10em;

    white-space: nowrap;

}


.heading-second-row {

    margin-top:
        clamp(
            13px,
            1.55cqw,
            20px
        );

    display: flex;

    align-items: center;

    gap:
        clamp(
            20px,
            2.25cqw,
            31px
        );

}


.hero-arrow {

    pointer-events: auto;

    cursor: pointer;

    width:
        clamp(
            63px,
            6.9cqw,
            92px
        );

    flex-shrink: 0;

    transition:
        transform
        280ms
        cubic-bezier(.2,.8,.2,1);

}


.hero-heading:hover
.hero-arrow {

    transform:
        translateX(8px);

}


/* ==========================================================
   IDENTITY
========================================================== */

.hero-identity {

    margin-top:
        clamp(
            30px,
            3.05cqw,
            40px
        );

    display: flex;

    align-items: center;

    font-size:
        clamp(
            9px,
            .88cqw,
            12px
        );

    line-height: 1;

    font-weight: 600;

    letter-spacing: .075em;

}


.terminal-prompt {

    margin-right: 8px;

    color:
        var(--accent);

}


.terminal-cursor {

    width: 7px;

    height: 12px;

    margin-left: 7px;

    background:
        var(--cursor-color);

    animation:
        cursorBlink
        1.1s
        steps(1)
        infinite;

}


@keyframes cursorBlink {

    0%,
    48% {
        opacity: 1;
    }

    49%,
    100% {
        opacity: 0;
    }

}


/* ==========================================================
   DESCRIPTION
========================================================== */

.hero-description {

    margin-top:
        clamp(
            22px,
            2.15cqw,
            28px
        );

    display: flex;

    gap: 15px;

}


.description-ticks {

    width: 4px;

    flex-shrink: 0;

    padding-top: 4px;

    display: flex;

    flex-direction: column;

    gap: 5px;

}


.description-ticks i {

    width: 2px;

    height: 2px;

    background:
        var(--tick-color);

}


.hero-description p {

    margin: 0;

    max-width: 530px;

    color:
        var(--text-secondary);

    font-size:
        clamp(
            10.8px,
            .96cqw,
            14px
        );

    line-height: 1.76;

    font-weight: 400;

    letter-spacing: .017em;

}


.hero-description strong {

    font-weight: 700;

}


/* ==========================================================
   CTA ROW
========================================================== */

.hero-actions {

    pointer-events: auto;

    margin-top:
        clamp(
            27px,
            2.9cqw,
            37px
        );

    display: flex;

    align-items: center;

    gap:
        clamp(
            22px,
            2.2cqw,
            29px
        );

}


/* ==========================================================
   EXPLORE WORK
========================================================== */

.explore-button {

    appearance: none;

    -webkit-appearance: none;

    width:
        clamp(
            205px,
            19cqw,
            240px
        );

    height:
        clamp(
            44px,
            4.05cqw,
            50px
        );

    margin: 0;

    padding: 0;

    display: grid;

    grid-template-columns:
        1fr
        clamp(
            39px,
            3.6cqw,
            45px
        );

    border:
        1px solid
        var(--btn-border);

    border-radius: 0;

    background:
        var(--btn-bg);

    color:
        var(--btn-text);

    cursor: pointer;

    font-family:
        "IBM Plex Mono",
        monospace;

    font-size:
        clamp(
            8.5px,
            .75cqw,
            10.2px
        );

    line-height: 1;

    font-weight: 600;

    letter-spacing: .09em;

    transition:
        background
        150ms ease,
        border-color
        150ms ease,
        color
        150ms ease,
        box-shadow
        150ms ease;

}


.explore-label {

    display: flex;

    align-items: center;

    padding-left:
        clamp(
            15px,
            1.5cqw,
            18px
        );

}


.explore-arrow-cell {

    display: grid;

    place-items: center;

    border-left:
        1px solid
        var(--btn-cell-border);

}


.explore-button:hover {

    background:
        var(--accent);

    border-color:
        var(--accent);

    color:
        #FFFFFF;

    box-shadow:
        0 7px 22px
        rgba(36,91,255,.25);

}


.explore-arrow {

    transition:
        transform
        190ms
        cubic-bezier(.2,.8,.2,1);

}


.explore-button:hover
.explore-arrow {

    transform:
        translateX(3px);

}


.explore-button:focus-visible {

    outline:
        2px solid
        var(--accent);

    outline-offset: 4px;

}


/* ==========================================================
   RESUME
========================================================== */

.resume-action {

    position: relative;

    height: 38px;

    display: inline-flex;

    align-items: center;

    gap: 9px;

    color:
        var(--text-primary);

    text-decoration: none;

    font-size:
        clamp(
            8.5px,
            .75cqw,
            10px
        );

    line-height: 1;

    font-weight: 600;

    letter-spacing: .09em;

    transition:
        color
        150ms ease;

}


.resume-action:hover {

    color:
        var(--accent);

}


.resume-action::after {

    content: "";

    position: absolute;

    left: 0;

    bottom: 3px;

    width: 100%;

    height: 1px;

    background:
        var(--border-color);

    transform:
        scaleX(.34);

    transform-origin:
        left center;

    transition:
        transform
        200ms
        cubic-bezier(.2,.8,.2,1),
        background
        150ms ease;

}


.resume-action:hover::after {

    transform:
        scaleX(1);

    background:
        var(--accent);

}


.resume-arrow {

    transition:
        transform
        180ms
        cubic-bezier(.2,.8,.2,1);

}


.resume-action:hover
.resume-arrow {

    transform:
        translate(2px,-2px);

}


.resume-action:focus-visible {

    outline:
        2px solid
        var(--accent);

    outline-offset: 4px;

}


/* ==========================================================
   PROOF RAIL

   Redesigned as a proper technical information rail.
========================================================== */

.proof-rail {

    margin-top:
        clamp(
            43px,
            4.25cqw,
            55px
        );

    width: 100%;

    min-height:
        clamp(
            74px,
            6.7cqw,
            84px
        );

    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0,1fr)
        );

    border-top:
        1px solid
        var(--border-color);

    border-bottom:
        1px solid
        var(--border-color);

}


.proof-item {

    position: relative;

    min-width: 0;

    display: grid;

    grid-template-columns:
        22px
        clamp(
            42px,
            4.2cqw,
            55px
        )
        1fr;

    align-items: center;

    column-gap:
        clamp(
            7px,
            .8cqw,
            11px
        );

    padding:
        0
        clamp(
            12px,
            1.35cqw,
            18px
        );

}


.proof-item:first-child {

    padding-left: 0;

}


.proof-item +
.proof-item::before {

    content: "";

    position: absolute;

    left: 0;

    top: 23%;

    width: 1px;

    height: 54%;

    background:
        var(--rail-divider);

}


.proof-index {

    align-self: flex-start;

    margin-top:
        clamp(
            16px,
            1.45cqw,
            20px
        );

    font-size:
        clamp(
            5.8px,
            .48cqw,
            7px
        );

    line-height: 1;

    font-weight: 500;

    color:
        var(--text-muted);

    letter-spacing: .08em;

}


.proof-number {

    font-family:
        "Chakra Petch",
        sans-serif;

    color:
        var(--text-primary);

    font-size:
        clamp(
            27px,
            3cqw,
            38px
        );

    line-height: 1;

    font-weight: 600;

    letter-spacing: -.035em;

}


.proof-copy {

    display: flex;

    flex-direction: column;

    gap: 5px;

}


.proof-copy span {

    color:
        var(--text-primary);

    font-size:
        clamp(
            6.6px,
            .59cqw,
            8px
        );

    line-height: 1.1;

    font-weight: 600;

    letter-spacing: .09em;

    white-space: nowrap;

}


.proof-copy small {

    font-size:
        clamp(
            6px,
            .53cqw,
            7.4px
        );

    line-height: 1;

    font-weight: 500;

    letter-spacing: .09em;

    color:
        var(--text-muted);

}


/* ==========================================================
   QUIET DOMAIN METADATA

   Replaces the previous FOCUS widget.

   This is intentionally NOT a box.
========================================================== */

.hero-domains {

    position: absolute;

    left: 69%;

    top: 46%;

    width:
        clamp(
            130px,
            11cqw,
            160px
        );

    display: flex;

    align-items: flex-start;

    gap: 11px;

}


.domains-line {

    width: 18px;

    height: 1px;

    margin-top: 4px;

    flex-shrink: 0;

    background:
        var(--accent);

}


.hero-domains > div {

    display: flex;

    flex-direction: column;

    gap: 9px;

}


.hero-domains > div span {

    font-size:
        clamp(
            6.5px,
            .57cqw,
            8px
        );

    line-height: 1;

    font-weight: 500;

    letter-spacing: .11em;

    color:
        var(--text-secondary);

}


/* ==========================================================
   TABLET
========================================================== */

@container (max-width: 950px) {

    .hero-main {

        left: 7%;

        width: 72%;

    }


    .hero-domains {

        right: 5%;

        left: auto;

    }


    .heading-word {

        font-size:
            clamp(
                49px,
                7.7cqw,
                72px
            );

    }

}


/* ==========================================================
   SMALL TABLET
========================================================== */

@container (max-width: 780px) {

    .hero-main {

        width: 86%;

    }


    .hero-domains {

        display: none;

    }


    .hero-description p {

        font-size:
            clamp(
                11.5px,
                1.55cqw,
                14px
            );

    }

}


/* ==========================================================
   MOBILE
========================================================== */

@container (max-width: 600px) {

    .hero-shell {

        min-height: 620px;

    }


    .hero-main {

        left: 24px;

        top: 50px;

        width:
            calc(
                100% - 48px
            );

    }


    .hero-kicker {

        font-size: 9px;

    }


    .hero-heading {

        margin-top: 22px;

    }


    .heading-word {

        font-size:
            clamp(
                38px,
                11cqw,
                56px
            );

        letter-spacing: .055em;

    }


    .heading-second-row {

        margin-top: 11px;

        gap: 12px;

    }


    .hero-arrow {

        width: 47px;

    }


    .hero-identity {

        margin-top: 25px;

        font-size: 9px;

    }


    .hero-description {

        margin-top: 18px;

    }


    .hero-description p {

        font-size: 11.5px;

        line-height: 1.65;

    }


    .desktop-copy-break {

        display: none;

    }


    .hero-actions {

        margin-top: 24px;

        gap: 18px;

    }


    .explore-button {

        width: 185px;

        height: 44px;

        grid-template-columns:
            1fr
            38px;

        font-size: 8px;

    }


    .resume-action {

        font-size: 8px;

    }


    .proof-rail {

        margin-top: 31px;

        min-height: 74px;

    }


    .proof-item {

        grid-template-columns:
            1fr;

        gap: 0;

        align-content: center;

        padding:
            0 10px;

    }


    .proof-item:first-child {

        padding-left: 0;

    }


    .proof-index {

        display: none;

    }


    .proof-number {

        font-size: 24px;

    }


    .proof-copy {

        margin-top: 5px;

        gap: 3px;

    }


    .proof-copy span {

        font-size: 5.8px;

    }


    .proof-copy small {

        font-size: 5.5px;

    }

}


/* ==========================================================
   SMALL MOBILE
========================================================== */

@container (max-width: 420px) {

    .heading-word {

        font-size:
            clamp(
                33px,
                10.6cqw,
                42px
            );

    }


    .hero-arrow {

        width: 38px;

    }


    .hero-actions {

        width: 100%;

        flex-wrap: wrap;

    }


    .explore-button {

        width: 100%;

    }


    .resume-action {

        margin-top: 1px;

    }


    .proof-rail {

        grid-template-columns: 1fr;

        min-height: auto;

    }


    .proof-item {

        min-height: 55px;

        display: grid;

        grid-template-columns:
            42px
            1fr;

        align-items: center;

    }


    .proof-item +
    .proof-item::before {

        top: 0;

        width: 100%;

        height: 1px;

    }


    .proof-copy {

        margin-top: 0;

    }

}


/* ==========================================================
   ACCESSIBILITY
========================================================== */

@media (
    prefers-reduced-motion: reduce
) {

    .terminal-cursor {

        animation: none;

    }


    .hero-arrow,
    .explore-arrow,
    .resume-arrow {

        transition: none;

    }

}
`
// --- Firebase Setup ---
const firebaseConfig = {
    apiKey: "AIzaSyDMZx3TAIuSzt1ryow7dy4Oq4CKTiux7vo",
    authDomain: "pixel-engine-stats.firebaseapp.com",
    databaseURL: "https://pixel-engine-stats-default-rtdb.firebaseio.com",
    projectId: "pixel-engine-stats",
    storageBucket: "pixel-engine-stats.firebasestorage.app",
    messagingSenderId: "641539087267",
    appId: "1:641539087267:web:b5c568785e8bd659661816",
    measurementId: "G-SSYN3T4NLY",
}

let fbApp, fbDatabase, fbAnalytics
try {
    if (getApps().length === 0) {
        fbApp = initializeApp(firebaseConfig)
    } else {
        fbApp = getApp()
    }
    fbDatabase = getDatabase(fbApp)
    if (typeof window !== "undefined") {
        fbAnalytics = getAnalytics(fbApp)
    }
} catch (e) {
    console.error("Firebase init error", e)
}

// Ensure global math works
Math.clamp = function (min, val, max) {
    return Math.min(Math.max(val, min), max)
}

interface PixelArtCreatorProps {
    pixelSize: number
    backgroundColor: string
    gridColor: string
    drawColor: string
    showGrid: boolean
    toolbarZIndex: number
    alternatePattern: string
    alternateColor: string

    // Media Props
    mediaSourceType: "none" | "video" | "image"
    mediaFile: string
    playMedia: boolean
    loopMedia: boolean
    mediaFitMode: "cover" | "contain" | "custom"
    mediaScale: number
    mediaOffsetX: number
    mediaOffsetY: number
    mediaOpacity: number
    pixelateMedia: boolean

    // UI Layout & Engine Props
    uiTheme: "dark" | "light" | "glass-dark" | "glass-light"
    toolbarTheme: "dark" | "light"
    toolbarLayout:
        | "vertical"
        | "horizontal"
        | "box"
        | "horizontal-centered"
        | "vertical-centered"
    gridPerspective: "square" | "isometric"

    // Animation Maker
    enableHeroAnimation: boolean
    heroAnimationText: string
    heroAnimationSpeed: number
    toolbarPositionMode:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"

    showInfoPills: boolean
    topPillPosition:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "top-center"
    bottomPillPosition:
        | "bottom-center"
        | "top-center"
        | "bottom-left"
        | "bottom-right"

    minimalToolbar: boolean
    pixelStyle: "2d" | "3d"
    perspective3D: "top-right" | "top-left" | "bottom-right" | "bottom-left"
    dynamic3D: boolean
    dynamic3DSensitivity: number
    enableHoverTrail?: boolean
    lowPowerMode: boolean
    exportScale: number
    onStatsUpdate?: (stats: any) => void
    themeConfig?: any

    // Gamification & Ambient Modes
    enableGamification?: boolean
    enableAmbientSpawner?: boolean

    // Procedural Buddy Props
    showCompanion?: boolean
    hideCompanionOnMobile?: boolean
    buddyType:
        | "classic"
        | "cat"
        | "dog"
        | "robot"
        | "frog"
        | "ghost"
        | "cube"
        | "pill"
    companionMovementMode: "static" | "follow-cursor" | "wander" | "patrol"
    companionSize: number
    companionPositionMode: "absolute" | "relative" | "toolbar"
    companionRelativeX: number
    companionRelativeY: number
    companionPositionX: "left" | "center" | "right"
    companionPositionY: "top" | "center" | "bottom"
    companionOffsetX: number
    companionOffsetY: number
    companionColorPrimary: string
    companionColorAction: string
    companionColorEye: string

    // Tool Visibility Toggles
    showPencil: boolean
    showTypeTool: boolean
    showEraser: boolean
    showBucket: boolean
    showSymmetry: boolean
    showEyedropper: boolean
    showBrushSize: boolean
    showUndoRedo: boolean
    showClear: boolean
    showDownload: boolean
    showMediaControls: boolean
    showGridToggle: boolean

    style?: CSSProperties
}

const PALETTES = {
    classic: ["#000000", "#FFFFFF", "#FF3B30", "#007AFF"],
    cyberpunk: [
        "#0D0E15",
        "#FF0055",
        "#00FFCC",
        "#FFFF00",
        "#9900FF",
        "#FF9900",
    ],
    gameboy: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
    pastel: ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"],
}

const PALETTE_KEYS = Object.keys(PALETTES) as Array<keyof typeof PALETTES>

const THEMES: Record<string, any> = {
    dark: {
        bg: "#252525",
        border: "rgba(255,255,255,0.1)",
        text: "#F1E9DD",
        activeBg: "#F1E9DD",
        activeText: "#252525",
        subBg: "rgba(255, 255, 255, 0.05)",
        dangerBg: "rgba(255, 59, 48, 0.15)",
        dangerText: "#FF3B30",
        shadow: "0 12px 32px rgba(0,0,0,0.3)",
        backdrop: "none",
        pillBg: "rgba(37, 37, 37, 0.95)",
        pillText: "#F1E9DD",
        pillBorder: "rgba(255, 255, 255, 0.15)",
    },
    light: {
        bg: "#FFFFFF",
        border: "rgba(0,0,0,0.08)",
        text: "#1A1A1A",
        activeBg: "#1A1A1A",
        activeText: "#FFFFFF",
        subBg: "rgba(0, 0, 0, 0.04)",
        dangerBg: "rgba(255, 59, 48, 0.1)",
        dangerText: "#FF3B30",
        shadow: "0 12px 32px rgba(0,0,0,0.08)",
        backdrop: "none",
        pillBg: "rgba(255, 255, 255, 0.95)",
        pillText: "#1A1A1A",
        pillBorder: "rgba(0, 0, 0, 0.1)",
    },
    "glass-dark": {
        bg: "rgba(30, 30, 30, 0.4)",
        border: "rgba(255, 255, 255, 0.15)",
        text: "#F1E9DD",
        activeBg: "rgba(255, 255, 255, 0.9)",
        activeText: "#1A1A1A",
        subBg: "rgba(255, 255, 255, 0.1)",
        dangerBg: "rgba(255, 59, 48, 0.25)",
        dangerText: "#FF8A80",
        shadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
        backdrop: "blur(24px) saturate(150%)",
        pillBg: "rgba(30, 30, 30, 0.5)",
        pillText: "#F1E9DD",
        pillBorder: "rgba(255, 255, 255, 0.2)",
    },
    "glass-light": {
        bg: "rgba(255, 255, 255, 0.35)",
        border: "rgba(255, 255, 255, 0.6)",
        text: "#1A1A1A",
        activeBg: "rgba(0, 0, 0, 0.8)",
        activeText: "#FFFFFF",
        subBg: "rgba(255, 255, 255, 0.5)",
        dangerBg: "rgba(255, 59, 48, 0.2)",
        dangerText: "#D32F2F",
        shadow: "0 16px 40px rgba(31, 38, 135, 0.1)",
        backdrop: "blur(24px) saturate(150%)",
        pillBg: "rgba(255, 255, 255, 0.45)",
        pillText: "#1A1A1A",
        pillBorder: "rgba(255, 255, 255, 0.7)",
    },
}

const PIXEL_FONT: Record<string, string[]> = {
    A: ["010", "101", "111", "101", "101"],
    B: ["110", "101", "110", "101", "110"],
    C: ["011", "100", "100", "100", "011"],
    D: ["110", "101", "101", "101", "110"],
    E: ["111", "100", "110", "100", "111"],
    F: ["111", "100", "110", "100", "100"],
    G: ["011", "100", "101", "101", "011"],
    H: ["101", "101", "111", "101", "101"],
    I: ["111", "010", "010", "010", "111"],
    J: ["001", "001", "001", "101", "010"],
    K: ["101", "110", "100", "110", "101"],
    L: ["100", "100", "100", "100", "111"],
    M: ["10001", "11011", "10101", "10001", "10001"],
    N: ["1001", "1101", "1011", "1001", "1001"],
    O: ["010", "101", "101", "101", "010"],
    P: ["110", "101", "110", "100", "100"],
    Q: ["010", "101", "101", "011", "001"],
    R: ["110", "101", "110", "101", "101"],
    S: ["011", "100", "010", "001", "110"],
    T: ["111", "010", "010", "010", "010"],
    U: ["101", "101", "101", "101", "011"],
    V: ["101", "101", "101", "101", "010"],
    W: ["10001", "10001", "10101", "11011", "10001"],
    X: ["101", "101", "010", "101", "101"],
    Y: ["101", "101", "010", "010", "010"],
    Z: ["111", "001", "010", "100", "111"],
    " ": ["00", "00", "00", "00", "00"],
    "0": ["010", "101", "101", "101", "010"],
    "1": ["010", "110", "010", "010", "111"],
    "2": ["110", "001", "010", "100", "111"],
    "3": ["110", "001", "110", "001", "110"],
    "4": ["101", "101", "111", "001", "001"],
    "5": ["111", "100", "110", "001", "110"],
    "6": ["011", "100", "110", "101", "010"],
    "7": ["111", "001", "001", "010", "010"],
    "8": ["010", "101", "010", "101", "010"],
    "9": ["010", "101", "011", "001", "110"],
    ".": ["0", "0", "0", "0", "1"],
    ",": ["0", "0", "0", "0", "1"],
    "!": ["1", "1", "1", "0", "1"],
    "?": ["110", "001", "010", "000", "010"],
    "-": ["000", "000", "111", "000", "000"],
    _: ["000", "000", "000", "000", "111"],
    "+": ["000", "010", "111", "010", "000"],
    "=": ["000", "111", "000", "111", "000"],
    "/": ["001", "001", "010", "100", "100"],
    "\\": ["100", "100", "010", "001", "001"],
    ":": ["0", "1", "0", "1", "0"],
    ";": ["0", "1", "0", "1", "1"],
    "(": ["01", "10", "10", "10", "01"],
    ")": ["10", "01", "01", "01", "10"],
    "[": ["11", "10", "10", "10", "11"],
    "]": ["11", "01", "01", "01", "11"],
    "{": ["01", "10", "01", "10", "01"],
    "}": ["10", "01", "10", "01", "10"],
    "<": ["001", "010", "100", "010", "001"],
    ">": ["100", "010", "001", "010", "100"],
    '"': ["101", "101", "000", "000", "000"],
    "'": ["1", "1", "0", "0", "0"],
    "@": ["0110", "1001", "1011", "1000", "0111"],
    "#": ["0101", "1111", "0101", "1111", "0101"],
    $: ["010", "110", "010", "011", "010"],
    "%": ["101", "001", "010", "100", "101"],
    "&": ["010", "101", "010", "101", "011"],
    "*": ["000", "101", "010", "101", "000"],
    "^": ["010", "101", "000", "000", "000"],
    "~": ["000", "101", "010", "000", "000"],
    "`": ["10", "01", "00", "00", "00"],
}

function PixelArtCreator({
    pixelSize = 20,
    backgroundColor = "#1A1A1A",
    gridColor = "rgba(255,255,255,0.05)",
    drawColor = "#FF3366",
    showGrid = true,
    toolbarZIndex = 1000,
    alternatePattern = "none",
    alternateColor = "rgba(255,255,255,0.02)",
    mediaSourceType = "none",
    mediaFile = "",
    playMedia = true,
    loopMedia = true,
    mediaFitMode = "cover",
    mediaScale = 1.0,
    mediaOffsetX = 0,
    mediaOffsetY = 0,
    mediaOpacity = 1.0,
    pixelateMedia = true,
    uiTheme = "dark",
    toolbarTheme = "dark",
    themeConfig,
    toolbarLayout = "vertical",
    gridPerspective = "square",
    enableHeroAnimation = false,
    heroAnimationText = "HELLO",
    heroAnimationSpeed = 5,
    showUndoRedo = true,
    toolbarPositionMode = "top-right",
    showInfoPills = true,
    topPillPosition = "top-left",
    bottomPillPosition = "bottom-center",
    minimalToolbar = false,
    pixelStyle = "2d",
    perspective3D = "top-right",
    dynamic3D = false,
    dynamic3DSensitivity = 10,
    enableHoverTrail = false,
    lowPowerMode = false,
    exportScale = 4,
    enableGamification = true,
    enableAmbientSpawner = false,
    showCompanion = false,
    hideCompanionOnMobile = false,
    buddyType = "classic",
    companionMovementMode = "static",
    companionSize = 64,
    companionPositionMode = "relative",
    companionRelativeX = 100,
    companionRelativeY = 100,
    companionPositionX = "right",
    companionPositionY = "bottom",
    companionOffsetX = 2,
    companionOffsetY = 2,
    companionColorPrimary = "#007AFF",
    companionColorAction = "#FF3B30",
    companionColorEye = "#00FFCC",
    showPencil = true,
    showTypeTool = true,
    showEraser = true,
    showBucket = true,
    showSymmetry = true,
    showEyedropper = true,
    showBrushSize = true,
    showClear = true,
    showDownload = true,
    showMediaControls = true,
    showPalette = true,
    showGridToggle = true,
    style,
    onStatsUpdate,
}: PixelArtCreatorProps) {
    // Firebase Global Community Tracking
    const [globalStats, setGlobalStats] = useState({
        totalPixelsPopped: 0,
        totalPixelsDrawn: 0,
        totalNotesPlayed: 0,
    })
    const unsentFirebaseStatsRef = useRef({ popped: 0, drawn: 0, notes: 0 })

    // Session tracking for GA
    const sessionStatsRef = useRef({
        startTime: Date.now(),
        toolsUsed: new Set(),
        pixelsDrawn: 0,
        pixelsPopped: 0,
        notesPlayed: 0,
    })

    useEffect(() => {
        if (!fbDatabase) return
        const statsRef = fbRef(fbDatabase, "stats")
        const unsubscribe = onValue(statsRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                setGlobalStats({
                    totalPixelsPopped: data.totalPixelsPopped || 0,
                    totalPixelsDrawn: data.totalPixelsDrawn || 0,
                    totalNotesPlayed: data.totalNotesPlayed || 0,
                })
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!fbDatabase) return
        const interval = setInterval(() => {
            const { popped, drawn, notes } = unsentFirebaseStatsRef.current
            if (popped > 0 || drawn > 0 || notes > 0) {
                // Reset local queue
                unsentFirebaseStatsRef.current = {
                    popped: 0,
                    drawn: 0,
                    notes: 0,
                }

                // Clamp limits to prevent Firebase Security Rule permission_denied
                const poppedInc = Math.min(popped, 1000)
                const drawnInc = Math.min(drawn, 1000)
                const notesInc = Math.min(notes, 500)

                if (poppedInc > 0) {
                    runTransaction(
                        fbRef(fbDatabase, "stats/totalPixelsPopped"),
                        (currentData) => {
                            return (currentData || 0) + poppedInc
                        }
                    ).catch(console.warn)
                }
                if (drawnInc > 0) {
                    runTransaction(
                        fbRef(fbDatabase, "stats/totalPixelsDrawn"),
                        (currentData) => {
                            return (currentData || 0) + drawnInc
                        }
                    ).catch(console.warn)
                }
                if (notesInc > 0) {
                    runTransaction(
                        fbRef(fbDatabase, "stats/totalNotesPlayed"),
                        (currentData) => {
                            return (currentData || 0) + notesInc
                        }
                    ).catch(console.warn)
                }
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleUnload = () => {
            const durationSec = Math.floor(
                (Date.now() - sessionStatsRef.current.startTime) / 1000
            )
            trackEngineEvent(
                "engine_session_summary",
                {
                    duration_sec: durationSec,
                    tools_used_count: sessionStatsRef.current.toolsUsed.size,
                    pixels_drawn: sessionStatsRef.current.pixelsDrawn,
                    pixels_popped: sessionStatsRef.current.pixelsPopped,
                    notes_played: sessionStatsRef.current.notesPlayed,
                },
                0
            )
        }
        window.addEventListener("beforeunload", handleUnload)
        return () => window.removeEventListener("beforeunload", handleUnload)
    }, [])

    // GAMIFICATION AND ENGAGEMENT TRACKING (DEBOUNCED)
    const engineEventTimers = useRef(new Map())

    const trackEngineEvent = useCallback(
        (eventName, eventParams = {}, debounceMs = 0) => {
            try {
                if (typeof window !== "undefined") {
                    if (debounceMs > 0) {
                        const lastFireTime =
                            engineEventTimers.current.get(eventName) || 0
                        const now = Date.now()
                        if (now - lastFireTime < debounceMs) return // Skip if too soon
                        engineEventTimers.current.set(eventName, now)
                    }

                    // Debug log so you can see it working locally even if adblockers block GA
                    console.log(
                        "[Pixel Engine Tracker]",
                        eventName,
                        eventParams
                    )

                    // Track via Firebase Analytics module directly
                    if (typeof fbAnalytics !== "undefined" && fbAnalytics) {
                        try {
                            logEvent(fbAnalytics, eventName, {
                                ...eventParams,
                                event_category: "pixel_engine_interaction",
                            })
                        } catch (e) {}
                    }

                    // Try gtag first (standard GA4)
                    if (typeof window.gtag === "function") {
                        window.gtag("event", eventName, {
                            ...eventParams,
                            event_category: "pixel_engine_interaction",
                        })
                    }
                    // Fallback to dataLayer if GTM is used instead
                    else if (
                        window.dataLayer &&
                        typeof window.dataLayer.push === "function"
                    ) {
                        window.dataLayer.push({
                            event: eventName,
                            event_category: "pixel_engine_interaction",
                            ...eventParams,
                        })
                    }
                }
            } catch (e) {
                console.warn("GA tracking failed", e)
            }
        },
        []
    )

    const t = THEMES[uiTheme] || THEMES.dark

    const [selectedPixelSize, setSelectedPixelSize] = useState(pixelSize)
    const [containerDimensions, setContainerDimensions] = useState(() => {
        if (typeof window !== "undefined") {
            return {
                width: window.innerWidth || 1200,
                height: window.innerHeight || 800,
            }
        }
        return { width: 1200, height: 800 }
    })
    const [gridSize, setGridSize] = useState(() => {
        const w = typeof window !== "undefined" ? window.innerWidth || 1200 : 1200
        const h = typeof window !== "undefined" ? window.innerHeight || 800 : 800
        return {
            cols: Math.ceil(w / pixelSize) + 2,
            rows: Math.ceil(h / pixelSize) + 2,
        }
    })

    const [isMobile, setIsMobile] = useState(false)

    // Clear, clean canvas upon startup (zero pre-drawn voxels)
    const pixelsRef = useRef<Map<string, string>>(new Map())
    const isDrawingRef = useRef(false)
    const lastFillPosRef = useRef<string | null>(null)

    // Gamification & Physics State
    const scoreRef = useRef(0)
    const comboCountRef = useRef(0)
    const comboMultiplierRef = useRef(1)
    const lastPopTimeRef = useRef(0)
    const melodyIndexRef = useRef(0)
    const lastNoteDurationRef = useRef(1)
    const buddyHypeRef = useRef(0)
    const collectiblesRef = useRef<Map<string, any>>(new Map())
    const particlesRef = useRef<any[]>([])
    const gravityPixelsRef = useRef<any[]>([])
    const gravityModeRef = useRef(false)
    const lastInteractionTimeRef = useRef<number>(Date.now())
    const buddyMessageRef = useRef<string | null>(null)
    const buddyMessageExpiryRef = useRef<number>(0)
    const setBuddyMessage = (msg, durationMs = 2000) => {
        buddyMessageRef.current = msg
        buddyMessageExpiryRef.current = performance.now() + durationMs
    }
    const buddyChatOverlayRef = useRef<HTMLDivElement>(null)
    const buddyXpOverlayRef = useRef<HTMLDivElement>(null)
    const buddyStatsOverlayRef = useRef<HTMLDivElement>(null)
    const projectsExploredRef = useRef<number>(0)

    const notifyStats = useCallback(() => {
        const activePx = pixelsRef.current ? pixelsRef.current.size : 0
        const currentXp = Math.max(scoreRef.current || 0, activePx)
        const lvl = Math.floor(currentXp / 200) + 1
        const titles = [
            "Canvas Visitor",
            "Grid Explorer",
            "Active Builder",
            "Pixel Architect",
            "System Master",
        ]
        const title = titles[Math.min(lvl - 1, titles.length - 1)]
        const s = {
            totalPixelsDrawn:
                (globalStats.totalPixelsDrawn || 0) +
                (sessionStatsRef.current.pixelsDrawn || 0),
            totalPixelsPopped:
                (globalStats.totalPixelsPopped || 0) +
                (sessionStatsRef.current.pixelsPopped || 0),
            totalNotesPlayed:
                (globalStats.totalNotesPlayed || 0) +
                (sessionStatsRef.current.notesPlayed || 0),
            activePixels: activePx,
            sessionDrawn: sessionStatsRef.current.pixelsDrawn || 0,
            sessionPopped: sessionStatsRef.current.pixelsPopped || 0,
            xp: currentXp,
            level: lvl,
            title,
        }
        onStatsUpdate?.(s)
        if (typeof window !== "undefined") {
            window.dispatchEvent(
                new CustomEvent("pixel_engine_stats_update", { detail: s })
            )
        }
    }, [globalStats, onStatsUpdate])

    useEffect(() => {
        notifyStats()
    }, [globalStats, notifyStats])

    const [internalPerspective, setInternalPerspective] =
        useState(gridPerspective)
    const [internalGrid, setInternalGrid] = useState(showGrid)

    useEffect(() => {
        setInternalGrid(showGrid)
    }, [showGrid])

    // Clear absolute-positioned particles when perspective changes to prevent glitchy visuals
    useEffect(() => {
        particlesRef.current = []
        trailParticlesRef.current = []
    }, [perspective3D])
    const perspectiveProgressRef = useRef(
        gridPerspective === "isometric" ? 1 : 0
    )

    const canvasTotalWidth = Math.max(
        containerDimensions.width ||
            (typeof window !== "undefined" ? window.innerWidth : 1200),
        (gridSize.cols + 1) * selectedPixelSize
    )
    const canvasTotalHeight = Math.max(
        containerDimensions.height ||
            (typeof window !== "undefined" ? window.innerHeight : 800),
        (gridSize.rows + 1) * selectedPixelSize
    )

    useEffect(() => {
        setInternalPerspective(gridPerspective)
    }, [gridPerspective])

    // Gamification Loop (Spawns yellow / gold / neon collectibles)
    useEffect(() => {
        if (!enableGamification) {
            collectiblesRef.current.clear()
            return
        }

        const trySpawnCollectible = () => {
            if (collectiblesRef.current.size >= 3 || scrollProgressRef.current) return
            let r = 0,
                c = 0,
                key = ""
            let valid = false
            for (let i = 0; i < 50; i++) {
                r = Math.floor(Math.random() * gridSize.rows)
                c = Math.floor(Math.random() * gridSize.cols)
                if (artworkCanvasRef.current) {
                    const { x, y } = projectToScreen(
                        c,
                        r,
                        internalPerspective,
                        selectedPixelSize
                    )
                    if (
                        x > 0 &&
                        y > 0 &&
                        x < canvasTotalWidth &&
                        y < canvasTotalHeight
                    ) {
                        key = `${r}_${c}`
                        valid = true
                        break
                    }
                }
            }
            if (!valid) return
            if (
                !pixelsRef.current.has(key) &&
                !collectiblesRef.current.has(key)
            ) {
                const sizeMult = Math.floor(Math.random() * 4) + 1
                let type = "gold"
                if (scoreRef.current >= 30 && Math.random() > 0.8)
                    type = "rainbow"
                else if (scoreRef.current >= 10 && Math.random() > 0.7)
                    type = "neon"
                collectiblesRef.current.set(key, {
                    createdAt: Date.now(),
                    sizeMult,
                    type,
                })
            }
        }

        // Spawn initial collectible quickly on mount so yellow boxes appear immediately
        const initTimer = setTimeout(trySpawnCollectible, 120)

        const interval = setInterval(() => {
            if (
                showCompanion &&
                Date.now() - lastInteractionTimeRef.current > 10000 &&
                !scrollProgressRef.current
            ) {
                const idleMessages = [
                    "Click and drag to draw.",
                    "Waiting for input...",
                    "Try drawing on the grid.",
                    "Canvas is ready.",
                ]
                if (Math.random() > 0.5) {
                    setBuddyMessage(
                        idleMessages[
                            Math.floor(Math.random() * idleMessages.length)
                        ],
                        2000
                    )
                }
            }
            trySpawnCollectible()
        }, 2000)

        return () => {
            clearTimeout(initTimer)
            clearInterval(interval)
        }
    }, [gridSize, enableGamification, showCompanion])

    const audioCtxRef = useRef<any>(null)
    const audioBuffersRef = useRef<any>({})
    const initAudio = () => {
        try {
            if (!audioCtxRef.current) {
                const AudioContext =
                    window.AudioContext || (window as any).webkitAudioContext
                if (!AudioContext) return
                const ctx = new AudioContext({ latencyHint: "interactive" })
                audioCtxRef.current = ctx
            }
            if (
                audioCtxRef.current &&
                audioCtxRef.current.state === "suspended"
            ) {
                audioCtxRef.current.resume()
            }
        } catch (e) {}
    }

    const playPopSound = (freq = 600) => {
        if (window._pixelEngineMuted) return
        try {
            if (!audioCtxRef.current) initAudio()
            const ctx = audioCtxRef.current
            if (!ctx) return

            const triggerSynth = () => {
                try {
                    const now = ctx.currentTime + 0.01 // Schedule slightly in future to prevent dropped frames
                    const osc = ctx.createOscillator()
                    const gain = ctx.createGain()

                    osc.type = "sine"
                    osc.frequency.setValueAtTime(freq, now)
                    osc.frequency.exponentialRampToValueAtTime(
                        freq * 2,
                        now + 0.08
                    )

                    gain.gain.setValueAtTime(0, now)
                    gain.gain.linearRampToValueAtTime(0.04, now + 0.01) // Heavily reduced to allow 50+ simultaneous pops without clipping
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

                    osc.connect(gain)
                    gain.connect(ctx.destination)

                    osc.start(now)
                    osc.stop(now + 0.08)
                } catch (err) {}
            }

            if (ctx.state === "suspended") {
                if (!audioCtxRef.current._resuming) {
                    audioCtxRef.current._resuming = true
                    ctx.resume()
                        .then(() => {
                            audioCtxRef.current._resuming = false
                            triggerSynth()
                        })
                        .catch(() => {
                            audioCtxRef.current._resuming = false
                        })
                }
            } else {
                triggerSynth()
            }
        } catch (e) {}
    }

    const playShatterBloom = () => {
        if (window._pixelEngineMuted) return
        try {
            if (!audioCtxRef.current) initAudio()
            const ctx = audioCtxRef.current
            if (!ctx) return

            const triggerBloom = () => {
                try {
                    const now = ctx.currentTime
                    // A soulful, ethereal, blooming chord (ASMR-like Pentatonic/Maj9)
                    const freqs = [130.81, 196.0, 261.63, 329.63, 392.0, 493.88]

                    freqs.forEach((freq, i) => {
                        const osc = ctx.createOscillator()
                        const gain = ctx.createGain()
                        const filter = ctx.createBiquadFilter()

                        osc.type = i < 2 ? "sine" : "triangle"
                        osc.frequency.setValueAtTime(
                            freq + (Math.random() * 1 - 0.5),
                            now
                        )

                        filter.type = "lowpass"
                        filter.frequency.setValueAtTime(400, now)
                        filter.frequency.exponentialRampToValueAtTime(
                            1200,
                            now + 0.5
                        )
                        filter.frequency.exponentialRampToValueAtTime(
                            300,
                            now + 2.5
                        )

                        gain.gain.setValueAtTime(0, now)
                        gain.gain.linearRampToValueAtTime(
                            0.02,
                            now + 1.0 + i * 0.2
                        )
                        gain.gain.exponentialRampToValueAtTime(
                            0.0001,
                            now + 3.0
                        )

                        osc.connect(filter)
                        filter.connect(gain)
                        gain.connect(ctx.destination)

                        osc.start(now)
                        osc.stop(now + 3.0)
                    })
                } catch (err) {}
            }

            if (ctx.state === "suspended") {
                ctx.resume()
                    .then(triggerBloom)
                    .catch(() => {})
            } else {
                triggerBloom()
            }
        } catch (e) {}
    }

    const playCinematicPhysics = (progress, velocity, isAssembling) => {
        if (window._pixelEngineMuted) return
        try {
            const ctx = audioCtxRef.current
            if (!ctx || ctx.state === "suspended") return

            const now = ctx.currentTime

            // Beethoven - Für Elise (Most widely known classical piece)
            // Encodes frequency (f) and relative intonation/duration (d)
            const CLASSICAL_PIECE = [
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 440,
                    d: 3,
                },
                {
                    f: 261.63,
                    d: 1,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 440,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 415.3,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 440,
                    d: 3,
                },
                {
                    f: 261.63,
                    d: 1,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 440,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 440,
                    d: 6,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 3,
                },
                {
                    f: 392,
                    d: 1,
                },
                {
                    f: 698.46,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 3,
                },
                {
                    f: 349.23,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 440,
                    d: 3,
                },
                {
                    f: 261.63,
                    d: 1,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 440,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 415.3,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 622.25,
                    d: 1,
                },
                {
                    f: 659.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 587.33,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 440,
                    d: 3,
                },
                {
                    f: 261.63,
                    d: 1,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 440,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 3,
                },
                {
                    f: 329.63,
                    d: 1,
                },
                {
                    f: 523.25,
                    d: 1,
                },
                {
                    f: 493.88,
                    d: 1,
                },
                {
                    f: 440,
                    d: 6,
                },
            ]

            // "Music Box" sequence: strictly linear playback on any scroll movement
            melodyIndexRef.current++
            if (melodyIndexRef.current >= CLASSICAL_PIECE.length)
                melodyIndexRef.current = 0

            const note = CLASSICAL_PIECE[melodyIndexRef.current]
            const freq = note.f
            const durationMult = note.d

            // Cinematic Grand Piano / Synth hybrid
            const osc = ctx.createOscillator()
            const sub = ctx.createOscillator()
            const gain = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            osc.type = "triangle" // Softer than sawtooth, like a mellow piano
            osc.frequency.setValueAtTime(freq, now)

            sub.type = "sine"
            sub.frequency.setValueAtTime(freq / 2, now) // 1 octave down for massive weight

            // Warm lowpass filter
            filter.type = "lowpass"
            filter.Q.value = 1.0 // Softer resonance
            filter.frequency.setValueAtTime(freq * 1.1, now)
            filter.frequency.exponentialRampToValueAtTime(freq * 2.0, now + 0.1) // Mellow attack
            filter.frequency.exponentialRampToValueAtTime(freq * 1.1, now + 1.0)

            const vol = Math.min(0.025, velocity * 0.002) + 0.005 // Considerably softer background volume;

            // Intonation: Decay tail is multiplied by note duration! (Extended for graceful overlap)
            const tail = 1.4 * durationMult

            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(vol, now + 0.05)
            gain.gain.exponentialRampToValueAtTime(0.0001, now + tail)

            osc.connect(filter)
            sub.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            sub.start(now)
            osc.stop(now + tail)
            sub.stop(now + tail)

            if (unsentFirebaseStatsRef && unsentFirebaseStatsRef.current) {
                unsentFirebaseStatsRef.current.notes += 1
                sessionStatsRef.current.notesPlayed += 1
            }

            return durationMult
        } catch (e) {
            return 1
        }
    }

    useEffect(() => {
        const handleGlobalMove = (e) => {
            const canvas = artworkCanvasRef.current
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.width / rect.width
            const scaleY = canvas.height / rect.height
            mouseClientPosRef.current = { x: e.clientX, y: e.clientY }
        }
        const unlockAudio = () => {
            try {
                initAudio()
                if (
                    audioCtxRef.current &&
                    audioCtxRef.current.state === "suspended"
                ) {
                    audioCtxRef.current.resume()
                }
            } catch (e) {}
        }
        window.addEventListener("pointermove", handleGlobalMove)
        window.addEventListener("pointermove", unlockAudio, { once: true })
        window.addEventListener("mousemove", unlockAudio, { once: true })
        window.addEventListener("pointerdown", unlockAudio)
        window.addEventListener("keydown", unlockAudio)
        window.addEventListener("click", unlockAudio)
        window.addEventListener("touchstart", unlockAudio)
        window.addEventListener("wheel", unlockAudio, {
            once: true,
            passive: true,
        })
        window.addEventListener("scroll", unlockAudio, {
            once: true,
            passive: true,
        })
        return () => {
            window.removeEventListener("pointermove", handleGlobalMove)
            window.removeEventListener("pointermove", unlockAudio)
            window.removeEventListener("mousemove", unlockAudio)
            window.removeEventListener("pointerdown", unlockAudio)
            window.removeEventListener("keydown", unlockAudio)
            window.removeEventListener("click", unlockAudio)
            window.removeEventListener("touchstart", unlockAudio)
            window.removeEventListener("wheel", unlockAudio)
            window.removeEventListener("scroll", unlockAudio)
        }
    }, [])

    const scrollProgressRef = useRef(0)
    const smoothScrollProgressRef = useRef(0)
    const virtualScrollRef = useRef(0)
    const audioDistanceRef = useRef(0)
    const lastNativeScrollRef = useRef(0)
    const lastAudioScrollProgRef = useRef(0)
    const lastAudioTimeRef = useRef(0)

    const lastTouchY = useRef(null)
    useEffect(() => {
        const handleTouchStart = (e) => {
            lastTouchY.current = e.touches[0].clientY
        }
        const handleTouchMove = (e) => {
            if (lastTouchY.current !== null) {
                const dy = e.touches[0].clientY - lastTouchY.current
                audioDistanceRef.current += Math.abs(dy)
                trackEngineEvent("engine_scrolled", {}, 5000)
                lastTouchY.current = e.touches[0].clientY
            }
        }
        const handleTouchEnd = () => {
            lastTouchY.current = null
        }
        window.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        })
        window.addEventListener("touchmove", handleTouchMove, { passive: true })
        window.addEventListener("touchend", handleTouchEnd, { passive: true })
        return () => {
            window.removeEventListener("touchstart", handleTouchStart)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)
        }
    }, [])

    // Scroll Physics & Idle tracking
    useEffect(() => {
        const updateScroll = () => {
            const scrollY = Math.max(window.scrollY, virtualScrollRef.current)
            const vh = window.innerHeight
            const triggerPoint = vh * 0.5

            if (scrollY > triggerPoint && pixelsRef.current.size > 0) {
                scrollProgressRef.current = scrollY - triggerPoint

                // Init shatter data once
                if (gravityPixelsRef.current.length === 0) {
                    playShatterBloom()
                    let entries = Array.from(pixelsRef.current.entries())
                    const maxPixels = 10000
                    if (entries.length > maxPixels) {
                        const step = entries.length / maxPixels
                        const sampled = []
                        for (let i = 0; i < maxPixels; i++) {
                            sampled.push(entries[Math.floor(i * step)])
                        }
                        entries = sampled
                    }
                    const centerR = gridSize.rows / 2
                    const centerC = gridSize.cols / 2
                    const maxDist = Math.hypot(centerC, centerR) || 1

                    gravityPixelsRef.current = entries.map(([key, color]) => {
                        const _idx = key.indexOf("_")
                        const r = +key.slice(0, _idx)
                        const c = +key.slice(_idx + 1)
                        const seed = (r * 73856093) ^ (c * 19349663)
                        const random = (Math.abs(seed) % 1000) / 1000
                        const random2 = (Math.abs(seed * 3) % 1000) / 1000
                        const random3 = (Math.abs(seed * 7) % 1000) / 1000

                        const dist = Math.hypot(c - centerC, r - centerR)
                        const normDist = dist / maxDist
                        const delayOffset =
                            Math.pow(normDist, 1.3) * 25 + random * 6

                        const angle = Math.atan2(r - centerR, c - centerC)
                        const burstIntensity = Math.max(0.3, 1 - normDist * 0.6)
                        const speed = 1.0 + random2 * 2.0
                        const sqOutX =
                            Math.cos(angle) * speed * burstIntensity * 35
                        const isoOutX =
                            Math.cos(angle) * speed * burstIntensity * 28
                        const sqOutY =
                            Math.sin(angle) * speed * burstIntensity * 15 -
                            speed * 12
                        const isoOutY =
                            Math.sin(angle) * speed * burstIntensity * 10 -
                            speed * 8

                        return {
                            r,
                            c,
                            color,
                            fallSpeed: 1.5 + random * 2.2,
                            floatHeight:
                                (12 + random3 * 20) *
                                (random2 > 0.5 ? 1 : -0.5),
                            curlSpeed: (random3 - 0.5) * 2.5,
                            outwardSpeed: speed,
                            delayOffset,
                            sizeMult: 1,
                            sqOutX,
                            isoOutX,
                            sqOutY,
                            isoOutY,
                            flutterXCoeff: ((c % 7) - 3) * 0.03,
                            flutterYCoeff: ((r % 7) - 3) * 0.02,
                        }
                    })

                    // Sort ascending by depth (r + c) so drawing forward draws back-to-front without Z-fighting
                    gravityPixelsRef.current.sort(
                        (a, b) => a.r + a.c - (b.r + b.c)
                    )

                    // Clear static cache so dynamic shatter takes over
                    if (staticCacheRef.current) {
                        const ctx = staticCacheRef.current.getContext("2d")
                        if (ctx)
                            ctx.clearRect(
                                0,
                                0,
                                staticCacheRef.current.width,
                                staticCacheRef.current.height
                            )
                    }

                    setBuddyMessage("Physics enabled.", 2000)
                }
            } else if (scrollY <= triggerPoint) {
                scrollProgressRef.current = 0
            }

            // Limit virtual scroll to avoid running to infinity
            if (virtualScrollRef.current > triggerPoint + 1400) {
                virtualScrollRef.current = triggerPoint + 1400
            }
            if (virtualScrollRef.current < 0) {
                virtualScrollRef.current = 0
            }
        }

        const handleWheel = (e) => {
            trackEngineEvent("engine_scrolled", {}, 5000)
            virtualScrollRef.current = Math.max(
                0,
                virtualScrollRef.current + e.deltaY
            )
            audioDistanceRef.current += Math.abs(e.deltaY)
            updateScroll()
        }

        const handleScroll = () => {
            const scrollY = window.scrollY
            audioDistanceRef.current += Math.abs(
                scrollY - (lastNativeScrollRef.current || 0)
            )
            lastNativeScrollRef.current = scrollY
            updateScroll()
        }

        const handleInteraction = () => {
            lastInteractionTimeRef.current = Date.now()
        }

        window.addEventListener("scroll", handleScroll)
        window.addEventListener("wheel", handleWheel, { passive: true })
        window.addEventListener("pointermove", handleInteraction)
        window.addEventListener("pointerdown", handleInteraction)
        window.addEventListener("click", initAudio, { once: true })
        window.addEventListener("keydown", initAudio, { once: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("wheel", handleWheel)
            window.removeEventListener("pointermove", handleInteraction)
            window.removeEventListener("pointerdown", handleInteraction)
        }
    }, [])

    // Ambient Organic Spawner (Sparse, non-distracting density)
    useEffect(() => {
        if (!enableAmbientSpawner) return
        const interval = setInterval(() => {
            // Only spawn if not heavily shattered or scrolling
            if (gravityPixelsRef.current.length > 0) return
            if (scrollProgressRef.current > 0) return

            // Limit ambient density to a sparse 500 pixels max so it remains completely non-distracting
            if (pixelsRef.current.size > 500) return

            // Spawn a very soft, ambient color (stardust-like with low opacity)
            const ambientColor = "rgba(200, 210, 255, 0.15)"

            const rows = Math.floor(canvasTotalHeight / selectedPixelSize)
            const cols = Math.floor(canvasTotalWidth / selectedPixelSize)

            // Pick a random location
            // Spawn 2-3 pixels at completely random, disconnected locations
            const spawnCount = 2 + Math.floor(Math.random() * 2)
            let spawnedAny = false

            for (let i = 0; i < spawnCount; i++) {
                const r = Math.floor(Math.random() * rows)
                const c = Math.floor(Math.random() * cols)

                // Keep strictly inside bounds
                if (r < 0 || r >= rows || c < 0 || c >= cols) continue

                const key = `${r}_${c}`

                if (!pixelsRef.current.has(key)) {
                    pixelsRef.current.set(key, ambientColor)
                    spawnedAny = true
                }
            }

            if (spawnedAny) {
                window.dispatchEvent(new Event("ambient_spawn"))
            }
        }, 1500) // 1.5 seconds is the perfect slow, organic growth rate

        return () => clearInterval(interval)
    }, [selectedPixelSize, enableAmbientSpawner])

    const [muted, setMuted] = useState(true)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isErasing, setIsErasing] = useState(false)
    const [isBucketMode, setIsBucketMode] = useState(false)
    const [isTypeMode, setIsTypeMode] = useState(false)
    const [typePos, setTypePos] = useState<{ row: number; col: number } | null>(
        null
    )
    const typeTextRef = useRef("")
    const [hoveredTool, setHoveredTool] = useState<{
        name: string
        x: number
        y: number
    } | null>(null)
    const [symmetryMode, setSymmetryMode] = useState<
        "none" | "vertical" | "horizontal" | "radial"
    >("none")

    const [isEyedropperActive, setIsEyedropperActive] = useState(false)

    useEffect(() => {
        if (isErasing || isBucketMode || isEyedropperActive)
            setIsTypeMode(false)
    }, [isErasing, isBucketMode, isEyedropperActive])

    const [brushSize, setBrushSize] = useState(1)
    const [currentDrawColor, setCurrentDrawColor] = useState(drawColor)
    useEffect(() => {
        if (drawColor) {
            setCurrentDrawColor(drawColor)
        }
    }, [drawColor])
    const [activePalette, setActivePalette] =
        useState<keyof typeof PALETTES>("classic")

    const [hasInteracted, setHasInteracted] = useState(false)
    const [hideMedia, setHideMedia] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isIdle, setIsIdle] = useState(false)

    const [history, setHistory] = useState<Map<string, string>[]>([new Map()])
    const [historyStep, setHistoryStep] = useState(0)
    const [isMediaPlaying, setIsMediaPlaying] = useState(playMedia)

    const mousePosRef = useRef({ x: -1000, y: -1000 })
    const mouseClientPosRef = useRef({ x: -1000, y: -1000 })
    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (document.hidden) return
            if (artworkCanvasRef.current) {
                const rect = artworkCanvasRef.current.getBoundingClientRect()
                const scaleX = canvasTotalWidth / rect.width
                const scaleY = canvasTotalHeight / rect.height
                mouseClientPosRef.current = { x: e.clientX, y: e.clientY }
            }
        }
        window.addEventListener("pointermove", handleGlobalMove)
        return () => window.removeEventListener("pointermove", handleGlobalMove)
    }, [canvasTotalWidth, canvasTotalHeight])
    const staticCacheRef = useRef<HTMLCanvasElement | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const buddyStateRef = useRef({ x: 0, y: 0, userMoved: false })
    const buddyPhysRef = useRef({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        lastX: 0,
        lastY: 0,
        scaleX: 1,
        scaleY: 1,
    })
    const buddyTargetRef = useRef({ x: 0, y: 0, lastUpdate: 0 })
    const isDraggingBuddyRef = useRef(false)
    const isHoveringBuddyRef = useRef(false)
    const dragBuddyOffsetRef = useRef({ dx: 0, dy: 0 })

    const isScribingRef = useRef<boolean>(false)
    const scribeQueueRef = useRef<{ c: number; r: number; char: string }[]>([])

    const containerRef = useRef<HTMLDivElement>(null)
    const eyedropperPreviewRef = useRef<HTMLDivElement>(null)
    const bgCanvasRef = useRef<HTMLCanvasElement>(null)
    const mediaCanvasRef = useRef<HTMLCanvasElement>(null)
    const gridCanvasRef = useRef<HTMLCanvasElement>(null)
    const artworkCanvasRef = useRef<HTMLCanvasElement>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenInputRef = useRef<HTMLInputElement>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const tinyBufferCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const desktopToolbarRef = useRef<HTMLDivElement>(null)

    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
    const [isDraggingToolbar, setIsDraggingToolbar] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const lastPosRef = useRef<{ row: number; col: number } | null>(null)
    const lastScreenPosRef = useRef<{ x: number; y: number } | null>(null)
    const trailParticlesRef = useRef<
        {
            r: number
            c: number
            color: string
            life: number
            mx: number
            my: number
            p: string
            isText?: boolean
            textStr?: string
        }[]
    >([])

    const activeDynamic3D = lowPowerMode ? false : dynamic3D
    const activeHoverTrail = lowPowerMode ? false : enableHoverTrail

    const togglePalette = useCallback(() => {
        const nextIndex =
            (PALETTE_KEYS.indexOf(activePalette) + 1) % PALETTE_KEYS.length
        setActivePalette(PALETTE_KEYS[nextIndex])
    }, [activePalette])

    const cycleSymmetry = useCallback(() => {
        const modes: ("none" | "vertical" | "horizontal" | "radial")[] = [
            "none",
            "vertical",
            "horizontal",
            "radial",
        ]
        setSymmetryMode(modes[(modes.indexOf(symmetryMode) + 1) % modes.length])
    }, [symmetryMode])

    useEffect(() => {
        buddyStateRef.current.userMoved = false
    }, [
        companionPositionMode,
        companionRelativeX,
        companionRelativeY,
        companionPositionX,
        companionPositionY,
        companionOffsetX,
        companionOffsetY,
        companionSize,
        companionMovementMode,
    ])

    useEffect(() => {
        let timeoutId: NodeJS.Timeout
        const resetIdle = () => {
            if (isIdle) setIsIdle(false)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => setIsIdle(true), 10000)
        }
        window.addEventListener("mousemove", resetIdle)
        window.addEventListener("mousedown", resetIdle)
        window.addEventListener("touchstart", resetIdle)
        window.addEventListener("keydown", resetIdle)
        resetIdle()
        return () => {
            window.removeEventListener("mousemove", resetIdle)
            window.removeEventListener("mousedown", resetIdle)
            window.removeEventListener("touchstart", resetIdle)
            window.removeEventListener("keydown", resetIdle)
            clearTimeout(timeoutId)
        }
    }, [isIdle])

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    const getCustomCursorSVG = (
        text: string,
        bg: string,
        fg: string,
        isGrabbing: boolean
    ) => {
        const width = text.length * 10 + 24
        const svg = `<svg width="${width}" height="28" viewBox="0 0 ${width} 28" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${width}" height="28" rx="14" fill="${bg}" stroke="${fg}" stroke-width="2"/><text x="50%" y="19" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="${fg}" text-anchor="middle" letter-spacing="0.5">${text}</text></svg>`
        return `url("data:image/svg+xml;base64,${btoa(svg)}") ${isGrabbing ? "15 15" : "10 10"}, ${isGrabbing ? "grabbing" : "pointer"}`
    }

    const getCursorStyle = () => {
        if (isEyedropperActive) return "crosshair"
        if (isBucketMode) return "crosshair"
        if (isErasing) return "cell"
        const color = currentDrawColor
        const size = (isMobile ? 1 : brushSize) * 4 + 4
        const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="${16 - size / 2}" y="${16 - size / 2}" width="${size}" height="${size}" fill="${color}" fill-opacity="0.8" stroke="white" stroke-width="1.5"/><circle cx="16" cy="16" r="1" fill="black"/></svg>`
        return `url("data:image/svg+xml;base64,${btoa(svg)}") 16 16, auto`
    }

    const getIsoMetrics = useCallback(
        (size: number) => {
            const contW =
                containerDimensions.width ||
                (typeof window !== "undefined" ? window.innerWidth : 800)
            const contH =
                containerDimensions.height ||
                (typeof window !== "undefined" ? window.innerHeight : 600)
            const totalSpan = (gridSize.cols + gridSize.rows) * size
            const canvasW = Math.max(contW, totalSpan)
            const canvasH = Math.max(contH, totalSpan)
            const isoScale = Math.min(
                1,
                (contW - 40) / canvasW,
                (contH - 40) / (canvasH * 0.55)
            )
            const isoSize = size * isoScale

            const hx = isoSize
            const hy = isoSize * 0.5
            const isoTopX =
                contW / 2 - ((gridSize.cols - gridSize.rows) * isoSize) / 2
            const isoTopY =
                contH / 2 - ((gridSize.cols + gridSize.rows) * hy) / 2

            return { contW, contH, isoScale, isoSize, hx, hy, isoTopX, isoTopY }
        },
        [
            containerDimensions.width,
            containerDimensions.height,
            gridSize.cols,
            gridSize.rows,
        ]
    )

    const projectToScreen = useCallback(
        (
            col: number,
            row: number,
            type: "square" | "isometric",
            size: number
        ) => {
            const sqX = col * size
            const sqY = row * size

            const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(size)
            const isoX = isoTopX + (col - row) * hx
            const isoY = isoTopY + (col + row) * hy

            const progress = perspectiveProgressRef.current

            if (progress <= 0.001) return { x: sqX, y: sqY }
            if (progress >= 0.999) return { x: isoX, y: isoY }

            return {
                x: sqX + (isoX - sqX) * progress,
                y: sqY + (isoY - sqY) * progress,
            }
        },
        [getIsoMetrics]
    )

    const projectToGrid = useCallback(
        (x: number, y: number, type: "square" | "isometric", size: number) => {
            const isIsometric =
                type === "isometric" || perspectiveProgressRef.current >= 0.5
            const EPSILON = 0.0001

            if (isIsometric) {
                const { hx, hy, isoTopX, isoTopY } = getIsoMetrics(size)
                const adjX = x - isoTopX
                const adjY = y - isoTopY

                const col = (adjX / hx + adjY / hy) / 2
                const row = (adjY / hy - adjX / hx) / 2

                return {
                    col: Math.floor(col + EPSILON),
                    row: Math.floor(row + EPSILON),
                }
            }

            return {
                col: Math.floor(x / size),
                row: Math.floor(y / size),
            }
        },
        [getIsoMetrics]
    )

    const renderPixel = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            c: number,
            r: number,
            size: number,
            color: string,
            is3D: boolean,
            alpha: number = 1,
            forcePersp: string | null = null,
            overrideMx: number | null = null,
            overrideMy: number | null = null
        ) => {
            ctx.globalAlpha = alpha
            const { x, y } = projectToScreen(c, r, internalPerspective, size)
            const progress = perspectiveProgressRef.current

            if (progress > 0.001 && progress < 0.999) {
                const p1 = projectToScreen(c, r, internalPerspective, size)
                const p2 = projectToScreen(c + 1, r, internalPerspective, size)
                const p3 = projectToScreen(
                    c + 1,
                    r + 1,
                    internalPerspective,
                    size
                )
                const p4 = projectToScreen(c, r + 1, internalPerspective, size)

                ctx.fillStyle = color
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.lineTo(p3.x, p3.y)
                ctx.lineTo(p4.x, p4.y)
                ctx.closePath()
                ctx.fill()

                ctx.strokeStyle = "rgba(255,255,255,0.05)"
                ctx.lineWidth = 0.5
                ctx.stroke()

                ctx.globalAlpha = 1.0
                return
            }

            if (progress >= 0.999) {
                const { hx, hy } = getIsoMetrics(size)

                // Base flat diamond body
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(x + hx, y + hy)
                ctx.lineTo(x, y + 2 * hy)
                ctx.lineTo(x - hx, y + hy)
                ctx.closePath()
                ctx.fill()

                if (is3D) {
                    const cx = x
                    const cy = y + hy

                    // Top highlight overlay
                    ctx.fillStyle = "rgba(255,255,255,0.25)"
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x + hx, y + hy)
                    ctx.lineTo(cx, cy)
                    ctx.lineTo(x - hx, y + hy)
                    ctx.closePath()
                    ctx.fill()

                    // Bottom shadow overlay
                    ctx.fillStyle = "rgba(0,0,0,0.35)"
                    ctx.beginPath()
                    ctx.moveTo(x - hx, y + hy)
                    ctx.lineTo(cx, cy)
                    ctx.lineTo(x + hx, y + hy)
                    ctx.lineTo(x, y + 2 * hy)
                    ctx.closePath()
                    ctx.fill()
                }

                // Top face border for grid definition (only when pixels are large enough to see it)
                if (size > 6) {
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x + hx, y + hy)
                    ctx.lineTo(x, y + 2 * hy)
                    ctx.lineTo(x - hx, y + hy)
                    ctx.closePath()
                    ctx.strokeStyle = "rgba(255,255,255,0.05)"
                    ctx.lineWidth = 0.5
                    ctx.stroke()
                }

                ctx.globalAlpha = 1.0
                return
            }

            if (!is3D) {
                ctx.fillStyle = color
                ctx.fillRect(x, y, size + 0.5, size + 0.5)
                ctx.globalAlpha = 1.0
                return
            }

            const offset = Math.max(1, Math.floor(size * 0.25))
            const fw = size - offset
            const fh = size - offset

            let fx = x + Math.floor(offset / 2)
            let fy = y + Math.floor(offset / 2)

            if (activeDynamic3D) {
                const targetMx =
                    overrideMx !== null ? overrideMx : mousePosRef.current.x
                const targetMy =
                    overrideMy !== null ? overrideMy : mousePosRef.current.y
                const px = x + size / 2
                const py = y + size / 2
                const dx = targetMx - px
                const dy = targetMy - py
                const radius = dynamic3DSensitivity * size * 1.5

                let shiftX = 0
                let shiftY = 0

                if (radius > 0) {
                    shiftX = -(dx / radius) * (offset / 2)
                    shiftY = -(dy / radius) * (offset / 2)
                    shiftX = Math.max(-offset / 2, Math.min(offset / 2, shiftX))
                    shiftY = Math.max(-offset / 2, Math.min(offset / 2, shiftY))
                }
                fx = x + offset / 2 + shiftX
                fy = y + offset / 2 + shiftY
            } else {
                const p = forcePersp || perspective3D
                if (p === "top-left") {
                    fx = x + offset
                    fy = y + offset
                } else if (p === "top-right") {
                    fx = x
                    fy = y + offset
                } else if (p === "bottom-left") {
                    fx = x + offset
                    fy = y
                } else {
                    fx = x
                    fy = y
                }
            }

            ctx.fillStyle = color
            ctx.fillRect(x, y, size + 0.5, size + 0.5)

            ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + size, y)
            ctx.lineTo(fx + fw, fy)
            ctx.lineTo(fx, fy)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctx.beginPath()
            ctx.moveTo(x, y + size)
            ctx.lineTo(x + size, y + size)
            ctx.lineTo(fx + fw, fy + fh)
            ctx.lineTo(fx, fy + fh)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + size)
            ctx.lineTo(fx, fy + fh)
            ctx.lineTo(fx, fy)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
            ctx.beginPath()
            ctx.moveTo(x + size, y)
            ctx.lineTo(x + size, y + size)
            ctx.lineTo(fx + fw, fy + fh)
            ctx.lineTo(fx + fw, fy)
            ctx.closePath()
            ctx.fill()

            ctx.fillStyle = color
            ctx.fillRect(fx, fy, fw + 0.5, fh + 0.5)

            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
            ctx.fillRect(fx, fy, fw, 1)
            ctx.fillRect(fx, fy, 1, fh)
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
            ctx.fillRect(fx, fy + fh - 1, fw, 1)
            ctx.fillRect(fx + fw - 1, fy, 1, fh)

            ctx.globalAlpha = 1.0
        },
        [
            perspective3D,
            activeDynamic3D,
            dynamic3DSensitivity,
            projectToScreen,
            internalPerspective,
            getIsoMetrics,
        ]
    )

    const rebuildStaticCache = useCallback(() => {
        const cache = staticCacheRef.current
        if (!cache) return
        const ctx = cache.getContext("2d", { willReadFrequently: true })
        if (!ctx) return

        ctx.clearRect(0, 0, cache.width, cache.height)

        const entries = []
        for (const [key, color] of pixelsRef.current.entries()) {
            const idx = key.indexOf("_")
            const r = +key.slice(0, idx)
            const c = +key.slice(idx + 1)
            entries.push({ key, color, r, c, depth: r + c })
        }

        if (
            internalPerspective === "isometric" ||
            perspectiveProgressRef.current > 0
        ) {
            entries.sort((a, b) => a.depth - b.depth)
        }

        for (let i = 0; i < entries.length; i++) {
            const item = entries[i]
            renderPixel(
                ctx,
                item.c,
                item.r,
                selectedPixelSize,
                item.color,
                pixelStyle === "3d",
                1,
                perspective3D
            )
        }
    }, [
        gridSize,
        selectedPixelSize,
        pixelStyle,
        perspective3D,
        internalPerspective,
        renderPixel,
    ])

    const redrawArtwork = useCallback(() => {
        const canvas = artworkCanvasRef.current
        const cache = staticCacheRef.current
        if (!canvas || !cache) return
        if (canvas.width <= 0 || canvas.height <= 0 || cache.width <= 0 || cache.height <= 0) return
        const artCtx = canvas.getContext("2d", { alpha: true })
        if (!artCtx) return

        try {
            artCtx.clearRect(0, 0, canvas.width, canvas.height)
            artCtx.drawImage(cache, 0, 0)
        } catch (e) {
            // Guard against transient 0-sized canvas during dynamic resize
            return
        }

        if (activeDynamic3D && pixelStyle === "3d" && !isIdle) {
            const mx = mousePosRef.current.x
            const my = mousePosRef.current.y
            const size = selectedPixelSize
            const radius = dynamic3DSensitivity * size * 1.5

            const gridRadius = Math.ceil(radius / size)
            const minC = Math.max(0, Math.floor(mx / size) - gridRadius)
            const maxC = Math.min(
                gridSize.cols - 1,
                Math.ceil(mx / size) + gridRadius
            )
            const minR = Math.max(0, Math.floor(my / size) - gridRadius)
            const maxR = Math.min(
                gridSize.rows - 1,
                Math.ceil(my / size) + gridRadius
            )

            for (let r = minR; r <= maxR; r++) {
                for (let c = minC; c <= maxC; c++) {
                    const key = `${r}_${c}`
                    const color = pixelsRef.current.get(key)
                    if (color) {
                        const { x, y } = projectToScreen(
                            c,
                            r,
                            internalPerspective,
                            size
                        )
                        const px = x + size / 2
                        const py = y + size / 2
                        const dist = Math.hypot(px - mx, py - my)
                        if (dist <= radius) {
                            artCtx.clearRect(x - 1, y - 1, size + 2, size + 2)
                            renderPixel(
                                artCtx,
                                c,
                                r,
                                size,
                                color,
                                true,
                                1,
                                null,
                                mx,
                                my
                            )
                        }
                    }
                }
            }
        }
    }, [
        activeDynamic3D,
        pixelStyle,
        dynamic3DSensitivity,
        gridSize,
        selectedPixelSize,
        renderPixel,
        isIdle,
    ])

    useEffect(() => {
        const handleAmbient = () => {
            if (typeof rebuildStaticCache === "function") rebuildStaticCache()
            if (typeof redrawArtwork === "function") redrawArtwork()
        }
        window.addEventListener("ambient_spawn", handleAmbient)
        return () => window.removeEventListener("ambient_spawn", handleAmbient)
    }, [rebuildStaticCache, redrawArtwork])

    useLayoutEffect(() => {
        if (!staticCacheRef.current) {
            staticCacheRef.current = document.createElement("canvas")
        }
        staticCacheRef.current.width = canvasTotalWidth
        staticCacheRef.current.height = canvasTotalHeight
        rebuildStaticCache()
        redrawArtwork()
    }, [
        gridSize,
        selectedPixelSize,
        pixelStyle,
        perspective3D,
        rebuildStaticCache,
        redrawArtwork,
    ])

    const drawVectorBuddy = useCallback(
        (ctx: CanvasRenderingContext2D, mx: number, my: number) => {
            const time = Date.now()
            const s = companionSize
            const hype = buddyHypeRef.current

            if (
                !buddyStateRef.current.userMoved &&
                companionMovementMode === "static"
            ) {
                const canvasW = canvasTotalWidth
                const canvasH = canvasTotalHeight

                let pad = 16
                let boundsMinX = Math.max(
                    pad,
                    canvasW / 2 - containerDimensions.width / 2 + pad
                )
                let boundsMaxX = Math.min(
                    canvasW - pad,
                    canvasW / 2 + containerDimensions.width / 2 - pad
                )
                let boundsMinY = Math.max(
                    pad,
                    canvasH / 2 - containerDimensions.height / 2 + pad
                )
                let boundsMaxY = Math.min(
                    canvasH - pad,
                    canvasH / 2 + containerDimensions.height / 2 - pad
                )

                const hudPaddingX = 102
                const hudPaddingY = 100

                let baseX = 0,
                    baseY = 0
                if (companionPositionMode === "relative") {
                    baseX =
                        hudPaddingX +
                        (canvasW - s - hudPaddingX * 2) *
                            (companionRelativeX / 100)
                    baseY =
                        hudPaddingY +
                        (canvasH - s - hudPaddingY * 2) *
                            (companionRelativeY / 100)
                } else if (
                    companionPositionMode === "toolbar" &&
                    desktopToolbarRef.current
                ) {
                    const tRect =
                        desktopToolbarRef.current.getBoundingClientRect()
                    const containerRect = containerRef.current
                        ? containerRef.current.getBoundingClientRect()
                        : { left: 0, top: 0 }

                    // Transform client rect to container-relative coords
                    const tbLeft = tRect.left - containerRect.left
                    const tbTop = tRect.top - containerRect.top

                    const canvasOffsetX = Math.max(
                        0,
                        (canvasW - containerDimensions.width) / 2
                    )
                    const canvasOffsetY = Math.max(
                        0,
                        (canvasH - containerDimensions.height) / 2
                    )
                    if (isVertical || isBox) {
                        baseX = canvasOffsetX + tbLeft + tRect.width / 2 - s / 2
                        baseY = canvasOffsetY + tbTop - 32 - s
                    } else {
                        baseX = canvasOffsetX + tbLeft + tRect.width + 32
                        baseY = canvasOffsetY + tbTop + tRect.height / 2 - s / 2
                    }
                } else {
                    const pxOffset = companionOffsetX
                    const pyOffset = companionOffsetY

                    // The Stats box is ~252px wide, meaning it extends ~102px past the buddy's right edge (if buddy is 48px).
                    // So we must pad the boundary by 102px on the right and left to treat them as a single centered entity.
                    const hudPaddingX = 102
                    // The stats box extends ~200px below or above the buddy. Let's pad vertically so it centers as a group.
                    const hudPaddingY = 100

                    if (companionPositionX === "right")
                        baseX = boundsMaxX - s - pxOffset - hudPaddingX
                    else if (companionPositionX === "center")
                        baseX = canvasW / 2 - s / 2 + pxOffset
                    else baseX = boundsMinX + pxOffset + hudPaddingX

                    if (companionPositionY === "bottom")
                        baseY = boundsMaxY - s - pyOffset - hudPaddingY
                    else if (companionPositionY === "center")
                        baseY = canvasH / 2 - s / 2 + pyOffset
                    else baseY = boundsMinY + pyOffset + hudPaddingY
                }

                // Apply a vertical offset so that the visual center of gravity of the ENTIRE HUD STACK (Buddy + XP Pill + Stats Box)
                // is perfectly centered around the calculated baseY.
                // Total height is ~365px. Center is ~182px down. Buddy is 48px. 182 - 24 = 158px.
                baseY -= 150

                buddyStateRef.current.x = Math.max(
                    boundsMinX,
                    Math.min(baseX, boundsMaxX - s)
                )
                buddyStateRef.current.y = Math.max(
                    boundsMinY,
                    Math.min(baseY, boundsMaxY - s)
                )
            }

            const phys = buddyPhysRef.current
            const canvasW = canvasTotalWidth
            const canvasH = canvasTotalHeight

            let targetX = buddyStateRef.current.x
            let targetY = buddyStateRef.current.y

            if (
                companionMovementMode !== "static" &&
                !isDraggingBuddyRef.current
            ) {
                targetX = buddyTargetRef.current.x
                targetY = buddyTargetRef.current.y
            }

            const bMinX = 0
            const bMaxX = canvasTotalWidth
            const bMinY = 0
            const bMaxY = canvasTotalHeight
            targetX = Math.max(bMinX, Math.min(targetX, bMaxX - s))
            targetY = Math.max(bMinY, Math.min(targetY, bMaxY - s))

            const stiffness = 0.12
            const damping = 0.75
            const ax = (targetX - phys.x) * stiffness
            const ay = (targetY - phys.y) * stiffness

            phys.vx = (phys.vx + ax) * damping
            phys.vy = (phys.vy + ay) * damping

            if (Math.abs(phys.vx) < 0.05 && Math.abs(phys.x - targetX) < 0.5) {
                phys.x = targetX
                phys.vx = 0
            } else {
                phys.x += phys.vx
            }

            if (Math.abs(phys.vy) < 0.05 && Math.abs(phys.y - targetY) < 0.5) {
                phys.y = targetY
                phys.vy = 0
            } else {
                phys.y += phys.vy
            }

            const isBlinking = time % 4000 < 150
            let eyeState = "normal"
            let bodyColor = companionColorPrimary
            let eyeGlow = companionColorEye

            if (isIdle) {
                eyeState = "sleeping"
            } else if (isDrawingRef.current) {
                if (isErasing) {
                    bodyColor = companionColorAction
                    eyeState = "angry"
                    eyeGlow = "#FF3B30"
                } else if (isBucketMode) {
                    eyeState = "happy"
                } else {
                    bodyColor = currentDrawColor
                }
            }
            if (isDraggingBuddyRef.current) {
                eyeState = "surprised"
                bodyColor = companionColorAction
            }

            let targetScaleX =
                1.0 +
                Math.min(Math.abs(phys.vy) * 0.01, 0.3) -
                Math.min(Math.abs(phys.vx) * 0.01, 0.2)
            let targetScaleY =
                1.0 +
                Math.min(Math.abs(phys.vx) * 0.01, 0.3) -
                Math.min(Math.abs(phys.vy) * 0.01, 0.2)

            if (isDraggingBuddyRef.current) {
                targetScaleX = 0.8
                targetScaleY = 1.25
            }

            const breathe = Math.sin(time / 400) * 0.04
            targetScaleX += breathe
            targetScaleY -= breathe

            phys.scaleX += (targetScaleX - phys.scaleX) * 0.2
            phys.scaleY += (targetScaleY - phys.scaleY) * 0.2

            const cx = phys.x + s / 2
            const cy = phys.y + s / 2
            const dx = mx - cx
            const dy = my - cy
            const distance = Math.hypot(dx, dy)

            const maxEyeOffset = s * 0.15
            const eyeTrackX =
                distance > 0
                    ? (dx / distance) * Math.min(distance * 0.1, maxEyeOffset)
                    : 0
            const eyeTrackY =
                distance > 0
                    ? (dy / distance) * Math.min(distance * 0.1, maxEyeOffset)
                    : 0

            const floatY = Math.sin(time / 300) * (s * 0.08)

            ctx.save()

            ctx.fillStyle = "rgba(0,0,0,0.15)"
            ctx.beginPath()
            ctx.ellipse(
                cx - phys.vx * 0.5,
                targetY + s,
                s * 0.4 * phys.scaleX,
                s * 0.1,
                0,
                0,
                Math.PI * 2
            )
            ctx.fill()

            ctx.translate(cx, cy + floatY)
            ctx.scale(phys.scaleX, phys.scaleY)

            ctx.shadowColor = "rgba(0,0,0,0.2)"
            ctx.shadowBlur = s * 0.2
            ctx.shadowOffsetY = s * 0.1

            ctx.fillStyle = bodyColor
            ctx.beginPath()

            if (buddyType === "cat") {
                ctx.beginPath()
                ctx.moveTo(-s * 0.4, -s * 0.2)
                ctx.lineTo(-s * 0.45, -s * 0.7)
                ctx.lineTo(-s * 0.1, -s * 0.4)
                ctx.moveTo(s * 0.4, -s * 0.2)
                ctx.lineTo(s * 0.45, -s * 0.7)
                ctx.lineTo(s * 0.1, -s * 0.4)
                ctx.fill()
                ctx.beginPath()
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s * 0.6, -s / 2, s * 1.2, s, s * 0.4)
                } else {
                    ctx.arc(0, 0, s / 2, 0, Math.PI * 2)
                }
            } else if (buddyType === "dog") {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(
                        -s * 0.6,
                        -s * 0.3,
                        s * 0.3,
                        s * 0.7,
                        s * 0.15
                    )
                    ctx.roundRect(s * 0.3, -s * 0.3, s * 0.3, s * 0.7, s * 0.15)
                    ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.4)
                } else {
                    ctx.arc(0, 0, s / 2, 0, Math.PI * 2)
                }
            } else if (buddyType === "robot") {
                ctx.fillRect(-s * 0.05, -s * 0.8, s * 0.1, s * 0.4)
                ctx.arc(0, -s * 0.8, s * 0.1, 0, Math.PI * 2)
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.1)
                } else {
                    ctx.rect(-s / 2, -s / 2, s, s)
                }
            } else if (buddyType === "frog") {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(
                        -s * 0.75,
                        -s * 0.2,
                        s * 1.5,
                        s * 0.7,
                        s * 0.35
                    )
                } else {
                    ctx.arc(0, s * 0.1, s * 0.6, 0, Math.PI * 2)
                }
                ctx.fill()
                ctx.beginPath()
                ctx.arc(-s * 0.35, -s * 0.2, s * 0.25, 0, Math.PI * 2)
                ctx.arc(s * 0.35, -s * 0.2, s * 0.25, 0, Math.PI * 2)
            } else if (buddyType === "ghost") {
                ctx.moveTo(-s * 0.5, -s * 0.2)
                ctx.bezierCurveTo(
                    -s * 0.5,
                    -s * 0.8,
                    s * 0.5,
                    -s * 0.8,
                    s * 0.5,
                    -s * 0.2
                )
                ctx.lineTo(s * 0.5, s * 0.4)
                ctx.quadraticCurveTo(s * 0.3, s * 0.6, 0, s * 0.4)
                ctx.quadraticCurveTo(-s * 0.3, s * 0.2, -s * 0.5, s * 0.4)
                ctx.closePath()
            } else if (buddyType === "cube") {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s * 0.5, -s * 0.5, s, s, s * 0.15)
                } else {
                    ctx.rect(-s * 0.5, -s * 0.5, s, s)
                }
            } else if (buddyType === "pill") {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s * 0.4, -s * 0.7, s * 0.8, s * 1.4, s * 0.4)
                } else {
                    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2)
                }
            } else {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.4)
                } else {
                    ctx.arc(0, 0, s / 2, 0, Math.PI * 2)
                }
            }
            ctx.fill()

            ctx.shadowColor = "transparent"

            ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
            ctx.beginPath()
            if (buddyType === "robot") {
                ctx.fillRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.1)
            } else if (
                buddyType === "cat" &&
                typeof ctx.roundRect === "function"
            ) {
                ctx.roundRect(-s * 0.5, -s * 0.45, s, s * 0.4, s * 0.2)
            } else if (
                buddyType === "frog" &&
                typeof ctx.roundRect === "function"
            ) {
                ctx.roundRect(-s * 0.65, -s * 0.15, s * 1.3, s * 0.2, s * 0.1)
            } else if (
                buddyType === "ghost" &&
                typeof ctx.roundRect === "function"
            ) {
                ctx.roundRect(-s * 0.4, -s * 0.45, s * 0.8, s * 0.3, s * 0.15)
            } else if (
                buddyType === "cube" &&
                typeof ctx.roundRect === "function"
            ) {
                ctx.roundRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.2, s * 0.1)
            } else if (
                buddyType === "pill" &&
                typeof ctx.roundRect === "function"
            ) {
                ctx.roundRect(-s * 0.3, -s * 0.6, s * 0.6, s * 0.4, s * 0.2)
            } else if (typeof ctx.roundRect === "function") {
                ctx.roundRect(-s * 0.4, -s * 0.45, s * 0.8, s * 0.4, s * 0.2)
            } else {
                ctx.arc(0, -s * 0.2, s * 0.3, 0, Math.PI * 2)
            }
            ctx.fill()

            let visorW = s * 0.7
            let visorH = s * 0.45
            let visorYOffset = 0

            if (buddyType === "cat") {
                visorW = s * 0.8
            } else if (buddyType === "robot") {
                visorW = s * 0.7
                visorH = s * 0.3
                visorYOffset = -s * 0.1
            } else if (buddyType === "frog") {
                visorW = s * 0.9
                visorH = s * 0.3
                visorYOffset = s * 0.1
            } else if (buddyType === "ghost") {
                visorW = s * 0.6
                visorH = s * 0.4
                visorYOffset = -s * 0.1
            } else if (buddyType === "cube") {
                visorW = s * 0.7
                visorH = s * 0.4
            } else if (buddyType === "pill") {
                visorW = s * 0.6
                visorH = s * 0.5
                visorYOffset = -s * 0.2
            }

            if (buddyType === "dog") {
                ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
                ctx.beginPath()
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(-s * 0.3, s * 0.1, s * 0.6, s * 0.3, s * 0.15)
                }
                ctx.fill()
                ctx.fillStyle = "#11141A"
                ctx.beginPath()
                ctx.ellipse(0, s * 0.2, s * 0.15, s * 0.1, 0, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.fillStyle = "#11141A"
            ctx.beginPath()
            if (buddyType === "robot") {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(
                        -visorW / 2 + eyeTrackX * 0.1,
                        -visorH / 2 + visorYOffset + eyeTrackY * 0.1,
                        visorW,
                        visorH,
                        s * 0.05
                    )
                } else {
                    ctx.rect(
                        -visorW / 2,
                        -visorH / 2 + visorYOffset,
                        visorW,
                        visorH
                    )
                }
            } else {
                if (typeof ctx.roundRect === "function") {
                    ctx.roundRect(
                        -visorW / 2 + eyeTrackX * 0.3,
                        -visorH / 2 +
                            (buddyType === "dog" ? -s * 0.1 : visorYOffset) +
                            eyeTrackY * 0.3,
                        visorW,
                        visorH,
                        s * 0.15
                    )
                } else {
                    ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2)
                }
            }
            ctx.fill()

            if (buddyType !== "dog") {
                ctx.fillStyle = "rgba(255,255,255,0.08)"
                ctx.beginPath()
                ctx.ellipse(
                    -visorW / 4 + eyeTrackX * 0.3,
                    -visorH / 3 + visorYOffset + eyeTrackY * 0.3,
                    visorW * 0.3,
                    visorH * 0.15,
                    -Math.PI * 0.1,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
            }

            ctx.shadowColor = eyeGlow
            ctx.shadowBlur = s * 0.15
            ctx.fillStyle = eyeGlow
            ctx.lineWidth = s * 0.08
            ctx.lineCap = "round"
            ctx.strokeStyle = eyeGlow

            const eyeSpacing = s * 0.2
            const ex = eyeTrackX
            const ey =
                eyeTrackY + (buddyType === "dog" ? -s * 0.1 : visorYOffset)

            if (eyeState === "sleeping") {
                ctx.beginPath()
                ctx.moveTo(ex - eyeSpacing - s * 0.1, ey)
                ctx.lineTo(ex - eyeSpacing + s * 0.1, ey)
                ctx.moveTo(ex + eyeSpacing - s * 0.1, ey)
                ctx.lineTo(ex + eyeSpacing + s * 0.1, ey)
                ctx.stroke()
            } else if (eyeState === "happy") {
                ctx.beginPath()
                ctx.moveTo(ex - eyeSpacing - s * 0.1, ey + s * 0.05)
                ctx.quadraticCurveTo(
                    ex - eyeSpacing,
                    ey - s * 0.1,
                    ex - eyeSpacing + s * 0.1,
                    ey + s * 0.05
                )
                ctx.moveTo(ex + eyeSpacing - s * 0.1, ey + s * 0.05)
                ctx.quadraticCurveTo(
                    ex + eyeSpacing,
                    ey - s * 0.1,
                    ex + eyeSpacing + s * 0.1,
                    ey + s * 0.05
                )
                ctx.stroke()
            } else if (eyeState === "angry") {
                ctx.beginPath()
                ctx.moveTo(ex - eyeSpacing - s * 0.1, ey - s * 0.05)
                ctx.lineTo(ex - eyeSpacing + s * 0.1, ey + s * 0.05)
                ctx.moveTo(ex + eyeSpacing - s * 0.1, ey + s * 0.05)
                ctx.lineTo(ex + eyeSpacing + s * 0.1, ey - s * 0.05)
                ctx.stroke()
            } else if (eyeState === "surprised") {
                ctx.beginPath()
                ctx.ellipse(
                    ex - eyeSpacing,
                    ey,
                    s * 0.06,
                    s * 0.1,
                    0,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
                ctx.beginPath()
                ctx.ellipse(
                    ex + eyeSpacing,
                    ey,
                    s * 0.06,
                    s * 0.1,
                    0,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
            } else if (isBlinking) {
                ctx.beginPath()
                ctx.moveTo(ex - eyeSpacing - s * 0.1, ey + s * 0.05)
                ctx.bezierCurveTo(
                    ex - eyeSpacing,
                    ey,
                    ex - eyeSpacing,
                    ey,
                    ex - eyeSpacing + s * 0.1,
                    ey + s * 0.05
                )
                ctx.moveTo(ex + eyeSpacing - s * 0.1, ey + s * 0.05)
                ctx.bezierCurveTo(
                    ex + eyeSpacing,
                    ey,
                    ex + eyeSpacing,
                    ey,
                    ex + eyeSpacing + s * 0.1,
                    ey + s * 0.05
                )
                ctx.stroke()
            } else {
                ctx.beginPath()
                ctx.ellipse(
                    ex - eyeSpacing,
                    ey,
                    s * 0.06,
                    s * 0.06,
                    0,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
                ctx.beginPath()
                ctx.ellipse(
                    ex + eyeSpacing,
                    ey,
                    s * 0.06,
                    s * 0.06,
                    0,
                    0,
                    Math.PI * 2
                )
                ctx.fill()
            }

            ctx.restore()
        },
        [
            gridSize,
            selectedPixelSize,
            companionSize,
            companionPositionMode,
            companionRelativeX,
            companionRelativeY,
            companionPositionX,
            companionPositionY,
            buddyType,
            companionMovementMode,
            companionOffsetX,
            companionOffsetY,
            companionColorPrimary,
            companionColorAction,
            companionColorEye,
            isErasing,
            isBucketMode,
            currentDrawColor,
            isIdle,
        ]
    )

    useEffect(() => {
        let animId: number
        let timeoutId: NodeJS.Timeout | null = null
        const renderLoop = () => {
            if (isDraggingBuddyRef.current) {
                document.body.style.cursor = getCustomCursorSVG(
                    "HOLDING",
                    t.dangerBg,
                    t.dangerText,
                    true
                )
            } else if (isHoveringBuddyRef.current) {
                document.body.style.cursor = getCustomCursorSVG(
                    "GRAB BUDDY",
                    t.activeBg,
                    t.activeText,
                    false
                )
            } else {
                document.body.style.cursor = ""
                if (artworkCanvasRef.current)
                    artworkCanvasRef.current.style.cursor = getCursorStyle()
            }

            const time = Date.now()

            if (isScribingRef.current && scribeQueueRef.current.length > 0) {
                const nextPixel = scribeQueueRef.current[0]
                const target = projectToScreen(
                    nextPixel.c,
                    nextPixel.r,
                    internalPerspective,
                    selectedPixelSize
                )
                buddyTargetRef.current.x = target.x - companionSize / 2
                buddyTargetRef.current.y = target.y - companionSize / 2
                buddyTargetRef.current.c = col
                buddyTargetRef.current.r = row

                const dist = Math.hypot(
                    buddyPhysRef.current.x - buddyTargetRef.current.x,
                    buddyPhysRef.current.y - buddyTargetRef.current.y
                )

                if (dist < 10) {
                    applyDrawAction(nextPixel.r, nextPixel.c, currentDrawColor)
                    if (typeof redrawArtwork === "function") redrawArtwork()
                    scribeQueueRef.current.shift()
                    if (scribeQueueRef.current.length === 0) {
                        isScribingRef.current = false
                    }
                }
            } else if (
                companionMovementMode !== "static" &&
                !isDraggingBuddyRef.current
            ) {
                if (companionMovementMode === "follow-cursor") {
                    buddyTargetRef.current.x =
                        mousePosRef.current.x - companionSize / 2
                    buddyTargetRef.current.y =
                        mousePosRef.current.y - companionSize / 2
                } else if (companionMovementMode === "wander") {
                    if (time - buddyTargetRef.current.lastUpdate > 3000) {
                        const maxW = canvasTotalWidth - companionSize
                        const maxH = canvasTotalHeight - companionSize
                        buddyTargetRef.current.x = Math.random() * maxW
                        buddyTargetRef.current.y = Math.random() * maxH
                        buddyTargetRef.current.lastUpdate = time
                    }
                } else if (companionMovementMode === "patrol") {
                    const speed = 0.0005
                    const phase = (time * speed) % 4
                    const maxW = canvasTotalWidth - companionSize
                    const maxH = canvasTotalHeight - companionSize
                    let tx = 0,
                        ty = 0
                    if (phase < 1) {
                        tx = maxW * phase
                        ty = 0
                    } else if (phase < 2) {
                        tx = maxW
                        ty = maxH * (phase - 1)
                    } else if (phase < 3) {
                        tx = maxW * (1 - (phase - 2))
                        ty = maxH
                    } else {
                        tx = 0
                        ty = maxH * (1 - (phase - 3))
                    }
                    buddyTargetRef.current = { x: tx, y: ty, lastUpdate: time }
                }
            }

            const canvas = previewCanvasRef.current

            if (isIdle && showCompanion) {
                if (Math.random() < 0.02) {
                    const bx = buddyPhysRef.current.x
                    const by = buddyPhysRef.current.y
                    trailParticlesRef.current.push({
                        c:
                            (bx + companionSize / 2) / selectedPixelSize +
                            (Math.random() - 0.5),
                        r: Math.max(0, (by - 10) / selectedPixelSize),
                        color: t.text,
                        life: 1.0,
                        mx: 0,
                        my: 0,
                        p: "top-right",
                        isText: true,
                        textStr: "Zzz",
                    })
                }
            }

            if (canvas && (!isIdle || document.hidden === false)) {
                const ctx = canvas.getContext("2d", { alpha: true })
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    if (artworkCanvasRef.current) {
                        if (smoothScrollProgressRef.current > 0.001) {
                            artworkCanvasRef.current.style.opacity = "0"
                        } else {
                            artworkCanvasRef.current.style.opacity = "1"
                        }
                    }

                    const mx = mousePosRef.current.x
                    const my = mousePosRef.current.y
                    const s = selectedPixelSize

                    if (showCompanion && !isMobile) {
                        const cx = buddyPhysRef.current.x + companionSize / 2
                        const cy = buddyPhysRef.current.y + companionSize / 2
                        const hitRange = companionSize / 2 + 10
                        isHoveringBuddyRef.current =
                            Math.abs(mx - cx) < hitRange &&
                            Math.abs(my - cy) < hitRange
                    } else {
                        isHoveringBuddyRef.current = false
                    }

                    if ((activeHoverTrail || isIdle) && trailParticlesRef.current.length > 0) {
                        const particles = trailParticlesRef.current
                        for (let i = particles.length - 1; i >= 0; i--) {
                            const p = particles[i]
                            if (p.isText && p.textStr) {
                                ctx.globalAlpha = p.life
                                ctx.fillStyle = p.color
                                ctx.font = "bold 14px monospace"
                                ctx.fillText(
                                    p.textStr,
                                    p.c * s,
                                    p.r * s - (1 - p.life) * 20
                                )
                                ctx.globalAlpha = 1.0
                                p.life -= 0.015
                            } else {
                                renderPixel(
                                    ctx,
                                    p.c,
                                    p.r,
                                    s,
                                    p.color,
                                    pixelStyle === "3d",
                                    p.life,
                                    p.p,
                                    p.mx,
                                    p.my
                                )
                                p.life -= 0.05
                            }
                            if (p.life <= 0) particles.splice(i, 1)
                        }
                    }

                    if (buddyHypeRef.current > 0)
                        buddyHypeRef.current = Math.max(
                            0,
                            buddyHypeRef.current - 0.005
                        )
                    if (isTypeMode && typePos) {
                        const time = Date.now()
                        const cursorVisible = Math.floor(time / 500) % 2 === 0

                        let cursorC = typePos.col
                        let cursorR = typePos.row

                        const typeText = typeTextRef.current
                        if (typeText) {
                            let currentCol = typePos.col
                            let currentRow = typePos.row

                            for (let i = 0; i < typeText.length; i++) {
                                if (typeText[i] === "\n") {
                                    currentCol = typePos.col
                                    currentRow += 6
                                    continue
                                }

                                const char = typeText[i].toUpperCase()
                                const fontDef =
                                    PIXEL_FONT[char] || PIXEL_FONT["?"]
                                let charWidth = 0

                                for (let r = 0; r < fontDef.length; r++) {
                                    const rowStr = fontDef[r]
                                    charWidth = Math.max(
                                        charWidth,
                                        rowStr.length
                                    )
                                    for (let c = 0; c < rowStr.length; c++) {
                                        if (rowStr[c] === "1") {
                                            let gridR = currentRow + r
                                            let gridC = currentCol + c
                                            if (char === "," || char === ";")
                                                gridR += 1

                                            const ext =
                                                internalPerspective ===
                                                "isometric"
                                                    ? Math.max(
                                                          gridSize.cols,
                                                          gridSize.rows
                                                      )
                                                    : 0

                                            if (
                                                gridR >= -ext &&
                                                gridR < gridSize.rows + ext &&
                                                gridC >= -ext &&
                                                gridC < gridSize.cols + ext
                                            ) {
                                                renderPixel(
                                                    ctx,
                                                    gridC,
                                                    gridR,
                                                    s,
                                                    currentDrawColor,
                                                    pixelStyle === "3d",
                                                    1,
                                                    perspective3D
                                                )
                                            }
                                        }
                                    }
                                }
                                currentCol += charWidth + 1
                            }
                            cursorC = currentCol
                            cursorR = currentRow
                        }

                        if (cursorVisible) {
                            ctx.fillStyle = "#ff0055" // Bright highly visible cursor color
                            ctx.globalAlpha = 0.8
                            for (let r = 0; r < 5; r++) {
                                const { x, y } = projectToScreen(
                                    cursorC,
                                    cursorR + r,
                                    internalPerspective,
                                    s
                                )
                                if (internalPerspective === "isometric") {
                                    const { hx, hy } = getIsoMetrics(s)
                                    ctx.beginPath()
                                    ctx.moveTo(x, y)
                                    ctx.lineTo(x + hx, y + hy)
                                    ctx.lineTo(x, y + hy * 2)
                                    ctx.lineTo(x - hx, y + hy)
                                    ctx.closePath()
                                    ctx.fill()
                                } else {
                                    ctx.fillRect(x, y, s, s)
                                }
                            }
                            ctx.globalAlpha = 1.0
                        }
                    }

                    // --- Gamification & Physics Rendering ---
                    if (enableGamification) {
                        for (const [
                            key,
                            data,
                        ] of collectiblesRef.current.entries()) {
                            const _idx = key.indexOf("_")
                            const r = +key.slice(0, _idx)
                            const c = +key.slice(_idx + 1)
                            const size = data.sizeMult || 1
                            const { isoScale } = getIsoMetrics(selectedPixelSize)
                            const pxSize =
                                internalPerspective === "isometric"
                                    ? selectedPixelSize * size * isoScale
                                    : selectedPixelSize * size

                            const { x: ox, y: oy } = projectToScreen(
                                c,
                                r,
                                internalPerspective,
                                selectedPixelSize
                            )

                            const x = ox
                            const y = oy

                            const type = data.type || "gold"
                            const pulse = (Math.sin(time * 0.005) + 1) / 2
                            if (type === "gold") {
                                ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + pulse * 0.5})`
                                ctx.shadowColor = "rgba(255, 215, 0, 0.8)"
                            } else if (type === "neon") {
                                ctx.fillStyle = `rgba(255, 0, 100, ${0.7 + pulse * 0.3})`
                                ctx.shadowColor = "rgba(255, 0, 100, 1)"
                            } else if (type === "rainbow") {
                                const hue = (time * 0.2) % 360
                                ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
                                ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
                            }
                            ctx.shadowBlur =
                                15 * pulse + (type === "gold" ? 0 : 5)

                            if (internalPerspective === "square") {
                                ctx.fillRect(x, y, pxSize, pxSize)
                            } else {
                                const hx = pxSize,
                                    hy = pxSize * 0.5
                                ctx.beginPath()
                                ctx.moveTo(x, y)
                                ctx.lineTo(x + hx, y + hy)
                                ctx.lineTo(x, y + hy * 2)
                                ctx.lineTo(x - hx, y + hy)
                                ctx.closePath()
                                ctx.fill()
                            }
                            ctx.shadowBlur = 0
                        }
                    }

                    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                        const p = particlesRef.current[i]
                        p.x += p.vx
                        p.y += p.vy
                        p.life -= 16
                        if (p.life <= 0) {
                            particlesRef.current.splice(i, 1)
                            continue
                        }
                        ctx.fillStyle = `rgba(${p.color}, ${p.life / p.maxLife})`
                        ctx.beginPath()
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                        ctx.fill()
                    }

                    // Smoother global easing (premium buttery feel)
                    smoothScrollProgressRef.current +=
                        (scrollProgressRef.current -
                            smoothScrollProgressRef.current) *
                        0.15

                    // Settle gravity gracefully
                    if (
                        scrollProgressRef.current === 0 &&
                        smoothScrollProgressRef.current > 0 &&
                        smoothScrollProgressRef.current < 0.5 &&
                        gravityPixelsRef.current.length > 0
                    ) {
                        smoothScrollProgressRef.current = 0
                        gravityPixelsRef.current = []
                        rebuildStaticCache()
                        if (typeof redrawArtwork === "function") redrawArtwork()
                    }

                    const lastTime = lastAudioTimeRef.current || 0
                    const now = performance.now()

                    // Use pure accumulated scroll distance for audio, completely ignoring visual bounds
                    const distance = audioDistanceRef.current

                    // Tempo reacts to scroll speed (faster scroll = faster tempo, but within musical limits)
                    // Floor of 200ms (approx 150 BPM sixteenths) ensures it never sounds artificially rushed.
                    const velocityTempo = Math.max(
                        200,
                        Math.min(450, 500 - distance * 15)
                    )
                    const lastDuration = lastNoteDurationRef.current || 1

                    // Strict musical intonation: must wait for the exact duration of the PREVIOUS note
                    const requiredTime = velocityTempo * lastDuration

                    if (distance > 3.0 && now - lastTime > requiredTime) {
                        const duration = playCinematicPhysics(
                            0,
                            distance,
                            false
                        )
                        trackEngineEvent("engine_music_triggered", {}, 15000)
                        lastNoteDurationRef.current = duration || 1
                        audioDistanceRef.current = 0 // Consume distance
                        lastAudioTimeRef.current = now
                    }

                    if (
                        smoothScrollProgressRef.current > 0.001 &&
                        gravityPixelsRef.current.length > 0
                    ) {
                        const { hx: isoHx, hy: isoHy, isoTopX, isoTopY } =
                            getIsoMetrics(selectedPixelSize)
                        const sqOffsetX = 0
                        const sqOffsetY = 0

                        const scrollProg = smoothScrollProgressRef.current

                        let alpha = 1.0
                        if (scrollProg > 0) {
                            const minOpacity = 0.3
                            const dropProgress = Math.min(1, scrollProg / 150)
                            const baseAlpha =
                                1.0 -
                                Math.pow(dropProgress, 1.5) * (1.0 - minOpacity)
                            const fadeOut = Math.max(0, 1 - scrollProg / 1400)
                            alpha = baseAlpha * fadeOut
                        }
                        ctx.globalAlpha = alpha
                        ctx.shadowBlur = 0

                        const is3D = pixelStyle === "3d"
                        const scale = 0.6
                        const inTopY = -isoHy * scale
                        const inRightX = isoHx * scale
                        const inBottomY = isoHy * scale
                        const inLeftX = -isoHx * scale

                        const halfSize = selectedPixelSize / 2

                        for (
                            let i = 0;
                            i < gravityPixelsRef.current.length;
                            i++
                        ) {
                            const p = gravityPixelsRef.current[i]
                            const rawProg =
                                scrollProg -
                                (p.delayOffset !== undefined
                                    ? p.delayOffset
                                    : 0)
                            const t = Math.max(0, rawProg / 80)

                            // Quadratic ease-in-out curve for seamless touchdown velocity at t=0
                            const easeT = t * t * (3 - 2 * Math.min(1, t))
                            const motionT = t < 1 ? easeT : 1 + (t - 1) * 1.2

                            const sqX = sqOffsetX + p.c * selectedPixelSize
                            const sqY = sqOffsetY + p.r * selectedPixelSize
                            const isoX = isoTopX + (p.c - p.r) * isoHx
                            const isoY = isoTopY + (p.c + p.r) * isoHy

                            const x =
                                progress <= 0.001
                                    ? sqX
                                    : progress >= 0.999
                                      ? isoX
                                      : sqX + (isoX - sqX) * progress
                            const y =
                                progress <= 0.001
                                    ? sqY
                                    : progress >= 0.999
                                      ? isoY
                                      : sqY + (isoY - sqY) * progress

                            const sqOutX = p.sqOutX !== undefined ? p.sqOutX : 0
                            const isoOutX =
                                p.isoOutX !== undefined ? p.isoOutX : 0
                            const sqOutY = p.sqOutY !== undefined ? p.sqOutY : 0
                            const isoOutY =
                                p.isoOutY !== undefined ? p.isoOutY : 0

                            const outwardX =
                                (sqOutX + (isoOutX - sqOutX) * progress) *
                                motionT
                            const outwardY =
                                (sqOutY + (isoOutY - sqOutY) * progress) *
                                motionT

                            // Smooth aerodynamic sway/curl (never jerks or cuts off abruptly)
                            const swayX =
                                Math.sin(motionT * 4 + p.c) *
                                (p.curlSpeed || 1) *
                                6 *
                                Math.min(1, motionT)
                            const floatY =
                                (p.floatHeight || 0) *
                                Math.sin(Math.min(1, motionT) * Math.PI) *
                                0.5

                            // True Newtonian parabolic gravity drop (0.5 * g * t^2)
                            const fallY =
                                0.5 *
                                (p.fallSpeed || 2) *
                                22 *
                                motionT *
                                motionT

                            const screenX = x + outwardX + swayX
                            const screenY = y + outwardY - floatY + fallY
                            p.lastX = screenX
                            p.lastY = screenY

                            if (
                                screenX < -100 ||
                                screenX > canvasTotalWidth + 100 ||
                                screenY < -100 ||
                                screenY > canvasTotalHeight + 100
                            ) {
                                continue
                            }

                            ctx.fillStyle = p.color

                            if (progress <= 0.001) {
                                ctx.fillRect(
                                    screenX,
                                    screenY,
                                    selectedPixelSize,
                                    selectedPixelSize
                                )
                            } else if (progress >= 0.999) {
                                const isoCx = screenX
                                const isoCy = screenY + isoHy
                                ctx.beginPath()
                                ctx.moveTo(isoCx, screenY)
                                ctx.lineTo(isoCx + isoHx, isoCy)
                                ctx.lineTo(isoCx, isoCy + isoHy)
                                ctx.lineTo(isoCx - isoHx, isoCy)
                                ctx.closePath()
                                ctx.fill()
                            } else {
                                const sqCx = screenX + halfSize
                                const sqCy = screenY + halfSize
                                const isoCx = screenX
                                const isoCy = screenY + isoHy
                                const cx = sqCx + (isoCx - sqCx) * progress
                                const cy = sqCy + (isoCy - sqCy) * progress

                                const sqP1x = -halfSize,
                                    sqP1y = -halfSize
                                const sqP2x = halfSize,
                                    sqP2y = -halfSize
                                const sqP3x = halfSize,
                                    sqP3y = halfSize
                                const sqP4x = -halfSize,
                                    sqP4y = halfSize

                                const isoP1x = 0,
                                    isoP1y = -isoHy
                                const isoP2x = isoHx,
                                    isoP2y = 0
                                const isoP3x = 0,
                                    isoP3y = isoHy
                                const isoP4x = -isoHx,
                                    isoP4y = 0

                                ctx.beginPath()
                                ctx.moveTo(
                                    cx + sqP1x + (isoP1x - sqP1x) * progress,
                                    cy + sqP1y + (isoP1y - sqP1y) * progress
                                )
                                ctx.lineTo(
                                    cx + sqP2x + (isoP2x - sqP2x) * progress,
                                    cy + sqP2y + (isoP2y - sqP2y) * progress
                                )
                                ctx.lineTo(
                                    cx + sqP3x + (isoP3x - sqP3x) * progress,
                                    cy + sqP3y + (isoP3y - sqP3y) * progress
                                )
                                ctx.lineTo(
                                    cx + sqP4x + (isoP4x - sqP4x) * progress,
                                    cy + sqP4y + (isoP4y - sqP4y) * progress
                                )
                                ctx.closePath()
                                ctx.fill()
                            }
                        }
                    }
                    ctx.globalAlpha = 1.0
                    // ----------------------------------------

                    if (
                        !isDrawingRef.current &&
                        buddyTargetRef.current.c !== undefined &&
                        buddyTargetRef.current.r !== undefined
                    ) {
                        const c = buddyTargetRef.current.c
                        const r = buddyTargetRef.current.r

                        const pt = projectToScreen(
                            c,
                            r,
                            internalPerspective,
                            selectedPixelSize
                        )
                        buddyTargetRef.current.x = pt.x - companionSize / 2
                        buddyTargetRef.current.y = pt.y - companionSize / 2
                    }

                    if (showCompanion && !(hideCompanionOnMobile && isMobile)) {
                        drawVectorBuddy(ctx, mx, my)

                        if (enableGamification) {
                            // --- Gamification Buddy HUD ---
                            // We moved the HUD container to be perfectly aligned with the canvas.
                            // So bx and by are just raw canvas coordinates!
                            const bx =
                                buddyPhysRef.current.x +
                                Number(companionSize) / 2
                            const by = buddyPhysRef.current.y

                            // Animate music spectrum
                            if (window._pixelEngineMuted) {
                                for (let i = 1; i <= 5; i++) {
                                    const bar = document.getElementById(
                                        `music-bar-${i}`
                                    )
                                    if (bar) {
                                        bar.style.height = "4px"
                                        bar.style.backgroundColor = "#ef4444"
                                    }
                                }
                            } else {
                                const isPlaying =
                                    distance > 0 || buddyHypeRef.current > 0
                                for (let i = 1; i <= 5; i++) {
                                    const bar = document.getElementById(
                                        `music-bar-${i}`
                                    )
                                    if (bar) {
                                        bar.style.backgroundColor = "#3b82f6"
                                        if (isPlaying) {
                                            bar.style.height = `${4 + Math.random() * 10}px`
                                        } else {
                                            bar.style.height = "4px"
                                        }
                                    }
                                }
                            }
                            const companionH = Number(companionSize)

                            // --- Gamification Overlay DOM Updates ---
                            const isCloseToBottom =
                                by + companionH + 250 > canvasTotalHeight

                            if (buddyChatOverlayRef.current) {
                                const chatY = isCloseToBottom
                                    ? by + companionH + 16
                                    : by - 16
                                const chatTransform = isCloseToBottom
                                    ? "translate(-50%, 0px)"
                                    : "translate(-50%, -100%)"

                                const chatTail =
                                    document.getElementById("buddy-chat-tail")
                                if (chatTail) {
                                    chatTail.style.left = "50%"
                                    chatTail.style.bottom = isCloseToBottom
                                        ? "auto"
                                        : "-5px"
                                    chatTail.style.top = isCloseToBottom
                                        ? "-5px"
                                        : "auto"
                                    chatTail.style.transform = isCloseToBottom
                                        ? "translateX(-50%) rotate(180deg)"
                                        : "translateX(-50%)"
                                }

                                if (buddyMessageRef.current) {
                                    buddyChatOverlayRef.current.style.opacity =
                                        "1"
                                    buddyChatOverlayRef.current.style.left = `${bx}px`
                                    buddyChatOverlayRef.current.style.top = `${chatY}px`
                                    buddyChatOverlayRef.current.style.transform = `translate(-50%, -${isCloseToBottom ? "0px" : "100%"}) scale(1)`
                                } else {
                                    buddyChatOverlayRef.current.style.opacity =
                                        "0"
                                    buddyChatOverlayRef.current.style.left = `${bx}px`
                                    buddyChatOverlayRef.current.style.top = `${chatY}px`
                                    buddyChatOverlayRef.current.style.transform = `translate(-50%, -${isCloseToBottom ? "0px" : "100%"}) scale(0.9)`
                                }
                            }

                            if (
                                buddyXpOverlayRef.current &&
                                buddyStatsOverlayRef.current
                            ) {
                                try {
                                    buddyXpOverlayRef.current.style.opacity =
                                        "1"
                                    buddyStatsOverlayRef.current.style.opacity =
                                        "1"

                                    const xpY = isCloseToBottom
                                        ? by - 16
                                        : by + companionH + 16
                                    const statsY = isCloseToBottom
                                        ? by - 74
                                        : by + companionH + 74
                                    const hudOffsetY = isCloseToBottom
                                        ? "100%"
                                        : "0px"

                                    buddyXpOverlayRef.current.style.left = `${bx}px`
                                    buddyXpOverlayRef.current.style.top = `${xpY}px`
                                    buddyXpOverlayRef.current.style.transform = `translate(-50%, -${hudOffsetY})`

                                    buddyStatsOverlayRef.current.style.left = `${bx}px`
                                    buddyStatsOverlayRef.current.style.top = `${statsY}px`
                                    buddyStatsOverlayRef.current.style.transform = `translate(-50%, -${hudOffsetY})`
                                    const scoreDom =
                                        document.getElementById("buddy-xp-val")
                                    if (
                                        scoreDom &&
                                        scoreDom.innerText !==
                                            scoreRef.current.toString()
                                    ) {
                                        scoreDom.innerText =
                                            scoreRef.current.toString()
                                    }

                                    const statsDom =
                                        document.getElementById(
                                            "buddy-stats-val"
                                        )
                                    if (statsDom) {
                                        let pxCount = 0
                                        if (
                                            pixelsRef.current &&
                                            typeof pixelsRef.current.size ===
                                                "number"
                                        ) {
                                            pxCount = pixelsRef.current.size
                                        }
                                        if (
                                            statsDom.innerText !==
                                            pxCount.toString()
                                        ) {
                                            statsDom.innerText =
                                                pxCount.toString()
                                        }

                                        // Update progress bar
                                        const progressTarget = 200 // Loop every 200 pixels
                                        const filledSegments = Math.min(
                                            16,
                                            Math.floor(
                                                ((pxCount % progressTarget) /
                                                    progressTarget) *
                                                    16
                                            )
                                        )

                                        const level =
                                            Math.floor(
                                                pxCount / progressTarget
                                            ) + 1
                                        const levelColors = [
                                            "#3b82f6",
                                            "#10b981",
                                            "#f59e0b",
                                            "#ef4444",
                                            "#8b5cf6",
                                        ]
                                        const barColor =
                                            levelColors[
                                                (level - 1) % levelColors.length
                                            ]
                                        const prevColor =
                                            level > 1
                                                ? levelColors[
                                                      (level - 2) %
                                                          levelColors.length
                                                  ]
                                                : t.border

                                        if (
                                            buddyStatsOverlayRef.current.dataset
                                                .lastFilled !==
                                                filledSegments.toString() ||
                                            buddyStatsOverlayRef.current.dataset
                                                .lastLevel !== level.toString()
                                        ) {
                                            buddyStatsOverlayRef.current.dataset.lastFilled =
                                                filledSegments.toString()
                                            buddyStatsOverlayRef.current.dataset.lastLevel =
                                                level.toString()
                                            for (let i = 0; i < 16; i++) {
                                                const bar =
                                                    document.getElementById(
                                                        `buddy-progress-bar-${i}`
                                                    )
                                                if (bar) {
                                                    bar.style.backgroundColor =
                                                        i <= filledSegments
                                                            ? barColor
                                                            : prevColor
                                                }
                                            }
                                        }
                                        const titles = [
                                            "Canvas Visitor",
                                            "Grid Explorer",
                                            "Active Builder",
                                            "Pixel Architect",
                                            "System Master",
                                        ]
                                        const titleStr =
                                            titles[
                                                Math.min(
                                                    level - 1,
                                                    titles.length - 1
                                                )
                                            ] +
                                            " (Lvl " +
                                            level +
                                            ")"

                                        const titleDom =
                                            document.getElementById(
                                                "buddy-title-val"
                                            )
                                        if (
                                            titleDom &&
                                            titleDom.innerText !== titleStr
                                        ) {
                                            titleDom.innerText = titleStr
                                        }

                                        // Update chat message dynamically based on progress
                                        // Animate Engine Sine Wave
                                        const waveMain =
                                            document.getElementById(
                                                "engine-wave-main"
                                            )
                                        const waveShadow =
                                            document.getElementById(
                                                "engine-wave-shadow"
                                            )
                                        if (waveMain && waveShadow) {
                                            const waveTime = Date.now() / 300
                                            const pts = []
                                            for (let i = 0; i <= 40; i += 1) {
                                                const y =
                                                    10 +
                                                    Math.sin(
                                                        waveTime + i * 0.15
                                                    ) *
                                                        6
                                                pts.push(
                                                    `${i === 0 ? "M" : "L"}${i} ${y.toFixed(1)}`
                                                )
                                            }
                                            const pathStr = pts.join(" ")
                                            waveMain.setAttribute("d", pathStr)
                                            waveShadow.setAttribute(
                                                "d",
                                                pathStr
                                            )
                                        }

                                        const msgDom =
                                            document.getElementById(
                                                "buddy-chat-msg"
                                            )
                                        if (msgDom) {
                                            const milestone =
                                                pxCount % progressTarget
                                            let msg =
                                                "Ready to create some magic? ✨"

                                            if (buddyMessageRef.current) {
                                                msg = buddyMessageRef.current
                                            } else if (pxCount > 0) {
                                                const messages = [
                                                    "You have a great eye for color! 🎨",
                                                    "This is coming along beautifully!",
                                                    "I love where this is going! 🖌️",
                                                    "Keep those creative juices flowing! 🚀",
                                                    "Those pixels look happy today! ✨",
                                                    "Every pixel brings it to life! 💫",
                                                    "You're a natural at this! 🏆",
                                                    "Wow, look at you go! 🌟",
                                                ]

                                                if (milestone === 0) {
                                                    msg = `Level Up! You're crushing it! 🎉`
                                                } else if (milestone > 180) {
                                                    msg =
                                                        "Almost at the next level! 🔥"
                                                } else {
                                                    // Cycle messages smoothly every 40 pixels
                                                    const index =
                                                        Math.floor(
                                                            pxCount / 40
                                                        ) % messages.length
                                                    msg = messages[index]
                                                }
                                            }

                                            if (msgDom.innerText !== msg) {
                                                msgDom.innerText = msg
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error(
                                        "Error in renderLoop gamification:",
                                        e
                                    )
                                }
                            }
                            // ------------------------------
                        }
                    }
                }
            }
            if (
                (!isIdle || smoothScrollProgressRef.current > 0.001) &&
                !document.hidden
            ) {
                animId = requestAnimationFrame(renderLoop)
            } else {
                timeoutId = setTimeout(() => {
                    animId = requestAnimationFrame(renderLoop)
                }, 100)
            }
        }
        animId = requestAnimationFrame(renderLoop)
        return () => {
            cancelAnimationFrame(animId)
            if (timeoutId) clearTimeout(timeoutId)
            document.body.style.cursor = ""
        }
    }, [
        enableGamification,
        activeHoverTrail,
        activeDynamic3D,
        dynamic3DSensitivity,
        pixelStyle,
        selectedPixelSize,
        gridSize,
        renderPixel,
        showCompanion,
        hideCompanionOnMobile,
        isMobile,
        drawVectorBuddy,
        isIdle,
        companionSize,
        t.text,
        t.activeBg,
        t.activeText,
        t.dangerBg,
        t.dangerText,
        companionMovementMode,
        internalPerspective,
        projectToGrid,
        isTypeMode,
        typePos,
    ])

    const saveHistory = useCallback(
        (newPixelsMap: Map<string, string>) => {
            setHistory((prevHistory) => {
                const newHistory = prevHistory.slice(0, historyStep + 1)
                newHistory.push(new Map(newPixelsMap))
                if (newHistory.length > 50) newHistory.shift()
                setHistoryStep(newHistory.length - 1)
                return newHistory
            })
        },
        [historyStep]
    )

    const handleUndo = useCallback(() => {
        if (historyStep > 0) {
            const newStep = historyStep - 1
            pixelsRef.current = new Map(history[newStep])
            setHistoryStep(newStep)
            rebuildStaticCache()
            redrawArtwork()
            notifyStats()
        }
    }, [historyStep, history, rebuildStaticCache, redrawArtwork, notifyStats])

    const handleRedo = useCallback(() => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1
            pixelsRef.current = new Map(history[newStep])
            setHistoryStep(newStep)
            rebuildStaticCache()
            redrawArtwork()
            notifyStats()
        }
    }, [historyStep, history, rebuildStaticCache, redrawArtwork, notifyStats])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key.toLowerCase() === "z") {
                    e.preventDefault()
                    if (e.shiftKey) {
                        handleRedo()
                    } else {
                        handleUndo()
                    }
                } else if (e.key.toLowerCase() === "y") {
                    e.preventDefault()
                    handleRedo()
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleUndo, handleRedo])

    useEffect(() => {
        if (typeof document !== "undefined") {
            const video = document.createElement("video")
            video.crossOrigin = "anonymous"
            video.muted = true
            video.playsInline = true
            videoRef.current = video
            const img = new Image()
            img.crossOrigin = "anonymous"
            imageRef.current = img
            tinyBufferCanvasRef.current = document.createElement("canvas")
        }
    }, [])

    useEffect(() => {
        if (mediaSourceType === "video" && videoRef.current) {
            videoRef.current.src = mediaFile
            videoRef.current.loop = loopMedia
            if (isMediaPlaying && !hideMedia && !document.hidden && !isIdle)
                videoRef.current.play().catch(() => {})
            else videoRef.current.pause()
        } else if (
            mediaSourceType === "image" &&
            imageRef.current &&
            mediaFile
        ) {
            imageRef.current.src = mediaFile
        }
    }, [
        mediaFile,
        mediaSourceType,
        loopMedia,
        isMediaPlaying,
        hideMedia,
        isIdle,
    ])
    const getPixelKey = (row: number, col: number) => `${row}_${col}`
    const applyDrawAction = useCallback(
        (r: number, c: number, targetColor: string | null) => {
            const map = pixelsRef.current
            const key = getPixelKey(r, c)

            // Gamification: Pop the collectible
            if (enableGamification) {
                let poppedKey = null
                for (const [ckey, data] of collectiblesRef.current.entries()) {
                    const _cidx = ckey.indexOf("_")
                    const cr = +ckey.slice(0, _cidx)
                    const cc = +ckey.slice(_cidx + 1)
                    const s = data.sizeMult || 1
                    const half = (s - 1) / 2
                    if (
                        r >= cr - half &&
                        r <= cr + half &&
                        c >= cc - half &&
                        c <= cc + half
                    ) {
                        poppedKey = ckey
                        break
                    }
                }

                if (poppedKey) {
                    const poppedData =
                        collectiblesRef.current.get(poppedKey) || {}
                    collectiblesRef.current.delete(poppedKey)
                    if (
                        unsentFirebaseStatsRef &&
                        unsentFirebaseStatsRef.current
                    ) {
                        unsentFirebaseStatsRef.current.popped += 1
                        sessionStatsRef.current.pixelsPopped += 1
                    }
                    const type = poppedData.type || "gold"
                    const points =
                        type === "rainbow" ? 5 : type === "neon" ? 3 : 1
                    const now = performance.now()
                    if (now - lastPopTimeRef.current < 2500) {
                        comboCountRef.current++
                        if (comboCountRef.current > 15)
                            comboMultiplierRef.current = 5
                        else if (comboCountRef.current > 7)
                            comboMultiplierRef.current = 3
                        else if (comboCountRef.current > 3)
                            comboMultiplierRef.current = 2
                    } else {
                        comboCountRef.current = 1
                        comboMultiplierRef.current = 1
                    }
                    lastPopTimeRef.current = now
                    scoreRef.current += points * comboMultiplierRef.current
                    notifyStats()
                    playPopSound(
                        type === "rainbow" ? 1200 : type === "neon" ? 900 : 600
                    )

                    if (comboMultiplierRef.current >= 3) {
                        buddyHypeRef.current = 1
                        setBuddyMessage(
                            `COMBO X${comboMultiplierRef.current}!!!`,
                            1500
                        )
                    } else {
                        buddyHypeRef.current = 1
                        setBuddyMessage("Pixel removed.", 1500)
                    }

                    const { x, y } = projectToScreen(
                        c,
                        r,
                        internalPerspective,
                        selectedPixelSize
                    )
                    const { isoScale } = getIsoMetrics(selectedPixelSize)
                    const s = poppedData.sizeMult || 1
                    const pxSize =
                        internalPerspective === "isometric"
                            ? selectedPixelSize * s * isoScale
                            : selectedPixelSize * s
                    const cx =
                        internalPerspective === "square" ? x + pxSize / 2 : x
                    const cy =
                        internalPerspective === "square"
                            ? y + pxSize / 2
                            : y + pxSize * 0.5

                    const colorStr =
                        type === "rainbow"
                            ? "0, 255, 255"
                            : type === "neon"
                              ? "255, 0, 100"
                              : "255, 215, 0"
                    for (let i = 0; i < 25; i++) {
                        particlesRef.current.push({
                            x: cx,
                            y: cy,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15 - 2,
                            life: 500 + Math.random() * 500,
                            maxLife: 1000,
                            size: Math.random() * 3 + 2,
                            color: colorStr,
                        })
                    }
                    return // Prevent drawing
                }
            }

            if (targetColor === null) {
                map.delete(key)
                if (gravityPixelsRef.current.length > 0) {
                    const idx = gravityPixelsRef.current.findIndex(
                        (p) => p.r === r && p.c === c
                    )
                    if (idx !== -1) gravityPixelsRef.current.splice(idx, 1)
                }
                if (
                    internalPerspective === "square" &&
                    perspectiveProgressRef.current === 0 &&
                    staticCacheRef.current
                ) {
                    const ctx = staticCacheRef.current.getContext("2d", {
                        willReadFrequently: true,
                    })
                    if (ctx) {
                        const { x, y } = projectToScreen(
                            c,
                            r,
                            "square",
                            selectedPixelSize
                        )
                        ctx.clearRect(
                            x - 1,
                            y - 1,
                            selectedPixelSize + 2,
                            selectedPixelSize + 2
                        )
                    }
                }
            } else {
                map.set(key, targetColor)
                if (
                    internalPerspective === "square" &&
                    perspectiveProgressRef.current === 0 &&
                    staticCacheRef.current
                ) {
                    const ctx = staticCacheRef.current.getContext("2d", {
                        willReadFrequently: true,
                    })
                    if (ctx) {
                        const { x, y } = projectToScreen(
                            c,
                            r,
                            "square",
                            selectedPixelSize
                        )
                        ctx.clearRect(
                            x - 1,
                            y - 1,
                            selectedPixelSize + 2,
                            selectedPixelSize + 2
                        )
                        renderPixel(
                            ctx,
                            c,
                            r,
                            selectedPixelSize,
                            targetColor,
                            pixelStyle === "3d",
                            1,
                            perspective3D
                        )
                    }
                }
            }
        },
        [
            enableGamification,
            selectedPixelSize,
            pixelStyle,
            perspective3D,
            renderPixel,
            projectToScreen,
            internalPerspective,
            getIsoMetrics,
        ]
    )

    const floodFill = useCallback(
        (startRow: number, startCol: number, targetColor: string) => {
            const ext =
                internalPerspective === "isometric"
                    ? Math.max(gridSize.cols, gridSize.rows) * 2
                    : 0
            const minR = -ext
            const maxR = gridSize.rows + ext
            const minC = -ext
            const maxC = gridSize.cols + ext

            if (
                startRow < minR ||
                startRow >= maxR ||
                startCol < minC ||
                startCol >= maxC
            )
                return
            const map = pixelsRef.current
            const startKey = getPixelKey(startRow, startCol)
            const baseColor = map.get(startKey) || "transparent"
            if (baseColor === targetColor) return

            const stack: [number, number][] = [[startRow, startCol]]
            const visited = new Set<string>()
            const toFill = new Map<string, string>()

            while (stack.length > 0) {
                const [r, c] = stack.pop()!
                const currentKey = getPixelKey(r, c)
                if (visited.has(currentKey)) continue
                visited.add(currentKey)

                const currentColor = map.get(currentKey) || "transparent"
                if (currentColor === baseColor) {
                    toFill.set(currentKey, targetColor)

                    if (
                        symmetryMode === "vertical" ||
                        symmetryMode === "radial"
                    ) {
                        toFill.set(
                            getPixelKey(r, gridSize.cols - 1 - c),
                            targetColor
                        )
                    }
                    if (
                        symmetryMode === "horizontal" ||
                        symmetryMode === "radial"
                    ) {
                        toFill.set(
                            getPixelKey(gridSize.rows - 1 - r, c),
                            targetColor
                        )
                    }
                    if (symmetryMode === "radial") {
                        toFill.set(
                            getPixelKey(
                                gridSize.rows - 1 - r,
                                gridSize.cols - 1 - c
                            ),
                            targetColor
                        )
                    }

                    if (r > minR) stack.push([r - 1, c])
                    if (r < maxR - 1) stack.push([r + 1, c])
                    if (c > minC) stack.push([r, c - 1])
                    if (c < maxC - 1) stack.push([r, c + 1])
                }
            }

            if (toFill.size > 0) {
                for (const [k, v] of toFill.entries()) {
                    if (v === "transparent") {
                        pixelsRef.current.delete(k)
                        if (gravityPixelsRef.current.length > 0) {
                            const _idx = k.indexOf("_")
                            const kr = +k.slice(0, _idx)
                            const kc = +k.slice(_idx + 1)
                            const gIdx = gravityPixelsRef.current.findIndex(
                                (p) => p.r === kr && p.c === kc
                            )
                            if (gIdx !== -1)
                                gravityPixelsRef.current.splice(gIdx, 1)
                        }
                    } else {
                        pixelsRef.current.set(k, v)
                        if (
                            unsentFirebaseStatsRef &&
                            unsentFirebaseStatsRef.current
                        ) {
                            unsentFirebaseStatsRef.current.drawn += 1
                            sessionStatsRef.current.pixelsDrawn += 1
                            sessionStatsRef.current.toolsUsed.add("bucket")
                        }
                    }
                }
                saveHistory(pixelsRef.current)
                rebuildStaticCache()
                redrawArtwork()
            }
        },
        [
            gridSize,
            internalPerspective,
            pixelsRef,
            saveHistory,
            symmetryMode,
            rebuildStaticCache,
            redrawArtwork,
        ]
    )

    const applyBrushAction = useCallback(
        (row: number, col: number, color: string | null) => {
            trackEngineEvent(
                color === "transparent"
                    ? "engine_erase_pixel"
                    : "engine_draw_pixel",
                {},
                5000
            )
            if (unsentFirebaseStatsRef && unsentFirebaseStatsRef.current) {
                unsentFirebaseStatsRef.current.drawn += 1
                sessionStatsRef.current.pixelsDrawn += 1
                sessionStatsRef.current.toolsUsed.add("pencil")
            }
            const activeBrushSize = isMobile ? 1 : brushSize
            const brushOffset = Math.floor(activeBrushSize / 2)
            const ext =
                internalPerspective === "isometric"
                    ? Math.max(gridSize.cols, gridSize.rows) * 2
                    : 0
            const minR = -ext
            const maxR = gridSize.rows + ext
            const minC = -ext
            const maxC = gridSize.cols + ext

            for (let br = 0; br < activeBrushSize; br++) {
                for (let bc = 0; bc < activeBrushSize; bc++) {
                    const targetR = row + br - brushOffset
                    const targetC = col + bc - brushOffset
                    if (
                        targetR >= minR &&
                        targetR < maxR &&
                        targetC >= minC &&
                        targetC < maxC
                    ) {
                        applyDrawAction(targetR, targetC, color)
                        if (
                            symmetryMode === "vertical" ||
                            symmetryMode === "radial"
                        ) {
                            applyDrawAction(
                                targetR,
                                gridSize.cols - 1 - targetC,
                                color
                            )
                        }
                        if (
                            symmetryMode === "horizontal" ||
                            symmetryMode === "radial"
                        ) {
                            applyDrawAction(
                                gridSize.rows - 1 - targetR,
                                targetC,
                                color
                            )
                        }
                        if (symmetryMode === "radial") {
                            applyDrawAction(
                                gridSize.rows - 1 - targetR,
                                gridSize.cols - 1 - targetC,
                                color
                            )
                        }
                    }
                }
            }
        },
        [
            brushSize,
            isMobile,
            gridSize,
            symmetryMode,
            applyDrawAction,
            internalPerspective,
        ]
    )

    useEffect(() => {
        setSelectedPixelSize(pixelSize)
    }, [pixelSize])

    useEffect(() => {
        if (
            containerDimensions.width > 0 &&
            desktopToolbarRef.current &&
            !isMobile
        ) {
            const tRect = desktopToolbarRef.current.getBoundingClientRect()
            let startX = 24,
                startY = 24

            if (toolbarLayout === "horizontal-centered") {
                startX = (containerDimensions.width - tRect.width) / 2
                startY = toolbarPositionMode.includes("bottom")
                    ? containerDimensions.height - tRect.height - 24
                    : 24
            } else if (toolbarLayout === "vertical-centered") {
                startY = (containerDimensions.height - tRect.height) / 2
                startX = toolbarPositionMode.includes("right")
                    ? containerDimensions.width - tRect.width - 24
                    : 24
            } else {
                if (toolbarPositionMode === "top-right")
                    startX = containerDimensions.width - tRect.width - 24
                else if (toolbarPositionMode === "bottom-left")
                    startY = containerDimensions.height - tRect.height - 24
                else if (toolbarPositionMode === "bottom-right") {
                    startX = containerDimensions.width - tRect.width - 24
                    startY = containerDimensions.height - tRect.height - 24
                }
            }
            setToolbarPosition({ x: startX, y: startY })
        }
    }, [
        containerDimensions.width,
        containerDimensions.height,
        isMobile,
        toolbarPositionMode,
        toolbarLayout,
    ])

    useEffect(() => {
        if (
            containerDimensions.width > 0 &&
            desktopToolbarRef.current &&
            !isMobile
        ) {
            const tRect = desktopToolbarRef.current.getBoundingClientRect()
            setToolbarPosition((prev) => ({
                x: Math.max(
                    24,
                    Math.min(
                        prev.x,
                        containerDimensions.width - tRect.width - 24
                    )
                ),
                y: Math.max(
                    24,
                    Math.min(
                        prev.y,
                        containerDimensions.height - tRect.height - 24
                    )
                ),
            }))
        }
    }, [containerDimensions.width, containerDimensions.height, isMobile])

    useEffect(() => {
        const canvas = bgCanvasRef.current
        if (!canvas) return
        const bgCtx = canvas.getContext("2d", { alpha: false })
        if (!bgCtx) return

        bgCtx.fillStyle = backgroundColor
        bgCtx.fillRect(0, 0, canvas.width, canvas.height)

        if (!hideMedia && mediaSourceType !== "none" && mediaFile) return

        if (alternatePattern !== "none" && alternateColor) {
            const s = selectedPixelSize
            const pCanvas = document.createElement("canvas")
            pCanvas.width = s * 2
            pCanvas.height = s * 2
            const pCtx = pCanvas.getContext("2d")
            if (pCtx) {
                pCtx.fillStyle = backgroundColor
                pCtx.fillRect(0, 0, s * 2, s * 2)
                pCtx.fillStyle = alternateColor

                if (alternatePattern === "checkerboard") {
                    pCtx.fillRect(s, 0, s, s)
                    pCtx.fillRect(0, s, s, s)
                } else if (alternatePattern === "horizontal") {
                    pCtx.fillRect(0, s, s * 2, s)
                } else if (alternatePattern === "vertical") {
                    pCtx.fillRect(s, 0, s, s * 2)
                }

                const pattern = bgCtx.createPattern(pCanvas, "repeat")
                if (pattern) {
                    bgCtx.fillStyle = pattern
                    bgCtx.fillRect(0, 0, canvas.width, canvas.height)
                }
            }
        }
    }, [
        gridSize,
        selectedPixelSize,
        backgroundColor,
        alternatePattern,
        alternateColor,
        hideMedia,
        mediaSourceType,
        mediaFile,
    ])

    useEffect(() => {
        let isLoopActive = true
        const renderMedia = () => {
            if (!isLoopActive || isIdle || document.hidden) {
                if (isLoopActive)
                    animationFrameRef.current =
                        requestAnimationFrame(renderMedia)
                return
            }

            const mCanvas = mediaCanvasRef.current
            const tCanvas = tinyBufferCanvasRef.current
            if (!mCanvas || !tCanvas) {
                animationFrameRef.current = requestAnimationFrame(renderMedia)
                return
            }

            const mediaCtx = mCanvas.getContext("2d")
            if (!mediaCtx) return

            if (!hideMedia && mediaSourceType !== "none" && mediaFile) {
                const targetW = pixelateMedia ? gridSize.cols : mCanvas.width
                const targetH = pixelateMedia ? gridSize.rows : mCanvas.height

                tCanvas.width = targetW
                tCanvas.height = targetH
                const tCtx = tCanvas.getContext("2d")

                if (tCtx) {
                    tCtx.imageSmoothingEnabled = false
                    let frameRendered = false

                    const drawAdvancedMedia = (
                        ctx: CanvasRenderingContext2D,
                        source: HTMLVideoElement | HTMLImageElement,
                        isVideo: boolean
                    ) => {
                        const srcW = isVideo
                            ? (source as HTMLVideoElement).videoWidth
                            : source.naturalWidth || source.width
                        const srcH = isVideo
                            ? (source as HTMLVideoElement).videoHeight
                            : source.naturalHeight || source.height
                        if (!srcW || !srcH) return false

                        let drawW, drawH, drawX, drawY

                        if (mediaFitMode === "custom") {
                            drawW = srcW * mediaScale
                            drawH = srcH * mediaScale
                            drawX = (targetW - drawW) / 2 + mediaOffsetX
                            drawY = (targetH - drawH) / 2 + mediaOffsetY
                        } else {
                            const scaleCover = Math.max(
                                targetW / srcW,
                                targetH / srcH
                            )
                            const scaleContain = Math.min(
                                targetW / srcW,
                                targetH / srcH
                            )
                            const finalScale =
                                mediaFitMode === "contain"
                                    ? scaleContain
                                    : scaleCover
                            drawW = srcW * finalScale
                            drawH = srcH * finalScale
                            drawX = (targetW - drawW) / 2
                            drawY = (targetH - drawH) / 2
                        }

                        ctx.drawImage(source, drawX, drawY, drawW, drawH)
                        return true
                    }

                    if (
                        mediaSourceType === "video" &&
                        videoRef.current &&
                        videoRef.current.readyState >= 2
                    ) {
                        frameRendered = drawAdvancedMedia(
                            tCtx,
                            videoRef.current,
                            true
                        )
                    } else if (
                        mediaSourceType === "image" &&
                        imageRef.current &&
                        imageRef.current.complete
                    ) {
                        frameRendered = drawAdvancedMedia(
                            tCtx,
                            imageRef.current,
                            false
                        )
                    }

                    if (frameRendered) {
                        mediaCtx.globalAlpha = mediaOpacity
                        mediaCtx.imageSmoothingEnabled = !pixelateMedia
                        mediaCtx.clearRect(0, 0, mCanvas.width, mCanvas.height)
                        mediaCtx.drawImage(
                            tCanvas,
                            0,
                            0,
                            mCanvas.width,
                            mCanvas.height
                        )
                        mediaCtx.globalAlpha = 1.0
                    }
                }
            } else {
                mediaCtx.clearRect(0, 0, mCanvas.width, mCanvas.height)
            }

            if (
                !hideMedia &&
                isMediaPlaying &&
                (mediaSourceType === "video" || mediaSourceType === "image")
            ) {
                animationFrameRef.current = requestAnimationFrame(renderMedia)
            }
        }
        renderMedia()
        return () => {
            isLoopActive = false
            if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current)
        }
    }, [
        gridSize,
        selectedPixelSize,
        mediaSourceType,
        isMediaPlaying,
        mediaFile,
        hideMedia,
        isIdle,
        mediaFitMode,
        mediaScale,
        mediaOffsetX,
        mediaOffsetY,
        mediaOpacity,
        pixelateMedia,
    ])

    const drawGrid = useCallback(() => {
        const canvas = gridCanvasRef.current
        if (!canvas || canvas.width <= 0 || canvas.height <= 0) return
        const gridCtx = canvas.getContext("2d", { alpha: true })
        if (!gridCtx) return
        try {
            gridCtx.clearRect(0, 0, canvas.width, canvas.height)
            if (internalGrid) {
                gridCtx.strokeStyle = gridColor
                gridCtx.lineWidth = 1
                gridCtx.beginPath()

                const pxSize = Math.max(2, selectedPixelSize || 20)
                const numCols = Math.max(
                    1,
                    Math.min(250, Math.max(gridSize.cols || 16, Math.ceil(canvas.width / pxSize) + 1))
                )
                const numRows = Math.max(
                    1,
                    Math.min(250, Math.max(gridSize.rows || 16, Math.ceil(canvas.height / pxSize) + 1))
                )

                const ext = Math.min(
                    50,
                    Math.ceil(
                        Math.max(numCols, numRows) *
                            (perspectiveProgressRef.current || 0)
                    )
                )
                for (let row = -ext; row <= numRows + ext; row++) {
                    const start = projectToScreen(
                        -ext,
                        row,
                        internalPerspective,
                        pxSize
                    )
                    const end = projectToScreen(
                        numCols + ext,
                        row,
                        internalPerspective,
                        pxSize
                    )
                    gridCtx.moveTo(start.x, start.y)
                    gridCtx.lineTo(end.x, end.y)
                }
                for (let col = -ext; col <= numCols + ext; col++) {
                    const start = projectToScreen(
                        col,
                        -ext,
                        internalPerspective,
                        pxSize
                    )
                    const end = projectToScreen(
                        col,
                        numRows + ext,
                        internalPerspective,
                        pxSize
                    )
                    gridCtx.moveTo(start.x, start.y)
                    gridCtx.lineTo(end.x, end.y)
                }
                gridCtx.stroke()
            }
        } catch (e) {
            // Guard against canvas resize race conditions
        }
    }, [
        gridSize,
        selectedPixelSize,
        internalGrid,
        gridColor,
        internalPerspective,
        projectToScreen,
    ])

    useEffect(() => {
        drawGrid()
    }, [drawGrid])

    const syncDimensions = useCallback(() => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const clientW = containerRef.current.clientWidth
        const clientH = containerRef.current.clientHeight
        const winW = typeof window !== "undefined" ? window.innerWidth : 1200
        const winH = typeof window !== "undefined" ? window.innerHeight : 800

        const w = Math.max(10, Math.round(rect.width || clientW || winW || 600))
        const h = Math.max(10, Math.round(rect.height || clientH || winH || 400))

        const pxSize = Math.max(2, selectedPixelSize || 20)
        const cols = Math.ceil(w / pxSize) + 2
        const rows = Math.ceil(h / pxSize) + 2

        setContainerDimensions((prev) => {
            if (Math.abs(prev.width - w) <= 2 && Math.abs(prev.height - h) <= 2) return prev
            return { width: w, height: h }
        })

        setGridSize((prev) => {
            if (prev.cols === cols && prev.rows === rows) return prev
            return { cols, rows }
        })

        const canvases = [
            bgCanvasRef.current,
            mediaCanvasRef.current,
            gridCanvasRef.current,
            artworkCanvasRef.current,
            previewCanvasRef.current,
        ]
        for (const c of canvases) {
            if (c) {
                if (c.width !== w || c.height !== h) {
                    c.width = w
                    c.height = h
                }
            }
        }
        if (!staticCacheRef.current) {
            staticCacheRef.current = document.createElement("canvas")
        }
        if (
            staticCacheRef.current.width !== w ||
            staticCacheRef.current.height !== h
        ) {
            staticCacheRef.current.width = w
            staticCacheRef.current.height = h
            try {
                rebuildStaticCache()
            } catch (e) {}
        }
        try {
            drawGrid()
            redrawArtwork()
        } catch (e) {}
    }, [selectedPixelSize, drawGrid, redrawArtwork, rebuildStaticCache])

    const syncDimensionsRef = useRef(syncDimensions)
    syncDimensionsRef.current = syncDimensions

    useLayoutEffect(() => {
        const runSync = () => {
            if (syncDimensionsRef.current) syncDimensionsRef.current()
        }
        runSync()
        const raf1 = requestAnimationFrame(() => {
            runSync()
            const raf2 = requestAnimationFrame(() => {
                runSync()
            })
            return () => cancelAnimationFrame(raf2)
        })
        const t1 = setTimeout(runSync, 30)
        const t2 = setTimeout(runSync, 100)
        const t3 = setTimeout(runSync, 300)
        const t4 = setTimeout(runSync, 600)

        return () => {
            cancelAnimationFrame(raf1)
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
            clearTimeout(t4)
        }
    }, [])

    useEffect(() => {
        if (!containerRef.current) return
        let rafId: number | null = null
        const handleObs = () => {
            if (rafId !== null) return
            rafId = requestAnimationFrame(() => {
                rafId = null
                if (syncDimensionsRef.current) {
                    syncDimensionsRef.current()
                }
            })
        }
        const observer = new ResizeObserver(handleObs)
        observer.observe(containerRef.current)
        window.addEventListener("resize", handleObs)
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId)
            observer.disconnect()
            window.removeEventListener("resize", handleObs)
        }
    }, [])

    // Animation Loop for Perspective morphing
    useEffect(() => {
        const target = internalPerspective === "isometric" ? 1 : 0
        if (target === perspectiveProgressRef.current) return

        let start = performance.now()
        let initial = perspectiveProgressRef.current
        let animationFrame: number

        const animate = (time: number) => {
            const elapsed = time - start
            const duration = 400
            let t = Math.min(elapsed / duration, 1)
            t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease-in-out

            if (t < 1) {
                perspectiveProgressRef.current =
                    initial + (target - initial) * t
                animationFrame = requestAnimationFrame(animate)
            } else {
                perspectiveProgressRef.current = target
            }

            rebuildStaticCache()
            drawGrid()
            redrawArtwork()
        }
        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [internalPerspective, drawGrid, redrawArtwork, rebuildStaticCache])

    const commitText = useCallback(() => {
        const typeText = typeTextRef.current
        if (!typePos || !typeText.trim()) {
            setTypePos(null)
            typeTextRef.current = ""
            if (hiddenInputRef.current) hiddenInputRef.current.value = ""
            return
        }

        let changed = false
        let currentCol = typePos.col
        let currentRow = typePos.row

        for (let i = 0; i < typeText.length; i++) {
            if (typeText[i] === "\n") {
                currentCol = typePos.col
                currentRow += 6
                continue
            }

            const char = typeText[i].toUpperCase()
            const fontDef = PIXEL_FONT[char] || PIXEL_FONT["?"]
            let charWidth = 0

            for (let r = 0; r < fontDef.length; r++) {
                const rowStr = fontDef[r]
                charWidth = Math.max(charWidth, rowStr.length)
                for (let c = 0; c < rowStr.length; c++) {
                    if (rowStr[c] === "1") {
                        let gridR = currentRow + r
                        let gridC = currentCol + c
                        if (char === "," || char === ";") gridR += 1

                        const ext =
                            internalPerspective === "isometric"
                                ? Math.max(gridSize.cols, gridSize.rows)
                                : 0
                        if (
                            gridR >= -ext &&
                            gridR < gridSize.rows + ext &&
                            gridC >= -ext &&
                            gridC < gridSize.cols + ext
                        ) {
                            applyDrawAction(gridR, gridC, currentDrawColor)
                            changed = true
                        }
                    }
                }
            }
            currentCol += charWidth + 1
        }

        if (changed) {
            rebuildStaticCache()
            redrawArtwork()
            saveHistory(new Map(pixelsRef.current))
        }

        setTypePos(null)
        typeTextRef.current = ""
        if (hiddenInputRef.current) hiddenInputRef.current.value = ""
    }, [
        typePos,
        applyDrawAction,
        redrawArtwork,
        saveHistory,
        currentDrawColor,
        gridSize,
        internalPerspective,
    ])

    useEffect(() => {
        if (isTypeMode) {
            setIsErasing(false)
            setIsBucketMode(false)
            setIsEyedropperActive(false)
        } else {
            if (typePos && typeTextRef.current.trim().length > 0) {
                commitText()
            }
        }
    }, [isTypeMode, typePos, commitText])

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            initAudio()
            containerRef.current?.focus()
            const canvas = artworkCanvasRef.current
            if (!canvas) return
            e.currentTarget.setPointerCapture(e.pointerId)
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.width / rect.width
            const scaleY = canvas.height / rect.height
            const mx = (e.clientX - rect.left) * scaleX
            const my = (e.clientY - rect.top) * scaleY

            const { col, row } = projectToGrid(
                mx,
                my,
                internalPerspective,
                selectedPixelSize
            )
            const isRightClick = e.buttons === 2

            mousePosRef.current = { x: mx, y: my }

            if (isTypeMode) {
                if (typePos) commitText()
                setTypePos({ row, col })
                typeTextRef.current = ""
                if (hiddenInputRef.current) hiddenInputRef.current.value = ""
                setTimeout(() => {
                    hiddenInputRef.current?.focus()
                }, 10)
                return
            }

            if (isEyedropperActive) {
                const key = `${row}_${col}`
                const clickedColor =
                    pixelsRef.current.get(key) || backgroundColor
                setCurrentDrawColor(clickedColor)
                setIsEyedropperActive(false)
                return
            }

            if (showCompanion && !(hideCompanionOnMobile && isMobile)) {
                const bx = buddyPhysRef.current.x
                const by = buddyPhysRef.current.y

                if (
                    mx >= bx &&
                    mx <= bx + companionSize &&
                    my >= by &&
                    my <= by + companionSize
                ) {
                    isDraggingBuddyRef.current = true
                    trackEngineEvent("engine_buddy_interact", {}, 5000)
                    dragBuddyOffsetRef.current = {
                        dx: mx - buddyPhysRef.current.x,
                        dy: my - buddyPhysRef.current.y,
                    }
                    if (artworkCanvasRef.current) {
                        artworkCanvasRef.current.style.cursor = "grabbing"
                    }
                    e.currentTarget.setPointerCapture(e.pointerId)

                    const messages = [
                        "System online.",
                        "Ready.",
                        "Grid is active.",
                    ]
                    setBuddyMessage(
                        messages[Math.floor(Math.random() * messages.length)],
                        2000
                    )

                    return
                }
            }

            if (!hasInteracted) {
                setHasInteracted(true)
                if (
                    mediaSourceType !== "none" &&
                    mediaFile &&
                    tinyBufferCanvasRef.current &&
                    pixelateMedia
                ) {
                    setHideMedia(true)
                    setIsMediaPlaying(false)
                    const capturedMap = new Map(pixelsRef.current)
                    const tCtx = tinyBufferCanvasRef.current.getContext("2d", {
                        willReadFrequently: true,
                    })
                    if (tCtx) {
                        try {
                            const imgData = tCtx.getImageData(
                                0,
                                0,
                                gridSize.cols,
                                gridSize.rows
                            ).data
                            for (let r = 0; r < gridSize.rows; r++) {
                                for (let c = 0; c < gridSize.cols; c++) {
                                    const i = (r * gridSize.cols + c) * 4
                                    if (imgData[i + 3] > 128)
                                        capturedMap.set(
                                            `${r}_${c}`,
                                            `rgb(${imgData[i]}, ${imgData[i + 1]}, ${imgData[i + 2]})`
                                        )
                                }
                            }
                        } catch (err) {}
                    }
                    pixelsRef.current = capturedMap
                    rebuildStaticCache()
                    redrawArtwork()
                    setHistory([new Map(capturedMap)])
                    setHistoryStep(0)
                }
            }
            setIsDrawing(true)
            isDrawingRef.current = true
            lastPosRef.current = { row, col }
            lastScreenPosRef.current = { x: mx, y: my }

            if (isBucketMode) {
                const targetColor =
                    isRightClick || isErasing ? "transparent" : currentDrawColor
                floodFill(row, col, targetColor)
                lastFillPosRef.current = `${row}_${col}`
                return
            }
            applyBrushAction(
                row,
                col,
                isRightClick || isErasing ? null : currentDrawColor
            )
            if (
                internalPerspective === "isometric" ||
                perspectiveProgressRef.current > 0
            ) {
                rebuildStaticCache()
            }
            redrawArtwork()
        },
        [
            selectedPixelSize,
            isBucketMode,
            isErasing,
            currentDrawColor,
            floodFill,
            applyBrushAction,
            hasInteracted,
            mediaSourceType,
            mediaFile,
            gridSize,
            rebuildStaticCache,
            redrawArtwork,
            pixelateMedia,
            isEyedropperActive,
            backgroundColor,
            showCompanion,
            hideCompanionOnMobile,
            isMobile,
            companionSize,
            typePos,
            isTypeMode,
            commitText,
            internalPerspective,
            projectToGrid,
            selectedPixelSize,
            applyBrushAction,
            currentDrawColor,
        ]
    )

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = artworkCanvasRef.current
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.width / rect.width
            const scaleY = canvas.height / rect.height
            const mx = (e.clientX - rect.left) * scaleX
            const my = (e.clientY - rect.top) * scaleY

            mousePosRef.current = { x: mx, y: my }
            const { col, row } = projectToGrid(
                mx,
                my,
                internalPerspective,
                selectedPixelSize
            )

            // Zero-latency instantaneous hover pop check in input handler
            if (
                enableGamification &&
                collectiblesRef.current.size > 0 &&
                !isDrawingRef.current
            ) {
                let hoveredKey = null
                for (const [ckey, data] of collectiblesRef.current.entries()) {
                    const _cidx = ckey.indexOf("_")
                    const cr = +ckey.slice(0, _cidx)
                    const cc = +ckey.slice(_cidx + 1)
                    const s = data.sizeMult || 1
                    const pxSize = selectedPixelSize * s

                    const { x: ox, y: oy } = projectToScreen(
                        cc,
                        cr,
                        internalPerspective,
                        selectedPixelSize
                    )
                    const cx =
                        internalPerspective === "square"
                            ? ox + selectedPixelSize / 2
                            : ox
                    const cy =
                        internalPerspective === "square"
                            ? oy + selectedPixelSize / 2
                            : oy + selectedPixelSize * 0.5

                    if (Math.hypot(mx - cx, my - cy) < pxSize * 0.8) {
                        hoveredKey = ckey
                        break
                    }
                }

                if (hoveredKey) {
                    const poppedData = collectiblesRef.current.get(hoveredKey)
                    collectiblesRef.current.delete(hoveredKey)
                    if (
                        unsentFirebaseStatsRef &&
                        unsentFirebaseStatsRef.current
                    ) {
                        unsentFirebaseStatsRef.current.popped += 1
                        sessionStatsRef.current.pixelsPopped += 1
                    }
                    const type = poppedData.type || "gold"
                    const points =
                        type === "rainbow" ? 5 : type === "neon" ? 3 : 1
                    const now = performance.now()
                    if (now - lastPopTimeRef.current < 2500) {
                        comboCountRef.current++
                        if (comboCountRef.current > 15)
                            comboMultiplierRef.current = 5
                        else if (comboCountRef.current > 7)
                            comboMultiplierRef.current = 3
                        else if (comboCountRef.current > 3)
                            comboMultiplierRef.current = 2
                    } else {
                        comboCountRef.current = 1
                        comboMultiplierRef.current = 1
                    }
                    lastPopTimeRef.current = now
                    scoreRef.current += points * comboMultiplierRef.current
                    notifyStats()
                    playPopSound(
                        type === "rainbow" ? 1200 : type === "neon" ? 900 : 600
                    )

                    if (comboMultiplierRef.current >= 3) {
                        buddyHypeRef.current = 1
                        setBuddyMessage(
                            `COMBO X${comboMultiplierRef.current}!!!`,
                            1500
                        )
                    } else {
                        buddyHypeRef.current = 1
                    }

                    const _hidx = hoveredKey.indexOf("_")
                    const cr = +hoveredKey.slice(0, _hidx)
                    const cc = +hoveredKey.slice(_hidx + 1)
                    const { x, y } = projectToScreen(
                        cc,
                        cr,
                        internalPerspective,
                        selectedPixelSize
                    )
                    const contW =
                        containerDimensions.width ||
                        (typeof window !== "undefined"
                            ? window.innerWidth
                            : 800)
                    const contH =
                        containerDimensions.height ||
                        (typeof window !== "undefined"
                            ? window.innerHeight
                            : 600)
                    const isoScale =
                        internalPerspective === "isometric"
                            ? Math.min(
                                  1,
                                  (contW - 40) / canvasTotalWidth,
                                  (contH - 40) / (canvasTotalHeight * 0.55)
                              )
                            : 1
                    const s = poppedData.sizeMult || 1
                    const pxSize = selectedPixelSize * s * isoScale
                    const cx =
                        internalPerspective === "square" ? x + pxSize / 2 : x
                    const cy =
                        internalPerspective === "square"
                            ? y + pxSize / 2
                            : y + pxSize * 0.5

                    const colorStr =
                        type === "rainbow"
                            ? "0, 255, 255"
                            : type === "neon"
                              ? "255, 0, 100"
                              : "255, 215, 0"
                    for (let i = 0; i < 25; i++) {
                        particlesRef.current.push({
                            x: cx,
                            y: cy,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15 - 2,
                            life: 500 + Math.random() * 500,
                            maxLife: 1000,
                            size: Math.random() * 5 + 2,
                            color: colorStr,
                        })
                    }
                }
            }

            if (isEyedropperActive && eyedropperPreviewRef.current) {
                const key = `${row}_${col}`
                const hoveredColor =
                    pixelsRef.current.get(key) || backgroundColor
                eyedropperPreviewRef.current.style.backgroundColor =
                    hoveredColor
                eyedropperPreviewRef.current.style.left = `${e.clientX + 15}px`
                eyedropperPreviewRef.current.style.top = `${e.clientY + 15}px`
            }

            if (showCompanion && !isMobile) {
                const cx = buddyPhysRef.current.x + companionSize / 2
                const cy = buddyPhysRef.current.y + companionSize / 2
                const hitRange = companionSize / 2 + 10

                const wasHovering = isHoveringBuddyRef.current
                const isHovering =
                    Math.abs(mx - cx) < hitRange && Math.abs(my - cy) < hitRange
                isHoveringBuddyRef.current = isHovering

                if (isHovering !== wasHovering) {
                    if (artworkCanvasRef.current) {
                        artworkCanvasRef.current.style.cursor = isHovering
                            ? isDraggingBuddyRef.current
                                ? "grabbing"
                                : "grab"
                            : getCursorStyle()
                    }
                }
            }

            if (isDraggingBuddyRef.current) {
                const hudPaddingX = 102
                const hudPaddingY = 100
                let newX = mx - dragBuddyOffsetRef.current.dx
                let newY = my - dragBuddyOffsetRef.current.dy
                newX = Math.max(
                    hudPaddingX,
                    Math.min(
                        newX,
                        canvasTotalWidth - companionSize - hudPaddingX
                    )
                )
                newY = Math.max(
                    hudPaddingY,
                    Math.min(
                        newY,
                        canvasTotalHeight - companionSize - hudPaddingY
                    )
                )
                buddyStateRef.current = { x: newX, y: newY, userMoved: true }
                return
            }

            if (
                activeHoverTrail &&
                !isDrawingRef.current &&
                !isIdle &&
                !isEyedropperActive &&
                !isHoveringBuddyRef.current
            ) {
                const isRightClick = e.buttons === 2
                const previewColor =
                    isErasing || (isRightClick && isBucketMode)
                        ? "rgba(255, 255, 255, 0.7)"
                        : currentDrawColor

                let p = perspective3D
                if (activeDynamic3D && pixelStyle === "3d") {
                    const { x, y } = projectToScreen(
                        col,
                        row,
                        internalPerspective,
                        selectedPixelSize
                    )
                    const px = x + selectedPixelSize / 2
                    const py = y + selectedPixelSize / 2
                    const isLeft = px > mx
                    const isTop = py > my
                    if (isTop && isLeft) p = "top-left"
                    else if (isTop && !isLeft) p = "top-right"
                    else if (!isTop && isLeft) p = "bottom-left"
                    else p = "bottom-right"
                }

                const particles = trailParticlesRef.current
                if (
                    particles.length === 0 ||
                    particles[particles.length - 1].r !== row ||
                    particles[particles.length - 1].c !== col
                ) {
                    const activeBrushSize = isMobile ? 1 : brushSize
                    if (!isBucketMode) {
                        for (let br = 0; br < activeBrushSize; br++) {
                            for (let bc = 0; bc < activeBrushSize; bc++) {
                                particles.push({
                                    r: row + br,
                                    c: col + bc,
                                    color: previewColor,
                                    life: 1.0,
                                    mx,
                                    my,
                                    p,
                                })
                                if (
                                    symmetryMode === "vertical" ||
                                    symmetryMode === "radial"
                                )
                                    particles.push({
                                        r: row + br,
                                        c: gridSize.cols - 1 - (col + bc),
                                        color: previewColor,
                                        life: 1.0,
                                        mx,
                                        my,
                                        p,
                                    })
                                if (
                                    symmetryMode === "horizontal" ||
                                    symmetryMode === "radial"
                                )
                                    particles.push({
                                        r: gridSize.rows - 1 - (row + br),
                                        c: col + bc,
                                        color: previewColor,
                                        life: 1.0,
                                        mx,
                                        my,
                                        p,
                                    })
                                if (symmetryMode === "radial")
                                    particles.push({
                                        r: gridSize.rows - 1 - (row + br),
                                        c: gridSize.cols - 1 - (col + bc),
                                        color: previewColor,
                                        life: 1.0,
                                        mx,
                                        my,
                                        p,
                                    })
                            }
                        }
                    } else {
                        particles.push({
                            r: row,
                            c: col,
                            color: previewColor,
                            life: 1.0,
                            mx,
                            my,
                            p,
                        })
                    }
                    if (particles.length > 80) particles.shift()
                }
            }

            if (
                !isDrawingRef.current ||
                !lastPosRef.current ||
                !lastScreenPosRef.current
            )
                return
            if (e.cancelable) e.preventDefault()
            const isRightClick = e.buttons === 2

            if (isBucketMode) {
                const p = projectToGrid(
                    mx,
                    my,
                    internalPerspective,
                    selectedPixelSize
                )
                const key = `${p.row}_${p.col}`
                if (key !== lastFillPosRef.current) {
                    lastFillPosRef.current = key
                    const targetColor =
                        isRightClick || isErasing
                            ? "transparent"
                            : currentDrawColor
                    floodFill(p.row, p.col, targetColor)
                }
                return
            }

            const lastX = lastScreenPosRef.current.x
            const lastY = lastScreenPosRef.current.y
            const dist = Math.hypot(mx - lastX, my - lastY)
            const stepSize = Math.max(4, Math.floor(selectedPixelSize * 0.4))
            const steps = Math.max(1, Math.ceil(dist / stepSize))

            const touched = new Set<string>()
            for (let i = 0; i <= steps; i++) {
                const t = i / steps
                const ix = lastX + (mx - lastX) * t
                const iy = lastY + (my - lastY) * t
                const p = projectToGrid(
                    ix,
                    iy,
                    internalPerspective,
                    selectedPixelSize
                )

                const key = `${p.row}_${p.col}`
                if (!touched.has(key)) {
                    touched.add(key)
                    const color =
                        isRightClick || isErasing ? null : currentDrawColor
                    applyBrushAction(p.row, p.col, color)
                }
            }

            if (touched.size > 0) {
                if (
                    internalPerspective === "isometric" ||
                    perspectiveProgressRef.current > 0
                ) {
                    rebuildStaticCache()
                }
                redrawArtwork()
            }

            lastScreenPosRef.current = { x: mx, y: my }
            lastPosRef.current = { row, col }
        },
        [
            enableGamification,
            isBucketMode,
            isErasing,
            currentDrawColor,
            applyBrushAction,
            selectedPixelSize,
            brushSize,
            isMobile,
            activeHoverTrail,
            floodFill,
            isIdle,
            symmetryMode,
            gridSize,
            activeDynamic3D,
            pixelStyle,
            perspective3D,
            isEyedropperActive,
            internalPerspective,
            projectToGrid,
            projectToScreen,
            companionSize,
            redrawArtwork,
            applyBrushAction,
            currentDrawColor,
            isErasing,
        ]
    )

    const handlePointerUp = useCallback(
        (e: React.PointerEvent<HTMLCanvasElement>) => {
            e.currentTarget.releasePointerCapture(e.pointerId)
            if (isDraggingBuddyRef.current) {
                isDraggingBuddyRef.current = false
                if (artworkCanvasRef.current) {
                    artworkCanvasRef.current.style.cursor =
                        isHoveringBuddyRef.current ? "grab" : getCursorStyle()
                }
                return
            }
            if (isDrawingRef.current) {
                setIsDrawing(false)
                isDrawingRef.current = false
                saveHistory(new Map(pixelsRef.current))
                notifyStats()
            }
            lastPosRef.current = null
            lastFillPosRef.current = null
        },
        [saveHistory, rebuildStaticCache, redrawArtwork, internalPerspective]
    )

    const handleClear = useCallback(() => {
        trackEngineEvent("engine_clear_canvas")
        pixelsRef.current = new Map()
        gravityPixelsRef.current = []
        rebuildStaticCache()
        redrawArtwork()
        saveHistory(new Map())
        notifyStats()
    }, [saveHistory, rebuildStaticCache, redrawArtwork, notifyStats])

    const handleToolbarMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (isMobile) return
            if (desktopToolbarRef.current) {
                const rect = desktopToolbarRef.current.getBoundingClientRect()
                startTransition(() => {
                    setIsDraggingToolbar(true)
                    setDragOffset({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    })
                })
            }
            e.stopPropagation()
        },
        [isMobile]
    )

    const handleToolbarMouseMove = useCallback(
        (e: MouseEvent) => {
            if (
                isDraggingToolbar &&
                containerRef.current &&
                desktopToolbarRef.current
            ) {
                const cRect = containerRef.current.getBoundingClientRect()
                const tRect = desktopToolbarRef.current.getBoundingClientRect()
                let newX = e.clientX - cRect.left - dragOffset.x
                let newY = e.clientY - cRect.top - dragOffset.y
                newX = Math.max(
                    24,
                    Math.min(newX, cRect.width - tRect.width - 24)
                )
                newY = Math.max(
                    24,
                    Math.min(newY, cRect.height - tRect.height - 24)
                )
                startTransition(() => setToolbarPosition({ x: newX, y: newY }))
            }
        },
        [isDraggingToolbar, dragOffset]
    )

    const handleToolbarMouseUp = useCallback(() => {
        startTransition(() => setIsDraggingToolbar(false))
    }, [])

    const handleShareArt = useCallback(async () => {
        if (
            !bgCanvasRef.current ||
            !mediaCanvasRef.current ||
            !artworkCanvasRef.current ||
            !gridCanvasRef.current
        )
            return
        try {
            const exportCanvas = document.createElement("canvas")
            exportCanvas.width = canvasTotalWidth * exportScale
            exportCanvas.height = canvasTotalHeight * exportScale
            const eCtx = exportCanvas.getContext("2d")
            if (!eCtx) return

            eCtx.scale(exportScale, exportScale)
            eCtx.fillStyle = backgroundColor
            eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            eCtx.drawImage(bgCanvasRef.current, 0, 0)
            if (mediaSourceType !== "none" && mediaFile && !hideMedia)
                eCtx.drawImage(mediaCanvasRef.current, 0, 0)
            if (showGrid) eCtx.drawImage(gridCanvasRef.current, 0, 0)
            eCtx.drawImage(artworkCanvasRef.current, 0, 0)

            const dataUrl = exportCanvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.download = `pixel-art-${exportScale}x.png`
            link.href = dataUrl
            link.click()
        } catch (error) {}
    }, [
        gridSize,
        selectedPixelSize,
        backgroundColor,
        mediaSourceType,
        mediaFile,
        hideMedia,
        showGrid,
        exportScale,
    ])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                handleToolbarMouseMove(e)
            }
            window.addEventListener("mouseup", handleToolbarMouseUp)
            window.addEventListener("touchend", handleToolbarMouseUp)
            window.addEventListener("mousemove", handleGlobalMouseMove)
            return () => {
                window.removeEventListener("mouseup", handleToolbarMouseUp)
                window.removeEventListener("touchend", handleToolbarMouseUp)
                window.removeEventListener("mousemove", handleGlobalMouseMove)
            }
        }
    }, [handleToolbarMouseUp, handleToolbarMouseMove])

    const isHorizontal =
        toolbarLayout === "horizontal" ||
        toolbarLayout === "horizontal-centered" ||
        isMobile
    const isVertical =
        toolbarLayout === "vertical" || toolbarLayout === "vertical-centered"
    const isBox = toolbarLayout === "box"

    const getDesktopToolbarStyle = () => {
        const baseStyle = {
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 0,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backgroundColor: "rgba(10, 14, 20, 0.95)",
            gap: "8px",
        }

        if (isMobile) {
            return {
                ...baseStyle,
                flexDirection: "row" as const,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 0,
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                boxSizing: "border-box",
            }
        }
        return {
            ...baseStyle,
            flexDirection: "column" as const,
            width: "auto",
            padding: "10px 8px",
        }
    }

    const hasDrawingTools =
        showPencil ||
        showTypeTool ||
        showEraser ||
        showBucket ||
        showSymmetry ||
        showEyedropper
    const hasUtilityTools =
        (showMediaControls && !hasInteracted && mediaFile) ||
        showClear ||
        showDownload

    const btnBaseStyle = {
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0,
        transition: "all 0.15s ease",
        width: 32,
        height: 32,
        flexShrink: 0,
    }
    const isLightToolbar =
        toolbarTheme === "light" ||
        uiTheme === "light" ||
        uiTheme === "glass-light" ||
        (themeConfig && !themeConfig.isDark)

    const resolvedAccent = themeConfig ? themeConfig.accent : (isLightToolbar ? "#2563EB" : "#00FFCC")
    const resolvedAccentGlow = themeConfig ? themeConfig.accentGlow : (isLightToolbar ? "rgba(37, 99, 235, 0.25)" : "rgba(0, 255, 204, 0.3)")
    const resolvedToolbarBg = themeConfig ? themeConfig.windowTitleBg : (isLightToolbar ? "rgba(255, 255, 255, 0.96)" : "rgba(10, 14, 20, 0.95)")
    const resolvedToolbarBorder = themeConfig ? themeConfig.windowBorder : (isLightToolbar ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)")
    const resolvedCardBorder = themeConfig ? themeConfig.cardBorder : (isLightToolbar ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)")
    const resolvedText = themeConfig ? themeConfig.textPrimary : (isLightToolbar ? "#0F172A" : t.text)
    const resolvedTextSecondary = themeConfig ? themeConfig.textSecondary : (isLightToolbar ? "#475569" : t.text)
    const resolvedTagBg = themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 255, 204, 0.12)")

    const getToolStyle = (isActive: boolean) => ({
        ...btnBaseStyle,
        backgroundColor: isActive
            ? (themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 255, 204, 0.15)"))
            : "transparent",
        color: isActive
            ? resolvedAccent
            : resolvedTextSecondary,
        border: `1px solid ${isActive ? resolvedAccent : "transparent"}`,
        boxShadow: isActive ? `0 0 8px ${resolvedAccentGlow}` : "none",
        transition: "all 0.15s ease",
    })
    const getUtilityStyle = (isActive: boolean) => ({
        ...btnBaseStyle,
        backgroundColor: isActive
            ? (themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 255, 204, 0.15)"))
            : "transparent",
        color: isActive ? resolvedAccent : resolvedTextSecondary,
        border: `1px solid ${isActive ? resolvedAccent : "transparent"}`,
        transition: "all 0.15s ease",
    })

    const toolbarBaseWrapperStyle: React.CSSProperties = {
        backgroundColor: resolvedToolbarBg,
        border: `1px solid ${resolvedToolbarBorder}`,
        boxShadow: themeConfig
            ? `0 12px 32px rgba(0,0,0,0.5), 0 0 16px ${resolvedAccentGlow}`
            : (isLightToolbar ? "0 12px 32px rgba(0,0,0,0.08)" : "0 12px 32px rgba(0,0,0,0.6)"),
        borderRadius: 0,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        pointerEvents: "auto",
        maxHeight: "90vh",
        overflowY: "auto",
        scrollbarWidth: "none",
        color: resolvedText,
    }

    const dividerStyle = {
        width: isHorizontal ? 1 : "100%",
        height: isHorizontal ? 24 : 1,
        backgroundColor: resolvedCardBorder,
        flexShrink: 0,
        margin: isHorizontal ? "0 4px" : "4px 0",
    }

    const getTopPillPosition = (): React.CSSProperties => {
        const base = {
            top: 24,
            left: 24,
            right: "auto",
            bottom: "auto",
            transform: "none",
        }
        if (isMobile)
            return {
                top: "auto",
                left: 0,
                right: 0,
                bottom: 0,
                transform: "none",
            }
        switch (topPillPosition) {
            case "top-right":
                return { ...base, left: "auto", right: 24 }
            case "bottom-left":
                return { ...base, top: "auto", bottom: 24 }
            case "bottom-right":
                return {
                    ...base,
                    top: "auto",
                    left: "auto",
                    bottom: 24,
                    right: 24,
                }
            case "top-center":
                return { ...base, left: "50%", transform: "translateX(-50%)" }
            case "top-left":
            default:
                return base
        }
    }

    const getBottomPillPosition = (): React.CSSProperties => {
        let bottomOffset = isMobile ? 76 : 24
        if (!isMobile && toolbarPositionMode.includes("bottom")) {
            if (isHorizontal) bottomOffset = 80
            else if (isBox) bottomOffset = 160
            else if (isVertical) bottomOffset = 40
        }
        const base = {
            bottom: bottomOffset,
            left: "50%",
            right: "auto",
            top: "auto",
            transform: "translateX(-50%)",
        }
        if (isMobile) return base
        switch (bottomPillPosition) {
            case "bottom-left":
                return { ...base, left: 24, transform: "none" }
            case "bottom-right":
                return { ...base, left: "auto", right: 24, transform: "none" }
            case "top-center":
                return { ...base, bottom: "auto", top: 24 }
            case "bottom-center":
            default:
                return base
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                ...style,
                display: "flex",
                overflow: "hidden",
                backgroundColor: backgroundColor || "#0D1117",
                fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
                touchAction: "none",
                pointerEvents: "auto",
                cursor: isEyedropperActive ? "crosshair" : "default",
            }}
        >
            {isEyedropperActive && (
                <div
                    ref={eyedropperPreviewRef}
                    style={{
                        position: "fixed",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: `2px solid ${t.text}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        pointerEvents: "none",
                        zIndex: 9999999,
                        backgroundColor: "transparent",
                    }}
                />
            )}
            <link
                href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
                rel="stylesheet"
            />
            <style>{`
                @keyframes pulseBlink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } } 
                @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } } 
                @keyframes spin { 100% { transform: rotate(360deg); } } 
                div::-webkit-scrollbar { display: none; }
                .toolbar-btn { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, opacity 0.2s ease; }
                .toolbar-btn:hover { transform: scale(1.15); opacity: 0.95; }
                .toolbar-btn:active { transform: scale(0.9); }
                .glass-panel { transition: all 0.3s ease; }
            `}</style>

            {isLoading && (
                <div
                    style={{
                        position: "absolute",
                        display: "block",
                        inset: 0,
                        backgroundColor: "#F1E9DD",
                        zIndex: 99999,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            border: "4px solid rgba(47, 47, 47, 0.1)",
                            borderTop: "4px solid #2F2F2F",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2F2F2F",
                        }}
                    >
                        Loading Canvas...
                    </span>
                </div>
            )}

            <video
                ref={videoRef}
                src={
                    mediaSourceType === "video" && mediaFile
                        ? mediaFile
                        : undefined
                }
                loop={loopMedia}
                muted={true}
                playsInline
                crossOrigin="anonymous"
                style={{ display: "none" }}
            />
            <img
                ref={imageRef}
                src={
                    mediaSourceType === "image" && mediaFile
                        ? mediaFile
                        : undefined
                }
                crossOrigin="anonymous"
                style={{
                    position: "absolute",
                    display: "block",
                    top: 0,
                    left: 0,
                    width: "10px",
                    height: "10px",
                    opacity: 0.01,
                    zIndex: 9999,
                    pointerEvents: "none",
                    objectFit: "cover",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    display: "block",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    borderRadius: 0,
                    overflow: "clip",
                    backgroundClip: "padding-box",
                    backgroundColor: backgroundColor || "#0D1117",
                    border: "none",
                    boxSizing: "border-box",
                    isolation: "isolate",
                }}
            >
                <canvas
                    ref={bgCanvasRef}
                    width={canvasTotalWidth}
                    height={canvasTotalHeight}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
                <canvas
                    ref={mediaCanvasRef}
                    width={canvasTotalWidth}
                    height={canvasTotalHeight}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        opacity: hideMedia ? 0 : 1,
                    }}
                />
                <canvas
                    ref={gridCanvasRef}
                    width={canvasTotalWidth}
                    height={canvasTotalHeight}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
                {isTypeMode && (
                    <textarea
                        ref={hiddenInputRef as any}
                        autoFocus
                        onChange={(e) => {
                            typeTextRef.current = e.target.value
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                commitText()
                                setTypePos(null)
                                typeTextRef.current = ""
                                if (hiddenInputRef.current)
                                    hiddenInputRef.current.value = ""
                            } else if (e.key === "Escape") {
                                setTypePos(null)
                                typeTextRef.current = ""
                                if (hiddenInputRef.current)
                                    hiddenInputRef.current.value = ""
                            }
                        }}
                        onPointerDown={(e) => {
                            if (e.buttons === 2 || e.button === 1 || e.altKey) {
                                handlePointerDown(e as any)
                                return
                            }
                            const canvas = artworkCanvasRef.current
                            if (!canvas) return
                            const rect = canvas.getBoundingClientRect()
                            const scaleX = canvas.width / rect.width
                            const scaleY = canvas.height / rect.height
                            const mx = (e.clientX - rect.left) * scaleX
                            const my = (e.clientY - rect.top) * scaleY
                            const { col, row } = projectToGrid(
                                mx,
                                my,
                                internalPerspective,
                                selectedPixelSize
                            )

                            if (
                                typePos &&
                                typeTextRef.current.trim().length > 0
                            ) {
                                commitText()
                            }
                            setTypePos({ col, row })
                            typeTextRef.current = ""
                            if (hiddenInputRef.current)
                                hiddenInputRef.current.value = ""

                            setTimeout(() => {
                                hiddenInputRef.current?.focus()
                            }, 10)
                        }}
                        style={{
                            opacity: 1,
                            position: "absolute",
                            display: "block",
                            zIndex: -1,
                            width: 1,
                            height: 1,
                        }}
                    />
                )}
                <canvas
                    ref={artworkCanvasRef}
                    width={canvasTotalWidth}
                    height={canvasTotalHeight}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: "100%",
                        height: "100%",
                        touchAction: "none",
                        pointerEvents: "auto",
                    }}
                />
                <canvas
                    ref={previewCanvasRef}
                    width={canvasTotalWidth}
                    height={canvasTotalHeight}
                    style={{
                        position: "absolute",
                        display: "block",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            </div>

            {showInfoPills &&
                !hasInteracted &&
                !isLoading &&
                (mediaSourceType === "video" || mediaSourceType === "image") &&
                mediaFile && (
                    <div
                        style={{
                            position: "absolute",
                            display: "block",
                            ...getTopPillPosition(),
                            backgroundColor: t.pillBg,
                            border: `1px solid ${t.pillBorder}`,
                            color: t.pillText,
                            padding: "10px 16px",
                            borderRadius: 12,
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            zIndex: 9999,
                            boxShadow: t.shadow,
                            backdropFilter: t.backdrop,
                            WebkitBackdropFilter: t.backdrop,
                            fontSize: 14,
                            fontWeight: 600,
                            animation: "fadeIn 0.4s ease-out",
                            pointerEvents: "none",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                backgroundColor: t.pillText,
                                borderRadius: "50%",
                                animation: "pulseBlink 1.5s infinite",
                            }}
                        />
                        <span>Click or drag to start drawing</span>
                    </div>
                )}

            <div
                ref={isMobile ? null : desktopToolbarRef}
                onMouseDown={isMobile ? undefined : handleToolbarMouseDown}
                style={{
                    position: "absolute",
                    display: "block",
                    ...(isMobile
                        ? {
                              bottom: 12,
                              left: 12,
                              right: 12,
                              width: "calc(100% - 24px)",
                              flexDirection: "row",
                              padding: 8,
                              overflowX: "auto",
                              WebkitOverflowScrolling: "touch",
                              scrollbarWidth: "none",
                          }
                        : {
                              top: toolbarPosition.y,
                              left: toolbarPosition.x,
                              ...getDesktopToolbarStyle(),
                          }),
                    zIndex: toolbarZIndex,
                    display: "flex",
                    gap: 10,
                    cursor:
                        !isMobile && isDraggingToolbar
                            ? "grabbing"
                            : !isMobile
                              ? "grab"
                              : "default",
                    opacity: isLoading ? 0 : 1,
                    transition: isDraggingToolbar
                        ? "none"
                        : "opacity 0.3s ease",
                    ...toolbarBaseWrapperStyle,
                    alignItems: "center",
                }}
            >
                {(() => {
                    const bucketStyle = {
                        display: "flex",
                        gap: 4,
                        background: "transparent",
                        padding: 2,
                        alignItems: "center",
                        justifyContent: "center",
                    }
                    const dividerStyle = {
                        width: isHorizontal ? 1 : "100%",
                        height: isHorizontal ? 24 : 1,
                        background: resolvedCardBorder,
                        opacity: 0.8,
                        margin: isHorizontal ? "0 4px" : "4px 0",
                    }

                    const getToolStyle = (isActive) => ({
                        ...btnBaseStyle,
                        width: 32,
                        height: 32,
                        backgroundColor: isActive
                            ? (themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 255, 204, 0.15)"))
                            : "transparent",
                        color: isActive ? resolvedAccent : resolvedTextSecondary,
                        border: `1px solid ${isActive ? resolvedAccent : "transparent"}`,
                        boxShadow: isActive ? `0 0 10px ${resolvedAccentGlow}` : "none",
                        transition: "all 0.15s ease",
                    })

                    const getUtilityStyle = (isActive) => ({
                        ...btnBaseStyle,
                        backgroundColor: isActive
                            ? (themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 255, 204, 0.15)"))
                            : "transparent",
                        color: isActive ? resolvedAccent : resolvedTextSecondary,
                        border: `1px solid ${isActive ? resolvedAccent : "transparent"}`,
                        transition: "all 0.15s ease",
                    })

                    const hoverBuddyMsgs = {
                        Eraser: "Clean slate! 🧽",
                        "Fill Bucket": "Fill it all up! 🌊",
                        Eyedropper: "Pick a color! 🎨",
                        Type: "Write something cool! ✍️",
                        Pencil: "Let's draw! 🖌️",
                        "Increase Brush": "Make it bigger! ➕",
                        "Decrease Brush": "Make it smaller! ➖",
                        Undo: "Let's try that again! ⏪",
                        Redo: "Nevermind, put it back! ⏩",
                        "Toggle Perspective": "Woah, 3D! 🧊",
                        "Download Image": "Save your masterpiece! 💾",
                        "Clear Canvas": "Start fresh! 🌪️",
                        "Toggle Theme": "Switch the vibe! 🌗",
                        "Toggle Grid": "Toggle grid lines! 📏",
                    }

                    const handleBuddyMsg = (name) => {
                        if (hoverBuddyMsgs[name]) {
                            buddyMessageRef.current = hoverBuddyMsgs[name]
                            if (window.toolHoverTimeout)
                                clearTimeout(window.toolHoverTimeout)
                            window.toolHoverTimeout = setTimeout(() => {
                                if (
                                    buddyMessageRef.current ===
                                    hoverBuddyMsgs[name]
                                )
                                    buddyMessageRef.current = null
                            }, 2000)
                        }
                    }

                    const tooltipProps = (name) => ({
                        onMouseEnter: (e) => {
                            setHoveredTool({
                                name,
                                x: e.clientX,
                                y: e.clientY,
                            })
                            handleBuddyMsg(name)
                        },
                        onMouseMove: (e) =>
                            setHoveredTool({
                                name,
                                x: e.clientX,
                                y: e.clientY,
                            }),
                        onMouseLeave: () => setHoveredTool(null),
                        onFocus: (e) => {
                            const rect = e.target.getBoundingClientRect()
                            setHoveredTool({
                                name,
                                x: rect.left + rect.width / 2,
                                y: rect.top + rect.height / 2,
                            })
                            handleBuddyMsg(name)
                        },
                        onBlur: () => setHoveredTool(null),
                    })

                    const tooltipSnippet = hoveredTool ? (
                        <div
                            style={{
                                position: "fixed",
                                top:
                                    hoveredTool.y > window.innerHeight / 2
                                        ? hoveredTool.y - 15
                                        : hoveredTool.y + 15,
                                left:
                                    hoveredTool.x > window.innerWidth / 2
                                        ? hoveredTool.x - 15
                                        : hoveredTool.x + 15,
                                transform: `translate(${hoveredTool.x > window.innerWidth / 2 ? "-100%" : "0"}, ${hoveredTool.y > window.innerHeight / 2 ? "-100%" : "0"})`,
                                background: themeConfig ? themeConfig.headerBg : (isLightToolbar ? "#FFFFFF" : "#1A1A1A"),
                                color: themeConfig ? themeConfig.textPrimary : (isLightToolbar ? "#0F172A" : "#FFFFFF"),
                                border: `1px solid ${resolvedAccent}`,
                                padding: "4px 8px",
                                borderRadius: 0,
                                fontSize: 10,
                                fontWeight: "bold",
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                                zIndex: 999999,
                                boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 8px ${resolvedAccentGlow}`,
                            }}
                        >
                            {hoveredTool.name}
                        </div>
                    ) : null

                    return (
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: isHorizontal ? "row" : "column",
                                gap: 6,
                                width: "100%",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                justifyContent: "flex-start",
                            }}
                        >
                            {tooltipSnippet}

                            {hasDrawingTools && (
                                <div
                                    style={{
                                        ...bucketStyle,
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                    }}
                                >
                                    {showPencil && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsErasing(false)
                                                setIsBucketMode(false)
                                                setIsEyedropperActive(false)
                                                setIsTypeMode(false)
                                            }}
                                            style={{
                                                ...getToolStyle(
                                                    !isErasing &&
                                                        !isBucketMode &&
                                                        !isEyedropperActive &&
                                                        !isTypeMode
                                                ),
                                            }}
                                            {...tooltipProps("Pencil")}
                                        >
                                            <Pencil
                                                strokeWidth={1.5}
                                                size={16}
                                            />
                                        </button>
                                    )}
                                    {showEraser && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsErasing(true)
                                                setIsBucketMode(false)
                                                setIsEyedropperActive(false)
                                                setIsTypeMode(false)
                                            }}
                                            style={{
                                                ...getToolStyle(isErasing),
                                            }}
                                            {...tooltipProps("Eraser")}
                                        >
                                            <Eraser
                                                strokeWidth={1.5}
                                                size={16}
                                            />
                                        </button>
                                    )}
                                    {showBucket && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsBucketMode(true)
                                                setIsErasing(false)
                                                setIsEyedropperActive(false)
                                                setIsTypeMode(false)
                                            }}
                                            style={{
                                                ...getToolStyle(isBucketMode),
                                            }}
                                            {...tooltipProps("Fill Bucket")}
                                        >
                                            <PaintBucket
                                                strokeWidth={1.5}
                                                size={16}
                                            />
                                        </button>
                                    )}
                                    {showEyedropper && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsEyedropperActive(true)
                                                setIsErasing(false)
                                                setIsBucketMode(false)
                                                setIsTypeMode(false)
                                            }}
                                            style={{
                                                ...getToolStyle(
                                                    isEyedropperActive
                                                ),
                                            }}
                                            {...tooltipProps("Eyedropper")}
                                        >
                                            <Pipette
                                                strokeWidth={1.5}
                                                size={16}
                                            />
                                        </button>
                                    )}
                                    {showTypeTool && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsTypeMode(true)
                                                setIsErasing(false)
                                                setIsBucketMode(false)
                                                setIsEyedropperActive(false)
                                            }}
                                            style={{
                                                ...getToolStyle(isTypeMode),
                                            }}
                                            {...tooltipProps("Type")}
                                        >
                                            <Type strokeWidth={1.5} size={16} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {hasDrawingTools &&
                                showPalette &&
                                (!minimalToolbar || isMobile) && (
                                    <div style={dividerStyle} />
                                )}

                            {showPalette && (!minimalToolbar || isMobile) && (
                                <div
                                    style={{
                                        ...bucketStyle,
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                        justifyContent: "center",
                                        gap: 8,
                                    }}
                                >
                                    {/* Pre-defined Swatches Group */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: isHorizontal
                                                ? "row"
                                                : "column",
                                            alignItems: "center",
                                            gap: 4,
                                            /* removed box styling */
                                        }}
                                    >
                                        {(!minimalToolbar || isMobile) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    togglePalette()
                                                }}
                                                style={{
                                                    ...getToolStyle(false),
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 0,
                                                    background: "transparent",
                                                    border: "none",
                                                }}
                                                {...tooltipProps(
                                                    "Toggle Theme"
                                                )}
                                            >
                                                <Palette
                                                    strokeWidth={2}
                                                    size={14}
                                                />
                                            </button>
                                        )}

                                        {(!minimalToolbar || isMobile) && (
                                            <div
                                                style={{
                                                    width: isHorizontal
                                                        ? 1
                                                        : 16,
                                                    height: isHorizontal
                                                        ? 16
                                                        : 1,
                                                    backgroundColor: t.border,
                                                    opacity: 0.5,
                                                }}
                                            />
                                        )}

                                        {(!minimalToolbar || isMobile) &&
                                            PALETTES[activePalette].map(
                                                (color, i) => (
                                                    <button
                                                        key={color + i}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setCurrentDrawColor(
                                                                color
                                                            )
                                                        }}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: 0,
                                                            backgroundColor: color,
                                                            border:
                                                                currentDrawColor === color
                                                                    ? `2px solid ${resolvedAccent}`
                                                                    : `1px solid ${resolvedCardBorder}`,
                                                            cursor: "pointer",
                                                            padding: 0,
                                                            margin: "0 2px",
                                                            boxShadow:
                                                                currentDrawColor === color
                                                                    ? `0 0 8px ${resolvedAccentGlow}`
                                                                    : "none",
                                                            transform:
                                                                currentDrawColor === color
                                                                    ? "scale(1.15)"
                                                                    : "scale(1)",
                                                            transition: "all 0.15s ease",
                                                        }}
                                                        {...tooltipProps(
                                                            `Swatch ${i + 1}`
                                                        )}
                                                    />
                                                )
                                            )}
                                    </div>
                                </div>
                            )}

                            {hasDrawingTools && <div style={dividerStyle} />}
                            {hasDrawingTools && (
                                <label
                                    style={{
                                        ...getToolStyle(false),
                                        borderRadius: 0,
                                        background: themeConfig ? themeConfig.tagBg : (isLightToolbar ? "rgba(0,0,0,0.04)" : t.subBg),
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "4px 8px",
                                        border: `1px solid ${resolvedCardBorder}`,
                                        gap: "6px",
                                    }}
                                    {...tooltipProps("Custom Color")}
                                >
                                    <input
                                        type="color"
                                        value={currentDrawColor}
                                        onChange={(e) =>
                                            setCurrentDrawColor(e.target.value)
                                        }
                                        style={{
                                            opacity: 1,
                                            width: 0,
                                            height: 0,
                                            position: "absolute",
                                            display: "block",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 0,
                                            background:
                                                "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "inset 0 0 0 1px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: 0,
                                                backgroundColor:
                                                    currentDrawColor,
                                                border: `1px solid white`,
                                            }}
                                        />
                                    </div>
                                </label>
                            )}

                            {showBrushSize && <div style={dividerStyle} />}

                            {/* Grid Sizing */}
                            {showBrushSize && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                        alignItems: "center",
                                        gap: isHorizontal ? 6 : 2,
                                        padding: "2px",
                                    }}
                                >
                                    <Grid
                                        size={14}
                                        color={resolvedTextSecondary}
                                        style={{ opacity: 0.8 }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: isHorizontal
                                                ? "row"
                                                : "column",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedPixelSize((p) =>
                                                    Math.min(64, p + 2)
                                                )
                                            }}
                                            style={{
                                                ...btnBaseStyle,
                                                width: 18,
                                                height: 18,
                                                background: "transparent",
                                                color: resolvedAccent,
                                                fontWeight: 700,
                                            }}
                                            {...tooltipProps("Increase Grid")}
                                        >
                                            +
                                        </button>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: resolvedText,
                                                minWidth: 14,
                                                textAlign: "center",
                                            }}
                                        >
                                            {selectedPixelSize}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedPixelSize((p) =>
                                                    Math.max(4, p - 2)
                                                )
                                            }}
                                            style={{
                                                ...btnBaseStyle,
                                                width: 18,
                                                height: 18,
                                                background: "transparent",
                                                color: resolvedAccent,
                                                fontWeight: 700,
                                            }}
                                            {...tooltipProps("Decrease Grid")}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            )}
                            {showBrushSize && <div style={dividerStyle} />}

                            {/* Brush Sizing */}
                            {showBrushSize && (
                                <div
                                    style={{
                                        ...bucketStyle,
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                        padding: "0 4px",
                                    }}
                                >
                                    <Pencil
                                        size={12}
                                        color={resolvedTextSecondary}
                                        style={{
                                            opacity: 0.8,
                                            margin: isHorizontal
                                                ? "0 4px"
                                                : "4px 0",
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setBrushSize((b) =>
                                                Math.max(1, b - 1)
                                            )
                                        }}
                                        style={{
                                            ...btnBaseStyle,
                                            width: 20,
                                            height: 20,
                                            backgroundColor: "transparent",
                                            color: resolvedAccent,
                                            fontWeight: 700,
                                        }}
                                        {...tooltipProps("Decrease Brush")}
                                    >
                                        -
                                    </button>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: resolvedText,
                                            width: 16,
                                            textAlign: "center",
                                        }}
                                    >
                                        {brushSize}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setBrushSize((b) =>
                                                Math.min(10, b + 1)
                                            )
                                        }}
                                        style={{
                                            ...btnBaseStyle,
                                            width: 20,
                                            height: 20,
                                            backgroundColor: "transparent",
                                            color: t.text,
                                            fontWeight: 700,
                                        }}
                                        {...tooltipProps("Increase Brush")}
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            {showUndoRedo && <div style={dividerStyle} />}

                            {showUndoRedo && (
                                <div
                                    style={{
                                        ...bucketStyle,
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUndo()
                                        }}
                                        disabled={historyStep === 0}
                                        style={{
                                            ...getToolStyle(false),
                                            opacity:
                                                historyStep === 0 ? 0.4 : 1,
                                        }}
                                        {...tooltipProps("Undo")}
                                    >
                                        <Undo2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRedo()
                                        }}
                                        disabled={
                                            historyStep === history.length - 1
                                        }
                                        style={{
                                            ...getToolStyle(false),
                                            opacity:
                                                historyStep ===
                                                history.length - 1
                                                    ? 0.4
                                                    : 1,
                                        }}
                                        {...tooltipProps("Redo")}
                                    >
                                        <Redo2 size={14} />
                                    </button>
                                </div>
                            )}

                            {hasUtilityTools && <div style={dividerStyle} />}

                            {hasUtilityTools && (
                                <div
                                    style={{
                                        ...bucketStyle,
                                        flexDirection: isHorizontal
                                            ? "row"
                                            : "column",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const nextPersp =
                                                internalPerspective === "square"
                                                    ? "isometric"
                                                    : "square"
                                            setInternalPerspective(nextPersp)
                                            trackEngineEvent(
                                                "engine_perspective_change",
                                                {
                                                    target_perspective:
                                                        nextPersp,
                                                }
                                            )
                                        }}
                                        style={{
                                            ...getToolStyle(
                                                internalPerspective ===
                                                    "isometric"
                                            ),
                                        }}
                                        {...tooltipProps("Toggle Perspective")}
                                    >
                                        {internalPerspective === "isometric" ? (
                                            <Box strokeWidth={1.5} size={16} />
                                        ) : (
                                            <Grid strokeWidth={1.5} size={16} />
                                        )}
                                    </button>
                                    {!minimalToolbar &&
                                        showMediaControls &&
                                        !hasInteracted &&
                                        (mediaSourceType === "video" ||
                                            mediaSourceType === "image") &&
                                        mediaFile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setIsMediaPlaying(
                                                        !isMediaPlaying
                                                    )
                                                }}
                                                style={{
                                                    ...getUtilityStyle(false),
                                                    width: 32,
                                                    height: 32,
                                                }}
                                                {...tooltipProps(
                                                    isMediaPlaying
                                                        ? "Pause Playback"
                                                        : "Resume Playback"
                                                )}
                                            >
                                                {isMediaPlaying ? (
                                                    <Pause
                                                        size={14}
                                                        fill="currentColor"
                                                    />
                                                ) : (
                                                    <Play
                                                        size={14}
                                                        fill="currentColor"
                                                    />
                                                )}
                                            </button>
                                        )}
                                    {!minimalToolbar &&
                                        showMediaControls &&
                                        !hasInteracted &&
                                        (mediaSourceType === "video" ||
                                            mediaSourceType === "image") &&
                                        mediaFile &&
                                        mediaSourceType === "video" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setMuted(!muted)
                                                }}
                                                style={{
                                                    ...getUtilityStyle(false),
                                                    width: 32,
                                                    height: 32,
                                                }}
                                                {...tooltipProps(
                                                    muted ? "Unmute" : "Mute"
                                                )}
                                            >
                                                {muted ? (
                                                    <VolumeX size={14} />
                                                ) : (
                                                    <Volume2 size={14} />
                                                )}
                                            </button>
                                        )}
                                    {!minimalToolbar && showGridToggle && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setInternalGrid(!internalGrid)
                                            }}
                                            style={{
                                                ...getUtilityStyle(
                                                    internalGrid
                                                ),
                                                width: 32,
                                                height: 32,
                                            }}
                                            {...tooltipProps("Toggle Grid")}
                                        >
                                            <Grid size={14} />
                                        </button>
                                    )}
                                    {showDownload && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleShareArt()
                                            }}
                                            style={{
                                                ...getUtilityStyle(false),
                                                width: 32,
                                                height: 32,
                                            }}
                                            {...tooltipProps("Download Image")}
                                        >
                                            <Download size={14} />
                                        </button>
                                    )}
                                    {showClear && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClear()
                                            }}
                                            style={{
                                                ...getUtilityStyle(true),
                                                color: "#EF4444",
                                                width: 32,
                                                height: 32,
                                                background: "rgba(239, 68, 68, 0.12)",
                                                border: "1px solid rgba(239, 68, 68, 0.35)",
                                            }}
                                            {...tooltipProps("Clear Canvas")}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })()}
            </div>

            {showInfoPills && !hasInteracted && (
                <div
                    style={{
                        position: "absolute",
                        display: "block",
                        zIndex: 20,
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "none",
                        transition: "all 0.3s ease",
                        ...getBottomPillPosition(),
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            color: t.pillText,
                            textAlign: "center",
                            fontWeight: 600,
                            backgroundColor: t.pillBg,
                            padding: "8px 24px",
                            borderRadius: 24,
                            boxShadow: t.shadow,
                            border: `1px solid ${t.pillBorder}`,
                            backdropFilter: t.backdrop,
                            WebkitBackdropFilter: t.backdrop,
                            fontFamily: "Satoshi, Inter, sans-serif",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {isMobile
                            ? "Tap/Drag to draw • Palette swaps colors"
                            : "Left Click to Draw/Fill • Right Click to Erase"}
                    </div>
                </div>
            )}

            {/* Gamification Overlays */}
            {showCompanion && enableGamification && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transform: "none",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
                        pointerEvents: "none",
                        zIndex: 999999,
                    }}
                >
                    <div
                        ref={buddyChatOverlayRef as any}
                        style={{
                            position: "absolute",
                            display: "block",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                            opacity: 1,
                            zIndex: 999999,
                            backgroundColor: t.pillBg,
                            color: t.pillText,
                            padding: "12px 20px",
                            borderRadius: 16,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 14,
                            fontWeight: 600,
                            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            border: `1px solid ${t.pillBorder}`,
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        <span id="buddy-chat-msg">
                            Hey! Collect pixels as you explore ✨
                        </span>
                        <svg
                            id="buddy-chat-tail"
                            style={{
                                position: "absolute",
                                bottom: -5,
                                left: "50%",
                                transform: "translateX(-50%)",
                                transition: "all 0.3s ease",
                            }}
                            width="12"
                            height="6"
                            viewBox="0 0 12 6"
                            fill="none"
                        >
                            <path d="M6 6L12 0H0L6 6Z" fill={t.pillBg} />
                        </svg>
                    </div>

                    <div
                        ref={buddyXpOverlayRef as any}
                        style={{
                            position: "absolute",
                            display: "block",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                            opacity: 1,
                            zIndex: 999999,
                            backgroundColor: t.pillBg,
                            color: t.pillText,
                            width: 220,
                            boxSizing: "border-box",
                            padding: "8px 20px",
                            borderRadius: 20,
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: t.shadow,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: `1px solid ${t.pillBorder}`,
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z"
                                    fill="#FFD700"
                                />
                            </svg>
                            <span
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                <span id="buddy-xp-val">0</span> XP
                            </span>
                        </div>
                        <span
                            id="buddy-title-val"
                            style={{
                                fontSize: 10,
                                color: t.pillText,
                                opacity: 0.7,
                                fontWeight: 600,
                                marginTop: 2,
                            }}
                        >
                            Canvas Visitor (Lvl 1)
                        </span>
                    </div>

                    <div
                        ref={buddyStatsOverlayRef as any}
                        style={{
                            position: "absolute",
                            display: "block",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                            opacity: 1,
                            zIndex: 999999,
                            backgroundColor: t.pillBg,
                            color: t.pillText,
                            width: 220,
                            boxSizing: "border-box",
                            padding: "16px",
                            borderRadius: 24,
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: t.shadow,
                            border: `1px solid ${t.pillBorder}`,
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                        }}
                    >
                        {/* Pixels Collected section */}
                        <div style={{ marginBottom: 16 }}>
                            <div
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: t.pillText,
                                    opacity: 0.6,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    marginBottom: 4,
                                }}
                            >
                                XP PROGRESS
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        letterSpacing: "-0.03em",
                                        color: t.pillText,
                                    }}
                                    id="buddy-stats-val"
                                >
                                    132
                                </div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <rect
                                        x="2"
                                        y="10"
                                        width="6"
                                        height="6"
                                        fill="#FFD700"
                                        transform="rotate(-45 2 10)"
                                    />
                                    <rect
                                        x="8"
                                        y="10"
                                        width="6"
                                        height="6"
                                        fill="#FFD700"
                                        transform="rotate(-45 8 10)"
                                    />
                                    <rect
                                        x="5"
                                        y="13"
                                        width="6"
                                        height="6"
                                        fill="#FFD700"
                                        transform="rotate(-45 5 13)"
                                    />
                                </svg>
                            </div>
                            {/* Dynamic progress bar */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 2,
                                    marginTop: 8,
                                }}
                            >
                                {[...Array(16)].map((_, i) => (
                                    <div
                                        key={i}
                                        id={`buddy-progress-bar-${i}`}
                                        style={{
                                            height: 4,
                                            flex: 1,
                                            backgroundColor:
                                                i < 0 ? "#3b82f6" : t.border,
                                            borderRadius: 1,
                                            transition:
                                                "background-color 0.3s ease",
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div
                            style={{
                                height: 1,
                                backgroundColor: t.border,
                                opacity: 0.5,
                                margin: "0 -4px",
                                marginBottom: 16,
                            }}
                        ></div>

                        {/* Global Community Stats section */}
                        <div style={{ marginBottom: 16 }}>
                            <div
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: t.pillText,
                                    opacity: 0.6,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    marginBottom: 8,
                                }}
                            >
                                Global Analytics
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: t.pillText,
                                        opacity: 0.8,
                                    }}
                                >
                                    Pixels Drawn
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: t.text,
                                    }}
                                >
                                    {new Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        compactDisplay: "short",
                                    }).format(globalStats.totalPixelsDrawn)}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: t.pillText,
                                        opacity: 0.8,
                                    }}
                                >
                                    Pixels Cleared
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: t.text,
                                    }}
                                >
                                    {new Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        compactDisplay: "short",
                                    }).format(globalStats.totalPixelsPopped)}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: t.pillText,
                                        opacity: 0.8,
                                    }}
                                >
                                    Notes Played
                                </span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: t.text,
                                    }}
                                >
                                    {new Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        compactDisplay: "short",
                                    }).format(globalStats.totalNotesPlayed)}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                height: 1,
                                backgroundColor: t.border,
                                opacity: 0.5,
                                margin: "0 -4px",
                                marginBottom: 16,
                            }}
                        ></div>

                        {/* Engine Status section */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        color: t.pillText,
                                        opacity: 0.6,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Engine Status
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        height: 14,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "#22c55e",
                                        }}
                                    ></div>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "#22c55e",
                                            lineHeight: 1,
                                        }}
                                    >
                                        Alive
                                    </span>
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    window._pixelEngineMuted =
                                        !window._pixelEngineMuted
                                    const statusText =
                                        document.getElementById(
                                            "audio-status-text"
                                        )
                                    if (statusText) {
                                        statusText.innerText =
                                            window._pixelEngineMuted
                                                ? "Muted"
                                                : "Audio On"
                                        statusText.style.color =
                                            window._pixelEngineMuted
                                                ? "#ef4444"
                                                : "#3b82f6"
                                    }
                                    trackEngineEvent("engine_music_toggled", {
                                        muted: window._pixelEngineMuted,
                                    })
                                }}
                                style={{
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 6,
                                }}
                            >
                                <div
                                    id="audio-status-text"
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        color: "#3b82f6",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Audio On
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: 3,
                                        height: 14,
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            id={`music-bar-${i}`}
                                            style={{
                                                width: 4,
                                                height: 4,
                                                backgroundColor: "#3b82f6",
                                                borderRadius: 2,
                                                transition:
                                                    "height 0.05s linear",
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


// ============================================================================
// CYBER RECOVERY: ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryState {
    hasError: boolean
}

class CyberErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: any, info: any) {
        console.warn("[CyberOS Error Boundary Caught Display Event]:", error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#07080C",
                        color: "#00FFCC",
                        fontFamily: "'IBM Plex Mono', monospace",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 24,
                        textAlign: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#FF453A" }}>
                        {"[SYSTEM // DISPLAY_RECOVERY]"}
                    </div>
                    <div style={{ fontSize: 11, color: "#8E929B", marginBottom: 14 }}>
                        {"Transient resize boundary recovered."}
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            background: "rgba(0, 255, 204, 0.15)",
                            border: "1px solid #00FFCC",
                            color: "#00FFCC",
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {"[RESET_VIEW]"}
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

// ============================================================================
// OS SHELL: LINUX THEME ARCHITECTURE & PALETTES
// ============================================================================

export type OSThemeId = "noctalia" | "caelestia" | "tokyo-night" | "catppuccin" | "matrix" | "light"

export interface OSThemeConfig {
    id: OSThemeId
    name: string
    label: string
    shellName: string
    isDark: boolean
    icon: string
    desktopBg: string
    desktopGrid: string
    headerBg: string
    headerBorder: string
    windowBg: string
    windowTitleBg: string
    windowBorder: string
    windowActiveBorder: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    accent: string
    accentSecondary: string
    accentGlow: string
    cardBg: string
    cardBorder: string
    terminalBg: string
    terminalBorder: string
    terminalHeader: string
    terminalPrompt: string
    canvasBg: string
    gridColor: string
    drawColor: string
    uiTheme: "dark" | "light" | "glass-dark" | "glass-light"
    toolbarTheme: "dark" | "light"
    heroTheme: "dark" | "light"
    tagBg: string
    tagText: string
    badgeBorder: string
    btnHoverBg: string
}

export const OS_THEMES: Record<OSThemeId, OSThemeConfig> = {
    noctalia: {
        id: "noctalia",
        name: "Noctalia",
        label: "Noctalia (Cyber Obsidian)",
        shellName: "noctalia-zsh",
        isDark: true,
        icon: "🌌",
        desktopBg: "#07080C",
        desktopGrid: "rgba(255, 255, 255, 0.03)",
        headerBg: "rgba(10, 12, 16, 0.96)",
        headerBorder: "rgba(255, 255, 255, 0.09)",
        windowBg: "rgba(10, 12, 16, 0.96)",
        windowTitleBg: "rgba(20, 24, 34, 0.95)",
        windowBorder: "rgba(255, 255, 255, 0.09)",
        windowActiveBorder: "rgba(0, 255, 204, 0.45)",
        textPrimary: "#FFFFFF",
        textSecondary: "#E2E8F0",
        textMuted: "#8E929B",
        accent: "#00FFCC",
        accentSecondary: "#FFD700",
        accentGlow: "rgba(0, 255, 204, 0.3)",
        cardBg: "rgba(16, 20, 28, 0.85)",
        cardBorder: "rgba(255, 255, 255, 0.1)",
        terminalBg: "rgba(8, 10, 16, 0.97)",
        terminalBorder: "rgba(0, 255, 204, 0.25)",
        terminalHeader: "rgba(14, 18, 26, 0.98)",
        terminalPrompt: "#00FFCC",
        canvasBg: "#07080C",
        gridColor: "rgba(255, 255, 255, 0.05)",
        drawColor: "#3B82F6",
        uiTheme: "dark",
        toolbarTheme: "dark",
        heroTheme: "dark",
        tagBg: "rgba(0, 255, 204, 0.1)",
        tagText: "#00FFCC",
        badgeBorder: "rgba(0, 255, 204, 0.5)",
        btnHoverBg: "rgba(0, 255, 204, 0.15)",
    },
    caelestia: {
        id: "caelestia",
        name: "Caelestia",
        label: "Caelestia (Nordic Frost)",
        shellName: "caelestia-fish",
        isDark: true,
        icon: "❄️",
        desktopBg: "#0B101B",
        desktopGrid: "rgba(136, 192, 208, 0.04)",
        headerBg: "rgba(13, 19, 32, 0.96)",
        headerBorder: "rgba(136, 192, 208, 0.18)",
        windowBg: "rgba(15, 23, 38, 0.96)",
        windowTitleBg: "rgba(20, 32, 52, 0.95)",
        windowBorder: "rgba(136, 192, 208, 0.15)",
        windowActiveBorder: "rgba(136, 192, 208, 0.6)",
        textPrimary: "#ECEFF4",
        textSecondary: "#D8DEE9",
        textMuted: "#7B88A1",
        accent: "#88C0D0",
        accentSecondary: "#81A1C1",
        accentGlow: "rgba(136, 192, 208, 0.35)",
        cardBg: "rgba(20, 30, 50, 0.85)",
        cardBorder: "rgba(136, 192, 208, 0.15)",
        terminalBg: "rgba(10, 15, 26, 0.98)",
        terminalBorder: "rgba(136, 192, 208, 0.3)",
        terminalHeader: "rgba(16, 25, 42, 0.98)",
        terminalPrompt: "#88C0D0",
        canvasBg: "#0B101B",
        gridColor: "rgba(136, 192, 208, 0.08)",
        drawColor: "#88C0D0",
        uiTheme: "dark",
        toolbarTheme: "dark",
        heroTheme: "dark",
        tagBg: "rgba(136, 192, 208, 0.12)",
        tagText: "#88C0D0",
        badgeBorder: "rgba(136, 192, 208, 0.5)",
        btnHoverBg: "rgba(136, 192, 208, 0.18)",
    },
    "tokyo-night": {
        id: "tokyo-night",
        name: "Tokyo Night",
        label: "Tokyo Night (Midnight)",
        shellName: "tokyo-zsh",
        isDark: true,
        icon: "🌆",
        desktopBg: "#0C0E1B",
        desktopGrid: "rgba(122, 162, 247, 0.04)",
        headerBg: "rgba(15, 17, 33, 0.96)",
        headerBorder: "rgba(122, 162, 247, 0.2)",
        windowBg: "rgba(18, 20, 38, 0.96)",
        windowTitleBg: "rgba(26, 28, 54, 0.95)",
        windowBorder: "rgba(122, 162, 247, 0.15)",
        windowActiveBorder: "rgba(122, 162, 247, 0.6)",
        textPrimary: "#C0CAF5",
        textSecondary: "#A9B1D6",
        textMuted: "#6E7395",
        accent: "#7AA2F7",
        accentSecondary: "#BB9AF7",
        accentGlow: "rgba(122, 162, 247, 0.35)",
        cardBg: "rgba(24, 26, 48, 0.85)",
        cardBorder: "rgba(122, 162, 247, 0.16)",
        terminalBg: "rgba(11, 13, 25, 0.98)",
        terminalBorder: "rgba(122, 162, 247, 0.3)",
        terminalHeader: "rgba(20, 22, 42, 0.98)",
        terminalPrompt: "#7AA2F7",
        canvasBg: "#0C0E1B",
        gridColor: "rgba(122, 162, 247, 0.08)",
        drawColor: "#7AA2F7",
        uiTheme: "dark",
        toolbarTheme: "dark",
        heroTheme: "dark",
        tagBg: "rgba(122, 162, 247, 0.12)",
        tagText: "#7AA2F7",
        badgeBorder: "rgba(122, 162, 247, 0.5)",
        btnHoverBg: "rgba(122, 162, 247, 0.18)",
    },
    catppuccin: {
        id: "catppuccin",
        name: "Catppuccin",
        label: "Catppuccin (Mocha)",
        shellName: "catppuccin-bash",
        isDark: true,
        icon: "☕",
        desktopBg: "#11111B",
        desktopGrid: "rgba(203, 166, 247, 0.04)",
        headerBg: "rgba(17, 17, 27, 0.96)",
        headerBorder: "rgba(203, 166, 247, 0.2)",
        windowBg: "rgba(24, 24, 37, 0.96)",
        windowTitleBg: "rgba(30, 30, 46, 0.95)",
        windowBorder: "rgba(203, 166, 247, 0.15)",
        windowActiveBorder: "rgba(203, 166, 247, 0.6)",
        textPrimary: "#CDD6F4",
        textSecondary: "#BAC2DE",
        textMuted: "#7F849C",
        accent: "#CBA6F7",
        accentSecondary: "#F9E2AF",
        accentGlow: "rgba(203, 166, 247, 0.35)",
        cardBg: "rgba(30, 30, 46, 0.85)",
        cardBorder: "rgba(203, 166, 247, 0.16)",
        terminalBg: "rgba(14, 14, 23, 0.98)",
        terminalBorder: "rgba(203, 166, 247, 0.3)",
        terminalHeader: "rgba(24, 24, 37, 0.98)",
        terminalPrompt: "#CBA6F7",
        canvasBg: "#11111B",
        gridColor: "rgba(203, 166, 247, 0.08)",
        drawColor: "#CBA6F7",
        uiTheme: "dark",
        toolbarTheme: "dark",
        heroTheme: "dark",
        tagBg: "rgba(203, 166, 247, 0.12)",
        tagText: "#CBA6F7",
        badgeBorder: "rgba(203, 166, 247, 0.5)",
        btnHoverBg: "rgba(203, 166, 247, 0.18)",
    },
    matrix: {
        id: "matrix",
        name: "Matrix",
        label: "Matrix (Phosphor Green)",
        shellName: "matrix-tty",
        isDark: true,
        icon: "📟",
        desktopBg: "#030A05",
        desktopGrid: "rgba(0, 255, 102, 0.04)",
        headerBg: "rgba(4, 14, 8, 0.96)",
        headerBorder: "rgba(0, 255, 102, 0.2)",
        windowBg: "rgba(5, 18, 10, 0.96)",
        windowTitleBg: "rgba(8, 28, 15, 0.95)",
        windowBorder: "rgba(0, 255, 102, 0.18)",
        windowActiveBorder: "rgba(0, 255, 102, 0.7)",
        textPrimary: "#DCFCE7",
        textSecondary: "#86EFAC",
        textMuted: "#22C55E",
        accent: "#00FF66",
        accentSecondary: "#A3E635",
        accentGlow: "rgba(0, 255, 102, 0.35)",
        cardBg: "rgba(7, 24, 13, 0.85)",
        cardBorder: "rgba(0, 255, 102, 0.2)",
        terminalBg: "rgba(2, 10, 5, 0.98)",
        terminalBorder: "rgba(0, 255, 102, 0.35)",
        terminalHeader: "rgba(6, 20, 11, 0.98)",
        terminalPrompt: "#00FF66",
        canvasBg: "#030A05",
        gridColor: "rgba(0, 255, 102, 0.08)",
        drawColor: "#00FF66",
        uiTheme: "dark",
        toolbarTheme: "dark",
        heroTheme: "dark",
        tagBg: "rgba(0, 255, 102, 0.12)",
        tagText: "#00FF66",
        badgeBorder: "rgba(0, 255, 102, 0.5)",
        btnHoverBg: "rgba(0, 255, 102, 0.2)",
    },
    light: {
        id: "light",
        name: "Solaris Light",
        label: "Solaris (Paper Light)",
        shellName: "solaris-sh",
        isDark: false,
        icon: "☀️",
        desktopBg: "#F1F3F7",
        desktopGrid: "rgba(0, 0, 0, 0.04)",
        headerBg: "rgba(255, 255, 255, 0.96)",
        headerBorder: "rgba(0, 0, 0, 0.1)",
        windowBg: "rgba(255, 255, 255, 0.97)",
        windowTitleBg: "rgba(241, 245, 249, 0.98)",
        windowBorder: "rgba(0, 0, 0, 0.12)",
        windowActiveBorder: "rgba(37, 99, 235, 0.6)",
        textPrimary: "#0F172A",
        textSecondary: "#334155",
        textMuted: "#64748B",
        accent: "#2563EB",
        accentSecondary: "#D97706",
        accentGlow: "rgba(37, 99, 235, 0.25)",
        cardBg: "rgba(248, 250, 252, 0.95)",
        cardBorder: "rgba(0, 0, 0, 0.08)",
        terminalBg: "rgba(248, 250, 252, 0.98)",
        terminalBorder: "rgba(37, 99, 235, 0.3)",
        terminalHeader: "rgba(241, 245, 249, 0.98)",
        terminalPrompt: "#2563EB",
        canvasBg: "#FFFFFF",
        gridColor: "rgba(0, 0, 0, 0.06)",
        drawColor: "#2563EB",
        uiTheme: "light",
        toolbarTheme: "light",
        heroTheme: "light",
        tagBg: "rgba(37, 99, 235, 0.1)",
        tagText: "#2563EB",
        badgeBorder: "rgba(37, 99, 235, 0.5)",
        btnHoverBg: "rgba(37, 99, 235, 0.12)",
    },
}

interface HomeSecProps {
    name?: string
    role?: string
    location?: string
    locationTooltip?: string
    statusText?: string
    defaultTheme?: OSThemeId
    pixelSize?: number
    backgroundColor?: string
    gridColor?: string
    desktopBgColor?: string
    drawColor?: string
    uiTheme?: "dark" | "light" | "glass-dark" | "glass-light"
    toolbarTheme?: "dark" | "light"
    heroTheme?: "dark" | "light"
    heroAccent?: string
    workSection?: string
    resumeLink?: string
    resumeNewTab?: boolean
    enableGamification?: boolean
    enableHoverTrail?: boolean
    showStatsBar?: boolean
    defaultStatsCollapsed?: boolean
    defaultSplitRatio?: number
    enableEdgeResize?: boolean
    style?: CSSProperties
}

export default function HomeSec({
    name = "ADITYA DIUNDI",
    role = "Design Engineer",
    location = "Delhi, India",
    locationTooltip = "This is where I am based out of",
    statusText = "ACTIVE",
    defaultTheme = "noctalia",
    pixelSize = 20,
    backgroundColor,
    gridColor,
    desktopBgColor,
    drawColor,
    uiTheme = "dark",
    toolbarTheme = "dark",
    heroTheme = "dark",
    heroAccent,
    workSection = "work",
    resumeLink = "",
    resumeNewTab = true,
    enableGamification = true,
    enableHoverTrail = false,
    showStatsBar = true,
    defaultStatsCollapsed = true,
    defaultSplitRatio = 60,
    enableEdgeResize = true,
    style,
}: HomeSecProps) {
    const [windows, setWindows] = useState({
        coreIntro: { isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10 },
        canvasEngine: { isOpen: true, isMinimized: false, isMaximized: false, zIndex: 11 },
        projects: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 12 },
    })

    const [activeWindow, setActiveWindow] = useState<"coreIntro" | "canvasEngine" | "projects">("canvasEngine")

    const focusWindow = (id: "coreIntro" | "canvasEngine" | "projects") => {
        setActiveWindow(id)
        setWindows((prev) => {
            const maxZ = Math.max(...Object.values(prev).map((w) => w.zIndex))
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    isOpen: true,
                    isMinimized: false,
                    zIndex: maxZ + 1,
                },
            }
        })
    }

    // Status Panel collapsed by default in tiled view, auto-expands when engine is maximized
    const [isStatsBoxCollapsed, setIsStatsBoxCollapsed] = useState(defaultStatsCollapsed)
    useEffect(() => {
        setIsStatsBoxCollapsed(defaultStatsCollapsed)
    }, [defaultStatsCollapsed])

    useEffect(() => {
        if (windows.canvasEngine.isMaximized) {
            setIsStatsBoxCollapsed(false)
        } else {
            setIsStatsBoxCollapsed(defaultStatsCollapsed)
        }
    }, [windows.canvasEngine.isMaximized, defaultStatsCollapsed])

    // Dynamic Edge Resizing State (Enforces exact 60:40 ratio; normalizes legacy 44/50/65 presets)
    const normalizedDefaultSplit = (defaultSplitRatio === 44 || defaultSplitRatio === 50 || defaultSplitRatio === 65 || !defaultSplitRatio) ? 60 : defaultSplitRatio
    const [splitRatio, setSplitRatio] = useState(normalizedDefaultSplit)
    useEffect(() => {
        const ratio = (defaultSplitRatio === 44 || defaultSplitRatio === 50 || defaultSplitRatio === 65 || !defaultSplitRatio) ? 60 : defaultSplitRatio
        setSplitRatio(ratio)
    }, [defaultSplitRatio])

    // Interactive CLI Terminal State for Empty Desktop
    const [cliInput, setCliInput] = useState("")
    const [cliHistory, setCliHistory] = useState<string[]>([
        "ADITYA_HYPRLAND_OS v2.4 (x86_64) // ONLINE",
        "ALL TABS CURRENTLY MINIMIZED TO TASKBAR",
        "TIP: Click any quick command chip below or type 'help' to explore.",
    ])
    const [commandList, setCommandList] = useState<string[]>([])
    const [historyPointer, setHistoryPointer] = useState<number | null>(null)
    const cliInputRef = useRef<HTMLInputElement>(null)
    const terminalLogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (terminalLogRef.current) {
            terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight
        }
    }, [cliHistory])

    const [isDraggingSplit, setIsDraggingSplit] = useState(false)
    const workspaceRef = useRef<HTMLDivElement>(null)

    const handleSplitterPointerDown = (e: React.PointerEvent) => {
        if (!enableEdgeResize) return
        e.preventDefault()
        setIsDraggingSplit(true)
        const container = workspaceRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        if (!rect || rect.width <= 0) return

        let rafId: number | null = null

        const onPointerMove = (moveEvent: PointerEvent) => {
            if (rafId !== null) return
            rafId = requestAnimationFrame(() => {
                rafId = null
                const currentX = moveEvent.clientX
                if (rect.width <= 0) return
                const newRatio = ((currentX - rect.left) / rect.width) * 100
                if (isNaN(newRatio) || !isFinite(newRatio)) return
                const clamped = Math.max(20, Math.min(80, newRatio))
                setSplitRatio(clamped)
            })
        }

        const onPointerUp = () => {
            if (rafId !== null) cancelAnimationFrame(rafId)
            setIsDraggingSplit(false)
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerup", onPointerUp)
        }

        window.addEventListener("pointermove", onPointerMove)
        window.addEventListener("pointerup", onPointerUp)
    }

    // OS Theme Management (Linux shell presets: noctalia, caelestia, tokyo-night, catppuccin, matrix, light)
    const [currentThemeId, setCurrentThemeId] = useState<OSThemeId>(() => {
        if (defaultTheme && OS_THEMES[defaultTheme]) return defaultTheme
        if (uiTheme === "light" || heroTheme === "light") return "light"
        return "noctalia"
    })
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
    const themeMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (defaultTheme && OS_THEMES[defaultTheme]) {
            setCurrentThemeId(defaultTheme)
        }
    }, [defaultTheme])

    const activeTheme = OS_THEMES[currentThemeId] || OS_THEMES.noctalia

    const selectTheme = (themeId: OSThemeId) => {
        if (OS_THEMES[themeId]) {
            setCurrentThemeId(themeId)
            setIsThemeMenuOpen(false)
            playCyberHeroBlip(1100, 0.08)
        }
    }

    const toggleLightDark = () => {
        playCyberHeroBlip(activeTheme.isDark ? 950 : 1250, 0.08)
        setCurrentThemeId((prev) => (prev === "light" ? "noctalia" : "light"))
    }

    useEffect(() => {
        if (!isThemeMenuOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
                setIsThemeMenuOpen(false)
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsThemeMenuOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isThemeMenuOpen])

    const executeCommand = (cmdRaw: string) => {
        const cmd = cmdRaw.trim().toLowerCase()
        if (!cmd) return

        playCyberHeroBlip(1050, 0.08)
        setCommandList((prev) => [...prev, cmdRaw.trim()])
        setHistoryPointer(null)
        const newHistory = [...cliHistory, `> ${cmdRaw.trim()}`]

        if (cmd === "help") {
            newHistory.push(
                "AVAILABLE COMMANDS:",
                "  intro       - Launch Core Intro Manifesto",
                "  engine      - Launch 60 FPS Pixel Art Engine",
                "  projects    - Open Design Engineering Portfolio",
                "  resume      - Open Résumé Document",
                "  theme       - Display active theme & Linux presets",
                "  theme list  - List all available Linux shell themes",
                "  theme <id>  - Switch theme (e.g. 'theme caelestia')",
                "  light / dark- Instant toggle Light / Dark mode",
                "  neofetch    - Display OS Architecture & Identity",
                "  clear       - Clear terminal screen"
            )
        } else if (cmd === "theme" || cmd === "themes") {
            newHistory.push(
                `CURRENT OS THEME: [${activeTheme.name.toUpperCase()}] (${activeTheme.isDark ? "Dark" : "Light"} // ${activeTheme.shellName})`,
                "LINUX SHELL PRESETS:",
                "  noctalia     - Cyber Obsidian / Teal & Gold [Hyprland]",
                "  caelestia    - Nordic Frost / Glacier Cyan & Polar Blue [Wayland]",
                "  tokyo-night  - Tokyo Midnight / Deep Violet & Soft Blue",
                "  catppuccin   - Catppuccin Mocha / Lavender & Warm Honey",
                "  matrix       - Hacker Terminal / Phosphor Green",
                "  light        - Solaris Paper / Clean Cobalt & Slate (Light Mode)",
                "USAGE: Type 'theme <name>' or toggle with 'dark' / 'light'"
            )
        } else if (cmd === "theme list") {
            newHistory.push(
                "AVAILABLE LINUX SHELL THEMES:",
                ...Object.values(OS_THEMES).map(
                    (th) => `  ${th.id.padEnd(12)} - ${th.label} ${th.id === currentThemeId ? "[ACTIVE]" : ""}`
                ),
                "TIP: Type 'theme <name>' to apply immediately"
            )
        } else if (cmd.startsWith("theme ") || cmd.startsWith("set theme ")) {
            const requested = cmd.replace("set theme ", "").replace("theme ", "").trim().toLowerCase()
            let matchedId: OSThemeId | null = null
            if (requested === "dark" || requested === "default" || requested === "obsidian" || requested === "noctalia") matchedId = "noctalia"
            else if (requested === "caelestia" || requested === "nord" || requested === "frost") matchedId = "caelestia"
            else if (requested === "tokyo" || requested === "tokyo-night" || requested === "tokyonight") matchedId = "tokyo-night"
            else if (requested === "catppuccin" || requested === "mocha") matchedId = "catppuccin"
            else if (requested === "matrix" || requested === "green" || requested === "hacker") matchedId = "matrix"
            else if (requested === "light" || requested === "solaris" || requested === "paper") matchedId = "light"

            if (matchedId && OS_THEMES[matchedId]) {
                setCurrentThemeId(matchedId)
                newHistory.push(`[SUCCESS] Switched OS theme to '${OS_THEMES[matchedId].name}' (${OS_THEMES[matchedId].label})`)
            } else {
                newHistory.push(`[ERROR] Unknown theme '${requested}'. Try: noctalia, caelestia, tokyo-night, catppuccin, matrix, light`)
            }
        } else if (cmd === "dark" || cmd === "noctalia") {
            setCurrentThemeId("noctalia")
            newHistory.push("[SUCCESS] Switched OS theme to 'Noctalia' (Cyber Obsidian)")
        } else if (cmd === "light" || cmd === "solaris") {
            setCurrentThemeId("light")
            newHistory.push("[SUCCESS] Switched OS theme to 'Solaris' (Paper Light)")
        } else if (cmd === "caelestia" || cmd === "nord") {
            setCurrentThemeId("caelestia")
            newHistory.push("[SUCCESS] Switched OS theme to 'Caelestia' (Nordic Frost)")
        } else if (cmd === "tokyo-night" || cmd === "tokyo") {
            setCurrentThemeId("tokyo-night")
            newHistory.push("[SUCCESS] Switched OS theme to 'Tokyo Night' (Midnight Violet)")
        } else if (cmd === "catppuccin" || cmd === "mocha") {
            setCurrentThemeId("catppuccin")
            newHistory.push("[SUCCESS] Switched OS theme to 'Catppuccin' (Mocha Warmth)")
        } else if (cmd === "matrix") {
            setCurrentThemeId("matrix")
            newHistory.push("[SUCCESS] Switched OS theme to 'Matrix' (Phosphor Green)")
        } else if (cmd === "intro" || cmd === "open intro" || cmd === "core") {
            setWindows((prev) => ({
                ...prev,
                coreIntro: { ...prev.coreIntro, isOpen: true, isMinimized: false },
            }))
            setActiveWindow("coreIntro")
            newHistory.push("[SUCCESS] Restored [CORE_INTRO] window (60% split)")
        } else if (cmd === "engine" || cmd === "open engine" || cmd === "pixel" || cmd === "draw") {
            setWindows((prev) => ({
                ...prev,
                canvasEngine: { ...prev.canvasEngine, isOpen: true, isMinimized: false },
            }))
            setActiveWindow("canvasEngine")
            newHistory.push("[SUCCESS] Restored [CANVAS_ENGINE] window (40% split)")
        } else if (cmd === "projects" || cmd === "open projects" || cmd === "work") {
            setWindows((prev) => ({
                ...prev,
                projects: { isOpen: true, isMinimized: false, isMaximized: false },
            }))
            setActiveWindow("projects")
            newHistory.push("[SUCCESS] Dispatched [PROJECTS] modal drawer")
        } else if (cmd === "resume" || cmd === "cv") {
            if (resumeLink) {
                window.open(resumeLink, resumeNewTab ? "_blank" : "_self")
                newHistory.push("[SUCCESS] Opening résumé document...")
            } else {
                newHistory.push("[INFO] No external resume URL configured in properties")
            }
        } else if (cmd === "neofetch") {
            newHistory.push(
                "   _____   ______     __  __",
                "  /  _  \\ /  _   \\   |  |/  /",
                " /  /_\\  \\\\   /  /   |  '  / ",
                "/    |    \\\\_/__/    |    <  ",
                "\\____|__  /          |__|\\__\\",
                "OS: ADITYA_HYPRLAND_OS v2.4 (x86_64)",
                `SHELL: ${activeTheme.shellName}`,
                `THEME: ${activeTheme.name} (${activeTheme.isDark ? "Dark" : "Light"})`,
                "HOST: Delhi Station // UTC+05:30",
                "ROLE: Design Engineer",
                "STACK: React 19 • TypeScript • Canvas API • WebGL • Tokens",
                `ACTIVE VOXELS: ${liveStats.activePixels} on canvas`,
                `PLAYER LEVEL: Lvl ${liveStats.level} (${liveStats.title})`
            )
        } else if (cmd === "clear" || cmd === "cls") {
            setCliHistory([])
            setCliInput("")
            return
        } else {
            newHistory.push(`[ERROR] Unknown command '${cmd}'. Click a quick action or type 'help'.`)
        }

        setCliHistory(newHistory.slice(-25))
        setCliInput("")
    }

    const handleCliSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        executeCommand(cliInput)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault()
            if (commandList.length === 0) return
            const nextIndex = historyPointer === null ? commandList.length - 1 : Math.max(0, historyPointer - 1)
            setHistoryPointer(nextIndex)
            setCliInput(commandList[nextIndex])
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            if (historyPointer === null) return
            const nextIndex = historyPointer + 1
            if (nextIndex < commandList.length) {
                setHistoryPointer(nextIndex)
                setCliInput(commandList[nextIndex])
            } else {
                setHistoryPointer(null)
                setCliInput("")
            }
        }
    }

    // Top Bar Location & XP Hover interactions
    const [isLocationHovered, setIsLocationHovered] = useState(false)
    const [isXpHovered, setIsXpHovered] = useState(false)

    const [liveStats, setLiveStats] = useState({
        totalPixelsDrawn: 0,
        totalPixelsPopped: 0,
        totalNotesPlayed: 0,
        activePixels: 0,
        sessionDrawn: 0,
        sessionPopped: 0,
        xp: 0,
        level: 1,
        title: "Canvas Visitor",
    })

    // 1. Direct Firebase Realtime DB listener in HomeSec for immediate global sync
    useEffect(() => {
        if (!fbDatabase) return
        try {
            const statsRef = fbRef(fbDatabase, "stats")
            const unsubscribe = onValue(statsRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    setLiveStats((prev) => ({
                        ...prev,
                        totalPixelsDrawn: data.totalPixelsDrawn || prev.totalPixelsDrawn,
                        totalPixelsPopped: data.totalPixelsPopped || prev.totalPixelsPopped,
                        totalNotesPlayed: data.totalNotesPlayed || prev.totalNotesPlayed,
                    }))
                }
            })
            return () => unsubscribe()
        } catch (e) {
            console.warn("HomeSec Firebase stats error:", e)
        }
    }, [])

    // 2. Custom event listener from PixelArtCreator for instantaneous drawing & popping updates
    useEffect(() => {
        const handleCustomStats = (e: any) => {
            if (e && e.detail) {
                setLiveStats((prev) => ({
                    ...prev,
                    ...e.detail,
                }))
            }
        }
        window.addEventListener("pixel_engine_stats_update", handleCustomStats)
        return () => window.removeEventListener("pixel_engine_stats_update", handleCustomStats)
    }, [])

    // Hyprland dynamic visibility & tiling states
    const isIntroVisible = windows.coreIntro.isOpen && !windows.coreIntro.isMinimized
    const isCanvasVisible = windows.canvasEngine.isOpen && !windows.canvasEngine.isMinimized
    const isCanvasMaximized = windows.canvasEngine.isMaximized || (isCanvasVisible && !isIntroVisible)
    const isIntroMaximized = windows.coreIntro.isMaximized || (isIntroVisible && !isCanvasVisible)
    const isBothTiled = isIntroVisible && isCanvasVisible && !windows.coreIntro.isMaximized && !windows.canvasEngine.isMaximized
    const isDesktopEmpty = !isIntroVisible && !isCanvasVisible && (!windows.projects.isOpen || windows.projects.isMinimized)

    // Hyprland tab toggler:
    // 1. If another tab is maximized and user clicks this tab, un-maximize all and tile side-by-side!
    // 2. If closed, open & un-maximize all to tile side-by-side!
    // 3. If minimized, unminimize & un-maximize all to tile side-by-side!
    // 4. If already visible & tiled, clicking minimizes it (master tile dynamically expands to 100%).
    const toggleWindowTab = (id: "coreIntro" | "canvasEngine" | "projects") => {
        setWindows((prev) => {
            const target = prev[id]
            const isAnyMaximized = prev.coreIntro.isMaximized || prev.canvasEngine.isMaximized || prev.projects.isMaximized

            if (!target.isOpen) {
                return {
                    coreIntro: { ...prev.coreIntro, isMaximized: false },
                    canvasEngine: { ...prev.canvasEngine, isMaximized: false },
                    projects: { ...prev.projects, isMaximized: false },
                    [id]: { ...target, isOpen: true, isMinimized: false, isMaximized: false, zIndex: 25 },
                }
            }
            if (target.isMinimized) {
                return {
                    coreIntro: { ...prev.coreIntro, isMaximized: false },
                    canvasEngine: { ...prev.canvasEngine, isMaximized: false },
                    projects: { ...prev.projects, isMaximized: false },
                    [id]: { ...target, isMinimized: false, isMaximized: false, zIndex: 25 },
                }
            }
            if (target.isMaximized) {
                return {
                    ...prev,
                    [id]: { ...target, isMaximized: false },
                }
            }
            if (isAnyMaximized) {
                return {
                    coreIntro: { ...prev.coreIntro, isMaximized: false },
                    canvasEngine: { ...prev.canvasEngine, isMaximized: false },
                    projects: { ...prev.projects, isMaximized: false },
                    [id]: { ...target, isMinimized: false, isMaximized: false, zIndex: 25 },
                }
            }
            return {
                ...prev,
                [id]: { ...target, isMinimized: true },
            }
        })
        setActiveWindow(id)
    }

    const minimizeWindow = (id: "coreIntro" | "canvasEngine" | "projects", e?: React.MouseEvent) => {
        e?.stopPropagation()
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true, isMaximized: false },
        }))
    }

    const toggleMaximizeWindow = (id: "coreIntro" | "canvasEngine" | "projects", e?: React.MouseEvent) => {
        e?.stopPropagation()
        setWindows((prev) => {
            const nextMax = !prev[id].isMaximized
            return {
                coreIntro: { ...prev.coreIntro, isMaximized: false },
                canvasEngine: { ...prev.canvasEngine, isMaximized: false },
                projects: { ...prev.projects, isMaximized: false },
                [id]: { ...prev[id], isMaximized: nextMax, isMinimized: false, isOpen: true },
            }
        })
        setActiveWindow(id)
    }

    const closeWindow = (id: "coreIntro" | "canvasEngine" | "projects", e?: React.MouseEvent) => {
        e?.stopPropagation()
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isOpen: false, isMaximized: false },
        }))
    }

    const [currentTime, setCurrentTime] = useState("")

    useEffect(() => {
        const updateClock = () => {
            const now = new Date()
            let hours = now.getHours()
            const minutes = String(now.getMinutes()).padStart(2, "0")
            const ampm = hours >= 12 ? "PM" : "AM"
            hours = hours % 12 || 12
            setCurrentTime(`${hours}:${minutes} ${ampm}`)
        }
        updateClock()
        const interval = setInterval(updateClock, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                minWidth: "100%",
                minHeight: "100%",
                backgroundColor: desktopBgColor || activeTheme.desktopBg,
                backgroundImage: `
                    linear-gradient(to right, ${activeTheme.desktopGrid} 1px, transparent 1px),
                    linear-gradient(to bottom, ${activeTheme.desktopGrid} 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: "'Space Mono', 'IBM Plex Mono', 'Chakra Petch', monospace",
                color: activeTheme.textPrimary,
                boxSizing: "border-box",
                userSelect: "none",
                ...style,
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
                
                * {
                    box-sizing: border-box;
                }
                
                button {
                    font-family: inherit;
                    outline: none;
                }
                
                :root {
                    --os-accent: ${activeTheme.accent};
                    --os-accent-glow: ${activeTheme.accentGlow};
                    --os-tag-bg: ${activeTheme.tagBg};
                    --os-border: ${activeTheme.windowBorder};
                    --os-card-bg: ${activeTheme.cardBg};
                    --os-card-border: ${activeTheme.cardBorder};
                }

                .cyber-os-btn {
                    transition: all 0.15s ease;
                    cursor: pointer;
                }
                .cyber-os-btn:hover {
                    background-color: var(--os-tag-bg) !important;
                    color: var(--os-accent) !important;
                    border-color: var(--os-accent) !important;
                }
                .cyber-os-btn:active {
                    transform: scale(0.97);
                }

                .window-ctrl-btn {
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #8E929B;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    border-radius: 0px;
                }
                .window-ctrl-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFFFFF;
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .window-ctrl-btn.close:hover {
                    background: rgba(255, 69, 58, 0.2);
                    color: #FF453A;
                    border-color: #FF453A;
                }

                .cyber-tab-resizer {
                    transition: all 0.15s ease;
                }
                .cyber-tab-resizer:hover .resizer-bar,
                .cyber-tab-resizer.active .resizer-bar {
                    background-color: var(--os-accent) !important;
                    box-shadow: 0 0 10px var(--os-accent) !important;
                }
                .cyber-tab-resizer:hover .resizer-grip,
                .cyber-tab-resizer.active .resizer-grip {
                    border-color: var(--os-accent) !important;
                    background-color: var(--os-accent) !important;
                }
                .cyber-tab-resizer:hover .resizer-dot,
                .cyber-tab-resizer.active .resizer-dot {
                    background-color: #000000 !important;
                }

                @keyframes pulseGreenLed {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.85); }
                }

                @keyframes fadeInTooltip {
                    from {
                        opacity: 0;
                        transform: translateY(-4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInDesktop {
                    from {
                        opacity: 0;
                        transform: scale(0.99);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .cyber-desktop-card:hover {
                    border-color: var(--os-accent) !important;
                    background-color: var(--os-tag-bg) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px var(--os-accent-glow) !important;
                }

                .cyber-terminal-chip {
                    transition: all 0.15s ease;
                }
                .cyber-terminal-chip:hover {
                    background-color: var(--os-accent) !important;
                    color: ${activeTheme.isDark ? "#07080C" : "#FFFFFF"} !important;
                    border-color: var(--os-accent) !important;
                    box-shadow: 0 0 12px var(--os-accent-glow) !important;
                    transform: translateY(-1px);
                }
                .cyber-terminal-chip:active {
                    transform: scale(0.96);
                }
            `}</style>

            {/* TOP BAR */}
            <header
                style={{
                    height: 38,
                    width: "100%",
                    backgroundColor: activeTheme.headerBg,
                    borderBottom: `1px solid ${activeTheme.headerBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 14px",
                    zIndex: 100,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    flexShrink: 0,
                    fontSize: 11,
                    letterSpacing: "0.02em",
                }}
            >
                {/* Left: Shell Identity & Active Window Tabs */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, overflowX: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: activeTheme.textMuted }}>
                        <span style={{ color: activeTheme.accent, fontWeight: 700 }}>$</span>
                        <span style={{ fontWeight: 600, color: activeTheme.textPrimary }}>{name}</span>
                        <span style={{ opacity: 0.4 }}>//</span>
                        <span style={{ color: activeTheme.textMuted, fontSize: 11 }}>{role}</span>
                        <span style={{ opacity: 0.4 }}>{"]"}</span>
                    </div>

                    <div style={{ height: 16, width: 1, backgroundColor: activeTheme.windowBorder, margin: "0 4px" }} />

                    {/* Window Tab: [CORE_INTRO] */}
                    <button
                        onClick={() => toggleWindowTab("coreIntro")}
                        className="cyber-os-btn"
                        title={
                            windows.coreIntro.isMaximized
                                ? "Maximized (Click to restore tile)"
                                : isIntroVisible
                                  ? "Tiled (Click to minimize)"
                                  : "Minimized (Click to open)"
                        }
                        style={{
                            background: isIntroVisible ? activeTheme.tagBg : "transparent",
                            border: `1px solid ${
                                isIntroVisible ? activeTheme.accent : activeTheme.windowBorder
                            }`,
                            color: isIntroVisible ? activeTheme.accent : activeTheme.textMuted,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span style={{ fontSize: 9, color: windows.coreIntro.isMaximized ? activeTheme.accentSecondary : isIntroVisible ? activeTheme.accent : activeTheme.textMuted }}>
                            {windows.coreIntro.isMaximized ? "⛶" : isIntroVisible ? "●" : "_"}
                        </span>
                        <span>{"[CORE_INTRO]"}</span>
                    </button>

                    {/* Window Tab: [CANVAS_ENGINE] */}
                    <button
                        onClick={() => toggleWindowTab("canvasEngine")}
                        className="cyber-os-btn"
                        title={
                            windows.canvasEngine.isMaximized
                                ? "Maximized (Click to restore tile)"
                                : isCanvasVisible
                                  ? "Tiled (Click to minimize)"
                                  : "Minimized (Click to open)"
                        }
                        style={{
                            background: isCanvasVisible ? activeTheme.tagBg : "transparent",
                            border: `1px solid ${
                                isCanvasVisible ? activeTheme.accent : activeTheme.windowBorder
                            }`,
                            color: isCanvasVisible ? activeTheme.accent : activeTheme.textMuted,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span style={{ fontSize: 9, color: windows.canvasEngine.isMaximized ? activeTheme.accentSecondary : isCanvasVisible ? activeTheme.accent : activeTheme.textMuted }}>
                            {windows.canvasEngine.isMaximized ? "⛶" : isCanvasVisible ? "●" : "_"}
                        </span>
                        <span>{"[CANVAS_ENGINE]"}</span>
                    </button>

                    {/* Window Tab: [PROJECTS] */}
                    <button
                        onClick={() => toggleWindowTab("projects")}
                        className="cyber-os-btn"
                        style={{
                            background:
                                windows.projects.isOpen && !windows.projects.isMinimized
                                    ? activeTheme.tagBg
                                    : "transparent",
                            border: `1px solid ${
                                windows.projects.isOpen && !windows.projects.isMinimized
                                    ? activeTheme.accent
                                    : activeTheme.windowBorder
                            }`,
                            color:
                                windows.projects.isOpen && !windows.projects.isMinimized
                                    ? activeTheme.accent
                                    : activeTheme.textMuted,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span style={{ fontSize: 9, color: windows.projects.isOpen && !windows.projects.isMinimized ? activeTheme.accent : activeTheme.textMuted }}>
                            {windows.projects.isOpen && !windows.projects.isMinimized ? "●" : "_"}
                        </span>
                        <span>{"[PROJECTS]"}</span>
                    </button>
                </div>

                {/* Right: Telemetry Indicators & Theme Switcher */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Interactive Location Badge */}
                    <div
                        onMouseEnter={() => setIsLocationHovered(true)}
                        onMouseLeave={() => setIsLocationHovered(false)}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "2px 8px",
                            border: `1px solid ${
                                isLocationHovered ? activeTheme.accent : activeTheme.windowBorder
                            }`,
                            backgroundColor: isLocationHovered ? activeTheme.tagBg : "transparent",
                            color: isLocationHovered ? activeTheme.accent : activeTheme.textMuted,
                            transition: "all 0.18s ease",
                            fontSize: 11,
                            borderRadius: 0,
                            userSelect: "none",
                        }}
                        title="Location Telemetry"
                    >
                        <span style={{ fontSize: 10, color: isLocationHovered ? activeTheme.accent : activeTheme.textMuted }}>📍</span>
                        <span style={{ fontWeight: isLocationHovered ? 600 : 400 }}>
                            {isLocationHovered ? (locationTooltip || "This is where I am based out of") : `[${location}]`}
                        </span>

                        {/* Floating Cyberpunk Tooltip Popover */}
                        {isLocationHovered && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    backgroundColor: activeTheme.headerBg,
                                    border: `1px solid ${activeTheme.accent}`,
                                    boxShadow: `0 10px 30px ${activeTheme.accentGlow}, 0 4px 12px rgba(0,0,0,0.8)`,
                                    padding: "8px 12px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                    whiteSpace: "nowrap",
                                    zIndex: 500,
                                    pointerEvents: "none",
                                    fontSize: 11,
                                    animation: "fadeInTooltip 0.15s ease-out",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: activeTheme.accent, fontWeight: 700 }}>
                                    <span>📍</span>
                                    <span>{locationTooltip || "This is where I am based out of"}</span>
                                </div>
                                <div style={{ color: activeTheme.textMuted, fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ color: activeTheme.textPrimary }}>{location}</span>
                                    <span style={{ opacity: 0.4 }}>//</span>
                                    <span style={{ color: activeTheme.accentSecondary }}>{"GMT+5:30 (IST)"}</span>
                                    <span style={{ opacity: 0.4 }}>//</span>
                                    <span style={{ color: "#22C55E" }}>{"ONLINE"}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: activeTheme.textMuted }}>
                        <span>{"["}{currentTime || "10:25 PM"}{" // status:"}</span>
                        <span style={{ color: "#22C55E", fontWeight: 700 }}>{statusText}</span>
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: "#22C55E",
                                animation: "pulseGreenLed 2s infinite",
                            }}
                        />
                        <span>{"]"}</span>
                    </div>

                    {/* Interactive XP & Level Badge */}
                    <div
                        onMouseEnter={() => setIsXpHovered(true)}
                        onMouseLeave={() => setIsXpHovered(false)}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            padding: "2px 8px",
                            border: `1px solid ${
                                isXpHovered ? activeTheme.accentSecondary : activeTheme.windowBorder
                            }`,
                            backgroundColor: isXpHovered ? activeTheme.tagBg : "transparent",
                            color: activeTheme.accentSecondary,
                            fontWeight: 700,
                            fontSize: 11,
                            transition: "all 0.18s ease",
                            userSelect: "none",
                        }}
                        title="Gamification & Progression Telemetry"
                    >
                        <span>{`[XP: ${liveStats.xp} // Lvl ${liveStats.level}]`}</span>

                        {/* Floating Tooltip Popover */}
                        {isXpHovered && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    backgroundColor: activeTheme.headerBg,
                                    border: `1px solid ${activeTheme.accentSecondary}`,
                                    boxShadow: `0 10px 30px rgba(0,0,0,0.6), 0 0 15px ${activeTheme.accentGlow}`,
                                    padding: "10px 14px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                    whiteSpace: "nowrap",
                                    zIndex: 500,
                                    pointerEvents: "none",
                                    fontSize: 11,
                                    animation: "fadeInTooltip 0.15s ease-out",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: activeTheme.accentSecondary, fontWeight: 700 }}>
                                    <span>⚡</span>
                                    <span>{`Experience & Level: Lvl ${liveStats.level} (${liveStats.title})`}</span>
                                </div>
                                <div style={{ color: activeTheme.textMuted, fontSize: 10, maxWidth: 280, whiteSpace: "normal", lineHeight: 1.4 }}>
                                    {"Real-time player progression. Earn XP by drawing voxels, popping yellow collectibles, and exploring the OS interface."}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, marginTop: 4, borderTop: `1px solid ${activeTheme.cardBorder}`, paddingTop: 5 }}>
                                    <span style={{ color: activeTheme.accent }}>{`Drawn: ${liveStats.totalPixelsDrawn || liveStats.sessionDrawn} px`}</span>
                                    <span style={{ opacity: 0.4 }}>//</span>
                                    <span style={{ color: activeTheme.accentSecondary }}>{`Popped: ${liveStats.totalPixelsPopped || liveStats.sessionPopped}`}</span>
                                    <span style={{ opacity: 0.4 }}>//</span>
                                    <span style={{ color: "#22C55E" }}>{`Active: ${liveStats.activePixels}`}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interactive Theme Switcher Widget (Sun/Moon Toggle + Linux Shell Dropdown) */}
                    <div ref={themeMenuRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        {/* Sun/Moon direct toggle */}
                        <button
                            type="button"
                            onClick={toggleLightDark}
                            className="cyber-os-btn"
                            title={activeTheme.isDark ? "Switch to Solaris (Light Mode)" : "Switch to Noctalia (Dark Mode)"}
                            style={{
                                background: "transparent",
                                border: `1px solid ${activeTheme.windowBorder}`,
                                borderRight: "none",
                                color: activeTheme.isDark ? "#FFD700" : "#2563EB",
                                padding: "2px 7px",
                                fontSize: 11,
                                height: 23,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 0,
                            }}
                        >
                            {activeTheme.isDark ? "🌙" : "☀️"}
                        </button>

                        {/* Theme Preset Selector Dropdown */}
                        <button
                            type="button"
                            onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                            className="cyber-os-btn"
                            title="Linux Shell Theme Presets"
                            style={{
                                background: isThemeMenuOpen ? activeTheme.tagBg : "transparent",
                                border: `1px solid ${isThemeMenuOpen ? activeTheme.accent : activeTheme.windowBorder}`,
                                color: isThemeMenuOpen ? activeTheme.accent : activeTheme.textSecondary,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 700,
                                height: 23,
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                cursor: "pointer",
                                borderRadius: 0,
                            }}
                        >
                            <span style={{ fontSize: 11 }}>{activeTheme.icon}</span>
                            <span>{activeTheme.name.toUpperCase()}</span>
                            <span style={{ fontSize: 8, opacity: 0.6 }}>▾</span>
                        </button>

                        {/* Floating Theme Menu Popover */}
                        {isThemeMenuOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 8px)",
                                    right: 0,
                                    width: 260,
                                    backgroundColor: activeTheme.headerBg,
                                    border: `1px solid ${activeTheme.accent}`,
                                    boxShadow: `0 12px 36px rgba(0,0,0,0.6), 0 0 20px ${activeTheme.accentGlow}`,
                                    zIndex: 600,
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "6px 0",
                                    animation: "fadeInTooltip 0.15s ease-out",
                                    backdropFilter: "blur(16px)",
                                    WebkitBackdropFilter: "blur(16px)",
                                }}
                            >
                                <div style={{ padding: "6px 12px", borderBottom: `1px solid ${activeTheme.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: activeTheme.accent, letterSpacing: "0.08em" }}>
                                        LINUX SHELL THEMES
                                    </span>
                                    <span style={{ fontSize: 9, color: activeTheme.textMuted }}>CLI: theme &lt;name&gt;</span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", padding: "4px 0" }}>
                                    {Object.values(OS_THEMES).map((th) => {
                                        const isSelected = th.id === currentThemeId
                                        return (
                                            <div
                                                key={th.id}
                                                onClick={() => selectTheme(th.id)}
                                                className="cyber-os-btn"
                                                style={{
                                                    padding: "8px 12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    cursor: "pointer",
                                                    background: isSelected ? activeTheme.tagBg : "transparent",
                                                    borderLeft: `3px solid ${isSelected ? activeTheme.accent : "transparent"}`,
                                                    transition: "all 0.15s ease",
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{ fontSize: 13 }}>{th.icon}</span>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                            <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? activeTheme.accent : activeTheme.textPrimary }}>
                                                                {th.name}
                                                            </span>
                                                            <span style={{ fontSize: 9, color: activeTheme.textMuted, opacity: 0.7 }}>
                                                                {th.isDark ? "Dark" : "Light"}
                                                            </span>
                                                        </div>
                                                        <span style={{ fontSize: 9, color: activeTheme.textMuted }}>
                                                            {th.shellName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    {/* Color preview dots */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: th.accent, display: "inline-block" }} />
                                                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: th.desktopBg, border: "1px solid rgba(255,255,255,0.2)", display: "inline-block" }} />
                                                    </div>
                                                    {isSelected && (
                                                        <span style={{ color: activeTheme.accent, fontWeight: 700, fontSize: 11 }}>
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* WORKSPACE AREA */}
            <main
                ref={workspaceRef}
                style={{
                    flex: 1,
                    height: "calc(100% - 38px)",
                    minHeight: 0,
                    padding: 12,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    gap: 0,
                    overflow: "hidden",
                    position: "relative",
                    boxSizing: "border-box",
                    userSelect: isDraggingSplit ? "none" : "auto",
                }}
            >
                {/* Drag overlay to capture pointer moves across canvases */}
                {isDraggingSplit && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 9999,
                            cursor: "col-resize",
                            userSelect: "none",
                        }}
                    />
                )}

                {/* WINDOW 1: [CORE_INTRO] HERO WINDOW */}
                {isIntroVisible && (
                    <section
                        onClick={() => focusWindow("coreIntro")}
                        style={{
                            backgroundColor: activeTheme.windowBg,
                            border: `1px solid ${
                                activeWindow === "coreIntro" ? activeTheme.windowActiveBorder : activeTheme.windowBorder
                            }`,
                            display: windows.canvasEngine.isMaximized ? "none" : "flex",
                            flexDirection: "column",
                            zIndex: windows.coreIntro.zIndex,
                            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                            borderRadius: 0,
                            overflow: "hidden",
                            height: "100%",
                            minHeight: 0,
                            maxHeight: "100%",
                            position: "relative",
                            width: isBothTiled ? `calc(${splitRatio}% - 6px)` : "100%",
                            flex: isBothTiled ? `0 0 calc(${splitRatio}% - 6px)` : "1 1 100%",
                            minWidth: isBothTiled ? 200 : 0,
                            maxWidth: isBothTiled ? (enableEdgeResize ? "calc(100% - 200px)" : `calc(${splitRatio}% - 6px)`) : "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Right Edge Resize Handle on Window 1 */}
                        {isBothTiled && enableEdgeResize && (
                            <div
                                onPointerDown={handleSplitterPointerDown}
                                title="Drag edge to resize tabs"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: 6,
                                    height: "100%",
                                    cursor: "col-resize",
                                    zIndex: 50,
                                }}
                            />
                        )}
                        {/* Title Bar */}
                        <div
                            style={{
                                height: 34,
                                backgroundColor: activeTheme.windowTitleBg,
                                borderBottom: `1px solid ${activeTheme.windowBorder}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 12px",
                                flexShrink: 0,
                                userSelect: "none",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: activeTheme.textPrimary }}>
                                <span style={{ color: activeTheme.accent }}>&gt;</span>
                                <span>{"[CORE_INTRO]"}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button
                                    onClick={(e) => minimizeWindow("coreIntro", e)}
                                    className="window-ctrl-btn"
                                    title="Minimize to top bar"
                                >
                                    <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" /></svg>
                                </button>
                                <button
                                    onClick={(e) => toggleMaximizeWindow("coreIntro", e)}
                                    className="window-ctrl-btn"
                                    title={windows.coreIntro.isMaximized ? "Restore tile" : "Maximize"}
                                >
                                    {windows.coreIntro.isMaximized ? (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="7" height="7" /><path d="M1 4h2M4 1v2" /></svg>
                                    ) : (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="8" height="8" /></svg>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => closeWindow("coreIntro", e)}
                                    className="window-ctrl-btn close"
                                    title="Close"
                                >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1L9 9M9 1L1 9" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Window Body: Real CyberHero component */}
                        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
                            <CyberErrorBoundary>
                                <CyberHero
                                    theme={activeTheme.heroTheme}
                                    accent={activeTheme.accent}
                                    workSection={workSection}
                                    resumeLink={resumeLink}
                                    resumeNewTab={resumeNewTab}
                                    onOpenProjects={() => {
                                        setWindows((prev) => ({
                                            ...prev,
                                            projects: { isOpen: true, isMinimized: false, isMaximized: false },
                                        }))
                                        setActiveWindow("projects")
                                    }}
                                    style={{ width: "100%", minHeight: "100%" }}
                                />
                            </CyberErrorBoundary>
                        </div>
                    </section>
                )}

                {/* DYNAMIC TAB RESIZER / SPLITTER */}
                {isBothTiled && (
                    <div
                        onPointerDown={handleSplitterPointerDown}
                        onDoubleClick={() => {
                            setSplitRatio(defaultSplitRatio)
                            window.dispatchEvent(new Event("resize"))
                        }}
                        title="Drag to resize tabs (Double-click to reset)"
                        className={`cyber-tab-resizer ${isDraggingSplit ? "active" : ""}`}
                        style={{
                            width: 12,
                            flex: "0 0 12px",
                            boxSizing: "border-box",
                            cursor: enableEdgeResize ? "col-resize" : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 45,
                            flexShrink: 0,
                            userSelect: "none",
                        }}
                    >
                        <div
                            className="resizer-bar"
                            style={{
                                width: 2,
                                height: "100%",
                                backgroundColor: isDraggingSplit
                                    ? activeTheme.accent
                                    : activeTheme.borderMuted,
                                transition: "all 0.15s ease",
                            }}
                        />
                        <div
                            className="resizer-grip"
                            style={{
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 8,
                                height: 32,
                                backgroundColor: isDraggingSplit
                                    ? activeTheme.accent
                                    : activeTheme.windowTitleBg,
                                border: `1px solid ${
                                    isDraggingSplit ? activeTheme.accent : activeTheme.cardBorder
                                }`,
                                borderRadius: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 3,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <span className="resizer-dot" style={{ width: 2, height: 2, borderRadius: "50%", backgroundColor: isDraggingSplit ? (activeTheme.isDark ? "#000" : "#FFF") : activeTheme.textMuted }} />
                            <span className="resizer-dot" style={{ width: 2, height: 2, borderRadius: "50%", backgroundColor: isDraggingSplit ? (activeTheme.isDark ? "#000" : "#FFF") : activeTheme.textMuted }} />
                            <span className="resizer-dot" style={{ width: 2, height: 2, borderRadius: "50%", backgroundColor: isDraggingSplit ? (activeTheme.isDark ? "#000" : "#FFF") : activeTheme.textMuted }} />
                        </div>
                    </div>
                )}

                {/* WINDOW 2: [CANVAS_ENGINE] PIXEL CANVAS WINDOW */}
                {isCanvasVisible && (
                    <section
                        onClick={() => focusWindow("canvasEngine")}
                        style={{
                            backgroundColor: activeTheme.windowBg,
                            border: `1px solid ${
                                activeWindow === "canvasEngine" ? activeTheme.windowActiveBorder : activeTheme.windowBorder
                            }`,
                            display: windows.coreIntro.isMaximized ? "none" : "flex",
                            flexDirection: "column",
                            zIndex: windows.canvasEngine.zIndex,
                            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                            borderRadius: 0,
                            overflow: "hidden",
                            height: "100%",
                            minHeight: 0,
                            maxHeight: "100%",
                            position: "relative",
                            width: isBothTiled ? `calc(${100 - splitRatio}% - 6px)` : "100%",
                            flex: isBothTiled ? `0 0 calc(${100 - splitRatio}% - 6px)` : "1 1 100%",
                            minWidth: isBothTiled ? 200 : 0,
                            maxWidth: isBothTiled ? (enableEdgeResize ? "calc(100% - 200px)" : `calc(${100 - splitRatio}% - 6px)`) : "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Left Edge Resize Handle on Window 2 */}
                        {isBothTiled && enableEdgeResize && (
                            <div
                                onPointerDown={handleSplitterPointerDown}
                                title="Drag edge to resize tabs"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: 6,
                                    height: "100%",
                                    cursor: "col-resize",
                                    zIndex: 50,
                                }}
                            />
                        )}
                        {/* Title Bar */}
                        <div
                            style={{
                                height: 34,
                                backgroundColor: activeTheme.windowTitleBg,
                                borderBottom: `1px solid ${activeTheme.windowBorder}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 12px",
                                flexShrink: 0,
                                userSelect: "none",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: activeTheme.textPrimary }}>
                                <span style={{ color: activeTheme.accent }}>#</span>
                                <span>{"[CANVAS_ENGINE]"}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <button
                                    onClick={(e) => minimizeWindow("canvasEngine", e)}
                                    className="window-ctrl-btn"
                                    title="Minimize to top bar"
                                >
                                    <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" /></svg>
                                </button>
                                <button
                                    onClick={(e) => toggleMaximizeWindow("canvasEngine", e)}
                                    className="window-ctrl-btn"
                                    title={windows.canvasEngine.isMaximized ? "Restore tile" : "Maximize"}
                                >
                                    {windows.canvasEngine.isMaximized ? (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="7" height="7" /><path d="M1 4h2M4 1v2" /></svg>
                                    ) : (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="8" height="8" /></svg>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => closeWindow("canvasEngine", e)}
                                    className="window-ctrl-btn close"
                                    title="Close"
                                >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1L9 9M9 1L1 9" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Window Body: Real PixelArtCreator component + Docked Cyberpunk Stats Box */}
                        <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}>
                            <div style={{ flex: 1, position: "relative", height: "100%", width: "100%", minWidth: 0, minHeight: 0, overflow: "hidden" }}>
                                <CyberErrorBoundary>
                                    <PixelArtCreator
                                        pixelSize={pixelSize}
                                        backgroundColor={activeTheme.canvasBg}
                                        gridColor={activeTheme.gridColor}
                                        drawColor={activeTheme.drawColor}
                                        uiTheme={activeTheme.uiTheme}
                                        toolbarTheme={activeTheme.toolbarTheme}
                                        themeConfig={activeTheme}
                                        toolbarLayout="vertical"
                                        toolbarPositionMode="top-left"
                                        showGrid={true}
                                        showUndoRedo={true}
                                        showBrushSize={true}
                                        showClear={true}
                                        showDownload={true}
                                        showPalette={true}
                                        showEyedropper={true}
                                        showBucket={true}
                                        showPencil={true}
                                        showEraser={true}
                                        showTypeTool={true}
                                        showMediaControls={false}
                                        showInfoPills={false}
                                        showCompanion={false}
                                        enableGamification={enableGamification}
                                        enableHoverTrail={enableHoverTrail}
                                        onStatsUpdate={(s) => setLiveStats((prev) => ({ ...prev, ...s }))}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                </CyberErrorBoundary>
                            </div>

                            {/* DOCKED CYBERPUNK STATS BOX (Open by default, controlled via showStatsBar / defaultStatsCollapsed) */}
                            {showStatsBar && (
                                <aside
                                    style={{
                                        width: isStatsBoxCollapsed ? 34 : 260,
                                        height: "100%",
                                        backgroundColor: activeTheme.windowBg,
                                        borderLeft: `1px solid ${activeTheme.windowBorder}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        zIndex: 40,
                                        transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {/* Stats Header */}
                                    <div
                                        style={{
                                            height: 34,
                                            backgroundColor: activeTheme.windowTitleBg,
                                            borderBottom: `1px solid ${activeTheme.windowBorder}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: isStatsBoxCollapsed ? "0 4px" : "0 10px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {!isStatsBoxCollapsed && (
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: activeTheme.accent }}>
                                                <span>//</span>
                                                <span>ENGINE_TELEMETRY</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsStatsBoxCollapsed(!isStatsBoxCollapsed)}
                                            className="window-ctrl-btn"
                                            title={isStatsBoxCollapsed ? "Expand Telemetry" : "Collapse Telemetry"}
                                            style={{ width: 22, height: 22, fontSize: 11, fontWeight: 700 }}
                                        >
                                            {isStatsBoxCollapsed ? "◀" : "▶"}
                                        </button>
                                    </div>

                                    {/* Collapsed Vertical Title */}
                                    {isStatsBoxCollapsed ? (
                                        <div
                                            onClick={() => setIsStatsBoxCollapsed(false)}
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                writingMode: "vertical-rl",
                                                transform: "rotate(180deg)",
                                                cursor: "pointer",
                                                fontSize: 9,
                                                letterSpacing: "0.15em",
                                                color: activeTheme.textSecondary,
                                                gap: 8,
                                            }}
                                        >
                                            <span style={{ color: activeTheme.accent }}>●</span>
                                            <span>TELEMETRY_LOG</span>
                                        </div>
                                    ) : (
                                        /* Expanded Stats Content */
                                        <div
                                            style={{
                                                flex: 1,
                                                overflowY: "auto",
                                                padding: 12,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 12,
                                                fontSize: 10,
                                            }}
                                        >
                                            {/* 1. Core System Metrics */}
                                            <div
                                                style={{
                                                    padding: 10,
                                                    border: `1px solid ${activeTheme.cardBorder}`,
                                                    backgroundColor: activeTheme.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)",
                                                }}
                                            >
                                                <div style={{ color: activeTheme.accent, fontWeight: 700, fontSize: 9, marginBottom: 8, letterSpacing: "0.06em" }}>
                                                    {"[SYS_METRICS // ACCEL]"}
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: activeTheme.textSecondary }}>
                                                    <span>FPS STREAM:</span>
                                                    <span style={{ color: "#22C55E", fontWeight: 700 }}>60.0 FPS [STABLE]</span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: activeTheme.textSecondary }}>
                                                    <span>CANVAS VOXELS:</span>
                                                    <span style={{ color: activeTheme.textPrimary, fontWeight: 700 }}>{`${liveStats.activePixels} on canvas`}</span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: activeTheme.textSecondary }}>
                                                    <span>RENDER LATENCY:</span>
                                                    <span style={{ color: activeTheme.accent }}>&lt; 1.8 ms</span>
                                                </div>
                                            </div>

                                            {/* 2. Live XP Progress Gauge */}
                                            <div
                                                style={{
                                                    padding: 10,
                                                    border: `1px solid ${activeTheme.cardBorder}`,
                                                    backgroundColor: activeTheme.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)",
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                                    <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 9, letterSpacing: "0.06em" }}>
                                                        {`[XP_PROGRESS // LVL ${liveStats.level}]`}
                                                    </span>
                                                    <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 10 }}>
                                                        {`${liveStats.xp % 200} / 200 XP`}
                                                    </span>
                                                </div>
                                                {/* Segmented Neon Bar */}
                                                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                                                    {[...Array(16)].map((_, i) => {
                                                        const filled = i < Math.min(16, Math.floor(((liveStats.xp % 200) / 200) * 16))
                                                        return (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    height: 6,
                                                                    flex: 1,
                                                                    backgroundColor: filled ? "#FFD700" : activeTheme.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                                                                    boxShadow: filled ? "0 0 6px rgba(255, 215, 0, 0.5)" : "none",
                                                                    transition: "all 0.15s ease",
                                                                }}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: activeTheme.textSecondary }}>
                                                    <span>{`RANK: ${liveStats.title}`}</span>
                                                    <span style={{ color: "#22C55E" }}>
                                                        {`${Math.round(((liveStats.xp % 200) / 200) * 100)}%`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 3. Global Analytics (Live Firebase) */}
                                            <div
                                                style={{
                                                    padding: 10,
                                                    border: `1px solid ${activeTheme.cardBorder}`,
                                                    backgroundColor: activeTheme.isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)",
                                                }}
                                            >
                                                <div style={{ color: activeTheme.accent, fontWeight: 700, fontSize: 9, marginBottom: 8, letterSpacing: "0.06em" }}>
                                                    {"[GLOBAL_COMMUNITY // FIREBASE_LIVE]"}
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: activeTheme.textSecondary }}>
                                                    <span>GLOBAL DRAWN:</span>
                                                    <span style={{ color: activeTheme.textPrimary, fontWeight: 700 }}>
                                                        {`${new Intl.NumberFormat("en-US").format(liveStats.totalPixelsDrawn)} px`}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: activeTheme.textSecondary }}>
                                                    <span>GLOBAL CLEARED:</span>
                                                    <span style={{ color: "#FFD700", fontWeight: 700 }}>
                                                        {`${new Intl.NumberFormat("en-US").format(liveStats.totalPixelsPopped)} px`}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: activeTheme.textSecondary }}>
                                                    <span>NOTES SYNTHED:</span>
                                                    <span style={{ color: "#22C55E" }}>
                                                        {new Intl.NumberFormat("en-US").format(liveStats.totalNotesPlayed)}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", color: activeTheme.textSecondary }}>
                                                    <span>SESSION DRAWN:</span>
                                                    <span style={{ color: activeTheme.accent }}>{`+${liveStats.sessionDrawn} px`}</span>
                                                </div>
                                            </div>

                                            {/* 4. Engine Log Output */}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    padding: 10,
                                                    border: `1px solid ${activeTheme.cardBorder}`,
                                                    backgroundColor: activeTheme.terminalBg,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 4,
                                                    fontFamily: "'IBM Plex Mono', monospace",
                                                    fontSize: 9,
                                                    minHeight: 110,
                                                }}
                                            >
                                                <div style={{ color: activeTheme.textSecondary, fontWeight: 700, marginBottom: 4 }}>
                                                    {"[ENGINE_LOG // STDOUT]"}
                                                </div>
                                                <div style={{ color: "#22C55E" }}>{"> [FIREBASE] Realtime listener active"}</div>
                                                <div style={{ color: activeTheme.accent }}>{"> [CANVAS] Engine active // Collectibles armed // Full-bleed grid ready"}</div>
                                                <div style={{ color: activeTheme.textSecondary }}>{`> [VOXELS] ${liveStats.activePixels} active on board`}</div>
                                                <div style={{ color: "#FFD700" }}>{`> [STATUS] Level ${liveStats.level} (${liveStats.title})`}</div>
                                                <div style={{ color: activeTheme.textMuted }}>{"> [READY] Awaiting pointer strokes..."}</div>
                                            </div>
                                        </div>
                                    )}
                                </aside>
                            )}
                        </div>
                    </section>
                )}

                {/* EMPTY DESKTOP ENVIRONMENT (Appears when all tabs are minimized) */}
                {isDesktopEmpty && (
                    <div
                        className="cyber-empty-desktop"
                        style={{
                            position: "absolute",
                            inset: 12,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: "clamp(16px, 2.5vw, 32px)",
                            backgroundColor: activeTheme.isDark ? "rgba(7, 8, 12, 0.75)" : "rgba(242, 245, 250, 0.88)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: `1px dashed ${activeTheme.cardBorder}`,
                            boxSizing: "border-box",
                            overflowY: "auto",
                            zIndex: 5,
                            animation: "fadeInDesktop 0.25s ease-out",
                        }}
                    >
                        {/* Top Desktop HUD Bar */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 12,
                                borderBottom: `1px solid ${activeTheme.cardBorder}`,
                                paddingBottom: 12,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ color: activeTheme.accent, fontWeight: 700, fontSize: 11 }}>
                                    {`[DESKTOP_HUD // ${activeTheme.shellName.toUpperCase()}]`}
                                </span>
                                <span style={{ fontSize: 10, color: activeTheme.textMuted }}>//</span>
                                <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>● ALL TABS MINIMIZED</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10, color: activeTheme.textSecondary }}>
                                <span>{`VOXELS: ${liveStats.totalPixelsDrawn || liveStats.sessionDrawn} PLACED`}</span>
                                <span style={{ opacity: 0.3 }}>//</span>
                                <span style={{ color: "#FFD700" }}>{`XP: ${liveStats.xp} (LVL ${liveStats.level})`}</span>
                                <span style={{ opacity: 0.3 }}>//</span>
                                <span style={{ color: activeTheme.accent }}>60 FPS READY</span>
                            </div>
                        </div>

                        {/* Center: Desktop App Launchers Grid */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto 0",
                                padding: "20px 0",
                                gap: 20,
                            }}
                        >
                            <div style={{ textAlign: "center", maxWidth: 640 }}>
                                <div style={{ fontSize: 10, color: activeTheme.accent, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 6 }}>
                                    {"[ ADITYA DIUNDI // DESIGN ENGINEER // DELHI (UTC+05:30) ]"}
                                </div>
                                <h2
                                    style={{
                                        fontFamily: "'Chakra Petch', sans-serif",
                                        fontSize: "clamp(22px, 2.6vw, 32px)",
                                        color: activeTheme.textPrimary,
                                        margin: "0 0 8px 0",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Tactile Systems & Creative Engineering
                                </h2>
                                <p style={{ fontSize: 12, color: activeTheme.textSecondary, margin: 0, lineHeight: 1.6 }}>
                                    Select an application module below or click any tab on the top bar to restore your workspace.
                                </p>
                            </div>

                            {/* App Launcher Cards */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: 14,
                                    width: "100%",
                                    maxWidth: 960,
                                }}
                            >
                                {/* App 1: Core Intro */}
                                <div
                                    onClick={() => {
                                        playCyberHeroBlip(880, 0.08)
                                        setWindows((prev) => ({
                                            ...prev,
                                            coreIntro: { ...prev.coreIntro, isOpen: true, isMinimized: false },
                                        }))
                                        setActiveWindow("coreIntro")
                                    }}
                                    className="cyber-desktop-card"
                                    style={{
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        backgroundColor: activeTheme.cardBg,
                                        padding: 16,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 18 }}>⚡</span>
                                        <span style={{ fontSize: 9, color: activeTheme.accent, fontWeight: 700 }}>APP // 01</span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeTheme.textPrimary }}>CORE_INTRO.sh</div>
                                    <div style={{ fontSize: 10, color: activeTheme.textSecondary, lineHeight: 1.4 }}>
                                        Personal manifesto, design system philosophy & capability matrix.
                                    </div>
                                    <div style={{ fontSize: 9, color: activeTheme.accent, marginTop: 4, fontWeight: 700 }}>
                                        [ CLICK TO LAUNCH ↗ ]
                                    </div>
                                </div>

                                {/* App 2: Pixel Engine */}
                                <div
                                    onClick={() => {
                                        playCyberHeroBlip(960, 0.08)
                                        setWindows((prev) => ({
                                            ...prev,
                                            canvasEngine: { ...prev.canvasEngine, isOpen: true, isMinimized: false },
                                        }))
                                        setActiveWindow("canvasEngine")
                                    }}
                                    className="cyber-desktop-card"
                                    style={{
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        backgroundColor: activeTheme.cardBg,
                                        padding: 16,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 18 }}>🎨</span>
                                        <span style={{ fontSize: 9, color: activeTheme.accent, fontWeight: 700 }}>APP // 02</span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeTheme.textPrimary }}>PIXEL_ENGINE.bin</div>
                                    <div style={{ fontSize: 10, color: activeTheme.textSecondary, lineHeight: 1.4 }}>
                                        Interactive 60 FPS voxel canvas, gamified yellow boxes & soundboard.
                                    </div>
                                    <div style={{ fontSize: 9, color: activeTheme.accent, marginTop: 4, fontWeight: 700 }}>
                                        [ CLICK TO LAUNCH ↗ ]
                                    </div>
                                </div>

                                {/* App 3: Projects Portfolio */}
                                <div
                                    onClick={() => {
                                        playCyberHeroBlip(1040, 0.08)
                                        setWindows((prev) => ({
                                            ...prev,
                                            projects: { isOpen: true, isMinimized: false, isMaximized: false },
                                        }))
                                        setActiveWindow("projects")
                                    }}
                                    className="cyber-desktop-card"
                                    style={{
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        backgroundColor: activeTheme.cardBg,
                                        padding: 16,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 18 }}>📁</span>
                                        <span style={{ fontSize: 9, color: activeTheme.accent, fontWeight: 700 }}>APP // 03</span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeTheme.textPrimary }}>PROJECTS.dir</div>
                                    <div style={{ fontSize: 10, color: activeTheme.textSecondary, lineHeight: 1.4 }}>
                                        Enterprise token architectures, telemetry consoles & case studies.
                                    </div>
                                    <div style={{ fontSize: 9, color: activeTheme.accent, marginTop: 4, fontWeight: 700 }}>
                                        [ OPEN DRAWER ↗ ]
                                    </div>
                                </div>

                                {/* App 4: Resume */}
                                <div
                                    onClick={() => {
                                        playCyberHeroBlip(1120, 0.08)
                                        if (resumeLink) {
                                            window.open(resumeLink, resumeNewTab ? "_blank" : "_self")
                                        }
                                    }}
                                    className="cyber-desktop-card"
                                    style={{
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        backgroundColor: activeTheme.cardBg,
                                        padding: 16,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        transition: "all 0.18s ease",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 18 }}>📄</span>
                                        <span style={{ fontSize: 9, color: "#FFD700", fontWeight: 700 }}>DOC // 04</span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: activeTheme.textPrimary }}>RESUME_ADITYA.pdf</div>
                                    <div style={{ fontSize: 10, color: activeTheme.textSecondary, lineHeight: 1.4 }}>
                                        Curriculum vitae, design engineering milestones & direct contact.
                                    </div>
                                    <div style={{ fontSize: 9, color: "#FFD700", marginTop: 4, fontWeight: 700 }}>
                                        [ VIEW RÉSUMÉ ↗ ]
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Spacious Interactive CLI Terminal with Quick-Run Chips */}
                        <div
                            onClick={() => cliInputRef.current?.focus()}
                            style={{
                                border: `1px solid ${activeTheme.terminalBorder}`,
                                backgroundColor: activeTheme.terminalBg,
                                boxShadow: `0 16px 40px rgba(0, 0, 0, 0.7), 0 0 20px ${activeTheme.accentGlow}`,
                                padding: "12px 16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                minHeight: 280,
                                maxHeight: 380,
                                fontSize: 11,
                                fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
                                boxSizing: "border-box",
                                cursor: "text",
                            }}
                        >
                            {/* Terminal Top Window Bar */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom: `1px solid ${activeTheme.cardBorder}`,
                                    paddingBottom: 8,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FF5F56", display: "inline-block" }} />
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FFBD2E", display: "inline-block" }} />
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#27C93F", display: "inline-block" }} />
                                    <span style={{ marginLeft: 8, color: activeTheme.textPrimary, fontWeight: 700, fontSize: 11 }}>
                                        {`aditya@${currentThemeId}-shell:~ (zsh)`}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: "#22C55E", fontSize: 10, fontWeight: 600 }}>● READY</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            executeCommand("clear")
                                        }}
                                        style={{
                                            background: "transparent",
                                            border: `1px solid ${activeTheme.cardBorder}`,
                                            color: activeTheme.textSecondary,
                                            fontSize: 9,
                                            padding: "2px 6px",
                                            cursor: "pointer",
                                        }}
                                        title="Clear screen"
                                    >
                                        🧹 CLEAR
                                    </button>
                                </div>
                            </div>

                            {/* One-Click Quick Command Chips Bar */}
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    flexWrap: "wrap",
                                    paddingBottom: 4,
                                    borderBottom: `1px solid ${activeTheme.borderMuted}`,
                                }}
                            >
                                <span style={{ color: activeTheme.textMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", marginRight: 2 }}>
                                    QUICK CHIPS:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => executeCommand("intro")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>⚡</span>
                                    <span>intro</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("engine")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>🎨</span>
                                    <span>engine</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("projects")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>📁</span>
                                    <span>projects</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand(activeTheme.isDark ? "light" : "dark")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.isDark ? "#FFD700" : "#2563EB",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>{activeTheme.isDark ? "☀️" : "🌙"}</span>
                                    <span>{activeTheme.isDark ? "light" : "dark"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("theme list")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>🎨</span>
                                    <span>theme list</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("resume")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: "rgba(255, 215, 0, 0.08)",
                                        border: "1px solid rgba(255, 215, 0, 0.3)",
                                        color: "#FFD700",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>📄</span>
                                    <span>resume</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("neofetch")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.cardBg,
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        color: activeTheme.textPrimary,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>🖥️</span>
                                    <span>neofetch</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => executeCommand("help")}
                                    className="cyber-terminal-chip"
                                    style={{
                                        background: activeTheme.cardBg,
                                        border: `1px solid ${activeTheme.cardBorder}`,
                                        color: activeTheme.textSecondary,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <span>❓</span>
                                    <span>help</span>
                                </button>
                            </div>

                            {/* Spacious Scrollable Output Log */}
                            <div
                                ref={terminalLogRef}
                                style={{
                                    flex: 1,
                                    minHeight: 140,
                                    maxHeight: 200,
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                    lineHeight: 1.55,
                                    paddingRight: 4,
                                }}
                            >
                                {cliHistory.map((line, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            color: line.startsWith(">")
                                                ? activeTheme.accent
                                                : line.startsWith("[SUCCESS]")
                                                ? "#22C55E"
                                                : line.startsWith("[ERROR]")
                                                ? "#EF4444"
                                                : line.startsWith("[INFO]")
                                                ? "#FFD700"
                                                : line.startsWith("OS:") || line.startsWith("HOST:") || line.startsWith("ROLE:") || line.startsWith("STACK:") || line.startsWith("ACTIVE THEME:")
                                                ? activeTheme.textPrimary
                                                : activeTheme.textSecondary,
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>

                            {/* Interactive Command Input Form */}
                            <form
                                onSubmit={handleCliSubmit}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: "auto",
                                    borderTop: `1px solid ${activeTheme.cardBorder}`,
                                    paddingTop: 8,
                                }}
                            >
                                <span style={{ color: activeTheme.accent, fontWeight: 700, whiteSpace: "nowrap" }}>
                                    {`aditya@${currentThemeId}:~$`}
                                </span>
                                <input
                                    ref={cliInputRef}
                                    type="text"
                                    value={cliInput}
                                    onChange={(e) => setCliInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Click a quick chip above or type command (try 'theme list', 'caelestia', 'neofetch')..."
                                    style={{
                                        flex: 1,
                                        background: "transparent",
                                        border: "none",
                                        color: activeTheme.textPrimary,
                                        fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
                                        fontSize: 11,
                                        outline: "none",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="cyber-os-btn"
                                    style={{
                                        background: activeTheme.tagBg,
                                        border: `1px solid ${activeTheme.accent}`,
                                        color: activeTheme.accent,
                                        padding: "3px 10px",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    RUN ↵
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* WINDOW 3: [PROJECTS] PORTFOLIO DRAWER */}
                {windows.projects.isOpen && !windows.projects.isMinimized && (
                    <section
                        onClick={() => focusWindow("projects")}
                        style={{
                            position: "absolute",
                            top: 24,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "90%",
                            maxWidth: 860,
                            maxHeight: "85%",
                            backgroundColor: activeTheme.windowBg,
                            border: `1px solid ${activeTheme.accent}`,
                            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 24px ${activeTheme.accentGlow}`,
                            zIndex: windows.projects.zIndex + 20,
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 0,
                            overflow: "hidden",
                        }}
                    >
                        {/* Title Bar */}
                        <div
                            style={{
                                height: 36,
                                backgroundColor: activeTheme.windowTitleBg,
                                borderBottom: `1px solid ${activeTheme.windowBorder}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 14px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: activeTheme.accent }}>
                                <span>{"[PROJECTS // Design Engineering Portfolio]"}</span>
                            </div>

                            <button
                                onClick={(e) => closeWindow("projects", e)}
                                className="window-ctrl-btn close"
                                title="Close"
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1L9 9M9 1L1 9" /></svg>
                            </button>
                        </div>

                        {/* Projects Content Grid */}
                        <div
                            style={{
                                padding: 24,
                                overflowY: "auto",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                                gap: 16,
                            }}
                        >
                            {/* Project 1 */}
                            <div
                                style={{
                                    border: `1px solid ${activeTheme.cardBorder}`,
                                    backgroundColor: activeTheme.cardBg,
                                    padding: 18,
                                    borderRadius: 0,
                                }}
                            >
                                <div style={{ fontSize: 9, color: activeTheme.accent, fontWeight: 700, marginBottom: 4 }}>
                                    ENTERPRISE ARCHITECTURE // 01
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: activeTheme.textPrimary, margin: "0 0 8px 0" }}>
                                    Enterprise Design System & Token Fabric
                                </h3>
                                <p style={{ fontSize: 11, color: activeTheme.textSecondary, lineHeight: 1.5, margin: "0 0 14px 0" }}>
                                    Unified 40+ engineering repositories with multi-platform design tokens, theme engines, and strict accessibility automation.
                                </p>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>React</span>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>TypeScript</span>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>Tokens Studio</span>
                                </div>
                                <a
                                    href={workSection ? `#${workSection.replace(/^#/, "")}` : "#work"}
                                    className="cyber-os-btn"
                                    style={{
                                        display: "inline-block",
                                        textDecoration: "none",
                                        padding: "6px 12px",
                                        border: `1px solid ${activeTheme.accent}`,
                                        background: activeTheme.tagBg,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                    }}
                                >
                                    {"[ VIEW CASE STUDY → ]"}
                                </a>
                            </div>

                            {/* Project 2 */}
                            <div
                                style={{
                                    border: `1px solid ${activeTheme.cardBorder}`,
                                    backgroundColor: activeTheme.cardBg,
                                    padding: 18,
                                    borderRadius: 0,
                                }}
                            >
                                <div style={{ fontSize: 9, color: activeTheme.accent, fontWeight: 700, marginBottom: 4 }}>
                                    DATA WORKFLOWS // 02
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: activeTheme.textPrimary, margin: "0 0 8px 0" }}>
                                    High-Throughput Analytics & Telemetry Console
                                </h3>
                                <p style={{ fontSize: 11, color: activeTheme.textSecondary, lineHeight: 1.5, margin: "0 0 14px 0" }}>
                                    Interactive canvas telemetry processing millions of real-time events with custom WebGL and canvas acceleration layers.
                                </p>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>Canvas API</span>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>Web Audio</span>
                                    <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${activeTheme.cardBorder}`, color: activeTheme.textMuted, background: activeTheme.tagBg }}>WebSockets</span>
                                </div>
                                <a
                                    href={workSection ? `#${workSection.replace(/^#/, "")}` : "#work"}
                                    className="cyber-os-btn"
                                    style={{
                                        display: "inline-block",
                                        textDecoration: "none",
                                        padding: "6px 12px",
                                        border: `1px solid ${activeTheme.accent}`,
                                        background: activeTheme.tagBg,
                                        color: activeTheme.accent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                    }}
                                >
                                    {"[ VIEW CASE STUDY → ]"}
                                </a>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

addPropertyControls(HomeSec, {
    defaultTheme: {
        type: ControlType.Enum,
        title: "Default OS Theme",
        options: ["noctalia", "caelestia", "tokyo-night", "catppuccin", "matrix", "light"],
        optionTitles: [
            "Noctalia (Cyber Dark)",
            "Caelestia (Nordic Frost)",
            "Tokyo Night (Violet Neon)",
            "Catppuccin Mocha (Lavender)",
            "Matrix (Phosphor Green)",
            "Solaris Paper (Light Mode)",
        ],
        defaultValue: "noctalia",
    },
    name: {
        type: ControlType.String,
        title: "Name",
        defaultValue: "ADITYA DIUNDI",
    },
    role: {
        type: ControlType.String,
        title: "Role",
        defaultValue: "Design Engineer",
    },
    location: {
        type: ControlType.String,
        title: "Location",
        defaultValue: "Delhi, India",
    },
    statusText: {
        type: ControlType.String,
        title: "Status",
        defaultValue: "ACTIVE",
    },
    pixelSize: {
        type: ControlType.Number,
        title: "Pixel Size",
        defaultValue: 20,
        min: 4,
        max: 64,
        step: 2,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Canvas BG Color",
        defaultValue: "#07080C",
    },
    gridColor: {
        type: ControlType.Color,
        title: "Grid Line Color",
        defaultValue: "rgba(255, 255, 255, 0.05)",
    },
    desktopBgColor: {
        type: ControlType.Color,
        title: "Desktop BG Color",
        defaultValue: "#07080C",
    },
    drawColor: {
        type: ControlType.Color,
        title: "Draw Color",
        defaultValue: "#3B82F6",
    },
    showStatsBar: {
        type: ControlType.Boolean,
        title: "Pixel Stats: Visible",
        defaultValue: true,
    },
    defaultStatsCollapsed: {
        type: ControlType.Boolean,
        title: "Pixel Stats: Start Collapsed",
        defaultValue: true,
    },
    defaultSplitRatio: {
        type: ControlType.Number,
        title: "Tab Split % (Left)",
        defaultValue: 60,
        min: 20,
        max: 80,
        step: 1,
    },
    enableEdgeResize: {
        type: ControlType.Boolean,
        title: "Enable Edge Resizing",
        defaultValue: true,
    },
    locationTooltip: {
        type: ControlType.String,
        title: "Location Tooltip",
        defaultValue: "This is where I am based out of",
    },
    uiTheme: {
        type: ControlType.Enum,
        title: "UI Theme",
        options: ["dark", "light", "glass-dark", "glass-light"],
        defaultValue: "dark",
    },
    heroTheme: {
        type: ControlType.Enum,
        title: "Hero Theme",
        options: ["dark", "light"],
        defaultValue: "dark",
    },
    heroAccent: {
        type: ControlType.Color,
        title: "Hero Accent",
        defaultValue: "#245BFF",
    },
    workSection: {
        type: ControlType.String,
        title: "Work Section ID",
        defaultValue: "work",
    },
    resumeLink: {
        type: ControlType.String,
        title: "Resume URL",
        defaultValue: "",
    },
    resumeNewTab: {
        type: ControlType.Boolean,
        title: "Resume New Tab",
        defaultValue: true,
    },
    enableGamification: {
        type: ControlType.Boolean,
        title: "Yellow Boxes (Collectibles)",
        defaultValue: true,
    },
    enableHoverTrail: {
        type: ControlType.Boolean,
        title: "Pixel Trail Effect",
        defaultValue: false,
    },
})
