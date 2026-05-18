import { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '../theme';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ReaderScreen } from '../screens/reader/ReaderScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { StoryDetailsScreen } from '../screens/story/StoryDetailsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useAppTheme();

  const screenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.textPrimary,
      headerTitleStyle: {
        ...theme.typography.h3,
        color: theme.colors.textPrimary,
      },
      contentStyle: { backgroundColor: theme.colors.background },
      headerShadowVisible: false,
    }),
    [theme],
  );

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Вхід' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Реєстрація' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoryDetails"
        component={StoryDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
