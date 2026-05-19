import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import type {
  AuthResult,
  AuthServiceError,
  AuthStateCallback,
  AuthStateUnsubscribe,
  AuthUser,
} from '../../types/auth';
import { isFirebaseConfigured } from './config';
import { getFirebaseAuth } from './auth';

function mapUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
  };
}

function notConfiguredError(): AuthServiceError {
  return {
    code: 'not_configured',
    message:
      'Додаток не налаштований. Додайте Firebase змінні до .env (див. .env.example).',
  };
}

function normalizeAuthError(error: unknown): AuthServiceError {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          code: 'invalid_email',
          message: 'Невірний формат електронної пошти.',
        };
      case 'auth/weak-password':
        return {
          code: 'weak_password',
          message: 'Пароль занадто слабкий. Використайте щонайменше 6 символів.',
        };
      case 'auth/user-not-found':
        return {
          code: 'user_not_found',
          message: 'Користувача з такою поштою не знайдено.',
        };
      case 'auth/wrong-password':
        return {
          code: 'wrong_password',
          message: 'Невірний пароль.',
        };
      case 'auth/invalid-credential':
        return {
          code: 'invalid_credential',
          message: 'Невірна електронна пошта або пароль.',
        };
      case 'auth/email-already-in-use':
        return {
          code: 'email_in_use',
          message: 'Ця електронна пошта вже використовується.',
        };
      case 'auth/too-many-requests':
        return {
          code: 'too_many_requests',
          message: 'Забагато спроб. Спробуйте пізніше.',
        };
      case 'auth/network-request-failed':
        return {
          code: 'network',
          message: 'Перевірте підключення до інтернету.',
        };
      default:
        break;
    }
  }

  return {
    code: 'unknown',
    message: 'Щось пішло не так. Спробуйте знову.',
  };
}

function guardConfigured<T>(): AuthResult<T> | null {
  if (!isFirebaseConfigured()) {
    return { success: false, error: notConfiguredError() };
  }

  return null;
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<AuthUser>> {
  const configError = guardConfigured<AuthUser>();
  if (configError) {
    return configError;
  }

  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password,
    );

    const user = mapUser(credential.user);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'unknown',
          message: 'Щось пішло не так. Спробуйте знову.',
        },
      };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: normalizeAuthError(error) };
  }
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<AuthUser>> {
  const configError = guardConfigured<AuthUser>();
  if (configError) {
    return configError;
  }

  try {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email.trim(),
      password,
    );

    const user = mapUser(credential.user);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'unknown',
          message: 'Щось пішло не так. Спробуйте знову.',
        },
      };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: normalizeAuthError(error) };
  }
}

export async function logout(): Promise<AuthResult<void>> {
  const configError = guardConfigured<void>();
  if (configError) {
    return configError;
  }

  try {
    await signOut(getFirebaseAuth());
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: normalizeAuthError(error) };
  }
}

export function getCurrentUser(): AuthUser | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    return mapUser(getFirebaseAuth().currentUser);
  } catch {
    return null;
  }
}

export function subscribeToAuthState(
  callback: AuthStateCallback,
): AuthStateUnsubscribe {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => undefined;
  }

  try {
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      callback(mapUser(user));
    });
  } catch {
    callback(null);
    return () => undefined;
  }
}
