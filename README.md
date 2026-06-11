# Portfolio William Mahi

## Objectif du projet

Ce dépôt contient un portfolio personnel construit comme une petite application web complète, pas comme une simple page statique.

Le vrai besoin résolu est double :

- présenter clairement le profil, la stack et les projets ;
- offrir un point de contact via une API dédiée.

Le scope reste volontairement simple. C'est un bon choix pour un portfolio : l'objectif n'est pas de démontrer une architecture complexe, mais une base lisible, maintenable et crédible.

## Ce que contient réellement le projet

Le projet est organisé comme un workspace `pnpm` avec deux responsabilités séparées :

- un front-end React + TypeScript + Vite ;
- un back-end Node.js + Express pour les routes API.

Cette séparation est pertinente. Pour un portfolio avec formulaire de contact, mélanger toute la logique dans le front aurait été plus rapide à court terme, mais moins propre dès qu'il faut gérer validation, stockage, sécurité minimale et déploiement.

## Stack technique observée

- Front-end : React 19, TypeScript, Vite
- UI : Tailwind v4, composants UI maison, `motion`, `lucide-react`, `react-icons`
- Back-end : Node.js, Express 5
- Base de données : PostgreSQL via `pg`
- Outil de package : `pnpm`
- Déploiement : Vercel

Point important : le projet déclare Node `24.x`. C'est cohérent si ton environnement et ton hébergeur suivent cette version. Sinon, c'est un point de compatibilité à surveiller.

## Architecture

### 1. Front-end

Le front vit dans `src/`.

Responsabilités principales :

- `src/App.tsx` : composition de la page principale, gestion du contenu bilingue FR/EN, structure des sections ;
- `src/components/ui/` : composants de présentation et effets visuels ;
- `src/lib/` : utilitaires front ;
- `src/assets/` : ressources statiques.

Le front utilise un alias `@` qui pointe vers `src`. C'est un bon compromis : il simplifie les imports sans introduire de couche d'abstraction inutile.

### 2. Back-end

Le back vit dans `backend/src/index.js`.

Responsabilités observées :

- initialisation Express ;
- chargement des variables d'environnement ;
- configuration CORS avec liste d'origines autorisées ;
- validation du payload du formulaire de contact ;
- limitation simple du nombre de requêtes ;
- stockage des messages ;
- route de santé ;
- gestion des erreurs et des routes inconnues.

Le back expose principalement :

- `GET /api/health`
- `POST /api/contact`

### 3. Adaptation Vercel

Le dossier `api/` sert de point d'entrée pour Vercel et redirige vers l'application Express existante.

L'idée est saine : tu gardes une seule logique métier dans le backend, et tu exposes cette logique via Vercel sans dupliquer les routes.

## Fonctionnement du stockage

Le comportement du back dépend de la présence de `DATABASE_URL`.

En local, si la base n'est pas configurée :

- le serveur continue à fonctionner ;
- les messages de contact sont stockés en mémoire ;
- les données sont donc temporaires.

En production :

- l'intention du code est claire : la base doit être disponible ;
- sans base, le mode mémoire n'est pas une solution acceptable de long terme.

C'est une bonne décision produit. Un portfolio peut tolérer un fallback mémoire en développement, mais pas en production si le formulaire de contact a une vraie valeur.

## Sécurité et robustesse déjà présentes

Le backend inclut plusieurs garde-fous utiles :

- validation minimale du nom, de l'email et du message ;
- limite de taille sur le JSON entrant ;
- rate limiting simple ;
- restriction des origines autorisées ;
- désactivation du header `x-powered-by` ;
- route de health check ;
- tests backend ciblés sur les fonctions critiques.

Ce n'est pas une sécurité "complète", mais pour un MVP de portfolio c'est un niveau raisonnable. Vouloir beaucoup plus sans besoin réel serait du sur-engineering.

## Structure du dépôt

### Racine du projet utile

- `package.json` : scripts du front principal et orchestration locale ;
- `pnpm-workspace.yaml` : déclare le package `backend` dans le workspace ;
- `vercel.json` : instructions de build Vercel ;
- `vite.config.ts` : config Vite, alias `@`, proxy `/api` vers le backend local.

### Dossiers importants

- `src/` : application front
- `backend/` : API Express
- `api/` : points d'entrée serveur pour Vercel
- `public/` : assets publics
- `maquette/` : éléments de maquette / exploration visuelle

## Lancement en local

Le script principal `pnpm dev` démarre :

- le front Vite ;
- le backend Express.

Le front tourne sur `localhost:5173` et le proxy Vite redirige les appels `/api` vers `localhost:4000`.

Autrement dit :

- en développement, le navigateur parle au front Vite ;
- Vite relaie les appels API au backend ;
- en production Vercel, l'entrée passe par les fonctions du dossier `api/`.

Cette séparation est claire et adaptée au projet.

## Variables d'environnement à connaître

Celles visibles dans le code sont :

- `NODE_ENV`
- `PORT`
- `CLIENT_ORIGIN`
- `VERCEL_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `DATABASE_URL`
- `PGSSLMODE`
- `CONTACT_RATE_LIMIT_WINDOW_MS`
- `CONTACT_RATE_LIMIT_MAX`

Point de rigueur : si tu ajoutes un jour un fichier d'exemple d'environnement, il devra refléter exactement cette liste, pas une version partielle ou théorique.

## Tests

Le backend contient un fichier de tests `backend/src/index.test.js`.

Leur rôle actuel est pertinent :

- vérifier la normalisation des entrées ;
- valider les règles du formulaire ;
- tester la logique de rate limiting ;
- contrôler une partie du comportement HTTP.

Pour ce type de projet, c'est le bon niveau de test à prioriser. Tester agressivement les animations du front aurait moins de valeur que sécuriser les règles du formulaire et de l'API.

## État actuel du README précédent

L'ancien README était essentiellement le texte par défaut de Vite.

C'était un mauvais README pour ce dépôt, pour une raison simple : il documentait le template d'origine, pas le produit réel. Un README utile doit expliquer le système que tu maintiens aujourd'hui, pas l'outil qui l'a initialisé.

## Limites actuelles à garder en tête

- Le contenu métier est très concentré dans `src/App.tsx`. Pour un portfolio c'est encore acceptable, mais au-delà d'un certain volume il faudra extraire les données de contenu.
- Le fallback mémoire du backend ne doit pas être considéré comme une solution de production.
- La présence de deux points d'entrée dans `api/` mérite de rester cohérente avec la stratégie de déploiement, sinon cela devient vite du bruit structurel.

## Priorités raisonnables pour la suite

Si tu veux faire évoluer ce projet proprement, les priorités les plus rationnelles sont :

1. stabiliser la documentation d'environnement et de déploiement ;
2. isoler les contenus du portfolio si `App.tsx` continue à grossir ;
3. vérifier le flux complet du formulaire de contact en conditions de production ;
4. éviter d'ajouter de la complexité visuelle ou technique sans bénéfice clair pour l'utilisateur.

## Résumé

Ce projet est une base de portfolio full-stack légère mais sérieuse :

- front moderne et lisible ;
- backend simple avec de vrais garde-fous ;
- adaptation propre au déploiement Vercel ;
- scope global encore maîtrisé.

Le point positif principal n'est pas l'originalité technique. C'est la cohérence de l'ensemble. Pour un portfolio, c'est plus important.
