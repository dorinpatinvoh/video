# 🎬 STORYBOARD TECHNIQUE — LE CACHE & LES CDN

**Concept :** bonus B3 · Réseau — *« Pourquoi ce site s'ouvre plus vite depuis New York »*
**Format :** 9:16 · 1080×1920 · 60 fps · **60,0 s** (3600 frames)
**Promesse :** comprendre que la latence est un problème de *distance* avant d'être un problème de serveur, que le cache répond « à la place » du serveur, et repartir avec les 3 règles de cache.
**Accent dominant :** **cyan `#22D3EE`** (le cache, la réponse servie) · **emerald `#34D399`** (HIT, gain) · **rose `#F43F5E`** (miss lointain, contenu périmé, fuite) · indigo pour le code.
**Nouveaux composants :** `WorldMap` (carte en points + paquets animés), `Waterfall` (chronogramme réseau style DevTools), `CacheBox` (la mémoire qui répond à ta place).
**Voix off :** `motion-design-2026/storyboards/B3-cache-cdn.vo.txt` → `public/audio/vo-cache-*.wav` (7 chunks, calés par `npm run vo:fit`).
**Rendu :** Remotion · scènes : `src/scenes/cache/` · aperçu : `npm run preview:live`

> Rappels : cut ≤ 2,5 s · 1 SFX par action visuelle · 1 accent dominant par scène · zoom ≤ 1,15 (§9).

---

## BLOC 1 — HOOK VISUEL · 0–3 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:00.0 – 00:01.5** | « Ta page met quatre secondes. » | `BrowserFrame` « boutique.app » : squelette de page qui se charge. À droite, un `Waterfall` s'allume ligne par ligne : **10 requêtes**, chacune ~412 ms (losanges cyan/rose), compteur qui file **412 → 4 120 ms**. `Cursor` glisse le long du chronogramme. | « 10 REQUÊTES · 4,12 s » | `whoosh` → `clack` ×n → `pop` |
| **00:01.5 – 00:03.0** | « …et ce n'est pas ton code. » | **Zoom léger 1.10** sur la dernière barre (le `DOMContentLoaded`). Badge **`4,12 s · réseau`** rose + **shake 3 px**. Le fond passe au rose. | « 4,12 s — LE RÉSEAU, PAS LE CODE » | `error-tone` + `glitch` court |

---

## BLOC 2 — SÉQUENCE DE DÉCORTICAGE · 3–45 s

### Vue 1/4 — Le voyage : 6 000 km par requête (3–12 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:03 – 00:05** | « Chaque requête traverse six mille kilomètres. » | `WorldMap` plein cadre : nœud **NEW YORK** (cyan) et **PARIS** (indigo, « serveur »). Ligne pointillée tracée entre les deux (`stroke-dashoffset`, 500 ms), globe en rotation très lente (parallaxe du fond). | « NEW YORK → PARIS · 5 837 km » | `whoosh` + `riser` court |
| **00:05 – 00:07** | « Le signal va vite. Les allers-retours, non. » | Un **paquet** lumineux part de NY vers Paris (1,2 s, aller) puis revient (0,8 s). À chaque extrémité, une **impulsion** de latence : `+38 ms DNS`, `+120 ms TLS`, `+182 ms serveur`, `+72 ms retour`. | « LE VOYAGE » + les 4 durées | `swoosh` + `pop` ×4 |
| **00:07 – 00:09** | « Quatre cents millisecondes, et dix fois de suite. » | **Cut** vers le `Waterfall` en gros : les 10 barres s'allument en cascade (`stagger 40 ms`) **en escalier régulier** — les requêtes sont volontairement montrées **en série** (c'est la simplification qui donne le 4,12 s), chaque barre dure 412 ms et commence là où la précédente finit. `Cursor` surligne la dernière barre. | « 412 ms × 10 = 4,12 s » | `clack` ×n + `pop` |
| **00:09 – 00:12** | « Le coupable, c'est la distance. » | **Dolly-out**. `Annotation` : **cercle rose autour du total `4,12 s`** (le total est la preuve) + halo radial derrière le panneau. Pas de flèche décorative. | « LA DISTANCE » | `whoosh` + `chime` |

### Vue 2/4 — Le cache : une réponse qui se souvient (12–21 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:12 – 00:15** | « La première fois, il faut aller le chercher. » | `CacheBox` (à droite du navigateur) : **1ʳᵉ requête → MISS** (rose). Un trait part vers NEW YORK/Paris, la réponse revient en **412 ms**, puis **une copie glisse dans le cache** (chip emerald qui s'insère, le boîtier s'allume). | « 1ʳᵉ FOIS · MISS · 412 ms » | `click` + `whoosh` + `pop` |
| **00:15 – 00:18** | « La fois suivante, la réponse est déjà là. » | **2ᵉ requête → HIT** : le trait s'arrête net au cache (le paquet rebondit), badge **`HIT · 2 ms`** emerald, chronogramme comparatif : barre rose de 412 ms puis sliver emerald de 3 px (échelle 620 ms) — les étiquettes d'état sont posées **après** la barre, jamais dessus. | « ENSUITE · HIT · 2 ms » | `pop` + `chime` |
| **00:18 – 00:21** | « Deux millisecondes au lieu de quatre cents. Deux cents fois plus rapide. » | Les 2 barres passent en **comparatif** (`CompareBars` réutilisé) : 412 ms (rose) vs 2 ms (emerald, sliver honnête). Zoom léger sur le badge **`×200`**. | « ×200 » | `riser` + `chime` |

### Vue 3/4 — Le CDN : rapprocher la copie (21–30 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:21 – 00:24** | « Mais si tes visiteurs sont à New York… » | Retour `WorldMap`, cette fois avec **New York au premier plan** (cyan, « tes utilisateurs »). La ligne vers PARIS reste longue, pointillée rose : `412 ms`. | « TES VISITEURS SONT ICI » | `whoosh` + `pop` |
| **00:24 – 00:27** | « …le serveur de Paris reste à six mille kilomètres. » | **300 points d'edge** s'allument autour du globe en cascade (anneaux emerald qui pulsent, `stagger 6 ms`), un **nœud local** apparaît près de la côte est (« EDGE · 28 ms »). Les étiquettes NY / Paris / edge sont ancrées de part et d'autre des points (aucun chevauchement — leçon QA). | « 300 EDGE NODES » | `pop` ×n (cascade) + `swoosh` |
| **00:27 – 00:30** | « Le CDN garde une copie près de chacun. Vingt-huit millisecondes. » | Le paquet NY → edge local (aller-retour très court, 200 ms) : badge **`TTFB 28 ms`** emerald + **coche tracée**. La ligne longue vers Paris s'estompe à 25 %. `x` final : **`÷15`**. | « 28 ms · LA COPIE LA PLUS PROCHE » | `pop` + `chime` |

### Vue 4/4 — Les 4 pièges du cache (30–45 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:30 – 00:33** | « Le cache a un prix : il fige ce qu'il garde. » | **Piège 1 — le contenu périmé.** Carte produit : **99 €** (valeur en cache, badge `CACHÉ · 24 h`) à côté of **79 €** (valeur réelle, emerald). Horloge qui tourne. Un utilisateur (petite carte) voit **99 €** : badge rose `PRIX PÉRIMÉ`. Surlignage. | « PIÈGE 1 · CONTENU FIGÉ » | `error-tone` + `pop` |
| **00:33 – 00:36** | « Piège deux : mettre un an, c'est bien — si le nom change. » | **Piège 2 — l'empreinte.** Deux chips de fichier : `app.js` (`CACHE 1 AN`) et, après déploiement, `app.7f3a9c.js` (`CACHE 1 AN` aussi). Coche emerald : c'est un **nom différent**, donc une **nouvelle URL** → aucun cache à purger. | « PIÈGE 2 · L'EMPREINTE DANS LE NOM » | `pop` ×2 + `chime` |
| **00:36 – 00:39** | « Piège trois, le pire : jamais de cache partagé sur une page personnelle. » | **Piège 3 — la fuite.** `CacheBox` contient la page « **Alice — solde 2 400 €** ». La requête de **Bob** arrive : le cache renvoie la page **d'Alice**. Glitch 220 ms, badge rose `DONNÉES PERSONNELLES`, shake. Le contenu se floute puis se voile (censure). | « PIÈGE 3 · FUITE DE DONNÉES » | `error-tone` + `glitch` |
| **00:39 – 00:42** | « Piège quatre : la partie difficile, c'est de le vider. » | **Piège 4 — l'invalidation.** Mur de 24 tuiles « contenu en cache » ; un bouton **PURGER** cliqué (cursor) en purge 3, les 21 autres restent (`stagger`). Badge amber `PURGE PARTIELLE · TTL restant`. | « PIÈGE 4 · L'INVALIDATION » | `click` + `pop` ×n + `error-tone` doux |
| **00:42 – 00:45** | « La bonne nouvelle : trois en-têtes suffisent. » | `CodeEditor` 3 lignes qui arrivent en cascade : `public, max-age=31536000, immutable` · `no-cache` · `no-store`. Chaque ligne reçoit sa coche. | « 3 EN-TÊTES » | `pop` ×3 + `chime` |

---

## BLOC 3 — DÉMO DE CODE / RÉSOLUTION · 45–55 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:45 – 00:49** | « Ce qui ne change jamais se cache un an. » | `CodeEditor` (onglet `headers.ts`) : les **3 en-têtes** tapés (`public, max-age=31536000, immutable` · `no-cache` · `no-store`), **focus** sur la 1ʳᵉ ligne + glow indigo, notes de fin de ligne (`assets`, `HTML`, `perso`). | « LE PATTERN » | `clack` ×n + `pop` |
| **00:49 – 00:52** | « Ce qui est personnel ne se cache pas. » | L'éditeur s'efface (300–316) puis le **chronogramme « après correctif »** entre : `index.html` = 1 MISS de 300 ms (l'edge se remplit), puis **9 HIT de 2 ms** empilés. | « 1 MISS + 9 HIT » | `pop` ×n + `error-tone` doux |
| **00:52 – 00:55** | « Résultat : dix requêtes, une seule sortie réseau. » | **Comparatif** (`CompareBars`) : avant = 10 requêtes, **4 120 ms** (rose) ; après = 1 MISS + 9 HIT, **310 ms** (emerald). Badge **`4,12 s → 0,31 s`** + **`÷13`** qui pop. | « 4,12 s → 0,31 s » | `riser` + `chime` |

---

## BLOC 4 — OUTRO / CTA · 55–60 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:55 – 00:57.5** | « Cache long, empreinte dans le nom, no-store. » | 3 `GlassCard` en cascade : **CACHE LONG** (ce qui ne change jamais) · **EMPREINTE** (ce qui change) · **NO-STORE** (ce qui est personnel). Elles se resserrent en une ligne unique. | « 3 RÉFLEXES » | `pop` ×3 + `chime` |
| **00:57.5 – 01:00** | « Abonne-toi : la prochaine, c'est le trajet d'une URL. » | Bouton **S'abonner** emerald, `Cursor` qui clique ; teaser mono. **Dolly-out** final 1.0 → 0.96. | « S'ABONNER » + « PROCHAINE : LE TRAJET D'UNE URL » | `click` + `whoosh` + `chime` |

---

## Annexe A — Mouvements de caméra

| Plan | Mouvement | Durée | Easing |
|---|---|---|---|
| 00:01.5 | zoom 1.0 → 1.10 sur le chronogramme | 780 ms | inout-soft |
| 00:07 | cut franc + entrée du Waterfall | — | — |
| 00:09 | dolly-out 1.10 → 1.0 | 780 ms | inout-soft |
| 00:27 | zoom 1.0 → 1.08 sur le nœud edge | 640 ms | inout-soft |
| 00:52 | zoom 1.0 → 1.08 sur le comparatif | 640 ms | inout-soft |
| 00:57.5 | zoom 1.0 → 1.06 sur le bouton (on finit sur l'action) | 900 ms | inout-soft |
| Vue 4 | pulsation 1.00 ↔ 1.05 à chaque piège (5 beats) | 640 ms | inout-soft |

**Zoom ≤ 1,15** (§9) : jamais de zoom sur un panneau entier au-delà de 1,10.

## Annexe B — Le code montré (exact)

```ts
// headers.ts — trois en-têtes, trois intentions
'Cache-Control': 'public, max-age=31536000, immutable'  // assets fingerprintés
'Cache-Control': 'no-cache'                             // HTML : revalide à chaque fois
'Cache-Control': 'no-store'                             // pages personnelles : jamais en cache
```

## Annexe C — Chiffres utilisés (cohérents sur toute la vidéo)

| Mesure | Valeur |
|---|---|
| Distance New York → Paris | 5 837 km |
| Détail d'une requête | DNS 38 ms · TLS 120 ms · serveur 182 ms · retour 72 ms = **412 ms** |
| Page non cachée | 10 requêtes **en série** × 412 ms ≈ **4,12 s** |
| HIT de cache local | **2 ms** (×200) — réponse servie depuis l'edge |
| Remplissage de l'edge (1ᵉʳ visiteur) | **300 ms** — le seul MISS de la page corrigée |
| TTFB via edge CDN | **28 ms** (÷15) |
| Page après correction | 1 MISS + 9 HIT = **0,31 s** (÷13) |

## Annexe D — QA

- [x] Aucun plan > 2,5 s sans mouvement (le plus long : 3,0 s, posé sur les révélations)
- [x] Safe zones respectées ; captions ≤ 2 lignes (≤ 60 caractères)
- [x] 1 accent dominant par scène ; rose réservé au miss / au périmé / à la fuite
- [x] Barres minuscules (2 ms) représentées honnêtement : sliver de 3 px minimum
- [x] Zoom ≤ 1,15 (§9) ; aucun pan latéral sur du contenu
- [x] Icônes vectorielles uniquement (pas d'emoji)
- [x] Chiffres cohérents entre les scènes (annexe C)
- [x] SFX : 1 par action, mixés par scène ; VO découpée par scène et calée automatiquement
- [x] Sous-titres brûlés sur 100 % de la durée

## Annexe E — Corrections issues de la QA du rendu réel

| Vu au still | Correction |
|---|---|
| Barres qui passaient **sous** les étiquettes (hook, vue 2) | `Waterfall` redessiné : **colonne d'étiquettes fixe** + barres sur une piste séparée ; l'étiquette d'état (`HIT`/`MISS`) est posée **après** la fin de la barre, avec clamp anti-débordement |
| Chronogramme en 3 vagues incohérent avec « 4,12 s » | Requêtes passées **en série** : 10 × 412 ms = 4 120 ms ; le total du panneau et le compteur du hook tombent exactement sur la dernière barre |
| Cercle d'annotation dans le vide (vue 1) | Cercle recentré **autour du total `4,12 s`** (la preuve), curseur sur le total, halo radial recentré |
| Étiquettes de la carte qui se chevauchaient (vue 3) | Nœud edge déplacé (côte est) + libellé court `EDGE · 28 ms` ; `TON SERVEUR` ancré à gauche, `TES VISITEURS` à droite |
| Kicker qui passait sous le badge (vue 2) | Kicker raccourci (`Le cache — la mémoire`) |
| En-tête de code sur 2 lignes (vue 4, piège 5) | `fontSize` 23 → 20 |
| Éditeur et chronogramme visibles en même temps (démo) | Timeline refaite : code 0–300 → fondu → chrono 316–460 → verdict 470+ |
| Emphases de sous-titres décalées d'un mot | Recalculées sur le découpage réel des phrases (7 légendes) |
| Vue 4 statique pendant 15 s | `Camera` : une pulsation de zoom par piège (≤ 1,05) |

*Storyboard v2 — 2026-10-07 (après QA du rendu réel).*
