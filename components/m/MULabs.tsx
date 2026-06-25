import Image from "next/image";
import { copy } from "@/lib/copy";
import { Reveal } from "./ui";
import ZoomableImage from "@/components/ZoomableImage";

export default function MULabs() {
  const l = copy.labs;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] text-[#090909] sm:text-[3rem]">
            {l.display}
          </h2>
          <p className="mt-4 text-[17px] text-[#525252]">{l.sub}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {l.blocks.map((b, i) => (
            <Reveal key={i} delay={i * 0.08} className="mu-card overflow-hidden">
              <ZoomableImage src={b.image} alt={b.title}>
                <div className="relative aspect-[16/9] overflow-hidden bg-[#eee]">
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    sizes="(max-width:768px) 100vw, 580px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#090909] shadow">
                    {b.badge}
                  </span>
                </div>
              </ZoomableImage>
              <div className="p-7">
                <h3 className="text-[22px] font-semibold text-[#090909]">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#737373]">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
