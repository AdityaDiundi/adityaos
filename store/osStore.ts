import { create } from "zustand";

export interface WindowMeta {
  id: string;
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

interface OSState {
  activeWindow: string | null;
  openWindows: string[];
  minimizedWindows: string[];
  maximizedWindows: string[];
  zIndexMap: Record<string, number>;
  highestZIndex: number;
  wallpaperUrl: string;
  showDesktopGrid: boolean;
  isStickyNoteOpen: boolean;
  isLocked: boolean;

  // Actions
  setWallpaper: (url: string) => void;
  toggleDesktopGrid: () => void;
  toggleStickyNote: () => void;
  setStickyNoteOpen: (open: boolean) => void;
  lockSession: () => void;
  unlockSession: () => void;
  minimizeAllWindows: () => void;
  closeAllWindows: () => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  isWindowOpen: (id: string) => boolean;
  isWindowMinimized: (id: string) => boolean;
  isWindowMaximized: (id: string) => boolean;
}

function computeNextZ(map: Record<string, number>, targetId: string) {
  const currentHighest = Math.max(...Object.values(map), 10);
  if (currentHighest >= 400) {
    const sorted = Object.entries(map).sort((a, b) => a[1] - b[1]);
    const normalized: Record<string, number> = {};
    sorted.forEach(([k], idx) => {
      normalized[k] = 10 + idx;
    });
    normalized[targetId] = 10 + sorted.length;
    return { map: normalized, highest: 10 + sorted.length };
  }
  const next = currentHighest + 1;
  return {
    map: { ...map, [targetId]: next },
    highest: next,
  };
}

export const useOSStore = create<OSState>((set, get) => ({
  activeWindow: "coreIntro",
  openWindows: ["coreIntro", "pixelEngine"],
  minimizedWindows: [],
  maximizedWindows: [],
  zIndexMap: {
    coreIntro: 12,
    pixelEngine: 11,
    resumeViewer: 10,
    archiveReader: 9,
    streamFeed: 8,
    galleryViewer: 7,
    fieldJournal: 6,
    learnabilityLab: 5,
    wallpaperManager: 5,
    terminal: 4,
  },
  highestZIndex: 12,
  wallpaperUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2560&auto=format&fit=crop",
  showDesktopGrid: true,
  isStickyNoteOpen: true,
  isLocked: true,

  setWallpaper: (url: string) => set({ wallpaperUrl: url }),
  toggleDesktopGrid: () => set((state) => ({ showDesktopGrid: !state.showDesktopGrid })),
  toggleStickyNote: () => set((state) => ({ isStickyNoteOpen: !state.isStickyNoteOpen })),
  setStickyNoteOpen: (open: boolean) => set({ isStickyNoteOpen: open }),
  lockSession: () => set({ isLocked: true }),
  unlockSession: () => set({ isLocked: false }),
  minimizeAllWindows: () => {
    const { openWindows } = get();
    set({ minimizedWindows: [...openWindows], activeWindow: null });
  },
  closeAllWindows: () => {
    set({ openWindows: [], minimizedWindows: [], maximizedWindows: [], activeWindow: null });
  },

  openWindow: (id: string) => {
    const { openWindows, minimizedWindows, zIndexMap } = get();
    const isAlreadyOpen = openWindows.includes(id);
    const { map, highest } = computeNextZ(zIndexMap, id);

    set({
      openWindows: isAlreadyOpen ? openWindows : [...openWindows, id],
      minimizedWindows: minimizedWindows.filter((winId) => winId !== id),
      activeWindow: id,
      highestZIndex: highest,
      zIndexMap: map,
    });
  },

  closeWindow: (id: string) => {
    const { openWindows, minimizedWindows, maximizedWindows, activeWindow } = get();
    const newOpen = openWindows.filter((winId) => winId !== id);
    const newMin = minimizedWindows.filter((winId) => winId !== id);
    const newMax = maximizedWindows.filter((winId) => winId !== id);

    let nextActive: string | null = activeWindow;
    if (activeWindow === id) {
      const remainingUnminimized = newOpen.filter(
        (winId) => !newMin.includes(winId)
      );
      nextActive = remainingUnminimized.length > 0
        ? remainingUnminimized[remainingUnminimized.length - 1]
        : null;
    }

    set({
      openWindows: newOpen,
      minimizedWindows: newMin,
      maximizedWindows: newMax,
      activeWindow: nextActive,
    });
  },

  toggleMinimize: (id: string) => {
    const { minimizedWindows, activeWindow, openWindows } = get();
    const isMin = minimizedWindows.includes(id);

    if (isMin) {
      // Un-minimize and focus
      get().restoreWindow(id);
    } else {
      // Minimize
      const newMin = [...minimizedWindows, id];
      const remaining = openWindows.filter(
        (winId) => winId !== id && !newMin.includes(winId)
      );
      set({
        minimizedWindows: newMin,
        activeWindow:
          activeWindow === id
            ? remaining.length > 0
              ? remaining[remaining.length - 1]
              : null
            : activeWindow,
      });
    }
  },

  toggleMaximize: (id: string) => {
    const { maximizedWindows } = get();
    const isMax = maximizedWindows.includes(id);
    set({
      maximizedWindows: isMax
        ? maximizedWindows.filter((winId) => winId !== id)
        : [...maximizedWindows, id],
    });
    get().bringToFront(id);
  },

  focusWindow: (id: string) => {
    const { zIndexMap, minimizedWindows } = get();
    const { map, highest } = computeNextZ(zIndexMap, id);
    set({
      activeWindow: id,
      highestZIndex: highest,
      zIndexMap: map,
      minimizedWindows: minimizedWindows.filter((winId) => winId !== id),
    });
  },

  restoreWindow: (id: string) => {
    const { openWindows, minimizedWindows, zIndexMap } = get();
    const { map, highest } = computeNextZ(zIndexMap, id);
    set({
      openWindows: openWindows.includes(id) ? openWindows : [...openWindows, id],
      minimizedWindows: minimizedWindows.filter((winId) => winId !== id),
      activeWindow: id,
      highestZIndex: highest,
      zIndexMap: map,
    });
  },

  bringToFront: (id: string) => {
    const { zIndexMap } = get();
    const { map, highest } = computeNextZ(zIndexMap, id);
    set({
      activeWindow: id,
      highestZIndex: highest,
      zIndexMap: map,
    });
  },

  isWindowOpen: (id: string) => get().openWindows.includes(id),
  isWindowMinimized: (id: string) => get().minimizedWindows.includes(id),
  isWindowMaximized: (id: string) => get().maximizedWindows.includes(id),
}));
