import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EASE } from '../tokens';

export type CursorKey = {
  /** frame (locale à la scène) du début du geste */
  at: number;
  x: number;
  y: number;
  /** état pendant/au terme du geste */
  act?: 'hover' | 'click' | 'drag';
};

/**
 * Cursor — curseur souris réaliste.
 * • trajectoire crédible : accélération/décélération (out-expo), jamais de téléportation
 * • pause ~80 ms avant un clic, ripple au clic, scale 0.86 en enfoncement
 * • halo doux pendant le survol (hover)
 */
export const Cursor: React.FC<{
  keys: CursorKey[];
  /** frame d'apparition (fade + léger scale) */
  enterAt?: number;
  /** frame de disparition */
  hideAt?: number;
  size?: number;
  accent?: string;
  scale?: number;
}> = ({ keys, enterAt, hideAt, size = 34, accent = C.indigo400, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  const first = sorted[0];

  // position : interpolation par segments
  let pos = { x: first.x, y: first.y };
  let act: CursorKey['act'] = undefined;
  let clickAt = -9999;

  for (let i = 0; i < sorted.length; i++) {
    const k = sorted[i];
    const next = sorted[i + 1];
    if (frame < k.at) break;
    if (!next) {
      pos = { x: k.x, y: k.y };
      act = k.act;
      if (k.act === 'click') clickAt = k.at;
      break;
    }
    if (frame < next.at) {
      const t = interpolate(frame, [k.at, next.at], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE.outExpo,
      });
      pos = { x: k.x + (next.x - k.x) * t, y: k.y + (next.y - k.y) * t };
      act = undefined;
      if (k.act === 'click') clickAt = k.at;
      break;
    }
    pos = { x: k.x, y: k.y };
    act = k.act;
    if (k.act === 'click') clickAt = k.at;
  }

  const sinceClick = frame - clickAt;
  const pressed = sinceClick >= 0 && sinceClick < 12;
  // pause courte avant chaque clic (le curseur « vise »)
  const nearClick = sorted.some((k) => k.act === 'click' && frame >= k.at - 5 && frame < k.at);
  const hoverGlow = act === 'hover' || nearClick ? 1 : 0;

  const show =
    (enterAt === undefined || frame >= enterAt) && (hideAt === undefined || frame < hideAt);
  const fadeIn =
    enterAt === undefined
      ? 1
      : interpolate(frame, [enterAt, enterAt + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE.outExpo,
        });
  const fadeOut =
    hideAt === undefined
      ? 1
      : interpolate(frame, [hideAt - 8, hideAt], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  const opacity = show ? fadeIn * fadeOut : 0;
  if (opacity <= 0.001) return null;

  const s = scale * (pressed ? 0.86 : 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        opacity,
        transform: `translate(-2px,-2px) scale(${s})`,
        pointerEvents: 'none',
        filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.7))`,
      }}
    >
      {/* halo de survol */}
      <div
        style={{
          position: 'absolute',
          left: -size * 1.6,
          top: -size * 1.6,
          width: size * 3.2,
          height: size * 3.2,
          borderRadius: 999,
          background: `radial-gradient(circle, ${hexA(accent, 0.28 * hoverGlow)} 0%, transparent 62%)`,
          opacity: hoverGlow,
        }}
      />
      {/* ripple de clic */}
      {sinceClick >= 0 && sinceClick < 14 && (
        <div
          style={{
            position: 'absolute',
            left: -size * 0.5,
            top: -size * 0.5,
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: 999,
            border: `1.5px solid ${accent}`,
            opacity: interpolate(sinceClick, [0, 14], [0.75, 0], { extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(sinceClick, [0, 14], [0.45, 1.7], {
              extrapolateRight: 'clamp',
              easing: EASE.outExpo,
            })})`,
          }}
        />
      )}
      {/* flèche */}
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}>
        <path
          d="M5 2.5 L5 18.2 L9.1 14.6 L11.7 20.6 L14.3 19.4 L11.7 13.5 L17 13.2 Z"
          fill="#FFFFFF"
          stroke="#0B0F19"
          strokeWidth={1.1}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(
    h.slice(4, 6),
    16,
  )},${a})`;
};
