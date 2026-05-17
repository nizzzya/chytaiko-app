import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppScreen, AppText } from '../../components/ui';
import { useAuth } from '../../navigation/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { logout } from '../../services/firebase/authService';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setErrorMessage(null);
    setLoading(true);

    const result = await logout();

    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error.message);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  return (
    <AppScreen>
      <View style={styles.content}>
        <AppText variant="h2">Профіль</AppText>
        {user?.email ? (
          <AppText variant="body" color="secondary" style={styles.email}>
            {user.email}
          </AppText>
        ) : null}
        <AppText variant="body" color="muted" style={styles.hint}>
          Налаштування — незабаром
        </AppText>
        {errorMessage ? (
          <AppText variant="caption" color="error" style={styles.error}>
            {errorMessage}
          </AppText>
        ) : null}
        <AppButton
          label="Вийти"
          variant="secondary"
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
          style={styles.logout}
        />
      </View>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      flex: 1,
      paddingTop: theme.spacing.space_4,
    },
    email: {
      marginTop: theme.spacing.space_2,
    },
    hint: {
      marginTop: theme.spacing.space_4,
    },
    error: {
      marginTop: theme.spacing.space_4,
    },
    logout: {
      marginTop: theme.spacing.space_8,
    },
  });
}
