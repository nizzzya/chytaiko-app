import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { getFirebaseApp } from './app';

let storageInstance: FirebaseStorage | undefined;

/**
 * Singleton Firebase Storage.
 * Story assets path: stories/{slug}/cover.webp, page-001.webp (§20 TECHNICAL_PASSPORT).
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp());
  }

  return storageInstance;
}
