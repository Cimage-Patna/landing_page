"use client";

import { motion } from "motion/react";
import { copy } from "@/lib/copy";
import { asset } from "@/lib/assets";
import { Reveal } from "./ui";

/* MU-styled port of the "/" GlobalAlumni: a world-map strip with arcs animating
   from Patna out to the cities where CIMAGE alumni are placed. Dark immersive
   band (flows out of the Bihar mosaic above) with MU-gold arcs + pins. */

const BG = "#080808";
const GOLD = "250, 209, 51"; // --mu-yellow as rgb

export default function MUGlobalAlumni({ hideHeader = false }: { hideHeader?: boolean }) {
  const patna = copy.alumni.patna;

  function arcPath(fromX: number, fromY: number, toX: number, toY: number) {
    const midX = (fromX + toX) / 2;
    const lift = Math.max(12, Math.abs(toX - fromX) * 0.25);
    const midY = Math.min(fromY, toY) - lift;
    return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
  }

  return (
    <section
      className="relative overflow-hidden pb-10 pt-6 sm:pb-14 sm:pt-8"
      style={{ backgroundColor: hideHeader ? "transparent" : BG }}
    >
      {!hideHeader && (
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#fad133]">
              And now — across the world
            </p>
            <h3 className="mt-3 text-[1.9rem] font-semibold leading-[1.1] text-white sm:text-[2.8rem]">
              Where the alumni <span className="mu-serif italic mu-gradient-text">went.</span>
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] text-white/55 sm:text-[16px]">{copy.alumni.sub}</p>
          </Reveal>
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mu-global-strip relative mt-6 aspect-[16/9] w-full overflow-hidden sm:mt-8 sm:aspect-[3/1]">
          <div className="absolute left-0 top-1/2 aspect-[16/9] w-full -translate-y-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/alumni/world-map.webp")}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
          </div>

          <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 50% 45%, rgba(${GOLD},0.07), transparent 62%)` }} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${BG} 0%, transparent 18%, transparent 82%, ${BG} 100%)` }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to right, ${BG} 0%, transparent 12%, transparent 88%, ${BG} 100%)` }}
          />

          <div className="absolute left-0 top-1/2 aspect-[16/9] w-full -translate-y-1/2">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="muArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={`rgba(${GOLD},0.05)`} />
                  <stop offset="50%" stopColor={`rgba(${GOLD},0.9)`} />
                  <stop offset="100%" stopColor={`rgba(${GOLD},0.2)`} />
                </linearGradient>
              </defs>
              {copy.alumni.pins.map((p, i) => (
                <motion.path
                  key={p.city}
                  d={arcPath(patna.x, patna.y, p.x, p.y)}
                  stroke="url(#muArcGrad)"
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
                    delay: 0.3 + i * 0.15,
                  }}
                />
              ))}
            </svg>

            {/* Patna source pin */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${patna.x}%`, top: `${patna.y}%` }}>
              <span className="absolute inset-0 -m-4 rounded-full animate-ping" style={{ background: `rgba(${GOLD},0.2)` }} />
              <span
                className="relative block h-3 w-3 rounded-full"
                style={{ background: "#fad133", boxShadow: `0 0 18px rgba(${GOLD},1)`, outline: `2px solid rgba(${GOLD},0.3)` }}
              />
              <div className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-[#fad133]">
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
                <span className="absolute inset-0 -m-3 rounded-full animate-ping" style={{ background: `rgba(${GOLD},0.3)` }} />
                <span className="relative block h-2.5 w-2.5 rounded-full" style={{ background: "#fad133", boxShadow: `0 0 14px rgba(${GOLD},0.9)` }} />
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
