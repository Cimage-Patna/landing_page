"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { ADMISSION_PHONES } from "@/lib/contact";

const LINKS = [
  { label: "Why CIMAGE", href: "#why" },
  { label: "Programs", href: "#programs" },
  { label: "Placements", href: "#placements" },
  { label: "Campus Life", href: "#campus" },
  { label: "FAQ", href: "#faq" },
];

export default function MUNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid #ececec" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-3 sm:px-8">
        {/* Wordmark */}
        <a href="#top" className="flex items-baseline gap-2 leading-none">
          <span className="text-[22px] font-extrabold tracking-tight text-[#090909]">CIMAGE</span>
          <span className="hidden text-[11px] font-medium text-[#737373] sm:inline">
            {copy.footer.tagline}
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-[#404040] transition-colors hover:text-[#090909]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${ADMISSION_PHONES[0].dial}`}
            className="hidden text-[14px] font-medium text-[#404040] transition-colors hover:text-[#090909] md:inline"
          >
            {ADMISSION_PHONES[0].display}
          </a>
          <a href="#apply" className="mu-btn mu-btn-black !px-5 !py-2.5 !text-[14px]">
            Apply Now
          </a>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e5] lg:hidden"
          >
            <span className="relative block h-[14px] w-[18px]">
              <span
                className="absolute left-0 block h-[2px] w-full rounded bg-[#090909] transition-all"
                style={{ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 top-[6px] block h-[2px] w-full rounded bg-[#090909] transition-all"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-[2px] w-full rounded bg-[#090909] transition-all"
                style={{ bottom: open ? 6 : 0, transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="mu-rise border-t border-[#ececec] bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[16px] font-medium text-[#1e1e1e] hover:bg-[#fafafa]"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${ADMISSION_PHONES[0].dial}`}
              className="mt-2 rounded-xl px-3 py-3 text-[15px] font-medium text-[#737373]"
            >
              Call admissions · {ADMISSION_PHONES[0].display}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
