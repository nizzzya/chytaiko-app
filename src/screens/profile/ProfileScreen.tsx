import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h1">Профіль</AppText>

        {user ? (
          <LoggedInContent
            email={user.email}
            styles={styles}
            loading={loading}
            onLogout={handleLogout}
          />
        ) : (
          <LoggedOutContent
            styles={styles}
            onLogin={() => navigation.navigate('Login')}
            onRegister={() => navigation.navigate('Register')}
          />
        )}

        <AppButton
          label="До каталогу"
          variant="secondary"
          onPress={() => navigation.navigate('Home')}
          style={styles.catalogButton}
        />
      </ScrollView>
    </AppScreen>
  );
}

type LoggedOutContentProps = {
  styles: ReturnType<typeof createStyles>;
  onLogin: () => void;
  onRegister: () => void;
};

function LoggedOutContent({ styles, onLogin, onRegister }: LoggedOutContentProps) {
  return (
    <View style={styles.section}>
      <AppText variant="body" color="secondary" style={styles.message}>
        Обліковий запис не потрібен для читання казок.
      </AppText>
      <AppText variant="body" color="secondary">
        Він знадобиться пізніше для синхронізації обраного та прогресу.
      </AppText>
      <AppButton label="Увійти" onPress={onLogin} style={styles.action} />
      <AppButton
        label="Створити акаунт"
        variant="secondary"
        onPress={onRegister}
        style={styles.action}
      />
    </View>
  );
}

type LoggedInContentProps = {
  email: string | null;
  styles: ReturnType<typeof createStyles>;
  loading: boolean;
  onLogout: () => void;
};

function LoggedInContent({
  email,
  styles,
  loading,
  onLogout,
}: LoggedInContentProps) {
  return (
    <View style={styles.section}>
      {email ? (
        <AppText variant="bodyLarge" style={styles.email}>
          {email}
        </AppText>
      ) : null}
      <AppText variant="body" color="secondary" style={styles.message}>
        Читання доступне і без входу. Акаунт буде використано для майбутньої
        синхронізації.
      </AppText>
      <AppButton
        label="Вийти"
        variant="secondary"
        onPress={onLogout}
        loading={loading}
        disabled={loading}
        style={styles.action}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      flexGrow: 1,
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_16,
    },
    section: {
      marginTop: theme.spacing.space_6,
      gap: theme.spacing.space_3,
    },
    message: {
      marginTop: theme.spacing.space_2,
    },
    email: {
      marginBottom: theme.spacing.space_2,
    },
    action: {
      marginTop: theme.spacing.space_4,
    },
    catalogButton: {
      marginTop: theme.spacing.space_10,
    },
  });
}
