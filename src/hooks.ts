/**
 * Hooks & utilitaires de motion — STANDARD MOTION 2026
 */
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE } from './tokens';

/** secondes → frames (au fps courant) */
export const useSec = () => {
  const { fps } = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

export const sec = (s: number, fps = 60) => Math.round(s * fps);

/** interpolate clampé des deux côtés (usage : 90 % des cas) */
export const ip = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (v: number) => number = EASE.outExpo,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** entrée UI standard : translateY 24 → 0 + scale .98 → 1 (DUR.ui = 280 ms) */
export const useEnter = (at: number, durFrames = 17) => {
  const frame = useCurrentFrame();
  const p = ip(frame, [at, at + durFrames], [0, 1], EASE.outExpo);
  return { progress: p, opacity: p, translateY: (1 - p) * 24, scale: 0.98 + p * 0.02 };
};

/**
 * Typewriter déterministe.
 * @param text       texte complet
 * @param start      frame de départ
 * @param cps        caractères par seconde (24 par défaut → 60/24 ≈ 2.5 frames/car.)
 */
export const useTypewriter = (text: string, start: number, cps = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPerChar = fps / cps;
  const elapsed = Math.max(0, frame - start);
  const chars = elapsed <= 0 ? 0 : Math.min(text.length, Math.ceil(elapsed / framesPerChar));
  const done = chars >= text.length;
  const caretVisible = !done && Math.floor(elapsed / 30) % 2 === 0; // clignote 1 s (step-end)
  return { visible: text.slice(0, chars), done, caretVisible, progress: chars / text.length };
};

/** shake 3 px décroissant (erreurs) — 3 oscillations en ~360 ms */
export const useShake = (at: number, amplitude = 3) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 22) return { x: 0, active: false };
  const decay = 1 - t / 22;
  return { x: Math.sin(t * 1.9) * amplitude * decay, active: true };
};

/** pulse doux et infini (badge Pending) — période 1,4 s */
export const usePulse = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return 0;
  const t = ((frame - at) / fps) * (1 / 1.4);
  return 0.5 - 0.5 * Math.cos(t * Math.PI * 2); // 0 → 1 → 0
};

/** pop d'apparition (badge, coche) : scale 0.9 → 1 avec léger dépassement */
export const usePop = (at: number, durFrames = 14) => {
  const frame = useCurrentFrame();
  return ip(frame, [at, at + durFrames], [0, 1], EASE.outBack);
};

/** variation déterministe [−a, +a] basée sur la frame (pour les clacks clavier) */
export const jitter = (seed: string | number, amplitude = 0.08) =>
  (random(`j-${seed}`) * 2 - 1) * amplitude;

/** nombre qui « roule » de a → b (compteurs de solde) */
export const useRoll = (from: number, to: number, at: number, durFrames = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + durFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.outExpo,
  });
};

/** montant formaté à la française : 150,00 € */
export const eur = (v: number) => `${v.toFixed(2).replace('.', ',')} €`;

/** opacité décroissante après un événement (pour faire disparaître un élément animé) */
export const useFadeAfter = (at: number, hold = 20, dur = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at + hold, at + hold + dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
