"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function CampusLife() {
  const [active, setActive] = useState(0);
  const events = copy.campus.events;

  return (
    <section className="relative bg-black py-16 sm:py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Campus Life
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">
            {copy.campus.display}
          </h2>
          <p className="mt-4 max-w-2xl text-white">{copy.campus.sub}</p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Horizontal accordion (desktop) → vertical accordion (mobile) */}
          <div className="mt-12 flex flex-col gap-2 md:h-[460px] md:flex-row md:gap-3">
            {events.map((e, i) => {
              const on = active === i;
              return (
                <button
                  key={e.name}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  className={[
                    "group relative overflow-hidden rounded-2xl border border-white/10 text-left outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-amber-400/60",
                    "md:h-full",
                    on ? "h-80 md:flex-[5]" : "h-16 md:flex-[1]",
                  ].join(" ")}
                >
                  <Image
                    src={e.image}
                    alt={e.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                  {/* base gradient + extra dim when collapsed */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div
                    className={`pointer-events-none absolute inset-0 bg-black/40 transition-opacity duration-500 ${
                      on ? "opacity-0" : "opacity-100"
                    }`}
                  />

                  {/* Vertical label — desktop, collapsed only */}
                  <span
                    className={`pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-lg font-bold text-[#fff] drop-shadow [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 md:block ${
                      on ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {e.name}
                  </span>

                  {/* Horizontal content — active (desktop) + all mobile */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 sm:p-6 ${
                      on ? "opacity-100" : "opacity-100 md:opacity-0"
                    }`}
                  >
                    <span className="mb-2 hidden h-1 w-8 rounded-full bg-amber-400 md:block" />
                    <h3 className="font-display text-xl font-bold text-[#fff] drop-shadow sm:text-2xl">
                      {e.name}
                    </h3>
                    <p
                      className={`mt-1 max-w-sm text-sm leading-relaxed text-[#fff] transition-all duration-300 ${
                        on
                          ? "max-h-24 opacity-100"
                          : "max-h-0 overflow-hidden opacity-0 md:opacity-0"
                      }`}
                    >
                      {e.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-white max-w-3xl leading-relaxed">
            {copy.campus.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
