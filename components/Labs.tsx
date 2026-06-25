import Reveal from "./Reveal";
import ZoomableImage from "./ZoomableImage";
import { copy } from "@/lib/copy";

export default function Labs() {
  const blocks = copy.labs.blocks;

  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Partnerships
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-black text-white sm:text-6xl">
            {copy.labs.display}
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{copy.labs.sub}</p>
        </Reveal>

        {/* Clean grid — no tilt, no hover motion. Certificate, then meta. */}
        <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="flex flex-col">
                <ZoomableImage src={b.image} alt={b.title}>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt={b.title}
                      className="block h-auto w-full"
                    />
                  </div>
                </ZoomableImage>
                <div className="mt-5">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {b.body}
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
