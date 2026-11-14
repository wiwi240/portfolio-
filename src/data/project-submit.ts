import { track } from '@/lib/track'
import { initialDraft, setChoice, toProjectPayload, type PathId } from './project-configurator'

export type ProjectRequest = { path: PathId; selected: string[]; activity: string; name: string; email: string; message: string; website?: string }

// Same endpoint and payload shape as the configurator's final step, built from the configurator's own draft helpers.
export async function sendProjectRequest(request: ProjectRequest, fallbackError: string) {
  let draft = { ...initialDraft(request.path), activity: request.activity }
  for (const id of request.selected) draft = setChoice(draft, id, 'wanted')
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: request.name,
      email: request.email,
      message: request.message,
      project: toProjectPayload(draft),
      company: '',
      website: request.website ?? '',
      kind: 'project',
    }),
  })
  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.message || fallbackError)
  }
  track('request_sent')
}
