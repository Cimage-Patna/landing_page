"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { Arrow } from "./ui";
import MULeadForm from "./MULeadForm";

/* BookMyShow-style sticky bottom CTA bar — mobile only. Slides up once you're
   past the hero, carries admission info + an "Apply Now" button that opens the
   lead form in a popup. Tucks away while the apply form is on screen or at the
   footer. */
export default function MUStickyCta() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const applyEl = document.getElementById("apply");
    const footerEl = document.querySelector("footer");
    const onScroll = () => {
      const beyondHero = window.scrollY > window.innerHeight * 0.6;
      const applyRect = applyEl?.getBoundingClientRect();
      const inApply = applyRect
        ? applyRect.top < window.innerHeight * 0.9 && applyRect.bottom > 0
        : false;
      const footerRect = footerEl?.getBoundingClientRect();
      const atFooter = footerRect ? footerRect.top < window.innerHeight - 8 : false;
      setVisible(beyondHero && !inApply && !atFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock scroll + close the popup on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden={!visible}
        className={`mu-stickycta fixed inset-x-0 bottom-0 z-[60] md:hidden ${visible ? "is-visible" : ""}`}
      >
        <div className="mu-stickycta-inner">
          <div className="mu-stickycta-text">
            <p className="mu-stickycta-title">{copy.apply.infoEyebrow}</p>
            <p className="mu-stickycta-sub">{copy.apply.sub}</p>
          </div>
          <button
            type="button"
            tabIndex={visible ? 0 : -1}
            onClick={() => setOpen(true)}
            className="mu-btn mu-stickycta-btn"
          >
            {copy.hero.cta}
            <Arrow size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="mu-applymodal"
          role="dialog"
          aria-modal="true"
          aria-label="Request a call"
          onClick={() => setOpen(false)}
        >
          <div className="mu-applymodal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mu-applymodal-close" aria-label="Close" onClick={() => setOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <MULeadForm />
          </div>
        </div>
      )}
    </>
  );
}
