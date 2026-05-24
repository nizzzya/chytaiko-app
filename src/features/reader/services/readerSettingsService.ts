import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chytaiko/reader-settings';

export type ReaderSettings = {
  showIllustrations: boolean;
};

type ReaderSettingsListener = (settings: ReaderSettings) => void;

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  showIllustrations: true,
};

let currentSettings: ReaderSettings = { ...DEFAULT_READER_SETTINGS };

const listeners = new Set<ReaderSettingsListener>();

function notifyListeners(): void {
  for (const listener of listeners) {
    listener(currentSettings);
  }
}

function isReaderSettingsRecord(value: unknown): value is ReaderSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof (value as ReaderSettings).showIllustrations === 'boolean';
}

async function persistSettings(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

export function getReaderSettings(): ReaderSettings {
  return currentSettings;
}

export function saveReaderSettings(settings: ReaderSettings): void {
  currentSettings = {
    showIllustrations: settings.showIllustrations,
  };

  notifyListeners();
  void persistSettings();
}

export function subscribeReaderSettings(
  listener: ReaderSettingsListener,
): () => void {
  listeners.add(listener);
  listener(currentSettings);

  return () => {
    listeners.delete(listener);
  };
}

export async function hydrateReaderSettings(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      currentSettings = { ...DEFAULT_READER_SETTINGS };
      return;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isReaderSettingsRecord(parsed)) {
      currentSettings = { ...DEFAULT_READER_SETTINGS };
      return;
    }

    currentSettings = parsed;
  } catch {
    currentSettings = { ...DEFAULT_READER_SETTINGS };
  }
}
