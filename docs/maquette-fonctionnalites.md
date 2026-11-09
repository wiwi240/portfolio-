# Maquette : ce qu'il faut montrer pour chaque fonctionnalité

Objectif : chaque option cochée devient une page de la maquette qui **donne envie** et **fait comprendre ce que la fonctionnalité apporte**, sans prétendre être le rendu final (encart « Maquette basique » déjà en place).

Règle commune à toutes les pages : un titre, une phrase de bénéfice, **un élément visuel qui le prouve**, **une interaction simple** (un clic qui change quelque chose), et un retour visible (confirmation, compteur, badge).

Légende de l'état actuel : ✅ page dédiée · 🟡 page dédiée mais sobre · 🔴 page générique (titre + description + 2 boutons) · ↳ fait partie d'une autre page.

Source : [project-style-preview.tsx](../src/components/project-style-preview.tsx), ids dans [project-configurator.ts](../src/data/project-configurator.ts).

---

## Présenter (site public)

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Page d'accueil | ✅ | 3 chiffres clés, bandeau de logos partenaires (placeholders), bouton d'action relié à la fonctionnalité cochée la plus importante (réservation, boutique ou contact) |
| Présentation de l'entreprise | 🟡 | Frise « notre histoire » en 3 étapes, 3 valeurs en cartes |
| Services | 🟡 | Cartes avec icône, prix « à partir de » fictif, bouton « Demander un devis » qui ouvre la page Devis si elle est cochée |
| Équipe / intervenants | 🟡 | Grille de profils (avatar neutre, rôle, spécialité) avec bouton « Prendre rendez-vous » si les rendez-vous sont cochés |
| Galerie / réalisations | ✅ | Filtres par catégorie, ouverture d'une fiche détaillée (titre, description, résultat) |
| Témoignages | 🟡 | Carrousel d'avis avec étoiles, avatar, source |
| Actualités / articles | ✅ | Page article avec date et temps de lecture, bouton « Partager » |
| FAQ | ✅ | Accordéon avec champ de recherche qui filtre les questions |
| Localisation / contact | 🟡 | Bloc carte (placeholder), horaires d'ouverture avec « Ouvert maintenant », bouton itinéraire |
| Menu / carte (restaurant) | ✅ | Catégories en onglets, filtre régime ou allergènes |

## Recevoir des demandes

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Formulaire de contact | ✅ | Écran de confirmation animé après envoi, avec aperçu de l'email de réponse reçu par le visiteur |
| Demande de devis détaillée | ✅ | Formulaire en 3 étapes (besoin, budget, délai) avec barre de progression et récapitulatif final |
| Dépôt de fichiers | ✅ | Zone « glisser-déposer », liste de fichiers fictifs avec barre de progression, bouton retirer |
| Prise de rendez-vous | ✅ | Récapitulatif latéral (date, durée, lieu) et confirmation avec rappel par email |
| Réservation | ✅ | Choix du nombre de personnes, créneaux « complet / disponible », confirmation |
| Événements | 🟡 | Liste d'événements avec date, lieu, places restantes |
| Inscription à un événement | 🟡 | Jauge de places, formulaire court, billet de confirmation |
| Newsletter | ✅ | Aperçu de la newsletter reçue, case de consentement |

## Vendre

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Catalogue | ✅ | Recherche, tri (prix, nouveauté), filtres par catégorie, pastille « Nouveau » |
| Fiches produit | ✅ | Galerie d'images, variantes (taille, couleur), avis, bouton « Ajouter au panier » avec compteur animé dans l'en-tête |
| Panier | ✅ | Modification des quantités, total animé, code promo, estimation de livraison |
| Paiement | ✅ | Choix du mode (carte, virement, sur place), récapitulatif de commande, badge « paiement sécurisé », page de succès |
| Livraison | ↳ panier | Options retrait / domicile avec délai et prix, ajoutées au total |
| Promotions | ↳ panier | Bandeau promotionnel, prix barrés sur les produits, application du code au panier |
| Suivi de commande | ✅ | Frise des statuts (préparée, expédiée, livrée) avec numéro de suivi |

## Espace client

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Espace client (accueil) | 🟡 | Tableau de synthèse (prochain rendez-vous, dernier document, messages non lus), actions rapides |
| Documents | 🟡 | Liste avec type, date, bouton « Télécharger » (simulé), filtre par catégorie |
| Messagerie | ✅ | Conversation avec envoi de message et réponse automatique fictive |
| Suivi de dossier | ✅ | Barre de progression par étapes avec date de chaque étape |
| Historique | 🟡 | Liste filtrable (commandes, rendez-vous, documents) |
| Notifications | 🟡 | Cloche avec compteur dans l'en-tête, centre de notifications lu / non lu |

## Gestion interne (outil métier)

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Gestion des clients | ✅ | Tableau avec recherche, ouverture d'une fiche client (contact, historique, notes) |
| Dossiers / demandes | 🔴 | Vue en colonnes par statut (nouveau, en cours, terminé) avec cartes déplaçables ou boutons « avancer » |
| Devis et documents | 🔴 | Liste de devis avec statut (brouillon, envoyé, accepté), bouton « Générer le PDF » (simulé) |
| Planning | ✅ | Vue semaine avec événements colorés, ajout d'un créneau |
| Tâches | ✅ | Liste à cocher avec assignation et échéance |
| Rôles et droits | 🔴 | Matrice rôles × droits avec cases à cocher qui se mettent à jour |
| Statuts personnalisés | 🔴 | Pipeline de statuts modifiable (renommer, réordonner, couleur) |
| Équipe | ✅ | Membres avec rôle et charge de travail |
| Tableaux de bord | ✅ | Sélecteur de période qui change les chiffres et le graphique |
| Automatisations | ✅ | Règles « si… alors… » avec interrupteur d'activation |
| Connexion à d'autres outils | ✅ | Cartes d'intégrations (agenda, comptabilité, email) avec bouton Connecter / Connecté |
| Stock | ✅ | Tableau avec alerte « stock bas » colorée selon le seuil |

## Contenu modifiable

| Fonctionnalité | État | À ajouter |
|---|---|---|
| Modifier les textes | 🔴 | Édition en place : le texte saisi s'affiche en direct dans un aperçu de la page |
| Modifier les images | 🔴 | Zone « remplacer l'image » avec aperçu avant / après |
| Gérer les offres | 🔴 | Liste d'offres avec interrupteur « visible sur le site » et aperçu de la carte |
| Publier des actualités | 🔴 | Mini-éditeur (titre, texte) et bouton « Publier » qui ajoute l'article à la liste |
| Plusieurs langues | 🔴 | Sélecteur FR / EN qui change réellement les textes de la maquette |
| Administrateurs | 🔴 | Liste des administrateurs, bouton « Inviter » avec confirmation |

---

## Parcours « Refonte » et « Maintenance »

Ces options ne sont pas des pages de site mais des travaux. À vérifier comment elles s'affichent aujourd'hui dans la maquette, puis prévoir :

| Option | À montrer |
|---|---|
| Apparence, navigation, mobile | Curseur **avant / après** sur une même page |
| Rapidité, accessibilité, référencement | Jauges de score (0 à 100) avant et après |
| Nouvelles fonctionnalités | Pages ajoutées signalées « Nouveau » |
| Diagnostic, avis global | Rapport fictif avec 3 constats priorisés |
| Dépannage, mises à jour | Fiche de ticket avec statut (reçu, en cours, résolu) |
| Suivi régulier | Rapport mensuel fictif (disponibilité, mises à jour faites) |
| Mise en ligne, hébergement | Liste de contrôle (domaine, sauvegarde, test final) qui se coche |

---

## Ordre de réalisation proposé

1. **Les 10 pages génériques (🔴)** : dossiers, devis, rôles, statuts, modification des textes et des images, offres, actualités, langues, administrateurs. Ce sont les plus pauvres aujourd'hui.
2. **Panier, livraison, promotions, paiement** : le parcours d'achat est le plus parlant pour un client e-commerce.
3. **Retours visibles** : cloche de notifications avec compteur, confirmations animées, jauges de places.
4. **Parcours Refonte et Maintenance** : avant / après, scores, tickets.
5. **Le reste des pages 🟡**.
