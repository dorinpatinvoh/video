# 🎞️ STANDARD MOTION DESIGN 2026 — Chaîne Tech (9:16)

> **Statut :** document de référence obligatoire. Tout storyboard, toute page animée et tout code produit
> pour la chaîne doit respecter ce standard. Il est directement dérivé des directives « Motion Design Pro 2026 ».
>
> **Pipeline cible :** `Concept → Storyboard (ce standard) → Page web animée / scènes → Export 1080×1920 @60 fps`

---

## 0. Les 7 règles non négociables

| # | Règle | Seuil mesurable |
|---|-------|-----------------|
| 1 | **Jamais d'écran statique** | Un cut, un zoom, un pan ou une apparition toutes les **1,5 à 2,5 s max** |
| 2 | **Le curseur raconte l'histoire** | Chaque action clé (clic, survol, glisser, surlignage) est faite *avec* le curseur, jamais toute seule |
| 3 | **Une seule idée par plan** | 1 composant focal par scène, le reste en arrière-plan flouté/atténué |
| 4 | **Dark mode élégant, pas néon agressif** | Fond `#0B0F19`/`#0D1117`, accents **indigo / cyan / emerald** uniquement |
| 5 | **Le texte ne bouge pas pendant qu'on le lit** | Fin de toute animation de texte ≥ 300 ms avant la fin de la scène |
| 6 | **Sound design systématique** | 1 SFX par action visuelle, jamais de mouvement muet |
| 7 | **GPU only** | Animer exclusivement `transform` + `opacity` (+ `clip-path`, `filter` avec parcimonie) |

---

## 1. Design tokens

### 1.1 Couleurs

```css
:root{
  /* Fonds */
  --bg-base:#0B0F19;        /* fond principal */
  --bg-alt:#0D1117;         /* fond éditeur / panneaux */
  --bg-elevated:#111827;    /* surfaces surélevées */
  --bg-glass:rgba(255,255,255,.045);
  --border-glass:rgba(255,255,255,.09);
  --border-strong:rgba(255,255,255,.16);

  /* Accents néon (à doser : 1 accent dominant par scène) */
  --indigo-400:#818CF8; --indigo-500:#6366F1; --indigo-600:#4F46E5;
  --cyan-400:#22D3EE;   --cyan-500:#06B6D4;
  --emerald-400:#34D399;--emerald-500:#10B981;
  --amber-400:#FBBF24;  /* Pending */
  --rose-400:#FB7185;   --rose-500:#F43F5E;   /* Error */

  /* Texte (contraste AA garanti sur #0B0F19) */
  --text-primary:#E6EDF3;
  --text-secondary:#9BA7B4;
  --text-muted:#6B7A8D;
  --text-code:#C9D1D9;

  /* Syntax highlighting "néon doux" */
  --syntax-keyword:#C792EA;  /* if, const, return */
  --syntax-fn:#82AAFF;
  --syntax-string:#C3E88D;
  --syntax-num:#F78C6C;
  --syntax-type:#FFCB6B;
  --syntax-comment:#5F7E97;

  /* Glow & profondeur */
  --glow-indigo:0 0 60px rgba(99,102,241,.35);
  --glow-cyan:0 0 60px rgba(34,211,238,.30);
  --glow-error:0 0 60px rgba(244,63,94,.35);
  --shadow-card:0 24px 60px -20px rgba(0,0,0,.75);
  --shadow-float:0 40px 120px -30px rgba(0,0,0,.9);
}
```

**Répartition 60/30/10 :** 60 % fond sombre neutre · 30 % surfaces glass + gris · 10 % couleur d'accent.
❌ Jamais deux accents pleins de familles différentes en même temps à l'écran.

### 1.2 Typographie

| Usage | Police | Taille (canvas 1080×1920) | Poids | Interlignage |
|-------|--------|---------------------------|-------|--------------|
| Hook / titre plein écran | Inter / Geist | 104–132 px | 800 | 0,95 |
| Capiton (sous-titre animé) | Inter / Geist | 60–72 px | 700 | 1,1 |
| Corps UI (mockup) | Inter | 30–38 px | 500 | 1,4 |
| Code | JetBrains Mono / Fira Code | 30–36 px | 500 | 1,6 |
| Badge d'état | JetBrains Mono | 26–30 px | 600 | 1 |
| Micro-labels (kbd, tabs) | Inter | 24–28 px, uppercase +0,08em | 600 | 1 |

- Échelle **modulaire ×1,25** entre niveaux, jamais de taille « au hasard ».
- Chiffres importants : `font-variant-numeric: tabular-nums`.
- Ligatures activées en code : `"calt" 1, "ligatures" 1`.

### 1.3 Grille & safe zones (1080×1920)

```
┌─────────────── 1080 ───────────────┐
│  marge haute 140 px                │
│  (zone UI YouTube/Insta à éviter)  │
│        ← contenu : 840 px de large │
│           (marges 120 px)          │
│                                    │
│         ZONE FOCALE 30–70 %        │  ← 95 % de l'action ici
│                                    │
│  marges basses 360 px              │  ← captions + UI app (TikTok/Shorts)
└────────────────────────────────────┘
```
- **Zone focale** : tout élément porteur de sens reste entre **y = 25 % et y = 72 %**.
- **Right-safe** : 120 px de droite libres (boutons like/partage).
- **Captions** : ancrées à **y = 78 %**, max **2 lignes**, 32 caractères/ligne.

---

## 2. Motion tokens

### 2.1 Durées & easings

```css
:root{
  --dur-instant:120ms;  /* hover, pop badge */
  --dur-micro:180ms;    /* tap, ripple, toggle */
  --dur-ui:280ms;       /* apparition de carte, onglet */
  --dur-scene:520ms;    /* transition de scène */
  --dur-camera:780ms;   /* zoom / pan caméra */
  --dur-code-line:420ms;/* révélation ligne surlignée */

  /* Entrées UI : départ rapide, arrivée feutrée */
  --ease-out-expo:cubic-bezier(.16,1,.3,1);
  /* Déplacements de caméra & transitions de scène */
  --ease-inout-soft:cubic-bezier(.65,0,.35,1);
  /* Éléments ludiques (badges, curseur qui clique) */
  --ease-spring:cubic-bezier(.34,1.56,.64,1);
  /* Typewriter & scroll : aucune accélération */
  --ease-linear:linear;
}
```

| Intention | Durée | Easing |
|-----------|-------|--------|
| Survol / highlight | 120–180 ms | out-expo |
| Clic + ripple | 180 ms | spring |
| Apparition carte / ligne de code | 240–420 ms | out-expo |
| Transition de scène | 480–600 ms | inout-soft |
| Zoom / pan caméra | 600–900 ms | inout-soft |
| Frappe machine à écrire | 18–28 ms **par caractère** | linear |

❌ **Interdit :** toute animation d'UI > 600 ms ; `ease-in-out` par défaut du navigateur ; rebonds > 1,1× de l'échelle cible.

### 2.2 Caméra (le vrai marqueur « pro 2026 »)

- **Zoom-in de focus** : `scale 1 → 1.12` (léger) ou `→ 1.28` (dramatique), **jamais** en même temps qu'un pan.
- **Pan latéral** : translation max **±220 px**, parallaxe `foreground 1.0 / mid 0.65 / back 0.35`.
- **Rotation** : quasi nulle — `rotateZ` ≤ 0,6° pour un pan « filmique » (profondeur perçue sans nausée).
- **Perspective 3D** : `perspective: 1200px`, cartes à `rotateX(6deg) rotateY(-8deg)` max, retour à 0° à la fin du plan.
- **Cut franc** : 1 frame, sans transition — préférable à un fade quand on change de sujet.
- Toujours **ralentir en fin de mouvement** (out-expo) : un zoom qui s'arrête net fait « cheap ».

### 2.3 Rythme / beat map

| Temps | Fonction | Longueur cible |
|-------|----------|----------------|
| 0–3 s | Hook | 1 à 2 micro-plans (≤ 1,5 s chacun) |
| 3–45 s | Décorticage | 3–4 vues, **cut toutes les 1,5–2,5 s** |
| 45–55 s | Démo / solution | 2–3 plans plus posés (2,5–3,5 s) |
| 55–60 s | Outro / CTA | 1 plan + 1 récap animé |

- Un **battement visuel** (mouvement, flash de badge, apparition) toutes les **2 s minimum**.
- Règle du **1-2-3** : montrer le problème (1), montrer l'échec (2), montrer la solution (3) — jamais l'inverse.

---

## 3. Composants réutilisables (bibliothèque à construire)

Chaque composant = 1 fichier/scène isolé, animable, paramétrable. C'est le socle du « pro 2026 ».

| Composant | Description | Animation signature |
|-----------|-------------|---------------------|
| `BrowserFrame` | Fenêtre navigateur glass, barre d'URL, 3 pastilles | Entrée `translateY 24px + scale .98 → 1`, glow au focus |
| `CodeEditor` | Mock VS Code : tabs, numéros de ligne, minimap floutée | Typewriter + active-line highlight + caret blink |
| `Terminal` | Prompt `$`, sortie monospace | Ligne par ligne, scroll auto, curseur bloc |
| `StatusCodeBadge` | `200 OK` / `404` / `Pending` / `Error` | Status : glow + pop ; Pending : pulse amber ; Error : shake 3 px + tone |
| `GlassCard` | Carte `backdrop-blur` à bordure 1 px | Hover : `translateY -4px`, bordure → accent |
| `Cursor` | Curseur souris réaliste (flèche + état pressed) | Chemin ease-out, pause 80 ms avant clic, ripple au clic |
| `TableRow` | Ligne de table DB (schéma, clé, valeur) | Apparition en cascade `stagger 60 ms` |
| `NetworkDiagram` | Client → Serveur → DB en 3D léger | Paquets animés le long des liens, glow à l'arrivée |
| `NotificationStack` | Empilement de cartes/badges | Slide-in depuis la droite, décalage 40 ms |
| `ProgressIndicator` | Barre / anneau de chargement | Sweep linéaire, jamais de spinner qui tourne > 1,5 s |

**Règles de composition :** 1 composant focal + 1 élément secondaire atténué (`opacity .35` + `blur 0.5px`) — jamais 3 éléments de même poids visuel.

---

## 4. Patterns d'animation à employer

1. **Typewriter de code** — 18–28 ms/car., caret `1s step-end`, son de clavier clack variant le pitch (±8 %).
2. **Ligne clé focalisée** — autres lignes : `opacity .35` + `blur .5px` en 240 ms ; la ligne clé reçoit `--glow-indigo` et un fond `rgba(99,102,241,.10)`.
3. **Zoom-in sur composant** — scale 1 → 1,12–1,28 en 780 ms, **le composant se recentre** (translate automatique pour rester dans la zone focale).
4. **Pan vers la doc** — déplacement 180–220 px avec parallaxe, flou de mouvement léger (`filter: blur(.4px)`) pendant le déplacement uniquement.
5. **Surlignage fluo** — barre indigo/cyan en `scaleX 0 → 1` (origin left, 180 ms, out-expo) **derrière** le texte, opacité 0,22.
6. **Flèche dessinée à la main** — SVG path animé en `stroke-dashoffset` (400–520 ms), léger overshoot, terminaison arrondie.
7. **Cercle d'insistance** — ellipse SVG tracée en 420 ms autour d'un élément, opacité 0,9, scale 1 → 1,06 à la fin.
8. **Badges d'état** — `200 OK` : pop + glow emerald · `Pending` : pulse amber (1,4 s) · `Error` : shake 3 px + rose glow + tone descendant.
9. **Cascade (stagger)** — listes/tables : `stagger 60 ms`, `translateY 12px` → 0.
10. **Flip/Focus d'onglet** — indicateur d'onglet qui glisse (`transform` FLIP, 280 ms), jamais de fade sec.
11. **Zoom-out de révélation (dolly out)** — pour montrer la vue d'ensemble après un détail.
12. **Glitch contrôlé** — uniquement pour signaler une panne (≤ 220 ms, 2 frames décalées RGB, jamais gratuit).

---

## 5. Sound design

| Événement visuel | Son | Spec |
|------------------|-----|------|
| Apparition de carte / badge | `pop` | sinus/blip 40–80 ms, 1–3 kHz |
| Transition de scène / caméra | `whoosh` | bruit filtré en sweep, 250–400 ms |
| Clic souris | `click` | transient 8–15 ms, discret |
| Frappe de code | `kbd clack` | 6–12 ms, pitch aléatoire ±8 % |
| Erreur / échec | `error tone` | 2 notes descendantes (ex. 440→330 Hz) |
| Succès / validation | `success chime` | 2 notes montantes, reverb courte |
| Révélation clé | `riser` | montée 600–900 ms, coupée net sur l'image |
| Fond | `ambience` | nappe très basse, −30 dB |

**Mixage :** voix −6 dBFS crête · SFX entre −12 et −18 dB sous la voix · sidechain léger sur l'ambience pendant la voix.
**Interdit :** SFX sur *chaque* caractère tapé (exténuant) — 1 clack toutes les 2–3 lettres suffit.

---

## 6. Implémentation technique (pour le prochain code)

### 6.1 Deux pistes, un seul jeu de tokens

| Piste | Usage | Stack |
|-------|-------|-------|
| **A — Page web animée « live »** | Maquettes interactives, démo produit, captures d'écran à scripter (curseur, scroll, hover) | HTML + CSS + **GSAP** (+ Timeline), Lenis pour le scroll |
| **B — Rendu déterministe vidéo** | Export MP4 1080×1920 @60 fps impeccable, rejouable à l'identique | **Remotion** (React) ou **Motion Canvas**, même tokens CSS |

➡️ Les **tokens de la section 1–2 doivent être partagés** (`tokens.css` / `tokens.ts`) entre les deux pistes.

### 6.2 Règles de performance (obligatoires)

- Animer **uniquement** `transform` / `opacity` ; jamais `width`, `top`, `margin-left`, `box-shadow` en continu.
- Sur les éléments animés : `will-change: transform` **temporaire**, retiré après l'animation.
- `backdrop-filter: blur(12–18px)` : **≤ 3 surfaces simultanées** (coût GPU lourd) ; jamais de blur animé sur plein écran.
- Scroll-driven : `IntersectionObserver` ou `ScrollTimeline`, jamais de listener `scroll` brut.
- Toujours un `@media (prefers-reduced-motion: reduce)` qui neutralise les mouvements et conserve les apparitions.
- Enregistrement : 60 fps constant. Toute animation dont la durée n'est pas multiple d'une frame (~16,67 ms) est arrondie.
- Aucune dépendance runtime vers `localhost` : assets relatifs, tout servi par le même serveur.

### 6.3 Checklist QA avant publication (à valider plan par plan)

- [ ] Aucun plan > 2,5 s sans mouvement ni cut
- [ ] Le texte reste lisible et immobile ≥ 300 ms avant la fin de la scène
- [ ] Safe zones respectées (zone focale 25–72 %, captions à 78 %, right-safe 120 px)
- [ ] 1 seul accent couleur dominant par scène
- [ ] Contraste texte AA (≥ 4,5:1) vérifié sur fond `#0B0F19`
- [ ] 1 SFX par action visuelle, mixage voix > SFX
- [ ] Zoom et pan jamais simultanés sur le même élément
- [ ] Fin d'animation en out-expo (aucun arrêt brutal)
- [ ] Animations rejouables à l'identique (déterminisme) si export vidéo
- [ ] 60 fps tenus sur machine moyenne (profiler Chrome : 0 frame > 16,7 ms)
- [ ] Sous-titres brûlés présents sur 100 % de la durée (lecture sans son)

---

## 7. Anti-patterns — ce qu'on ne fait plus (ère « amateur »)

❌ Dégradés arc-en-ciel partout et néons saturés qui bavent
❌ `box-shadow` coloré énorme sur chaque élément
❌ Animations de 1 s+ sur des micro-interactions UI
❌ Texte qui glisse en boucle pendant qu'on le lit
❌ Fades enchaînés sans intention (le « diaporama PowerPoint »)
❌ Curseur qui se téléporte (doit suivre une trajectoire crédible, avec accélération/décélération)
❌ Zoom qui tremble / s'arrête brutalement
❌ Musique qui écrase la voix off
❌ Mockup de code générique vendeur de rêve : le code doit montrer le concept, exact et court (5–12 lignes)
❌ Spinner qui tourne indéfiniment pour « meubler »

---

## 8. Livrable d'un storyboard (format imposé)

Un storyboard se livre sous forme de **tableau chrono horodaté, seconde par seconde**, découpé en 4 blocs :

1. **HOOK VISUEL (0–3 s)** — problème visuel / interface qui bugue, arrêt du scroll
2. **SÉQUENCE DE DÉCORTICAGE (3–45 s)** — 3 à 4 vues d'interfaces simulées
3. **DÉMO DE CODE / RÉSOLUTION (45–55 s)** — le bon pattern, propre
4. **OUTRO / CTA (55–60 s)** — animation épurée + récap synthétique

Et pour **chaque scène**, les 5 champs obligatoires :

- `[TIMING]` — ex. `00:07 – 00:10`
- `[VOIX OFF]` — réplique exacte, dynamique, sans jargon inutile
- `[VISUEL & ANIMATION]` — page, composant, trajectoire du curseur, zoom, glow
- `[TEXTE À L'ÉCRAN]` — titres/captions grand format, animés
- `[AUDIO & SFX]` — les bruitages clés

📄 Modèle vierge prêt à remplir : `motion-design-2026/STORYBOARD-TEMPLATE.md`

---

*Dernière mise à jour : 2026-10-07 — à faire évoluer à chaque vidéo, jamais à contourner.*
