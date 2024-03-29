const express = require('express')
const router = express.Router()
const Map = require('../models/program_maps.js')
const Project = require('../models/projects.js')
const Floor = require('../models/program_floors.js')
const Team = require('../models/teams.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')
const { models } = require('mongoose')
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js')
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js')
const {PROGRAM_FLOORS} = require('../databaseFunctions/CollectionNames.js')

const { UnauthorizedError, BadRequestError } = require('../utils/errors.js')

//route creates new floor(s).  If there are multiple floors in building, multiple floors are created.
router.post('', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const dataId = await req.dataId;
    let programs = new Array(1);
    const data = programs.push();

    const newFloor = {
        _id: {$oid: basicDBfoos.createId()},
        map: req.body.mapId,
        floorNum: req.body.floorNum,
        programCount: req.body.programCount,
        programs: [dataId],
    }

    //create new map with method from _map models and add ref to its parent collection.
    const floor = await basicDBfoos.addObj(newFloor, PROGRAM_FLOORS);

    res.status(201).json(floor);
})


//route gets a floor
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const id = req.params.id;
    const floor = await basicDBfoos.getObj(id, PROGRAM_FLOORS);
    res.status(200).json(floor)
})


//route deletes a floor from a map
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const floor = await basicDBfoos.getObj(req.params.id)
    const map = await basicDBfoos.getObj(floor.map)

    await Map.deleteFloor(map._id, floor._id)
    res.json(await Floor.deleteFloor(floor._id))
})


//route edits a floor
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    user = await req.user
    floor = await Floor.findById(req.params.id)

    let newFloor = new Floor({
        map: (req.body.map ? req.body.map : floor.map),
        floorNum: (req.body.floorNum ? req.body.floorNum : floor.floorNum),
        programCount: (req.body.programCount ? req.body.programCount : floor.programCount),
        programs: (req.body.programs ? req.body.programs : floor.programs)
    })

    await Floor.updateFloor(req.params.id, newFloor)
    res.status(201).json(await Floor.findById(req.params.id))
})


//route adds test a program to its floor
router.post('/:id/programs', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    user = await req.user
    floor = await Floor.findById(req.params.id)
    mapId = floor.map

    console.log(req.body.programs);

    if (Map.isResearcher(mapId, user._id)) {
        if (req.body.programs) {
            for (var i = 0; i < req.body.programs.length; i++) {
                await Floor.addProgram(floor._id, req.body.programs[i])
            }
            res.status(201).json(await Floor.findById(floor._id))
        }
        else {
            res.json(await Floor.addProgram(floor._id, req.body))
        }
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

//route edits the program object for any already created floors
router.put('/:id/programs/:program_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    user = await req.user
    floorId = req.params.id
    mapId = req.body.map

    if (Map.isResearcher(mapId, user._id)) {

        oldData = await Floor.findProgram(floorId, req.params.program_id)

        const newData = {
            _id: oldData._id,
            programType: (req.body.programType ? req.body.programType : oldData.programType),
            points: (req.body.points ? req.body.points : oldData.points),
            sqFootage: (req.body.sqFootage ? req.body.sqFootage : oldData.sqFootage),
            color: (req.body.color ? req.body.color : oldData.color)
        }

        await Floor.updateProgram(floorId, oldData._id, newData)
        res.status(201).json(await Floor.findById(req.params.id))
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

//route deletes a program from the floor  
router.delete('/:id/programs/:program_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    user = await req.body.user
    floor = await Floor.findById(req.params.id)
    mapId = floor.map

    if (Map.isResearcher(mapId, user._id)) {
        res.json(await Floor.deleteProgram(floor._id, req.params.program_id))
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

module.exports = router
