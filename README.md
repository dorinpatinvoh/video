# 🎬 Vidéos web animées (avec sous-titres)

Des « vidéos » qui sont en fait des pages web : tu lances la lecture, les scènes
s'animent (terminal qui tape les commandes, code qui s'écrit tout seul, récaps
animés…) et **les sous-titres affichent le texte exact à dire en voix off** —
comme un prompteur.

100 % HTML / CSS / un peu de JS · aucune dépendance · fonctionne hors ligne
(double-clic sur un fichier `index.html`, ou petit serveur local).

## 📦 Récupérer le projet (Windows / PowerShell)

```powershell
git clone https://github.com/dorinpatinvoh/video.git
cd video
git checkout arena/01a1092f-video
code .
```

> La branche `arena/01a1092f-video` contient tout le travail. Une fois fusionnée
> dans `main`, le `git checkout` ne sera plus nécessaire.

## ▶️ Regarder

Ouvre simplement **`index.html`** (la galerie) dans ton navigateur, ou une vidéo
directement (`linux-20-commandes/index.html`, `html-css-bases/index.html`).

Optionnel — serveur local (utile pour le bouton ⬇ et le rechargement à chaud) :

```powershell
# Solution 1 (recommandée, tu as déjà VS Code) :
# Extensions (Ctrl+Maj+X) → « Live Server » → Installer
# puis clic droit sur index.html → « Open with Live Server »

# Solution 2 (si Python est installé un jour) :
python -m http.server 8000
# puis ouvre http://localhost:8000
```

> Le bouton ⬇ « Télécharger la vidéo » a besoin d'un serveur local
> (Live Server ou http://localhost). Tout le reste fonctionne en double-clic.

### Raccourcis du lecteur

| Touche | Action |
|---|---|
| `Espace` / `K` | Lecture / pause |
| `←` / `→` | Reculer / avancer de 5 s |
| `J` / `L` | Reculer / avancer de 10 s |
| `C` | Sous-titres on/off |
| `F` | Plein écran |

Le lecteur propose aussi : chapitres, vitesse (0.75× à 2×), barre de progression
cliquable, écran de fin avec rediffusion.

## 🎞️ Les épisodes

| # | Vidéo | Durée | Thème |
|---|---|---|---|
| 1 | **20 commandes Linux à connaître** | 3:57 | terminal vert |
| 2 | **HTML & CSS : les bases** | 2:01 | éditeur de code |
| 3 | **Travailler en équipe sur GitHub** | 2:05 | violet GitHub |
| 4 | **Exercice : ta carte de profil HTML/CSS** | 2:41 | rose créatif |
| 5 | **Clip cinématique : Bénin** | 0:30 | noir & or |

## ➕ Créer une nouvelle vidéo

1. **Copie le modèle**

   ```powershell
   xcopy /E /I modele git-bases        # PowerShell
   ```
   ```bash
   cp -r modele git-bases              # Linux / Mac
   ```

2. **Écris ton script** dans `git-bases/index.html` : tout se passe dans le bloc
   `<script type="application/json" id="video-data">` en bas de page.
   Chaque scène = un objet avec un `type`, une durée `dur` (secondes) et ses
   sous-titres `subs` (`[début relatif, durée, "texte"]`).

   Types de scènes disponibles :

   | Type | Effet |
   |---|---|
   | `title` | écran-titre (intro / outro) |
   | `terminal` | commande tapée dans un terminal + sortie |
   | `code` | éditeur de code avec coloration syntaxique |
   | `rule` | anatomie d'une règle CSS |
   | `split` | deux panneaux côte à côte |
   | `grid` | grille de récap animée |
   | `boxmodel` | le modèle de boîte CSS |

3. **Choisis un thème** : `<body class="theme-terminal">` ou
   `<body class="theme-editor">` (d'autres palettes dans `assets/themes.css`).

4. (Optionnel) ajoute une carte dans `index.html` et un lien `"next"` dans le JSON.

> ⚠️ Le JSON est dans une balise `<script>` : la seule chaîne interdite à
> l'intérieur est `</script>`. Tout le reste (accents, `<h1>`, etc.) fonctionne.

## 🗂️ Structure du dépôt

```
index.html              ← galerie / accueil
assets/
  core.css              ← base + styles de la galerie
  player.css            ← lecteur, scènes, contrôles, sous-titres
  themes.css            ← palettes (terminal, éditeur, …)
  player.js             ← moteur (timeline, animations, sous-titres)
linux-20-commandes/     ← épisode 1
html-css-bases/         ← épisode 2
modele/                 ← modèle commenté pour un nouvel épisode
```

## 🎵 Musique de fond (pour YouTube)

Le lecteur joue automatiquement le fichier indiqué par le champ `"music"` du
JSON (`../assets/music.mp3`) en boucle, à volume réduit, sous la voix off.

1. Va dans **YouTube Studio → Bibliothèque audio** (musiques 100 % gratuites
   et monétisables) et télécharge un morceau calme / lo-fi.
2. Renomme-le `assets/music.mp3`.
3. C'est tout : il démarre avec la lecture, se coupe avec la pause et le
   bouton 🔊, et suit le curseur de volume.

> Pas de musique = pas de musique, tout le reste fonctionne pareil.
> ⚠️ N'utilise **jamais** un MP3 commercial (problèmes de droits sur YouTube).

## 🖼️ Images & miniatures

- Chaque épisode a sa **miniature YouTube** dans `<episode>/img/thumb.jpg`
  (générée par IA, libre de droits) et un fond animé `intro-bg.jpg`
  (effet zoom lent derrière l'intro et l'outro).
- Pour en mettre une sur une scène : ajoute simplement
  `"bg": "img/intro-bg.jpg"` (fond) ou `"img": "..."` (vignette sur un
  écran-titre) dans le JSON de la scène.
- Les **descriptions YouTube prêtes à coller** (titre + chapitres minutés)
  sont dans le dossier `youtube/`.

## 🎞️ Clips « niveau After Effects » (slideshow + logo)

Deux nouveaux types de scènes font le travail de Remotion / FFmpeg,
directement dans le navigateur (puis export via le bouton ⬇) :

```json
{ "type": "logo", "word": "ta marque", "tagline": "ton slogan", "dur": 6 }
```
→ logo **SVG qui se dessine** (stroke-dashoffset) + lettres en stagger.

```json
{ "type": "slideshow", "bpm": 96, "shots": [
    { "img": "img/photo1.jpg", "beats": 4, "kb": "in",       "tr": "whip", "text": "TITRE" },
    { "img": "img/photo2.jpg", "beats": 2, "kb": "in-left",  "tr": "cut"  },
    { "img": "img/photo3.jpg", "beats": 2, "kb": "in-right", "tr": "zoom" },
    { "img": "img/photo4.jpg", "beats": 4, "kb": "up",       "tr": "fade" }
] }
```
- `bpm` : tempo du montage → **choisis une musique au même BPM**
  (la bibliothèque audio YouTube affiche le BPM de chaque morceau)
- `beats` : durée du plan en temps forts (varie 2 et 4 = dynamique, pas diaporama)
- `kb` : mouvement de caméra virtuel (Ken Burns) : `in`, `in-left`, `in-right`, `up`
- `tr` : transition vers le plan suivant : `cut`, `fade`, `whip` (whip-pan +
  motion blur), `zoom` (zoom-through)
- `text` : typo cinétique, lettre par lettre
- Le tout avec grain de film, vignette et bandes cinéma.

Voir `cinema-benin/index.html` pour l'exemple complet (épisode 5).

### 🤝 Comment tu peux aider / personnaliser

1. **Tes photos** : dépose-les dans `<dossier>/img/` et liste-les dans `shots`
   (prends-les en paysage 16:9, assez grandes pour que le zoom reste net).
2. **Ta musique** : un morceau de la bibliothèque audio YouTube, renommé
   `assets/music.mp3`, avec `"bpm"` calé dessus.
3. **Ton logo** : envoie-moi ton logo (ou décris-le) et je te le branche en
   scène `logo` ; un SVG avec des `id` propres s'anime encore mieux.
4. **Tes textes** : change `text`, `word`, `tagline`, les sous-titres.

## 🎥 Astuce pour transformer en vraie vidéo

Lance la page en plein écran (`F`), règle la vitesse si besoin, puis capture
l'écran avec OBS Studio ou la Xbox Game Bar Windows (`Win + G`) en lisant les
sous-titres. Tu obtiens une vidéo montée, sans logiciel de montage.
