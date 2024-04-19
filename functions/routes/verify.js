const config = require('../utils/config')
const passport = require('passport')
const User = require('../models/users.js')
const emailer = require('../utils/emailer')

const express = require('express')
const router = express.Router()

const { BadRequestError, ForbiddenError, InternalServerError } = require('../utils/errors')

// Verify the email address with the given verification code
router.post('/', async (req, res, next) => {
    // Parameters are missing
    if (!req.query.email || !req.query.code) {
        throw new BadRequestError('Missing required parameters: email or code')
    }
    //TODO update from models folder
    const user = await User.findUserByEmail(req.query.email)
    // Email is not associated with an existing user
    if (!user) {
        throw new BadRequestError('Specified email is unused or invalid')
    }

    //TODO update from models folder
    if (await User.verifyEmail(user._id, req.query.code)){
        return res.status(200).json({
            msg:"Success"
        })
    }
    else {
        throw new ForbiddenError('Verification code is incorrect or expired')
    }
})

// Generate a new email verification code and send an email to the user containing the new code
router.post('/newcode',passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    //TODO update from models folder
    const code = await User.createVerification(req.user._id)
    // Code generation failed
    if (!code) {
        throw new InternalServerError('The server encountered a problem')
    }
    
    // Don't send emails when the test suites are running
    if (process.env.NODE_ENV === 'test') {
        return res.status(200).json({
            success: true,
            message: 'Verification code reset; sending emails is disabled in testing mode'
        })
    }

    if (!await emailer.sendVerificationCode(req.user.email, code)) {
        throw new InternalServerError('The server encountered a problem')
    }

    res.status(200).json({
        success: true,
        message: 'Verification code reset; please check your email'
    })
})

module.exports = router