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
    res.status(200).json(await routeDBfoos.createMaps(req, ACCESS_MAPS, ACCESS_COLS));
  }
);

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, ACCESS_MAPS, ACCESS_COLS));
  }
);

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, ACCESS_MAPS, ACCESS_COLS));
  }
);


//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    map = await Map.findById(req.params.id)
    project = await Project.findById(map.project)
    return res.status(200).json(await Map.removeResearcher(map._id,user._id))

})

//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    map = await Map.findById(req.params.id)
    
    let newMap = new Map({
        title: (req.body.title ? req.body.title : map.title),
        date: (req.body.date ? req.body.date : map.date),
        maxResearchers: (req.body.maxResearchers ? req.body.maxResearchers : map.maxResearchers),
    })

    project = await Project.findById(map.project)


    if (await Team.isAdmin(project.team,user._id)){
        res.status(201).json(await Map.updateMap(req.params.id,newMap))
    }

    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    
})


//route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    map = await Map.findById(req.params.id)
    project = await Project.findById(map.project)
    if(await Team.isAdmin(project.team,user._id)){
        res.json(await Access_Collection.deleteMap(map.sharedData,map._id)) 
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

//route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.addTestData(req, ACCESS_MAPS, ACCESS_COLS));
  }
);

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot 
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user   
    mapId = req.params.id

    if (Map.isResearcher(mapId, user._id)){

        oldData = await Map.findData(mapId, req.params.data_id)

        const newData = {
            _id: oldData._id,
            accessType: (req.body.accessType ? req.body.accessType : oldData.accessType),
            inPerimeter: (req.body.inPerimeter ? req.body.inPerimeter : oldData.inPerimeter),
            area: (req.body.area ? req.body.area : oldData.area),
            distance: (req.body.distance ? req.body.distance : oldData.distance),
            path: (req.body.path ? req.body.path : oldData.path),
            time: (req.body.time ? req.body.time : oldData.time),
            details: (req.body.details ? req.body.details : req.body.details),
            floors: (req.body.floors ? req.body.floors : oldData.floors),
        }

        await Map.updateData(mapId,oldData._id,newData)
        res.status(201).json(await Map.findById(req.params.id))
    }  
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }  
})

//route deletes an individual time slot from a map
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => { 
    user = await req.user
    map = await Map.findById(req.params.id)
    if(Map.isResearcher(map._id, user._id)){
        res.json(await Map.deleteEntry(map._id,req.params.data_id))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

module.exports = router
