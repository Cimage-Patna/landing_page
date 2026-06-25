"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { Arrow } from "./ui";

/* BookMyShow-style sticky bottom CTA bar — mobile only. Slides up once you're
   past the hero, carries admission info + an "Apply Now" button that opens the
   shared lead-form popup (MUApplyModal) via the "apply:open" event. Tucks away
   while the apply form is on screen or at the footer. */
export default function MUStickyCta() {
  const [visible, setVisible] = useState(false);

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
            onClick={() => window.dispatchEvent(new Event("apply:open"))}
            className="mu-btn mu-stickycta-btn"
          >
            {copy.hero.cta}
            <Arrow size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
