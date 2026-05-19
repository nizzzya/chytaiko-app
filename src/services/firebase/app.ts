import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { getFirebaseConfig } from './config';

let firebaseApp: FirebaseApp | undefined;

/**
 * Singleton Firebase app. Call only after EXPO_PUBLIC_FIREBASE_* env is set.
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }

  const existing = getApps()[0];
  if (existing) {
    firebaseApp = existing;
    return firebaseApp;
  }

  firebaseApp = initializeApp(getFirebaseConfig());
  return firebaseApp;
}
