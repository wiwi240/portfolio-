const express = require('express')
const dotenv = require('dotenv')
const { Pool } = require('pg')

dotenv.config()

const PORT = Number.parseInt(process.env.PORT ?? '4000', 10)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
const DATABASE_URL = process.env.DATABASE_URL?.trim() || null

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ORIGIN)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
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
    endpoints: ['/api/health', '/api/messages', '/api/contact'],
  })
})

app.get('/api/messages', async (_req, res) => {
  if (databaseReady && pool) {
    const result = await pool.query(`
      SELECT id, name, email, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 50
    `)

    res.json({
      items: result.rows,
      storage: 'database',
    })
    return
  }

  res.json({
    items: fallbackMessages,
    storage: 'memory',
  })
})

app.post('/api/contact', async (req, res) => {
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
    console.log(`Accepted origin: ${CLIENT_ORIGIN}`)
    console.log(`Storage mode: ${databaseReady ? 'database' : 'memory'}`)
  })
}

if (require.main === module) {
  startServer()
}

module.exports = {
  app,
  startServer,
  validateContactPayload,
  normalizeText,
}
