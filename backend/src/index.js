const express = require('express')
const dotenv = require('dotenv')
const { Pool } = require('pg')

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
const fallbackMessages = []
let nextMessageId = 1
const contactRateLimitStore = new Map()

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

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

function validateContactPayload(payload) {
  const name = normalizeText(payload?.name)
  const email = normalizeText(payload?.email).toLowerCase()
  const message = normalizeText(payload?.message)
  const errors = []

  if (name.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caracteres.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("L'email est invalide.")
  }

  if (message.length < 10) {
    errors.push('Le message doit contenir au moins 10 caracteres.')
  }

  if (message.length > 2000) {
    errors.push('Le message ne doit pas depasser 2000 caracteres.')
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { name, email, message },
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

async function storeMessage(data) {
  if (databaseReady && pool) {
    const result = await pool.query(
      `
        INSERT INTO contact_messages (name, email, message)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, message, created_at
      `,
      [data.name, data.email, data.message],
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
    created_at: new Date().toISOString(),
  }

  nextMessageId += 1
  fallbackMessages.unshift(record)

  return {
    storage: 'memory',
    record,
  }
}

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

  const validation = validateContactPayload(req.body)

  if (!validation.isValid) {
    res.status(400).json({
      message: 'Payload invalide.',
      errors: validation.errors,
    })
    return
  }

  const result = await storeMessage(validation.data)

  res.status(201).json({
    message: 'Message recu.',
    storage: result.storage,
    item: result.record,
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: `Route introuvable: ${req.method} ${req.originalUrl}`,
  })
})

app.use((error, _req, res, _next) => {
  console.error('Unhandled backend error:', error)
  res.status(500).json({
    message: 'Erreur interne du serveur.',
  })
})

async function startServer() {
  try {
    await initDatabase()
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
  startServer,
  validateContactPayload,
  normalizeText,
}
