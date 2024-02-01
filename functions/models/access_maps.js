const mongoose = require('mongoose')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId


const dataSchema = mongoose.Schema({
    //stores any access points and types
    path: [{
        latitude:{
            type: Number,
            required: true
        },
        longitude:{
            type: Number,
            required: true 
        }
    }],

    accessType: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    //is this access point inside the perimeter or not
    inPerimeter: {
        type: Boolean, 
        required: true

    },

    distanceFromArea: Number,

    //area of the access point if its a lot/garage
    area: Number,


    details:{//how difficult is it to get to the place from this access spot
        diffRating: String,
    
        //cost of the access spot if any 
        cost: Number,
    
        //number of spots for lots, garages, bike racks, bus frequency
        spots: Number,
    
        //number of floors in a garage
        floors: Number,

        //road data
        laneCount: Number,
        median: Boolean,
        turnLane: Array,
        tollLane: Boolean,
        paved: Boolean,
        twoWay: Boolean
    },    

    //time the slot is scheduled for
    time: {
        type: Date,
        required: true
    }
})

const access_schema = mongoose.Schema({
    title: String,

    project: {
        type:ObjectId,
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
        ref: 'Access_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    data: [dataSchema]
})

const Maps = module.exports = mongoose.model('Access_Maps', access_schema)
const Entry = mongoose.model('Access_Entry', dataSchema)

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

    const map = await Maps.findById(mapId)
    
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
        path: newEntry.path,
        accessType: newEntry.accessType,
        description: newEntry.description,
        distanceFromArea: newEntry.distanceFromArea,
        details: newEntry.details,
        area: newEntry.area,
        distance: newEntry.distance,
        inPerimeter: newEntry.inPerimeter,
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