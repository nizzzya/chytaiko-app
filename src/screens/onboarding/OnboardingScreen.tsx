import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppScreen, AppText } from '../../components/ui';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <AppScreen centered>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          Ласкаво просимо
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Українські казки для спокійного читання
        </AppText>
        <AppText variant="body" color="secondary" style={styles.message}>
          Читати казки можна без акаунта.
        </AppText>
        <View style={styles.buttons}>
          <AppButton
            label="До каталогу"
            onPress={() => navigation.navigate('Home')}
          />
          <AppButton
            label="Увійти"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
          />
          <AppButton
            label="Створити акаунт"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      width: '100%',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
    subtitle: {
      marginTop: theme.spacing.space_2,
      textAlign: 'center',
    },
    message: {
      marginTop: theme.spacing.space_6,
      textAlign: 'center',
    },
    buttons: {
      marginTop: theme.spacing.space_8,
      width: '100%',
      gap: theme.spacing.space_3,
    },
  });
}
