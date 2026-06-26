"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { copy } from "@/lib/copy";

export default function MUVisitors() {
  const v = copy.visitors;
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <section className="bg-[#090909] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] sm:text-[3rem]">
            <span className="mu-gradient-text">Honoured guests on our stage.</span>
          </h2>
          <p className="mt-4 text-[17px] text-white/65">{v.sub}</p>
        </div>
      </div>

      {/* horizontal guest-photo rail — tap a card to preview full image */}
      <div className="mu-no-scrollbar mt-12 overflow-x-auto pb-2">
        <div className="flex gap-5 px-5 sm:px-8" style={{ width: "max-content" }}>
          {v.gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open guest photo ${i + 1}`}
              className="group w-[300px] flex-none cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#141414]">
                <Image
                  src={src}
                  alt={`CIMAGE guest moment ${i + 1}`}
                  fill
                  sizes="300px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* full-image lightbox */}
      {mounted &&
        open !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Guest photo preview"
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.gallery[open]}
              alt={`CIMAGE guest moment ${open + 1}`}
              className="max-h-[88vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
