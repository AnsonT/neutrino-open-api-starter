import { dbGetUser } from './users'
import _ from 'lodash-uuid'

export async function dbAssignRole (tx, userNameOrId, roleNameOrId) {
  const { userId } = await dbGetUser(tx, userNameOrId)
  const { roleId } = await dbGetRole(tx, roleNameOrId)
  const createdAt = new Date()
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
  const where = _.isUuid(roleNameOrId)
    ? { roleId: roleNameOrId }
    : { roleName: roleNameOrId.toLowerCase() }

  return tx
    .select()
    .from('roles')
    .where(where)
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
