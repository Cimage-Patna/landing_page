"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ADMISSION_PHONES } from "@/lib/contact";

export default function CounsellorMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Allow other components (e.g. the Hero CTA) to open this dialog by
  // dispatching `window.dispatchEvent(new Event("counsellor:open"))`.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("counsellor:open", onOpen);
    return () => window.removeEventListener("counsellor:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop trigger — pill */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="nav-item hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium sm:inline-flex"
      >
        <PhoneIcon />
        <span>Talk to Counsellor</span>
      </button>

      {/* Mobile trigger — icon */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Talk to Counsellor"
        className="nav-item inline-flex h-10 w-10 items-center justify-center rounded-full border sm:hidden"
      >
        <PhoneIcon />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Talk to a Counsellor"
              className="modal-card relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--edge)" }}
            >
              {/* Header */}
              <div className="relative px-6 pb-5 pt-8 text-center">
                <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-amber-400/15 blur-3xl" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-amber-400/10 hover:text-amber-400"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-white">
                  Talk to a Counsellor
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Pick a line — our admission team will pick up.
                </p>
              </div>

              {/* Number cards */}
              <div className="space-y-2 px-5 pb-5">
                {ADMISSION_PHONES.map((p) => (
                  <a
                    key={p.dial}
                    href={`tel:${p.dial}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-amber-400/[0.06]"
                    style={{ borderColor: "var(--edge)" }}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-400/15 text-amber-500 transition group-hover:bg-amber-400 group-hover:text-black">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-left text-base font-semibold text-white">
                      {p.display}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      Call
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <div
                className="border-t px-6 py-3 text-center text-[11px] text-neutral-500"
                style={{ borderColor: "var(--edge)" }}
              >
                Available Mon – Sat · 9:00 AM to 6:00 PM
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
