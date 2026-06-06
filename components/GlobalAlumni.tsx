"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";
import { asset } from "@/lib/assets";

// Matches the section background in BOTH themes (#0a0a0a dark / #f5f5f4 light),
// so the edge fades are invisible — no shadow in light mode.
const BG = "var(--page-bg-2)";

export default function GlobalAlumni() {
  const patna = copy.alumni.patna;

  function arcPath(fromX: number, fromY: number, toX: number, toY: number) {
    const midX = (fromX + toX) / 2;
    const lift = Math.max(12, Math.abs(toX - fromX) * 0.25);
    const midY = Math.min(fromY, toY) - lift;
    return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
  }

  return (
    <section
      className="relative overflow-hidden pb-4 pt-2 sm:pb-6 sm:pt-4"
      style={{ backgroundColor: BG }}
    >
      {/* Bridge caption — ties the faces above into the world map below, so the
          two read as one story instead of two stacked sections. */}
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            And now — across the world
          </p>
          <h3 className="mt-2 font-display text-3xl sm:text-5xl font-black text-white">
            {copy.alumni.display}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-400">{copy.alumni.sub}</p>
        </Reveal>
      </div>

      {/* Map — edge-to-edge. The map + pins live in a fixed 16:9 box (matching
          the image) so pins stay locked to cities; the strip just clips it
          thinner on desktop. */}
      <Reveal delay={0.1}>
        <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden sm:mt-6 sm:aspect-[3/1]">
          {/* 16:9 map layer, vertically centered in the strip */}
          <div className="absolute left-0 top-1/2 aspect-[16/9] w-full -translate-y-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/alumni/world-map.webp")}
              alt=""
              aria-hidden="true"
              data-themed="world-map"
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.04),_transparent_70%)]" />
          {/* Theme-matched edge fades (invisible against the section bg) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${BG} 0%, transparent 18%, transparent 82%, ${BG} 100%)` }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to right, ${BG} 0%, transparent 12%, transparent 88%, ${BG} 100%)` }}
          />

          {/* 16:9 pin/arc layer, same geometry as the map layer → aligned */}
          <div className="absolute left-0 top-1/2 aspect-[16/9] w-full -translate-y-1/2">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(245,165,36,0.05)" />
                  <stop offset="50%" stopColor="rgba(245,165,36,0.85)" />
                  <stop offset="100%" stopColor="rgba(245,165,36,0.2)" />
                </linearGradient>
              </defs>
              {copy.alumni.pins.map((p, i) => (
                <motion.path
                  key={p.city}
                  d={arcPath(patna.x, patna.y, p.x, p.y)}
                  stroke="url(#arcGrad)"
                  strokeWidth={0.4}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 5,
                    times: [0, 0.32, 0.78, 1],
                    ease: [0.22, 1, 0.36, 1],
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    // Equal duration+repeatDelay across arcs keeps the stagger
                    // offset stable on every loop, not just the first pass.
                    delay: 0.3 + i * 0.15,
                  }}
                />
              ))}
            </svg>

            {/* Patna source pin */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${patna.x}%`, top: `${patna.y}%` }}
            >
              <span className="absolute inset-0 -m-4 rounded-full bg-amber-400/20 animate-ping" />
              <span className="relative block h-3 w-3 rounded-full bg-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_18px_rgba(245,165,36,1)]" />
              <div className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-amber-400">
                Patna
              </div>
            </div>

            {/* Destination pins */}
            {copy.alumni.pins.map((p, i) => (
              <motion.div
                key={p.city}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ delay: 1.6 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="absolute inset-0 -m-3 rounded-full bg-amber-400/30 animate-ping" />
                <span className="relative block h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(245,165,36,0.9)]" />
                <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[11px] text-white">
                  {p.city}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
