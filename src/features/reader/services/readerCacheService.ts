import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chytaiko/reader-last-session';

export type ReaderSession = {
  lastOpenedStoryId: string;
  lastOpenedPage: number;
  lastOpenedAt: string;
};

let lastSession: ReaderSession | null = null;

async function persistSession(): Promise<void> {
  try {
    if (!lastSession) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lastSession));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

export function saveReaderSession(storyId: string, page: number): void {
  const normalizedStoryId = storyId.trim();

  if (!normalizedStoryId || page < 1) {
    return;
  }

  lastSession = {
    lastOpenedStoryId: normalizedStoryId,
    lastOpenedPage: page,
    lastOpenedAt: new Date().toISOString(),
  };

  void persistSession();
}

export function getLastReaderSession(): ReaderSession | null {
  return lastSession;
}

export function clearReaderSession(): void {
  lastSession = null;
  void persistSession();
}
