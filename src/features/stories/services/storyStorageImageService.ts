import { FirebaseError } from 'firebase/app';
import { getDownloadURL, ref } from 'firebase/storage';

import { isFirebaseConfigured } from '../../../services/firebase/config';
import { getFirebaseStorage } from '../../../services/firebase/storage';

export type StoryStorageImageError =
  | 'missing'
  | 'not_configured'
  | 'not_found'
  | 'unknown';

export type StoryStorageImageResult =
  | { success: true; url: string }
  | { success: false; error: StoryStorageImageError };

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

function mapStorageError(error: unknown): StoryStorageImageError {
  if (error instanceof FirebaseError && error.code === 'storage/object-not-found') {
    return 'not_found';
  }

  return 'unknown';
}

/**
 * Resolves a Firebase Storage object path to a download URL.
 * Read-only — no uploads or writes.
 *
 * Paths: stories/{slug}/cover.webp, stories/{slug}/page-001.webp (§20 TECHNICAL_PASSPORT).
 */
export async function resolveStorageImageUrl(
  path: string | null | undefined,
): Promise<StoryStorageImageResult> {
  if (!path?.trim()) {
    return { success: false, error: 'missing' };
  }

  const normalizedPath = path.trim();

  if (isRemoteImageUrl(normalizedPath)) {
    return { success: true, url: normalizedPath };
  }

  if (!isFirebaseConfigured()) {
    return { success: false, error: 'not_configured' };
  }

  const storagePath = normalizeStoragePath(normalizedPath);

  if (!storagePath) {
    return { success: false, error: 'missing' };
  }

  try {
    const storageRef = ref(getFirebaseStorage(), storagePath);
    const url = await getDownloadURL(storageRef);

    return { success: true, url };
  } catch (error) {
    return { success: false, error: mapStorageError(error) };
  }
}
