import React from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EASE, FONT } from '../tokens';
import { ip } from '../hooks';

/**
 * ScanStream — parcours **séquentiel** d'une table : visualise le « full scan ».
 * • la tête de lecture (ligne horizontale cyan) reste fixe, les lignes défilent
 * • compteur de lignes lues + minuteur, en `tabular-nums`
 * • à `stopAt`, le flux se fige sur la ligne trouvée (flash emerald + coche)
 */
export const ScanStream: React.FC<{
  at?: number;
  width?: number;
  height?: number;
  /** frame où la tête de lecture démarre le balayage */
  scanFrom?: number;
  /** frame où le flux s'arrête sur la ligne trouvée */
  stopAt?: number;
  /** nombre total de lignes « lues » à l'arrêt (pour le compteur) */
  total?: number;
  /** secondes affichées par le minuteur à l'arrêt */
  seconds?: number;
  match?: string;
  accent?: string;
  hud?: boolean;
  /** étiquette affichée en haut du flux (évite tout chevauchement avec le reste) */
  label?: string;
  style?: React.CSSProperties;
}> = ({
  at = 0,
  width = 840,
  height = 560,
  scanFrom = 0,
  stopAt = 240,
  total = 1048576,
  seconds = 4.21,
  match = 'a.dupont@mail.fr',
  accent = C.cyan400,
  hud = true,
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ROW = 46;
  const ROWS = 48;
  const rows = React.useMemo(
    () =>
      Array.from({ length: ROWS }, (_, i) => ({
        id: i,
        email: `${String.fromCharCode(97 + Math.floor(random(`e${i}`) * 26))}.${['dupont', 'bernard', 'konate', 'silva', 'okafor', 'tanaka', 'moreau', 'haddad'][Math.floor(random(`n${i}`) * 8)]}${Math.floor(random(`d${i}`) * 90 + 10)}@mail.fr`,
        city: ['Paris', 'Lyon', 'Cotonou', 'Lisbonne', 'Lagos', 'Osaka', 'Nantes', 'Tunis'][Math.floor(random(`c${i}`) * 8)],
      })),
    [],
  );
  const matchIndex = 30;
  // liste dupliquée : le défilement boucle proprement (sans trou ni saut)
  const stream = React.useMemo(() => [...rows, ...rows.map((r) => ({ ...r, id: r.id + ROWS }))], [rows]);

  const entered = ip(frame, [at, at + 16], [0, 1]);
  const scanning = frame >= scanFrom && frame < stopAt;
  const stopped = frame >= stopAt;

  // défilement : rapide pendant le scan, puis blocage centré sur la ligne trouvée
  const scrolled = scanning ? ((frame - scanFrom) / fps) * 1400 : 0;
  const stopOffset = (matchIndex + 0.5) * ROW; // position de la ligne trouvée
  const center = height / 2;
  const progress = ip(frame, [scanFrom, stopAt], [0, 1], EASE.linear);
  const read = stopped ? total : Math.floor(total * progress);
  const timer = stopped ? seconds : seconds * progress;

  // à l'arrêt : la ligne trouvée se cale sous la tête de lecture ;
  // en scan : défilement continu (modulo la hauteur d'une copie de la liste)
  const translate = stopped
    ? center - stopOffset
    : center - stopOffset - (scrolled % (ROWS * ROW));

  const flash = interpolate(frame, [stopAt, stopAt + 10, stopAt + 40], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });

  return (
    <div style={{ position: 'relative', width, ...style }}>
      <div
        style={{
          position: 'relative',
          width,
          height,
          borderRadius: 18,
          overflow: 'hidden',
          background: 'rgba(6,9,15,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.75)',
          opacity: entered,
          transform: `translateY(${(1 - entered) * 18}px)`,
        }}
      >
        {/* flux de lignes */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: translate,
            filter: scanning ? 'blur(0.4px)' : 'none',
          }}
        >
          {stream.map((r) => {
            const isMatch = r.id === matchIndex;
            const highlight = isMatch && stopped;
            return (
              <div
                key={r.id}
                className="mono"
                style={{
                  height: ROW,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '0 26px',
                  fontFamily: FONT.mono,
                  fontSize: 26,
                  color: highlight ? C.emerald400 : C.textCode,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: highlight ? `rgba(52,211,153,${0.10 + flash * 0.16})` : 'transparent',
                  boxShadow: highlight ? `inset 0 0 60px rgba(52,211,153,${0.25 + flash * 0.3})` : 'none',
                  opacity: highlight ? 1 : 0.88,
                }}
              >
                <span style={{ width: 96, color: C.textMuted }}>#{100000 + r.id * 7}</span>
                <span style={{ flex: 1 }}>{r.email}</span>
                <span style={{ width: 130, textAlign: 'right', color: C.textMuted }}>{r.city}</span>
                {highlight && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.emerald400 }}>
                    <CheckIcon progress={ip(frame, [stopAt + 12, stopAt + 34], [0, 1])} />
                    TROUVÉ
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* tête de lecture */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: center - 1,
            height: 2,
            background: stopped ? C.emerald400 : accent,
            boxShadow: `0 0 30px ${stopped ? C.emerald400 : accent}, 0 0 80px ${stopped ? C.emerald400 : accent}66`,
            opacity: scanning || stopped ? 0.95 : 0,
          }}
        />
        {scanning && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: center + 2,
              height: 90,
              background: `linear-gradient(180deg, ${hexA(accent, 0.16)}, transparent)`,
            }}
          />
        )}

        {/* bandeau d'étiquette : les lignes passent dessous, sans collision */}
        {label && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 46,
              padding: '0 26px',
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(6,9,15,0.98) 55%, rgba(6,9,15,0))',
              fontFamily: FONT.mono,
              fontSize: 20,
              letterSpacing: '0.14em',
              color: C.textMuted,
              opacity: ip(frame, [at + 6, at + 22], [0, 1]),
              zIndex: 2,
            }}
          >
            {label}
          </div>
        )}

        {/* masques haut/bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(180deg, rgba(6,9,15,0.95), transparent 22%, transparent 78%, rgba(6,9,15,0.95))`,
          }}
        />
      </div>

      {/* HUD : lignes lues + minuteur */}
      {hud && (
        <div
          style={{
            display: 'flex',
            gap: 18,
            marginTop: 18,
            opacity: ip(frame, [scanFrom, scanFrom + 12], [0, 1]),
          }}
        >
          <Readout label="LIGNES LUES" value={read.toLocaleString('fr-FR')} tone={stopped ? C.emerald400 : accent} />
          <Readout label="TEMPS" value={`${timer.toFixed(2).replace('.', ',')} s`} tone={stopped ? C.rose400 : C.textPrimary} />
          <Readout label="RÉSULTATS" value={stopped ? '1' : '—'} tone={C.emerald400} />
        </div>
      )}
    </div>
  );
};

const Readout: React.FC<{ label: string; value: string; tone: string }> = ({ label, value, tone }) => (
  <div
    style={{
      flex: 1,
      padding: '16px 20px',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.12em', color: C.textMuted }}>{label}</div>
    <div
      className="mono tnum"
      style={{
        fontFamily: FONT.mono,
        fontSize: 34,
        fontWeight: 700,
        color: tone,
        fontVariantNumeric: 'tabular-nums',
        marginTop: 6,
      }}
    >
      {value}
    </div>
  </div>
);

const CheckIcon: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={24} height={24} viewBox="0 0 24 24">
    <path
      d="M4 12.5 L9.5 18 L20 6"
      fill="none"
      stroke={C.emerald400}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeDasharray={30}
      strokeDashoffset={(1 - progress) * 30}
    />
  </svg>
);

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
};
