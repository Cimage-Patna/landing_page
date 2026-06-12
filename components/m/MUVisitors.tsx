import Image from "next/image";
import { copy } from "@/lib/copy";

export default function MUVisitors() {
  const v = copy.visitors;
  const withPhoto = v.items.filter((i) => "photo" in i && i.photo);
  const withoutPhoto = v.items.filter((i) => !("photo" in i) || !i.photo);

  return (
    <section className="bg-[#090909] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="mu-serif text-[2.1rem] leading-[1.1] sm:text-[3rem]">
            <span className="mu-gradient-text">Honoured guests on our stage.</span>
          </h2>
          <p className="mt-4 text-[17px] text-white/65">{v.sub}</p>
        </div>
      </div>

      {/* horizontal people rail — MU .meetMastersSection swiper */}
      <div className="mu-no-scrollbar mt-12 overflow-x-auto pb-2">
        <div className="flex gap-5 px-5 sm:px-8" style={{ width: "max-content" }}>
          {withPhoto.map((p, i) => (
            <figure
              key={i}
              className="group w-[250px] flex-none overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#222]">
                <Image
                  src={(p as { photo: string }).photo}
                  alt={p.name}
                  fill
                  sizes="250px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-[16px] font-semibold text-white">{p.name}</p>
                  <p className="mt-1 text-[12.5px] text-white/65">{p.role}</p>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">

        {withoutPhoto.length > 0 && (
          <p className="mt-8 text-[15px] text-white/55">
            <span className="font-semibold text-white/80">Also on campus: </span>
            {withoutPhoto.map((p, i) => (
              <span key={i}>
                {p.name} ({p.role}){i < withoutPhoto.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
