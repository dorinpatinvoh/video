# 🎬 STORYBOARD TECHNIQUE — LE TRAJET D'UNE URL

**Concept :** bonus B4 · Réseau — *« Ce qui se passe entre la touche Entrée et la première image »*
**Format :** 9:16 · 1080×1920 · 60 fps · **60,0 s** (3600 frames)
**Promesse :** décomposer les **412 ms** d'une requête (DNS → TCP/TLS → serveur → retour) et repartir avec 3 réflexes mesurables — suite directe de « Le cache & les CDN » (qui montrait comment les raccourcir).
**Accent dominant :** **indigo `#818CF8`** (le protocole, le trajet) · **cyan `#22D3EE`** (le DNS, l'annuaire) · **amber `#FBBF24`** (le handshake TLS, le coût) · **emerald `#34D399`** (ce qui est mesuré, gagné) · rose réservé aux échecs/pertes.
**Nouveaux composants à prévoir :** `Timeline` (frise horizontale de phases empilées, façon « Timing » de DevTools), `PacketFlow` (aller-retour de paquets entre deux colonnes CLIENT / SERVEUR avec numéros d'étape), `TlsLock` (cadenas qui se ferme sur le certificat).
**Rendu :** Remotion · scènes à créer dans `src/scenes/url/` · aperçu : `npm run preview:live`
**Voix off :** `motion-design-2026/storyboards/B4-trajet-url.vo.txt` → `public/audio/vo-url-*.wav` (7 chunks, calés par `npm run vo:fit`)

> Rappels : cut ≤ 2,5 s · 1 SFX par action visuelle · 1 accent dominant par scène · zoom ≤ 1,15 (§9).
> Les chiffres reprennent **exactement** l'annexe C de `B3-cache-cdn.md` — c'est la même requête, vue de l'intérieur.

---

## BLOC 1 — HOOK VISUEL · 0–3 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:00.0 – 00:01.5** | « Tu tapes une adresse, tu appuies sur Entrée. » | `BrowserFrame` : la barre d'URL se remplit en machine à écrire (`boutique.app`), le `Cursor` clique sur **⏎** (SVG, pas d'emoji). Le fond s'assombrit, la page reste **blanche/squelette**. | « boutique.app ⏎ » | `click` (clavier) → `clack` ×5 |
| **00:01.5 – 00:03.0** | « Quatre cent douze millisecondes plus tard, la page est là. » | **Cut** sur un compteur mono `0 → 412 ms` (arrondi à l'unité, §9) qui se remplit ; en dessous, **4 segments vides** qui s'allument un par un : DNS · TCP/TLS · SERVEUR · RETOUR. | « 412 ms — 4 étapes » | `riser` court + `pop` ×4 + `chime` |

---

## BLOC 2 — SÉQUENCE DE DÉCORTICAGE · 3–45 s

### Vue 1/4 — Le DNS : l'annuaire (38 ms) · 3–12 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:03 – 00:06** | « Le navigateur connaît le nom, pas la machine. » | Deux colonnes fixes (§9) : à gauche l'**annuaire** (`boutique.app` → `93.184.216.34`), à droite une `DataTable` de 4 lignes : cache navigateur · cache OS · résolveur · racine. La 1ʳᵉ ligne s'allume verte **0 ms**. | « LE DNS — 38 ms » | `pop` + `whoosh` |
| **00:06 – 00:09** | « S'il ne le sait pas, il demande. Trente-huit millisecondes. » | Les 3 lignes suivantes tombent en cascade (amber → cyan) avec leur durée ; **compteur 0 → 38 ms**. Le `Cursor` survole la ligne du résolveur. | « RÉSOLVEUR · 38 ms » | `clack` ×n + `pop` ×3 |
| **00:09 – 00:12** | « Et cette réponse, tu peux la garder. » | Un `Highlight` cyan entoure « cache navigateur » ; badge **`TTL 300 s`** ; l'adresse IP **se copie** depuis l'annuaire vers la colonne CLIENT (petit vol de chip). | « TTL 300 s — garde-la » | `pop` + `chime` |

### Vue 2/4 — TCP + TLS : le tunnel (120 ms) · 12–21 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:12 – 00:15** | « Ensuite il faut ouvrir un chemin jusqu'à la machine. » | Bascule sur `PacketFlow` (CLIENT ↔ SERVEUR, 2 colonnes fixes) : paquet `SYN` (aller), `SYN-ACK` (retour), `ACK` (aller) — 3 petits paquets animés, **40 ms** au compteur. | « TCP — 3 paquets · 40 ms » | `whoosh` ×3 + `clack` |
| **00:15 – 00:18** | « Puis sécuriser le tunnel. Quatre-vingts millisecondes. » | `TlsLock` : le cadenas se ferme ; **ClientHello → ServerHello + certificat → clé de session** (3 étapes, 80 ms). Le certificat s'affiche (émetteur, validité 90 j). | « TLS 1.3 — 80 ms » | `riser` + `pop` ×3 + `chime` |
| **00:18 – 00:21** | « Ce tunnel, tu ne le refais pas à chaque requête. » | Deux requêtes superposées : la 1ʳᵉ paye **120 ms**, la 2ᵉ affiche **0 ms** (`keep-alive`, badge emerald **`œ réutilisé`**). Les paquets de la 2ᵉ sautent le tunnel. | « 120 ms une fois — puis 0 » | `pop` + `whoosh` court |

### Vue 3/4 — La requête et le serveur (182 ms) · 21–30 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:21 – 00:24** | « La requête part : une ligne, deux en-têtes. » | `CodeEditor` (onglet `requête.http`) : `GET /index.html HTTP/2`, `Host`, `Accept-Encoding` — texte non tapé mais **révélé ligne par ligne**, focus sur la 1ʳᵉ ligne. | « GET /index.html » | `clack` ×n + `pop` |
| **00:24 – 00:27** | « Le serveur, lui, travaille vraiment. » | Colonne SERVEUR : `DataTable` du travail serveur — route 6 ms · requête SQL 41 ms · rendu du gabarit 128 ms · sérialisation 7 ms = **182 ms**. Chaque barre s'allume (amber) ; le `Cursor` descend la liste. | « 182 ms de travail serveur » | `clack` ×n + `pop` ×4 |
| **00:27 – 00:30** | « Cent quatre-vingt-deux millisecondes avant le premier octet. » | Le `TotalBadge` **`TTFB 340 ms`** se construit (38 + 120 + 182) et pulse ; une flèche courte (§9) relie le tableau au badge. | « TTFB = 340 ms » | `riser` + `chime` |

### Vue 4/4 — Le retour et les 4 pièges du trajet · 30–45 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:30 – 00:33** | « Le retour : soixante-douze millisecondes. Total : quatre cent douze. » | **Cut** sur la `Timeline` complète (4 phases empilées, largeur ∝ durée) : 38 / 120 / 182 / 72 = **412 ms**. Le total se pose sous la frise. | « 38 + 120 + 182 + 72 = 412 ms » | `whoosh` + `pop` ×4 + `chime` |
| **00:33 – 00:36** | « Piège un : un DNS qu'on redemande à chaque visite. » | Piège 1 : badge rose **`DNS NON CACHÉ`**, la ligne « 38 ms » **repasse en rouge** à chaque visite (3 flashs). | « PIÈGE 1 · DNS REDEMANDÉ » | `error` + `glitch` court |
| **00:36 – 00:39** | « Piège deux : une connexion neuve à chaque requête. » | Piège 2 : le tunnel **se referme** entre deux requêtes, les 120 ms se rejouent ; 3 requêtes côte à côte = **+360 ms** (chiffres réels, pas d'exagération). | « PIÈGE 2 · TUNNEL REFAIT » | `whoosh` + `error` doux |
| **00:39 – 00:42** | « Piège trois : un serveur qui recalcule tout à chaque visite. » | Piège 3 : la colonne SERVEUR rejoue « rendu du gabarit 128 ms » **en boucle** ; badge **`CACHE SERVEUR : AUCUN`**. | « PIÈGE 3 · AUCUN CACHE » | `clack` ×n + `error` doux |
| **00:42 – 00:45** | « Piège quatre : mesurer à l'œil. » | Piège 4 : deux pages **visuellement identiques** mais `4,12 s` vs `0,31 s` au compteur (renvoi direct à la vidéo précédente) ; badge amber **`MESURE, PAS IMPRESSION`**. | « PIÈGE 4 · ON MESURE » | `pop` + `chime` |

---

## BLOC 3 — DÉMO DE CODE / RÉSOLUTION · 45–55 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:45 – 00:49** | « Une seule commande te donne les quatre phases. » | `CodeEditor` (onglet `terminal`) — **le vrai pattern** : `curl -w` avec 5 jalons (`time_namelookup`, `time_connect`, `time_appconnect`, `time_starttransfer`, `time_total`). Machine à écrire 54 car/s, focus sur la 2ᵉ ligne (le format). | « curl -w — les 5 jalons » | `clack` ×n + `pop` |
| **00:49 – 00:52** | « Trente-huit, soixante-dix-huit, cent cinquante-huit, trois cent quarante, quatre cent douze. » | `Terminal` : la sortie s'écrit ligne par ligne, **les 5 valeurs** (38 / 78 / 158 / 340 / 412 ms) avec les **deltas** calculés à droite (38 · 40 · 80 · 182 · 72) — chaque delta s'allume quand il apparaît. | « LES DELTAS = LES 4 PHASES » | `clack` ×n + `chime` |
| **00:52 – 00:55** | « Si un chiffre est trop gros, tu sais où regarder. » | `CompareBars` : « DNS 38 » vs « TTFB 340 » vs « TOTAL 412 » (échelle 412) + badge final **`1 requête = 4 chiffres`**. Zoom léger 1,06 sur le badge. | « OÙ EST LE TEMPS ? » | `riser` + `chime` |

---

## BLOC 4 — OUTRO / CTA · 55–60 s

| [TIMING] | [VOIX OFF] | [VISUEL & ANIMATION] | [TEXTE À L'ÉCRAN] | [AUDIO & SFX] |
|---|---|---|---|---|
| **00:55 – 00:57.5** | « Garde ton DNS, garde ta connexion, mesure avec curl. » | 3 `GlassCard` en cascade : **CACHE DNS** · **KEEP-ALIVE** · **CURL -W** — puis resserrement en une ligne unique (pills). | « 3 RÉFLEXES » | `pop` ×3 + `chime` |
| **00:57.5 – 01:00** | « Abonne-toi : la prochaine, on attaque le premier octet. » | Bouton **S'abonner** emerald, `Cursor` qui clique ; teaser mono ; `Camera` zoom 1,0 → 1,06 sur le bouton (on finit sur l'action). | « S'ABONNER » + « PROCHAINE : LE PREMIER OCTET (TTFB) » | `click` + `whoosh` + `chime` |

---

## Annexe A — Mouvements de caméra

| Plan | Mouvement | Durée | Easing |
|---|---|---|---|
| 00:01.5 | zoom 1,0 → 1,08 sur le compteur 412 ms | 640 ms | inout-soft |
| 00:09 | zoom 1,0 → 1,05 sur le badge TTL | 480 ms | inout-soft |
| 00:21 | cut franc (éditeur → tableau serveur) | — | — |
| 00:30 | zoom 1,0 → 1,06 sur la frise complète | 640 ms | inout-soft |
| 00:45 | zoom 1,0 → 1,05 sur l'éditeur | 480 ms | inout-soft |
| 00:57.5 | zoom 1,0 → 1,06 sur le bouton | 900 ms | inout-soft |

**Zoom ≤ 1,15** (§9) : aucun zoom sur un panneau entier au-delà de 1,08. Les 4 vues gardent **deux colonnes fixes** (CLIENT / SERVEUR), jamais de pan latéral.

## Annexe B — Le code montré (exact)

```bash
# une seule requête, les 5 jalons du trajet
curl -s -o /dev/null -w '\nDNS    %{time_namelookup}s\nTCP    %{time_connect}s\nTLS    %{time_appconnect}s\nTTFB   %{time_starttransfer}s\nTOTAL  %{time_total}s\n' \
  https://boutique.app/index.html
```

Sortie attendue (celle de la vidéo) :

```
DNS    0.038s      →  38 ms
TCP    0.078s      →  78 ms   (+40)
TLS    0.158s      → 158 ms   (+80)
TTFB   0.340s      → 340 ms   (+182)
TOTAL  0.412s      → 412 ms   (+72)
```

## Annexe C — Chiffres utilisés (cohérents avec `B3-cache-cdn.md`, annexe C)

| Mesure | Valeur |
|---|---|
| DNS (résolution de `boutique.app`) | **38 ms** |
| TCP (3 paquets) | **40 ms** |
| TLS 1.3 (ClientHello → clé de session) | **80 ms** |
| TCP + TLS | **120 ms** |
| Travail serveur (route 6 + SQL 41 + rendu 128 + sérialisation 7) | **182 ms** |
| TTFB (`time_starttransfer`) | 38 + 120 + 182 = **340 ms** |
| Retour (téléchargement du HTML) | **72 ms** |
| **Total d'une requête** | **412 ms** — le même que dans la vidéo 3 |
| Page non cachée / page corrigée | 4,12 s / 0,31 s (rappel de la vidéo 3) |

## Annexe D — QA (à valider après le premier rendu réel)

- [ ] Aucun plan > 2,5 s sans mouvement (le plus long : 3,0 s sur la frise finale)
- [ ] Deux colonnes fixes CLIENT / SERVEUR ; aucun pan latéral
- [ ] Compteurs arrondis à l'unité pendant l'animation (§9)
- [ ] Captions ≤ 2 lignes (≤ 60 caractères) ; emphase vérifiée sur le découpage réel des mots
- [ ] Icônes vectorielles uniquement (⏎ et cadenas = SVG) — aucun emoji
- [ ] Les 5 valeurs de `curl -w` et leurs deltas **tombent juste** (38/78/158/340/412) et reprennent l'annexe C de B3
- [ ] `Timeline` : largeurs de phases **proportionnelles** (38 / 120 / 182 / 72 sur 412)
- [ ] 1 accent dominant par scène ; rose uniquement pour les pièges
- [ ] SFX : 1 par action, mixés par scène ; VO découpée par scène et calée automatiquement
- [ ] Chronogrammes et graphes : colonne d'étiquettes fixe, étiquettes d'état après la barre (§9bis)

*Storyboard v1 — 2026-10-07. À relire après le QA du premier rendu (annexe E à ajouter).*
