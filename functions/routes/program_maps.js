const express = require('express')
const router = express.Router()
const Map = require('../models/program_maps.js')
const Project = require('../models/projects.js')
const Program_Collection = require('../models/program_collections.js')
const Team = require('../models/teams.js')
const Floor = require('../models/program_floors.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { models } = require('mongoose')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {PROGRAM_MAPS, PROGRAM_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createMaps(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, ACCESS_MAPS));
});

//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTimeSlot(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.addTestData(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route edits the data object for any already created tested time slots.  Essentially redoing a test run for a time slot 
router.put('/:id/data/:data_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTestedTimeSlot(req, PROGRAM_MAPS, PROGRAM_COLS));
});

//route deletes an individual time slot from a map (data object) 
router.delete('/:id/data/:data_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, PROGRAM_MAPS));
    //TODO Doublecheck return type
    //original: Maps.updateOne({ _id: mapId }, { $pull: { data: {_id:entryId }}})
    /**
     * Returns document that contains
     * matchedCount, modifiedCount, upsertedId, upsertedCount, boolean acknowledged if ran with write concern
     */
});


module.exports = router
