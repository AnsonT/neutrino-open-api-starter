import requestIp from 'request-ip'
import { Query, transaction } from '../../db'
import { dbCreateUser, dbVerifyLogin, dbLoginAttempt, dbCreateLogin, dbGetLastLoginAttempts } from '../../db/users'
import { dbAssignRole, dbGetUserRoles } from '../../db/roles'
import { errorResponse } from '../../utils/error'
import config from '../../config'
import { setJwtCookie } from '../../utils/auth'
import { sendMail } from '../../utils/email'

export async function registerUser (req, res) {
  const { userName, email, password } = req.body
  try {
    await transaction(async (tx) => {
      await dbCreateUser(tx, userName, email)
      const { userId } = await dbCreateLogin(tx, userName, password)
      const roleName = config.auth.defaultRole
      await dbAssignRole(tx, userId, roleName)
      res.send({ userId })
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
    const attempts = success ? await dbGetLastLoginAttempts(q, userId) : {}
    userId && dbLoginAttempt(q, userId, success, loginIp)
    let roles = success && await dbGetUserRoles(q, userId)
    roles = roles ? roles.map(role => role.roleName) : undefined
    if (success) {
      setJwtCookie(req, res, userId, userName, roles)
    }
    res.send({
      userId: success ? userId : undefined,
      success,
      ...attempts,
      roles
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
      res.status(401).send('Not authorized')
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
    const result = await sendMail({
      to: 'tsaoa@acm.org',
      subject: 'Blah Blah',
      text: 'Whatever'
    })
    res.send(result)
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
