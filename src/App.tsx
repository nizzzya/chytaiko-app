import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeProvider, useAppTheme, type AppTheme } from './theme';

function AppContent() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chytayko</Text>
      <Text style={styles.subtitle}>{theme.displayName}</Text>
      <Text style={styles.caption}>Theme system ready</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.layout.screenPadding,
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.space_2,
    },
    caption: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.space_1,
    },
  });
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
