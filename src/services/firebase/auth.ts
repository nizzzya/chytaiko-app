import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';

import { getFirebaseApp } from './app';

let authInstance: Auth | undefined;

/**
 * Singleton Firebase Auth with AsyncStorage persistence (React Native).
 * Not used by screens until Auth phase — import from services only.
 */
export function getFirebaseAuth(): Auth {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();

  try {
    authInstance = getAuth(app);
  } catch {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  return authInstance;
}
