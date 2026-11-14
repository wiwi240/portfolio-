const crypto = require('node:crypto')
const express = require('express')
const dotenv = require('dotenv')
const { Pool } = require('pg')
const { validateProject, buildProjectSummary } = require('./project-request')
const { buildProjectPdf } = require('./project-pdf')
const { analyze, buildReplyTemplates, buildProposal } = require('./request-insights')
const extras = require('./admin-extras')

dotenv.config()

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const IS_PRODUCTION = NODE_ENV === 'production'
const PORT = Number.parseInt(process.env.PORT ?? '4000', 10)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN?.trim() || ''
const defaultAllowedOrigins = [
  CLIENT_ORIGIN,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
  !IS_PRODUCTION ? 'http://localhost:5173' : '',
]
const ALLOWED_ORIGINS = [...new Set(defaultAllowedOrigins.flatMap((value) => value.split(',')).map((origin) => origin.trim()).filter(Boolean))]
const DATABASE_URL = process.env.DATABASE_URL?.trim() || null
const CONTACT_RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? '600000', 10)
const CONTACT_RATE_LIMIT_MAX = Number.parseInt(process.env.CONTACT_RATE_LIMIT_MAX ?? '5', 10)

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', IS_PRODUCTION ? 1 : false)
app.use(express.json({ limit: '1mb' }))

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (requestOrigin) {
    if (!ALLOWED_ORIGINS.includes(requestOrigin)) {
      res.status(403).json({
        message: 'Origin non autorisee.',
      })
      return
    }

    res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  next()
})

let pool = null
let databaseReady = false
let databaseInitPromise = null
const fallbackMessages = []
let nextMessageId = 1
const contactRateLimitStore = new Map()

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// Strict on purpose: the address ends up in mailto: links and mail headers, so no ? & # % quotes or separators.
const EMAIL_PATTERN = /^[A-Za-z0-9._+-]{1,64}@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
 
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g

function getClientIp(req) {
  if (typeof req.ip === 'string' && req.ip.trim()) {
    return req.ip.replace(/^::ffff:/, '')
  }

  return req.ip || req.socket?.remoteAddress || 'unknown'
}

function pruneExpiredRateLimitEntries(now) {
  for (const [clientIp, entry] of contactRateLimitStore.entries()) {
    if (now > entry.resetAt) {
      contactRateLimitStore.delete(clientIp)
    }
  }
}

function checkContactRateLimitMemory(req) {
  const now = Date.now()
  pruneExpiredRateLimitEntries(now)
  const clientIp = getClientIp(req)
  const entry = contactRateLimitStore.get(clientIp)

  if (!entry || now > entry.resetAt) {
    contactRateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    })

    return {
      allowed: true,
      remaining: CONTACT_RATE_LIMIT_MAX - 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    }
  }

  if (entry.count >= CONTACT_RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count += 1

  return {
    allowed: true,
    remaining: Math.max(CONTACT_RATE_LIMIT_MAX - entry.count, 0),
    resetAt: entry.resetAt,
  }
}

async function checkContactRateLimit(req) {
  if (!databaseReady || !pool) {
    return checkContactRateLimitMemory(req)
  }

  const clientIp = getClientIp(req)
  const now = Date.now()
  const windowStartedAt = new Date(now - CONTACT_RATE_LIMIT_WINDOW_MS)

  const result = await pool.query(
    `
      INSERT INTO contact_rate_limits (client_ip, window_started_at, request_count)
      VALUES ($1, NOW(), 1)
      ON CONFLICT (client_ip)
      DO UPDATE
      SET
        window_started_at = CASE
          WHEN contact_rate_limits.window_started_at < $2
            THEN NOW()
          ELSE contact_rate_limits.window_started_at
        END,
        request_count = CASE
          WHEN contact_rate_limits.window_started_at < $2
            THEN 1
          ELSE contact_rate_limits.request_count + 1
        END
      RETURNING request_count, window_started_at
    `,
    [clientIp, windowStartedAt.toISOString()],
  )

  const row = result.rows[0]
  const resetAt = new Date(row.window_started_at).getTime() + CONTACT_RATE_LIMIT_WINDOW_MS
  const allowed = row.request_count <= CONTACT_RATE_LIMIT_MAX
  const remaining = allowed ? Math.max(CONTACT_RATE_LIMIT_MAX - row.request_count, 0) : 0

  return {
    allowed,
    remaining,
    resetAt,
  }
}

const AUDIENCES = ['client', 'recruiter', 'other']

function validateContactPayload(payload) {
  const name = normalizeText(payload?.name).replace(CONTROL_CHARS, ' ')
  const email = normalizeText(payload?.email).toLowerCase()
  const isProject = payload?.kind === 'project'
  const project = isProject ? validateProject(payload?.project) : null
  const message = isProject && project
    ? buildProjectSummary(project, payload?.company, payload?.message)
    : normalizeText(payload?.message)
  const company = normalizeText(payload?.company).slice(0, 160)
  const phone = normalizeText(payload?.phone)
  const audience = AUDIENCES.includes(payload?.audience) ? payload.audience : isProject ? 'client' : 'other'
  const errors = []

  if (phone && !/^\+?[\d\s().-]{6,30}$/.test(phone)) {
    errors.push('Le telephone est invalide.')
  }

  if (name.length < 2 || name.length > 120) {
    errors.push('Le nom doit contenir entre 2 et 120 caracteres.')
  }

  if (email.length > 200 || !EMAIL_PATTERN.test(email)) {
    errors.push("L'email est invalide.")
  }

  if (message.length < 10) {
    errors.push('Le message doit contenir au moins 10 caracteres.')
  }

  if (message.length > (isProject ? 30000 : 2000)) {
    errors.push(`Le message ne doit pas depasser ${isProject ? 30000 : 2000} caracteres.`)
  }

  if (isProject && !project) errors.push('Les informations du projet sont invalides ou incompletes.')

  return {
    isValid: errors.length === 0,
    errors,
    data: { name, email, message, projectData: project, company, phone, audience },
  }
}

async function initDatabase() {
  if (!DATABASE_URL) {
    if (IS_PRODUCTION) {
      throw new Error('DATABASE_URL is required in production.')
    }

    return
  }

  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
  })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await pool.query('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS project_data JSONB')
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'")
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS company TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS audience TEXT NOT NULL DEFAULT 'client'")
  await pool.query('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS amount INTEGER')
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS decline_reason TEXT NOT NULL DEFAULT ''")
  await pool.query('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS follow_up_at TEXT')
  await pool.query('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE')
  await pool.query("ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS history JSONB NOT NULL DEFAULT '[]'")
  await pool.query('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()')
  await extras.initExtraTables(pool)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_rate_limits (
      client_ip TEXT PRIMARY KEY,
      window_started_at TIMESTAMPTZ NOT NULL,
      request_count INTEGER NOT NULL
    )
  `)

  await pool.query(`
    DELETE FROM contact_rate_limits
    WHERE window_started_at < NOW() - ($1::text || ' milliseconds')::interval
  `, [CONTACT_RATE_LIMIT_WINDOW_MS])

  databaseReady = true
}

async function ensureDatabase() {
  if (databaseReady) return
  if (!databaseInitPromise) {
    databaseInitPromise = initDatabase().catch(async (error) => {
      databaseReady = false
      if (pool) await pool.end().catch(() => {})
      pool = null
      databaseInitPromise = null
      throw error
    })
  }
  await databaseInitPromise
}

async function storeMessage(data) {
  if (databaseReady && pool) {
    const result = await pool.query(
      `
        INSERT INTO contact_messages (name, email, message, project_data, company, phone, audience)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, message, created_at
      `,
      [data.name, data.email, data.message, data.projectData ? JSON.stringify(data.projectData) : null, data.company ?? '', data.phone ?? '', data.audience ?? 'client'],
    )

    return {
      storage: 'database',
      record: result.rows[0],
    }
  }

  if (IS_PRODUCTION) {
    throw new Error('Database storage is required in production.')
  }

  const record = {
    id: nextMessageId,
    name: data.name,
    email: data.email,
    message: data.message,
    project_data: data.projectData,
    status: 'new',
    notes: '',
    company: data.company ?? '',
    phone: data.phone ?? '',
    audience: data.audience ?? 'client',
    amount: null,
    decline_reason: '',
    follow_up_at: null,
    archived: false,
    history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  nextMessageId += 1
  fallbackMessages.unshift(record)

  return {
    storage: 'memory',
    record,
  }
}

// Optional email to the site owner for each request, through Resend's HTTP API (no extra dependency).
// Enabled only when RESEND_API_KEY and CONTACT_NOTIFY_TO are set. A failure never blocks the visitor's request.
async function notifyOwner(data, fetchImpl = fetch) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CONTACT_NOTIFY_TO?.trim()
  if (!apiKey || !to) return false
  const from = process.env.CONTACT_NOTIFY_FROM?.trim() || 'Portfolio <onboarding@resend.dev>'
  let attachments
  if (data.projectData) {
    try {
      const pdf = await buildProjectPdf(data)
      attachments = [{ filename: 'recap-projet.pdf', content: pdf.toString('base64') }]
    } catch (error) {
      console.error('Recap PDF generation failed:', error.message)
    }
  }
  try {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        reply_to: data.email,
        subject: data.projectData ? `Nouvelle demande de ${data.name}` : `Nouveau message de ${data.name}`,
        text: `${data.name} <${data.email}>\n\n${data.message}`,
        ...(attachments ? { attachments } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.error('Notification email refused:', response.status)
      extras.recordError('email', `Resend a refusé l’envoi (${response.status})`)
    }
    return response.ok
  } catch (error) {
    console.error('Notification email failed:', error.message)
    extras.recordError('email', error.message)
    return false
  }
}

// Owner-only area. Sign-in is Google (ID token verified server-side); only ADMIN_EMAIL gets a session.
// The session is a stateless signed cookie so it works on serverless too.
const SESSION_COOKIE = 'wm_admin'
const SESSION_MAX_AGE_S = 8 * 60 * 60
let googleVerifier = null

function sessionSecret() {
  const secret = process.env.SESSION_SECRET?.trim()
  return secret && secret.length >= 32 ? secret : null
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url')
}

function createSession(email, secret, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email, exp: now + SESSION_MAX_AGE_S * 1000 })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

function readSession(req, now = Date.now()) {
  const secret = sessionSecret()
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const raw = /(?:^|;\s*)wm_admin=([^;]+)/.exec(req.headers.cookie ?? '')?.[1]
  if (!secret || !adminEmail || !raw) return null
  const [payload, signature] = raw.split('.')
  if (!payload || !signature) return null
  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(signature)
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.email === adminEmail && data.exp > now ? data.email : null
  } catch {
    return null
  }
}

function setSessionCookie(res, value, maxAgeS) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${value}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${maxAgeS}${IS_PRODUCTION ? '; Secure' : ''}`)
}

async function verifyGoogleCredential(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  if (googleVerifier) return googleVerifier(credential, clientId)
  const { OAuth2Client } = require('google-auth-library')
  const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: credential, audience: clientId })
  return ticket.getPayload()
}

// Login nonce: signed and short-lived, bound into the Google ID token so a stolen token cannot be replayed later.
const NONCE_TTL_MS = 5 * 60 * 1000

function createNonce(secret, now = Date.now()) {
  const body = `${now}.${crypto.randomBytes(12).toString('base64url')}`
  return `${body}.${sign(`nonce:${body}`, secret)}`
}

function checkNonce(nonce, secret, now = Date.now()) {
  if (typeof nonce !== 'string' || nonce.length > 200) return false
  const [issuedAt, random, signature] = nonce.split('.')
  if (!issuedAt || !random || !signature) return false
  const expected = Buffer.from(sign(`nonce:${issuedAt}.${random}`, secret))
  const given = Buffer.from(signature)
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false
  const age = now - Number(issuedAt)
  return age >= 0 && age <= NONCE_TTL_MS
}

// Defense in depth on top of SameSite=Strict: refuse state-changing calls the browser flags as cross-site.
function rejectCrossSite(req, res, next) {
  const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(req.method)
  if (unsafe && req.headers['sec-fetch-site'] === 'cross-site') {
    res.status(403).json({ message: 'Acces refuse.' })
    return
  }
  next()
}

app.use('/api/admin', rejectCrossSite)
app.use('/api/auth', rejectCrossSite)

function requireAdmin(req, res, next) {
  res.setHeader('Cache-Control', 'no-store')
  if (!readSession(req)) {
    res.status(401).json({ message: 'Acces refuse.' })
    return
  }
  next()
}

app.get('/api/auth/config', (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim()
  const ready = Boolean(clientId && sessionSecret() && process.env.ADMIN_EMAIL?.trim())
  res.setHeader('Cache-Control', 'no-store')
  res.json({ clientId: ready ? clientId : null, nonce: ready ? createNonce(sessionSecret()) : null })
})

app.get('/api/auth/me', (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  const email = readSession(req)
  res.status(email ? 200 : 401).json(email ? { email } : { message: 'Non connecte.' })
})

const authLimiter = extras.createSharedLimiter('auth', 10, 15 * 60 * 1000)

app.post('/api/auth/google', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  if (!(await authLimiter(dbPool(), getClientIp(req)))) {
    res.status(429).json({ message: 'Trop de tentatives. Reessaie plus tard.' })
    return
  }
  const secret = sessionSecret()
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!secret || !adminEmail || !process.env.GOOGLE_CLIENT_ID?.trim()) {
    res.status(503).json({ message: 'Espace admin non configure.' })
    return
  }
  const credential = typeof req.body?.credential === 'string' && req.body.credential.length <= 4096 ? req.body.credential : ''
  const nonce = typeof req.body?.nonce === 'string' ? req.body.nonce : ''
  let payload = null
  try {
    payload = credential && checkNonce(nonce, secret) ? await verifyGoogleCredential(credential) : null
  } catch {
    payload = null
  }
  if (!payload || payload.nonce !== nonce || payload.email_verified !== true || String(payload.email).toLowerCase() !== adminEmail) {
    console.warn(`Admin login refused from ${getClientIp(req)}`)
    extras.recordError('auth', 'Tentative de connexion admin refusee')
    res.status(403).json({ message: 'Acces refuse.' })
    return
  }
  setSessionCookie(res, createSession(adminEmail, secret), SESSION_MAX_AGE_S)
  res.json({ email: adminEmail })
})

app.post('/api/auth/logout', (_req, res) => {
  setSessionCookie(res, '', 0)
  res.status(204).end()
})

const REQUEST_COLUMNS = 'id, name, email, message, project_data, status, notes, company, phone, audience, amount, decline_reason, follow_up_at, archived, history, created_at, updated_at'
const REQUEST_STATUSES = ['new', 'discussing', 'quoted', 'accepted', 'declined', 'inprogress', 'delivered', 'maintenance']

function dbPool() {
  return databaseReady && pool ? pool : null
}

async function listMessages() {
  if (dbPool()) {
    const result = await pool.query(`SELECT ${REQUEST_COLUMNS} FROM contact_messages ORDER BY created_at DESC LIMIT 500`)
    return result.rows
  }
  return fallbackMessages
}

const withInsights = (row) => ({ ...row, insights: analyze(row) })
const listRequestsWithInsights = async () => (await listMessages()).map(withInsights)

async function findRequest(id) {
  if (dbPool()) {
    const result = await pool.query(`SELECT ${REQUEST_COLUMNS} FROM contact_messages WHERE id::text = $1`, [id])
    return result.rows[0] ?? null
  }
  return fallbackMessages.find((row) => String(row.id) === id) ?? null
}

async function saveRequest(row) {
  if (dbPool()) {
    const result = await pool.query(
      `UPDATE contact_messages SET status = $2, notes = $3, company = $4, phone = $5, audience = $6, amount = $7,
         decline_reason = $8, follow_up_at = $9, archived = $10, history = $11, updated_at = NOW()
       WHERE id = $1 RETURNING ${REQUEST_COLUMNS}`,
      [row.id, row.status, row.notes, row.company, row.phone, row.audience, row.amount, row.decline_reason, row.follow_up_at, row.archived, JSON.stringify(row.history)],
    )
    return result.rows[0]
  }
  const index = fallbackMessages.findIndex((item) => item.id === row.id)
  fallbackMessages[index] = { ...row, updated_at: new Date().toISOString() }
  return fallbackMessages[index]
}

const isValidDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
const PATCH_RULES = {
  status: (value) => REQUEST_STATUSES.includes(value),
  notes: (value) => typeof value === 'string' && value.length <= 5000,
  amount: (value) => value === null || (Number.isInteger(value) && value >= 0 && value <= 10000000),
  declineReason: (value) => typeof value === 'string' && value.length <= 500,
  followUpAt: (value) => value === null || isValidDay(value),
  company: (value) => typeof value === 'string' && value.length <= 160,
  phone: (value) => typeof value === 'string' && (value === '' || /^\+?[\d\s().-]{6,30}$/.test(value)),
  audience: (value) => AUDIENCES.includes(value),
  archived: (value) => typeof value === 'boolean',
}
const PATCH_COLUMNS = { status: 'status', notes: 'notes', amount: 'amount', declineReason: 'decline_reason', followUpAt: 'follow_up_at', company: 'company', phone: 'phone', audience: 'audience', archived: 'archived' }

function applyRequestPatch(row, body) {
  const keys = Object.keys(body ?? {})
  if (!keys.length || keys.some((key) => !Object.hasOwn(PATCH_RULES, key) || !PATCH_RULES[key](body[key]))) return null
  const next = { ...row, history: [...(row.history ?? [])] }
  const at = new Date().toISOString()
  for (const key of keys) {
    const column = PATCH_COLUMNS[key]
    if (key === 'status' && body.status !== row.status) next.history.push({ at, type: 'status', from: row.status, to: body.status })
    if (key === 'archived' && body.archived !== row.archived) next.history.push({ at, type: body.archived ? 'archived' : 'restored' })
    next[column] = body[key]
  }
  next.history = next.history.slice(-100)
  return next
}

app.get('/api/admin/requests', requireAdmin, async (_req, res) => {
  res.json({ items: await listRequestsWithInsights() })
})

const csvCell = (value) => {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

app.get('/api/admin/requests.csv', requireAdmin, async (_req, res) => {
  const header = ['id', 'date', 'nom', 'email', 'entreprise', 'telephone', 'type', 'profil', 'parcours', 'statut', 'montant', 'motif_refus', 'relance', 'archivee', 'notes']
  const rows = (await listRequestsWithInsights()).map((item) => [
    item.id, new Date(item.created_at).toISOString(), item.name, item.email, item.company, item.phone, item.insights.kind === 'project' ? 'projet' : 'message', item.audience,
    item.insights.pathLabel ?? '', item.status, item.amount, item.decline_reason, item.follow_up_at, item.archived ? 'oui' : 'non', item.notes,
  ])
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="demandes.csv"')
  res.send(`﻿${[header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n')}\r\n`)
})

app.patch('/api/admin/requests/:id', requireAdmin, async (req, res) => {
  const row = await findRequest(req.params.id)
  if (!row) {
    // Invalid bodies on unknown ids still answer 404 first: the id is the more basic error.
    res.status(404).json({ message: 'Demande introuvable.' })
    return
  }
  const next = applyRequestPatch(row, req.body)
  if (!next) {
    res.status(400).json({ message: 'Donnees invalides.' })
    return
  }
  res.json({ item: withInsights(await saveRequest(next)) })
})

app.delete('/api/admin/requests/:id', requireAdmin, async (req, res) => {
  if (dbPool()) {
    const result = await pool.query('DELETE FROM contact_messages WHERE id::text = $1', [req.params.id])
    if (!result.rowCount) {
      res.status(404).json({ message: 'Demande introuvable.' })
      return
    }
  } else {
    const index = fallbackMessages.findIndex((row) => String(row.id) === req.params.id)
    if (index < 0) {
      res.status(404).json({ message: 'Demande introuvable.' })
      return
    }
    fallbackMessages.splice(index, 1)
  }
  res.status(204).end()
})

// Retention: removes archived requests older than the given number of months.
app.post('/api/admin/purge', requireAdmin, async (req, res) => {
  const months = req.body?.months
  if (!Number.isInteger(months) || months < 1 || months > 120) {
    res.status(400).json({ message: 'Donnees invalides.' })
    return
  }
  let deleted = 0
  if (dbPool()) {
    const result = await pool.query("DELETE FROM contact_messages WHERE archived AND created_at < NOW() - ($1::int * INTERVAL '1 month')", [months])
    deleted = result.rowCount
  } else {
    const limit = new Date()
    limit.setMonth(limit.getMonth() - months)
    for (let i = fallbackMessages.length - 1; i >= 0; i -= 1) {
      if (fallbackMessages[i].archived && new Date(fallbackMessages[i].created_at) < limit) {
        fallbackMessages.splice(i, 1)
        deleted += 1
      }
    }
  }
  res.json({ deleted })
})

app.get('/api/admin/requests/:id/draft', requireAdmin, async (req, res) => {
  const row = await findRequest(req.params.id)
  if (!row) {
    res.status(404).json({ message: 'Demande introuvable.' })
    return
  }
  const insights = analyze(row)
  const { signature } = await extras.loadSettings(dbPool())
  res.json({ templates: buildReplyTemplates(row, insights, signature), proposal: buildProposal(row, insights) })
})

app.get('/api/admin/requests/:id/pdf', requireAdmin, async (req, res) => {
  const item = await findRequest(req.params.id)
  if (!item) {
    res.status(404).json({ message: 'Demande introuvable.' })
    return
  }
  const pdf = await buildProjectPdf(item)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="recap-projet-${item.id}.pdf"`)
  res.send(pdf)
})

app.get('/api/health', async (_req, res) => {
  if (databaseReady && pool) {
    try {
      await pool.query('SELECT 1')
      res.json({
        status: 'ok',
        service: 'portfolio-backend',
        database: 'connected',
      })
      return
    } catch (error) {
      console.error('Health check database error:', error)
      res.status(503).json({
        status: 'degraded',
        service: 'portfolio-backend',
        database: 'error',
      })
      return
    }
  }

  res.json({
    status: 'ok',
    service: 'portfolio-backend',
    database: 'not_configured',
  })
})

app.get('/', (_req, res) => {
  res.json({
    message: 'Portfolio backend is running.',
    endpoints: ['/api/health', '/api/contact'],
  })
})

app.post('/api/contact', async (req, res) => {
  const rateLimit = await checkContactRateLimit(req)
  res.setHeader('X-RateLimit-Limit', String(CONTACT_RATE_LIMIT_MAX))
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining))
  res.setHeader('X-RateLimit-Reset', String(rateLimit.resetAt))

  if (!rateLimit.allowed) {
    res.status(429).json({
      message: 'Trop de tentatives. Reessaie plus tard.',
    })
    return
  }

  if (extras.isBotSubmission(req.body)) {
    res.status(201).json({ message: 'Message recu.', storage: 'database', item: { id: 0 } })
    return
  }

  const validation = validateContactPayload(req.body)

  if (!validation.isValid) {
    res.status(400).json({
      message: 'Payload invalide.',
      errors: validation.errors,
    })
    return
  }

  const result = await storeMessage(validation.data)
  // Awaited on purpose: serverless functions may be frozen once the response is sent.
  await notifyOwner(validation.data)

  res.status(201).json({
    message: 'Message recu.',
    storage: result.storage,
    item: result.record,
  })
})

extras.registerExtras(app, {
  requireAdmin,
  getPool: dbPool,
  getClientIp,
  listRequests: listRequestsWithInsights,
  isProduction: IS_PRODUCTION,
})

app.use((req, res) => {
  res.status(404).json({
    message: `Route introuvable: ${req.method} ${req.originalUrl}`,
  })
})

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed' || error?.type === 'entity.too.large') {
    res.status(error.type === 'entity.too.large' ? 413 : 400).json({ message: 'Requete invalide.' })
    return
  }
  console.error('Unhandled backend error:', error)
  extras.recordError('server', error.message)
  res.status(500).json({
    message: 'Erreur interne du serveur.',
  })
})

async function startServer() {
  try {
    await ensureDatabase()
  } catch (error) {
    databaseReady = false
    pool = null
    console.error('Database init failed, fallback to memory storage:', error.message)
  }

  return app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
    console.log(`Accepted origins: ${ALLOWED_ORIGINS.join(', ') || 'none'}`)
    console.log(`Storage mode: ${databaseReady ? 'database' : 'memory'}`)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = {
  app,
  checkContactRateLimit,
  checkContactRateLimitMemory,
  getClientIp,
  ensureDatabase,
  startServer,
  validateContactPayload,
  EMAIL_PATTERN,
  normalizeText,
  notifyOwner,
  setGoogleVerifier: (fn) => { googleVerifier = fn },
}
