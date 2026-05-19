import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
      <AppText variant="h1">Читайко</AppText>
      <AppText variant="body" color="secondary" style={styles.subtitle}>
        Казки для спокійного читання
      </AppText>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    subtitle: {
      marginTop: theme.spacing.space_2,
    },
  });
}
