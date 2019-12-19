import _ from 'lodash'
import uuid from 'uuid/v4'
import bcrypt from 'bcryptjs'
import isUUID from 'is-uuid'

export async function dbCreateUser (tx, userName, email, emailVerifiedAt = null, needNewPassword = false) {
  const userId = uuid()
  const createdAt = new Date()
  const modifiedAt = createdAt
  await tx
    .insert({
      userId,
      userName: userName.toLowerCase(),
      email,
      emailVerifiedAt,
      needNewPassword,
      createdAt,
      modifiedAt
    })
    .into('users')
  return { userId }
}

export async function dbCreateLogin (tx, userNameOrId, password) {
  const user = await dbGetUser(tx, userNameOrId)
  const createdAt = new Date()
  const { userId } = user
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)
  const loginId = uuid()
  await tx
    .insert({ loginId, userId, passwordHash, createdAt })
    .into('logins')
  return { loginId, userId }
}

export async function dbVerifyLogin (tx, userName, password, loginIp) {
  // TODO: Check for blacklisted loginIP
  const user = await dbGetUser(tx, userName)
  if (user) {
    const { userId } = user
    const login = await tx.select().from('logins')
      .where({ userId })
      .orderBy('createdAt', 'desc')
      .first()
    const { passwordHash } = login
    const success = bcrypt.compareSync(password, passwordHash)
    return { userId, success }
  }
  return { success: false }
}

export async function dbGetLastLoginAttempts (tx, userId) {
  const lastSuccess = await tx
    .select()
    .from('loginAttempts')
    .where({ userId, success: true })
    .orderBy('loginAt', 'desc')
    .first()
  const lastFailure = await tx
    .select()
    .from('loginAttempts')
    .where({ userId, success: false })
    .orderBy('loginAt', 'desc')
    .first()
  return {
    lastSuccess: {
      loginAt: lastSuccess && new Date(lastSuccess.loginAt),
      loginIp: lastSuccess?.loginIp || (lastSuccess ? '' : undefined)
    },
    lastFailure: {
      loginAt: lastFailure && new Date(lastFailure.loginAt),
      loginIp: lastFailure?.loginIp || (lastFailure ? '' : undefined)
    }
  }
}

export async function dbLoginAttempt (tx, userId, success, loginIp) {
  const loginAt = new Date()
  return tx
    .insert({ userId, success, loginIp, loginAt })
    .into('loginAttempts')
}

export async function dbGetUser (tx, userNameOrId) {
  const where = isUUID.anyNonNil(userNameOrId)
    ? { userId: userNameOrId }
    : { userName: userNameOrId.toLowerCase() }
  return tx
    .select()
    .from('users')
    .where(where)
    .first()
}

export async function dbGetUsers (tx, offset = 0, limit = 20) {
  const totalCount = await tx
    .select()
    .from('users')
    .count()
  const users = await tx
    .select()
    .from('users')
    .offset(offset)
    .limit(limit)
  return {
    offset,
    limit,
    total: parseInt(_.get(totalCount, [0, 'count'], 0)),
    users
  }
}

export async function dbDeleteUser (tx, userNameOrId) {
}

export async function dbUpateUser (tx, userNameOrId, { userName, email, emailVerified, needNewPassword }) {
}
