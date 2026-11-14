const test = require('node:test')
const assert = require('node:assert/strict')
const { analyze, buildReplyTemplates, buildProposal } = require('./request-insights')
const { generateSlots, zonedToUtc, sanitizeAvailability, sanitizeSettings, buildStats, createLimiter, createSharedLimiter, DEFAULT_SETTINGS } = require('./admin-extras')

const project = (overrides = {}) => ({
  path: 'create', activity: 'Atelier de luminaires', projectName: 'Atelier Sillage', namePending: false,
  choices: { catalog: 'wanted', cart: 'wanted', payment: 'wanted', booking: 'discuss' },
  answers: {}, priorityNow: ['catalog'], priorityLater: ['payment'], selfEdit: [], materials: [],
  importantDate: '', budget: '', constraints: '', ...overrides,
})
const row = (data, extra = {}) => ({ id: 1, name: 'Marie Martin', email: 'marie@example.com', company: '', project_data: data, status: 'new', ...extra })

test('analyze: a plain message has no project insights', () => {
  assert.deepEqual(analyze(row(null)), { kind: 'message', alerts: [], questions: [] })
})

test('analyze: size grows with the heavy features and alerts flag missing information', () => {
  const small = analyze(row(project({ choices: { about: 'wanted', faq: 'wanted' }, priorityNow: [], priorityLater: [] })))
  assert.equal(small.size, 'small')
  const big = analyze(row(project()))
  assert.notEqual(big.size, 'small')
  assert.ok(big.alerts.some((a) => a.id === 'no-budget'))
  assert.ok(big.questions.some((q) => /paiement/i.test(q)))
  const heavy = analyze(row(project({ choices: Object.fromEntries(['payment', 'cart', 'clientArea', 'documents', 'messages', 'tracking', 'automation'].map((id) => [id, 'wanted'])), priorityNow: [], priorityLater: [] })))
  assert.equal(heavy.size, 'large')
  assert.ok(heavy.alerts.some((a) => a.id === 'large-no-budget'))
})

test('analyze: urgency comes from keywords or from a near date', () => {
  const now = Date.UTC(2026, 10, 13)
  assert.equal(analyze(row(project({ importantDate: 'Dès que possible' })), now).urgent, true)
  assert.equal(analyze(row(project({ importantDate: '01/12/2026' })), now).urgent, true)
  assert.equal(analyze(row(project({ importantDate: '01/06/2027' })), now).urgent, false)
  assert.equal(analyze(row(project({ budget: '3000 €' })), now).alerts.some((a) => a.id === 'no-budget'), false)
})

test('templates and proposal are built from the request and leave prices to the owner', () => {
  const item = row(project({ importantDate: 'Fin mars' }))
  const insights = analyze(item)
  const templates = buildReplyTemplates(item, insights, 'William')
  assert.deepEqual(templates.map((t) => t.id), ['ack', 'questions', 'quote', 'followup'])
  assert.match(templates[0].body, /^Bonjour Marie,/)
  assert.match(templates[1].body, /paiement/i)
  assert.match(templates[0].body, /William$/)
  const proposal = buildProposal(item, insights)
  assert.match(proposal, /PHASE 1[^]*Catalogue/)
  assert.match(proposal, /PHASE 2[^]*Paiement en ligne/)
  assert.match(proposal, /Phase 1 : à compléter/)
})

test('zonedToUtc handles winter and summer time in Paris', () => {
  assert.equal(new Date(zonedToUtc(2026, 1, 15, 9, 0)).toISOString(), '2026-01-15T08:00:00.000Z')
  assert.equal(new Date(zonedToUtc(2026, 7, 15, 9, 0)).toISOString(), '2026-07-15T07:00:00.000Z')
})

test('generateSlots respects notice, blocked days, weekends and booked slots', () => {
  const availability = { duration: 60, noticeHours: 24, horizonDays: 7, days: { 1: { start: '09:00', end: '11:00' } }, blocked: ['2026-11-23'] }
  const now = Date.UTC(2026, 10, 13, 10, 0) // Friday
  const slots = generateSlots(availability, new Set(), now)
  assert.deepEqual(slots, ['2026-11-16T08:00:00.000Z', '2026-11-16T09:00:00.000Z'])
  assert.deepEqual(generateSlots(availability, new Set(['2026-11-16T08:00:00.000Z']), now), ['2026-11-16T09:00:00.000Z'])
  assert.deepEqual(generateSlots({ ...availability, noticeHours: 100 }, new Set(), now), [])
})

test('availability and settings validation', () => {
  assert.ok(sanitizeAvailability(DEFAULT_SETTINGS.availability))
  assert.equal(sanitizeAvailability({ ...DEFAULT_SETTINGS.availability, duration: 7 }), null)
  assert.equal(sanitizeAvailability({ ...DEFAULT_SETTINGS.availability, days: { 1: { start: '17:00', end: '09:00' } } }), null)
  assert.equal(sanitizeAvailability({ ...DEFAULT_SETTINGS.availability, days: { 9: { start: '09:00', end: '10:00' } } }), null)
  assert.equal(sanitizeAvailability({ ...DEFAULT_SETTINGS.availability, blocked: ['demain'] }), null)
  assert.ok(sanitizeSettings(DEFAULT_SETTINGS))
  assert.equal(sanitizeSettings({ ...DEFAULT_SETTINGS, signature: '   ' }), null)
  assert.equal(sanitizeSettings({ ...DEFAULT_SETTINGS, followUpDays: 0 }), null)
})

test('buildStats: funnel, revenue, win rate and decline reasons', () => {
  const now = Date.UTC(2026, 10, 13)
  const mk = (status, extra = {}) => ({ ...row(project()), status, created_at: new Date(now - 24 * 3600 * 1000).toISOString(), archived: false, history: [], insights: analyze(row(project())), ...extra })
  const items = [mk('accepted', { amount: 3000 }), mk('quoted', { amount: 1000 }), mk('declined', { decline_reason: 'Budget' }), mk('new', { archived: true })]
  const at = new Date(now - 3600 * 1000).toISOString()
  const events = [
    { type: 'visit', audience: 'client', step: '', created_at: at }, { type: 'visit', audience: 'recruiter', step: '', created_at: at },
    { type: 'guide_start', audience: 'client', step: '', created_at: at }, { type: 'guide_step', audience: 'client', step: '2', created_at: at },
    { type: 'request_sent', audience: 'client', step: '', created_at: at },
  ]
  const stats = buildStats(items, events, now)
  assert.deepEqual([stats.funnel.visits, stats.funnel.guideStarts, stats.funnel.requestsSent], [2, 1, 1])
  assert.equal(stats.funnel.sendRate, 1)
  assert.deepEqual(stats.revenue, { signed: 3000, pipeline: 1000, wonCount: 1, declinedCount: 1, winRate: 0.5 })
  assert.deepEqual(stats.declineReasons, [{ label: 'Budget', count: 1 }])
  assert.equal(stats.perWeek.reduce((sum, w) => sum + w.count, 0), 3)
  assert.deepEqual(stats.steps, [{ step: 2, count: 1 }])
})

test('createLimiter blocks after the maximum within the window', () => {
  const limit = createLimiter(2, 1000)
  assert.deepEqual([limit('a', 0), limit('a', 1), limit('a', 2), limit('b', 2), limit('a', 1500)], [true, true, false, true, true])
})

test('createSharedLimiter counts in the database so instances share it, and falls back to memory if it fails', async () => {
  const rows = new Map()
  const fakePool = { query: async (_sql, [bucket, key]) => { const id = `${bucket}:${key}`; rows.set(id, (rows.get(id) ?? 0) + 1); return { rows: [{ request_count: rows.get(id) }] } } }
  const a = createSharedLimiter('t', 2, 1000)
  const b = createSharedLimiter('t', 2, 1000) // another "instance"
  assert.equal(await a(fakePool, 'ip'), true)
  assert.equal(await b(fakePool, 'ip'), true)
  assert.equal(await a(fakePool, 'ip'), false)
  assert.equal(await b(fakePool, 'other'), true)
  const broken = { query: async () => { throw new Error('db down') } }
  const c = createSharedLimiter('t', 1, 1000)
  assert.equal(await c(broken, 'ip'), true)
  assert.equal(await c(broken, 'ip'), false)
})
