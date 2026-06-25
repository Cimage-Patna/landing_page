// Google Ads conversion helpers. The global gtag.js tag (AW-10885034048) is
// loaded once in app/layout.tsx; these fire individual conversion events.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// "WhatsApp Button Clicked" conversion in Google Ads. Currently wired to the
// Apply Now form submission (a captured lead is the real conversion).
const APPLY_CONVERSION_SEND_TO = "AW-10885034048/xttPCJKJlfUYEMDgscYo";

export function reportApplyConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: APPLY_CONVERSION_SEND_TO });
}
