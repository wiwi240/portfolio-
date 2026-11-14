import test from 'node:test'
import assert from 'node:assert/strict'
import { reminder } from './admin-api.ts'

const DAY = 24 * 3600 * 1000
const now = Date.UTC(2026, 10, 13, 12)
const item = (over = {}) => ({ id: 1, status: 'new', archived: false, follow_up_at: null, history: [], created_at: new Date(now - DAY).toISOString(), updated_at: new Date(now - DAY).toISOString(), ...over })

test('a new request waits two days before it counts as unanswered', () => {
  assert.equal(reminder(item(), now, 3), null)
  assert.match(reminder(item({ created_at: new Date(now - 3 * DAY).toISOString() }), now, 3), /Sans réponse depuis 3 j/)
})

test('a quote is chased after the configured delay, counted from when it was sent', () => {
  const quoted = (days) => item({ status: 'quoted', history: [{ at: new Date(now - days * DAY).toISOString(), type: 'status', from: 'discussing', to: 'quoted' }] })
  assert.equal(reminder(quoted(2), now, 3), null)
  assert.match(reminder(quoted(4), now, 3), /Devis envoyé il y a 4 j/)
  assert.equal(reminder(quoted(4), now, 7), null)
})

test('an explicit follow-up date replaces the automatic rules', () => {
  assert.match(reminder(item({ follow_up_at: '2026-11-10' }), now, 3), /Relance prévue/)
  assert.equal(reminder(item({ follow_up_at: '2026-12-01', created_at: new Date(now - 9 * DAY).toISOString() }), now, 3), null)
})

test('archived, declined or won requests are never chased', () => {
  const old = new Date(now - 30 * DAY).toISOString()
  for (const over of [{ archived: true }, { status: 'declined' }, { status: 'accepted' }, { status: 'delivered' }]) assert.equal(reminder(item({ created_at: old, ...over }), now, 3), null)
})
