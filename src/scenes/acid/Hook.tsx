import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { BrowserFrame } from '../../components/BrowserFrame';
import { GlassCard } from '../../components/GlassCard';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { TotalBadge } from '../../components/DataTable';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { C, EASE, FONT, GLOW } from '../../tokens';
import { eur, useRoll, useShake } from '../../hooks';

/**
 * SCÈNE 1 — HOOK VISUEL · 0–3 s (180 frames)
 * « 100 € partent du compte A… et n'arrivent jamais sur B. »
 * Beat 1 (0–90) : le virement semble fonctionner.
 * Beat 2 (90–180) : l'argent s'évapore → erreur, solde incohérent.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // --- soldes
  const a = useRoll(100, 0, 48, 20); // débit instantané (le curseur a cliqué)
  const b = 50;
  const total = useRoll(150, 50, 104, 26);
  const incohérent = frame >= 104;

  const shake = useShake(126, 3);
  const glitch = frame >= 126 && frame <= 140;

  return (
    <Stage accent={C.emerald500}>
      {/* cadre navigateur */}
      <BrowserFrame
        url="banque.app/virement"
        at={4}
        glow
        style={{ left: 120, top: 430, width: 840, height: 860 }}
      >
        <div style={{ padding: '34px 40px', display: 'flex', flexDirection: 'column', gap: 26 }}>
          {/* comptes */}
          <div style={{ display: 'flex', gap: 22 }}>
            <AccountCard
              name="Compte A"
              iban="•• 4821"
              value={eur(a)}
              tone={incohérent ? C.rose400 : C.emerald400}
              flashAt={50}
              shakeX={shake.x}
            />
            <AccountCard
              name="Compte B"
              iban="•• 1937"
              value={eur(b)}
              tone={C.textPrimary}
              badge={
                <StatusCodeBadge
                  at={104}
                  variant="error"
                  label="PENDING ✕"
                  size={22}
                  shake
                />
              }
            />
          </div>

          {/* bouton de virement */}
          <div
            style={{
              marginTop: 6,
              height: 108,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 30px',
              background: frame > 38 ? hexA(C.indigo500, 0.22) : 'rgba(255,255,255,0.05)',
              border: `1px solid ${frame > 30 ? hexA(C.indigo400, 0.6) : 'rgba(255,255,255,0.1)'}`,
              boxShadow: frame > 38 ? GLOW.indigo : GLOW.card,
              transform: `scale(${frame > 52 && frame < 60 ? 0.97 : 1})`,
            }}
          >
            <span style={{ fontFamily: FONT.ui, fontSize: 34, fontWeight: 600, color: C.textPrimary }}>
              Virement A → B
            </span>
            <span
              className="mono"
              style={{ fontFamily: FONT.mono, fontSize: 34, color: C.indigo400, fontWeight: 700 }}
            >
              100,00 €
            </span>
          </div>

          {/* état du virement */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
            <StatusCodeBadge at={60} variant="success" label="200 OK" size={26} />
            <span style={{ fontFamily: FONT.mono, fontSize: 24, color: C.textMuted }}>
              transaction ouverte…
            </span>
          </div>
        </div>
      </BrowserFrame>

      {/* HUD total */}
      <div style={{ position: 'absolute', left: 120, top: 1330 }}>
        <TotalBadge
          at={12}
          value={eur(total)}
          tone={incohérent ? C.rose400 : C.emerald400}
          pulse={incohérent}
          size={52}
          label={incohérent ? "TOTAL — INCOHÉRENT" : 'TOTAL'}
        />
      </div>

      {/* curseur : entre → vise → clique */}
      <Cursor
        keys={[
          { at: 0, x: 760, y: 1520 },
          { at: 26, x: 640, y: 1010, act: 'hover' },
          { at: 40, x: 640, y: 1010 },
          { at: 46, x: 640, y: 1010, act: 'click' },
          { at: 70, x: 700, y: 1240, act: 'hover' },
        ]}
        enterAt={0}
        size={38}
      />

      {/* voile de glitch au moment de l'erreur */}
      {glitch && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(0deg, transparent, ${hexA(C.rose500, 0.10)}, transparent)`,
            marginLeft: frame % 2 === 0 ? 4 : -4,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* captions (sous-titres brûlés) */}
      <Caption
        text="100 € partent du compte A…"
        at={2}
        until={86}
        size={70}
        style={{ top: 1490 }}
      />
      <Caption
        text="…et n'arrivent jamais sur le compte B."
        at={90}
        size={70}
        emphasize={[4, 5, 6]}
        style={{ top: 1490 }}
      />
      <SceneSfx scene="hook" />
    </Stage>
  );
};

const AccountCard: React.FC<{
  name: string;
  iban: string;
  value: string;
  tone: string;
  flashAt?: number;
  badge?: React.ReactNode;
  shakeX?: number;
}> = ({ name, iban, value, tone, flashAt = -999, badge, shakeX = 0 }) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [flashAt, flashAt + 8, flashAt + 24], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
  return (
    <GlassCard
      at={10}
      style={{ position: 'relative', flex: 1, transform: `translateX(${shakeX}px)` }}
      padding={26}
      glow={flash > 0.2}
    >
      <div style={{ fontFamily: FONT.ui, fontSize: 26, color: C.textMuted, fontWeight: 500 }}>
        {name}
      </div>
      <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 22, color: C.textMuted }}>
        {iban}
      </div>
      <div
        className="mono"
        style={{
          fontFamily: FONT.mono,
          fontSize: 52,
          fontWeight: 700,
          color: tone,
          marginTop: 14,
          fontVariantNumeric: 'tabular-nums',
          textShadow: flash > 0.02 ? `0 0 30px ${hexA(tone, 0.7)}` : 'none',
        }}
      >
        {value}
      </div>
      {badge && <div style={{ marginTop: 16 }}>{badge}</div>}
    </GlassCard>
  );
};
