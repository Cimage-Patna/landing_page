"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { Arrow } from "./ui";

type Status = "idle" | "loading" | "success" | "error";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const inputCls =
  "w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-[15px] text-[#090909] placeholder:text-[#a3a3a3] outline-none transition focus:border-[#090909] focus:ring-2 focus:ring-[#fad133]/40";

export default function MUApply() {
  const a = copy.apply;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
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
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "");
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  }

  return (
    <section id="apply" className="bg-[#fefcf5] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Info column */}
        <div>
          <span className="mu-eyebrow">{a.infoEyebrow}</span>
          <h2 className="mu-serif mt-5 text-[2.2rem] leading-[1.08] text-[#090909] sm:text-[3rem]">
            {a.infoTitle}
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#525252]">{a.infoDesc}</p>
          <ul className="mt-7 space-y-3.5">
            {a.infoPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#404040]">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[#090909]"
                  style={{ background: "var(--mu-yellow)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="mu-card p-7 sm:p-9">
          <h3 className="text-[24px] font-bold text-[#090909]">{a.formHeading}</h3>
          <p className="mt-2 text-[14px] text-[#737373]">{a.formSub}</p>

          {status === "success" ? (
            <div className="mt-6 rounded-2xl border border-[#1c7c54]/25 bg-[#1c7c54]/10 p-6 text-center">
              <p className="font-semibold text-[#1c7c54]">{a.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
              <Field label="Full name">
                <input name="name" required type="text" autoComplete="name" placeholder="Your name" className={inputCls} />
              </Field>
              <div className="grid gap-3.5 sm:grid-cols-2">
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
                className="mu-btn mu-btn-black w-full !rounded-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : a.cta}
                {status !== "loading" && <Arrow />}
              </button>

              {status === "error" && (
                <p className="text-center text-[14px] text-[#b2212a]">{errorMsg || a.errorMsg}</p>
              )}
            </form>
          )}

          <p className="mt-5 text-center text-[12px] leading-relaxed text-[#909090]">{a.trustLine}</p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#525252]">{label}</span>
      {children}
    </label>
  );
}
