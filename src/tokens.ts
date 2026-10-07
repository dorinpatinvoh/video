/**
 * STANDARD MOTION 2026 — design tokens partagés
 * Source de vérité unique : motion-design-2026/STANDARD-MOTION-2026.md §1 & §2
 * Utilisé par le rendu Remotion (et exportable vers une page web live).
 */
import { Easing } from 'remotion';

/* ------------------------------------------------------------------ format */
export const W = 1080; // 9:16
export const H = 1920;
export const FPS = 60;

/* ----------------------------------------------------------------- couleurs */
export const C = {
  bgBase: '#0B0F19',
  bgAlt: '#0D1117',
  bgElevated: '#111827',
  glass: 'rgba(255,255,255,0.045)',
  glassStrong: 'rgba(255,255,255,0.07)',
  borderGlass: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.16)',

  indigo400: '#818CF8',
  indigo500: '#6366F1',
  cyan400: '#22D3EE',
  cyan500: '#06B6D4',
  emerald400: '#34D399',
  emerald500: '#10B981',
  amber400: '#FBBF24',
  rose400: '#FB7185',
  rose500: '#F43F5E',

  textPrimary: '#E6EDF3',
  textSecondary: '#9BA7B4',
  textMuted: '#6B7A8D',
  textCode: '#C9D1D9',

  // syntax highlighting « néon doux »
  kw: '#C792EA',
  fn: '#82AAFF',
  str: '#C3E88D',
  num: '#F78C6C',
  type: '#FFCB6B',
  com: '#5F7E97',
  punc: '#89DDFF',
} as const;

export const GLOW = {
  indigo: '0 0 60px rgba(99,102,241,0.35)',
  cyan: '0 0 60px rgba(34,211,238,0.30)',
  emerald: '0 0 60px rgba(52,211,153,0.32)',
  rose: '0 0 60px rgba(244,63,94,0.35)',
  amber: '0 0 60px rgba(251,191,36,0.30)',
  card: '0 24px 60px -20px rgba(0,0,0,0.75)',
  float: '0 40px 120px -30px rgba(0,0,0,0.9)',
} as const;

export const FONT = {
  ui: "'Inter', 'Geist', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, 'SFMono-Regular', Menlo, monospace",
} as const;

/* ------------------------------------------------------- durées (en secondes) */
export const DUR = {
  instant: 0.12,
  micro: 0.18,
  ui: 0.28,
  scene: 0.52,
  camera: 0.78,
  codeLine: 0.42,
} as const;

/* ------------------------------------------------------------- easings */
export const EASE = {
  /** entrées UI : départ rapide, arrivée feutrée */
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  /** caméra & transitions */
  inoutSoft: Easing.bezier(0.65, 0, 0.35, 1),
  /** ludique (badges, clic curseur) */
  outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: Easing.linear,
} as const;

/* ------------------------------------------- safe zones (proportions du cadre) */
export const SAFE = {
  topMargin: 140, // px — zone UI YouTube/Insta à éviter
  bottomMargin: 360, // px — captions + UI app
  sideMargin: 120,
  rightSafe: 120,
  focusTop: 0.25, // 25 % → début zone focale
  focusBottom: 0.72, // 72 % → fin zone focale
  captionTop: 0.78, // ancrage des captions
  contentWidth: W - 240, // 840 px
} as const;

/* ------------------------------------------------------------------ layout */
/** marge latérale du contenu (gauche = droite) */
export const SIDE = SAFE.sideMargin;
/** largeur utile du contenu */
export const CONTENT = SAFE.contentWidth;
