import { useEffect } from 'react'
import type { Language } from '@/data/portfolio-content'
import { contactEmail } from '@/data/portfolio-content'
import './legal-pages.css'

export type LegalPageKind = 'legal' | 'terms' | 'privacy' | 'cookies'

type LegalSection = { id?: string; title: string; paragraphs: string[]; points?: string[] }
type LegalCopy = { eyebrow: string; title: string; intro: string; pending?: string[]; sections: LegalSection[]; contact: string; rights?: string; complaint?: string }

const content: Record<Language, Record<LegalPageKind, LegalCopy>> = {
  fr: {
    legal: {
      eyebrow: 'Informations légales', title: 'Mentions légales', intro: 'Identification de l’éditeur et informations relatives à ce portfolio.',
      pending: ['Statut juridique et, s’il y a lieu, numéro d’immatriculation et de TVA', 'Adresse et numéro de téléphone professionnels'],
      sections: [
        { title: 'Éditeur du site', paragraphs: ['Ce portfolio est présenté sous le nom de William Mahi. Le contact public est l’adresse email indiquée ci-dessous. Les autres informations d’identification professionnelle doivent être confirmées par l’éditeur.'] },
        { title: 'Hébergement', paragraphs: ['Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com). Les fonctions serveur sont exécutées dans la région de Francfort (Allemagne). La base de données est hébergée par Neon, également dans la région de Francfort.'] },
        { title: 'Prestations présentées', paragraphs: ['Les pages décrivent des possibilités de prestations. Leur périmètre, leurs conditions et les éventuels frais sont définis dans une proposition distincte ; cette page ne constitue pas des conditions générales de vente.'] },
      ],
      contact: 'Contacter l’éditeur',
    },
    terms: {
      eyebrow: 'Utilisation du site', title: 'Conditions générales d’utilisation', intro: 'Règles de consultation de ce portfolio. Elles ne remplacent pas un devis ni un contrat de prestation.',
      sections: [
        { title: 'Objet', paragraphs: ['Ce site présente le parcours, les projets et les prestations de William Mahi. Les pages publiques peuvent être consultées sans création de compte. Aucune commande ni paiement en ligne n’est proposé sur ce portfolio.'] },
        { title: 'Informations et prise de contact', paragraphs: ['Les contenus sont fournis pour présenter l’activité et peuvent évoluer. Une demande envoyée par email n’emporte pas, à elle seule, commande d’une prestation. Le périmètre d’un projet est défini séparément avec la personne intéressée.'] },
        { title: 'Contenus et liens externes', paragraphs: ['Les textes, visuels, captures de projets, marques et logos présents sur le site peuvent relever de droits différents. Leur réutilisation nécessite l’autorisation du titulaire des droits concerné. Certains liens mènent vers des sites tiers, soumis à leurs propres conditions.'] },
        { title: 'Données personnelles', paragraphs: ['Les informations relatives au contact par email, aux ressources externes et à vos droits figurent dans la politique de confidentialité accessible depuis le pied de page.'] },
      ],
      contact: 'Poser une question sur ces conditions',
    },
    privacy: {
      eyebrow: 'Données personnelles', title: 'Politique de confidentialité', intro: 'Ce que le portfolio permet de constater sur les données et la manière d’exercer vos droits.',
      pending: ['Base légale retenue pour chaque type de demande reçue par email', 'Durées ou critères de conservation des échanges', 'Prestataires effectivement utilisés pour la messagerie et l’hébergement, ainsi que les éventuels transferts de données', 'Coordonnées professionnelles complètes du responsable du traitement'],
      sections: [
        { title: 'Contact et demande de projet', paragraphs: ['Vous pouvez écrire par email ou envoyer une demande depuis le configurateur. Le formulaire transmet votre nom, votre email, les réponses sur votre projet et, si vous les renseignez, votre entreprise et votre message. Ces informations sont conservées sur le serveur pour traiter votre demande et vous répondre, puis suivre l’échange (statut, notes de suivi, éventuel montant d’un devis). Le même principe s’applique au message rapide de la page de contact (nom, email, entreprise et téléphone facultatifs, profil indiqué) et à la prise de rendez-vous (nom, email, sujet et créneau choisi). Les réponses du configurateur ne sont pas enregistrées automatiquement dans votre navigateur. Ne transmettez aucun mot de passe ou accès sensible.'] },
        { title: 'Compteurs de visites anonymes', paragraphs: ['Le site compte les visites et les étapes du guide de projet avec des compteurs anonymes : seuls le type d’événement, le profil choisi sur l’écran d’accueil et le numéro d’étape sont enregistrés. Aucun cookie, identifiant ni adresse IP n’est conservé, et rien n’est transmis à un service tiers.'] },
        { title: 'Ressources appelées depuis d’autres services', paragraphs: ['Les polices de caractères sont hébergées sur le site lui-même. Selon la page consultée, le navigateur peut demander des icônes à Simple Icons, qui peut recevoir des données techniques liées à la requête (adresse IP, navigateur). Le site est hébergé par Vercel et la base de données par Neon, dans la région de Francfort.'] },
        { title: 'Base légale, destinataires et conservation', paragraphs: ['Ces informations dépendent du fonctionnement réel de la messagerie et de l’activité de l’éditeur. Elles ne peuvent pas être déduites du seul code du portfolio et doivent être précisées avant de considérer cette politique comme complète.'] },
        { id: 'rights', title: 'Exercer vos droits', paragraphs: ['Vous pouvez demander l’accès, la rectification, l’effacement ou la limitation de vos données, et vous opposer à certains traitements lorsque ces droits sont applicables. Écrivez à l’adresse ci-dessous en précisant votre demande. Vous pouvez également adresser une réclamation à la CNIL.'] },
      ],
      contact: 'Écrire au sujet de mes données', rights: 'Exercer mes droits par email', complaint: 'Déposer une réclamation auprès de la CNIL',
    },
    cookies: {
      eyebrow: 'Vie privée', title: 'Cookies et stockage local', intro: 'Informations sur la préférence de thème et les ressources chargées par ce portfolio.',
      pending: ['Vérification des éventuels traceurs ajoutés par l’hébergement et les ressources tierces en production'],
      sections: [
        { title: 'Préférence de thème', paragraphs: ['Le choix du thème clair ou sombre est enregistré dans le stockage local de votre navigateur sous la clé « theme ». Il sert uniquement à retrouver l’affichage choisi lors d’une visite ultérieure. Vous pouvez le modifier avec le bouton de thème de la navigation ou effacer les données du site dans votre navigateur.'] },
        { title: 'Ressources tierces', paragraphs: ['Les polices sont hébergées sur le site. Certaines pages chargent des icônes depuis Simple Icons. Le code du portfolio ne contient pas d’outil de statistiques publicitaires ni de panneau de préférences de cookies. Le profil choisi à l’entrée et le fait qu’une visite a déjà été comptée sont gardés dans le stockage de session de votre navigateur, effacé à la fermeture de l’onglet. Le comportement des ressources et de l’hébergement effectifs reste à contrôler.'] },
        { title: 'Si des traceurs supplémentaires sont ajoutés', paragraphs: ['La présente page doit alors être mise à jour. Les traceurs nécessitant un consentement doivent être soumis à un choix réel avant leur activation ; un simple lien « Gérer mes cookies » sans réglage fonctionnel ne suffirait pas.'] },
      ],
      contact: 'Poser une question sur le stockage',
    },
  },
  en: {
    legal: {
      eyebrow: 'Legal information', title: 'Legal notice', intro: 'Publisher identification and information about this portfolio.',
      pending: ['Legal status and, where applicable, registration and VAT numbers', 'Professional address and telephone number'],
      sections: [
        { title: 'Website publisher', paragraphs: ['This portfolio is presented under the name William Mahi. The public contact method is the email address below. The remaining professional identification details must be confirmed by the publisher.'] },
        { title: 'Hosting', paragraphs: ['The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com). Server functions run in the Frankfurt region (Germany). The database is hosted by Neon, also in the Frankfurt region.'] },
        { title: 'Services described', paragraphs: ['The pages describe possible services. Their scope, terms and any fees are defined in a separate proposal; this page is not a set of terms of sale.'] },
      ],
      contact: 'Contact the publisher',
    },
    terms: {
      eyebrow: 'Website use', title: 'Terms of use', intro: 'Rules for browsing this portfolio. These terms do not replace a quote or a service agreement.',
      sections: [
        { title: 'Purpose', paragraphs: ['This website presents William Mahi’s background, projects and services. Public pages can be viewed without creating an account. This portfolio does not offer online orders or payments.'] },
        { title: 'Information and enquiries', paragraphs: ['Content presents the activity and may change. Sending an email does not, by itself, place an order for a service. The scope of a project is agreed separately with the interested person.'] },
        { title: 'Content and external links', paragraphs: ['Texts, visuals, project screenshots, brands and logos on this site may be subject to different rights. Reuse requires permission from the relevant rights holder. Some links lead to third-party websites governed by their own terms.'] },
        { title: 'Personal data', paragraphs: ['Information about email contact, external resources and your rights is available in the privacy policy linked in the footer.'] },
      ],
      contact: 'Ask a question about these terms',
    },
    privacy: {
      eyebrow: 'Personal data', title: 'Privacy policy', intro: 'What can be established from this portfolio about data and how to exercise your rights.',
      pending: ['Legal basis for each type of email enquiry', 'Retention periods or criteria for correspondence', 'Actual email and hosting providers, and any international data transfers', 'Complete professional contact details of the data controller'],
      sections: [
        { title: 'Contact and project requests', paragraphs: ['You can write by email or submit a request through the project configurator. The form sends your name, email, project answers and, if provided, company and additional message. This information is stored on the server to handle your request and reply. Configurator answers are not automatically saved in your browser. Requests are then followed up on the server (status, follow-up notes, any quote amount). The same applies to the quick message on the contact page (name, email, optional company and phone, stated profile) and to appointment booking (name, email, topic and chosen time slot). Do not send passwords or sensitive access details.'] },
        { title: 'Anonymous visit counters', paragraphs: ['The site counts visits and the steps of the project guide with anonymous counters: only the type of event, the profile picked on the entrance screen and the step number are recorded. No cookie, identifier or IP address is stored, and nothing is shared with a third-party service.'] },
        { title: 'Resources requested from other services', paragraphs: ['Fonts are hosted on the site itself. Depending on the page, your browser may request icons from Simple Icons, which may receive technical information associated with the request (IP address, browser). The site is hosted by Vercel and the database by Neon, in the Frankfurt region.'] },
        { title: 'Legal basis, recipients and retention', paragraphs: ['These details depend on the publisher’s actual email and business practices. They cannot be established from the portfolio code alone and must be specified before this policy can be considered complete.'] },
        { id: 'rights', title: 'Exercise your rights', paragraphs: ['You may request access, correction, erasure or restriction of your data, and object to certain processing where these rights apply. Write to the address below and explain your request. You can also lodge a complaint with the French data protection authority, CNIL.'] },
      ],
      contact: 'Write about my data', rights: 'Exercise my rights by email', complaint: 'Lodge a complaint with CNIL',
    },
    cookies: {
      eyebrow: 'Privacy', title: 'Cookies and local storage', intro: 'Information about the theme preference and resources loaded by this portfolio.',
      pending: ['Check for any additional trackers introduced by hosting and third-party resources in production'],
      sections: [
        { title: 'Theme preference', paragraphs: ['Your light or dark theme choice is stored in your browser’s local storage under the key “theme”. It is used only to restore your chosen display on a later visit. You can change it with the theme button in the navigation or clear this site’s data in your browser.'] },
        { title: 'Third-party resources', paragraphs: ['Fonts are hosted on the site. Some pages load icons from Simple Icons. The portfolio code contains no advertising analytics tool or cookie preferences panel. The profile picked at the entrance and the fact that a visit has already been counted are kept in your browser’s session storage, cleared when the tab is closed. The behaviour of the resources and hosting actually deployed still needs to be checked.'] },
        { title: 'If additional trackers are added', paragraphs: ['This page must then be updated. Trackers requiring consent must be subject to a real choice before activation; a “Manage cookies” link without working controls would not be enough.'] },
      ],
      contact: 'Ask about local storage',
    },
  },
}

export function LegalPage({ kind, language }: { kind: LegalPageKind; language: Language }) {
  const page = content[language][kind]
  const subject = language === 'fr' ? 'Question concernant le portfolio' : 'Question about the portfolio'
  const rightsSubject = language === 'fr' ? 'Exercice de mes droits RGPD' : 'Exercise of my data rights'

  useEffect(() => {
    if (kind !== 'privacy' || window.location.hash !== '#rights') return
    const frame = requestAnimationFrame(() => document.getElementById('rights')?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [kind])

  return <section className="legal-page"><div className="container legal-page-inner">
    <header className="legal-page-heading"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></header>
    {page.pending && <aside className="legal-page-pending" aria-label={language === 'fr' ? 'Informations à compléter' : 'Information to complete'}><strong>{language === 'fr' ? 'Informations à compléter avant validation' : 'Information to complete before approval'}</strong><ul>{page.pending.map((item) => <li key={item}>{item}</li>)}</ul></aside>}
    <div className="legal-page-sections">{page.sections.map((section) => <section key={section.title} id={section.id}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}{section.id === 'rights' && <div className="legal-page-actions"><a href={`mailto:${contactEmail}?subject=${encodeURIComponent(rightsSubject)}`}>{page.rights}</a><a href="https://www.cnil.fr/fr/plaintes">{page.complaint}</a></div>}</section>)}</div>
    <a className="legal-page-contact" href={`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`}>{page.contact} : {contactEmail}</a>
  </div></section>
}
