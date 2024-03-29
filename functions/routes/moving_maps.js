const express = require('express')
const router = express.Router()
const Map = require('../models/moving_maps.js')
const Project = require('../models/projects.js')
const Moving_Collection = require('../models/moving_collections.js')
const Team = require('../models/teams.js')
const Points = require('../models/standing_points.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { models } = require('mongoose')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const projectId = req.body.project;
    const project = await basicDBfoos.getObj(projectId, "projects");
    const collectionId = req.body.collection;
    const timeSlots = await req.body.timeSlots;
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if(authorized) {

        if(timeSlots && timeSlots.length > 0) {
            for(let i = 0; i < timeSlots.length; i++){
                let slot = timeSlots[0]

                let newMap = {
                    _id: basicDBfoos.createId(),
                    title: slot.title,
                    standingPoints: slot.standingPoints._id,
                    researchers: slot.researchers,
                    project: req.body.project,
                    sharedData: req.body.collection,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                    maps: [],
                    data: [],
                }

                //create new map with method from _map models and add ref to its parent collection.
                const map = await basicDBfoos.addObj(newMap, "moving_maps");
                await arrayDBfoos.addArrayElement(collectionId, "maps", "moving_collections", newMap._id);

                //add references of points used in Points model.
                for (i = 0; i < map.standingPoints.length; i ++) {
                    await refDBfoos.addReference(map.standingPoints[i]._id, "standing_points");
                }
                console.log("tset");
                res.status(201).json(await basicDBfoos.getObj(req.body.collection, "moving_collection"));
            }
        }
        else{
            let standingPoints = new Array(req.body.standingPoints.length);
            for (let i = 0; i < req.body.standingPoints.length; i++) {
                standingPoints[i] = req.body.standingPoints[i]._id;
            }
            const newMap = {
                _id: basicDBfoos.createId(),
                title: req.body.title,
                standingPoints: standingPoints,
                researchers: req.body.researchers,
                project: req.body.project,
                sharedData: req.body.collection,
                date: req.body.date, 
                maxResearchers: req.body.maxResearchers,
                maps: [],
                data: [],
            }

            await basicDBfoos.addObj(newMap, "moving_maps");
            // console.log(collectionId);
            await arrayDBfoos.addArrayElement(collectionId, "maps", "moving_collections", newMap._id);
            // await Moving_Collection.addActivity(req.body.collection,map._id)
            for (i = 0; i < newMap.standingPoints.length; i ++){
                await refDBfoos.addReference(newMap.standingPoints[i], "standing_points");
            }
            console.log("end");
            res.status(201).json(newMap);

        }
        res.status(201).json();

    }
    else{
        throw new Error('You do not have permision to perform this operation');
    }   
})

//route gets all map data, including any collection data.
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    console.log(req.params.id);
    let map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    for (let i = 0; i < map.researchers.length; i++) {
        const id = map.researchers[i];
        const researcher = await basicDBfoos.getObj(map.researchers[i], "users");
        map.researchers[i] = {firstname: researcher.firstname, lastname: researcher.lastname, _id: map.researchers[i]};
    }
    for (let i = 0; i < map.standingPoints.length; i++) {
        const id = map.standingPoints[i];
        map.standingPoints[i] = await basicDBfoos.getObj(id, "standing_points");
        map.standingPoints[i]._id = id;
    }
    const obj = await basicDBfoos.getObj(map.sharedData, "moving_collections");
    map.sharedData = {title: obj.title, duration: obj.duration, _id: map.sharedData}
    const area = await basicDBfoos.getObj(obj.area, "areas");
    map.sharedData.area = area;

    res.status(200).json(map)
})

//route signs team member up to a time slot.
router.put('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    const project = await basicDBfoos.getObj(map.project, "projects");
    const user = await req.user;
    if(map.researchers.length < map.maxResearchers)
    // adding an await in if statement below causes unwanted behavior.  Reason unkown
        if(userDBfoos.onTeam(project.team, user._id)) {
            res.status(200).json(await arrayDBfoos.addArrayElement(map._id, "researchers", "moving_maps", user._id));
        }
        else {
            throw new UnauthorizedError('You do not have permision to perform this operation');
        }
    else {
        throw new BadRequestError('Research team is already full');
    }
})

//route reverses sign up to a time slot.
// Untested
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const map = await Map.findById(req.params.id);
    await arrayDBfoos.removeArrayElement(map._id, user._id, "reserachers", "moving_maps");
    return res.status(200).json({});

})

// Untested
//route edits time slot information when updating a map
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    const project = await basicDBfoos.getObj(map.project, "projects");
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if(authorized) {
        let newMap = {
            title: (req.body.title ? req.body.title : map.title),
            date: (req.body.date ? req.body.date : map.date),
            maxResearchers: (req.body.maxResearchers ? req.body.maxResearchers : map.maxResearchers),
            standingPoints: (req.body.standingPoints ? req.body.standingPoints : map.standingPoints)
        }


        //if standing points are changed, any new points get referenced, before any old points get dereferenced.
        //done in this order so points never reach 0 and get deleted in removeRefrence()
        if(req.body.standingPoints){

            for(var i = 0; i < req.body.standingPoints.length; i++) {
                await refDBfoos.addReference(newMap.standingPoints[i], "standing_points");
            }
            
            for(var i = 0; i < map.standingPoints.length; i++) {
                await refDBfoos.removeReference(map.standingPoints[i], "standing_points");
            }

        }
        res.status(201).json(newMap);
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    
})

// Untested
//route deletes a map from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    const project = await basicDBfoos.getObj(map.project, "projects");
    if(await userDBfoos.isAdmin(project.team,user._id)) {
        await basicDBfoos.deleteObj(map._id, "moving_maps");
        await arrayDBfoos.removeArrayElement(map.sharedData, map._id, "maps", "moving_collections");
        res.json({});

    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

//route adds test data to its relevant time slot
router.post('/:id/data', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    const authorized = map.researchers.indexOf(user._id) > -1;
    console.log(authorized);
    if(authorized) {
        if(req.body.entries) {
            for(var i = 0; i < req.body.entries.length; i++){
                req.body.entries[i]._id = basicDBfoos.createId();
                if (!map.data) {
                    map.data = [];
                }
                map.data.push(req.body.entries[i]);
                refDBfoos.addReference(req.body.entries[i].standingPoint, "standing_points");
            }
            await basicDBfoos.updateObj(map._id, map, "moving_maps");
            console.log(map);
            res.status(201).json(map);
        }
        else{
            res.json(await Map.addEntry(map._id,req.body))
       }
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


//route edits any already created tested time slots.  Essentially redoing a test run for a time slot 
// Incomplete
router.put('/:id/data/:data_id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const map = await basicDBfoos.getObj(req.params.id, "moving_maps");
    const authorized = map.researcher.includes(userId);

    if (authorized) {

        oldData = await Map.findData(map._id, req.params.data_id)

        const newData = {
            _id: oldData._id,
            path: (req.body.path ? req.body.path : oldData.path),
            mode: (req.body.mode ? req.body.mode : oldData.mode),
            standingPoint: (req.body.standingPoint ? req.body.standingPoint : oldData.standingPoint),
            time: (req.body.time ? req.body.time : oldData.time)
        }

        //it is important to note that standingPoint != standingPoints.  standingPoint is an individual point which an instance
        //of a time slot uses.  standingPoints is an array which includes all of these points.          
        if(req.body.standingPoint){
            await refDBfoos.addReference(req.body.standingPoint, "standing_points");
            await refDBfoos.removeReference(req.body.standingPoint, "standing_points");
        }
        await basicDBfoos.updateObj(map._id, newData, "moving_maps");
        res.status(201).json(newData);
    }  
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }  
})

// Untested
//route deletes an individual time slot from a map
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => { 
    user = await req.user
    map = await Map.findById(req.params.id)
    if(map.owner.toString() == user._id.toString()){
        await Map.deleteEntry(map._id,req.params.data_id)
        res.status(201).json(await Project.findById(req.params.id))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})
module.exports = router
