import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { subscribeToAuthState } from '../services/firebase/authService';
import type { AuthUser } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthReady,
    }),
    [user, isAuthReady],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
