import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen, AppText } from '../../components/ui';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    navigation.replace('Home');
  }, [navigation]);

  return (
    <AppScreen centered>
      <View style={styles.page}>
        {/* TODO: Replace with final Teri illustration (PRODUCT_DESIGN_CONSTITUTION — Character System). */}
        <View
          accessibilityRole="image"
          accessibilityLabel="Тері, друг казок"
          style={styles.teriPlaceholder}
        />

        <View style={styles.titleBlock}>
          <AppText variant="h1" style={styles.brandTitle}>
            Читайко
          </AppText>
          <AppText variant="body" color="secondary" style={styles.subtitle}>
            Час для казки
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    page: {
      alignItems: 'center',
      gap: theme.spacing.space_8,
      paddingHorizontal: theme.layout.screenPadding,
    },
    teriPlaceholder: {
      width: 132,
      height: 132,
      borderRadius: theme.radius.radius_2xl,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.shadow_sm,
    },
    titleBlock: {
      alignItems: 'center',
      gap: theme.spacing.space_2,
    },
    brandTitle: {
      fontWeight: '600',
      letterSpacing: -0.4,
      textAlign: 'center',
    },
    subtitle: {
      opacity: 0.66,
      letterSpacing: 0.2,
      textAlign: 'center',
    },
  });
}
