"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { Arrow } from "./ui";

/* The "request a call" lead form — heading, fields, submit + success/error and
   the trust line. Used inline in MUApply and inside the sticky-CTA popup. */

type Status = "idle" | "loading" | "success" | "error";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const inputCls =
  "w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-[15px] text-[#090909] placeholder:text-[#a3a3a3] outline-none transition focus:border-[#090909] focus:ring-2 focus:ring-[#fad133]/40";

export default function MULeadForm() {
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
    <>
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

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={status === "loading"}
              className="mu-btn mu-btn-black !rounded-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Apply Now"}
              {status !== "loading" && <Arrow />}
            </button>
          </div>

          {status === "error" && (
            <p className="text-center text-[14px] text-[#b2212a]">{errorMsg || a.errorMsg}</p>
          )}
        </form>
      )}

      <p className="mt-5 text-center text-[12px] leading-relaxed text-[#909090]">
        No spam. Counsellor calls within one working day.
      </p>
    </>
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
