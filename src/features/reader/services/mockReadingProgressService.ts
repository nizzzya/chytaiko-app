import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ReadingProgress,
  ReadingProgressResult,
  ReadingProgressServiceError,
} from '../../../types/readingProgress';

const MOCK_USER_ID = 'local_user';
const STORAGE_KEY = '@chytaiko/local-reading-progress';

const progressByStoryId = new Map<string, ReadingProgress>();

function createProgressId(storyId: string): string {
  return `${MOCK_USER_ID}_${storyId}`;
}

function createError(
  code: ReadingProgressServiceError['code'],
  message: string,
): ReadingProgressServiceError {
  return { code, message };
}

function isReadingProgressRecord(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as ReadingProgress;

  return (
    typeof record.id === 'string' &&
    typeof record.userId === 'string' &&
    typeof record.storyId === 'string' &&
    typeof record.lastPage === 'number' &&
    typeof record.completed === 'boolean' &&
    typeof record.updatedAt === 'string'
  );
}

async function hydrateProgress(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return;
    }

    for (const item of parsed) {
      if (!isReadingProgressRecord(item) || item.userId !== MOCK_USER_ID) {
        continue;
      }

      if (!progressByStoryId.has(item.storyId)) {
        progressByStoryId.set(item.storyId, item);
      }
    }
  } catch {
    // Keep in-memory session data if storage is unavailable or corrupt.
  }
}

async function persistProgress(): Promise<void> {
  try {
    const progress = Array.from(progressByStoryId.values());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

void hydrateProgress();

export function getProgress(
  storyId: string,
): ReadingProgressResult<ReadingProgress | null> {
  const progress = progressByStoryId.get(storyId) ?? null;

  return { success: true, data: progress };
}

export function saveProgress(
  storyId: string,
  page: number,
): ReadingProgressResult<ReadingProgress> {
  if (page < 1) {
    return {
      success: false,
      error: createError('invalid_page', 'Номер сторінки має бути більше нуля.'),
    };
  }

  const existing = progressByStoryId.get(storyId);
  const progress: ReadingProgress = {
    id: createProgressId(storyId),
    userId: MOCK_USER_ID,
    storyId,
    lastPage: page,
    completed: existing?.completed ?? false,
    updatedAt: new Date().toISOString(),
  };

  progressByStoryId.set(storyId, progress);
  void persistProgress();

  return { success: true, data: progress };
}

export function markCompleted(
  storyId: string,
): ReadingProgressResult<ReadingProgress> {
  const existing = progressByStoryId.get(storyId);

  const progress: ReadingProgress = {
    id: createProgressId(storyId),
    userId: MOCK_USER_ID,
    storyId,
    lastPage: existing?.lastPage ?? 1,
    completed: true,
    updatedAt: new Date().toISOString(),
  };

  progressByStoryId.set(storyId, progress);
  void persistProgress();

  return { success: true, data: progress };
}
