"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./ui";

/* 360° virtual campus tour (vtour.cimage.in), embedded above the reels band.
   The tour is a heavy 3D page, so the iframe is only mounted once the section
   scrolls near the viewport — until then we show a lightweight placeholder.
   That keeps first-load cost off every landing page. */

const TOUR_URL = "https://vtour.cimage.in";

export default function MUVirtualTour() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      // start loading a little before it's actually on screen
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="virtual-tour" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#737373]">
            Virtual campus tour
          </p>
          <h2 className="mt-3 text-[2.1rem] font-semibold leading-[1.1] text-[#090909] sm:text-[3rem]">
            Walk the campus, <span className="mu-serif italic mu-gradient-text">from anywhere</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] text-[#525252]">
            Explore the labs, classrooms, library and campus grounds in an interactive 360° tour —
            no visit required. Drag to look around, tap the hotspots to move between spaces.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={frameRef}
            className="mu-vtour-frame mt-8 overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.4)]"
          >
            {show ? (
              <iframe
                src={TOUR_URL}
                title="CIMAGE 360° virtual campus tour"
                loading="lazy"
                allowFullScreen
                allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span className="text-[14px] text-[#737373]">Loading virtual tour…</span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-5">
            <a
              href={TOUR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e0e0e0] px-5 text-[14px] font-semibold text-[#090909] transition hover:bg-[#f5f5f5]"
            >
              Open full screen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17 17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
