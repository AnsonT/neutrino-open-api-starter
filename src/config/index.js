import dotenv from 'dotenv'
import convict from 'convict'
import { join } from 'path'
import schema from './schema.yaml'

dotenv.config()

const defaultEnv = 'production'
const env = process.env.NODE_CONFIG_ENV || process.env.NODE_ENV || defaultEnv
const envPath = join(__dirname, '..', `.env.${env}`)
dotenv.config({ path: envPath })

const config = convict({
  env: {
    doc: 'The application configuration environment',
    format: ['production', 'ote', 'test', 'unittest', 'development'],
    default: env,
    env: 'NODE_CONFIG_ENV'
  },
  ...schema
})

console.info(config.toString())

export default config.getProperties()
