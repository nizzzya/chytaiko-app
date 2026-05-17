import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from './app';

let firestoreInstance: Firestore | undefined;

/**
 * Singleton Firestore. Collections per docs/TECHNICAL_PASSPORT.md §17.
 * Query helpers belong in feature services — not in UI.
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }

  return firestoreInstance;
}
