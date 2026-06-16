/* Footer brand marquee — the CIMAGE logo scrolling across a thin transparent
   strip just above the footer. Decorative; reuses the shared .mu-marquee
   animation. */
const REPEAT = 14;

export default function MUBrandMarquee() {
  return (
    <section className="mu-brandmq" aria-hidden="true">
      <div className="mu-brandmq-band">
        <div className="mu-marquee">
          <div className="mu-marquee-track">
            {Array.from({ length: REPEAT * 2 }).map((_, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src="/cimage-logo.webp" alt="CIMAGE" className="mu-brandmq-logo" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
