import { getDownloadURL, ref } from 'firebase/storage';

import { isFirebaseConfigured } from '../../../services/firebase/config';
import { getFirebaseStorage } from '../../../services/firebase/storage';

export type StoryStorageImageErrorCode =
  | 'not_configured'
  | 'invalid_path'
  | 'not_found'
  | 'unknown';

export type StoryStorageImageServiceError = {
  code: StoryStorageImageErrorCode;
  message: string;
};

export type StoryStorageImageResult =
  | { success: true; url: string }
  | { success: false; error: StoryStorageImageServiceError };

function createError(
  code: StoryStorageImageErrorCode,
  message: string,
): StoryStorageImageServiceError {
  return { code, message };
}

function isRemoteImageUrl(path: string): boolean {
  return /^https?:\/\//i.test(path);
}

function normalizeStoragePath(path: string): string | null {
  const trimmed = path.trim().replace(/^\/+/, '');

  if (!trimmed || trimmed.includes('..')) {
    return null;
  }

  return trimmed;
}

export async function resolveStorageImageUrl(
  path: string | null | undefined,
): Promise<StoryStorageImageResult> {
  if (!path?.trim()) {
    return {
      success: false,
      error: createError('invalid_path', 'Невірний шлях до зображення.'),
    };
  }

  const normalizedPath = path.trim();

  if (isRemoteImageUrl(normalizedPath)) {
    return { success: true, url: normalizedPath };
  }

  if (!isFirebaseConfigured()) {
    return {
      success: false,
      error: createError(
        'not_configured',
        'Зображення з хмари недоступні без налаштування Firebase.',
      ),
    };
  }

  const storagePath = normalizeStoragePath(normalizedPath);

  if (!storagePath) {
    return {
      success: false,
      error: createError('invalid_path', 'Невірний шлях до зображення.'),
    };
  }

  try {
    const storageRef = ref(getFirebaseStorage(), storagePath);
    const url = await getDownloadURL(storageRef);

    return { success: true, url };
  } catch {
    return {
      success: false,
      error: createError('not_found', 'Зображення не знайдено.'),
    };
  }
}
