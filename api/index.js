import backendModule from '../backend/src/index.js'

export default async function handler(req, res) {
  try {
    await backendModule.ensureDatabase()
  } catch (error) {
    console.error('Database unavailable for API request:', error)
    res.status(503).json({ message: 'Service temporairement indisponible.' })
    return
  }
  return backendModule.app(req, res)
}
