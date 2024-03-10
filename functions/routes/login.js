const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Team = require('../models/teams')
const cors = require('cors');
const firestore = require('../firestore');
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');

const { UnauthorizedError } = require('../utils/errors')

// Login -
// Generates and responds w/ json web token if email and password match a user
// Responds w/ 401 otherwise
router.post('/', async (req,res,next) => {
    const email = req.body.email

    const password = req.body.password

    // Email or password is missing
    if (!email || !password) {
        throw new UnauthorizedError('Invalid email or password')
    }

    let fbUser = await firestore.collection('users').where('email', '==', email).get()
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
            throw new UnauthorizedError('Invalid email or password');
        }
        return user;
    })

    // Email or password is invalid
    // if (bcrypt.compare(password, fbUser.password)) {
    if (password !== fbUser.password) {
        throw new UnauthorizedError('Invalid email or password')
    }

    const shortUser = {
        _id : fbUser._id,
        email : fbUser.email
    }
    console.log(fbUser.teams[0]);
    const token = jwt.sign(shortUser, config.PRIVATE_KEY, {
        expiresIn: 86400 //1 day
    })
    for(var i = 0; i < fbUser.teams.length; i++) {
        const team = await basicDBfoos.getObj(fbUser.teams[i], "teams");
        console.log(team);
        fbUser.teams[i] = {_id: team._id, title: team.title};
    }
//     for(var i = 0; i < fbUser.invites.length; i++) {
//         const owner = await Team.getOwner(fullUser.invites[i]._id)
//         fullUser.invites[i].firstname = owner.firstname
//         fullUser.invites[i].lastname = owner.lastname
//     }

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
