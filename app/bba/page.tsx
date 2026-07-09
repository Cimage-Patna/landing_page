// Course-specific landing page: BBA.
// For now this serves the exact home page (re-exported, single source of truth)
// so it inherits every bit of functionality — GTM, Google Ads gtag, the lead
// form + /api/lead, the /thank-you conversion flow — and keeps utm_* / gclid
// query params intact. Fork this file when this page needs to diverge.
export { default } from "../page";
