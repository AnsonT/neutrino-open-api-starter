import { dbCreateUser, dbVerifyLogin, dbLoginAttempt, dbChangePassword } from '../../db/users'
import { errorResponse } from '../../utils/error'

export async function registerUser (req, res) {
  const { userName, email } = req.body
  try {
    await dbCreateUser(userName, email)
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function loginUser (req, res) {
  const { userName, password } = req.body
  try {
    const { userId, success } = await dbVerifyLogin(userName, password)
    if (userId) {
      await dbLoginAttempt(userId, success)
    }
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function changePassword (req, res) {
  const { userName, oldPassword, newPassword } = req.body
  try {
    const { userId, success } = await dbVerifyLogin(userName, oldPassword)
    if (success) {
      await dbChangePassword(userId, newPassword)
    }
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function getUser (req, res) {
  try {
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function getUsers (req, res) {
  try {
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function updateUser (req, res) {
  try {
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function deleteUser (req, res) {
  try {
  } catch (e) {
    errorResponse(res, e)
  }
}