const mongoose = require('mongoose')


const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const newProgramSchema = mongoose.Schema({
    //stores the points for this section
    //perimeter of the section made by user.  
    points: [{
        xCoord: {
            type: Number,
            required: false
        },
        yCoord: {
            type: Number,
            required: false
        },
        zCoord: {
            type: Number,
            required: false
        },
    }],

    sqFootage: {
        type: Number,
        required: true
    },

    programType: {
        type: String,
        required: false
    },


})

const floorSchema = mongoose.Schema({
    //stores the object id of the map that this floor corresponds to
    map: {
        type: ObjectId,
        ref: 'Program_Maps',
        required: true
    },

    //floor number 
    floorNum: {
        type: Number,
        required: true
    },

    //number of program sections identified on this floor
    programCount: {
        type: Number,
        required: false
    },

    //programs that are identified on this floor. 
    programs: [newProgramSchema]
})

const Floors = module.exports = mongoose.model('Program_Floors', floorSchema)
const NewProgramEntry = mongoose.model('NewProgram_Entry', newProgramSchema)

//create a new floor
module.exports.addFloor = async function (newFloor) {
    return await newFloor.save()
}

//update the floor information
module.exports.updateFloor = async function (floorid, newFloor) {
    return await Floors.updateOne(
        { _id: floorid },
        {
            $set: {
                map: newFloor.map,
                floorNum: newFloor.floorNum,
                programCount: newFloor.programCount,
                programs: newFloor.programs
            }
        }
    )
}

module.exports.deleteFloor = async function (floorId) {

    const map = await Floors.findById(floorId)

    return await Floors.findByIdAndDelete(floorId)
}

//delete everything connected to the given map
module.exports.mapCleanup = async function (mapId) {

    const data = await Floors.find({ map: mapId })
    if (data === null) {
        return
    }

    return await Floors.deleteMany({ map: mapId })
}


//add a program to the floor 
module.exports.addProgram = async function (floorId, newProgram) {
    var entry = new NewProgramEntry({
        programType: newProgram.programType,
        points: newProgram.points,
        sqFootage: newProgram.sqFootage
    })

    return await Floors.updateOne(
        { _id: floorId },
        { $push: { programs: entry } }
    )
}

//returns a program object given the floor id and the desired program id
module.exports.findProgram = async function (floorId, programId) {
    const out = (await Floors.find({
        _id: floorId,
        'programs._id': programId
    },
        { 'programs.$': 1 }))

    return out[0].programs[0]
}

//update the data in the program object for an already exisitng one 
module.exports.updateProgram = async function (floorId, programId, newProgram) {
    return await Floors.updateOne(
        {
            _id: floorId,
            'programs._id': programId
        },
        { $set: { "programs.$": newProgram } }
    )
}


//deletes a program object given the floor id and the program id.
module.exports.deleteProgram = async function (floorId, programId) {
    return await Floors.updateOne(
        { _id: floorId },
        {
            $pull: { programs: { _id: programId } }
        })
}