import admin from 'firebase-admin';

const serviceAccount = require('../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deneb-88a71.firebaseio.com',
});

const db = admin.firestore();

async function verifyPythonContent() {
  try {
    console.log('Fetching Python content from Firestore...');

    const doc = await db.collection('languages').doc('python').get();

    if (!doc.exists) {
      console.log('No Python content found in the database');
      return;
    }

    const data = doc.data();
    console.log('\n=== Python Content ===');
    console.log(`Name: ${data?.name}`);
    console.log(`Tag: ${data?.tag}`);
    console.log(`\nTopics (${data?.topics?.length || 0}):`);

    data?.topics?.forEach((topic: any) => {
      console.log(`\n- ${topic.name} (${topic.id})`);
      console.log(`  ${topic.content?.substring(0, 100)}...`);
      console.log(`  Subtopics: ${topic.subtopics?.length || 0}`);
    });

    console.log('\nVerification complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error verifying Python content:', error);
    process.exit(1);
  }
}

verifyPythonContent();
