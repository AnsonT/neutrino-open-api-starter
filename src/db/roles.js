import { dbGetUser } from './users'

export async function dbAssignRole (tx, userNameOrId, roleNameOrId) {
  const { userId } = await dbGetUser(tx, userNameOrId)
  const { roleId } = await dbGetRole(tx, roleNameOrId)
  const createdAt = Date.now()
  if (userId && roleId) {
    await tx.insert({ userId, roleId, createdAt }).into('usersRoles')
    return { userId, roleId, success: true }
  }
  return { success: false }
}

export async function dbRemoveRole (tx, userNameOrId, roleNameOrId) {

}

export async function dbCreateRole (tx, roleName, description) {
}

export async function dbGetRole (tx, roleNameOrId) {
  return tx
    .select()
    .from('roles')
    .where({ roleId: roleNameOrId })
    .orWhere({ roleName: roleNameOrId.toLowerCase() })
    .first()
}

export async function dbGetUserRoles (tx, userNameOrId) {
  const { userId } = await dbGetUser(tx, userNameOrId)
  return tx
    .select()
    .from('usersRoles')
    .join('roles', 'usersRoles.roleId', '=', 'roles.roleId')
    .where({ userId })
}
