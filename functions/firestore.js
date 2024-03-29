const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// May need to rename path if json key is moved
const credentialsPath = path.join(__dirname, 'better-placemaking-firebase-adminsdk-9v11d-41189993f9.json');

// Initialize Firestore with your credentials
const firestore = new Firestore({
  projectId: 'better-placemaking',
  keyFilename: credentialsPath,
});

module.exports = firestore;