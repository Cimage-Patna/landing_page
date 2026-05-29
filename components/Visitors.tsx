"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

type Guest = { name: string; role: string; photo?: string; credit?: string };

const GRADIENTS = [
  "from-amber-500/35",
  "from-indigo-500/35",
  "from-rose-500/35",
  "from-emerald-500/35",
  "from-sky-500/35",
  "from-fuchsia-500/35",
];

const HONORIFICS = new Set(["dr.", "shri", "smt.", "mr.", "ms.", "prof."]);

function initials(name: string) {
  const words = name
    .replace(/\./g, ". ")
    .split(/\s+/)
    .filter((w) => w && !HONORIFICS.has(w.toLowerCase()) && /[A-Za-z]/.test(w));
  const picked = words.slice(0, 2).map((w) => w[0].toUpperCase());
  return picked.join("") || name.slice(0, 1).toUpperCase();
}

const GUESTS: Guest[] = copy.visitors.items.map((g) => ({
  name: g.name,
  role: g.role,
  photo: (g as { photo?: string }).photo,
  credit: (g as { credit?: string }).credit,
}));

const variants = {
  enter: { scale: 0.92, y: 18, opacity: 0 },
  center: { scale: 1, y: 0, x: 0, rotate: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir * 540,
    rotate: dir * 14,
    opacity: 0,
    transition: { duration: 0.32 },
  }),
};

export default function Visitors() {
  const n = GUESTS.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  function go(d: number) {
    setDir(d);
    setIndex((i) => (i + d + n) % n);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 90 || info.velocity.x > 500) go(1);
    else if (info.offset.x < -90 || info.velocity.x < -500) go(-1);
  }

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-black py-14 sm:py-20">
      <div className="px-6">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            {copy.visitors.eyebrow}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-500 sm:text-base">
            {copy.visitors.sub}
          </p>
        </Reveal>
      </div>

      {/* Swipe deck */}
      <div className="relative mx-auto mt-10 h-[430px] w-[290px] sm:h-[460px] sm:w-[320px]">
        {/* depth cards behind */}
        {[2, 1].map((o) => {
          const g = GUESTS[(index + o) % n];
          return (
            <div
              key={o}
              className="absolute inset-0"
              style={{ transform: `scale(${1 - o * 0.05}) translateY(${o * 16}px)`, zIndex: 10 - o }}
            >
              <Card guest={g} idx={(index + o) % n} dim />
            </div>
          );
        })}

        {/* top draggable card */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            whileTap={{ cursor: "grabbing" }}
            className="absolute inset-0 z-20 cursor-grab touch-pan-y"
          >
            <Card guest={GUESTS[index]} idx={index} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls + counter */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous guest"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="text-xs tabular-nums text-neutral-500">
          {index + 1} / {n}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next guest"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </section>
  );
}

function Card({ guest, idx, dim }: { guest: Guest; idx: number; dim?: boolean }) {
  return (
    <div
      className={`relative h-full w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]} to-neutral-900 shadow-2xl ${dim ? "opacity-60" : ""}`}
    >
      {guest.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={guest.photo}
          alt={guest.name}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        // No free photo available → fall back to a monogram.
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-[7rem] font-black text-white/10">
            {initials(guest.name)}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-2xl font-bold leading-tight text-[#fff]">
          {guest.name}
        </h3>
        <p className="mt-1 text-sm text-[#e5e5e5]">{guest.role}</p>
        {guest.credit && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-white/35">
            Photo: {guest.credit}
          </p>
        )}
      </div>
    </div>
  );
}
