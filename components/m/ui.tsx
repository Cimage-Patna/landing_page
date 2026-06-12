"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Small forward arrow used inside MU pill buttons and link chips. */
export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** MU's circular arrow chip — a filled disc with an arrow, used on cards. */
export function ArrowChip({
  bg = "var(--mu-yellow)",
  color = "#090909",
  size = 40,
}: {
  bg?: string;
  color?: string;
  size?: number;
}) {
  return (
    <span className="mu-arrow-chip" style={{ width: size, height: size, background: bg, color }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 17 17 7M9 7h8v8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Scroll-reveal — same proven Framer Motion whileInView the main site uses. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 22,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
