export type AuthUser = {
  uid: string;
  email: string | null;
};

export type AuthErrorCode =
  | 'invalid_email'
  | 'weak_password'
  | 'user_not_found'
  | 'wrong_password'
  | 'invalid_credential'
  | 'email_in_use'
  | 'too_many_requests'
  | 'network'
  | 'not_configured'
  | 'unknown';

export type AuthServiceError = {
  code: AuthErrorCode;
  message: string;
};

export type AuthResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: AuthServiceError };

export type AuthStateCallback = (user: AuthUser | null) => void;

export type AuthStateUnsubscribe = () => void;
