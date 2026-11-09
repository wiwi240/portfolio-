# Guide de projet (accueil)

Le guide est l'aiguillage de la page d'accueil : il aide un visiteur à formuler son projet, puis envoie une demande structurée. Il remplace l'ancienne page `/configurateur`, dont les données (`src/data/project-configurator.ts`) sont conservées.

## But

Le visiteur est souvent un client peu à l'aise avec le web. Le guide lui évite un formulaire vide et fournit un brief exploitable : type de projet, besoins, activité. La première discussion et le devis en sont plus rapides.

## Parcours

1. **Choix du parcours** (`project-entry.tsx`) : sites web, logiciels métier, refonte et amélioration, maintenance et suivi. Un bouton « Je ne sais pas encore » mène à un parcours sans fonctionnalités à cocher.
2. **Étapes de fonctionnalités** (`project-guide.tsx`) : le visiteur coche ce qui lui est utile. Les catégories s'affichent en colonnes côte à côte.
3. **Récapitulatif et formulaire** (`project-guide-summary.tsx`) : activité, nom, email, message facultatif. Envoi vers `POST /api/contact` avec `kind: "project"` (voir `src/data/project-submit.ts`).

## Étapes par parcours

| Parcours | Étapes |
| --- | --- |
| Sites web | 1. Présenter · Demandes · Informer 2. Vendre · Espace personnel · Gérer mon site |
| Logiciels métier | 1. Clients et dossiers · Piloter · Espace personnel 2. Demandes · Gérer mon site |
| Refonte | 1. « Que souhaitez-vous améliorer ? » 2. Présenter · Demandes · Vendre 3. Informer · Gérer mon site |
| Maintenance | Une seule étape : le type de suivi souhaité (pas de fonctionnalités) |

## Catégories

Définies dans `src/data/home-guide.ts` (`categories`). Chaque besoin du configurateur y apparaît une seule fois, avec au plus 7 éléments par colonne pour garder des colonnes équilibrées.

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
- Ajouter une étape : ajouter un `slide(id, titre, [catégories])` dans `guidePanels`. Une étape avec `columns` affiche une colonne par catégorie ; sans `columns`, une liste simple en deux colonnes (cas de la refonte et de la maintenance).
- Le récapitulatif regroupe les choix par colonne (`GuideColumn`).
- Les icônes viennent de `src/data/guide-icons.ts`, clés sur les identifiants des besoins.
- Le défilement horizontal des étapes est décrit dans `docs/design-system/scroll-stack.md`.

## Ce que reçoit le backend

Les cases cochées sont envoyées comme besoins « souhaités », avec l'activité. Les autres champs de l'ancien configurateur (public visé, objectif, existant, priorités, réponses détaillées) ne sont plus collectés par le guide et arrivent vides.

## Points ouverts

- **Aucune notification** : une demande est enregistrée dans `contact_messages`, mais aucun email n'est envoyé. À traiter si le guide sert à trouver des clients.
- **Test obsolète** : `src/data/project-configurator.test.mjs` importe `changePath`, qui n'existe plus, et ne s'exécute pas. À corriger ou à supprimer.
- **Routes** : `vercel.json` garde `/configurateur` et `/en/project-configurator`. À vérifier qu'elles ont encore un sens.
- **Refonte envisagée, non réalisée** : deux étapes distinctes, « quels sont vos besoins » (cartes en langage courant) puis « ce que nous mettons en place » (colonnes limitées aux besoins choisis), avec des libellés accessibles à un public non technique.
