const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Team = require('../models/teams')
const cors = require('cors');
const firestore = require('../firestore');
const express = require('express')
const bcrypt = require('bcryptjs')
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const refNames = require('../databaseFunctions/CollectionFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const passport = require('passport');
const {
        AREAS,
        ACCESS_COLS,
        ACCESS_MAPS,
        BOUNDARIES_COLS,
        BOUNDARIES_MAPS,
        LIGHT_COLS,
        LIGHT_MAPS,
        MOVING_COLS,
        MOVING_MAPS,
        NATURE_COLS,
        NATURE_MAPS,
        ORDER_COLS,
        ORDER_MAPS,
        PROGRAM_COLS,
        PROGRAM_MAPS,
        PROJECTS,
        SECTION_COLS,
        SECTION_MAPS,
        SOUND_COLS,
        SOUND_MAPS,
        STATIONARY_COLS,
        STATIONARY_MAPS,
        SURVEYS,
        SURVEY_COLS,
        TEAMS,
} = require('../databaseFunctions/CollectionNames.js');
const router = express.Router()

const { UnauthorizedError } = require('../utils/errors')

router.post('/', passport.authenticate('jwt',{session:false}), async (req,res,next) => {
    res.status(200).json({
        success: await req.user
    });
    return;
})

router.use(cors());

// Logout -

module.exports = router
