import {
  compactCategories,
  improvementOptions,
  needs,
  pathChoiceDetails,
  supportOptions,
  type Localized,
  type PathId,
} from './project-configurator'

// The home page guides the visitor through the configurator's own categories, one slide each.
// Titles, descriptions and ids all come from project-configurator.ts; only the order per path is chosen here.
export type GuideItem = { id: string; title: Localized; description: Localized }
export type GuideColumn = { id: string; title: Localized; items: GuideItem[] }
// A slide with `columns` shows one column per category; `items` always lists every item of the slide.
export type GuidePanelData = GuideColumn & { columns?: GuideColumn[] }

const ask = (fr: string, en: string): Localized => ({ fr, en })

// Short card titles for the home page. Ids, descriptions and images stay in pathOptions.
export const entryTitles: Partial<Record<PathId, Localized>> = {
  create: ask('Sites web', 'Websites'),
  tool: ask('Logiciels métier', 'Business software'),
  improve: ask('Refonte & amélioration', 'Redesign & improvement'),
  support: ask('Maintenance & suivi', 'Maintenance & support'),
}

const groupTitles: Record<string, Localized> = {
  ...Object.fromEntries(compactCategories.map((group) => [group.id, group.title])),
  content: ask('Gérer mon site', 'Manage my site'),
}

const category = (id: string): GuideColumn => {
  const title = groupTitles[id]
  if (!title) throw new Error(`Unknown category: ${id}`)
  const items = needs.filter((need) => need.group === id).map((need) => ({ id: need.id, title: need.title, description: need.description }))
  return { id, title, items }
}

// One slide whose columns are the given categories, side by side.
const slide = (id: string, title: Localized, ids: string[]): GuidePanelData => {
  const columns = ids.map(category)
  return { id, title, items: columns.flatMap((column) => column.items), columns }
}

const featuresTitle = ask('Quelles fonctionnalités vous seraient utiles ?', 'Which features would be useful?')

const choices = (id: string, title: Localized, list: ReadonlyArray<readonly [string, string, string]>): GuidePanelData => ({
  id,
  title,
  items: list.map(([itemId, fr, en]) => ({ id: itemId, title: ask(fr, en), description: pathChoiceDetails[itemId].description })),
})

export function guidePanels(path: PathId | null): GuidePanelData[] {
  switch (path) {
    case 'create':
      return [slide('features-1', featuresTitle, ['present', 'requests', 'sell']), slide('features-2', featuresTitle, ['clients', 'content'])]
    case 'tool':
      return [slide('features-1', featuresTitle, ['organize', 'clients']), slide('features-2', featuresTitle, ['requests', 'content'])]
    case 'improve':
      return [choices('improve', ask('Que souhaitez-vous améliorer ?', 'What would you like to improve?'), improvementOptions), slide('features-1', featuresTitle, ['present', 'requests', 'sell']), slide('features-2', featuresTitle, ['content'])]
    case 'support':
      return [choices('support', ask('Quel suivi souhaitez-vous ?', 'What kind of support do you need?'), supportOptions)]
    default:
      return []
  }
}
