import React from 'react';
import { AbsoluteFill, Composition, Series } from 'remotion';
import { FPS, H, W } from '../tokens';
import { Ambience } from '../components/Sfx';
import { HookScene } from '../scenes/acid/Hook';
import { Vue1Probleme } from '../scenes/acid/Vue1Probleme';
import { Vue2Atomicite } from '../scenes/acid/Vue2Atomicite';
import { Vue3Coherence } from '../scenes/acid/Vue3Coherence';
import { Vue4IsolationDurabilite } from '../scenes/acid/Vue4IsolationDurabilite';
import { DemoScene } from '../scenes/acid/Demo';
import { OutroScene } from '../scenes/acid/Outro';

/* ---------------------------------------------------------------------------
   Découpage imposé par le STANDARD §8 :
   Hook 0–3 s · Décorticage 3–45 s · Démo 45–55 s · Outro 55–60 s  = 3600 frames
--------------------------------------------------------------------------- */
export const SCENES = [
  { id: 'Acid-Hook', label: '1 · Hook (0–3 s)', duration: 180, Comp: HookScene },
  { id: 'Acid-Vue1-Probleme', label: '2 · Vue 1 — le problème', duration: 540, Comp: Vue1Probleme },
  { id: 'Acid-Vue2-Atomicite', label: '3 · Vue 2 — A · Atomicité', duration: 540, Comp: Vue2Atomicite },
  { id: 'Acid-Vue3-Coherence', label: '4 · Vue 3 — C · Cohérence', duration: 540, Comp: Vue3Coherence },
  {
    id: 'Acid-Vue4-Isolation-Durabilite',
    label: '5 · Vue 4 — I · Isolation + D · Durabilité',
    duration: 900,
    Comp: Vue4IsolationDurabilite,
  },
  { id: 'Acid-Demo', label: '6 · Démo de code', duration: 600, Comp: DemoScene },
  { id: 'Acid-Outro', label: '7 · Outro / CTA', duration: 300, Comp: OutroScene },
] as const;

const TOTAL = SCENES.reduce((acc, s) => acc + s.duration, 0); // 3600 = 60 s

/** La vidéo complète, minute par minute (bloc imposé par le standard). */
export const AcidTransactions: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
    {/* nappe de fond −30 dB (STANDARD §5) */}
    <Ambience />
    {/* Voix off : déposer public/audio/vo.mp3 puis décommenter
    <Audio src={staticFile('audio/vo.mp3')} volume={0.9} playBackrate={1.0} />
    */}
    <Series>
      {SCENES.map(({ id, duration, Comp }) => (
        <Series.Sequence key={id} durationInFrames={duration} name={id}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {/* vidéo complète 60 s */}
    <Composition
      id="ACID-transactions-60s"
      component={AcidTransactions}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
    />

    {/* une composition par scène : revue et itération rapides dans Remotion Studio */}
    {SCENES.map(({ id, label, duration, Comp }) => (
      <Composition
        key={id}
        id={id}
        component={Comp as React.FC}
        durationInFrames={duration}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
