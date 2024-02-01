const mongoose = require('mongoose')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId
const Points = require('../models/standing_points.js')


// Document Schema for data entry
const dataSchema = mongoose.Schema({

       
    animal: [{

        kind:{
            type: String,
            required: true
        },

        description:{
            type: String,
            required: true
        },

        marker: {

            latitude: {
                type: Number,
                // required: true
            },
            longitude: {
                type: Number,
                // required: true
            }
        }

    }],

    weather: {
        temperature:{
            type: Number,
            required: true
        },

        description:{
            type: String,
            required: true
        }
    },

    vegetation: [{
        area: {
            type: Number,
        },

        description: {
            type: String,
        },

        location: [{

            latitude: {
                type: Number,
            },

            longitude: {
                type: Number,
            }
        }]
    }],

    water: [{
        area: {
            type: Number,
        },

        description: {
            type: String,
        },

        location: [{

            latitude: {
                type: Number,
            },

            longitude: {
                type: Number,
            }
        }]
    }],
    
    time: {
        type: Date,
        required: true
    }


})
//End

// Document Schema for Nature Maps
const nature_schema = mongoose.Schema({
    
    title: String,
    
    project: {
        type: ObjectId,
        required: true
    },
    researchers: [{
        type: ObjectId,
        required: true,
        ref: 'Users'
    }],

    maxResearchers:{
        type: Number,
        required: true,
        default: 1
    },

    sharedData:{
        type: ObjectId,
        ref: 'Nature_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    data:[dataSchema]
    // data represents const dataSchema which houses the actual testing data parameters  
       
})
//end

const Maps = module.exports = mongoose.model('Nature_Maps', nature_schema)
const Entry = mongoose.model('Nature_Entry', dataSchema)

module.exports.addMap = async function(newMap) {
    return await newMap.save()
}

module.exports.updateMap = async function (projectId, newMap) {
    return await Maps.updateOne(
        { _id: projectId },
        { $set: {
            title: newMap.title,
            date: newMap.date,
            maxResearchers: newMap.maxResearchers,
        }}
    )
}

module.exports.deleteMap = async function(mapId) {    
    return await Maps.findByIdAndDelete(mapId)
}

module.exports.projectCleanup = async function(projectId) {

    const data = await Maps.find({project: projectId})
    if (data === null){
        return
    }
    
    return await Maps.deleteMany({ project: projectId })
}

module.exports.addEntry = async function(mapId, newEntry) {
    var entry = new Entry({
        animal: newEntry.animal,
        weather: newEntry.weather,
        water: newEntry.water,
        vegetation: newEntry.vegetation,
        time: newEntry.time
    })
    return await Maps.updateOne(
        { _id: mapId },
        { $push: { data: entry}}
    )
}

module.exports.addResearcher = async function(mapId, userId){
    return await Maps.updateOne(
        { _id: mapId },
        { $push: { researchers: userId}}
    )
}

module.exports.removeResearcher = async function(mapId, userId){
    return await Maps.updateOne(
        { _id: mapId },
        { $pull: { researchers: userId}}
    )
}

module.exports.isResearcher = async function(mapId, userId){
    try{
        const doc = await Maps.find(
            {
                _id: mapId, 
                researchers: { $elemMatch:  userId }
            }
        )
    }catch(error){
        return false
    }
    if (doc.length === 0) {
        return false
    }
    return true
}
    
module.exports.findData = async function(mapId, entryId){
    const out = (await Maps.find({
        _id: mapId,
        'data._id': entryId 
    },
    {'data.$':1}))

    return out[0].data[0]
}

module.exports.updateData = async function(mapId, dataId, newEntry){
    return await Maps.updateOne(
        {
            _id: mapId,
            'data._id': dataId 
        },
        { $set: { "data.$": newEntry}}
    )}

module.exports.deleteEntry = async function(mapId, entryId) {
        return await Maps.updateOne(
            { _id: mapId },
            { $pull: { data: {_id:entryId }}
            })
    }
    