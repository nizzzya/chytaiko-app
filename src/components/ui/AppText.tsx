import { useMemo } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme, type AppTheme, type TypographyTokens } from '../../theme';

export type AppTextVariant = keyof TypographyTokens;

export type AppTextColor = 'primary' | 'secondary' | 'muted' | 'error';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: AppTextColor;
  children: React.ReactNode;
};

export function AppText({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useAppTheme();
  const textStyle = useMemo(
    () => createTextStyle(theme, variant, color),
    [theme, variant, color],
  );

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}

function createTextStyle(
  theme: AppTheme,
  variant: AppTextVariant,
  color: AppTextColor,
): TextStyle {
  const colorMap: Record<AppTextColor, string> = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    error: theme.colors.error,
  };

  return {
    ...theme.typography[variant],
    color: colorMap[color],
  };
}
