/**
 * Test de fumée — vérifie qu'aucune scène ne plante à l'exécution.
 *
 * Le sandbox n'a pas de Chrome (render headless impossible), alors on monte le
 * Player @remotion/player dans jsdom et on scroute toutes les compositions
 * frame par frame : toute exception React ou JS fait échouer le test.
 *
 *   node scripts/smoke.mjs
 */
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const tmp = mkdtempSync(join(tmpdir(), 'motion-smoke-'));
const outfile = join(tmp, 'bundle.js');

console.log('1/3 · bundling preview (esbuild)…');
await build({
  entryPoints: ['preview/main.tsx'],
  bundle: true,
  format: 'iife',
  outfile,
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  define: { 'process.env.NODE_ENV': '"development"' },
  platform: 'browser',
  target: 'es2020',
  logLevel: 'warning',
});

const code = readFileSync(outfile, 'utf8');

console.log('2/3 · montage dans jsdom…');
const dom = new JSDOM(
  `<!doctype html><html><body><div id="root"></div></body></html>`,
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' },
);
const { window } = dom;

/* --- polyfills minimaux (jsdom n'implémente ni le média ni les observers) --- */
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = RO;
window.IntersectionObserver = RO;
window.matchMedia =
  window.matchMedia ||
  (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.load = () => {};
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

const errors = [];
window.addEventListener('error', (e) => errors.push(`window.error: ${e.message}`));
window.addEventListener('unhandledrejection', (e) => errors.push(`unhandled: ${e.reason}`));
const origError = window.console.error;
window.console.error = (...args) => {
  const msg = args
    .map((a) => (a && a.stack ? a.stack : typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ');
  if (!/Not implemented|not implemented/i.test(msg)) errors.push(`console.error: ${msg}`);
  origError(...args);
};

window.eval(code);

// React 19 planifie le premier rendu : on attend que l'API soit exposée.
let api = window.__motion;
for (let i = 0; i < 60 && !api; i++) {
  await tick(50);
  api = window.__motion;
}
if (!api) {
  console.error('✕ Le Player ne s\'est pas monté (__motion absent). Erreurs captées :');
  for (const e of errors.slice(0, 8)) console.error('  - ' + e.slice(0, 1200));
  const root = window.document.getElementById('root');
  console.error('  root.innerHTML:', (root?.innerHTML ?? '').slice(0, 400));
  process.exit(1);
}
console.log(`   ✓ Player monté — ${api.decks.length} compositions détectées`);

console.log('3/3 · scrubbing de toutes les compositions…');
let framesTested = 0;
for (const deck of api.decks) {
  for (let f = 0; f < deck.duration; f += Math.max(1, Math.floor(deck.duration / 40))) {
    api.seekTo(f);
    framesTested++;
    await tick(12);
  }
  api.seekTo(deck.duration - 1);
  await tick(20);
  process.stdout.write(`   · ${deck.id} — ${deck.duration} frames ✓\n`);
}

rmSync(tmp, { recursive: true, force: true });

if (errors.length) {
  console.error(`\n✕ ${errors.length} erreur(s) détectée(s) sur ${framesTested} frames :\n`);
  const seen = new Set();
  for (const e of errors) {
    const key = e.slice(0, 120);
    if (seen.has(key)) continue;
    seen.add(key);
    console.error('  - ' + e.slice(0, 600) + '\n');
  }
  process.exit(1);
}
console.log(`\n✓ Aucune erreur sur ${framesTested} frames parcourues.`);

function tick(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
