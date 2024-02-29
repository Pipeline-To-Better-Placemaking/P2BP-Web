const mongoose = require('mongoose')
const collectionNames = require('../databaseFunctions/CollectionNames.js')
const { firestore } = require('googleapis/build/src/apis/firestore/index.js')
const { UnauthorizedError } = require('../utils/errors.js')

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
    // TODO might/probably need to change these to a different program_floors collection
    return await firestore.collection(collectionNames.PROGRAM_FLOORS).doc().set(newFloor);
}

//update the floor information
module.exports.updateFloor = async function (floorid, newFloor) {
    const oldFloor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorid).get();
    if (oldFloor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    return await oldFloor.forEach(doc => {
        firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).update(newFloor);
    });
}

module.exports.deleteFloor = async function (floorId) {
    const floor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorId).get();
    if (floor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    return await floor.forEach(doc => {
        firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).delete();
    });
}

//delete everything connected to the given map
module.exports.mapCleanup = async function (mapId) {
    const floor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('map', '==', mapId).get();
    if (floor.empty)
    {
        return;
    }
    return await floor.forEach(doc => {
        firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).delete();
    });
}


//add a program to the floor 
module.exports.addProgram = async function (floorId, newProgram) {
    const oldFloor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorId).get();
    if (oldFloor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    return await oldFloor.forEach(doc => {
        const newDoc = doc.data();
        newDoc.programs.push(newProgram);
        // and update programCount here?
        firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).update(newDoc);
    });
}

//returns a program object given the floor id and the desired program id
module.exports.findProgram = async function (floorId, programId) {
    // finds document where (id == floorId) && (programs[] contains programId)
    const floor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorId).where('programs', 'array-contains', programId).get();
    if (floor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    // returns the first program within the floor that matches the programId
    return await floor.forEach(doc => {
        doc.programs.forEach(program => {
            if (program._id == programId)
            {
                return program;
            }
        })
    })
}

//update the data in the program object for an already exisitng one
module.exports.updateProgram = async function (floorId, programId, newProgram) {
    // finds document where (id == floorId) && (programs[] contains programId)
    const floor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorId).where('programs', 'array-contains', programId).get();
    if (floor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    // finds the first program in the document with a matching id and updates the programs array with the new program
    return await floor.forEach(doc => {
        const newDoc = doc.data();
        for (i = 0; i < newDoc.programs.length; i++)
        {
            if (newDoc.programs[i]._id == programId)
            {
                newDoc.programs[i] = newProgram;
                firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).update(newDoc);
                return;
            }
        }
    })
}


//deletes a program object given the floor id and the program id.
module.exports.deleteProgram = async function (floorId, programId) {
    // finds document where (id == floorId) && (programs[] contains programId)
    const floor = await firestore.collection(collectionNames.PROGRAM_FLOORS).where('_id', '==', floorId).where('programs', 'array-contains', programId).get();
    if (floor.empty)
    {
        throw new UnauthorizedError("Invalid " + collectionNames.PROGRAM_FLOORS + " floor");
    }
    // finds the first program in the document with a matching id and updates the programs array with the new program
    return await floor.forEach(doc => {
        const newDoc = doc.data();
        array = newDoc.programs;

        for (i = 0; i < array.length; i++)
        {
            if (array[i]._id == programId)
            {
                array.splice(i, 1);
                break;
            }
        }
        firestore.collection(collectionNames.PROGRAM_FLOORS).doc(doc.id).update(newDoc);
    })
}