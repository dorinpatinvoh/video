import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { DataTable, TotalBadge } from '../../components/DataTable';
import { CodeEditor } from '../../components/CodeEditor';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { GlassCard } from '../../components/GlassCard';
import { Sweep } from '../../components/Annotation';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { eur, ip, useRoll } from '../../hooks';

/**
 * VUE 3/4 — C · COHÉRENCE · 9 s (540 frames)
 * Aucune opération ne peut laisser la base dans un état invalide.
 * Beats : 0–180 (règles + pan latéral) · 180–360 (contrainte qui refuse) · 360–540 (vérification balayée)
 */
export const Vue3Coherence: React.FC = () => {
  const frame = useCurrentFrame();
  const refuse = frame >= 200;
  const total = useRoll(150, 40, 208, 20);
  const tot = refuse ? 40 : total;
  const restored = frame >= 392;
  const totalFinal = useRoll(40, 150, 400, 26);

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1, x: 0 },
          // pan latéral vers le panneau de règles (parallaxe retenue, jamais de zoom simultané)
          { at: 150, x: 180, scale: 1 },
          { at: 330, x: 180, scale: 1 },
          { at: 366, x: 0, scale: 1.0 },
        ]}
      >
        <SceneHeader
          kicker="C · Cohérence — les règles tiennent"
          at={4}
          accent={C.cyan400}
          right={
            <TotalBadge
              at={10}
              value={eur(restored ? totalFinal : tot)}
              tone={refuse && !restored ? C.rose400 : C.emerald400}
              pulse={refuse && !restored}
              size={44}
              label={refuse && !restored ? 'CONTRAINTE' : 'TOTAL'}
            />
          }
        />

        <DataTable
          at={0}
          columns={['id', 'owner', 'balance']}
          colWidths={[110, 300, 0]}
          fontSize={30}
          style={{ position: 'absolute', left: 120, top: 640, width: 840 }}
          rows={[
            {
              id: 'a',
              cells: ['1', 'Alice', refuse && !restored ? eur(0) : eur(100)],
              flashes: refuse ? [{ at: 208, color: C.rose400 }] : [],
              exitAt: 224, // la ligne invalide quitte la table
            },
            { id: 'b', cells: ['2', 'Bob', eur(50)] },
          ]}
        />

        {/* requête invalide refusée par la contrainte */}
        <div style={{ position: 'absolute', left: 300, top: 900, width: 840 }}>
          <CodeEditor
            code={`UPDATE accounts SET balance = -20 WHERE id = 1;   -- interdit`}
            at={186}
            cps={34}
            fontSize={25}
            showLineNumbers={false}
            minimap={false}
            accent={C.rose400}
            style={{ borderRadius: 14, border: `1px solid ${hexA(C.rose400, 0.35)}` }}
          />
        </div>
        <div style={{ position: 'absolute', left: 620, top: 1010 }}>
          <StatusCodeBadge
            at={226}
            variant="error"
            label="CONSTRAINT VIOLATION — refusé"
            size={25}
            shake
          />
        </div>

        {/* panneau des règles (cible du pan latéral) */}
        <GlassCard
          at={26}
          accent={C.cyan400}
          style={{ left: 980, top: 640, width: 620 }}
          label="RÈGLES DE LA BASE"
          labelTone={C.cyan400}
        >
          <Rule text="CHECK (balance >= 0)" at={60} />
          <Rule text="SUM(balance) = 150,00 €" at={84} />
          <Rule text="FOREIGN KEY (owner_id)" at={108} />
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: 23, color: C.textMuted }}>
            vérifiées avant ET après chaque transaction
          </div>
        </GlassCard>

        {/* balayage de vérification */}
        <Sweep x={130} y={640} h={210} at={406} dur={40} color={C.emerald400} />

        {/* mini-coches de validation */}
        {frame >= 380 && (
          <div style={{ position: 'absolute', left: 880, top: 646, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0, 1, 2, 3].map((i) => {
              const p = ip(frame, [380 + i * 8, 398 + i * 8], [0, 1]);
              return (
                <svg key={i} width={30} height={30} viewBox="0 0 24 24">
                  <path
                    d="M4 12.5 L9.5 18 L20 6"
                    fill="none"
                    stroke={C.emerald400}
                    strokeWidth={2.8}
                    strokeLinecap="round"
                    strokeDasharray={30}
                    strokeDashoffset={(1 - p) * 30}
                  />
                </svg>
              );
            })}
          </div>
        )}
      </Camera>

      <Cursor
        keys={[
          { at: 10, x: 900, y: 900 },
          { at: 40, x: 1180, y: 760, act: 'hover' },
          { at: 200, x: 1220, y: 900, act: 'click' },
          { at: 300, x: 420, y: 1000 },
        ]}
        enterAt={8}
        hideAt={340}
      />

      <Caption
        text="Cohérence : aucune opération ne peut casser une règle."
        at={60}
        until={186}
        size={58}
        emphasize={[0]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Un solde négatif ? La base refuse. Point."
        at={196}
        until={372}
        size={62}
        emphasize={[7, 8]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Les règles sont vérifiées avant et après chaque transaction."
        at={382}
        size={58}
        style={{ top: 1490 }}
      />

      {/* flash de rejet pleine surface */}
      {frame >= 226 && frame < 250 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 620,
            height: 180,
            background: `linear-gradient(90deg, transparent, ${hexA(C.rose500, 0.22)}, transparent)`,
            opacity: 1 - (frame - 226) / 24,
            pointerEvents: 'none',
          }}
        />
      )}
      <SceneSfx scene="vue3" />
    </Stage>
  );
};

const Rule: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 14], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: FONT.mono,
        fontSize: 25,
        color: C.textPrimary,
        opacity: p,
        transform: `translateX(${(1 - p) * -14}px)`,
        marginBottom: 12,
      }}
    >
      <SvLock />
      {text}
    </div>
  );
};

const SvLock = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke={C.cyan400} strokeWidth="1.8" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={C.cyan400} strokeWidth="1.8" />
  </svg>
);
