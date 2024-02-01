const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Order_Maps = require('./order_maps.js')
const Area = require('./areas.js')

// Document Schema for Order Collections.  Maps references Order Maps Schema
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
        ref: 'Order_Maps'
    }]

})
//end

const Collection = module.exports = mongoose.model('Order_Collections', collection_schema)

module.exports.deleteMap = async function(collectionId, mapId){
    await Order_Maps.deleteMap(mapId)
    return await Collection.updateOne(
        { _id: collectionId },
        { $pull: { maps: mapId}}
    )

}

module.exports.deleteCollection = async function(collectionId){
    collection = await Collection.findById(collectionId)
    await Area.removeRefrence(collection.area)
    for(var i = 0; i < collection.maps.length; i++)
        await Order_Maps.findByIdAndDelete(collection.maps[i])

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