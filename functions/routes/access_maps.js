const express = require('express')
const router = express.Router()
const Map = require('../models/access_maps.js')
const Project = require('../models/projects.js')
const Access_Collection = require('../models/access_collections.js')
const Team = require('../models/teams.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const { models } = require('mongoose')
const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {ACCESS_MAPS, ACCESS_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.createMaps(req, ACCESS_MAPS, ACCESS_COLS));
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, ACCESS_MAPS, ACCESS_COLS));
});

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, ACCESS_MAPS, ACCESS_COLS));
});

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, ACCESS_MAPS));
});

//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTimeSlot(req, ACCESS_MAPS, ACCESS_COLS));
});

//route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, ACCESS_MAPS, ACCESS_COLS));
});

//route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.addTestData(req, ACCESS_MAPS, ACCESS_COLS));
});

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTestedTimeSlot(req, ACCESS_MAPS, ACCESS_COLS));
    //TODO double check collection type
    //original: res.status(201).json(await Map.findById(req.params.id))
});

//route deletes an individual time slot from a map
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, ACCESS_MAPS));
    //TODO Doublecheck return type
    //original: boolean on whether operation successful
});

module.exports = router
