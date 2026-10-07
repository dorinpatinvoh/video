# Polices (optionnel mais recommandé)

Le rendu fonctionne **sans** ces fichiers (fallback système `system-ui` / `ui-monospace`).
Pour un rendu strictement conforme au STANDARD 2026, déposez ici :

| Fichier | Police | Usage | Où la trouver |
|---------|--------|-------|---------------|
| `Inter-Regular.woff2` | Inter 400 | corps d'interface, sous-titres | [rsms.me/inter](https://rsms.me/inter/) |
| `Inter-Medium.woff2` | Inter 500 | corps UI, valeurs | idem |
| `Inter-Bold.woff2` | Inter 700–800 | hooks, titres plein cadre | idem |
| `JetBrainsMono-Regular.woff2` | JetBrains Mono 400 | code, terminal | [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) |
| `JetBrainsMono-Medium.woff2` | JetBrains Mono 500 | code, badges | idem |

Puis décommentez le bloc `@font-face` en haut de `src/styles.css`.

> Les polices ne sont pas versionnées ici (licences respectives : SIL OFL pour Inter et JetBrains Mono,
> libres d'usage y compris commercial — mais vous préférez peut-être les télécharger vous-même).

Sans ces fichiers, l'aperçu utilise les polices système : la mise en page, les tailles et les
animations restent identiques, seule la typographie diffère légèrement.
