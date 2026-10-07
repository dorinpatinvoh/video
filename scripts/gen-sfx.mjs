/**
 * Générateur de sound design — STANDARD MOTION 2026 §5
 *
 *   npm run sfx
 *
 * 1. Synthétise les 9 SFX unitaires (public/audio/*.wav) + la nappe de fond.
 * 2. Mixe le cue sheet `audio/cues.json` en UN fichier par scène
 *    (public/audio/scene-<id>.wav) : un seul <Audio> par scène au montage.
 *
 * 100 % déterministe (seed fixe) : même code → mêmes fichiers → rendu reproductible.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 44100;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'audio');
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ utils */
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rnd = mulberry32(20261007);

const n = (sec) => Math.round(sec * SR);
const clamp = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));
const env = (i, totalSec, atk = 0.005, decay = 1) => {
  const t = i / SR;
  return Math.min(1, t / atk) * Math.exp((-t / totalSec) * 3 * decay);
};
const lowpass = (buf, cutoffs) => {
  let y = 0;
  return buf.map((x, i) => {
    const fc = cutoffs[Math.min(cutoffs.length - 1, Math.floor((i / buf.length) * cutoffs.length))];
    const a = Math.exp((-2 * Math.PI * fc) / SR);
    y = (1 - a) * x + a * y;
    return y;
  });
};
const sine = (i, f) => Math.sin((2 * Math.PI * f * i) / SR);
const noise = () => rnd() * 2 - 1;

/** encode un Float32Array en WAV mono 16 bits */
const encodeWav = (samples, gain = 0.9) => {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    data.writeInt16LE(Math.round(clamp(samples[i] * gain) * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

/** SFX unitaires : nom → échantillons bruts (crête ≈ 1) */
const RAW = {};
const write = (name, samples, gain = 0.9) => {
  RAW[name.replace('.wav', '')] = Float32Array.from(samples);
  writeFileSync(join(OUT, name), encodeWav(samples, gain));
  console.log(`  ✓ ${name}  (${(samples.length / SR).toFixed(2)} s)`);
};

/* --------------------------------------------------------------- les sons */
console.log('Sound design → public/audio');

write('pop.wav', Array.from({ length: n(0.07) }, (_, i) => sine(i, 700 + ((i / SR) * 900) / 0.07) * env(i, 0.07, 0.002, 1.6)), 0.75);

write('click.wav', Array.from({ length: n(0.02) }, (_, i) => (noise() * 0.5 + sine(i, 2400) * 0.5) * Math.exp(-i / SR / 0.004)), 0.9);

{
  const raw = Array.from({ length: n(0.34) }, () => noise());
  const filtered = lowpass(raw, [200, 600, 1200, 2400, 3200, 1800, 700, 300]);
  write('whoosh.wav', filtered.map((s, i) => s * Math.sin((Math.PI * i) / filtered.length) ** 1.4), 0.55);
}

write('clack.wav', Array.from({ length: n(0.012) }, (_, i) => (noise() * 0.35 + sine(i, 1750) * 0.5 + sine(i, 320) * 0.3) * Math.exp(-i / SR / 0.003)), 0.7);

{
  const seg = (from, to, dur) =>
    Array.from({ length: n(dur) }, (_, i) => {
      const f = from + ((to - from) * i) / n(dur);
      return (sine(i, f) * 0.7 + sine(i, f * 3) * 0.15) * Math.sin((Math.PI * i) / n(dur)) ** 0.7;
    });
  write('error.wav', [...seg(440, 415, 0.16), ...seg(330, 312, 0.2)], 0.55);
}

{
  const buf = new Array(n(0.65)).fill(0);
  const add = (f, at, dur, amp) => Array.from({ length: n(dur) }, (_, i) => sine(at * SR + i, f) * env(i, dur, 0.004, 1.1) * amp);
  add(880, 0, 0.3, 0.6).forEach((s, i) => (buf[i] += s));
  add(1318.5, 0.1, 0.42, 0.55).forEach((s, i) => (buf[n(0.1) + i] += s));
  buf.forEach((_, i) => (buf[i] += buf[i] * 0.25 * Math.exp(-i / (0.2 * SR))));
  write('chime.wav', buf, 0.5);
}

write(
  'riser.wav',
  (() => {
    const swept = lowpass(Array.from({ length: n(0.7) }, () => noise()), [200, 400, 800, 1600, 3000, 5000, 8000]);
    return swept.map((s, i) => {
      const t = i / SR;
      return (s * 0.5 + sine(i, 220 * Math.pow(2, (t / 0.7) * 3)) * 0.5) * Math.pow(t / 0.7, 1.3);
    });
  })(),
  0.5,
);

{
  const buf = new Array(n(0.22)).fill(0);
  [0, 0.07, 0.15].forEach((at, k) => {
    const len = n(0.03 + k * 0.01);
    for (let i = 0; i < len; i++) {
      buf[n(at) + i] += (noise() * 0.6 + sine(i, 300 + k * 400) * 0.4) * Math.exp(-i / SR / 0.008);
    }
  });
  write('glitch.wav', buf, 0.7);
}

{
  const buf = new Array(n(0.45)).fill(0);
  for (let i = 0; i < buf.length; i++) {
    const t = i / SR;
    buf[i] = sine(i, 110) * Math.exp(-t / 0.18) * 0.6 + sine(i, 300 + t * 800) * Math.pow(t / 0.45, 2) * 0.4;
  }
  write('boot.wav', buf, 0.5);
}

write(
  'ambience.wav',
  Array.from({ length: n(8) }, (_, i) => {
    const t = i / SR;
    const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.11 * t);
    return (sine(i, 55) * 0.5 + sine(i, 82.5) * 0.3 + sine(i, 110) * 0.2) * lfo;
  }),
  0.16,
);

/* ------------------------------------------- mixage du cue sheet par scène */
const cues = JSON.parse(readFileSync(join(ROOT, 'audio', 'cues.json'), 'utf8'));
const FPS = 60;
const frameToSample = (f) => Math.round((f / FPS) * SR);

console.log('\nMixage du cue sheet → un fichier par scène');

for (const [sceneId, spec] of Object.entries(cues.scenes)) {
  const total = frameToSample(spec.durationInFrames) + SR; // +1 s de marge
  const buf = new Float32Array(total);

  const place = (name, atFrame, gain) => {
    const src = RAW[name];
    if (!src) throw new Error(`SFX inconnu dans cues.json : ${name}`);
    const off = frameToSample(atFrame);
    for (let i = 0; i < src.length && off + i < total; i++) buf[off + i] += src[i] * gain;
  };

  for (const cue of spec.cues) {
    const base = (cues.volumes[cue.name] ?? 0.4) * (cue.volume ?? 1);
    if (cue.repeat) {
      // frappe de code : 1 clack toutes les 2-3 lettres, espacement régulier
      const { to, count } = cue.repeat;
      const step = (to - cue.at) / count;
      for (let k = 0; k < count; k++) place(cue.name, cue.at + k * step, base);
    } else {
      place(cue.name, cue.at, base);
    }
  }

  // protection de crête (limiteur doux)
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const norm = peak > 0.98 ? 0.98 / peak : 1;
  if (norm < 1) for (let i = 0; i < buf.length; i++) buf[i] *= norm;

  writeFileSync(join(OUT, `scene-${sceneId}.wav`), encodeWav(buf, 0.9));
  console.log(
    `  ✓ scene-${sceneId}.wav  (${(spec.durationInFrames / FPS).toFixed(1)} s · ${spec.cues.length} cues${peak > 0.98 ? ' · limité' : ''})`,
  );
}

console.log('\nTerminé.');
