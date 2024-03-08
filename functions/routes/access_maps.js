const express = require('express')
const router = express.Router()
const Map = require('../models/access_maps.js')
const Project = require('../models/projects.js')
const Access_Collection = require('../models/access_collections.js')
const Team = require('../models/teams.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { models } = require('mongoose')
const firestore = require('../firestore');
const { createId } = require('../databaseFunctions/BasicFunctions.js');
const User = require('../databaseFunctions/UserFunctions.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
/*router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.body.project)

    if(await Team.isAdmin(project.team,user._id)){
        
        if(req.body.timeSlots)
            for(var i = 0; i < req.body.timeSlots.length; i++){
                var slot = req.body.timeSlots[0]

                let newMap = new Map({
                    title: slot.title,
                    researchers: slot.researchers,
                    project: req.body.project,
                    sharedData: req.body.collection,
                    date: slot.date,
                    maxResearchers: slot.maxResearchers,
                })

                //create new map with method from _map models and add ref to its parent collection.
                const map = await Map.addMap(newMap)
                await Access_Collection.addActivity(req.body.collection, map._id)

                res.status(201).json(await Access_Collection.findById(req.body.collection))
            }
            
        //note that access test does not use any standing points

        let newMap = new Map({
            title: req.body.title,
            researchers: req.body.researchers,
            project: req.body.project,
            sharedData: req.body.collection,
            date: req.body.date, 
            maxResearchers: req.body.maxResearchers,
        })
        const map = await Map.addMap(newMap)
        await Access_Collection.addActivity(req.body.collection,map._id)
        res.status(201).json(map)

    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }   
})*/

// Route creates new map(s). If there are multiple time slots, multiple timeslots are created.
router.post('', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const user = req.user;
        const projectId = req.body.project;
        const projectRef = firestore.collection('projects').where("_id", "==", req.body.project).get();        
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
            throw new BadRequestError('Project not found');
        }

        const isAdmin = await User.isAdmin(projectDoc.data().team, user._id);
        if (!isAdmin) {
            throw new UnauthorizedError('You do not have permission to perform this operation');
        }

        const timeSlots = req.body.timeSlots || [];
        const createdMaps = [];

        for (const slot of timeSlots) {
            const mapId = createId;
            const newMapData = {
                _id: mapId,
                title: slot.title,
                researchers: slot.researchers,
                project: projectId,
                sharedData: req.body.collection,
                date: slot.date,
                maxResearchers: slot.maxResearchers,
                data: []
            };

            await firestore.collection('access_maps').doc(mapId).set(newMapData);

            await firestore.collection('access_collections').doc(req.body.collection).update({
                activities: firestore.FieldValue.arrayUnion(mapId)
            });
        }

        const baseMapId = createId;
        const baseMapData = {
            _id: baseMapId,
            title: req.body.title,
            researchers: req.body.researchers,
            project: projectId,
            sharedData: req.body.collection,
            date: req.body.date,
            maxResearchers: req.body.maxResearchers,
            data: []
        };

        
        await firestore.collection('access_maps').doc(baseMapId).set(baseMapData);
        createdMaps.push(baseMapId);

        await firestore.collection('access_collections').doc(req.body.collection).update({
            activities: firestore.FieldValue.arrayUnion(baseMapId)
        });

        res.status(201).json({ message: 'Maps created successfully', maps: createdMaps });
    } catch (error) {
        next(error);
    }
})

//route gets all map data, including any collection data.
/*router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const map = await  Map.findById(req.params.id)
                           .populate('researchers','firstname lastname')
                           .populate([
                               {
                                   path:'sharedData',
                                   model:'Access_Collections',
                                   select:'title duration',
                                   populate: {
                                    path: 'area',
                                    model: 'Areas'
                                   }
                                }])
                           
    res.status(200).json(map)
})*/

//route gets all map data, including any collection data.
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const mapId = req.params.id;
        
        // Fetch map data from Firestore
        const mapDoc = await firestore.collection('access_maps').where("_id", "==", mapId).get();
        if (!mapDoc.exists) {
            throw new NotFoundError('Map not found');
        }

        const mapData = mapDoc.data();

        // Fetch researchers' data
        const researchers = [];
        for (const researcherId of mapData.researchers) {
            const researcherDoc = await firestore.collection('users').where("_id", "==", researcherId).get();
            if (researcherDoc.exists) {
                researchers.push(researcherDoc.data());
            }
        }

        // Fetch sharedData information
        let sharedData = null;
        if (mapData.sharedData) {
            const sharedDataDoc = await firestore.collection('access_collections').doc(mapData.sharedData).get();
            if (sharedDataDoc.exists) {
                sharedData = sharedDataDoc.data();
                // Populate the 'area' field if available
                if (sharedData.area) {
                    const areaDoc = await firestore.collection('areas').doc(sharedData.area).get();
                    if (areaDoc.exists) {
                        sharedData.area = areaDoc.data();
                    }
                }
            }
        }

        // Construct the response object
        const response = {
            _id: mapId,
            title: mapData.title,
            researchers: researchers,
            project: mapData.project,
            sharedData: sharedData,
            date: mapData.date,
            maxResearchers: mapData.maxResearchers,
            data:  mapData.data
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

//route signs team member up to a time slot.
/*router.put('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    map = await Map.findById(req.params.id)
    project = await Project.findById(map.project)
    user = await req.user
    if(map.researchers.length < map.maxResearchers)
        // adding an await in if statement below causes unwanted behavior.  Reason unkown
        if(Team.isUser(project.team,user._id)){
            res.status(200).json(await Map.addResearcher(map._id,user._id))
        }
        else
            throw new UnauthorizedError('You do not have permision to perform this operation')
    else 
        throw new BadRequestError('Research team is already full')
})*/

//route signs team member up to a time slot.
router.put('/:id/claim', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const mapId = req.params.id;

        // Query the maps collection to find the document with the matching _id field
        const mapQuery = await firestore.collection('access_maps').where("_id", "==", mapId).get();

        if (mapQuery.empty) {
            throw new NotFoundError('Map not found');
        }

        const mapDoc = mapQuery.docs[0]; // Assuming only one document matches the query
        const mapData = mapDoc.data();

        // Query the projects collection to find the document with the matching _id field
        const projectQuery = await firestore.collection('projects').where("_id", "==", mapData.project).get();
        
        if (projectQuery.empty) {
            throw new NotFoundError('Project not found');
        }

        const projectDoc = projectQuery.docs[0]; // Assuming only one document matches the query

        const user = req.user;


        if (mapData.researchers.length < mapData.maxResearchers) {
            const teamRef = firestore.collection('teams').where("_id", "==", projectDoc.data().team);
            const teamSnapshot = await teamRef.get();

            if (!teamSnapshot.exists || !teamSnapshot.data().members.includes(user._id)) {
                throw new UnauthorizedError('You do not have permission to perform this operation');
            }

            // Update the map document to add the user to the researchers array
            await mapDoc.ref.update({
                researchers: firestore.FieldValue.arrayUnion(user._id)
            });

            res.status(200).json({ message: 'User successfully added to the time slot' });
        } else {
            throw new BadRequestError('Research team is already full');
        }
    } catch (error) {
        next(error);
    }
}) // This function is miss isUser call from teams

//route reverses sign up to a time slot.
/*router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    map = await Map.findById(req.params.id)
    project = await Project.findById(map.project)
    return res.status(200).json(await Map.removeResearcher(map._id,user._id))

})*/

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const mapId = req.params.id;

        // Query the maps collection to find the document with the matching _id field
        const mapQuery = await firestore.collection('access_maps').where("_id", "==", mapId).get();

        if (mapQuery.empty) {
            throw new NotFoundError('Map not found');
        }

        const mapDoc = mapQuery.docs[0]; // Assuming only one document matches the query
        const mapData = mapDoc.data();

        // Query the projects collection to find the document with the matching _id field
        const projectQuery = await firestore.collection('projects').where("_id", "==", mapData.project).get();
        
        if (projectQuery.empty) {
            throw new NotFoundError('Project not found');
        }

        const user = req.user;

        // Remove the user from the list of researchers in the map document
        await mapDoc.ref.update({
            researchers: firestore.FieldValue.arrayRemove(user._id)
        });

        res.status(200).json({ message: 'User successfully removed from the time slot' });
    } catch (error) {
        next(error);
    }
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
router.post('/:id/data', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    map = await Map.findById(req.params.id)
    if(Map.isResearcher(map._id, user._id)){
        if(req.body.entries){
            for(var i = 0; i < req.body.entries.length; i++){
                await Map.addEntry(map._id,req.body.entries[i])
            } 
            res.status(201).json(await Map.findById(map._id))
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