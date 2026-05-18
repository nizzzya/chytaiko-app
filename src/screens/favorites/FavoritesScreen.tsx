import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppButton,
  AppCard,
  AppEmptyState,
  AppScreen,
  AppText,
} from '../../components/ui';
import { getFavorites, removeFavorite } from '../../features/favorites';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { Story, StoryCategory } from '../../types/story';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

const STORY_CATEGORY_LABELS: Record<StoryCategory, string> = {
  folk: 'Народні',
  fairy: 'Казки',
  bedtime: 'На ніч',
  animals: 'Тварини',
  nature: 'Природа',
};

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

  const handleRemove = (storyId: string) => {
    removeFavorite(storyId);
    loadFavorites();
  };

  if (stories.length === 0) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Немає обраних"
          message="Додайте казки з каталогу — вони з’являться тут."
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
        <View style={styles.header}>
          <AppText variant="h1">Обране</AppText>
          <AppText variant="body" color="secondary">
            Казки, які хочеться зберегти
          </AppText>
        </View>

        <View style={styles.list}>
          {stories.map((story) => (
            <FavoriteStoryCard
              key={story.id}
              story={story}
              styles={styles}
              onOpen={() =>
                navigation.navigate('StoryDetails', { storyId: story.id })
              }
              onRemove={() => handleRemove(story.id)}
            />
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

type FavoriteStoryCardProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  onOpen: () => void;
  onRemove: () => void;
};

function FavoriteStoryCard({
  story,
  styles,
  onOpen,
  onRemove,
}: FavoriteStoryCardProps) {
  const categoryLabel = STORY_CATEGORY_LABELS[story.category];

  return (
    <AppCard>
      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        style={({ pressed }) => [pressed && styles.cardPressed]}
      >
        <AppText variant="h3">{story.title}</AppText>
        <AppText
          variant="body"
          color="secondary"
          numberOfLines={2}
          style={styles.cardDescription}
        >
          {story.description}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.cardMeta}>
          {story.ageGroup} · {categoryLabel} · {story.pageCount} стор.
        </AppText>
      </Pressable>
      <AppButton
        label="Прибрати з обраного"
        variant="secondary"
        onPress={onRemove}
        style={styles.removeButton}
      />
    </AppCard>
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
    list: {
      gap: theme.layout.cardGap,
    },
    cardPressed: {
      opacity: theme.opacity.pressed,
    },
    cardDescription: {
      marginTop: theme.spacing.space_3,
    },
    cardMeta: {
      marginTop: theme.spacing.space_3,
    },
    removeButton: {
      marginTop: theme.spacing.space_4,
    },
  });
}
