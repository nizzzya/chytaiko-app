import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { loginWithEmail } from '../../services/firebase/authService';
import type { RootStackParamList } from '../../navigation/types';
import { AuthForm } from './AuthForm';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  return (
    <AuthForm
      title="Вхід"
      submitLabel="Увійти"
      onSubmit={loginWithEmail}
      onSuccess={() => navigation.replace('Home')}
      alternateAction={{
        label: 'Створити акаунт',
        onPress: () => navigation.navigate('Register'),
      }}
    />
  );
}
