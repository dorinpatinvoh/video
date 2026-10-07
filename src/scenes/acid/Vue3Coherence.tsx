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
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT } from '../../tokens';
import { eur, ip, useRoll } from '../../hooks';

/**
 * VUE 3/4 — C · COHÉRENCE · 9 s (540 frames)
 *
 * Mise en page : deux colonnes fixes (table à gauche, règles à droite) — plus de
 * pan latéral : à l'écran, une caméra qui balaie coupait les bords de l'interface.
 * Beats : 0–180 (les règles) · 180–360 (la contrainte refuse) · 360–540 (vérification balayée)
 */
export const Vue3Coherence: React.FC = () => {
  const frame = useCurrentFrame();
  const refuse = frame >= 200;
  const restored = frame >= 392;
  const invalidLeaving = frame >= 224 && frame < 372;

  const total = useRoll(150, 40, 208, 20);
  const tot = refuse && !restored ? total : 150;

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          // zoom léger uniquement : recentre la table pendant la vérification
          { at: 380, scale: 1.05, origin: '40% 50%' },
          { at: 470, scale: 1 },
        ]}
      >
        <SceneHeader
          kicker="C · Cohérence"
          at={4}
          accent={C.cyan400}
          right={
            <TotalBadge
              at={10}
              value={eur(tot)}
              tone={refuse && !restored ? C.rose400 : C.emerald400}
              pulse={refuse && !restored}
              size={40}
              label={refuse && !restored ? 'CONTRAINTE' : 'TOTAL'}
            />
          }
        />

        {/* --- colonne gauche : la table / colonne droite : les règles --- */}
        <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', gap: 20 }}>
          {/* table */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <DataTable
              at={0}
              columns={['id', 'owner', 'balance']}
              colWidths={[70, 0, 0]}
              fontSize={27}
              rows={[
                {
                  id: 'a',
                  cells: ['1', 'Alice', refuse && !restored ? eur(0) : eur(100)],
                  flashes: refuse ? [{ at: 208, color: C.rose400 }] : [],
                  exitAt: invalidLeaving ? 224 : undefined,
                },
                { id: 'b', cells: ['2', 'Bob', eur(50)] },
              ]}
            />
            {/* la ligne de contrôle revient après la vérification */}
            {restored && (
              <div
                style={{
                  marginTop: 16,
                  opacity: ip(frame, [392, 412], [0, 1]),
                  fontFamily: FONT.mono,
                  fontSize: 22,
                  color: C.textMuted,
                }}
              >
                0 ligne sur 2 modifiée — base intacte
              </div>
            )}
          </div>

          {/* règles */}
          <GlassCard
            at={26}
            accent={C.cyan400}
            style={{ position: 'relative', width: 380, flex: '0 0 380px' }}
            label="RÈGLES DE LA BASE"
            labelTone={C.cyan400}
            padding={24}
          >
            <Rule text="CHECK (balance >= 0)" at={60} />
            <Rule text="SUM = 150,00 €" at={84} />
            <Rule text="FOREIGN KEY (owner_id)" at={108} />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: 21, lineHeight: 1.6, color: C.textMuted }}>
              vérifiées avant et après chaque transaction
            </div>
          </GlassCard>
        </div>

        {/* --- requête invalide : sous la table, pleine largeur utile --- */}
        <div style={{ position: 'absolute', left: 120, top: 990, width: 840 }}>
          <CodeEditor
            code="UPDATE accounts SET balance = -20 WHERE id = 1;  -- refusé"
            at={186}
            cps={34}
            fontSize={24}
            showLineNumbers={false}
            minimap={false}
            accent={C.rose400}
            style={{
              borderRadius: 14,
              border: `1px solid ${hexA(C.rose400, refuse ? 0.45 : 0.2)}`,
              boxShadow: refuse && !restored ? `0 0 40px ${hexA(C.rose500, 0.25)}` : 'none',
            }}
          />
        </div>

        {refuse && !restored && (
          <div style={{ position: 'absolute', left: 470, top: 1090 }}>
            <StatusCodeBadge at={226} variant="error" label="CONSTRAINT VIOLATION" size={24} shake />
          </div>
        )}

        {/* balayage de vérification */}
        <Sweep x={128} y={640} h={220} at={406} dur={40} color={C.emerald400} />

        {frame >= 380 && (
          <div style={{ position: 'absolute', left: 560, top: 700, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1].map((i) => {
              const p = ip(frame, [380 + i * 8, 398 + i * 8], [0, 1]);
              return (
                <svg key={i} width={26} height={26} viewBox="0 0 24 24">
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
          { at: 10, x: 900, y: 1250 },
          { at: 46, x: 800, y: 800, act: 'hover' },
          { at: 200, x: 640, y: 1030, act: 'click' },
          { at: 300, x: 420, y: 1180 },
        ]}
        enterAt={8}
        hideAt={356}
        size={32}
      />

      <Caption
        text="Cohérence : aucune opération ne peut casser une règle."
        at={60}
        until={186}
        size={54}
        emphasize={[0]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Un solde négatif ? La base refuse."
        at={196}
        until={372}
        size={60}
        emphasize={[5, 6]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Les règles sont vérifiées avant et après chaque transaction."
        at={382}
        size={54}
        style={{ top: 1490 }}
      />

      {/* flash de rejet */}
      {frame >= 226 && frame < 252 && (
        <div
          style={{
            position: 'absolute',
            left: 120,
            width: 840,
            top: 985,
            height: 96,
            background: `linear-gradient(90deg, transparent, ${hexA(C.rose500, 0.25)}, transparent)`,
            opacity: 1 - (frame - 226) / 26,
            pointerEvents: 'none',
          }}
        />
      )}

      <SceneVo clip="acid-vue3" />
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
        gap: 12,
        fontFamily: FONT.mono,
        fontSize: 22,
        color: C.textPrimary,
        opacity: p,
        transform: `translateX(${(1 - p) * -14}px)`,
        marginBottom: 10,
      }}
    >
      <SvLock />
      {text}
    </div>
  );
};

const SvLock = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke={C.cyan400} strokeWidth="1.8" />
    <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={C.cyan400} strokeWidth="1.8" />
  </svg>
);
