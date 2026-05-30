"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import CounsellorMenu from "./CounsellorMenu";

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Transparent while the hero still fills most of the viewport;
      // glass once we've scrolled past ~70% of it.
      setSolid(window.scrollY > window.innerHeight * 0.7);
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
    <header
      className={`nav-base fixed inset-x-0 top-0 z-50 ${
        solid ? "nav-solid" : "nav-transparent"
      }`}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-end gap-4 px-5 py-2.5 sm:px-8 sm:py-3">
        {/* Right cluster */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <CounsellorMenu />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
