# incoming/ — depose tes rushes ici

Mets ta ou tes videos dans ce dossier, commit, push sur la branche
`arena/98f9458b-video`, et dis-moi ce que tu veux comme montage.

```bash
cp ~/Desktop/ma_video.mp4 incoming/
git add -f incoming/ma_video.mp4
git commit -m "ajout rush"
git push origin arena/98f9458b-video
```

Le `-f` est necessaire : `incoming/` est gitignore par defaut pour eviter
de versionner des gros fichiers par accident.

## Limites a connaitre

| Contrainte | Valeur |
|---|---|
| Taille max par fichier (GitHub) | **100 Mo** (bloque au-dela) |
| Taille confortable | < 80 Mo |
| Au-dela | compresse avant, ou passe par un lien de telechargement |

Pour compresser avant d'envoyer :
```bash
ffmpeg -i gros.mov -vf scale=-2:1080 -c:v libx264 -crf 24 -preset fast -c:a aac -b:a 128k petit.mp4
```

## Alternative plus simple

Tu peux aussi **joindre directement le fichier dans la conversation** :
il arrive dans l'espace de travail et je le recupere sans passer par git.
