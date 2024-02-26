const reference = require('./ReferenceFunctions.js');

module.exports.deleteCollection = async function(collection){
    // based on: https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js
    collectionRef = await firestore.collection(collection) // find collection ref
    await reference.removeRefrence(collectionRef.area) // call function to decrease references to the area, might need to change ".area"

    collectionRef.docs.forEach((doc) => { // for each doc/map in the collection :
        collectionRef.doc(doc).delete() // calls the delete function for the doc
    })

    // Unnecessary since FB collections are deleted when they have no documents, can just return void
        // but don't know how this interacts where it is called
    return await Collection.findByIdAndDelete(collectionId)
}
