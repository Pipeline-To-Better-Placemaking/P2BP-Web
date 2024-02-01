const log = require('../utils/log')
const { GeneralError } = require('../utils/errors')

module.exports = (error, req, res, next) => {
    log.error(error.message)

    // Manually thrown errors
    if (error instanceof GeneralError) {
        return res.status(error.getStatusCode()).json({
            success: false,
            message: error.message
        })
    }

    // Errors thrown by mongoose validation
    if (error.name === 'ValidationError') {
        const errorList = Object.keys(error.errors).map(k => {
            if (error.errors[k].kind === 'unique') {
                return `Duplicate field: ${error.errors[k].path}`
            }
            return `Missing or invalid field: ${error.errors[k].path}`
        }).join(', ')

        return res.status(400).json({
            success: false,
            message: errorList
        })
    }

    // Other errors
    return res.status(500).json({
        success: false,
        message: 'The server encountered a problem'
    })
}