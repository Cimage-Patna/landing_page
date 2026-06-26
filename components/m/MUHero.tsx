"use client";

import { copy } from "@/lib/copy";
import HeroVideo from "@/components/HeroVideo";

/* MU programme-style hero: a full-bleed immersive video (the "/" footage) with a
   top + bottom scrim and bottom-centred content — serif/italic heading, bold
   sub, and Apply Now + Get Guidance pills. "Get Guidance" opens the counsellor
   dialog. The accreditation logos live in the "Recognised by" band right below
   (MURecognised). Same design on web + phone; the button row stacks on mobile. */
export default function MUHero() {
  const h = copy.hero;

  return (
    <section id="top" className="mu-herofull">
      {/* full-bleed background video — the "/" hero footage */}
      <div className="mu-herofull-video">
        <HeroVideo />
      </div>
      <div className="mu-herofull-scrim" />

      {/* bottom-centred content */}
      <div className="mu-herofull-content">
        <h1 className="mu-herofull-head">
          <span>Bihar&apos;s most successful</span>
          <span className="mu-serif accent">IT &amp; Management college.</span>
        </h1>
        <p className="mu-herofull-sub">
          Home to Bihar&apos;s highest placements and most gold medallists, with a premium campus in the heart of Patna.
        </p>

        <div className="mu-herofull-btns">
          <button
            type="button"
            className="mu-herofull-btn primary"
            onClick={() => window.dispatchEvent(new Event("apply:open"))}
          >
            {h.cta}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="mu-herofull-btn ghost"
            onClick={() => window.dispatchEvent(new Event("counsellor:open"))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Get Guidance
          </button>
        </div>
      </div>
    </section>
  );
}
