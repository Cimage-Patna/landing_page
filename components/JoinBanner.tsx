import Reveal from "./Reveal";

/**
 * Full-bleed auto-looping text video, fused into the page. The clip is black
 * text on white, so we invert it in dark mode (white bg → page-dark, text →
 * white); the background matches the section so it reads as one colour, no card,
 * no play button. Spans the full screen width.
 */
export default function JoinBanner() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <Reveal>
        <video
          className="join-video block aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/text-poster.webp"
          aria-hidden="true"
        >
          <source src="/text.mp4" type="video/mp4" />
        </video>
      </Reveal>
      <style>{`
        .join-video { filter: invert(1); }
        [data-theme="light"] .join-video { filter: none; }
      `}</style>
    </section>
  );
}
