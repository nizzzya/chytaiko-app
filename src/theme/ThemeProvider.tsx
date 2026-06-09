import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  getThemePreference,
  saveThemePreference,
  subscribeThemePreference,
  type ThemePreference,
} from '../features/app/services/themePreferenceService';
import {
  getThemeForColorScheme,
  type AppTheme,
  type ColorScheme,
} from './themes';

export type ThemeContextValue = {
  theme: AppTheme;
  colorScheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

type ThemeProviderProps = {
  children: ReactNode;
};

function normalizeColorScheme(
  scheme: ColorScheme | null | undefined,
): ColorScheme {
  return scheme === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    getThemePreference,
  );

  useEffect(
    () => subscribeThemePreference((next) => setPreferenceState(next)),
    [],
  );

  const setPreference = useCallback((next: ThemePreference) => {
    saveThemePreference(next);
  }, []);

  const colorScheme: ColorScheme =
    preference === 'system' ? normalizeColorScheme(systemScheme) : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getThemeForColorScheme(colorScheme),
      colorScheme,
      preference,
      setPreference,
    }),
    [colorScheme, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
