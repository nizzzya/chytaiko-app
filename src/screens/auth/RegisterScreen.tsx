import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { registerWithEmail } from '../../services/firebase/authService';
import type { RootStackParamList } from '../../navigation/types';
import { AuthForm } from './AuthForm';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  return (
    <AuthForm
      title="Реєстрація"
      submitLabel="Зареєструватися"
      onSubmit={registerWithEmail}
      onSuccess={() => navigation.replace('Home')}
      onReadWithoutAccount={() => navigation.replace('Home')}
      alternateAction={{
        label: 'Увійти',
        onPress: () => navigation.navigate('Login'),
      }}
    />
  );
}
