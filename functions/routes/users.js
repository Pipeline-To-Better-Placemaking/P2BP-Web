const express = require('express')
const passport = require('passport')
const Team = require('../models/teams.js')
const router = express.Router()
const emailer = require('../utils/emailer')
const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../databaseFunctions/UserFunctions.js');
const { createId } = require('../databaseFunctions/BasicFunctions.js');
const firestore = require('../firestore');

const { BadRequestError, NotFoundError } = require('../utils/errors.js')



// Create a new user
router.post('/', async (req, res, next) => {
    // Check password
    if (! await User.testPassword(req.body.password)) {
        throw new BadRequestError('Missing or invalid field: password')
    }

    const _id = createId;

    let newUser = new User({
        _id: _id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        institution: req.body.institution,
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

// Get another user's info (OldMongo)
/*router.get('/:id', async (req, res, next) => {
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
    
})*/

// Get another user's info
router.get('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userRef = firestore.collection('users').where('_id', '==', userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new NotFoundError('The requested user was not found');
        }

        const userData = userDoc.data();

        // Do additional data processing or transformations as needed
        // For example, retrieve data for invites and modify it
        for (const invite of userData.invites) {
            const owner = await getOwner(invite._id);
            invite.firstname = owner.firstname;
            invite.lastname = owner.lastname;
        }

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
})

async function getOwner(teamId) {
    // Implement logic to retrieve owner data for a team from Firestore
}

// Get my own user info, requires token authentication
// TODO: this should probably use a different path than just /
/*router.get('/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
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
})*/

// Get my own user info, requires token authentication
// TODO: this should probably use a different path than just /
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const userId = req.user._id;;
        const userRef = firestore.collection('users').where('_id', '==', userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new NotFoundError('The requested user was not found');
        }

        const userData = userDoc.data();

        // Exclude sensitive fields from the user data
        const { password, verification_code, verification_timeout, ...userWithoutSensitiveFields } = userData;

        // Populate the 'teams' field with its corresponding data
        const populatedUser = {
            ...userWithoutSensitiveFields,
            teams: [],
            invites: []
        };

        // Fetch team details for each team ID in the 'teams' array
        for (const teamIdRef of userData.teams) {
            const teamId = teamIdRef._id; // Assuming teamIdRef is in the format of {_id: '...'}
            const teamQuery = await firestore.collection('teams').doc(teamId).get();
            if (teamQuery.exists) {
                populatedUser.teams.push(teamQuery.data());
            }
        }

        // Fetch invite details for each invite ID in the 'invites' array
        for (const inviteIdRef of userData.invites) {
            const inviteId = inviteIdRef._id; // Assuming inviteIdRef is in the format of {_id: '...'}
            const inviteQuery = await firestore.collection('invites').doc(inviteId).get();
            if (inviteQuery.exists) {
                populatedUser.invites.push(inviteQuery.data());
            }
        }

        // Populate the 'invites' field with additional data (e.g., owner's firstname and lastname)
        for (let i = 0; i < populatedUser.invites.length; i++) {
            const inviteId = populatedUser.invites[i]._id;
            const owner = await getOwner(inviteId); // This function needs getOwner working
            populatedUser.invites[i].firstname = owner.firstname;
            populatedUser.invites[i].lastname = owner.lastname;
        }

        res.status(200).json(populatedUser);
    } catch (error) {
        next(error);
    }
})

// Update user info
/*router.put('/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    try {
    let newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        instituion: req.body.instituion,
        email: req.body.email
    };

    if (req.body.password) {
        // Check password
        if (! await User.testPassword(req.body.password)) {
            throw new BadRequestError('Missing or invalid field: password')
        }
        newUser.password = await User.createPasswordHash(req.body.password)
    }
    const userId = req.user._id;
    const user = await User.updateUser(userId, newUser)

    res.status(200).json(user)
    } catch (error) {
        next(error);
    }
})*/

// Update user info
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userRef = firestore.collection('users').where('_id', '==', userId);

        let newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            instituion: req.body.instituion,
            email: req.body.email
        };

        if (req.body.password) {
            // Check password
            if (!await User.testPassword(req.body.password)) {
                throw new BadRequestError('Missing or invalid field: password');
            }
            newUser.password = await User.createPasswordHash(req.body.password);
        }

        // Update the user document in Firestore
        await userRef.update(newUser);

        // Fetch the updated user data
        const userSnapshot = await userRef.get();
        const updatedUser = userSnapshot.data();

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
})

// Accept invite
/*router.post('/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {

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

})*/

// Accept invite
router.post('/invites', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userRef = firestore.collection('users').where('_id', '==', userId);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            throw new NotFoundError('User not found');
        }

        const user = userSnapshot.data();

        for (const response of req.body.responses) {
            if (response.accept === true && user.invites.includes(response.team)) {
                await Team.addUser(response.team, userId); // This function needs getOwner working
                await User.addTeam(userId, response.team); 
            }
            await User.deleteInvite(userId, response.team); 
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
})

module.exports = router