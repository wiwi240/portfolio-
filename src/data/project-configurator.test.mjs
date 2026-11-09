import test from 'node:test'
import assert from 'node:assert/strict'
import { compactCategories, initialDraft, needs, setChoice, toProjectPayload } from './project-configurator.ts'

test('chaque besoin des catégories compactes existe', () => {
  const ids = new Set(needs.map((need) => need.id))
  for (const group of compactCategories) for (const id of group.ids) assert.ok(ids.has(id), id)
})

test('chaque besoin a un titre et une description dans les deux langues', () => {
  for (const need of needs) {
    assert.ok(need.title.fr && need.title.en, need.id)
    assert.ok(need.description.fr && need.description.en, need.id)
  }
})

test('un brouillon initial garde le parcours demandé', () => {
  assert.equal(initialDraft('tool').path, 'tool')
  assert.equal(initialDraft().path, 'unsure')
})

test('cocher une fonctionnalité de vente ajoute le catalogue', () => {
  const draft = setChoice(initialDraft('create'), 'cart', 'wanted')
  assert.equal(draft.choices.cart, 'wanted')
  assert.equal(draft.choices.catalog, 'wanted')
})

test('décocher une fonctionnalité la retire', () => {
  const draft = setChoice(setChoice(initialDraft('create'), 'faq', 'wanted'), 'faq')
  assert.equal(draft.choices.faq, undefined)
})

test('la charge utile du projet ne contient pas les coordonnées', () => {
  const payload = toProjectPayload({ ...initialDraft('create'), activity: 'Atelier', choices: { faq: 'wanted' } })
  assert.equal(payload.activity, 'Atelier')
  assert.equal(payload.choices.faq, 'wanted')
  for (const key of ['name', 'email', 'company', 'message']) assert.equal(key in payload, false, key)
})
