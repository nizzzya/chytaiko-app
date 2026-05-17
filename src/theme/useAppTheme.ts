import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from './ThemeProvider';

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }

  return context;
}
