# 🎙️ Textes de narration (voix off)

Texte exact lu par la voix off de chaque vidéo = les sous-titres de chaque scène,
mis bout à bout. La voix est générée automatiquement scène par scène dans
`<dossier-video>/audio/sXX.mp3` et le lecteur la lance tout seul, calée sur
l'animation.

> Tu veux une autre voix ? Copie les textes ci-dessous dans l'outil IA de ton
> choix (ElevenLabs, Clipchamp, Edge TTS, Play.ht…), choisis une voix française
> chaleureuse et dynamique, puis remplace les fichiers
> `<dossier-video>/audio/sXX.mp3` en gardant les mêmes noms.

---

## ÉPISODE 1 — « 20 commandes Linux à connaître »

| Scène | Fichier | Texte à faire lire |
|---|---|---|
| Intro | s01.mp3 | Salut ! Dans cette vidéo, on découvre 20 commandes Linux indispensables quand on débute dans le terminal. C'est parti ! |
| pwd | s02.mp3 | Numéro 1 : pwd. Elle affiche le dossier où tu te trouves actuellement. C'est ton point de repère : pwd répond à la question « je suis où ? » |
| ls | s03.mp3 | Numéro 2 : ls. Elle liste les fichiers et dossiers du répertoire courant. Avec l'option -l, on voit les permissions, le propriétaire et la taille. |
| cd | s04.mp3 | Numéro 3 : cd, pour « change directory » : se déplacer. cd Documents entre dans le dossier, et cd .. remonte d'un niveau. |
| mkdir | s05.mp3 | Numéro 4 : mkdir crée un nouveau dossier. mkdir projets crée le dossier projets, là où tu te trouves. |
| touch | s06.mp3 | Numéro 5 : touch crée un fichier vide en une seconde. Pratique pour démarrer un fichier sans ouvrir d'éditeur. |
| cp | s07.mp3 | Numéro 6 : cp copie des fichiers ou des dossiers. Avec l'option -r, on copie un dossier entier, récursivement. |
| mv | s08.mp3 | Numéro 7 : mv déplace des fichiers d'un dossier à l'autre. mv sert aussi à renommer : mv ancien.txt nouveau.txt. |
| rm | s09.mp3 | Numéro 8 : rm supprime des fichiers ou des dossiers. Attention : c'est définitif, il n'y a pas de corbeille ! |
| cat | s10.mp3 | Numéro 9 : cat affiche le contenu d'un fichier, directement. Astuce : cat fichier1 fichier2 affiche les deux à la suite. |
| tail | s11.mp3 | Numéro 10 : tail affiche la fin d'un fichier, parfait pour les logs. Avec tail -f, l'affichage se met à jour en temps réel. |
| grep | s12.mp3 | Numéro 11 : grep cherche un mot dans un fichier ou une sortie. Ultra puissante combinée à d'autres commandes avec le pipe. |
| find | s13.mp3 | Numéro 12 : find retrouve des fichiers par nom, taille, date… Le point signifie : chercher ici, dans le dossier courant. |
| echo | s14.mp3 | Numéro 13 : echo affiche du texte dans le terminal. Avec le chevron, on redirige ce texte dans un fichier. |
| man | s15.mp3 | Numéro 14 : man, c'est le mode d'emploi de n'importe quelle commande. En cas de doute : man nom-de-la-commande, puis q pour quitter. |
| sudo | s16.mp3 | Numéro 15 : sudo exécute une commande en administrateur. On te demande ton mot de passe, et la commande a tous les droits. |
| chmod | s17.mp3 | Numéro 16 : chmod modifie les permissions d'un fichier. Ici, plus x rend le script exécutable, pour pouvoir le lancer. |
| df | s18.mp3 | Numéro 17 : df affiche l'espace disque libre de tes partitions. L'option -h rend l'affichage lisible : en giga ou méga octets. |
| du | s19.mp3 | Numéro 18 : du mesure la place prise par un dossier. -s pour le total, -h pour un affichage lisible. |
| ps | s20.mp3 | Numéro 19 : ps liste les programmes en cours d'exécution. Le pipe envoie le résultat vers grep pour filtrer. |
| tar | s21.mp3 | Numéro 20 : tar crée des archives compressées. -czf pour compresser, -xzf pour extraire. Bravo, c'est fini ! |
| Récap | s22.mp3 | Petit récap : garde cette liste sous la main, elle couvre 90 % de ce que tu feras dans un terminal. Le secret, c'est la pratique : ouvre un terminal et essaie ! |
| Outro | s23.mp3 | Voilà, tu connais maintenant 20 commandes essentielles. Si cette vidéo t'a aidé, lâche un pouce bleu et abonne-toi. À bientôt ! |

---

## ÉPISODE 2 — « HTML & CSS : les bases »

| Scène | Fichier | Texte à faire lire |
|---|---|---|
| Intro | s01.mp3 | Deuxième épisode ! Aujourd'hui, les bases du HTML et du CSS, les deux langages qui fabriquent toutes les pages web. |
| Deux rôles | s02.mp3 | Le HTML décrit la structure : c'est le squelette de la page. Le CSS décrit l'apparence : couleurs, tailles, animations. Du HTML sans CSS, c'est moche. Du CSS sans HTML, ça ne sert à rien ! |
| Page HTML | s03.mp3 | Voici une page HTML complète. Il n'y a rien de plus. Chaque élément est entouré de balises : h1 pour le titre, p pour le texte. Le head contient les informations, le body contient ce qu'on affiche. |
| Règle CSS | s04.mp3 | Une règle CSS, c'est trois choses : un sélecteur, une propriété, une valeur. Le sélecteur choisit l'élément visé : ici, tous les titres h1. La propriété dit quoi changer, la valeur dit comment. Ici : en rouge tomate. |
| Exemple | s05.mp3 | Un exemple concret : on stylise notre titre h1. En trois lignes, il devient bleu, très grand, et centré. C'est ça, le CSS : des petites règles qui s'empilent. |
| Box model | s06.mp3 | Concept clé : chaque élément HTML est une boîte. De l'intérieur vers l'extérieur : le contenu, le padding, la bordure, la marge. Comprendre ça, c'est déjà 50 % du CSS maîtrisé ! |
| Flexbox | s07.mp3 | Le flexbox permet d'aligner des éléments sans prise de tête. display flex, et les enfants du conteneur s'alignent tout seuls. gap gère l'espace entre eux, justify-content les centre. |
| Récap | s08.mp3 | Le récap : dix notions qui couvrent déjà énormément de situations. Le meilleur exercice : modifier les valeurs et regarder ce qui change. C'est comme ça qu'on apprend le plus vite. |
| Outro | s09.mp3 | Voilà, tu as les bases du HTML et du CSS. Crée ta première page dès aujourd'hui. À bientôt pour l'épisode 3 ! |

---

## Conseils pour la génération externe

- Voix : française, masculine ou feminine selon ton goût, ton « jeune / pédagogue ».
- Vitesse : normale (1×) ; les scènes sont chronométrées pour ce débit.
- Un fichier par scène, noms identiques au tableau → le lecteur n'a rien d'autre à faire.
- Formats acceptés : `.mp3`, `.wav`, `.ogg`, `.m4a` (change juste le champ
  `"audio"` dans le JSON de la vidéo si tu utilises une autre extension).
