const firestore = require('../firestore');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');

// docId = the doc with an array you want to change
// collection = the collection the doc is in
// new entry is the data you want to add
module.exports.addArrayElement = async function(docId, arrayName, collection, newEntry) {
    const oldMap = await firestore.collection(collection).where('_id', '==', docId).get();
    if (oldMap.empty)
    {
        throw new Error('Invalid id in addArrayElement');
    }
    oldMap.forEach((doc) => {
        const newDoc = doc.data();
        if (!newDoc[arrayName]) {
            newDoc[arrayName] = [];
        }
        newDoc[arrayName].push(newEntry);
        firestore.collection(collection).doc(doc.id).update(newDoc);
    });
    return;
}

module.exports.getArrayElement = async function(mapId, entryId) {
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

module.exports.updateArrayElement = async function(mapId, dataId, newEntry) {
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

module.exports.removeArrayElement = async function(docId, entry, arrayName, collection) {
    const obj = await basicDBfoos.getObj(docId, collection);
    console.log(obj);
    if (obj.empty)
    {
        throw new UnauthorizedError('Invalid id');
    }
    for (let i = 0; i < obj[arrayName].length; i++) {
        console.log(obj[arrayName]);
        if (JSON.stringify(obj[arrayName][i]) === JSON.stringify(entry))
        {
            obj[arrayName].splice(i, 1);
            break;
        }
    }
    console.log(obj);
    return await basicDBfoos.updateObj(docId, obj, collection);
}

// Delete team id in all User documents
module.exports.removeTeamFromAllUsers = async function(teamId) {
    const usersRef = firestore.collection('users');
    const usersSnapshot = await usersRef.get();

    const promises = [];
    usersSnapshot.forEach(async (doc) => {
        const userData = doc.data();
        if (userData.teams.includes(teamId)) {
            const updatedTeams = userData.teams.filter(id => id !== teamId);
            promises.push(doc.ref.update({ teams: updatedTeams }));
        }
    });

    await Promise.all(promises);
    return { message: `Team ${teamId} removed from all user documents` };
}
