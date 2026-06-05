import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppEmptyState,
  AppImage,
  AppLoadingState,
  AppScreen,
  AppText,
} from '../../components/ui';
import {
  isHydrated,
  subscribeHydration,
} from '../../features/app/services/appHydrationService';
import { getLibraryData } from '../../features/library';
import type { LibraryContinueReading } from '../../features/library';
import { useStoryImageSource } from '../../features/stories/hooks/useStoryImageSource';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { ReadingProgress } from '../../types/readingProgress';
import type { Story } from '../../types/story';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Library'>;

type LibraryViewState = {
  continueReading: { session: LibraryContinueReading; story: Story } | null;
  favorites: Story[];
  nightReading: Story[];
  dayReading: Story[];
  readTogether: Story[];
  history: { progress: ReadingProgress; story: Story }[];
};

function resolveLibraryView(): LibraryViewState {
  const data = getLibraryData();

  const continueReading =
    data.continueReading &&
    (() => {
      const story = getStoryById(data.continueReading.lastOpenedStoryId);

      if (!story) {
        return null;
      }

      return { session: data.continueReading, story };
    })();

  const mapStoryIds = (storyIds: string[]) =>
    storyIds
      .map((storyId) => getStoryById(storyId))
      .filter((story): story is Story => story !== undefined);

  const history = data.history
    .map((progress) => {
      const story = getStoryById(progress.storyId);

      if (!story) {
        return null;
      }

      return { progress, story };
    })
    .filter((item): item is { progress: ReadingProgress; story: Story } => item !== null);

  return {
    continueReading: continueReading ?? null,
    favorites: mapStoryIds(data.favorites.map((item) => item.storyId)),
    nightReading: mapStoryIds(data.nightReading.map((item) => item.storyId)),
    dayReading: mapStoryIds(data.dayReading.map((item) => item.storyId)),
    readTogether: mapStoryIds(data.readTogether.map((item) => item.storyId)),
    history,
  };
}

function hasVisibleSections(view: LibraryViewState): boolean {
  return (
    view.continueReading !== null ||
    view.favorites.length > 0 ||
    view.nightReading.length > 0 ||
    view.dayReading.length > 0 ||
    view.readTogether.length > 0 ||
    view.history.length > 0
  );
}

export function LibraryScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [hydrationReady, setHydrationReady] = useState(isHydrated());
  const [libraryView, setLibraryView] = useState<LibraryViewState>(() =>
    resolveLibraryView(),
  );

  useEffect(() => subscribeHydration(() => setHydrationReady(true)), []);

  const refreshLibrary = useCallback(() => {
    setLibraryView(resolveLibraryView());
  }, []);

  useEffect(() => {
    if (!hydrationReady) {
      return;
    }

    refreshLibrary();
  }, [hydrationReady, refreshLibrary]);

  useFocusEffect(
    useCallback(() => {
      if (!hydrationReady) {
        return;
      }

      refreshLibrary();
    }, [hydrationReady, refreshLibrary]),
  );

  const showEmpty = hydrationReady && !hasVisibleSections(libraryView);

  if (!hydrationReady) {
    return (
      <AppScreen>
        <AppLoadingState variant="bar" />
      </AppScreen>
    );
  }

  if (showEmpty) {
    return (
      <AppScreen padded={false}>
        <View style={styles.emptyScreen}>
          <AppEmptyState
            title="Полички поки порожні"
            message="Почніть читати казку — тут з’являться продовження, обране та історія."
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
        <View style={styles.houseTop}>
          <View style={styles.roof} />
          <View style={styles.roofEave} />
        </View>

        <View style={styles.header}>
          <AppText variant="h1" style={styles.headerTitle}>
            Моя бібліотека
          </AppText>
          <AppText variant="body" color="secondary" style={styles.headerSubtitle}>
            Дім, у якому живуть улюблені казки
          </AppText>
        </View>

        {libraryView.continueReading ? (
          <LibrarySection title="Продовжити">
            <LibraryContinueRow
              story={libraryView.continueReading.story}
              page={libraryView.continueReading.session.lastOpenedPage}
              styles={styles}
              onPress={() =>
                navigation.navigate('Reader', {
                  storyId: libraryView.continueReading!.story.id,
                })
              }
            />
          </LibrarySection>
        ) : null}

        {libraryView.favorites.length > 0 ? (
          <LibrarySection title="Улюблені">
            {libraryView.favorites.map((story) => (
              <LibraryStoryRow
                key={`favorite-${story.id}`}
                story={story}
                styles={styles}
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </LibrarySection>
        ) : null}

        {libraryView.nightReading.length > 0 ? (
          <LibrarySection title="На ніч">
            {libraryView.nightReading.map((story) => (
              <LibraryStoryRow
                key={`night-${story.id}`}
                story={story}
                styles={styles}
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </LibrarySection>
        ) : null}

        {libraryView.dayReading.length > 0 ? (
          <LibrarySection title="Денне читання">
            {libraryView.dayReading.map((story) => (
              <LibraryStoryRow
                key={`day-${story.id}`}
                story={story}
                styles={styles}
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </LibrarySection>
        ) : null}

        {libraryView.readTogether.length > 0 ? (
          <LibrarySection title="Читаємо разом">
            {libraryView.readTogether.map((story) => (
              <LibraryStoryRow
                key={`together-${story.id}`}
                story={story}
                styles={styles}
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </LibrarySection>
        ) : null}

        {libraryView.history.length > 0 ? (
          <LibrarySection title="Історія">
            {libraryView.history.map(({ story, progress }) => (
              <LibraryStoryRow
                key={`history-${story.id}`}
                story={story}
                styles={styles}
                meta={
                  progress.completed
                    ? 'Прочитано разом'
                    : `Сторінка ${progress.lastPage}`
                }
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </LibrarySection>
        ) : null}
      </ScrollView>
    </AppScreen>
  );
}

type LibrarySectionProps = {
  title: string;
  children: ReactNode;
};

function LibrarySection({ title, children }: LibrarySectionProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        section: {
          gap: theme.spacing.space_3,
        },
        sectionTitle: {
          opacity: 0.5,
          fontWeight: '500',
          letterSpacing: 0.3,
          paddingHorizontal: theme.spacing.space_1,
        },
        niches: {
          gap: theme.spacing.space_3,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.section}>
      <AppText variant="caption" color="muted" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.niches}>{children}</View>
    </View>
  );
}

type LibraryContinueRowProps = {
  story: Story;
  page: number;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
};

function LibraryContinueRow({ story, page, styles, onPress }: LibraryContinueRowProps) {
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Продовжити ${story.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.activeRoom, pressed && styles.nichePressed]}
    >
      <AppImage
        source={coverImage.source}
        fallbackLabel="Обкладинка"
        aspectRatio={3 / 4}
        resizeMode="cover"
        style={styles.activeRoomCover}
      />
      <View style={styles.bookBody}>
        <AppText variant="bodyLarge" numberOfLines={2} style={styles.bookTitle}>
          {story.title}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.bookMeta}>
          Сторінка {page}
        </AppText>
      </View>
    </Pressable>
  );
}

type LibraryStoryRowProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  meta?: string;
  onPress: () => void;
};

function LibraryStoryRow({ story, styles, meta, onPress }: LibraryStoryRowProps) {
  const coverImage = useStoryImageSource(story.coverImage);
  const detailMeta = meta ?? `${story.ageGroup} · ${story.pageCount} стор.`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={story.title}
      onPress={onPress}
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
        <AppText variant="bodyLarge" numberOfLines={2} style={styles.bookTitle}>
          {story.title}
        </AppText>
        <AppText variant="caption" color="muted" numberOfLines={1} style={styles.bookMeta}>
          {detailMeta}
        </AppText>
      </View>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_5,
      paddingBottom: theme.spacing.space_16,
      gap: theme.spacing.space_8,
    },
    houseTop: {
      alignItems: 'center',
      marginBottom: theme.spacing.space_2,
    },
    roof: {
      width: 0,
      height: 0,
      borderLeftWidth: 26,
      borderRightWidth: 26,
      borderBottomWidth: 18,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: theme.colors.border,
      opacity: 0.5,
    },
    roofEave: {
      width: 72,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      opacity: 0.5,
    },
    header: {
      gap: theme.spacing.space_2,
      marginBottom: theme.spacing.space_2,
      alignItems: 'center',
    },
    headerTitle: {
      fontWeight: '600',
      letterSpacing: -0.3,
      textAlign: 'center',
    },
    headerSubtitle: {
      opacity: 0.66,
      lineHeight: theme.typography.body.lineHeight + 2,
      maxWidth: 300,
      textAlign: 'center',
    },
    emptyScreen: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.layout.screenPadding,
      paddingVertical: theme.spacing.space_16,
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
    activeRoom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.space_4,
      padding: theme.spacing.space_4,
      borderRadius: theme.radius.radius_lg,
      backgroundColor: theme.colors.surface,
    },
    activeRoomCover: {
      width: 84,
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surfaceMuted,
      ...theme.shadows.shadow_sm,
    },
    bookCover: {
      width: 56,
      borderRadius: theme.radius.radius_md,
      backgroundColor: theme.colors.surfaceMuted,
      ...theme.shadows.shadow_sm,
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
  });
}
