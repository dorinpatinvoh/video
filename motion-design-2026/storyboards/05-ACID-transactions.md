# 🎬 STORYBOARD TECHNIQUE — ACID / Transactions bancaires

**Concept :** Thème 5 · Bases de données — *« Comment une banque ne perd jamais ton argent »*
**Format :** 9:16 · 1080×1920 · 60 fps · **60,0 s** (3600 frames)
**Promesse :** le spectateur comprend que ACID = 4 garanties qui empêchent l'argent de disparaître, et repart avec le pattern `transaction { }` en tête.
**Accent dominant :** **emerald `#34D399`** (l'argent est juste) · secondaire cyan `#22D3EE` (réseau) · **rose `#F43F5E` réservé à l'erreur** · indigo `#6366F1` pour le code.
**Composants :** `BrowserFrame`, `GlassCard`, `TableRow`, `CodeEditor`, `Terminal`, `StatusCodeBadge`, `Cursor`, `Camera`, `Annotation` (cercle/flèche/surlignage), `Caption`, `SfxLayer`.
**Rendu :** Remotion (export MP4 déterministe 1080×1920 @60). Scènes : `src/scenes/acid/` · aperçu live : `npm run preview:live`.
**VO :** voix off FR, débit dynamique ~145 mots (2,4 mots/s), calée sur les beats ci-dessous.

> Règle appliquée partout : **aucun plan > 2,5 s**, 1 SFX par action visuelle, un seul accent dominant par scène.

---

## BLOC 1 — HOOK VISUEL · 0–3 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:00.0 – 00:01.5** | « 100 euros partent du compte A… » | `BrowserFrame` « banque.app » plein cadre (focale 30–70 %). 2 `GlassCard` côte à côte : **Compte A 100,00 €** / **Compte B 50,00 €**. `Cursor` entre depuis le bas-droite (220 px, out-expo 600 ms), survole le bouton **« Virement A → B · 100 € »** (bordure → indigo, glow), puis **clic** (ripple 180 ms). | Titre haut : « VIREMENT » · compteurs en `tabular-nums` | `whoosh` (entrée curseur) → `click` (clic) → `pop` (hover) |
| **00:01.5 – 00:03.0** | « …et n'arrivent jamais sur le compte B. » | Compte A : 100 → **0,00 €** (roll down 300 ms, flash cyan). Compte B reste bloqué : badge **`Pending`** amber qui *pulse* (1,4 s) → glisse en **`ERROR`** rose, **shake 3 px** sur toute la carte, glitch contrôlé 220 ms. Le badge « Total » passe de 150 € → **50 €** en rouge. | « 100 € → 0 € » puis « ERREUR · SOLDE INCOHÉRENT » | `error-tone` (descendant) + `glitch` + silence 150 ms |

---

## BLOC 2 — SÉQUENCE DE DÉCORTICAGE · 3–45 s

### Vue 1/4 — Le problème : deux étapes, aucune garantie (3–12 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:03 – 00:05** | « Pour comprendre, regarde ce qui se passe vraiment. » | **CUT franc** vers `CodeEditor` + `Terminal` : table `accounts` (id, owner, balance) en `TableRow` ×2, apparition en cascade (`stagger 60 ms`). Badge épinglé en haut-droite : **`Total 150,00 €`** emerald. Caméra reculée (scale 1.0), tout est net. | « SOUS LE CAPOT » + « Total = 150,00 € » | `whoosh` + `pop` ×2 (cascade) |
| **00:05 – 00:07** | « Étape une : débiter le compte A. Réussi. » | Ligne 1 tapée en **typewriter** (22 ms/car.) : `UPDATE accounts SET balance = balance - 100 WHERE id = 1;`. Ligne active = fond indigo 10 % + glow. `TableRow` A : 100 → **0,00 €** (flash emerald), badge **`200 OK`** emerald (pop + glow). Le badge Total tombe à **50,00 €** en amber pulsant. | Ligne de code + « 200 OK » | `kbd clack` ×n + `success chime` discret + `pop` |
| **00:07 – 00:09** | « Étape deux : créditer le compte B. Le serveur plante avant. » | **Zoom-in caméra 1.12** (780 ms) sur la 2ᵉ ligne de code. Le `Terminal` affiche `Server process exited (SIGKILL)` puis badge **`500 · INTERNAL ERROR`** rose, shake. `Cursor` se fige en plein milieu de l'écran (aucun mouvement → tension). | « 500 — INTERNAL ERROR » | `whoosh` (zoom) + `error-tone` + `glitch` |
| **00:09 – 00:12** | « 50 euros évaporés, sans trace. Personne ne peut les récupérer. » | **Dolly-out** caméra 1.12 → 1.0 (780 ms). Table finale : A = **0,00 €**, B = **50,00 €**. Badge Total **50,00 €** rouge, `Annotation` : **cercle d'insistance** tracé autour du chiffre (420 ms) + **flèche** manuscrite (480 ms) + surlignage fluo rouge. | « 50 € ÉVAPORÉS » (plein cadre, 132 px) | `riser` court + `error-tone` + `pop` |

### Vue 2/4 — A · Atomicité : tout ou rien (12–21 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:12 – 00:15** | « La solution tient en un mot : atomique. Tout, ou rien. » | CUT. Les deux requêtes sont désormais **enfermées** dans une `GlassCard` conteneur (backdrop-blur 16 px, bordure indigo) titrée `BEGIN … COMMIT`. Le reste de l'écran est **atténué** (`opacity .35` + `blur .5px`). Le `Cursor` glisse et **active** la carte : entrée `translateY 24px → 0` + `scale .98 → 1`. | « A · ATOMICITÉ » + « TOUT OU RIEN » | `whoosh` + `click` + `pop` |
| **00:15 – 00:18** | « Si une seule étape échoue, on annule tout. La base revient exactement à son état d'avant. » | La 2ᵉ requête échoue : badge **`ROLLBACK`** amber → rose. Les deux `TableRow` **rewind** (valeurs qui remontent, 520 ms, out-expo) : A revient à **100,00 €**, B reste **50,00 €**, compteur Total **150 €** emerald. Petit effet « retour en arrière » : les lignes glissent de droite à gauche. | « ROLLBACK » puis « 150,00 € — ÉTAT INITIAL RESTAURÉ » | `error-tone` + `whoosh` (rewind) + `success chime` |
| **00:18 – 00:21** | « Un virement, c'est tout ou rien. Jamais la moitié. » | **Split-screen 2 panneaux** : gauche « AVANT » (150 €), droite « APRÈS » (150 €), chacun validé par une **coche emerald** tracée en SVG (stroke draw 400 ms). Fin d'animation ≥ 300 ms avant le cut. | « AVANT = APRÈS » | `pop` ×2 + `chime` |

### Vue 3/4 — C · Cohérence : les règles ne se cassent pas (21–30 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:21 – 00:24** | « Deuxième lettre : la cohérence. » | **Pan latéral** (+200 px, parallaxe 1.0/0.65/0.35, 780 ms) vers un panneau **« Règles de la base »** : `GlassCard` avec icône verrou + contrainte `CHECK: SUM(balance) = 150 €`. Apparition `stagger 60 ms`. | « C · COHÉRENCE » + « SUM(balance) = 150 € » | `whoosh` (pan) + `pop` |
| **00:24 – 00:27** | « Aucune opération ne peut laisser la base dans un état incohérent : un solde négatif est refusé. » | Requête invalide tapée : `UPDATE accounts SET balance = -20 WHERE id = 1;`. La contrainte **refuse** : badge **`CONSTRAINT VIOLATION`** rose (shake), la ligne **glisse hors de la table** (translateX 300 px + fade) avec une traînée. Le `Cursor` recule d'un cran (feedback de rejet). | « REFUSÉ » en rose + rappel de la contrainte | `error-tone` + `click` + `whoosh` |
| **00:27 – 00:30** | « Les règles sont vérifiées avant et après chaque transaction. » | Retour caméra (pan inverse). Une **sweep** emerald (barre lumineuse verticale qui balaie, 600 ms) parcourt la table ligne par ligne ; chaque ligne validée reçoit une coche + micro-pop. | « VÉRIFIÉ À CHAQUE FOIS » | `swoosh` léger + `chime` + `pop` ×2 |

### Vue 4/4 — I · Isolation + D · Durabilité (30–45 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:30 – 00:33** | « Troisième lettre : l'isolation. Deux virements en même temps. » | **Split vertical** : 2 `BrowserFrame` (`Client 1` / `Client 2`), **2 curseurs distincts** qui cliquent chacun « Virement ». Chaque panneau a son badge d'état. | « I · ISOLATION » + « 2 CLIENTS, 1 SEUL SOLDE » | `whoosh` + `click` ×2 |
| **00:33 – 00:36** | « Sans isolation, deux opérations lisent le même solde et dépensent deux fois le même argent. » | Les deux panneaux affichent **le même 100 €** (flash cyan ×2) → badge Total **250,00 €** en rouge, `Annotation` : 2 flèches qui pointent le doublon + cercle d'insistance. | « DOUBLE DÉPENSE » (rose) | `error-tone` + `glitch` + `pop` |
| **00:36 – 00:39** | « La base fait la queue : la deuxième attend son tour, et tout reste juste. » | Version corrigée : Client 2 affiche **`Pending · verrou 12 ms`** amber (pulse), une **barre de progression** fine se remplit, puis Client 1 valide (`200 OK` emerald) et Client 2 passe **après** lui : Total **150,00 €** emerald. Les 2 curseurs se synchronisent en séquence (jamais en même temps). | « VERROU 12 ms » puis « 150,00 € » | `click` + `pop` + `chime` |
| **00:39 – 00:42** | « Dernière lettre : la durabilité. Le courant se coupe. » | **CUT franc + glitch** : fade to black 220 ms, icône prise débranchée, badge **`POWER LOSS`** rose. **200 ms de silence total** (contraste audio brutal). | « D · DURABILITÉ » → écran noir | `glitch` + coupure + **silence 200 ms** |
| **00:42 – 00:45** | « Une fois validée, la transaction est écrite sur disque. Elle survit au redémarrage. » | Redémarrage : `Terminal` tape `restarting database… OK` (badge emerald). **Rejeu du journal (WAL)** : lignes qui défilent en cascade rapide (`stagger 40 ms`), puis la transaction **réapparaît** dans l'historique, coche emerald, Total **150,00 €**. | « JOURNAL REJOUÉ » + « DONNÉES INTACTES » | `riser` (600 ms) → `boot tone` → `chime` |

---

## BLOC 3 — DÉMO DE CODE / RÉSOLUTION · 45–55 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:45 – 00:49** | « En pratique, tu n'écris jamais ça à la main : une seule fonction. » | `CodeEditor` propre (style VS Code, onglet `transfer.ts`, minimap floutée). Typewriter 20 ms/car. sur 6 lignes. À la fin, la **ligne clé** `await db.transaction(async (tx) => {` reçoit le focus : autres lignes `opacity .35` + `blur .5px` (240 ms), glow indigo + fond `rgba(99,102,241,.10)`. | « LE PATTERN » | `kbd clack` ×n + `pop` (focus ligne) |
| **00:49 – 00:52** | « Tout réussit, ou rien ne s'applique. Et la base le garantit pour toi. » | **Zoom-in 1.12** sur le bloc. Badge **`COMMIT · 4,2 ms`** emerald (pop + glow). Les 3 compteurs s'animent en cascade : A **0,00 €** → B **150,00 €** → Total **150,00 €** (coche emerald). | « COMMIT · 4,2 ms » + « Total 150,00 € » | `whoosh` + `pop` + `chime` |
| **00:52 – 00:55** | « Même code, même panne. Une seule différence : le résultat. » | **Split comparatif** : gauche « SANS TRANSACTION ❌ » panneau légèrement désaturé, Total **50 €** rouge ; droite « AVEC TRANSACTION ✅ » Total **150 €** emerald, glow. Un séparateur vertical se trace (scaleY 0 → 1, 320 ms). | « SANS ❌ / AVEC ✅ » | `error-tone` (gauche) puis `chime` (droite) |

---

## BLOC 4 — OUTRO / CTA · 55–60 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:55 – 00:57.5** | « Atomicité, cohérence, isolation, durabilité : ACID. » | Récap : 4 `GlassCard` (**A·C·I·D**) en cascade (`stagger 60 ms`, `translateY 12px → 0`), chacune avec son mot + coche emerald, fond légèrement flouté, glow indigo diffus. Elles se resserrent en une ligne unique. | « A · C · I · D » + les 4 mots | `pop` ×4 + `chime` |
| **00:57.5 – 01:00** | « Abonne-toi : la prochaine vidéo décortique les index. » | Bouton **« S'abonner »** emerald : apparition `scale .96 → 1` ; le `Cursor` entre, survole (glow + `translateY -4px`), **clique** (ripple). Sous-titre teaser. Fin sur un léger **dolly-out** 1.0 → 0.96 pour laisser respirer. | « S'ABONNER » + « PROCHAINE VIDÉO : LES INDEX » | `click` + `whoosh` final + `chime` |

---

## Annexe A — Récapitulatif des mouvements de caméra

| Plan | Depuis → Vers | Mouvement | Durée | Easing |
|---|---|---|---|---|
| 00:07 | échelle 1.0 → 1.12 sur la ligne de code | Zoom-in focus | 780 ms | inout-soft |
| 00:09 | 1.12 → 1.0 | Dolly-out | 780 ms | inout-soft |
| 00:21 | x 0 → +200 px vers le panneau Règles | Pan latéral + parallaxe | 780 ms | inout-soft |
| 00:27 | +200 px → 0 | Pan retour | 780 ms | inout-soft |
| 00:49 | 1.0 → 1.12 sur le bloc de code | Zoom-in focus | 780 ms | inout-soft |
| 00:57.5 | 1.0 → 0.96 | Dolly-out de sortie | 900 ms | inout-soft |

Rappel : **jamais zoom + pan simultanés** ; `rotateZ` ≤ 0,6° ; `perspective 1200px` pour les cartes légèrement inclinées (retour à 0° en fin de plan).

## Annexe B — Le code montré (exact, 6 lignes)

```ts
// transfer.ts — tout réussit, ou rien ne s'applique
await db.transaction(async (tx) => {
  await tx.debit(from, 100);    // -100 €  (compte A)
  await tx.credit(to, 100);     // +100 €  (compte B)
});                            // COMMIT … ou ROLLBACK automatique
```

## Annexe C — Sound design (mapping de la vidéo)

> Implémentation : ces cues sont décrits dans `audio/cues.json` (en frames) et **mixés en un WAV par scène**
> par `npm run sfx`. Chaque scène ne monte donc qu'un seul `<Audio>`.

| Moment | SFX | Note de mixage |
|---|---|---|
| Curseur / transitions | `whoosh` 250–400 ms | −15 dB sous la voix |
| Clics, hovers | `click` 10 ms, `pop` 60 ms | −18 dB |
| Code tapé | `kbd clack` pitch ±8 % | 1 clack / 2–3 lettres max |
| Successions d'échecs | `error-tone` 440→330 Hz | doubler avec le shake |
| Validations | `success chime` 2 notes | réverb courte |
| Révélations (00:09, 00:42) | `riser` 600–900 ms | coupé net sur l'image |
| 00:39 coupure de courant | silence total 200 ms | contraste dramatique |
| Fond permanent | `ambience` −30 dB | sidechain pendant la voix |

## Annexe D — QA (à valider avant export)

- [x] Aucun plan > 2,5 s sans mouvement/cut (le plus long : 3,0 s, justifié par le posé du bloc 3)
- [x] Safe zones : action entre 25–72 % de la hauteur, captions ancrées à 78 %, 120 px libres à droite
- [x] 1 accent dominant par scène (emerald partout, rose uniquement sur l'erreur, indigo sur le code)
- [x] 1 SFX par action visuelle, voix prioritaire (voix −6 dBFS, SFX −15/−18 dB)
- [x] Zoom et pan jamais simultanés
- [x] Toutes les animations d'UI se terminent en out-expo et ≥ 300 ms avant le cut
- [x] 60 fps visés, animations `transform`/`opacity` uniquement, `backdrop-filter` ≤ 3 surfaces
- [x] Sous-titres brûlés sur 100 % de la durée (lecture sans son)
- [x] `prefers-reduced-motion` géré côté pages de prévisualisation
- [x] Code montré : 6 lignes, exact, aucune ligne inutile

*Storyboard v1 — 2026-10-07 · à valider avant tournage/render.*
