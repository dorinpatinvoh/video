import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT, GLOW } from '../tokens';
import { ip } from '../hooks';

export type LookupStep = {
  /** frame où la fenêtre courante devient [lo, hi] */
  at: number;
  lo: number;
  hi: number;
  /** libellé optionnel de l'étape (journal des sauts) */
  label?: string;
};

/**
 * SortedLookup — l'annuaire trié + recherche par **dichotomie**.
 * Visualise ce que fait un index : ouvrir au milieu, éliminer la moitié, recommencer.
 * Les intervalles éliminés tombent à 18 % d'opacité, la fenêtre active est encadrée,
 * la cellule sondée pulse, la cellule trouvée reçoit la coche.
 */
export const SortedLookup: React.FC<{
  entries: string[];
  steps: LookupStep[];
  at?: number;
  /** index de l'entrée recherchée */
  target: number;
  columns?: number;
  accent?: string;
  cellWidth?: number;
  cellHeight?: number;
  gap?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  entries,
  steps,
  at = 0,
  target,
  columns = 8,
  accent = C.cyan400,
  cellWidth = 96,
  cellHeight = 54,
  gap = 8,
  fontSize = 22,
  style,
}) => {
  const frame = useCurrentFrame();
  const sorted = [...steps].sort((a, b) => a.at - b.at);

  // fenêtre courante
  let lo = 0;
  let hi = entries.length - 1;
  let stepIndex = -1;
  for (let i = 0; i < sorted.length; i++) {
    if (frame >= sorted[i].at) {
      lo = sorted[i].lo;
      hi = sorted[i].hi;
      stepIndex = i;
    }
  }
  const started = frame >= sorted[0]?.at;
  const mid = Math.floor((lo + hi) / 2);
  const found = started && lo === hi && lo === target;
  const foundAt = sorted.find((s) => s.lo === s.hi && s.lo === target)?.at ?? 1e9;

  const enter = ip(frame, [at, at + 16], [0, 1]);

  return (
    <div style={{ position: 'relative', opacity: enter, ...style }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, ${cellWidth}px)`,
          gap,
        }}
      >
        {entries.map((e, i) => {
          const eliminated = started && (i < lo || i > hi);
          const inWindow = started && i >= lo && i <= hi;
          const isMid = started && i === mid && !found;
          const isTarget = i === target && found;
          const pulse = isMid ? 0.5 + 0.5 * Math.sin((frame / 60) * 2 * Math.PI * 1.4) : 0;

          return (
            <div
              key={i}
              className="mono"
              style={{
                position: 'relative',
                height: cellHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                fontFamily: FONT.mono,
                fontSize,
                border: `1px solid ${
                  isTarget ? hexA(C.emerald400, 0.9) : isMid ? hexA(accent, 0.95) : inWindow ? hexA(accent, 0.55) : 'rgba(255,255,255,0.06)'
                }`,
                background: isTarget
                  ? hexA(C.emerald400, 0.16)
                  : isMid
                    ? hexA(accent, 0.14 + pulse * 0.1)
                    : inWindow
                      ? hexA(accent, 0.10)
                      : 'rgba(255,255,255,0.015)',
                color: isTarget ? C.emerald400 : eliminated ? C.textMuted : inWindow ? C.textPrimary : C.textMuted,
                opacity: eliminated ? 0.34 : 1,
                boxShadow: isTarget
                  ? GLOW.emerald
                  : isMid
                    ? `0 0 ${30 + pulse * 30}px ${hexA(accent, 0.4)}`
                    : 'none',
                transform: `scale(${isTarget ? 1.06 : 1})`,
              }}
            >
              <span style={{ textDecoration: eliminated ? 'line-through' : 'none' }}>{e}</span>
              {isTarget && (
                <span style={{ position: 'absolute', right: 6, top: 4 }}>
                  <svg width={18} height={18} viewBox="0 0 24 24">
                    <path
                      d="M4 12.5 L9.5 18 L20 6"
                      fill="none"
                      stroke={C.emerald400}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeDasharray={30}
                      strokeDashoffset={(1 - ip(frame, [foundAt + 8, foundAt + 28], [0, 1])) * 30}
                    />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* fenêtre active : barre qui se rabat sur la moitié éliminée */}
      {started && hi < entries.length - 1 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: -6,
            width: 4,
            height: 'calc(100% + 12px)',
            background: accent,
            boxShadow: `0 0 24px ${accent}`,
            opacity: 0.5,
          }}
        />
      )}

      {/* badge d'étape */}
      {started && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: -54,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT.mono,
            fontSize: 24,
            color: accent,
          }}
        >
          <span style={{ color: C.textMuted }}>étape</span>
          <span style={{ fontWeight: 700 }}>{Math.max(1, stepIndex + 1)}</span>
          <span style={{ color: C.textMuted }}>
            · fenêtre {hi - lo + 1}
          </span>
        </div>
      )}
    </div>
  );
};

/** Barre comparative honnête : la valeur minuscule reste un sliver visible (3 px min). */
export const CompareBars: React.FC<{
  items: { label: string; value: number; unit: string; max: number; tone: string; at: number; note?: string }[];
  at?: number;
  width?: number;
  barHeight?: number;
  minWidth?: number;
  /** décimales affichées sous 10 (défaut 2 — 0 pour les durées entières en ms) */
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ items, at = 0, width = 840, barHeight = 56, minWidth = 3, decimals = 2, style }) => (
  <div style={{ width, ...style }}>
    {items.map((it) => (
      <Bar
        key={it.label}
        {...it}
        at={at === 0 ? it.at : it.at}
        width={width}
        barHeight={barHeight}
        minWidth={minWidth}
        decimals={decimals}
      />
    ))}
  </div>
);

const Bar: React.FC<{
  label: string;
  value: number;
  unit: string;
  max: number;
  tone: string;
  at: number;
  note?: string;
  width: number;
  barHeight: number;
  minWidth: number;
  decimals: number;
}> = ({ label, value, unit, max, tone, at, note, width, barHeight, minWidth, decimals }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  const shown = value * p;
  const targetPct = Math.max(minWidth / width, Math.min(1, value / max)) * p;

  return (
    <div style={{ marginBottom: 22, opacity: ip(frame, [at, at + 10], [0, 1]) }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: FONT.mono,
          fontSize: 25,
          color: C.textSecondary,
          marginBottom: 10,
        }}
      >
        <span>{label}</span>
        <span className="tnum" style={{ color: tone, fontWeight: 700, fontSize: 30, fontVariantNumeric: 'tabular-nums' }}>
          {shown < 10 ? shown.toFixed(decimals).replace('.', ',') : Math.round(shown).toLocaleString('fr-FR')} {unit}
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          height: barHeight,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${targetPct * 100}%`,
            minWidth,
            background: `linear-gradient(90deg, ${hexA(tone, 0.55)}, ${tone})`,
            boxShadow: `0 0 40px ${hexA(tone, 0.5)}`,
            borderRadius: 12,
          }}
        />
        {note && (
          <div
            style={{
              position: 'absolute',
              right: 16,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              fontFamily: FONT.mono,
              fontSize: 22,
              color: C.textMuted,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
};
