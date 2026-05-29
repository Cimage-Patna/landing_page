"use client";

import { useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

type Status = "idle" | "loading" | "success" | "error";

const inputCls =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 transition";

export default function Apply() {
  const a = copy.apply;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg("");
    const payload = Object.fromEntries(new FormData(form));
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
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  }

  return (
    <section id="apply" className="bg-neutral-950 px-5 py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-start gap-5 md:grid-cols-2">
        {/* ── INFO CARD — its own distinctive card ─────────────── */}
        <Reveal>
          <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a8a] to-[#0b2452] p-8 text-white shadow-2xl ring-1 ring-white/10 sm:p-10">
            {/* dotted texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }}
            />
            {/* amber glow + accent bar */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-0 h-1.5 w-24 bg-amber-400" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {a.infoEyebrow}
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                {a.infoTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-blue-100/85">
                {a.infoDesc}
              </p>

              {/* stats in a glassy inset block */}
              <ul className="mt-6 space-y-2.5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                {a.infoPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-blue-50/90">
                    <CheckIcon />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs text-blue-100/70">{a.fee}</p>
            </div>

            {/* Real campus image — drop a cutout at public/apply/student.webp to override */}
            <div className="relative z-10 mt-7 overflow-hidden rounded-2xl border border-white/15 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgFailed ? "/campus-live/c4.webp" : "/apply/student.webp"}
                onError={() => setImgFailed(true)}
                alt="Students at the CIMAGE campus"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* ── FORM CARD — a separate card ──────────────────────── */}
        <Reveal delay={0.08}>
          <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
            <h3 className="font-display text-2xl font-bold text-neutral-900 sm:text-3xl">
              {a.formHeading}
            </h3>
            <p className="mt-2 text-sm text-neutral-500">{a.formSub}</p>

            {status === "success" ? (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <p className="font-semibold text-green-800">{a.successMsg}</p>
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Email (optional)">
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="City (optional)">
                    <input
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="Patna"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Message (optional)">
                  <textarea
                    name="comment"
                    rows={2}
                    placeholder="Anything you'd like to ask?"
                    className={inputCls}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Apply Now →"}
                </button>

                {status === "error" && (
                  <p className="text-center text-sm text-red-600">
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
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
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
