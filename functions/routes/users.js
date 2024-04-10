const express = require('express')
const passport = require('passport')
const Team = require('../models/teams.js')
const router = express.Router()
const User = require('../models/users.js')
const emailer = require('../utils/emailer')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const { USERS, TEAMS } = require('../databaseFunctions/CollectionNames.js');


const { BadRequestError, NotFoundError } = require('../utils/errors.js')



// Create a new user
router.post('/', async (req, res, next) => {
    // Check password
    if (!userDBfoos.testPassword(req.body.password)) {
        throw new BadRequestError('Missing or invalid field: password')
    }
    const email = req.body.email.toLowerCase();
    if (await userDBfoos.findUserByEmail(email)) {
        throw new BadRequestError('Email already registered')
    }

    const newUser = {
        _id: basicDBfoos.createId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: email,
        password: req.body.password,
        invites: [],
        teams: [],
        is_verified: false,
    }

    await basicDBfoos.addObj(newUser, USERS);

    //if (!await emailer.sendVerificationCode(user.email, null)) {
    //    console.error(`Could not send email to ${user.email}`)
    //}

    // Automatically log the user in
    const token = jwt.sign({ _id: newUser._id, email: email }, config.PRIVATE_KEY, {
        expiresIn: 86400 //1 day
    })

    res.status(201).json({
        success: true,
        token: token,
        user: newUser
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
    let user = await basicDBfoos.getObj(req.user._id, USERS);
    for (let i = 0; i < user.teams.length; i++) {
        const teamId = user.teams[i];
        const team = await basicDBfoos.getObj(teamId, TEAMS);
        user.teams[i] = {_id: teamId, title: team.title};
    }

    for (let i = 0; i < user.invites.length; i++) {
        const inviteId = user.invites[i];
        const invite = await basicDBfoos.getObj(inviteId, TEAMS);
        const ownerId = userDBfoos.getOwner(invite);
        const owner = await basicDBfoos.getObj(ownerId, USERS)

        user.invites[i] =   {
                                _id: inviteId,
                                title: invite.title,
                                firstname: owner.firstname,
                                lastname: owner.lastname,
                            };
    }
    res.status(200).json(user);
})

// Update user info
router.put('/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const user = await basicDBfoos.getObj(userId, USERS);

    const newUser = {
        _id: userId,
        firstname: req.body.firstname ? req.body.firstname : user.firstname,
        lastname: req.body.lastname ? req.body.lastname : user.lastname,
        email: req.body.email ? req.body.email : user.email,
    }

    console.log(newUser);
    if (req.body.password) {
        // Check password
        if (!userDBfoos.testPassword(req.body.password)) {
            throw new BadRequestError('Missing or invalid field: password')
        }
        // newUser.password = await userDBfoos.createPasswordHash(req.body.password);
    }

    await basicDBfoos.updateObj(userId, newUser, USERS);
    console.log(user);

    res.status(200).json(newUser);
})


// Accept invite
router.post('/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user
    for(i = 0; i < req.body.responses.length; i++) {
        const response = req.body.responses[i]

        if (response.accept && user.invites.includes(response.team)) {
            await arrayDBfoos.addArrayElement(user._id, TEAMS, USERS, response.team);
            await arrayDBfoos.addArrayElement(response.team, USERS, TEAMS, {role: "user", user: user._id});
        }
        await arrayDBfoos.removeArrayElement(user._id, response.team, "invites", USERS);
    }
    res.status(200).json(user);
})

module.exports = router
