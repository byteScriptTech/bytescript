import * as fs from 'fs';

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync('deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fetchAllCollections = async () => {
  try {
    const db = admin.firestore();

    const collections = await db.listCollections();

    console.log(
      'Collections found:',
      collections.map((c) => c.id)
    );

    for (const collection of collections) {
      console.log(`\nFetching documents for collection: ${collection.id}`);
      const querySnapshot = await collection.get();

      console.log(`Total documents: ${querySnapshot.size}`);

      querySnapshot.forEach((doc) => {
        console.log(`\nDocument ID: ${doc.id}`);
        console.log('Data:', doc.data());
      });
    }
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
};

// Run the script
fetchAllCollections().catch(console.error);
