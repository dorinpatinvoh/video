import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { DataTable, TotalBadge } from '../../components/DataTable';
import { CodeEditor } from '../../components/CodeEditor';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { GlassCard, Highlight } from '../../components/GlassCard';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT } from '../../tokens';
import { eur, ip, useRoll } from '../../hooks';

/**
 * VUE 2/4 — A · ATOMICITÉ · 9 s (540 frames)
 * BEGIN…COMMIT : tout ou rien, et retour exact à l'état initial (rollback).
 * Beats : 0–180 (la transaction apparaît, curseur) · 180–360 (rollback) · 360–540 (AVANT = APRÈS)
 */
export const Vue2Atomicite: React.FC = () => {
  const frame = useCurrentFrame();

  // la transaction échoue à 190 : tout revient à l'état initial
  const failed = frame >= 196;
  const balanceA = useRoll(100, 0, 60, 18);
  const backA = useRoll(0, 100, 214, 26);
  const a = failed ? backA : balanceA;
  const total = useRoll(150, 50, 74, 20);
  const totalBack = useRoll(50, 150, 218, 26);
  const tot = failed ? totalBack : total;

  const cardGlow = frame >= 40 && frame < 190;

  return (
    <Stage accent={C.emerald500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 186, scale: 1.12, origin: '50% 46%', ease: undefined },
          { at: 250, scale: 1.0 },
          { at: 372, scale: 1.06 },
        ]}
      >
        <SceneHeader
          kicker="A · Atomicité — tout ou rien"
          at={4}
          accent={C.emerald400}
          right={
            <TotalBadge
              at={10}
              value={eur(tot)}
              tone={failed ? C.emerald400 : C.amber400}
              pulse={!failed}
              size={44}
              label={failed ? 'ÉTAT INITIAL RESTAURÉ' : 'TOTAL (provisoire)'}
            />
          }
        />

        {/* la transaction : une carte qui enferme les deux requêtes */}
        <GlassCard
          at={0}
          accent={failed ? C.emerald400 : C.amber400}
          glow={cardGlow}
          interactive
          label="BEGIN … COMMIT"
          labelTone={failed ? C.emerald400 : C.amber400}
          style={{ left: 120, top: 620, width: 840 }}
          padding={30}
        >
          <CodeEditor
            code={`await tx.debit(from, 100);\nawait tx.credit(to, 100);`}
            at={44}
            cps={34}
            focusLine={1}
            focusAt={186}
            fontSize={28}
            showLineNumbers={false}
            minimap={false}
            accent={C.indigo400}
            style={{ border: 'none', background: 'transparent', padding: '6px 0 14px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
            {!failed ? (
              <>
                <StatusCodeBadge at={44} variant="success" label="200 OK" size={24} />
                <span style={{ fontFamily: FONT.mono, fontSize: 23, color: C.textMuted }}>
                  transaction ouverte — rien n'est encore appliqué
                </span>
              </>
            ) : (
              <>
                <StatusCodeBadge at={196} variant="error" label="ROLLBACK" size={24} shake />
                <span style={{ fontFamily: FONT.mono, fontSize: 23, color: C.emerald400 }}>
                  annulation automatique · 0 ligne modifiée
                </span>
              </>
            )}
          </div>
        </GlassCard>

        {/* table : les soldes reviennent exactement à leur état initial */}
        <DataTable
          at={16}
          columns={['id', 'owner', 'balance']}
          colWidths={[110, 300, 0]}
          fontSize={30}
          style={{ position: 'absolute', left: 120, top: 1010, width: 840 }}
          rows={[
            {
              id: 'a',
              cells: ['1', 'Alice', eur(a)],
              flashes: [
                { at: 74, color: C.emerald400 },
                { at: 214, color: C.amber400 },
              ],
              rewindAt: 214,
            },
            {
              id: 'b',
              cells: ['2', 'Bob', eur(50)],
              flashes: [{ at: 214, color: C.amber400 }],
            },
          ]}
        />

        {/* split AVANT / APRÈS */}
        {frame >= 366 && (
          <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', gap: 24 }}>
            <Snapshot title="AVANT" value="150,00 €" at={372} tone={C.textPrimary} />
            <Snapshot title="APRÈS" value="150,00 €" at={396} tone={C.emerald400} check />
          </div>
        )}

        {frame >= 372 && (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 900,
              width: 840,
              textAlign: 'center',
              fontFamily: FONT.ui,
              fontSize: 44,
              fontWeight: 800,
              color: C.emerald400,
              opacity: ip(frame, [430, 450], [0, 1]),
            }}
          >
            <Highlight at={446} color={C.emerald400} opacity={0.24}>
              identique — au centime près
            </Highlight>
          </div>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 20, x: 780, y: 1180 },
          { at: 40, x: 620, y: 800, act: 'hover' },
          { at: 52, x: 620, y: 800, act: 'click' },
          { at: 200, x: 520, y: 1080, act: 'hover' },
        ]}
        enterAt={18}
        hideAt={280}
      />

      <Caption
        text="Une seule unité : tout, ou rien."
        at={60}
        until={186}
        size={66}
        emphasize={[4, 5]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Une étape échoue ? On annule TOUT, et la base revient à son état d'avant."
        at={196}
        until={362}
        size={58}
        emphasize={[3, 4]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Résultat : le virement n'a jamais eu lieu. Aucun euro perdu."
        at={392}
        size={60}
        emphasize={[8, 9]}
        style={{ top: 1490 }}
      />

      {/* retour en arrière : traînée visuelle */}
      {frame >= 210 && frame <= 260 && (
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 1100,
            width: 840,
            height: 120,
            background: `linear-gradient(90deg, ${hexA(C.amber400, 0.16)}, transparent)`,
            opacity: 1 - (frame - 210) / 50,
            boxShadow: `inset 0 0 60px ${hexA(C.amber400, 0.3)}`,
            pointerEvents: 'none',
          }}
        />
      )}
      <SceneVo clip="acid-vue2" />
      <SceneSfx scene="vue2" />
    </Stage>
  );
};

const Snapshot: React.FC<{ title: string; value: string; at: number; tone: string; check?: boolean }> = ({
  title,
  value,
  at,
  tone,
  check,
}) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1]);
  const draw = ip(frame, [at + 14, at + 40], [0, 1]);
  return (
    <GlassCard
      at={-999}
      style={{ position: 'relative', flex: 1, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}
      glow={check}
    >
      <div className="t-label mono" style={{ fontFamily: FONT.mono, fontSize: 24, color: C.textMuted }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <span
          className="mono"
          style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 700, color: tone }}
        >
          {value}
        </span>
        {check && (
          <svg width={34} height={34} viewBox="0 0 24 24">
            <path
              d="M4 12.5 L9.5 18 L20 6"
              fill="none"
              stroke={C.emerald400}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={30}
              strokeDashoffset={(1 - draw) * 30}
              style={{ filter: `drop-shadow(0 0 8px ${C.emerald400})` }}
            />
          </svg>
        )}
      </div>
      {check && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            boxShadow: `inset 0 0 60px ${hexA(C.emerald400, 0.18 * draw)}`,
            background: hexA(C.emerald400, 0.06),
            opacity: draw,
            pointerEvents: 'none',
          }}
        />
      )}
    </GlassCard>
  );
};
