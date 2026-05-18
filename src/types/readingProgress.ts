export type ReadingProgress = {
  id: string;
  userId: string;
  storyId: string;
  lastPage: number;
  completed: boolean;
  updatedAt: string;
};

export type ReadingProgressErrorCode = 'invalid_page' | 'not_found' | 'unknown';

export type ReadingProgressServiceError = {
  code: ReadingProgressErrorCode;
  message: string;
};

export type ReadingProgressResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: ReadingProgressServiceError };
