import Reveal from "./Reveal";
import LazyVideo from "./LazyVideo";
import { asset } from "@/lib/assets";

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
        <LazyVideo
          src={asset("/text.mp4")}
          poster={asset("/text-poster.webp")}
          className="join-video block aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
        />
      </Reveal>
      <style>{`
        .join-video { filter: invert(1); }
        [data-theme="light"] .join-video { filter: none; }
      `}</style>
    </section>
  );
}
