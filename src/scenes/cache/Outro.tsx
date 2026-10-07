import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { GlassCard } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT, GLOW } from '../../tokens';
import { ip } from '../../hooks';

const RULES = [
  { k: '01', t: 'Cache long', s: 'ce qui ne change jamais', short: 'CACHE LONG' },
  { k: '02', t: 'Empreinte dans le nom', s: 'ce qui change', short: 'EMPREINTE' },
  { k: '03', t: 'no-store', s: 'ce qui est personnel', short: 'NO-STORE' },
];

/**
 * BLOC 4 — OUTRO / CTA · 5 s (300 frames)
 */
export const CacheOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const collapsed = frame >= 130;
  const c = ip(frame, [130, 152], [0, 1]);

  return (
    <Stage accent={C.cyan400}>
      <Camera keys={[{ at: 0, scale: 1, origin: '50% 58%' }, { at: 170, scale: 1.0, origin: '50% 58%' }, { at: 300, scale: 1.06, origin: '50% 62%' }]}>
        <SceneHeader kicker="Ce qu'il faut retenir" at={0} accent={C.cyan400} />

        {!collapsed || c < 1 ? (
          <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', flexDirection: 'column', gap: 18, opacity: 1 - c }}>
            {RULES.map((r, i) => (
              <GlassCard key={r.k} at={4 + i * 6} accent={C.cyan400} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 700, color: C.cyan400 }}>
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
              top: 700,
              width: 840,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              opacity: c,
            }}
          >
            {RULES.map((r, i) => (
              <span key={r.k} className="mono" style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: C.cyan400, textShadow: `0 0 30px ${hexA(C.cyan400, 0.5)}` }}>
                {i > 0 && <span style={{ color: C.textMuted, marginRight: 14 }}>·</span>}
                {r.short}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            left: 240,
            top: 1000,
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
            PROCHAINE VIDÉO : LE TRAJET D'UNE URL
          </div>
        </div>

        <div style={{ position: 'absolute', left: 120, top: 1240 }}>
          <StatusCodeBadge at={200} variant="success" label="4,12 s → 0,31 s" size={24} />
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

      <Caption text="Cache long, empreinte, no-store : les trois règles." at={24} until={168} size={54} emphasize={[0, 1, 2]} style={{ top: 1490 }} />
      <Caption text="Bien caché, c'est invisible. Mal caché, c'est grave." at={186} size={56} emphasize={[6, 7]} style={{ top: 1490 }} />

      <SceneVo clip="cache-outro" />
      <SceneSfx scene="cache-outro" />
    </Stage>
  );
};
