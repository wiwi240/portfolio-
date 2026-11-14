const test = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter, once } = require('node:events')
const httpMocks = require('node-mocks-http')

const MODULE_PATH = require.resolve('./index')
const DEFAULT_ENV = {
  NODE_ENV: 'test',
  CLIENT_ORIGIN: 'https://allowed.example',
  DATABASE_URL: '',
}

function loadBackend(envOverrides = {}) {
  const previousEnv = {}

  for (const [key, value] of Object.entries(envOverrides)) {
    previousEnv[key] = process.env[key]
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  delete require.cache[MODULE_PATH]
  const backend = require('./index')

  for (const [key, value] of Object.entries(envOverrides)) {
    if (previousEnv[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = previousEnv[key]
    }
  }

  return backend
}

function createRequest(overrides = {}) {
  return {
    headers: {},
    ip: '198.51.100.7',
    socket: { remoteAddress: '198.51.100.7' },
    ...overrides,
  }
}

async function startTestServer(envOverrides = {}) {
  const backend = loadBackend({ ...DEFAULT_ENV, ...envOverrides })
  return {
    ...backend,
    server: null,
    baseUrl: backend.app,
  }
}

async function stopTestServer(server) {
  return server
}

async function requestJson(agent, path, options = {}) {
  const headers = Object.fromEntries(
    Object.entries(options.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
  )
  const remoteIp = headers['x-forwarded-for']?.split(',')[0]?.trim() || options.ip || '127.0.0.1'
  const req = httpMocks.createRequest({
    method: options.method ?? 'GET',
    url: path,
    headers,
    body:
      typeof options.body === 'string' && headers['content-type'] === 'application/json'
        ? JSON.parse(options.body)
        : options.body,
    ip: remoteIp,
    socket: { remoteAddress: remoteIp },
  })
  const res = httpMocks.createResponse({ eventEmitter: EventEmitter })
  agent.handle(req, res)

  if (!res._isEndCalled()) {
    await once(res, 'end')
  }

  const response = {
    status: res.statusCode,
    headers: {
      get(name) {
        const value = res.getHeader(name)
        if (Array.isArray(value)) {
          return value.join(', ')
        }
        return value ?? null
      },
    },
    text: res._getData(),
  }
  const body = (() => {
    const data = res._getData()
    if (!data) {
      return null
    }
    if (typeof data === 'object') {
      return data
    }
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  })()

  return { response, body }
}

function buildContactPayload(overrides = {}) {
  return {
    name: 'William Mahi',
    email: 'william@example.com',
    message: 'Bonjour, je souhaite discuter du site et de la securite.',
    ...overrides,
  }
}

test('normalizeText trims surrounding whitespace', () => {
  const { normalizeText } = loadBackend(DEFAULT_ENV)
  assert.equal(normalizeText('  William  '), 'William')
})

test('normalizeText preserves inner whitespace', () => {
  const { normalizeText } = loadBackend(DEFAULT_ENV)
  assert.equal(normalizeText('  William   Mahi  '), 'William   Mahi')
})

test('normalizeText returns empty string for numbers', () => {
  const { normalizeText } = loadBackend(DEFAULT_ENV)
  assert.equal(normalizeText(42), '')
})

test('normalizeText returns empty string for undefined', () => {
  const { normalizeText } = loadBackend(DEFAULT_ENV)
  assert.equal(normalizeText(undefined), '')
})

test('validateContactPayload accepts a valid payload', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload())
  assert.equal(result.isValid, true)
})

test('validateContactPayload lowercases emails', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ email: 'WILLIAM@EXAMPLE.COM' }))
  assert.equal(result.data.email, 'william@example.com')
})

test('validateContactPayload trims all string fields', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({
    name: '  William Mahi  ',
    email: '  william@example.com  ',
    message: '  Bonjour, ceci est un message suffisamment long.  ',
  }))
  assert.equal(result.data.name, 'William Mahi')
  assert.equal(result.data.email, 'william@example.com')
  assert.equal(result.data.message, 'Bonjour, ceci est un message suffisamment long.')
})

test('validateContactPayload rejects short names', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ name: 'W' }))
  assert.equal(result.isValid, false)
  assert.ok(result.errors.includes('Le nom doit contenir entre 2 et 120 caracteres.'))
})

test('validateContactPayload rejects malformed emails without at sign', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ email: 'williamexample.com' }))
  assert.equal(result.isValid, false)
  assert.ok(result.errors.includes("L'email est invalide."))
})

test('validateContactPayload rejects malformed emails with spaces', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ email: 'william @example.com' }))
  assert.equal(result.isValid, false)
  assert.ok(result.errors.includes("L'email est invalide."))
})

test('validateContactPayload rejects short messages', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ message: 'court' }))
  assert.equal(result.isValid, false)
  assert.ok(result.errors.includes('Le message doit contenir au moins 10 caracteres.'))
})

test('validateContactPayload rejects messages longer than 2000 characters', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload(buildContactPayload({ message: 'a'.repeat(2001) }))
  assert.equal(result.isValid, false)
  assert.ok(result.errors.includes('Le message ne doit pas depasser 2000 caracteres.'))
})

test('validateContactPayload accumulates all payload errors', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  const result = validateContactPayload({
    name: 'W',
    email: 'wrong',
    message: 'court',
  })
  assert.equal(result.errors.length, 3)
})

test('getClientIp uses req.ip first', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({
    headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.2' },
    ip: '198.51.100.40',
  }))
  assert.equal(ip, '198.51.100.40')
})

test('getClientIp normalizes ipv4-mapped ipv6 addresses', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({
    ip: '::ffff:203.0.113.10',
  }))
  assert.equal(ip, '203.0.113.10')
})

test('getClientIp falls back to req.ip', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({ headers: {}, ip: '198.51.100.50' }))
  assert.equal(ip, '198.51.100.50')
})

test('getClientIp falls back to socket remote address', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({ headers: {}, ip: '', socket: { remoteAddress: '192.0.2.4' } }))
  assert.equal(ip, '192.0.2.4')
})

test('getClientIp returns unknown when no address is available', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp({ headers: {}, socket: null })
  assert.equal(ip, 'unknown')
})

test('checkContactRateLimitMemory allows the first request', () => {
  const { checkContactRateLimitMemory } = loadBackend(DEFAULT_ENV)
  const result = checkContactRateLimitMemory(createRequest({ ip: '198.51.100.11' }))
  assert.equal(result.allowed, true)
})

test('checkContactRateLimitMemory decrements remaining quota', () => {
  const { checkContactRateLimitMemory } = loadBackend(DEFAULT_ENV)
  const req = createRequest({ ip: '198.51.100.12' })
  checkContactRateLimitMemory(req)
  const result = checkContactRateLimitMemory(req)
  assert.equal(result.remaining, 3)
})

test('checkContactRateLimitMemory blocks after five requests', () => {
  const { checkContactRateLimitMemory } = loadBackend(DEFAULT_ENV)
  const req = createRequest({ ip: '198.51.100.13' })

  for (let index = 0; index < 5; index += 1) {
    const result = checkContactRateLimitMemory(req)
    assert.equal(result.allowed, true)
  }

  const blocked = checkContactRateLimitMemory(req)
  assert.equal(blocked.allowed, false)
})

test('checkContactRateLimitMemory isolates counters per IP', () => {
  const { checkContactRateLimitMemory } = loadBackend(DEFAULT_ENV)
  const firstReq = createRequest({ ip: '198.51.100.14' })
  const secondReq = createRequest({ ip: '198.51.100.15' })

  for (let index = 0; index < 5; index += 1) {
    checkContactRateLimitMemory(firstReq)
  }

  const otherResult = checkContactRateLimitMemory(secondReq)
  assert.equal(otherResult.allowed, true)
  assert.equal(otherResult.remaining, 4)
})

test('checkContactRateLimitMemory resets after the configured time window', () => {
  const originalNow = Date.now
  let fakeNow = 1_700_000_000_000
  Date.now = () => fakeNow

  try {
    const { checkContactRateLimitMemory } = loadBackend(DEFAULT_ENV)
    const req = createRequest({ ip: '198.51.100.16' })

    for (let index = 0; index < 5; index += 1) {
      checkContactRateLimitMemory(req)
    }

    fakeNow += 600_001
    const resetResult = checkContactRateLimitMemory(req)
    assert.equal(resetResult.allowed, true)
    assert.equal(resetResult.remaining, 4)
  } finally {
    Date.now = originalNow
  }
})

test('GET / returns 200', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/')
    assert.equal(response.status, 200)
  } finally {
    await stopTestServer(server)
  }
})

test('GET / advertises public endpoints', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/')
    assert.deepEqual(body.endpoints, ['/api/health', '/api/contact'])
  } finally {
    await stopTestServer(server)
  }
})

test('GET /api/health returns ok status', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/health')
    assert.equal(body.status, 'ok')
  } finally {
    await stopTestServer(server)
  }
})

test('GET /api/health reports database not_configured in test mode', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/health')
    assert.equal(body.database, 'not_configured')
  } finally {
    await stopTestServer(server)
  }
})

test('responses omit the x-powered-by header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health')
    assert.equal(response.headers.get('x-powered-by'), null)
  } finally {
    await stopTestServer(server)
  }
})

test('allowed origins are echoed in access-control-allow-origin', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health', {
      headers: { Origin: 'https://allowed.example' },
    })
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://allowed.example')
  } finally {
    await stopTestServer(server)
  }
})

test('responses set Vary: Origin', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health', {
      headers: { Origin: 'https://allowed.example' },
    })
    assert.equal(response.headers.get('vary'), 'Origin')
  } finally {
    await stopTestServer(server)
  }
})

test('responses set allowed methods header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health')
    assert.equal(response.headers.get('access-control-allow-methods'), 'GET,POST,OPTIONS')
  } finally {
    await stopTestServer(server)
  }
})

test('responses set allowed headers header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health')
    assert.equal(response.headers.get('access-control-allow-headers'), 'Content-Type')
  } finally {
    await stopTestServer(server)
  }
})

test('disallowed origins are blocked with 403', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response, body } = await requestJson(baseUrl, '/api/health', {
      headers: { Origin: 'https://evil.example' },
    })
    assert.equal(response.status, 403)
    assert.equal(body.message, 'Origin non autorisee.')
  } finally {
    await stopTestServer(server)
  }
})

test('allowed OPTIONS preflight requests return 204', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'OPTIONS',
      headers: { Origin: 'https://allowed.example' },
    })
    assert.equal(response.status, 204)
  } finally {
    await stopTestServer(server)
  }
})

test('disallowed OPTIONS preflight requests return 403', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response, body } = await requestJson(baseUrl, '/api/contact', {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil.example' },
    })
    assert.equal(response.status, 403)
    assert.equal(body.message, 'Origin non autorisee.')
  } finally {
    await stopTestServer(server)
  }
})

test('requests without Origin still succeed', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/health')
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('access-control-allow-origin'), null)
  } finally {
    await stopTestServer(server)
  }
})

test('unknown routes return 404', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/does-not-exist')
    assert.equal(response.status, 404)
  } finally {
    await stopTestServer(server)
  }
})

test('unknown route messages include method and path', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/does-not-exist')
    assert.equal(body.message, 'Route introuvable: GET /api/does-not-exist')
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact accepts valid payloads', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.61',
      },
      body: JSON.stringify(buildContactPayload()),
    })
    assert.equal(response.status, 201)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns normalized stored data', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.62',
      },
      body: JSON.stringify(buildContactPayload({
        name: '  William Mahi  ',
        email: '  WILLIAM@EXAMPLE.COM  ',
        message: '  Bonjour, je veux une revue securite complete.  ',
      })),
    })

    assert.equal(body.item.name, 'William Mahi')
    assert.equal(body.item.email, 'william@example.com')
    assert.equal(body.item.message, 'Bonjour, je veux une revue securite complete.')
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns rate limit limit header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.63',
      },
      body: JSON.stringify(buildContactPayload()),
    })
    assert.equal(response.headers.get('x-ratelimit-limit'), '5')
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns rate limit remaining header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.64',
      },
      body: JSON.stringify(buildContactPayload()),
    })
    assert.equal(response.headers.get('x-ratelimit-remaining'), '4')
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns rate limit reset header', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.65',
      },
      body: JSON.stringify(buildContactPayload()),
    })
    assert.ok(Number(response.headers.get('x-ratelimit-reset')) > Date.now())
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns memory storage mode in test environment', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.66',
      },
      body: JSON.stringify(buildContactPayload()),
    })
    assert.equal(body.storage, 'memory')
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact rejects invalid short payloads with 400', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.68',
      },
      body: JSON.stringify({ name: 'W', email: 'wrong', message: 'court' }),
    })
    assert.equal(response.status, 400)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact returns an errors array for invalid payloads', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.69',
      },
      body: JSON.stringify({ name: 'W', email: 'wrong', message: 'court' }),
    })
    assert.equal(Array.isArray(body.errors), true)
    assert.equal(body.errors.length, 3)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact rejects missing body fields', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response, body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.70',
      },
      body: JSON.stringify({}),
    })
    assert.equal(response.status, 400)
    assert.equal(body.errors.length, 3)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact rejects overly long messages', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    const { response, body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.71',
      },
      body: JSON.stringify(buildContactPayload({ message: 'a'.repeat(2001) })),
    })
    assert.equal(response.status, 400)
    assert.ok(body.errors.includes('Le message ne doit pas depasser 2000 caracteres.'))
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact blocks the sixth request from the same IP', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    for (let index = 0; index < 5; index += 1) {
      const { response } = await requestJson(baseUrl, '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://allowed.example',
          'X-Forwarded-For': '198.51.100.72',
        },
        body: JSON.stringify(buildContactPayload()),
      })
      assert.equal(response.status, 201)
    }

    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.72',
      },
      body: JSON.stringify(buildContactPayload()),
    })

    assert.equal(response.status, 429)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact rate limiting is isolated per IP', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    for (let index = 0; index < 5; index += 1) {
      await requestJson(baseUrl, '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://allowed.example',
          'X-Forwarded-For': '198.51.100.73',
        },
        body: JSON.stringify(buildContactPayload()),
      })
    }

    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.74',
      },
      body: JSON.stringify(buildContactPayload()),
    })

    assert.equal(response.status, 201)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact rate limiting uses the first x-forwarded-for value', async () => {
  const { server, baseUrl } = await startTestServer()

  try {
    for (let index = 0; index < 5; index += 1) {
      await requestJson(baseUrl, '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://allowed.example',
          'X-Forwarded-For': '198.51.100.75, 10.0.0.1',
        },
        body: JSON.stringify(buildContactPayload()),
      })
    }

    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://allowed.example',
        'X-Forwarded-For': '198.51.100.75, 10.0.0.2',
      },
      body: JSON.stringify(buildContactPayload()),
    })

    assert.equal(response.status, 429)
  } finally {
    await stopTestServer(server)
  }
})

test('POST /api/contact stores a structured project and builds its readable summary on the server', async () => {
  const { server, baseUrl } = await startTestServer()
  const project = {
    path: 'create', activity: 'Atelier de luminaires', projectName: 'Atelier Sillage', namePending: false, audience: [], goal: '', existing: '', existingDetails: '', aspiration: '',
    choices: { catalog: 'wanted', cart: 'discuss' }, answers: {}, priorityNow: ['catalog'], priorityLater: [], fakeCart: ['Lampe Aube'],
    selfEdit: ['products'], languages: 'Français', materials: ['photos'], dataToMove: '', access: 'public', importantDate: '', dateReason: '', constraints: '',
  }
  try {
    const { response, body } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://allowed.example' },
      body: JSON.stringify({ kind: 'project', name: 'Marie Martin', email: 'marie@example.com', company: 'Atelier Sillage', message: 'Parlons-en.', project }),
    })
    assert.equal(response.status, 201)
    assert.match(body.item.message, /BESOINS SOUHAITÉS\n• Catalogue de produits ou de prestations/)
    assert.match(body.item.message, /POSSIBILITÉS À DISCUTER\n• Panier/)
    assert.equal(body.item.project_data.choices.catalog, 'wanted')
    assert.equal('fakeCart' in body.item.project_data, false)
    assert.doesNotMatch(body.item.message, /Compte personnel/)
  } finally { await stopTestServer(server) }
})

test('POST /api/contact rejects a malformed project without a success response', async () => {
  const { server, baseUrl } = await startTestServer()
  try {
    const { response } = await requestJson(baseUrl, '/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://allowed.example' },
      body: JSON.stringify({ kind: 'project', name: 'Marie Martin', email: 'marie@example.com', project: { path: 'create', choices: { catalog: 'wanted' } } }),
    })
    assert.equal(response.status, 400)
  } finally { await stopTestServer(server) }
})

test('notifyOwner does nothing without configuration', async () => {
  const { notifyOwner } = loadBackend()
  delete process.env.RESEND_API_KEY
  delete process.env.CONTACT_NOTIFY_TO
  let called = false
  const sent = await notifyOwner({ name: 'Marie', email: 'marie@example.com', message: 'Bonjour' }, async () => { called = true })
  assert.equal(sent, false)
  assert.equal(called, false)
})

test('notifyOwner sends the request to the owner with a reply-to', async () => {
  const { notifyOwner } = loadBackend()
  process.env.RESEND_API_KEY = 'key'
  process.env.CONTACT_NOTIFY_TO = 'moi@example.com, autre@example.com'
  try {
    let call
    const sent = await notifyOwner({ name: 'Marie', email: 'marie@example.com', message: 'Bonjour' }, async (url, init) => { call = { url, init }; return { ok: true, status: 200 } })
    const body = JSON.parse(call.init.body)
    assert.equal(sent, true)
    assert.equal(call.url, 'https://api.resend.com/emails')
    assert.equal(call.init.headers.Authorization, 'Bearer key')
    assert.deepEqual(body.to, ['moi@example.com', 'autre@example.com'])
    assert.equal(body.reply_to, 'marie@example.com')
    assert.match(body.text, /Bonjour/)
  } finally {
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_NOTIFY_TO
  }
})

test('notifyOwner swallows provider failures', async () => {
  const { notifyOwner } = loadBackend()
  process.env.RESEND_API_KEY = 'key'
  process.env.CONTACT_NOTIFY_TO = 'moi@example.com'
  try {
    assert.equal(await notifyOwner({ name: 'M', email: 'm@example.com', message: 'x' }, async () => { throw new Error('down') }), false)
    assert.equal(await notifyOwner({ name: 'M', email: 'm@example.com', message: 'x' }, async () => ({ ok: false, status: 500 })), false)
  } finally {
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_NOTIFY_TO
  }
})

test('notifyOwner attaches a recap PDF for project requests', async () => {
  const { notifyOwner } = loadBackend()
  process.env.RESEND_API_KEY = 'key'
  process.env.CONTACT_NOTIFY_TO = 'moi@example.com'
  try {
    let body
    const sent = await notifyOwner(
      { name: 'Marie', email: 'marie@example.com', message: 'DEMANDE DE PROJET\nParcours : Créer un site', projectData: { path: 'create' } },
      async (_url, init) => { body = JSON.parse(init.body); return { ok: true, status: 200 } },
    )
    assert.equal(sent, true)
    assert.equal(body.attachments[0].filename, 'recap-projet.pdf')
    assert.equal(Buffer.from(body.attachments[0].content, 'base64').subarray(0, 4).toString(), '%PDF')
  } finally {
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_NOTIFY_TO
  }
})

// Stand-in for Google: the "credential" is `email|nonce`, so the test can control both claims.
const fakeGoogle = async (credential) => {
  const [email, nonce] = credential.split('|')
  return { email, nonce, email_verified: true }
}
async function signIn(baseUrl, email, extraHeaders = {}, nonceOverride) {
  const { body } = await requestJson(baseUrl, '/api/auth/config')
  const nonce = nonceOverride ?? body.nonce
  return requestJson(baseUrl, '/api/auth/google', { method: 'POST', headers: { 'content-type': 'application/json', ...extraHeaders }, body: JSON.stringify({ credential: `${email}|${body.nonce}`, nonce }) })
}

test('admin area is reserved to the Google account of ADMIN_EMAIL', async () => {
  const backend = await startTestServer()
  Object.assign(process.env, { ADMIN_EMAIL: 'moi@example.com', GOOGLE_CLIENT_ID: 'client-id', SESSION_SECRET: 'x'.repeat(40) })
  backend.setGoogleVerifier(fakeGoogle)
  const { baseUrl } = backend
  try {
    assert.equal((await requestJson(baseUrl, '/api/admin/requests')).response.status, 401)
    assert.equal((await requestJson(baseUrl, '/api/admin/requests', { headers: { cookie: 'wm_admin=forged.sig' } })).response.status, 401)

    const stranger = await signIn(baseUrl, 'autre@example.com')
    assert.equal(stranger.response.status, 403)

    // A token without a valid, matching server nonce is refused even for the right account.
    assert.equal((await signIn(baseUrl, 'moi@example.com', {}, 'forged.nonce.sig')).response.status, 403)
    const noNonce = await requestJson(baseUrl, '/api/auth/google', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ credential: 'moi@example.com|x' }) })
    assert.equal(noNonce.response.status, 403)

    const login = await signIn(baseUrl, 'MOI@example.com')
    assert.equal(login.response.status, 200)
    const cookie = login.response.headers.get('Set-Cookie')
    assert.match(cookie, /HttpOnly/)
    assert.match(cookie, /SameSite=Strict/)
    const auth = { headers: { cookie: cookie.split(';')[0] } }

    const created = await requestJson(baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Marie', email: 'marie@example.com', message: 'Bonjour, je voudrais un site.' }) })
    const list = await requestJson(baseUrl, '/api/admin/requests', auth)
    assert.equal(list.response.status, 200)
    assert.equal(list.body.items[0].email, 'marie@example.com')
    const pdf = await requestJson(baseUrl, `/api/admin/requests/${created.body.item.id}/pdf`, auth)
    assert.equal(pdf.response.status, 200)
    assert.equal(pdf.response.headers.get('Content-Type'), 'application/pdf')
    assert.equal((await requestJson(baseUrl, '/api/auth/me', auth)).response.status, 200)

    const id = created.body.item.id
    const json = { ...auth.headers, 'content-type': 'application/json' }
    assert.equal(list.body.items[0].status, 'new')
    assert.equal((await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'quoted' }) })).response.status, 401)
    const patched = await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ status: 'quoted', notes: 'Rappeler jeudi' }) })
    assert.equal(patched.response.status, 200)
    assert.deepEqual([patched.body.item.status, patched.body.item.notes], ['quoted', 'Rappeler jeudi'])
    assert.equal((await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ status: 'nope' }) })).response.status, 400)
    assert.equal((await requestJson(baseUrl, '/api/admin/requests/9999', { method: 'PATCH', headers: json, body: JSON.stringify({ notes: 'x' }) })).response.status, 404)
  } finally { for (const key of ['ADMIN_EMAIL', 'GOOGLE_CLIENT_ID', 'SESSION_SECRET']) delete process.env[key] }
})

async function adminSession(backend) {
  Object.assign(process.env, { ADMIN_EMAIL: 'moi@example.com', GOOGLE_CLIENT_ID: 'client-id', SESSION_SECRET: 'x'.repeat(40) })
  backend.setGoogleVerifier(fakeGoogle)
  const login = await signIn(backend.baseUrl, 'moi@example.com')
  const cookie = login.response.headers.get('Set-Cookie').split(';')[0]
  return { auth: { headers: { cookie } }, json: { cookie, 'content-type': 'application/json' } }
}
const clearAdminEnv = () => { for (const key of ['ADMIN_EMAIL', 'GOOGLE_CLIENT_ID', 'SESSION_SECRET']) delete process.env[key] }

test('admin can follow a request through the pipeline, archive it, export it and delete it', async () => {
  const backend = await startTestServer()
  const { auth, json } = await adminSession(backend)
  const { baseUrl } = backend
  try {
    const created = await requestJson(baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Paul Recruteur', email: 'Paul@Example.com', message: 'Nous recrutons un développeur.', audience: 'recruiter', company: 'ACME', phone: '06 12 34 56 78' }) })
    assert.equal(created.response.status, 201)
    const id = created.body.item.id
    const patch = (body) => requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify(body) })

    const list = await requestJson(baseUrl, '/api/admin/requests', auth)
    const item = list.body.items.find((row) => row.id === id)
    assert.deepEqual([item.audience, item.company, item.phone, item.insights.kind, item.archived], ['recruiter', 'ACME', '06 12 34 56 78', 'message', false])

    const quoted = await patch({ status: 'quoted', amount: 2400, followUpAt: '2026-12-01', declineReason: '' })
    assert.equal(quoted.response.status, 200)
    assert.deepEqual([quoted.body.item.amount, quoted.body.item.follow_up_at], [2400, '2026-12-01'])
    const declined = await patch({ status: 'declined', declineReason: 'Budget' })
    assert.equal(declined.body.item.decline_reason, 'Budget')
    assert.deepEqual(declined.body.item.history.map((e) => [e.type, e.from, e.to]), [['status', 'new', 'quoted'], ['status', 'quoted', 'declined']])
    const archived = await patch({ archived: true })
    assert.equal(archived.body.item.archived, true)
    assert.equal(archived.body.item.history.at(-1).type, 'archived')

    for (const bad of [{ amount: -1 }, { amount: 1.5 }, { followUpAt: 'demain' }, { audience: 'alien' }, { archived: 'oui' }, { unknown: 1 }, {}]) {
      assert.equal((await patch(bad)).response.status, 400, JSON.stringify(bad))
    }

    const csv = await requestJson(baseUrl, '/api/admin/requests.csv', auth)
    assert.equal(csv.response.status, 200)
    assert.match(csv.response.headers.get('Content-Type'), /text\/csv/)
    assert.match(csv.body, /"Paul Recruteur";"Paul@Example.com"|"Paul Recruteur";"paul@example.com"/i)
    assert.match(csv.body, /"declined"/)
    assert.equal((await requestJson(baseUrl, '/api/admin/requests.csv')).response.status, 401)

    const injected = await requestJson(baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: '=HYPERLINK("x")', email: 'a@example.com', message: 'Un message assez long.' }) })
    assert.equal(injected.response.status, 201)
    assert.match((await requestJson(baseUrl, '/api/admin/requests.csv', auth)).body, /"'=HYPERLINK/)

    const draft = await requestJson(baseUrl, `/api/admin/requests/${id}/draft`, auth)
    assert.equal(draft.response.status, 200)
    assert.equal(draft.body.templates.length, 4)

    assert.equal((await requestJson(baseUrl, '/api/admin/purge', { method: 'POST', headers: json, body: JSON.stringify({ months: 0 }) })).response.status, 400)
    assert.equal((await requestJson(baseUrl, '/api/admin/purge', { method: 'POST', headers: json, body: JSON.stringify({ months: 12 }) })).body.deleted, 0)

    assert.equal((await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'DELETE' })).response.status, 401)
    assert.equal((await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'DELETE', ...auth })).response.status, 204)
    assert.equal((await requestJson(baseUrl, `/api/admin/requests/${id}`, { method: 'DELETE', ...auth })).response.status, 404)
  } finally { clearAdminEnv() }
})

test('contact validation rejects an invalid phone number and unknown audiences fall back', async () => {
  const backend = await startTestServer()
  const send = (body, ip) => requestJson(backend.baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) })
  assert.equal((await send(buildContactPayload({ phone: 'abc' }), '203.0.113.1')).response.status, 400)
  const ok = await send(buildContactPayload({ audience: 'bogus' }), '203.0.113.2')
  assert.equal(ok.response.status, 201)
  assert.equal(backend.validateContactPayload({ ...buildContactPayload(), audience: 'bogus' }).data.audience, 'other')
})

test('visitors can book a free slot once and the owner manages appointments', async () => {
  const backend = await startTestServer()
  const { auth, json } = await adminSession(backend)
  const { baseUrl } = backend
  const post = (path, body, ip = '203.0.113.9') => requestJson(baseUrl, path, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) })
  try {
    const slots = await requestJson(baseUrl, '/api/slots')
    assert.equal(slots.response.status, 200)
    assert.ok(slots.body.slots.length > 0)
    const slot = slots.body.slots[0]

    assert.equal((await post('/api/appointments', { name: 'A', email: 'x', startsAt: slot })).response.status, 400)
    assert.equal((await post('/api/appointments', { name: 'Marie Martin', email: 'marie@example.com', startsAt: '2020-01-01T10:00:00.000Z' })).response.status, 409)
    const booked = await post('/api/appointments', { name: 'Marie Martin', email: 'marie@example.com', topic: 'Site vitrine', startsAt: slot })
    assert.equal(booked.response.status, 201)
    assert.equal((await post('/api/appointments', { name: 'Paul Durand', email: 'paul@example.com', startsAt: slot }, '203.0.113.10')).response.status, 409)
    assert.equal((await requestJson(baseUrl, '/api/slots')).body.slots.includes(slot), false)

    assert.equal((await requestJson(baseUrl, '/api/admin/appointments')).response.status, 401)
    const list = await requestJson(baseUrl, '/api/admin/appointments', auth)
    assert.equal(list.body.items.length, 1)
    const id = list.body.items[0].id
    const confirmed = await requestJson(baseUrl, `/api/admin/appointments/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ status: 'confirmed' }) })
    assert.equal(confirmed.body.item.status, 'confirmed')
    assert.equal((await requestJson(baseUrl, `/api/admin/appointments/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ status: 'nope' }) })).response.status, 400)
    await requestJson(baseUrl, `/api/admin/appointments/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ status: 'cancelled' }) })
    assert.equal((await requestJson(baseUrl, '/api/slots')).body.slots.includes(slot), true)
  } finally { clearAdminEnv() }
})

test('settings, anonymous events, statistics and health are served to the owner only', async () => {
  const backend = await startTestServer()
  const { auth, json } = await adminSession(backend)
  const { baseUrl } = backend
  const event = (body, ip = '203.0.113.20') => requestJson(baseUrl, '/api/events', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) })
  try {
    assert.equal((await event({ type: 'visit', audience: 'client' })).response.status, 204)
    assert.equal((await event({ type: 'guide_step', step: '3' })).response.status, 204)
    assert.equal((await event({ type: 'request_sent' })).response.status, 204)
    for (const bad of [{ type: 'hack' }, { type: 'visit', audience: 'x' }, { type: 'guide_step', step: 'a b' }, {}]) assert.equal((await event(bad)).response.status, 400)

    for (const path of ['/api/admin/stats', '/api/admin/settings', '/api/admin/health']) assert.equal((await requestJson(baseUrl, path)).response.status, 401, path)
    const stats = await requestJson(baseUrl, '/api/admin/stats', auth)
    assert.deepEqual([stats.body.stats.funnel.visits, stats.body.stats.funnel.requestsSent, stats.body.stats.steps], [1, 1, [{ step: 3, count: 1 }]])

    const settings = await requestJson(baseUrl, '/api/admin/settings', auth)
    assert.equal(settings.body.settings.signature, 'William Mahi')
    const next = { ...settings.body.settings, signature: 'W. Mahi', followUpDays: 5 }
    assert.equal((await requestJson(baseUrl, '/api/admin/settings', { method: 'PUT', headers: json, body: JSON.stringify(next) })).body.settings.followUpDays, 5)
    assert.equal((await requestJson(baseUrl, '/api/admin/settings', auth)).body.settings.signature, 'W. Mahi')
    assert.equal((await requestJson(baseUrl, '/api/admin/settings', { method: 'PUT', headers: json, body: JSON.stringify({ ...next, followUpDays: 0 }) })).response.status, 400)

    const health = await requestJson(baseUrl, '/api/admin/health', auth)
    assert.deepEqual([health.body.database, health.body.google, health.body.email], ['memory', true, false])
  } finally { clearAdminEnv() }
})

test('admin sign-in is rate limited', async () => {
  const backend = await startTestServer()
  Object.assign(process.env, { ADMIN_EMAIL: 'moi@example.com', GOOGLE_CLIENT_ID: 'client-id', SESSION_SECRET: 'x'.repeat(40) })
  backend.setGoogleVerifier(async (credential) => fakeGoogle(`autre@example.com|${credential.split('|')[1]}`))
  try {
    const attempt = () => signIn(backend.baseUrl, 'autre@example.com', { 'x-forwarded-for': '203.0.113.30' })
    for (let i = 0; i < 10; i += 1) assert.equal((await attempt()).response.status, 403)
    assert.equal((await attempt()).response.status, 429)
  } finally { clearAdminEnv() }
})

test('admin API refuses cross-site state-changing requests', async () => {
  const backend = await startTestServer()
  const { json } = await adminSession(backend)
  try {
    const crossSite = await requestJson(backend.baseUrl, '/api/admin/requests/1', { method: 'DELETE', headers: { ...json, 'sec-fetch-site': 'cross-site' } })
    assert.equal(crossSite.response.status, 403)
    const sameSite = await requestJson(backend.baseUrl, '/api/admin/requests/1', { method: 'DELETE', headers: { ...json, 'sec-fetch-site': 'same-origin' } })
    assert.notEqual(sameSite.response.status, 403)
  } finally { clearAdminEnv() }
})

test('contact validation refuses oversized names and addresses that could inject into mailto links or headers', () => {
  const { validateContactPayload } = loadBackend(DEFAULT_ENV)
  assert.equal(validateContactPayload(buildContactPayload({ name: 'x'.repeat(121) })).isValid, false)
  for (const email of ['a@b.co?bcc=evil@x.com', 'a@b.co&body=x', 'a"b@c.fr', 'a@b.co,c@d.fr', `${'a'.repeat(65)}@b.fr`]) {
    assert.equal(validateContactPayload(buildContactPayload({ email })).isValid, false, email)
  }
  const cleaned = validateContactPayload(buildContactPayload({ name: 'Marie\r\nBcc: evil@x.com' }))
  assert.equal(cleaned.data.name.includes('\n'), false)
  assert.equal(validateContactPayload(buildContactPayload({ email: 'marie.dupont+pro@exemple.fr' })).isValid, true)
})

test('admin patch ignores inherited property names and malformed JSON answers 400', async () => {
  const backend = await startTestServer()
  const { auth, json } = await adminSession(backend)
  try {
    const created = await requestJson(backend.baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Marie', email: 'marie@example.com', message: 'Bonjour, je voudrais un site.' }) })
    const id = created.body.item.id
    for (const key of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
      const response = await requestJson(backend.baseUrl, `/api/admin/requests/${id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ [key]: 'x' }) })
      assert.equal(response.response.status, 400, key)
    }
    assert.ok(auth)
  } finally { clearAdminEnv() }
})

test('a filled honeypot gets a fake success and nothing is stored, sent or booked', async () => {
  const backend = await startTestServer()
  const { auth } = await adminSession(backend)
  try {
    const bot = await requestJson(backend.baseUrl, '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Bot', email: 'bot@example.com', message: 'Achetez mes pilules maintenant', website: 'http://spam.example' }) })
    assert.equal(bot.response.status, 201)
    const booking = await requestJson(backend.baseUrl, '/api/appointments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Bot', email: 'bot@example.com', startsAt: '2030-01-01T10:00:00.000Z', website: 'x' }) })
    assert.equal(booking.response.status, 201)
    const list = await requestJson(backend.baseUrl, '/api/admin/requests', auth)
    assert.equal(list.body.items.some((item) => item.email === 'bot@example.com'), false)
    assert.equal((await requestJson(backend.baseUrl, '/api/admin/appointments', auth)).body.items.some((item) => item.email === 'bot@example.com'), false)
  } finally { clearAdminEnv() }
})
