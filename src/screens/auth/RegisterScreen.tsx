import { registerWithEmail } from '../../services/firebase/authService';
import { AuthForm } from './AuthForm';

export function RegisterScreen() {
  return (
    <AuthForm
      title="Реєстрація"
      submitLabel="Зареєструватися"
      onSubmit={registerWithEmail}
    />
  );
}
