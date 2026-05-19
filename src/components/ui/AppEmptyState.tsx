import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

type AppEmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AppEmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: AppEmptyStateProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.illustration} />
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color="secondary" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          variant="secondary"
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: theme.layout.screenPadding,
    },
    illustration: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.radius_full,
      borderWidth: 1.5,
      borderColor: theme.colors.textMuted,
      marginBottom: theme.spacing.space_6,
    },
    title: {
      textAlign: 'center',
    },
    message: {
      marginTop: theme.spacing.space_3,
      textAlign: 'center',
    },
    action: {
      marginTop: theme.spacing.space_8,
      alignSelf: 'stretch',
    },
  });
}
