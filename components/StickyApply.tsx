"use client";

import { useEffect, useState } from "react";

export default function StickyApply() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const applyEl = document.getElementById("apply");
    const onScroll = () => {
      const beyondHero = window.scrollY > window.innerHeight * 0.7;
      const inApply = applyEl
        ? applyEl.getBoundingClientRect().top < window.innerHeight * 0.5
        : false;
      setVisible(beyondHero && !inApply);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#apply"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-themed="invert-button"
      className={`fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium shadow-2xl transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      Apply Now <span aria-hidden>&rarr;</span>
    </a>
  );
}
