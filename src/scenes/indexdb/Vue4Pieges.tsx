import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { GlassCard } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { CodeEditor } from '../../components/CodeEditor';
import { Terminal } from '../../components/Terminal';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';

/**
 * VUE 4/4 — LES 4 PIÈGES QUI ANNULENT UN INDEX · 15 s (900 frames)
 * Beats (180 frames chacun) : 1 fonction sur la colonne · 2 LIKE '%…' · 3 ordre composite
 *                             4 trop d'index · 5 EXPLAIN (résolution)
 */
export const IndexVue4Pieges: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = Math.min(5, Math.floor(frame / 180) + 1);

  const KICKERS: Record<number, string> = {
    1: 'Piège 1 — une fonction sur la colonne',
    2: "Piège 2 — un LIKE qui commence par un pourcent",
    3: 'Piège 3 — l’ordre des colonnes dans un index composite',
    4: "Piège 4 — trop d'index",
    5: 'EXPLAIN — te dit tout',
  };

  return (
    <Stage accent={C.rose500}>
      <SceneHeader kicker={KICKERS[beat]} at={beat === 1 ? 4 : 0} accent={beat === 5 ? C.emerald400 : C.rose400} />

      <Camera keys={[{ at: 0, scale: 1 }, { at: 720, scale: 1.05, origin: '50% 50%' }, { at: 860, scale: 1 }]}>
        {/* ---- beat 1 : fonction sur la colonne ---- */}
        {beat === 1 && (
          <>
            <div style={{ position: 'absolute', left: 120, top: 640, width: 840 }}>
              <CodeEditor
                code="SELECT * FROM customers WHERE LOWER(email) = 'a.dupont@mail.fr';"
                at={4}
                cps={44}
                fontSize={25}
                showLineNumbers={false}
                minimap={false}
                accent={C.rose400}
                style={{ borderRadius: 16, border: `1px solid ${hexA(C.rose400, 0.35)}` }}
              />
            </div>
            <CrossedIndex at={128} />
            <div style={{ position: 'absolute', left: 560, top: 900 }}>
              <StatusCodeBadge at={140} variant="error" label="SEQ SCAN · 4,21 s" size={28} shake />
            </div>
            <PiegeNote text="LOWER(email) n'est plus la colonne indexée : l'annuaire est inutilisable." at={220} />
          </>
        )}

        {/* ---- beat 2 : LIKE '%…' ---- */}
        {beat === 2 && (
          <>
            <div style={{ position: 'absolute', left: 120, top: 640, width: 840 }}>
              <CodeEditor
                code="SELECT * FROM customers WHERE email LIKE '%dupont%';"
                at={180}
                cps={44}
                fontSize={25}
                showLineNumbers={false}
                minimap={false}
                accent={C.rose400}
                style={{ borderRadius: 16, border: `1px solid ${hexA(C.rose400, 0.35)}` }}
              />
            </div>
            <WanderGrid at={186} />
            <div style={{ position: 'absolute', left: 560, top: 1030 }}>
              <StatusCodeBadge at={300} variant="error" label="IMPOSSIBLE DE SAUTER" size={28} shake />
            </div>
            <PiegeNote text="Un annuaire ne sait pas chercher « au milieu du mot » : il repart du début." at={200} />
          </>
        )}

        {/* ---- beat 3 : ordre composite ---- */}
        {beat === 3 && (
          <div style={{ position: 'absolute', left: 120, top: 660, width: 840, display: 'flex', gap: 22 }}>
            <GlassCard at={-999} accent={C.emerald400} glow style={{ position: 'relative', flex: 1, opacity: ip(frame, [360, 380], [0, 1]) }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.1em', color: C.emerald400 }}>✅ UTILISÉ</div>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 28, color: C.textPrimary, marginTop: 14 }}>
                (last_name, first_name)
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.textSecondary, marginTop: 16 }}>
                WHERE last_name = 'Dupont'
              </div>
            </GlassCard>
            <GlassCard at={-999} style={{ position: 'relative', flex: 1, opacity: ip(frame, [384, 404], [0, 1]), filter: 'saturate(0.55)' }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.1em', color: C.rose400 }}>❌ IGNORÉ</div>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 28, color: C.textSecondary, marginTop: 14 }}>
                (first_name, last_name)
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.textMuted, marginTop: 16 }}>
                WHERE last_name = 'Dupont'
              </div>
            </GlassCard>
            <div style={{ position: 'absolute', left: 0, top: 300 }}>
              <PiegeNote text="Un index composite ne sert que par son premier élément." at={440} />
            </div>
          </div>
        )}

        {/* ---- beat 4 : trop d'index ---- */}
        {beat === 4 && (
          <>
            <div style={{ position: 'absolute', left: 120, top: 620, width: 840, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {['email', 'city', 'created_at', 'last_name', 'phone', 'status', 'country', 'referrer'].map((idx, i) => (
                <div
                  key={idx}
                  className="mono"
                  style={{
                    padding: '14px 22px',
                    borderRadius: 12,
                    fontFamily: FONT.mono,
                    fontSize: 24,
                    color: C.textPrimary,
                    background: 'rgba(255,255,255,0.045)',
                    border: `1px solid ${hexA(C.amber400, 0.35)}`,
                    opacity: ip(frame, [548 + i * 5, 562 + i * 5], [0, 1]),
                    transform: `translateY(${ip(frame, [548 + i * 5, 562 + i * 5], [14, 0])}px)`,
                  }}
                >
                  idx_{idx}
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', left: 120, top: 900, width: 840 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.12em', color: C.textMuted }}>TEMPS D'ÉCRITURE</div>
              <div style={{ marginTop: 12, height: 26, borderRadius: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${ip(frame, [560, 700], [12, 100])}%`,
                    background: `linear-gradient(90deg, ${hexA(C.amber400, 0.6)}, ${C.rose400})`,
                    boxShadow: `0 0 30px ${hexA(C.rose500, 0.5)}`,
                  }}
                />
              </div>
              <div className="mono tnum" style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.rose400, marginTop: 14, fontVariantNumeric: 'tabular-nums' }}>
                {ip(frame, [560, 700], [1.2, 9.4]).toFixed(1).replace('.', ',')} ms par insertion
              </div>
            </div>
            {frame >= 690 && frame <= 704 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: hexA(C.rose500, 0.10),
                  marginLeft: frame % 2 === 0 ? 5 : -5,
                  mixBlendMode: 'screen',
                }}
              />
            )}
          </>
        )}

        {/* ---- beat 5 : EXPLAIN ---- */}
        {beat === 5 && (
          <>
            <Terminal
              width={840}
              height={330}
              fontSize={23}
              title="psql — EXPLAIN ANALYZE"
              accent={C.emerald400}
              style={{ position: 'absolute', left: 120, top: 620 }}
              lines={[
                { text: '$ EXPLAIN ANALYZE SELECT * FROM customers …', at: 720, type: true },
                { text: 'Seq Scan on customers  (cost=0.00..18432) → 4210 ms', at: 800, tone: C.rose400 },
                { text: 'CREATE INDEX idx_customers_email ON customers(email);', at: 826, tone: C.textMuted },
                { text: 'Index Scan using idx_customers_email → 0.42 ms', at: 856, tone: C.emerald400 },
              ]}
            />
            <div style={{ position: 'absolute', left: 120, top: 975, display: 'flex', gap: 20, alignItems: 'center' }}>
              <StatusCodeBadge at={862} variant="success" label="Index Scan · 0,42 ms" size={30} />
              <span
                className="mono"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 50,
                  fontWeight: 700,
                  color: C.emerald400,
                  textShadow: `0 0 40px ${hexA(C.emerald400, 0.6)}`,
                  opacity: ip(frame, [866, 886], [0, 1]),
                }}
              >
                ×10 000
              </span>
            </div>
          </>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 10, x: 880, y: 1300 },
          { at: 726, x: 700, y: 1250, act: 'hover' },
          { at: 740, x: 700, y: 1250, act: 'click' },
          { at: 850, x: 820, y: 1150 },
        ]}
        enterAt={8}
        hideAt={900}
        size={34}
      />

      <Caption
        text="Piège 1 : une fonction sur la colonne, et l'index est ignoré."
        at={32}
        until={176}
        size={54}
        emphasize={[2, 3]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Piège 2 : un LIKE qui commence par un pourcent."
        at={196}
        until={356}
        size={56}
        emphasize={[8, 9]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Piège 3 : dans un index composite, l'ordre des colonnes compte."
        at={376}
        until={536}
        size={54}
        emphasize={[8]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Piège 4 : trop d'index ralentit chaque écriture."
        at={556}
        until={704}
        size={56}
        emphasize={[5, 6]}
        style={{ top: 1490 }}
      />
      <Caption
        text="La bonne nouvelle : EXPLAIN te dit lequel est utilisé."
        at={724}
        size={54}
        emphasize={[3]}
        style={{ top: 1490 }}
      />

      <SceneVo clip="index-vue4" />
      <SceneSfx scene="idx-vue4" />
    </Stage>
  );
};

/* ------------------------------------------------------------------ annexes */

const PiegeNote: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1]);
  return (
    <div
      style={{
        marginTop: 26,
        padding: '18px 24px',
        borderRadius: 14,
        background: hexA(C.rose500, 0.08),
        border: `1px solid ${hexA(C.rose500, 0.3)}`,
        fontFamily: FONT.ui,
        fontSize: 28,
        color: C.textPrimary,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        maxWidth: 840,
      }}
    >
      {text}
    </div>
  );
};

const CrossedIndex: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 20], [0, 1]);
  return (
    <div style={{ position: 'absolute', left: 130, top: 880, display: 'flex', alignItems: 'center', gap: 18, opacity: ip(frame, [at - 40, at - 20], [0, 1]) }}>
      <div
        style={{
          padding: '12px 20px',
          borderRadius: 12,
          fontFamily: FONT.mono,
          fontSize: 24,
          color: C.textSecondary,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        idx_customers_email
      </div>
      <svg width={54} height={54} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 12px ${C.rose400})` }}>
        <path
          d="M5 5 L19 19"
          stroke={C.rose400}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={24}
          strokeDashoffset={(1 - p) * 24}
        />
        <path
          d="M19 5 L5 19"
          stroke={C.rose400}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={24}
          strokeDashoffset={(1 - p) * 24}
        />
      </svg>
    </div>
  );
};

/** grille « annuaire » dont le curseur ne sait pas où sauter (piège du LIKE) */
const WanderGrid: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const cells = 24;
  const t = Math.max(0, frame - at);
  const wander = Math.round((Math.sin(t / 9) * 0.5 + 0.5) * (cells - 1));
  return (
    <div style={{ position: 'absolute', left: 120, top: 850, width: 840, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
      {Array.from({ length: cells }).map((_, i) => {
        const on = i === wander;
        return (
          <div
            key={i}
            style={{
              height: 48,
              borderRadius: 8,
              background: on ? hexA(C.rose400, 0.18) : 'rgba(255,255,255,0.03)',
              border: `1px solid ${on ? C.rose400 : 'rgba(255,255,255,0.07)'}`,
              boxShadow: on ? `0 0 24px ${hexA(C.rose400, 0.45)}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
