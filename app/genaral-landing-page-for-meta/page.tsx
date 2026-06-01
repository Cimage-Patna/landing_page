// The old Meta-ads landing URL is already live in every campaign. Serve the
// exact same page here (re-exported from the home route, single source of
// truth) so those ad clicks land on the new landing page with no redirect and
// with their utm_* query params intact.
export { default } from "../page";
