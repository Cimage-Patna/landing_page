"use client";

import { useEffect, useState } from "react";
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
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("fee:open"))}
            className="nav-item inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          >
            <LockIcon />
            <span>Unlock Fee</span>
          </button>
          {/* Kept mounted (trigger-less) so Hero's "Get Guidance" still opens it. */}
          <CounsellorMenu hideTrigger />
        </nav>
      </div>
    </header>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
