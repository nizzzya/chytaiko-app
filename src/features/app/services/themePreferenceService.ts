import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@chytaiko/theme-preference';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

type ThemePreferenceListener = (preference: ThemePreference) => void;

let currentPreference: ThemePreference = DEFAULT_THEME_PREFERENCE;

const listeners = new Set<ThemePreferenceListener>();

function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === 'string' &&
    (THEME_PREFERENCES as string[]).includes(value)
  );
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener(currentPreference);
  }
}

async function persistPreference(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentPreference));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

export function getThemePreference(): ThemePreference {
  return currentPreference;
}

export function saveThemePreference(preference: ThemePreference): void {
  currentPreference = isThemePreference(preference)
    ? preference
    : DEFAULT_THEME_PREFERENCE;
  notifyListeners();
  void persistPreference();
}

export function subscribeThemePreference(
  listener: ThemePreferenceListener,
): () => void {
  listeners.add(listener);
  listener(currentPreference);

  return () => {
    listeners.delete(listener);
  };
}

export async function hydrateThemePreference(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      currentPreference = DEFAULT_THEME_PREFERENCE;
      return;
    }

    const parsed: unknown = JSON.parse(raw);
    currentPreference = isThemePreference(parsed)
      ? parsed
      : DEFAULT_THEME_PREFERENCE;
  } catch {
    currentPreference = DEFAULT_THEME_PREFERENCE;
  }
}
