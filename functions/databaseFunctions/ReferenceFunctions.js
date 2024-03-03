const firestore = require('../firestore');

module.exports.addReference = async function(docId, collection) {
  try {
      const ref = firestore.collection(collection).where('_id', '==', docId).get();
      const refData = await ref.get();

      if (!refData.exists) {
          throw new Error('Standing point not found');
      }

      const data = refData.data();
      let newData = { ...data };

      // Update reference count
      newData.refCount = (newData.refCount || 0) + 1;

      // Update the standing point with the new reference count
      await ref.update({ refCount: newData.refCount });

      return newData; // Return the updated point data
  } catch (error) {
      console.error('Error adding reference:', error);
      throw error; // Rethrow error for handling in the caller function
  }
}

module.exports.removeReference = async function(docId, collection) {
    try {
        const ref = firestore.collection(collection).where('_id', '==', docId).get();
        const refData = await ref.get();

        if (!refData.exists) {
            throw new Error('Standing point not found');
        }

        const data = refData.data();
        let newData = { ...data };

        // Update reference count
        newData.refCount = (newData.refCount || 0) - 1;

        if (newData.refCount <= 0) {
            // Delete the standing point if reference count is zero or less
            await ref.delete();
            return null; // Indicate deletion
        } else {
            // Update the standing point with the new reference count
            await ref.update({ refCount: newData.refCount });
            return newData; // Return the updated point data
        }
    } catch (error) {
        console.error('Error removing reference:', error);
        throw error; // Rethrow error for handling in the caller function
    }
}
