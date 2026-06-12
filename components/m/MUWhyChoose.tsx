import { copy } from "@/lib/copy";
import { Reveal } from "./ui";

function Icon({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "rank":
      return (
        <svg {...common}>
          <path d="M12 15l-3 6 3-1.5L15 21l-3-6" />
          <circle cx="12" cy="9" r="6" />
          <path d="M12 6v3l2 1" />
        </svg>
      );
    case "lab":
      return (
        <svg {...common}>
          <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
          <path d="M7 15h10" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M2 20h20" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
  }
}

/* MU .bentoSection — black band, mixed-size tiles, a featured headline
   tile plus feature cards. */
export default function MUWhyChoose() {
  const w = copy.whyChoose;

  return (
    <section id="why" className="border-y border-[#1e1e1e] bg-[#090909] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid auto-rows-[minmax(170px,auto)] grid-cols-2 gap-4 lg:grid-cols-4">
          {/* featured headline tile (spans) */}
          <Reveal className="col-span-2 flex flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-7 lg:row-span-2">
            <div>
              <h2 className="mu-serif text-[2rem] leading-[1.06] sm:text-[2.8rem]">
                <span className="mu-gradient-text">
                  {w.title}
                  <span className="italic">{w.titleAccent}</span>
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-[15px] text-white/55">
                Six reasons Bihar&apos;s students have made us their first IT &amp; Management pick
                for 17+ years.
              </p>
            </div>
          </Reveal>

          {w.items.map((item, i) => (
            <Reveal
              key={i}
              delay={(i % 4) * 0.05}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141414] p-6 transition-colors hover:border-[#fad133]/40"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#fad133]"
                style={{ background: "rgba(250,209,51,0.12)" }}
              >
                <Icon name={item.icon} />
              </span>
              <div className="mt-6">
                <h3 className="text-[18px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/55">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
