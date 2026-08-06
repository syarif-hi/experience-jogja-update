// Convex hull computation utilities for the Jogja Maps Widget zone overlays.

/**
 * Compute the convex hull of 2D points using Graham scan.
 * Returns vertices ordered around the hull.
 * @param {{ x: number, y: number }[]} points
 * @returns {{ x: number, y: number }[]}
 */
export function convexHull(points) {
  const pts = points.map((p) => ({ x: p.x, y: p.y }));
  if (pts.length <= 2) return pts;

  // Find bottom-most point (largest y in screen coords), leftmost if tie
  let pivotIdx = 0;
  for (let i = 1; i < pts.length; i++) {
    if (
      pts[i].y > pts[pivotIdx].y ||
      (pts[i].y === pts[pivotIdx].y && pts[i].x < pts[pivotIdx].x)
    ) {
      pivotIdx = i;
    }
  }
  const pivot = pts[pivotIdx];

  // Sort remaining points by polar angle from pivot
  const rest = pts
    .filter((_, i) => i !== pivotIdx)
    .sort((a, b) => {
      const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
      const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
      if (Math.abs(angleA - angleB) < 1e-10) {
        return (
          Math.hypot(a.x - pivot.x, a.y - pivot.y) -
          Math.hypot(b.x - pivot.x, b.y - pivot.y)
        );
      }
      return angleA - angleB;
    });

  const stack = [pivot];
  for (const p of rest) {
    while (stack.length > 1) {
      const a = stack[stack.length - 2];
      const b = stack[stack.length - 1];
      // Cross product: positive = left turn (keep), negative/zero = right turn (remove)
      const cross =
        (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
      if (cross <= 0) stack.pop();
      else break;
    }
    stack.push(p);
  }
  return stack;
}

/**
 * Expand a convex hull outward from its centroid by `padding` units.
 * Each vertex is pushed away from the centroid along the radial direction.
 * @param {{ x: number, y: number }[]} hull
 * @param {number} padding  — expansion in coordinate units (same as x/y)
 * @returns {{ x: number, y: number }[]}
 */
export function expandHull(hull, padding) {
  if (hull.length === 0) return [];

  const cx = hull.reduce((s, p) => s + p.x, 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p.y, 0) / hull.length;

  return hull.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy);
    if (len < 0.001) return { x: p.x + padding, y: p.y };
    return {
      x: p.x + (dx / len) * padding,
      y: p.y + (dy / len) * padding,
    };
  });
}

/**
 * Convert a convex hull to an SVG `d` path string with rounded corners.
 * Handles edge cases: single point (circle), two points (capsule).
 * @param {{ x: number, y: number }[]} hull
 * @param {number} [cornerRadius=3]
 * @returns {string}
 */
export function hullToSmoothPath(hull, cornerRadius = 3) {
  const n = hull.length;
  if (n === 0) return "";

  if (n === 1) {
    // Single point → circle
    const r = cornerRadius;
    const { x, y } = hull[0];
    return `M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y} Z`;
  }

  if (n === 2) {
    // Two points → capsule (rounded rectangle along the axis)
    const [a, b] = hull;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.001) return hullToSmoothPath([a], cornerRadius);
    const nx = (-dy / len) * cornerRadius;
    const ny = (dx / len) * cornerRadius;
    return [
      `M ${(a.x + nx).toFixed(2)} ${(a.y + ny).toFixed(2)}`,
      `L ${(b.x + nx).toFixed(2)} ${(b.y + ny).toFixed(2)}`,
      `A ${cornerRadius} ${cornerRadius} 0 0 1 ${(b.x - nx).toFixed(2)} ${(b.y - ny).toFixed(2)}`,
      `L ${(a.x - nx).toFixed(2)} ${(a.y - ny).toFixed(2)}`,
      `A ${cornerRadius} ${cornerRadius} 0 0 1 ${(a.x + nx).toFixed(2)} ${(a.y + ny).toFixed(2)}`,
      "Z",
    ].join(" ");
  }

  // 3+ points → polygon with quadratic-Bézier rounded corners
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = hull[(i - 1 + n) % n];
    const curr = hull[i];
    const next = hull[(i + 1) % n];

    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
    const toNext = { x: next.x - curr.x, y: next.y - curr.y };
    const lenPrev = Math.hypot(toPrev.x, toPrev.y);
    const lenNext = Math.hypot(toNext.x, toNext.y);

    // Corner radius capped at 1/3 of the shortest adjacent edge
    const r = Math.min(cornerRadius, lenPrev / 3, lenNext / 3);

    const startPt = {
      x: curr.x + (toPrev.x / lenPrev) * r,
      y: curr.y + (toPrev.y / lenPrev) * r,
    };
    const endPt = {
      x: curr.x + (toNext.x / lenNext) * r,
      y: curr.y + (toNext.y / lenNext) * r,
    };

    if (i === 0) {
      d += `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)}`;
    } else {
      d += ` L ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)}`;
    }
    d += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`;
  }
  d += " Z";
  return d;
}
