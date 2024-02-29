const mongoose = require('mongoose')
const { UnauthorizedError } = require('../utils/errors')
const { firestore } = require('googleapis/build/src/apis/firestore')
const collectionNames = require('../databaseFunctions/CollectionNames.js')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const survey_key_schema = mongoose.Schema({
    counter: Number
})

const survey_schema = mongoose.Schema({
    
    title:String,
    
    project: {
        type: ObjectId,
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
        ref: 'Survey_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    key:{
        type: String,
        unique: true
    }          
})

const Surveys = module.exports = mongoose.model('Surveys', survey_schema)
const Counter = mongoose.model('Survey_Key_Tracker', survey_key_schema)



module.exports.addSurvey = async function(newSurvey) {
    var builderString = "3UROGSWIVE01A9LMKQB7FZ6DJ4NC28Y5HTXP"

    var counterRef = await firestore.collection(collectionNames.SURVEY_KEYS).where('_id', '==', '629d3b326d4bb4000466de25').get();//current counter id
    if(!counterRef.empty){ //if it doesn't exist, create one and initialize the counter value to 0
        counterRef = await firestore.collection(collectionNames.SURVEY_KEYS).add({
            counter: 0
        });
    }

    var count = counterRef[0].counter;//save the old count value
    await counterRef[0].update({counter: count + 1});//increment and update counter

    var keyInt = (count * 823543 + 23462) % 2176782336
    var keyString = ""
    
    for(var i = 0; i < 6; i++){
        keyString += builderString[ keyInt % 36 ]
        keyInt = Math.floor(Math.random()*keyInt/36)
    }

    newSurvey.key = keyString//set the key value in the survey doc to the generated keystring

    return await firestore.collection(collectionNames.SURVEYS).add(newSurvey);//return whether it was successfully updated
}

module.exports.updateSurvey = async function (surveyId, newSurvey) {
    const survey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.SURVEYS) + " survey");
    }
    const surveyDoc = survey[0];
    return await surveyDoc.update({
        title: newSurvey.title,
        date: newSurvey.date,
        maxResearchers: newSurvey.maxResearchers
    });
}

module.exports.deleteSurvey = async function(surveyId) {
    const survey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.SURVEYS) + " survey");
    }
    survey.forEach(doc => {
        firestore.collection(collectionNames.SURVEYS).doc(doc.id).delete();
    });
    return;
}

module.exports.projectCleanup = async function(projectId) {
    const survey = await firestore.collection(collectionNames.PROJECTS).where('_id', '==', projectId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.PROJECTS) + " survey");
    }
    survey.forEach(doc => {
        firestore.collection(collectionNames.PROJECTS).doc(doc.id).delete();
    });
    return;
}

module.exports.addResearcher = async function(surveyId, userId){
    const survey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.SURVEYS) + " survey");
    }
    survey.forEach(doc => {
        const newDoc = doc.data();
        newDoc.researchers.push(newDoc);
        firestore.collection(collectionNames.SURVEYS).doc(doc.id).update(newDoc);
    });
    return;
}

module.exports.removeResearcher = async function(surveyId, userId){
    const oldSurvey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (oldSurvey.empty)
    {
        throw new UnauthorizedError('Invalid survey');
    }
    oldSurvey.forEach(doc => {
        const newDoc = doc.data();
        array = newDoc.researchers;

        for (let i = 0; i < array.length; i++)
        {
            if (array[i]._id === userId)
            {
                array.splice(i, 1);
                break;
            }
        }
        firestore.collection(collectionNames.SURVEYS).doc(doc.id).update(newDoc);
    });
    return;
}

module.exports.isResearcher = async function(surveyId, userId){
    const oldSurvey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (oldSurvey.empty)
    {
        throw new UnauthorizedError('Invalid survey');
    }
    oldSurvey.forEach(doc => {
        array = doc.data().researchers;

        for (let i = 0; i < array.length; i++)
        {
            if (array[i]._id === userId)
            {
                return true;
            }
        }
    });
    return false;
}

module.exports.addEntry = async function(surveyId, newEntry) {
    const survey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.SURVEYS) + " survey");
    }
    var entry = new Entry({
        time: newEntry.time,
    })
    try {
        await survey.update({
            data: firebase.firestore.FieldValue.arrayUnion(entry)
        });
        return true; // Return true to indicate successful addition
    } catch (error) {
        console.error('Error adding entry:', error);
        return false; // Return false to indicate failure
    }
}

module.exports.deleteEntry = async function(surveyId, entryId) {
    const survey = await firestore.collection(collectionNames.SURVEYS).where('_id', '==', surveyId).get();
    if (survey.empty)
    {
        throw new UnauthorizedError("Invalid " + firestore.collection(collectionNames.SURVEYS) + " survey");
    }
    try {
        await survey.update({
            data: firebase.firestore.FieldValue.arrayRemove({_id: entryId})
        });
        return true; // Return true to indicate successful deletion
    } catch (error) {
        console.error('Error deleting entry:', error);
        return false; // Return false to indicate failure
    }
}

