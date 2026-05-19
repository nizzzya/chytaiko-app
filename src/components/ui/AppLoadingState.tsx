import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppProgress } from './AppProgress';

type AppLoadingStateProps = {
  variant?: 'skeleton' | 'bar';
  rows?: number;
};

export function AppLoadingState({
  variant = 'skeleton',
  rows = 3,
}: AppLoadingStateProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (variant === 'bar') {
    return (
      <View style={styles.barContainer}>
        <AppProgress variant="bar" indeterminate />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cover} />
          <View style={styles.lineLarge} />
          <View style={styles.lineSmall} />
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.layout.cardGap,
    },
    barContainer: {
      paddingVertical: theme.spacing.space_4,
    },
    card: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.radius_lg,
      minHeight: theme.layout.cardMinHeight,
      padding: theme.spacing.space_5,
      gap: theme.spacing.space_3,
    },
    cover: {
      height: 72,
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surface,
    },
    lineLarge: {
      height: 14,
      width: '70%',
      borderRadius: theme.radius.radius_sm,
      backgroundColor: theme.colors.surface,
    },
    lineSmall: {
      height: 10,
      width: '40%',
      borderRadius: theme.radius.radius_sm,
      backgroundColor: theme.colors.surface,
    },
  });
}
