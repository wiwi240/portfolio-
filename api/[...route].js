import backendModule from '../backend/src/index.js'

export default function handler(req, res) {
  return backendModule.app(req, res)
}
