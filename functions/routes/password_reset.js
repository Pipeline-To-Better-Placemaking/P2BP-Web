const express = require('express')
const router = express.Router()
const User = require('../models/users.js')
const emailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const firestore = require('../firestore');

//sends the user an email to reset the password
router.post('/', async (req, res, next) => {

    try{
        var user = await firestore.collection('users').where('email', '==', email).get()
        .then((snapshot) => {
            var user = null;
            snapshot.forEach((doc) => {
                if (user !== null)
                {
                    // This only happens if somehow you have multiple users with the same email
                    throw new UnauthorizedError('Invalid user');
                }
                user = doc.data();
            });
            if (user === null)
            {
                throw new UnauthorizedError('Couldn\'t find user');
            }
            return user;
        })

        const token = jwt.sign({ _id: user._id, email: user.email }, config.PRIVATE_KEY, {
            expiresIn: 86400 //1 day
        })

        site = 'https://p2bp.herokuapp.com'
        const link = `${site}/password_reset/${user._id}/${token}`

        await emailer.emailResetPassword(user.email, link)

        res.status(200).json({
            success: true,
            token: token,
            user: user 
        })
    }
    catch(error){
        res.send("An error has occurred")
        console.log(error)
    }

})

//resets the password from link emailed to user
router.post('/:id/:token', async (req, res, next) => {
    
    try{

        //verifies that jwt token is still valid
        jwt.verify(req.params.token, config.PRIVATE_KEY)
        //finds user from url
        user = await User.findById(req.params.id)

        // Check password
        if (! await User.testPassword(req.body.password)) {
            throw new BadRequestError('Missing or invalid field: password')
        }
        
        newPassword = await User.createPasswordHash(req.body.password)
        //save new passord into user account
        user.password = newPassword
        user.save()

        res.status(200).json(user)
    }
    catch(error){
        res.status(401).send("Invalid token.")
        console.log(error)
    }

    
})

module.exports = router
