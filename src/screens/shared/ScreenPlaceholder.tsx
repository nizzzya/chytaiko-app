import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: theme.opacity.pressed },
          ]}
        >
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.layout.screenPadding,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.space_2,
      textAlign: 'center',
    },
    button: {
      marginTop: theme.spacing.space_8,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.space_3,
      paddingHorizontal: theme.spacing.space_6,
      borderRadius: theme.radius.radius_md,
      minHeight: 48,
      justifyContent: 'center',
    },
    buttonLabel: {
      ...theme.typography.body,
      fontWeight: '500',
      color: theme.colors.textPrimary,
    },
  });
}
