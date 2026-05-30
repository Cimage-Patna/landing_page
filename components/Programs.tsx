import Image from "next/image";
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
                    href={item.href ?? "#apply"}
                    target={item.href ? "_blank" : undefined}
                    rel={item.href ? "noopener noreferrer" : undefined}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-accent/40 hover:bg-white/[0.05]"
                  >
                    {item.img && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl font-bold text-white">
                        {item.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                    </div>
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
