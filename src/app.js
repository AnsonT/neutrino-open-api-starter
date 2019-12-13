import express from 'express'
import helmet from 'helmet'
import initApiV1 from './api-v1'

async function initApp (dependencies = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  app.use('/api', await initApiV1(dependencies))
  return app
}

export default initApp
