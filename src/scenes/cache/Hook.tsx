import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { BrowserFrame } from '../../components/BrowserFrame';
import { Waterfall, type WaterfallRow } from '../../components/Waterfall';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, EASE, FONT } from '../../tokens';
import { ip, useShake } from '../../hooks';

export const REQUEST_MS = 412;

/**
 * Les 10 requêtes de la page, **en série** : 10 × 412 ms = 4 120 ms.
 * C'est le fil rouge des trois premières vues (et le chiffre du hook).
 */
export const PAGE_ROWS: WaterfallRow[] = [
  { id: 'doc', label: 'index.html', start: 0, dur: 412, state: 'doc', at: 8, tag: '412 ms' },
  { id: 'app', label: 'app.js', start: 412, dur: 412, state: 'miss', at: 12 },
  { id: 'vendor', label: 'vendor.js', start: 824, dur: 412, state: 'miss', at: 16 },
  { id: 'css', label: 'styles.css', start: 1236, dur: 412, state: 'miss', at: 20 },
  { id: 'logo', label: 'logo.svg', start: 1648, dur: 412, state: 'miss', at: 24 },
  { id: 'hero', label: 'hero.jpg', start: 2060, dur: 412, state: 'miss', at: 28 },
  { id: 'font', label: 'inter.woff2', start: 2472, dur: 412, state: 'miss', at: 32 },
  { id: 'api', label: 'api/products', start: 2884, dur: 412, state: 'miss', at: 36 },
  { id: 'cart', label: 'api/cart', start: 3296, dur: 412, state: 'miss', at: 40 },
  { id: 'analytics', label: 'analytics.js', start: 3708, dur: 412, state: 'miss', at: 44 },
];
/**
 * SCÈNE 1 — HOOK · 0–3 s (180 frames)
 * « Ta page met quatre secondes… et ce n'est pas ton code. »
 */
export const CacheHook: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = useShake(126, 3);
  const glitch = frame >= 122 && frame <= 136;
  const total = Math.round(ip(frame, [14, 124], [0, 4120], EASE.linear));

  return (
    <Stage accent={C.rose500}>
      <BrowserFrame url="boutique.app" at={4} glow style={{ left: 96, top: 400, width: 888, height: 430 }}>
        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* squelette de page */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: hexA(C.rose400, 0.18) }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 16, width: '55%', borderRadius: 8, background: hexA(C.rose400, 0.22) }} />
              <div style={{ height: 12, width: '35%', borderRadius: 6, background: 'rgba(255,255,255,0.10)', marginTop: 10 }} />
            </div>
          </div>
          <div style={{ height: 120, borderRadius: 12, background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, height: 92, borderRadius: 12, background: 'rgba(255,255,255,0.045)' }} />
            ))}
          </div>
        </div>
      </BrowserFrame>

      {/* chronogramme des 10 requêtes */}
      <Waterfall
        rows={PAGE_ROWS}
        width={840}
        scaleMax={4400}
        rowHeight={30}
        fontSize={17}
        at={8}
        totalAt={124}
        totalLabel="CHARGEMENT COMPLET"
        totalValue={`${(total / 1000).toFixed(2).replace('.', ',')} s`}
        totalTone={C.rose400}
        title="RÉSEAU — 10 REQUÊTES"
        style={{ position: 'absolute', left: 120, top: 880 }}
      />

      <div style={{ position: 'absolute', left: 120, top: 1330, transform: `translateX(${shake.x}px)` }}>
        <StatusCodeBadge at={128} variant="error" label="4,12 s · LE RÉSEAU" size={34} shake />
      </div>

      <Cursor
        keys={[
          { at: 0, x: 820, y: 1500 },
          { at: 40, x: 520, y: 1000 },
          { at: 90, x: 700, y: 1150, act: 'hover' },
        ]}
        enterAt={0}
        size={36}
      />

      <Caption text="Ta page met quatre secondes." at={2} until={84} size={68} emphasize={[3]} style={{ top: 1490 }} />
      <Caption text="…et ce n'est pas ton code." at={92} size={68} emphasize={[5]} style={{ top: 1490 }} />

      {glitch && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(0deg, transparent, ${hexA(C.rose500, 0.10)}, transparent)`,
            marginLeft: frame % 2 === 0 ? 4 : -4,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* rappel visuel : ce n'est pas le CPU */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 1400,
          fontFamily: FONT.mono,
          fontSize: 22,
          color: C.textMuted,
          opacity: ip(frame, [130, 150], [0, 1]),
        }}
      >
        CPU 4 % — la page attend le réseau, pas le processeur
      </div>

      <SceneVo clip="cache-hook" />
      <SceneSfx scene="cache-hook" />
    </Stage>
  );
};
