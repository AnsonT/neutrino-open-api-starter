import express from 'express'
import initApi from './api-v1'

async function initApp (dependencies = {}) {
  const app = express()
  app.use('/api', await initApi())
  return app
}

export default initApp
