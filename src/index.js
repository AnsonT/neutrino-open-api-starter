import { createServer } from 'http'
import initApp from './app'
import dependencies from './dependencies'

const PORT = 3000
const IP = '0.0.0.0'
let currentApp
let server

async function init () {
  currentApp = await initApp(dependencies)
  server = createServer(currentApp)
  server.listen(PORT, IP, () => {
    console.log('Server started on port ' + PORT)
  })
}

if (module.hot) {
  module.hot.accept('./app', async () => {
    server.removeListener('request', currentApp)
    currentApp = await initApp(dependencies)
    server.on('request', currentApp)
  })
}

init()
process.on('SIGINT', () => {
  console.info('SIGTERM signal received.')
  console.log('Closing http server.')
  server.close(() => {
    console.log('Http server closed.')
    process.exit(0)
  })
})
