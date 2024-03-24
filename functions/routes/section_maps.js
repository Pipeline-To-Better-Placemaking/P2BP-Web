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
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js")
const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {SECTION_MAPS, SECTION_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createMaps(req, SECTION_MAPS, SECTION_COLS));
  }
);

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, SECTION_MAPS, SECTION_COLS));
  }
);

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, SECTION_MAPS, SECTION_COLS));
  }
);

// route gets a map's specific data entry
// id is the direct key for the document with data_id being the secondary key for the data entry
router.get('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const map = await  Map.findData(req.params.id, req.params.data_id)
    res.status(200).json(map)
})

// route removes researcher from a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user;
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

// route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    map = await Map.findById(req.params.id)
    project = await Project.findById(map.project)
    if(await Team.isAdmin(project.team,user._id)){
        res.json(await Section_Collection.deleteMap(map.sharedData,map._id)) 
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

// route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.addTestData(req, SECTION_MAPS, SECTION_COLS));
  }
);

// route edits any already created tested times slots. Essentially redoing a test run for a times slot 
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user   
    mapId = req.params.id

    if (Map.isResearcher(mapId, user._id)){

        oldData = await Map.findData(mapId, req.params.data_id)
        // checks if we can replace the oldData with the new, non-void, data fields. 
        const newData = {
            _id: oldData._id,
            title: (req.body.title ? req.body.title : oldData.title),
            path: (req.body.path ? req.body.path : oldData.path),
            date: (req.body.date ? req.body.date : oldData.date),
            url_link: (req.body.url_link ? req.body.url_link : oldData.url_link),
            panoramic: (req.body.panoramic ? req.body.panoramic : oldData.panoramic),
            tags: (req.body.tags ? req.body.tags : oldData.tags),
            other: (req.body.other ? req.body.other : oldData.other)
        }
    
        await Map.updateData(mapId,oldData._id,newData)
        res.status(201).json(await Map.findById(req.params.id))
    }  
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }  
})

// route deletes an individual times slot from a map
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
