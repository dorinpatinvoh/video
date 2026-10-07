import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, EASE, FONT } from '../tokens';
import { ip } from '../hooks';

/**
 * WorldMap — carte du monde en **points** (dot-matrix), avec nœuds et paquets animés.
 *
 * Pourquoi des points : c'est le langage visuel « 2026 » (data-viz technique), ça
 * reste net à n'importe quelle échelle, et ça coûte presque rien à animer.
 * Les continents sont décrits par des ellipses lat/lon (facile à ajuster).
 */
const LAND: { lon: number; lat: number; rLon: number; rLat: number }[] = [
  // Amérique du Nord
  { lon: -100, lat: 50, rLon: 34, rLat: 16 },
  { lon: -122, lat: 56, rLon: 18, rLat: 11 },
  { lon: -78, lat: 42, rLon: 18, rLat: 13 },
  { lon: -102, lat: 27, rLon: 16, rLat: 8 },
  // Groenland
  { lon: -44, lat: 73, rLon: 14, rLat: 9 },
  // Amérique du Sud
  { lon: -62, lat: -8, rLon: 13, rLat: 17 },
  { lon: -68, lat: -33, rLon: 8, rLat: 18 },
  // Europe
  { lon: 12, lat: 50, rLon: 17, rLat: 10 },
  { lon: -3, lat: 41, rLon: 8, rLat: 6 },
  { lon: 24, lat: 62, rLon: 14, rLat: 8 },
  // Afrique
  { lon: 17, lat: 10, rLon: 19, rLat: 15 },
  { lon: 26, lat: -18, rLon: 13, rLat: 15 },
  { lon: 45, lat: 8, rLon: 8, rLat: 8 },
  // Asie
  { lon: 82, lat: 55, rLon: 42, rLat: 17 },
  { lon: 108, lat: 36, rLon: 28, rLat: 13 },
  { lon: 55, lat: 26, rLon: 13, rLat: 9 },
  { lon: 79, lat: 21, rLon: 11, rLat: 10 },
  { lon: 122, lat: 6, rLon: 14, rLat: 9 },
  // Océanie
  { lon: 133, lat: -25, rLon: 15, rLat: 11 },
  { lon: 172, lat: -42, rLon: 5, rLat: 5 },
];

const isLand = (lon: number, lat: number) =>
  LAND.some(
    (l) => ((lon - l.lon) / l.rLon) ** 2 + ((lat - l.lat) / l.rLat) ** 2 <= 1,
  );

export type MapNode = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  /** couleur du nœud */
  tone?: string;
  /** frame d'apparition */
  at?: number;
  /** libellé secondaire (ex. « serveur ») */
  sub?: string;
  /** position du texte par rapport au point */
  anchor?: 'left' | 'right';
};

export type MapRoute = {
  from: [number, number]; // [lon, lat]
  to: [number, number];
  at: number;
  /** durée du tracé de la ligne */
  dur?: number;
  color?: string;
  dashed?: boolean;
  label?: string;
  /** frame de départ du paquet (défaut : après le tracé) */
  packetAt?: number;
  /** durée de l'aller (le retour est plus rapide, comme dans la réalité d'un cache chaud) */
  packetDur?: number;
  /** espace, en px, entre la ligne courbe et la ligne droite */
  bulge?: number;
  /** opacité cible (pour estomper une route au profit d'une autre) */
  dimAt?: number;
};

export const WorldMap: React.FC<{
  width?: number;
  height?: number;
  nodes?: MapNode[];
  routes?: MapRoute[];
  /** points d'edge CDN qui s'allument en cascade */
  edges?: { lon: number; lat: number; at: number; tone?: string }[];
  accent?: string;
  style?: React.CSSProperties;
  /** cadre + fond du panneau */
  panel?: boolean;
}> = ({ width = 840, height = 420, nodes = [], routes = [], edges = [], accent = C.cyan400, style, panel = true }) => {
  const frame = useCurrentFrame();
  const proj = (lon: number, lat: number) => ({
    x: ((lon + 180) / 360) * width,
    y: ((80 - lat) / 140) * height,
  });

  // grille de points (mémoïsée : le calcul est fait une fois)
  const dots = React.useMemo(() => {
    const out: { x: number; y: number; key: string }[] = [];
    const stepLon = 4.2;
    const stepLat = 3.6;
    for (let lon = -180; lon <= 180; lon += stepLon) {
      for (let lat = -58; lat <= 78; lat += stepLat) {
        if (!isLand(lon, lat)) continue;
        const { x, y } = proj(lon, lat);
        out.push({ x, y, key: `${lon},${lat}` });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        ...(panel
          ? {
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(6,9,15,0.55)',
              overflow: 'hidden',
            }
          : {}),
        ...style,
      }}
    >
      {/* points des continents */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        {dots.map((d, i) => {
          const appear = ip(frame, [2 + (i % 26) * 0.6, 12 + (i % 26) * 0.6], [0, 1], EASE.outExpo);
          return (
            <circle
              key={d.key}
              cx={d.x}
              cy={d.y}
              r={2}
              fill={accent}
              opacity={0.16 * appear}
            />
          );
        })}
      </svg>

      {/* edges CDN */}
      {edges.map((e, i) => {
        const p = ip(frame, [e.at, e.at + 16], [0, 1], EASE.outBack);
        const pulse = frame > e.at + 16 ? 0.5 + 0.5 * Math.sin(((frame - e.at) / 60) * Math.PI * 2 * 0.7) : 0;
        const { x, y } = proj(e.lon, e.lat);
        const tone = e.tone ?? C.emerald400;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x - 5,
                top: y - 5,
                width: 10,
                height: 10,
                borderRadius: 999,
                background: tone,
                boxShadow: `0 0 ${12 + pulse * 10}px ${tone}`,
                opacity: p,
                transform: `scale(${p})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - 14,
                top: y - 14,
                width: 28,
                height: 28,
                borderRadius: 999,
                border: `1.5px solid ${tone}`,
                opacity: p * (0.5 - pulse * 0.35),
                transform: `scale(${0.6 + pulse * 0.8})`,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* routes */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {routes.map((r, i) => {
          const a = proj(r.from[0], r.from[1]);
          const b = proj(r.to[0], r.to[1]);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - (r.bulge ?? 42);
          const len = Math.hypot(b.x - a.x, b.y - a.y) * 1.3 + 60;
          const color = r.color ?? accent;
          const p = interpolate(frame, [r.at, r.at + (r.dur ?? 30)], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASE.outExpo,
          });
          const dim = r.dimAt === undefined ? 1 : ip(frame, [r.dimAt, r.dimAt + 20], [1, 0.25]);

          // paquet : aller puis retour
          const pAt = r.packetAt;
          const packetDur = r.packetDur ?? 72;
          const showPacket = pAt !== undefined && frame >= pAt;
          let pk = 0;
          if (showPacket) {
            const t = (frame - pAt) / packetDur; // 0→1 aller, 1→1.7 retour
            pk = t <= 1 ? t : Math.max(0, 1 - (t - 1) / 0.7);
          }
          const q = (t: number) => ({
            x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t ** 2 * b.x,
            y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t ** 2 * b.y,
          });
          const packet = q(Math.min(1, Math.max(0, pk)));

          return (
            <g key={i} style={{ opacity: dim }}>
              <path
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={r.dashed ? '8 10' : len}
                strokeDashoffset={r.dashed ? -((frame * 0.8) % 18) : (1 - p) * len}
                opacity={r.dashed ? 0.75 * p : 0.9 * p}
                style={{ filter: `drop-shadow(0 0 8px ${color})` }}
              />
              {showPacket && (
                <>
                  <circle cx={packet.x} cy={packet.y} r={16} fill={color} opacity={0.22} />
                  <circle cx={packet.x} cy={packet.y} r={6} fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
                </>
              )}
              {r.label && p > 0.9 && (
                <text
                  x={mx + 14}
                  y={my - 8}
                  fill={color}
                  fontFamily={FONT.mono}
                  fontSize={24}
                  fontWeight={700}
                  opacity={(p - 0.9) / 0.1}
                >
                  {r.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* nœuds */}
      {nodes.map((n) => {
        const { x, y } = proj(n.lon, n.lat);
        const tone = n.tone ?? accent;
        const p = ip(frame, [n.at ?? 0, (n.at ?? 0) + 14], [0, 1], EASE.outBack);
        const pulse = frame > (n.at ?? 0) + 14 ? 0.5 + 0.5 * Math.sin(((frame - (n.at ?? 0)) / 60) * Math.PI * 2 * 0.65) : 0;
        return (
          <div key={n.id} style={{ position: 'absolute', left: x, top: y, opacity: p }}>
            {/* halo */}
            <div
              style={{
                position: 'absolute',
                left: -26,
                top: -26,
                width: 52,
                height: 52,
                borderRadius: 999,
                background: `radial-gradient(circle, ${hexA(tone, 0.35)} 0%, transparent 65%)`,
                transform: `scale(${0.9 + pulse * 0.2})`,
              }}
            />
            {/* point */}
            <div
              style={{
                position: 'absolute',
                left: -7,
                top: -7,
                width: 14,
                height: 14,
                borderRadius: 999,
                background: tone,
                boxShadow: `0 0 20px ${tone}`,
              }}
            />
            {/* étiquette */}
            <div
              style={{
                position: 'absolute',
                top: n.anchor === 'left' ? -26 : 16,
                left: n.anchor === 'left' ? undefined : 16,
                right: n.anchor === 'left' ? 16 : undefined,
                textAlign: n.anchor === 'left' ? 'right' : 'left',
                whiteSpace: 'nowrap',
                transform: `scale(${p})`,
              }}
            >
              <div
                className="mono"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: tone,
                  letterSpacing: '0.06em',
                  textShadow: `0 0 18px ${hexA(tone, 0.7)}`,
                }}
              >
                {n.name}
              </div>
              {n.sub && (
                <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 18, color: C.textMuted }}>
                  {n.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
};
