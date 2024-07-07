const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://positive-affirmations-6f4de.firebaseio.com/' // Replace with your project ID
});

const db = admin.firestore();

// Read data from JSON file
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Transform data
const transformedData = {};
data.forEach(item => {
  transformedData[item.Field] = item.Value;
});

// Create the document with the transformed data
const docRef = db.collection('test').doc('s-partner');

docRef.set(transformedData)
  .then(() => {
    console.log('Data has been added successfully.');
  })
  .catch((error) => {
    console.error('Error adding data: ', error);
  });
