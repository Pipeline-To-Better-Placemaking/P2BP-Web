const express = require('express')
const config = require('../utils/config')
const router = express.Router()

const Project = require('../models/projects.js')
const Team = require('../models/teams.js')
const Area = require('../models/areas.js')
const Standing_Point = require('../models/standing_points.js')
const Stationary_Collection = require('../models/stationary_collections.js')
const Moving_Collection = require('../models/moving_collections.js')
const Survey_Collection = require('../models/survey_collections.js')
const Sound_Collection = require('../models/sound_collections.js')
const Nature_Collection = require('../models/nature_collections.js')
const Light_Collection = require('../models/light_collections.js')
const Boundaries_Collection = require('../models/boundaries_collections.js')
const Order_Collection = require('../models/order_collections.js')
const Access_Collection = require('../models/access_collections.js')
const Section_Collection = require('../models/section_collections.js')
const Program_Collection = require('../models/program_collections.js')

const passport = require('passport')
const jwt = require('jsonwebtoken')
const emailer = require('../utils/emailer')

const { models } = require('mongoose')
const { projectExport } = require('../utils/xlsx_exports')


const { BadRequestError, InternalServerError, UnauthorizedError } = require('../utils/errors')

router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user// isolate the user passed in from the client's request

    if(await Team.isAdmin(req.body.team,user._id)){// check if the user is the team admin

        if(req.body.points < 3)// check that the project has enough points to define an area
            throw new BadRequestError('Areas require at least three points')

        let newArea = new Area({// create an area object (perimeter)
            title: "Project Perimeter",
            points: req.body.points
        })
        await newArea.save()// CHANGE save the new area to the projects collection

        var pointIds = []// put the request field's standing points (coordinates and titles) into an array and save to the projects collection
        for(var i = 0; i < req.body.standingPoints.length; i++){
            let newPoint = new Standing_Point({
                longitude: req.body.standingPoints[i].longitude,
                latitude: req.body.standingPoints[i].latitude,
                title: req.body.standingPoints[i].title
            })

            await newPoint.save()// CHANGE
            pointIds[i] = newPoint._id
        }
        let newProject = new Project({// create a project document and call .addProject() with it (which just saves it like above)
            title: req.body.title,
            description: req.body.description,
            area: newArea._id,
            subareas: [newArea._id],
            standingPoints: pointIds,
            team: req.body.team,
        })

        const project = await Project.addProject(newProject)

        await Team.addProject(req.body.team,project._id)// updates the project - that is, adds it and updates it in case it already exists
        res.status(201).json(project)//responds with a "successful creation" status code and a json format of the new project
    }
    else{// user isn't an admin, throw an error
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }   
})

router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    res.json(await Project.findById(req.params.id)
                          .populate('area')
                          .populate('subareas')
                          .populate('standingPoints')
                          .populate('stationaryCollections')
                          .populate('movingCollections')
                          .populate('soundCollections')
                          .populate('natureCollections')
                          .populate('lightCollections')
                          .populate('boundariesCollections')
                          .populate('orderCollections')
                          .populate('surveyCollections')
                          .populate('sectionCollections')
                          .populate('accessCollections')
                          .populate('programCollections')
                          
            )
})

router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user   
    project = await Project.findById(req.params.id)
    let newProject = new Project({
        title: (req.body.title ? req.body.title : project.title),
        description: (req.body.description ? req.body.description : project.description),
        area: (req.body.area ? req.body.area : project.area),
    })

    if (await Team.isAdmin(project.team,user._id)){
        if (newProject.area > project.subareas.length){
            throw new BadRequestError('Cannot set main area to non-existant subarea')
        }
        else{
            res.status(201).json(await Project.updateProject(req.params.id,newProject))
        }
    }  
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    if(await Team.isAdmin(project.team,user._id)){
        await Team.removeProject(project.team,project._id)
    
        res.json(await Project.deleteProject(project._id))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

router.post('/:id/areas', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user// get the user and project details from the request
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){// check if the user is a member of the team that the project belongs to

        if(req.body.points.length < 3)// make sure there are three points
            throw new BadRequestError('Areas require at least three points')
        
        let newArea = new Area({// if there are three points then create an area and save it to the projects collection
            title: req.body.title,
            points: req.body.points
        })

        newArea.save()// CHANGE

        await Project.addArea(project._id,newArea._id)//call add area
        res.json(newArea)//return the newArea as a json (does this also need an HTTP code?)
    }
    else{// Throw error, user is trying to access a team project they aren't a member of
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/areas/:areaId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    area = await Area.findById(req.params.areaId)
    
    if(await Team.isAdmin(project.team,user._id)){

        let newArea = new Area({
            title: (req.body.title ? req.body.title :  area.title),
            points: (req.body.points ? req.body.points : area.points)
        })

        res.status(201).json(await Area.updateArea(req.params.areaId, newArea))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/areas/:areaId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    if(await Team.isAdmin(project.team,user._id)){
        res.status(201).json(await Project.deleteArea(project._id,req.params.areaId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/standing_points', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user// get the user and project details from the request
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){// check if the user is a member of the team that the project belongs to

        let newPoint = new Standing_Point({// create a standing point and try to save it to a collection
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            title: req.body.title,
            refCount: 1
        })
        newPoint.save(function (error) {// CHANGE
            console.log("Saving a point");// update the console log with progress
            if (error) {
              console.log("ERROR SAVING POINT: " + error);
            } else {
              console.log("New Point " + newPoint + " successfully added");
            }
        })
       
        await Project.addPoint(project._id,newPoint._id)// call addPoint()
        res.json(newPoint)// return jsaon of new point
    }
    else{// Throw alert, user isn't a team member
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/standing_points/:pointId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    point = await Standing_Point.findById(req.params.pointId)

    if(await Team.isAdmin(project.team,user._id)){
    
        let newPoint = new Standing_Point({
            title: (req.body.title ? req.body.title :  point.title),
            latitude: (req.body.latitude ? req.body.latitude : point.latitude),
            longitude: (req.body.longitude ? req.body.longitude : point.longitude)
        })
  
        res.status(201).json(await Standing_Point.updatePoint(req.params.pointId, newPoint))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/standing_points/:pointId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    if(await Team.isAdmin(project.team,user._id)){
        res.status(201).json(await Project.deletePoint(project._id,req.params.pointId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/stationary_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user // find the user in the request field
    project = await Project.findById(req.params.id) // CHANGE find the project using the projectId in the request field

    if(await Team.isUser(project.team,user._id)){ // check if the user is a member of the team the project belongs to

        let newCollection = new Stationary_Collection({// create an object with the title, date, area, and duration fields from the request field
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save() // CHANGE save it *note, stationary_collection ISN'T the same as a Firebase Collection, it's still a document it just contains an array of the area ids

        await Area.addReference(newCollection.area)// call addRefrence, which should just update the reference count of the newCollection.area

        await Project.addStationaryCollection(project._id,newCollection._id)// pushes the collectionId to the project's stationary collection
        res.json(newCollection)// send back the new collection in json format
    }
    else{// Throw alert, user isn't a team member
        throw new UnauthorizedError('You do not have permision to perform this operation') // throw an error, user isn't allowed to add to this project
    }
})

router.put('/:id/stationary_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Stationary_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        
        let newCollection = new Stationary_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
             await Area.addRefrence(req.body.area)
             await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Stationary_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/stationary_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Stationary_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteStationaryCollection(project._id, req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/moving_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Moving_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addMovingCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/moving_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Moving_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Moving_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Moving_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/moving_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Moving_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteMovingCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


router.post('/:id/sound_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Sound_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addSoundCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/sound_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Sound_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Sound_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Sound_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/sound_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Sound_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteSoundCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


router.post('/:id/nature_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Nature_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addNatureCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/nature_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Nature_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Nature_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Nature_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/nature_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Nature_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteNatureCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/light_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Light_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addLightCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/light_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Light_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Light_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Light_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/light_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Light_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteLightCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/boundaries_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Boundaries_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addBoundariesCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/boundaries_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Boundaries_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Boundaries_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Boundaries_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/boundaries_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Boundaries_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteBoundariesCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

//POST, PUT, DELETE for section cutter

router.post('/:id/section_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){

        let newCollection = new Section_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addSectionCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/section_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Section_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteSectionCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


router.put('/:id/section_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Section_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Section_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Section_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


router.post('/:id/order_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Order_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addOrderCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/order_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Order_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        
        let newCollection = new Order_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Order_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/order_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Order_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteOrderCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/survey_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Survey_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)
       
        await Project.addSurveyCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/survey_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Survey_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
    
        let newCollection = new Survey_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Survey_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/survey_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Survey_Collection.findById(req.params.collectionId)
    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteSurveyCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/program_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await (Team.isUser(project.team,user._id) || Team.isOwner(project.team, user._id) || Team.isAdmin(project.team, user._id))){   

        let newCollection = new Program_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addProgramCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/program_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Program_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){


        let newCollection = new Program_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }

        res.status(201).json(await Program_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/program_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Program_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteProgramCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.post('/:id/access_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)// CHANGE

    if(await Team.isUser(project.team,user._id)){   

        let newCollection = new Access_Collection({
            title: req.body.title,
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration
        })

        await newCollection.save()// CHANGE

        await Area.addReference(newCollection.area)

        await Project.addAccessCollection(project._id,newCollection._id)
        res.json(newCollection)
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.put('/:id/access_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Access_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        let newCollection = new Access_Collection({
                title: (req.body.title ? req.body.title : collection.title),
                date: (req.body.date ? req.body.date : collection.date),
                area: (req.body.area ? req.body.area : collection.area),
                duration: (req.body.duration ? req.body.duration : collection.duration)
        })

        if(req.body.area){
            await Area.addRefrence(req.body.area)
            await Area.removeRefrence(collection.area)
        }
  
        res.status(201).json(await Access_Collection.updateCollection(req.params.collectionId, newCollection))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.delete('/:id/access_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    project = await Project.findById(req.params.id)
    collection = await Access_Collection.findById(req.params.collectionId)

    if(await Team.isAdmin(project.team,user._id)){
        await Area.removeRefrence(collection.area)
        res.status(201).json(await Project.deleteAccessCollection(project._id,req.params.collectionId))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})

router.get('/:id/export', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    stationaryData = await Project.findById(req.params.id)
                          .populate('area')
                          .populate([
                            {
                                path:'stationaryCollections',
                                model:'Stationary_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Stationary_Maps',
                                    select: 'date data',                                    
                                    populate: [{
                                        path: 'data',
                                        populate:{
                                            path: 'standingPoint',
                                            model: 'Standing_Points'
                                        }
                                        },{
                                        path: 'researchers'
                                        }]
                                   },{
                                    path: 'area',
                                   }]
                             }])
    movingData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'movingCollections',
                                model:'Moving_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Moving_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        populate:{
                                            path: 'standingPoint',
                                            model: 'Standing_Points'
                                        }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])
    soundData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'soundCollections',
                                model:'Sound_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Sound_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        populate:{
                                            path: 'standingPoint',
                                            model: 'Standing_Points'
                                        }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])
    boundariesData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'boundariesCollections',
                                model:'Boundaries_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Boundaries_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])
    
    sectionData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'sectionCollections',
                                model:'Section_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Section_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])
    

    natureData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'natureCollections',
                                model:'Nature_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Nature_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])                                                               
    lightData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'lightCollections',
                                model:'Light_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Light_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },
                                        {
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])                            
                         
    orderData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'orderCollections',
                                model:'Order_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Order_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])                            
                                                            
    surveyData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'surveyCollections',
                                model:'Survey_Collections',
                                populate: [{
                                    path: 'surveys',
                                    model: 'Surveys',
                                    select: 'date key',
                                    populate: {
                                        path: 'researchers'
                                        }
                                },{
                                    path: 'area',
                                    }]
                                }])
    accessData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path: 'accessCollections',
                                model: 'Access_Collections',
                                populate: [{
                                    path:'maps',
                                    model:'Access_Maps',
                                    select: 'date',
                                    populate:[{
                                        path: 'data',
                                    },{
                                        path: 'researchers'
                                    }]
                                },{
                                    path: 'area',
                                }]
                            }])
    
    programData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'programCollections',
                                model:'Program_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Program_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        populate:{
                                            path: 'floors',
                                            populate:{
                                                path: 'programs'
                                            }
                                        }
                                        },{
                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                }])

    sectionData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'sectionCollections',
                                model:'Section_Collections',
                                populate: [{
                                    path:'maps',
                                    model:'Section_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        populate:{
                                            path: 'standingPoint',
                                            model: 'Standing_Points'
                                        }
                                        },{
                                            path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]    
                                        }])
    
    accessData = await Project.findById(req.params.id)
                            .populate('area')
                            .populate([
                            {
                                path:'accessCollections',
                                model:'Access_Collections',
                                populate: [{
                                    path: 'maps',
                                    model: 'Access_Maps',
                                    select: 'date',
                                    populate: [{
                                        path: 'data',
                                        // populate:{
                                        //     path: 'standingPoint',
                                        //     model: 'Standing_Points'
                                        // }
                                        },
                                        {

                                        path: 'researchers'
                                        }]
                                    },{
                                    path: 'area',
                                    }]
                                        }])                                
    programData = await Project.findById(req.params.id)
                                .populate('area')
                                .populate([
                                {
                                    path:'programCollections',
                                    model:'Program_Collections',
                                    populate: [{
                                        path: 'maps',
                                        model: 'Program_Maps',
                                        select: 'date',
                                        populate: [{
                                            path: 'data',
                                            populate:{
                                                path: 'floors',
                                                populate:{
                                                    path: 'programs'
                                                }
                                            }
                                            },{
                                            path: 'researchers'
                                            }]
                                        },{
                                        path: 'area',
                                        }]
                                    }])

    const emailHTML = `
        <h3>Hello from Pipeline to Better Placemaking!</h3>
        <p>You have requested a copy of project data. Attached is a csv formatted file representing the data.</p>

    `
    //data gets sent to xlsx exports in utils, which returns an xlsx spreadsheet with all the tests
    //in a type: buffer

    project = await Project.findById(req.params.id)
    const mailOptions = {
        from: `"Pipeline to Better Placemaking" <${config.PROJECT_EMAIL}>`,
        to: req.user.email,
        subject: project.title + ' Data Export',
        text: `Attached is your data`,
        html: emailHTML,
        attachments: [
            {
                filename: 'PlaceProject.xlsx',
                content: projectExport(stationaryData, movingData, soundData, natureData, lightData, orderData, boundariesData, programData, accessData, sectionData)
            }
        ]
    }

    if (!await emailer.sendEmail(mailOptions)) {
        throw new InternalServerError('The server encountered a problem')
    }

    res.status(200).json({
        success: true,
        message: 'Data export sent; please check your email'
    })
})

module.exports = router;
