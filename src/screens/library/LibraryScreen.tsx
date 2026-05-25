import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppCard,
  AppEmptyState,
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
import { STORY_CATEGORY_LABELS } from '../../features/stories/constants';
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
      <AppScreen>
        <AppEmptyState
          title="Бібліотека порожня"
          message="Почніть читати казку — тут з’являться продовження, обране та історія."
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
          <AppText variant="h1">Моя бібліотека</AppText>
          <AppText variant="body" color="secondary">
            Продовження, обране та спокійні ритуали читання
          </AppText>
        </View>

        {libraryView.continueReading ? (
          <LibrarySection title="Продовжити">
            <AppCard
              onPress={() =>
                navigation.navigate('Reader', {
                  storyId: libraryView.continueReading!.story.id,
                })
              }
            >
              <AppText variant="h3">{libraryView.continueReading.story.title}</AppText>
              <AppText
                variant="body"
                color="secondary"
                numberOfLines={2}
                style={styles.cardDescription}
              >
                {libraryView.continueReading.story.description}
              </AppText>
              <AppText variant="caption" color="muted" style={styles.cardMeta}>
                Сторінка {libraryView.continueReading.session.lastOpenedPage}
              </AppText>
            </AppCard>
          </LibrarySection>
        ) : null}

        {libraryView.favorites.length > 0 ? (
          <LibrarySection title="Улюблені">
            {libraryView.favorites.map((story) => (
              <LibraryStoryCard
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
              <LibraryStoryCard
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
              <LibraryStoryCard
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
              <LibraryStoryCard
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
              <LibraryStoryCard
                key={`history-${story.id}`}
                story={story}
                styles={styles}
                meta={
                  progress.completed
                    ? 'Прочитано'
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
        title: {
          marginBottom: theme.spacing.space_1,
        },
        list: {
          gap: theme.layout.cardGap,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.section}>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <View style={styles.list}>{children}</View>
    </View>
  );
}

type LibraryStoryCardProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  meta?: string;
  onPress: () => void;
};

function LibraryStoryCard({
  story,
  styles,
  meta,
  onPress,
}: LibraryStoryCardProps) {
  const categoryLabel = STORY_CATEGORY_LABELS[story.category];
  const detailMeta =
    meta ?? `${story.ageGroup} · ${categoryLabel} · ${story.pageCount} стор.`;

  return (
    <AppCard onPress={onPress}>
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
        {detailMeta}
      </AppText>
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
    cardDescription: {
      marginTop: theme.spacing.space_3,
    },
    cardMeta: {
      marginTop: theme.spacing.space_3,
    },
  });
}
