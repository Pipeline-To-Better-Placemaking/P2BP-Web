const { v4: uuidv4 } = require('uuid');
const firestore = require('../firestore');
const {TEAMS} = require('../databaseFunctions/CollectionNames.js');

const addObj = async function(newObj, collection) {
    console.log(newObj);
    return await firestore.collection(collection).doc().set(newObj);
}

const getObj = async function(docId, collection) {
    let ret = null;
    const obj = await firestore.collection(collection).where('_id', '==', docId).get();
    obj.forEach((doc) => {
        ret = doc.data();
        return;
    });
    return ret;
}

const updateObj = async function (docId, updates, collection) {
    const oldObj = await firestore.collection(collection).where('_id', '==', docId).get();
    if (oldObj.empty)
    {
        throw new Error("Invalid " + collection + "obj");
    }
    let newObj;
    oldObj.forEach(async doc => {
        newObj = await firestore.collection(collection).doc(doc.id).update(updates)
        console.log(newObj);
    });
    return newObj;
}

const deleteObj = async function(docId, collection) {
    const map = await firestore.collection(collection).where('_id', '==', docId).get();
    if (map.empty)
    {
        return;
    }
    map.forEach(async doc => {
        await firestore.collection(collection).doc(doc.id).delete();
    });
    return;
}

const teamCleanup = async function(teamId) {
    const team = await firestore.collection(TEAMS).where('_id', '==', teamId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError('Invalid map');
    }
    team.forEach((doc) => {
        basicDBfoos.deleteObj(doc._id, collection);
    });
}
// Created to make changing how ids are made easier
const createId = function() {
    return uuidv4();
}

module.exports.addObj = addObj;
module.exports.getObj = getObj;
module.exports.updateObj = updateObj;
module.exports.deleteObj = deleteObj;
module.exports.teamCleanup = teamCleanup;
module.exports.createId = createId;
