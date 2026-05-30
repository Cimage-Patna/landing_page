/**
 * Accreditation + partner badges shown under the hero headline.
 * Each badge sits in a uniform square white chip so they all read at the same
 * size and weight — a clean, professional row regardless of source aspect.
 * Files live at public/badges/.
 */
const BADGES = [
  { src: "/badges/aicte.webp", alt: "AICTE Approved" },
  { src: "/badges/naac.webp", alt: "NAAC B++ Accredited" },
  { src: "/badges/affiliation.webp", alt: "Permanent Affiliation — Granted by Govt. of Bihar" },
  { src: "/badges/iitb.webp", alt: "IIT Bombay Super Resource Centre" },
  { src: "/badges/gfe.png", alt: "Google for Education Partner" },
];

export default function HeroBadges() {
  return (
    <div className="mt-7 flex items-center justify-between gap-2 sm:justify-center sm:gap-4">
      {BADGES.map((b) => (
        <div
          key={b.src}
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-md ring-1 ring-black/[0.04] sm:h-24 sm:w-24"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.src}
            alt={b.alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
