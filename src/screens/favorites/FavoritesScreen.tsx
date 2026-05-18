import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppCard, AppEmptyState, AppScreen, AppText } from '../../components/ui';
import { getFavorites } from '../../features/favorites';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { Story } from '../../types/story';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [stories, setStories] = useState<Story[]>([]);

  const loadFavorites = useCallback(() => {
    const result = getFavorites();

    if (!result.success) {
      setStories([]);
      return;
    }

    const favoriteStories = result.data
      .map((favorite) => getStoryById(favorite.storyId))
      .filter((story): story is Story => story !== undefined);

    setStories(favoriteStories);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  if (stories.length === 0) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Немає обраних"
          message="Казки, які вам сподобаються, з’являться тут."
          actionLabel="До каталогу"
          onAction={() => navigation.navigate('Home')}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h1" style={styles.title}>
          Обране
        </AppText>
        <View style={styles.list}>
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
            </AppCard>
          ))}
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
    title: {
      marginBottom: theme.spacing.space_2,
    },
    list: {
      gap: theme.layout.cardGap,
    },
    cardMeta: {
      marginTop: theme.spacing.space_2,
    },
  });
}
