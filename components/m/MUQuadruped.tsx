"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import LazyVideo from "@/components/LazyVideo";
import { asset } from "@/lib/assets";
import { Reveal } from "./ui";

/* MU-styled port of the "/" Quadruped section: a parallax robot-dog video
   background (Addverb quadruped) with centred copy. Reuses the shared
   LazyVideo; typography follows the MU sections. */

export default function MUQuadruped() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Background drifts slower than the page → parallax depth.
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-black px-5 py-20 sm:min-h-[640px] sm:px-8 sm:py-28"
    >
      <motion.div style={{ y }} className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%]">
        <LazyVideo src={asset("/adverb_bot.mp4")} className="h-full w-full object-cover" />
      </motion.div>

      {/* Legibility overlays over the footage. */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/50" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/65">
            Robotics on Campus
          </p>
          <h2 className="mt-5 text-[2.3rem] font-semibold leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-[3.3rem]">
            The robots <span className="mu-serif font-normal italic">walk among us</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#e5e5e5] drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-[16px]">
            Meet Addverb&apos;s quadruped robot — a four-legged machine that walks, balances and finds
            its own way across the floor. On campus, students program real locomotion and perception on
            actual hardware, not a simulation.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
