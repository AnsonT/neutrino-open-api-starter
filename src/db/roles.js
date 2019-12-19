import { dbGetUser } from './users'
import _ from 'lodash'
import isUUID from 'is-uuid'
import NodeCache from 'node-cache'

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
  const where = isUUID.anyNonNil(roleNameOrId)
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
    .join('roles', 'usersRoles.roleId', 'roles.roleId')
    .where({ userId })
}

const rolesAndPermissionsCache = new NodeCache({ stdTTL: 30 })

export async function dbGetRolesAndPermissions (tx) {
  let rolesAndPermissions = rolesAndPermissionsCache.get('rolesAndPermissions')
  if (!rolesAndPermissions) {
    rolesAndPermissions = await tx
      .select([
        'r.roleId',
        'p.permissionId',
        'p.permission'
      ])
      .from('permissions as p')
      .join('rolesPermissions as rp', 'rp.permissionId', 'p.permissionId')
      .join('roles as r', 'r.roleId', 'rp.roleId')
    rolesAndPermissions = _.groupBy(rolesAndPermissions, r => r.roleId)
    rolesAndPermissionsCache.set('rolesAndPermissions', rolesAndPermissions)
  }
  return rolesAndPermissions
}

export async function dbGetUserRolesAndPermissions (tx, userNameOrId) {
  const roles = await dbGetUserRoles(tx, userNameOrId)
  const rolesAndPermissions = await dbGetRolesAndPermissions(tx)
  const permissions = _.chain(roles)
    .map(role => rolesAndPermissions[role.roleId]?.map(p => p.permission))
    .flatten()
    .compact()
    .uniq()
    .value()
  return { roles: roles.map(role => role.roleName), permissions }
}
