/**
 * Calage automatique de la voix off.
 *
 *   node scripts/vo-fit.mjs
 *
 * Mesure la durée réelle de chaque clip `public/audio/vo-<clip>.wav` et écrit
 * `audio/vo-rates.json` : la vitesse de lecture (playbackRate) qui fait tenir
 * chaque chunk exactement dans sa scène. La synchro ne dépend donc pas de la
 * précision du comédien ou du TTS.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO = join(ROOT, 'public', 'audio');
const FPS = 60;

/** durées de scène (frames) — identiques pour les deux vidéos */
const SCENES = {
  hook: 180,
  vue1: 540,
  vue2: 540,
  vue3: 540,
  vue4: 900,
  demo: 600,
  outro: 300,
};

/** durée d'un WAV PCM 16 bits mono/stéréo, lue dans l'en-tête */
const wavDuration = (buf) => {
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bitsPerSample = buf.readUInt16LE(34);
  const byteRate = buf.readUInt32LE(28) || (sampleRate * channels * bitsPerSample) / 8;
  const dataSize = buf.readUInt32LE(40);
  return dataSize / byteRate;
};

const MIN = 0.8;
const MAX = 1.25;

const clips = readdirSync(AUDIO).filter((f) => /^vo-.*\.wav$/.test(f));
if (clips.length === 0) {
  console.log('Aucun clip vo-*.wav dans public/audio — rien à caler.');
  process.exit(0);
}

const rates = {};
const rows = [];

for (const file of clips.sort()) {
  const clip = file.replace(/^vo-/, '').replace(/\.wav$/, ''); // ex. acid-hook
  const scene = clip.split('-').pop(); // ex. hook
  const sceneFrames = SCENES[scene];
  if (!sceneFrames) {
    console.warn(`  ⚠ ${file} : scène « ${scene} » inconnue, ignoré`);
    continue;
  }
  const duration = wavDuration(readFileSync(join(AUDIO, file)));
  const sceneSeconds = sceneFrames / FPS;
  // marge de 2 % : on préfère laisser respirer la fin de scène
  const raw = duration / (sceneSeconds * 0.98);
  const rate = Math.min(MAX, Math.max(MIN, raw));
  const finalRate = Math.abs(rate - 1) < 0.02 ? 1 : Number(rate.toFixed(3));
  rates[clip] = finalRate;
  rows.push({
    clip,
    clipSec: duration.toFixed(2),
    sceneSec: sceneSeconds.toFixed(1),
    rate: finalRate,
    flag: raw > MAX ? '⚠ trop long (accéléré au max)' : raw < MIN ? '⚠ trop court (ralenti au max)' : '',
  });
}

writeFileSync(join(ROOT, 'audio', 'vo-rates.json'), JSON.stringify(rates, null, 2) + '\n');

console.log('Calage de la voix off → audio/vo-rates.json\n');
console.log('  clip                clip(s)   scène(s)   playbackRate');
for (const r of rows) {
  console.log(
    `  ${r.clip.padEnd(20)}${r.clipSec.padStart(6)}${r.sceneSec.padStart(10)}${String(r.rate).padStart(14)}   ${r.flag}`,
  );
}
console.log('\nTerminé.');
