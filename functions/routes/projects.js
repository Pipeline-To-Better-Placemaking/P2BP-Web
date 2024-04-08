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
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const projectDBfoos = require('../databaseFunctions/ProjectFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const {
        AREAS,
        ACCESS_COLS,
        ACCESS_MAPS,
        BOUNDARIES_COLS,
        BOUNDARIES_MAPS,
        LIGHT_COLS,
        LIGHT_MAPS,
        MOVING_COLS,
        MOVING_MAPS,
        NATURE_COLS,
        NATURE_MAPS,
        ORDER_COLS,
        ORDER_MAPS,
        PROGRAM_COLS,
        PROGRAM_MAPS,
        PROJECTS,
        SECTION_COLS,
        SECTION_MAPS,
        SOUND_COLS,
        SOUND_MAPS,
        STANDING_POINTS,
        STATIONARY_COLS,
        STATIONARY_MAPS,
        SURVEYS,
        SURVEY_COLS,
        TEAMS,
} = require('../databaseFunctions/CollectionNames.js');

const passport = require('passport')
const jwt = require('jsonwebtoken')
const emailer = require('../utils/emailer')

const { models } = require('mongoose')
const { projectExport } = require('../utils/xlsx_exports')


const { BadRequestError, InternalServerError, UnauthorizedError } = require('../utils/errors')

// New project
router.post('', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    console.log("MAKING NEW PROJECT");
    let teamId;
    if (req.body.team._id) {
        teamId = req.body.team._id;
    } else {
        teamId = req.body.team
    }
    const points = req.body.points;
    if(points < 3) {
        throw new BadRequestError('Areas require at least three points');
    }
    const user = await req.user;
    const authorized = await userDBfoos.isAdmin(teamId, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }

    let newArea = {
        _id: basicDBfoos.createId(),
        title: "Project Perimeter",
        points: points
    }
    await basicDBfoos.addObj(newArea, "areas");

    let pointIds = []
    for(let i = 0; i < req.body.standingPoints.length; i++) {
        let newPoint = {
            _id: basicDBfoos.createId(),
            longitude: req.body.standingPoints[i].longitude,
            latitude: req.body.standingPoints[i].latitude,
            title: req.body.standingPoints[i].title
        }

        await basicDBfoos.addObj(newPoint, "standing_points");
        pointIds[i] = newPoint._id;
    }

    const newProject = {
        _id: basicDBfoos.createId(),
        title: req.body.title,
        description: req.body.description,
        area: newArea._id,
        subareas: [newArea._id],
        standingPoints: pointIds,
        team: teamId,
    }
    const project = await basicDBfoos.addObj(newProject, "projects");
    arrayDBfoos.addArrayElement(teamId, "projects", TEAMS, newProject._id);
    console.log(newProject);
    res.status(201).json(newProject);
})

// Get data
router.get('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    console.log("GETENDPOINT");
    const projectId = req.params.id;
    console.log(projectId);
    let project = await basicDBfoos.getObj(projectId, PROJECTS);
    console.log(project);
    let area = await basicDBfoos.getObj(project.area, AREAS);
    console.log(project.area);
    area._id = project.area;
    project.area = area;
    project.accessCollections     = await refDBfoos.getAllRefs(project.accessCollections, ACCESS_COLS);
    project.boundariesCollections = await refDBfoos.getAllRefs(project.boundariesCollections, BOUNDARIES_COLS);
    project.lightCollections      = await refDBfoos.getAllRefs(project.lightCollections, LIGHT_COLS);
    project.movingCollections     = await refDBfoos.getAllRefs(project.movingCollections, MOVING_COLS);
    project.natureCollections     = await refDBfoos.getAllRefs(project.natureCollections, NATURE_COLS);
    project.orderCollections      = await refDBfoos.getAllRefs(project.orderCollections, ORDER_COLS);
    project.programCollections    = await refDBfoos.getAllRefs(project.programCollections, PROGRAM_COLS);
    project.sectionCollections    = await refDBfoos.getAllRefs(project.sectionCollections, SECTION_COLS);
    project.soundCollections      = await refDBfoos.getAllRefs(project.soundCollections, SOUND_COLS);
    project.standingPoints        = await refDBfoos.getAllRefs(project.standingPoints, STANDING_POINTS);
    project.stationaryCollections = await refDBfoos.getAllRefs(project.stationaryCollections, STATIONARY_COLS);
    project.subareas              = await refDBfoos.getAllRefs(project.subareas, AREAS);
    project.surveyCollections     = await refDBfoos.getAllRefs(project.surveyCollections, SURVEY_COLS);
    res.json(project);
})

// update
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user
    const projectId = req.params.id;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    console.log(project.area);

    let newProject = {
        title: (req.body.title ? req.body.title : project.title),
        description: (req.body.description ? req.body.description : project.description),
        area: (req.body.area ? req.body.area : project.area),
    }

    console.log(newProject.area);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if (!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    if (newProject.area > project.subareas.length){
        throw new BadRequestError('Cannot set main area to non-existant subarea')
    }
    await basicDBfoos.updateObj(project._id, newProject, PROJECTS);
    console.log("Hit");
    res.status(201).json({});
})

// Delete project
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const projectId = req.params.id;
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
    await arrayDBfoos.removeArrayElement(project.team, project._id, "projects", TEAMS);
    res.json(await projectDBfoos.deleteProject(project._id));
})

//
router.post('/:id/areas', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
    if(req.body.points.length < 3) {
        throw new BadRequestError('Areas require at least three points');
    }

    const newArea = {
        _id: basicDBfoos.createId(),
        title: req.body.title,
        points: req.body.points,
    }
    await basicDBfoos.addObj(newArea, "areas");
    res.json(newArea);
})

router.put('/:id/areas/:areaId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
    let newArea = {
        _id: req.params.areaId,
        title: (req.body.title ? req.body.title :  area.title),
        points: (req.body.points ? req.body.points : area.points),
    }
    await basicDBfoos.updateObj(req.params.areaId, newArea, AREAS);
    res.status(201).json(newArea);
})

router.delete('/:id/areas/:areaId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    await arrayDBfoos.removeArrayElement(req.params.id, req.params.areaId, "subareas", PROJECTS);
    res.status(201).json({});
})

// Creates new point
router.post('/:id/standing_points', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
    const newPoint = {
        _id: basicDBfoos.createId(),
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        title: req.body.title,
        refCount: 1
    }
    await arrayDBfoos.addArrayElement(project._id, "standingPoints", PROJECTS, newPoint._id);
    res.json(newPoint);
})

// Edits a point
router.put('/:id/standing_points/:pointId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const point = await basicDBfoos.getObj(req.params.pointId, STANDING_POINTS);
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

    let newPoint = {
        title: (req.body.title ? req.body.title :  point.title),
        latitude: (req.body.latitude ? req.body.latitude : point.latitude),
        longitude: (req.body.longitude ? req.body.longitude : point.longitude)
    }
    console.log(newPoint);
    console.log(req.params.pointId);
    await basicDBfoos.updateObj(req.params.pointId, newPoint, STANDING_POINTS);
    res.status(201).json(newPoint);
})

// Deletes
router.delete('/:id/standing_points/:pointId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);
    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }
    await arrayDBfoos.removeArrayElement(project._id, req.params.pointId, "standingPoints", PROJECTS);
    await refDBfoos.removeReference(req.params.pointId, STANDING_POINTS);
    res.status(201).json({});
})

router.post('/:id/stationary_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, STATIONARY_COLS, "stationaryCollections");
    res.json(newCollecton);
})

router.put('/:id/stationary_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, STATIONARY_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/stationary_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, STATIONARY_COLS, collectionId, "stationaryCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/moving_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const user = await req.user;
    const project = await basicDBfoos.getObj(req.params.id, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, user._id);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }

    let newCollection = {
        _id: basicDBfoos.createId(),
        title: req.body.title,
        date: req.body.date,
        area: req.body.area,
        duration: req.body.duration
    }

    await basicDBfoos.addObj(newCollection, "moving_collections");
    await refDBfoos.addReference(newCollection.area, "areas");

    await arrayDBfoos.addArrayElement(project._id, "movingCollections", PROJECTS, newCollection._id);
    res.json(newCollection);
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
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, MOVING_COLS, collectionId, "movingCollections");
    res.status(201).json(newCollecton);
})


router.post('/:id/sound_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, SOUND_COLS, "soundCollections");
    res.json(newCollecton);
})

router.put('/:id/sound_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, SOUND_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/sound_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, SOUND_COLS, collectionId, "soundCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/nature_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, NATURE_COLS, "natureCollections");
    res.json(newCollecton);
})

router.put('/:id/nature_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, NATURE_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/nature_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, NATURE_COLS, collectionId, "natureCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/light_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, LIGHT_COLS, "lightCollections");
    res.json(newCollecton);
})

router.put('/:id/light_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, LIGHT_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/light_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, LIGHT_COLS, collectionId, "lightCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/boundaries_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, BOUNDARIES_COLS, "boundariesCollections");
    res.json(newCollecton);
})

router.put('/:id/boundaries_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, BOUNDARIES_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/boundaries_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, BOUNDARIES_COLS, collectionId, "boundariesCollections");
    res.status(201).json(newCollecton);
})

//POST, PUT, DELETE for section cutter

router.post('/:id/section_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, SECTION_COLS, "sectionCollections");
    res.json(newCollecton);
})

router.delete('/:id/section_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, SECTION_COLS, collectionId, "sectionCollections");
    res.status(201).json(newCollecton);
})


router.put('/:id/section_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, SECTION_COLS, collectionId);
    res.json(newCollecton);
})


router.post('/:id/order_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, ORDER_COLS, "orderCollections");
    res.json(newCollecton);
})

router.put('/:id/order_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, ORDER_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/order_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, ORDER_COLS, collectionId, "orderCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/survey_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, SURVEY_COLS, "surveyCollections");
    res.json(newCollecton);
})

router.put('/:id/survey_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, SURVEY_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/survey_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, SURVEY_COLS, collectionId, "surveyCollections");
    res.status(201).json(newCollecton);
})

router.post('/:id/program_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, PROGRAM_COLS, "programCollections");
    res.json(newCollecton);
})

router.put('/:id/program_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, PROGRAM_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/program_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, PROGRAM_COLS, collectionId, "programCollections");
    res.status(201).json(newCollecton);
})
router.post('/:id/access_collections', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const newCollecton = await projectDBfoos.addMap(userId, projectId, obj, ACCESS_COLS, "accessCollections");
    res.json(newCollecton);
})

router.put('/:id/access_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const obj = req.body;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.editCol(userId, projectId, obj, ACCESS_COLS, collectionId);
    res.json(newCollecton);
})

router.delete('/:id/access_collections/:collectionId', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    const userId = await req.user._id;
    const projectId = req.params.id;
    const collectionId = req.params.collectionId;
    const newCollecton = await projectDBfoos.deleteCol(userId, projectId, ACCESS_COLS, collectionId, "accessCollections");
    res.status(201).json(newCollecton);
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
