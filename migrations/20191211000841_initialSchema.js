
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('userId').primary().notNullable()
    table.string('userName', 64).unique().notNullable()
    table.string('email', 64)
    table.datetime('emailVerifiedAt')
    table.boolean('needNewPassword')
    table.datetime('createdAt')
    table.datetime('modifiedAt')
  })
  await knex.schema.createTable('logins', (table) => {
    table.uuid('loginId').primary().notNullable()
    table.uuid('userId').notNullable()
    table.string('passwordHash', 128).notNullable()
    table.datetime('createdAt')
    table.foreign('userId').references('userId').inTable('users')
  })
  await knex.schema.createTable('loginAttempts', (table) => {
    table.datetime('loginAt')
    table.uuid('userId')
    table.boolean('success')
    table.string('loginIp')
    table.index('loginAt')
    table.index('userId')
    table.foreign('userId').references('userId').inTable('users')
  })
  await knex.schema.createTable('roles', (table) => {
    table.uuid('roleId').primary().notNullable()
    table.string('roleName', 64).unique().notNullable()
    table.text('description')
    table.datetime('createdAt')
    table.datetime('modifiedAt')
  })
  await knex.schema.createTable('usersRoles', (table) => {
    table.uuid('userId').notNullable()
    table.uuid('roleId').notNullable()
    table.datetime('createdAt')
    table.primary(['userId', 'roleId'])
    table.index(['userId', 'roleId'])
    table.foreign('userId').references('userId').inTable('users')
    table.foreign('roleId').references('roleId').inTable('roles').onDelete('CASCADE')
  })
  await knex.schema.createTable('emailVerifications', (table) => {
    table.uuid('verificationId').primary().notNullable()
    table.uuid('userId').notNullable()
    table.uuid('email').notNullable()
    table.datetime('expireAt').notNullable()
    table.datetime('verifiedAt')
    table.foreign('userId').references('userId').inTable('users')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('emailVerifications')
  await knex.schema.dropTableIfExists('usersRoles')
  await knex.schema.dropTableIfExists('roles')
  await knex.schema.dropTableIfExists('loginAttempts')
  await knex.schema.dropTableIfExists('logins')
  await knex.schema.dropTableIfExists('users')
}
