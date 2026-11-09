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
export type GuidePanelData = { id: string; title: Localized; items: GuideItem[] }

const ask = (fr: string, en: string): Localized => ({ fr, en })

// Short card titles for the home page. Ids, descriptions and images stay in pathOptions.
export const entryTitles: Partial<Record<PathId, Localized>> = {
  create: ask('Sites web', 'Websites'),
  tool: ask('Logiciels métier', 'Business software'),
  improve: ask('Refonte & amélioration', 'Redesign & improvement'),
  support: ask('Maintenance & suivi', 'Maintenance & support'),
}

// Every need of a group is offered, split into slides of at most PAGE_SIZE so each slide stays readable.
const PAGE_SIZE = 6
const groupTitles: Record<string, Localized> = {
  ...Object.fromEntries(compactCategories.map((group) => [group.id, group.title])),
  content: ask('Gérer mon site', 'Manage my site'),
}

const category = (id: string): GuidePanelData[] => {
  const title = groupTitles[id]
  if (!title) throw new Error(`Unknown category: ${id}`)
  const items = needs.filter((need) => need.group === id).map((need) => ({ id: need.id, title: need.title, description: need.description }))
  const pages: GuidePanelData[] = []
  for (let start = 0; start < items.length; start += PAGE_SIZE)
    pages.push({ id: start === 0 ? id : `${id}-${start / PAGE_SIZE + 1}`, title, items: items.slice(start, start + PAGE_SIZE) })
  return pages
}

const choices = (id: string, title: Localized, list: ReadonlyArray<readonly [string, string, string]>): GuidePanelData => ({
  id,
  title,
  items: list.map(([itemId, fr, en]) => ({ id: itemId, title: ask(fr, en), description: pathChoiceDetails[itemId].description })),
})

export function guidePanels(path: PathId | null): GuidePanelData[] {
  switch (path) {
    case 'create':
      return ['present', 'requests', 'sell', 'clients', 'content'].flatMap(category)
    case 'tool':
      return ['organize', 'clients', 'requests', 'content'].flatMap(category)
    case 'improve':
      return [choices('improve', ask('Que souhaitez-vous améliorer ?', 'What would you like to improve?'), improvementOptions), ...['present', 'requests', 'sell', 'content'].flatMap(category)]
    case 'support':
      return [choices('support', ask('Quel suivi souhaitez-vous ?', 'What kind of support do you need?'), supportOptions)]
    default:
      return []
  }
}
