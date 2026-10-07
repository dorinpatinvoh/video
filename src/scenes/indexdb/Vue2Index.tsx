import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage, hexA } from '../../components/Stage';
import { Camera } from '../../components/Camera';
import { SceneHeader } from '../../components/SceneHeader';
import { SortedLookup, type LookupStep } from '../../components/SortedLookup';
import { StatusCodeBadge } from '../../components/StatusCodeBadge';
import { GlassCard } from '../../components/GlassCard';
import { Caption } from '../../components/Caption';
import { SceneSfx } from '../../components/Sfx';
import { SceneVo } from '../../components/VoiceOver';
import { C, FONT } from '../../tokens';
import { ip } from '../../hooks';

const ENTRIES = [
  'adupont', 'akonate', 'amoreau', 'arnaud',
  'bbakker', 'bhadad', 'boliveira', 'bsilva',
  'cbenali', 'ccosta', 'cdiallo', 'cmensah',
  'dchow', 'dfernandes', 'dmartins', 'dnguyen',
  'edupuis', 'ekoffi', 'emendes', 'esuzuki',
  'fadams', 'fdubois', 'fsantos', 'fyamada',
  'ggomes', 'ghassan', 'gmoreau', 'gpereira',
  'hba', 'hmani', 'hngo', 'hzhao',
];

const TARGET = 21; // fdubois

const STEPS: LookupStep[] = [
  { at: 62, lo: 0, hi: 31 },
  { at: 186, lo: 16, hi: 31 },
  { at: 232, lo: 16, hi: 22 },
  { at: 278, lo: 20, hi: 22 },
  { at: 330, lo: 21, hi: 21 },
];

const LOG = [
  { at: 186, text: 'milieu = adupond → la cible est après → on garde la moitié droite' },
  { at: 232, text: 'milieu = dnguyen → la cible est avant → encore la moitié' },
  { at: 278, text: 'milieu = emendes → après → fenêtre = 3 lignes' },
  { at: 330, text: 'milieu = fdubois → trouvé. 20 étapes, pas un million.' },
];

/**
 * VUE 2/4 — L'INDEX · 9 s (540 frames)
 * L'annuaire trié + recherche par dichotomie : 1 048 576 → 20 étapes.
 * Beats : 0–180 (l'annuaire) · 180–360 (les sauts) · 360–540 (0,42 ms · ×10 000)
 */
export const IndexVue2Index: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage accent={C.cyan400}>
      <Camera
        keys={[
          { at: 0, scale: 1 },
          { at: 300, scale: 1.05, origin: '50% 48%' },
          { at: 372, scale: 1.0 },
        ]}
      >
        <SceneHeader
          kicker="L'index = l'annuaire de la table"
          at={4}
          accent={C.cyan400}
          right={<StatusCodeBadge at={20} variant="info" label="trié par email" size={22} />}
        />

        <SortedLookup
          entries={ENTRIES}
          steps={STEPS}
          target={TARGET}
          at={0}
          style={{ position: 'absolute', left: 128, top: 640 }}
        />

        {/* journal des sauts */}
        <GlassCard
          at={30}
          accent={C.cyan400}
          label="JOURNAL DE LA RECHERCHE"
          labelTone={C.cyan400}
          style={{ left: 120, top: 980, width: 840 }}
          padding={26}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 24, lineHeight: 1.75, minHeight: 190 }}>
            {LOG.map((l, i) => {
              const p = ip(frame, [l.at, l.at + 10], [0, 1]);
              if (frame < l.at) return null;
              return (
                <div
                  key={i}
                  style={{
                    color: i === LOG.length - 1 ? C.emerald400 : C.textSecondary,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 12}px)`,
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <span style={{ color: C.textMuted }}>{i === LOG.length - 1 ? '✓' : '›'}</span>
                  {l.text}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* verdict */}
        {frame >= 372 && (
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 1290,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: ip(frame, [372, 392], [0, 1]),
            }}
          >
            <StatusCodeBadge at={376} variant="success" label="0,42 ms" size={36} />
            <span
              className="mono"
              style={{
                fontFamily: FONT.mono,
                fontSize: 46,
                fontWeight: 700,
                color: C.emerald400,
                textShadow: `0 0 30px ${hexA(C.emerald400, 0.6)}`,
              }}
            >
              ×10 000
            </span>
            <span style={{ fontFamily: FONT.ui, fontSize: 26, color: C.textSecondary }}>
              même requête, même données
            </span>
          </div>
        )}
      </Camera>

      <Caption text="Un index, c'est l'annuaire de la table : les mêmes données, triées." at={30} until={182} size={56} style={{ top: 1490 }} />
      <Caption
        text="On ouvre au milieu, on élimine la moitié."
        at={196}
        until={352}
        size={56}
        emphasize={[3, 4]}
        style={{ top: 1490 }}
      />
      <Caption text="Vingt étapes suffisent." at={372} size={68} emphasize={[0, 1]} style={{ top: 1490 }} />

      <SceneVo clip="index-vue2" />
      <SceneSfx scene="idx-vue2" />
    </Stage>
  );
};
