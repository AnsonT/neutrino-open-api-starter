import Query from '.'

export async function dbCreateUser (userName, email) {
  const q = new Query()
  await q.insert({ userName, email })
}

export async function dbCreateLogin (userNameOrId, password) {
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
