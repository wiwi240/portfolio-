import type { Language } from './data/portfolio-content'

export type PageId = 'home' | 'projects' | 'expertise' | 'about' | 'contact' | 'faq' | 'legal' | 'terms' | 'privacy' | 'cookies' | 'notFound'

export const paths: Record<Language, Record<Exclude<PageId, 'notFound'>, string>> = {
  fr: {
    home: '/', projects: '/projets', expertise: '/expertises', about: '/a-propos', contact: '/contact', faq: '/faq', legal: '/mentions-legales', terms: '/cgu', privacy: '/politique-de-confidentialite', cookies: '/cookies',
  },
  en: {
    home: '/en/', projects: '/en/projects', expertise: '/en/expertise', about: '/en/about', contact: '/en/contact', faq: '/en/faq', legal: '/en/legal-notice', terms: '/en/terms-of-use', privacy: '/en/privacy-policy', cookies: '/en/cookies',
  },
}

export const publicRoutes = Object.values(paths).flatMap((pages) => Object.values(pages))
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
    home: { title: 'William Mahi — Développeur Full-Stack', description: 'Développeur Full-Stack freelance, William Mahi conçoit des sites et applications web et reste ouvert aux opportunités professionnelles.' },
    projects: { title: 'Projets — William Mahi', description: 'Découvrez les projets web de William Mahi : interfaces, applications et solutions développées pour des besoins concrets.' },
    expertise: { title: 'Expertises — William Mahi', description: 'Compétences Full-Stack et prestations de William Mahi : sites web, applications, logiciels métier, refonte et maintenance.' },
    about: { title: 'À propos — William Mahi', description: 'Découvrez le parcours, l’approche du développement et les expériences de William Mahi, développeur Full-Stack.' },
    contact: { title: 'Contact — William Mahi', description: 'Contactez William Mahi pour un projet web, une mission freelance, une opportunité de recrutement ou une question.' },
    faq: { title: 'FAQ — William Mahi', description: 'Réponses aux questions fréquentes sur le démarrage, le périmètre et le suivi d’un projet web.' },
    legal: { title: 'Mentions légales — William Mahi', description: 'Informations d’édition et d’hébergement du portfolio de William Mahi, avec éléments restant à compléter.' },
    terms: { title: 'CGU — William Mahi', description: 'Conditions d’utilisation du portfolio de William Mahi.' },
    privacy: { title: 'Politique de confidentialité — William Mahi', description: 'Informations sur les données et les droits liés au portfolio de William Mahi.' },
    cookies: { title: 'Cookies et stockage local — William Mahi', description: 'Informations sur le stockage local et les ressources tierces du portfolio.' },
    notFound: { title: 'Page introuvable — William Mahi', description: 'La page demandée est introuvable.' },
  },
  en: {
    home: { title: 'William Mahi — Full-Stack Developer', description: 'William Mahi is a freelance Full-Stack developer building websites and web apps and open to professional opportunities.' },
    projects: { title: 'Projects — William Mahi', description: 'Explore William Mahi’s web projects, interfaces and applications created for practical needs.' },
    expertise: { title: 'Expertise — William Mahi', description: 'William Mahi’s Full-Stack skills and services: websites, web apps, business software, redesign and maintenance.' },
    about: { title: 'About — William Mahi', description: 'Learn about William Mahi’s background, development approach and experience as a Full-Stack developer.' },
    contact: { title: 'Contact — William Mahi', description: 'Contact William Mahi about a web project, freelance work, a recruitment opportunity or a question.' },
    faq: { title: 'FAQ — William Mahi', description: 'Answers to common questions about starting, scoping and following up on a web project.' },
    legal: { title: 'Legal notice — William Mahi', description: 'Publisher and hosting information for William Mahi’s portfolio, including details still to be completed.' },
    terms: { title: 'Terms of use — William Mahi', description: 'Terms of use for William Mahi’s portfolio website.' },
    privacy: { title: 'Privacy policy — William Mahi', description: 'Information about data and privacy rights relating to William Mahi’s portfolio.' },
    cookies: { title: 'Cookies and local storage — William Mahi', description: 'Information about local storage and third-party resources on this portfolio.' },
    notFound: { title: 'Page not found — William Mahi', description: 'The requested page could not be found.' },
  },
}
