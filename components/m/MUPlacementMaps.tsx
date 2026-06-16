import { copy } from "@/lib/copy";
import MUBiharMosaic from "./MUBiharMosaic";
import MUGlobalAlumni from "./MUGlobalAlumni";
import { Reveal } from "./ui";

/* Fuses the two placement maps into one section — a single shared header and a
   continuous gold glow over both. The maps drop their own headers/backgrounds
   and sit side-by-side on desktop (full width), stacked on mobile. */
export default function MUPlacementMaps() {
  return (
    <section className="mu-maps">
      <div className="mu-maps-glow" aria-hidden="true" />

      <Reveal className="relative z-[1] mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#fad133]">
          Our placed students
        </p>
        <h2 className="mt-4 text-[2.1rem] font-semibold leading-[1.1] text-white sm:text-[3rem]">
          Bihar&apos;s talent, <span className="mu-serif italic mu-gradient-text">placed</span> — across the world.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-white/55">
          {copy.alumni.sub}
        </p>
      </Reveal>

      <div className="mu-maps-pair">
        <MUBiharMosaic hideHeader />
        <MUGlobalAlumni hideHeader />
      </div>
    </section>
  );
}
