import { useEffect } from 'react';

import { navigationRef } from './navigationRef';
import { useAuth } from './AuthContext';
import type { RootStackParamList } from './types';

const PROTECTED_ROUTES: (keyof RootStackParamList)[] = [
  'Home',
  'Favorites',
  'Profile',
  'StoryDetails',
  'Reader',
];

type AuthNavigationHandlerProps = {
  isNavigationReady: boolean;
};

function canUseNavigationRef(): boolean {
  return (
    typeof navigationRef.isReady === 'function' && navigationRef.isReady()
  );
}

export function AuthNavigationHandler({
  isNavigationReady,
}: AuthNavigationHandlerProps) {
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !isNavigationReady || !canUseNavigationRef()) {
      return;
    }

    if (user) {
      return;
    }

    const routeName = navigationRef.getCurrentRoute()?.name;

    if (routeName && PROTECTED_ROUTES.includes(routeName)) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  }, [user, isAuthReady, isNavigationReady]);

  return null;
}
