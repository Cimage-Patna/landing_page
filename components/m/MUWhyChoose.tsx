"use client";

import { useRef, type CSSProperties } from "react";

/* "Why Choose CIMAGE" — exact replica of the upGrad "Built Different" feature
   grid: a 4-col bordered grid where each cell has an animated icon, on-hover
   grid-pattern + glow, a growing left accent bar, and a 3D cursor tilt.
   Keyed to the MU theme — yellow as --primary, on the dark band. */

const PRIMARY = "#fad133";

type Feature = { icon: string; title: string; desc: string };

// Real CIMAGE strengths; icons reuse upGrad's animated gif set (swap for own).
const FEATURES: Feature[] = [
  {
    icon: "https://sot.upgrad.com/assets/brain.gif",
    title: "Industry-Aligned Curriculum",
    desc: "Java, Python, DBMS, Cloud & AI — the syllabus is rebuilt every year against what the IT market is actually hiring for.",
  },
  {
    icon: "https://sot.upgrad.com/assets/system.gif",
    title: "IIT Bombay E-Yantra Lab",
    desc: "The only BCA college in Bihar with an IIT Bombay-certified robotics & AI lab on campus.",
  },
  {
    icon: "https://sot.upgrad.com/assets/intern.gif",
    title: "Wipro Centre of Excellence",
    desc: "An active MoU with Wipro Ltd. — a signed industry certification on your CV before you graduate.",
  },
  {
    icon: "https://sot.upgrad.com/assets/placement.gif",
    title: "Placement-First Training",
    desc: "Aptitude, mock interviews & GD prep from year one — 317 TCS offers came in a single drive.",
  },
  {
    icon: "https://sot.upgrad.com/assets/map.gif",
    title: "Google for Education Partner",
    desc: "The only Google for Education partner in the state — you train on the same tools the industry runs on.",
  },
  {
    icon: "https://sot.upgrad.com/assets/career.gif",
    title: "13,500+ Alumni Network",
    desc: "Alumni placed at TCS, ICICI, EY and beyond — from Patna to London, Dubai and Zurich.",
  },
  {
    icon: "https://sot.upgrad.com/assets/root.gif",
    title: "Language Lab Support",
    desc: "A full year of English-communication training so the language gap is closed by placement season.",
  },
  {
    icon: "https://sot.upgrad.com/assets/scholar.gif",
    title: "Scholarships & Recognition",
    desc: "Merit scholarships and flexible financing — AICTE-approved and NAAC-accredited.",
  },
];

function FeatureCard({ f }: { f: Feature }) {
  const tilt = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tilt.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${-py * 9}deg) rotateY(${px * 9}deg)`;
  };
  const reset = () => {
    if (tilt.current) tilt.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className="group/feature relative flex flex-col overflow-hidden bg-white py-10 [perspective:1000px]"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {/* hover grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--primary) 12%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--primary) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover/feature:opacity-100"
        style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--primary) 7%, transparent), transparent)" }}
      />
      {/* left accent bar */}
      <div className="absolute left-0 top-1/2 h-8 w-1 origin-center -translate-y-1/2 rounded-br-full rounded-tr-full bg-[#d4d4d4] transition-all duration-300 group-hover/feature:h-20">
        <div
          className="absolute inset-0 rounded-br-full rounded-tr-full opacity-0 transition-opacity duration-300 group-hover/feature:opacity-100"
          style={{ background: "var(--primary)", boxShadow: "0 0 20px color-mix(in srgb, var(--primary) 60%, transparent)" }}
        />
      </div>

      {/* tilt content */}
      <div
        ref={tilt}
        className="relative flex flex-col items-center px-8 transition-transform duration-150 [transform-style:preserve-3d]"
      >
        <div style={{ transform: "translateZ(60px)" }} className="flex flex-col items-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.icon}
              alt={f.title}
              width={112}
              height={112}
              className="h-full w-full select-none object-contain transition-transform duration-300 group-hover/feature:scale-110"
            />
          </div>
          <h3 className="text-center text-lg font-bold">
            <span className="inline-block text-[#171717] transition duration-300 group-hover/feature:translate-x-1">
              {f.title}
            </span>
          </h3>
          <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-[#595959]">{f.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function MUWhyChoose() {
  return (
    <section
      id="why"
      className="bg-white py-16 sm:py-24"
      style={{ ["--primary" as string]: PRIMARY } as CSSProperties}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#e5e5e5] bg-[#e5e5e5] md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
