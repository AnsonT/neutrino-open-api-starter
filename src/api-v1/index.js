import express from 'express'
import { initialize } from 'express-openapi' // eslint-disable-line no-unused-vars
import apiDoc from './api-doc.yml'

function reqOperations (context) {
  return context.keys().reduce((ret, key) =>
    ({ ...ret, ...context(key) }), {})
}

export default async function initAPI (dependencies) {
  const operationsContext = require.context('./operations', false, /\.js$/)
  const operations = reqOperations(operationsContext)

  const app = express()
  initialize({
    app,
    apiDoc,
    dependencies,
    operations
  })
  return app
}
