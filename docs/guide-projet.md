# Guide de projet (accueil)

Le guide est l'aiguillage de la page d'accueil : il aide un visiteur à formuler son projet, puis envoie une demande structurée. Il remplace l'ancienne page `/configurateur`, dont les données (`src/data/project-configurator.ts`) sont conservées.

## But

Le visiteur est souvent un client peu à l'aise avec le web. Le guide lui évite un formulaire vide et fournit un brief exploitable : type de projet, besoins, activité. La première discussion et le devis en sont plus rapides.

## Parcours

1. **Choix du parcours** (`project-entry.tsx`) : sites web, logiciels métier, refonte et amélioration, maintenance et suivi. Un bouton « Je ne sais pas encore » mène à un parcours sans fonctionnalités à cocher.
2. **Page 1, « Qu'est-ce que vous voulez pouvoir faire ? »** (`project-guide-needs.tsx`) : des cartes en langage courant, par exemple « Montrer ce que je fais » ou « Vendre en ligne ». Un bouton « Je ne sais pas, conseillez-moi » saute directement à la maquette.
3. **Page 2, « Voici ce que nous pouvons faire pour vous »** (`project-guide.tsx`) : une colonne par catégorie ouverte par les besoins cochés, avec les fonctionnalités en mots simples et une phrase d'explication visible. Rien n'est coché par défaut.
4. **Maquette**, puis **récapitulatif et formulaire** (`project-guide-summary.tsx`) : activité, nom, email, message facultatif. Envoi vers `POST /api/contact` avec `kind: "project"` (voir `src/data/project-submit.ts`).

Décocher un besoin à la page 1 retire aussi les fonctionnalités déjà cochées dans les catégories qui disparaissent.

## Étapes par parcours

| Parcours | Page 1 | Page 2 |
| --- | --- | --- |
| Sites web | 6 besoins : montrer, être contacté, donner des nouvelles, vendre, espace clients, modifier soi-même | colonnes des besoins cochés |
| Logiciels métier | 4 besoins : organiser, espace clients, être contacté, modifier soi-même | colonnes des besoins cochés |
| Refonte | « Que souhaitez-vous améliorer ? » (liste) | « Souhaitez-vous ajouter quelque chose ? » : demandes, vente, informer, gérer mon site |
| Maintenance | Une seule étape : le type de suivi souhaité (pas de fonctionnalités) | |

## Catégories

Définies dans `src/data/home-guide.ts` (`categories`). Les besoins de la page 1 (`themes`) ouvrent une ou plusieurs de ces catégories. Chaque besoin du configurateur y apparaît une seule fois, avec au plus 7 éléments par colonne pour garder des colonnes équilibrées.

| Catégorie | Contenu |
| --- | --- |
| Présenter mon activité | accueil, présentation, services, équipe, réalisations, témoignages |
| Recevoir des demandes | contact, devis, fichiers, rendez-vous, réservation, localisation |
| Informer et animer | actualités, FAQ, menu, newsletter, événements, inscriptions |
| Vendre en ligne | catalogue, fiches, panier, paiement, livraison, promotions, suivi de commande |
| Espace personnel | compte, documents, messagerie, suivi, historique, notifications |
| Gérer clients et dossiers | clients, dossiers, devis, planning, tâches, stocks |
| Piloter et automatiser | rôles, statuts, tableau de bord, statistiques, automatisations, connexions |
| Gérer mon site | textes, images, offres, actualités, langues, administrateurs |

Au total les 49 besoins du configurateur restent proposés.

## Modifier le guide

- Regrouper ou renommer : éditer `categories` dans `home-guide.ts`. Les titres, descriptions et identifiants viennent de `project-configurator.ts` ; ne changer que le regroupement ici.
- Ajouter un besoin à la page 1 : créer un `theme(...)` dans `home-guide.ts`, l'ajouter à `themesByPath` et lui donner une icône dans `guide-icons.ts` (clé `need-…`).
- Reformuler une fonctionnalité en mots simples : ajouter une entrée dans `plain` (`home-guide.ts`). Les identifiants ne changent pas.
- Une étape avec `columns` affiche une colonne par catégorie ; sans `columns`, une liste simple en deux colonnes (refonte et maintenance).
- Le récapitulatif regroupe les choix par colonne (`GuideColumn`).
- Les icônes viennent de `src/data/guide-icons.ts`, clés sur les identifiants des besoins.
- Le défilement horizontal des étapes est décrit dans `docs/design-system/scroll-stack.md`.

## Ce que reçoit le backend

Les cases cochées sont envoyées comme besoins « souhaités », avec l'activité. Les autres champs de l'ancien configurateur (public visé, objectif, existant, priorités, réponses détaillées) ne sont plus collectés par le guide et arrivent vides.

## Points ouverts

- **Aucune notification** : une demande est enregistrée dans `contact_messages`, mais aucun email n'est envoyé. À traiter si le guide sert à trouver des clients.
- **Test obsolète** : `src/data/project-configurator.test.mjs` importe `changePath`, qui n'existe plus, et ne s'exécute pas. À corriger ou à supprimer.
- **Routes** : `vercel.json` garde `/configurateur` et `/en/project-configurator`. À vérifier qu'elles ont encore un sens.
