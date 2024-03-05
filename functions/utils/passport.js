const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const config = require('./config.js')
const {USERS} = require('../databaseFunctions/CollectionNames.js');

module.exports = function async(passport){
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = config.PRIVATE_KEY

    passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
        const userId = await basicDBfoos.getObj(jwt_payload._id, USERS);
        if(userId)
        {
            return done(null,userId)
        }
        return done(err, false)
    }))
}
