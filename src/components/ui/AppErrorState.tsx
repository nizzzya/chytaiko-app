import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

type AppErrorStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export function AppErrorState({
  title,
  message,
  actionLabel = 'Спробувати знову',
  onRetry,
}: AppErrorStateProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <AppText variant="h3" color="error">
          !
        </AppText>
      </View>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color="secondary" style={styles.message}>
        {message}
      </AppText>
      {onRetry ? (
        <AppButton
          label={actionLabel}
          variant="secondary"
          onPress={onRetry}
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
    icon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.radius_full,
      borderWidth: 1.5,
      borderColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
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
