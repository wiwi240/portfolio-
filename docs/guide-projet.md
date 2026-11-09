# Guide de projet (accueil)

Le guide est l'aiguillage de la page d'accueil : il aide un visiteur à formuler son projet, puis envoie une demande structurée. Il remplace l'ancienne page `/configurateur`, dont les données (`src/data/project-configurator.ts`) sont conservées.

## But

Le visiteur est souvent un client peu à l'aise avec le web. Le guide lui évite un formulaire vide et fournit un brief exploitable : type de projet, besoins, activité. La première discussion et le devis en sont plus rapides.

## Parcours

1. **Choix du parcours** (`project-entry.tsx`) : sites web, logiciels métier, refonte et amélioration, maintenance et suivi. Un bouton « Je ne sais pas encore » mène à un parcours sans question.
2. **Une question par catégorie** (`project-guide-question.tsx`) : question en langage courant (« Voulez-vous vendre en ligne ? ») avec trois réponses : Oui, Non, Je ne sais pas.
   - `Oui` affiche en dessous les fonctionnalités de la catégorie, à cocher. Rien n'est coché par défaut.
   - `Non` et `Je ne sais pas` passent à la question suivante après un court délai, et retirent ce qui était coché dans cette catégorie.
   - Un lien « Passer et envoyer ma demande » saute directement au formulaire à chaque question.
3. **Maquette** (`project-guide-mockup.tsx`), puis **récapitulatif et formulaire** (`project-guide-summary.tsx`) : activité, nom, email, message facultatif. Envoi vers `POST /api/contact` avec `kind: "project"` (voir `src/data/project-submit.ts`).

## Questions par parcours

| Parcours | Questions, dans l'ordre |
| --- | --- |
| Sites web (6) | présenter son activité · être contacté ou prendre des rendez-vous · donner des nouvelles · vendre en ligne · espace clients · modifier soi-même |
| Logiciels métier (5) | organiser son travail · suivre et piloter · espace clients · recevoir des demandes · modifier soi-même |
| Refonte | la liste « Que souhaitez-vous améliorer ? », puis demandes · vente · nouvelles · modifier soi-même |
| Maintenance | une seule étape : le type de suivi souhaité (pas de fonctionnalités) |

## Catégories

Définies dans `src/data/home-guide.ts` (`categories`). Chaque catégorie correspond à une question (`questions`). Chaque besoin du configurateur y apparaît une seule fois, avec au plus 7 éléments par colonne pour garder des colonnes équilibrées.

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
- Ajouter ou reformuler une question : éditer `questions` et la liste du parcours dans `guidePanels` (`home-guide.ts`).
- Reformuler une fonctionnalité en mots simples : ajouter une entrée dans `plain` (`home-guide.ts`). Les identifiants ne changent pas.
- Un panneau avec `question` s'affiche comme une question Oui/Non ; sans `question`, comme une liste simple (refonte et maintenance).
- Le récapitulatif regroupe les choix par catégorie.
- Les icônes viennent de `src/data/guide-icons.ts`, clés sur les identifiants des besoins.
- Le défilement horizontal des étapes est décrit dans `docs/design-system/scroll-stack.md`.

## Ce que reçoit le backend

Les cases cochées sont envoyées comme besoins « souhaités », avec l'activité. Les réponses « Je ne sais pas » ne sont pas transmises. Les autres champs de l'ancien configurateur (public visé, objectif, existant, priorités, réponses détaillées) ne sont plus collectés par le guide et arrivent vides.

## Points ouverts

- **Notification email** : implémentée côté backend (Resend), mais inactive tant que `RESEND_API_KEY` et `CONTACT_NOTIFY_TO` ne sont pas définies sur Vercel.
- **Routes** : `/configurateur` et `/en/project-configurator` redirigent volontairement vers l'accueil (`#votre-projet`), en gardant le paramètre `parcours`.
