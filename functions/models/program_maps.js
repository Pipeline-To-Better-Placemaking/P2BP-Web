const mongoose = require('mongoose')
const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Floor = require('./program_floors.js')

//schema for all the specific recorded data from the test. 
const dataSchema = mongoose.Schema({
    //record the number of floors the building has
    numFloors: {
        type: Number,
        required: true
    },

    //stores the points for the perimeter of the building
    //used to render the model. 
    perimeterPoints: [{
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    }],

    sqFootage: {
        type: Number,
        required: true
    },

    //time the slot is scheduled for 
    time: {
        type: Date,
        required: true
    },

    //stores an array of object ids that correspond to each floor object. 
    floors: [{
        type: ObjectId,
    }],

    floorData: Array,
})



const program_schema = mongoose.Schema({
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

    maxResearchers: {
        type: Number,
        required: true,
        default: 1
    },

    sharedData: {
        type: ObjectId,
        ref: 'Program_Collections',
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    data: [dataSchema]
})

const Maps = module.exports = mongoose.model('Program_Maps', program_schema)
const Entry = mongoose.model('Program_Entry', dataSchema)

module.exports.addMap = async function (newMap) {
    return await newMap.save()
}

module.exports.updateMap = async function (projectId, newMap) {
    return await Maps.updateOne(
        { _id: projectId },
        {
            $set: {
                title: newMap.title,
                date: newMap.date,
                maxResearchers: newMap.maxResearchers,
            }
        }
    )
}

module.exports.deleteMap = async function (mapId) {

    const map = await Maps.findById(mapId)

    return await Maps.findByIdAndDelete(mapId)
}

module.exports.projectCleanup = async function (projectId) {

    const data = await Maps.find({ project: projectId })
    if (data === null) {
        return
    }

    return await Maps.deleteMany({ project: projectId })
}

//add data to the map
module.exports.addEntry = async function (mapId, newEntry) {
    var entry = new Entry({
        numFloors: newEntry.numFloors,
        perimeterPoints: newEntry.perimeterPoints,
        time: newEntry.time,
        sqFootage: newEntry.sqFootage
    })

    return await Maps.updateOne(
        { _id: mapId },
        { $push: { data: entry } }
    )
}

//adds the floor id to the floors array
module.exports.addFloor = async function (mapId, entryId, floorId) {
    console.log(floorId)
    return await Maps.updateOne(
        {
            _id: mapId,
            'data._id': entryId
        },
        { $push: { "data.$.floors": floorId } }
    )

}

//deletes a floor from the floors array
module.exports.deleteFloor = async function (mapId, dataId, floorId) {

    return await Maps.updateOne(
        {
            _id: mapId,
            'data._id': dataId
        },
        { $pull: { "data.$.floors": { "_id": floorId } } }
    )

}

module.exports.addResearcher = async function (mapId, userId) {
    return await Maps.updateOne(
        { _id: mapId },
        { $push: { researchers: userId } }
    )
}

module.exports.removeResearcher = async function (mapId, userId) {
    return await Maps.updateOne(
        { _id: mapId },
        { $pull: { researchers: userId } }
    )
}

module.exports.isResearcher = async function (mapId, userId) {
    try {
        const doc = await Maps.find(
            {
                _id: mapId,
                researchers: { $elemMatch: userId }
            }
        )
    } catch (error) {
        return false
    }
    if (doc.length === 0) {
        return false
    }
    return true
}

module.exports.findData = async function (mapId, entryId) {
    const out = (await Maps.find({
        _id: mapId,
        'data._id': entryId
    },
        { 'data.$': 1 }))

    return out[0].data[0]
}

//update the data for an already exisitng data object 
module.exports.updateData = async function (mapId, dataId, newEntry) {
    return await Maps.updateOne(
        {
            _id: mapId,
            'data._id': dataId
        },
        { $set: { "data.$": newEntry } }
    )
}


//deletes a data object (entry) given the map id and the data id.
module.exports.deleteEntry = async function (mapId, entryId) {
    return await Maps.updateOne(
        { _id: mapId },
        {
            $pull: { data: { _id: entryId } }
        })
}
