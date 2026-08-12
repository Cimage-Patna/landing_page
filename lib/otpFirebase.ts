// Client-only, lazily-loaded Firebase Auth for phone OTP. The firebase SDK is
// heavy and this runs on every landing page, so nothing here is imported until
// the first OTP is actually sent (dynamic import inside getOtpAuth()).
//
// We use in-memory persistence and sign out immediately after confirming the
// code — this is verification, not login: no lingering session, no ID token.

import { firebaseConfig, isOtpConfigured } from "./otp";
import type { Auth } from "firebase/auth";

let authPromise: Promise<Auth | null> | null = null;

export function getOtpAuth(): Promise<Auth | null> {
  if (typeof window === "undefined" || !isOtpConfigured()) return Promise.resolve(null);
  if (!authPromise) {
    authPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      const { getAuth, setPersistence, inMemoryPersistence } = await import("firebase/auth");
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      // No lingering auth state — we only want a one-off verification.
      await setPersistence(auth, inMemoryPersistence);
      // DEV ONLY: with a registered test phone number, this fully bypasses the
      // reCAPTCHA app-verification check (which otherwise fails on localhost
      // with INVALID_APP_CREDENTIAL). The `NODE_ENV !== "production"` guard makes
      // this whole branch dead-code-eliminated from the production bundle, so it
      // can never weaken reCAPTCHA for real users.
      if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_OTP_TEST_MODE === "1") {
        auth.settings.appVerificationDisabledForTesting = true;
      }
      return auth;
    })().catch(() => null);
  }
  return authPromise;
}

// Clear any auth state left after confirming the code.
export async function otpSignOut(): Promise<void> {
  try {
    const auth = await getOtpAuth();
    if (!auth) return;
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {
    /* ignore — nothing to clean up */
  }
}
