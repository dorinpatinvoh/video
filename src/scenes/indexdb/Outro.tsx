import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { GlassCard } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT, GLOW } from '../../tokens';
import { ip } from '../../hooks';

const REFLEXES = [
  { k: '01', t: 'Indexe ce que tu filtres', s: 'et ce que tu joins', short: 'FILTRER' },
  { k: '02', t: 'Attention aux fonctions', s: 'LOWER(), LIKE \'%…\' → scan complet', short: 'SE MÉFIER' },
  { k: '03', t: 'Vérifie avec EXPLAIN', s: 'Index Scan visé, pas Seq Scan', short: 'EXPLAIN' },
];

/**
 * BLOC 4 — OUTRO / CTA · 5 s (300 frames)
 * Beats : 0–150 (les 3 réflexes) · 150–300 (abonnement + teaser « le cache »)
 */
export const IndexOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const collapsed = frame >= 130;
  const c = ip(frame, [130, 152], [0, 1]);

  return (
    <Stage accent={C.cyan400}>
      <Camera keys={[{ at: 0, scale: 1 }, { at: 170, scale: 0.96 }, { at: 300, scale: 0.94 }]}>
        <SceneHeader kicker="Ce qu'il faut retenir" at={0} accent={C.cyan400} />

        {!collapsed || c < 1 ? (
          <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - c }}>
            {REFLEXES.map((r, i) => (
              <GlassCard key={r.k} at={4 + i * 6} accent={C.cyan400} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 700, color: C.cyan400 }}>
                    {r.k}
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT.ui, fontSize: 34, fontWeight: 700, color: C.textPrimary }}>{r.t}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.textMuted }}>{r.s}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : null}

        {collapsed && (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 660,
              width: 840,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              opacity: c,
            }}
          >
            {REFLEXES.map((r, i) => (
              <span
                key={r.k}
                className="mono"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 38,
                  fontWeight: 700,
                  color: C.cyan400,
                  textShadow: `0 0 30px ${hexA(C.cyan400, 0.5)}`,
                  opacity: ip(frame, [140 + i * 5, 158 + i * 5], [0, 1]),
                  transform: `translateY(${ip(frame, [140 + i * 5, 158 + i * 5], [18, 0])}px)`,
                }}
              >
                {i > 0 && <span style={{ color: C.textMuted, marginRight: 18 }}>·</span>}
                {r.short}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: 1030,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            opacity: ip(frame, [168, 190], [0, 1]),
          }}
        >
          <div
            style={{
              padding: '30px 62px',
              borderRadius: 999,
              background: hexA(C.emerald400, 0.14),
              border: `1px solid ${hexA(C.emerald400, 0.5)}`,
              boxShadow: `${GLOW.emerald}, 0 0 0 ${Math.max(0, (frame - 186) / 4)}px ${hexA(C.emerald400, 0.14)}`,
              fontFamily: FONT.ui,
              fontSize: 46,
              fontWeight: 800,
              color: C.emerald400,
              transform: `translateY(${frame > 230 && frame < 244 ? -4 : 0}px)`,
            }}
          >
            S'abonner
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 24, color: C.textMuted, letterSpacing: '0.06em' }}>
            PROCHAINE VIDÉO : LE CACHE
          </div>
        </div>

        <div style={{ position: 'absolute', left: 120, top: 1290 }}>
          <StatusCodeBadge at={200} variant="success" label="4 210 ms → 0,42 ms" size={24} />
        </div>
      </Camera>

      <Cursor
        keys={[
          { at: 150, x: 860, y: 1320 },
          { at: 186, x: 540, y: 1110, act: 'hover' },
          { at: 200, x: 540, y: 1110, act: 'click' },
          { at: 240, x: 600, y: 1200 },
        ]}
        enterAt={148}
        accent={C.emerald400}
        size={36}
      />

      <Caption text="Trois réflexes : filtrer, se méfier des fonctions, EXPLAIN." at={24} until={168} size={52} style={{ top: 1490 }} />
      <Caption text="Un bon index change tout." at={186} size={58} style={{ top: 1490 }} />

      <SceneVo clip="index-outro" />
      <SceneSfx scene="idx-outro" />
    </Stage>
  );
};
