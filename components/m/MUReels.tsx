"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { Reveal } from "./ui";

/* MU-styled port of the "/" Reels: a story-bar of circular reel covers that open
   a full-screen vertical reel viewer. Uses explicit dark colours (not theme
   utilities) so it stays dark under .mu-root, plus the MU gradient story ring. */

type ReelItem = { name: string; cover: string; video: string };

export default function MUReels() {
  const reels = copy.reels;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-[#090909] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="text-[2.1rem] font-semibold leading-[1.1] text-white sm:text-[3rem]">
            Life at CIMAGE, <span className="mu-serif italic mu-gradient-text">in reels</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] text-white/55">{reels.sub}</p>
        </Reveal>

        {/* Story bar — horizontally scrollable circular covers */}
        <div className="mu-no-scrollbar mt-9 flex gap-4 overflow-x-auto pb-2 sm:gap-5">
          {reels.items.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <span
                className="rounded-2xl p-[3px] transition-transform group-hover:scale-[1.03]"
                style={{ background: "var(--mu-gradient)" }}
              >
                <span className="block rounded-[15px] bg-[#090909] p-[3px]">
                  <span className="relative block aspect-[9/16] w-36 overflow-hidden rounded-xl sm:w-44">
                    <ReelCover r={r} active={i === 1} muteInline={open} />
                    <span className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlayIcon />
                    </span>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <ReelViewer
          items={reels.items}
          index={index}
          setIndex={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}

function ReelViewer({
  items, index, setIndex, onClose,
}: {
  items: ReelItem[];
  index: number;
  setIndex: (updater: (prev: number) => number) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchY = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false); // start unmuted

  const go = (d: number) =>
    setIndex((prev) => {
      const n = prev + d;
      if (n < 0) return 0;
      if (n >= items.length) { onClose(); return prev; }
      return n;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProgress(0);
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Browsers block unmuted autoplay before a user gesture — fall back to
      // muted so the reel still plays; one tap on the speaker unmutes it.
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [index]);

  const cur = items[index];

  function onTouchStart(e: React.TouchEvent) { touchY.current = e.touches[0].clientY; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dy) > 60) go(dy < 0 ? 1 : -1);
    touchY.current = null;
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(0,0,0,0.95)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative h-[100svh] w-full overflow-hidden bg-black sm:aspect-[9/16] sm:h-[92vh] sm:w-auto sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Progress bars */}
        <div className="absolute inset-x-0 top-0 z-30 flex gap-1 p-2.5">
          {items.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{ width: i < index ? "100%" : i === index ? `${progress}%` : "0%" }}
              />
            </div>
          ))}
        </div>

        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          key={index}
          src={cur.video}
          poster={cur.cover}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          onEnded={() => go(1)}
          className="h-full w-full object-cover"
        />

        {/* Tap zones: left prev · center play/pause · right next */}
        <button aria-label="Previous reel" className="absolute left-0 top-0 z-10 h-full w-1/3" onClick={() => go(-1)} />
        <button aria-label="Play or pause" className="absolute left-1/3 top-0 z-10 h-full w-1/3" onClick={togglePlay} />
        <button aria-label="Next reel" className="absolute right-0 top-0 z-10 h-full w-1/3" onClick={() => go(1)} />

        {/* Top-right controls */}
        <div className="absolute right-2.5 top-2.5 z-40 flex translate-y-3 gap-2">
          <button
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
            className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(0,0,0,0.5)] text-white backdrop-blur transition hover:bg-[rgba(0,0,0,0.7)]"
          >
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(0,0,0,0.5)] text-white backdrop-blur transition hover:bg-[rgba(0,0,0,0.7)]"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Story-bar cover that plays its reel inline (muted loop) only while it's in
   view, and pauses when scrolled away. Tapping it (via the parent button) opens
   the full-screen viewer, where sound is allowed because the tap is a gesture. */
function ReelCover({ r, active, muteInline }: { r: ReelItem; active: boolean; muteInline: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  // While the full-screen viewer is open, mute the inline reel so its audio
  // doesn't play over the viewer's; restore sound once the viewer closes.
  useEffect(() => {
    if (!active) return;
    const v = ref.current;
    if (!v) return;
    v.muted = muteInline;
  }, [active, muteInline]);

  useEffect(() => {
    if (!active) return;
    const v = ref.current;
    if (!v) return;

    let onGesture: (() => void) | null = null;
    const playWithAudio = () => {
      v.muted = false;
      v.play().catch(() => {
        // Browser blocked unmuted autoplay — play muted now, then unmute the
        // moment the visitor taps/clicks/keys anywhere on the page.
        v.muted = true;
        v.play().catch(() => {});
        if (!onGesture) {
          onGesture = () => {
            v.muted = false;
            v.play().catch(() => {});
            document.removeEventListener("pointerdown", onGesture!);
            document.removeEventListener("keydown", onGesture!);
            onGesture = null;
          };
          document.addEventListener("pointerdown", onGesture);
          document.addEventListener("keydown", onGesture);
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) playWithAudio();
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      if (onGesture) {
        document.removeEventListener("pointerdown", onGesture);
        document.removeEventListener("keydown", onGesture);
      }
    };
  }, [active]);

  // Only the active (2nd) reel plays inline; the rest are static covers.
  if (!active) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={r.cover} alt={r.name} className="h-full w-full object-cover" />;
  }
  return (
    <video
      ref={ref}
      src={r.video}
      poster={r.cover}
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
    />
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white drop-shadow" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M23 9l-6 6M17 9l6 6" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
