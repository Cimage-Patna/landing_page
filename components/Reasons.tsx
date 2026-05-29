import Image from "next/image";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { copy } from "@/lib/copy";

export default function Reasons() {
  return (
    <section className="relative bg-black py-16 sm:py-20 px-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-400/[0.04] blur-3xl" />
      <div className="mx-auto max-w-6xl relative">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            {copy.reasons.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">
            {copy.reasons.display}
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{copy.reasons.sub}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 [perspective:1200px]">
          {copy.reasons.items.map((r, i) => {
            const img = (r as { image?: string }).image;
            const contain = (r as { imageContain?: boolean }).imageContain;
            return (
              <Reveal key={r.title} delay={i * 0.04}>
                <TiltCard
                  intensity={6}
                  className="relative h-full min-h-[200px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,_rgba(245,165,36,0.07),_transparent_55%)]" />
                  <div className="relative flex h-full flex-col">
                    {img && (
                      <div
                        className={`relative h-48 w-full overflow-hidden sm:h-56 ${
                          contain ? "bg-white" : ""
                        }`}
                      >
                        <Image
                          src={img}
                          alt={r.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={contain ? "object-contain p-3" : "object-cover"}
                        />
                        {!contain && (
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/10 to-transparent" />
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <span className="font-display text-3xl font-black text-amber-400/30">
                        {r.glyph}
                      </span>
                      <h3 className="mt-6 font-display text-lg font-bold leading-tight text-white sm:text-xl">
                        {r.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-400">
                        {r.body}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-12">
          <p className="text-neutral-500 italic max-w-3xl">{copy.reasons.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
