import Lenis from "lenis";
import { SpringCamera } from "./SpringCamera";
import { StoryTicker } from "./StoryTicker";

export interface ViewportControlsOptions {
  element: HTMLElement;
  camera: SpringCamera;
  ticker: StoryTicker;
  lenis?: Lenis | null;
  onStateChange?: (state: ViewportControlState) => void;
}

export interface ViewportControlState {
  isInteracting: boolean;
  isInspectMode: boolean;
  hasOffsets: boolean;
  activeMode: "orbit" | "pan" | "zoom" | "idle";
}

export class ViewportControls {
  private element: HTMLElement;
  private camera: SpringCamera;
  private ticker: StoryTicker;
  private lenis?: Lenis | null;
  private onStateChange?: (state: ViewportControlState) => void;

  private isInteracting: boolean = false;
  private activePointerId: number | null = null;
  private activeMode: "orbit" | "pan" | "zoom" | "idle" = "idle";
  private lastX: number = 0;
  private lastY: number = 0;

  // Touch Pinch & Pan tracking
  private activeTouches: Map<number, { x: number; y: number }> = new Map();
  private initialPinchDist: number = 0;

  // Sensitivity factors calibrated for desktop and mobile
  private orbitSensitivity: number = 0.005;
  private panSensitivity: number = 0.015;
  private zoomSensitivity: number = 0.0015;

  private isDisposed: boolean = false;

  // Bound event handlers for clean disposal
  private onPointerDownBound: (e: PointerEvent) => void;
  private onPointerMoveBound: (e: PointerEvent) => void;
  private onPointerUpBound: (e: PointerEvent) => void;
  private onWheelBound: (e: WheelEvent) => void;
  private onContextMenuBound: (e: MouseEvent) => void;
  private onKeyDownBound: (e: KeyboardEvent) => void;

  constructor(options: ViewportControlsOptions) {
    this.element = options.element;
    this.camera = options.camera;
    this.ticker = options.ticker;
    this.lenis = options.lenis;
    this.onStateChange = options.onStateChange;

    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerMoveBound = this.onPointerMove.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);
    this.onWheelBound = this.onWheel.bind(this);
    this.onContextMenuBound = (e) => {
      // Prevent context menu so right-click pan works cleanly
      if (this.isInteracting || this.camera.getInspectMode()) {
        e.preventDefault();
      }
    };
    this.onKeyDownBound = this.onKeyDown.bind(this);

    this.attachEvents();
    this.updateCursor();
  }

  private attachEvents(): void {
    this.element.addEventListener("pointerdown", this.onPointerDownBound);
    window.addEventListener("pointermove", this.onPointerMoveBound);
    window.addEventListener("pointerup", this.onPointerUpBound);
    window.addEventListener("pointercancel", this.onPointerUpBound);
    this.element.addEventListener("wheel", this.onWheelBound, { passive: false });
    this.element.addEventListener("contextmenu", this.onContextMenuBound);
    window.addEventListener("keydown", this.onKeyDownBound);
  }

  private detachEvents(): void {
    this.element.removeEventListener("pointerdown", this.onPointerDownBound);
    window.removeEventListener("pointermove", this.onPointerMoveBound);
    window.removeEventListener("pointerup", this.onPointerUpBound);
    window.removeEventListener("pointercancel", this.onPointerUpBound);
    this.element.removeEventListener("wheel", this.onWheelBound);
    this.element.removeEventListener("contextmenu", this.onContextMenuBound);
    window.removeEventListener("keydown", this.onKeyDownBound);
  }

  private notifyState(): void {
    if (this.onStateChange) {
      this.onStateChange({
        isInteracting: this.isInteracting,
        isInspectMode: this.camera.getInspectMode(),
        hasOffsets: this.camera.hasInteractiveOffsets(),
        activeMode: this.activeMode,
      });
    }
    this.updateCursor();
  }

  private updateCursor(): void {
    if (!this.element) return;
    if (this.isInteracting) {
      if (this.activeMode === "pan") {
        this.element.style.cursor = "move";
      } else if (this.activeMode === "orbit") {
        this.element.style.cursor = "grabbing";
      } else if (this.activeMode === "zoom") {
        this.element.style.cursor = "ns-resize";
      }
    } else {
      if (this.camera.getInspectMode()) {
        this.element.style.cursor = "grab";
      } else {
        this.element.style.cursor = "grab";
      }
    }
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.isDisposed) return;

    // Track active touches
    this.activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.activeTouches.size === 1) {
      this.isInteracting = true;
      this.activePointerId = e.pointerId;
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      // Determine interaction mode
      // Right Click (button 2) OR Middle Click (button 1) OR Shift + Click -> Pan
      // Alt / Option + Click -> Zoom
      // Otherwise -> Orbit
      if (e.button === 2 || e.button === 1 || e.shiftKey) {
        this.activeMode = "pan";
      } else if (e.altKey) {
        this.activeMode = "zoom";
      } else {
        this.activeMode = "orbit";
      }

      try {
        this.element.setPointerCapture(e.pointerId);
      } catch {}
    } else if (this.activeTouches.size === 2) {
      // Two fingers on screen: calculate initial distance for pinch-zoom
      const touches = Array.from(this.activeTouches.values());
      const dx = touches[0].x - touches[1].x;
      const dy = touches[0].y - touches[1].y;
      this.initialPinchDist = Math.hypot(dx, dy);
      this.activeMode = "pan";
    }

    this.ticker.markDirty();
    this.notifyState();
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.isDisposed || !this.isInteracting) return;

    if (this.activeTouches.has(e.pointerId)) {
      this.activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (this.activeTouches.size === 2) {
      // Two-finger Pinch & Pan
      const touches = Array.from(this.activeTouches.values());
      const dx = touches[0].x - touches[1].x;
      const dy = touches[0].y - touches[1].y;
      const dist = Math.hypot(dx, dy);

      if (this.initialPinchDist > 0 && Math.abs(dist - this.initialPinchDist) > 2) {
        const pinchDelta = (this.initialPinchDist - dist) * 0.005;
        this.camera.addZoomDelta(pinchDelta);
        this.initialPinchDist = dist;
      }

      // Two-finger Pan
      const deltaX = e.clientX - this.lastX;
      const deltaY = e.clientY - this.lastY;
      this.camera.addPanDelta(-deltaX * this.panSensitivity * 0.5, deltaY * this.panSensitivity * 0.5);

      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.ticker.markDirty();
      this.notifyState();
      return;
    }

    if (e.pointerId !== this.activePointerId) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.activeMode === "pan") {
      this.camera.addPanDelta(-dx * this.panSensitivity, dy * this.panSensitivity);
    } else if (this.activeMode === "zoom") {
      this.camera.addZoomDelta(dy * 0.008);
    } else if (this.activeMode === "orbit") {
      this.camera.addOrbitDelta(-dx * this.orbitSensitivity, dy * this.orbitSensitivity * 0.85);
    }

    this.ticker.markDirty();
    this.notifyState();
  }

  private onPointerUp(e: PointerEvent): void {
    this.activeTouches.delete(e.pointerId);

    if (this.activeTouches.size === 0) {
      this.isInteracting = false;
      this.activePointerId = null;
      this.activeMode = "idle";
      this.initialPinchDist = 0;
      try {
        this.element.releasePointerCapture(e.pointerId);
      } catch {}
    } else if (this.activeTouches.size === 1) {
      const remainingId = Array.from(this.activeTouches.keys())[0];
      const pt = this.activeTouches.get(remainingId)!;
      this.activePointerId = remainingId;
      this.lastX = pt.x;
      this.lastY = pt.y;
      this.activeMode = "orbit";
    }

    this.ticker.markDirty();
    this.notifyState();
  }

  private onWheel(e: WheelEvent): void {
    if (this.isDisposed) return;

    const isInspect = this.camera.getInspectMode();
    const isZoomModifier = e.ctrlKey || e.altKey || e.shiftKey || isInspect;

    if (isZoomModifier) {
      e.preventDefault();
      const zoomFactor = e.deltaY * this.zoomSensitivity;
      this.camera.addZoomDelta(zoomFactor);
      this.ticker.markDirty();
      this.notifyState();
    }
    // If not in inspect mode and no modifier key, normal page scroll progresses the story timeline!
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (this.isDisposed) return;

    // Ignore keyboard shortcuts if focus is inside an input/textarea
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
      return;
    }

    if (e.key === "r" || e.key === "R") {
      this.resetCamera();
    } else if (e.key === "i" || e.key === "I") {
      this.toggleInspectMode();
    } else if (e.key === "+" || e.key === "=") {
      this.zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      this.zoomOut();
    }
  }

  // --- Public Control APIs ---

  public toggleInspectMode(): boolean {
    const next = !this.camera.getInspectMode();
    this.setInspectMode(next);
    return next;
  }

  public setInspectMode(active: boolean): void {
    this.camera.setInspectMode(active);
    if (this.lenis) {
      if (active) {
        this.lenis.stop();
      } else {
        this.lenis.start();
      }
    }
    this.notifyState();
    this.ticker.markDirty();
  }

  public resetCamera(): void {
    this.camera.resetInteractiveOffsets();
    this.ticker.markDirty();
    this.notifyState();
  }

  public zoomIn(): void {
    this.camera.addZoomDelta(-0.2);
    this.ticker.markDirty();
    this.notifyState();
  }

  public zoomOut(): void {
    this.camera.addZoomDelta(0.2);
    this.ticker.markDirty();
    this.notifyState();
  }

  public dispose(): void {
    this.isDisposed = true;
    this.detachEvents();
  }
}
