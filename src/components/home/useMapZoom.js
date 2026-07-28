import { useEffect, useRef, useState, useCallback } from "react";

// Touch-only pinch-zoom + pan for the interactive map.
// Desktop (no touch / pointer:fine) is left untouched — returns identity transform + enabled:false.
// On touch devices the initial view is zoomed to `initialScale` centered on the map middle (Kraton area).

const MIN_SCALE = 1;
const MAX_SCALE = 2.5;

function shouldEnableZoom() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
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
    const { width: wrapperW, height: wrapperH } = el.getBoundingClientRect();
    
    // The stage has a fixed aspect ratio of 16/10 relative to width.
    const stageW = wrapperW;
    const stageH = stageW / 1.6;

    // Maximum pan bounds are calculated based on the difference
    // between the scaled stage dimensions and the wrapper dimensions.
    let maxX = (stageW * next.scale - wrapperW) / 2;
    let maxY = (stageH * next.scale - wrapperH) / 2;

    if (maxX < 0) maxX = 0;
    if (maxY < 0) maxY = 0;

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
    const enable = shouldEnableZoom();
    setEnabled(enable);
    if (enable && !didInit.current) {
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

    const onMouseDown = (e) => {
      if (e.button !== 0 || gestureRef.current) return;
      if (stateRef.current.scale > 1) {
        gestureRef.current = {
          mode: "pan",
          startTouch: { x: e.clientX, y: e.clientY },
          startX: stateRef.current.x,
          startY: stateRef.current.y,
        };
      }
    };

    const onMouseMove = (e) => {
      const g = gestureRef.current;
      if (!g || g.mode !== "pan") return;
      e.preventDefault();
      const dx = e.clientX - g.startTouch.x;
      const dy = e.clientY - g.startTouch.y;
      apply({ scale: stateRef.current.scale, x: g.startX + dx, y: g.startY + dy });
    };

    const onMouseUp = () => {
      if (gestureRef.current && gestureRef.current.mode === "pan") {
        gestureRef.current = null;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [enabled, apply, viewportRef]);

  const reset = useCallback(() => apply({ scale: 1, x: 0, y: 0 }), [apply]);
  const zoomBy = useCallback((factor) => {
    apply({ scale: clamp(stateRef.current.scale * factor, MIN_SCALE, MAX_SCALE), x: stateRef.current.x, y: stateRef.current.y });
  }, [apply]);

  const panToPct = useCallback((px, py) => {
    const el = viewportRef.current;
    if (!el) return;
    const { width: wrapperW } = el.getBoundingClientRect();
    const stageW = wrapperW;
    const stageH = stageW / 1.6;
    
    const dx = ((50 - px) / 100) * stageW;
    const dy = ((50 - py) / 100) * stageH;
    
    apply({ 
      scale: stateRef.current.scale, 
      x: dx * stateRef.current.scale, 
      y: dy * stateRef.current.scale 
    });
  }, [apply, viewportRef]);

  return { enabled, transform, reset, zoomBy, canReset: transform.scale > 1, panToPct };
}