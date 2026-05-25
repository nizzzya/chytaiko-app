import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ReadingProgress } from '../../../types/readingProgress';
import { getFavorites } from '../../favorites/services/mockFavoritesService';
import type { ReadingMode } from '../../reader/services/readerSettingsService';
import { getLastReaderSession } from '../../reader/services/readerCacheService';
import { getProgress } from '../../reader/services/mockReadingProgressService';
import { getStories } from '../../stories/services/storiesService';
import type {
  LibraryContinueReading,
  LibraryData,
  LibraryStoryEntry,
} from '../types';

const MODE_HISTORY_STORAGE_KEY = '@chytaiko/library-mode-history';

type ModeHistoryBuckets = {
  night: LibraryStoryEntry[];
  day: LibraryStoryEntry[];
  readTogether: LibraryStoryEntry[];
};

const EMPTY_BUCKETS: ModeHistoryBuckets = {
  night: [],
  day: [],
  readTogether: [],
};

let modeHistory: ModeHistoryBuckets = { ...EMPTY_BUCKETS };

function isLibraryStoryEntry(value: unknown): value is LibraryStoryEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as LibraryStoryEntry;

  return (
    typeof record.storyId === 'string' &&
    record.storyId.length > 0 &&
    typeof record.lastOpenedAt === 'string'
  );
}

function isModeHistoryBuckets(value: unknown): value is ModeHistoryBuckets {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as ModeHistoryBuckets;

  return (
    Array.isArray(record.night) &&
    record.night.every(isLibraryStoryEntry) &&
    Array.isArray(record.day) &&
    record.day.every(isLibraryStoryEntry) &&
    Array.isArray(record.readTogether) &&
    record.readTogether.every(isLibraryStoryEntry)
  );
}

function sortByLastOpenedDesc(entries: LibraryStoryEntry[]): LibraryStoryEntry[] {
  return [...entries].sort(
    (a, b) =>
      new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime(),
  );
}

function upsertStoryEntry(
  entries: LibraryStoryEntry[],
  storyId: string,
  openedAt: string,
): LibraryStoryEntry[] {
  const normalizedStoryId = storyId.trim();

  if (!normalizedStoryId) {
    return entries;
  }

  const withoutStory = entries.filter((entry) => entry.storyId !== normalizedStoryId);

  return [{ storyId: normalizedStoryId, lastOpenedAt: openedAt }, ...withoutStory];
}

function resolveModeBucket(
  mode: ReadingMode,
): keyof ModeHistoryBuckets | null {
  switch (mode) {
    case 'night':
      return 'night';
    case 'day':
      return 'day';
    case 'default':
    case 'quiet':
      return 'readTogether';
    case 'travel':
    default:
      return null;
  }
}

async function persistModeHistory(): Promise<void> {
  try {
    await AsyncStorage.setItem(
      MODE_HISTORY_STORAGE_KEY,
      JSON.stringify(modeHistory),
    );
  } catch {
    // Memory remains source of truth for the current session.
  }
}

function mapContinueReading(): LibraryContinueReading | null {
  const session = getLastReaderSession();

  if (!session) {
    return null;
  }

  return {
    lastOpenedStoryId: session.lastOpenedStoryId,
    lastOpenedPage: session.lastOpenedPage,
    lastOpenedAt: session.lastOpenedAt,
  };
}

function mapFavorites() {
  const result = getFavorites();

  if (!result.success) {
    return [];
  }

  return result.data;
}

function mapHistory() {
  const progressEntries: ReadingProgress[] = [];

  for (const story of getStories()) {
    const result = getProgress(story.id);

    if (result.success && result.data) {
      progressEntries.push(result.data);
    }
  }

  return progressEntries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/**
 * Records a story open for ritual library sections (night / day / read together).
 * Call when the user opens a story in Reader with the active reading mode.
 */
export function recordLibraryStoryOpen(
  storyId: string,
  mode: ReadingMode,
): void {
  const bucket = resolveModeBucket(mode);

  if (!bucket) {
    return;
  }

  const openedAt = new Date().toISOString();

  modeHistory = {
    ...modeHistory,
    [bucket]: upsertStoryEntry(modeHistory[bucket], storyId, openedAt),
  };

  void persistModeHistory();
}

export async function hydrateLibraryModeHistory(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(MODE_HISTORY_STORAGE_KEY);

    if (!raw) {
      modeHistory = { ...EMPTY_BUCKETS };
      return;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isModeHistoryBuckets(parsed)) {
      modeHistory = { ...EMPTY_BUCKETS };
      return;
    }

    modeHistory = {
      night: sortByLastOpenedDesc(parsed.night),
      day: sortByLastOpenedDesc(parsed.day),
      readTogether: sortByLastOpenedDesc(parsed.readTogether),
    };
  } catch {
    modeHistory = { ...EMPTY_BUCKETS };
  }
}

export function getLibraryData(): LibraryData {
  return {
    continueReading: mapContinueReading(),
    favorites: mapFavorites(),
    nightReading: sortByLastOpenedDesc(modeHistory.night),
    dayReading: sortByLastOpenedDesc(modeHistory.day),
    readTogether: sortByLastOpenedDesc(modeHistory.readTogether),
    history: mapHistory(),
  };
}
