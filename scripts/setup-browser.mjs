/**
 * Navigateur de rendu — conteneurs sans root ni apt.
 *
 *   node scripts/setup-browser.mjs      (ou `npm run browser:setup`)
 *
 * Pourquoi ce script : Remotion a besoin de Chrome/Chromium pour exporter. Dans un
 * conteneur sans root, `remotion browser ensure` échoue (il télécharge chez
 * remotion.media, souvent inaccessible) et Chromium ne démarre pas car
 * libnss3 / libnssutil3 / libnspr4 sont absentes.
 *
 * Ce script :
 *   1. extrait un Chromium packagé via npm (`@sparticuz/chromium`, aucune root requise) ;
 *   2. compile trois bibliothèques de compatibilité NSS/NSPR minimales (les sources
 *      sont dans scripts/chrome-stubs) — le rendu local ne fait aucun TLS, des stubs
 *      suffisent ;
 *   3. écrit un wrapper `tools/browser/chrome-wrapper.sh` avec les drapeaux
 *      compatibles conteneur (--no-zygote --in-process-gpu …).
 *
 * Sur une machine normale, ce script n'est pas nécessaire : `npm run render` trouve
 * votre Chrome (ou le télécharge) tout seul.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'tools', 'browser');
const WRAPPER = join(DIR, 'chrome-wrapper.sh');

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });

if (existsSync(WRAPPER)) {
  console.log(`✓ Navigateur déjà prêt : ${WRAPPER}`);
  process.exit(0);
}

mkdirSync(DIR, { recursive: true });

/* 1. Chromium packagé ------------------------------------------------ */
console.log('1/3 · extraction de Chromium (@sparticuz/chromium)…');
let binary;
try {
  const mod = await import('@sparticuz/chromium');
  const chromium = mod.default ?? mod;
  binary = await chromium.executablePath();
} catch (err) {
  console.error(
    `\n✕ @sparticuz/chromium indisponible (${err.message}).\n` +
      '  Sur une machine normale : lancez simplement `npm run render`,\n' +
      '  Remotion téléchargera Chrome lui-même.',
  );
  process.exit(1);
}
console.log(`   binaire : ${binary}`);

/* 2. Bibliothèques de compatibilité NSS/NSPR ------------------------- */
console.log('2/3 · compilation des bibliothèques de compatibilité NSS/NSPR…');
const libDir = join(DIR, 'libs');
mkdirSync(libDir, { recursive: true });
const hasGcc = (() => {
  try {
    execFileSync('gcc', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

if (hasGcc) {
  const stubs = join(ROOT, 'scripts', 'chrome-stubs');
  run('gcc', ['-O2', '-fPIC', '-shared', '-o', join(libDir, 'libnss3.so'), join(stubs, 'nss-stub.c'), '-lpthread']);
  run('gcc', ['-O2', '-fPIC', '-shared', '-o', join(libDir, 'libnspr4.so'), join(stubs, 'nspr-stub.c'), '-lpthread']);
  // libnssutil3 expose les mêmes symboles que libnss3 dans nos stubs
  execFileSync('cp', [join(libDir, 'libnss3.so'), join(libDir, 'libnssutil3.so')]);
  console.log('   ✓ libnss3.so · libnssutil3.so · libnspr4.so');
} else {
  console.warn(
    '   ⚠ gcc absent : les stubs NSS ne peuvent pas être compilés.\n' +
      '     Installez gcc (ou libnss3 sur un système classique) avant de rendre.',
  );
}

/* 3. Wrapper -------------------------------------------------------- */
console.log('3/3 · écriture du wrapper Chromium…');
writeFileSync(
  WRAPPER,
  `#!/bin/bash
# Généré par scripts/setup-browser.mjs — Chromium pour conteneur sans root.
export LD_LIBRARY_PATH="${libDir}:\${LD_LIBRARY_PATH}"
exec "${binary}" \\
  --no-sandbox --no-zygote --in-process-gpu --disable-dev-shm-usage \\
  --disable-crash-reporter --disable-breakpad --no-first-run --no-default-browser-check \\
  --disable-background-networking --disable-domain-reliability --disable-sync \\
  "$@"
`,
  { mode: 0o755 },
);

console.log(`✓ Navigateur prêt : ${WRAPPER}`);
console.log(`
Pour exporter avec ce navigateur :

  npx remotion render src/index.ts ACID-transactions-60s out/acid-transactions.mp4 \\
    --browser-executable=${WRAPPER} --gl=swangle

(ou simplement \`npm run render\` : le script détecte le wrapper automatiquement)`);

rmSync(join(DIR, 'unused'), { force: true });
