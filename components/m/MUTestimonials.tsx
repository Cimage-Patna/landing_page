import Image from "next/image";
import { copy } from "@/lib/copy";
import { Reveal } from "./ui";

export default function MUTestimonials() {
  const t = copy.trust;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] text-[#090909] sm:text-[3rem]">
            {t.display}
          </h2>
          <p className="mt-4 text-[17px] text-[#525252]">{t.sub}</p>
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {t.testimonials.map((q, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05} className="mu-card break-inside-avoid p-6">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--mu-yellow)" aria-hidden="true">
                <path d="M10 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3H5v2h5v-7H6V9h4V7zm9 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3h-3v2h5v-7h-4V9h4V7z" />
              </svg>
              <p className="mu-serif mt-4 text-[18px] italic leading-snug text-[#1e1e1e]">
                “{q.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="relative h-11 w-11 overflow-hidden rounded-full bg-[#eee]">
                  <Image src={q.photo} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="text-[13px] font-medium text-[#737373]">{q.meta}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
