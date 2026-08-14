"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { copy } from "@/lib/copy";
import { reportApplyConversion } from "@/lib/gtag";
import { captureGclid } from "@/lib/tracking";
import { isOtpConfigured, leadDataLayer, otpModeForPath, tenDigits, toE164India, type OtpMode } from "@/lib/otp";
import OtpPanel from "./OtpPanel";
import { Arrow } from "./ui";

/* The "request a call" lead form — heading, fields, submit + success/error and
   the trust line. Used inline in MUApply and inside the sticky-CTA popup. */

type Status = "idle" | "loading" | "success" | "error";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const inputCls =
  "w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-[15px] text-[#090909] placeholder:text-[#a3a3a3] outline-none transition focus:border-[#090909] focus:ring-2 focus:ring-[#fad133]/40";

export default function MULeadForm() {
  const a = copy.apply;
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // OTP step: while phase === "otp" the form stays mounted but hidden (so typed
  // data survives a back/error) and the OtpPanel is shown instead.
  const [phase, setPhase] = useState<"form" | "otp">("form");
  const [pending, setPending] = useState<{
    fields: Record<string, string>;
    phoneE164: string;
    mode: Extract<OtpMode, "soft" | "hard">;
    leadData: Record<string, unknown>;
  } | null>(null);
  const utmRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    utmRef.current = utm;
    captureGclid(); // persist gclid from the landing URL
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // Every required field must be present/valid BEFORE we send an OTP — no
    // point texting a code for a form that can't be submitted.
    const fail = (msg: string) => {
      setErrorMsg(msg);
      setStatus("error");
    };
    const marks = parseFloat(String(fields.twelfth_marks ?? "").replace("%", "").trim());
    if (!(fields.name ?? "").trim()) return fail("Please enter your full name.");
    if (tenDigits(fields.phone ?? "").length !== 10) return fail("Enter a valid 10-digit mobile number.");
    if (!(fields.course ?? "").trim()) return fail("Please select a course.");
    if (!(marks > 40 && marks < 100)) return fail("Enter your 12th marks as a percentage between 40 and 100.");
    if (!(fields.board ?? "").trim()) return fail("Please select your board.");
    if (!(fields.stream ?? "").trim()) return fail("Please select your stream.");

    setErrorMsg("");
    const mode = otpModeForPath(window.location.pathname);
    const phoneE164 = toE164India(fields.phone ?? "");

    // off → submit straight through (no otp tag). If OTP can't run (no Firebase
    // config or an unusable number) never block — submit as otp-unverified.
    if (mode === "off") return void finalize(fields, null);
    if (!isOtpConfigured() || !phoneE164) return void finalize(fields, false);

    // Show the OTP step; the lead is POSTed once it resolves (verified or not).
    const leadData = leadDataLayer({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      course: fields.course,
      district: fields.district,
      twelfth_marks: fields.twelfth_marks,
      board: fields.board,
      stream: fields.stream,
      gclid: captureGclid(),
      formLocation: window.location.host,
    });
    setPending({ fields, phoneE164, mode, leadData });
    setPhase("otp");
  }

  // Submits the lead. otpVerified: true/false stamps the tag; null = no OTP.
  async function finalize(fields: Record<string, string>, otpVerified: boolean | null) {
    setPhase("form");
    setStatus("loading");
    setErrorMsg("");
    const gclid = captureGclid();
    const payload = {
      ...fields,
      phone: tenDigits(fields.phone ?? ""), // CRM needs exactly 10 digits
      ...utmRef.current,
      gclid,
      // landing_page → the CRM tag (e.g. "/bba" is tagged "BBA"); see /api/lead.
      landing_page: window.location.pathname,
      ...(otpVerified === null ? {} : { otp_verified: otpVerified }),
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "");
      reportApplyConversion();

      // Stash the entered details for the /thank-you page (confirmation +
      // GTM lead_generated push), then redirect there.
      try {
        sessionStorage.setItem(
          "cimage_lead",
          JSON.stringify({
            name: fields.name ?? "",
            email: fields.email ?? "",
            phone: fields.phone ?? "",
            course: fields.course ?? "",
            district: fields.district ?? "",
            twelfth_marks: fields.twelfth_marks ?? "",
            board: fields.board ?? "",
            stream: fields.stream ?? "",
            gclid,
            formLocation: window.location.host,
          }),
        );
      } catch {
        /* ignore storage errors */
      }
      router.push("/thank-you");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  }

  return (
    <>
      {phase !== "otp" && (
        <>
          <h3 className="text-[24px] font-bold text-[#090909]">{a.formHeading}</h3>
          <p className="mt-2 text-[14px] text-[#737373]">{a.formSub}</p>
        </>
      )}

      {status === "success" ? (
        <div className="mt-6 rounded-2xl border border-[#1c7c54]/25 bg-[#1c7c54]/10 p-6 text-center">
          <p className="font-semibold text-[#1c7c54]">{a.successMsg}</p>
        </div>
      ) : (
        <>
        <form onSubmit={handleSubmit} className={phase === "otp" ? "hidden" : "mt-6 space-y-3.5"} noValidate>
          <Field label="Full name" required>
            <input name="name" required type="text" autoComplete="name" placeholder="Your name" className={inputCls} />
          </Field>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="Phone" required>
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
            <Field label="Course" required>
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
            <Field label="12th marks (%)" required>
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
            <Field label="Board" required>
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
            <Field label="Stream" required>
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

        {phase === "otp" && pending && (
          <OtpPanel
            phoneE164={pending.phoneE164}
            phoneDisplay={pending.fields.phone ?? ""}
            mode={pending.mode}
            form="lead"
            leadData={pending.leadData}
            onResolved={(r) => finalize(pending.fields, r.verified)}
            onBack={() => setPhase("form")}
          />
        )}
        </>
      )}

      <p className="mt-5 text-center text-[12px] leading-relaxed text-[#909090]">
        No spam. Counsellor calls within one working day.
      </p>
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#525252]">
        {label}
        {required && <span className="text-[#b2212a]"> *</span>}
      </span>
      {children}
    </label>
  );
}
