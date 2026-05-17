import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppChip,
  AppEmptyState,
  AppProgress,
  AppScreen,
  AppText,
} from '../../components/ui';
import { useAppTheme, type AppTheme } from '../../theme';

export function HomeScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="h1">Читайко</AppText>
          <AppText variant="body" color="secondary" style={styles.subtitle}>
            Демо компонентів
          </AppText>
        </View>

        <AppCard style={styles.card}>
          <AppText variant="h3">Каталог казок</AppText>
        </AppCard>

        <View style={styles.buttons}>
          <AppButton label="Відкрити казки" variant="primary" />
          <AppButton label="Обране" variant="secondary" />
        </View>

        <View style={styles.chips}>
          <AppChip label="4+" selected />
          <AppChip label="5+" />
          <AppChip label="6+" />
        </View>

        <View style={styles.progressSection}>
          <AppText variant="caption" color="muted">
            Прогрес
          </AppText>
          <AppProgress variant="dots" total={5} current={2} />
          <AppProgress variant="bar" indeterminate />
        </View>

        <View style={styles.emptySection}>
          <AppEmptyState
            title="Немає обраних"
            message="Казки, які вам сподобаються, з’являться тут."
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_16,
      gap: theme.layout.sectionGap,
    },
    header: {
      gap: theme.spacing.space_2,
    },
    subtitle: {
      marginTop: theme.spacing.space_1,
    },
    card: {
      marginTop: theme.spacing.space_2,
    },
    buttons: {
      gap: theme.spacing.space_3,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.space_2,
    },
    progressSection: {
      gap: theme.spacing.space_3,
      paddingHorizontal: theme.spacing.space_2,
    },
    emptySection: {
      marginTop: theme.spacing.space_4,
    },
  });
}
