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
    super(403, { code: 'NOTAUTHORIZED', message: 'Not Authorized' })
  }
}

export class HttpUnauthenticated extends HttpError {
  constructor () {
    super(401, { code: 'NOTAUTHENTICATED', message: 'Not Auhtenticated' })
  }
}

export function errorResponse (res, error) {
  console.error(error)
  if (error instanceof HttpError) {
    return res.status(error.status).send({
      code: error.code,
      status: error.status,
      error: error.status,
      message: error.message
    })
  }
  res.status(400).send(error)
}
