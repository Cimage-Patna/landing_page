"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

function Counter({ target }: { target: string }) {
  const match = target.match(/(\d[\d,]*)/);
  const numericValue = match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
  const [display, setDisplay] = useState(match ? "0" : target);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || !match || !numericValue) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = Math.floor(numericValue * eased);
            setDisplay(v.toLocaleString("en-IN"));
            if (p < 1) requestAnimationFrame(tick);
            else setDisplay(numericValue.toLocaleString("en-IN"));
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [match, numericValue]);

  if (!match) return <span>{target}</span>;
  return <span ref={ref}>{target.replace(match[1], display)}</span>;
}

export default function Numbers() {
  return (
    <section className="relative bg-black py-16 sm:py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
            Chapter 02
          </p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl font-black text-white">
            {copy.numbers.eyebrow}
          </h2>
          <p className="mt-4 max-w-xl text-neutral-400">{copy.numbers.sub}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {copy.numbers.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="bg-black p-7 sm:p-8 h-full">
                <div className="font-display text-4xl sm:text-5xl font-black text-white">
                  <Counter target={item.value} />
                </div>
                <div className="mt-3 text-sm text-neutral-400 leading-snug">
                  {item.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <p className="text-center text-neutral-500 italic">
            {copy.numbers.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
