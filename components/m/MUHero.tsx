import Image from "next/image";
import { copy } from "@/lib/copy";
import { asset } from "@/lib/assets";
import { ADMISSION_PHONES } from "@/lib/contact";
import { Arrow } from "./ui";

/* Exact replica of Masters' Union's homeHeroSection:
   100vh, black, full-bleed background media + dark overlay, and a
   bottom-anchored overlay (bottom:80px) holding a big stacked heading
   (go-regular sans with one word in Fraunces italic), a button row,
   and an accreditation logo strip (muHeroLogos). */
export default function MUHero() {
  const h = copy.hero;
  const logos = copy.awards.items;

  return (
    <section id="top" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#090909]">
      {/* full-bleed background media */}
      <Image
        src={asset("/gp.png")}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* cinematic dark overlay so the heading reads in white — heavier at the
         bottom where the stacked headline sits, plus a left scrim for copy. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,9,9,0.6) 0%, rgba(9,9,9,0.3) 30%, rgba(9,9,9,0.78) 66%, rgba(9,9,9,0.96) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(9,9,9,0.7) 0%, rgba(9,9,9,0.2) 45%, transparent 75%)",
        }}
      />

      {/* bottom-anchored overlay (MU .overlayHero — bottom:80px) */}
      <div className="absolute inset-x-0 bottom-12 z-10 sm:bottom-16 lg:bottom-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fad133]" />
            {copy.apply.infoEyebrow}
          </p>

          {/* stacked heading — go-regular sans, accent word in Fraunces italic */}
          <h1
            className="font-[400] leading-[0.95] text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
          >
            <span className="block text-[15vw] sm:text-[11vw] lg:text-[128px]">Mummy,</span>
            <span className="mu-serif block text-[15vw] italic text-[#fad133] sm:text-[11vw] lg:text-[128px]">
              job lag
            </span>
            <span className="block text-[15vw] sm:text-[11vw] lg:text-[128px]">gaya.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/75 sm:text-[18px]">
            {h.sub}
          </p>

          {/* button row (MU .heroRightButtons) */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#apply" className="mu-btn mu-btn-yellow">
              {h.cta}
              <Arrow />
            </a>
            <a
              href={`tel:${ADMISSION_PHONES[0].dial}`}
              className="mu-btn !border-white/40 !bg-white/5 !text-white backdrop-blur-sm hover:!bg-white/15"
            >
              {h.counsellorCta}
            </a>
          </div>

          {/* accreditation logo strip (MU .muHeroLogos) */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            {logos.map((l) => (
              <Image
                key={l.name}
                src={l.logo}
                alt={l.name}
                title={l.name}
                width={88}
                height={36}
                className="h-9 w-auto object-contain opacity-90"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
