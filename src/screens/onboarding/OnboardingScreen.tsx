import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { ScreenPlaceholder } from '../shared/ScreenPlaceholder';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <ScreenPlaceholder
      title="Ласкаво просимо"
      subtitle="Українські казки для спокійного читання"
      actionLabel="Почати"
      onAction={() => navigation.replace('Home')}
    />
  );
}
