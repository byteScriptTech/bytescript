import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only if all required environment variables are present
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const hasAllEnvVars = requiredEnvVars.every((env) => process.env[env]);

let adminDb: ReturnType<typeof getFirestore> | null = null;

if (hasAllEnvVars) {
  const apps = getApps();
  const adminApp =
    apps.length === 0
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })
      : apps[0];

  adminDb = getFirestore(adminApp);
} else {
  console.warn(
    'Firebase Admin SDK environment variables not configured. Admin features will be disabled.'
  );
}

export { adminDb };
