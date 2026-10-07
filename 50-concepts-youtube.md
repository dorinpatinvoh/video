# 🎬 50 concepts à expliquer sur YouTube

> **Phase 1 : sélection des sujets.** Aucun code écrit (comme demandé 😉) — on choisit d'abord *quoi raconter*,
> ensuite on écrira les scripts, et seulement après on codera.

**Mode d'emploi**
- 10 catégories × 5 concepts = **50 idées de vidéos**, toutes autour du code / de l'informatique.
- Chaque concept a : un **titre** prêt à l'emploi, un **pitch** (ce qu'on explique), un **format** estimé.
- Les cases `- [ ]` servent de **suivi de production** : on coche quand la vidéo est sortie.

**Légende :** 🟢 débutant · 🟡 intermédiaire · 🔴 avancé · 📼 vidéo longue (10–20 min) · ⚡ short (≤ 60 s) · 📚 série potentielle

---

## 1. Les fondamentaux qu'on croit connaître

- [ ] **01 · Les variables** — *« x = 5 : ce que ton ordinateur fait vraiment »*
  Pitch : `=` n'est pas une égalité mais une affectation ; une variable est une étiquette collée sur une case mémoire ; pourquoi confondre maths et code fait buguer les débutants.
  `📼 10 min · 🟢 Débutant`

- [ ] **02 · Les boucles** — *« Pourquoi ta boucle infinie fait ramer ton PC »*
  Pitch : ce qui se passe à chaque itération, pourquoi le CPU monte à 100 %, comment reconnaître et arrêter une boucle qui ne s'arrête jamais.
  `📼 10 min · 🟢 Débutant`

- [ ] **03 · Les fonctions** — *« Une fonction, c'est une usine : entrées, sortie, effets de bord »*
  Pitch : paramètres, valeur de retour, pourquoi une fonction qui "modifie le monde extérieur" crée des bugs invisibles ; découper pour comprendre.
  `📼 12 min · 🟢 Débutant`

- [ ] **04 · Les nombres à virgule** — *« Pourquoi 0.1 + 0.2 ≠ 0.3 »*
  Pitch : le binaire ne sait pas représenter 0.1 exactement ; précision, arrondis, et le cas dangereux : l'argent (indice : on compte en centimes).
  `📼 10 min · 🟢 Débutant`

- [ ] **05 · Les caractères et l'encodage** — *« Pourquoi ton emoji 😅 prend 4 octets »*
  Pitch : ASCII, Unicode, UTF-8 ; pourquoi « Café » devient « CafÃ© » ; ce qui casse quand un fichier est mal encodé.
  `📼 12 min · 🟡 Intermédiaire`

## 2. Structures de données & algorithmes

- [ ] **06 · Tableaux vs listes chaînées** — *« Ajouter au début d'une liste : parfois instantané, parfois très lent »*
  Pitch : mémoire contiguë (accès instantané, insertion coûteuse) vs éléments chaînés (insertion facile, parcours lent) ; comment choisir.
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **07 · Les tables de hachage** — *« La structure cachée qui fait tourner Google (et ton `dict`) »*
  Pitch : une fonction magique transforme une clé en adresse ; collisions, performance O(1), et où elles se cachent partout (objets, caches, index).
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **08 · La récursion** — *« La récursion expliquée sans migraine (avec des poupées russes) »*
  Pitch : une fonction qui s'appelle elle-même, le cas de base, la pile d'appels qui déborde ; quand l'utiliser et quand l'éviter.
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **09 · La complexité (Big-O)** — *« Pourquoi ton code rame : Big-O sans une seule formule »*
  Pitch : mesurer la *croissance* du temps de calcul, pas les secondes ; O(1), O(n), O(n²) illustrés ; reconnaître le code qui ne passera pas à l'échelle.
  `📼 15 min · 🟡 Intermédiaire`

- [ ] **10 · Les graphes et l'algorithme de Dijkstra** — *« Comment ton GPS trouve le chemin le plus court »*
  Pitch : modéliser des points et des routes, explorer intelligemment en tenant compte des distances ; la même idée sert dans les jeux vidéo.
  `📼 18 min · 🟡 Intermédiaire`

## 3. Sous le capot : comment ça marche vraiment

- [ ] **11 · Compilation vs interprétation** — *« Ton code ne s'exécute pas : il est traduit »*
  Pitch : du texte lisible à la machine ; pourquoi Python et JavaScript sont dits « lents », bytecode, machine virtuelle, compilation à la volée (JIT).
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **12 · Pile et tas (stack & heap)** — *« Où vivent vraiment tes variables »*
  Pitch : la pile rapide des appels de fonctions vs le tas flexible des objets ; pourquoi on obtient un « stack overflow » et où se cachent les fuites mémoire.
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **13 · Le ramasse-miettes (garbage collector)** — *« Qui nettoie ta mémoire pendant que tu dors ? »*
  Pitch : détecter ce qui n'est plus utilisé, le supprimer sans bloquer le programme ; pourquoi il existe encore des fuites mémoire malgré lui.
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **14 · Concurrence & parallélisme** — *« Ton code fait UNE chose à la fois (et comment y remédier) »*
  Pitch : faire semblant de tout faire en même temps (concurrence) vs utiliser plusieurs cœurs (parallélisme) ; threads, interblocages, données partagées.
  `📼 15 min · 🔴 Avancé`

- [ ] **15 · Le cache du processeur** — *« Cette boucle est 100× plus rapide… pour une raison invisible »*
  Pitch : la mémoire est lente comparée au CPU ; accéder aux données dans le bon ordre change tout ; la ligne la plus importante de ta vidéo, invisible dans le code.
  `📼 12 min · 🔴 Avancé`

## 4. Web & réseau

- [ ] **16 · Le trajet d'une URL** — *« Que se passe-t-il quand tu tapes une URL ? »*
  Pitch : DNS, connexion TCP, poignée de main TLS, requête HTTP, réponse, affichage — le voyage complet en un schéma, la vidéo « classique » du genre.
  `📼 18 min · 🟢 Débutant`

- [ ] **17 · Les codes HTTP** — *« 404, 500, 418 : le langage secret du web »*
  Pitch : les familles 2xx/3xx/4xx/5xx, la différence entre 401 et 403, les redirections, et pourquoi respecter ces codes rend tes APIs meilleures.
  `📼 10 min · 🟢 Débutant`

- [ ] **18 · Les APIs REST** — *« C'est quoi une API ? (expliqué avec un restaurant) »*
  Pitch : demander à un serveur sans connaître la cuisine ; ressources, verbes (GET/POST…), appels sans mémoire, versionner pour ne rien casser.
  `📼 12 min · 🟢 Débutant`

- [ ] **19 · Les WebSockets** — *« Comment un chat affiche les messages instantanément »*
  Pitch : la requête qui attend une réponse vs le canal laissé ouvert ; pourquoi HTTP ne sait pas faire du temps réel et comment on contourne ça.
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **20 · CORS** — *« L'erreur CORS : pourquoi elle existe (spoiler : c'est fait exprès) »*
  Pitch : le navigateur protège tes utilisateurs ; même origine, autorisations, requêtes « preflight » ; enfin comprendre le message d'erreur le plus maudit du web.
  `📼 12 min · 🟡 Intermédiaire`

## 5. Bases de données

- [ ] **21 · SQL vs NoSQL** — *« SQL ou NoSQL ? Comment choisir sans dogme »*
  Pitch : relationnel, documents, clé-valeur ; schéma strict vs flexible, scalabilité, et pourquoi la bonne réponse est souvent « ça dépend » (avec des critères).
  `📼 14 min · 🟢 Débutant`

- [ ] **22 · Les index** — *« Ta requête est lente : il te manque juste un index »*
  Pitch : ranger une table comme un annuaire pour trouver sans tout parcourir ; l'arbre B dessiné ; pourquoi chaque index accélère la lecture mais ralentit l'écriture.
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **23 · Les transactions (ACID)** — *« Comment une banque ne perd jamais ton argent »*
  Pitch : tout ou rien (atomicité), cohérence, isolation, durabilité ; le virement qui doit débiter ET créditer, sinon retour à l'état initial.
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **24 · La modélisation des données** — *« Les 3 erreurs de schéma que font tous les débutants »*
  Pitch : redondances, données contradictoires, colonnes fourre-tout ; les formes normales vulgarisées, et quand dénormaliser exprès.
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **25 · Les migrations** — *« Faire évoluer une base en production sans tout casser »*
  Pitch : le schéma est un code comme un autre, il se versionne ; migrations réversibles, et le drame des modifications de colonnes sur une base vivante.
  `📼 13 min · 🟡 Intermédiaire`

## 6. Sécurité

- [ ] **26 · Hasher les mots de passe** — *« Ne stocke JAMAIS les mots de passe comme ça »*
  Pitch : hash ≠ chiffrement ; le sel, les tables arc-en-ciel, pourquoi MD5 et SHA-1 sont morts ; bcrypt et Argon2 sans jargon.
  `📼 12 min · 🟢 Débutant`

- [ ] **27 · HTTPS / TLS** — *« Le cadenas de ton navigateur : que se passe-t-il vraiment ? »*
  Pitch : comment deux inconnus se mettent d'accord sur une clé secrète en public ; chiffrement asymétrique puis symétrique, certificats et autorités.
  `📼 15 min · 🟡 Intermédiaire`

- [ ] **28 · Les 3 failles web** — *« Je hacke mon propre site (et je te montre comment m'en empêcher) »*
  Pitch : injection SQL, XSS, CSRF — le principe de chacune avec des entrées de fausses données, puis la contre-mesure en trois principes simples.
  `📼 18 min · 🟡 Intermédiaire`

- [ ] **29 · Sessions vs JWT** — *« JWT : le token préféré des devs… et des pirates »*
  Pitch : mémoire côté serveur vs passe signé ; expiration, révocation, où le stocker ; les erreurs classiques qui transforment un bon outil en passoire.
  `📼 15 min · 🟡 Intermédiaire`

- [ ] **30 · Les secrets** — *« J'ai trouvé ta clé API sur GitHub »*
  Pitch : la chasse aux secrets dans le code ; variables d'environnement, historique Git qui garde tout, rotation des clés, moindre privilège.
  `📼 12 min · 🟢 Débutant`

## 7. Bonnes pratiques & outils

- [ ] **31 · Git sous le capot** — *« Git n'est pas ce que tu crois (branches = pointeurs) »*
  Pitch : des instantanés, pas des différences ; les 3 zones (travail, index, historique) ; une branche c'est juste une étiquette ; merge vs rebase.
  `📼 15 min · 🟡 Intermédiaire`

- [ ] **32 · Les tests** — *« Écrire des tests, c'est perdre 1 heure pour en gagner 20 »*
  Pitch : un test est un exemple qui se rejoue tout seul ; la pyramide unitaire/intégration/bout-en-bout ; couverture ≠ qualité ; TDD en 5 minutes.
  `📼 14 min · 🟢 Débutant`

- [ ] **33 · Docker et les conteneurs** — *« Conteneur vs machine virtuelle : la différence en 12 minutes »*
  Pitch : emballer l'application avec son environnement ; isolation légère avec noyau partagé ; pourquoi « ça marche chez moi » devient enfin obsolète.
  `📼 12 min · 🟢 Débutant`

- [ ] **34 · Le débogage** — *« Comment débogue un dev senior (méthode, pas magie) »*
  Pitch : reproduire, réduire, formuler des hypothèses, vérifier ; lire une erreur en entier ; l'art de chercher la cause au lieu de changer du code au hasard.
  `📼 14 min · 🟢 Débutant`

- [ ] **35 · La dette technique** — *« Ton code "sale" n'est pas un échec : la dette technique expliquée »*
  Pitch : emprunter de la vitesse pour livrer, puis payer des intérêts sous forme de ralentissements ; quand et comment rembourser ; comment l'expliquer hors du code.
  `📼 12 min · 🟢 Débutant`

## 8. Les concepts qui débloquent tout

- [ ] **36 · Les fermetures (closures)** — *« Les closures : la notion qui débloque tout le reste »*
  Pitch : une fonction qui se souvient de son environnement même après la fin de la fonction qui l'a créée ; compteurs, callbacks, encapsulation.
  `📼 14 min · 🟡 Intermédiaire`

- [ ] **37 · L'event loop et l'asynchrone** — *« Pourquoi `await` débloque tout : la boucle d'événements expliquée »*
  Pitch : une seule boucle qui distribue le travail ; pourquoi attendre n'arrête pas le programme ; promesses, callbacks, et le retour du « callback hell ».
  `📼 16 min · 🟡 Intermédiaire`

- [ ] **38 · Valeur vs référence** — *« Deux variables, un seul objet : le bug fantôme »*
  Pitch : copie de la valeur ou copie de l'adresse ; pourquoi modifier un objet « en passant » casse du code ailleurs ; immutabilité au secours.
  `📼 12 min · 🟡 Intermédiaire`

- [ ] **39 · Les design patterns** — *« 3 design patterns qui remplacent 300 lignes de `if` »*
  Pitch : stratégie (une famille d'algorithmes interchangeables), fabrique, observateur ; les patterns comme vocabulaire commun, pas comme magie.
  `📼 16 min · 🔴 Avancé`

- [ ] **40 · Couplage et cohésion** — *« Pourquoi ton projet devient ingérable »*
  Pitch : chaque morceau bien enfermé dans son rôle, qui dépend du minimum ; le principe SOLID le plus rentable expliqué sur un exemple concret.
  `📼 14 min · 🟡 Intermédiaire`

## 9. IA & modernité

- [ ] **41 · Les embeddings** — *« Comment une IA sait que "chat" et "félin" sont proches (sans dictionnaire) »*
  Pitch : transformer mots et phrases en points dans l'espace ; proximité = sens ; la même mécanique pour la recherche, la recommandation et le RAG.
  `📼 13 min · 🟢 Débutant`

- [ ] **42 · Les tokens** — *« Une IA ne lit pas des mots : la tokenisation expliquée »*
  Pitch : découper le texte en morceaux ; pourquoi un mot rare coûte plus cher, pourquoi le compteur de contexte est limité, et pourquoi les IA sont nulles en calcul mental.
  `📼 12 min · 🟢 Débutant`

- [ ] **43 · Comment fonctionne ChatGPT** — *« Ce qui se passe dans ChatGPT quand tu écris "Bonjour" »*
  Pitch : un modèle entraîné à prédire la suite du texte ; l'attention qui relie les mots entre eux ; pourquoi « comprendre » est un raccourci de langage.
  `📼 16 min · 🟡 Intermédiaire`

- [ ] **44 · Le RAG** — *« Comment donner tes propres documents à une IA »*
  Pitch : découper ses documents, les vectoriser, retrouver les passages utiles, puis les glisser dans la question ; pourquoi c'est plus simple que réentraîner un modèle.
  `📼 15 min · 🟡 Intermédiaire`

- [ ] **45 · Les hallucinations** — *« Pourquoi l'IA invente (et comment l'en empêcher) »*
  Pitch : un modèle optimise une réponse plausible, pas la vérité ; les garde-fous : sources, vérification, outils externes, questions bien posées.
  `📼 12 min · 🟢 Débutant`

## 10. Fun, challenges & gros projets

- [ ] **46 · Un jeu jouable en 30 minutes** — *« Je code un jeu jouable en 30 minutes (tu peux le faire aussi) »*
  Pitch : la boucle de jeu, les entrées clavier, les collisions, le score ; une démo de A à Z pour donner l'envie de créer plutôt que consommer.
  `📼 20 min · 🟢 Débutant`

- [ ] **47 · 3 mini-projets en 10 lignes** — *« 3 outils utiles en 10 lignes de code chacun »*
  Pitch : montrer que créer est accessible ; trois petits programmes complets (générateur, minuteur, petit script du quotidien) et où les réutiliser.
  `📼 12 min · 🟢 Débutant`

- [ ] **48 · Les bugs qui ont coûté des millions** — *« Ce bug a coûté 500 millions de dollars »*
  Pitch : Ariane 5 (débordement de nombre), Mars Climate Orbiter (unités mélangées), Therac-25, Cloudflare (une expression régulière qui coupe Internet) ; ce qu'on apprend.
  `📼 16 min · 🟢 Débutant · 📚 Série`

- [ ] **49 · Recoder un outil connu de zéro** — *« Je recode [outil du quotidien] from scratch (et voilà ce que 99 % des devs ignorent) »*
  Pitch : écrire la version minimale d'un outil qu'on utilise tous les jours (serveur HTTP, Git, shell) pour comprendre ce que cache l'abstraction.
  `📼 20 min+ · 🔴 Avancé · 📚 Série`

- [ ] **50 · Les concepts niveau entretien** — *« 7 concepts que tout dev doit savoir expliquer en 2 minutes »*
  Pitch : récapitulatif sous forme de questions d'entretien (hash map, async, index, TLS…) ; format « prépare ton entretien » et porte d'entrée vers les autres vidéos.
  `📼 18 min · 🟡 Intermédiaire · 📚 Série`

---

## 🚀 Si on commence demain : la saison 1 (10 vidéos)

Ordre de publication conseillé pour lancer la chaîne — on alterne les « gros hits » grand public, les fondamentaux qui fidélisent, et la pratique :

| # | Concept | Pourquoi dans la saison 1 |
|---|---------|---------------------------|
| 1 | 16 · Le trajet d'une URL | Le sujet qui intéresse même les non-devs → vidéo de lancement |
| 2 | 01 · Les variables | On apprend à qui s'adresse la chaîne |
| 3 | 26 · Hasher les mots de passe | Très recherché + utile immédiatement |
| 4 | 09 · Big-O | Le déclic pour beaucoup de débutants |
| 5 | 36 · Les closures | Le concept « wahou » qui montre le niveau |
| 6 | 22 · Les index | Problème réel vécu par tous les devs |
| 7 | 37 · L'event loop | Sujet culte, gros potentiel de commentaires |
| 8 | 27 · HTTPS / TLS | Suite logique de la vidéo n°1 |
| 9 | 46 · Le jeu en 30 minutes | Vidéo « feel good » + preuve qu'on construit |
| 10 | 43 · Comment fonctionne ChatGPT | Vague IA, nouvelle audience |

**Rythme conseillé**
- 1 vidéo longue par semaine (10–20 min), toujours le même jour, même heure.
- 2 à 3 shorts dérivés de chaque longue (une question, une erreur fréquente, une démo de 30 s).
- Enregistrer les concepts 26, 17 et 45 en shorts « seul » : ils tiennent en 60 secondes.

## 💡 Réserve : 10 concepts bonus (si on en veut plus)

- [ ] **B1 · Les expressions régulières** — *« La ligne de code qui fait peur à tout le monde »*
- [ ] **B2 · Le CI/CD** — *« Du commit à la production, sans humain »*
- [ ] **B3 · Le cache et les CDN** — *« Pourquoi ce site s'ouvre plus vite depuis New York »*
- [ ] **B4 · Le versionnage sémantique** — *« Pourquoi 1.0.0 n'est pas 0.9.9 »*
- [ ] **B5 · Le profilage** — *« Ton intuition sur la performance est fausse »*
- [ ] **B6 · Monolithe vs microservices** — *« Découper trop tôt : la faute classique »*
- [ ] **B7 · L'accessibilité web** — *« Ton site est inutilisable pour 15 % des gens »*
- [ ] **B8 · Le voyage d'un email** — *« Pourquoi tes messages finissent en spam »*
- [ ] **B9 · Le chiffrement de bout en bout** — *« Comment WhatsApp jure qu'il ne peut pas te lire »*
- [ ] **B10 · WebAssembly** — *« Faire tourner du C++ dans ton navigateur »*

---

**Prochaine étape :** tu choisis les concepts à garder (ou dis-moi quelle catégorie pousser plus loin) → on écrit les scripts → puis on code. 😉
