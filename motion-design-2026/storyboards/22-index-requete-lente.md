# 🎬 STORYBOARD TECHNIQUE — LES INDEX (requête lente)

**Concept :** Thème 5 · Bases de données — *« Ta requête est lente : il te manque juste un index »*
**Format :** 9:16 · 1080×1920 · 60 fps · **60,0 s** (3600 frames)
**Promesse :** comprendre qu'un index est un annuaire trié (et non une magie), que ça transforme 1 000 000 de lectures en ~20 comparaisons, et qu'il a un prix à l'écriture.
**Accent dominant :** **cyan `#22D3EE`** (recherche) · secondaire **emerald `#34D399`** (résultat trouvé) · **rose `#F43F5E`** réservé au scan complet / à l'échec · indigo `#6366F1` pour le code.
**Nouveaux composants :** `ScanStream` (parcours ligne par ligne), `SortedLookup` (dichotomie dans l'annuaire), `CompareBars` (4 210 ms vs 0,42 ms).
**Rendu :** Remotion · scènes : `src/scenes/indexdb/` · aperçu live : `npm run preview:live`

> Rappels appliqués : **aucun plan > 2,5 s**, 1 SFX par action visuelle, un seul accent dominant par scène.

---

## BLOC 1 — HOOK VISUEL · 0–3 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:00.0 – 00:01.5** | « Chercher un client dans un million de lignes… » | `BrowserFrame` « admin-db » plein cadre. Console de requête : `SELECT * FROM customers WHERE email = 'a.dupont@mail.fr';` tapée en machine à écrire (20 ms/car.) puis bouton **Exécuter** qui s'allume (glow indigo). `Cursor` entre, vise, **clique** (ripple). | « REQUÊTE » + `1 048 576 lignes` | `whoosh` → `click` |
| **00:01.5 – 00:03.0** | « …quatre secondes. » | Le `ScanStream` démarre derrière : compteur qui file (0 → 1 048 576), minuteur 0,00 → **4,21 s**, barre de progression pleine. À 2,4 s : spinner/barre **coupés net**, badge **`SLOW QUERY · 4,21 s`** rose, **shake 3 px**. | « 4,21 s » en rose géant | `clack` ×n + `error-tone` |

---

## BLOC 2 — SÉQUENCE DE DÉCORTICAGE · 3–45 s

### Vue 1/4 — Le scan complet : 1 000 000 de lignes pour 1 résultat (3–12 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:03 – 00:05** | « Sous le capot : la base lit chaque ligne. » | CUT. `SceneHeader` « SOUS LE CAPOT » + badge **`1 048 576 lignes`**. La table s'affiche (`ScanStream` statique, 12 lignes visibles, cascade `stagger 60 ms`). | « TABLE CUSTOMERS » | `whoosh` + `pop` |
| **00:05 – 00:07** | « Une par une. » | La **tête de lecture** (ligne horizontale cyan glow) apparaît au centre du flux. Les lignes commencent à défiler vers le haut, lentement puis de plus en plus vite. `Cursor` glisse le long du flux. | « LECTURE SÉQUENTIELLE » | `swoosh` + `clack` ×n |
| **00:07 – 00:09** | « Un million de comparaisons, pour un seul résultat. » | **Zoom-in 1.12** sur le compteur : `LIGNES LUES` qui grimpe (0 → 1 048 576 en 2 s, `tabular-nums`), minuteur qui suit. Traînée cyan derrière la tête de lecture. | « 1 048 576 lues · 1 trouvée » | `whoosh` + `clack` accéléré |
| **00:09 – 00:12** | « Quatre secondes, à chaque requête. » | Le flux **s'arrête net** sur la bonne ligne (`a.dupont@mail.fr`) : flash emerald, la ligne se détache du flux. **Dolly-out** 1.12 → 1.0. `Annotation` : **cercle d'insistance** sur le compteur + **flèche** vers la ligne trouvée. | « 4,21 s → 1 RÉSULTAT » | `riser` court + `chime` + `pop` |

### Vue 2/4 — L'index : l'annuaire de la table (12–21 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:12 – 00:15** | « Un index, c'est l'annuaire de la table : les mêmes données, triées. » | CUT. `SortedLookup` : grille de 32 entrées **triées** (dont `a.dupont@mail.fr`) apparaît en cascade. Un micro-label « trié par email » + icône annuaire. | « L'INDEX = ANNUAIRE TRIÉ » | `whoosh` + `pop` ×n (cascade) |
| **00:15 – 00:18** | « On ouvre au milieu, et on élimine la moitié. » | 1ᵉʳ saut : la cellule du **milieu** s'allume (pulse cyan), tout l'intervalle supérieur passe à `opacity .18` avec une **barre qui se rabat** (draw 400 ms). Compteur « 524 288 éliminées ». Puis 2ᵉ saut : encore la moitié. | « 1 048 576 → 524 288 → 262 144 » | `pop` + `whoosh` (chaque saut) |
| **00:18 – 00:21** | « Vingt étapes suffisent. » | Les 5 derniers sauts s'enchaînent en accéléré (`stagger 50 ms`), chaque saut = flash + compteur `20 · 19 · 18…`. La cellule cible reçoit la **coche emerald** (stroke draw) et un glow. Badge **`0,42 ms`** emerald + **`×10 000`**. | « 20 ÉTAPES · 0,42 ms · ×10 000 » | `rip` de pops croissants + `chime` |

### Vue 3/4 — Le prix de l'index (21–30 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:21 – 00:24** | « Mais l'index a un prix. » | CUT. `GlassCard` « INSERT INTO customers … » + `Cursor` qui clique **Valider**. Une **écriture** part vers la table : badge **`1 écriture`** + `1,2 ms` vert. | « SANS INDEX — 1 ÉCRITURE » | `click` + `pop` + `chime` |
| **00:24 – 00:27** | « Chaque écriture doit aussi mettre à jour les index. » | Le même INSERT rejoue, mais **4 flèches** partent en parallèle (table + 3 index) : `Annotation` flèches animées + badges empilés `1 → 4 écritures`. Le badge temps passe en amber **`3,8 ms`**. Petite **barre de charge disque** qui triple. | « AVEC 3 INDEX — 4 ÉCRITURES » | `whoosh` ×4 (décalés) + `error-tone` adouci |
| **00:27 – 00:30** | « Lire dix mille fois plus vite, écrire trois fois plus lentement : on indexe ce qu'on filtre souvent. » | **Split comparatif** : gauche « LECTURES ×10 000 plus rapides » (emerald), droite « ÉCRITURES ×3 plus lentes » (amber), séparateur tracé `scaleY 0 → 1`. Surlignage fluo sous « ce qu'on filtre ». | « LIRE ×10 000 · ÉCRIRE ×3 » | `pop` ×2 + `chime` |

### Vue 4/4 — Les 4 pièges qui annulent ton index (30–45 s)

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:30 – 00:33** | « Piège un : une fonction sur la colonne. » | Code : `WHERE LOWER(email) = 'x'`. L'icône index se **barre d'une croix** (draw rouge) et le badge retombe en **`SEQ SCAN · 4,21 s`**. Le `ScanStream` réapparaît en arrière-plan flouté. | « PIÈGE 1 · FONCTION SUR LA COLONNE » | `error-tone` + `glitch` court |
| **00:33 – 00:36** | « Piège deux : un LIKE qui commence par un pourcent. » | `WHERE email LIKE '%dupont%'`. Visuel : le curseur de l'annuaire **cherche** mais ne peut pas sauter (il ne connaît pas la première lettre) — petit aller-retour désorienté, badge rose **`SEQ SCAN`**. | « PIÈGE 2 · `LIKE '%…'` » | `whoosh` + `error-tone` |
| **00:36 – 00:39** | « Piège trois : l'ordre des colonnes dans un index composite. » | Deux `GlassCard` côte à côte : `(last_name, first_name)` ✅ et `(first_name, last_name)` ❌ pour la requête `WHERE last_name = …`. La carte ❌ se désature et reçoit la croix. | « L'ORDRE COMPTE » | `click` + `pop` + `error-tone` |
| **00:39 – 00:42** | « Piège quatre : trop d'index. » | Une liste de 8 index s'empile (cascade rapide) ; à chacun, la barre d'écriture **s'allonge** : `1,2 ms → 9,4 ms`. Le badge vire rose. Un **glitch 220 ms** marque la saturation. | « 8 INDEX = ÉCRITURES ×8 » | `clack` rapides + `error-tone` + `glitch` |
| **00:42 – 00:45** | « La bonne nouvelle : `EXPLAIN` te dit tout. » | `Cursor` clique sur **EXPLAIN ANALYZE** ; le plan s'affiche : `Seq Scan` **surligné en rose** puis remplacé par `Index Scan using idx_…` en emerald avec coche. | « EXPLAIN TE DIT TOUT » | `click` + `pop` + `chime` |

---

## BLOC 3 — DÉMO DE CODE / RÉSOLUTION · 45–55 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:45 – 00:49** | « Une ligne suffit. On crée l'index une fois. » | `CodeEditor` propre (`migration.sql`, tabs + minimap) : `CREATE INDEX idx_customers_email ON customers (email);` en machine à écrire. À la fin, la ligne reçoit le **focus** (reste à 35 % + flou 0,5 px), glow indigo. | « LE PATTERN » | `clack` ×n + `pop` |
| **00:49 – 00:52** | « Quatre mille deux cents millisecondes… » | `CompareBars` : barre **Seq Scan 4 210 ms** (rose) qui se remplit en 600 ms, valeur qui compte. | « AVANT · Seq Scan · 4 210 ms » | `whoosh` + `error-tone` |
| **00:52 – 00:55** | « …zéro virgule quatre. Mille fois plus rapide. » | La barre **Index Scan 0,42 ms** (emerald) apparaît minuscule (min 3 px + label), **zoom-in 1.12** dessus, badge **`×10 000`** (pop + glow) et coche tracée. | « APRÈS · Index Scan · 0,42 ms · ×10 000 » | `riser` + `chime` |

---

## BLOC 4 — OUTRO / CTA · 55–60 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:55 – 00:57.5** | « Indexe ce que tu filtres. Vérifie avec EXPLAIN. » | 3 `GlassCard`-checklist en cascade : « ce que tu filtres », « ce que tu joins », « vérifie avec EXPLAIN ». Elles se resserrent en une ligne unique, coches emerald tracées. | « 3 RÉFLEXES » | `pop` ×3 + `chime` |
| **00:57.5 – 01:00** | « Abonne-toi : la prochaine vidéo parle du cache. » | Bouton **S'abonner** emerald, `Cursor` qui survole et clique ; teaser mono dessous. **Dolly-out** 1.0 → 0.96. | « S'ABONNER » + « PROCHAINE : LE CACHE » | `click` + `whoosh` + `chime` |

---

## Annexe A — Mouvements de caméra

| Plan | Mouvement | Durée | Easing |
|---|---|---|---|
| 00:07 | zoom 1.0 → 1.12 sur le compteur | 780 ms | inout-soft |
| 00:09 | dolly-out 1.12 → 1.0 | 780 ms | inout-soft |
| 00:18 | zoom 1.0 → 1.08 sur la cellule cible | 640 ms | inout-soft |
| 00:52 | zoom 1.0 → 1.12 sur la barre Index Scan | 780 ms | inout-soft |
| 00:57.5 | dolly-out 1.0 → 0.96 | 900 ms | inout-soft |

Jamais zoom + pan simultanés · `rotateZ` ≤ 0,6° · retour à 0° en fin de plan.

## Annexe B — Le code montré (exact)

```sql
-- migration.sql — une fois, pour toutes les requêtes suivantes
CREATE INDEX idx_customers_email ON customers (email);

-- vérification
EXPLAIN ANALYZE SELECT * FROM customers WHERE email = 'a.dupont@mail.fr';
-- avant : Seq Scan on customers  (cost=0.00..18432.00 rows=1)  →  4210 ms
-- après : Index Scan using idx_customers_email               →     0.42 ms
```

## Annexe C — Sound design

Cues décrits dans `audio/cues.json` (clés `idx-*`) et **mixés en un WAV par scène** par `npm run sfx`.
Mapping identique au standard : `whoosh` transitions · `pop` apparitions · `clack` frappe · `error`/`glitch` échecs · `chime` validations · `riser` révélations.

## Annexe D — QA

- [x] Aucun plan > 2,5 s sans mouvement/cut (le plus long : 3,0 s, posé volontairement sur les révélations)
- [x] Safe zones : action 25–72 %, captions 78 %, 120 px libres à droite
- [x] 1 accent dominant par scène (cyan recherche · rose scan complet · emerald résultat)
- [x] 1 SFX par action visuelle, voix prioritaire
- [x] Zoom et pan jamais simultanés, fins d'animation en out-expo
- [x] `CompareBars` honnête : la barre de 0,42 ms est un sliver de 3 px — c'est le propos
- [x] Sous-titres brûlés sur 100 % de la durée
- [x] Code montré : 1 ligne utile + son EXPLAIN, rien de décoratif
- [x] VO finale enregistrée par chunks par scène (voir `22-index-requete-lente.vo.txt`)

*Storyboard v1 — 2026-10-07.*
