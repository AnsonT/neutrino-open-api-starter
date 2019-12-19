exports.seed = async (knex) => {
  const createdAt = new Date()
  const modifiedAt = createdAt
  await knex('roles').del()
  await knex('roles')
    .insert([
      { roleId: '5df43e65-cfd0-445d-80ae-b66a255cd8c8', roleName: 'superuser', description: 'superuser', createdAt, modifiedAt },
      { roleId: '2e78fbe8-d4ef-4284-9613-c2dabae8720d', roleName: 'admin', description: 'administrator', createdAt, modifiedAt },
      { roleId: '5cea02fd-a58e-43f4-b522-faf212b47233', roleName: 'user', description: 'user', createdAt, modifiedAt },
      { roleId: '43d5dd0c-ac64-4b99-812d-312dabd536c3', roleName: 'guest', description: 'guest', createdAt, modifiedAt }
    ])
  await knex('permissions').del()
  await knex('permissions')
    .insert([
      { permissionId: '90f9f8a5-375e-4dec-a173-ca0ea30add37', permission: 'rolesAndPermissionsOwner', createdAt },
      { permissionId: '7f58ff88-ba3c-4293-8bd2-634d4b431859', permission: 'rolesAndPermissionsEditor', createdAt },
      { permissionId: '9aaa5c4c-2a36-4b3f-8a93-0e724cae50ae', permission: 'rolesAndPermissionsViewer', createdAt },
      { permissionId: '1c1765e4-c651-457e-bf41-ced87e76ae89', permission: 'usersOwner', createdAt },
      { permissionId: '42f87c0f-f4d2-4277-bf5d-6a91f341e97b', permission: 'usersEditor', createdAt },
      { permissionId: '3bbe0174-6504-44c7-9628-3a9e1d4496a4', permission: 'usersViewer', createdAt }
    ])
  await knex('rolesPermissions').del()
  await knex('rolesPermissions')
    .insert([
      { roleId: '5df43e65-cfd0-445d-80ae-b66a255cd8c8', permissionId: '90f9f8a5-375e-4dec-a173-ca0ea30add37' },
      { roleId: '5df43e65-cfd0-445d-80ae-b66a255cd8c8', permissionId: '7f58ff88-ba3c-4293-8bd2-634d4b431859' },
      { roleId: '5df43e65-cfd0-445d-80ae-b66a255cd8c8', permissionId: '9aaa5c4c-2a36-4b3f-8a93-0e724cae50ae' },
      { roleId: '2e78fbe8-d4ef-4284-9613-c2dabae8720d', permissionId: '1c1765e4-c651-457e-bf41-ced87e76ae89' },
      { roleId: '2e78fbe8-d4ef-4284-9613-c2dabae8720d', permissionId: '42f87c0f-f4d2-4277-bf5d-6a91f341e97b' },
      { roleId: '2e78fbe8-d4ef-4284-9613-c2dabae8720d', permissionId: '3bbe0174-6504-44c7-9628-3a9e1d4496a4' }
    ])
}
