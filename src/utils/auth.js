import jwt from 'jsonwebtoken'
import config from '../config'

export function setJwtCookie (req, res, userId, userName, roles) {
  const claims = {
    userId,
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
