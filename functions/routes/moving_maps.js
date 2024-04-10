const express = require('express')
const router = express.Router()
const Map = require('../models/moving_maps.js')
const Project = require('../models/projects.js')
const Moving_Collection = require('../models/moving_collections.js')
const Team = require('../models/teams.js')
const Points = require('../models/standing_points.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { models } = require('mongoose')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const { MOVING_MAPS, MOVING_COLS } = require('../databaseFunctions/CollectionNames.js')

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.createMaps(req, MOVING_MAPS, MOVING_COLS));
});

//route gets all map data, including any collection data.
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, MOVING_MAPS, MOVING_COLS));
});

//route signs team member up to a time slot.
router.put('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, MOVING_MAPS));
});

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, MOVING_MAPS));
});

// Untested
//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTimeSlot(req, MOVING_MAPS, MOVING_COLS));
});

// Untested
//route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, MOVING_MAPS, MOVING_COLS));
});

//route adds test data to its relevant time slot
router.post('/:id/data', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.addTestData(req, MOVING_MAPS, MOVING_COLS));
});

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot 
// Incomplete
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTestedTimeSlot(req, MOVING_MAPS, MOVING_COLS));
});

// Untested
//route deletes an individual time slot from a map
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, MOVING_MAPS));
});

module.exports = router
