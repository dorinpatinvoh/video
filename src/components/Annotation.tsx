import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE } from '../tokens';

export type Pt = [number, number];

/**
 * Annotation — le langage « fait main » du motion 2026 :
 * cercle d'insistance tracé, flèche manuscrite, surlignage fluo, balayage lumineux.
 * Toutes les tracés sont animés en stroke-dashoffset (jamais de fade brut).
 */
export const Circle: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  rotate?: number;
  /** léger grossissement final (1 → 1.06) */
  breathe?: boolean;
}> = ({ cx, cy, rx, ry, at, dur = 25, color = C.rose400, width = 5, rotate = -6, breathe = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  if (p <= 0) return null;
  // périmètre approché de l'ellipse (Ramanujan)
  const h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
  const per = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  const grow = breathe ? 1 + Math.max(0, (frame - (at + dur)) / 40) * 0.06 : 1;

  return (
    <svg
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      width={1}
      height={1}
    >
      <g transform={`translate(${cx},${cy}) rotate(${rotate}) scale(${grow})`}>
        <ellipse
          cx={0}
          cy={0}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={per}
          strokeDashoffset={(1 - p) * per}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </g>
    </svg>
  );
};

/** Flèche tirée à la main (léger overshoot, extrémités arrondies) */
export const Arrow: React.FC<{
  from: Pt;
  to: Pt;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  curve?: number;
  label?: string;
}> = ({ from, to, at, dur = 29, color = C.rose400, width = 5, curve = 0.22, label }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * curve;
  const my = (y1 + y2) / 2 + (x2 - x1) * curve;
  const len = Math.hypot(x2 - mx, y2 - my) * 1.35 + 40;

  if (p <= 0) return null;
  return (
    <svg
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      width={1}
      height={1}
    >
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={(1 - p) * len}
        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
      />
      {p > 0.9 && (
        <ArrowHead x2={x2} y2={y2} mx={mx} my={my} color={color} width={width} />
      )}
      {label && p > 0.85 && (
        <text
          x={(x1 + x2) / 2 + 30}
          y={(y1 + y2) / 2 - 24}
          fill={color}
          fontFamily="Inter, sans-serif"
          fontSize={30}
          fontWeight={700}
          opacity={(p - 0.85) / 0.15}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

const ArrowHead: React.FC<{ x2: number; y2: number; mx: number; my: number; color: string; width: number }> = ({
  x2,
  y2,
  mx,
  my,
  color,
  width,
}) => {
  const ang = Math.atan2(y2 - my, x2 - mx);
  const s = 22;
  const a1 = ang + Math.PI - 0.42;
  const a2 = ang + Math.PI + 0.42;
  return (
    <path
      d={`M ${x2 + Math.cos(a1) * s} ${y2 + Math.sin(a1) * s} L ${x2} ${y2} L ${
        x2 + Math.cos(a2) * s
      } ${y2 + Math.sin(a2) * s}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

/** Balayage lumineux (vérification ligne par ligne) */
export const Sweep: React.FC<{
  x: number;
  y: number;
  h: number;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
}> = ({ x, y, h, at, dur = 36, color = C.emerald400, width = 6 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inoutSoft,
  });
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: h,
        background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 40px ${color}, 0 0 90px ${color}66`,
        opacity: 0.9,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: 0,
          width: 120,
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}33, transparent)`,
        }}
      />
    </div>
  );
};
