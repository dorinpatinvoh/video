import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, DUR, FONT, GLOW } from '../tokens';
import { useEnter } from '../hooks';

/**
 * BrowserFrame — fenêtre navigateur glass (style Vercel/Arc).
 * Entrée signature : translateY 24 px + scale .98 → 1, glow au focus.
 */
export const BrowserFrame: React.FC<{
  children: React.ReactNode;
  url?: string;
  at?: number;
  accent?: string;
  glow?: boolean;
  style?: React.CSSProperties;
  /** hauteur de la barre d'outils (px) */
  bar?: number;
  radius?: number;
  compact?: boolean;
}> = ({ children, url, at = 0, accent = C.indigo500, glow = false, style, bar = 66, radius = 28, compact = false }) => {
  const frame = useCurrentFrame();
  const { opacity, translateY, scale } = useEnter(at, Math.round(DUR.scene * 60));

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: radius,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.035)',
        border: `1px solid rgba(255,255,255,0.10)`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: `${GLOW.card}${glow ? `, ${GLOW.indigo}` : ''}`,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {/* barre d'outils */}
      <div
        style={{
          height: bar,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: compact ? '0 16px' : '0 22px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          {[C.rose400, C.amber400, C.emerald400].map((c, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                background: c,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        {url && (
          <div
            className="mono"
            style={{
              flex: 1,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: FONT.mono,
              fontSize: 22,
              color: C.textSecondary,
              letterSpacing: '0.01em',
            }}
          >
            <LockIcon color={C.emerald400} />
            <span style={{ color: C.textPrimary }}>{url}</span>
          </div>
        )}
      </div>
      {/* contenu */}
      <div style={{ position: 'relative' }}>{children}</div>
      {frame < at && <div style={{ position: 'absolute', inset: 0 }} />}
    </div>
  );
};

const LockIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke={color} strokeWidth="1.8" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={color} strokeWidth="1.8" />
  </svg>
);

/** Barre d'onglets (VS Code / navigateur) avec indicateur glissant */
export const TabBar: React.FC<{
  tabs: string[];
  active?: number;
  at?: number;
  accent?: string;
  width?: number;
}> = ({ tabs, active = 0, accent = C.indigo400 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'stretch',
      gap: 2,
      padding: '0 12px',
      background: 'rgba(255,255,255,0.02)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontFamily: FONT.mono,
    }}
  >
    {tabs.map((t, i) => (
      <div
        key={t}
        style={{
          position: 'relative',
          padding: '16px 22px',
          fontSize: 24,
          color: i === active ? C.textPrimary : C.textMuted,
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {t}
        {i === active && (
          <span
            style={{
              position: 'absolute',
              left: 14,
              right: 14,
              bottom: 0,
              height: 3,
              borderRadius: 3,
              background: accent,
              boxShadow: `0 0 18px ${accent}`,
            }}
          />
        )}
      </div>
    ))}
  </div>
);
