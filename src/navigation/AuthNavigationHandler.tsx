import { useEffect } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';

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
  navigationRef: NavigationContainerRef<RootStackParamList>;
};

export function AuthNavigationHandler({
  navigationRef,
}: AuthNavigationHandlerProps) {
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !navigationRef.isReady()) {
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
  }, [user, isAuthReady, navigationRef]);

  return null;
}
