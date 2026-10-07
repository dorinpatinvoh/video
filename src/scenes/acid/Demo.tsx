import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { TabBar } from '../../components/BrowserFrame';
import { CodeEditor } from '../../components/CodeEditor';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { GlassCard } from '../../components/GlassCard';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT, GLOW } from '../../tokens';
import { eur, ip, useRoll } from '../../hooks';

const CODE = `// transfer.ts — tout ou rien
await db.transaction(async (tx) => {
  await tx.debit(from, 100);   // -100 €  (compte A)
  await tx.credit(to, 100);    // +100 €  (compte B)
});                            // COMMIT ou ROLLBACK`;

/**
 * BLOC 3 — DÉMO DE CODE · 10 s (600 frames)
 * Beats : 0–240 (frappe du pattern) · 240–420 (focus ligne clé + COMMIT) · 420–600 (comparatif SANS/AVEC)
 */
/** coche / croix vectorielles (les emojis ne sont pas rendus sur le canvas) */
const Mark: React.FC<{ ok: boolean; draw: number; color: string }> = ({ ok, draw, color }) => (
  <svg width={26} height={26} viewBox="0 0 24 24">
    {ok ? (
      <path
        d="M4 12.5 L9.5 18 L20 6"
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeDasharray={30}
        strokeDashoffset={(1 - draw) * 30}
      />
    ) : (
      <>
        <path d="M6 6 L18 18" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeDasharray={18} strokeDashoffset={(1 - draw) * 18} />
        <path d="M18 6 L6 18" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeDasharray={18} strokeDashoffset={(1 - draw) * 18} />
      </>
    )}
  </svg>
);

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useRoll(100, 0, 320, 20);
  const b = useRoll(50, 150, 350, 22);
  const t = useRoll(50, 150, 380, 24);

  return (
    <Stage accent={C.indigo500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 250, scale: 1.08, origin: '50% 44%' },
          { at: 430, scale: 1 },
        ]}
      >
        <SceneHeader
          kicker="Le pattern — 6 lignes"
          at={4}
          accent={C.indigo400}
          right={<StatusCodeBadge at={268} variant="success" label="COMMIT · 4,2 ms" size={26} />}
        />

        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 620,
            width: 900,
            opacity: 1 - ip(frame, [430, 448], [0, 1]),
            borderRadius: 22,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `${GLOW.card}${frame > 250 ? `, ${GLOW.indigo}` : ''}`,
            background: C.bgAlt,
          }}
        >
          <TabBar tabs={['transfer.ts', 'db.ts', 'schema.sql']} active={0} />
          <CodeEditor
            code={CODE}
            at={40}
            cps={54}
            fontSize={27}
            focusLine={1}
            focusAt={250}
            accent={C.indigo400}
            showLineNumbers
            style={{ border: 'none', borderRadius: 0 }}
            notes={[{ line: 1, text: '← garantie', tone: C.indigo400 }]}
          />
        </div>

        {/* compteurs qui valident, en cascade */}
        {frame >= 300 && (
          <div style={{ position: 'absolute', left: 120, top: 1080, width: 840, display: 'flex', gap: 20 }}>
            <MiniStat label="COMPTE A" value={eur(a)} at={306} tone={C.textPrimary} />
            <MiniStat label="COMPTE B" value={eur(b)} at={336} tone={C.emerald400} check />
            <MiniStat label="TOTAL" value={eur(t)} at={366} tone={C.emerald400} check />
          </div>
        )}

        {/* comparatif SANS / AVEC */}
        {frame >= 436 && (
          <div style={{ position: 'absolute', left: 120, top: 620, width: 840, display: 'flex', gap: 22 }}>
            <Compare
              title="SANS TRANSACTION"
              value="50,00 €"
              at={436}
              tone={C.rose400}
              ok={false}
              note="une étape sur deux appliquée"
            />
            <Compare
              title="AVEC TRANSACTION"
              value="150,00 €"
              at={460}
              tone={C.emerald400}
              ok
              note="tout ou rien, garanti"
            />
            {/* séparateur tracé */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 10,
                bottom: 10,
                width: 2,
                background: 'rgba(255,255,255,0.16)',
                transform: `scaleY(${ip(frame, [470, 490], [0, 1])})`,
                transformOrigin: 'top center',
              }}
            />
          </div>
        )}
      </Camera>

      <Caption
        text="En pratique tu n'écris jamais ça à la main : une seule fonction."
        at={70}
        until={250}
        size={56}
        style={{ top: 1490 }}
      />
      <Caption
        text="Le bloc s'exécute en entier… ou pas du tout. La base s'en charge."
        at={262}
        until={430}
        size={54}
        emphasize={[7, 8]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Même panne, une seule différence."
        at={470}
        size={54}
        emphasize={[4, 5]}
        style={{ top: 1490 }}
      />
      <SceneVo clip="acid-demo" />
      <SceneSfx scene="demo" />
    </Stage>
  );
};

const MiniStat: React.FC<{ label: string; value: string; at: number; tone: string; check?: boolean }> = ({
  label,
  value,
  at,
  tone,
  check,
}) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 14], [0, 1]);
  const draw = ip(frame, [at + 12, at + 34], [0, 1]);
  return (
    <div
      style={{
        flex: 1,
        padding: '20px 24px',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hexA(tone, 0.28)}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.1em', color: C.textMuted }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: tone }}>
          {value}
        </span>
        {check && (
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path
              d="M4 12.5 L9.5 18 L20 6"
              fill="none"
              stroke={C.emerald400}
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeDasharray={30}
              strokeDashoffset={(1 - draw) * 30}
            />
          </svg>
        )}
      </div>
    </div>
  );
};

const Compare: React.FC<{
  title: string;
  value: string;
  at: number;
  tone: string;
  ok: boolean;
  note: string;
}> = ({ title, value, at, tone, ok, note }) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1]);
  return (
    <GlassCard
      at={-999}
      glow={false}
      style={{
        position: 'relative',
        flex: 1,
        opacity: p * (ok ? 1 : 0.72),
        transform: `translateY(${(1 - p) * 22}px)`,
        borderColor: hexA(tone, 0.35),
        filter: ok ? 'none' : 'saturate(0.6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.mono, fontSize: 22, letterSpacing: '0.08em', color: tone }}>
        {title}
        <Mark ok={ok} draw={ip(frame, [at + 12, at + 34], [0, 1])} color={tone} />
      </div>
      <div
        className="mono"
        style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 700, color: tone, marginTop: 14 }}
      >
        {value}
      </div>
      <div style={{ fontFamily: FONT.ui, fontSize: 22, color: C.textMuted, marginTop: 12 }}>
        {note}
      </div>
    </GlassCard>
  );
};
