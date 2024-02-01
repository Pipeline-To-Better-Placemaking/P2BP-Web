const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const Surveys = require('../models/surveys.js')
const Area = require('../models/areas.js')


const collection_schema = mongoose.Schema({
    title: String,
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 10
    },
    area: {
        type: ObjectId,
        required: true,
        ref: 'Areas'
    },

    surveys: [{
        type: ObjectId,
        ref: 'Surveys'
    }]

})

const Collection = module.exports = mongoose.model('Survey_Collections', collection_schema)

module.exports.deleteSurvey = async function(collectionId, surveyId){
    await Surveys.deleteSurvey(surveyId)
    return await Collection.updateOne(
        { _id: collectionId },
        { $pull: { surveys: surveyId}}
    )

}

module.exports.deleteCollection = async function(collectionId){
    collection = await Collection.findById(collectionId)
    await Area.removeRefrence(collection.area)

    for(var i = 0; i < collection.surveys.length; i++)
        await Surveys.findByIdAndDelete(collection.surveys[i])

    return await Collection.findByIdAndDelete(collectionId)
}

module.exports.addActivity = async function(collectionId, surveyId){
    return await Collection.updateOne(
        { _id: collectionId },
        { $push: { surveys: surveyId}}
    )
}

module.exports.updateCollection = async function(collectionId, newCollection){
    return await Collection.updateOne(
        { _id: collectionId },
        { $set: {
            title: newCollection.title,
            date: newCollection.date,
            area: newCollection.area,
            duration: newCollection.duration
        }}
    )
}