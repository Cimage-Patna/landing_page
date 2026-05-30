import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function Trust() {
  return (
    <section className="relative bg-neutral-950 py-16 sm:py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Proof
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">
            {copy.trust.display}
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{copy.trust.sub}</p>
        </Reveal>

        <div className="mt-12 -mx-6 px-6 overflow-x-auto sm:overflow-visible no-scrollbar">
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 snap-x snap-mandatory">
            {copy.trust.testimonials.map((t, i) => (
              <Reveal key={t.photo} delay={i * 0.05}>
                <figure className="min-w-[78vw] sm:min-w-0 snap-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-square w-full bg-black">
                    <Image
                      src={t.photo}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 78vw, 33vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_transparent_55%,_rgba(0,0,0,0.6)_100%)]" />
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <blockquote className="text-white text-[15px] sm:text-base leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-5 pt-4 border-t border-white/5 text-xs text-neutral-500">
                      {t.meta}
                    </div>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
