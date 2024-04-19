const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");

const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {SURVEYS, SURVEY_COLS, PROJECTS} = require('../databaseFunctions/CollectionNames.js');

//route creates new survey(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createSurvey(req));
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    const ret = await routeDBfoos.getMapData(req, SURVEYS, SURVEY_COLS);
    console.log(ret);
    res.status(200).json(ret);
});

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, SURVEYS, SURVEY_COLS));
});

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, SURVEYS));
});

//route edits time slot information when updating a survey
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.editTimeSlot(req, SURVEYS, SURVEY_COLS));
});

//route deletes a survey from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, SURVEYS, SURVEY_COLS));
});

//route adds survey to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.addTestData(req, SURVEYS));
});

//route deletes an individual time slot from a survey
router.delete('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, SURVEYS));
});


module.exports = router
