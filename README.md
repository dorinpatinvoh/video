# video — moteur de vidéos tech 9:16 (Standard Motion Design 2026)

Chaîne YouTube Shorts/TikTok/Reels sur la programmation. Ce dépôt contient le **standard visuel**,
les **storyboards** et le **moteur de scènes animées** qui produit les vidéos en 1080×1920 @60 fps.

```
Concept  →  Storyboard (motion-design-2026/)  →  Scènes Remotion (src/)  →  MP4 9:16
```

## 🚀 Démarrage

```bash
npm install
npm run sfx            # synthétise le sound design (public/audio) + 1 mix par scène
npm run preview:live   # aperçu live dans le navigateur → http://localhost:5173
npm run studio         # Remotion Studio (timeline, revue scène par scène)
npm run render         # export MP4 : ACID par défaut → out/ACID-transactions-60s.mp4
npm run check          # typecheck + test de fumée (toutes les scènes, toutes les frames clés)
```

Sur une machine normale, `npm run render` utilise votre Chrome (ou le télécharge au premier lancement).

**Conteneur sans root ni Chrome ?** Un script prépare un navigateur de rendu complet
(Chromium packagé + bibliothèques de compatibilité compilées, sans `apt`) :

```bash
npm run browser:setup
npm run render -- Index-Vue2-Index out/index-vue2.mp4
```

Exemple vérifié dans cet environnement :

```
▶ Export : Acid-Hook → out/hook.mp4
Rendered 180/180 · Encoded 180/180
+ out/hook.mp4  815.4 kB      # 1080×1920 @60 fps, audio inclus
```

## 🎬 Les vidéos en production

Trois films complets (60 s, 9:16, 3600 frames chacun) branchés sur le même moteur :

| Vidéo | Composition | Storyboard |
|-------|-------------|------------|
| **ACID · transactions bancaires** | `ACID-transactions-60s` | `motion-design-2026/storyboards/05-ACID-transactions.md` |
| **Les index · requête lente** | `INDEX-requete-lente-60s` | `motion-design-2026/storyboards/22-index-requete-lente.md` |
| **Le cache & les CDN** | `CACHE-CDN-60s` | `motion-design-2026/storyboards/B3-cache-cdn.md` |

### Le cache & les CDN — détail des scènes

| # | Scène | Fichier | Durée |
|---|-------|---------|-------|
| 1 | Hook — 4,12 s, et ce n'est pas le code (CPU 4 %) | `src/scenes/cache/Hook.tsx` | 0–3 s |
| 2 | Vue 1 — le voyage : 5 837 km par requête | `src/scenes/cache/Vue1Voyage.tsx` | 3–12 s |
| 3 | Vue 2 — le cache : MISS 412 ms vs HIT 2 ms (×200) | `src/scenes/cache/Vue2Cache.tsx` | 12–21 s |
| 4 | Vue 3 — le CDN : 300 edges, TTFB 28 ms (÷15) | `src/scenes/cache/Vue3CDN.tsx` | 21–30 s |
| 5 | Vue 4 — les 4 pièges + les 3 en-têtes | `src/scenes/cache/Vue4Pieges.tsx` | 30–45 s |
| 6 | Démo — `Cache-Control` : 4,12 s → 0,31 s (÷13) | `src/scenes/cache/Demo.tsx` | 45–55 s |
| 7 | Outro / CTA | `src/scenes/cache/Outro.tsx` | 55–60 s |

Nouveaux composants réutilisables : `Waterfall` (chronogramme réseau type DevTools, colonne
d'étiquettes + piste), `CacheBox` (la mémoire qui répond à ta place), `WorldMap` (carte en points,
nœuds, routes et paquets animés).

### ACID — détail des scènes

| # | Scène | Fichier | Durée |
|---|-------|---------|-------|
| 1 | Hook visuel — l'argent qui s'évapore | `src/scenes/acid/Hook.tsx` | 0–3 s |
| 2 | Vue 1 — sans transaction : 50 € perdus | `src/scenes/acid/Vue1Probleme.tsx` | 3–12 s |
| 3 | Vue 2 — **A** · Atomicité (rollback) | `src/scenes/acid/Vue2Atomicite.tsx` | 12–21 s |
| 4 | Vue 3 — **C** · Cohérence (contrainte) | `src/scenes/acid/Vue3Coherence.tsx` | 21–30 s |
| 5 | Vue 4 — **I** · Isolation + **D** · Durabilité | `src/scenes/acid/Vue4IsolationDurabilite.tsx` | 30–45 s |
| 6 | Démo de code — le pattern `db.transaction` | `src/scenes/acid/Demo.tsx` | 45–55 s |
| 7 | Outro / CTA | `src/scenes/acid/Outro.tsx` | 55–60 s |

📄 Storyboard détaillé seconde par seconde : [`motion-design-2026/storyboards/05-ACID-transactions.md`](motion-design-2026/storyboards/05-ACID-transactions.md)
🎙️ Texte de la voix off, timecodé : [`motion-design-2026/storyboards/05-ACID-transactions.vo.txt`](motion-design-2026/storyboards/05-ACID-transactions.vo.txt)

### Les index — détail des scènes

| # | Scène | Fichier | Durée |
|---|-------|---------|-------|
| 1 | Hook — 4,21 s pour trouver 1 client | `src/scenes/indexdb/Hook.tsx` | 0–3 s |
| 2 | Vue 1 — le scan complet (1 048 576 lignes) | `src/scenes/indexdb/Vue1Scan.tsx` | 3–12 s |
| 3 | Vue 2 — l'annuaire trié (dichotomie, 20 étapes) | `src/scenes/indexdb/Vue2Index.tsx` | 12–21 s |
| 4 | Vue 3 — le prix de l'index (écriture ×4) | `src/scenes/indexdb/Vue3Cout.tsx` | 21–30 s |
| 5 | Vue 4 — les 4 pièges qui annulent un index | `src/scenes/indexdb/Vue4Pieges.tsx` | 30–45 s |
| 6 | Démo — `CREATE INDEX` + EXPLAIN (4 210 ms → 0,42 ms) | `src/scenes/indexdb/Demo.tsx` | 45–55 s |
| 7 | Outro / CTA | `src/scenes/indexdb/Outro.tsx` | 55–60 s |

Export d'une seule scène (itération rapide) :

```bash
npx remotion render src/index.ts Index-Vue2-Index out/index-vue2.mp4
```

## 🧱 Architecture

```
motion-design-2026/          Standard 2026 + storyboards (la référence, à ne pas contourner)
audio/cues.json              Cue sheet du sound design (par scène, en frames)
public/audio/                SFX générés + mix par scène (npm run sfx)
src/tokens.ts                Design tokens : couleurs, typos, durées, easings, safe zones
src/hooks.ts                 Primitives de motion : typewriter, shake, pop, roll, entrées UI
src/components/              Bibliothèque de composants animés réutilisables
  Stage · Camera · Cursor · GlassCard · BrowserFrame · CodeEditor · Terminal
  DataTable · StatusCodeBadge · Annotation · Caption · SceneHeader · Sfx · VoiceOver
  ScanStream (parcours séquentiel) · SortedLookup (dichotomie) · CompareBars
src/scenes/acid/             Les 7 scènes de la vidéo ACID
src/scenes/indexdb/          Les 7 scènes de la vidéo « Les index »
src/remotion/Root.tsx        Catalogue VIDEOS → compositions (film complet + une par scène)
preview/main.tsx             Aperçu web live (@remotion/player)
scripts/gen-sfx.mjs          Synthèse + mixage du sound design
scripts/smoke.mjs            Test de fumée : scrube toutes les scènes dans jsdom
```

## 🎨 Le standard (résumé)

Tout est spécifié dans **[`motion-design-2026/STANDARD-MOTION-2026.md`](motion-design-2026/STANDARD-MOTION-2026.md)**.
L'essentiel :

- **Dark mode** `#0B0F19`, accents indigo/cyan/emerald, glassmorphism subtil, 1 accent dominant par scène.
- **Jamais d'écran statique** : cut, zoom, pan ou apparition toutes les **1,5–2,5 s**.
- **Caméra** : zoom 1 → 1,12/1,28, pan ≤ 220 px avec parallaxe, **jamais zoom + pan simultanés**, rotateZ ≤ 0,6°.
- **Curseur réaliste** qui survole, clique (ripple) et vise avant d'agir.
- **Code** en machine à écrire 24 car/s, ligne clé focalisée (le reste à 35 % + flou 0,5 px).
- **Safe zones** : action utile entre 25 % et 72 % de la hauteur, captions à 78 %, 120 px libres à droite.
- **Sound design** : 1 SFX par action visuelle, voix prioritaire, mix par scène (voir `audio/cues.json`).
- **Perf** : uniquement `transform`/`opacity`, `backdrop-blur` ≤ 3 surfaces, `prefers-reduced-motion` géré.

## 🔍 QA visuelle (le réflexe « Motion Design Pro »)

Le moteur sait produire des **images d'inspection** frame par frame — c'est ce qui a permis de
corriger les vrais défauts (zoom qui coupait l'UI, compteurs de monnaie illisibles, captions sur
3 lignes, emojis non rendus, badges qui écrasaient les titres) :

```bash
npx remotion still src/index.ts Acid-Hook out/frames/hook.png --frame=148 \
  --browser-executable=tools/browser/chrome-wrapper.sh --gl=swangle
```

Planches de contrôle livrées : `motion-design-2026/qa/acid-contact-sheet.png`,
`index-contact-sheet.png`, `cache-contact-sheet.png` (+ `cache-demo-sheet.png`). Les règles apprises sont consignées dans le
[STANDARD §9](motion-design-2026/STANDARD-MOTION-2026.md) — elles s'appliquent aux prochains concepts.

## 🎧 Sound design

Les SFX sont **synthétisés** (aucune banque de sons externe, aucun asset sous licence) :

```bash
npm run sfx   # 9 SFX unitaires + ambience + 1 fichier mixé par scène
```

`audio/cues.json` décrit quand chaque son tombe (en frames). Le mix par scène évite d'empiler des
dizaines de balises `<audio>` et rend le rendu déterministe. Pour changer un son : éditer
`cues.json` (ou les réglages dans `scripts/gen-sfx.mjs`) puis relancer `npm run sfx`.

## 🎙️ Voix off

La narration est découpée **un clip par scène** (`public/audio/vo-<video>-<scene>.wav`) et calée
automatiquement : `npm run vo:fit` mesure chaque clip et écrit `audio/vo-rates.json`, que
`<SceneVo clip="acid-vue4" />` applique comme `playbackRate`. Résultat : chaque chunk remplit
exactement sa scène, sans découpe manuelle.

```bash
npm run vo:fit     # après avoir déposé les clips vo-*.wav
```

Scripts de tournage (débit, intentions, budget de mots) :
`motion-design-2026/storyboards/05-ACID-transactions.vo.txt`, `22-index-requete-lente.vo.txt` et
`B3-cache-cdn.vo.txt`.

## ✍️ Polices (optionnel)

L'aperçu et l'export fonctionnent avec les polices système. Pour un rendu **exactement** conforme au
standard (Inter + JetBrains Mono), voir [`public/fonts/README.md`](public/fonts/README.md).

## ✅ Vérifications

```bash
npm run check
```

- `tsc --noEmit` : typage strict de tous les composants.
- `scripts/smoke.mjs` : monte le Player dans **jsdom** et scrute **toutes** les compositions
  (y compris la vidéo complète de 3600 frames) en échouant sur la moindre exception JS/React.

## 📌 Statut

| Élément | État |
|---|---|
| Moteur de scènes 9:16 (Remotion) | ✅ 21 scènes, 3 films complets de 3600 frames |
| Standard Motion 2026 | ✅ + retours du premier rendu réel (§9) |
| Sound design | ✅ 9 SFX synthétisés + 1 mix par scène (21 fichiers) |
| Voix off | ✅ 21 chunks générés et calés automatiquement (aucune vitesse dénaturée) |
| Export MP4 | ✅ pipeline vérifié (navigateur conteneur fourni) |
| QA visuelle | ✅ planches contact des 21 scènes |
| Vidéo 3 — « Le cache & les CDN » | ✅ storyboard v2, 7 scènes, VO, SFX, QA |

## 🗺️ Suite

1. Écoute la voix off et arbitre le texte (`motion-design-2026/storyboards/*.vo.txt`).
2. `npm run render` sur ta machine → publier ACID, Les index, puis Le cache & les CDN (l'ordre est
   libre : l'outro des index annonce « le cache », celui du cache annonce « le trajet d'une URL »).
3. Décliner 2–3 shorts par vidéo depuis la même matière (reprendre une scène = une compo).
4. Concept suivant : **le trajet d'une URL** (teaser posé à la fin de la vidéo 3).

## 📚 Le catalogue d'idées

50 concepts prêts à produire : [`50-concepts-youtube.md`](50-concepts-youtube.md)
