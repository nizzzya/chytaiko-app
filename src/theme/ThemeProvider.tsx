import React, { createContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import {
  getThemeForColorScheme,
  type AppTheme,
  type ColorScheme,
} from './themes';

export type ThemeContextValue = {
  theme: AppTheme;
  colorScheme: ColorScheme;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getThemeForColorScheme(colorScheme),
      colorScheme,
    }),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
