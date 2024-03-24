const express = require('express')
const router = express.Router()
const Survey = require('../models/surveys.js')
const Project = require('../models/projects.js')
const Survey_Collection = require('../models/survey_collections.js')
const Team = require('../models/teams.js')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { models } = require('mongoose')
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");

const { UnauthorizedError, BadRequestError } = require('../utils/errors')
const {SURVEYS, SURVEY_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createMaps(req, SURVEYS, SURVEY_COLS));
  }
);

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, SURVEYS, SURVEY_COLS));
  }
);

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, SURVEYS, SURVEY_COLS));
  }
);

//route reverses sign up to a time slot.
router.delete('/:id/claim', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    survey  = await Survey.findById(req.params.id)
    project = await Project.findById(survey.project)
    return res.status(200).json(await Survey.removeResearcher(survey._id,user._id))

})

//route edits time slot information when updating a survey
router.put('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    survey  = await Survey.findById(req.params.id)
    
    let newSurvey = new Survey({
        title: (req.body.title ? req.body.title : survey.title),
        date: (req.body.date ? req.body.date : survey.date),
        maxResearchers: (req.body.maxResearchers ? req.body.maxResearchers : survey.maxResearchers),
    })

    project = await Project.findById(survey.project)

    if (await Team.isAdmin(project.team,user._id)){
        res.status(201).json(await Survey.updateSurvey(req.params.id,newSurvey))
    }

    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    
})

//route deletes a survey from a test collection
router.delete('/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
    user = await req.user
    survey  = await Survey.findById(req.params.id)
    project = await Project.findById(survey.project)
    if(await Team.isAdmin(project.team,user._id)){
        res.json(await Survey_Collection.deleteSurvey(survey.sharedData,survey._id))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }

})

//route adds survey to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.addTestData(req, SURVEY, SURVEY_COLS));
  }
);

//route deletes an individual time slot from a survey
router.delete('/:id/data/:data_id',passport.authenticate('jwt',{session:false}), async (req, res, next) => { 
    user = await req.user
    survey = await Survey.findById(req.params.id)
    if(Survey.isResearcher(survey._id, user._id)){
        res.json(await Survey.deleteEntry(survey._id,req.params.data_id))
    }
    else{
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
})


module.exports = router
