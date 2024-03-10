const reference = require('./ReferenceFunctions.js');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
const refDBfoos = require('../databaseFunctions/ReferenceFunctions.js');
const firestore = require('../firestore');
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
        SECTION_COLS,
        SECTION_MAPS,
        SOUND_COLS,
        SOUND_MAPS,
        STATIONARY_COLS,
        STATIONARY_MAPS,
        SURVEYS,
        SURVEY_COLS,
} = require('../databaseFunctions/CollectionNames.js');

module.exports.deleteCollection = async function(docId, collection) {
    const obj = await basicDBfoos.getObj(docId, collection);
    console.log(obj);
    // await refDBfoos.removeReference(obj.area, AREAS);
    console.log(collection);
    const map = colToMap(collection);
    console.log(map);
    for(var i = 0; i < obj.maps.length; i++) {
        await basicDBfoos.deleteObj(obj.maps[i], map);
    }
    await basicDBfoos.deleteObj(obj._id, collection);
};

// Different from getObj in that it fills in the area and maps with actual data and not a reference.
module.exports.getCollection = async function(id, route) {
    let col = "";
    let map = "";
    switch(route) {
        case "access":
            col = ACCESS_COLS;
            map = ACCESS_MAPS;
            break;
        case "boundaries":
            col = BOUNDARIES_COLS;
            map = BOUNDARIES_MAPS;
            break;
        case "light":
            col = LIGHT_COLS;
            map = LIGHT_MAPS;
            break;
        case "moving":
            col = MOVING_COLS;
            map = MOVING_MAPS;
            break;
        case "nature":
            col = NATURE_COLS;
            map = NATURE_MAPS;
            break;
        case "order":
            col = ORDER_COLS;
            map = ORDER_MAPS;
            break;
        case "program":
            col = PROGRAM_COLS;
            map = PROGRAM_MAPS;
            break;
        case "section":
            col = SECTION_COLS;
            map = SECTION_MAPS;
            break;
        case "sound":
            col = SOUND_COLS;
            map = SOUND_MAPS;
            break;
        case "stationary":
            col = STATIONARY_COLS;
            map = STATIONARY_MAPS;
            break;
        case "survey":
            col = SURVEY_COLS;
            map = SURVEYS;
            break;
        default:
            throw new UnauthorizedError(route + " is an invalid collection");
    }
    console.log(col);
    const obj = await basicDBfoos.getObj(id, col);
    const objArea = await basicDBfoos.getObj(obj.area, AREAS);
    let maps = new Array(obj.maps.length);
    for (let i = 0; i < obj.maps.length; i++) {
        maps[i] = await basicDBfoos.getObj(obj.maps[i], map);
    }
    obj.area = objArea;
    obj.maps = maps;
    return obj;
};

// Sometimes we need to corelate a collection name to a map name

const colToMap = function(collection) {
        switch(collection) {
        case ACCESS_COLS:
            return ACCESS_MAPS;
        case BOUNDARIES_COLS:
            return BOUNDARIES_MAPS;
        case LIGHT_COLS:
            return LIGHT_MAPS;
        case MOVING_COLS:
            return MOVING_MAPS;
        case NATURE_COLS:
            return NATURE_MAPS;
        case ORDER_COLS:
            return ORDER_MAPS;
        case PROGRAM_COLS:
            return PROGRAM_MAPS;
        case SECTION_COLS:
            return SECTION_MAPS;
        case SOUND_COLS:
            return SOUND_MAPS;
        case STATIONARY_COLS:
            return STATIONARY_MAPS;
        case SURVEY_COLS:
            return SURVEYS;
        default:
            throw new UnauthorizedError(collection + " is an invalid collection");
    };

module.exports.colToMap = colToMap;
}
