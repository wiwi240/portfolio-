// Everything a search engine or a link preview reads in <head>: built once per page at build time (scripts/prerender.mjs).
import { faqContent } from './data/faq'
import { services } from './data/services'
import { contactEmail, githubUrl, linkedinUrl, projects, type Language } from './data/portfolio-content'
import { metadata, paths, siteOrigin, type PageId } from './site'

// The old configurator URL only redirects to the home page guide, so it is left out of the index.
export type IndexablePage = Exclude<PageId, 'notFound' | 'configurator'>
export const indexablePages: IndexablePage[] = ['home', 'projects', 'about', 'contact', 'faq', 'legal', 'terms', 'privacy', 'cookies']
export const languages: Language[] = ['fr', 'en']

const ogImage = `${siteOrigin}/og-william-mahi.png`
const personId = `${siteOrigin}/#person`
const websiteId = `${siteOrigin}/#website`
const serviceId = `${siteOrigin}/#service`
const locale = { fr: 'fr_FR', en: 'en_US' } as const
const htmlLang = { fr: 'fr-FR', en: 'en' } as const

// Town only: the business is run from home, so no street address is published.
const address = { '@type': 'PostalAddress', addressLocality: 'Coulommiers', postalCode: '77120', addressRegion: 'Île-de-France', addressCountry: 'FR' }
const areaServed = [
  { '@type': 'City', name: 'Coulommiers' },
  { '@type': 'AdministrativeArea', name: 'Seine-et-Marne' },
  { '@type': 'AdministrativeArea', name: 'Île-de-France' },
  { '@type': 'Country', name: 'France' },
]

export const pageUrl = (language: Language, page: IndexablePage) => siteOrigin + paths[language][page]

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const labels = {
  fr: { home: 'Accueil', jobTitle: 'Développeur full-stack freelance', service: 'William Mahi — Développeur full-stack freelance', offers: 'Prestations de développement web', ogAlt: 'William Mahi, développeur full-stack' },
  en: { home: 'Home', jobTitle: 'Freelance full-stack developer', service: 'William Mahi — Freelance full-stack developer', offers: 'Web development services', ogAlt: 'William Mahi, full-stack developer' },
} as const

// Short names for breadcrumbs: Google titles are written for search results and are too long here.
const crumbs: Record<Language, Record<Exclude<IndexablePage, 'home'>, string>> = {
  fr: { projects: 'Réalisations', about: 'À propos', contact: 'Contact', faq: 'FAQ', legal: 'Mentions légales', terms: 'CGU', privacy: 'Politique de confidentialité', cookies: 'Cookies' },
  en: { projects: 'Projects', about: 'About', contact: 'Contact', faq: 'FAQ', legal: 'Legal notice', terms: 'Terms of use', privacy: 'Privacy policy', cookies: 'Cookies' },
}

const pageTypes: Partial<Record<IndexablePage, string>> = { about: 'ProfilePage', contact: 'ContactPage', projects: 'CollectionPage', faq: 'FAQPage' }

function structuredData(language: Language, page: IndexablePage) {
  const url = pageUrl(language, page)
  const { title, description } = metadata[language][page]
  const l = labels[language]

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: 'William Mahi',
    url: `${siteOrigin}/`,
    image: `${siteOrigin}/portrait-william-mahi.webp`,
    jobTitle: l.jobTitle,
    address,
    email: `mailto:${contactEmail}`,
    sameAs: [githubUrl, linkedinUrl],
    knowsLanguage: ['fr', 'en'],
    knowsAbout: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL', 'Next.js', language === 'fr' ? 'Développement web' : 'Web development'],
  }
  const website = { '@type': 'WebSite', '@id': websiteId, url: `${siteOrigin}/`, name: 'William Mahi', inLanguage: ['fr-FR', 'en'], publisher: { '@id': personId } }
  const service = {
    '@type': 'ProfessionalService',
    '@id': serviceId,
    name: l.service,
    url: pageUrl(language, 'home'),
    image: ogImage,
    email: contactEmail,
    founder: { '@id': personId },
    address,
    areaServed,
    identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: '10973696700018' },
    knowsLanguage: ['fr', 'en'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: l.offers,
      itemListElement: services[language].map((item) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item.title, description: item.text } })),
    },
  }

  const webpage: Record<string, unknown> = {
    '@type': pageTypes[page] ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: htmlLang[language],
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage },
  }
  if (page === 'about') webpage.mainEntity = { '@id': personId }
  if (page === 'faq') {
    webpage.mainEntity = faqContent[language].items.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }))
  }
  if (page === 'projects') {
    webpage.mainEntity = {
      '@type': 'ItemList',
      itemListElement: projects[language].map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          image: siteOrigin + project.image,
          ...(project.href ? { url: project.href } : {}),
          keywords: project.technologies.join(', '),
          creator: { '@id': personId },
        },
      })),
    }
  }

  const graph: unknown[] = [person, website, webpage]
  if (page === 'home' || page === 'about' || page === 'contact') graph.push(service)
  if (page !== 'home') {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: l.home, item: pageUrl(language, 'home') },
        { '@type': 'ListItem', position: 2, name: crumbs[language][page], item: url },
      ],
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Page-specific <head> tags: title, description, canonical, language alternates, link previews and JSON-LD. */
export function headTags(language: Language, page: IndexablePage): string {
  const { title, description } = metadata[language][page]
  const url = pageUrl(language, page)
  const other: Language = language === 'fr' ? 'en' : 'fr'
  const t = escapeAttr(title)
  const d = escapeAttr(description)
  // "<" is escaped so a text value can never close the script element.
  const jsonLd = JSON.stringify(structuredData(language, page)).replace(/</g, '\\u003c')
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="fr" href="${pageUrl('fr', page)}" />`,
    `<link rel="alternate" hreflang="en" href="${pageUrl('en', page)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('fr', page)}" />`,
    `<meta property="og:type" content="${page === 'about' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="William Mahi" />`,
    `<meta property="og:locale" content="${locale[language]}" />`,
    `<meta property="og:locale:alternate" content="${locale[other]}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(labels[language].ogAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(labels[language].ogAlt)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')
}

/** Every indexable URL in both languages, each with its alternates (x-default points to French). */
export function sitemapXml(lastmod: string): string {
  const entries = indexablePages.flatMap((page) => languages.map((language) => {
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="fr" href="${pageUrl('fr', page)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${pageUrl('en', page)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('fr', page)}"/>`,
    ].join('\n')
    return `  <url>\n    <loc>${pageUrl(language, page)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`
  }))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
}
