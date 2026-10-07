import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASE, H, W } from '../tokens';

export type CamKey = {
  /** frame locale */
  at: number;
  /** échelle (1 = plan large). Zoom de focus : 1.12 léger / 1.28 dramatique */
  scale?: number;
  /** décalage latéral en px — pan max ±220 px */
  x?: number;
  /** décalage vertical en px (à utiliser avec parcimonie) */
  y?: number;
  /** rotation filmique ≤ 0.6° */
  rotate?: number;
  /** point d'ancrage du zoom (défaut : centre du cadre) */
  origin?: string;
  /** easing du segment qui aboutit à cette clé */
  ease?: (v: number) => number;
};

/**
 * Camera — simulateur de caméra pour le cadre 9:16.
 * Contrairement aux zooms CSS naïfs, la caméra *recentre* le sujet :
 * une clé peut définir `origin` + `x/y` pour garder le focus dans la zone 25–72 %.
 *
 * Règle STANDARD §2.2 : jamais zoom ET pan sur le même segment.
 */
export const Camera: React.FC<{
  keys: CamKey[];
  children: React.ReactNode;
  /** légère perspective 3D pour les cartes inclinées (retour à 0° en fin de plan) */
  tilt?: CamKey[];
}> = ({ keys, children, tilt }) => {
  const frame = useCurrentFrame();
  const sorted = [...keys].sort((a, b) => a.at - b.at);

  const channel = (get: (k: CamKey) => number | undefined, fallback: number) => {
    let value = get(sorted[0]) ?? fallback;
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      const av = get(a) ?? value;
      const bv = get(b) ?? av;
      if (frame < b.at) {
        return interpolate(frame, [a.at, b.at], [av, bv], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: b.ease ?? EASE.inoutSoft,
        });
      }
      value = bv;
    }
    return value;
  };

  const scale = channel((k) => k.scale, 1);
  const x = channel((k) => k.x, 0);
  const y = channel((k) => k.y, 0);
  const rotate = channel((k) => k.rotate, 0);

  // origine : dernière clé passée qui définit un origin
  let origin = '50% 50%';
  for (const k of sorted) if (k.at <= frame && k.origin) origin = k.origin;

  const tScale = tilt ? channelFrom(tilt, frame, (k) => k.scale, 1) : 0;
  const tX = tilt ? channelFrom(tilt, frame, (k) => k.x, 0) : 0;
  const tY = tilt ? channelFrom(tilt, frame, (k) => k.y, 0) : 0;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          width: W,
          height: H,
          transformOrigin: origin,
          transform: `perspective(1200px) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateZ(${rotate}deg) rotateX(${tY}deg) rotateY(${tX}deg)`,
          willChange: 'transform',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const channelFrom = (
  keys: CamKey[],
  frame: number,
  get: (k: CamKey) => number | undefined,
  fallback: number,
) => {
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  let value = get(sorted[0]) ?? fallback;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const av = get(a) ?? value;
    const bv = get(b) ?? av;
    if (frame < b.at) {
      return interpolate(frame, [a.at, b.at], [av, bv], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: b.ease ?? EASE.inoutSoft,
      });
    }
    value = bv;
  }
  return value;
};
