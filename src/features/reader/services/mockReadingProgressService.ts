import type {
  ReadingProgress,
  ReadingProgressResult,
  ReadingProgressServiceError,
} from '../../../types/readingProgress';

const MOCK_USER_ID = 'local_user';

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

  return { success: true, data: progress };
}

export function markCompleted(storyId: string): ReadingProgressResult<ReadingProgress> {
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

  return { success: true, data: progress };
}
