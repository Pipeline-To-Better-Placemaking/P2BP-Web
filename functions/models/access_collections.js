const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Access_Maps = require('./access_maps.js')
const Area = require('../models/areas.js')
const { firebase } = require('googleapis/build/src/apis/firebase/index.js')

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
    return await Collection.updateOne(
        { _id: collectionId },
        { $pull: { maps: mapId}}
    )

}

module.exports.deleteCollection = async function(collectionId){
    // based on: https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js
    collection = await firebase.collection(collectionId) // find collection ref
    await Area.removeRefrence(collection.area) // call function to decrease references to the area, might need to change ".area"

    collection.docs.forEach((doc) => { // for each doc/map in the collection :
        collection.doc(doc).delete() // calls the delete function for the doc
    })

    // Unnecessary since FB collections are deleted when they have no documents, can just return void
    return await Collection.findByIdAndDelete(collectionId)
}

module.exports.addActivity = async function(collectionId, mapId){
    return await Collection.updateOne(
        { _id: collectionId },
        { $push: { maps: mapId}}
    )
}

module.exports.updateCollection = async function(collectionId, newCollection){
    return await Collection.updateOne(
        { _id: collectionId },
        { $set: {
            title: newCollection.title,
            date: newCollection.date,
            area: newCollection.area,
            duration: newCollection.duration
        }}
    )
}