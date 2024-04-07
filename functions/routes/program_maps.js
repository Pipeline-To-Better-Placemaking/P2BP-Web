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
const basicDBfoos = require("../databaseFunctions/BasicFunctions.js");
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const { PROGRAM_COLS, PROGRAM_FLOORS, PROGRAM_MAPS,} = require('../databaseFunctions/CollectionNames.js');
const { USERS } = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    console.log(req.body.data);
    req.body.data._id = basicDBfoos.createId();
    let ret = await routeDBfoos.createMaps(req, PROGRAM_MAPS, PROGRAM_COLS);
    console.log(req.body.data);
    res.status(200).json(ret);
});

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    let map = await basicDBfoos.getObj(req.params.id, PROGRAM_MAPS);
    for (let i = 0; i < map.researchers.length; i++) {
        const id = map.researchers[i];
        console.log(id);
        const researcher = await basicDBfoos.getObj(map.researchers[i], USERS);
        map.researchers[i] = {firstname: researcher.firstname, lastname: researcher.lastname, _id: map.researchers[i]};
    }
    console.log(map);
    map.data[0].floorData = new Array(map.data[0].floors.length);
    for (let i = 0; i < map.data[0].floorData.length; i++) {
        const data = await basicDBfoos.getObj(map.data[0].floors[i], PROGRAM_FLOORS);
        map.data[0].floorData[i] = data;

    }
    res.status(200).json(map);
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
    const ret = await routeDBfoos.getMapData(req, PROGRAM_MAPS, PROGRAM_COLS);
    console.log(ret);
    const mapId = req.params.id;
    const newData = {
            _id: req.params.data_id,
            numFloors: (req.body.numFloors ? req.body.numFloors : ret.data[0].numFloors),
            perimeterPoints: (req.body.perimeterPoints ? req.body.perimeterPoints : ret.data[0].perimeterPoints),
            time: (req.body.time ? req.body.time : ret.data[0].time),
            floors: (req.body.floors ? req.body.floors : ret.data[0].floors),
            sqFootage: (req.body.sqFootage ? req.body.sqFootage : ret.data[0].sqFootage)
    };
    ret.data = [newData];
    ret.standingPoints = [];
    basicDBfoos.updateObj(mapId, ret, PROGRAM_MAPS);
    console.log(ret);
    res.status(201).json(ret);
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
