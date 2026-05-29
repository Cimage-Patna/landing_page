import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function Recruiters() {
  const doubled = [...copy.recruiters.items, ...copy.recruiters.items];

  return (
    <section className="relative bg-neutral-950 py-12 px-6 border-y border-white/5 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            {copy.recruiters.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-neutral-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-neutral-950 to-transparent" />

            <div className="overflow-hidden">
              <div className="flex gap-4 marquee-track">
                {doubled.map((r, i) => (
                  <div
                    key={`${r.name}-${i}`}
                    className="shrink-0 w-40 sm:w-48 h-16 sm:h-20 grid place-items-center px-4 opacity-80 transition-opacity duration-300 hover:opacity-100"
                    title={r.name}
                  >
                    <div className="relative w-full h-full">
                      {/* White mark on dark theme */}
                      <Image
                        src={r.logoWhite}
                        alt={r.name}
                        fill
                        sizes="200px"
                        data-themed="logo-white"
                        className="object-contain"
                      />
                      {/* Full-colour logo on light theme */}
                      <Image
                        src={r.logo}
                        alt={r.name}
                        fill
                        sizes="200px"
                        data-themed="logo-color"
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-xs text-neutral-500">
            and {copy.recruiters.extras.join(" · ")}
          </p>
        </Reveal>
      </div>

      <style>{`
        .marquee-track {
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
