import test from 'node:test'
import assert from 'node:assert/strict'
import {
  changePath,
  compactCategories,
  getActiveQuestions,
  hasPrivateDocuments,
  initialDraft,
  needs,
  removalConsequences,
  selectedChoiceIds,
  setChoice,
  suggestedNeedIds,
  toProjectPayload,
} from './project-configurator.ts'

test('les réponses communes survivent à un changement de parcours confirmé', () => {
  const draft = {
    ...initialDraft('create'),
    activity: 'Atelier Sillage',
    audience: ['clients'],
    choices: { catalog: 'wanted' },
    answers: { productType: 'Lampes' },
    name: 'Marie',
  }
  const changed = changePath(draft, 'support', true)
  assert.equal(changed.activity, 'Atelier Sillage')
  assert.deepEqual(changed.audience, ['clients'])
  assert.equal(changed.name, 'Marie')
  assert.deepEqual(changed.choices, {})
  assert.deepEqual(changed.answers, {})
})

test('le catalogue et la réservation ne sélectionnent aucun compte ou paiement supplémentaire', () => {
  const draft = setChoice(setChoice(initialDraft('create'), 'catalog', 'wanted'), 'booking', 'wanted')
  assert.deepEqual(selectedChoiceIds(draft), ['booking', 'catalog'])
  assert.equal(draft.choices.clientArea, undefined)
  assert.equal(draft.choices.payment, undefined)
})

test('le panier ajoute son catalogue nécessaire et prévient le retrait en cascade', () => {
  const draft = setChoice(initialDraft('create'), 'cart', 'wanted')
  assert.equal(draft.choices.catalog, 'wanted')
  assert.equal(draft.choices.payment, undefined)
  assert.deepEqual(removalConsequences(draft, 'catalog'), ['cart'])
  assert.deepEqual(setChoice(draft, 'catalog').choices, {})
})

test('un acompte en ligne peut être configuré sans catalogue', () => {
  const draft = setChoice(initialDraft('create'), 'payment', 'wanted')
  assert.deepEqual(draft.choices, { payment: 'wanted' })
})

test('les données de démonstration ne rejoignent jamais la demande réelle', () => {
  const draft = {
    ...setChoice(initialDraft('tool'), 'tasks', 'wanted'),
    activity: 'Atelier de luminaires',
    projectName: 'Atelier Sillage',
  }
  const payload = toProjectPayload(draft)
  assert.equal(payload.projectName, 'Atelier Sillage')
  assert.deepEqual(payload.choices, { tasks: 'wanted' })
  assert.equal('cart' in payload, false)
  assert.equal('messages' in payload, false)
  assert.equal(JSON.stringify(payload).includes('Lampe Aube'), false)
})

test('un document privé révèle la question d’accès sans imposer un espace personnel', () => {
  const draft = {
    ...setChoice(initialDraft('create'), 'documents', 'wanted'),
    answers: { documentPrivacy: 'private' },
  }
  assert.equal(hasPrivateDocuments(draft), true)
  assert.ok(
    getActiveQuestions(
      draft,
      needs.find((need) => need.id === 'documents'),
    ).some((question) => question.id === 'documentAccess'),
  )
  assert.equal(draft.choices.clientArea, undefined)
})

test('retirer une nouvelle fonctionnalité retire ses besoins liés tout en gardant les précisions en mémoire', () => {
  const draft = {
    ...setChoice(setChoice(initialDraft('improve'), 'newFeatures', 'wanted'), 'booking', 'wanted'),
    answers: { bookingType: 'Visite' },
    priorityNow: ['booking'],
  }
  assert.deepEqual(removalConsequences(draft, 'newFeatures'), ['booking'])
  const changed = setChoice(draft, 'newFeatures')
  assert.deepEqual(changed.choices, {})
  assert.deepEqual(changed.priorityNow, [])
  assert.equal(changed.answers.bookingType, 'Visite')
  assert.deepEqual(toProjectPayload(changed).answers, {})
})

test('la synthèse envoyée omet les précisions d’un besoin désélectionné', () => {
  const draft = {
    ...setChoice(initialDraft('create'), 'catalog', 'wanted'),
    answers: { productType: 'Lampes' },
  }
  const changed = setChoice(draft, 'catalog')
  assert.equal(changed.answers.productType, 'Lampes')
  assert.deepEqual(toProjectPayload(changed).answers, {})
})

test('les suggestions changent avec l’activité sans imposer de choix', () => {
  const restaurant = { ...initialDraft('create'), activity: 'Restaurant de quartier' }
  const artisan = { ...initialDraft('create'), activity: 'Atelier de luminaires' }
  assert.ok(suggestedNeedIds(restaurant).includes('menu'))
  assert.ok(suggestedNeedIds(artisan).includes('portfolio'))
  assert.deepEqual(restaurant.choices, {})
  assert.deepEqual(artisan.choices, {})
  assert.equal(compactCategories.length, 6)
})

test('les nouveaux modules et le budget restent des réponses réelles explicites', () => {
  let draft = { ...initialDraft('create'), activity: 'Restaurant', budget: 'À définir ensemble' }
  draft = setChoice(setChoice(draft, 'events', 'wanted'), 'eventSignup', 'wanted')
  const payload = toProjectPayload(draft)
  assert.equal(payload.budget, 'À définir ensemble')
  assert.deepEqual(payload.choices, { events: 'wanted', eventSignup: 'wanted' })
  assert.equal('demoEvents' in payload, false)
})
