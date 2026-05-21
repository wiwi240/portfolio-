const test = require('node:test')
const assert = require('node:assert/strict')

const { checkContactRateLimitMemory, getClientIp, normalizeText, validateContactPayload } = require('./index')

test('normalizeText trims strings and ignores non-string values', () => {
  assert.equal(normalizeText('  William  '), 'William')
  assert.equal(normalizeText(42), '')
  assert.equal(normalizeText(undefined), '')
})

test('validateContactPayload accepts a valid contact payload', () => {
  const result = validateContactPayload({
    name: 'William Mahi',
    email: 'WILLIAM@example.com',
    message: 'Bonjour, je souhaite discuter d un portfolio et dune API.',
  })

  assert.equal(result.isValid, true)
  assert.deepEqual(result.errors, [])
  assert.equal(result.data.name, 'William Mahi')
  assert.equal(result.data.email, 'william@example.com')
})

test('validateContactPayload rejects invalid payloads', () => {
  const result = validateContactPayload({
    name: 'W',
    email: 'not-an-email',
    message: 'court',
  })

  assert.equal(result.isValid, false)
  assert.equal(result.errors.length, 3)
})

test('getClientIp prefers x-forwarded-for first value', () => {
  const ip = getClientIp({
    headers: {
      'x-forwarded-for': '203.0.113.10, 10.0.0.1',
    },
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
  })

  assert.equal(ip, '203.0.113.10')
})

test('checkContactRateLimitMemory allows first requests then blocks after limit', () => {
  const req = {
    headers: {},
    ip: '198.51.100.7',
    socket: { remoteAddress: '198.51.100.7' },
  }

  let lastResult = null

  for (let index = 0; index < 5; index += 1) {
    lastResult = checkContactRateLimitMemory(req)
    assert.equal(lastResult.allowed, true)
  }

  const blockedResult = checkContactRateLimitMemory(req)
  assert.equal(blockedResult.allowed, false)
  assert.equal(blockedResult.remaining, 0)
})
