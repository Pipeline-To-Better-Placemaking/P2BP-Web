const express = require("express");
const router = express.Router();
const Map = require("../models/sound_maps.js");
const Project = require("../models/projects.js");
const Sound_Collection = require("../models/sound_collections.js");
const Team = require("../models/teams.js");
const Points = require("../models/standing_points.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { models } = require("mongoose");
const routeDBfoos = require("../databaseFunctions/RouteFunctions.js");

const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const {SOUND_MAPS, SOUND_COLS} = require('../databaseFunctions/CollectionNames.js');

//route creates new map(s).  If there are multiple time slots in test, multiple timseslots are created.
router.post("", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.createMaps(req, SOUND_MAPS, SOUND_COLS));
  }
);

//route gets all map data, including any collection data.
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.getMapData(req, SOUND_MAPS, SOUND_COLS));
  }
);

//route signs team member up to a time slot.
router.put("/:id/claim", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.assignTimeSlot(req, SOUND_MAPS, SOUND_COLS));
  }
);

//route reverses sign up to a time slot.
router.delete(
  "/:id/claim",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    map = await Map.findById(req.params.id);
    project = await Project.findById(map.project);
    return res.status(200).json(await Map.removeResearcher(map._id, user._id));
  }
);

//route edits time slot information when updating a map
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    user = await req.user;
    map = await Map.findById(req.params.id);
    if (await Team.isAdmin(project.team, user._id)) {

      let newMap = new Map({
        title: req.body.title ? req.body.title : map.title,
        date: req.body.date ? req.body.date : map.date,
        maxResearchers: req.body.maxResearchers
          ? req.body.maxResearchers
          : map.maxResearchers,
        standingPoints: req.body.standingPoints
          ? req.body.standingPoints
          : map.standingPoints,
      });

      project = await Project.findById(map.project);

      //if standing points are changed, any new points get referenced, before any old points get dereferenced.
      //done in this order so points never reach 0 and get deleted in removeRefrence()
      if (req.body.standingPoints) {
        for (var i = 0; i < req.body.standingPoints.length; i++)
          await Points.addRefrence(req.body.standingPoints[i]);

        for (var i = 0; i < map.standingPoints.length; i++)
          await Points.removeRefrence(map.standingPoints[i]);
    }

        const updatedMap = await Map.updateMap(req.params.id,newMap)
        res.status(201).json(updatedMap)

    } else {
      throw new UnauthorizedError(
        "You do not have permision to perform this operation"
      );
    }
  }
);

//route deletes a map from a test collection
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    user = await req.user;
    map = await Map.findById(req.params.id);
    project = await Project.findById(map.project);
    if (await Team.isAdmin(project.team, user._id)) {
      res.json(await Sound_Collection.deleteMap(map.sharedData, map._id));
    } else {
      throw new UnauthorizedError(
        "You do not have permision to perform this operation"
      );
    }
  }
);

//route adds test data to its relevant time slot
//route adds test data to its relevant time slot
router.post("/:id/data", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    res.status(200).json(await routeDBfoos.addTestData(req, SOUND_MAPS, SOUND_COLS));
  }
);

//route edits any already created tested time slots.  Essentially redoing a test run for a time slot 
router.put(
  "/:id/data/:data_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    user = await req.user;
    mapId = req.params.id;
    //adding await causes unwanted behavior.  Reason unkown
    if (Map.isResearcher(mapId, user._id)) {
      oldData = await Map.findData(mapId, req.params.data_id);

      const newData = {
        _id: oldData._id,
        decibel_1: req.body.decibel_1 ? req.body.decibel_1 : oldData.decibel_1,
        decibel_2: req.body.decibel_2 ? req.body.decibel_2 : oldData.decibel_2,
        decibel_3: req.body.decibel_3 ? req.body.decibel_3 : oldData.decibel_3,
        decibel_4: req.body.decibel_4 ? req.body.decibel_4 : oldData.decibel_4,
        decibel_5: req.body.decibel_5 ? req.body.decibel_5 : oldData.decibel_5,
        average: req.body.average ? req.body.average : oldData.average,
        sound_type: req.body.sound_type
          ? req.body.sound_type
          : oldData.sound_type,
        standingPoint: req.body.standingPoint
          ? req.body.standingPoint
          : oldData.standingPoint,
        time: req.body.time ? req.body.time : oldData.time,
      };

      if (req.body.sound_type.length > 1)
        throw new BadRequestError(
          "Datapoints can only have one predominant sound type"
        );

      //it is important to note that standingPoint != standingPoints.  standingPoint is an individual point which an instance
      //of a time slot uses.  standingPoints is an array which includes all of these points.  
      if (req.body.standingPoint) {
        await Points.addRefrence(req.body.standingPoint);
        await Points.removeRefrence(oldData.standingPoint);
      }

      await Map.updateData(mapId, oldData._id, newData);
      res.status(201).json(await Map.findById(req.params.id));
    } else {
      throw new UnauthorizedError(
        "You do not have permision to perform this operation"
      );
    }
  }
);

//route deletes an individual time slot from a map
router.delete(
  "/:id/data/:data_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    user = await req.user;
    map = await Map.findById(req.params.id);
    if (Map.isResearcher(map._id, user._id)) {
      res.json(await Map.deleteEntry(map._id, req.params.data_id));
    } else {
      throw new UnauthorizedError(
        "You do not have permision to perform this operation"
      );
    }
  }
);

module.exports = router;
