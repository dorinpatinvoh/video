import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

/**
 * Sound design — STANDARD §5.
 *
 * Architecture : les SFX ne sont PAS montés individuellement dans les scènes
 * (ça multiplierait les balises <audio> et rendrait le mix instable). Le cue sheet
 * `audio/cues.json` est mixé en amont par `npm run sfx` en **un WAV par scène**,
 * et chaque scène ne monte qu'un seul <Audio>.
 *
 *   npm run sfx   →   public/audio/scene-hook.wav, scene-vue1.wav, …
 *
 * Le mixage reste donc : voix −6 dBFS · SFX −12 à −18 dB sous la voix.
 */
export type SceneId =
  | 'hook' | 'vue1' | 'vue2' | 'vue3' | 'vue4' | 'demo' | 'outro'
  | 'idx-hook' | 'idx-vue1' | 'idx-vue2' | 'idx-vue3' | 'idx-vue4' | 'idx-demo' | 'idx-outro'
  | 'cache-hook' | 'cache-vue1' | 'cache-vue2' | 'cache-vue3' | 'cache-vue4' | 'cache-demo' | 'cache-outro';

/** Piste SFX d'une scène (fichier mixé, volume nominal 1). */
export const SceneSfx: React.FC<{ scene: SceneId; volume?: number }> = ({ scene, volume = 1 }) => (
  <Sequence from={0} layout="none" name={`sfx:${scene}`}>
    <Audio src={staticFile(`audio/scene-${scene}.wav`)} volume={volume} />
  </Sequence>
);

/** Nappe de fond, jouée sur toute la vidéo (−30 dB, bouclée). */
export const Ambience: React.FC<{ volume?: number }> = ({ volume = 0.12 }) => (
  <Audio loop src={staticFile('audio/ambience.wav')} volume={volume} />
);

/** Mémo du mapping sonore (documentation exécutable, cf. STANDARD §5). */
export const SFX_LIBRARY = {
  pop: { file: 'pop.wav', volume: 0.42, usage: 'apparition de carte / badge' },
  click: { file: 'click.wav', volume: 0.5, usage: 'clic souris' },
  whoosh: { file: 'whoosh.wav', volume: 0.35, usage: 'transition de scène / caméra' },
  clack: { file: 'clack.wav', volume: 0.22, usage: 'frappe de code (1 sur 2-3 lettres)' },
  error: { file: 'error.wav', volume: 0.5, usage: 'échec, contrainte violée' },
  chime: { file: 'chime.wav', volume: 0.34, usage: 'validation, commit' },
  riser: { file: 'riser.wav', volume: 0.33, usage: 'révélation (coupée net sur l’image)' },
  glitch: { file: 'glitch.wav', volume: 0.4, usage: 'panne, corruption' },
  boot: { file: 'boot.wav', volume: 0.38, usage: 'redémarrage, rejeu du journal' },
} as const;

export type SfxName = keyof typeof SFX_LIBRARY;
