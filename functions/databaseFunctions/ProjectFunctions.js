const {
        AREAS,
        ACCESS_COLS,
        BOUNDARIES_COLS,
        LIGHT_COLS,
        MOVING_COLS,
        NATURE_COLS,
        ORDER_COLS,
        PROGRAM_COLS,
        PROJECTS,
        SECTION_COLS,
        SOUND_COLS,
        STANDING_POINTS,
        STATIONARY_COLS,
        STATIONARY_MAPS,
        SURVEY_COLS,
} = require('../databaseFunctions/CollectionNames.js');
const arrayDBfoos = require('../databaseFunctions/ArrayFunctions.js');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const colDBfoos = require('../databaseFunctions/CollectionFunctions.js');
const userDBfoos = require('../databaseFunctions/UserFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');

const { UnauthorizedError, BadRequestError } = require('../utils/errors')

module.exports.deleteProject = async function(projectId) {
    const project = await basicDBfoos.getObj(projectId, PROJECTS);

    await refDBfoos.projectCleanup(project._id, STATIONARY_MAPS);

    for(var i = 0; i < project.subareas.length; i++){
        await basicDBfoos.deleteObj(project.subareas[i], AREAS);
    }
    for(var i = 0; i < project.standingPoints.length; i++) {
        await refDBfoos.removeReference(project.standingPoints[i], STANDING_POINTS);
    }
    if(project.accessCollections) {
        for(var i = 0; i < project.accessCollections.length; i++)
            await colDBfoos.deleteCollection(project.accessCollections[i], ACCESS_COLS);
    }
    if(project.boundariesCollections) {
        for(var i = 0; i < project.boundariesCollections.length; i++)
            await colDBfoos.deleteCollection(project.boundariesCollections[i], BOUNDARIES_COLS);
    }
    if(project.lightCollections) {
        for(var i = 0; i < project.lightCollections.length; i++)
            await colDBfoos.deleteCollection(project.lightCollections[i], LIGHT_COLS);
    }
    if(project.movingCollections) {
        for(var i = 0; i < project.movingCollections.length; i++)
            await colDBfoos.deleteCollection(project.movingCollections[i], MOVING_COLS);
    }
    if(project.natureCollections) {
        for(var i = 0; i < project.natureCollections.length; i++)
            await colDBfoos.deleteCollection(project.natureCollections[i], NATURE_COLS);
    }
    if(project.orderCollections) {
        for(var i = 0; i < project.orderCollections.length; i++)
            await colDBfoos.deleteCollection(project.orderCollections[i], ORDER_COLS);
    }
    if(project.programCollections) {
        for(var i = 0; i < project.programCollections.length; i++)
            await colDBfoos.deleteCollection(project.programCollections[i], PROGRAM_COLS);
    }
    if(project.sectionCollections) {
        for(var i = 0; i < project.sectionCollections.length; i++)
            await colDBfoos.deleteCollection(project.sectionCollections[i], SECTION_COLS);
    }
    if(project.soundCollections) {
        for(var i = 0; i < project.soundCollections.length; i++)
            await colDBfoos.deleteCollection(project.soundCollections[i], SOUND_COLS);
    }
    if(project.stationaryCollections) {
        for(var i = 0; i < project.stationaryCollections.length; i++)
            await colDBfoos.deleteCollection(project.stationaryCollections[i], STATIONARY_COLS);
    }
    if(project.surveyCollections) {
        for(var i = 0; i < project.surveyCollections.length; i++)
            await colDBfoos.deleteCollection(project.surveyCollections[i], SURVEY_COLS);
    }
    return await basicDBfoos.deleteObj(project._id, PROJECTS);
}

module.exports.addMap = async function(userId, projectId, obj, collection, arrayName) {
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, userId);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }

    let newCollection = {
        _id: basicDBfoos.createId(),
        area: obj.area,
        date: obj.date,
        duration: obj.duration,
        maps: [],
        title: obj.title,
    }

    await basicDBfoos.addObj(newCollection, collection);
    await refDBfoos.addReference(newCollection.area, AREAS);

    await arrayDBfoos.addArrayElement(project._id, arrayName, PROJECTS, newCollection._id);
    return newCollection;
}

module.exports.editCol = async function(userId, projectId, obj, collectionName, collectionId) {
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, userId);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation');
    }

    const collection = await basicDBfoos.getObj(collectionId, collectionName);
    const newCollection = {
        title: (obj.title ? obj.title : collection.title),
        date: (obj.date ? obj.date : collection.date),
        area: (obj.area ? obj.area : collection.area),
        duration: (obj.duration ? obj.duration : collection.duration)
    }

    if(obj.area) {
        await refDBfoos.addReference(obj.area, AREAS);
        await refDBfoos.removeReference(collection.area, AREAS);
    }
    await basicDBfoos.updateObj(collectionId, obj, collectionName);

    return {};
}

module.exports.deleteCol = async function(userId, projectId, collectionName, collectionId, arrayName) {
    const project = await basicDBfoos.getObj(projectId, PROJECTS);
    const authorized = await userDBfoos.isAdmin(project.team, userId);

    if(!authorized) {
        throw new UnauthorizedError('You do not have permision to perform this operation')
    }
    const collection = await basicDBfoos.getObj(collectionId, collectionName);

    await colDBfoos.deleteCollection(collectionId, collectionName);
    await arrayDBfoos.removeArrayElement(projectId, collectionId, arrayName, PROJECTS);
    return {};
}
