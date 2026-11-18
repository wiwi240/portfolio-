// Post-build step: writes one HTML file per public page, with its own <head> (title, canonical, hreflang, Open Graph,
// JSON-LD) and its content already rendered, so crawlers and link previews never depend on JavaScript.
// Also writes app.html (empty shell for /admin, /rendez-vous and old configurator links) and sitemap.xml.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const { render, headTags, indexablePages, languages, paths, sitemapXml } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

// Sections loaded with lazy() in App.tsx: their CSS must be in the page HTML, or pre-rendered content shows unstyled
// until the chunk arrives. Their JS is preloaded so hydration does not wait on a request chain.
const manifest = JSON.parse(readFileSync(join(dist, '.vite', 'manifest.json'), 'utf8'))
const lazySections = {
  home: ['src/components/home-page.tsx'],
  about: ['src/components/journey-timeline.tsx', 'src/components/about-activity.tsx', 'src/components/ui/orbiting-skills.tsx'],
  legal: ['src/components/legal-pages.tsx'],
  terms: ['src/components/legal-pages.tsx'],
  privacy: ['src/components/legal-pages.tsx'],
  cookies: ['src/components/legal-pages.tsx'],
}
function chunkLinks(page) {
  const css = new Set()
  const js = new Set()
  const visit = (key, isEntry) => {
    const chunk = manifest[key]
    if (!chunk) throw new Error(`prerender: ${key} is not a chunk in the Vite manifest`)
    if (chunk.isEntry && !isEntry) return // the main entry is already linked by Vite
    if (js.has(chunk.file) || template.includes(`/${chunk.file}"`)) return
    js.add(chunk.file)
    chunk.css?.forEach((file) => css.add(file))
    chunk.imports?.forEach((imported) => visit(imported, false))
  }
  for (const source of lazySections[page] ?? []) visit(source, true)
  return [...[...css].map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`), ...[...js].map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`)].join('\n    ')
}

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const SEO_BLOCK = /<!--seo:start-->[\s\S]*<!--seo:end-->/
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) throw new Error('index.html is missing the seo markers or the root div')

// Shell for client-only routes: keeps the default head but must never be indexed.
const ROBOTS = /<meta name="robots"[^>]*>\s*<meta name="googlebot"[^>]*>/
if (!ROBOTS.test(template)) throw new Error('index.html is missing the robots meta tags')
writeFileSync(join(dist, 'app.html'), template.replace(ROBOTS, '<meta name="robots" content="noindex, follow" />'))

// "/" -> index.html, "/en/" -> en/index.html, "/projets" -> projets.html (vercel.json rewrites each route to its file).
const fileFor = (route) => (route.endsWith('/') ? route + 'index.html' : route + '.html').slice(1)

for (const language of languages) {
  for (const page of indexablePages) {
    const route = paths[language][page]
    const body = await render(route)
    const html = template
      .replace('<html lang="fr">', `<html lang="${language}">`)
      .replace(SEO_BLOCK, headTags(language, page))
      .replace('</head>', `  ${chunkLinks(page)}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    const file = join(dist, fileFor(route))
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html)
    console.log(`prerendered ${route.padEnd(32)} -> ${fileFor(route)}`)
  }
}

writeFileSync(join(dist, 'sitemap.xml'), sitemapXml(new Date().toISOString().slice(0, 10)))
rmSync(ssrDir, { recursive: true, force: true })
rmSync(join(dist, '.vite'), { recursive: true, force: true })
console.log('sitemap.xml written')
