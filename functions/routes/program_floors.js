const express = require('express')
const router = express.Router()
const Floor = require('../models/program_floors.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js')
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js')
const { PROGRAM_FLOORS, PROGRAM_MAPS } = require('../databaseFunctions/CollectionNames.js')

const { UnauthorizedError, BadRequestError } = require('../utils/errors.js')

//route creates new floor(s).  If there are multiple floors in building, multiple floors are created.
router.post('', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const dataId = await req.dataId;
    let programs = new Array(1);
    const data = programs.push();
    const mapId = req.body.mapId;
    const floorId = basicDBfoos.createId();

    const newFloor = {
        _id: floorId,
        map: mapId,
        floorNum: req.body.floorNum,
        programCount: req.body.programCount,
        programs: [],
    }
    console.log(newFloor);

    //create new map with method from _map models and add ref to its parent collection.
    const floor = await basicDBfoos.addObj(newFloor, PROGRAM_FLOORS);
    let map = await basicDBfoos.getObj(mapId, PROGRAM_MAPS);
    if (!map.data[0].floors) {
        map.data[0].floors = [];
    }
    map.data[0].floors.push(floorId);

    res.status(201).json(newFloor);
})


//route gets a floor
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const id = req.params.id;
    const floor = await basicDBfoos.getObj(id, PROGRAM_FLOORS);
    res.status(200).json(floor)
})


//route deletes a floor from a map
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const id = req.params.id;
    // const floor = await basicDBfoos.getObj(req.params.id)
    const map = await basicDBfoos.getObj(floor.map)

    await arrayDBfoos.removeArrayElement(map._id, map, "data", PROGRAM_MAPS);
    await basicDBfoos.deleteObj(id ,PROGRAM_FLOORS);
    res.json({})
})


//route edits a floor
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const id = req.params.id;
    const floor = await basicDBfoos.getObj(id, PROGRAM_FLOORS);

    let newFloor = {
        _id: id,
        map: (req.body.map ? req.body.map : floor.map),
        floorNum: (req.body.floorNum ? req.body.floorNum : floor.floorNum),
        programCount: (req.body.programCount ? req.body.programCount : floor.programCount),
        programs: (req.body.programs ? req.body.programs : floor.programs)
    }

    await basicDBfoos.updateObj(id, newFloor, PROGRAM_FLOORS);
    res.status(201).json(newFloor)
})

// Unfinished
//route adds test a program to its floor
router.post('/:id/programs', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const user = await req.user;
    const floor = await basicDBfoos.getObj(id, PROGRAM_FLOORS);
    const authorized = floor.researchers.includes(user._id);
    if (!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    console.log(req.body.programs);
    if (req.body.programs) {
        for (var i = 0; i < req.body.programs.length; i++) {
            await arrayDBfoos.addArrayElement(floor._id, "programs", PROGRAM_FLOORS, req.body.programs[i]);
        }
        res.status(201).json(await basicDBfoos.getObj(id, PROGRAM_FLOORS));
    }
    else {
        await arrayDBfoos.addArrayElement(floor._id, "programs", PROGRAM_FLOORS, req.body);
        res.json(await basicDBfoos.getObj(id, PROGRAM_FLOORS));
    }
})

//route edits the program object for any already created floors
router.put('/:id/programs/:program_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const user = await req.user;
    const floorId = req.params.id;
    const authorized = floor.researchers.includes(user._id);
    if (!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    const oldData = await basicDBfoos.getObj(req.params.program_id, PROGRAM_FLOORS);

    const newData = {
        _id: oldData._id,
        programType: (req.body.programType ? req.body.programType : oldData.programType),
        points: (req.body.points ? req.body.points : oldData.points),
        sqFootage: (req.body.sqFootage ? req.body.sqFootage : oldData.sqFootage),
        color: (req.body.color ? req.body.color : oldData.color)
    }

    await basicDBfoos.updateObj(id, newData, PROGRAM_FLOORS);
    res.status(201).json(newData);
})

//route deletes a program from the floor  
router.delete('/:id/programs/:program_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const user = await req.body.user;
    //TODO update away from Models folder
    const floor = await Floor.findById(req.params.id);
    const authorized = floor.researchers.includes(user._id);
    if (!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    for (let i = 0; i < floor.programs.length; i++) {
        if (floor.programs[i]._id = req.params.program_id) {
            obj[arrayName].splice(i, 1);
            break;
        }
    }
    basicDBfoos.updateObj(floor._id, floor, PROGRAM_FLOORS);
    res.json({});
})

module.exports = router
