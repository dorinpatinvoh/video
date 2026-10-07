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
import { IndexHook } from '../scenes/indexdb/Hook';
import { IndexVue1Scan } from '../scenes/indexdb/Vue1Scan';
import { IndexVue2Index } from '../scenes/indexdb/Vue2Index';
import { IndexVue3Cout } from '../scenes/indexdb/Vue3Cout';
import { IndexVue4Pieges } from '../scenes/indexdb/Vue4Pieges';
import { IndexDemo } from '../scenes/indexdb/Demo';
import { IndexOutro } from '../scenes/indexdb/Outro';
import { CacheHook } from '../scenes/cache/Hook';
import { CacheVue1Voyage } from '../scenes/cache/Vue1Voyage';
import { CacheVue2Cache } from '../scenes/cache/Vue2Cache';
import { CacheVue3CDN } from '../scenes/cache/Vue3CDN';
import { CacheVue4Pieges } from '../scenes/cache/Vue4Pieges';
import { CacheDemo } from '../scenes/cache/Demo';
import { CacheOutro } from '../scenes/cache/Outro';

/* ---------------------------------------------------------------------------
   Découpage imposé par le STANDARD §8 :
   Hook 0–3 s · Décorticage 3–45 s · Démo 45–55 s · Outro 55–60 s  = 3600 frames
   (les deux vidéos partagent exactement la même grille de durées)
--------------------------------------------------------------------------- */

export const SCENES_ACID = [
  { id: 'Acid-Hook', label: '1 · Hook', duration: 180, Comp: HookScene },
  { id: 'Acid-Vue1-Probleme', label: '2 · Vue 1 — le problème', duration: 540, Comp: Vue1Probleme },
  { id: 'Acid-Vue2-Atomicite', label: '3 · Vue 2 — A · Atomicité', duration: 540, Comp: Vue2Atomicite },
  { id: 'Acid-Vue3-Coherence', label: '4 · Vue 3 — C · Cohérence', duration: 540, Comp: Vue3Coherence },
  { id: 'Acid-Vue4-Isolation-Durabilite', label: '5 · Vue 4 — I + D', duration: 900, Comp: Vue4IsolationDurabilite },
  { id: 'Acid-Demo', label: '6 · Démo de code', duration: 600, Comp: DemoScene },
  { id: 'Acid-Outro', label: '7 · Outro / CTA', duration: 300, Comp: OutroScene },
] as const;

export const SCENES_INDEX = [
  { id: 'Index-Hook', label: '1 · Hook — 4,21 s', duration: 180, Comp: IndexHook },
  { id: 'Index-Vue1-Scan', label: '2 · Vue 1 — le scan complet', duration: 540, Comp: IndexVue1Scan },
  { id: 'Index-Vue2-Index', label: '3 · Vue 2 — l’annuaire trié', duration: 540, Comp: IndexVue2Index },
  { id: 'Index-Vue3-Cout', label: '4 · Vue 3 — le prix de l’index', duration: 540, Comp: IndexVue3Cout },
  { id: 'Index-Vue4-Pieges', label: '5 · Vue 4 — les 4 pièges', duration: 900, Comp: IndexVue4Pieges },
  { id: 'Index-Demo', label: '6 · Démo — CREATE INDEX', duration: 600, Comp: IndexDemo },
  { id: 'Index-Outro', label: '7 · Outro / CTA', duration: 300, Comp: IndexOutro },
] as const;

export const SCENES_CACHE = [
  { id: 'Cache-Hook', label: '1 · Hook — 4,12 s', duration: 180, Comp: CacheHook },
  { id: 'Cache-Vue1-Voyage', label: '2 · Vue 1 — le voyage', duration: 540, Comp: CacheVue1Voyage },
  { id: 'Cache-Vue2-Cache', label: '3 · Vue 2 — le cache', duration: 540, Comp: CacheVue2Cache },
  { id: 'Cache-Vue3-CDN', label: '4 · Vue 3 — le CDN', duration: 540, Comp: CacheVue3CDN },
  { id: 'Cache-Vue4-Pieges', label: '5 · Vue 4 — les 4 pièges', duration: 900, Comp: CacheVue4Pieges },
  { id: 'Cache-Demo', label: '6 · Démo — Cache-Control', duration: 600, Comp: CacheDemo },
  { id: 'Cache-Outro', label: '7 · Outro / CTA', duration: 300, Comp: CacheOutro },
] as const;

const total = (scenes: readonly { duration: number }[]) => scenes.reduce((a, s) => a + s.duration, 0);

const Film: React.FC<{ scenes: readonly { id: string; duration: number; Comp: React.FC }[] }> = ({ scenes }) => (
  <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
    {/* nappe de fond −30 dB (STANDARD §5) */}
    <Ambience />
    {/* Voix off : déposer public/audio/vo-acid.mp3 (ou vo-index.mp3) puis décommenter
    <Audio src={staticFile('audio/vo-acid.mp3')} volume={0.9} />
    */}
    <Series>
      {scenes.map(({ id, duration, Comp }) => (
        <Series.Sequence key={id} durationInFrames={duration} name={id}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const AcidTransactions: React.FC = () => <Film scenes={SCENES_ACID} />;
export const IndexQuery: React.FC = () => <Film scenes={SCENES_INDEX} />;
export const CacheCdn: React.FC = () => <Film scenes={SCENES_CACHE} />;

/** Catalogue : utilisé par l'aperçu live et par le README. */
export const VIDEOS = [
  {
    key: 'acid',
    title: 'ACID · transactions bancaires',
    compositionId: 'ACID-transactions-60s',
    Component: AcidTransactions,
    scenes: SCENES_ACID,
  },
  {
    key: 'index',
    title: 'Les index · requête lente',
    compositionId: 'INDEX-requete-lente-60s',
    Component: IndexQuery,
    scenes: SCENES_INDEX,
  },
  {
    key: 'cache',
    title: 'Le cache & les CDN · 4,12 s de trop',
    compositionId: 'CACHE-CDN-60s',
    Component: CacheCdn,
    scenes: SCENES_CACHE,
  },
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition
        key={v.compositionId}
        id={v.compositionId}
        component={v.Component}
        durationInFrames={total(v.scenes)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}

    {/* une composition par scène : revue et itération rapides dans Remotion Studio */}
    {[...SCENES_ACID, ...SCENES_INDEX, ...SCENES_CACHE].map(({ id, duration, Comp }) => (
      <Composition
        key={id}
        id={id}
        component={Comp as unknown as React.FC}
        durationInFrames={duration}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
