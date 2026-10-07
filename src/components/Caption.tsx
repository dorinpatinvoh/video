import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT, H, SAFE } from '../tokens';

/**
 * Caption — sous-titres brûlés, ancrés à 78 % (safe zone), max 2 lignes.
 * Apparition mot à mot (rythme de lecture) puis immobilité ≥ 300 ms avant le cut.
 */
export const Caption: React.FC<{
  text: string;
  at?: number;
  /** durée de vie en frames (défaut : jusqu'à la fin de la scène) */
  until?: number;
  accent?: string;
  size?: number;
  /** surlignage de certains mots (index des mots) */
  emphasize?: number[];
  style?: React.CSSProperties;
}> = ({ text, at = 0, until, accent = C.emerald400, size = 66, emphasize = [], style }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const visible = until ?? Number.MAX_SAFE_INTEGER;

  // apparition mot à mot : 55 ms/mot, démarrage rapide
  const perWord = 3.3;
  const shown = Math.max(0, Math.min(words.length, Math.floor((frame - at) / perWord)));

  const entry = interpolate(frame, [at, at + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  const exit = interpolate(frame, [visible, visible + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const clip = (i: number) => (i < shown ? 1 : 0);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.sideMargin,
        width: SAFE.contentWidth,
        top: H * SAFE.captionTop - size * 0.6,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `${size * 0.24}px ${size * 0.28}px`,
        fontFamily: FONT.ui,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        textAlign: 'center',
        opacity: entry * exit,
        transform: `translateY(${(1 - entry) * 14}px)`,
        textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const on = clip(i);
        const emphasized = emphasize.includes(i);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              color: emphasized && on > 0 ? accent : C.textPrimary,
              opacity: on ? 1 : 0,
              transform: `translateY(${on ? 0 : 10}px)`,
              filter: on ? 'none' : 'blur(2px)',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
