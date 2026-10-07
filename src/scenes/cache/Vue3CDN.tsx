import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { WorldMap } from '../../components/WorldMap';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';

const NY: [number, number] = [-74, 40.7];
const PARIS: [number, number] = [2.35, 48.85];

/** villes où un CDN réel possède un point de présence */
const CITIES: [number, number][] = [
  [-122.4, 37.8], [-118.2, 34.1], [-87.6, 41.9], [-79.4, 43.7], [-99.1, 19.4],
  [-46.6, -23.5], [-58.4, -34.6], [-0.1, 51.5], [2.35, 48.85], [4.9, 52.4],
  [8.7, 50.1], [-3.7, 40.4], [9.2, 45.5], [18.1, 59.3], [12.6, 55.7],
  [3.4, 6.5], [36.8, -1.3], [28.0, -26.2], [55.3, 25.3], [72.9, 19.1],
  [77.2, 28.6], [103.8, 1.35], [106.8, -6.2], [114.2, 22.3], [139.7, 35.7],
  [126.9, 37.6], [151.2, -33.9], [174.8, -36.9], [121.5, 31.2], [100.5, 13.7],
  [31.2, 30.0], [35.2, 31.8], [44.4, 33.3], [51.4, 35.7], [16.4, 48.2],
  [14.4, 50.1], [24.9, 60.2], [30.3, 59.9], [-70.7, -33.4], [-77.0, -12.0],
];

/**
 * VUE 3/4 — LE CDN · 9 s (540 frames)
 * Beats : 0–150 (le visiteur est loin du serveur) · 150–330 (300 edges s'allument)
 *         330–540 (le nœud local répond en 28 ms)
 */
export const CacheVue3CDN: React.FC = () => {
  const frame = useCurrentFrame();
  const localUp = frame >= 330;

  return (
    <Stage accent={C.emerald500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 330, scale: 1.08, origin: '50% 46%' },
          { at: 440, scale: 1.0 },
        ]}
      >
        <SceneHeader
          kicker="Le CDN — rapprocher la copie"
          at={4}
          accent={C.emerald400}
          right={<StatusCodeBadge at={12} variant="info" label="5 837 km" size={22} />}
        />

        <WorldMap
          width={840}
          height={400}
          accent={C.cyan400}
          style={{ position: 'absolute', left: 120, top: 590 }}
          nodes={[
            { id: 'ny', name: 'TES VISITEURS', sub: 'New York', lon: NY[0], lat: NY[1], tone: C.cyan400, at: 8, anchor: 'left' },
            { id: 'paris', name: 'TON SERVEUR', sub: 'Paris', lon: PARIS[0], lat: PARIS[1], tone: C.indigo400, at: 26, anchor: 'left' },
            ...(localUp
              ? [
                  {
                    id: 'edge',
                    name: 'EDGE · 28 ms',
                    lon: -96,
                    lat: 26,
                    tone: C.emerald400,
                    at: 336,
                  },
                ]
              : []),
          ]}
          edges={CITIES.slice(0, 38).map(([lon, lat], i) => ({
            lon,
            lat,
            at: 152 + i * 4.4,
          }))}
          routes={[
            // la longue route vers Paris : elle reste visible, puis s'estompe
            {
              from: NY,
              to: PARIS,
              at: 40,
              dur: 30,
              dashed: true,
              color: C.rose400,
              packetAt: 100,
              packetDur: 110,
              bulge: 34,
              dimAt: localUp ? 350 : undefined,
              label: '412 ms',
            },
            // la route locale, une fois l'edge en place
            ...(localUp
              ? [
                  {
                    from: NY,
                    to: [-96, 26] as [number, number],
                    at: 344,
                    dur: 22,
                    color: C.emerald400,
                    packetAt: 366,
                    packetDur: 40,
                    bulge: 10,
                  },
                ]
              : []),
          ]}
        />

        {/* compteur d'edges */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 1010,
            width: 840,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            className="mono tnum"
            style={{
              fontFamily: FONT.mono,
              fontSize: 46,
              fontWeight: 700,
              color: C.emerald400,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 30px ${hexA(C.emerald400, 0.5)}`,
            }}
          >
            {Math.min(300, Math.round(ip(frame, [152, 320], [0, 300], undefined)))}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.1em', color: C.textMuted }}>
            POINTS DE PRÉSENCE (EDGE)
          </div>
        </div>

        {/* verdict */}
        {frame >= 410 && (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 1110,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: ip(frame, [410, 432], [0, 1]),
            }}
          >
            <StatusCodeBadge at={414} variant="success" label="TTFB 28 ms" size={30} />
            <span
              className="mono"
              style={{
                fontFamily: FONT.mono,
                fontSize: 48,
                fontWeight: 700,
                color: C.emerald400,
                textShadow: `0 0 34px ${hexA(C.emerald400, 0.6)}`,
              }}
            >
              ÷15
            </span>
            <span style={{ fontFamily: FONT.ui, fontSize: 24, color: C.textSecondary }}>
              même contenu, distance divisée par 200
            </span>
          </div>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 16, x: 880, y: 1250 },
          { at: 120, x: 560, y: 830, act: 'hover' },
          { at: 360, x: 480, y: 900 },
          { at: 470, x: 700, y: 1180 },
        ]}
        enterAt={14}
        hideAt={520}
        size={32}
      />

      <Caption text="Mais tes visiteurs, eux, sont à New York." at={30} until={148} size={58} style={{ top: 1490 }} />
      <Caption
        text="Un CDN pose une copie dans 300 villes."
        at={164}
        until={326}
        size={58}
        emphasize={[7]}
        style={{ top: 1490 }}
      />
      <Caption text="Vingt-huit millisecondes au lieu de quatre cents." at={342} size={56} emphasize={[6, 7]} style={{ top: 1490 }} />

      <SceneVo clip="cache-vue3" />
      <SceneSfx scene="cache-vue3" />
    </Stage>
  );
};
