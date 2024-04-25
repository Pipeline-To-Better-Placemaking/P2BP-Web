const express = require('express')
const router = express.Router()
const emailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const firestore = require('../firestore');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const { USERS } = require('../databaseFunctions/CollectionNames.js');
var nodemailer = require('nodemailer');


//sends the user an email to reset the password
router.post('/', async (req, res, next) => {
    try{
        const { email } = req.body;

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

        site = 'https://better-placemaking.web.app'
        const link = `${site}/password_reset/${user._id}/${token}`
        console.log(link);

        //await emailer.emailResetPassword(user.email, link)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: config.PROJECT_EMAIL,
              pass: 'fqrx exla cpsf zyla'
            }
          });
          
        var mailOptions = {
            from: `"Pipeline to Better Placemaking" <${config.PROJECT_EMAIL}>`,
            to: email,
            subject: 'Email Verification',
            text: `Thank you for creating an account with Pipeline to Better Placemaking. 
                Please enter the following code in the app to verify your email address: ${link}`
        }
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });


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
        const userId = req.params.id;
        const user = await basicDBfoos.getObj(userId, USERS);
        

        // Check password
        if (!req.body.password || !userDBfoos.testPassword(req.body.password)) {
            throw new BadRequestError('Missing or invalid field: password');
        }
        
        //save new password into user account
        await basicDBfoos.updateObj(userId, { password: req.body.password }, USERS);

        res.status(200).json(user)
    }
    catch(error){
        res.status(401).send("Invalid token.")
        console.log(error)
    }

    
})

module.exports = router
