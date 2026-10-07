import React from 'react';
import { Audio, staticFile } from 'remotion';
import rates from '../../audio/vo-rates.json';

/**
 * Voix off — un clip par scène, calé automatiquement.
 *
 * Pourquoi des chunks par scène : la narration reste parfaitement synchrone sans
 * découper à la main. `scripts/vo-fit.mjs` mesure la durée réelle de chaque clip
 * WAV et écrit `audio/vo-rates.json` : chaque chunk est alors lu à la vitesse
 * (playbackRate) qui le fait tenir exactement dans sa scène.
 *
 * Fichiers attendus : public/audio/vo-<video>-<scene>.wav
 *   ex. vo-acid-hook.wav · vo-index-vue4.wav
 */
const RATES = rates as Record<string, number>;

export const SceneVo: React.FC<{
  clip: string;
  volume?: number;
}> = ({ clip, volume = 0.95 }) => (
  <Audio
    src={staticFile(`audio/vo-${clip}.wav`)}
    volume={volume}
    playbackRate={RATES[clip] ?? 1}
  />
);
