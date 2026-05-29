"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export default function TiltCard({ children, className, intensity = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 22, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 170, damping: 22, mass: 0.3 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity * 0.7, -intensity * 0.7]);
  const lightX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const lightY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: useTransform([lightX, lightY], ([lx, ly]) =>
            `radial-gradient(circle at ${lx} ${ly}, rgba(245,165,36,0.12), transparent 50%)`
          ) as unknown as string,
        }}
      />
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
