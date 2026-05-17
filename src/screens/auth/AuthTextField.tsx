import { useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';

type AuthTextFieldProps = TextInputProps & {
  placeholder: string;
};

export function AuthTextField({
  placeholder,
  style,
  ...rest
}: AuthTextFieldProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.input, style]}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    input: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.radius_md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 48,
      paddingHorizontal: theme.spacing.space_4,
      paddingVertical: theme.spacing.space_3,
    },
  });
}
