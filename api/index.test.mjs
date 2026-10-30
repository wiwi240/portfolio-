import test from 'node:test'
import assert from 'node:assert/strict'

test('la fonction Vercel ne renvoie pas de succès si la base de production est absente', async () => {
  process.env.NODE_ENV = 'production'
  delete process.env.DATABASE_URL
  const { default: handler } = await import('./index.js')
  const result = { status: 0, body: null }
  const response = {
    status(code) { result.status = code; return this },
    json(body) { result.body = body; return this },
  }
  await handler({ method: 'POST', url: '/api/contact' }, response)
  assert.equal(result.status, 503)
  assert.match(result.body.message, /indisponible/)
})
