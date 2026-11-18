// Build-time only: renders each public page to HTML (see scripts/prerender.mjs). Must mirror the tree in main.tsx.
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import App from './App'
import { SmoothScrollProvider } from './components/smooth-scroll-provider'
import { AdminShortcut } from './components/admin-shortcut'

export { headTags, indexablePages, languages, sitemapXml } from './seo'
export { paths } from './site'

export async function render(pathname: string): Promise<string> {
  // prerender (unlike renderToString) waits for lazy sections, so About and the legal pages ship with their content.
  const { prelude } = await prerender(<StrictMode>
    <SmoothScrollProvider>
      <App pathname={pathname} />
    </SmoothScrollProvider>
    <AdminShortcut />
  </StrictMode>)
  return new Response(prelude).text()
}
