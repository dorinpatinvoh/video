# video — moteur de vidéos tech 9:16 (Standard Motion Design 2026)

Chaîne YouTube Shorts/TikTok/Reels sur la programmation. Ce dépôt contient le **standard visuel**,
les **storyboards** et le **moteur de scènes animées** qui produit les vidéos en 1080×1920 @60 fps.

```
Concept  →  Storyboard (motion-design-2026/)  →  Scènes Remotion (src/)  →  MP4 9:16
```

## 🚀 Démarrage

```bash
npm install
npm run sfx          # synthétise le sound design (public/audio)
npm run preview:live # aperçu live dans le navigateur → http://localhost:5173
npm run studio       # Remotion Studio (timeline, revue scène par scène)
npm run render       # export MP4 final → out/acid-transactions.mp4
npm run check        # typecheck + test de fumée (toutes les scènes, toutes les frames clés)
```

> **Rendu vidéo** : nécessite Chrome/Chromium (Remotion le télécharge au premier `npm run render`).
> Le sandbox de dev n'a pas de navigateur : utilisez `preview:live` pour la revue, `render` sur votre machine.

## 🎬 Les vidéos en production

Deux films complets (60 s, 9:16, 3600 frames chacun) branchés sur le même moteur :

| Vidéo | Composition | Storyboard |
|-------|-------------|------------|
| **ACID · transactions bancaires** | `ACID-transactions-60s` | `motion-design-2026/storyboards/05-ACID-transactions.md` |
| **Les index · requête lente** | `INDEX-requete-lente-60s` | `motion-design-2026/storyboards/22-index-requete-lente.md` |

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
`motion-design-2026/storyboards/05-ACID-transactions.vo.txt` et `22-index-requete-lente.vo.txt`.

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

## 🗺️ Suite

1. Enregistrer / générer la voix off de chaque scène puis `npm run vo:fit` (calage automatique).
2. `npm run render` → publier, puis décliner 2–3 shorts depuis la même matière.
3. Concept suivant : **le cache / les CDN** (concept bonus B3) — le CTA de l'outro des index l'annonce.

## 📚 Le catalogue d'idées

50 concepts prêts à produire : [`50-concepts-youtube.md`](50-concepts-youtube.md)
