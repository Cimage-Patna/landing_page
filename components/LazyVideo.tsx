"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
  poster?: string;
  /** Start fetching this far before the element scrolls into view. */
  rootMargin?: string;
};

/**
 * A background <video> that downloads NOTHING until it nears the viewport.
 *
 * The previous components used `preload="auto"`, so every below-the-fold clip
 * (arm / quadruped / text ≈ 5 MB combined) was fully downloaded on every page
 * load — even for ad traffic that bounced in two seconds. That egress was the
 * bulk of the Amplify bill. Here we render the <video> with `preload="none"`
 * and attach the <source> only once an IntersectionObserver says we're close,
 * then call load()+play(). Visitors who never scroll never pay for the bytes.
 */
export default function LazyVideo({ src, className, poster, rootMargin = "300px" }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  // Once the <source> is attached we must call load() to pick it up, then play
  // (the autoPlay attribute doesn't fire for sources added after mount).
  useEffect(() => {
    if (!show) return;
    const v = ref.current;
    if (!v) return;
    v.load();
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, [show]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
    >
      {show && <source src={src} type="video/mp4" />}
    </video>
  );
}
