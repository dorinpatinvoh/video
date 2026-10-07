import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { BrowserFrame } from '../../components/BrowserFrame';
import { TotalBadge } from '../../components/DataTable';
import { Terminal } from '../../components/Terminal';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { Cursor } from '../../components/Cursor';
import { GlassCard } from '../../components/GlassCard';
import { Arrow, Circle } from '../../components/Annotation';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT } from '../../tokens';
import { eur, ip, useRoll } from '../../hooks';

/**
 * VUE 4/4 — I · ISOLATION + D · DURABILITÉ · 15 s (900 frames)
 * Beats : 0–180 (2 clients simultanés) · 180–360 (double dépense) · 360–540 (verrou, ordre respecté)
 *         540–720 (coupure de courant) · 720–900 (journal rejoué, données intactes)
 */
export const Vue4IsolationDurabilite: React.FC = () => {
  const frame = useCurrentFrame();

  const phase1 = frame < 540; // isolation
  const blackout = frame >= 560 && frame < 700;
  const dark = ip(frame, [560, 574], [0, 1]);

  // double dépense : les deux clients lisent 100 en même temps
  const doubleSpend = frame >= 180 && frame < 360;
  const totalDup = useRoll(150, 250, 196, 22);
  const totalOk = useRoll(0, 150, 396, 24);

  const bal1 = doubleSpend ? 0 : frame >= 380 ? 0 : 100;
  const bal2 = doubleSpend ? 100 : 50;

  return (
    <Stage accent={blackout ? C.rose500 : C.indigo500}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 176, scale: 1.16, origin: '50% 48%' },
          { at: 356, scale: 1.0 },
          { at: 552, scale: 0.96 },
          { at: 700, scale: 1.0 },
          { at: 880, scale: 1.04 },
        ]}
      >
        <SceneHeader
          kicker={
            phase1 ? 'I · Isolation — 2 clients, 1 solde' : 'D · Durabilité — la panne ne change rien'
          }
          at={4}
          accent={blackout ? C.rose400 : C.indigo400}
          right={
            <TotalBadge
              at={10}
              value={eur(frame >= 380 && frame < 560 ? totalOk : totalDup)}
              tone={doubleSpend ? C.rose400 : C.emerald400}
              pulse={doubleSpend}
              size={42}
              label={doubleSpend ? 'DOUBLE DÉPENSE' : 'TOTAL'}
            />
          }
        />

        {/* ---------- ISOLATION : deux clients ---------- */}
        {frame < 540 && (
          <>
            <div style={{ position: 'absolute', left: 100, top: 620 }}>
              <BrowserFrame url="client-1" at={0} compact style={{ position: 'relative', width: 420, height: 480 }}>
                <ClientPanel
                  title="Client 1"
                  balance={eur(bal1)}
                  buttonLabel="Virement 100 €"
                  pressedAt={112}
                  okAt={380}
                  okLabel="200 OK"
                />
              </BrowserFrame>
            </div>
            <div style={{ position: 'absolute', left: 560, top: 620 }}>
              <BrowserFrame url="client-2" at={6} compact style={{ position: 'relative', width: 420, height: 480 }}>
                <ClientPanel
                  title="Client 2"
                  balance={eur(bal2)}
                  buttonLabel="Virement 100 €"
                  pressedAt={112}
                  pendingAt={378}
                  pendingLabel="verrou 12 ms"
                  okAt={414}
                  okLabel="200 OK"
                />
              </BrowserFrame>
            </div>

            {/* 2 curseurs distincts, jamais synchrones */}
            <Cursor
              keys={[
                { at: 0, x: 420, y: 1200 },
                { at: 100, x: 300, y: 980, act: 'hover' },
                { at: 112, x: 300, y: 980, act: 'click' },
                { at: 200, x: 520, y: 1180, act: 'hover' },
              ]}
              enterAt={0}
              hideAt={540}
              accent={C.cyan400}
              size={34}
            />
            <Cursor
              keys={[
                { at: 8, x: 900, y: 1240 },
                { at: 108, x: 880, y: 990, act: 'hover' },
                { at: 120, x: 880, y: 990, act: 'click' },
                { at: 260, x: 760, y: 1160 },
              ]}
              enterAt={8}
              hideAt={540}
              accent={C.emerald400}
              size={34}
            />

            {/* annotations du doublon */}
            <Circle cx={310} cy={770} rx={110} ry={52} at={210} color={C.rose400} />
            <Circle cx={770} cy={770} rx={110} ry={52} at={224} color={C.rose400} />
            <Arrow from={[540, 640]} to={[540, 700]} at={250} color={C.rose400} />
          </>
        )}

        {/* verrou : barre de progression du Pending */}
        {frame >= 372 && frame < 430 && (
          <div style={{ position: 'absolute', left: 600, top: 1160, width: 340, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.1)' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 6,
                width: `${ip(frame, [372, 414], [0, 100])}%`,
                background: C.amber400,
                boxShadow: `0 0 20px ${C.amber400}`,
              }}
            />
          </div>
        )}

        {/* ---------- DURABILITÉ ---------- */}
        {frame >= 700 && (
          <div style={{ position: 'absolute', left: 120, top: 620, width: 840 }}>
            <GlassCard at={700} accent={C.emerald400} glow label="JOURNAL (WAL) — REJEU AU DÉMARRAGE" labelTone={C.emerald400}>
              <div style={{ fontFamily: FONT.mono, fontSize: 24, lineHeight: 1.7 }}>
                {[
                  'INSERT txn#4821 debit  account=1 amount=100',
                  'INSERT txn#4821 credit account=2 amount=100',
                  'COMMIT txn#4821  ✓ écrit sur disque (fsync)',
                  'SELECT SUM(balance) FROM accounts;  → 150,00 €',
                ].map((l, i) => {
                  const p = ip(frame, [712 + i * 5, 726 + i * 5], [0, 1]);
                  const ok = frame > 740 + i * 5;
                  return (
                    <div
                      key={i}
                      style={{
                        color: ok ? C.emerald400 : C.textSecondary,
                        opacity: p,
                        transform: `translateX(${(1 - p) * 16}px)`,
                      }}
                    >
                      {l}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <div style={{ position: 'absolute', left: 0, top: 420 }}>
              <Terminal
                height={190}
                width={840}
                fontSize={26}
                title="postgres — restart"
                lines={[
                  { text: '$ systemctl restart postgres', at: 704, type: true },
                  { text: 'recovering from WAL … done in 42 ms', at: 736 },
                  { text: '✓ 0 transaction perdue', at: 762, tone: C.emerald400 },
                ]}
              />
            </div>
          </div>
        )}
      </Camera>

      {/* coupure de courant : écran noir + badge */}
      {dark > 0 && (
        <AbsoluteFill style={{ background: `rgba(2,3,6,${Math.min(1, dark * 1.1)})` }} />
      )}
      {blackout && (
        <div style={{ position: 'absolute', left: 120, top: 900, width: 840, textAlign: 'center' }}>
          <IcOneOff />
          <div style={{ marginTop: 28 }}>
            <StatusCodeBadge at={574} variant="error" label="POWER LOSS" size={30} shake />
          </div>
        </div>
      )}

      {/* captions */}
      <Caption text="Deux clients, une seule ligne de solde." at={30} until={178} size={62} style={{ top: 1490 }} />
      <Caption
        text="Sans isolation, les deux lisent le même solde et dépensent deux fois le même argent."
        at={190}
        until={356}
        size={52}
        emphasize={[3, 4, 5]}
        style={{ top: 1490 }}
      />
      <Caption
        text="La base fait la queue : le second attend son tour. Tout reste juste."
        at={372}
        until={552}
        size={54}
        emphasize={[11, 12]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Le courant se coupe en pleine écriture."
        at={596}
        until={700}
        size={62}
        emphasize={[1, 2]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Au redémarrage, le journal rejoue la transaction. Rien n'est perdu."
        at={742}
        size={56}
        emphasize={[8, 9]}
        style={{ top: 1490 }}
      />

      <SceneSfx scene="vue4" />
    </Stage>
  );
};

const ClientPanel: React.FC<{
  title: string;
  balance: string;
  buttonLabel: string;
  pressedAt: number;
  pendingAt?: number;
  pendingLabel?: string;
  okAt?: number;
  okLabel?: string;
}> = ({ title, balance, buttonLabel, pressedAt, pendingAt, pendingLabel, okAt, okLabel }) => {
  const frame = useCurrentFrame();
  const pressed = frame >= pressedAt && frame < pressedAt + 8;
  return (
    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: FONT.ui, fontSize: 26, color: C.textMuted }}>{title}</div>
      <div
        className="mono"
        style={{ fontFamily: FONT.mono, fontSize: 46, fontWeight: 700, color: C.textPrimary, fontVariantNumeric: 'tabular-nums' }}
      >
        {balance}
      </div>
      <div
        style={{
          height: 78,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: pressed ? hexA(C.indigo500, 0.3) : 'rgba(255,255,255,0.05)',
          border: `1px solid ${pressed ? C.indigo400 : 'rgba(255,255,255,0.1)'}`,
          transform: `scale(${pressed ? 0.97 : 1})`,
          fontFamily: FONT.ui,
          fontSize: 28,
          fontWeight: 600,
          color: C.textPrimary,
        }}
      >
        {buttonLabel}
      </div>
      <div style={{ height: 40 }}>
        {pendingAt !== undefined && frame >= pendingAt && (okAt === undefined || frame < okAt) && (
          <StatusCodeBadge at={pendingAt} variant="pending" label={pendingLabel ?? 'Pending'} size={22} pulse />
        )}
        {okAt !== undefined && frame >= okAt && (
          <StatusCodeBadge at={okAt} variant="success" label={okLabel ?? '200 OK'} size={22} />
        )}
      </div>
    </div>
  );
};

const IcOneOff = () => (
  <svg width={110} height={110} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.9 }}>
    <path d="M12 3v9" stroke={C.rose400} strokeWidth={2.2} strokeLinecap="round" />
    <path d="M6.5 6.6a8 8 0 1011 0" stroke={C.rose400} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);
