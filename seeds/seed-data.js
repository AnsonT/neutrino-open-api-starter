
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      const createdAt = Date.now()
      const modifiedAt = createdAt
      return knex('roles').insert([
        { roleId: '5df43e65-cfd0-445d-80ae-b66a255cd8c8', roleName: 'superuser', description: 'superuser', createdAt, modifiedAt },
        { roleId: '2e78fbe8-d4ef-4284-9613-c2dabae8720d', roleName: 'admin', description: 'administrator', createdAt, modifiedAt },
        { roleId: '5cea02fd-a58e-43f4-b522-faf212b47233', roleName: 'user', description: 'user', createdAt, modifiedAt },
        { roleId: '43d5dd0c-ac64-4b99-812d-312dabd536c3', roleName: 'guest', description: 'guest', createdAt, modifiedAt }
      ])
    })
}
