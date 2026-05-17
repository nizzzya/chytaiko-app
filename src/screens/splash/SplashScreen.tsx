import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppScreen, AppText } from '../../components/ui';
import { useAuth } from '../../navigation/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { user, isAuthReady } = useAuth();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (user) {
      navigation.replace('Home');
    } else {
      navigation.replace('Onboarding');
    }
  }, [isAuthReady, user, navigation]);

  return (
    <AppScreen centered>
      <AppText variant="h1">Читайко</AppText>
      <AppText variant="body" color="secondary" style={styles.subtitle}>
        Казки для дітей
      </AppText>
      {!isAuthReady ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : null}
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    subtitle: {
      marginTop: theme.spacing.space_2,
    },
    loader: {
      marginTop: theme.spacing.space_6,
    },
  });
}
