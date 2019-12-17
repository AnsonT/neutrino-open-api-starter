import cuid from 'cuid'
import bcrypt from 'bcryptjs'

export async function dbCreateUser (tx, userName, email, emailVerified = false, needNewPassword = false) {
  const userId = cuid()
  const createdAt = Date.now()
  const modifiedAt = createdAt
  await tx
    .insert({
      userId,
      userName: userName.toLowerCase(),
      email,
      emailVerified,
      needNewPassword,
      createdAt,
      modifiedAt
    })
    .into('users')
  return { userId }
}

export async function dbCreateLogin (tx, userNameOrId, password) {
  const user = await dbGetUser(tx, userNameOrId)
  const createdAt = Date.now()
  const { userId } = user
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)
  const loginId = cuid()
  await tx
    .insert({ loginId, userId, passwordHash, createdAt })
    .into('logins')
  return { loginId, userId }
}

export async function dbVerifyLogin (tx, userName, password, loginIp) {
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

export async function dbChangePassword (tx, userId, password) {
}

export async function dbLoginAttempt (tx, userId, success, loginIp) {
  const loginAt = Date.now()
  return tx
    .insert({ userId, success, loginIp, loginAt })
    .into('loginAttempts')
}

export async function dbGetUser (tx, userNameOrId) {
  return tx
    .select()
    .from('users')
    .where({ userId: userNameOrId })
    .orWhere({ userName: userNameOrId.toLowerCase() })
    .first()
}

export async function dbDeleteUser (tx, userNameOrId) {
}

export async function dbUpateUser (tx, userNameOrId, { userName, email, emailVerified, needNewPassword }) {
}
