"use client";

import { motion } from "motion/react";
import { copy } from "@/lib/copy";

export default function About() {
  const a = copy.about;

  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 sm:py-24">
      {/* warm radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.07] blur-3xl" />

      {/* faint floating sparks */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="about-spark absolute h-px w-px rounded-full bg-amber-400/70"
            style={{
              left: `${(i * 41 + 9) % 100}%`,
              top: `${(i * 27 + 11) % 100}%`,
              animationDelay: `${(i * 0.5) % 9}s`,
              animationDuration: `${9 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">

        <h2 className="mt-8 font-display font-black leading-[0.98] tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="block text-4xl text-white sm:text-6xl md:text-7xl"
          >
            {a.title}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="block text-4xl text-amber-400 sm:text-6xl md:text-7xl"
          >
            {a.titleAccent}
          </motion.span>
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg"
        >
          {a.body}
        </motion.p>

        <motion.a
          href="#apply"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, delay: 0.75 }}
          data-themed="invert-button"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black shadow-2xl transition hover:bg-neutral-200"
        >
          {a.cta} <span aria-hidden>&rarr;</span>
        </motion.a>
      </div>

      <style>{`
        @keyframes aboutSpark {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-22px) scale(2.2); }
        }
        .about-spark { animation-name: aboutSpark; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @media (prefers-reduced-motion: reduce) { .about-spark { animation: none; } }
      `}</style>
    </section>
  );
}
