import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function FAQ() {
  const f = copy.faq;
  return (
    <section className="bg-black px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black text-white sm:text-5xl">
            {f.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-neutral-400">{f.sub}</p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {f.items.map((item, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05}>
              <details className="group rounded-xl border border-white/10 bg-white/[0.03] open:bg-white/[0.05] transition">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-white [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-400">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
