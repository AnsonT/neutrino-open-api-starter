import jwt from 'jsonwebtoken'
import _ from 'lodash'
import config from '../config'
import { HttpError } from './error'

export function setJwtCookie (req, res, userId, userName, rolesAndPermissions) {
  const claims = {
    userName: userName.toLowerCase(),
    ...rolesAndPermissions
  }
  const options = {
    expiresIn: config.auth.jwtExpiresIn,
    subject: userId,
    issuer: config.auth.jwtIssuer
  }
  const token = jwt.sign(claims, config.auth.jwtSecret, options)
  res.cookie(
    config.auth.jwtCookie,
    token, {
      domain: config.auth.jwtCookieDomain,
      path: '/',
      httpOnly: true,
      secure: req.secure
    })
}

export function clearJwtCookie (req, res) {
  res.cookie(
    config.auth.jwtCookie,
    '', {
      domain: config.auth.jwtCookieDomain,
      path: '/',
      httpOnly: true,
      secure: req.secure
    }
  )
}

function validateAuth (authHeader, authJwt) {
  const token = _.get(authHeader?.match(/^[Bb]earer\W+(.*)$/), 1, authJwt)
  if (token) {
    try {
      const auth = jwt.verify(token, config.auth.jwtSecret)
      return { ...auth, userId: auth?.sub }
    } catch (e) {
      console.debug(e)
    }
  }
  return {}
}

export function authMiddleware () {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    const authJwt = req.cookies[config.auth.jwtCookie]
    req.auth = validateAuth(authHeader, authJwt)
    if (!req.auth.userId && authJwt) {
      clearJwtCookie(req, res)
    }
    next()
  }
}

export function hasPermissions (req, permissions) {
  permissions = _.castArray(permissions)
  return _.intersection(req.auth?.permissions, permissions).length > 0
}

export function assertPermissions (req, permissions) {
  if (!hasPermissions(req, 'usersViewer')) {
    throw new HttpError(403, { code: 'FORBIDDEN' })
  }
}
