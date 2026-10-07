import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FPS, H, SAFE, W } from '../tokens';

/**
 * Stage — fond commun à toutes les scènes (dark mode élégant + grille + halos).
 * Ne contient aucune animation : les mouvements sont portés par <Camera>.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  accent?: string; // couleur du halo (indigo par défaut → 1 accent par scène)
  grid?: boolean;
  vignette?: boolean;
  /** guide visuel des safe zones (debug / revue uniquement) */
  guides?: boolean;
}> = ({ children, accent = C.indigo500, grid = true, vignette = true, guides = false }) => (
  <AbsoluteFill style={{ backgroundColor: C.bgBase, fontFamily: 'Inter, system-ui, sans-serif' }}>
    {/* halos diffus */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 60% at 12% 6%, ${hexA(accent, 0.17)} 0%, transparent 60%),
                     radial-gradient(110% 55% at 105% 92%, ${hexA(C.cyan400, 0.10)} 0%, transparent 62%)`,
      }}
    />
    {/* grille technique très discrète */}
    {grid && (
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
                            linear-gradient(0deg, rgba(255,255,255,0.035) 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          maskImage: 'radial-gradient(90% 70% at 50% 42%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(90% 70% at 50% 42%, black 30%, transparent 100%)',
        }}
      />
    )}
    {children}
    {/* vignette */}
    {vignette && (
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 80% at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
    )}
    {guides && <SafeGuides />}
  </AbsoluteFill>
);

/** repères de safe zones (25–72 % focale, captions 78 %, right-safe 120 px) */
const SafeGuides: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.sideMargin,
          right: SAFE.sideMargin,
          top: SAFE.focusTop * H,
          height: (SAFE.focusBottom - SAFE.focusTop) * H,
          border: '1px dashed rgba(52,211,153,0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SAFE.captionTop * H,
          borderTop: '1px dashed rgba(34,211,238,0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: SAFE.rightSafe,
          borderLeft: '1px dashed rgba(251,113,133,0.45)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: SAFE.sideMargin,
          borderLeft: '1px dashed rgba(255,255,255,0.25)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: SAFE.topMargin,
          left: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 22,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        safe-top {frame0(f)} · canvas {W}×{H}
      </div>
    </AbsoluteFill>
  );
};

const frame0 = (f: number) => `${(f / FPS).toFixed(2)}s`;

/** #RRGGBB + alpha → rgba() */
export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};
