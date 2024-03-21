const express = require('express')
const router = express.Router()
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const routeDBfoos = require('../databaseFunctions/RouteFunctions.js')
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const {
    AREAS,
    PROJECTS,
    STANDING_POINTS,
    USERS
} = require('../databaseFunctions/CollectionNames.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
module.exports.createMaps = async function(req, MapName, CollectionName) {
    console.log("Creating Maps");
    const user = await req.user;
    const projectId = req.body.project;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const collectionId = req.body.collection;
    const timeSlots = await req.body.timeSlots;

    if(await userDBfoos.isAdmin(project.team, user._id)) {
        if(timeSlots && timeSlots.length > 0) {
            console.log("TimeSlots.length > 0")
            for(let i = 0; i < timeSlots.length; i++){
                let slot = timeSlots[i]

                let newMap = {
                    _id: basicDBfoos.createId(),
                    title: slot.title,
                    standingPoints: slot.standingPoints._id,
                    researchers: slot.researchers,
                    project: projectId,
                    sharedData: collectionId,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                    maps: [],
                    data: []
                }

                //create new map with method from _map models and add ref to its parent collection.
                const map = await basicDBfoos.addObj(newMap, MapName);
                await arrayDBfoos.addArrayElement(collectionId, "maps", CollectionName, newMap._id);

                //add references of points used in Points model.
                for (j = 0; j < map.standingPoints.length; j++) {
                    await refDBfoos.addReference(map.standingPoints[j]._id, STANDING_POINTS);
                }
                console.log("TimeSlots: Before Response");
                res.status(201).json(await basicDBfoos.getObj(collectionId, CollectionName));
            }
        }
        else {
            let standingPoints = new Array(req.body.standingPoints.length);
            for (let i = 0; i < req.body.standingPoints.length; i++) {
                standingPoints[i] = req.body.standingPoints[i]._id;
            }
            const newMap = {
                _id: basicDBfoos.createId(),
                title: req.body.title,
                standingPoints: standingPoints,
                researchers: req.body.researchers,
                project: projectId,
                sharedData: collectionId,
                date: req.body.date,
                maxResearchers: req.body.maxResearchers,
                maps: [],
                data: []
            }

            const map = await basicDBfoos.addObj(newMap, MapName);
            await arrayDBfoos.addArrayElement(collectionId, "maps", MapName, newMap._id);
            for (i = 0; i < newMap.standingPoints.length; i ++){
                await refDBfoos.addReference(newMap.standingPoints[i], STANDING_POINTS);
            }
            console.log("No TimeSlots: Before Response");
            res.status(201).json(map)
        }
        res.status(201).json();
    }
    else{
        throw new Error('You do not have permision to perform this operation');
    }
}

//route gets all map data, including any collection data.
module.exports.getMapData = async function(req, MapName, CollectionName) {
    console.log("Getting Map Data");
    /*const map = await  Map.findById(req.params.id)
                           .populate('standingPoints')
                           .populate('researchers','firstname lastname')
                           .populate([
                               {
                                   path:'sharedData',
                                   model:'Moving_Collections',
                                   select:'title duration',
                                   populate: {
                                    path: 'area',
                                    model: 'Areas'
                                   }
                                }])*/
    console.log(req.params.id);
    let map = await basicDBfoos.getObj(req.params.id, MapName);
    for (let i = 0; i < map.researchers.length; i++) {
        const id = map.researchers[i];
        console.log(id);
        const researcher = await basicDBfoos.getObj(map.researchers[i], USERS);
        map.researchers[i] = {firstname: researcher.firstname, lastname: researcher.lastname, _id: map.researchers[i]};
    }
    for (let i = 0; i < map.standingPoints.length; i++) {
        const id = map.standingPoints[i];
        console.log(id);
        map.standingPoints[i] = await basicDBfoos.getObj(id, STANDING_POINTS);
        map.standingPoints[i]._id = id;
    }
    const obj = await basicDBfoos.getObj(map.sharedData, CollectionName);
    map.sharedData = {title: obj.title, duration: obj.duration, _id: map.sharedData}
    const area = await basicDBfoos.getObj(obj.area, AREAS);
    map.sharedData.area = area;
    console.log(map);

    res.status(200).json(map)
}

//route signs team member up to a time slot.
module.exports.assignTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Assigning Time Slot");
    console.log(req.params.id);
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);
    const user = await req.user;
    if(map.researchers.length < map.maxResearchers) {
        if(userDBfoos.onTeam(project.team, user._id)) {
            return res.status(200).json(await arrayDBfoos.addArrayElement(map._id, "researchers", MapName, user._id));
        }
        else {
            throw new UnauthorizedError('You do not have permision to perform this operation');
        }
    }
    else {
        throw new BadRequestError('Research team is already full');
    }
}

//route reverses sign up to a time slot.
module.exports.clearTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Clearing Time Slot");
    console.log(req.params.id);
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);
    const user = await req.user;
    if(userDBfoos.onTeam(project.team, user._id)) {
        return res.status(200).json(await arrayDBfoos.removeArrayElement(map._id, user._id, 'researchers', CollectionName))
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
}

//route edits time slot information when updating a map
module.exports.editTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Editing Time Slot");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);

    if (await userDBfoos.isAdmin(project.team, user._id)){
        let newMap = {
            title: (req.body.title ? req.body.title : map.title),
            date: (req.body.date ? req.body.date : map.date),
            maxResearchers: (req.body.maxResearchers ? req.body.maxResearchers : map.maxResearchers),
            standingPoints: (req.body.standingPoints ? req.body.standingPoints : map.standingPoints)
        }

        //if standing points are changed, any new points get referenced, before any old points get dereferenced.
        //done in this order so points never reach 0 and get deleted in removeRefrence()
        if(req.body.standingPoints){
            for(var i = 0; i < req.body.standingPoints.length; i++)
                await refDBfoos.addReference(req.body.standingPoints[i], STANDING_POINTS);

            for(var i = 0; i < map.standingPoints.length; i++)
                await refDBfoos.removeReference(map.standingPoints[i], STANDING_POINTS)
        }
        const updatedMap = await basicDBfoos.updateObj(req.params.id, newMap, CollectionName);
        res.status(201).json(updatedMap)
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
}

//route deletes a map from a test collection
module.exports.deleteMap = async function(req, MapName, CollectionName) {
    console.log("Deleting Map");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);
    if(await userDBfoos.isAdmin(project.team, user._id)){
        for (let i = 0; i < map.standingPoints.length; i++) {//remove references
            await refDBfoos.removeReference(map._id, MapName);
        }
        await basicDBfoos.deleteObj(map._id, MapName)//delete map
        return res.json(await arrayDBfoos.removeArrayElement(map.sharedData, map._id, 'maps', CollectionName));//remove map from collection
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
}

//route adds test data to its relevant time slot
module.exports.addTestData = async function(req, MapName, CollectionName) {
    console.log("Adding Test Data");
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, MapName);
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
                refDBfoos.addReference(req.body.entries[i].standingPoint, STANDING_POINTS);
            }
            await basicDBfoos.updateObj(map._id, map, MapName);
            console.log(map);
            return res.status(201).json(map);
        }
        else {
            const entry = {
                time: req.body.time,
                mode: req.body.mode,
                standingPoint: req.body.standingPoint,
                path: req.body.path
            }
            refDBfoos.addReference(entry.standingPoint, STANDING_POINTS)
            return res.json(await arrayDBfoos.addArrayElement(map._id, 'data', MapName, req.body));
       }
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
}

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot
module.exports.editTestedTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Editing Tested Time Slot");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);

    //adding await causes unwanted behavior.  Reason unkown
    //true if the user is within the researchers[] of the X_map document
    if (await arrayDBfoos.getArrayElement(map._id, user._id, 'researchers', MapName).exists) {

        oldData = await arrayDBfoos.getArrayElement(map._id, req.params.data_id, 'data', MapName);

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
            await refDBfoos.addReference(req.body.standingPoint, STANDING_POINTS);
            await refDBfoos.removeReference(oldData.standingPoint, STANDING_POINTS);
        }

        await arrayDBfoos.updateArrayElement(map._id, oldData._id, newData, 'data');// updates data[]
        res.status(201).json(await basicDBfoos.getObj(req.params.id, CollectionName));
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
}

//route deletes an individual time slot from a map
module.exports.deleteTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Deleting Time Slot");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    if(map.owner.toString() == user._id.toString()){
        //remove reference to the entry from STANDING_POINTS
        await refDBfoos.removeReference(req.params.data_id, STANDING_POINTS);
        //delete the value from data[]
        await arrayDBfoos.removeArrayElement(map._id, req.params.data_id, 'data', MapName);
        res.status(201).json(await basicDBfoos.getObj(req.params.id, PROJECTS));
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
}