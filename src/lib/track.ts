// Anonymous counters for the owner dashboard: no cookie, no identifier, no IP stored. Only the type of event,
// the profile picked on the entrance gate and the step number are sent.
export type Audience = 'client' | 'recruiter' | 'unknown'
type EventType = 'visit' | 'guide_start' | 'guide_step' | 'request_sent'

const AUDIENCE_KEY = 'audience-gate-choice'

export function setAudience(audience: 'client' | 'recruiter') {
  try { window.sessionStorage.setItem(AUDIENCE_KEY, audience) } catch { /* storage unavailable: the visit is counted as unknown */ }
}

export function getAudience(): Audience {
  try {
    const value = window.sessionStorage.getItem(AUDIENCE_KEY)
    return value === 'client' || value === 'recruiter' ? value : 'unknown'
  } catch { return 'unknown' }
}

export function track(type: EventType, step?: string) {
  try {
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, audience: getAudience(), ...(step ? { step } : {}) }),
      keepalive: true,
    }).catch(() => undefined)
  } catch { /* tracking must never break the page */ }
}

// Counts an event once per browser session.
export function trackOnce(key: string, type: EventType, step?: string) {
  try {
    if (window.sessionStorage.getItem(`track-${key}`)) return
    window.sessionStorage.setItem(`track-${key}`, '1')
  } catch { /* without storage the event may be counted more than once */ }
  track(type, step)
}
