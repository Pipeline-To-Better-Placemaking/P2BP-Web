//decodes jwt key which authorizes access to most routes

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/users.js')
const config = require('./config.js')

module.exports = function async(passport){
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = config.PRIVATE_KEY

    passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
        //extract user by ID
         const userId = await User.getUserById(jwt_payload._id)
        if(userId)
        {
            return done(null,userId)
        }
        return done(err, false)
    }))
}