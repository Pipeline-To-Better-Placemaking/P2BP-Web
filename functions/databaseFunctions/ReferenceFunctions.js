const firestore = require('../firestore');
const basicDBfoos = require('../databaseFunctions/BasicFunctions.js');

module.exports.addReference = async function(docId, collection) {
    try {
        let ref = await basicDBfoos.getObj(docId, collection);
        if (!ref.refCount) {
            ref.refCount = 0;
        }
        ref.refCount = ref.refCount + 1;
        return await basicDBfoos.updateObj(ref._id, ref, collection);
    } catch (error) {
        console.error('Error Adding reference:', error);
        throw error;
    }
}

module.exports.removeReference = async function(docId, collection) {
    try {
        const ref = await basicDBfoos.getObj(docId, collection);

        if (ref === null)
        {
            return;
        }

        ref.refCount = (ref.refCount || 0) - 1;

        if (ref.refCount <= 0) {
            return await basicDBfoos.deleteObj(ref._id, collection);
        } else {
            return await basicDBfoos.updateObj(ref._id, ref, collection);
        }
    } catch (error) {
        console.error('Error removing reference:', error);
        throw error;
    }
}

module.exports.projectCleanup = async function(projectId, collection) {
    const doc = await firestore.collection(collection).where('project', '==', projectId).get();
    if (doc.empty)
    {
        return;
    }
    doc.forEach(doc => {
        firestore.collection(collection).doc(doc.id).delete();
    });
    return;
}

// Takes an array of ids in an object, and returns the objs that are being pointed too.
// All ids must point to obj in the same collection
module.exports.getAllRefs = async function(array, collection) {
    if (!array) {
        return [];
    }
    for (let i = 0; i < array.length; i++) {
            let obj = await basicDBfoos.getObj(array[i], collection);
            obj._id = array[i];
            array[i] = obj;
        }
    return array;
}
