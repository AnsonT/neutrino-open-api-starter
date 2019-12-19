export class HttpError extends Error {
  constructor (status, { message, code }) {
    super(message)
    this.status = status
    this.code = code
    this.message = message
  }
}

export class HttpNotFound extends HttpError {
  constructor () {
    super(404, { code: 'NOTFOUND', message: 'Not Found' })
  }
}

export class HttpUnauthorized extends HttpError {
  constructor () {
    super(403, { code: 'FORBIDDEN', message: 'Forbidden' })
  }
}

export class HttpUnauthenticated extends HttpError {
  constructor () {
    super(401, { code: 'NOT_AUTHENTICATED', message: 'Not Authenticated' })
  }
}

export function errorResponse (res, error) {
  console.error(error)
  if (error instanceof HttpError ||
    error.message || error.code) {
    return res.status(error.status || 422).send({
      errno: error.errno,
      code: error.code,
      status: error.status,
      error: error.error,
      message: error.message
    })
  }
  res.status(422).send(error)
}
