"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function StarPlacements() {
  const { eyebrow, display, sub, students } = copy.starPlacements;

  return (
    <section className="relative overflow-hidden pt-16 pb-6 sm:pt-20" style={{ backgroundColor: "var(--page-bg-2)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">{eyebrow}</p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">{display}</h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{sub}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {students.map((s, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                <Image
                  src={s.img}
                  alt={`${s.name} — CIMAGE alumnus placed at ${s.company}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center opacity-95 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                />

                {/* Top badge: package where available, otherwise the placement location */}
                <div className="absolute inset-x-0 top-0 p-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-semibold text-white/90">
                      {"package" in s && s.package ? s.package : "location" in s ? s.location : s.company}
                    </span>
                  </span>
                </div>

                {/* Bottom gradient with name + company/role */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
                  <p className="text-sm font-bold leading-tight text-white">{s.name}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-amber-300/90">
                    {s.company}
                    {"role" in s && s.role ? ` · ${s.role}` : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-neutral-400">
                    {[("course" in s && s.course) || null, ("location" in s && s.location) || ("district" in s && s.district) || null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
