import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { GlassCard } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT, GLOW } from '../../tokens';
import { Caption } from '../../components/Caption';
import { ip } from '../../hooks';

const LETTERS = [
  { k: 'A', word: 'Atomicité', sub: 'tout ou rien' },
  { k: 'C', word: 'Cohérence', sub: 'règles respectées' },
  { k: 'I', word: 'Isolation', sub: 'chacun son tour' },
  { k: 'D', word: 'Durabilité', sub: 'écrit pour toujours' },
];

/**
 * BLOC 4 — OUTRO / CTA · 5 s (300 frames)
 * Beats : 0–150 (récap A·C·I·D) · 150–300 (abonnement + dolly-out)
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const collapsed = frame >= 130;
  const c = ip(frame, [130, 152], [0, 1]);

  return (
    <Stage accent={C.emerald500}>
      <Camera keys={[{ at: 0, scale: 1 }, { at: 170, scale: 0.96 }, { at: 300, scale: 0.94 }]}>
        <SceneHeader kicker="Ce qu'il faut retenir" at={0} accent={C.emerald400} />

        {/* 4 cartes A·C·I·D */}
        {!collapsed || c < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 620,
              width: 840,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 22,
              opacity: 1 - c,
            }}
          >
            {LETTERS.map((l, i) => (
              <GlassCard
                key={l.k}
                at={6 + i * 4}
                accent={C.emerald400}
                glow={false}
                style={{ position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span
                    className="mono"
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 62,
                      fontWeight: 700,
                      color: C.emerald400,
                      textShadow: `0 0 30px ${hexA(C.emerald400, 0.6)}`,
                    }}
                  >
                    {l.k}
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT.ui, fontSize: 34, fontWeight: 700, color: C.textPrimary }}>
                      {l.word}
                    </div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.textMuted }}>{l.sub}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : null}

        {/* ligne unique condensée */}
        {collapsed && (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 620,
              width: 840,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 26,
              opacity: c,
            }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={l.k}
                className="mono"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 92,
                  fontWeight: 700,
                  color: C.emerald400,
                  textShadow: `0 0 40px ${hexA(C.emerald400, 0.55)}`,
                  transform: `translateY(${ip(frame, [140 + i * 4, 158 + i * 4], [24, 0])}px)`,
                  opacity: ip(frame, [140 + i * 4, 158 + i * 4], [0, 1]),
                }}
              >
                {l.k}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: 1080,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            opacity: ip(frame, [168, 190], [0, 1]),
            transform: `scale(${0.96 + ip(frame, [168, 190], [0, 1]) * 0.04})`,
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
            PROCHAINE VIDÉO : LES INDEX
          </div>
        </div>

        <div style={{ position: 'absolute', left: 120, top: 1300 }}>
          <StatusCodeBadge at={200} variant="success" label="150,00 € — toujours juste" size={24} />
        </div>
      </Camera>

      <Cursor
        keys={[
          { at: 150, x: 860, y: 1320 },
          { at: 186, x: 540, y: 1160, act: 'hover' },
          { at: 200, x: 540, y: 1160, act: 'click' },
          { at: 240, x: 600, y: 1240 },
        ]}
        enterAt={148}
        accent={C.emerald400}
        size={36}
      />

      <Caption text="Atomicité, cohérence, isolation, durabilité." at={20} until={168} size={54} style={{ top: 1490 }} />
      <Caption text="ACID. C'est ce qui protège ton argent." at={186} size={58} emphasize={[0]} style={{ top: 1490 }} />
      <SceneSfx scene="outro" />
    </Stage>
  );
};
