import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, GLOW } from '../tokens';
import { usePop } from '../hooks';

/**
 * StatusCodeBadge — `200 OK` / `Pending` / `Error` / `Rollback`…
 * success : pop + glow emerald · pending : pulse amber · error : shake + glow rose
 */
export const StatusCodeBadge: React.FC<{
  label: string;
  at?: number;
  variant?: 'success' | 'pending' | 'error' | 'warn' | 'neutral' | 'info';
  size?: number;
  pulse?: boolean;
  shake?: boolean;
  style?: React.CSSProperties;
}> = ({ label, at = 0, variant = 'success', size = 27, pulse = false, shake = false, style }) => {
  const frame = useCurrentFrame();
  const pop = usePop(at);
  const t = frame - at;

  const tone = {
    success: { c: C.emerald400, bg: 'rgba(52,211,153,0.12)', g: GLOW.emerald },
    pending: { c: C.amber400, bg: 'rgba(251,191,36,0.12)', g: GLOW.amber },
    warn: { c: C.amber400, bg: 'rgba(251,191,36,0.12)', g: GLOW.amber },
    error: { c: C.rose400, bg: 'rgba(244,63,94,0.14)', g: GLOW.rose },
    info: { c: C.cyan400, bg: 'rgba(34,211,238,0.12)', g: GLOW.cyan },
    neutral: { c: C.textSecondary, bg: 'rgba(255,255,255,0.06)', g: 'none' },
  }[variant];

  const doShake = shake && t > at ? Math.sin(t * 1.9) * 3 * Math.max(0, 1 - t / 22) : 0;
  const pulseV = pulse && t > 0 ? 0.5 - 0.5 * Math.cos(((t / 60) * (1 / 1.4)) * Math.PI * 2) : 0;

  return (
    <span
      className="mono"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: `${size * 0.34}px ${size * 0.72}px`,
        borderRadius: 999,
        border: `1px solid ${tone.c}55`,
        background: tone.bg,
        color: tone.c,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '0.01em',
        boxShadow: pop > 0.6 ? `${tone.g}, 0 0 0 ${(1 - pop) * 14}px ${tone.c}22` : tone.g,
        opacity: pop,
        transform: `translateX(${doShake}px) scale(${0.92 + pop * 0.08 + pulseV * 0.02})`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span
        style={{
          width: size * 0.32,
          height: size * 0.32,
          borderRadius: 999,
          background: tone.c,
          boxShadow: `0 0 ${size * 0.6}px ${tone.c}`,
          opacity: 0.75 + pulseV * 0.25,
        }}
      />
      {label}
    </span>
  );
};
