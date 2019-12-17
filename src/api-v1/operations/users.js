import { Query, transaction } from '../../db'
import { dbCreateUser, dbVerifyLogin, dbLoginAttempt, dbChangePassword, dbCreateLogin } from '../../db/users'
import { errorResponse } from '../../utils/error'

export async function registerUser (req, res) {
  const { userName, email, password } = req.body
  try {
    await transaction(async (tx) => {
      await dbCreateUser(tx, userName, email)
      const login = await dbCreateLogin(tx, userName, password)
      res.send(login)
    })
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function loginUser (req, res) {
  const { userName, password } = req.body
  try {
    const q = new Query()
    const { userId, success } = await dbVerifyLogin(q, userName, password)
    userId && dbLoginAttempt(q, userId, success)
    res.send({ userId: success ? userId : undefined, success })
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function changePassword (req, res) {
  const { userName, oldPassword, newPassword } = req.body
  try {
    const q = new Query()
    const { userId, success } = await dbVerifyLogin(q, userName, oldPassword)
    if (success) {
      await dbChangePassword(q, userId, newPassword)
    }
    res.send('OK')
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function getUser (req, res) {
  try {
    res.send('OK')
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function getUsers (req, res) {
  try {
    res.send('OK')
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function updateUser (req, res) {
  try {
    res.send('OK')
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function deleteUser (req, res) {
  try {
    res.send('OK')
  } catch (e) {
    errorResponse(res, e)
  }
}
