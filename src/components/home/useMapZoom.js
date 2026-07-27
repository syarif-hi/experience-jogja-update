import { useEffect, useRef, useState, useCallback } from "react";

// Touch-only pinch-zoom + pan for the interactive map.
// Desktop (no touch / pointer:fine) is left untouched — returns identity transform + enabled:false.
// On touch devices the initial view is zoomed to `initialScale` centered on the map middle (Kraton area).

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function useMapZoom(viewportRef, { initialScale = 2, enabledWhen = true } = {}) {
  const [enabled, setEnabled] = useState(false);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const stateRef = useRef({ scale: 1, x: 0, y: 0 });
  const gestureRef = useRef(null); // { mode: 'pan'|'pinch', ... }
  const didInit = useRef(false);

  // Keep constrained translation so the scaled stage never reveals empty space.
  const constrain = useCallback((next) => {
    const el = viewportRef.current;
    if (!el) return next;
    const { width, height } = el.getBoundingClientRect();
    const maxX = (next.scale - 1) * width * 0.5;
    const maxY = (next.scale - 1) * height * 0.5;
    return {
      scale: next.scale,
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  }, [viewportRef]);

  const apply = useCallback((next) => {
    const c = constrain(next);
    stateRef.current = c;
    setTransform(c);
  }, [constrain]);

  // Enable on touch devices and set the initial zoomed-to-center view.
  useEffect(() => {
    if (!enabledWhen) { setEnabled(false); return; }
    const touch = isTouchDevice();
    setEnabled(touch);
    if (touch && !didInit.current) {
      didInit.current = true;
      // Centered zoom → translation stays 0 (origin is the middle).
      apply({ scale: clamp(initialScale, MIN_SCALE, MAX_SCALE), x: 0, y: 0 });
    }
  }, [enabledWhen, initialScale, apply]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !enabled) return;

    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mid = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        gestureRef.current = {
          mode: "pinch",
          startDist: dist(e.touches),
          startScale: stateRef.current.scale,
          startX: stateRef.current.x,
          startY: stateRef.current.y,
          startMid: mid(e.touches),
        };
      } else if (e.touches.length === 1 && stateRef.current.scale > 1) {
        gestureRef.current = {
          mode: "pan",
          startTouch: { x: e.touches[0].clientX, y: e.touches[0].clientY },
          startX: stateRef.current.x,
          startY: stateRef.current.y,
        };
      } else {
        gestureRef.current = null;
      }
    };

    const onTouchMove = (e) => {
      const g = gestureRef.current;
      if (!g) return;
      if (g.mode === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        const scale = clamp((dist(e.touches) / g.startDist) * g.startScale, MIN_SCALE, MAX_SCALE);
        const m = mid(e.touches);
        apply({ scale, x: g.startX + (m.x - g.startMid.x), y: g.startY + (m.y - g.startMid.y) });
      } else if (g.mode === "pan" && e.touches.length === 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - g.startTouch.x;
        const dy = e.touches[0].clientY - g.startTouch.y;
        apply({ scale: stateRef.current.scale, x: g.startX + dx, y: g.startY + dy });
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length === 0) gestureRef.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, apply, viewportRef]);

  const reset = useCallback(() => apply({ scale: 1, x: 0, y: 0 }), [apply]);
  const zoomBy = useCallback((factor) => {
    apply({ scale: clamp(stateRef.current.scale * factor, MIN_SCALE, MAX_SCALE), x: stateRef.current.x, y: stateRef.current.y });
  }, [apply]);

  return { enabled, transform, reset, zoomBy, canReset: transform.scale > 1 };
}