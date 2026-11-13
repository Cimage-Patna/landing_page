// Backend (CRM) phone OTP. The on/off switch lives in the CRM admin (OTP page),
// keyed "landing_page:<path>". It is used ONLY when the CRM says OTP is on for
// this page; if the CRM says off, is unreachable, or errors, the forms keep the
// Firebase flow in lib/otp.ts exactly as before.
//
// The browser calls the CRM directly (its OTP routes allow this site's origin),
// so the CRM's per-IP limits see the visitor's IP, not this site's server. The
// verification token it returns goes to /api/lead as otp_token and the CRM
// checks it server-side — the browser's word that a number was verified is
// never trusted.
"use client";

import { useEffect, useState } from "react";

const CRM_BASE = (process.env.NEXT_PUBLIC_CRM_API_BASE ?? "https://backend-admission.cimagepatna.com").replace(
  /\/+$/,
  "",
);
const OTP_API = `${CRM_BASE}/api/otp`;
const CONFIG_TIMEOUT_MS = 4000;

export type BackendOtp = {
  key: string;
  mode: "soft" | "hard";
  codeLength: number;
  resendCooldown: number;
  captchaSiteKey: string | null; // set when the CRM requires Cloudflare Turnstile
};

export type SendResult =
  | { ok: true; challengeId: string; resendAfter: number }
  | { ok: false; code: string; retryAfter?: number };

export type VerifyResult = { ok: true; token: string } | { ok: false; code: string; attemptsRemaining?: number };

type ApiBody = {
  success?: boolean;
  status?: string;
  data?: Record<string, unknown>;
  details?: Record<string, unknown>;
};

export function otpKeyForPath(pathname: string | null | undefined): string {
  const path = (pathname ?? "").replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  return `landing_page:${path}`;
}

const configCache = new Map<string, Promise<BackendOtp | null>>();

export function loadBackendOtp(pathname: string): Promise<BackendOtp | null> {
  const key = otpKeyForPath(pathname);
  let pending = configCache.get(key);
  if (!pending) {
    pending = (async () => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), CONFIG_TIMEOUT_MS);
      try {
        const res = await fetch(`${OTP_API}/config/?key=${encodeURIComponent(key)}`, { signal: ctrl.signal });
        if (!res.ok) return null;
        const body = (await res.json()) as ApiBody;
        const d = body.data ?? {};
        if (d.enabled !== true || (d.mode !== "soft" && d.mode !== "hard")) return null;
        const captcha = (d.captcha ?? {}) as { required?: boolean; site_key?: string };
        return {
          key,
          mode: d.mode,
          codeLength: Number(d.code_length) || 6,
          resendCooldown: Number(d.resend_cooldown_seconds) || 30,
          captchaSiteKey: captcha.required ? captcha.site_key || null : null,
        };
      } catch {
        return null; // unreachable / timed out → keep the existing flow
      } finally {
        clearTimeout(timer);
      }
    })();
    configCache.set(key, pending);
  }
  return pending;
}

// The CRM's verdict for this page, fetched once on mount. null until known —
// and null means "use the existing (Firebase / env) flow".
export function useBackendOtp(): BackendOtp | null {
  const [otp, setOtp] = useState<BackendOtp | null>(null);
  useEffect(() => {
    let live = true;
    void loadBackendOtp(window.location.pathname).then((v) => live && setOtp(v));
    return () => {
      live = false;
    };
  }, []);
  return otp;
}

async function post(path: string, body: Record<string, unknown>): Promise<{ http: number; body: ApiBody }> {
  const res = await fetch(`${OTP_API}/${path}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as ApiBody;
  return { http: res.status, body: json };
}

export async function sendBackendOtp(otp: BackendOtp, phone10: string, captchaToken?: string): Promise<SendResult> {
  try {
    const { http, body } = await post("send", {
      key: otp.key,
      phone: phone10,
      ...(captchaToken ? { captcha_token: captchaToken } : {}),
    });
    if (body.success && body.data?.challenge_id) {
      return {
        ok: true,
        challengeId: String(body.data.challenge_id),
        resendAfter: Number(body.data.resend_after) || otp.resendCooldown,
      };
    }
    const retry = Number(body.details?.retry_after);
    return { ok: false, code: body.status || (http === 429 ? "THROTTLED" : "OTP_SEND_FAILED"), retryAfter: retry || undefined };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}

export async function verifyBackendOtp(challengeId: string, code: string): Promise<VerifyResult> {
  try {
    const { body } = await post("verify", { challenge_id: challengeId, code });
    if (body.success && body.data?.verification_token) {
      return { ok: true, token: String(body.data.verification_token) };
    }
    const remaining = body.details?.attempts_remaining;
    return {
      ok: false,
      code: body.status || "NETWORK",
      attemptsRemaining: typeof remaining === "number" ? remaining : undefined,
    };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}

// ── Cloudflare Turnstile (only when the CRM policy requires it) ──────────────
type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

let turnstileScript: Promise<Turnstile> | null = null;

function loadTurnstile(): Promise<Turnstile> {
  if (!turnstileScript) {
    turnstileScript = new Promise<Turnstile>((resolve, reject) => {
      const w = window as unknown as { turnstile?: Turnstile };
      if (w.turnstile) return resolve(w.turnstile);
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error("turnstile")));
      s.onerror = () => {
        turnstileScript = null;
        reject(new Error("turnstile"));
      };
      document.head.appendChild(s);
    });
  }
  return turnstileScript;
}

// Tokens are single-use, so every send renders a fresh widget. "interaction-
// only" keeps it invisible unless Cloudflare actually wants the visitor to click.
export async function getTurnstileToken(siteKey: string, host: HTMLElement): Promise<string> {
  const ts = await loadTurnstile();
  return new Promise<string>((resolve, reject) => {
    const el = document.createElement("div");
    host.appendChild(el);
    let id = "";
    const done = (fn: () => void) => {
      clearTimeout(timer);
      try {
        if (id) ts.remove(id);
      } catch {
        /* ignore */
      }
      el.remove();
      fn();
    };
    const timer = setTimeout(() => done(() => reject(new Error("turnstile-timeout"))), 60_000);
    id = ts.render(el, {
      sitekey: siteKey,
      appearance: "interaction-only",
      callback: (token: string) => done(() => resolve(token)),
      "error-callback": () => done(() => reject(new Error("turnstile"))),
      "expired-callback": () => done(() => reject(new Error("turnstile-expired"))),
    });
  });
}
