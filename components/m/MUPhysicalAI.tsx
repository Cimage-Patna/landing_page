"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import LazyVideo from "@/components/LazyVideo";
import { asset } from "@/lib/assets";
import { Reveal } from "./ui";

/* MU-styled port of the "/" PhysicalAI section: a parallax robot-arm video
   background (Addverb Syncro arm) with centred copy. Reuses the shared,
   bandwidth-friendly LazyVideo; typography follows the MU sections. */

const CAPABILITIES = ["Robot programming", "Computer vision", "Motion planning", "Autonomy"];

export default function MUPhysicalAI() {
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
        <LazyVideo src={asset("/arm.mp4")} className="h-full w-full object-cover" />
      </motion.div>

      {/* Legibility overlays over the footage. */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/45" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/65">
            AI &amp; Robotics
          </p>
          <h2 className="mt-5 text-[2.3rem] font-semibold leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-[3.3rem]">
            Where AI gets a <span className="mu-serif font-normal italic">body</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#e5e5e5] drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)] sm:text-[16px]">
            You won&apos;t just write code on a screen here. Students get real hands-on time with
            Addverb&apos;s six-axis Syncro arm, programming an actual industrial robot on campus instead
            of a simulation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {CAPABILITIES.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[12.5px] text-white/80 backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
