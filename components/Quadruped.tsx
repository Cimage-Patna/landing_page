"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Reveal from "./Reveal";
import LazyVideo from "./LazyVideo";
import { asset } from "@/lib/assets";

export default function Quadruped() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Background drifts slower than the page → parallax depth.
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-black px-6 py-16 sm:min-h-[620px] sm:py-20"
    >
      {/* ── Parallax video background (adverb_bot.mp4) ─────────────────── */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%]"
      >
        <LazyVideo src={asset("/adverb_bot.mp4")} className="h-full w-full object-cover" />
      </motion.div>

      {/* Legibility overlay over the footage (kept light) */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/45" />

      {/* ── Copy ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#a3a3a3]">
            Robotics on Campus
          </p>
          <h2 className="mt-4 font-display text-5xl font-black text-[#fff] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-6xl">
            The robots walk among us.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#e5e5e5] drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">
            Meet Addverb&apos;s quadruped robot — a four-legged machine that
            walks, balances and finds its own way across the floor. On campus,
            students program real locomotion and perception on actual hardware,
            not a simulation.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
