import cuid from 'cuid'
import bcrypt from 'bcryptjs'

export async function dbCreateUser (tx, userName, email, emailVerified = false, needNewPassword = false) {
  const userId = cuid()
  const createdAt = Date.now()
  const modifiedAt = createdAt
  await tx
    .insert({ userId, userName, email, emailVerified, needNewPassword, createdAt, modifiedAt })
    .into('users')
  return { userId }
}

export async function dbCreateLogin (tx, userNameOrId, password) {
  const user = await tx
    .select()
    .from('users')
    .where({ userId: userNameOrId })
    .orWhere({ userName: userNameOrId })
    .first()
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

export async function dbVerifyLogin (userName, password) {
}

export async function dbChangePassword (userId, password) {
}

export async function dbLoginAttempt (userId, success, loginIp) {
}

export async function dbGetUser (userNameOrId) {
}

export async function dbDeleteUser (userNameOrId) {
}

export async function dbUpateUser (userNameOrId, { userName, email, emailVerified, needNewPassword }) {
}
