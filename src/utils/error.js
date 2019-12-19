export class HttpError extends Error {
  constructor (status, { message, code }) {
    super(message)
    this.status = status
    this.code = code
    this.message = message
  }
}

function mergeError (base, error) {
  if (typeof error === 'string') {
    return { ...base, message: error }
  }
  return { ...base, ...error }
}

export class HttpNotFound extends HttpError {
  constructor (error) {
    super(404, mergeError({ code: 'NOTFOUND', message: 'Not Found' }, error))
  }
}

export class HttpUnauthorized extends HttpError {
  constructor (error) {
    super(403, mergeError({ code: 'FORBIDDEN', message: 'Forbidden' }, error))
  }
}

export class HttpUnauthenticated extends HttpError {
  constructor (error) {
    super(401, mergeError({ code: 'NOT_AUTHENTICATED', message: 'Not Authenticated' }, error))
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
