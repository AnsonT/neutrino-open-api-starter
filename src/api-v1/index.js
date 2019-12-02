import express from 'express'
import { initialize } from 'express-openapi' // eslint-disable-line no-unused-vars
import { join } from 'path'
import fs from 'fs'
import cors from 'cors'
import bodyParser from 'body-parser'
import apiDoc from './api-doc.yml'

function getOperations () {
  let req = null
  let files = []
  if (typeof __webpack_require__ === 'function') { // eslint-disable-line
    req = require.context('./operations', false, /^.*(?<!(\.spec))\.js$/)
    files = req.keys()
  } else {
    req = require
    // TODO: check valid file name /^.*(?<!(\.spec))\.js$/
    files = fs.readdirSync(join(__dirname, './operations')).map(file => `./${join('operations', file)}`)
  }
  return files.reduce((ret, key) =>
    ({ ...ret, ...req(key) }), {})
}

export default async function initAPI (dependencies) {
  const operations = getOperations()

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
