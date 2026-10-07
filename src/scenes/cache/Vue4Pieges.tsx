import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { SceneHeader } from '../../components/SceneHeader';
import { Camera } from '../../components/Camera';
import { GlassCard } from '../../components/GlassCard';
import { CacheBox } from '../../components/Waterfall';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { CodeEditor } from '../../components/CodeEditor';
import { Cursor } from '../../components/Cursor';
import { Caption } from '../../components/Caption';
import { SceneVo } from '../../components/VoiceOver';
import { SceneSfx } from '../../components/Sfx';
import { C, FONT, GLOW } from '../../tokens';
import { ip } from '../../hooks';

/** un beat toutes les 3 s (180 frames) : 5 beats sur 15 s */
const BEAT = 180;

/**
 * VUE 4/4 — LES 4 PIÈGES (et la sortie) · 15 s (900 frames)
 * 1 contenu figé · 2 l'empreinte dans le nom · 3 la fuite de données · 4 l'invalidation · 5 les 3 en-têtes
 */
export const CacheVue4Pieges: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = Math.min(5, Math.floor(frame / BEAT) + 1);
  const KICKERS: Record<number, string> = {
    1: 'Piège 1 — le contenu figé',
    2: 'Piège 2 — l’empreinte dans le nom',
    3: 'Piège 3 — la fuite de données',
    4: 'Piège 4 — l’invalidation',
    5: 'La sortie — trois en-têtes',
  };

  return (
    <Stage accent={beat === 5 ? C.emerald500 : C.rose500}>
      <SceneHeader kicker={KICKERS[beat]} at={beat === 1 ? 4 : 0} accent={beat === 5 ? C.emerald400 : C.rose400} />

      <Camera
        keys={[
          { at: 0, scale: 1, origin: '50% 42%' },
          { at: BEAT, scale: 1.05, origin: '50% 42%' },
          { at: 2 * BEAT, scale: 1.0, origin: '50% 42%' },
          { at: 3 * BEAT, scale: 1.05, origin: '50% 42%' },
          { at: 4 * BEAT, scale: 1.0, origin: '50% 42%' },
          { at: 5 * BEAT - 40, scale: 1.03, origin: '50% 42%' },
        ]}
      >
      {/* ---- beat 1 : contenu figé (prix périmé) ---- */}
      {beat === 1 && (
        <>
          <div style={{ position: 'absolute', left: 120, top: 620, width: 840, display: 'flex', gap: 22 }}>
            <GlassCard at={0} accent={C.rose400} glow style={{ position: 'relative', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.1em', color: C.rose400 }}>
                  EN CACHE
                </span>
                <span
                  className="mono"
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 19,
                    color: C.rose400,
                    border: `1px solid ${hexA(C.rose400, 0.4)}`,
                    borderRadius: 999,
                    padding: '3px 12px',
                  }}
                >
                  24 h
                </span>
              </div>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 66, fontWeight: 700, color: C.textPrimary, marginTop: 12 }}>
                99 €
              </div>
              <div style={{ fontFamily: FONT.ui, fontSize: 22, color: C.textMuted }}>prix d'hier</div>
            </GlassCard>

            <GlassCard at={16} accent={C.emerald400} style={{ position: 'relative', flex: 1 }}>
              <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.1em', color: C.emerald400 }}>
                PRIX RÉEL
              </span>
              <div className="mono" style={{ fontFamily: FONT.mono, fontSize: 66, fontWeight: 700, color: C.emerald400, marginTop: 12 }}>
                79 €
              </div>
              <div style={{ fontFamily: FONT.ui, fontSize: 22, color: C.textMuted }}>en base, maintenant</div>
            </GlassCard>
          </div>

          {/* l'utilisateur reçoit la vieille valeur */}
          {frame >= 120 && (
            <div
              style={{
                position: 'absolute',
                left: 120,
                top: 900,
                width: 840,
                opacity: ip(frame, [120, 144], [0, 1]),
              }}
            >
              <div
                style={{
                  padding: '22px 26px',
                  borderRadius: 16,
                  background: hexA(C.rose500, 0.08),
                  border: `1px solid ${hexA(C.rose500, 0.35)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                <span style={{ fontFamily: FONT.ui, fontSize: 28, color: C.textPrimary }}>
                  Le visiteur voit
                </span>
                <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 700, color: C.rose400 }}>
                  99 €
                </span>
                <svg width={30} height={30} viewBox="0 0 24 24">
                  <path d="M6 6 L18 18" stroke={C.rose400} strokeWidth={2.8} strokeLinecap="round" />
                  <path d="M18 6 L6 18" stroke={C.rose400} strokeWidth={2.8} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}
          {frame >= 132 && (
            <div style={{ position: 'absolute', left: 480, top: 1000 }}>
              <StatusCodeBadge at={136} variant="error" label="PRIX PÉRIMÉ" size={26} shake />
            </div>
          )}
        </>
      )}

      {/* ---- beat 2 : l'empreinte dans le nom ---- */}
      {beat === 2 && (
        <>
          <div style={{ position: 'absolute', left: 120, top: 640, width: 840, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FileChip name="app.js" cache="CACHE 1 AN" at={BEAT + 10} tone={C.textSecondary} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: ip(frame, [BEAT + 46, BEAT + 66], [0, 1]) }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 21, color: C.textMuted }}>déploiement →</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 21, color: C.emerald400 }}>
                le nom change, donc l'URL change
              </span>
            </div>
            <FileChip name="app.7f3a9c.js" cache="CACHE 1 AN" at={BEAT + 92} tone={C.emerald400} check />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 940,
              width: 840,
              padding: '20px 24px',
              borderRadius: 16,
              background: hexA(C.emerald400, 0.08),
              border: `1px solid ${hexA(C.emerald400, 0.32)}`,
              fontFamily: FONT.ui,
              fontSize: 26,
              color: C.textPrimary,
              opacity: ip(frame, [BEAT + 110, BEAT + 132], [0, 1]),
            }}
          >
            Aucun cache à purger : le nouveau fichier est une <span style={{ color: C.emerald400 }}>nouvelle URL</span>.
          </div>
        </>
      )}

      {/* ---- beat 3 : la fuite de données ---- */}
      {beat === 3 && (
        <>
          <div style={{ position: 'absolute', left: 120, top: 620, width: 840 }}>
            <CacheBox
              at={2 * BEAT + 6}
              width={840}
              title="CACHE PARTAGÉ DU CDN"
              entries={[{ id: 'alice', label: 'page « Mon compte » — Alice · solde 2 400 €', at: 2 * BEAT + 60, tone: C.rose400 }]}
              missAt={2 * BEAT + 40}
              missLabel="MISS · Alice a chargé la page"
              hitAt={2 * BEAT + 108}
              hitLabel="HIT · 2 ms"
              censorAt={2 * BEAT + 116}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 900,
              width: 840,
              opacity: ip(frame, [2 * BEAT + 120, 2 * BEAT + 142], [0, 1]),
            }}
          >
            <div
              style={{
                padding: '22px 26px',
                borderRadius: 16,
                background: hexA(C.rose500, 0.10),
                border: `1px solid ${hexA(C.rose500, 0.4)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: GLOW.rose,
              }}
            >
              <span style={{ fontFamily: FONT.ui, fontSize: 27, color: C.textPrimary }}>
                Bob demande sa page… et reçoit celle d'<span style={{ color: C.rose400 }}>Alice</span>.
              </span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 480, top: 1010 }}>
            <StatusCodeBadge at={2 * BEAT + 130} variant="error" label="FUITE DE DONNÉES" size={26} shake />
          </div>
          {frame >= 2 * BEAT + 116 && frame <= 2 * BEAT + 132 && (
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

      {/* ---- beat 4 : l'invalidation ---- */}
      {beat === 4 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 620,
              width: 840,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 12,
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const purged = i < 3 && frame >= 3 * BEAT + 96;
              const p = ip(frame, [3 * BEAT + 8 + i * 2, 3 * BEAT + 22 + i * 2], [0, 1]);
              return (
                <div
                  key={i}
                  style={{
                    height: 54,
                    borderRadius: 10,
                    background: purged ? 'rgba(255,255,255,0.02)' : hexA(C.amber400, 0.10),
                    border: `1px solid ${purged ? 'rgba(255,255,255,0.08)' : hexA(C.amber400, 0.35)}`,
                    opacity: p * (purged ? 0.45 : 1),
                    transform: `scale(${purged ? 0.94 : 1})`,
                  }}
                />
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 900,
              width: 840,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: ip(frame, [3 * BEAT + 80, 3 * BEAT + 100], [0, 1]),
            }}
          >
            <div
              style={{
                padding: '18px 34px',
                borderRadius: 999,
                background: hexA(C.amber400, 0.14),
                border: `1px solid ${hexA(C.amber400, 0.5)}`,
                fontFamily: FONT.ui,
                fontSize: 30,
                fontWeight: 700,
                color: C.amber400,
                transform: `scale(${frame > 3 * BEAT + 90 && frame < 3 * BEAT + 100 ? 0.96 : 1})`,
              }}
            >
              PURGER
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 24, color: C.textSecondary }}>
              3 purgés · 21 restent en cache
            </span>
          </div>
          <div style={{ position: 'absolute', left: 420, top: 1010 }}>
            <StatusCodeBadge at={3 * BEAT + 120} variant="warn" label="TTL RESTANT VARIABLE" size={24} />
          </div>
        </>
      )}

      {/* ---- beat 5 : les 3 en-têtes ---- */}
      {beat === 5 && (
        <div style={{ position: 'absolute', left: 120, top: 640, width: 840 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                code: "'Cache-Control': 'public, max-age=31536000, immutable'",
                at: 4 * BEAT + 10,
                tone: C.emerald400,
                note: 'asset avec empreinte',
              },
              {
                code: "'Cache-Control': 'no-cache'",
                at: 4 * BEAT + 60,
                tone: C.cyan400,
                note: 'HTML : revalide à chaque fois',
              },
              {
                code: "'Cache-Control': 'no-store'",
                at: 4 * BEAT + 110,
                tone: C.rose400,
                note: 'page personnelle : jamais en cache',
              },
            ].map((l) => {
              const p = ip(frame, [l.at, l.at + 16], [0, 1]);
              const check = ip(frame, [l.at + 18, l.at + 40], [0, 1]);
              return (
                <div
                  key={l.code}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 14,
                    background: 'rgba(6,9,15,0.7)',
                    border: `1px solid ${hexA(l.tone, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 18}px)`,
                  }}
                >
                  <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 20, color: l.tone, flex: 1 }}>
                    {l.code}
                  </span>
                  <svg width={26} height={26} viewBox="0 0 24 24">
                    <path
                      d="M4 12.5 L9.5 18 L20 6"
                      fill="none"
                      stroke={l.tone}
                      strokeWidth={2.8}
                      strokeLinecap="round"
                      strokeDasharray={30}
                      strokeDashoffset={(1 - check) * 30}
                    />
                  </svg>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: 22, color: C.textMuted, opacity: ip(frame, [4 * BEAT + 140, 4 * BEAT + 160], [0, 1]) }}>
            trois en-têtes · trois intentions
          </div>
        </div>
      )}

      </Camera>

      <Cursor
        keys={[
          { at: 10, x: 880, y: 1240 },
          { at: BEAT + 60, x: 700, y: 800 },
          { at: 2 * BEAT + 120, x: 760, y: 800 },
          { at: 3 * BEAT + 88, x: 330, y: 950, act: 'click' },
          { at: 4 * BEAT + 60, x: 800, y: 800 },
        ]}
        enterAt={8}
        hideAt={900}
        size={32}
      />

      <Caption text="Le cache fige ce qu'il garde." at={30} until={176} size={62} style={{ top: 1490 }} />
      <Caption
        text="Cache long… à condition que le nom change."
        at={BEAT + 30}
        until={BEAT + 176}
        size={56}
        emphasize={[6, 7]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Jamais de cache partagé sur une page personnelle."
        at={2 * BEAT + 30}
        until={2 * BEAT + 176}
        size={54}
        emphasize={[6, 7]}
        style={{ top: 1490 }}
      />
      <Caption
        text="Le plus dur, c'est de vider ce qui est déjà là."
        at={3 * BEAT + 30}
        until={3 * BEAT + 176}
        size={56}
        emphasize={[5]}
        style={{ top: 1490 }}
      />
      <Caption
        text="La bonne nouvelle : trois en-têtes suffisent."
        at={4 * BEAT + 30}
        size={56}
        emphasize={[6]}
        style={{ top: 1490 }}
      />

      <SceneVo clip="cache-vue4" />
      <SceneSfx scene="cache-vue4" />
    </Stage>
  );
};

const FileChip: React.FC<{ name: string; cache: string; at: number; tone: string; check?: boolean }> = ({
  name,
  cache,
  at,
  tone,
  check,
}) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + 16], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '22px 26px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.035)',
        border: `1px solid ${hexA(tone, 0.28)}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      <span className="mono" style={{ fontFamily: FONT.mono, fontSize: 30, color: C.textPrimary, flex: 1 }}>
        {name}
      </span>
      <span
        className="mono"
        style={{
          fontFamily: FONT.mono,
          fontSize: 20,
          color: tone,
          border: `1px solid ${hexA(tone, 0.4)}`,
          borderRadius: 999,
          padding: '5px 14px',
          whiteSpace: 'nowrap',
        }}
      >
        {cache}
      </span>
      {check && (
        <svg width={28} height={28} viewBox="0 0 24 24">
          <path
            d="M4 12.5 L9.5 18 L20 6"
            fill="none"
            stroke={C.emerald400}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeDasharray={30}
            strokeDashoffset={(1 - ip(frame, [at + 20, at + 42], [0, 1])) * 30}
          />
        </svg>
      )}
    </div>
  );
};
