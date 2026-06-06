"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";

const DESKTOP = { video: "/HRO-web.mp4", poster: "/hero/hro-poster.webp" };
const MOBILE = { video: "/HRO-mobile.mp4", poster: "/hero/hro-poster-mobile.webp" };
const MOBILE_Q = "(max-width: 767px)";

/**
 * Art-directed hero background.
 *
 * - Poster (<picture>) is server-rendered, so first paint / LCP is never
 *   blocked by the video. Mobile gets the 24 KB portrait crop, desktop the
 *   72 KB landscape frame — the browser downloads only the matching one.
 * - On mount the video overlays the poster and autoplays, EXCEPT when the
 *   user prefers reduced motion or has Save-Data turned on (poster stays).
 * - Source is art-directed too: phones load the 1.0 MB portrait crop
 *   (HRO-mobile.mp4, letterbox bars removed → true full-screen, no black bars),
 *   desktop loads the 1.5 MB landscape loop (HRO-web.mp4).
 *
 * Files: public/HRO-mobile.mp4, public/HRO-web.mp4 (HRO.mp4 is the 10 MB original).
 */
export default function HeroVideo() {
  // SSR + initial render: poster only (no hydration mismatch).
  const [src, setSrc] = useState<{ video: string; poster: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const decide = () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // Only honour the explicit Save-Data opt-in. The effectiveType heuristic
      // is unreliable (many 4G phones report "3g") and was wrongly suppressing
      // the video, so it's intentionally not used.
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const saveData = conn?.saveData === true;

      if (prefersReduced || saveData) {
        setSrc(null);
        return;
      }
      setSrc(window.matchMedia(MOBILE_Q).matches ? MOBILE : DESKTOP);
    };

    decide();
    const mq = window.matchMedia(MOBILE_Q);
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  // Backup for the autoplay attribute: some mobile browsers don't honour it on
  // a dynamically-mounted <video>, so kick playback once the source is ready.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [src]);

  return (
    <>
      {/* Server-rendered art-directed poster — the always-present base layer */}
      <picture>
        <source media={MOBILE_Q} srcSet={asset(MOBILE.poster)} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(DESKTOP.poster)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      {/* Video overlays the poster once allowed */}
      {src && (
        <video
          key={src.video}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={asset(src.poster)}
          aria-hidden="true"
        >
          <source src={asset(src.video)} type="video/mp4" />
        </video>
      )}
    </>
  );
}
