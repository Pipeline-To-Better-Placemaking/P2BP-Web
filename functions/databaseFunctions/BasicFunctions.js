module.exports.addObj = async function(newMap, collection) {
    return await firestore.collection(collection).doc().set(newMap);
}

module.exports.updateObj = async function (docId, newMap, collection) {
    const oldMap = await firestore.collection(collection).where('_id', '==', docId).get();
    if (oldMap.empty)
    {
        throw new UnauthorizedError("Invalid " + collection + " map");
    }
    oldMap.forEach(doc => {
        firestore.collection(collection).doc(doc.id).update(newMap);
    });
    return;
}

module.exports.deleteObj = async function(docId, collection) {
    const map = await firestore.collection(collection).where('_id', '==', docId).get();
    if (map.empty)
    {
        throw new UnauthorizedError("Invalid " + collection + " map");
    }
    map.forEach(doc => {
        firestore.collection(collection).doc(doc.id).delete();
    });
    return;
}
