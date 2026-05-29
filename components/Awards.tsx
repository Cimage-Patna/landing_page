import { copy } from "@/lib/copy";
import Reveal from "./Reveal";

export default function Awards() {
  const doubled = [...copy.awards.items, ...copy.awards.items];

  return (
    <section className="relative bg-black py-14 border-y border-white/5 overflow-hidden">
      <Reveal>
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-amber-400/80 px-6">
          {copy.awards.display}
        </p>
      </Reveal>

      <div className="mt-6 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        <div className="overflow-hidden">
          <div className="flex gap-3 awards-track">
            {doubled.map((a, i) => (
              <span
                key={`${a}-${i}`}
                className="shrink-0 text-xs sm:text-sm text-neutral-300 border border-white/10 bg-white/[0.02] rounded-full px-5 py-2 whitespace-nowrap"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .awards-track {
          width: max-content;
          animation: awardsScroll 50s linear infinite;
        }
        .awards-track:hover {
          animation-play-state: paused;
        }
        @keyframes awardsScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .awards-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
