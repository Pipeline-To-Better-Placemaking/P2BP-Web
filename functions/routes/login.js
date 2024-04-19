const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const cors = require('cors');
const firestore = require('../firestore');
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');

const { UnauthorizedError } = require('../utils/errors')


// Login -
// Generates and responds w/ json web token if email and password match a user
// Responds w/ 401 otherwise
router.post('/', async (req,res,next) => {

    const email = req.body.email.toLowerCase()


    const password = req.body.password

    // Email or password is missing
    if (!email || !password) {
        throw new UnauthorizedError('Invalid email or password')
    }

    let fbUser = await firestore.collection('users').get()
    .then((snapshot) => {
        let user = null;
        snapshot.forEach((doc) => {
            const userData = doc.data();
            const userEmail = userData.email.toLowerCase(); // Convert email from database to lowercase
            if (userEmail === email) {
                if (user !== null) {
                    // This only happens if somehow you have multiple users with the same email
                    throw new UnauthorizedError('Invalid user');
                }
                user = userData;
            }
        });
        if (user === null)
        {
            throw new UnauthorizedError('Invalid email or password');
        }
        return user;
    })

    // Email or password is invalid
    if (userDBfoos.comparePassword(password, fbUser.password)) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const shortUser = {
        _id : fbUser._id,
        email : fbUser.email
    }
    const token = jwt.sign(shortUser, config.PRIVATE_KEY, {
        expiresIn: 86400 //1 day
    })
    for(var i = 0; i < fbUser.teams.length; i++) {
        const team = await basicDBfoos.getObj(fbUser.teams[i], "teams");
        fbUser.teams[i] = {_id: team._id, title: team.title};
    }

    res.status(200).json({
        success: true,
        token: token,
        map_key: config.GOOGLE_MAP_KEY,
        user: fbUser
    });
})

router.use(cors());

// Logout -

module.exports = router
