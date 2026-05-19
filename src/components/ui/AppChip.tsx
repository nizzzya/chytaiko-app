import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';
import { AppText } from './AppText';

type AppChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function AppChip({ label, selected = false, onPress }: AppChipProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => createStyles(theme, selected),
    [theme, selected],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        pressed && { opacity: theme.opacity.pressed },
      ]}
    >
      <AppText variant="caption" color={selected ? 'primary' : 'secondary'}>
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(theme: AppTheme, selected: boolean) {
  return StyleSheet.create({
    chip: {
      minHeight: 36,
      paddingHorizontal: theme.spacing.space_4,
      paddingVertical: theme.spacing.space_2,
      borderRadius: theme.radius.radius_full,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: selected
        ? theme.colors.primarySoft
        : theme.colors.surfaceMuted,
      borderWidth: selected ? 1 : 0,
      borderColor: selected ? theme.colors.primary : 'transparent',
    },
  });
}
