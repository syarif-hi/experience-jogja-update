/**
 * Base URL for static assets (images, icons, etc.) hosted on the VPS.
 * All relative image paths (e.g. "/images/slider/foo.jpg") should be
 * prefixed with this URL when running outside the VPS (e.g. on Base44).
 *
 * On the VPS itself the images are served from the same origin, so
 * this constant can be set to "" to keep paths relative.
 */
export const ASSETS_URL = "https://demo.experiencejogja.com";

/**
 * Convenience helper — prepends ASSETS_URL to a path that starts with "/".
 * Paths that are already absolute (http/https) or empty are returned as-is.
 */
export function assetUrl(path) {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${ASSETS_URL}${path}`;
  return path;
}
