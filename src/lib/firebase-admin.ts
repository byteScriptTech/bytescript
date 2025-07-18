import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require('../../deneb-88a71-firebase-adminsdk-3z447-5d0122f45c.json');

if (!serviceAccount) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable');
}

const apps = getApps();

const adminApp =
  apps.length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : apps[0];

const adminDb = getFirestore(adminApp);

export { adminDb };
