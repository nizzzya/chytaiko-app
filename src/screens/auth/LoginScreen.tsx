import { loginWithEmail } from '../../services/firebase/authService';
import { AuthForm } from './AuthForm';

export function LoginScreen() {
  return (
    <AuthForm title="Вхід" submitLabel="Увійти" onSubmit={loginWithEmail} />
  );
}
