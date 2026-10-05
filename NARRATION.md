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

## ÉPISODE 3 — « Travailler en équipe sur GitHub »

| Scène | Fichier | Texte à faire lire |
|---|---|---|
| Intro | s01.mp3 | Épisode 3 ! Aujourd'hui, le vrai sujet : travailler en équipe sur GitHub, sans jamais écraser le travail des autres. |
| Le problème | s02.mp3 | Sans méthode, coder à plusieurs, c'est le chaos : fichiers écrasés, versions partout. Avec GitHub, chacun travaille dans sa branche, et tout fusionne proprement. |
| clone | s03.mp3 | Étape 1 : git clone. Ça télécharge tout le projet sur ton ordinateur, avec tout l'historique. Une seule fois, au début. |
| branche | s04.mp3 | Étape 2 : crée ta branche avec git checkout moins b. Une branche, c'est ta bulle : tu peux tout casser sans rien abîmer. |
| commit | s05.mp3 | Étape 3 : commit. Chaque commit est une photo de ton travail, avec un petit message qui explique ce que tu as fait. |
| push | s06.mp3 | Étape 4 : push. Ta branche part sur GitHub, en sécurité, visible par toute l'équipe. Ton PC peut brûler, rien n'est perdu. |
| pull request | s07.mp3 | Étape 5 : la pull request, ou PR. C'est ta demande officielle : venez voir mon travail, et fusionnez-le. Tout se passe sur GitHub, dans le navigateur. |
| code review | s08.mp3 | Étape 6 : le code review. Un collègue lit ton code, commente, propose. Tu améliores, il approuve. C'est comme ça que toute l'équipe progresse. |
| merge | s09.mp3 | Étape 7 : merge. Le travail validé rejoint la branche principale. Dans le terminal, ou d'un clic sur le bouton vert de GitHub. |
| conflits | s10.mp3 | Et si deux personnes modifient la même ligne ? C'est un conflit. Git te montre les deux versions, tu choisis la bonne, tu commit, et c'est réglé. |
| Récap | s11.mp3 | Le récap : clone, branche, commit, push, pull request, review, merge. Et le réflexe à prendre : git pull chaque matin, pour toujours partir du travail le plus récent. |
| Outro | s12.mp3 | Voilà, tu sais maintenant travailler en équipe sur GitHub. Le meilleur moyen d'apprendre : un vrai projet, à plusieurs. À bientôt ! |

---

## ÉPISODE 4 — « Exercice : ta carte de profil HTML/CSS »

| Scène | Fichier | Texte à faire lire |
|---|---|---|
| Intro | s01.mp3 | Épisode 4, spécial exercice ! On construit ensemble une carte de profil, de zéro, chez toi, en même temps que moi. |
| Préparation | s02.mp3 | Crée un dossier exo-carte, avec deux fichiers : index.html et style.css. Ouvre le dossier dans VS Code, et garde ton navigateur juste à côté. |
| Structure | s03.mp3 | Dans index.html, tape la structure : une div classe carte, une image, un titre, un paragraphe, et un bouton. À droite, le résultat : c'est brut. Normal, il n'y a pas encore de CSS ! |
| Link CSS | s04.mp3 | Relie ta feuille de style avec la balise link, dans le head. Rien ne change encore ? C'est normal : style.css est vide pour l'instant. |
| Fond | s05.mp3 | Premier CSS : un dégradé sur le body, et une police moderne. Sauve avec Ctrl S, et regarde à droite : la page change de couleur en direct. |
| Carte | s06.mp3 | Ensuite la carte : fond blanc, coins arrondis, une ombre portée, du padding, et margin auto pour la centrer. Là, tu vois la carte prendre forme. |
| Avatar | s07.mp3 | L'avatar : 110 pixels de large, et border-radius 50 % pour transformer le carré en rond, avec une bordure colorée. C'est LA astuce des photos de profil. |
| Bouton | s08.mp3 | Et le bouton : fond violet, texte blanc, coins arrondis, cursor pointer. Bonus pro : un effet au survol avec transform scale. Ta carte est terminée, elle est vivante ! |
| Erreur 1 | s09.mp3 | Erreur classique numéro 1 : l'image ne s'affiche pas. Presque toujours un nom de fichier différent : majuscule, extension. Vérifie la casse au pixel près. |
| Erreur 2 | s10.mp3 | Erreur numéro 2 : ton CSS ne s'applique pas du tout. Deux réflexes : as-tu sauvegardé avec Ctrl S ? Et la balise link est-elle bien là, bien écrite, dans le head ? |
| Erreur 3 | s11.mp3 | Erreur numéro 3 : tout casse d'un coup, sans raison apparente. Souvent, c'est une accolade fermante oubliée. VS Code te la montre en rouge : ferme la règle, et tout revient. |
| Défi | s12.mp3 | À toi de jouer : une couleur de ton choix, deux liens réseaux sociaux, et une animation au survol de la carte. Tu as tout ce qu'il faut. |
| Outro | s13.mp3 | Bravo si tu as suivi jusqu'ici ! Ta carte de profil est en ligne. Demain, refais-la de mémoire, sans la vidéo. À bientôt ! |

---

## ÉPISODE 5 — « Docker : les conteneurs »

| Scène | Fichier | Texte à faire lire |
|---|---|---|
| Intro | s01.mp3 | Docker. Un mot que tu entends partout. Et pourtant, l'idée tient en une phrase : expédier ton code comme un conteneur au port de Cotonou. |
| Métaphore | s02.mp3 | Au port de Cotonou, ananas, coton ou électronique : tout voyage dans des conteneurs standardisés. Le navire ne les ouvre pas. Docker, c'est pareil, mais pour ton code. |
| Image vs conteneur | s03.mp3 | Deux mots à retenir. L'image, c'est le modèle : un conteneur scellé, préparé au quai. Le conteneur, c'est ce même conteneur une fois en route. Une image, plusieurs conteneurs. |
| Premier conteneur | s04.mp3 | Installe Docker, puis tape docker run hello-world. Docker récupère une petite image, la lance, et affiche hello. Ton premier conteneur vient de tourner. |
| nginx | s05.mp3 | Plus utile : docker run, moins d, moins p 8080 deux-points 80, nginx. Moins d, c'est en arrière-plan. Moins p, c'est le port 8080 de ta machine vers le port 80 du conteneur. Ouvre localhost 8080 : nginx tourne. |
| Dockerfile | s06.mp3 | Ta propre application ? Écris un Dockerfile. FROM : la base. COPY : ton code. RUN : les installations. CMD : le démarrage. Une recette de cinq lignes, toujours la même. |
| build + run | s07.mp3 | Ensuite, deux commandes. docker build moins t mon-app point : ça fabrique l'image. docker run moins p 3000 deux-points 3000 mon-app : ça la lance. Même résultat sur toutes les machines : c'est ça, la magie. |
| Au quotidien | s08.mp3 | Au quotidien : docker ps montre les conteneurs en route. docker logs lit leurs journaux. docker stop les pose au quai. Simple comme un registre de port. |
| Erreur | s09.mp3 | L'erreur classique : port already in use. Deux conteneurs sur le même quai, impossible. La solution : change le port local, moins p 8081 deux-points 80, et c'est réglé. |
| Outro | s10.mp3 | À toi de jouer : prends ta carte de profil de l'épisode 4, et mets-la dans un conteneur. FROM nginx, COPY tes fichiers, run. Et montre-moi le résultat. À bientôt ! |

---

## Conseils pour la génération externe

- Voix : française, masculine ou feminine selon ton goût, ton « jeune / pédagogue ».
- Vitesse : normale (1×) ; les scènes sont chronométrées pour ce débit.
- Un fichier par scène, noms identiques au tableau → le lecteur n'a rien d'autre à faire.
- Formats acceptés : `.mp3`, `.wav`, `.ogg`, `.m4a` (change juste le champ
  `"audio"` dans le JSON de la vidéo si tu utilises une autre extension).
