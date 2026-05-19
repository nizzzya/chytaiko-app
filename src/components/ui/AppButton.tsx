import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppText } from './AppText';

export type AppButtonVariant = 'primary' | 'secondary';

type AppButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: AppButtonVariant;
  loading?: boolean;
};

export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme, variant), [theme, variant]);
  const isDisabled = disabled || loading;

  const primaryLabelStyle =
    variant === 'primary' && theme.colorScheme === 'light'
      ? { color: theme.colors.background }
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: theme.opacity.pressed },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' && theme.colorScheme === 'light'
              ? theme.colors.background
              : theme.colors.textPrimary
          }
        />
      ) : (
        <AppText
          variant="body"
          color="primary"
          style={[styles.label, primaryLabelStyle]}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

function createStyles(theme: AppTheme, variant: AppButtonVariant) {
  const base = {
    minHeight: 48,
    paddingVertical: theme.spacing.space_3,
    paddingHorizontal: theme.spacing.space_6,
    borderRadius: theme.radius.radius_md,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  if (variant === 'primary') {
    return StyleSheet.create({
      button: {
        ...base,
        backgroundColor: theme.colors.primary,
      },
      label: {
        fontWeight: '500',
      },
      disabled: {
        opacity: theme.opacity.disabled,
      },
    });
  }

  return StyleSheet.create({
    button: {
      ...base,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      fontWeight: '500',
    },
    disabled: {
      opacity: theme.opacity.disabled,
    },
  });
}
