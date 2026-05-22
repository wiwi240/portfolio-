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
  assert.ok(result.errors.includes('Le nom doit contenir au moins 2 caracteres.'))
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

test('getClientIp prefers the first x-forwarded-for value', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({
    headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.2' },
  }))
  assert.equal(ip, '203.0.113.10')
})

test('getClientIp trims the x-forwarded-for value', () => {
  const { getClientIp } = loadBackend(DEFAULT_ENV)
  const ip = getClientIp(createRequest({
    headers: { 'x-forwarded-for': '   203.0.113.10   ' },
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
    assert.equal(response.headers.get('access-control-allow-headers'), 'Content-Type, X-Admin-Token')
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
