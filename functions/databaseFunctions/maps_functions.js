module.exports.addMap = async function(newMap, collection) {
    return await firestore.collection(collection).doc().set(newMap);
}

module.exports.updateMap = async function (projectId, newMap, collection) {
    const oldMap = await firestore.collection(collection).where('_id', '==', projectId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError("Invalid " + collection + " map");
    }
    oldMap.forEach(doc => {
        firestore.collection(collection).doc(doc.id).update(newMap);
    });
    return;
}

module.exports.deleteMap = async function(mapId, collection) {
    const map = await firestore.collection(collection).where('_id', '==', mapId).get();
    if (map.empty)
    {
        throw new UnauthorizedError("Invalid " + collection + " map");
    }
    map.forEach(doc => {
        firestore.collection(collection).doc(doc.id).delete();
    });
    return;
}

module.exports.addResearcher = async function(mapId, userId) {
    const oldMap = await firestore.collection(collection).where('_id', '==', mapId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError('Invalid map');
    }
    oldMap.forEach(doc => {
        const newDoc = doc.data();
        newDoc.researchers.push(newEntry);
        firestore.collection(collection).doc(doc.id).update(newDoc);
    });
    return;
}

module.exports.removeResearcher = async function(mapId, userId) {
    const oldMap = await firestore.collection(collection).where('_id', '==', mapId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError('Invalid map');
    }
    oldMap.forEach(doc => {
        const newDoc = doc.data();
        array = newDoc.researchers;


        for (let i = 0; i < array.length; i++) {
            if (array[i]._id === userId)
            {
                array.splice(i, 0);
                break;
            }
        }
        // newDoc.researchers.push(newEntry);
        firestore.collection(collection).doc(doc.id).update(newDoc);
    });
    return;
}

module.exports.projectCleanup = async function(projectId) {
    const doc = await firestore.collection('boundires_maps').where('project', '==', projectId).get();
    if (map.empty)
    {
        return;
    }
    map.forEach(doc => {
        firestore.collection("boundires_maps").doc(doc.id).delete();
    });
    return;
}
