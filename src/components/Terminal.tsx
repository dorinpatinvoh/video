import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EASE, FONT } from '../tokens';

export type TermLine = {
  /** texte ; préfixer par « $ » pour un prompt */
  text: string;
  at: number;
  tone?: string;
  /** frappe machine à écrire (sinon apparition ligne par ligne) */
  type?: boolean;
};

/**
 * Terminal — prompt monospace, sortie ligne par ligne, scroll automatique.
 * Le curseur bloc clignote en fin de sortie (step-end 1 s).
 */
export const Terminal: React.FC<{
  lines: TermLine[];
  fontSize?: number;
  width?: number;
  height?: number;
  title?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ lines, fontSize = 28, width, height = 360, title = 'bash — zsh', accent = C.emerald400, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(6,9,15,0.92)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 0,
        overflow: 'hidden',
        fontFamily: FONT.mono,
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 18px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 20,
          color: C.textMuted,
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '18px 22px', flex: 1, overflow: 'hidden' }}>
        {lines.map((l, i) => {
          const isPrompt = l.text.startsWith('$');
          const text = isPrompt ? l.text.slice(1).trim() : l.text;
          const cps = 26;
          const perChar = fps / cps;
          const chars = l.type ? Math.max(0, Math.floor((frame - l.at) / perChar)) : Infinity;
          const shown = l.type ? text.slice(0, Math.min(text.length, chars)) : text;
          const appear = interpolate(frame, [l.at, l.at + 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE.outExpo,
          });
          if (frame < l.at) return null;
          return (
            <div
              key={i}
              style={{
                fontSize,
                lineHeight: 1.5,
                color: l.tone ?? (isPrompt ? C.textCode : C.textSecondary),
                opacity: appear,
                transform: `translateX(${(1 - appear) * 8}px)`,
                whiteSpace: 'pre-wrap',
              }}
            >
              {isPrompt && <span style={{ color: accent }}>❯ </span>}
              {shown}
            </div>
          );
        })}
        <span
          style={{
            display: 'inline-block',
            width: fontSize * 0.55,
            height: fontSize * 1.1,
            background: accent,
            opacity: Math.floor(frame / 30) % 2 === 0 ? 0.9 : 0,
            verticalAlign: '-0.2em',
          }}
        />
      </div>
    </div>
  );
};
