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
    enableHoverTrail: boolean
    lowPowerMode: boolean
    exportScale: number

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

export default function PixelArtCreator({
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
    enableHoverTrail = true,
    lowPowerMode = false,
    exportScale = 4,
    enableGamification = false,
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
    const [gridSize, setGridSize] = useState({ rows: 16, cols: 16 })

    const [isMobile, setIsMobile] = useState(false)
    const [containerDimensions, setContainerDimensions] = useState({
        width: 0,
        height: 0,
    })

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
    const collectiblesRef = useRef<Map<string, { createdAt: number }>>(
        new Map()
    )
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

    const canvasTotalWidth = (gridSize.cols + gridSize.rows) * selectedPixelSize
    const canvasTotalHeight =
        (gridSize.cols + gridSize.rows) * selectedPixelSize

    useEffect(() => {
        setInternalPerspective(gridPerspective)
    }, [gridPerspective])

    // Gamification Loop (2 second timing)
    useEffect(() => {
        if (!enableGamification) {
            collectiblesRef.current.clear()
            return
        }
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
            if (
                collectiblesRef.current.size < 3 &&
                !scrollProgressRef.current
            ) {
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
        }, 2000)
        return () => clearInterval(interval)
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

    const projectToScreen = useCallback(
        (
            col: number,
            row: number,
            type: "square" | "isometric",
            size: number
        ) => {
            const canvasW = (gridSize.cols + gridSize.rows) * size
            const canvasH = (gridSize.cols + gridSize.rows) * size

            const sqOffsetX = Math.floor((canvasW - gridSize.cols * size) / 2)
            const sqOffsetY = Math.floor((canvasH - gridSize.rows * size) / 2)
            const sqX = sqOffsetX + col * size
            const sqY = sqOffsetY + row * size

            const contW =
                containerDimensions.width ||
                (typeof window !== "undefined" ? window.innerWidth : 800)
            const contH =
                containerDimensions.height ||
                (typeof window !== "undefined" ? window.innerHeight : 600)
            const isoScale = Math.min(
                1,
                (contW - 40) / canvasW,
                (contH - 40) / (canvasH * 0.55)
            )
            const isoSize = size * isoScale

            const hx = isoSize
            const hy = isoSize * 0.5
            const isoTopX =
                canvasW / 2 - ((gridSize.cols - gridSize.rows) * isoSize) / 2
            const isoTopY =
                canvasH / 2 - ((gridSize.cols + gridSize.rows) * hy) / 2

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
        [
            gridSize.cols,
            gridSize.rows,
            containerDimensions.width,
            containerDimensions.height,
        ]
    )

    const projectToGrid = useCallback(
        (x: number, y: number, type: "square" | "isometric", size: number) => {
            if (pixelStyle === "3d") {
                y += size * 0.4
            }
            const canvasW = (gridSize.cols + gridSize.rows) * size
            const canvasH = (gridSize.cols + gridSize.rows) * size
            const EPSILON = 0.0001

            if (type === "isometric") {
                const contW =
                    containerDimensions.width ||
                    (typeof window !== "undefined" ? window.innerWidth : 800)
                const contH =
                    containerDimensions.height ||
                    (typeof window !== "undefined" ? window.innerHeight : 600)
                const isoScale = Math.min(
                    1,
                    (contW - 40) / canvasW,
                    (contH - 40) / (canvasH * 0.55)
                )
                const isoSize = size * isoScale

                const hx = isoSize
                const hy = isoSize * 0.5
                const isoTopX =
                    canvasW / 2 -
                    ((gridSize.cols - gridSize.rows) * isoSize) / 2
                const isoTopY =
                    canvasH / 2 - ((gridSize.cols + gridSize.rows) * hy) / 2

                const adjX = x - isoTopX
                const adjY = y - isoTopY

                const col = (adjX / hx + adjY / hy) / 2
                const row = (adjY / hy - adjX / hx) / 2

                return {
                    col: Math.floor(col + EPSILON),
                    row: Math.floor(row + EPSILON),
                }
            }

            const sqOffsetX = (canvasW - gridSize.cols * size) / 2
            const sqOffsetY = (canvasH - gridSize.rows * size) / 2

            return {
                col: Math.floor((x - sqOffsetX) / size),
                row: Math.floor((y - sqOffsetY) / size),
            }
        },
        [
            gridSize.cols,
            gridSize.rows,
            containerDimensions.width,
            containerDimensions.height,
        ]
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
                const contW =
                    containerDimensions.width ||
                    (typeof window !== "undefined" ? window.innerWidth : 800)
                const contH =
                    containerDimensions.height ||
                    (typeof window !== "undefined" ? window.innerHeight : 600)
                const canvasW = (gridSize.cols + gridSize.rows) * size
                const canvasH = (gridSize.cols + gridSize.rows) * size
                const isoScale = Math.min(
                    1,
                    (contW - 40) / canvasW,
                    (contH - 40) / (canvasH * 0.55)
                )
                const hx = size * isoScale
                const hy = size * isoScale * 0.5

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
        const artCtx = canvas.getContext("2d", { alpha: true })
        if (!artCtx) return

        artCtx.clearRect(0, 0, canvas.width, canvas.height)
        artCtx.drawImage(cache, 0, 0)

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

            const bMinX = Math.max(
                0,
                canvasTotalWidth / 2 - containerDimensions.width / 2
            )
            const bMaxX = Math.min(
                canvasTotalWidth,
                canvasTotalWidth / 2 + containerDimensions.width / 2
            )
            const bMinY = Math.max(
                0,
                canvasTotalHeight / 2 - containerDimensions.height / 2
            )
            const bMaxY = Math.min(
                canvasTotalHeight,
                canvasTotalHeight / 2 + containerDimensions.height / 2
            )
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

                    if (activeHoverTrail || isIdle) {
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
                                    const isoScale = Math.min(
                                        1,
                                        (contW - 40) / canvasTotalWidth,
                                        (contH - 40) /
                                            (canvasTotalHeight * 0.55)
                                    )
                                    const hx = s * isoScale
                                    const hy = s * isoScale * 0.5
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
                                          (contH - 40) /
                                              (canvasTotalHeight * 0.55)
                                      )
                                    : 1
                            const pxSize = selectedPixelSize * size * isoScale

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
                        const isoScale = Math.min(
                            1,
                            (contW - 40) / canvasTotalWidth,
                            (contH - 40) / (canvasTotalHeight * 0.55)
                        )
                        const isoHx = selectedPixelSize * isoScale
                        const isoHy = selectedPixelSize * isoScale * 0.5

                        const progress = perspectiveProgressRef.current
                        const isoTopX =
                            canvasTotalWidth / 2 -
                            ((gridSize.cols - gridSize.rows) * isoHx) / 2
                        const isoTopY =
                            canvasTotalHeight / 2 -
                            ((gridSize.cols + gridSize.rows) * isoHy) / 2
                        const sqOffsetX = Math.floor(
                            (canvasTotalWidth -
                                gridSize.cols * selectedPixelSize) /
                                2
                        )
                        const sqOffsetY = Math.floor(
                            (canvasTotalHeight -
                                gridSize.rows * selectedPixelSize) /
                                2
                        )

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

                        const sqX = sqOffsetX + c * selectedPixelSize
                        const sqY = sqOffsetY + r * selectedPixelSize

                        // Recompute isometric anchor
                        const isoScale = Math.min(
                            1,
                            ((containerDimensions.width || window.innerWidth) -
                                40) /
                                canvasTotalWidth,
                            ((containerDimensions.height ||
                                window.innerHeight) -
                                40) /
                                (canvasTotalHeight * 0.55)
                        )
                        const hx = selectedPixelSize * isoScale
                        const hy = selectedPixelSize * isoScale * 0.5
                        const iTopX =
                            canvasTotalWidth / 2 -
                            ((gridSize.cols - gridSize.rows) * hx) / 2
                        const iTopY =
                            canvasTotalHeight / 2 -
                            ((gridSize.cols + gridSize.rows) * hy) / 2

                        const isoX = iTopX + (c - r) * hx
                        const isoY = iTopY + (c + r) * hy

                        const p = perspectiveProgressRef.current
                        const targetX = sqX + (isoX - sqX) * p
                        const targetY = sqY + (isoY - sqY) * p

                        buddyTargetRef.current.x = targetX - companionSize / 2
                        buddyTargetRef.current.y = targetY - companionSize / 2
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
        }
    }, [historyStep, history, rebuildStaticCache, redrawArtwork])

    const handleRedo = useCallback(() => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1
            pixelsRef.current = new Map(history[newStep])
            setHistoryStep(newStep)
            rebuildStaticCache()
            redrawArtwork()
        }
    }, [historyStep, history, rebuildStaticCache, redrawArtwork])

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
        ]
    )

    const floodFill = useCallback(
        (startRow: number, startCol: number, targetColor: string) => {
            const ext =
                internalPerspective === "isometric"
                    ? Math.max(gridSize.cols, gridSize.rows)
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
                    ? Math.max(gridSize.cols, gridSize.rows)
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
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect
                if (width === 0 || height === 0) return
                const cols = Math.floor(width / selectedPixelSize)
                const rows = Math.floor(height / selectedPixelSize)
                startTransition(() => {
                    setGridSize({
                        rows: Math.max(rows, 10),
                        cols: Math.max(cols, 10),
                    })
                    setContainerDimensions({ width, height })
                    setIsMobile(width < 768)
                })
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [selectedPixelSize])

    useEffect(() => {
        startTransition(() => {
            setSelectedPixelSize(pixelSize)
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                if (rect.width > 0 && rect.height > 0) {
                    const cols = Math.floor(rect.width / pixelSize)
                    const rows = Math.floor(rect.height / pixelSize)
                    setGridSize({
                        rows: Math.max(rows, 10),
                        cols: Math.max(cols, 10),
                    })
                }
            }
        })
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
        if (!canvas) return
        const gridCtx = canvas.getContext("2d", { alpha: true })
        if (!gridCtx) return
        gridCtx.clearRect(0, 0, canvas.width, canvas.height)
        if (internalGrid) {
            gridCtx.strokeStyle = gridColor
            gridCtx.lineWidth = 1
            gridCtx.beginPath()

            // We use the same grid logic for both because projectToScreen interpolates correctly!
            const ext = Math.ceil(
                Math.max(gridSize.cols, gridSize.rows) *
                    perspectiveProgressRef.current
            )
            for (let row = -ext; row <= gridSize.rows + ext; row++) {
                const start = projectToScreen(
                    -ext,
                    row,
                    internalPerspective,
                    selectedPixelSize
                )
                const end = projectToScreen(
                    gridSize.cols + ext,
                    row,
                    internalPerspective,
                    selectedPixelSize
                )
                gridCtx.moveTo(start.x, start.y)
                gridCtx.lineTo(end.x, end.y)
            }
            for (let col = -ext; col <= gridSize.cols + ext; col++) {
                const start = projectToScreen(
                    col,
                    -ext,
                    internalPerspective,
                    selectedPixelSize
                )
                const end = projectToScreen(
                    col,
                    gridSize.rows + ext,
                    internalPerspective,
                    selectedPixelSize
                )
                gridCtx.moveTo(start.x, start.y)
                gridCtx.lineTo(end.x, end.y)
            }
            gridCtx.stroke()
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
    }, [internalPerspective, drawGrid, redrawArtwork])

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
            const steps = Math.max(1, Math.ceil(dist / 3))

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
    }, [saveHistory, rebuildStaticCache, redrawArtwork])

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
            borderRadius: "16px",
            boxShadow: t.shadow || "0 8px 32px rgba(0,0,0,0.12)",
            border: `1px solid ${t.border}`,
            gap: "12px",
        }

        if (isMobile) {
            return {
                ...baseStyle,
                flexDirection: "row" as const,
                width: "100%",
                padding: "8px 12px",
                borderRadius: "16px 16px 0 0",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                boxSizing: "border-box",
            }
        }
        if (isHorizontal)
            return {
                ...baseStyle,
                flexDirection: "row" as const,
                width: "auto",
                minWidth: 200,
                padding: "12px 16px",
            }
        if (isBox)
            return {
                ...baseStyle,
                flexDirection: "column" as const,
                width: 164,
                padding: "16px",
                gap: "16px",
            }
        return {
            ...baseStyle,
            flexDirection: "column" as const,
            width: "auto",
            padding: "16px 12px",
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
        borderRadius: 12, // slightly rounder for a premium feel
        transition: "all 0.2s ease",
        width: 36,
        height: 36,
        flexShrink: 0,
    }
    const isLightToolbar =
        toolbarTheme === "light" ||
        uiTheme === "light" ||
        uiTheme === "glass-light"
    const getToolStyle = (isActive: boolean) => ({
        ...btnBaseStyle,
        backgroundColor: isActive
            ? isLightToolbar
                ? "#E5E5EA"
                : t.activeBg
            : isLightToolbar
              ? "transparent"
              : t.subBg,
        color: isActive
            ? isLightToolbar
                ? "#000000"
                : t.activeText
            : isLightToolbar
              ? "#666"
              : t.text,
        border: `1px solid ${isActive ? (isLightToolbar ? "rgba(0,0,0,0.05)" : "transparent") : "transparent"}`,
        boxShadow: "none",
    })
    const getUtilityStyle = (isDanger: boolean) => ({
        ...btnBaseStyle,
        backgroundColor: isDanger
            ? t.dangerBg
            : isLightToolbar
              ? "rgba(0,0,0,0.05)"
              : t.subBg,
        color: isDanger ? t.dangerText : isLightToolbar ? "#444" : t.text,
        border: `1px solid ${isDanger ? "rgba(255, 59, 48, 0.3)" : isLightToolbar ? "transparent" : t.border}`,
    })

    // Removed duplicate declaration
    const toolbarBaseWrapperStyle: React.CSSProperties = {
        backgroundColor: isLightToolbar ? "rgba(255, 255, 255, 0.85)" : t.bg,
        border: isLightToolbar
            ? "1px solid rgba(255,255,255,0.5)"
            : `1px solid ${t.border}`,
        boxShadow: isLightToolbar
            ? "0 12px 48px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.03)"
            : t.shadow,
        borderRadius: 24, // Matching gamification UI curve
        backdropFilter: isLightToolbar ? "blur(24px)" : t.backdrop,
        WebkitBackdropFilter: isLightToolbar ? "blur(24px)" : t.backdrop,
        pointerEvents: "auto",
        maxHeight: "90vh",
        overflowY: "auto",
        scrollbarWidth: "none",
    }

    const dividerStyle = {
        width: isHorizontal ? 1 : "100%",
        height: isHorizontal ? 24 : 1,
        backgroundColor: isLightToolbar ? "rgba(0,0,0,0.06)" : t.border,
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
                backgroundColor: "#F1E9DD",
                fontFamily: "Satoshi, Inter, sans-serif",
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
                    borderRadius: "8px",
                    overflow: "clip",
                    backgroundClip: "padding-box",
                    backgroundColor: "#F1E9DD",
                    border: "2px solid #ffffff",
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: canvasTotalWidth,
                        height: canvasTotalHeight,
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
                        background: t.border,
                        opacity: 0.5,
                        margin: isHorizontal ? "0 4px" : "4px 0",
                    }

                    const getToolStyle = (isActive) => ({
                        ...btnBaseStyle,
                        width: 32,
                        height: 32,
                        backgroundColor: isActive ? t.activeBg : "transparent",
                        color: isActive ? t.activeText : t.text,
                        border: `1px solid ${isActive ? t.activeBg : "transparent"}`,
                    })

                    const getUtilityStyle = (isActive) => ({
                        ...btnBaseStyle,
                        backgroundColor: isActive ? t.activeBg : "transparent",
                        color: isActive ? t.activeText : t.text,
                        border: `1px solid ${isActive ? t.activeBg : "transparent"}`,
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
                                background: t.text,
                                color: t.bg,
                                padding: "4px 8px",
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: "bold",
                                pointerEvents: "none",
                                whiteSpace: "nowrap",
                                zIndex: 999999,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
                                                    borderRadius: 12,
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
                                                            width: 22,
                                                            height: 22,
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                color,
                                                            border:
                                                                currentDrawColor ===
                                                                color
                                                                    ? `2px solid ${t.bg}`
                                                                    : `1px solid rgba(0,0,0,0.1)`,
                                                            cursor: "pointer",
                                                            padding: 0,
                                                            margin: "0 2px",
                                                            boxShadow:
                                                                currentDrawColor ===
                                                                color
                                                                    ? `0 0 0 2px ${t.text}`
                                                                    : "none",
                                                            transform:
                                                                currentDrawColor ===
                                                                color
                                                                    ? "scale(1.15)"
                                                                    : "scale(1)",
                                                            transition:
                                                                "all 0.2s ease",
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
                                        borderRadius: 20,
                                        background: t.subBg,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "4px 8px",
                                        border: `1px solid ${t.border}`,
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
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            background:
                                                "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow:
                                                "inset 0 0 0 1px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: 7,
                                                backgroundColor:
                                                    currentDrawColor,
                                                border: `2px solid white`,
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.3)",
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
                                        color={t.text}
                                        style={{ opacity: 0.6 }}
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
                                                color: t.text,
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
                                                color: t.text,
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
                                                color: t.text,
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
                                        color={t.text}
                                        style={{
                                            opacity: 0.5,
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
                                            color: t.text,
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
                                            color: t.text,
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
                                                color: t.error,
                                                width: 32,
                                                height: 32,
                                                background: `${t.error}20`,
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
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
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

addPropertyControls(PixelArtCreator, {
    // Canvas Options
    pixelSize: {
        type: ControlType.Number,
        title: "Pixel Scale",
        defaultValue: 20,
        min: 4,
        max: 80,
        step: 2,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    gridColor: {
        type: ControlType.Color,
        title: "Grid Lines",
        defaultValue: "#EEEEEE",
    },
    showGrid: {
        type: ControlType.Boolean,
        title: "Show Grid",
        defaultValue: true,
    },
    gridPerspective: {
        type: ControlType.Enum,
        title: "Grid Perspective",
        options: ["square", "isometric"],
        optionTitles: ["Square (2D)", "Isometric (2.5D)"],
        defaultValue: "square",
    },
    drawColor: {
        type: ControlType.Color,
        title: "Art: Default Color",
        defaultValue: "#000000",
    },
    alternatePattern: {
        type: ControlType.Enum,
        title: "Art: Pattern",
        defaultValue: "none",
        options: ["none", "checkerboard", "horizontal", "vertical"],
        optionTitles: ["Solid", "Checkerboard", "Horizontal", "Vertical"],
    },
    alternateColor: {
        type: ControlType.Color,
        title: "Art: Alt Color",
        defaultValue: "#F5F5F5",
        hidden: ({ alternatePattern }) => alternatePattern === "none",
    },

    // Gamification & Ambient Modes
    enableGamification: {
        type: ControlType.Boolean,
        title: "Game: Collectibles",
        defaultValue: false,
    },
    enableAmbientSpawner: {
        type: ControlType.Boolean,
        title: "Art: Ambient Pixels",
        defaultValue: false,
    },

    // Performance Engine
    lowPowerMode: {
        type: ControlType.Boolean,
        title: "Low Power Mode",
        defaultValue: false,
    },
    exportScale: {
        type: ControlType.Number,
        title: "Export Scale",
        defaultValue: 4,
        min: 1,
        max: 10,
        displayStepper: true,
    },

    // Render Engine
    pixelStyle: {
        type: ControlType.Enum,
        title: "Render: Style",
        defaultValue: "2d",
        options: ["2d", "3d"],
        optionTitles: ["Flat 2D", "Dynamic 3D"],
        displaySegmentedControl: true,
    },
    dynamic3D: {
        type: ControlType.Boolean,
        title: "3D Follow Cursor",
        defaultValue: false,
        hidden: ({ pixelStyle }) => pixelStyle === "2d",
    },
    dynamic3DSensitivity: {
        type: ControlType.Number,
        title: "Follow Radius",
        defaultValue: 10,
        min: 1,
        max: 10,
        displayStepper: true,
        hidden: ({ pixelStyle, dynamic3D }) =>
            pixelStyle === "2d" || !dynamic3D,
    },
    perspective3D: {
        type: ControlType.Enum,
        title: "Static 3D Angle",
        defaultValue: "top-right",
        options: ["top-right", "top-left", "bottom-right", "bottom-left"],
        optionTitles: ["Top-Right", "Top-Left", "Bottom-Right", "Bottom-Left"],
        hidden: ({ pixelStyle, dynamic3D }) => pixelStyle === "2d" || dynamic3D,
    },
    enableHoverTrail: {
        type: ControlType.Boolean,
        title: "3D Hover Trail",
        defaultValue: true,
    },

    // Procedural Buddy Controls
    showCompanion: {
        type: ControlType.Boolean,
        title: "Procedural Buddy",
        defaultValue: false,
    },
    hideCompanionOnMobile: {
        type: ControlType.Boolean,
        title: "Hide on Mobile",
        defaultValue: false,
        hidden: ({ showCompanion }) => !showCompanion,
    },
    enableHeroAnimation: {
        type: ControlType.Boolean,
        title: "Companion Hero Animation",
        defaultValue: false,
        hidden: ({ showCompanion }) => !showCompanion,
    },
    heroAnimationText: {
        type: ControlType.String,
        title: "Hero Text",
        defaultValue: "HELLO",
        hidden(props) {
            return !props.enableHeroAnimation || !props.showCompanion
        },
    },
    heroAnimationSpeed: {
        type: ControlType.Number,
        title: "Animation Speed",
        defaultValue: 5,
        min: 1,
        max: 20,
        hidden(props) {
            return !props.enableHeroAnimation || !props.showCompanion
        },
    },
    buddyType: {
        type: ControlType.Enum,
        title: "Buddy Anatomy",
        defaultValue: "classic",
        options: [
            "classic",
            "cat",
            "dog",
            "robot",
            "frog",
            "ghost",
            "cube",
            "pill",
        ],
        optionTitles: [
            "Classic Slime",
            "Vector Cat",
            "Floppy Dog",
            "Mecha Robot",
            "Chubby Frog",
            "Floating Ghost",
            "Soft Cube",
            "Sleek Capsule",
        ],
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionMovementMode: {
        type: ControlType.Enum,
        title: "Movement",
        defaultValue: "static",
        options: ["static", "follow-cursor", "wander", "patrol"],
        optionTitles: [
            "Static/Drag Only",
            "Follow Cursor",
            "Wander Randomly",
            "Patrol Border",
        ],
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionSize: {
        type: ControlType.Number,
        title: "Buddy Base Size",
        defaultValue: 64,
        min: 32,
        max: 200,
        displayStepper: true,
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionPositionMode: {
        type: ControlType.Enum,
        title: "Buddy Pos",
        defaultValue: "relative",
        options: ["absolute", "relative", "toolbar"],
        optionTitles: ["Snap to Edge", "Relative (%)", "Snap to Toolbar"],
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionRelativeX: {
        type: ControlType.Number,
        title: "Align X (%)",
        defaultValue: 100,
        min: 0,
        max: 100,
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "relative",
    },
    companionRelativeY: {
        type: ControlType.Number,
        title: "Align Y (%)",
        defaultValue: 100,
        min: 0,
        max: 100,
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "relative",
    },
    companionPositionX: {
        type: ControlType.Enum,
        title: "Buddy: Snap X",
        defaultValue: "right",
        options: ["left", "center", "right"],
        optionTitles: ["Left", "Center", "Right"],
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "absolute",
    },
    companionPositionY: {
        type: ControlType.Enum,
        title: "Buddy: Snap Y",
        defaultValue: "bottom",
        options: ["top", "center", "bottom"],
        optionTitles: ["Top", "Center", "Bottom"],
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "absolute",
    },
    companionOffsetX: {
        type: ControlType.Number,
        title: "Buddy: Offset X",
        defaultValue: 2,
        min: -200,
        max: 200,
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "absolute",
    },
    companionOffsetY: {
        type: ControlType.Number,
        title: "Buddy: Offset Y",
        defaultValue: 2,
        min: -200,
        max: 200,
        hidden: ({ showCompanion, companionPositionMode }) =>
            !showCompanion || companionPositionMode !== "absolute",
    },
    companionColorPrimary: {
        type: ControlType.Color,
        title: "Buddy Base Color",
        defaultValue: "#007AFF",
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionColorAction: {
        type: ControlType.Color,
        title: "Buddy: Action Color",
        defaultValue: "#FF3B30",
        hidden: ({ showCompanion }) => !showCompanion,
    },
    companionColorEye: {
        type: ControlType.Color,
        title: "Buddy: Eye Glow",
        defaultValue: "#00FFCC",
        hidden: ({ showCompanion }) => !showCompanion,
    },

    // Media & Video Controls
    mediaSourceType: {
        type: ControlType.Enum,
        title: "Media: Source Type",
        defaultValue: "none",
        options: ["none", "video", "image"],
        optionTitles: ["Blank", "Video", "Image"],
        displaySegmentedControl: true,
    },
    mediaFile: {
        type: ControlType.File,
        title: "Media: File Upload",
        allowedFileTypes: [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
        ],
        hidden: ({ mediaSourceType }) => mediaSourceType === "none",
    },
    mediaFitMode: {
        type: ControlType.Enum,
        title: "Media: Fit Mode",
        defaultValue: "cover",
        options: ["cover", "contain", "custom"],
        optionTitles: ["Cover", "Contain", "Custom Pan/Zoom"],
        hidden: ({ mediaSourceType }) => mediaSourceType === "none",
    },
    mediaScale: {
        type: ControlType.Number,
        title: "Media: Scale",
        defaultValue: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        hidden: ({ mediaSourceType, mediaFitMode }) =>
            mediaSourceType === "none" || mediaFitMode !== "custom",
    },
    mediaOffsetX: {
        type: ControlType.Number,
        title: "Buddy: Offset X",
        defaultValue: 0,
        min: -2000,
        max: 2000,
        hidden: ({ mediaSourceType, mediaFitMode }) =>
            mediaSourceType === "none" || mediaFitMode !== "custom",
    },
    mediaOffsetY: {
        type: ControlType.Number,
        title: "Buddy: Offset Y",
        defaultValue: 0,
        min: -2000,
        max: 2000,
        hidden: ({ mediaSourceType, mediaFitMode }) =>
            mediaSourceType === "none" || mediaFitMode !== "custom",
    },
    mediaOpacity: {
        type: ControlType.Number,
        title: "Media: Opacity",
        defaultValue: 1,
        min: 0.1,
        max: 1,
        step: 0.1,
        hidden: ({ mediaSourceType }) => mediaSourceType === "none",
    },
    pixelateMedia: {
        type: ControlType.Boolean,
        title: "Media: Pixelate Filter",
        defaultValue: true,
        hidden: ({ mediaSourceType }) => mediaSourceType === "none",
    },
    playMedia: {
        type: ControlType.Boolean,
        title: "Media: Auto-Play",
        defaultValue: true,
        hidden: ({ mediaSourceType }) => mediaSourceType === "none",
    },
    loopMedia: {
        type: ControlType.Boolean,
        title: "Media: Loop",
        defaultValue: true,
        hidden: ({ mediaSourceType }) => mediaSourceType !== "video",
    },

    // UI Engine & Layout
    uiTheme: {
        type: ControlType.Enum,
        title: "UI: Theme",
        defaultValue: "glass-dark",
        options: ["dark", "light", "glass-dark", "glass-light"],
        optionTitles: ["Dark Mode", "Light Mode", "Glass Dark", "Glass Light"],
    },
    toolbarTheme: {
        type: ControlType.Enum,
        title: "Toolbar: Theme",
        defaultValue: "dark",
        options: ["dark", "light"],
        optionTitles: ["Dark Mode", "Light Mode"],
    },
    toolbarLayout: {
        type: ControlType.Enum,
        title: "UI: Toolbar Layout",
        defaultValue: "vertical",
        options: [
            "vertical",
            "horizontal",
            "box",
            "horizontal-centered",
            "vertical-centered",
        ],
        optionTitles: [
            "Vertical Dock",
            "Horizontal Dock",
            "Box Grid",
            "Bottom/Top Centered",
            "Left/Right Centered",
        ],
    },
    toolbarPositionMode: {
        type: ControlType.Enum,
        title: "UI: Toolbar Anchor",
        defaultValue: "top-right",
        options: ["top-left", "top-right", "bottom-left", "bottom-right"],
        optionTitles: ["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"],
    },
    minimalToolbar: {
        type: ControlType.Boolean,
        title: "UI: Minimal Mode",
        defaultValue: false,
    },
    showInfoPills: {
        type: ControlType.Boolean,
        title: "UI: Show Info Pills",
        defaultValue: true,
    },
    topPillPosition: {
        type: ControlType.Enum,
        title: "UI: Top Pill Pos",
        defaultValue: "top-left",
        options: [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-right",
        ],
        optionTitles: [
            "Top Left",
            "Top Center",
            "Top Right",
            "Bottom Left",
            "Bottom Right",
        ],
        hidden: ({ showInfoPills }) => !showInfoPills,
    },
    bottomPillPosition: {
        type: ControlType.Enum,
        title: "UI: Bottom Pill Pos",
        defaultValue: "bottom-center",
        options: ["bottom-center", "top-center", "bottom-left", "bottom-right"],
        optionTitles: [
            "Bottom Center",
            "Top Center",
            "Bottom Left",
            "Bottom Right",
        ],
        hidden: ({ showInfoPills }) => !showInfoPills,
    },
    toolbarZIndex: {
        type: ControlType.Number,
        title: "UI: Z-Index",
        defaultValue: 50,
    },

    // Tool Visibility Toggles
    showPencil: {
        type: ControlType.Boolean,
        title: "Tool: Pencil",
        defaultValue: true,
    },
    showEraser: {
        type: ControlType.Boolean,
        title: "Tool: Eraser",
        defaultValue: true,
    },
    showTypeTool: {
        type: ControlType.Boolean,
        title: "Tool: Type",
        defaultValue: true,
    },
    showBucket: {
        type: ControlType.Boolean,
        title: "Tool: Bucket",
        defaultValue: true,
    },
    showSymmetry: {
        type: ControlType.Boolean,
        title: "Tool: Symmetry",
        defaultValue: true,
    },
    showEyedropper: {
        type: ControlType.Boolean,
        title: "Tool: Eyedropper",
        defaultValue: true,
    },
    showBrushSize: {
        type: ControlType.Boolean,
        title: "Tool: Brush Size",
        defaultValue: true,
    },
    showUndoRedo: {
        type: ControlType.Boolean,
        title: "Tool: Undo/Redo",
        defaultValue: true,
    },
    showClear: {
        type: ControlType.Boolean,
        title: "Action: Clear",
        defaultValue: true,
    },
    showDownload: {
        type: ControlType.Boolean,
        title: "Action: Download",
        defaultValue: true,
    },
    showGridToggle: {
        type: ControlType.Boolean,
        title: "Action: Grid Toggle",
        defaultValue: true,
    },
    showMediaControls: {
        type: ControlType.Boolean,
        title: "Action: Media Play",
        defaultValue: true,
    },
    showPalette: {
        type: ControlType.Boolean,
        title: "Tool: Color Palette",
        defaultValue: true,
    },
})
