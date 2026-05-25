import type { Favorite } from '../../types/favorites';
import type { ReadingProgress } from '../../types/readingProgress';

/** Last reader session — same shape as `ReaderSession` from reader cache. */
export type LibraryContinueReading = {
  lastOpenedStoryId: string;
  lastOpenedPage: number;
  lastOpenedAt: string;
};

export type LibraryStoryEntry = {
  storyId: string;
  lastOpenedAt: string;
};

export type LibraryData = {
  continueReading: LibraryContinueReading | null;
  favorites: Favorite[];
  nightReading: LibraryStoryEntry[];
  dayReading: LibraryStoryEntry[];
  readTogether: LibraryStoryEntry[];
  history: ReadingProgress[];
};
