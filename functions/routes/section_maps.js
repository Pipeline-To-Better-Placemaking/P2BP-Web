const express = require('express')
const router = express.Router()
const Map = require('../models/section_maps.js')
const Project = require('../models/projects.js')
const Section_Collection = require('../models/section_collections.js')
const Team = require('../models/teams.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { models } = require('mongoose')
const arrayDBfoos = require("../databaseFunctions/ArrayFunctions.js")
const basicDBfoos = require("../databaseFunctions/BasicFunctions.js")
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js")
const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {SECTION_MAPS, SECTION_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createMaps(req, SECTION_MAPS, SECTION_COLS));
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, SECTION_MAPS, SECTION_COLS));
});

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, SECTION_MAPS, SECTION_COLS));
});

// route gets a map's specific data entry
// id is the direct key for the document with data_id being the secondary key for the data entry
router.get('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(routeDBfoos.getDataEntry(req));
});

// route removes researcher from a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.clearTimeSlot(req, SECTION_MAPS));
});

//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTimeSlot(req, SECTION_MAPS));
});

// route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteMap(req, SECTION_MAPS, SECTION_MAPS));
});

// route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    console.log("Adding Test Data");
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, SECTION_MAPS);
    const authorized = map.researchers.includes(user._id);

    if (authorized) {
        if (req.body.entries) {
            for (var i = 0; i < req.body.entries.length; i++) {
                req.body.entries[i]._id = basicDBfoos.createId();
                if (!map.data) {
                    map.data = [];
                }
                map.data.push(req.body.entries[i]);
                if (req.body.entries[i].standingPoint) {
                    refDBfoos.addReference(req.body.entries[i].standingPoint, STANDING_POINTS);
                }
            }
            await basicDBfoos.updateObj(map._id, map, SECTION_MAPS);
            console.log(map);
            return map;
        }
        else {
            console.log("Here");
            if (req.body.standingPoint) {
                refDBfoos.addReference(req.body.standingPoint, STANDING_POINTS);
            }
            if (!req.body.path) {
                req.body.path = [];
            }
            await arrayDBfoos.addArrayElement(map._id, 'data', SECTION_MAPS, req.body);
            return map;
       }
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    res.status(200).json(ret);
});

// route edits any already created tested times slots. Essentially redoing a test run for a times slot 
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(201).json(await routeDBfoos.editTestedTimeSlot(req, SECTION_MAPS, SECTION_COLS));
});

// route deletes an individual times slot from a map
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.deleteTimeSlot(req, SECTION_MAPS));
    //TODO Doublecheck return type
    //original: Maps.updateOne({ _id: mapId }, { $pull: { data: {_id:entryId }}})
    /**
     * Returns document that contains
     * matchedCount, modifiedCount, upsertedId, upsertedCount, boolean acknowledged if ran with write concern
     */
});

module.exports = router
