import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { CacheBox, Waterfall } from '../../components/Waterfall';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { CompareBars } from '../../components/SortedLookup';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';

const AFTER_ROWS = [
  { id: 'a', label: 'index.html', start: 0, dur: 412, state: 'miss' as const, at: 400, tag: 'MISS 412 ms' },
  { id: 'b', label: 'app.js', start: 414, dur: 2, state: 'hit' as const, at: 408, tag: 'HIT 2 ms' },
  { id: 'c', label: 'vendor.js', start: 418, dur: 2, state: 'hit' as const, at: 416, tag: 'HIT 2 ms' },
  { id: 'd', label: 'styles.css', start: 422, dur: 2, state: 'hit' as const, at: 424, tag: 'HIT 2 ms' },
  { id: 'e', label: 'logo.svg', start: 426, dur: 2, state: 'hit' as const, at: 432, tag: 'HIT 2 ms' },
  { id: 'f', label: 'hero.jpg', start: 430, dur: 2, state: 'hit' as const, at: 440, tag: 'HIT 2 ms' },
];

/**
 * VUE 2/4 — LE CACHE · 9 s (540 frames)
 * Beats : 0–180 (MISS : il faut aller le chercher) · 180–360 (HIT : il est déjà là) · 360–540 (×200)
 */
export const CacheVue2Cache: React.FC = () => {
  const frame = useCurrentFrame();
  const miss = frame < 200;

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 366, scale: 1.08, origin: '50% 72%' },
          { at: 470, scale: 1.0 },
        ]}
      >
        <SceneHeader
          kicker="Le cache — la mémoire"
          at={4}
          accent={C.cyan400}
          right={
            <StatusCodeBadge
              at={166}
              variant={miss ? 'error' : 'success'}
              label={miss ? 'MISS · 412 ms' : 'HIT · 2 ms'}
              size={24}
            />
          }
        />

        {/* le navigateur et le cache */}
        <div style={{ position: 'absolute', left: 120, top: 600, width: 840, display: 'flex', gap: 22 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              padding: 20,
            }}
          >
            <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.12em', color: C.textMuted }}>
              TON VISITEUR
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: 24, color: C.textPrimary }}>
              GET /app.js
            </div>
            <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: 20, color: miss ? C.rose400 : C.emerald400 }}>
              {miss ? 'la réponse doit venir de Paris…' : 'la réponse était à côté'}
            </div>
          </div>

          <CacheBox
            at={20}
            width={370}
            title="CACHE LOCAL"
            entries={[
              { id: 'e1', label: 'app.js · 42 ko', at: 250 },
              { id: 'e2', label: 'styles.css · 9 ko', at: 258 },
              { id: 'e3', label: 'hero.jpg · 118 ko', at: 266 },
            ]}
            missAt={120}
            missLabel="MISS · 412 ms"
            hitAt={286}
            hitLabel="HIT · 2 ms"
          />
        </div>

        {/* visite guidée du gyrophare : le paquet qui rebondit sur le cache */}
        <svg
          width={840}
          height={180}
          style={{ position: 'absolute', left: 120, top: 830 }}
        >
          {/* MISS : la longue route vers Paris */}
          {miss && (
            <path
              d="M 40 40 Q 300 -30 780 40"
              fill="none"
              stroke={C.rose400}
              strokeWidth={2.5}
              strokeDasharray={900}
              strokeDashoffset={(1 - ip(frame, [40, 90], [0, 1])) * 900}
              style={{ filter: `drop-shadow(0 0 8px ${C.rose400})` }}
            />
          )}
          {/* HIT : court-circuit immédiat */}
          {!miss && (
            <>
              <path
                d="M 40 40 L 300 40"
                fill="none"
                stroke={C.emerald400}
                strokeWidth={3}
                strokeDasharray={280}
                strokeDashoffset={(1 - ip(frame, [200, 226], [0, 1])) * 280}
                style={{ filter: `drop-shadow(0 0 10px ${C.emerald400})` }}
              />
              <circle
                cx={40 + ip(frame, [226, 246], [0, 260])}
                cy={40}
                r={7}
                fill={C.emerald400}
                style={{ filter: `drop-shadow(0 0 12px ${C.emerald400})` }}
              />
            </>
          )}
        </svg>

        {/* chronogramme avant / après */}
        <div style={{ position: 'absolute', left: 120, top: 980 }}>
          <Waterfall
            rows={[
              {
                id: 'miss',
                label: '1ʳᵉ requête',
                start: 0,
                dur: 412,
                state: 'miss',
                at: 30,
                tag: 'MISS · 412 ms',
              },
              {
                id: 'hit',
                label: '2ᵉ requête',
                start: 430,
                dur: 2,
                state: 'hit',
                at: 250,
                tag: 'HIT · 2 ms',
              },
            ]}
            width={840}
            scaleMax={620}
            rowHeight={40}
            fontSize={22}
            at={20}
            title="DEUX FOIS LA MÊME REQUÊTE"
          />
        </div>

        {/* verdict : ×200 */}
        {frame >= 366 && (
          <div style={{ position: 'absolute', left: 120, top: 1240, width: 840 }}>
            <CompareBars
              width={840}
              barHeight={44}
              items={[
                { label: 'SANS CACHE', value: 412, unit: 'ms', max: 412, tone: C.rose400, at: 372 },
                { label: 'AVEC CACHE', value: 2, unit: 'ms', max: 412, tone: C.emerald400, at: 396, note: '×200 plus rapide' },
              ]}
            />
          </div>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 10, x: 900, y: 1300 },
          { at: 120, x: 830, y: 700, act: 'hover' },
          { at: 286, x: 860, y: 760 },
          { at: 420, x: 700, y: 1200 },
        ]}
        enterAt={8}
        hideAt={520}
        size={32}
      />

      <Caption
        text="La première fois, il faut aller le chercher."
        at={40}
        until={196}
        size={58}
        emphasize={[7]}
        style={{ top: 1490 }}
      />
      <Caption
        text="La fois suivante, la réponse est déjà là."
        at={212}
        until={362}
        size={58}
        emphasize={[6, 7]}
        style={{ top: 1490 }}
      />
      <Caption text="Deux millisecondes au lieu de quatre cents." at={378} size={58} emphasize={[5, 6]} style={{ top: 1490 }} />

      {frame >= 424 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(50% 30% at 50% 70%, ${hexA(C.emerald400, 0.12)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <SceneVo clip="cache-vue2" />
      <SceneSfx scene="cache-vue2" />
    </Stage>
  );
};
