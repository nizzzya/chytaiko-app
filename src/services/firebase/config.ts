import type { FirebaseOptions } from 'firebase/app';

/**
 * Expo public env keys (see .env.example).
 * Values are injected at build time — never hardcode secrets in source.
 */
const ENV_KEYS = {
  apiKey: 'EXPO_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'EXPO_PUBLIC_FIREBASE_APP_ID',
} as const;

function readEnv(key: string): string {
  return process.env[key]?.trim() ?? '';
}

/**
 * Raw config from environment. Empty strings mean “not set yet”.
 */
export const firebaseEnv = {
  apiKey: readEnv(ENV_KEYS.apiKey),
  authDomain: readEnv(ENV_KEYS.authDomain),
  projectId: readEnv(ENV_KEYS.projectId),
  storageBucket: readEnv(ENV_KEYS.storageBucket),
  messagingSenderId: readEnv(ENV_KEYS.messagingSenderId),
  appId: readEnv(ENV_KEYS.appId),
} as const;

const REQUIRED_FIELDS: (keyof typeof firebaseEnv)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

/** True when all EXPO_PUBLIC_FIREBASE_* variables are present. */
export function isFirebaseConfigured(): boolean {
  return REQUIRED_FIELDS.every((field) => firebaseEnv[field].length > 0);
}

/** Missing env variable names (for error messages). */
export function getMissingFirebaseEnvKeys(): string[] {
  return REQUIRED_FIELDS.filter((field) => !firebaseEnv[field]).map(
    (field) => ENV_KEYS[field],
  );
}

/**
 * Firebase web app config for initializeApp.
 * @throws if any required EXPO_PUBLIC_FIREBASE_* value is missing
 */
export function getFirebaseConfig(): FirebaseOptions {
  const missing = getMissingFirebaseEnvKeys();

  if (missing.length > 0) {
    throw new Error(
      [
        'Firebase is not configured.',
        `Missing: ${missing.join(', ')}`,
        'Copy .env.example to .env (or .env.development) and set values from Firebase Console → Project settings.',
      ].join(' '),
    );
  }

  return {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
  };
}
