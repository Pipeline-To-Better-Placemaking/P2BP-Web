const mongoose = require('mongoose')
const firestore = require('../firestore');

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

//const Maps = module.exports = mongoose.model('Access_Maps', access_schema)
const Maps = firestore.collection('access_maps');
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

// Old Mongo function
/*module.exports.isResearcher = async function(mapId, userId){
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
}*/

module.exports.isResearcher = async function(mapId, userId) {
    try {
        const mapDoc = await Maps.where('_id', '==', mapId).get();

        if (!mapDoc.exists) {
            return false;
        }

        const mapData = mapDoc.data();

        // Check if the map's researchers array includes the userId
        if (mapData.researchers && mapData.researchers.includes(userId)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if user is a researcher:', error);
        return false;
    }
}
    
// Old Mongo function
/*module.exports.findData = async function(mapId, entryId){
    const out = (await Maps.find({
        _id: mapId,
        'data._id': entryId 
    },
    {'data.$':1}))

    return out[0].data[0]
}*/

module.exports.findData = async function(mapId, entryId) {
    try {
        // Retrieve the document with the specified mapId
        const mapDoc = await Maps.where('_id', '==', mapId).get();

        // Check if the document exists
        if (!mapDoc.exists) {
            console.error('Map document not found.');
            return null;
        }

        // Get the data field from the document
        const data = mapDoc.data().data;

        // Find the entry with the specified entryId
        const entry = data.find(entry => entry._id === entryId);

        // Return the found entry
        return entry;
    } catch (error) {
        console.error('Error finding data:', error);
        return null;
    }
}

// Old Mongo function
/*module.exports.updateData = async function(mapId, dataId, newEntry){
    return await Maps.updateOne(
        {
            _id: mapId,
            'data._id': dataId 
        },
        { $set: { "data.$": newEntry}}
    )}*/

module.exports.updateData = async function(mapId, dataId, newEntry) {
        const mapDocRef = await Maps.where('_id', '==', mapId).get();
        const dataRef = mapDocRef.collection('data').where('_id', '==', dataId).get();
    
        try {
            await dataRef.set(newEntry, { merge: true });
            return true; // Return true to indicate successful update
        } catch (error) {
            console.error('Error updating data:', error);
            return false; // Return false to indicate failure
        }
    }

// Old Mongo function
/*module.exports.deleteEntry = async function(mapId, entryId) {
        return await Maps.updateOne(
            { _id: mapId },
            { $pull: { data: {_id:entryId }}
            })
    }*/

module.exports.deleteEntry = async function(mapId, entryId) {
        const mapDocRef = await Maps.where('_id', '==', mapId).get();
    
        try {
            await mapDocRef.update({
                data: firebase.firestore.FieldValue.arrayRemove({_id: entryId})
            });
            return true; // Return true to indicate successful deletion
        } catch (error) {
            console.error('Error deleting entry:', error);
            return false; // Return false to indicate failure
        }
    }