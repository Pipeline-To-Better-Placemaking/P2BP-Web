const express = require('express')
const passport = require('passport')
const Team = require('../models/teams.js')
const router = express.Router()
const User = require('../models/users.js')
const emailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


const { BadRequestError, NotFoundError } = require('../utils/errors.js')



// Create a new user
router.post('/', async (req, res, next) => {
    // Check password
    if (! await User.testPassword(req.body.password)) {
        throw new BadRequestError('Missing or invalid field: password')
    }

    let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        instituion: req.body.instituion,
        email: req.body.email,
        password: req.body.password,
        is_verified: false, // Default value for is_verified
        verification_code: '', // Default value for verification_code
        verification_timeout: null, // Default value for verification_timeout
        invites: [],
        teams: []
    })

    const user = await User.addUser(newUser)

    if (!await emailer.sendVerificationCode(user.email, null)) {
        console.error(`Could not send email to ${user.email}`)
    }

    // Automatically log the user in
    const token = jwt.sign({ _id: user._id, email: user.email }, config.PRIVATE_KEY, {
        expiresIn: 86400 //1 day
    })

    res.status(201).json({
        success: true,
        token: token,
        user: user
    })
})

// Get another user's info
router.get('/:id', async (req, res, next) => {
    // Make a query for the user, excluding fields that contain private info
    try{
        var user = await User.findById(req.params.id)
            // .select('-password -is_verified -verification_code -verification_timeout -invites')
            // .populate('invites','title')
            // .populate('teams', 'title')
        
        user = user.toJSON()

        if (!user) throw new NotFoundError('The requested user was not found')
        
        for(var i = 0; i < user.invites.length; i++){
            const owner = await Team.getOwner(user.invites[i]._id)
            user.invites[i].firstname = owner.firstname
            user.invites[i].lastname = owner.lastname
        }
        
        res.status(200).json(user)
    }catch(error){
        next(error)
    }
    
})

// Get my own user info, requires token authentication
// TODO: this should probably use a different path than just /
router.get('/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    // Make a query for the user, excluding fields that the user should not see
    var user = await User.findById(req.user._id)
        .select('-password -verification_code -verification_timeout')
        .populate('teams', 'title')
        .populate('invites','title')

    user = user.toJSON()
    
    for(var i = 0; i < user.invites.length; i++){
        const owner = await Team.getOwner(user.invites[i]._id)
        user.invites[i].firstname = owner.firstname
        user.invites[i].lastname = owner.lastname
    }

    res.status(200).json(user)
})

// Update user info
router.put('/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {

    let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        instituion: req.body.instituion,
        email: req.body.email
    })

    if (req.body.password) {
        // Check password
        if (! await User.testPassword(req.body.password)) {
            throw new BadRequestError('Missing or invalid field: password')
        }
        newUser.password = await User.createPasswordHash(req.body.password)
    }

    const user = await User.updateUser(req.user._id, newUser)

    res.status(200).json(user)
})


// Accept invite
router.post('/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {

    let user = await req.user

    for( i = 0; i < req.body.responses.length; i++){

        var response = req.body.responses[i]

        if (response.accept == true && user.invites.includes(response.team)){
            await Team.addUser(response.team,user._id)
            await User.addTeam(user._id, response.team)
        }
        await User.deleteInvite(user._id,response.team)
    }

    res.status(200).json(user)

})

module.exports = router