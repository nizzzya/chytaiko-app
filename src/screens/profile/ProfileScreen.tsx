import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppScreen, AppText } from '../../components/ui';
import type { ThemePreference } from '../../features/app/services/themePreferenceService';
import { useAuth } from '../../navigation/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { logout } from '../../services/firebase/authService';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Як у системі' },
  { value: 'light', label: 'Світла' },
  { value: 'dark', label: 'Темна' },
];

export function ProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { theme, preference, setPreference } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [loading, setLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    setLoading(true);

    const result = await logout();

    setLoading(false);

    if (!result.success) {
      setLogoutError(result.error.message);
    }
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
            logoutError={logoutError}
            onLogout={handleLogout}
          />
        ) : (
          <LoggedOutContent
            styles={styles}
            onLogin={() => navigation.navigate('Login')}
            onRegister={() => navigation.navigate('Register')}
          />
        )}

        <ThemeSelector
          styles={styles}
          preference={preference}
          onSelect={setPreference}
        />

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
  logoutError: string | null;
  onLogout: () => void;
};

function LoggedInContent({
  email,
  styles,
  loading,
  logoutError,
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
      {logoutError ? (
        <AppText variant="caption" color="error" style={styles.logoutError}>
          {logoutError}
        </AppText>
      ) : null}
    </View>
  );
}

type ThemeSelectorProps = {
  styles: ReturnType<typeof createStyles>;
  preference: ThemePreference;
  onSelect: (preference: ThemePreference) => void;
};

function ThemeSelector({ styles, preference, onSelect }: ThemeSelectorProps) {
  return (
    <View style={styles.themeSection}>
      <AppText variant="caption" color="muted" style={styles.themeLabel}>
        Тема
      </AppText>
      <View style={styles.themeOptions}>
        {THEME_OPTIONS.map((option) => {
          const selected = option.value === preference;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.themeOption,
                selected && styles.themeOptionSelected,
                pressed && styles.themeOptionPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
            >
              <AppText
                variant="body"
                color={selected ? 'primary' : 'secondary'}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
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
    logoutError: {
      marginTop: theme.spacing.space_2,
    },
    catalogButton: {
      marginTop: theme.spacing.space_10,
    },
    themeSection: {
      marginTop: theme.spacing.space_8,
      gap: theme.spacing.space_3,
    },
    themeLabel: {
      letterSpacing: 0.3,
      opacity: 0.7,
    },
    themeOptions: {
      gap: theme.spacing.space_2,
    },
    themeOption: {
      paddingVertical: theme.spacing.space_3,
      paddingHorizontal: theme.spacing.space_4,
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surface,
    },
    themeOptionSelected: {
      backgroundColor: theme.colors.primarySoft,
    },
    themeOptionPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
  });
}
