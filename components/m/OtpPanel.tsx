"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { getOtpAuth, otpSignOut } from "@/lib/otpFirebase";
import { getTurnstileToken, sendBackendOtp, verifyBackendOtp, type BackendOtp } from "@/lib/otpBackend";
import {
  HARD_FALLBACK_TIMEOUT_MS,
  MAX_SEND_FAILURES,
  RESEND_COOLDOWN_SECONDS,
  otpEvent,
  type OtpMode,
} from "@/lib/otp";

/* Shared phone-OTP step for all three lead forms. Rendered in place of the form
   once the user submits (when otp mode is soft/hard and Firebase is configured).

   Contract: it NEVER blocks the lead. It always resolves via onResolved() with
   verified true/false — verify, skip (soft), or fall back (hard, after repeated
   send failures or a timeout). The form then POSTs the lead either way.

   Two engines, same UI: Firebase (the default) or, when the CRM has switched
   OTP on for this page, the CRM's own OTP (`backend` prop). The backend engine
   returns a verification token the CRM checks when the lead arrives. */

export type OtpResolution = { verified: boolean; fallback?: boolean; token?: string };

type Props = {
  phoneE164: string; // +91XXXXXXXXXX, for Firebase
  phoneDisplay: string; // what to show the user (masked below)
  mode: Extract<OtpMode, "soft" | "hard">;
  form: "lead" | "fee"; // instrumentation label
  // Same payload lead_generated carries — merged into otp_started/sent/verified.
  leadData?: Record<string, unknown>;
  onResolved: (r: OtpResolution) => void;
  onBack: () => void; // return to the form to edit the number
  backend?: BackendOtp | null; // set → use the CRM's OTP instead of Firebase
};

type ErrKind = null | "wrong" | "expired" | "network" | "send" | "locked";

const ERR_TEXT: Record<Exclude<ErrKind, null>, string> = {
  wrong: "That code doesn’t match. Please re-enter the 6-digit code.",
  expired: "That code has expired. Tap Resend to get a new one.",
  network: "Network issue — please check your connection and try again.",
  send: "Couldn’t send the code just now. Tap Resend to try again.",
  locked: "Too many attempts. Tap Resend to get a new code.",
};

function maskPhone(e164: string): string {
  const ten = e164.replace(/\D/g, "").slice(-10);
  return ten.length === 10 ? `+91 ${ten.slice(0, 2)}xxxx${ten.slice(6)}` : e164;
}

export default function OtpPanel({
  phoneE164,
  mode,
  form,
  leadData = {},
  onResolved,
  onBack,
  backend = null,
}: Props) {
  const recaptchaId = useId().replace(/:/g, "_") + "-recaptcha";
  const codeLength = backend?.codeLength ?? 6;
  const challengeRef = useRef<string | null>(null); // backend engine
  const captchaHostRef = useRef<HTMLDivElement | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmRef = useRef<ConfirmationResult | null>(null);
  const sendFailuresRef = useRef(0);
  const resolvedRef = useRef(false);
  const startedRef = useRef(false); // guards StrictMode double-invoke on mount
  const sendingRef = useRef(false); // guards overlapping sends (double-click)

  const [step, setStep] = useState<"sending" | "code" | "fallback">("sending");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<ErrKind>(null);
  const [busy, setBusy] = useState(false); // confirming
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  // Resolve exactly once (guards double-taps / timeout racing a verify).
  const resolve = useCallback(
    (r: OtpResolution) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      if (!backend) {
        try {
          verifierRef.current?.clear();
        } catch {
          /* ignore */
        }
        void otpSignOut(); // no lingering auth state
      }
      onResolved(r);
    },
    [onResolved, backend],
  );

  const sendCode = useCallback(async () => {
    if (sendingRef.current) return; // ignore overlapping sends
    sendingRef.current = true;
    setErr(null);
    setStep((s) => (s === "code" ? "code" : "sending"));
    try {
      if (backend) {
        const captcha =
          backend.captchaSiteKey && captchaHostRef.current
            ? await getTurnstileToken(backend.captchaSiteKey, captchaHostRef.current)
            : undefined;
        const r = await sendBackendOtp(backend, phoneE164.replace(/\D/g, "").slice(-10), captcha);
        if (!r.ok && r.code === "OTP_RESEND_COOLDOWN" && challengeRef.current) {
          // A code is already on its way — just wait out the cooldown.
          setStep("code");
          setCooldown(r.retryAfter ?? backend.resendCooldown);
          return;
        }
        if (!r.ok) throw new Error(r.code);
        challengeRef.current = r.challengeId;
        sendFailuresRef.current = 0;
        setStep("code");
        setCooldown(r.resendAfter);
        otpEvent("otp_sent", { form, mode, engine: "crm", ...leadData });
        return;
      }
      const auth = await getOtpAuth();
      if (!auth) throw new Error("unconfigured");
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");
      // reCAPTCHA tokens are single-use — build a FRESH verifier for every send.
      // Reusing one (on Resend, or a React StrictMode double-mount in dev) makes
      // Firebase reject the 2nd send as "CAPTCHA_CHECK_FAILED … DUPE".
      try {
        verifierRef.current?.clear();
      } catch {
        /* ignore */
      }
      verifierRef.current = new RecaptchaVerifier(auth, recaptchaId, { size: "invisible" });
      const confirmation = await signInWithPhoneNumber(auth, phoneE164, verifierRef.current);
      confirmRef.current = confirmation;
      sendFailuresRef.current = 0;
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
      otpEvent("otp_sent", { form, mode, ...leadData });
    } catch (e) {
      sendFailuresRef.current += 1;
      otpEvent("otp_failed", {
        form,
        mode,
        stage: "send",
        // CRM engine: its status code (e.g. OTP_RATE_LIMITED) shows in GTM.
        ...(backend ? { engine: "crm", reason: e instanceof Error ? e.message : "unknown" } : {}),
      });
      // Hard mode: stop trying after repeated failures and offer the fallback.
      if (mode === "hard" && sendFailuresRef.current >= MAX_SEND_FAILURES) {
        setStep("fallback");
      } else {
        setErr("send");
        setStep("code"); // reveal the code box + Resend so the user isn't stuck
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } finally {
      sendingRef.current = false;
    }
  }, [phoneE164, recaptchaId, form, mode, backend]);

  // Kick off the first send on mount. startedRef guards React StrictMode's
  // dev double-invoke so we don't send (and burn a reCAPTCHA token) twice.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    otpEvent("otp_started", { form, mode, ...leadData });
    void sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Hard-mode safety valve: if not verified within the window, offer fallback.
  useEffect(() => {
    if (mode !== "hard") return;
    const t = setTimeout(() => {
      if (!resolvedRef.current) setStep("fallback");
    }, HARD_FALLBACK_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [mode]);

  async function confirmCode() {
    if (code.replace(/\D/g, "").length !== codeLength || !(backend ? challengeRef.current : confirmRef.current)) {
      setErr("wrong");
      return;
    }
    setBusy(true);
    setErr(null);
    if (backend) {
      const r = await verifyBackendOtp(challengeRef.current as string, code.trim());
      setBusy(false);
      if (r.ok) {
        otpEvent("otp_verified", { form, mode, engine: "crm", ...leadData });
        resolve({ verified: true, token: r.token });
        return;
      }
      otpEvent("otp_failed", { form, mode, engine: "crm", stage: "confirm", reason: r.code });
      if (r.code === "OTP_INVALID" && r.attemptsRemaining) setErr("wrong");
      else if (r.code === "OTP_EXPIRED") setErr("expired");
      else if (r.code === "OTP_INVALID" || r.code === "OTP_TOO_MANY_ATTEMPTS" || r.code === "OTP_ALREADY_USED")
        setErr("locked");
      else setErr("network");
      return;
    }
    try {
      if (!confirmRef.current) throw new Error("no-confirmation");
      await confirmRef.current.confirm(code.trim());
      otpEvent("otp_verified", { form, mode, ...leadData });
      resolve({ verified: true });
    } catch (e) {
      const codeStr = (e as { code?: string })?.code ?? "";
      otpEvent("otp_failed", { form, mode, stage: "confirm", reason: codeStr });
      if (codeStr === "auth/invalid-verification-code") setErr("wrong");
      else if (codeStr === "auth/code-expired") setErr("expired");
      else setErr("network");
    } finally {
      setBusy(false);
    }
  }

  function skip() {
    otpEvent("otp_skipped", { form, mode, reason: "user" });
    resolve({ verified: false });
  }

  function continueUnverified() {
    otpEvent("otp_skipped", { form, mode, reason: "fallback" });
    resolve({ verified: false, fallback: true });
  }

  // ── Fallback screen (hard mode only) ──────────────────────────────────────
  if (step === "fallback") {
    return (
      <div className="mt-2 text-center">
        <div id={recaptchaId} />
        <div ref={captchaHostRef} />
        <h3 className="text-[22px] font-bold text-[#090909]">We’ll call to confirm</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#525252]">
          We couldn’t verify your number by SMS right now — no problem. Your details are saved and
          our admissions team will call you to confirm within one working day.
        </p>
        <button
          type="button"
          onClick={continueUnverified}
          style={{ color: "#ffffff" }}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-6 text-[15px] font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
        >
          Continue
        </button>
      </div>
    );
  }

  // ── Send / code entry ─────────────────────────────────────────────────────
  return (
    <div className="mt-2">
      {/* invisible reCAPTCHA host (Firebase) / Turnstile host (CRM) */}
      <div id={recaptchaId} />
      <div ref={captchaHostRef} className="flex justify-center" />

      <h3 className="text-[22px] font-bold text-[#090909]">Verify your mobile</h3>
      <p className="mt-2 text-[14px] text-[#737373]">
        {step === "sending" ? `Sending a ${codeLength}-digit code to ` : `Enter the ${codeLength}-digit code sent to `}
        <span className="font-medium text-[#090909]">{maskPhone(phoneE164)}</span>.{" "}
        <button type="button" onClick={onBack} className="font-medium text-[#1d4ed8] underline">
          Change
        </button>
      </p>

      <input
        name="otp_code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={codeLength}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, codeLength))}
        placeholder={"_".repeat(codeLength)}
        disabled={step === "sending"}
        className="mt-5 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-center text-[22px] tracking-[0.5em] text-[#090909] outline-none transition focus:border-[#090909] focus:ring-2 focus:ring-[#fad133]/40 disabled:opacity-60"
      />

      {err && <p className="mt-2 text-[13.5px] text-[#b2212a]">{ERR_TEXT[err]}</p>}

      <button
        type="button"
        onClick={confirmCode}
        disabled={busy || step === "sending" || code.length !== codeLength}
        style={{ color: "#ffffff" }}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-6 text-[15px] font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? "Verifying…" : step === "sending" ? "Sending…" : "Verify & submit"}
      </button>

      <div className="mt-3 flex items-center justify-between text-[13px]">
        <button
          type="button"
          onClick={sendCode}
          disabled={cooldown > 0 || step === "sending"}
          className="font-medium text-[#1d4ed8] disabled:cursor-not-allowed disabled:text-[#a3a3a3]"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>

        {/* Soft mode: an always-available escape hatch that never blocks. */}
        {mode === "soft" && (
          <button type="button" onClick={skip} className="font-medium text-[#737373] underline">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
