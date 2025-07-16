import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { app } from '@/firebase/config';

export const auth = getAuth(app);
export const db = getFirestore(app);
