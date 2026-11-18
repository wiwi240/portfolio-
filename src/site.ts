import type { Language } from './data/portfolio-content'

export type PageId = 'home' | 'projects' | 'about' | 'contact' | 'configurator' | 'faq' | 'legal' | 'terms' | 'privacy' | 'cookies' | 'notFound'

export const paths: Record<Language, Record<Exclude<PageId, 'notFound'>, string>> = {
  fr: {
    home: '/', projects: '/projets', about: '/a-propos', contact: '/contact', configurator: '/configurateur', faq: '/faq', legal: '/mentions-legales', terms: '/cgu', privacy: '/politique-de-confidentialite', cookies: '/cookies',
  },
  en: {
    home: '/en/', projects: '/en/projects', about: '/en/about', contact: '/en/contact', configurator: '/en/project-configurator', faq: '/en/faq', legal: '/en/legal-notice', terms: '/en/terms-of-use', privacy: '/en/privacy-policy', cookies: '/en/cookies',
  },
}

export const siteOrigin = 'https://www.williammahi.dev'

export function resolveRoute(pathname: string): { language: Language; page: PageId } {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  for (const language of ['fr', 'en'] as const) {
    for (const [page, route] of Object.entries(paths[language])) {
      if (path === (route === '/' ? '/' : route.replace(/\/+$/, ''))) {
        return { language, page: page as PageId }
      }
    }
  }
  return { language: path.startsWith('/en/') || path === '/en' ? 'en' : 'fr', page: 'notFound' }
}

export const metadata: Record<Language, Record<PageId, { title: string; description: string }>> = {
  fr: {
    home: { title: 'Création de site internet à Coulommiers — William Mahi', description: 'Site internet, réservation en ligne, outil de gestion : des solutions simples pour les TPE, artisans et commerçants de Seine-et-Marne. Devis gratuit.' },
    projects: { title: 'Réalisations : sites internet et outils web — William Mahi', description: 'Exemples de sites internet et d’outils créés pour des indépendants et des entreprises, avec des captures réelles.' },
    about: { title: 'À propos — William Mahi, développeur web freelance', description: 'Parcours, compétences (React, TypeScript, Node.js) et méthode de travail de William Mahi, développeur web freelance en Seine-et-Marne.' },
    contact: { title: 'Demander un devis gratuit — William Mahi', description: 'Un projet de site internet ou d’outil pour votre entreprise ? Décrivez votre besoin en quelques minutes et recevez un devis gratuit.' },
    configurator: { title: 'Configurateur de projet — William Mahi', description: 'Décrivez votre projet web, explorez les fonctionnalités et transmettez une demande structurée.' },
    faq: { title: 'Création de site internet : vos questions — William Mahi', description: 'Prix, délais, visibilité sur Google, modifications : les réponses aux questions que se posent les entreprises avant de créer leur site.' },
    legal: { title: 'Mentions légales — William Mahi', description: 'Informations sur l’éditeur et l’hébergeur du site de William Mahi, développeur Full-Stack freelance.' },
    terms: { title: 'CGU — William Mahi', description: 'Conditions d’utilisation du portfolio de William Mahi.' },
    privacy: { title: 'Politique de confidentialité — William Mahi', description: 'Informations sur les données et les droits liés au portfolio de William Mahi.' },
    cookies: { title: 'Cookies et stockage local — William Mahi', description: 'Informations sur le stockage local et les ressources tierces du portfolio.' },
    notFound: { title: 'Page introuvable — William Mahi', description: 'La page demandée est introuvable.' },
  },
  en: {
    home: { title: 'William Mahi — Freelance Full-Stack Developer, Paris area & remote', description: 'Freelance Full-Stack developer (React, Node.js) based near Paris, France. Tailored websites and web apps, working remotely with clients anywhere. Open to job opportunities.' },
    projects: { title: 'Projects — William Mahi', description: 'Explore William Mahi’s web projects, interfaces and applications created for practical needs.' },
    about: { title: 'About and expertise — William Mahi', description: 'William Mahi’s background, approach, Full-Stack skills and services: websites, web apps, business software, redesign and maintenance.' },
    contact: { title: 'Contact — William Mahi', description: 'Contact William Mahi about a web project, freelance work, a recruitment opportunity or a question.' },
    configurator: { title: 'Project configurator — William Mahi', description: 'Describe your web project, explore possible features and send a structured request.' },
    faq: { title: 'FAQ — William Mahi', description: 'Answers to common questions about starting, scoping and following up on a web project.' },
    legal: { title: 'Legal notice — William Mahi', description: 'Publisher and hosting information for the website of William Mahi, freelance Full-Stack developer.' },
    terms: { title: 'Terms of use — William Mahi', description: 'Terms of use for William Mahi’s portfolio website.' },
    privacy: { title: 'Privacy policy — William Mahi', description: 'Information about data and privacy rights relating to William Mahi’s portfolio.' },
    cookies: { title: 'Cookies and local storage — William Mahi', description: 'Information about local storage and third-party resources on this portfolio.' },
    notFound: { title: 'Page not found — William Mahi', description: 'The requested page could not be found.' },
  },
}
