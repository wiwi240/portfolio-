import {
  improvementOptions,
  needs,
  pathChoiceDetails,
  supportOptions,
  type ChoiceState,
  type ProjectDraft,
} from './project-configurator'
import type { Language } from './portfolio-content'

export type PreviewContext = 'public' | 'client' | 'management'
export type PreviewModule = {
  id: string
  title: string
  description: string
  context: PreviewContext
  state: ChoiceState
  image?: string
}

const clientIds = new Set([
  'clientArea',
  'documents',
  'messages',
  'tracking',
  'history',
  'notifications',
  'orderTracking',
])
const managementIds = new Set([
  'team',
  'automation',
  'connection',
  'metrics',
  'customerManagement',
  'caseManagement',
  'quotesDocuments',
  'planning',
  'tasks',
  'roles',
  'statuses',
  'editTexts',
  'editImages',
  'manageOffers',
  'publishNews',
  'multilingual',
  'administrators',
  'events',
  'stock',
])

export function previewModules(draft: ProjectDraft, language: Language): PreviewModule[] {
  const canShowNeeds =
    draft.path === 'create' || draft.path === 'tool' || draft.path === 'unsure' || draft.path === 'improve'
  const chosenNeeds = canShowNeeds
    ? needs
        .filter((need) => draft.choices[need.id])
        .map((need) => ({
          id: need.id,
          title: need.title[language],
          description: need.description[language],
          context: (clientIds.has(need.id)
            ? 'client'
            : managementIds.has(need.id)
              ? 'management'
              : 'public') as PreviewContext,
          state: draft.choices[need.id],
          image: need.image,
        }))
    : []
  const options =
    draft.path === 'improve' ? improvementOptions : draft.path === 'support' ? supportOptions : []
  return [
    ...options
      .filter(([id]) => draft.choices[id])
      .map(([id, fr, en]) => ({
        id,
        title: language === 'fr' ? fr : en,
        description: pathChoiceDetails[id].description[language],
        context: 'management' as const,
        state: draft.choices[id],
        image: pathChoiceDetails[id].image,
      })),
    ...chosenNeeds,
  ]
}

export function previewContextFor(id: string): PreviewContext {
  return clientIds.has(id) ? 'client' : managementIds.has(id) ? 'management' : 'public'
}
