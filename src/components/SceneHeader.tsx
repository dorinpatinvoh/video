import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT, SAFE } from '../tokens';

/**
 * SceneHeader — bandeau de scène (kicker + titre) : repère constant de la série.
 * Entrée : masque vertical + micro-glissement (jamais de fade sec).
 */
export const SceneHeader: React.FC<{
  kicker: string;
  title?: string;
  at?: number;
  accent?: string;
  /** élément aligné à droite (badge, compteur) */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kicker, title, at = 0, accent = C.emerald400, right, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  const q = interpolate(frame, [at + 4, at + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.sideMargin,
        width: SAFE.contentWidth,
        top: 470,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 20,
        ...style,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 26,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: accent,
            opacity: p,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 26 * p,
              height: 3,
              background: accent,
              boxShadow: `0 0 16px ${accent}`,
            }}
          />
          {kicker}
        </div>
        {title && (
          <div
            style={{
              fontFamily: FONT.ui,
              fontWeight: 800,
              fontSize: 56,
              letterSpacing: '-0.02em',
              color: C.textPrimary,
              marginTop: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ transform: `translateY(${(1 - q) * 100}%)`, opacity: q }}>{title}</div>
          </div>
        )}
      </div>
      {right}
    </div>
  );
};
