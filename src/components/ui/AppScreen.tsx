import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '../../theme';

type AppScreenProps = ViewProps & {
  children: React.ReactNode;
  centered?: boolean;
  padded?: boolean;
  safe?: boolean;
};

export function AppScreen({
  children,
  centered = false,
  padded = true,
  safe = true,
  style,
  ...rest
}: AppScreenProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () => createStyles(theme, centered, padded),
    [theme, centered, padded],
  );

  if (safe) {
    return (
      <SafeAreaView style={[styles.container, style]} {...rest}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}

function createStyles(theme: AppTheme, centered: boolean, padded: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: padded ? theme.layout.screenPadding : 0,
      ...(centered && {
        justifyContent: 'center',
        alignItems: 'center',
      }),
    },
  });
}
