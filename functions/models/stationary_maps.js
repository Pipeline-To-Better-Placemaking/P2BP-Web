const mongoose = require('mongoose')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId
const Points = require('../models/standing_points.js')

const entrySchema = mongoose.Schema({
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    age: {
        type: String,
        enum: ['0-14','15-21','22-29','30-49','50-65','65+'],
        required: true
    },
    posture: {
        type: String,
        enum: ['sitting(formal)','sitting(informal)','standing','laying'],
        required: true
    },
    gender: {
        type: String,
        enum: ['male','female','other'],
        required: true
    },
    activity: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    standingPoint:{
        type:ObjectId,
        ref: 'Standing_Points',
        required: true
    }
})
const stationary_schema = mongoose.Schema({
    
    title:String,
    
    project: {
        type: ObjectId,
        required: true
    },
    standingPoints: [{
        type: ObjectId,
        required: true,
        ref: 'Standing_Points'
    }],
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
        ref: 'Stationary_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    data:[entrySchema]   
})


const Maps = module.exports = mongoose.model('Stationary_Maps', stationary_schema)
const Entry = mongoose.model('Stationary_Entry', entrySchema)

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
            standingPoints: newMap.standingPoints
        }}
    )
}

module.exports.deleteMap = async function(mapId) {

    const map = await Maps.findById(mapId)

    for(var i = 0; i < map.standingPoints.length; i++){
        await Points.removeRefrence(map.standingPoints[i])
    }
    
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
        time: newEntry.time,
        gender: newEntry.gender,
        posture: newEntry.posture,
        age: newEntry.age,
        activity: newEntry.activity,
        location: newEntry.location,
        standingPoint: newEntry.standingPoint
    })

    await Points.addRefrence(newEntry.standingPoint)
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
    const updatedDataVal = await Maps.updateOne(
        {
            _id: mapId,
            'data._id': dataId 
        },
        { $set: { "data.$": newEntry}}
    )

    return updatedDataVal
}

module.exports.deleteEntry = async function(mapId, entryId) {
    
        const doc = await Maps.find(
            {   
                _id: mapId, 
                data: { $elemMatch:  {_id:entryId }}
            }
        )

        await Points.removeRefrence(doc.data[0].standingPoint)

        return await Maps.updateOne(
            { _id: mapId },
            { $pull: { data: {_id:entryId }}
            })
    }
    