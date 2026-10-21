import type { Language } from '@/data/portfolio-content'
import type { ServiceIllustrationKind } from './service-illustrations'

export type ServiceDetailCopy = {
  category: string
  intro: string
  featureLabel: string
  features: { title: string; benefit: string }[]
  journeyLabel: string
  journey: string[]
  journeyDetails: string[]
  scope: string
  note?: string
  cta: string
}

const journeyDetails: Record<ServiceIllustrationKind, Record<Language, string[]>> = {
  landing:{fr:['Une recherche ou un lien mène à l’offre.','Les informations répondent aux questions utiles.','Le formulaire ou bouton permet de vous joindre.'],en:['A search or link leads to the offer.','Clear details answer useful questions.','A form or button starts the conversation.']},
  showcase:{fr:['La page d’accueil présente votre activité.','Les pages détaillent services et réalisations.','Le visiteur utilise les coordonnées ou le formulaire.'],en:['The home page introduces your business.','Pages explain services and show work.','Visitors use contact details or the form.']},
  shop:{fr:['Le visiteur compare produit et variantes.','Il vérifie le panier puis confirme son achat.','Vous retrouvez la commande à préparer.'],en:['Visitors compare products and variants.','They review the cart and place an order.','You find the order to process.']},
  webapp:{fr:['L’utilisateur choisit un créneau disponible.','Il retrouve sa confirmation dans son espace.','Le suivi lui montre la prochaine étape.'],en:['Users select an available time.','They find confirmation in their account.','Tracking shows what happens next.']},
  business:{fr:['Une fiche rassemble les informations utiles.','Le devis reste relié au même dossier.','Les tâches et échéances sont visibles.'],en:['A record gathers useful information.','The quote stays linked to the file.','Tasks and dates remain visible.']},
  custom:{fr:['Une action est facile à repérer.','Le formulaire guide la saisie.','Une confirmation indique la suite.'],en:['The main action is easy to spot.','The form guides each entry.','A confirmation explains what follows.']},
  redesign:{fr:['J’examine le site, ses contenus et ses usages.','Nous choisissons les évolutions utiles.','Je conçois le site selon les priorités.','Je contrôle les parcours sur plusieurs écrans.'],en:['I review the site, content and usage.','We choose useful changes.','I design around the priorities.','I check journeys across devices.']},
  features:{fr:['Nous précisons l’usage à ajouter.','Je vérifie les contraintes du site actuel.','J’intègre la fonction au parcours existant.','Je contrôle son fonctionnement avant la mise en ligne.'],en:['We define the new use.','I check existing site constraints.','I integrate it into the current journey.','I check it before launch.']},
  performance:{fr:['J’examine les pages et les lenteurs constatées.','Je choisis les points qui comptent.','J’adapte médias, ressources ou interactions.','Je contrôle les effets sur les appareils concernés.'],en:['I review pages and observed slowdowns.','I choose the points that matter.','I adapt media, resources or interactions.','I check the effect on relevant devices.']},
  fixes:{fr:['Je retrouve le dysfonctionnement.','J’en recherche la cause.','J’applique la correction adaptée.','Je teste de nouveau le parcours.'],en:['I reproduce the problem.','I investigate the cause.','I apply the appropriate fix.','I test the journey again.']},
  updates:{fr:['Je relève l’état et les versions actuelles.','Je prévois les précautions nécessaires.','J’applique les changements retenus.','Je vérifie les pages et fonctions utiles.'],en:['I review current versions and state.','I plan the needed precautions.','I apply the selected changes.','I check relevant pages and functions.']},
  support:{fr:['Vous signalez un besoin ou un problème.','Nous convenons d’une intervention.','Je réalise les actions prévues.','Je vous transmets les résultats et suites.'],en:['You report a need or issue.','We agree on an intervention.','I carry out the planned work.','I share results and next steps.']},
  hosting:{fr:['Nous réunissons les accès nécessaires.','Je relie hébergement et domaine.','Je publie une version du site.','Je contrôle son accès et ses actions clés.'],en:['We gather the required access.','I connect hosting and domain.','I publish a version of the site.','I check access and key actions.']},
}

export const serviceNames: Record<ServiceIllustrationKind, Record<Language, string>> = {
  landing:{fr:'Landing page',en:'Landing page'}, showcase:{fr:'Site vitrine',en:'Showcase website'},
  shop:{fr:'Boutique en ligne',en:'Online shop'}, webapp:{fr:'Application web',en:'Web application'},
  business:{fr:'Outil métier',en:'Business tool'}, custom:{fr:'Interface sur mesure',en:'Custom interface'},
  redesign:{fr:'Refonte',en:'Redesign'}, features:{fr:'Nouvelles fonctionnalités',en:'New features'},
  performance:{fr:'Performances',en:'Performance'}, fixes:{fr:'Corrections',en:'Bug fixes'},
  updates:{fr:'Mises à jour',en:'Updates'}, support:{fr:'Suivi technique',en:'Technical support'},
  hosting:{fr:'Mise en ligne et hébergement',en:'Launch and hosting'},
}

type Source = [string,string,string,[string,string][],string[],string,string?,string?]
const sources: Record<ServiceIllustrationKind, Record<Language,Source>> = {
  landing:{
    fr:['Créer','Une page dédiée à une offre et à une action principale.','Ce que je peux mettre en place',[
      ['Présenter l’offre','Vos visiteurs comprennent ce que vous proposez dès les premiers instants.'],['Organiser les informations','Les réponses utiles arrivent dans un ordre clair.'],['Éléments de confiance','Vos réalisations ou informations vérifiables appuient la présentation, si vous en disposez.'],['Recueillir une demande','Un formulaire ou un bouton permet de passer à l’action attendue.']
    ],['Découvrir l’offre','Comprendre sa valeur','Faire une demande'],'L’offre, le public visé, les contenus disponibles et l’action principale.','Parlons de votre landing page'],
    en:['Create','A page dedicated to an offer and one main action.','What I can set up',[
      ['Present the offer','Visitors quickly understand what you provide.'],['Organise the information','Useful answers appear in a clear order.'],['Real trust signals','Available work and verifiable information support the presentation.'],['Collect an enquiry','A form or button lets visitors take the intended action.']
    ],['Discover the offer','Understand its value','Send an enquiry'],'The offer, audience, available content and main action.','Let’s discuss your landing page']},
  showcase:{
    fr:['Créer','Un site pour présenter votre activité, vos services et vos coordonnées.','Ce que je peux mettre en place',[
      ['Pages de prestations','Chaque service dispose des explications nécessaires.'],['Réalisations','Vos projets concrets donnent à voir votre travail.'],['Informations pratiques','Horaires, zone ou modalités préparent une visite ou un échange.'],['Formulaire et coordonnées','Les visiteurs savent comment vous joindre.'],['Gestion des contenus','Si elle est prévue, vous actualisez certaines informations vous-même.']
    ],['Découvrir l’activité','Explorer les pages','Prendre contact'],'Les pages, textes, médias et le niveau d’autonomie souhaité.','Parlons de votre site vitrine'],
    en:['Create','A site presenting your business, services and contact details.','What I can set up',[
      ['Service pages','Each service has the details visitors need.'],['Selected work','Real projects show what you do.'],['Practical information','Hours, location or arrangements help prepare a visit.'],['Form and contact details','Visitors know how to reach you.'],['Content management','When planned, you can update selected information yourself.']
    ],['Discover','Explore pages','Get in touch'],'Pages, copy, media and how much content you wish to manage.','Let’s discuss your website']},
  shop:{
    fr:['Créer','Présenter des produits et permettre leur achat en ligne.','Les possibilités pour votre boutique',[
      ['Catalogue et variantes','Les clients choisissent le bon produit, sa couleur ou son modèle.'],['Catégories et filtres','Ils retrouvent plus facilement ce qu’ils cherchent.'],['Panier et paiement','Ils vérifient leur choix avant de passer commande.'],['Produits et commandes','Vous voyez ce qui est proposé et ce qui doit être traité.'],['Livraison, retrait et messages','Vous organisez la suite de l’achat selon votre fonctionnement.']
    ],['Choisir un produit','Passer commande','Traiter la commande'],'Les produits, moyens de paiement, modes de livraison, stocks et besoins de gestion.','Parlons de votre boutique'],
    en:['Create','Present products and let customers buy them online.','Options for your shop',[
      ['Catalogue and variants','Customers select the right product, colour or model.'],['Categories and filters','They find what they need more easily.'],['Cart and payment','They review their selection before ordering.'],['Products and orders','You see what is available and what needs handling.'],['Delivery, collection and messages','You organise what happens after purchase.']
    ],['Choose a product','Place an order','Process the order'],'Products, payments, delivery, stock and management needs.','Let’s discuss your shop']},
  webapp:{
    fr:['Créer','Un service accessible dans un navigateur pour vos utilisateurs.','Les usages possibles',[
      ['Comptes utilisateurs','Chacun retrouve ses informations dans son espace.'],['Réservation','Un créneau disponible se choisit sans échange répétitif.'],['Documents et échanges','Les informations utiles sont transmises au bon endroit.'],['Suivi des demandes','L’utilisateur voit l’état de sa demande et la prochaine étape.']
    ],['Effectuer une demande','Retrouver son espace','Suivre son évolution'],'Les utilisateurs, règles de fonctionnement, droits d’accès et fonctions prioritaires.','Parlons de votre application web'],
    en:['Create','A browser-based service for your users.','Possible uses',[
      ['User accounts','People find their information in one place.'],['Booking','Available times can be chosen without repeated messages.'],['Documents and messages','Useful information reaches the right place.'],['Request tracking','Users see the status and next step.']
    ],['Make a request','Open their area','Track progress'],'Users, operating rules, access rights and priority functions.','Let’s discuss your web app']},
  business:{
    fr:['Créer','Un outil adapté à l’organisation quotidienne de votre activité.','Ce que l’outil peut réunir',[
      ['Informations centralisées','Les données utiles cessent d’être dispersées.'],['Suivi des dossiers','L’état et la prochaine action de chaque dossier sont visibles.'],['Tâches et planning','Le travail à venir est plus simple à organiser.'],['Accès adaptés','Chaque personne voit les informations utiles à son rôle.']
    ],['Créer un client','Préparer un devis','Suivre le dossier'],'Votre fonctionnement actuel, les utilisateurs, les données et les priorités.','Parlons de votre outil métier'],
    en:['Create','A tool shaped around the daily operation of your business.','What the tool can bring together',[
      ['Centralised information','Useful data is no longer scattered.'],['File tracking','The status and next action are visible.'],['Tasks and schedule','Upcoming work is easier to organise.'],['Appropriate access','Each person sees information relevant to their role.']
    ],['Create a client','Prepare a quote','Track the file'],'Current workflow, users, data and priorities.','Let’s discuss your business tool']},
  custom:{
    fr:['Créer','Concevoir les écrans et parcours de votre produit.','Les aspects que je peux concevoir',[
      ['Hiérarchie','Les informations importantes se repèrent rapidement.'],['Navigation','Les utilisateurs passent d’un écran à l’autre sans se perdre.'],['Formulaires','Des indications claires aident à terminer une action.'],['Adaptation aux écrans','Le parcours reste confortable sur ordinateur et mobile.']
    ],['Trouver une action','La réaliser','Comprendre le résultat'],'Le public, le produit existant, les écrans à traiter et les contraintes.','Parlons de votre interface'],
    en:['Create','Design the screens and journeys of your product.','What I can design',[
      ['Hierarchy','Important information is easy to spot.'],['Navigation','Users move between screens without getting lost.'],['Forms','Clear guidance helps complete an action.'],['Screen adaptation','The journey stays comfortable on desktop and mobile.']
    ],['Find an action','Complete it','Understand the result'],'Audience, existing product, screens and constraints.','Let’s discuss your interface']},
  redesign:{
    fr:['Améliorer','Faire évoluer un site existant selon de nouveaux besoins.','Les axes possibles',[
      ['Présentation','Clarifier ce que vous proposez aujourd’hui.'],['Navigation','Rendre les informations plus faciles à trouver.'],['Parcours','Simplifier les actions utiles aux visiteurs.'],['Contenus','Conserver, réorganiser ou actualiser ce qui existe.']
    ],['Examiner l’existant','Définir les priorités','Concevoir et réaliser','Vérifier'],'Les accès, contenus, contraintes du site et le périmètre de la refonte.','Discutons de votre refonte'],
    en:['Improve','Evolve an existing website to meet new needs.','Possible areas of work',[
      ['Presentation','Clarify what you offer today.'],['Navigation','Make information easier to find.'],['Journeys','Simplify useful visitor actions.'],['Content','Keep, reorganise or update what exists.']
    ],['Review the site','Set priorities','Design and build','Check'],'Access, content, existing constraints and scope.','Let’s discuss your redesign']},
  features:{
    fr:['Améliorer','Ajouter des usages à un site ou une application existante.','Les fonctionnalités possibles',[
      ['Réservation','Les visiteurs choisissent un créneau disponible.'],['Espace client','Ils retrouvent demandes et documents.'],['Formulaire adapté','Vous recevez les informations nécessaires dès le départ.'],['Connexion à des outils','Des données peuvent être échangées lorsque les systèmes le permettent.']
    ],['Préciser le besoin','Étudier la compatibilité','Intégrer','Vérifier'],'Le site existant, ses accès, les règles de la nouvelle fonction et ses dépendances.','Parlons de votre fonctionnalité'],
    en:['Improve','Add new uses to an existing website or application.','Possible features',[
      ['Booking','Visitors choose an available time.'],['Client area','They find requests and documents.'],['Tailored form','You receive the right information from the start.'],['Tool connections','Data can be exchanged when systems allow it.']
    ],['Define the need','Check compatibility','Integrate','Verify'],'Existing site, access, rules and dependencies.','Let’s discuss your feature']},
  performance:{
    fr:['Améliorer','Identifier les lenteurs et travailler les points concernés.','Les points à examiner',[
      ['Images et médias','Adapter formats et poids aux usages réels.'],['Chargement','Examiner les ressources nécessaires à chaque page.'],['Interactions','Rechercher ce qui ralentit une action.'],['Vérifications','Mesurer et contrôler les effets des changements.']
    ],['Examiner','Prioriser','Optimiser','Vérifier'],'Les pages, appareils, problèmes observés et contraintes.','Parlons des performances de votre site'],
    en:['Improve','Identify slowdowns and work on their causes.','Areas to examine',[
      ['Images and media','Adapt format and size to actual use.'],['Loading','Review the resources each page needs.'],['Interactions','Find what slows an action.'],['Checks','Measure and review the effect of changes.']
    ],['Review','Prioritise','Optimise','Verify'],'Pages, devices, observed problems and constraints.','Let’s discuss your site’s performance']},
  fixes:{
    fr:['Maintenir et accompagner','Résoudre un dysfonctionnement identifié sur votre site ou application.','Les problèmes que je peux traiter',[
      ['Formulaire défaillant','Rétablir la prise de contact.'],['Affichage incorrect','Retrouver une lecture utilisable sur les écrans concernés.'],['Action bloquée','Permettre de terminer le parcours prévu.']
    ],['Reproduire','Identifier la cause','Corriger','Vérifier'],'Les symptômes, étapes de reproduction, accès et fonctions concernées.','Décrivez-moi le problème'],
    en:['Maintain and support','Resolve an identified problem on your website or app.','Problems I can address',[
      ['Broken form','Restore contact requests.'],['Incorrect display','Make affected screens readable again.'],['Blocked action','Let users complete the intended journey.']
    ],['Reproduce','Find the cause','Fix','Verify'],'Symptoms, reproduction steps, access and affected functions.','Tell me about the problem']},
  updates:{
    fr:['Maintenir et accompagner','Actualiser les composants d’un site ou d’une application et vérifier leur compatibilité.','Les étapes de l’intervention',[
      ['Examiner les versions','Identifier les composants concernés.'],['Préparer','Prévoir les précautions adaptées au projet.'],['Actualiser','Appliquer les changements retenus.'],['Vérifier','Contrôler les parcours après intervention.']
    ],['Examiner','Préparer','Actualiser','Vérifier'],'Les technologies, l’état actuel, les accès et les dépendances.','Parlons des mises à jour'],
    en:['Maintain and support','Update website or app components and check their compatibility.','The intervention steps',[
      ['Review versions','Identify affected components.'],['Prepare','Plan precautions suited to the project.'],['Update','Apply the agreed changes.'],['Verify','Check user journeys afterwards.']
    ],['Review','Prepare','Update','Verify'],'Technologies, current state, access and dependencies.','Let’s discuss updates']},
  support:{
    fr:['Maintenir et accompagner','Organiser les interventions convenues dans le temps.','Les interventions possibles',[
      ['Corrections','Traiter les problèmes identifiés.'],['Mises à jour','Prévoir les évolutions nécessaires.'],['Vérifications','Examiner les fonctions convenues.'],['Échanges','Faire le point sur les besoins et les interventions.']
    ],['Faire une demande','Convenir d’une intervention','Réaliser','Recevoir un compte rendu'],'Le périmètre, la fréquence et les modalités d’intervention.','Définissons votre suivi'],
    en:['Maintain and support','Organise agreed technical work over time.','Possible interventions',[
      ['Fixes','Address identified issues.'],['Updates','Plan necessary changes.'],['Checks','Review agreed functions.'],['Discussions','Review needs and interventions together.']
    ],['Make a request','Agree on an intervention','Carry it out','Receive a report'],'Scope, frequency and working arrangements.','Let’s define your support']},
  hosting:{
    fr:['Maintenir et accompagner','Rendre un site accessible avec une configuration adaptée.','Le rôle de chaque élément',[
      ['Nom de domaine','L’adresse que les visiteurs saisissent pour accéder au site.'],['Hébergement','L’environnement dans lequel le site fonctionne.'],['Déploiement','La publication d’une version du site.'],['Configuration','Les connexions et réglages nécessaires au bon fonctionnement.']
    ],['Préparer les accès','Configurer','Publier','Vérifier'],'Le prestataire, le domaine, les accès et les frais éventuels.','Préparons votre mise en ligne','Les abonnements et frais éventuels sont précisés séparément.'],
    en:['Maintain and support','Make a website accessible with a suitable setup.','What each part does',[
      ['Domain name','The address visitors enter to reach the site.'],['Hosting','The environment where the site runs.'],['Deployment','Publishing a version of the site.'],['Configuration','The connections and settings the site needs.']
    ],['Prepare access','Configure','Publish','Check'],'Provider, domain, access and possible fees.','Let’s get your site online','Subscriptions and any other fees are specified separately.']},
}

export const serviceDetailContent = Object.fromEntries(Object.entries(sources).map(([kind, languages]) => [kind,
  Object.fromEntries(Object.entries(languages).map(([language, [category,intro,featureLabel,features,journey,scope,cta,note]]) => [language, {
    category,intro,featureLabel,features:features.map(([title,benefit]) => ({title,benefit})),journeyLabel: language === 'fr' ? (kind === 'landing' || kind === 'showcase' ? 'Le parcours du visiteur' : kind === 'shop' ? 'Du choix à la commande' : kind === 'webapp' || kind === 'custom' || kind === 'business' ? 'Un parcours concret' : 'Le déroulement') : 'The journey',journey,journeyDetails:journeyDetails[kind as ServiceIllustrationKind][language as Language],scope,cta,note,
  }]))
])) as Record<ServiceIllustrationKind, Record<Language,ServiceDetailCopy>>

export const serviceDetailHeaders: Record<ServiceIllustrationKind, Record<Language, { headline: string; summary: string }>> = {
  landing:{fr:{headline:'Une page pour présenter une offre et guider vers une action.',summary:'Je construis une page claire qui explique ce que vous proposez et permet aux visiteurs de vous contacter, de s’inscrire ou de demander un devis.'},en:{headline:'One page to present an offer and guide people to action.',summary:'I build a clear page that explains your offer and lets visitors enquire, sign up or request a quote.'}},
  showcase:{fr:{headline:'Présentez votre activité et facilitez le contact.',summary:'Un site professionnel pour présenter vos services, vos réalisations et les informations dont vos visiteurs ont besoin.'},en:{headline:'Present your business and make contact easy.',summary:'A professional website for your services, work and the practical details visitors need.'}},
  shop:{fr:{headline:'Présentez vos produits et permettez leur achat en ligne.',summary:'Une boutique complète pour aider vos clients à choisir, commander et connaître la suite de leur achat.'},en:{headline:'Present products and let customers buy online.',summary:'A shop that helps customers choose, order and understand what happens after purchase.'}},
  webapp:{fr:{headline:'Un service en ligne pour vos clients ou vos équipes.',summary:'Une application accessible dans un navigateur pour réserver, échanger ou suivre une demande dans un espace personnel.'},en:{headline:'An online service for your clients or team.',summary:'A browser-based app for booking, exchanging information or tracking requests in a personal area.'}},
  business:{fr:{headline:'Organisez votre travail avec un outil adapté à votre activité.',summary:'Je relie les informations utiles à vos tâches quotidiennes pour faciliter le suivi des clients, devis, dossiers et plannings.'},en:{headline:'Organise work with a tool shaped around your business.',summary:'I connect useful information to daily tasks so clients, quotes, files and schedules are easier to follow.'}},
  custom:{fr:{headline:'Des écrans clairs pour les actions de vos utilisateurs.',summary:'Je conçois une navigation, des formulaires et des confirmations adaptés aux usages sur ordinateur et mobile.'},en:{headline:'Clear screens for the actions your users need.',summary:'I design navigation, forms and confirmations for comfortable desktop and mobile use.'}},
  redesign:{fr:{headline:'Faites évoluer votre site pour mieux présenter votre activité.',summary:'J’examine sa structure, ses contenus et ses parcours pour définir des améliorations utiles et adaptées à l’existant.'},en:{headline:'Evolve your website to present your business more clearly.',summary:'I review its structure, content and journeys to define useful changes suited to the existing site.'}},
  features:{fr:{headline:'Ajoutez à votre site les usages dont vous avez besoin.',summary:'J’étudie la compatibilité de l’existant avant d’intégrer une réservation, un espace client ou une autre fonction utile.'},en:{headline:'Add the functions your website needs.',summary:'I check the existing system before integrating booking, a client area or another useful feature.'}},
  performance:{fr:{headline:'Comprenez les lenteurs et améliorez le fonctionnement de votre site.',summary:'J’examine médias, ressources et interactions, puis je mesure les effets des changements retenus.'},en:{headline:'Understand slowdowns and improve your website.',summary:'I review media, resources and interactions, then measure the effect of selected changes.'}},
  fixes:{fr:{headline:'Résolvez les erreurs qui gênent l’utilisation de votre site.',summary:'Je reproduis le problème, j’en cherche la cause et je vérifie le parcours après correction.'},en:{headline:'Resolve errors that get in the way of your website.',summary:'I reproduce the issue, investigate its cause and check the journey after fixing it.'}},
  updates:{fr:{headline:'Actualisez les composants et vérifiez leur compatibilité.',summary:'Je prépare les changements selon les technologies du projet et contrôle les fonctions importantes après intervention.'},en:{headline:'Update components and check compatibility.',summary:'I prepare changes for your technology and check key functions afterwards.'}},
  support:{fr:{headline:'Organisez les interventions utiles à la vie de votre site.',summary:'Je définis avec vous le périmètre et les modalités du suivi, puis je vous informe des actions réalisées.'},en:{headline:'Organise useful work throughout your site’s life.',summary:'I agree the scope and arrangements with you, then report the work carried out.'}},
  hosting:{fr:{headline:'Rendez votre site accessible avec une configuration adaptée.',summary:'Je vous accompagne pour relier domaine, hébergement et publication, puis je vérifie l’accès au site.'},en:{headline:'Make your site accessible with a suitable setup.',summary:'I help connect domain, hosting and publication, then check access to the site.'}},
}
