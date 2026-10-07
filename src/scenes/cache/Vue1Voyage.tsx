import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { WorldMap } from '../../components/WorldMap';
import { Waterfall } from '../../components/Waterfall';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Circle } from '../../components/Annotation';
import { Highlight } from '../../components/GlassCard';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';
import { PAGE_ROWS } from './Hook';

const NY: [number, number] = [-74, 40.7];
const PARIS: [number, number] = [2.35, 48.85];

const HOPS = [
  { label: 'DNS', ms: 38, at: 96 },
  { label: 'TLS', ms: 120, at: 118 },
  { label: 'SERVEUR', ms: 182, at: 140 },
  { label: 'RETOUR', ms: 72, at: 162 },
];

/**
 * VUE 1/4 — LE VOYAGE · 9 s (540 frames)
 * Beats : 0–180 (la carte, le trajet) · 180–420 (le chronogramme) · 420–540 (verdict)
 */
export const CacheVue1Voyage: React.FC = () => {
  const frame = useCurrentFrame();
  const showMap = frame < 190;
  const showWaterfall = frame >= 186;

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 186, scale: 1.0 },
          { at: 420, scale: 1.0 },
          { at: 470, scale: 1.06, origin: '50% 70%' },
        ]}
      >
        <SceneHeader
          kicker="Sous le capot — le voyage"
          at={4}
          accent={C.cyan400}
          right={<StatusCodeBadge at={12} variant="info" label="412 ms / requête" size={22} />}
        />

        {/* --- beat 1 : la carte --- */}
        {showMap && (
          <>
            <WorldMap
              width={840}
              height={400}
              accent={C.cyan400}
              style={{ position: 'absolute', left: 120, top: 600 }}
              nodes={[
                { id: 'ny', name: 'NEW YORK', sub: 'ton visiteur', lon: NY[0], lat: NY[1], tone: C.cyan400, at: 10, anchor: 'left' },
                { id: 'paris', name: 'PARIS', sub: 'ton serveur', lon: PARIS[0], lat: PARIS[1], tone: C.indigo400, at: 30, anchor: 'right' },
              ]}
              routes={[
                {
                  from: NY,
                  to: PARIS,
                  at: 44,
                  dur: 34,
                  dashed: true,
                  color: C.rose400,
                  packetAt: 96,
                  packetDur: 96,
                  bulge: 40,
                },
              ]}
            />

            {/* détail du trajet */}
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 1050,
                width: 840,
                display: 'flex',
                gap: 14,
              }}
            >
              {HOPS.map((h) => {
                const p = ip(frame, [h.at, h.at + 14], [0, 1]);
                return (
                  <div
                    key={h.label}
                    style={{
                      flex: 1,
                      padding: '16px 18px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      opacity: p,
                      transform: `translateY(${(1 - p) * 16}px)`,
                    }}
                  >
                    <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.1em', color: C.textMuted }}>
                      {h.label}
                    </div>
                    <div
                      className="mono tnum"
                      style={{
                        fontFamily: FONT.mono,
                        fontSize: 32,
                        fontWeight: 700,
                        color: C.textPrimary,
                        fontVariantNumeric: 'tabular-nums',
                        marginTop: 6,
                      }}
                    >
                      +{h.ms} ms
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 1240,
                fontFamily: FONT.mono,
                fontSize: 26,
                color: C.rose400,
                opacity: ip(frame, [168, 186], [0, 1]),
              }}
            >
              38 + 120 + 182 + 72 = <span style={{ fontWeight: 700 }}>412 ms</span> — pour UNE requête
            </div>
          </>
        )}

        {/* --- beat 2 : le chronogramme complet --- */}
        {showWaterfall && (
          <Waterfall
            rows={PAGE_ROWS.map((r) => ({ ...r, at: 196 + (r.at - 10) * 1.2 }))}
            width={840}
            scaleMax={4400}
            rowHeight={32}
            fontSize={18}
            at={196}
            title="RÉSEAU — 10 REQUÊTES"
            totalAt={366}
            totalLabel="CHARGEMENT"
            totalValue="4,12 s"
            totalTone={C.rose400}
            style={{ position: 'absolute', left: 120, top: 600 }}
          />
        )}

        {/* --- beat 3 : verdict --- */}
        {frame >= 420 && (
          <>
            {/* le total est LA preuve : on l'entoure, on ne décore pas à côté */}
            <Circle cx={872} cy={1026} rx={124} ry={44} at={430} color={C.rose400} rotate={-1.5} />
          </>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 20, x: 880, y: 1300 },
          { at: 150, x: 640, y: 780 },
          { at: 300, x: 700, y: 1080 },
          { at: 470, x: 872, y: 1030, act: 'hover' },
        ]}
        enterAt={18}
        hideAt={500}
        size={32}
      />

      <Caption text="Chaque requête traverse 5 837 km." at={30} until={184} size={62} emphasize={[3, 4]} style={{ top: 1490 }} />
      <Caption
        text="Le signal va vite. Les allers-retours, non."
        at={200}
        until={362}
        size={58}
        emphasize={[5, 6]}
        style={{ top: 1490 }}
      />
      <Caption text="Le coupable, c'est la distance." at={378} size={64} style={{ top: 1490 }} />

      {frame >= 424 && frame < 470 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(55% 35% at 50% 54%, ${hexA(C.rose500, 0.14)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      <SceneVo clip="cache-vue1" />
      <SceneSfx scene="cache-vue1" />
    </Stage>
  );
};
