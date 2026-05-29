"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const ctxMaybe = canvasMaybe.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;
    const canvas: HTMLCanvasElement = canvasMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let animationId = 0;
    let startTime = performance.now();
    let disposed = false;

    function getFontFamily(): string {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-display")
        .trim();
      return v || "system-ui";
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTargets();
    }

    function buildTargets() {
      const off = document.createElement("canvas");
      off.width = Math.floor(width);
      off.height = Math.floor(height);
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      const fontSize = Math.min(width * 0.32, height * 0.55);
      const fontFamily = getFontFamily();
      offCtx.fillStyle = "#fff";
      offCtx.font = `900 ${fontSize}px ${fontFamily}, system-ui, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText("BCA", off.width / 2, off.height * 0.42);

      const data = offCtx.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.floor(Math.min(off.width, off.height) / 220));
      const targets: { x: number; y: number }[] = [];

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const idx = (y * off.width + x) * 4 + 3;
          if (data[idx] > 128) targets.push({ x, y });
        }
      }

      if (targets.length === 0) return;

      const desired = width < 700 ? 1100 : 2200;
      const stride = Math.max(1, Math.floor(targets.length / desired));
      const chosen = targets.filter((_, i) => i % stride === 0);

      particles = chosen.map((t) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() * 0.7 + 0.4) * Math.max(width, height);
        return {
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist,
          tx: t.x,
          ty: t.y,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.3 + 0.6,
          alpha: Math.random() * 0.5 + 0.35,
          phase: Math.random() * Math.PI * 2,
        };
      });

      if (prefersReducedMotion) {
        for (const p of particles) {
          p.x = p.tx;
          p.y = p.ty;
        }
      }
    }

    function draw(now: number) {
      if (disposed) return;
      const t = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const formation = Math.min(1, t / 4.5);
      const ease = 1 - Math.pow(1 - formation, 3);

      const themeColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--particle-color")
          .trim() || "255, 240, 215";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const driftX = Math.sin(t * 0.55 + p.phase) * 1.3;
        const driftY = Math.cos(t * 0.48 + p.phase * 1.3) * 1.3;
        const targetX = p.tx + driftX;
        const targetY = p.ty + driftY;

        if (!prefersReducedMotion) {
          const k = 0.04 + ease * 0.07;
          p.vx += (targetX - p.x) * k;
          p.vy += (targetY - p.y) * k;
          p.vx *= 0.8;
          p.vy *= 0.8;
          p.x += p.vx;
          p.y += p.vy;
        }

        const a = p.alpha * (0.25 + 0.75 * ease);
        const r = p.size;
        ctx.fillStyle = `rgba(${themeColor}, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    async function init() {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
      if (disposed) return;
      resize();
      startTime = performance.now();
      animationId = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    init();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
