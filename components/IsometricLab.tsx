"use client";

/**
 * Isometric lab scene that sits behind the particle hero.
 * Pure SVG — no image asset, no WebGL. Evokes a tech lab (monitors,
 * server rack, robotic arm — nodding to the IIT-B E-Yantra differentiator).
 *
 * Geometry uses true 30° isometric projection so cubes & planes hold
 * their depth instead of looking like flat trapezoids.
 */

const COS30 = 0.8660254;
const SIN30 = 0.5;

// World axes: +x right, +y back (into screen), +z up.
// Screen origin chosen so the scene sits in the lower-middle of the 1600x900 viewBox.
const OX = 800;
const OY = 620;

function p(x: number, y: number, z: number): string {
  const sx = OX + (x - y) * COS30;
  const sy = OY + (x + y) * SIN30 - z;
  return `${sx.toFixed(1)},${sy.toFixed(1)}`;
}

function poly(...points: string[]): string {
  return points.join(" ");
}

// ─────────────────────────────────────────────────────────────
// Reusable iso primitives
// ─────────────────────────────────────────────────────────────

/** A flat horizontal rectangle on the floor (or any z plane). */
function planeXY(
  cx: number, cy: number, cz: number, w: number, d: number,
): string {
  const hw = w / 2, hd = d / 2;
  return poly(
    p(cx - hw, cy - hd, cz),
    p(cx + hw, cy - hd, cz),
    p(cx + hw, cy + hd, cz),
    p(cx - hw, cy + hd, cz),
  );
}

/** Cuboid faces: returns top, left (west, x-min face), right (south, y-min face). */
function box(
  cx: number, cy: number, w: number, d: number, baseZ: number, h: number,
) {
  const hw = w / 2, hd = d / 2;
  const top = poly(
    p(cx - hw, cy - hd, baseZ + h),
    p(cx + hw, cy - hd, baseZ + h),
    p(cx + hw, cy + hd, baseZ + h),
    p(cx - hw, cy + hd, baseZ + h),
  );
  // Right face (we see the +x side and the -y side as we look from front-left)
  const rightFace = poly(
    p(cx + hw, cy - hd, baseZ),
    p(cx + hw, cy + hd, baseZ),
    p(cx + hw, cy + hd, baseZ + h),
    p(cx + hw, cy - hd, baseZ + h),
  );
  const frontFace = poly(
    p(cx - hw, cy - hd, baseZ),
    p(cx + hw, cy - hd, baseZ),
    p(cx + hw, cy - hd, baseZ + h),
    p(cx - hw, cy - hd, baseZ + h),
  );
  return { top, rightFace, frontFace };
}

// ─────────────────────────────────────────────────────────────
// Scene composition
// ─────────────────────────────────────────────────────────────

const FLOOR_HALF = 620;

// Three workstations along the back
const DESKS = [
  { cx: -340, cy: -260 },
  { cx:    0, cy: -260 },
  { cx:  340, cy: -260 },
];

const DESK_W = 220;
const DESK_D = 110;
const DESK_TOP_Z = 90;
const DESK_LEG_INSET = 8;

const MONITOR_W = 140;
const MONITOR_H = 80;
const MONITOR_THICK = 6;
const MONITOR_STAND_H = 18;
const MONITOR_BASE_Z = DESK_TOP_Z + MONITOR_STAND_H;

// Server rack at far left
const RACK = { cx: -520, cy: -120, w: 110, d: 90, h: 280 };

// Robotic arm base at right (E-Yantra nod)
const ARM = { cx: 430, cy: 80, baseW: 90, baseD: 90, baseH: 30 };

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function IsometricLab() {
  // Pre-compute back wall (the +y boundary of the floor)
  const wallH = 420;
  const wallY = FLOOR_HALF;
  const wallBack = poly(
    p(-FLOOR_HALF, wallY, 0),
    p( FLOOR_HALF, wallY, 0),
    p( FLOOR_HALF, wallY, wallH),
    p(-FLOOR_HALF, wallY, wallH),
  );
  const wallLeft = poly(
    p(-FLOOR_HALF, -FLOOR_HALF, 0),
    p(-FLOOR_HALF,  wallY, 0),
    p(-FLOOR_HALF,  wallY, wallH),
    p(-FLOOR_HALF, -FLOOR_HALF, wallH),
  );

  // Floor grid lines (in both iso directions)
  const gridStep = 80;
  const gridLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let g = -FLOOR_HALF; g <= FLOOR_HALF; g += gridStep) {
    // lines parallel to y axis (vary y, fix x = g)
    const a = p(g, -FLOOR_HALF, 0).split(",").map(Number);
    const b = p(g,  FLOOR_HALF, 0).split(",").map(Number);
    gridLines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
    // lines parallel to x axis (vary x, fix y = g)
    const c = p(-FLOOR_HALF, g, 0).split(",").map(Number);
    const d = p( FLOOR_HALF, g, 0).split(",").map(Number);
    gridLines.push({ x1: c[0], y1: c[1], x2: d[0], y2: d[1] });
  }

  // Window mullions on the back wall
  const windowCols = 6;
  const windowRows = 3;
  const winMargin = 80;
  const winLeftX = -FLOOR_HALF + winMargin;
  const winRightX = FLOOR_HALF - winMargin;
  const winBottomZ = 100;
  const winTopZ = wallH - 40;
  const winLines: string[] = [];
  for (let i = 0; i <= windowCols; i++) {
    const x = winLeftX + ((winRightX - winLeftX) * i) / windowCols;
    winLines.push(
      `M${p(x, wallY, winBottomZ)} L${p(x, wallY, winTopZ)}`,
    );
  }
  for (let j = 0; j <= windowRows; j++) {
    const z = winBottomZ + ((winTopZ - winBottomZ) * j) / windowRows;
    winLines.push(
      `M${p(winLeftX, wallY, z)} L${p(winRightX, wallY, z)}`,
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      data-themed="iso-lab"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.55 }}
      >
        <defs>
          <radialGradient id="iso-vignette" cx="50%" cy="55%" r="65%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5a524" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b07314" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="wall-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.55" />
          </linearGradient>
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Pulsing glow keyframes via CSS */}
          <style>{`
            @keyframes iso-pulse {
              0%, 100% { opacity: 0.55; }
              50%      { opacity: 0.95; }
            }
            @keyframes iso-blink {
              0%, 92%, 100% { opacity: 0.9; }
              94%           { opacity: 0.15; }
            }
            @keyframes iso-sweep {
              0%   { transform: translateX(-12px); }
              50%  { transform: translateX(12px); }
              100% { transform: translateX(-12px); }
            }
            .iso-screen-a { animation: iso-pulse 5.2s ease-in-out infinite; }
            .iso-screen-b { animation: iso-pulse 6.4s ease-in-out 0.6s infinite; }
            .iso-screen-c { animation: iso-pulse 4.8s ease-in-out 1.3s infinite; }
            .iso-rack-led { animation: iso-blink 3s ease-in-out infinite; }
            .iso-arm      { animation: iso-sweep 9s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
            @media (prefers-reduced-motion: reduce) {
              .iso-screen-a, .iso-screen-b, .iso-screen-c,
              .iso-rack-led, .iso-arm { animation: none; }
            }
          `}</style>
        </defs>

        {/* ── BACK WALLS ───────────────────────────────────────── */}
        <polygon points={wallBack} fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <polygon points={wallLeft} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Window grid on back wall */}
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none">
          {winLines.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* Faint city silhouette glimpsed through window — distant buildings */}
        <g stroke="rgba(245,165,36,0.18)" strokeWidth="1" fill="rgba(245,165,36,0.05)">
          <polygon points={poly(
            p(-380, wallY - 1, 120), p(-380, wallY - 1, 240),
            p(-300, wallY - 1, 240), p(-300, wallY - 1, 180),
            p(-240, wallY - 1, 180), p(-240, wallY - 1, 260),
            p(-160, wallY - 1, 260), p(-160, wallY - 1, 200),
            p( -60, wallY - 1, 200), p( -60, wallY - 1, 280),
            p(  40, wallY - 1, 280), p(  40, wallY - 1, 230),
            p( 140, wallY - 1, 230), p( 140, wallY - 1, 290),
            p( 240, wallY - 1, 290), p( 240, wallY - 1, 210),
            p( 340, wallY - 1, 210), p( 340, wallY - 1, 250),
            p( 420, wallY - 1, 250), p( 420, wallY - 1, 130),
            p(-380, wallY - 1, 130),
          )} />
        </g>

        {/* ── FLOOR ────────────────────────────────────────────── */}
        <polygon
          points={planeXY(0, 0, 0, FLOOR_HALF * 2, FLOOR_HALF * 2)}
          fill="rgba(255,255,255,0.02)"
        />
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          {gridLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>

        {/* ── SERVER RACK (back-left) ──────────────────────────── */}
        {(() => {
          const r = box(RACK.cx, RACK.cy, RACK.w, RACK.d, 0, RACK.h);
          const units = 8;
          const ledLines: string[] = [];
          for (let i = 1; i < units; i++) {
            const z = (RACK.h / units) * i;
            ledLines.push(
              `M${p(RACK.cx - RACK.w / 2, RACK.cy - RACK.d / 2, z)} L${p(RACK.cx + RACK.w / 2, RACK.cy - RACK.d / 2, z)}`,
            );
          }
          return (
            <g>
              <polygon points={r.frontFace} fill="rgba(20,22,28,0.85)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              <polygon points={r.rightFace} fill="rgba(10,12,16,0.85)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <polygon points={r.top}        fill="rgba(30,32,38,0.85)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" fill="none">
                {ledLines.map((d, i) => <path key={i} d={d} />)}
              </g>
              {/* Blinking status LEDs */}
              <g className="iso-rack-led">
                {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
                  const z = RACK.h * t;
                  const [cx, cy] = p(
                    RACK.cx + RACK.w / 2 - 14,
                    RACK.cy - RACK.d / 2,
                    z,
                  ).split(",").map(Number);
                  return <circle key={i} cx={cx} cy={cy} r="2" fill="#f5a524" />;
                })}
              </g>
            </g>
          );
        })()}

        {/* ── DESKS + MONITORS ─────────────────────────────────── */}
        {DESKS.map((d, idx) => {
          const desktop = box(d.cx, d.cy, DESK_W, DESK_D, 0, DESK_TOP_Z);
          // Monitor: thin slab standing on the desk
          const monitorBase = box(
            d.cx, d.cy - 20, MONITOR_W, MONITOR_THICK, MONITOR_BASE_Z, MONITOR_H,
          );
          // The visible "screen" is the front (-y) face of the monitor slab
          const screenFront = poly(
            p(d.cx - MONITOR_W / 2 + 4, d.cy - 20 - MONITOR_THICK / 2 - 0.5, MONITOR_BASE_Z + 4),
            p(d.cx + MONITOR_W / 2 - 4, d.cy - 20 - MONITOR_THICK / 2 - 0.5, MONITOR_BASE_Z + 4),
            p(d.cx + MONITOR_W / 2 - 4, d.cy - 20 - MONITOR_THICK / 2 - 0.5, MONITOR_BASE_Z + MONITOR_H - 6),
            p(d.cx - MONITOR_W / 2 + 4, d.cy - 20 - MONITOR_THICK / 2 - 0.5, MONITOR_BASE_Z + MONITOR_H - 6),
          );
          // Stand
          const stand = box(
            d.cx, d.cy - 20, 14, 14, DESK_TOP_Z, MONITOR_STAND_H,
          );
          // Legs
          const legW = 6;
          const legPositions: [number, number][] = [
            [d.cx - DESK_W / 2 + DESK_LEG_INSET, d.cy - DESK_D / 2 + DESK_LEG_INSET],
            [d.cx + DESK_W / 2 - DESK_LEG_INSET, d.cy - DESK_D / 2 + DESK_LEG_INSET],
            [d.cx - DESK_W / 2 + DESK_LEG_INSET, d.cy + DESK_D / 2 - DESK_LEG_INSET],
            [d.cx + DESK_W / 2 - DESK_LEG_INSET, d.cy + DESK_D / 2 - DESK_LEG_INSET],
          ];
          const screenClass = ["iso-screen-a", "iso-screen-b", "iso-screen-c"][idx % 3];
          return (
            <g key={idx}>
              {/* legs */}
              {legPositions.map(([lx, ly], li) => {
                const leg = box(lx, ly, legW, legW, 0, DESK_TOP_Z);
                return (
                  <g key={li}>
                    <polygon points={leg.frontFace} fill="rgba(40,42,50,0.85)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                    <polygon points={leg.rightFace} fill="rgba(25,27,33,0.85)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
                  </g>
                );
              })}
              {/* desk top slab */}
              <polygon points={desktop.frontFace} fill="rgba(35,37,45,0.85)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <polygon points={desktop.rightFace} fill="rgba(20,22,28,0.85)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
              <polygon points={desktop.top}       fill="rgba(50,52,60,0.9)"  stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
              {/* stand */}
              <polygon points={stand.frontFace} fill="rgba(25,27,33,0.9)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
              <polygon points={stand.rightFace} fill="rgba(15,17,22,0.9)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
              {/* monitor slab */}
              <polygon points={monitorBase.frontFace} fill="rgba(12,14,18,0.95)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <polygon points={monitorBase.rightFace} fill="rgba(8,10,14,0.95)"  stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
              <polygon points={monitorBase.top}       fill="rgba(20,22,28,0.95)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
              {/* glowing screen */}
              <polygon
                className={screenClass}
                points={screenFront}
                fill="url(#screen-glow)"
                filter="url(#soft-blur)"
              />
              <polygon
                className={screenClass}
                points={screenFront}
                fill="none"
                stroke="rgba(245,165,36,0.9)"
                strokeWidth="0.6"
              />
            </g>
          );
        })}

        {/* ── ROBOTIC ARM (E-Yantra nod) ───────────────────────── */}
        {(() => {
          const a = ARM;
          const armBase = box(a.cx, a.cy, a.baseW, a.baseD, 0, a.baseH);
          // pillar
          const pillar = box(a.cx, a.cy, 22, 22, a.baseH, 90);
          // joint sphere replaced with small cube
          const joint = box(a.cx, a.cy, 30, 30, a.baseH + 90, 18);
          // upper arm (angled rectangle approximated by a parallelogram)
          const armTop = poly(
            p(a.cx - 8, a.cy - 8, a.baseH + 108),
            p(a.cx + 8, a.cy - 8, a.baseH + 108),
            p(a.cx - 70, a.cy + 8, a.baseH + 70),
            p(a.cx - 86, a.cy + 8, a.baseH + 70),
          );
          // gripper
          const gripCx = a.cx - 78;
          const gripCy = a.cy + 0;
          const gripCz = a.baseH + 70;
          return (
            <g className="iso-arm">
              <polygon points={armBase.frontFace} fill="rgba(30,32,40,0.92)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              <polygon points={armBase.rightFace} fill="rgba(15,17,22,0.92)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <polygon points={armBase.top}       fill="rgba(45,47,55,0.92)" stroke="rgba(255,255,255,0.26)" strokeWidth="1" />
              <polygon points={pillar.frontFace} fill="rgba(40,42,50,0.92)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              <polygon points={pillar.rightFace} fill="rgba(20,22,28,0.92)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <polygon points={pillar.top}       fill="rgba(55,57,65,0.92)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
              <polygon points={joint.frontFace}  fill="rgba(50,52,60,0.95)" stroke="rgba(245,165,36,0.55)" strokeWidth="1" />
              <polygon points={joint.rightFace}  fill="rgba(30,32,40,0.95)" stroke="rgba(245,165,36,0.45)" strokeWidth="1" />
              <polygon points={joint.top}        fill="rgba(65,67,75,0.95)" stroke="rgba(245,165,36,0.65)" strokeWidth="1" />
              <polygon points={armTop} fill="rgba(40,42,50,0.92)" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
              {/* gripper cube */}
              {(() => {
                const g = box(gripCx, gripCy, 16, 16, gripCz - 8, 16);
                return (
                  <>
                    <polygon points={g.frontFace} fill="rgba(60,62,70,0.95)" stroke="rgba(245,165,36,0.7)" strokeWidth="1" />
                    <polygon points={g.rightFace} fill="rgba(35,37,45,0.95)" stroke="rgba(245,165,36,0.5)" strokeWidth="1" />
                    <polygon points={g.top}       fill="rgba(75,77,85,0.95)" stroke="rgba(245,165,36,0.8)" strokeWidth="1" />
                  </>
                );
              })()}
            </g>
          );
        })()}

        {/* ── HANGING PENDANT LIGHTS ───────────────────────────── */}
        {[-300, 0, 300].map((lx, i) => {
          const [sx, sy] = p(lx, -260, 360).split(",").map(Number);
          const [sx2, sy2] = p(lx, -260, 320).split(",").map(Number);
          return (
            <g key={i}>
              <line
                x1={sx} y1={sy} x2={sx2} y2={sy2}
                stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"
              />
              <circle cx={sx2} cy={sy2 + 4} r="6" fill="rgba(245,165,36,0.35)" filter="url(#soft-blur)" />
              <circle cx={sx2} cy={sy2 + 4} r="2.5" fill="rgba(245,165,36,0.85)" />
            </g>
          );
        })}

        {/* Soft wall fade + scene vignette so the scene melts into the section */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#iso-vignette)" />
        <rect x="0" y="0" width="1600" height="900" fill="url(#wall-fade)" />
      </svg>
    </div>
  );
}
