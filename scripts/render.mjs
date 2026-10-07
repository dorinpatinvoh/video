/**
 * Export MP4 — `npm run render -- [composition] [sortie]`
 *
 * Deux cas :
 *  • machine normale : Remotion trouve/télécharge Chrome → rien à faire ;
 *  • conteneur sans root : on utilise le navigateur préparé par
 *    `node scripts/setup-browser.mjs` (tools/browser/chrome-wrapper.sh).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRAPPER = join(ROOT, 'tools', 'browser', 'chrome-wrapper.sh');

const [composition = 'ACID-transactions-60s', output = `out/${composition}.mp4`] =
  process.argv.slice(2);

const hasWrapper = existsSync(WRAPPER);
if (!hasWrapper) {
  console.log(
    'ℹ Aucun navigateur conteneur détecté — Remotion va utiliser (ou télécharger) Chrome.\n' +
      '  Si vous êtes dans un conteneur sans root : `npm run browser:setup` d’abord.\n',
  );
}

const args = [
  'remotion',
  'render',
  'src/index.ts',
  composition,
  output,
  ...(hasWrapper ? ['--browser-executable=' + WRAPPER, '--gl=swangle'] : []),
];

console.log(`▶ Export : ${composition} → ${output}`);
const res = spawnSync('npx', args, { cwd: ROOT, stdio: 'inherit' });

if (res.status !== 0 && !hasWrapper) {
  console.error(`
✕ L'export a échoué. Si vous êtes dans un conteneur sans root ni Chrome :

    npm run browser:setup
    npm run render -- ${composition} ${output}
`);
}
process.exit(res.status ?? 1);
