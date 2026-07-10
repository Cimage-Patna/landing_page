"use client";

import { usePathname } from "next/navigation";
import { copy } from "@/lib/copy";
import HeroVideo from "@/components/HeroVideo";

// Per-course hero headline. Course landing pages re-export the home page, so we
// switch the H1 by the current route. Home, the Meta page and any unmapped path
// fall back to the general "IT & Management college." headline. The tagline
// below the H1 (HERO_SUB) is the same on every page for now.
const HERO_SUB =
  "Home to Bihar’s highest placements and most gold medallists, with a premium campus in the heart of Patna.";
const DEFAULT_HEAD = { lead: "Bihar’s most successful", accent: "IT & Management college." };
const HERO_HEADS: Record<string, { lead: string; accent: string }> = {
  "/btech": { lead: "Bihar’s most successful", accent: "B.Tech college." },
  "/bca": { lead: "Bihar’s most successful", accent: "BCA college." },
  "/bba": { lead: "Bihar’s most successful", accent: "BBA college." },
  "/bsc-it": { lead: "Bihar’s most successful", accent: "B.Sc-IT college." },
  "/bcom": { lead: "Bihar’s most successful", accent: "B.Com. college." },
  "/mca": { lead: "Bihar’s most successful", accent: "MCA college." },
  "/mba": { lead: "Bihar’s most successful", accent: "MBA college." },
};

/* MU programme-style hero: a full-bleed immersive video (the "/" footage) with a
   top + bottom scrim and bottom-centred content — serif/italic heading, bold
   sub, and Apply Now + Get Guidance pills. "Get Guidance" opens the counsellor
   dialog. The accreditation logos live in the "Recognised by" band right below
   (MURecognised). Same design on web + phone; the button row stacks on mobile. */
export default function MUHero() {
  const h = copy.hero;
  const pathname = usePathname();
  const head = HERO_HEADS[pathname ?? ""] ?? DEFAULT_HEAD;

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
          <span>{head.lead}</span>
          <span className="mu-serif accent">{head.accent}</span>
        </h1>
        <p className="mu-herofull-sub">{HERO_SUB}</p>

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
