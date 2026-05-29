import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { copy } from "@/lib/copy";

export default function Stack() {
  return (
    <section className="relative bg-neutral-950 py-16 sm:py-20 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(245,165,36,0.06),_transparent_50%)]" />
      <div className="mx-auto max-w-6xl relative">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Chapter 03
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">
            {copy.stack.display}
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{copy.stack.sub}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 [perspective:1200px]">
          {copy.stack.pillars.map((pillar, i) => (
            <Reveal key={pillar.name} delay={i * 0.05}>
              <TiltCard className="relative aspect-[5/4] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(245,165,36,0.06),_transparent_55%)]" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(pillar as { logo?: string }).logo}
                        alt={pillar.name}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="mt-6 sm:mt-7">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {pillar.name}
                    </div>
                    <div className="mt-1 text-[11px] sm:text-xs text-neutral-500 uppercase tracking-wider">
                      {pillar.hint}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <p className="text-neutral-500 italic">{copy.stack.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
