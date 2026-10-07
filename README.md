# Atelier de montage video

Chaine de montage ffmpeg prete a l'emploi dans cet espace de travail.

## Workflow

1. Tu deposes ta video dans [`incoming/`](incoming/README.md) et tu push
   (ou tu la joins directement dans la conversation).
2. Tu me decris le montage voulu.
3. Je monte, j'exporte dans `output/`, je commit et je push.
4. Tu recuperes avec `git pull`.

## Ce qui est installe

- **ffmpeg 7.0.2** (build statique) — `bin/setup.sh` le (re)installe si besoin.
- Encodeurs : `libx264`, `libx265`, `libvpx-vp9`, `aac`, `libmp3lame`, `gif`
- 494 filtres dont : `crop`, `scale`, `xfade`, `concat`, `overlay`, `zoompan`,
  `fade`, `loudnorm`, `atempo`, `vidstabdetect/transform`, `subtitles` (libass)

```bash
bash bin/setup.sh        # prepare bin/ffmpeg
bin/ffmpeg -i incoming/ma_video.mp4   # lire les infos d'un fichier
```

## Ce que je peux faire

| Categorie | Exemples |
|---|---|
| Decoupe | trim, suppression de passages, concat de plusieurs clips |
| Format | recadrage 9:16 / 1:1 / 16:9, resize, letterbox, rotation |
| Rythme | accelere / ralenti (video + audio), freeze frame, boucle |
| Texte | titres, sous-titres incrustes, lower thirds (via ASS/libass) |
| Visuel | fades, cross-fades, zoom-pan (effet Ken Burns), filtres couleur, LUT, flou, stabilisation |
| Audio | musique de fond, ducking, normalisation loudness (-14 LUFS), fade, mute, extraction |
| Incrustation | logo / watermark, picture-in-picture, bandeaux |
| Export | MP4 H.264, WebM, GIF, extraction de frames, vignettes |

## Ce que je ne peux pas faire

- Pas de **drawtext** natif (pas de freetype dans ce build) → le texte passe par
  des sous-titres ASS, ce qui donne en pratique plus de controle de style.
- Pas de montage "au feeling" sur le contenu : je ne vois pas la video en
  continu. Je peux en extraire des frames pour verifier, mais pour des coupes
  precises donne-moi des **timecodes**.
- Pas de generation de musique. Fournis la piste audio si tu en veux une.
- Polices disponibles : DejaVu Sans / Serif / Mono uniquement (depose un `.ttf`
  dans `work/fonts/` si tu veux ta propre police).

## Exemple de demande ideale

> Coupe de 00:12 a 01:45, passe en 9:16 centre, titre "Episode 3" les
> 3 premieres secondes, fondu au noir a la fin, normalise le son, export MP4.

## Demo

`output/demo_9x16.mp4` — test de la chaine : trim, recadrage 9:16 1080x1920,
titres incrustes, fades video/audio, normalisation loudness, H.264 + AAC.

## Arborescence

```
bin/        outils (setup.sh, symlink ffmpeg)
incoming/   tes rushes (gitignore, ajouter avec git add -f)
output/     les exports que je te renvoie
work/       fichiers intermediaires (gitignore)
```
