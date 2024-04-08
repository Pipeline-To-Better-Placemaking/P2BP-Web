const express = require('express')
const router = express.Router()
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const routeDBfoos = require('../databaseFunctions/RouteFunctions.js')
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const firestore = require('../firestore');
const {
    AREAS,
    PROJECTS,
    STANDING_POINTS,
    SURVEY_COLS,
    SURVEY_KEYS,
    SURVEYS,
    USERS
} = require('../databaseFunctions/CollectionNames.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
module.exports.createMaps = async function(req, MapName, CollectionName) {
    console.log("Creating Maps");
    const user = await req.user;
    const projectId = await req.body.project;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const collectionId = await req.body.collection;
    const timeSlots = await req.body.timeSlots;

    if (await userDBfoos.isAdmin(project.team, user._id)) {
        if (timeSlots && timeSlots.length > 0) {
            console.log("TimeSlots.length > 0");
            for (let i = 0; i < timeSlots.length; i++) {
                const slot = timeSlots[i];

                const newMap = {
                    _id: basicDBfoos.createId(),
                    title: slot.title,
                    standingPoints: slot.standingPoints._id,
                    researchers: slot.researchers,
                    project: projectId,
                    sharedData: collectionId,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                    maps: [],
                    data: slot.data ? [slot.data] : [],
                }

                //create new map and add ref to its parent collection.
                const map = await basicDBfoos.addObj(newMap, MapName);
                await arrayDBfoos.addArrayElement(collectionId, "maps", CollectionName, newMap._id);

                //add references of points used in Points model.
                for (j = 0; j < map.standingPoints.length; j++) {
                    await refDBfoos.addReference(map.standingPoints[j]._id, STANDING_POINTS);
                }
            }
            console.log("TimeSlots: Before Response");
            return await basicDBfoos.getObj(collectionId, CollectionName);
        }
        else {
            console.log("Here");
            let standingPoints = [];
            if (req.body.standingPoints) {
                standingPoints = new Array(req.body.standingPoints.length);
            }
            for (let i = 0; i < standingPoints.length; i++) {
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
                data: req.body.data ? [req.body.data] : []
            }
            console.log(collectionId);
            console.log(newMap);
            await basicDBfoos.addObj(newMap, MapName);
            await arrayDBfoos.addArrayElement(collectionId, "maps", CollectionName, newMap._id);
            for (i = 0; i < newMap.standingPoints.length; i ++) {
                await refDBfoos.addReference(newMap.standingPoints[i], STANDING_POINTS);
            }
            return newMap;
        }
        return {};
    }
    else {
        throw new Error('You do not have permision to perform this operation');
    }
};

//helper function to generate survey keys
generateSurveyKey = async function() {
    //this string has A-Z and 0-9 in a randomized order
    const builderString = "3UROGSWIVE01A9LMKQB7FZ6DJ4NC28Y5HTXP"

    let counter = await firestore.collection(SURVEY_KEYS).get();
    if (!counter.exists) {
        counter = {
            _id: basicDBfoos.createId(),
            counter: 0
        }
    }

    let count = counter.counter;
    counter.counter = count + 1;
    await basicDBfoos.addObj(counter, SURVEY_KEYS);

    let keyInt = (count * 823543 + 23462) % 2176782336;
    let keyString = "";

    for (let i = 0; i < 6; i++) {
        keyString += builderString[ keyInt % 36];
        keyInt = Math.floor(Math.random() * keyInt / 36);
    }

    return keyString;
};

//route creates new survey(s).  If there are multiple time slots in test, multiple timseslots are created.
module.exports.createSurvey = async function(req) {
    console.log("Creating Survey");
    const user = await req.user;
    const projectId = await req.body.project;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const collectionId = await req.body.collection;
    const timeSlots = await req.body.timeSlots;
    if (await userDBfoos.isAdmin(project.team, user._id)) {
        if (timeSlots && timeSlots.length > 0) {
            console.log("TimeSlots.length > 0");
            for (let i = 0; i < timeSlots.length; i++) {
                const slot = timeSlots[i];

                const newSurvey = {
                    _id: basicDBfoos.createId(),
                    title: slot.title,
                    standingPoints: standingPoints,
                    researchers: slot.researchers,
                    project: projectId,
                    sharedData: collectionId,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                    maps: [],
                    data: []
                }

                //create new survey and add ref to its parent collection.
                newSurvey.key = await generateSurveyKey();
                const survey = await basicDBfoos.addObj(newSurvey, SURVEYS);
                await arrayDBfoos.addArrayElement(collectionId, "surveys", SURVEY_COLS, newSurvey._id);
            }
            console.log("TimeSlots: Before Response");
            return await basicDBfoos.getObj(collectionId, SURVEY_COLS);
        }
        else {
            let standingPoints = new Array(req.body.standingPoints.length);
            for (let i = 0; i < req.body.standingPoints.length; i++) {
                standingPoints[i] = req.body.standingPoints[i]._id;
            }
            const newSurvey = {
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

            console.log(collectionId);
            newSurvey.key = await generateSurveyKey();
            console.log(newSurvey);
            const survey = await basicDBfoos.addObj(newSurvey, SURVEYS);
            console.log("Here1");
            await arrayDBfoos.addArrayElement(collectionId, "surveys", SURVEY_COLS, newSurvey._id);
            console.log("Here2");
            return survey;
        }
    }
    else {
        throw new Error('You do not have permision to perform this operation');
    }
};

//route gets all map data, including any collection data.
module.exports.getMapData = async function(req, MapName, CollectionName) {
    console.log("Getting Map Data");
    console.log(req.params.id);
    let map = await basicDBfoos.getObj(req.params.id, MapName);
    for (let i = 0; i < map.researchers.length; i++) {
        const id = map.researchers[i];
        console.log(id);
        const researcher = await basicDBfoos.getObj(map.researchers[i], USERS);
        map.researchers[i] = {firstname: researcher.firstname, lastname: researcher.lastname, _id: map.researchers[i]};
    }
    console.log("Test");
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

    return map;
};

//route signs team member up to a time slot.
module.exports.assignTimeSlot = async function(req, MapName) {
    console.log("Assigning Time Slot");
    console.log(req.params.id);
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);
    const user = await req.user;
    if (map.researchers.length < map.maxResearchers) {
        if (userDBfoos.onTeam(project.team, user._id)) {
            await arrayDBfoos.addArrayElement(map._id, 'researchers', MapName, user._id);
            return user;
        }
        else {
            throw new UnauthorizedError('You do not have permision to perform this operation');
        }
    }
    else {
        throw new BadRequestError('Research team is already full');
    }
};

//route gets a map's specific data entry
// id is the direct key for the document with data_id being the secondary key for the data entry
module.exports.getDataEntry = async function(req, MapName) {
    return arrayDBfoos.getArrayElement(req.params.id, req.params.data_id);
};

//route reverses sign up to a time slot.
module.exports.clearTimeSlot = async function(req, MapName) {
    console.log("Clearing Time Slot");
    console.log(req.params.id);
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);

    if (userDBfoos.onTeam(project.team, user._id)) {
        return await arrayDBfoos.removeArrayElement(map._id, user._id, 'researchers', MapName);
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
};

//route edits time slot information when updating a map
module.exports.editTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Editing Time Slot");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);

    if (await userDBfoos.isAdmin(project.team, user._id)) {
        const newMap = {
            title: (req.body.title ? req.body.title : map.title),
            date: (req.body.date ? req.body.date : map.date),
            maxResearchers: (req.body.maxResearchers ? req.body.maxResearchers : map.maxResearchers),
            //if there is no map.standingPoints then it returns 'undefined'
            standingPoints: (req.body.standingPoints ? req.body.standingPoints : map.standingPoints)
        }

        //if standing points are changed, any new points get referenced, before any old points get dereferenced.
        //done in this order so points never reach 0 and get deleted in removeReference()
        if (req.body.standingPoints) {
            for (let i = 0; i < req.body.standingPoints.length; i++) {
                await refDBfoos.addReference(req.body.standingPoints[i], STANDING_POINTS);
            }

            for (let i = 0; i < map.standingPoints.length; i++) {
                await refDBfoos.removeReference(map.standingPoints[i], STANDING_POINTS);
            }
        }

        await basicDBfoos.updateObj(req.params.id, newMap, MapName);
        return newMap;
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
};

//route deletes a map from a test collection
module.exports.deleteMap = async function(req, MapName, CollectionName) {
    const isSurvey = (MapName === SURVEYS);
    isSurvey ? console.log("Deleting Survey") : console.log("Deleting Map");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const project = await basicDBfoos.getObj(map.project, PROJECTS);
    if (await userDBfoos.isAdmin(project.team, user._id)) {
        if (map.standingPoints) {
            for (let i = 0; i < map.standingPoints.length; i++) {
                await refDBfoos.removeReference(map._id, MapName);
            }
        }
        await basicDBfoos.deleteObj(map._id, MapName); //delete map
        //TODO doublecheck the return value, old return value was a return value of updateOne()
        isSurvey ? await arrayDBfoos.removeArrayElement(map.sharedData, map._id, 'surveys', CollectionName) :
            await arrayDBfoos.removeArrayElement(map.sharedData, map._id, 'maps', CollectionName);
        return {};
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
};

//route adds test data to its relevant time slot
module.exports.addTestData = async function(req, MapName) {
    console.log("Adding Test Data");
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    const authorized = map.researchers.includes(user._id);
    console.log(authorized);

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
            await basicDBfoos.updateObj(map._id, map, MapName);
            console.log(map);
            return map;
        }
        else {
            console.log("Here");
            if (req.body.standingPoint) {
                refDBfoos.addReference(req.body.standingPoint, STANDING_POINTS);
            }
            await arrayDBfoos.addArrayElement(map._id, 'data', MapName, req.body);
            return map;
       }
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
};

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot
module.exports.editTestedTimeSlot = async function(req, MapName, CollectionName) {
    console.log("Editing Tested Time Slot");
    const user = await req.user
    const map = await basicDBfoos.getObj(req.params.id, MapName);z

    //true if the user is within the researchers[] of the X_map document
    if (map.researchers.includes(user._id)) {
        //it is important to note that standingPoint != standingPoints.  standingPoint is an individual point which an instance
        //of a time slot uses.  standingPoints is an array which includes all of these points.
        if (req.body.standingPoint) {
            await refDBfoos.addReference(req.body.standingPoint, STANDING_POINTS);
            await refDBfoos.removeReference(oldData.standingPoint, STANDING_POINTS);
        }

        await arrayDBfoos.updateArrayElement(map._id, req.params.data_id, req.body);
        //access_maps wants the object from the access_maps, not access_collection
        return await basicDBfoos.getObj(req.params.id, CollectionName);
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
};

//route deletes an individual time slot from a map
module.exports.deleteTimeSlot = async function(req, MapName) {
    console.log("Deleting Time Slot");
    const user = await req.user;
    const map = await basicDBfoos.getObj(req.params.id, MapName);
    if (map.researchers.includes(user._id)) {
        await refDBfoos.removeReference(req.params.data_id, STANDING_POINTS);
        await arrayDBfoos.removeArrayElement(map._id, req.params.data_id, 'data', MapName);
        return await basicDBfoos.getObj(req.params.id, PROJECTS);
    }
    else {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
};
