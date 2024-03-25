const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Access_Maps = require('./access_maps.js')
const Area = require('../models/areas.js')

// Document Schema for Access Collections.  Maps references Access Maps Schema
const collection_schema = mongoose.Schema({
    title: String,

    date: {
    //area the project will occur in (areas.js)
        type: Date,
        required: true
    },
    area: {
        type: ObjectId,
        required: true,
        ref: 'Areas'
    },

    //duration of the test
    duration: {
        type: Number,
        required: true,
        default: 15
    },

    //maps that are for this test
    maps: [{
        type: ObjectId,
        ref: 'Access_Maps'
    }]
})
//end

const Collection = module.exports = mongoose.model('Access_Collections', collection_schema)

module.exports.deleteMap = async function(collectionId, mapId){
    await Access_Maps.deleteMap(mapId)
    // Do we still need anything below, because I'm pretty sure Firestore just handles the deleted items
    firestore.collection(collectionId).doc(mapId).delete()
}

module.exports.deleteCollection = async function(collectionId){
    // based on: https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js
    collectionRef = await firestore.collection(collectionId) // find collection ref
    await Area.removeRefrence(collectionRef.area) // call function to decrease references to the area, might need to change ".area"

    collectionRef.docs.forEach((doc) => { // for each doc/map in the collection :
        collectionRef.doc(doc).delete() // calls the delete function for the doc
    })

    // Unnecessary since FB collections are deleted when they have no documents, can just return void
        // but don't know how this interacts where it is called
    return await Collection.findByIdAndDelete(collectionId)
}

module.exports.addActivity = async function(collectionId, mapId){
    // adds mapId to collection with collectionId
    return await firestore.collection(collectionId).add({
        maps: mapId
    })
}

module.exports.updateCollection = async function(collectionId, newCollection){
    const oldCollection = await firestore.collection(collectionId)
    if (oldCollection.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionId + " collection")
    }
    oldCollection.set({
        title: newCollection.title,
        date: newCollection.date,
        area: newCollection.area,
        duration: newCollection.duration
    })
}