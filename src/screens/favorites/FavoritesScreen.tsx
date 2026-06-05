import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppEmptyState,
  AppErrorState,
  AppImage,
  AppLoadingState,
  AppScreen,
  AppText,
} from '../../components/ui';
import {
  isHydrated,
  subscribeHydration,
} from '../../features/app/services/appHydrationService';
import { getFavorites, removeFavorite } from '../../features/favorites';
import { useStoryImageSource } from '../../features/stories/hooks/useStoryImageSource';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { Story } from '../../types/story';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [hydrationReady, setHydrationReady] = useState(isHydrated());

  useEffect(() => subscribeHydration(() => setHydrationReady(true)), []);

  const loadFavorites = useCallback(() => {
    const result = getFavorites();

    if (!result.success) {
      setLoadFailed(true);
      setStories([]);
      return;
    }

    setLoadFailed(false);

    const favoriteStories = result.data
      .map((favorite) => getStoryById(favorite.storyId))
      .filter((story): story is Story => story !== undefined);

    setStories(favoriteStories);
  }, []);

  useEffect(() => {
    if (!hydrationReady) {
      return;
    }

    loadFavorites();
  }, [hydrationReady, loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      if (!hydrationReady) {
        return;
      }

      loadFavorites();
    }, [hydrationReady, loadFavorites]),
  );

  const handleRemove = (storyId: string) => {
    removeFavorite(storyId);
    loadFavorites();
  };

  if (!hydrationReady) {
    return (
      <AppScreen>
        <AppLoadingState variant="bar" />
      </AppScreen>
    );
  }

  if (loadFailed) {
    return (
      <AppScreen centered>
        <AppErrorState
          title="Не вдалося завантажити обране"
          message="Спробуйте пізніше або поверніться до каталогу."
          actionLabel="До каталогу"
          onRetry={() => navigation.navigate('Home')}
        />
      </AppScreen>
    );
  }

  if (stories.length === 0) {
    return (
      <AppScreen padded={false}>
        <View style={styles.emptyScreen}>
          <AppEmptyState
            title="Тут живуть улюблені казки"
            message="Ця поличка чекає на казки, які ви полюбите разом."
            actionLabel="До каталогу"
            onAction={() => navigation.navigate('Home')}
          />
        </View>
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
          <AppText variant="h1" style={styles.headerTitle}>
            Обране
          </AppText>
          <AppText variant="body" color="secondary" style={styles.headerSubtitle}>
            Казки, до яких хочеться повертатися разом
          </AppText>
        </View>

        <View style={styles.collection}>
          {stories.map((story) => (
            <FavoriteStoryItem
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

type FavoriteStoryItemProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  onOpen: () => void;
  onRemove: () => void;
};

function FavoriteStoryItem({
  story,
  styles,
  onOpen,
  onRemove,
}: FavoriteStoryItemProps) {
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <View style={styles.collectionItem}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={story.title}
        onPress={onOpen}
        style={({ pressed }) => [styles.niche, pressed && styles.nichePressed]}
      >
        <AppImage
          source={coverImage.source}
          fallbackLabel="Обкладинка"
          aspectRatio={3 / 4}
          resizeMode="cover"
          style={styles.bookCover}
        />
        <View style={styles.bookBody}>
          <View style={styles.titleRow}>
            <AppText variant="caption" style={styles.lovedMark}>
              ♥
            </AppText>
            <AppText variant="bodyLarge" numberOfLines={2} style={styles.bookTitle}>
              {story.title}
            </AppText>
          </View>
          <AppText variant="caption" color="muted" numberOfLines={1} style={styles.bookMeta}>
            {story.ageGroup} · {story.pageCount} стор.
          </AppText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Прибрати з обраного"
        onPress={onRemove}
        style={({ pressed }) => [
          styles.removeAction,
          pressed && styles.removeActionPressed,
        ]}
      >
        <AppText variant="caption" color="muted" style={styles.removeActionLabel}>
          Прибрати з колекції
        </AppText>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_5,
      paddingBottom: theme.spacing.space_16,
      gap: theme.spacing.space_6,
    },
    header: {
      gap: theme.spacing.space_2,
    },
    headerTitle: {
      fontWeight: '600',
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      opacity: 0.66,
      lineHeight: theme.typography.body.lineHeight + 2,
      maxWidth: 300,
    },
    emptyScreen: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.layout.screenPadding,
      paddingVertical: theme.spacing.space_16,
    },
    collection: {
      gap: theme.spacing.space_5,
    },
    collectionItem: {
      gap: theme.spacing.space_1,
    },
    niche: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.space_4,
      padding: theme.spacing.space_3,
      borderRadius: theme.radius.radius_lg,
      backgroundColor: theme.colors.surface,
    },
    nichePressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    bookCover: {
      width: 64,
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surfaceMuted,
      ...theme.shadows.shadow_sm,
    },
    bookBody: {
      flex: 1,
      gap: theme.spacing.space_1,
      paddingVertical: theme.spacing.space_1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.space_2,
    },
    lovedMark: {
      color: theme.colors.primary,
      opacity: 0.55,
      lineHeight: theme.typography.bodyLarge.lineHeight,
    },
    bookTitle: {
      flex: 1,
      fontWeight: '600',
    },
    bookMeta: {
      fontSize: 11,
      lineHeight: 14,
      opacity: 0.36,
    },
    removeAction: {
      alignSelf: 'flex-start',
      minHeight: 36,
      marginLeft: theme.spacing.space_3,
      paddingHorizontal: theme.spacing.space_2,
      paddingVertical: theme.spacing.space_1,
      justifyContent: 'center',
    },
    removeActionPressed: {
      opacity: theme.opacity.pressed,
    },
    removeActionLabel: {
      opacity: 0.5,
      letterSpacing: 0.15,
    },
  });
}
