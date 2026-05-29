"use client";

import { useState } from "react";

/**
 * Foreground cutout of a student, sitting on the iso-lab floor in the hero.
 *
 * Production mode: drop `public/hero/student-3d.webp` (transparent background,
 * ideally 800x1200 portrait, 3D-rendered). The <img> picks it up automatically.
 *
 * Until the asset is dropped in, an inline SVG placeholder renders so the
 * composition still reads. The SVG is intentionally simple — it is NOT the
 * final art; it is a stand-in.
 */
export default function HeroStudent() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] flex justify-end items-end"
    >
      <div className="relative w-[58vw] max-w-[520px] sm:w-[42vw] sm:max-w-[440px] md:w-[36vw] md:max-w-[520px] mr-[2vw] mb-0 hero-student-float">
        {/* Floor shadow ellipse */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[80%] h-[6%] rounded-[50%] bg-black/70 blur-2xl" />

        {/* Real image (drop the file into public/hero/student-3d.webp) */}
        {!imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/hero/student-3d.webp"
            alt=""
            onError={() => setImgFailed(true)}
            className="relative w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
          />
        )}

        {/* Fallback stylized silhouette — used until the real render is dropped in */}
        {imgFailed && <StudentSilhouette />}
      </div>

      <style>{`
        @keyframes hero-student-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .hero-student-float { animation: hero-student-float 6.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-student-float { animation: none; }
        }
      `}</style>
    </div>
  );
}

/** Stylized stand-in. Not the final art — replace with the real 3D render. */
export function StudentSilhouette() {
  return (
    <svg
      viewBox="0 0 400 600"
      className="relative w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
    >
      <defs>
        <linearGradient id="hs-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#2a2d36" />
          <stop offset="55%"  stopColor="#16181f" />
          <stop offset="100%" stopColor="#0a0b10" />
        </linearGradient>
        <linearGradient id="hs-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7a553a" />
          <stop offset="100%" stopColor="#3a2718" />
        </linearGradient>
        <linearGradient id="hs-laptop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f5a524" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#b07314" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="hs-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="rgba(245,165,36,0.6)" />
          <stop offset="100%" stopColor="rgba(245,165,36,0)" />
        </linearGradient>
      </defs>

      {/* Backpack strap — back layer */}
      <path
        d="M 250 230 Q 280 250 270 320 L 250 320 Q 255 260 235 240 Z"
        fill="#0d0f14"
      />

      {/* Torso (hoodie) */}
      <path
        d="M 120 280
           Q 110 260 140 240
           Q 170 225 200 225
           Q 230 225 260 240
           Q 290 260 280 285
           L 295 480
           Q 295 510 270 520
           L 130 520
           Q 105 510 105 480 Z"
        fill="url(#hs-body)"
      />

      {/* Hood drape behind head */}
      <path
        d="M 145 195 Q 200 165 255 195 Q 270 220 250 240 Q 200 220 150 240 Q 130 220 145 195 Z"
        fill="#1a1c24"
      />

      {/* Head */}
      <ellipse cx="200" cy="175" rx="48" ry="55" fill="url(#hs-face)" />

      {/* Hair */}
      <path
        d="M 152 165 Q 165 130 200 125 Q 240 125 250 160 Q 240 150 220 152 Q 200 145 180 152 Q 165 158 152 165 Z"
        fill="#0a0a0a"
      />

      {/* Rim light on right side of face */}
      <path
        d="M 240 150 Q 248 180 240 215 L 232 215 Q 240 180 232 152 Z"
        fill="url(#hs-rim)"
        opacity="0.45"
      />

      {/* Neck shadow */}
      <rect x="186" y="218" width="28" height="20" fill="#2a1c10" />

      {/* Arms holding a laptop */}
      <path
        d="M 110 320 Q 100 360 130 400 L 165 410 L 165 380 L 140 365 Q 130 340 140 320 Z"
        fill="#1a1c24"
      />
      <path
        d="M 290 320 Q 300 360 270 400 L 235 410 L 235 380 L 260 365 Q 270 340 260 320 Z"
        fill="#1a1c24"
      />

      {/* Laptop in hands */}
      <rect x="145" y="395" width="110" height="60" rx="4" fill="#0a0a0a" stroke="rgba(245,165,36,0.55)" strokeWidth="1" />
      <rect x="152" y="402" width="96" height="46" fill="url(#hs-laptop)" />
      <rect x="140" y="450" width="120" height="6" rx="2" fill="#16181f" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />

      {/* Hoodie front pocket seam */}
      <path
        d="M 145 360 Q 200 380 255 360"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.2"
      />

      {/* Chest BCA badge */}
      <g transform="translate(175,290)">
        <rect x="0" y="0" width="50" height="22" rx="3" fill="rgba(245,165,36,0.18)" stroke="rgba(245,165,36,0.7)" strokeWidth="0.8" />
        <text x="25" y="16" textAnchor="middle" fontFamily="system-ui" fontWeight="900" fontSize="13" fill="rgba(245,165,36,0.95)">BCA</text>
      </g>

      {/* Subtle ambient occlusion at base */}
      <ellipse cx="200" cy="520" rx="100" ry="8" fill="rgba(0,0,0,0.55)" />
    </svg>
  );
}
