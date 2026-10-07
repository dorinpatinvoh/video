import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { GlassCard, Highlight } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Arrow } from '../../components/Annotation';
import { Caption } from '../../components/Caption';
import { CodeEditor } from '../../components/CodeEditor';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { ip, useRoll } from '../../hooks';

const TARGETS = [
  { label: 'TABLE', sub: 'customers', x: 150, tone: C.emerald400 },
  { label: 'INDEX', sub: 'email', x: 372, tone: C.amber400 },
  { label: 'INDEX', sub: 'city', x: 594, tone: C.amber400 },
  { label: 'INDEX', sub: 'created_at', x: 816, tone: C.amber400 },
];

/**
 * VUE 3/4 — LE PRIX DE L'INDEX · 9 s (540 frames)
 * Beats : 0–180 (INSERT sans index : 1 écriture) · 180–360 (avec 3 index : 4 écritures)
 *         360–540 (verdict : lire ×10 000, écrire ×3)
 */
export const IndexVue3Cout: React.FC = () => {
  const frame = useCurrentFrame();
  const writes = useRoll(1, 4, 210, 24);
  const ms = useRoll(1.2, 3.8, 214, 24);
  const withIndexes = frame >= 200;
  const load = ip(frame, [214, 280], [0.25, 1]);

  return (
    <Stage accent={C.amber400}>
      <Camera keys={[{ at: 0, scale: 1 }, { at: 186, scale: 1.08, origin: '50% 48%' }, { at: 340, scale: 1 }]}>
        <SceneHeader
          kicker="Le prix de l'index"
          at={4}
          accent={C.amber400}
          right={
            <StatusCodeBadge
              at={206}
              variant={withIndexes ? 'warn' : 'success'}
              label={withIndexes ? '4 ÉCRITURES' : '1 ÉCRITURE'}
              size={26}
            />
          }
        />

        {frame < 372 && (
          <>
            {/* la requête d'écriture */}
            <GlassCard at={-999} style={{ left: 120, top: 610, width: 840, opacity: ip(frame, [8, 26], [0, 1]) }} padding={26}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <CodeEditor
                    code="INSERT INTO customers (email, city) VALUES (…);"
                    at={10}
                    cps={40}
                    fontSize={24}
                    showLineNumbers={false}
                    minimap={false}
                    style={{ border: 'none', background: 'transparent', padding: 0 }}
                  />
                </div>
                <div
                  style={{
                    padding: '16px 30px',
                    borderRadius: 999,
                    fontFamily: FONT.ui,
                    fontSize: 26,
                    fontWeight: 700,
                    color: frame > 46 ? C.textPrimary : C.textSecondary,
                    background: frame > 52 ? hexA(C.indigo500, 0.24) : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${frame > 46 ? hexA(C.indigo400, 0.6) : 'rgba(255,255,255,0.1)'}`,
                    transform: `scale(${frame > 56 && frame < 64 ? 0.96 : 1})`,
                  }}
                >
                  Valider
                </div>
              </div>
            </GlassCard>

            {/* les cibles de l'écriture */}
            <div style={{ position: 'absolute', left: 120, top: 880, width: 840, display: 'flex', gap: 18 }}>
              {TARGETS.map((t, i) => {
                const active = i === 0 ? frame >= 130 : frame >= 200 + i * 10;
                return (
                  <div
                    key={t.sub}
                    style={{
                      flex: 1,
                      height: 150,
                      borderRadius: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background: active ? hexA(t.tone, 0.10) : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? hexA(t.tone, 0.45) : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: active ? `0 0 40px ${hexA(t.tone, 0.22)}` : 'none',
                      opacity: i === 0 ? 1 : ip(frame, [196, 216], [0.25, 1]),
                      transform: `scale(${active ? 1 : 0.98})`,
                    }}
                  >
                    <span style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.12em', color: C.textMuted }}>
                      {t.label}
                    </span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 24, color: C.textPrimary }}>{t.sub}</span>
                    {active && <span style={{ fontFamily: FONT.mono, fontSize: 19, color: t.tone }}>écriture</span>}
                  </div>
                );
              })}
            </div>

            {/* flèches d'écriture */}
            <Arrow from={[540, 810]} to={[210, 870]} at={132} dur={22} color={C.emerald400} width={4} curve={0.16} />
            {[1, 2, 3].map((i) => (
              <Arrow
                key={i}
                from={[540, 810]}
                to={[TARGETS[i].x + 100, 870]}
                at={196 + i * 12}
                dur={22}
                color={C.amber400}
                width={4}
                curve={0.12 + i * 0.04}
              />
            ))}

            {/* HUD écritures */}
            <div style={{ position: 'absolute', left: 120, top: 1080, width: 840, display: 'flex', gap: 18 }}>
              <Cout label="ÉCRITURES" value={String(Math.round(writes))} tone={withIndexes ? C.amber400 : C.emerald400} />
              <Cout label="TEMPS D'INSERT" value={`${ms.toFixed(1).replace('.', ',')} ms`} tone={withIndexes ? C.amber400 : C.emerald400} />
              <div style={{ flex: 1.4, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.12em', color: C.textMuted }}>CHARGE DISQUE</div>
                <div style={{ marginTop: 10, height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${load * 100}%`,
                      background: `linear-gradient(90deg, ${hexA(C.amber400, 0.6)}, ${C.amber400})`,
                      boxShadow: `0 0 24px ${hexA(C.amber400, 0.5)}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* verdict : lire vite, écrire moins vite */}
        {frame >= 372 && (
          <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', gap: 22 }}>
            <GlassCard at={-999} style={{ position: 'relative', flex: 1, opacity: ip(frame, [372, 392], [0, 1]) }} glow>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.1em', color: C.emerald400 }}>LECTURES</div>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 54, fontWeight: 700, color: C.emerald400 }}>
                ×10 000
              </div>
              <div style={{ fontFamily: FONT.ui, fontSize: 22, color: C.textSecondary }}>plus rapides</div>
            </GlassCard>
            <GlassCard at={-999} style={{ position: 'relative', flex: 1, opacity: ip(frame, [392, 412], [0, 1]) }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.1em', color: C.amber400 }}>ÉCRITURES</div>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 54, fontWeight: 700, color: C.amber400 }}>
                ×3
              </div>
              <div style={{ fontFamily: FONT.ui, fontSize: 22, color: C.textSecondary }}>plus lentes</div>
            </GlassCard>
          </div>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 6, x: 900, y: 1180 },
          { at: 40, x: 830, y: 700, act: 'hover' },
          { at: 52, x: 830, y: 700, act: 'click' },
          { at: 250, x: 700, y: 1000, act: 'hover' },
        ]}
        enterAt={4}
        hideAt={330}
      />

      <Caption text="Mais l'index a un prix." at={40} until={186} size={66} emphasize={[3]} style={{ top: 1490 }} />
      <Caption
        text="Chaque écriture met à jour la table… et tous ses index."
        at={200}
        until={368}
        size={58}
        emphasize={[5, 6]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Donc on indexe ce qu'on filtre souvent."
        at={384}
        size={60}
        style={{ top: 1490 }}
      />
      <Caption text="" at={0} until={0} size={40} style={{ top: 1490 }} />

      <SceneSfx scene="idx-vue3" />
    </Stage>
  );
};

const Cout: React.FC<{ label: string; value: string; tone: string }> = ({ label, value, tone }) => (
  <div style={{ flex: 1, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 19, letterSpacing: '0.12em', color: C.textMuted }}>{label}</div>
    <div
      className="mono tnum"
      style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: tone, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}
    >
      {value}
    </div>
  </div>
);
