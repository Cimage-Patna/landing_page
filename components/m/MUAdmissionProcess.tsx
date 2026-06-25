"use client";

/* "Admission Process" — red step timeline on the left, sticky scholarship
   "ticket" card on the right (stacks on mobile). Ported to CIMAGE's flow. */

const RED = "#e7000b";

type Step = { title: string; desc: string; cta?: { label: string; href: string } };

const STEPS: Step[] = [
  {
    title: "Apply Online",
    desc: "Submit your application to begin and secure a slot for the CIMAGE entrance assessment.",
    cta: { label: "Check Eligibility", href: "#apply" },
  },
  {
    title: "Entrance Exam",
    desc: "Appear for the CIMAGE entrance test — available in both written and online modes — to demonstrate your aptitude and readiness.",
  },
  {
    title: "Personal Interview",
    desc: "Showcase your skills, passion and potential in a one-on-one discussion with our admission panel.",
  },
  {
    title: "Block Your Seat",
    desc: "Confirm your admission and reserve your seat to kickstart your career journey at CIMAGE.",
  },
];

function Timeline() {
  return (
    <div className="flex w-full max-w-[647px] flex-col gap-7">
      {STEPS.map((s, i) => {
        const last = i === STEPS.length - 1;
        const highlight = i === 0;
        return (
          <div key={i} className="flex gap-7">
            {/* rail: dot + connecting line */}
            <div className="relative w-6 shrink-0 self-stretch">
              <div
                className={`relative z-10 flex size-6 shrink-0 items-center justify-center ${highlight ? "scale-110" : ""}`}
                aria-hidden="true"
              >
                <span className="absolute inset-0 rounded-full" style={{ backgroundColor: "rgba(231,0,11,0.2)" }} />
                <span className="relative size-3.5 rounded-full" style={{ backgroundColor: RED }} />
              </div>
              {!last && (
                <div
                  className="absolute left-1/2 w-px -translate-x-1/2"
                  aria-hidden="true"
                  style={{ top: 12, height: "calc(100% + 1.75rem)", backgroundColor: RED }}
                />
              )}
            </div>

            {/* content */}
            <div className="min-w-0 flex-1 pb-1">
              {highlight ? (
                <div className="rounded-md border p-4" style={{ borderColor: RED, backgroundColor: "rgba(231,0,11,0.05)" }}>
                  <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-medium leading-normal text-[#090909]">{s.title}</h3>
                    <p className="text-base font-normal leading-normal text-[#525252]">{s.desc}</p>
                    {s.cta && (
                      <a
                        href={s.cta.href}
                        className="inline-flex w-fit items-center justify-center rounded border border-[#d4d4d4] px-3 py-2 text-base font-normal text-[#090909] transition-colors hover:bg-[#f5f5f5]"
                      >
                        {s.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-0.5">
                  <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-medium leading-normal text-[#090909]">{s.title}</h3>
                    <p className="text-base font-normal leading-normal text-[#525252]">{s.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Ticket() {
  return (
    <div className="mu-adm-ticket w-full max-w-[583px]">
      <div className="relative flex min-h-[282px] flex-col justify-center px-8 py-10 sm:px-10 sm:py-11 lg:px-12">
        <h3 className="text-xl font-semibold leading-snug text-[#090909]">
          Admissions Made Simple: <span style={{ color: RED }}>Talk to Our Team</span>
        </h3>
        <div className="mt-[18px] h-px w-full max-w-[390px] border-t border-dashed border-[#090909]/20" aria-hidden="true" />
        <p className="mt-[18px] text-base font-normal leading-normal text-[#404040]">
          From choosing the right course to understanding the fees and entrance process — our admissions team guides you through every step.
        </p>
        <p className="mt-4 text-sm font-normal leading-relaxed text-[#737373]">
          To apply or get your questions answered, register or speak with our admissions team.
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("apply:open"))}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: RED }}
        >
          Register to Apply
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MUAdmissionProcess() {
  return (
    <section
      id="admission-process"
      className="w-full scroll-mt-24 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-20"
      aria-labelledby="admission-process-heading"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:gap-[60px]">
        <header className="max-w-[680px] text-[#090909]">
          <h2
            id="admission-process-heading"
            className="text-[32px] font-semibold leading-normal sm:text-[36px] lg:text-[40px]"
          >
            Admission<span style={{ color: RED }}> Process</span>
          </h2>
          <p className="mt-5 text-base font-normal leading-normal text-[#525252]">
            A simple, transparent journey from application to admission.
          </p>
        </header>

        {/* desktop: timeline + sticky ticket */}
        <div className="hidden w-full lg:grid lg:grid-cols-[minmax(0,1fr)_583px] lg:items-start lg:gap-12 xl:gap-16">
          <Timeline />
          <div className="sticky top-28 w-full max-w-[583px]">
            <Ticket />
          </div>
        </div>

        {/* mobile: stacked */}
        <div className="flex flex-col gap-10 lg:hidden">
          <Timeline />
          <div className="mx-auto w-full max-w-[583px]">
            <Ticket />
          </div>
        </div>
      </div>
    </section>
  );
}
