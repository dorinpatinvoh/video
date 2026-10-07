import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { TabBar } from '../../components/BrowserFrame';
import { CodeEditor } from '../../components/CodeEditor';
import { Waterfall } from '../../components/Waterfall';
import { CompareBars } from '../../components/SortedLookup';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT, GLOW } from '../../tokens';
import { ip } from '../../hooks';

const CODE = `// headers.ts — trois en-têtes, trois intentions
'Cache-Control': 'public, max-age=31536000, immutable'
'Cache-Control': 'no-cache'
'Cache-Control': 'no-store'`;

/** la page après correctif : 1 MISS (l'edge se remplit) + 9 HIT locaux = 0,31 s */
const AFTER_ROWS = [
  { id: 'doc', label: 'index.html', start: 0, dur: 300, state: 'miss' as const, at: 332, tag: 'MISS · 300 ms' },
  { id: 'a1', label: 'app.7f3a9c.js', start: 302, dur: 2, state: 'hit' as const, at: 340, tag: 'HIT · 2 ms' },
  { id: 'a2', label: 'vendor.a91c2e.js', start: 303, dur: 2, state: 'hit' as const, at: 346, tag: 'HIT · 2 ms' },
  { id: 'a3', label: 'styles.4b81.css', start: 304, dur: 2, state: 'hit' as const, at: 352, tag: 'HIT · 2 ms' },
  { id: 'a4', label: 'logo.9f2a.svg', start: 305, dur: 2, state: 'hit' as const, at: 358, tag: 'HIT · 2 ms' },
  { id: 'a5', label: 'hero.71bd.jpg', start: 306, dur: 2, state: 'hit' as const, at: 364, tag: 'HIT · 2 ms' },
  { id: 'a6', label: 'inter.3c9f.woff2', start: 307, dur: 2, state: 'hit' as const, at: 370, tag: 'HIT · 2 ms' },
  { id: 'a7', label: 'api/products', start: 308, dur: 2, state: 'hit' as const, at: 376, tag: 'HIT · 2 ms' },
  { id: 'a8', label: 'api/cart', start: 309, dur: 2, state: 'hit' as const, at: 382, tag: 'HIT · 2 ms' },
  { id: 'a9', label: 'analytics.2d77.js', start: 310, dur: 2, state: 'hit' as const, at: 388, tag: 'HIT · 2 ms' },
];

/**
 * BLOC 3 — DÉMO DE CODE · 10 s (600 frames)
 * Beats : 0–300 (les trois en-têtes, machine à écrire) · 300–460 (la page après correctif)
 *         460–600 (verdict : 4,12 s → 0,31 s)
 */
export const CacheDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const codeOut = ip(frame, [298, 316], [0, 1]);

  return (
    <Stage accent={C.indigo500}>
      <SceneHeader
        kicker="Le pattern — trois en-têtes"
        at={4}
        accent={C.indigo400}
        right={<StatusCodeBadge at={26} variant="success" label="1 an de cache" size={22} />}
      />

      {/* ---- beat 1 : le code (l'éditeur disparaît avant que le chrono n'arrive) ---- */}
      <Camera keys={[{ at: 0, scale: 1 }, { at: 250, scale: 1.06, origin: '50% 36%' }, { at: 316, scale: 1.0, origin: '50% 36%' }]}>
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 560,
            width: 900,
            borderRadius: 22,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `${GLOW.card}${frame > 180 ? `, ${GLOW.indigo}` : ''}`,
            background: C.bgAlt,
            opacity: 1 - codeOut,
          }}
        >
          <TabBar tabs={['headers.ts', 'index.html']} active={0} />
          <CodeEditor
            code={CODE}
            at={24}
            cps={54}
            fontSize={21}
            focusLine={0}
            focusAt={196}
            accent={C.indigo400}
            showLineNumbers
            notes={[
              { line: 0, text: 'assets', tone: C.emerald400 },
              { line: 1, text: 'HTML', tone: C.cyan400 },
              { line: 2, text: 'perso', tone: C.rose400 },
            ]}
            style={{ border: 'none', borderRadius: 0 }}
          />
        </div>
      </Camera>

      {/* ---- beat 2 : la page après correctif ---- */}
      {frame >= 316 && (
        <Waterfall
          rows={AFTER_ROWS}
          width={840}
          scaleMax={620}
          rowHeight={30}
          fontSize={17}
          at={322}
          title="RÉSEAU APRÈS CORRECTIF"
          totalAt={452}
          totalLabel="CHARGEMENT"
          totalValue="0,31 s"
          totalTone={C.emerald400}
          style={{ position: 'absolute', left: 120, top: 600 }}
        />
      )}

      {/* ---- beat 3 : verdict ---- */}
      {frame >= 470 && (
        <div style={{ position: 'absolute', left: 120, top: 1090, width: 840 }}>
          <CompareBars
            width={840}
            barHeight={38}
            items={[
              { label: 'AVANT', value: 4120, unit: 'ms', max: 4120, tone: C.rose400, at: 474 },
              { label: 'APRÈS', value: 310, unit: 'ms', max: 4120, tone: C.emerald400, at: 506, note: '1 MISS + 9 HIT' },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
            <StatusCodeBadge at={530} variant="success" label="4,12 s → 0,31 s" size={26} />
            <span
              className="mono"
              style={{
                fontFamily: FONT.mono,
                fontSize: 48,
                fontWeight: 700,
                color: C.emerald400,
                textShadow: `0 0 40px ${hexA(C.emerald400, 0.6)}`,
                opacity: ip(frame, [538, 556], [0, 1]),
                transform: `scale(${0.9 + ip(frame, [538, 556], [0, 1]) * 0.1})`,
              }}
            >
              ÷13
            </span>
          </div>
        </div>
      )}

      <Caption
        text="Ce qui ne change jamais se cache un an."
        at={40}
        until={292}
        size={56}
        emphasize={[4, 5, 6]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Dix requêtes, une seule sortie réseau."
        at={330}
        until={450}
        size={58}
        emphasize={[4, 5]}
        style={{ top: 1490 }}
      />
      <Caption text="Quatre secondes… trente centièmes." at={480} size={60} emphasize={[2, 3]} style={{ top: 1490 }} />

      <SceneVo clip="cache-demo" />
      <SceneSfx scene="cache-demo" />
    </Stage>
  );
};
