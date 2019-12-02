import dotenv from 'dotenv'
import convict from 'convict'
import { join } from 'path'

dotenv.config()
const defaultEnv = 'production'
const env = process.env.NODE_ENV || defaultEnv
const envPath = join(__dirname, '..', `.env.${env}`)
dotenv.config({ path: envPath })

const config = convict({
  logLevel: {
    doc: 'The output log level',
    format: ['DEBUG', 'INFO', 'ERROR'],
    default: 'INFO',
    env: 'LOG_LEVEL'
  },
  env: {
    doc: 'The application environment',
    format: ['production', 'ote', 'test', 'development'],
    default: defaultEnv,
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  db: {
    password: {
      doc: 'password',
      default: 'password',
      sensitive: true
    }
  }
})

console.info(config.toString())

export default config.getProperties()
