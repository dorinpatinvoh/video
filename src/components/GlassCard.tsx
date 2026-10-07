import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, DUR, EASE, FONT, GLOW } from '../tokens';
import { useEnter } from '../hooks';

/**
 * GlassCard — carte glassmorphism (backdrop-blur ≤ 18 px, ≤ 3 surfaces simultanées).
 * Entrée signature : translateY 24 → 0 + scale .98 → 1 (280 ms, out-expo).
 */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  at?: number;
  accent?: string;
  glow?: boolean;
  style?: React.CSSProperties;
  padding?: number;
  radius?: number;
  /** titre optionnel affiché en micro-label dans la carte */
  label?: string;
  labelTone?: string;
  interactive?: boolean; // hover : translateY -4px + bordure accent
}> = ({
  children,
  at = 0,
  accent = C.indigo500,
  glow = false,
  style,
  padding = 28,
  radius = 26,
  label,
  labelTone,
  interactive = false,
}) => {
  const frame = useCurrentFrame();
  const { progress, opacity, translateY, scale } = useEnter(at, Math.round(DUR.ui * 60));
  const hover = interactive ? 1 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: radius,
        padding,
        background: 'rgba(255,255,255,0.045)',
        border: `1px solid ${hexA(accent, glow ? 0.35 : 0.09)}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `${GLOW.card}${glow ? `, ${GLOW.indigo}` : ''}`,
        opacity,
        transform: `translateY(${translateY - hover * 4}px) scale(${scale})`,
        willChange: 'transform',
        ...style,
      }}
    >
      {label && (
        <div
          className="t-label mono"
          style={{
            fontFamily: FONT.mono,
            fontSize: 24,
            color: labelTone ?? C.textMuted,
            marginBottom: 18,
          }}
        >
          {label}
        </div>
      )}
      {children}
      {progress < 1 && (
        <AbsoluteFill
          style={{
            borderRadius: radius,
            background: `linear-gradient(180deg, transparent, ${hexA(accent, 0.08)})`,
            opacity: 1 - progress,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

/** Surlignage fluo : barre scaleX 0 → 1 derrière le texte (180 ms, origin left) */
export const Highlight: React.FC<{
  children: React.ReactNode;
  at: number;
  color?: string;
  opacity?: number;
  /** surligne aussi avant l'apparition ? (barre seule) */
  style?: React.CSSProperties;
}> = ({ children, at, color = C.indigo500, opacity = 0.22, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span
        style={{
          position: 'absolute',
          left: -6,
          right: -6,
          top: '12%',
          bottom: '8%',
          background: hexA(color, opacity),
          borderRadius: 6,
          transform: `scaleX(${p})`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(
    h.slice(4, 6),
    16,
  )},${a})`;
};
