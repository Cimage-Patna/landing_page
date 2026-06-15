/* "Recognised by" accreditation band, right under the hero. A clean credential
   bar: equal cells split by hairline dividers (no boxes/cards around the logos),
   each logo height-matched and centred in its cell. Logos are pre-trimmed to
   their content so they sit consistently. */
// `seal` = the portrait seal+text badges; they render small at a shared height,
// so they get a larger cap to match the wider wordmark logos optically. `scale`
// gives a per-logo optical nudge for ones that still read small.
const ITEMS: { src: string; alt: string; label: string; seal?: boolean; scale?: number }[] = [
  { src: "/badges/aicte-n.png", alt: "AICTE", label: "Approved", seal: true, scale: 1.2 },
  { src: "/badges/naac-n.png", alt: "NAAC", label: "B++ Accredited", seal: true, scale: 1.4 },
  { src: "/badges/affiliation-n.png", alt: "Permanent Affiliation", label: "Permanent Affiliation", seal: true },
  { src: "/badges/iitb-n.png", alt: "IIT Bombay", label: "Super Resource Centre", seal: true },
  { src: "/badges/gfe-g.png", alt: "Google for Education", label: "Google for Education", seal: true, scale: 1.3 },
  { src: "/badges/aws.svg", alt: "Amazon Web Services", label: "AWS Academy" },
];

export default function MURecognised() {
  return (
    <section className="mu-recog">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <p className="mu-recog-eyebrow">Approved &amp; Recognised by</p>
        <span className="mu-recog-rule" aria-hidden="true" />

        <div className="mu-recog-row">
          {ITEMS.map((it) => (
            <div key={it.alt} className="mu-recog-item">
              <span className={`mu-recog-logobox${it.seal ? " seal" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  alt={it.alt}
                  style={it.scale ? { transform: `scale(${it.scale})` } : undefined}
                />
              </span>
              <span className="mu-recog-label">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
