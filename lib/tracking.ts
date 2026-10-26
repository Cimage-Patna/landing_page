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

/**
 * Meta click id (fbclid) capture.
 *
 * Meta appends `?fbclid=…` on ad clicks. We store it the way the Meta Pixel
 * would — an `_fbc` cookie, `fb.1.<ms>.<fbclid>` — so /api/lead can read it
 * server-side and the CRM can report the lead's later stages back to Meta
 * (Conversions API). 90 days, matching gclid. A fresh fbclid overrides.
 */
const FBC_MAX_AGE = 90 * 24 * 60 * 60; // seconds

export function captureFbc(): void {
  if (typeof window === "undefined") return;
  try {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (!fbclid) return;
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbc="))
      ?.slice("_fbc=".length);
    if (current && current.endsWith(`.${fbclid}`)) return; // same click, keep its time
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; Max-Age=${FBC_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}
