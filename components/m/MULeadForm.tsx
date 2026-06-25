"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { reportApplyConversion } from "@/lib/gtag";
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

    // 12th marks must be a percentage strictly between 40 and 100.
    const marks = parseFloat(String(new FormData(form).get("twelfth_marks") ?? "").replace("%", "").trim());
    if (!(marks > 40 && marks < 100)) {
      setErrorMsg("Enter your 12th marks as a percentage between 40 and 100.");
      setStatus("error");
      return;
    }

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
      reportApplyConversion();
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
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="12th marks (%)">
              <input
                name="twelfth_marks"
                required
                type="text"
                inputMode="decimal"
                maxLength={50}
                placeholder="e.g. 85"
                className={inputCls}
              />
            </Field>
            <Field label="District (optional)">
              <input
                name="district"
                type="text"
                autoComplete="address-level2"
                placeholder="e.g. Patna"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Board">
              <select name="board" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Select board
                </option>
                {a.boards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stream">
              <select name="stream" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Select stream
                </option>
                {a.streams.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-6 py-3.5 text-[15px] font-semibold text-[#ffffff] shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
