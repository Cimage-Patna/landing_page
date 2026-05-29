import Reveal from "./Reveal";
import { copy } from "@/lib/copy";

export default function Programs() {
  const p = copy.programs;
  return (
    <section className="bg-neutral-950 px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-black text-white sm:text-5xl">
            {p.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
            {p.sub}
          </p>
        </Reveal>

        {p.groups.map((group) => (
          <div key={group.label} className="mt-12">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </Reveal>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal key={item.name} delay={(i % 3) * 0.07}>
                  <a
                    href="#apply"
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl font-bold text-white">
                        {item.name}
                      </h3>
                      <span className="text-sm text-neutral-500 transition group-hover:text-accent">
                        Apply &rarr;
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
