import express from 'express'
import { initialize } from 'express-openapi' // eslint-disable-line no-unused-vars
import cors from 'cors'
import bodyParser from 'body-parser'
import apiDoc from './api-doc.yml'

function reqOperations (context) {
  return context.keys().reduce((ret, key) =>
    ({ ...ret, ...context(key) }), {})
}

export default async function initAPI (dependencies) {
  const operationsContext = require.context('./operations', false, /\.js$/)
  const operations = reqOperations(operationsContext)

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  initialize({
    app,
    apiDoc,
    exposeApiDocs: true,
    dependencies,
    operations
  })
  return app
}
