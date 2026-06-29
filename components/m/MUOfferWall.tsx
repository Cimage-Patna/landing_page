"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { copy } from "@/lib/copy";

/* Immersive "wall of offer letters" — three columns of letter cards drifting
   vertically (alternating directions) behind fade masks, with a subtle 3D tilt.
   Tap a card to open the full letter in a lightbox. Scales to hundreds: the
   item list auto-fills/loops, so swapping in real offer-letter images later is
   just editing copy.offerLetters.items. */

type Item = { img: string; name?: string; company?: string; package?: string };

const COLS = 4;

export default function MUOfferWall() {
  const o = copy.offerLetters;
  const [open, setOpen] = useState<Item | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Fill a short placeholder list up to ~12 so the wall reads as full; with the
  // real (large) list this leaves it untouched.
  const base = o.items as Item[];
  const filled =
    base.length >= 12 ? base : Array.from({ length: Math.ceil(12 / base.length) }).flatMap(() => base);

  const columns: Item[][] = Array.from({ length: COLS }, () => []);
  filled.forEach((it, i) => columns[i % COLS].push(it));

  return (
    <section className="relative overflow-hidden bg-[#070707] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] sm:text-[3rem]">
            {o.display} <span className="mu-gradient-text not-italic">{o.displayAccent}</span>
          </h2>
          <p className="mt-4 text-[17px] text-white/60">{o.sub}</p>
        </div>
      </div>

      <div className="mu-offerwall-stage mt-12">
        <div className="mu-offer-wall">
          {columns.map((col, ci) => (
            <div key={ci} className={`mu-offer-col ${ci % 2 === 1 ? "is-down" : ""}`}>
              {[...col, ...col].map((it, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpen(it)}
                  aria-label={`View offer letter${it.company ? ` from ${it.company}` : ""}`}
                  className="mu-offer-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.img} alt={it.company ? `${it.company} offer letter` : "Offer letter"} loading="lazy" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Offer letter"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={open.img}
                alt={open.company ? `${open.company} offer letter` : "Offer letter"}
                className="max-h-[82vh] max-w-[94vw] rounded-lg bg-white shadow-2xl"
              />
              {(open.name || open.company || open.package) && (
                <p className="text-center text-[13px] text-white/80">
                  {[open.name, open.company, open.package].filter(Boolean).join("  ·  ")}
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
