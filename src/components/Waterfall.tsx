import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT } from '../tokens';
import { ip } from '../hooks';

export type WaterfallRow = {
  id: string;
  label: string;
  /** début, en ms, par rapport au lancement de la page */
  start: number;
  /** durée, en ms */
  dur: number;
  state: 'miss' | 'hit' | 'pending' | 'doc';
  /** frame d'apparition de la ligne */
  at: number;
  /** libellé d'état ajouté à droite (ex. « HIT 2 ms ») */
  tag?: string;
};

/**
 * Waterfall — chronogramme réseau (famille « DevTools / WebPageTest »).
 * C'est le visuel de référence des développeurs : chaque barre est une requête,
 * sa longueur est sa durée, son décalage est son départ. Un HIT est un sliver.
 */
export const Waterfall: React.FC<{
  rows: WaterfallRow[];
  at?: number;
  width?: number;
  /** durée (ms) qui occupe toute la largeur */
  scaleMax?: number;
  rowHeight?: number;
  fontSize?: number;
  accent?: string;
  /** frame où le total s'affiche */
  totalAt?: number;
  totalLabel?: string;
  totalTone?: string;
  totalValue?: string;
  style?: React.CSSProperties;
  title?: string;
}> = ({
  rows,
  at = 0,
  width = 840,
  scaleMax = 4300,
  rowHeight = 44,
  fontSize = 22,
  accent = C.indigo400,
  totalAt,
  totalLabel = 'TOTAL',
  totalTone = C.rose400,
  totalValue,
  style,
  title,
}) => {
  const frame = useCurrentFrame();

  /* Géométrie de type DevTools : une colonne d'étiquettes à gauche, puis la piste.
     Les barres ne peuvent donc jamais passer sous le texte (leçon de la QA du hook). */
  const padX = 18;
  const maxLen = rows.reduce((m, r) => Math.max(m, r.label.length), 6);
  const labelW = Math.min(width * 0.4, Math.round(maxLen * fontSize * 0.62) + 26);
  const trackW = width - padX - labelW - padX;
  const barW = (ms: number) => Math.max(3, (ms / scaleMax) * trackW);
  const at_ = (ms: number) => padX + labelW + (ms / scaleMax) * trackW;

  return (
    <div
      className="mono"
      style={{
        width,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(6,9,15,0.72)',
        overflow: 'hidden',
        fontFamily: FONT.mono,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
            fontSize: 19,
            letterSpacing: '0.12em',
            color: C.textMuted,
          }}
        >
          {title}
        </div>
      )}

      <div style={{ padding: '14px 0' }}>
        {rows.map((r) => {
          const p = interpolate(frame, [r.at, r.at + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE.outExpo,
          });
          const grow = interpolate(frame, [r.at + 4, r.at + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE.outExpo,
          });
          const tone =
            r.state === 'hit'
              ? C.emerald400
              : r.state === 'pending'
                ? C.amber400
                : r.state === 'doc'
                  ? C.indigo400
                  : C.rose400;

          const tagW = r.tag ? Math.round(r.tag.length * fontSize * 0.78 * 0.62) + 22 : 0;
          const barEnd = at_(r.start) + barW(r.dur) * grow;
          const tagLeft = Math.min(barEnd + 8, width - padX - tagW);

          return (
            <div
              key={r.id}
              style={{
                position: 'relative',
                height: rowHeight,
                opacity: p * 0.55 + (frame >= r.at ? 0.45 : 0),
                transform: `translateX(${(1 - p) * 10}px)`,
              }}
            >
              {/* étiquette — jamais recouverte par une barre */}
              <div
                style={{
                  position: 'absolute',
                  left: padX,
                  top: 0,
                  height: rowHeight,
                  width: labelW - 10,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize,
                  color: r.state === 'hit' ? C.emerald400 : C.textSecondary,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {r.label}
              </div>

              {/* barre */}
              <div
                style={{
                  position: 'absolute',
                  left: at_(r.start),
                  top: rowHeight / 2 - Math.min(7, rowHeight * 0.24),
                  height: Math.min(14, rowHeight * 0.48),
                  width: barW(r.dur) * grow,
                  borderRadius: 7,
                  background: `linear-gradient(90deg, ${hexA(tone, 0.55)}, ${tone})`,
                  boxShadow: `0 0 18px ${hexA(tone, 0.45)}`,
                }}
              />

              {/* état — posé après la barre, jamais dessus */}
              {r.tag && (
                <span
                  style={{
                    position: 'absolute',
                    left: tagLeft,
                    top: rowHeight / 2 - Math.min(13, rowHeight * 0.4),
                    padding: '1px 10px',
                    borderRadius: 999,
                    fontSize: fontSize * 0.78,
                    whiteSpace: 'nowrap',
                    border: `1px solid ${hexA(tone, 0.4)}`,
                    color: tone,
                    opacity: p,
                  }}
                >
                  {r.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {totalAt !== undefined && totalValue && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: hexA(totalTone, 0.06),
            opacity: ip(frame, [totalAt, totalAt + 14], [0, 1]),
          }}
        >
          <span style={{ fontSize: 20, letterSpacing: '0.12em', color: C.textMuted }}>{totalLabel}</span>
          <span
            className="tnum"
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: totalTone,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 30px ${hexA(totalTone, 0.6)}`,
            }}
          >
            {totalValue}
          </span>
        </div>
      )}
    </div>
  );
};

/** CacheBox — la mémoire qui répond à la place du serveur */
export const CacheBox: React.FC<{
  at?: number;
  width?: number;
  entries?: { id: string; label: string; at: number; tone?: string }[];
  hitAt?: number;
  hitLabel?: string;
  missAt?: number;
  missLabel?: string;
  title?: string;
  accent?: string;
  style?: React.CSSProperties;
  /** frame à partir de laquelle le contenu est censuré (fuite de données) */
  censorAt?: number;
}> = ({
  at = 0,
  width = 360,
  entries = [],
  hitAt,
  hitLabel = 'HIT · 2 ms',
  missAt,
  missLabel = 'MISS · 412 ms',
  title = 'CACHE',
  accent = C.cyan400,
  style,
  censorAt,
}) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1], EASE.outExpo);
  const hitPulse =
    hitAt !== undefined
      ? interpolate(frame, [hitAt, hitAt + 10, hitAt + 26], [0, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const missPulse =
    missAt !== undefined
      ? interpolate(frame, [missAt, missAt + 10, missAt + 26], [0, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const censor = censorAt !== undefined ? ip(frame, [censorAt, censorAt + 16], [0, 1]) : 0;
  const stateTone = hitPulse > missPulse ? C.emerald400 : C.rose400;
  const stateLabel = hitPulse >= missPulse ? hitLabel : missLabel;
  const stateVisible = hitPulse > 0.05 || missPulse > 0.05;

  return (
    <div
      style={{
        width,
        borderRadius: 18,
        border: `1px solid ${hexA(accent, 0.35 + hitPulse * 0.4)}`,
        background: hexA(accent, 0.05 + hitPulse * 0.08),
        boxShadow: `0 0 ${30 + hitPulse * 50}px ${hexA(accent, 0.2 + hitPulse * 0.25)}`,
        padding: 20,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px) scale(${0.98 + p * 0.02})`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span
          className="mono"
          style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.14em', color: accent }}
        >
          {title}
        </span>
        {stateVisible && (
          <span
            className="mono"
            style={{
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 19,
              fontWeight: 700,
              color: stateTone,
              border: `1px solid ${hexA(stateTone, 0.5)}`,
              background: hexA(stateTone, 0.12),
              opacity: Math.max(hitPulse, missPulse),
              whiteSpace: 'nowrap',
            }}
          >
            {stateLabel}
          </span>
        )}
      </div>

      {/* emplacements */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 96 }}>
        {entries.map((e) => {
          const ep = ip(frame, [e.at, e.at + 14], [0, 1], EASE.outExpo);
          const tone = e.tone ?? C.emerald400;
          return (
            <div
              key={e.id}
              className="mono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 10,
                border: `1px solid ${hexA(tone, 0.3)}`,
                background: hexA(tone, 0.08),
                fontSize: 21,
                color: C.textPrimary,
                opacity: ep * (1 - censor * 0.9),
                transform: `translateX(${(1 - ep) * -24}px)`,
                filter: censor > 0.1 ? `blur(${censor * 3}px)` : 'none',
              }}
            >
              <span style={{ color: tone }}>●</span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {e.label}
              </span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <div
            className="mono"
            style={{
              height: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              border: '1px dashed rgba(255,255,255,0.12)',
              color: C.textMuted,
              fontSize: 20,
            }}
          >
            vide
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
