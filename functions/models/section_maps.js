const mongoose = require('mongoose')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

// Document Schema for Media Entry
const media_schema = mongoose.Schema({
  title: String,
  
  path: [{
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    }
  }],

  date: {
    type: Date,
    required: false
  },

  url_link: {
    type: String,
    required: false
  },

  panoramic: {
    type: Boolean,
    required: false
  },

  tags: [{
    type: String,
    required: false
  }],

  other: {
    type: String,
    required: false
  }

})

// Document Schema for Section Maps
const section_schema = mongoose.Schema({
    
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
        ref: 'Section_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    data: [media_schema] 
    // data represents const media_schema which houses the actual testing data parameters  
})
// end

const Maps = module.exports = mongoose.model('Section_Maps', section_schema)
const Entry = mongoose.model('Media_Entry', media_schema)

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
        title: newEntry.title,
        path: newEntry.path,
        date: newEntry.date,
        url_link: newEntry.url_link,
        panoramic: newEntry.panoramic,
        tags: newEntry.tags,
        other: newEntry.other
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
