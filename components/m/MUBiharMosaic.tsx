"use client";

import { useEffect, useRef } from "react";
import { BIHAR_PATH, BIHAR_VB } from "@/lib/biharPath";
import { asset } from "@/lib/assets";

/* MU-styled, immersive port of the "/" BiharMosaic: 161 placed-student photos
   converge into the shape of Bihar, hold, disperse and loop. Deep dark band,
   ambient yellow glow, denser tile map, MU-gold outline + typography. */

const TILE_SRCS = Array.from({ length: 161 }, (_, i) => asset(`/placed/p${i + 1}.jpg`));

// Looping choreography (seconds): flow → converge → hold → disperse → repeat
const LEAD = 0.8;
const CONVERGE = 3.0;
const HOLD_FULL = 3.0;
const DISPERSE = 2.0;
const HOLD_EMPTY = 0.7;
const CYCLE = CONVERGE + HOLD_FULL + DISPERSE + HOLD_EMPTY;

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export default function MUBiharMosaic({ hideHeader = false }: { hideHeader?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const ctxMaybe = canvasMaybe.getContext("2d");
    if (!ctxMaybe) return;
    const canvas: HTMLCanvasElement = canvasMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = new Path2D(BIHAR_PATH);

    type Tile = {
      tx: number; ty: number; size: number;
      bx: number; by: number; amp: number; spd: number; ph: number;
      img: number;
    };

    let W = 0, H = 0, dpr = 1;
    let tiles: Tile[] = [];
    let tf = { s: 1, ox: 0, oy: 0 };
    let raf = 0, start = 0, disposed = false;

    const images: HTMLImageElement[] = TILE_SRCS.map((src) => {
      const im = new Image();
      im.src = src;
      return im;
    });
    const drawable = (i: number) => {
      const im = images[i];
      return im && im.complete && im.naturalWidth > 0 ? im : null;
    };

    function computeTransform() {
      const pad = Math.min(W, H) * 0.04;
      const s = Math.min((W - 2 * pad) / BIHAR_VB.w, (H - 2 * pad) / BIHAR_VB.h);
      tf = { s, ox: (W - BIHAR_VB.w * s) / 2, oy: (H - BIHAR_VB.h * s) / 2 };
    }

    function sampleSlots(tileSize: number): { x: number; y: number }[] {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(W));
      off.height = Math.max(1, Math.floor(H));
      const o = off.getContext("2d");
      if (!o) return [];
      o.translate(tf.ox, tf.oy);
      o.scale(tf.s, tf.s);
      o.fillStyle = "#fff";
      o.fill(path);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const slots: { x: number; y: number }[] = [];
      for (let y = tileSize / 2; y < H; y += tileSize) {
        for (let x = tileSize / 2; x < W; x += tileSize) {
          const idx = ((y | 0) * off.width + (x | 0)) * 4 + 3;
          if (data[idx] > 128) slots.push({ x, y });
        }
      }
      return slots;
    }

    function build() {
      computeTransform();
      const shapeW = BIHAR_VB.w * tf.s;
      // denser map than the "/" version for a richer, more immersive mosaic
      const cols = W < 560 ? 16 : 30;
      const tileSize = Math.max(12, shapeW / cols);
      const slots = sampleSlots(tileSize);
      const n = images.length;
      tiles = slots.map((sl, i) => ({
        tx: sl.x, ty: sl.y, size: tileSize,
        bx: -0.15 * W + Math.random() * 1.3 * W,
        by: -0.15 * H + Math.random() * 1.3 * H,
        amp: 20 + Math.random() * 52,
        spd: 0.2 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        img: i % n,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function roundedClip(x: number, y: number, s: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + s, y, x + s, y + s, r);
      ctx.arcTo(x + s, y + s, x, y + s, r);
      ctx.arcTo(x, y + s, x, y, r);
      ctx.arcTo(x, y, x + s, y, r);
      ctx.closePath();
    }

    function assembly(t: number): number {
      if (reduce) return 1;
      if (t < LEAD) return 0;
      const tc = (t - LEAD) % CYCLE;
      if (tc < CONVERGE) return easeInOut(tc / CONVERGE);
      if (tc < CONVERGE + HOLD_FULL) return 1;
      if (tc < CONVERGE + HOLD_FULL + DISPERSE)
        return easeInOut(1 - (tc - CONVERGE - HOLD_FULL) / DISPERSE);
      return 0;
    }

    function draw(now: number) {
      if (disposed) return;
      if (!start) start = now;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      const fit = assembly(t);
      const fadeIn = Math.min(1, t / 0.6);
      const curX = Math.sin(t * 0.18) * W * 0.07;
      const curY = Math.cos(t * 0.15) * H * 0.05;

      // settled tiles get a soft glow as the map completes
      ctx.shadowColor = `rgba(250, 209, 51, ${0.35 * fit})`;
      ctx.shadowBlur = 16 * fit;

      for (const tile of tiles) {
        const flowX = tile.bx + Math.cos(t * tile.spd + tile.ph) * tile.amp + curX;
        const flowY = tile.by + Math.sin(t * tile.spd * 0.9 + tile.ph) * tile.amp + curY;
        const slotX = tile.tx + Math.sin(t * 0.5 + tile.ph) * 3;
        const slotY = tile.ty + Math.cos(t * 0.45 + tile.ph * 1.3) * 3;
        const px = flowX + (slotX - flowX) * fit;
        const py = flowY + (slotY - flowY) * fit;

        const s = tile.size;
        const x = px - s / 2, y = py - s / 2;
        ctx.save();
        roundedClip(x, y, s, Math.max(2, s * 0.18));
        ctx.clip();
        const img = drawable(tile.img);
        if (img) {
          ctx.globalAlpha = fadeIn;
          ctx.drawImage(img, x, y, s, s);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Bihar outline (MU gold) strengthens as photos assemble
      const mapA = (reduce ? 0.5 : Math.min(1, fit * 1.15)) * 0.5;
      if (mapA > 0.01) {
        ctx.save();
        ctx.translate(tf.ox, tf.oy);
        ctx.scale(tf.s, tf.s);
        ctx.lineWidth = 1.6 / tf.s;
        ctx.strokeStyle = `rgba(250, 209, 51, ${mapA})`;
        ctx.stroke(path);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    let imagesReady = false;
    let inView = false;
    let started = false;

    function tryStart() {
      if (started || disposed || !imagesReady || !inView) return;
      started = true;
      start = 0;
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            inView = true;
            tryStart();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(canvas);

    Promise.allSettled(
      images.map((im) => (im.decode ? im.decode().catch(() => undefined) : Promise.resolve())),
    ).then(() => {
      if (disposed) return;
      imagesReady = true;
      resize();
      tryStart();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <section className={hideHeader ? "relative overflow-hidden py-3" : "mu-bihar py-20 text-center sm:py-28"}>
      {!hideHeader && <div className="mu-bihar-glow" aria-hidden="true" />}
      <div className="relative z-[1] mx-auto max-w-[1080px] px-5 text-center sm:px-8">
        {!hideHeader && (
          <>
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#fad133]">
              Our placed students
            </p>
            <h2 className="mt-4 text-[2.1rem] font-semibold leading-[1.08] text-white sm:text-[3.2rem]">
              Bihar&apos;s talent, <span className="mu-serif italic mu-gradient-text">placed.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60">
              Every tile is a real CIMAGE student placed at a top company — together, they map the
              state we&apos;re proud of.
            </p>
          </>
        )}
        <div className={hideHeader ? "relative" : "relative mt-12"}>
          <canvas
            ref={canvasRef}
            className="mx-auto block aspect-[1000/722] w-full"
            role="img"
            aria-label="Map of Bihar formed from photographs of placed CIMAGE students"
          />
        </div>
      </div>
    </section>
  );
}
