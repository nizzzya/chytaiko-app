import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppCard, AppScreen, AppText } from '../../components/ui';
import { getStories } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const stories = getStories();

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="h1">Читайко</AppText>
          <AppText variant="body" color="secondary">
            Казки для дітей
          </AppText>
        </View>

        <View style={styles.catalog}>
          {stories.map((story) => (
            <AppCard
              key={story.id}
              onPress={() =>
                navigation.navigate('StoryDetails', { storyId: story.id })
              }
            >
              <AppText variant="h3">{story.title}</AppText>
              <AppText variant="caption" color="muted" style={styles.cardMeta}>
                {story.ageGroup} · {story.pageCount} стор.
              </AppText>
              <AppText
                variant="body"
                color="secondary"
                numberOfLines={2}
                style={styles.cardDescription}
              >
                {story.description}
              </AppText>
            </AppCard>
          ))}
        </View>

        <View style={styles.navSection}>
          <AppText variant="caption" color="muted">
            Навігація (тест)
          </AppText>
          <View style={styles.navRow}>
            <AppButton
              label="Профіль"
              variant="secondary"
              onPress={() => navigation.navigate('Profile')}
              style={styles.navButton}
            />
            <AppButton
              label="Обране"
              variant="secondary"
              onPress={() => navigation.navigate('Favorites')}
              style={styles.navButton}
            />
          </View>
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
    catalog: {
      gap: theme.layout.cardGap,
    },
    cardMeta: {
      marginTop: theme.spacing.space_2,
    },
    cardDescription: {
      marginTop: theme.spacing.space_3,
    },
    navSection: {
      gap: theme.spacing.space_3,
    },
    navRow: {
      flexDirection: 'row',
      gap: theme.spacing.space_3,
    },
    navButton: {
      flex: 1,
    },
  });
}
