// Straight-line (haversine) distance + a rough local-road drive-time estimate.
// Computed at render time from coordinate fields — never stored, so it never goes stale.

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ~25 km/h effective local-road average — always labeled "approx." in the UI.
export function estimateDriveMinutes(km) {
  return Math.round((km / 25) * 60);
}

export function hasCoords(rec) {
  return typeof rec?.latitude === "number" && typeof rec?.longitude === "number";
}

// Given an origin { latitude, longitude } and a list of candidates, return the
// nearest `limit` with computed distanceKm + driveMin attached (excludes anything
// without coordinates and, optionally, the origin's own id).
export function nearest(origin, candidates, { limit = 6, excludeId } = {}) {
  if (!hasCoords(origin)) return [];
  return candidates
    .filter((c) => hasCoords(c) && c.id !== excludeId)
    .map((c) => {
      const distanceKm = haversineKm(origin.latitude, origin.longitude, c.latitude, c.longitude);
      return { ...c, distanceKm, driveMin: estimateDriveMinutes(distanceKm) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}