import backendModule from '../backend/src/index.js'

export default async function handler(req, res) {
  try {
    await backendModule.ensureDatabase()
  } catch (error) {
    console.error('Database unavailable for API request:', error)
    // TEMPORARY diagnostic: only the technical error code (no message, host or credentials). Remove once the database is connected.
    res.status(503).json({ message: 'Service temporairement indisponible.', reason: String(error?.code || error?.name || 'unknown').slice(0, 40) })
    return
  }
  return backendModule.app(req, res)
}
