const test = require('node:test')
const assert = require('node:assert/strict')
const { validateProject, buildProjectSummary } = require('./project-request')

function draft(path = 'create') {
  return {
    path,
    activity: 'Atelier de luminaires',
    audience: ['clients'],
    goal: 'present',
    existing: 'no',
    existingDetails: '',
    aspiration: path === 'unsure' ? 'Faciliter les demandes' : '',
    choices: {},
    answers: {},
    priorityNow: [],
    priorityLater: [],
    selfEdit: [],
    languages: '',
    materials: [],
    dataToMove: '',
    access: '',
    importantDate: '',
    dateReason: '',
    constraints: '',
  }
}

test('un catalogue consultatif est accepté sans vente ni paiement', () => {
  const project = draft()
  project.choices.catalog = 'wanted'
  project.answers.productType = 'Luminaires physiques'
  assert.ok(validateProject(project))
  const summary = buildProjectSummary(project, '', '')
  assert.match(summary, /Catalogue de produits ou de prestations/)
  assert.doesNotMatch(summary, /Vendre en ligne/)
})

test('panier et réservation ne créent pas automatiquement un compte client ou un paiement', () => {
  const project = draft()
  project.choices.catalog = 'wanted'
  project.choices.cart = 'wanted'
  project.choices.booking = 'discuss'
  const summary = buildProjectSummary(project, '', '')
  assert.match(summary, /Panier/)
  assert.match(summary, /Réservation d’une prestation/)
  assert.doesNotMatch(summary, /Compte personnel/)
  assert.doesNotMatch(summary, /Paiement en ligne/)
  assert.doesNotMatch(summary, /Paiement éventuel :/)
})

test('les accès aux documents privés figurent dans la synthèse', () => {
  const project = draft()
  project.choices.documents = 'wanted'
  project.answers.documentPrivacy = 'private'
  project.answers.documentAccess = 'Chaque client voit son propre dossier'
  const summary = buildProjectSummary(project, '', '')
  assert.match(summary, /Identification et autorisations : Chaque client voit son propre dossier/)
})

test('le parcours indécis peut rester court', () => {
  const project = draft('unsure')
  project.aspiration = ''
  assert.ok(validateProject(project))
})

test('le backend retire les propriétés fictives avant stockage', () => {
  const project = {
    ...draft('tool'),
    projectName: 'Atelier Sillage',
    namePending: false,
    choices: { tasks: 'wanted' },
    fakeCart: ['Lampe Aube'],
    demoMessages: ['Bonjour'],
  }
  const accepted = validateProject(project)
  assert.ok(accepted)
  assert.equal(accepted.projectName, 'Atelier Sillage')
  assert.equal('fakeCart' in accepted, false)
  assert.equal('demoMessages' in accepted, false)
})

test('les réponses hors parcours et les priorités incohérentes sont refusées', () => {
  const project = draft('support')
  project.choices.catalog = 'wanted'
  assert.equal(validateProject(project), null)
  delete project.choices.catalog
  project.choices.broken = 'wanted'
  project.priorityNow = ['catalog']
  assert.equal(validateProject(project), null)
})

test('les nouveaux éléments et le budget sont validés sans stocker la simulation', () => {
  const project = {
    ...draft(),
    budget: 'À définir ensemble',
    choices: { menu: 'wanted', events: 'wanted', eventSignup: 'wanted', stock: 'wanted' },
    demoEvents: [{ title: 'Atelier fictif' }],
    fakeStock: { lamp: 4 },
  }
  const accepted = validateProject(project)
  assert.ok(accepted)
  assert.equal(accepted.budget, 'À définir ensemble')
  assert.equal(accepted.demoEvents, undefined)
  assert.equal(accepted.fakeStock, undefined)
  const summary = buildProjectSummary(accepted, '', '')
  assert.match(summary, /Budget indicatif : À définir ensemble/)
  assert.match(summary, /Gestion des stocks/)
  assert.doesNotMatch(summary, /Atelier fictif/)
})
