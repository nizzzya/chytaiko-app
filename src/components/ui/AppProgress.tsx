import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';

type AppProgressBarProps = {
  variant: 'bar';
  indeterminate?: boolean;
};

type AppProgressDotsProps = {
  variant: 'dots';
  total: number;
  current: number;
};

export type AppProgressProps = AppProgressBarProps | AppProgressDotsProps;

export function AppProgress(props: AppProgressProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (props.variant === 'bar') {
    return (
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            props.indeterminate ? styles.barIndeterminate : styles.barFull,
          ]}
        />
      </View>
    );
  }

  const { total, current } = props;

  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, index) => {
        const isActive = index + 1 === current;

        return (
          <View
            key={index}
            style={[styles.dot, isActive ? styles.dotActive : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    barTrack: {
      height: 3,
      borderRadius: theme.radius.radius_full,
      backgroundColor: theme.colors.surfaceMuted,
      overflow: 'hidden',
    },
    barFill: {
      height: 3,
      borderRadius: theme.radius.radius_full,
      backgroundColor: theme.colors.primary,
    },
    barFull: {
      width: '40%',
    },
    barIndeterminate: {
      width: '60%',
    },
    dotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.space_2,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.radius.radius_full,
    },
    dotActive: {
      backgroundColor: theme.colors.primary,
    },
    dotInactive: {
      backgroundColor: theme.colors.textMuted,
    },
  });
}
