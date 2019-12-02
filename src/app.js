import express from 'express'
import initApiV1 from './api-v1'

async function initApp (dependencies = {}) {
  const app = express()
  app.use('/api', await initApiV1(dependencies))
  return app
}

export default initApp
