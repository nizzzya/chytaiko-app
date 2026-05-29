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
            title="Обрана поличка порожня"
            message="Збережіть казки з каталогу — вони з’являться тут."
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
            Казки, які хочеться зберегти на поличці
          </AppText>
        </View>

        <View style={styles.shelfSurface}>
          {stories.map((story, index) => (
            <FavoriteStoryRow
              key={story.id}
              story={story}
              styles={styles}
              isLast={index === stories.length - 1}
              onOpen={() =>
                navigation.navigate('StoryDetails', { storyId: story.id })
              }
              onRemove={() => handleRemove(story.id)}
            />
          ))}
          <View style={styles.shelfBase} />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

type FavoriteStoryRowProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  isLast: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

function FavoriteStoryRow({
  story,
  styles,
  isLast,
  onOpen,
  onRemove,
}: FavoriteStoryRowProps) {
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <View style={[styles.bookItem, !isLast && styles.bookItemSpaced]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={story.title}
        onPress={onOpen}
        style={({ pressed }) => [styles.bookRow, pressed && styles.bookRowPressed]}
      >
        <View style={styles.bookCoverFrame}>
          <AppImage
            source={coverImage.source}
            fallbackLabel="Обкладинка"
            aspectRatio={3 / 4}
            resizeMode="cover"
            style={styles.bookCover}
          />
        </View>
        <View style={styles.bookBody}>
          <AppText variant="bodyLarge" numberOfLines={2} style={styles.bookTitle}>
            {story.title}
          </AppText>
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
          Прибрати з обраної полички
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
    shelfSurface: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.radius_lg,
      paddingHorizontal: theme.spacing.space_3,
      paddingTop: theme.spacing.space_3,
      paddingBottom: theme.spacing.space_4,
    },
    shelfBase: {
      marginTop: theme.spacing.space_2,
      height: theme.spacing.space_2,
      borderRadius: theme.radius.radius_sm,
      backgroundColor: theme.colors.surfaceMuted,
    },
    bookItem: {
      paddingHorizontal: theme.spacing.space_1,
    },
    bookItemSpaced: {
      paddingBottom: theme.spacing.space_4,
      marginBottom: theme.spacing.space_2,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    bookRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.space_3,
      paddingVertical: theme.spacing.space_2,
      borderRadius: theme.radius.radius_md,
    },
    bookRowPressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    bookCoverFrame: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.radius_sm,
      padding: theme.spacing.space_1,
    },
    bookCover: {
      width: 56,
      borderRadius: theme.radius.radius_sm,
      backgroundColor: theme.colors.surface,
    },
    bookBody: {
      flex: 1,
      gap: theme.spacing.space_1,
      paddingVertical: theme.spacing.space_1,
    },
    bookTitle: {
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
      marginTop: theme.spacing.space_1,
      marginLeft: theme.spacing.space_1,
      paddingHorizontal: theme.spacing.space_2,
      paddingVertical: theme.spacing.space_1,
      justifyContent: 'center',
    },
    removeActionPressed: {
      opacity: theme.opacity.pressed,
    },
    removeActionLabel: {
      opacity: 0.52,
      letterSpacing: 0.15,
    },
  });
}
