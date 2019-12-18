import jwt from 'jsonwebtoken'
import _ from 'lodash'
import config from '../config'

export function setJwtCookie (req, res, userId, userName, roles) {
  const claims = {
    userName: userName.toLowerCase(),
    roles
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
      console.debug(auth)
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
