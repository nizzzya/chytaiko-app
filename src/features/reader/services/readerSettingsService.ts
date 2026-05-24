import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chytaiko/reader-settings';

export type ReadingMode = 'default' | 'night' | 'day' | 'travel' | 'quiet';

export type ReaderSettings = {
  showIllustrations: boolean;
  readingMode: ReadingMode;
};

export type ReaderModePresentation = {
  scrollGap: number;
  imageHeightScale: number;
  prioritizeText: boolean;
};

type ReaderSettingsListener = (settings: ReaderSettings) => void;

const READING_MODES: ReadingMode[] = [
  'default',
  'night',
  'day',
  'travel',
  'quiet',
];

export const READER_MODE_OPTIONS: { mode: ReadingMode; label: string }[] = [
  { mode: 'default', label: 'Звичайний' },
  { mode: 'night', label: 'На ніч' },
  { mode: 'day', label: 'День' },
  { mode: 'travel', label: 'Дорога' },
  { mode: 'quiet', label: 'Тихий час' },
];

const DEFAULT_READER_SETTINGS: ReaderSettings = {
  showIllustrations: true,
  readingMode: 'default',
};

let currentSettings: ReaderSettings = { ...DEFAULT_READER_SETTINGS };

const listeners = new Set<ReaderSettingsListener>();

function isReadingMode(value: unknown): value is ReadingMode {
  return (
    typeof value === 'string' &&
    (READING_MODES as string[]).includes(value)
  );
}

function normalizeSettings(
  patch: Partial<ReaderSettings>,
  previous: ReaderSettings,
): ReaderSettings {
  const nextMode = isReadingMode(patch.readingMode)
    ? patch.readingMode
    : previous.readingMode;

  const enteringTravel =
    nextMode === 'travel' && previous.readingMode !== 'travel';

  let showIllustrations =
    typeof patch.showIllustrations === 'boolean'
      ? patch.showIllustrations
      : previous.showIllustrations;

  if (enteringTravel && typeof patch.showIllustrations !== 'boolean') {
    showIllustrations = false;
  }

  return {
    showIllustrations,
    readingMode: nextMode,
  };
}

function parseStoredSettings(value: unknown): ReaderSettings {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_READER_SETTINGS };
  }

  const record = value as Partial<ReaderSettings>;

  return {
    showIllustrations:
      typeof record.showIllustrations === 'boolean'
        ? record.showIllustrations
        : DEFAULT_READER_SETTINGS.showIllustrations,
    readingMode: isReadingMode(record.readingMode)
      ? record.readingMode
      : DEFAULT_READER_SETTINGS.readingMode,
  };
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener(currentSettings);
  }
}

async function persistSettings(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

/**
 * Layout hints per reading mode (spacing only — no theme or sound changes).
 */
export function getReaderModePresentation(
  mode: ReadingMode,
  spacing: { space_4: number; space_6: number },
): ReaderModePresentation {
  switch (mode) {
    case 'night':
      return {
        scrollGap: spacing.space_4,
        imageHeightScale: 0.85,
        prioritizeText: false,
      };
    case 'travel':
      return {
        scrollGap: spacing.space_6,
        imageHeightScale: 0.75,
        prioritizeText: true,
      };
    case 'day':
    case 'quiet':
    case 'default':
    default:
      return {
        scrollGap: spacing.space_6,
        imageHeightScale: 1,
        prioritizeText: false,
      };
  }
}

export function getReaderSettings(): ReaderSettings {
  return currentSettings;
}

export function saveReaderSettings(patch: Partial<ReaderSettings>): void {
  currentSettings = normalizeSettings(patch, currentSettings);
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
    currentSettings = parseStoredSettings(parsed);
  } catch {
    currentSettings = { ...DEFAULT_READER_SETTINGS };
  }
}
