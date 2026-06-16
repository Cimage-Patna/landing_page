import { copy } from "@/lib/copy";
import MULeadForm from "./MULeadForm";

export default function MUApply() {
  const a = copy.apply;

  return (
    <section id="apply" className="bg-[#fefcf5] py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Info column */}
        <div>
          <span className="mu-eyebrow">{a.infoEyebrow}</span>
          <h2 className="mu-serif mt-5 text-[2.2rem] leading-[1.08] text-[#090909] sm:text-[3rem]">
            {a.infoTitle}
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#525252]">{a.infoDesc}</p>
          <ul className="mt-7 space-y-3.5">
            {a.infoPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#404040]">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[#090909]"
                  style={{ background: "var(--mu-yellow)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="mu-card p-7 sm:p-9">
          <MULeadForm />
        </div>
      </div>
    </section>
  );
}
