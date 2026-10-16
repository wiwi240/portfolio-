# Accueil — comparaison avec la preview du 14 octobre 2026

Référence : [`maquette /preview homepage.png`](../maquette%20/preview%20homepage.png), 813 × 1934 px. C’est la plus récente du dossier et la seule présentant cette composition. Comparaison normalisée à 1440 px de largeur (facteur 1440 / 813). La hauteur résultante de la référence est d’environ 3425 px ; la capture du rendu mesure 3435 px. La superposition à 48 % est dans `comparaison-preview-desktop.png`.

## Modifications de cette révision

- `src/components/home-page.tsx` : introductions FR/EN des Besoins et Prestations, action Projets bleue, panneau Contact disposé comme la preview.
- `src/components/home-illustrations.tsx` : calendrier hebdomadaire, palette et parcours, annotation, quatrième client décoratif et végétaux SVG intégrés aux scènes.
- `src/components/home-page.css` : suppression des cadres des titres, réglage des proportions et placements, cartes Prestations, réalisations, méthode et bas de page compactés. Le `background.png` d’origine est utilisé sans modification binaire, avec des bords fondus pour éviter une coupure horizontale.
- `verification/` : captures finales et superposition de contrôle.

Les modifications déjà présentes dans `src/App.tsx`, `src/components/ui/theme-switch.tsx`, `src/redesign.css` et les captures WebP ont été conservées. Aucun changement de route, de données projets, des autres pages, de la roue des compétences, de la frise ou de l’API.

## Contrôles

- Build (`pnpm run build`) et lint (`pnpm run lint`) réussis ; `git diff --check` réussi.
- Comparaison visuelle à 1440 px par superposition ; contrôle des sections après ajustements successifs.
- Captures FR : 1440 px clair/sombre, 390 et 320 px clair, 390 px sombre ; EN : 390 px clair.
- Aucun débordement horizontal observé à 320, 390, 768, 1024, 1440 et 1920 px ; images chargées.
- Quatre FAQ ouvrables à Entrée, refermables à Espace et focus visible ; menu mobile, thème du header et du footer synchronisés.
- Routes Projets, Expertises, À propos et Contact en FR/EN vérifiées ; liens des cartes vers les destinations existantes. `prefers-reduced-motion` respecté ; aucune erreur JavaScript dans les parcours contrôlés.
- `background.png` comparé à l’original : fichiers identiques.

## Captures

- [Desktop clair](accueil-desktop-clair.png) · [Desktop sombre](accueil-desktop-sombre.png) · [Superposition avec la preview](comparaison-preview-desktop.png)
- [Hero](hero-desktop.png) · [Besoins](besoins-desktop.png) · [Prestations](prestations-desktop.png) · [Méthode](methode-desktop.png)
- [Mobile clair](accueil-mobile-clair.png) · [Mobile sombre](accueil-mobile-sombre.png) · [Mobile EN](home-mobile-en.png)

## Écarts visuels restants

- Les illustrations lumineuses à rendu 3D de la preview (produits, plantes, cartes flottantes et tableaux de méthode) n’existent pas comme assets indépendants dans le dépôt. Les interfaces HTML/CSS et les végétaux SVG restent détaillés et proches en composition, mais leurs textures, éclairages et profondeurs ne sont pas identiques à l’image.
- Les portraits circulaires de la colonne Clients du Hero ne sont pas fournis ; les avatars décoratifs utilisent des initiales. Aucune personne réelle n’a été attribuée à ces données fictives.
- Les libellés juridiques existent dans les traductions, mais aucune destination ou page légale n’est configurée. Le footer conserve les liens existants sans inventer d’URL.
- Le dossier comporte une preview basse résolution (813 px) sans fichiers source des illustrations. La correspondance des détails d’interface ne peut donc pas être au pixel près sans ces assets.

Aucun déploiement ni changement de production.
