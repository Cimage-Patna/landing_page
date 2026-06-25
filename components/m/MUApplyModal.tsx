"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MULeadForm from "./MULeadForm";

/* Single lead-form popup for /m. Opened from anywhere — the hero "Apply Now",
   the sticky CTA, etc. — by dispatching a window "apply:open" event. Mounted
   once in the page. Closes on backdrop click, the ✕ button, or Escape, and
   locks body scroll while open. */
export default function MUApplyModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("apply:open", onOpen);
    return () => window.removeEventListener("apply:open", onOpen);
  }, []);

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

  if (!mounted || !open) return null;

  return createPortal(
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
    </div>,
    document.body,
  );
}
