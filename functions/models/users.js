const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const ObjectId = mongoose.Schema.Types.ObjectId

const rand = (min = 0, max = 50) => {
    let num = Math.random() * (max - min) + min;

    return Math.floor(num);
};

const user_schema = mongoose.Schema({
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
})

user_schema.plugin(uniqueValidator)

const Users = module.exports = mongoose.model('Users', user_schema)

module.exports.findUserByEmail = async function(email) {
    const query = { email: email }
    return await Users.findOne(query)
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

module.exports.addUser = async function(newUser) {
    // Replace password with hashed version
    newUser.password = await this.createPasswordHash(newUser.password)
    const savedUser = await newUser.save()
    // Generate an email verification code
    await Users.createVerification(savedUser._id)
    return Users.findById(savedUser._id)
        .select('-password -verification_code -verification_timeout')
        .populate('teams', 'title')
        .populate('invites','title')
}

module.exports.updateUser = async function(userId, newUser) {
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
}

module.exports.comparePassword = async function(candidatePassword, hash) {
    return await bcrypt.compare(candidatePassword, hash)
}

// Verify a user's email address with the given verification code.
// Returns true if the user was successfully verified,
// Returns false if the code is incorrect or expired.
module.exports.verifyEmail = async function(userId, code) {
    
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
}

// Generate a verification code to verify the user's email address
// and update the active code in the user's data.
// Returns the code generated.
module.exports.createVerification = async function(userId) {
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
}

module.exports.addTeam = async function(userId, teamId) {
    return await Users.updateOne(
        { _id: userId },
        { $push: { teams: teamId }}
    )
}
module.exports.addInvite = async function(userId, teamId) {
    return await Users.updateOne(
        { _id: userId },
        { $push: { invites: teamId }}
    )
}

module.exports.deleteInvite = async function(userId,teamId) {
    
    return await Users.updateOne(
        { _id: userId },
        { $pull: { invites: teamId }}
    )
}

module.exports.removeRefrences = async function(teamId) {
    
    await Users.updateMany(
        {},
        { $pull: { invites: teamId }}
    )
    return await Users.updateMany(
        {},
        { $pull: {teams: teamId }}
    )
}

//function to get user by ID, used in passport.js
module.exports.getUserById = (id) =>
{
    return new Promise((resolve, reject)=>
    {
        Users.findById(id).then((data) =>
        {
            resolve(data);
        })
        .catch((err) =>
        {
            reject(err)
        })
    })
}
