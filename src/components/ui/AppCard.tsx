import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme';

type AppCardProps = {
  children: React.ReactNode;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ children, onPress, style }: AppCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: theme.opacity.pressed },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.radius_lg,
      minHeight: theme.layout.cardMinHeight,
      padding: theme.spacing.space_5,
      ...theme.shadows.shadow_sm,
    },
  });
}
