"use client";

import { useEffect, useState } from "react";

export default function StickyApply() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const applyEl = document.getElementById("apply");
    const footerEl = document.querySelector("footer");
    const onScroll = () => {
      const beyondHero = window.scrollY > window.innerHeight * 0.7;
      // Hide while the Apply form is on screen (redundant), and again once the
      // footer reaches the bar so the two never overlap.
      const applyRect = applyEl?.getBoundingClientRect();
      const inApply = applyRect
        ? applyRect.top < window.innerHeight * 0.85 && applyRect.bottom > 0
        : false;
      const footerRect = footerEl?.getBoundingClientRect();
      const atFooter = footerRect
        ? footerRect.top < window.innerHeight - 8
        : false;
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
    <div
      aria-hidden={!visible}
      data-themed="on-dark"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 backdrop-blur-sm transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight text-white sm:text-[15px]">
            Admissions open for 2026
          </p>
          <p className="truncate text-[11px] leading-tight text-neutral-400 sm:text-xs">
            Limited seats · placement-backed programs
          </p>
        </div>
        <a
          href="#apply"
          tabIndex={visible ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-blue-900/30 transition hover:brightness-110 active:scale-[0.99] sm:px-5 sm:text-sm"
        >
          Apply Now <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </div>
  );
}
