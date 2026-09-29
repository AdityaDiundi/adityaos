import { create } from "zustand";

export type OSThemeId =
  | "noctalia"
  | "caelestia"
  | "tokyo-night"
  | "catppuccin"
  | "matrix"
  | "onedark"
  | "light";

export interface OSThemeConfig {
  id: OSThemeId;
  name: string;
  label: string;
  shellName: string;
  isDark: boolean;
  icon: string;
  desktopBg: string;
  desktopGrid: string;
  headerBg: string;
  headerBorder: string;
  windowBg: string;
  windowTitleBg: string;
  windowBorder: string;
  windowActiveBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSecondary: string;
  accentGlow: string;
  cardBg: string;
  cardBorder: string;
  terminalBg: string;
  terminalBorder: string;
  terminalHeader: string;
  terminalPrompt: string;
  canvasBg: string;
  gridColor: string;
  drawColor: string;
  tagBg: string;
  tagText: string;
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
    desktopGrid: "rgba(255, 255, 255, 0.04)",
    headerBg: "rgba(10, 12, 16, 0.96)",
    headerBorder: "rgba(255, 255, 255, 0.09)",
    windowBg: "rgba(10, 12, 16, 0.96)",
    windowTitleBg: "rgba(20, 24, 34, 0.95)",
    windowBorder: "rgba(255, 255, 255, 0.09)",
    windowActiveBorder: "#00FFCC",
    textPrimary: "#FFFFFF",
    textSecondary: "#E2E8F0",
    textMuted: "#8E929B",
    accent: "#00FFCC",
    accentSecondary: "#FFD700",
    accentGlow: "rgba(0, 255, 204, 0.3)",
    cardBg: "rgba(16, 20, 28, 0.85)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    terminalBg: "rgba(8, 10, 16, 0.97)",
    terminalBorder: "rgba(0, 255, 204, 0.3)",
    terminalHeader: "rgba(14, 18, 26, 0.98)",
    terminalPrompt: "#00FFCC",
    canvasBg: "#07080C",
    gridColor: "rgba(255, 255, 255, 0.08)",
    drawColor: "#00FFCC",
    tagBg: "rgba(0, 255, 204, 0.1)",
    tagText: "#00FFCC",
  },
  caelestia: {
    id: "caelestia",
    name: "Caelestia",
    label: "Caelestia (Nordic Frost)",
    shellName: "caelestia-fish",
    isDark: true,
    icon: "❄️",
    desktopBg: "#0B101B",
    desktopGrid: "rgba(136, 192, 208, 0.05)",
    headerBg: "rgba(13, 19, 32, 0.96)",
    headerBorder: "rgba(136, 192, 208, 0.18)",
    windowBg: "rgba(15, 23, 38, 0.96)",
    windowTitleBg: "rgba(20, 32, 52, 0.95)",
    windowBorder: "rgba(136, 192, 208, 0.15)",
    windowActiveBorder: "#88C0D0",
    textPrimary: "#ECEFF4",
    textSecondary: "#D8DEE9",
    textMuted: "#7B88A1",
    accent: "#88C0D0",
    accentSecondary: "#81A1C1",
    accentGlow: "rgba(136, 192, 208, 0.35)",
    cardBg: "rgba(20, 30, 50, 0.85)",
    cardBorder: "rgba(136, 192, 208, 0.15)",
    terminalBg: "rgba(10, 15, 26, 0.98)",
    terminalBorder: "rgba(136, 192, 208, 0.35)",
    terminalHeader: "rgba(16, 25, 42, 0.98)",
    terminalPrompt: "#88C0D0",
    canvasBg: "#0B101B",
    gridColor: "rgba(136, 192, 208, 0.1)",
    drawColor: "#88C0D0",
    tagBg: "rgba(136, 192, 208, 0.12)",
    tagText: "#88C0D0",
  },
  "tokyo-night": {
    id: "tokyo-night",
    name: "Tokyo Night",
    label: "Tokyo Night (Midnight)",
    shellName: "tokyo-zsh",
    isDark: true,
    icon: "🌆",
    desktopBg: "#0C0E1B",
    desktopGrid: "rgba(122, 162, 247, 0.05)",
    headerBg: "rgba(15, 17, 33, 0.96)",
    headerBorder: "rgba(122, 162, 247, 0.2)",
    windowBg: "rgba(18, 20, 38, 0.96)",
    windowTitleBg: "rgba(26, 28, 54, 0.95)",
    windowBorder: "rgba(122, 162, 247, 0.15)",
    windowActiveBorder: "#7AA2F7",
    textPrimary: "#C0CAF5",
    textSecondary: "#A9B1D6",
    textMuted: "#6E7395",
    accent: "#7AA2F7",
    accentSecondary: "#BB9AF7",
    accentGlow: "rgba(122, 162, 247, 0.35)",
    cardBg: "rgba(24, 26, 48, 0.85)",
    cardBorder: "rgba(122, 162, 247, 0.16)",
    terminalBg: "rgba(11, 13, 25, 0.98)",
    terminalBorder: "rgba(122, 162, 247, 0.35)",
    terminalHeader: "rgba(20, 22, 42, 0.98)",
    terminalPrompt: "#7AA2F7",
    canvasBg: "#0C0E1B",
    gridColor: "rgba(122, 162, 247, 0.1)",
    drawColor: "#7AA2F7",
    tagBg: "rgba(122, 162, 247, 0.12)",
    tagText: "#7AA2F7",
  },
  catppuccin: {
    id: "catppuccin",
    name: "Catppuccin",
    label: "Catppuccin (Mocha)",
    shellName: "catppuccin-bash",
    isDark: true,
    icon: "☕",
    desktopBg: "#11111B",
    desktopGrid: "rgba(203, 166, 247, 0.05)",
    headerBg: "rgba(17, 17, 27, 0.96)",
    headerBorder: "rgba(203, 166, 247, 0.2)",
    windowBg: "rgba(24, 24, 37, 0.96)",
    windowTitleBg: "rgba(30, 30, 46, 0.95)",
    windowBorder: "rgba(203, 166, 247, 0.15)",
    windowActiveBorder: "#CBA6F7",
    textPrimary: "#CDD6F4",
    textSecondary: "#BAC2DE",
    textMuted: "#7F849C",
    accent: "#CBA6F7",
    accentSecondary: "#F9E2AF",
    accentGlow: "rgba(203, 166, 247, 0.35)",
    cardBg: "rgba(30, 30, 46, 0.85)",
    cardBorder: "rgba(203, 166, 247, 0.16)",
    terminalBg: "rgba(14, 14, 23, 0.98)",
    terminalBorder: "rgba(203, 166, 247, 0.35)",
    terminalHeader: "rgba(24, 24, 37, 0.98)",
    terminalPrompt: "#CBA6F7",
    canvasBg: "#11111B",
    gridColor: "rgba(203, 166, 247, 0.1)",
    drawColor: "#CBA6F7",
    tagBg: "rgba(203, 166, 247, 0.12)",
    tagText: "#CBA6F7",
  },
  matrix: {
    id: "matrix",
    name: "Matrix",
    label: "Matrix (Phosphor Green)",
    shellName: "matrix-tty",
    isDark: true,
    icon: "📟",
    desktopBg: "#030A05",
    desktopGrid: "rgba(0, 255, 102, 0.05)",
    headerBg: "rgba(4, 14, 8, 0.96)",
    headerBorder: "rgba(0, 255, 102, 0.2)",
    windowBg: "rgba(5, 18, 10, 0.96)",
    windowTitleBg: "rgba(8, 28, 15, 0.95)",
    windowBorder: "rgba(0, 255, 102, 0.18)",
    windowActiveBorder: "#00FF66",
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
    gridColor: "rgba(0, 255, 102, 0.1)",
    drawColor: "#00FF66",
    tagBg: "rgba(0, 255, 102, 0.12)",
    tagText: "#00FF66",
  },
  onedark: {
    id: "onedark",
    name: "OneDark",
    label: "OneDark (Riced Atom)",
    shellName: "onedark-sh",
    isDark: true,
    icon: "🪐",
    desktopBg: "#1e222a",
    desktopGrid: "rgba(97, 175, 239, 0.06)",
    headerBg: "rgba(24, 27, 33, 0.96)",
    headerBorder: "#3e4451",
    windowBg: "rgba(30, 34, 42, 0.96)",
    windowTitleBg: "rgba(33, 37, 43, 0.95)",
    windowBorder: "#3e4451",
    windowActiveBorder: "#61afef",
    textPrimary: "#dcdfe4",
    textSecondary: "#abb2bf",
    textMuted: "#5c6370",
    accent: "#61afef",
    accentSecondary: "#e5c07b",
    accentGlow: "rgba(97, 175, 239, 0.35)",
    cardBg: "rgba(33, 37, 43, 0.85)",
    cardBorder: "rgba(62, 68, 81, 0.8)",
    terminalBg: "rgba(24, 27, 33, 0.98)",
    terminalBorder: "rgba(97, 175, 239, 0.35)",
    terminalHeader: "rgba(40, 44, 52, 0.98)",
    terminalPrompt: "#61afef",
    canvasBg: "#1e222a",
    gridColor: "rgba(97, 175, 239, 0.1)",
    drawColor: "#61afef",
    tagBg: "rgba(97, 175, 239, 0.12)",
    tagText: "#61afef",
  },
  light: {
    id: "light",
    name: "Solaris Light",
    label: "Solaris (Paper Light)",
    shellName: "solaris-sh",
    isDark: false,
    icon: "☀️",
    desktopBg: "#F1F3F7",
    desktopGrid: "rgba(0, 0, 0, 0.05)",
    headerBg: "rgba(255, 255, 255, 0.96)",
    headerBorder: "rgba(0, 0, 0, 0.1)",
    windowBg: "rgba(255, 255, 255, 0.97)",
    windowTitleBg: "rgba(241, 245, 249, 0.98)",
    windowBorder: "rgba(0, 0, 0, 0.12)",
    windowActiveBorder: "#2563EB",
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
    gridColor: "rgba(0, 0, 0, 0.08)",
    drawColor: "#2563EB",
    tagBg: "rgba(37, 99, 235, 0.1)",
    tagText: "#2563EB",
  },
};

interface ThemeState {
  currentThemeId: OSThemeId;
  activeTheme: OSThemeConfig;
  setTheme: (id: OSThemeId) => void;
  toggleDarkLight: () => void;
  nextTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentThemeId: "noctalia",
  activeTheme: OS_THEMES.noctalia,

  setTheme: (id: OSThemeId) => {
    const theme = OS_THEMES[id] || OS_THEMES.noctalia;
    set({
      currentThemeId: theme.id,
      activeTheme: theme,
    });
  },

  toggleDarkLight: () => {
    const { currentThemeId } = get();
    if (currentThemeId === "light") {
      get().setTheme("noctalia");
    } else {
      get().setTheme("light");
    }
  },

  nextTheme: () => {
    const themeIds = Object.keys(OS_THEMES) as OSThemeId[];
    const currentIndex = themeIds.indexOf(get().currentThemeId);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    get().setTheme(themeIds[nextIndex]);
  },
}));
