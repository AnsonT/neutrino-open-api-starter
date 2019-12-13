import config from '../config'
import dbConfig from '../../knexfile'
import Knex from 'knex'

export function Query () {
  if (!Query.pool) {
    Query.pool = new Knex(
      dbConfig[config.env]
    )
  }
  return Query.pool
}
