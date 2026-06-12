import Image from "next/image";
import { copy } from "@/lib/copy";

export default function MURecruiters() {
  const r = copy.recruiters;
  // duplicate the list so the marquee loops seamlessly (-50% translate)
  const logos = [...r.items, ...r.items];

  return (
    <section className="border-y border-[#efefef] bg-[#fafafa] py-12">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="text-center text-[13px] font-medium uppercase tracking-[0.14em] text-[#909090]">
          {r.eyebrow}
        </p>
      </div>

      <div className="mu-marquee relative mt-8 overflow-hidden">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#fafafa] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#fafafa] to-transparent" />
        <div className="mu-marquee-track items-center gap-14">
          {logos.map((logo, i) => (
            <div key={i} className="flex h-12 w-[120px] flex-none items-center justify-center">
              <Image
                src={logo.logo}
                alt={logo.name}
                width={120}
                height={48}
                className="max-h-9 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1240px] px-5 sm:px-8">
        <p className="text-center text-[14px] text-[#737373]">
          …and 200+ more, including{" "}
          <span className="font-semibold text-[#1e1e1e]">{r.extras.join(", ")}</span>.
        </p>
      </div>
    </section>
  );
}
