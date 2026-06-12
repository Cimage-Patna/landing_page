import { copy } from "@/lib/copy";
import { ADMISSION_PHONES } from "@/lib/contact";

export default function MUFooter() {
  const f = copy.footer;

  return (
    <footer className="bg-[#090909] pt-16 text-white">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 md:flex-row md:items-center">
          <h2 className="mu-serif max-w-xl text-[2rem] leading-[1.1] sm:text-[2.6rem]">
            {copy.join.title}
          </h2>
          <a href="#apply" className="mu-btn mu-btn-yellow">
            {copy.apply.cta}
          </a>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-extrabold">{f.brand}</span>
              <span className="text-[12px] text-[#fad133]">{f.tagline}</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/55">{f.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {f.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-[12.5px] text-white/70 transition hover:border-[#fad133] hover:text-[#fad133]"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/40">Programs</h3>
            <ul className="mt-4 space-y-2.5">
              {f.programs.map((p) => (
                <li key={p.name}>
                  <a href={p.href} className="text-[14px] text-white/70 transition hover:text-white">
                    {p.full}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/40">Quick links</h3>
            <ul className="mt-4 space-y-2.5">
              {f.quickLinks.map((q) => (
                <li key={q.name}>
                  <a href={q.href} className="text-[14px] text-white/70 transition hover:text-white">
                    {q.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/40">Visit us</h3>
            <address className="mt-4 space-y-1 text-[14px] not-italic leading-relaxed text-white/70">
              {f.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <div className="mt-4 space-y-1">
              {ADMISSION_PHONES.slice(0, 2).map((p) => (
                <a key={p.dial} href={`tel:${p.dial}`} className="block text-[14px] text-white/70 hover:text-white">
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${f.email}`} className="block text-[14px] text-[#fad133]">
                {f.email}
              </a>
              <p className="text-[13px] text-white/45">{f.hours}</p>
            </div>
          </div>
        </div>

        {/* Accreditations + copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center md:flex-row md:text-left">
          <p className="text-[12.5px] text-white/45">
            © {f.copyright} · {f.accreditations.join(" · ")}
          </p>
          <p className="text-[12.5px] text-white/45">{f.developer}</p>
        </div>
      </div>
    </footer>
  );
}
