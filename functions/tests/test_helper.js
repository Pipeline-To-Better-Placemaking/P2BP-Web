const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

// Get a valid token for a specific user
const getToken = (user) => {
    return jwt.sign(user.toJSON(), config.PRIVATE_KEY, {
        expiresIn: 86400 //1 day
    })
}

const decodeToken = (token) => {
    return jwt.decode(token, config.PRIVATE_KEY)
}

const getUsers = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const getUnusedUserId = async () => {
    const user = new User({
        email: 'temp@gmail.com',
        password: '123!@#ABC'
    })
    await user.save()
    await user.remove()

    return user._id.toString()
}

module.exports = {
    getToken,
    decodeToken,
    getUsers,
    getUnusedUserId
}