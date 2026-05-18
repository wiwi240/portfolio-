const test = require('node:test')
const assert = require('node:assert/strict')

const { normalizeText, validateContactPayload } = require('./index')

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
