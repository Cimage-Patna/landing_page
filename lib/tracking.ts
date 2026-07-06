/**
 * Google Click Identifier (gclid) capture.
 *
 * Google appends `?gclid=…` to the landing URL on every ad click. We persist it
 * (up to 90 days — Google's conversion window) so a lead submitted after the
 * visitor browses around still carries the click id. A fresh gclid on the URL
 * always overrides the stored one.
 */
const KEY = "gclid";
const MAX_AGE = 90 * 24 * 60 * 60 * 1000; // 90 days

export function captureGclid(): string {
  if (typeof window === "undefined") return "";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("gclid");
    if (fromUrl) {
      localStorage.setItem(KEY, JSON.stringify({ v: fromUrl, t: Date.now() }));
      return fromUrl;
    }
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { v, t } = JSON.parse(raw) as { v?: string; t?: number };
      if (v && typeof t === "number" && Date.now() - t < MAX_AGE) return v;
    }
  } catch {
    /* ignore */
  }
  return "";
}
