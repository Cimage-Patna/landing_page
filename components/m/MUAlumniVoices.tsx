"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { Reveal } from "./ui";

/* MU's .sharkTank "Hear Straight from Our Alumni" — a wide video coverflow.
   The centre (active) card carries the "Watch Video" pill, a name plate that
   overhangs the top-right and a company plate that overhangs the bottom-left;
   its play button opens the YouTube clip in a lightbox. Pure CSS transforms
   (depth, not tilt) + a little React for the active index, swipe and modal.
   Driven by copy.videoStories. */

const v = copy.videoStories;
const stories = v.stories;
const LAST = stories.length - 1;

/* Neighbour spread comes from the CSS var --mu-vx (flexed per breakpoint);
   scale + opacity fall off by |offset| from the active card. Flat — no tilt,
   exactly like MU's coverflow (rotateY 0, depth via scale). */
function cardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.92 : 0.82;
  return {
    transform: `translate(calc(-50% + ${offset} * var(--mu-vx)), -50%) scale(${scale})`,
    opacity: abs > 2 ? 0 : abs === 2 ? 0.5 : 1,
    zIndex: 10 - abs,
    pointerEvents: abs > 2 ? "none" : "auto",
  };
}

export default function MUAlumniVoices() {
  const [active, setActive] = useState(stories.length > 2 ? 2 : 0);
  // Which centre video is playing inline (the YouTube id), or null.
  const [playingId, setPlayingId] = useState<string | null>(null);
  const touchX = useRef<number | null>(null);

  // Any navigation stops the inline video so it never plays off-centre.
  const select = useCallback((i: number) => {
    setPlayingId(null);
    setActive(Math.min(LAST, Math.max(0, i)));
  }, []);
  const go = useCallback((dir: number) => {
    setPlayingId(null);
    setActive((a) => Math.min(LAST, Math.max(0, a + dir)));
  }, []);

  // Escape stops playback.
  useEffect(() => {
    if (!playingId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlayingId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [playingId]);

  return (
    <section className="mu-voices relative overflow-hidden bg-[#090909] py-16 sm:py-24">
      <div className="mu-voices-watermark" aria-hidden="true">
        CIMAGE
      </div>

      <Reveal className="relative z-[1] px-5 text-center">
        <h2 className="mu-serif text-[2rem] leading-[1.12] text-white sm:text-[3rem]">
          {v.display}
          <br />
          <span className="italic mu-gradient-text">{v.displayAccent}</span>
        </h2>
      </Reveal>

      <div
        className="mu-voices-stage"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {stories.map((s, i) => {
          const offset = i - active;
          const isActive = offset === 0;
          const hidden = Math.abs(offset) > 2;
          const playKey = s.youtube || s.video;
          const playingThis = isActive && playingId !== null && playingId === playKey;
          return (
            <div
              key={i}
              className={`mu-voices-card${isActive ? " is-active" : ""}`}
              style={cardStyle(offset)}
              aria-hidden={hidden}
              role={isActive ? "group" : "button"}
              tabIndex={isActive || hidden ? -1 : 0}
              aria-label={isActive ? undefined : `Show ${s.name}'s story`}
              onClick={isActive ? undefined : () => select(i)}
              onKeyDown={
                isActive
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select(i);
                      }
                    }
              }
            >
              <div className="mu-voices-screen">
                {playingThis ? (
                  s.youtube ? (
                    <iframe
                      className="mu-voices-iframe"
                      src={`https://www.youtube.com/embed/${s.youtube}?autoplay=1&rel=0&modestbranding=1`}
                      title={`${s.name} — alumni video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      className="mu-voices-iframe mu-voices-video"
                      src={s.video}
                      poster={s.thumb}
                      controls
                      autoPlay
                      playsInline
                    />
                  )
                ) : (
                  <>
                    <Image
                      src={s.thumb}
                      alt={s.name}
                      fill
                      sizes="(max-width:1024px) 80vw, 900px"
                      className="mu-voices-img"
                    />
                    <div className="mu-voices-tint" />

                    {isActive && (
                      <button
                        type="button"
                        className="mu-voices-play"
                        aria-label={`Watch ${s.name}'s video`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (s.youtube || s.video) setPlayingId(s.youtube || s.video);
                        }}
                      >
                        <span className="mu-voices-disc">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#090909" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        <span className="mu-voices-watch">Watch Video</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {isActive && !playingThis && (
                <>
                  <div className="mu-voices-plate mu-voices-plate-name">
                    <div>
                      <span className="mu-voices-pname">{s.name}</span>
                      <span className="mu-voices-pbatch">{s.batch}</span>
                    </div>
                    <span className="mu-voices-scribble" aria-hidden="true" />
                  </div>

                  <div className="mu-voices-plate mu-voices-plate-company">
                    <span className="mu-voices-plabel">{s.place}</span>
                    {s.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.logo} alt={s.company} className="mu-voices-logo" />
                    ) : (
                      <span className="mu-voices-company">{s.company}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mu-voices-controls">
        <button
          className="mu-prog-arrow-btn"
          onClick={() => go(-1)}
          disabled={active === 0}
          aria-label="Previous story"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mu-voices-dots" role="tablist" aria-label="Alumni stories">
          {stories.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to story ${i + 1}`}
              className={`mu-voices-dot${i === active ? " is-active" : ""}`}
              onClick={() => select(i)}
            />
          ))}
        </div>

        <button
          className="mu-prog-arrow-btn"
          onClick={() => go(1)}
          disabled={active === LAST}
          aria-label="Next story"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
