import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT } from '../tokens';

export type RowSpec = {
  id: string;
  /** valeur des cellules — peut dépendre de la frame pour animer un solde */
  cells: (string | number)[] | ((frame: number) => (string | number)[]);
  enterAt?: number;
  /** frame à partir de laquelle la ligne quitte la table (glisse + fade) */
  exitAt?: number;
  /** flashs de valeur (changed / error / success) */
  flashes?: { at: number; color?: string; dur?: number }[];
  /** retour en arrière (rollback) : la ligne revient de la gauche */
  rewindAt?: number;
  tone?: string;
};

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(
    h.slice(4, 6),
    16,
  )},${a})`;
};

/**
 * DataTable — table de base de données (lignes en cascade, flash de valeur,
 * rollback qui « remonte le temps », sortie de ligne).
 */
export const DataTable: React.FC<{
  columns: string[];
  rows: RowSpec[];
  at?: number;
  fontSize?: number;
  colWidths?: number[];
  accent?: string;
  headerAccent?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}> = ({
  columns,
  rows,
  at = 0,
  fontSize = 30,
  colWidths,
  accent = C.emerald400,
  headerAccent = C.textMuted,
  style,
  compact = false,
}) => {
  const frame = useCurrentFrame();
  const pad = compact ? 14 : 22;

  return (
    <div
      className="mono"
      style={{
        fontFamily: FONT.mono,
        fontSize,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
        ...style,
      }}
    >
      {/* en-tête */}
      <div
        style={{
          display: 'flex',
          padding: `${pad * 0.7}px ${pad}px`,
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          color: headerAccent,
          fontSize: fontSize * 0.78,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {columns.map((c, i) => (
          <span
            key={c}
            style={{
              width: colWidths?.[i] ?? 'auto',
              flex: colWidths?.[i] ? '0 0 auto' : 1,
              textAlign: i === 0 ? 'left' : i === columns.length - 1 ? 'right' : 'left',
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {rows.map((row, ri) => {
        const enterAt = row.enterAt ?? at + ri * 4; // stagger 60 ms ≈ 4 frames
        const appear = interpolate(frame, [enterAt, enterAt + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE.outExpo,
        });

        const exit =
          row.exitAt === undefined
            ? 0
            : interpolate(frame, [row.exitAt, row.exitAt + 16], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE.outExpo,
              });

        const rewind =
          row.rewindAt === undefined
            ? 0
            : interpolate(frame, [row.rewindAt, row.rewindAt + 30], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: EASE.outExpo,
              });

        // flash actif le plus récent
        let flash = 0;
        let flashColor: string = C.emerald400;
        for (const f of row.flashes ?? []) {
          const dur = f.dur ?? 22;
          const p = interpolate(frame, [f.at, f.at + dur * 0.35, f.at + dur], [0, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE.outExpo,
          });
          if (p > flash) {
            flash = p;
            flashColor = f.color ?? C.emerald400;
          }
        }

        const cells = typeof row.cells === 'function' ? row.cells(frame) : row.cells;

        return (
          <div
            key={row.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${pad}px ${pad}px`,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: flash > 0.01 ? hexA(flashColor, 0.10 * flash) : 'transparent',
              boxShadow:
                flash > 0.01 ? `inset 0 0 60px ${hexA(flashColor, 0.14 * flash)}` : 'none',
              opacity: appear * (1 - exit),
              transform: `translateY(${(1 - appear) * 12}px) translateX(${
                exit * 300 - rewind * 60
              }px)`,
            }}
          >
            {cells.map((cell, ci) => {
              const isLast = ci === cells.length - 1;
              const pop = flash > 0.02 && isLast ? 1 + flash * 0.06 : 1;
              return (
                <span
                  key={ci}
                  style={{
                    width: colWidths?.[ci] ?? 'auto',
                    flex: colWidths?.[ci] ? '0 0 auto' : 1,
                    textAlign: ci === 0 ? 'left' : isLast ? 'right' : 'left',
                    color: row.tone ?? (isLast ? C.textPrimary : C.textSecondary),
                    fontVariantNumeric: 'tabular-nums',
                    transform: `scale(${pop})`,
                    transformOrigin: isLast ? 'right center' : 'left center',
                    fontWeight: isLast ? 600 : 500,
                    textShadow:
                      isLast && flash > 0.02 ? `0 0 22px ${hexA(flashColor, flash)}` : 'none',
                  }}
                >
                  {cell}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Badge « Total » épinglé, animé (passe en rouge quand la base est incohérente) */
export const TotalBadge: React.FC<{
  value: string;
  at?: number;
  tone?: string;
  label?: string;
  size?: number;
  pulse?: boolean;
  style?: React.CSSProperties;
}> = ({ value, at = 0, tone = C.emerald400, label = 'TOTAL', size = 40, pulse = false, style }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [at, at + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outBack,
  });
  const p = pulse ? 0.5 + 0.5 * Math.sin(((frame - at) / 60) * 2 * Math.PI * 0.72) : 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 28px',
        borderRadius: 18,
        background: hexA(tone, 0.10),
        border: `1px solid ${hexA(tone, 0.35 + p * 0.25)}`,
        boxShadow: `0 0 ${40 + p * 30}px ${hexA(tone, 0.25 + p * 0.2)}`,
        opacity: appear,
        transform: `scale(${0.94 + appear * 0.06})`,
        ...style,
      }}
    >
      <span
        className="mono"
        style={{ fontSize: size * 0.55, letterSpacing: '0.1em', color: C.textMuted }}
      >
        {label}
      </span>
      <span
        className="mono"
        style={{
          fontSize: size,
          fontWeight: 700,
          color: tone,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 30px ${hexA(tone, 0.6)}`,
        }}
      >
        {value}
      </span>
    </div>
  );
};
