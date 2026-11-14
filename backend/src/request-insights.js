const { PATHS, CHOICES, ANSWERS, MATERIALS } = require('./project-request')

// Everything here is derived from the configurator answers. Nothing is stored: the admin gets it with each request.

const HEAVY = new Set([
  'payment', 'cart', 'clientArea', 'documents', 'messages', 'tracking', 'customerManagement', 'caseManagement',
  'roles', 'automation', 'connection', 'stock', 'multilingual', 'commerce', 'orderTracking', 'quotesDocuments',
  'planning', 'tasks', 'metrics', 'team',
])
const MEDIUM = new Set([
  'catalog', 'booking', 'appointments', 'newsletter', 'administrators', 'quote', 'fileUpload', 'notifications',
  'history', 'manageOffers', 'publishNews', 'statuses', 'events', 'eventSignup', 'menu', 'productDetails', 'delivery',
  'promotions', 'newFeatures', 'diagnosis',
])
const weightOf = (id) => (HEAVY.has(id) ? 3 : MEDIUM.has(id) ? 2 : 1)

const URGENT_WORDS = /urgent|asap|rapidement|au plus vite|d[eè]s que possible|imm[eé]diat|cette semaine|semaine prochaine|ce mois/i

function parseDeadline(value) {
  const text = String(value || '')
  let match = /(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/.exec(text)
  if (match) return new Date(Date.UTC(+match[3], +match[2] - 1, +match[1]))
  match = /(\d{4})-(\d{2})-(\d{2})/.exec(text)
  if (match) return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]))
  return null
}

const labelsOf = (ids) => ids.map((id) => CHOICES[id] ?? id)
const clean = (value) => (typeof value === 'string' ? value.trim() : '')

function analyze(item, now = Date.now()) {
  const project = item.project_data
  if (!project) return { kind: 'message', alerts: [], questions: [] }

  const wanted = Object.keys(project.choices ?? {}).filter((id) => project.choices[id] === 'wanted')
  const discuss = Object.keys(project.choices ?? {}).filter((id) => project.choices[id] === 'discuss')
  const score = wanted.reduce((sum, id) => sum + weightOf(id), 0) + discuss.reduce((sum, id) => sum + weightOf(id) / 2, 0)
  const size = score <= 8 ? 'small' : score <= 20 ? 'medium' : 'large'
  const budget = clean(project.budget)
  const deadline = clean(project.importantDate)
  const deadlineDate = parseDeadline(deadline)
  const urgent = Boolean((deadlineDate && deadlineDate.getTime() - now < 45 * 24 * 3600 * 1000) || URGENT_WORDS.test(deadline))

  const alerts = []
  if (!budget) alerts.push({ id: 'no-budget', label: 'Budget non renseigné' })
  if (size === 'large' && !budget) alerts.push({ id: 'large-no-budget', label: 'Gros projet sans budget' })
  if (urgent) alerts.push({ id: 'urgent', label: 'Délai serré' })
  if (discuss.length >= 5 || discuss.length > wanted.length) alerts.push({ id: 'many-discuss', label: 'Beaucoup de points à discuter' })
  if (project.path === 'unsure') alerts.push({ id: 'unsure', label: 'Parcours pas encore défini' })
  if (!(project.priorityNow ?? []).length && wanted.length > 3) alerts.push({ id: 'no-priority', label: 'Aucune priorité immédiate' })

  const answers = project.answers ?? {}
  const has = (id) => wanted.includes(id) || discuss.includes(id)
  const questions = []
  if (project.path === 'unsure') questions.push('Quel est le besoin principal que ce projet doit couvrir ?')
  if (!budget) questions.push('Quel budget avez-vous en tête, même approximatif ?')
  if (!deadline) questions.push('Y a-t-il une date importante à respecter (lancement, événement, saison) ?')
  if (!(project.materials ?? []).length || (project.materials ?? []).includes('none')) questions.push('Disposez-vous déjà des textes, photos et du logo, ou faut-il les préparer ?')
  if ((project.path === 'improve' || project.path === 'support') && !clean(project.existingDetails)) questions.push('Pouvez-vous m’indiquer l’adresse du site ou de l’outil existant ?')
  if (has('payment') && !clean(answers.payment)) questions.push('Quels moyens de paiement souhaitez-vous proposer ?')
  if ((has('catalog') || has('cart')) && !clean(answers.productVolume)) questions.push('Combien de produits ou de prestations prévoyez-vous au départ ?')
  if ((has('booking') || has('appointments')) && !clean(answers.bookingType)) questions.push('Quel type de réservation ou de rendez-vous faut-il gérer, et avec combien d’intervenants ?')
  if (has('clientArea') && !clean(answers.clientFunctions)) questions.push('Que doivent pouvoir faire vos clients dans leur espace personnel ?')
  if (has('connection') && !clean(answers.tools)) questions.push('Avec quels outils existants faut-il se connecter ?')
  if (has('multilingual') && !clean(project.languages)) questions.push('Dans quelles langues le site doit-il être disponible ?')
  for (const id of discuss.slice(0, 3)) questions.push(`Pour « ${CHOICES[id]} » : qu’en attendez-vous concrètement ?`)

  return {
    kind: 'project',
    pathLabel: PATHS[project.path] ?? project.path,
    activity: clean(project.activity),
    projectName: project.namePending ? '' : clean(project.projectName),
    budget,
    deadline,
    wantedCount: wanted.length,
    discussCount: discuss.length,
    score: Math.round(score),
    size,
    urgent,
    alerts,
    questions,
    wanted: labelsOf(wanted),
  }
}

const firstName = (name) => clean(name).split(/\s+/)[0] || ''
const greeting = (item) => `Bonjour${firstName(item.name) ? ` ${firstName(item.name)}` : ''},`

// Reply templates. The owner edits them in the mail client: they only give a starting point.
function buildReplyTemplates(item, insights, signature = 'William Mahi') {
  const subjectBase = insights.projectName || insights.activity || 'votre projet'
  const sign = `\n\nCordialement,\n${signature}`
  const questions = (insights.questions ?? []).slice(0, 6).map((q) => `- ${q}`).join('\n')
  const pathIntro = {
    [PATHS.create]: 'Merci pour votre demande de création de site.',
    [PATHS.tool]: 'Merci pour votre demande d’outil sur mesure.',
    [PATHS.improve]: 'Merci pour votre demande d’amélioration.',
    [PATHS.support]: 'Merci pour votre demande de suivi.',
  }[insights.pathLabel] ?? 'Merci pour votre message.'
  return [
    {
      id: 'ack',
      label: 'Accusé de réception',
      subject: `Votre projet : ${subjectBase}`,
      body: `${greeting(item)}\n\n${pathIntro} J’ai bien reçu le récapitulatif de votre projet et je l’étudie. Je reviens vers vous sous 48 heures avec mes premières questions.${sign}`,
    },
    {
      id: 'questions',
      label: 'Questions de cadrage',
      subject: `Votre projet : quelques questions`,
      body: `${greeting(item)}\n\n${pathIntro} Pour bien cadrer votre projet, j’aurais besoin de quelques précisions :\n\n${questions || '- Pouvez-vous me décrire votre besoin principal ?'}\n\nSi c’est plus simple, nous pouvons aussi en parler lors d’un court échange.${sign}`,
    },
    {
      id: 'quote',
      label: 'Envoi de la proposition',
      subject: `Proposition pour ${subjectBase}`,
      body: `${greeting(item)}\n\nComme convenu, voici ma proposition pour ${subjectBase}. Elle distingue ce que nous faisons en priorité et ce qui peut venir ensuite. Dites-moi ce que vous en pensez, et nous ajustons ensemble.${sign}`,
    },
    {
      id: 'followup',
      label: 'Relance',
      subject: `Votre projet : où en êtes-vous ?`,
      body: `${greeting(item)}\n\nJe reviens vers vous au sujet de votre projet. Souhaitez-vous que nous en reparlions, ou que j’ajuste la proposition ?${sign}`,
    },
  ]
}

// A starting point for the quote, not a price list: prices stay for the owner to write by hand.
function buildProposal(item, insights) {
  const project = item.project_data
  if (!project) return ''
  const wanted = Object.keys(project.choices ?? {}).filter((id) => project.choices[id] === 'wanted')
  const discuss = Object.keys(project.choices ?? {}).filter((id) => project.choices[id] === 'discuss')
  const now = (project.priorityNow ?? []).filter((id) => project.choices[id])
  const later = (project.priorityLater ?? []).filter((id) => project.choices[id])
  const rest = wanted.filter((id) => !now.includes(id) && !later.includes(id))
  const bullet = (ids) => (ids.length ? ids.map((id) => `• ${CHOICES[id]}`).join('\n') : '• À définir ensemble')
  const lines = [
    `PROPOSITION : ${insights.projectName || insights.activity}`,
    `Client : ${item.name}${clean(item.company) ? ` (${clean(item.company)})` : ''}`,
    `Parcours : ${insights.pathLabel}`,
    '',
    'PHASE 1 : à réaliser en priorité',
    bullet(now.length ? now : rest),
    '',
    'PHASE 2 : à prévoir ensuite',
    bullet(later),
  ]
  if (now.length && rest.length) lines.push('', 'SOUHAITÉ, À PLACER DANS UNE PHASE', bullet(rest))
  lines.push('', 'POINTS À DISCUTER AVANT DE S’ENGAGER', bullet(discuss))
  const answers = Object.entries(project.answers ?? {}).filter(([, value]) => clean(value))
  if (answers.length) lines.push('', 'PRÉCISIONS DU CLIENT', ...answers.map(([id, value]) => `• ${ANSWERS[id]} : ${clean(value)}`))
  lines.push(
    '',
    'HYPOTHÈSES',
    `• Délai souhaité : ${insights.deadline || 'à définir'}`,
    `• Budget indicatif du client : ${insights.budget || 'non précisé'}`,
    `• Éléments disponibles : ${(project.materials ?? []).map((id) => MATERIALS[id]).join(', ') || 'à préciser'}`,
    ...(clean(project.constraints) ? [`• Contraintes : ${clean(project.constraints)}`] : []),
    '',
    'À VALIDER AVEC LE CLIENT',
    ...(insights.questions.length ? insights.questions.map((q) => `• ${q}`) : ['• Rien de particulier']),
    '',
    'PRIX',
    '• Phase 1 : à compléter',
    '• Phase 2 : à compléter',
  )
  return lines.join('\n')
}

module.exports = { analyze, buildReplyTemplates, buildProposal, parseDeadline }
