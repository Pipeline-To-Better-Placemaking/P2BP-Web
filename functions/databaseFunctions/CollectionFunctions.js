const reference = require('./ReferenceFunctions.js');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');
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

module.exports.deleteCollection = async function(collection){
    // based on: https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js
    collectionRef = await firestore.collection(collection) // find collection ref
    await reference.removeRefrence(collectionRef.area) // call function to decrease references to the area, might need to change ".area"

    collectionRef.docs.forEach((doc) => { // for each doc/map in the collection :
        collectionRef.doc(doc).delete() // calls the delete function for the doc
    })

    // Unnecessary since FB collections are deleted when they have no documents, can just return void
        // but don't know how this interacts where it is called
    return await Collection.findByIdAndDelete(collectionId)
};

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

    const obj = await basicDBfoos.getObj({$oid: id}, col);
    const objArea = await basicDBfoos.getObj(obj.area, AREAS);
    let maps = new Array(obj.maps.length);
    for (let i = 0; i < obj.maps.length; i++) {
        maps[i] = await basicDBfoos.getObj(obj.maps[i], map);
    }
    obj.area = objArea;
    obj.maps = maps;
    return obj;
};
