"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      return null;
    }
  })();
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    document.documentElement.style.setProperty("--ripple-x", `${x}px`);
    document.documentElement.style.setProperty("--ripple-y", `${y}px`);

    type DocWithVT = Document & {
      startViewTransition?: (cb: () => void) => { finished?: Promise<void> };
    };
    const d = document as DocWithVT;

    if (typeof d.startViewTransition === "function") {
      d.startViewTransition(() => {
        applyTheme(next);
        setTheme(next);
      });
    } else {
      applyTheme(next);
      setTheme(next);
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      className="nav-ctl relative w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 transition-all overflow-hidden grid place-items-center text-white"
      suppressHydrationWarning
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute w-5 h-5 transition-all duration-500 ${
          mounted && isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute w-5 h-5 transition-all duration-500 ${
          mounted && !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
