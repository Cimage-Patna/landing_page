"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";
import { asset } from "@/lib/assets";
import { reportApplyConversion } from "@/lib/gtag";

type Status = "idle" | "loading" | "success" | "error";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

// Theme-aware: bg-white/[0.05], border-white/10, text-white, text-neutral-500
// all auto-flip in light theme via globals.css. Focus blue is fixed.
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 transition";

export default function Apply() {
  const a = copy.apply;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Capture UTM params once on mount — the query string may be stripped by
  // later hash navigation (e.g. clicking "#apply"), so we snapshot it early.
  const utmRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    utmRef.current = utm;
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg("");
    const payload = { ...Object.fromEntries(new FormData(form)), ...utmRef.current };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error || "");
      reportApplyConversion();
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  }

  return (
    <section id="apply" className="relative overflow-hidden bg-neutral-950 px-5 py-16 sm:py-24">
      {/* Background — group photo of placed CIMAGE students */}
      <Image
        src={asset("/gp.png")}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="pointer-events-none object-cover object-center opacity-40"
      />
      {/* Dark overlay so the spread copy + white form card stay legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/75 via-neutral-950/55 to-neutral-950/85" />
      {/* Single warm glow for atmosphere (the photo carries the rest) */}
      <div className="pointer-events-none absolute -left-40 top-24 h-[28rem] w-[28rem] rounded-full bg-amber-400/[0.08] blur-[140px]" />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2 lg:gap-20">
        {/* ── INFO — no card, spread across the column ──────────────── */}
        <Reveal className="order-2 md:order-1">
          <div className="relative" data-themed="on-dark">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {a.infoEyebrow}
            </span>

            <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-[3.5rem]">
              {a.infoTitle}
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300">
              {a.infoDesc}
            </p>

            <ul className="mt-7 space-y-3.5">
              {a.infoPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-200">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* ── FORM CARD — appears first on mobile, right on desktop ──── */}
        <Reveal delay={0.08} className="order-1 md:order-2">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl sm:p-10">
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {a.formHeading}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">{a.formSub}</p>

            {status === "success" ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <p className="font-semibold text-emerald-500">{a.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
                <Field label="Full name">
                  <input
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputCls}
                  />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Phone">
                    <input
                      name="phone"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Course">
                    <select name="course" defaultValue="BCA" className={inputCls}>
                      {a.courses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Apply Now →"}
                </button>

                {status === "error" && (
                  <p className="text-center text-sm text-red-500">
                    {errorMsg || a.errorMsg}
                  </p>
                )}
              </form>
            )}

            <p className="mt-5 text-center text-[11px] leading-relaxed text-neutral-400">
              {a.trustLine}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}