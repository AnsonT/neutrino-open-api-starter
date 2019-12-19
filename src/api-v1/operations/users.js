import requestIp from 'request-ip'
import { Query, transaction } from '../../db'
import { dbCreateUser, dbVerifyLogin, dbLoginAttempt, dbCreateLogin, dbGetLastLoginAttempts, dbGetUsers } from '../../db/users'
import { dbAssignRole, dbGetUserRolesAndPermissions } from '../../db/roles'
import { errorResponse, HttpNotFound, HttpUnauthorized } from '../../utils/error'
import config from '../../config'
import { setJwtCookie, clearJwtCookie, assertPermissions } from '../../utils/auth'
import { dbRequestEmailVerification, dbVerifyEmail } from '../../db/email'

export async function registerUser (req, res) {
  const { userName, email, password } = req.body
  try {
    await transaction(async (tx) => {
      await dbCreateUser(tx, userName, email)
      const { userId } = await dbCreateLogin(tx, userName, password)
      const roleName = config.auth.defaultRole
      await dbAssignRole(tx, userId, roleName)
      const { verificationId } = await dbRequestEmailVerification(tx, userId, email)
      res.send({ userId, verificationId })
    })
  } catch (e) {
    // TODO: Better error message, interpreted from DB errors
    errorResponse(res, e)
  }
}

export async function loginUser (req, res) {
  const { userName, password } = req.body
  try {
    const q = new Query()
    const loginIp = requestIp.getClientIp(req)
    const { userId, success } = await dbVerifyLogin(q, userName, password, loginIp)
    let attempts = {}
    let rolesAndPermissions
    if (userId) {
      dbLoginAttempt(q, userId, success, loginIp)
    }
    if (success && userId) {
      attempts = await dbGetLastLoginAttempts(q, userId)
      rolesAndPermissions = await dbGetUserRolesAndPermissions(q, userId)
      // roles = roles?.map(role => role.roleName) || undefined
      setJwtCookie(req, res, userId, userName, rolesAndPermissions)
    } else {
      clearJwtCookie(req, res)
      throw new HttpUnauthorized('Invalid Username or Password')
    }
    res.send({
      userId: success ? userId : undefined,
      success,
      ...attempts,
      ...rolesAndPermissions
    })
  } catch (e) {
    errorResponse(res, e)
  }
}

export async function changePassword (req, res) {
  const { userName, oldPassword, newPassword } = req.body
  try {
    const q = new Query()
    const loginIp = requestIp.getClientIp(req)
    const { userId, success } = await dbVerifyLogin(q, userName, oldPassword, loginIp)
    if (success) {
      await dbCreateLogin(q, userName, newPassword)
      res.send({ success: true })
    } else {
      userId && dbLoginAttempt(q, userId, false, loginIp)
      throw new HttpUnauthorized('Cannot change password, invalid Username or Password')
    }
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
    assertPermissions(req, 'usersViewer')
    const q = new Query()
    const { offset = 0, limit = 20 } = req.query
    const users = await dbGetUsers(q, parseInt(offset), parseInt(limit))
    res.send(users)
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

export async function verifyEmail (req, res) {
  try {
    const { verificationId } = req.params
    const q = new Query()
    const { success } = await dbVerifyEmail(q, verificationId)
    if (!success) {
      throw new HttpNotFound('Verification link not valid')
    }
    return res.send({ success })
  } catch (e) {
    errorResponse(res, e)
  }
}
