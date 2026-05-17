import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AppButton, AppScreen, AppText } from '../../components/ui';
import { useAppTheme, type AppTheme } from '../../theme';
import type { AuthResult, AuthUser } from '../../types/auth';
import { AuthTextField } from './AuthTextField';

type AuthFormProps = {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<AuthResult<AuthUser>>;
};

export function AuthForm({ title, submitLabel, onSubmit }: AuthFormProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setLoading(true);

    const result = await onSubmit(email, password);

    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error.message);
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <AppText variant="h1" style={styles.title}>
          {title}
        </AppText>

        <View style={styles.fields}>
          <AuthTextField
            placeholder="Електронна пошта"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!loading}
          />
          <AuthTextField
            placeholder="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            editable={!loading}
          />
        </View>

        {errorMessage ? (
          <AppText variant="caption" color="error" style={styles.error}>
            {errorMessage}
          </AppText>
        ) : null}

        <AppButton
          label={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submit}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: theme.spacing.space_8,
    },
    title: {
      marginBottom: theme.spacing.space_8,
    },
    fields: {
      gap: theme.spacing.space_4,
    },
    error: {
      marginTop: theme.spacing.space_4,
    },
    submit: {
      marginTop: theme.spacing.space_6,
    },
  });
}
