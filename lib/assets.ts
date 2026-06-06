/**
 * Resolves a static asset path to its serving origin.
 *
 * Assets live in the `cimage-web` S3 bucket (uploaded under `public/public/…`,
 * hence the doubled segment in the default base), which serves egress instead of
 * Amplify. Override with `NEXT_PUBLIC_ASSET_BASE` to point at a CloudFront
 * distribution later, or set it to "" to serve from local `public/` in dev.
 *
 * Already-absolute URLs (e.g. the S3-hosted reels) are returned untouched.
 */
const DEFAULT_BASE = "https://cimage-web.s3.ap-south-1.amazonaws.com/public/public";
const BASE = (process.env.NEXT_PUBLIC_ASSET_BASE ?? DEFAULT_BASE).replace(/\/+$/, "");

export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}
