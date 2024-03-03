const firestore = require('../firestore');

module.exports.addArrayElement = async function(docId, collection, newEntry) {
    const oldMap = await firestore.collection(collection).where('_id', '==', docId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError('Invalid id');
    }
    oldMap.forEach(doc => {
        const newDoc = doc.data();
        newDoc.researchers.push(newEntry);
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

module.exports.removeArrayElement = async function(docId, entryId, collection) {
    const oldMap = await firestore.collection(collection).where('_id', '==', docId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError('Invalid id');
    }
    oldMap.forEach(doc => {
        const newDoc = doc.data();
        array = newDoc.researchers;
        for (let i = 0; i < newDoc.researchers.length; i++) {
            console.log(array[i]);
            if (newDoc.researchers[i] === entryId)
            {
                newDoc.researchers.splice(i, 1);
                break;
            }
        }
        firestore.collection(collection).doc(doc.id).update(newDoc);
    });
}
