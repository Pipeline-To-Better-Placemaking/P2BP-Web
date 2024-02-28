const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const ObjectId = mongoose.Schema.Types.ObjectId

const rand = (min = 0, max = 50) => {
    let num = Math.random() * (max - min) + min;

    return Math.floor(num);
};

// Old mongo
/*const user_schema = mongoose.Schema({
    firstname: {
        type: String,
        match: /[A-Za-z]/
    },
    lastname: {
        type: String,
        match: /[A-Za-z]/
    },
    institution: {
        type: String,
        match: /[A-Za-z ]/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    verification_code: String,
    verification_timeout: Date,
    invites: [{
        type: ObjectId,
        ref: 'Teams'
    }],
    teams: [{
        type: ObjectId,
        ref: 'Teams'
    }]
})*/

const user_schema = {
    firstname: {
        type: 'string'
    },
    lastname: {
        type: 'string'
    },
    institution: {
        type: 'string'
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    },
    is_verified: {
        type: 'boolean',
        default: false
    },
    verification_code: {
        type: 'string'
    },
    verification_timeout: {
        type: 'timestamp'
    },
    invites: {
        type: 'array',
        ref: 'Teams'
    },
    teams: {
        type: 'array',
        ref: 'Teams'
    }
}

user_schema.plugin(uniqueValidator)

//const Users = module.exports = mongoose.model('Users', user_schema)

//Old mongo
/*module.exports.findUserByEmail = async function(email) {
    const query = { email: email }
    return await Users.findOne(query)
}*/

module.exports.findUserByEmail = async function(email) {
    try {
        const usersRef = firestore.collection('users');
        const querySnapshot = await usersRef.where('email', '==', email).get();

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

module.exports.testPassword = async function (password) {
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

// Old mongo 
/*module.exports.updateUser = async function(userId, newUser) {
    const updatedValues = {}
    if (newUser.firstname) updatedValues.firstname = newUser.firstname
    if (newUser.lastname) updatedValues.lastname = newUser.lastname
    if (newUser.institution) updatedValues.institution = newUser.institution
    if (newUser.password) updatedValues.password = newUser.password
    if (newUser.email){
        updatedValues.email = newUser.email
        updatedValues.is_verified = false
    }

    return await Users.findOneAndUpdate(
        { _id: userId },
        { $set: updatedValues},
        { new: true }
    )
    .select('-password -verification_code -verification_timeout')
}*/

module.exports.updateUser = async function(userId, newUser) {
    try {
        const userRef = await firestore.collection('users').where('_id', '==', userId).get();

        const updatedValues = {}
        if (newUser.firstname) updatedValues.firstname = newUser.firstname
        if (newUser.lastname) updatedValues.lastname = newUser.lastname
        if (newUser.institution) updatedValues.institution = newUser.institution
        if (newUser.password) updatedValues.password = newUser.password
        if (newUser.email){
            updatedValues.email = newUser.email
            updatedValues.is_verified = false
        }

        // Update user document in Firestore
        await userRef.update(updatedValues);

        // Retrieve the updated user document
        const updatedUserSnapshot = await userRef.get();
        const updatedUser = { id: updatedUserSnapshot.id, ...updatedUserSnapshot.data() };

        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
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

/*module.exports.addTeam = async function(userId, teamId) {
    return await Users.updateOne(
        { _id: userId },
        { $push: { teams: teamId }}
    )
}*/

module.exports.addTeam = async function(userId, teamId) {
    try {
        const userRef = firestore.collection('users').where('_id', '==', userId).get();

        // Fetch the current user document
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();

        // Update the 'teams' array by adding the new teamId
        const updatedTeams = [...userData.teams, teamId];

        // Update the user document in Firestore with the updated 'teams' array
        await userRef.update({ teams: updatedTeams });

        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error adding team:', error);
        return false; // Return false if an error occurs
    }
}

/*module.exports.addInvite = async function(userId, teamId) {
    return await Users.updateOne(
        { _id: userId },
        { $push: { invites: teamId }}
    )
}*/

module.exports.addInvite = async function(userId, teamId) {
    try {
        const userRef = firestore.collection('users').where('_id', '==', userId).get();

        // Fetch the current user document
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();

        // Update the 'invites' array by adding the new teamId
        const updatedInvites = [...userData.invites, teamId];

        // Update the user document in Firestore with the updated 'invites' array
        await userRef.update({ invites: updatedInvites });

        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error adding invite:', error);
        return false; // Return false if an error occurs
    }
}

/*module.exports.deleteInvite = async function(userId,teamId) {
    
    return await Users.updateOne(
        { _id: userId },
        { $pull: { invites: teamId }}
    )
}*/

module.exports.deleteInvite = async function(userId, teamId) {
    try {
        const userRef = firestore.collection('users').where('_id', '==', userId).get();

        // Fetch the current user document
        const userSnapshot = await userRef.get();
        const userData = userSnapshot.data();

        // Filter out the teamId from the 'invites' array
        const updatedInvites = userData.invites.filter(invite => invite !== teamId);

        // Update the user document in Firestore with the updated 'invites' array
        await userRef.update({ invites: updatedInvites });

        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error deleting invite:', error);
        return false; // Return false if an error occurs
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


