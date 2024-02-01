//decodes jwt key which authorizes access to most routes

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/users.js')
const config = require('./config.js')

module.exports = function(passport){
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = config.PRIVATE_KEY
    passport.use(new JwtStrategy(opts,
        (jwt_payload, done) => {
            User.findById(jwt_payload._id, (err, user) => {
                if (err) return done(err)
                if (user) {
                    return done(null, user)
                }
                else{
                    return done(null, false)
                }
            })
        }
    ))
}