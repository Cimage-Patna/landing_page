"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

type ReelItem = { name: string; cover: string; video: string };

export default function Reels() {
  const reels = copy.reels;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section className="bg-neutral-950 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl font-black text-white sm:text-5xl">
            {reels.title}
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-400">{reels.sub}</p>
        </Reveal>

        {/* Story bar — horizontally scrollable circular covers */}
        <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2 sm:gap-5">
          {reels.items.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setIndex(i); setOpen(true); }}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <span className="rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-fuchsia-600 p-[3px] transition-transform group-hover:scale-[1.03]">
                <span className="block rounded-[15px] bg-neutral-950 p-[3px]">
                  <span className="relative block aspect-[9/16] w-36 overflow-hidden rounded-xl sm:w-44">
                    <Image
                      src={r.cover}
                      alt={r.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover"
                    />
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
  const [muted, setMuted] = useState(true);

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
    if (v) v.play().catch(() => {});
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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-sm"
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
            className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            {muted ? <MuteIcon /> : <SoundIcon />}
          </button>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
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
