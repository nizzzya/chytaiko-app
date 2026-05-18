import { useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppTheme } from '../theme';
import { AuthNavigationHandler } from './AuthNavigationHandler';
import { AuthProvider } from './AuthContext';
import { RootNavigator } from './RootNavigator';
import { navigationRef } from './navigationRef';

export function AppNavigation() {
  const { theme } = useAppTheme();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const navigationTheme = useMemo(() => {
    const base = theme.colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...base,
      dark: theme.colorScheme === 'dark',
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
        notification: theme.colors.primary,
      },
    };
  }, [theme]);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        onReady={() => setIsNavigationReady(true)}
      >
        <AuthProvider>
          <AuthNavigationHandler isNavigationReady={isNavigationReady} />
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
