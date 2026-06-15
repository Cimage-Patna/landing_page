"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";

/* MU's .insightSection card rail — "Hear straight from our alumni". A header
   (heading + sub on the left, prev/next arrows on the right) over a
   horizontally-scrolling rail of cards: a video still with a centred play
   button (opens the clip in a lightbox), then a title + short description.
   Native scroll-snap rail (no Swiper) + a little React for the arrows + modal.
   Driven by copy.videoStories. */

const v = copy.videoStories;
const stories = v.stories;

export default function MUAlumniVoices() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".mu-insight-card");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Lock scroll + close on Escape while the lightbox is open.
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx]);

  const playing = openIdx !== null ? stories[openIdx] : null;

  return (
    <section className="mu-insight bg-[#090909] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* header: heading + sub (left), prev/next (right) */}
        <div className="mu-insight-head">
          <div>
            <h2 className="text-[2rem] font-semibold leading-[1.1] text-white sm:text-[2.6rem]">
              {v.display} <span className="mu-serif font-normal italic">{v.displayAccent}</span>
            </h2>
            <p className="mt-3 max-w-xl text-[16px] text-white/60">{v.sub}</p>
          </div>

          <div className="mu-insight-arrows">
            <button
              className="mu-prog-arrow-btn"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="mu-prog-arrow-btn"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* card rail */}
        <div ref={railRef} className="mu-insight-rail mu-no-scrollbar">
          {stories.map((s, i) => (
            <article key={i} className="mu-insight-card">
              <div className="mu-insight-img">
                <Image src={s.thumb} alt={s.title} fill sizes="(max-width:768px) 82vw, (max-width:1024px) 46vw, 400px" />
                <button
                  type="button"
                  className="mu-insight-play"
                  aria-label={`Play: ${s.title}`}
                  onClick={() => {
                    if (s.youtube || s.video) setOpenIdx(i);
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#090909" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="mu-insight-text">
                <p className="mu-insight-title">{s.title}</p>
                <p className="mu-insight-desc">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {playing && (
        <div
          className="mu-voices-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          onClick={() => setOpenIdx(null)}
        >
          <button className="mu-voices-close" aria-label="Close video" onClick={() => setOpenIdx(null)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="mu-voices-frame" onClick={(e) => e.stopPropagation()}>
            {playing.youtube ? (
              <iframe
                src={`https://www.youtube.com/embed/${playing.youtube}?autoplay=1&rel=0`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={playing.video} poster={playing.thumb} controls autoPlay playsInline />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
