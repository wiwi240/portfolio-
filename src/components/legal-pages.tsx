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
      pending: ['Statut juridique et, s’il y a lieu, numéro d’immatriculation et de TVA', 'Adresse et numéro de téléphone professionnels', 'Nom, adresse et numéro de téléphone de l’hébergeur'],
      sections: [
        { title: 'Éditeur du site', paragraphs: ['Ce portfolio est présenté sous le nom de William Mahi. Le contact public est l’adresse email indiquée ci-dessous. Les autres informations d’identification professionnelle doivent être confirmées par l’éditeur.'] },
        { title: 'Hébergement', paragraphs: ['L’identité et les coordonnées de l’hébergeur ne figurent pas dans les informations disponibles pour ce projet. Elles doivent être ajoutées après vérification du déploiement effectif.'] },
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
        { title: 'Contact par email', paragraphs: ['Le contact proposé sur le portfolio ouvre votre application de messagerie. Les pages publiques ne présentent pas de formulaire à remplir sur le site. Si vous envoyez un message, son adresse d’expédition et les informations que vous y inscrivez sont transmises pour permettre une réponse à votre demande.'] },
        { title: 'Ressources appelées depuis d’autres services', paragraphs: ['Selon la page consultée, le navigateur peut demander des polices à Fontshare et Google Fonts, ainsi que des icônes à Simple Icons. Ces fournisseurs peuvent recevoir des données techniques liées à la requête. Leurs traitements et les modalités d’hébergement du site doivent être vérifiés pour compléter cette politique.'] },
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
        { title: 'Ressources tierces', paragraphs: ['Certaines pages chargent des polices depuis Fontshare et Google Fonts, et des icônes depuis Simple Icons. Le code du portfolio ne contient pas d’outil de statistiques publicitaires ni de panneau de préférences de cookies. Le comportement des ressources et de l’hébergement effectifs reste à contrôler.'] },
        { title: 'Si des traceurs supplémentaires sont ajoutés', paragraphs: ['La présente page doit alors être mise à jour. Les traceurs nécessitant un consentement doivent être soumis à un choix réel avant leur activation ; un simple lien « Gérer mes cookies » sans réglage fonctionnel ne suffirait pas.'] },
      ],
      contact: 'Poser une question sur le stockage',
    },
  },
  en: {
    legal: {
      eyebrow: 'Legal information', title: 'Legal notice', intro: 'Publisher identification and information about this portfolio.',
      pending: ['Legal status and, where applicable, registration and VAT numbers', 'Professional address and telephone number', 'Hosting provider’s name, address and telephone number'],
      sections: [
        { title: 'Website publisher', paragraphs: ['This portfolio is presented under the name William Mahi. The public contact method is the email address below. The remaining professional identification details must be confirmed by the publisher.'] },
        { title: 'Hosting', paragraphs: ['The hosting provider and its contact details are not available in the project information. They must be added after checking the actual deployment.'] },
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
        { title: 'Email contact', paragraphs: ['The portfolio’s contact link opens your email application. Public pages do not display an on-site form. If you send a message, your sender address and the information you include are transmitted so your enquiry can be answered.'] },
        { title: 'Resources requested from other services', paragraphs: ['Depending on the page, your browser may request fonts from Fontshare and Google Fonts and icons from Simple Icons. These providers may receive technical information associated with the request. Their processing and the site’s hosting arrangements must be checked to complete this policy.'] },
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
        { title: 'Third-party resources', paragraphs: ['Some pages load fonts from Fontshare and Google Fonts and icons from Simple Icons. The portfolio code contains no advertising analytics tool or cookie preferences panel. The behaviour of the resources and hosting actually deployed still needs to be checked.'] },
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
