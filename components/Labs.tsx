import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function Labs() {
  const blocks = copy.labs.blocks;

  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Chapter 04
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-black text-white sm:text-6xl">
            {copy.labs.display}
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">{copy.labs.sub}</p>
        </Reveal>

        {/* Certificates — angled, overlapping mounted documents */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center justify-center gap-12 sm:mt-20 sm:flex-row sm:gap-0">
            {blocks.map((b, i) => (
              <figure
                key={b.title}
                className={`group relative w-full max-w-[330px] transition-transform duration-500 hover:z-20 sm:hover:!rotate-0 sm:hover:!translate-x-0 sm:hover:!translate-y-0 ${
                  i === 0
                    ? "sm:z-10 sm:translate-x-8 sm:translate-y-3 sm:rotate-[-4deg]"
                    : "sm:-translate-x-8 sm:-translate-y-3 sm:rotate-[4deg]"
                }`}
              >
                {/* soft glow on hover */}
                <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-amber-400/10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                {/* the certificate, mounted on a white mat */}
                <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.title}
                    className="block h-auto w-full"
                  />
                </div>

                {/* floating badge */}
                <figcaption className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-400/30 bg-black/90 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-amber-400 backdrop-blur">
                  {b.badge}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
