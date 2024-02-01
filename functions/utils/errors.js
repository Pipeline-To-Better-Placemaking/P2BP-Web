class GeneralError extends Error {
    constructor(message) {
        super()
        this.message = message
    }

    getStatusCode() {
        if (this instanceof BadRequestError) return 400
        if (this instanceof UnauthorizedError) return 401
        if (this instanceof ForbiddenError) return 403
        if (this instanceof NotFoundError) return 404
        if (this instanceof InternalServerError) return 500

        return 500
    }
}

class BadRequestError extends GeneralError { }
class UnauthorizedError extends GeneralError { }
class ForbiddenError extends GeneralError { }
class NotFoundError extends GeneralError { }
class InternalServerError extends GeneralError { }

module.exports = {
  GeneralError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError
}