// Phone-OTP verification config, phone helpers, and analytics — shared by all
// three lead forms. OTP is for DATA ACCURACY only: it never creates a login,
// session, or account, and it must NEVER block a submission (see OtpPanel).

// ── Mode ────────────────────────────────────────────────────────────────────
// off  — no OTP step; submit straight through (no otp tag).
// soft — OTP shown, "Skip for now" allowed, submission never blocked. The lead
//        is tagged otp-verified or otp-unverified.
// hard — OTP required, but after repeated send failures or a timeout it falls
//        back to submitting as otp-unverified with a "we'll call to confirm"
//        message. Still never hard-blocks the lead.
export type OtpMode = "off" | "soft" | "hard";

// Global default, flip-able without a code change via env
// (NEXT_PUBLIC_OTP_MODE=off|soft|hard). Defaults to "soft".
const ENV_MODE = (process.env.NEXT_PUBLIC_OTP_MODE ?? "").trim() as OtpMode;
const DEFAULT_OTP_MODE: OtpMode =
  ENV_MODE === "off" || ENV_MODE === "soft" || ENV_MODE === "hard" ? ENV_MODE : "soft";

// Per-landing-page overrides, keyed by pathname (same pattern as PAGE_TAGS /
// HIDE_COURSE). Add e.g. "/btech": "hard" to make one campaign mandatory while
// the rest stay soft.
const OTP_MODE_BY_PATH: Record<string, OtpMode> = {
  // "/btech": "hard",
};

export function otpModeForPath(pathname: string | null | undefined): OtpMode {
  return OTP_MODE_BY_PATH[(pathname ?? "").replace(/\/+$/, "") || "/"] ?? DEFAULT_OTP_MODE;
}

// ── Behaviour knobs ──────────────────────────────────────────────────────────
export const RESEND_COOLDOWN_SECONDS = 30;
// Hard mode: after this many failed sends we stop trying and fall back.
export const MAX_SEND_FAILURES = 2;
// Hard mode: if the user hasn't verified within this window, offer the fallback.
export const HARD_FALLBACK_TIMEOUT_MS = 90_000;

// ── Firebase "web app config" ────────────────────────────────────────────────
// PUBLIC by design — it ships to the browser no matter where it's stored, so
// there is no secret to protect and no benefit to env vars or an API route for
// these values. Committed here directly so nothing has to be configured in
// Amplify; it just works on deploy. Real protection is the Firebase console's
// Authorized Domains list (+ App Check if you enable it), NOT hiding this.
// (A NEXT_PUBLIC_* env var of the same name still overrides, if you ever need to
// point the site at a different Firebase project without a code change.)
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCOlRbXV4EoFsWWuEwnfufsPivPw3XD_Jo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "cimage-landing-otp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "cimage-landing-otp",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "cimage-landing-otp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "111338086046",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:111338086046:web:35495cc2e8eb87ac5a658f",
};

// True only when enough config is present to actually run OTP. When false, the
// forms skip the OTP UI and submit as otp-unverified (never block) — so the site
// keeps working locally / before Firebase is wired up.
export function isOtpConfigured(): boolean {
  const c = firebaseConfig;
  return Boolean(c.apiKey && c.authDomain && c.projectId && c.appId);
}

// ── Phone formats — these differ and it matters ─────────────────────────────
// Firebase needs E.164 (+91XXXXXXXXXX); the CRM needs exactly the 10 digits.
export function tenDigits(raw: string): string {
  return (raw || "").replace(/\D/g, "").slice(-10);
}
export function toE164India(raw: string): string {
  const ten = tenDigits(raw);
  return ten.length === 10 ? `+91${ten}` : "";
}

// ── Instrumentation ─────────────────────────────────────────────────────────
// Drop-off funnel: otp_started → otp_sent → otp_verified | otp_failed | otp_skipped.
export type OtpEvent =
  | "otp_started"
  | "otp_sent"
  | "otp_verified"
  | "otp_failed"
  | "otp_skipped";

export function otpEvent(event: OtpEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...params });
  } catch {
    /* ignore */
  }
}
