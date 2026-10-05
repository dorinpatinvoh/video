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

Optionnel — serveur local (pratique pour le rechargement à chaud) :

```powershell
python -m http.server 8000
# puis ouvre http://localhost:8000
```

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
| 3 | **Travailler en équipe sur GitHub** | 3:00 | violet GitHub |

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

## 🎥 Astuce pour transformer en vraie vidéo

Lance la page en plein écran (`F`), règle la vitesse si besoin, puis capture
l'écran avec OBS Studio ou la Xbox Game Bar Windows (`Win + G`) en lisant les
sous-titres. Tu obtiens une vidéo montée, sans logiciel de montage.
