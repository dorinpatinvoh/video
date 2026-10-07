import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { DataTable, TotalBadge } from '../../components/DataTable';
import { CodeEditor } from '../../components/CodeEditor';
import { Terminal } from '../../components/Terminal';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { Arrow, Circle } from '../../components/Annotation';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { eur, useRoll } from '../../hooks';

/**
 * VUE 1/4 — LE PROBLÈME · 9 s (540 frames)
 * Deux étapes enchaînées sans garantie : le débit réussit, le crédit n'arrive jamais.
 * Beats : 0–120 (table) · 120–240 (débit 200 OK) · 240–360 (500 + zoom) · 360–540 (50 € évaporés)
 */
export const Vue1Probleme: React.FC = () => {
  const frame = useCurrentFrame();

  const balanceA = useRoll(100, 0, 150, 22);
  const balanceB = 50;
  const total = useRoll(150, 50, 260, 24);
  const rouge = frame >= 262;

  const sqlLine1 = 'UPDATE accounts SET balance = balance - 100 WHERE id = 1;';
  const sqlLine2 = 'UPDATE accounts SET balance = balance + 100 WHERE id = 2;';

  return (
    <Stage accent={C.rose500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 240, scale: 1 },
          // zoom-in dramatique sur la ligne qui n'arrive jamais (780 ms, jamais de pan simultané)
          { at: 300, scale: 1.28, origin: '50% 52%' },
          { at: 356, scale: 1.0, origin: '50% 50%' },
        ]}
      >
        <SceneHeader
          kicker="Sous le capot — sans transaction"
          at={6}
          accent={C.rose400}
          right={
            <TotalBadge
              at={14}
              value={eur(total)}
              tone={rouge ? C.rose400 : C.emerald400}
              pulse={rouge}
              size={44}
              label={rouge ? 'TOTAL — INCOHÉRENT' : 'TOTAL'}
            />
          }
        />

        {/* table accounts */}
        <DataTable
          at={0}
          columns={['id', 'owner', 'balance']}
          colWidths={[110, 300, 0]}
          fontSize={30}
          style={{ position: 'absolute', left: 120, top: 620, width: 840 }}
          rows={[
            {
              id: 'r1',
              cells: ['1', 'Alice', eur(balanceA)],
              flashes: [{ at: 150, color: C.emerald400 }],
              tone: C.textPrimary,
            },
            {
              id: 'r2',
              cells: ['2', 'Bob', eur(balanceB)],
              flashes: [{ at: 262, color: C.rose400 }],
            },
          ]}
        />

        {/* requêtes SQL */}
        <div style={{ position: 'absolute', left: 120, top: 890, width: 840 }}>
          <CodeEditor
            code={`${sqlLine1}\n${sqlLine2}`}
            at={126}
            cps={38}
            focusLine={1}
            focusAt={252}
            fontSize={27}
            showLineNumbers={false}
            minimap={false}
            accent={C.indigo400}
            style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* terminal : le processus meurt entre les deux requêtes */}
        <div style={{ position: 'absolute', left: 120, top: 1180, width: 840 }}>
          <Terminal
            height={210}
            fontSize={26}
            title="db — server"
            lines={[
              { text: '$ debit --account 1 --amount 100', at: 128, type: true, tone: C.textCode },
              { text: '✓ 200 OK — 4.1 ms', at: 152, tone: C.emerald400 },
              { text: '✕ server process exited (SIGKILL)', at: 250, tone: C.rose400, type: true },
              { text: '  credit --account 2  ✗ jamais exécuté', at: 290, tone: C.textMuted },
            ]}
          />
        </div>

        {/* badges d'état */}
        <div style={{ position: 'absolute', left: 700, top: 1140 }}>
          <StatusCodeBadge at={156} variant="success" label="200 OK" size={26} />
        </div>
        <div style={{ position: 'absolute', left: 640, top: 1140 }}>
          <StatusCodeBadge at={266} variant="error" label="500 · INTERNAL" size={26} shake />
        </div>

        {/* annotations fait main */}
        <Arrow
          from={[250, 1300]}
          to={[430, 1200]}
          at={300}
          color={C.rose400}
          label="jamais exécuté"
        />
        <Circle cx={880} cy={700} rx={62} ry={40} at={366} color={C.rose400} rotate={-4} />
        <Arrow from={[760, 780]} to={[700, 640]} at={392} color={C.rose400} />
      </Camera>

      {/* hors-zoom : captions + voile final */}
      <Caption
        text="Étape 1 : débiter le compte A. Réussi."
        at={70}
        until={228}
        size={64}
        style={{ top: 1490 }}
      />
      <Caption
        text="Étape 2 : créditer le compte B. Le serveur plante avant."
        at={232}
        until={356}
        size={62}
        emphasize={[8, 9]}
        style={{ top: 1490 }}
      />
      <Caption
        text="50 € évaporés. Aucune trace, personne ne peut les récupérer."
        at={362}
        size={64}
        emphasize={[0, 1, 2]}
        style={{ top: 1490 }}
      />

      {frame >= 366 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(60% 40% at 50% 60%, ${hexA(C.rose500, 0.16)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
      <SceneSfx scene="vue1" />
    </Stage>
  );
};
