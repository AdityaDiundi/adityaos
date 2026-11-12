/**
 * AdityaOS 3D Story Landing — Journey Content Model
 * Defines stations, timeline events, camera presets, and writing markers.
 * Grounded in Aditya Diwakar's journey and shipped work.
 */

export type StationKind =
  | "boot"
  | "game"
  | "skip"
  | "product"
  | "field"
  | "studio"
  | "build"
  | "landing"
  | "writing";

export type CameraPreset =
  | "dolly-in"
  | "pan-left"
  | "pan-right"
  | "slow-orbit"
  | "pull-back"
  | "warp";

export interface JourneyStation {
  id: string;
  kind: StationKind;
  dateStart: string;
  dateEnd?: string;
  year: number; // For year rail ticker and timeline interpolation
  title: string;
  line: string;
  outcome?: string;
  assetKey: string;
  cameraPreset: CameraPreset;
  openTarget?: string | null; // AdityaOS window id or case study id
  placeholder: boolean;
  enabled?: boolean; // e.g. quiet-year is false by default
}

export interface WritingItem {
  id: string;
  title: string;
  publishDate: string; // YYYY-MM or YYYY-MM-DD
  year: number;
  url?: string;
  excerpt?: string;
  placeholder?: boolean;
}

/**
 * Stations in chronological scroll sequence.
 * Seed copy is strictly first-person, sentence case, numbers over adjectives, outcome-led, no em dashes.
 */
export const JOURNEY_STATIONS: JourneyStation[] = [
  {
    id: "boot",
    kind: "boot",
    dateStart: "Start",
    year: 2000,
    title: "System Initializing",
    line: "Press start. Scroll to travel through time.",
    assetKey: "crt_terminal",
    cameraPreset: "dolly-in",
    openTarget: null,
    placeholder: false,
    enabled: true,
  },
  {
    id: "arcade",
    kind: "game",
    dateStart: "circa 2003",
    year: 2003,
    title: "Arcade Days",
    line: "Before I made things on screens, I played on them. Virtua Cop 2 was the first world I wanted to live in.",
    assetKey: "arcade_cabinet",
    cameraPreset: "slow-orbit",
    openTarget: null,
    placeholder: true,
    enabled: true,
  },
  {
    id: "timeskip",
    kind: "skip",
    dateStart: "2021",
    year: 2021,
    title: "Timeskip",
    line: "Fast forward to 2021.",
    assetKey: "warp_tunnel",
    cameraPreset: "warp",
    openTarget: null,
    placeholder: false,
    enabled: true,
  },
  {
    id: "mfine",
    kind: "product",
    dateStart: "Nov 2021",
    dateEnd: "May 2022",
    year: 2021,
    title: "MFine Healthcare",
    line: "Nov 2021. Redesigned claim settlement for 100K daily health users so fewer people needed support.",
    outcome: "-62% HR admin task time for bulk enrollments",
    assetKey: "mfine_claims",
    cameraPreset: "pan-left",
    openTarget: "corporate-claims",
    placeholder: false,
    enabled: true,
  },
  {
    id: "mosaic",
    kind: "product",
    dateStart: "Jun 2022",
    dateEnd: "Dec 2022",
    year: 2022,
    title: "Mosaic Wellness",
    line: "Jun 2022. Shipped habit tracking inside ManMatters: 100+ week-one users and tracker-to-purchase conversion up 12%.",
    outcome: "+44% Day 14 retention in delayed-outcome health",
    assetKey: "mosaic_habits",
    cameraPreset: "pan-right",
    openTarget: "hair-tracker",
    placeholder: false,
    enabled: true,
  },
  {
    id: "quiet-year",
    kind: "skip",
    dateStart: "Jan 2023",
    dateEnd: "Jan 2024",
    year: 2023,
    title: "Quiet Year",
    line: "Jan 2023. A year of reflection, reading, and unlearning.",
    assetKey: "quiet_horizon",
    cameraPreset: "pull-back",
    openTarget: null,
    placeholder: true,
    enabled: true,
  },
  {
    id: "field",
    kind: "field",
    dateStart: "Feb 2024",
    dateEnd: "Oct 2025",
    year: 2024,
    title: "Grassroots Fieldwork",
    line: "Feb 2024. Left screens for rural villages. Built a live attendance tracker in Sheets and tactile workshops for youth.",
    outcome: "4-vector cognitive diagnostic matrix across village schools",
    assetKey: "field_hills",
    cameraPreset: "dolly-in",
    openTarget: "aarohi-lab",
    placeholder: false,
    enabled: true,
  },
  {
    id: "studio",
    kind: "studio",
    dateStart: "Oct 2025",
    dateEnd: "Present",
    year: 2025,
    title: "Independent Studio",
    line: "Oct 2025. Opened the studio. Built websites and interfaces for Invenix and frontier AI teams from scratch.",
    outcome: "Multiple shipped products across fintech and frontier AI",
    assetKey: "studio_desk",
    cameraPreset: "pan-left",
    openTarget: "caseStudies",
    placeholder: false,
    enabled: true,
  },
  {
    id: "builds",
    kind: "build",
    dateStart: "2025",
    dateEnd: "2026",
    year: 2026,
    title: "Personal Builds",
    line: "Then I built places of my own: Pixel Studio, the JANEVAL AI benchmark, and AdityaOS.",
    outcome: "JANEVAL AI benchmark, in-browser Pixel Engine, and AdityaOS",
    assetKey: "builds_trio",
    cameraPreset: "slow-orbit",
    openTarget: "janeval",
    placeholder: false,
    enabled: true,
  },
  {
    id: "landing",
    kind: "landing",
    dateStart: "Today",
    year: 2026,
    title: "AdityaOS Desktop",
    line: "You're here. Everything lives together on this desktop.",
    outcome: "Full interactive web desktop environment",
    assetKey: "aditya_desktop",
    cameraPreset: "dolly-in",
    openTarget: "desktop",
    placeholder: false,
    enabled: true,
  },
];

/**
 * Filtered list of active stations (skipping disabled ones like quiet-year if off).
 */
export function getActiveStations(): JourneyStation[] {
  return JOURNEY_STATIONS.filter((s) => s.enabled !== false);
}

/**
 * Seed writing lane items aligned with the timeline years.
 * If WRITING_FEED_URL is defined, it will fetch at build time.
 * Otherwise falls back to Aditya's published essays on Bearblog.
 */
export const DEFAULT_WRITING_ITEMS: WritingItem[] = [
  {
    id: "daughters",
    title: "Daughters of Misogyny",
    publishDate: "2024-05",
    year: 2024,
    url: "https://diundi.bearblog.dev/daughters-of-misogyny/",
    excerpt: "Girls are born to the most misogynistic of the men. Some change, some remain the same.",
    placeholder: false,
  },
  {
    id: "beliefs",
    title: "On Borrowed Beliefs",
    publishDate: "2026-04",
    year: 2026,
    url: "https://diundi.bearblog.dev/on-borrowed-beliefs/",
    excerpt: "Faith slowly being overtaken by a thought process that made it difficult to remain a theist.",
    placeholder: false,
  },
  {
    id: "field-notes-placeholder",
    title: "Notes from Kumaon Valleys",
    publishDate: "2024-11",
    year: 2024,
    url: "https://diundi.bearblog.dev/",
    excerpt: "Cognitive diagnostics and tactile tools in primary education.",
    placeholder: true,
  },
];

/**
 * Loads writing items dynamically from env WRITING_FEED_URL if configured,
 * or gracefully returns the seed writing items.
 */
export async function getWritingItems(): Promise<WritingItem[]> {
  const feedUrl = process.env.WRITING_FEED_URL;
  if (!feedUrl) {
    return DEFAULT_WRITING_ITEMS;
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.statusText}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return DEFAULT_WRITING_ITEMS;
  } catch (err) {
    console.warn("Could not load WRITING_FEED_URL, falling back to seed items:", err);
    return DEFAULT_WRITING_ITEMS;
  }
}
