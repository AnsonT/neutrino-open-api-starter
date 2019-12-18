import uuid from 'uuid/v4'
import bcrypt from 'bcryptjs'
import _ from 'lodash-uuid'

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
  tx = tx
    .select()
    .from('users')
  if (_.isUuid(userNameOrId)) {
    tx = tx.where({ userId: userNameOrId })
  } else {
    tx = tx.where({ userName: userNameOrId.toLowerCase() })
  }
  return tx.first()
}

export async function dbDeleteUser (tx, userNameOrId) {
}

export async function dbUpateUser (tx, userNameOrId, { userName, email, emailVerified, needNewPassword }) {
}
