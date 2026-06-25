"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* Wraps any image block and opens an enlarged view of `src` on click. Uses
   display:contents so it doesn't change the wrapped element's layout. */
export default function ZoomableImage({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <span
        className="zoomimg"
        style={{ display: "contents" }}
        role="button"
        tabIndex={0}
        aria-label={`Enlarge image: ${alt}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {children}
      </span>

      {mounted &&
        open &&
        createPortal(
          <div
            className="zoomimg-modal"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
          >
            <button className="zoomimg-close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="zoomimg-full" onClick={(e) => e.stopPropagation()} />
          </div>,
          document.body,
        )}
    </>
  );
}
