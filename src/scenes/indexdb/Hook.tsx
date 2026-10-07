import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { BrowserFrame } from '../../components/BrowserFrame';
import { ScanStream } from '../../components/ScanStream';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { CodeEditor } from '../../components/CodeEditor';
import { C, FONT, GLOW } from '../../tokens';
import { ip, useShake } from '../../hooks';

/**
 * SCÈNE 1 — HOOK · 0–3 s (180 frames) — « Chercher un client dans un million de lignes : 4 secondes. »
 * Beat 1 (0–90) : la requête s'écrit, on clique Exécuter.
 * Beat 2 (90–180) : le scan tourne, les 4,21 s s'affichent → SLOW QUERY.
 */
export const IndexHook: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = useShake(132, 3);
  const done = frame >= 132;

  return (
    <Stage accent={C.rose500}>
      <BrowserFrame
        url="admin-db / requêtes"
        at={4}
        glow
        style={{ left: 120, top: 400, width: 840, height: 880 }}
      >
        <div style={{ padding: '26px 30px 30px' }}>
          {/* console de requête */}
          <CodeEditor
            code={`SELECT * FROM customers\nWHERE email = 'a.dupont@mail.fr';`}
            at={16}
            cps={34}
            fontSize={27}
            showLineNumbers={false}
            minimap={false}
            style={{ border: 'none', borderRadius: 0, background: 'transparent', padding: '6px 0 16px' }}
          />

          {/* bouton exécuter */}
          <div
            style={{
              height: 90,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              fontFamily: FONT.ui,
              fontSize: 30,
              fontWeight: 700,
              color: frame > 56 ? C.textPrimary : C.textSecondary,
              background: frame > 56 ? hexA(C.indigo500, 0.24) : 'rgba(255,255,255,0.045)',
              border: `1px solid ${frame > 46 ? hexA(C.indigo400, 0.65) : 'rgba(255,255,255,0.1)'}`,
              boxShadow: frame > 56 ? GLOW.indigo : 'none',
              transform: `scale(${frame > 60 && frame < 68 ? 0.975 : 1})`,
            }}
          >
            Exécuter
          </div>

          {/* le scan démarre */}
          <div style={{ marginTop: 24 }}>
            <ScanStream
              at={72}
              width={780}
              height={360}
              scanFrom={78}
              stopAt={132}
              match="a.dupont@mail.fr"
              accent={C.rose400}
              hud={false}
              seconds={4.21}
            />
          </div>
        </div>
      </BrowserFrame>

      {/* verdict */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 1300,
          transform: `translateX(${shake.x}px)`,
          opacity: ip(frame, [66, 84], [0, 1]),
        }}
      >
        <StatusCodeBadge
          at={132}
          variant="error"
          label="SLOW QUERY · 4,21 s"
          size={38}
          shake
        />
      </div>

      <Cursor
        keys={[
          { at: 0, x: 780, y: 1560 },
          { at: 30, x: 540, y: 1010, act: 'hover' },
          { at: 44, x: 540, y: 1010, act: 'click' },
          { at: 96, x: 660, y: 1180, act: 'hover' },
        ]}
        enterAt={0}
        size={38}
      />

      <Caption text="Chercher un client dans un million de lignes…" at={4} until={86} size={62} style={{ top: 1490 }} />
      <Caption
        text="…quatre secondes."
        at={92}
        size={78}
        emphasize={[1]}
        style={{ top: 1490 }}
      />

      {/* voile rouge à l'annonce du temps */}
      {done && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(60% 40% at 50% 62%, ${hexA(C.rose500, 0.16 * interpolate(frame, [132, 160], [1, 0.5]))}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <SceneVo clip="index-hook" />
      <SceneSfx scene="idx-hook" />
    </Stage>
  );
};
