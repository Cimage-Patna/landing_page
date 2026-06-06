"use client";

import { useEffect, useRef } from "react";
import { BIHAR_PATH, BIHAR_VB } from "@/lib/biharPath";
import { asset } from "@/lib/assets";

// Tiles live at public/placed/p1.jpg .. p161.jpg
const TILE_SRCS = Array.from({ length: 161 }, (_, i) => asset(`/placed/p${i + 1}.jpg`));

// Looping choreography (seconds): flow → converge → hold → disperse → repeat
const LEAD = 1.0; // brief free-flow before the first assembly
const CONVERGE = 2.8; // photos fly into the Bihar outline
const HOLD_FULL = 2.6; // map complete — the pause before it replays
const DISPERSE = 2.0; // photos drift back out
const HOLD_EMPTY = 0.8; // short drift before reconverging
const CYCLE = CONVERGE + HOLD_FULL + DISPERSE + HOLD_EMPTY;

const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

export default function BiharMosaic() {
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
      const pad = Math.min(W, H) * 0.05;
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
      const cols = W < 560 ? 12 : 22;
      const tileSize = Math.max(14, shapeW / cols);
      const slots = sampleSlots(tileSize);
      const n = images.length;
      tiles = slots.map((sl, i) => ({
        tx: sl.x, ty: sl.y, size: tileSize,
        bx: -0.1 * W + Math.random() * 1.2 * W,
        by: -0.1 * H + Math.random() * 1.2 * H,
        amp: 18 + Math.random() * 46,
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

    // Looping assembly progress: 0 = dispersed/flowing, 1 = map complete.
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
      // slow global "current" that carries the flowing photos
      const curX = Math.sin(t * 0.18) * W * 0.07;
      const curY = Math.cos(t * 0.15) * H * 0.05;

      for (const tile of tiles) {
        // free-flowing position (dispersed state)
        const flowX = tile.bx + Math.cos(t * tile.spd + tile.ph) * tile.amp + curX;
        const flowY = tile.by + Math.sin(t * tile.spd * 0.9 + tile.ph) * tile.amp + curY;
        // settled position with a tiny ambient bob
        const slotX = tile.tx + Math.sin(t * 0.5 + tile.ph) * 3;
        const slotY = tile.ty + Math.cos(t * 0.45 + tile.ph * 1.3) * 3;
        const px = flowX + (slotX - flowX) * fit;
        const py = flowY + (slotY - flowY) * fit;

        const s = tile.size;
        const x = px - s / 2, y = py - s / 2;
        ctx.save();
        roundedClip(x, y, s, Math.max(2, s * 0.16));
        ctx.clip();
        const img = drawable(tile.img);
        if (img) {
          ctx.globalAlpha = fadeIn;
          ctx.drawImage(img, x, y, s, s);
        }
        // no placeholder fill — gaps stay transparent
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Bihar outline strengthens as photos assemble, fades as they scatter
      const mapA = (reduce ? 0.4 : Math.min(1, fit * 1.15)) * 0.42;
      if (mapA > 0.01) {
        ctx.save();
        ctx.translate(tf.ox, tf.oy);
        ctx.scale(tf.s, tf.s);
        ctx.lineWidth = 1.5 / tf.s;
        ctx.strokeStyle = `rgba(245,165,36,${mapA})`;
        ctx.stroke(path);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    let imagesReady = false;
    let inView = false;
    let started = false;

    // Kick off the loop only once both the images are decoded AND the section
    // has scrolled into view — so the convergence plays on arrival.
    function tryStart() {
      if (started || disposed || !imagesReady || !inView) return;
      started = true;
      start = 0; // restart the choreography clock from the moment it appears
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
      images.map((im) =>
        im.decode ? im.decode().catch(() => undefined) : Promise.resolve(),
      ),
    ).then(() => {
      if (disposed) return;
      imagesReady = true;
      resize(); // size the canvas + build tiles; does not draw yet
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
    <section className="bg-black px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
          Our placed students
        </p>
        <h2 className="mt-3 font-display text-4xl font-black text-white sm:text-6xl">
          Bihar&apos;s talent, placed.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          Every tile is a real CIMAGE student placed at a top company — together,
          they map the state we&apos;re proud of.
        </p>
        <div className="mt-10">
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
