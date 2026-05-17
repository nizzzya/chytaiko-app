import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { ScreenPlaceholder } from '../shared/ScreenPlaceholder';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <ScreenPlaceholder
      title="Читайко"
      subtitle="Казки для дітей"
      actionLabel="Далі"
      onAction={() => navigation.replace('Onboarding')}
    />
  );
}
