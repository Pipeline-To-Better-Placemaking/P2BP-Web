const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const firestore = require('../firestore');
const uniqueValidator = require('mongoose-unique-validator');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const {TEAMS} = require('../databaseFunctions/CollectionNames.js');
const { UnauthorizedError, NotFoundError, BadRequestError } = require('../utils/errors');


const ObjectId = mongoose.Schema.Types.ObjectId

const rand = (min = 0, max = 50) => {
    let num = Math.random() * (max - min) + min;

    return Math.floor(num);
};

//const Users = module.exports = mongoose.model('Users', user_schema)

//Old mongo
/*module.exports.findUserByEmail = async function(email) {
    const query = { email: email }
    return await Users.findOne(query)
}*/

module.exports.findUserByEmail = async function(email) {
    try {
        const querySnapshot = await firestore.collection('users').where('email', '==', email).get();

        if (querySnapshot.empty) {
            return null; // No user found with the given email
        }

        // Assuming there's only one user with the given email, return the first matching document
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error; // Rethrow error for handling in the caller function
    }
}

module.exports.testPassword = function (password) {
    if (!password ||                       // Password must be given
        password.length < 8 ||             // Length must be >= 8 characters
        /\s/g.test(password) ||            // Must not contain any whitespace characters
        !/\d/g.test(password) ||           // Must contain at least one digit
        !/[!@#$%^&*]/g.test(password) ||   // Must contain at least one symbol
        !/[A-Z]/g.test(password)) {        // Must contain at least one uppercase letter
        return false
    }
    return true
}

module.exports.createPasswordHash = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

// Old mongo
/*module.exports.addUser = async function(newUser) {
    // Replace password with hashed version
    newUser.password = await this.createPasswordHash(newUser.password)
    const savedUser = await newUser.save()
    // Generate an email verification code
    await Users.createVerification(savedUser._id)
    return Users.findById(savedUser._id)
        .select('-password -verification_code -verification_timeout')
        .populate('teams', 'title')
        .populate('invites','title')
}*/

module.exports.addUser = async function(newUser) {
    try {
        // Replace password with hashed version
        newUser.password = await this.createPasswordHash(newUser.password);

        // Add user document to Firestore collection
        const userRef = await firestore.collection('users').add(newUser);
        // Generate an email verification code
        await createVerification(userRef._id);

        const userSnapshot = await userRef.get();
        const savedUser = { _id: userSnapshot._id, ...userSnapshot.data() };

        return savedUser;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; // Rethrow error for handling in the caller function
    }
}

module.exports.comparePassword = async function(candidatePassword, hash) {
    return await bcrypt.compare(candidatePassword, hash)
}

// Verify a user's email address with the given verification code.
// Returns true if the user was successfully verified,
// Returns false if the code is incorrect or expired.
/*module.exports.verifyEmail = async function(userId, code) {

    const user = await Users.findById(userId)
    if (!user) return false

    if (code === user.verification_code && user.verification_timeout < new Date()) {
        await Users.updateOne(
            { _id: userId },
            { $set: { is_verified: true }}
        )

        return true
    }
    else {
        return false
    }
}*/

module.exports.verifyEmail = async function(userId, code) {
    try {
        const userRef = firestore.collection('users').where('_id', '==', userId).get();
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            return false; // User not found
        }

        const user = userSnapshot.data();

        if (code === user.verification_code && user.verification_timeout.toDate() > new Date()) {
            await userRef.update({
                is_verified: true
            });

            return true; // Verification successful
        } else {
            return false; // Incorrect or expired code
        }
    } catch (error) {
        console.error('Error verifying email:', error);
        return false; // Return false if an error occurs
    }
}

// Generate a verification code to verify the user's email address
// and update the active code in the user's data.
// Returns the code generated.
/*module.exports.createVerification = async function(userId) {
    const num = rand(100000, 9999999)
    const verificationString = String(num).padStart(7, '0')
    const expiryTime = new Date() + 10 + 60 * 1000

    const res = await Users.updateOne(
        { _id: userId },
        { $set: {
            verification_code: verificationString,
            verification_timeout: expiryTime
        }}
    )

    // No such user was found
    if (res.n === 0) {
        return undefined
    }

    return verificationString
}*/

module.exports.createVerification = async function(userId) {
    try {
    const num = rand(100000, 9999999)
    const verificationString = String(num).padStart(7, '0')
    const expiryTime = new Date() + 10 + 60 * 1000

    const userRef = firestore.collection('users').where('_id', '==', userId).get();

        // Update user document in Firestore with verification code and expiry time
        await userRef.update({
            verification_code: verificationString,
            verification_timeout: expiryTime
        });

        return verificationString; // Return the generated verification code
    } catch (error) {
        console.error('Error creating verification:', error);
        return undefined; // Return undefined if an error occurs
    }
}

/*module.exports.removeRefrences = async function(teamId) {

    await Users.updateMany(
        {},
        { $pull: { invites: teamId }}
    )
    return await Users.updateMany(
        {},
        { $pull: {teams: teamId }}
    )
}*/

module.exports.removeReferences = async function(teamId) {
    try {
        const usersCollection = firestore.collection('users');
        const usersSnapshot = await usersCollection.get();

        const batch = firestore.batch();

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const updatedInvites = userData.invites.filter(invite => invite !== teamId);
            const updatedTeams = userData.teams.filter(team => team !== teamId);

            batch.update(doc.ref, { invites: updatedInvites, teams: updatedTeams });
        });

        await batch.commit();

        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error removing references:', error);
        return false; // Return false if an error occurs
    }
}

module.exports.onTeam = async function(teamId, uId) {
    let foundUser = false;
    const team = await basicDBfoos.getObj(teamId, TEAMS);
    if (team.empty)
    {
        throw new NotFoundError('Invalid team');
    }
    team.users.forEach((user) => {
        if (user.user === uId )
        {
            foundUser = true;
            return false; // Break
        }
    });
    return foundUser;
}

// Owners should have admin privileges, use this when checking if something needs admin rights to do something
module.exports.isAdmin = async function(teamId, uId) {
    let foundUser = false;
    const team = await basicDBfoos.getObj(teamId, TEAMS);
    if (team.exists)
    {
        throw new NotFoundError('Invalid team');
    }
    team.users.forEach((user) => {
        if (user.user === uId)
        {
            foundUser = ((user.role === "admin") || (user.role === "owner"));
            return false; // Break
        }
    });
    return foundUser;
}
module.exports.getOwner = function(team, uId) {
    let foundUser = null;
    for (let i = 0; i < team.users.length; i++) {
        if (team.users[i].role === "owner") {
            return team.users[i].user;
        }
    }
    return foundUser;
}
