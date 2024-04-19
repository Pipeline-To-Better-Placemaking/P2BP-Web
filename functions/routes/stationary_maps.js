const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const {STATIONARY_MAPS, STATIONARY_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.createMaps(req, STATIONARY_MAPS, STATIONARY_COLS));
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    const ret = await routeDBfoos.getMapData(req, STATIONARY_MAPS, STATIONARY_COLS);
    console.log(ret);
    res.status(200).json(ret);
});

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, STATIONARY_MAPS, STATIONARY_COLS));
});

//route reverses sign up to a time slot.
router.delete("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, STATIONARY_MAPS));
});

//route edits time slot information when updating a map
router.put("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTimeSlot(req, STATIONARY_MAPS));
});

//route deletes a map from a test collection
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, STATIONARY_MAPS, STATIONARY_COLS));
});

//route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.addTestData(req, STATIONARY_MAPS, STATIONARY_COLS));
});

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot 
router.put("/:id/data/:data_id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTestedTimeSlot(req, STATIONARY_MAPS, STATIONARY_COLS));
});

//route deletes an individual time slot from a map
router.delete("/:id/data/:data_id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, STATIONARY_MAPS));
});

module.exports = router;
