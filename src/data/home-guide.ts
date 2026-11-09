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

const category = (id: string): GuidePanelData => {
  const group = compactCategories.find((item) => item.id === id)
  if (!group) throw new Error(`Unknown category: ${id}`)
  const items = group.ids.map((needId) => {
    const need = needs.find((item) => item.id === needId)
    if (!need) throw new Error(`Unknown need: ${needId}`)
    return { id: need.id, title: need.title, description: need.description }
  })
  return { id, title: group.title, items }
}

const choices = (id: string, title: Localized, list: ReadonlyArray<readonly [string, string, string]>): GuidePanelData => ({
  id,
  title,
  items: list.map(([itemId, fr, en]) => ({ id: itemId, title: ask(fr, en), description: pathChoiceDetails[itemId].description })),
})

export function guidePanels(path: PathId | null): GuidePanelData[] {
  switch (path) {
    case 'create':
      return ['present', 'requests', 'sell', 'clients'].map(category)
    case 'tool':
      return ['organize', 'clients', 'requests'].map(category)
    case 'improve':
      return [choices('improve', ask('Que souhaitez-vous améliorer ?', 'What would you like to improve?'), improvementOptions), ...['present', 'requests', 'sell'].map(category)]
    case 'support':
      return [choices('support', ask('Quel suivi souhaitez-vous ?', 'What kind of support do you need?'), supportOptions)]
    default:
      return []
  }
}
