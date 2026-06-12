import Image from "next/image";
import { copy } from "@/lib/copy";

export default function MUAwards() {
  const a = copy.awards;

  return (
    <section className="border-y border-[#efefef] bg-[#fafafa] py-16">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <h2 className="text-center text-[14px] font-semibold uppercase tracking-[0.14em] text-[#909090]">
          {a.display}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {a.items.map((item) => (
            <div key={item.name} className="flex max-w-[180px] flex-col items-center gap-3 text-center">
              <div className="relative h-14 w-14">
                <Image src={item.logo} alt={item.name} fill sizes="56px" className="object-contain" />
              </div>
              <span className="text-[13px] font-medium leading-snug text-[#525252]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
