"use client";

import HeroVideo from "./HeroVideo";
import HeroBadges from "./HeroBadges";
// Disabled while the video background is active — re-add to the stack to bring back.
// import ParticleField from "./ParticleField";
// import IsometricLab from "./IsometricLab";
// import HeroStudent from "./HeroStudent";
import { copy } from "@/lib/copy";

// The hero sits over a video that never changes with theme, so its text must
// stay light in BOTH themes. Arbitrary color classes (and the inline-style
// gradient below) are used deliberately so the light-theme overrides in
// globals.css — which flip text-white / from-black to dark/light — can't touch it.
const SHADOW_STRONG = "[text-shadow:0_2px_18px_rgba(0,0,0,0.65)]";
const SHADOW_SOFT = "[text-shadow:0_1px_12px_rgba(0,0,0,0.7)]";

export default function Hero() {
  const h = copy.hero;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#000]">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <HeroVideo />
      </div>

      {/* Theme-switchable full-bleed scrim — a very light veil over the footage
          so the headline never competes with a busy frame. Dark theme tints
          black, light theme tints white. Deliberately subtle. */}
      <div className="hero-scrim pointer-events-none absolute inset-0 z-[1]" />

      {/* Bottom-anchored gradient (inline style = theme-immune). Top of the
          footage stays clear; only the lower strip behind the text darkens. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[72%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.32) 46%, transparent)",
        }}
      />

      {/* Content — centered lower block */}
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="flex-1" />

        <div className="mx-auto w-full max-w-3xl px-6 pb-16 text-center sm:pb-24">
          {/* Headline — two-tone (accent on the middle clause) */}
          <h1
            style={{ lineHeight: 1.15 }}
            className={`mx-auto max-w-2xl font-display text-[2.6rem] font-bold text-[#ffffff] sm:text-[3.4rem] md:text-[4.25rem] ${SHADOW_STRONG}`}
          >
            {h.headlineParts.map((part, i) => (
              <span key={i} className={part.accent ? "text-accent" : undefined}>
                {part.text}
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className={`mx-auto mt-6 max-w-xl text-sm text-[#e5e5e5] sm:mt-7 sm:text-lg ${SHADOW_SOFT}`}>
            {h.sub}
          </p>

          {/* Accreditation badges */}
          <HeroBadges />

          {/* CTAs — pinned colors (no data-themed flip) so they stay punchy
              over the dark video in both themes. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#apply"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffffff] px-8 py-4 text-sm font-semibold text-[#0a0a0a] shadow-xl transition hover:bg-[#e5e5e5] sm:w-auto sm:text-base"
            >
              {h.cta} <span aria-hidden>&rarr;</span>
            </a>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("counsellor:open"))
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-[#ffffff] transition hover:bg-white/20 sm:w-auto sm:text-base"
            >
              {h.counsellorCta}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
