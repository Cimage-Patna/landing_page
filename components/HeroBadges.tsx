/**
 * Accreditation badge strip under the hero headline — the official artwork
 * pulled from the live site (AICTE, NAAC B++, Permanent Affiliation, IIT Bombay).
 * Source: public/accreditation-badges.webp (705x173, transparent — designed to
 * sit on a dark background).
 */
export default function HeroBadges() {
  return (
    <div className="mt-7 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/accreditation-badges.webp"
        alt="AICTE Approved · NAAC B++ Accredited · Permanent Affiliation granted by Govt. of Bihar · IIT Bombay Super Resource Centre"
        width={705}
        height={173}
        className="h-auto w-full max-w-[300px] opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:max-w-[420px]"
      />
    </div>
  );
}
