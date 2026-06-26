"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { copy } from "@/lib/copy";

/* Fee-structure unlock popup. Mounted once; opened from anywhere (e.g. the
   toolbar "Unlock Fee" button) by dispatching a window "fee:open" event. It
   captures a lightweight CRM lead (name · course · mobile), submits it to
   /api/lead tagged as a fee-structure enquiry, then generates and downloads a
   CIMAGE-branded fee-structure PDF for the selected course. */

type Status = "idle" | "loading" | "done";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const inputCls =
  "w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-[15px] text-[#090909] placeholder:text-[#a3a3a3] outline-none transition focus:border-[#090909] focus:ring-2 focus:ring-[#fad133]/40";

export default function MUFeeUnlock() {
  const courses = copy.apply.courses;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [course, setCourse] = useState(courses[0]?.value ?? "BCA");
  const utmRef = useRef<Record<string, string>>({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) utm[key] = v;
    }
    utmRef.current = utm;
  }, []);

  // Opened from the toolbar "Unlock Fee" button (and anywhere else) via event.
  useEffect(() => {
    const onOpen = () => {
      setStatus("idle");
      setError("");
      setOpen(true);
    };
    window.addEventListener("fee:open", onOpen);
    return () => window.removeEventListener("fee:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function downloadAll(name?: string) {
    const { generateAllFeesPdf } = await import("@/lib/feePdf");
    await generateAllFeesPdf(name);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const selected = String(fd.get("course") ?? course).trim();

    if (!name) return setError("Please enter your name.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Enter a valid 10-digit mobile number.");

    setError("");
    setStatus("loading");

    const payload = {
      name,
      phone,
      course: selected,
      form_type: "fee",
      comment: `Fee-structure download — ${selected}`,
      ...utmRef.current,
    };

    // Best-effort lead capture; the student always gets the PDF either way.
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* ignore — still deliver the PDF */
    }

    await downloadAll(name);
    setStatus("done");
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div className="mu-applymodal" role="dialog" aria-modal="true" aria-label="Unlock fee structure" onClick={() => setOpen(false)}>
      <div className="mu-applymodal-card" onClick={(e) => e.stopPropagation()}>
        <button className="mu-applymodal-close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="text-center">
            <h3 className="text-[22px] font-bold text-[#090909]">Your fee structure is downloading</h3>
            <p className="mt-2 text-[14px] text-[#737373]">
              Check your downloads for the CIMAGE fee-structure PDF. Our admissions team will also call you shortly.
            </p>
            <button
              type="button"
              onClick={() => downloadAll()}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[#e0e0e0] px-5 text-[14px] font-semibold text-[#090909] transition hover:bg-[#f5f5f5]"
            >
              Download again
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-[24px] font-bold text-[#090909]">Unlock the fee structure</h3>
            <p className="mt-2 text-[14px] text-[#737373]">
              A few details and your course-wise CIMAGE fee PDF downloads instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[#525252]">Full name</span>
                <input name="name" required type="text" autoComplete="name" placeholder="Your name" className={inputCls} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[#525252]">Mobile number</span>
                <input
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[#525252]">Course</span>
                <select name="course" value={course} onChange={(e) => setCourse(e.target.value)} className={inputCls}>
                  {courses.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: "#e7000b" }}
                >
                  {status === "loading" ? "Preparing…" : "Download Fee Structure"}
                </button>
              </div>

              {error && <p className="text-center text-[14px] text-[#b2212a]">{error}</p>}
            </form>

            <p className="mt-5 text-center text-[12px] leading-relaxed text-[#909090]">
              No spam. A counsellor calls within one working day.
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
