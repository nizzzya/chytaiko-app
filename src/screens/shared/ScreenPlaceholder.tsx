import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppScreen, AppText } from '../../components/ui';
import { useAppTheme, type AppTheme } from '../../theme';

type ScreenPlaceholderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ScreenPlaceholder({
  title,
  subtitle,
  actionLabel,
  onAction,
}: ScreenPlaceholderProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <AppScreen centered>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" color="secondary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
        {actionLabel && onAction ? (
          <AppButton
            label={actionLabel}
            onPress={onAction}
            style={styles.button}
          />
        ) : null}
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      alignItems: 'center',
      width: '100%',
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      marginTop: theme.spacing.space_2,
      textAlign: 'center',
    },
    button: {
      marginTop: theme.spacing.space_8,
      alignSelf: 'stretch',
    },
  });
}
