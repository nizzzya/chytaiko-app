import { useMemo } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppText } from './AppText';

type AppIconButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  selected?: boolean;
};

export function AppIconButton({
  label,
  selected = false,
  style,
  ...rest
}: AppIconButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && { backgroundColor: theme.colors.surfaceMuted },
        style,
      ]}
      {...rest}
    >
      <AppText
        variant="body"
        color={selected ? 'primary' : 'secondary'}
        style={styles.glyph}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.radius_full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    glyph: {
      fontSize: 20,
      lineHeight: 24,
    },
  });
}
