import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { TabBar } from '../../components/BrowserFrame';
import { CodeEditor } from '../../components/CodeEditor';
import { CompareBars } from '../../components/SortedLookup';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT, GLOW } from '../../tokens';
import { ip } from '../../hooks';

const SQL = `-- migration.sql — l'index se crée une fois, pour toutes les requêtes
CREATE INDEX idx_customers_email ON customers (email);`;

/**
 * BLOC 3 — DÉMO · 10 s (600 frames)
 * Beats : 0–240 (on crée l'index) · 240–420 (avant : 4 210 ms) · 420–600 (après : 0,42 ms · ×10 000)
 */
export const IndexDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage accent={C.indigo500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 420, scale: 1.12, origin: '50% 68%' },
          { at: 520, scale: 1.06, origin: '50% 68%' },
        ]}
      >
        <SceneHeader kicker="Le pattern — une ligne" at={4} accent={C.indigo400} />

        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 610,
            width: 900,
            borderRadius: 22,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `${GLOW.card}${frame > 230 ? `, ${GLOW.indigo}` : ''}`,
            background: C.bgAlt,
          }}
        >
          <TabBar tabs={['migration.sql', 'explain.sql']} active={0} />
          <CodeEditor
            code={SQL}
            at={30}
            cps={30}
            fontSize={26}
            focusLine={1}
            focusAt={232}
            accent={C.indigo400}
            showLineNumbers
            minimap
            style={{ border: 'none', borderRadius: 0 }}
            notes={[{ line: 1, text: '← une fois', tone: C.indigo400 }]}
          />
        </div>

        {/* comparatif avant / après */}
        {frame >= 258 && (
          <div style={{ position: 'absolute', left: 120, top: 900, width: 840 }}>
            <CompareBars
              width={840}
              barHeight={48}
              items={[
                {
                  label: 'AVANT · Seq Scan',
                  value: 4210,
                  unit: 'ms',
                  max: 4210,
                  tone: C.rose400,
                  at: 262,
                  note: '1 048 576 lignes lues',
                },
              ]}
            />
          </div>
        )}
        {frame >= 432 && (
          <div style={{ position: 'absolute', left: 120, top: 1100, width: 840 }}>
            <CompareBars
              width={840}
              barHeight={48}
              items={[
                {
                  label: 'APRÈS · Index Scan',
                  value: 0.42,
                  unit: 'ms',
                  max: 4210,
                  tone: C.emerald400,
                  at: 436,
                  note: '20 comparaisons',
                },
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6 }}>
              <StatusCodeBadge at={452} variant="success" label="Index Scan · 0,42 ms" size={28} />
              <span
                className="mono"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 52,
                  fontWeight: 700,
                  color: C.emerald400,
                  textShadow: `0 0 40px ${hexA(C.emerald400, 0.6)}`,
                  opacity: ip(frame, [456, 478], [0, 1]),
                  transform: `scale(${0.9 + ip(frame, [456, 478], [0, 1]) * 0.1})`,
                }}
              >
                ×10 000
              </span>
            </div>
          </div>
        )}
      </Camera>

      {/* flèche « même requête » */}
      {frame >= 440 && (
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 1050,
            fontFamily: FONT.mono,
            fontSize: 22,
            color: C.textMuted,
            opacity: ip(frame, [440, 460], [0, 1]),
          }}
        >
          même requête, même table — juste un index
        </div>
      )}

      <Caption
        text="Une ligne suffit. On crée l'index une fois."
        at={40}
        until={250}
        size={56}
        emphasize={[0, 1]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Quatre mille deux cent dix millisecondes."
        at={268}
        until={424}
        size={58}
        emphasize={[2, 3, 4, 5]}
        style={{ top: 1490 }}
      />
      <Caption
        text="…zéro virgule quatre. Dix mille fois plus rapide."
        at={444}
        size={58}
        emphasize={[0, 1]}
        style={{ top: 1490 }}
      />

      <SceneSfx scene="idx-demo" />
    </Stage>
  );
};
