import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

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

export default function CyberHero(props) {
    const {
        theme = "dark",
        accent = BLUE,

        workSection = "work",
        scrollOffset = 0,

        resumeLink = "",
        resumeNewTab = true,
    } = props

    /* =====================================================
       LOAD TYPE
    ===================================================== */

    React.useEffect(() => {
        const id = "aditya-cyber-fonts"

        if (!document.getElementById(id)) {
            const link = document.createElement("link")

            link.id = id
            link.rel = "stylesheet"

            link.href =
                "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"

            document.head.appendChild(link)
        }
    }, [])

    /* =====================================================
       SAME PAGE SCROLL
    ===================================================== */

    const scrollToWork = React.useCallback(() => {
        if (typeof window === "undefined") {
            return
        }

        const raw = String(workSection || "")
            .trim()
            .replace(/^#/, "")

        if (!raw) return

        let target = document.getElementById(raw)

        /*
         * Framer fallback:
         * match a named frame.
         */

        if (!target) {
            try {
                target = document.querySelector(
                    `[data-framer-name="${CSS.escape(raw)}"]`
                ) as HTMLElement | null
            } catch {}
        }

        /*
         * Standard named anchor fallback.
         */

        if (!target) {
            try {
                target = document.querySelector(
                    `[name="${CSS.escape(raw)}"]`
                ) as HTMLElement | null
            } catch {}
        }

        if (!target) {
            console.warn(`[CyberHero] Could not find section "${raw}".`)

            return
        }

        const reduced = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
        ).matches

        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            Number(scrollOffset || 0)

        window.scrollTo({
            top,

            behavior: reduced ? "auto" : "smooth",
        })
    }, [workSection, scrollOffset])

    return (
        <div
            style={
                {
                    ...props.style,

                    width: "100%",
                    height: "100%",

                    minHeight: 520,

                    position: "relative",

                    overflow: "visible",

                    /*
                     * Keep empty canvas areas
                     * drawable.
                     */
                    pointerEvents: "none",

                    /*
                     * Responsive to the actual
                     * Framer component width.
                     */
                    containerType: "inline-size",

                    "--accent": accent,
                } as React.CSSProperties
            }
        >
            <style>{CSS_STYLES}</style>

            <section className={`hero-shell theme-${theme}`}>
                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="hero-main">
                    {/* =============================================
                        KICKER
                    ============================================= */}

                    <div className="hero-kicker">
                        <div>DESIGNING SYSTEMS.</div>

                        <div>
                            SIMPLIFYING <span>COMPLEXITY.</span>
                        </div>

                        <div className="kicker-rule" />
                    </div>

                    {/* =============================================
                        HEADLINE
                    ============================================= */}

                    <div className="hero-heading">
                        <div className="heading-word">COMPLEXITY</div>

                        <div className="heading-second-row">
                            <svg
                                className="hero-arrow"
                                viewBox="0 0 96 56"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M3 28H79"
                                    stroke="currentColor"
                                    strokeWidth="5.5"
                                    strokeLinecap="square"
                                />

                                <path
                                    d="M61 9L80 28L61 47"
                                    stroke="currentColor"
                                    strokeWidth="5.5"
                                    strokeLinecap="square"
                                    strokeLinejoin="miter"
                                />
                            </svg>

                            <div className="heading-word">CLARITY</div>
                        </div>
                    </div>

                    {/* =============================================
                        IDENTITY
                    ============================================= */}

                    <div className="hero-identity">
                        <span className="terminal-prompt">&gt;</span>

                        <span>[ ADITYA DIUNDI ]</span>

                        <span className="terminal-cursor" />
                    </div>

                    {/* =============================================
                        DESCRIPTION
                    ============================================= */}

                    <div className="hero-description">
                        <div className="description-ticks">
                            <i />
                            <i />
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>

                        <p>
                            I design enterprise tools, complex workflows and
                            data-rich experiences that are easier
                            <br className="desktop-copy-break" />
                            <strong> to understand and use.</strong>
                        </p>
                    </div>

                    {/* =============================================
                        CTA ROW
                    ============================================= */}

                    <div className="hero-actions">
                        {/* EXPLORE */}

                        <button
                            type="button"
                            className="explore-button"
                            onClick={scrollToWork}
                            aria-label="Explore selected work"
                        >
                            <span className="explore-label">EXPLORE WORK</span>

                            <span className="explore-arrow-cell">
                                <ArrowRight />
                            </span>
                        </button>

                        {/* RESUME */}

                        <a
                            className="resume-action"
                            href={resumeLink || undefined}
                            target={
                                resumeLink && resumeNewTab
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                resumeLink && resumeNewTab
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            onClick={(event) => {
                                if (!resumeLink) {
                                    event.preventDefault()
                                }
                            }}
                        >
                            <span>RÉSUMÉ</span>

                            <ArrowUpRight />
                        </a>
                    </div>

                    {/* =============================================
                        EXPERIENCE / PROOF

                        One coherent information rail.
                    ============================================= */}

                    <div className="proof-rail">
                        <Proof
                            index="01"
                            number="4+"
                            label="YEARS DESIGNING"
                            detail="EXPERIENCE"
                        />

                        <Proof
                            index="02"
                            number="3+"
                            label="0→1 PRODUCTS"
                            detail="DELIVERED"
                        />

                        <Proof
                            index="03"
                            number="2"
                            label="DESIGN SYSTEMS"
                            detail="BUILT"
                        />
                    </div>
                </div>

                {/* =================================================
                    SMALL CONTENT CLASSIFICATION

                    Not a separate HUD/module.
                    Just quiet metadata tied to the hero.
                ================================================= */}

                <div className="hero-domains">
                    <span className="domains-line" />

                    <div>
                        <span>ENTERPRISE</span>

                        <span>SYSTEMS</span>

                        <span>WORKFLOWS</span>

                        <span>DATA</span>
                    </div>
                </div>
            </section>
        </div>
    )
}

/* ==========================================================
   PROOF
========================================================== */

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

/* ==========================================================
   ICONS
========================================================== */

function ArrowRight() {
    return (
        <svg
            className="explore-arrow"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 9H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
            />

            <path
                d="M10.5 5.5L14 9L10.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
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
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M4 11L11 4"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="square"
            />

            <path
                d="M5.5 4H11V9.5"
                stroke="currentColor"
                strokeWidth="1.35"
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
