const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Sound_Maps = require('./sound_maps.js')
const Area = require('./areas.js')
// const { collection } = require('./surveys.js')

// Document Schema for Sound Collections.  Maps references Sound Maps Schema
const collection_schema = mongoose.Schema({
    title: String,
    
    date: {
        type: Date,
        required: true
    },

    area: {
        type: ObjectId,
        required: true,
        ref: 'Areas'
    },

    duration: {
        type: Number,
        required: true,
        default: 15
    },

    maps: [{
        type: ObjectId,
        ref: 'Sound_Maps'
    }]

})
//end

const Collection = module.exports = mongoose.model('Sound_Collections', collection_schema)

module.exports.deleteMap = async function(collectionId, mapId){
    await Sound_Maps.deleteMap(mapId)
    return await Collection.updateOne(
        { _id: collectionId },
        { $pull: { maps: mapId}}
    )

}

module.exports.deleteCollection = async function(collectionId){
    collection = await Collection.findById(collectionId)
    await Area.removeRefrence(collection.area)
    for(var i = 0; i < collection.maps.length; i++)
        await Sound_Maps.findByIdAndDelete(collection.maps[i])

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