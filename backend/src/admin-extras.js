// Appointments, availability, settings, anonymous site events, statistics and health for the owner area.
// Every store works on Postgres when available and falls back to memory in development, like the contact messages.

const EVENT_TYPES = ['visit', 'guide_start', 'guide_step', 'request_sent']
const EVENT_AUDIENCES = ['client', 'recruiter', 'unknown']
const WON_STATUSES = ['accepted', 'inprogress', 'delivered', 'maintenance']
const TIME_ZONE = 'Europe/Paris'

const DEFAULT_SETTINGS = {
  signature: 'William Mahi',
  followUpDays: 3,
  availability: {
    duration: 30,
    noticeHours: 24,
    horizonDays: 30,
    days: Object.fromEntries([1, 2, 3, 4, 5].map((day) => [day, { start: '09:00', end: '17:00' }])),
    blocked: [],
  },
}

const memory = { settings: null, appointments: [], events: [], nextAppointmentId: 1, errors: [] }

function recordError(source, message) {
  memory.errors.unshift({ at: new Date().toISOString(), source, message: String(message).slice(0, 300) })
  memory.errors.length = Math.min(memory.errors.length, 10)
}

async function initExtraTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL)
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT NOT NULL DEFAULT '',
      starts_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot ON appointments (starts_at) WHERE status <> 'cancelled'")
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_events (
      id BIGSERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      audience TEXT NOT NULL DEFAULT 'unknown',
      step TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query("DELETE FROM site_events WHERE created_at < NOW() - INTERVAL '400 days'")
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      bucket TEXT NOT NULL,
      client_key TEXT NOT NULL,
      window_started_at TIMESTAMPTZ NOT NULL,
      request_count INTEGER NOT NULL,
      PRIMARY KEY (bucket, client_key)
    )
  `)
  await pool.query("DELETE FROM rate_limits WHERE window_started_at < NOW() - INTERVAL '1 day'")
}

// ---------- time zone helpers (no dependency) ----------

function zoneOffsetMs(timestamp, timeZone = TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(new Date(timestamp))
  const o = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]))
  return Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute, o.second) - Math.floor(timestamp / 1000) * 1000
}

function zonedToUtc(year, month, day, hour, minute, timeZone = TIME_ZONE) {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const first = guess - zoneOffsetMs(guess, timeZone)
  const second = guess - zoneOffsetMs(first, timeZone)
  return second
}

function zonedDate(timestamp, timeZone = TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(timestamp)).split('-').map(Number)
  return { year: parts[0], month: parts[1], day: parts[2] }
}

// ---------- settings ----------

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))

function sanitizeAvailability(value) {
  if (!value || typeof value !== 'object') return null
  const { duration, noticeHours, horizonDays, days, blocked } = value
  if (!Number.isInteger(duration) || duration < 15 || duration > 120 || duration % 5) return null
  if (!Number.isInteger(noticeHours) || noticeHours < 0 || noticeHours > 168) return null
  if (!Number.isInteger(horizonDays) || horizonDays < 1 || horizonDays > 90) return null
  if (!days || typeof days !== 'object' || Array.isArray(days)) return null
  const cleanDays = {}
  for (const [key, range] of Object.entries(days)) {
    if (!/^[0-6]$/.test(key) || !range || !TIME.test(range.start) || !TIME.test(range.end) || minutes(range.start) >= minutes(range.end)) return null
    cleanDays[key] = { start: range.start, end: range.end }
  }
  if (!Array.isArray(blocked) || blocked.length > 100 || blocked.some((day) => !/^\d{4}-\d{2}-\d{2}$/.test(day))) return null
  return { duration, noticeHours, horizonDays, days: cleanDays, blocked: [...new Set(blocked)].sort() }
}

function sanitizeSettings(value) {
  if (!value || typeof value !== 'object') return null
  const signature = typeof value.signature === 'string' ? value.signature.trim().slice(0, 120) : null
  const followUpDays = value.followUpDays
  const availability = sanitizeAvailability(value.availability)
  if (signature === null || !signature || !Number.isInteger(followUpDays) || followUpDays < 1 || followUpDays > 60 || !availability) return null
  return { signature, followUpDays, availability }
}

async function loadSettings(pool) {
  let stored = memory.settings
  if (pool) {
    const result = await pool.query("SELECT value FROM site_settings WHERE key = 'main'")
    stored = result.rows[0]?.value ?? null
  }
  return sanitizeSettings(stored) ?? DEFAULT_SETTINGS
}

async function saveSettings(pool, settings) {
  if (pool) {
    await pool.query("INSERT INTO site_settings (key, value) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [JSON.stringify(settings)])
  } else {
    memory.settings = settings
  }
}

// ---------- appointments ----------

function generateSlots(availability, booked, now = Date.now()) {
  const { duration, noticeHours, horizonDays, days, blocked } = availability
  const earliest = now + noticeHours * 3600 * 1000
  const today = zonedDate(now)
  const slots = []
  for (let offset = 0; offset <= horizonDays; offset += 1) {
    const base = new Date(Date.UTC(today.year, today.month - 1, today.day + offset))
    const ymd = base.toISOString().slice(0, 10)
    const range = days[base.getUTCDay()]
    if (!range || blocked.includes(ymd)) continue
    for (let start = minutes(range.start); start + duration <= minutes(range.end); start += duration) {
      const instant = zonedToUtc(base.getUTCFullYear(), base.getUTCMonth() + 1, base.getUTCDate(), Math.floor(start / 60), start % 60)
      const iso = new Date(instant).toISOString()
      if (instant >= earliest && !booked.has(iso)) slots.push(iso)
    }
  }
  return slots
}

async function listAppointments(pool) {
  if (pool) return (await pool.query('SELECT id, name, email, topic, starts_at, status, created_at FROM appointments ORDER BY starts_at DESC LIMIT 200')).rows
  return [...memory.appointments].sort((a, b) => b.starts_at.localeCompare(a.starts_at))
}

async function bookedSlots(pool) {
  const rows = await listAppointments(pool)
  return new Set(rows.filter((row) => row.status !== 'cancelled').map((row) => new Date(row.starts_at).toISOString()))
}

async function insertAppointment(pool, data) {
  if (pool) {
    try {
      const result = await pool.query('INSERT INTO appointments (name, email, topic, starts_at) VALUES ($1, $2, $3, $4) RETURNING id, name, email, topic, starts_at, status, created_at', [data.name, data.email, data.topic, data.startsAt])
      return result.rows[0]
    } catch (error) {
      if (error.code === '23505') return null
      throw error
    }
  }
  if (memory.appointments.some((row) => row.starts_at === data.startsAt && row.status !== 'cancelled')) return null
  const row = { id: memory.nextAppointmentId++, name: data.name, email: data.email, topic: data.topic, starts_at: data.startsAt, status: 'pending', created_at: new Date().toISOString() }
  memory.appointments.push(row)
  return row
}

// ---------- events ----------

async function insertEvent(pool, event) {
  if (pool) {
    await pool.query('INSERT INTO site_events (type, audience, step) VALUES ($1, $2, $3)', [event.type, event.audience, event.step])
  } else {
    memory.events.push({ ...event, created_at: new Date().toISOString() })
    if (memory.events.length > 20000) memory.events.shift()
  }
}

async function listEvents(pool, days = 90) {
  if (pool) {
    return (await pool.query("SELECT type, audience, step, created_at FROM site_events WHERE created_at > NOW() - ($1::int * INTERVAL '1 day') ORDER BY created_at DESC LIMIT 50000", [days])).rows
  }
  const since = Date.now() - days * 24 * 3600 * 1000
  return memory.events.filter((event) => new Date(event.created_at).getTime() >= since)
}

// ---------- statistics ----------

const top = (counts, limit = 8) => [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([label, count]) => ({ label, count }))
const bump = (map, key) => map.set(key, (map.get(key) ?? 0) + 1)

function mondayOf(timestamp) {
  const date = new Date(timestamp)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7))
  return date.toISOString().slice(0, 10)
}

function buildStats(items, events, now = Date.now()) {
  const projects = items.filter((item) => item.insights?.kind === 'project' && !item.archived)
  const since30 = now - 30 * 24 * 3600 * 1000
  const recent = events.filter((event) => new Date(event.created_at).getTime() >= since30)
  const count = (type, audience) => recent.filter((event) => event.type === type && (!audience || event.audience === audience)).length

  const steps = new Map()
  for (const event of recent) if (event.type === 'guide_step') bump(steps, Number(event.step) || 0)

  const weeks = new Map()
  for (let i = 7; i >= 0; i -= 1) weeks.set(mondayOf(now - i * 7 * 24 * 3600 * 1000), 0)
  for (const item of projects) {
    const week = mondayOf(new Date(item.created_at).getTime())
    if (weeks.has(week)) weeks.set(week, weeks.get(week) + 1)
  }

  const paths = new Map()
  const features = new Map()
  const budgets = new Map()
  const reasons = new Map()
  for (const item of projects) {
    bump(paths, item.insights.pathLabel)
    for (const label of item.insights.wanted ?? []) bump(features, label)
    bump(budgets, item.insights.budget || 'Non précisé')
    if (item.status === 'declined' && item.decline_reason) bump(reasons, item.decline_reason)
  }

  const won = projects.filter((item) => WON_STATUSES.includes(item.status))
  const declined = projects.filter((item) => item.status === 'declined')
  const quoted = projects.filter((item) => item.status === 'quoted')
  const sum = (rows) => rows.reduce((total, item) => total + (Number(item.amount) || 0), 0)

  const delays = []
  for (const item of items) {
    const first = (item.history ?? []).find((entry) => entry.type === 'status' && entry.from === 'new')
    if (first) delays.push((new Date(first.at).getTime() - new Date(item.created_at).getTime()) / 3600000)
  }

  const visits = count('visit')
  const started = count('guide_start')
  const sent = count('request_sent')
  return {
    funnel: { visits, guideStarts: started, requestsSent: sent, startRate: visits ? started / visits : 0, sendRate: started ? sent / started : 0 },
    audiences: { client: count('visit', 'client'), recruiter: count('visit', 'recruiter'), unknown: count('visit', 'unknown') },
    steps: [...steps.entries()].sort((a, b) => a[0] - b[0]).map(([step, total]) => ({ step, count: total })),
    perWeek: [...weeks.entries()].map(([week, total]) => ({ week, count: total })),
    paths: top(paths),
    features: top(features, 10),
    budgets: top(budgets, 6),
    declineReasons: top(reasons, 6),
    revenue: { signed: sum(won), pipeline: sum(quoted), wonCount: won.length, declinedCount: declined.length, winRate: won.length + declined.length ? won.length / (won.length + declined.length) : null },
    averageResponseHours: delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : null,
  }
}

// ---------- owner mail ----------

async function sendOwnerMail({ subject, text, replyTo }, fetchImpl = fetch) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CONTACT_NOTIFY_TO?.trim()
  if (!apiKey || !to) return false
  try {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_NOTIFY_FROM?.trim() || 'Portfolio <onboarding@resend.dev>', to: to.split(',').map((a) => a.trim()).filter(Boolean), ...(replyTo ? { reply_to: replyTo } : {}), subject, text }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) recordError('email', `Resend a refusé l’envoi (${response.status})`)
    return response.ok
  } catch (error) {
    recordError('email', error.message)
    return false
  }
}

// ---------- tiny in-memory limiter (serverless instances do not share it: best effort only) ----------

function createLimiter(max, windowMs) {
  const hits = new Map()
  return (key, now = Date.now()) => {
    for (const [k, entry] of hits) if (now > entry.resetAt) hits.delete(k)
    const entry = hits.get(key)
    if (!entry) { hits.set(key, { count: 1, resetAt: now + windowMs }); return true }
    entry.count += 1
    return entry.count <= max
  }
}

// Same limiter, but the counter lives in Postgres so every serverless instance shares it.
// Without a database (local development) or if the query fails, it falls back to the per-instance counter.
function createSharedLimiter(bucket, max, windowMs) {
  const local = createLimiter(max, windowMs)
  return async (pool, key) => {
    if (!pool) return local(key)
    try {
      const result = await pool.query(
        `INSERT INTO rate_limits (bucket, client_key, window_started_at, request_count)
         VALUES ($1, $2, NOW(), 1)
         ON CONFLICT (bucket, client_key) DO UPDATE SET
           window_started_at = CASE WHEN rate_limits.window_started_at < NOW() - ($3::int * INTERVAL '1 millisecond') THEN NOW() ELSE rate_limits.window_started_at END,
           request_count = CASE WHEN rate_limits.window_started_at < NOW() - ($3::int * INTERVAL '1 millisecond') THEN 1 ELSE rate_limits.request_count + 1 END
         RETURNING request_count`,
        [bucket, key, windowMs],
      )
      return result.rows[0].request_count <= max
    } catch (error) {
      recordError('database', error.message)
      return local(key)
    }
  }
}

// A visitor never sees the hidden "website" field; a bot that fills it gets a fake success and nothing is stored.
const isBotSubmission = (body) => typeof body?.website === 'string' && body.website.trim() !== ''

// ---------- routes ----------

function registerExtras(app, { requireAdmin, getPool, getClientIp, listRequests, isProduction }) {
  const eventLimiter = createSharedLimiter('events', 120, 10 * 60 * 1000)
  const bookingLimiter = createSharedLimiter('booking', 5, 60 * 60 * 1000)

  app.post('/api/events', async (req, res) => {
    const { type, audience, step } = req.body ?? {}
    if (!EVENT_TYPES.includes(type) || (audience !== undefined && !EVENT_AUDIENCES.includes(audience)) || (step !== undefined && !/^[a-z0-9_-]{1,40}$/i.test(String(step)))) {
      res.status(400).json({ message: 'Evenement invalide.' })
      return
    }
    if (!(await eventLimiter(getPool(), getClientIp(req)))) {
      res.status(429).json({ message: 'Trop de requetes.' })
      return
    }
    await insertEvent(getPool(), { type, audience: audience ?? 'unknown', step: step === undefined ? '' : String(step) })
    res.status(204).end()
  })

  app.get('/api/slots', async (_req, res) => {
    const pool = getPool()
    const { availability } = await loadSettings(pool)
    res.json({ duration: availability.duration, timeZone: TIME_ZONE, slots: generateSlots(availability, await bookedSlots(pool)) })
  })

  app.post('/api/appointments', async (req, res) => {
    if (isBotSubmission(req.body)) {
      res.status(201).json({ message: 'Demande de rendez-vous recue.', item: { id: 0, startsAt: '' } })
      return
    }
     
    const name = typeof req.body?.name === 'string' ? req.body.name.trim().replace(/[\u0000-\u001f\u007f]/g, ' ') : ''
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : ''
    const startsAt = typeof req.body?.startsAt === 'string' ? req.body.startsAt : ''
    const errors = []
    if (name.length < 2 || name.length > 120) errors.push('Le nom doit contenir entre 2 et 120 caracteres.')
    if (email.length > 200 || !/^[A-Za-z0-9._+-]{1,64}@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email)) errors.push("L'email est invalide.")
    if (topic.length > 1000) errors.push('Le sujet est trop long.')
    if (errors.length) {
      res.status(400).json({ message: 'Payload invalide.', errors })
      return
    }
    if (!(await bookingLimiter(getPool(), getClientIp(req)))) {
      res.status(429).json({ message: 'Trop de tentatives. Reessaie plus tard.' })
      return
    }
    const pool = getPool()
    // One person cannot hold the whole calendar: at most 2 upcoming, non-cancelled bookings per address.
    const active = (await listAppointments(pool)).filter((row) => row.email === email && row.status !== 'cancelled' && new Date(row.starts_at).getTime() > Date.now())
    if (active.length >= 2) {
      res.status(429).json({ message: 'Tu as deja des rendez-vous a venir. Contacte-moi pour en changer.' })
      return
    }
    const { availability } = await loadSettings(pool)
    const parsed = new Date(startsAt)
    const iso = Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
    if (!iso || !generateSlots(availability, await bookedSlots(pool)).includes(iso)) {
      res.status(409).json({ message: 'Ce creneau n’est plus disponible.' })
      return
    }
    const row = await insertAppointment(pool, { name, email, topic, startsAt: iso })
    if (!row) {
      res.status(409).json({ message: 'Ce creneau n’est plus disponible.' })
      return
    }
    const when = new Date(iso).toLocaleString('fr-FR', { timeZone: TIME_ZONE, dateStyle: 'full', timeStyle: 'short' })
    await sendOwnerMail({ subject: `Rendez-vous demandé par ${name}`, text: `${name} <${email}>\n${when}\n\n${topic}`, replyTo: email })
    res.status(201).json({ message: 'Demande de rendez-vous recue.', item: { id: row.id, startsAt: iso } })
  })

  app.get('/api/admin/appointments', requireAdmin, async (_req, res) => {
    res.json({ items: await listAppointments(getPool()) })
  })

  app.patch('/api/admin/appointments/:id', requireAdmin, async (req, res) => {
    const status = req.body?.status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Donnees invalides.' })
      return
    }
    const pool = getPool()
    if (pool) {
      try {
        const result = await pool.query('UPDATE appointments SET status = $2 WHERE id::text = $1 RETURNING id, name, email, topic, starts_at, status, created_at', [req.params.id, status])
        if (!result.rows[0]) { res.status(404).json({ message: 'Rendez-vous introuvable.' }); return }
        res.json({ item: result.rows[0] })
      } catch (error) {
        if (error.code === '23505') { res.status(409).json({ message: 'Ce creneau est deja pris.' }); return }
        throw error
      }
      return
    }
    const row = memory.appointments.find((item) => String(item.id) === req.params.id)
    if (!row) { res.status(404).json({ message: 'Rendez-vous introuvable.' }); return }
    if (status !== 'cancelled' && memory.appointments.some((item) => item !== row && item.starts_at === row.starts_at && item.status !== 'cancelled')) {
      res.status(409).json({ message: 'Ce creneau est deja pris.' })
      return
    }
    row.status = status
    res.json({ item: row })
  })

  app.get('/api/admin/settings', requireAdmin, async (_req, res) => {
    res.json({ settings: await loadSettings(getPool()) })
  })

  app.put('/api/admin/settings', requireAdmin, async (req, res) => {
    const settings = sanitizeSettings(req.body)
    if (!settings) {
      res.status(400).json({ message: 'Parametres invalides.' })
      return
    }
    await saveSettings(getPool(), settings)
    res.json({ settings })
  })

  app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
    res.json({ stats: buildStats(await listRequests(), await listEvents(getPool())) })
  })

  app.get('/api/admin/health', requireAdmin, async (_req, res) => {
    const pool = getPool()
    let database = 'memory'
    if (pool) {
      try {
        await pool.query('SELECT 1')
        database = 'connected'
      } catch (error) {
        database = 'error'
        recordError('database', error.message)
      }
    }
    const items = await listRequests()
    res.json({
      database,
      production: isProduction,
      email: Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_NOTIFY_TO?.trim()),
      customSender: Boolean(process.env.CONTACT_NOTIFY_FROM?.trim()),
      google: Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.ADMIN_EMAIL?.trim() && process.env.SESSION_SECRET?.trim()),
      requests: items.length,
      lastRequestAt: items[0]?.created_at ?? null,
      errors: memory.errors,
    })
  })
}

module.exports = { registerExtras, initExtraTables, loadSettings, recordError, sendOwnerMail, generateSlots, zonedToUtc, sanitizeAvailability, sanitizeSettings, buildStats, createLimiter, createSharedLimiter, isBotSubmission, DEFAULT_SETTINGS, WON_STATUSES }
