import { BRANDS } from "./brandLogos";

/* "Our Alumni work at" — three logo rows scrolling in alternating directions
   with white edge-fades (adapted from the upGrad marquee). Driven by the
   monochrome CIMAGE-recruiter glyphs in brandLogos.ts. Pure CSS animation, so
   this stays a server component. */

const ALL = Object.values(BRANDS);

// Rotate the list so each row starts somewhere different and the three don't
// read as identical.
function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

const ROWS = [
  { dir: "left", items: rotate(ALL, 0) },
  { dir: "right", items: rotate(ALL, 4) },
  { dir: "left", items: rotate(ALL, 8) },
] as const;

export default function MUAlumniWall() {
  return (
    <section className="mu-alumni-wall overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 text-center sm:px-8">
        <h2 className="text-[2.1rem] font-semibold leading-[1.1] text-[#090909] sm:text-[3rem]">
          Our <span className="mu-serif font-normal italic">alumni</span> work at
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] text-[#525252] sm:text-[17px]">
          CIMAGE graduates are placed across TCS, Wipro, Accenture, ICICI and 500+ companies —
          from Patna to Dubai, London, Zurich and beyond.
        </p>
      </div>

      <div className="mt-10 space-y-5 sm:mt-14 sm:space-y-6">
        {ROWS.map((row, ri) => {
          const loop = [...row.items, ...row.items];
          return (
            <div key={ri} className="mu-aw-row">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
              <div className={`mu-aw-track ${row.dir}`}>
                {loop.map((b, i) => (
                  <div key={`${b.name}-${i}`} className="mu-aw-logo" title={b.name}>
                    <svg viewBox={b.vb} role="img" aria-label={b.name} fill="currentColor">
                      <path d={b.d} />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
