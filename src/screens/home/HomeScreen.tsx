import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useNetworkStatus } from '../../features/app/hooks/useNetworkStatus';
import {
  isHydrated,
  isStoriesCatalogReady,
  subscribeHydration,
  subscribeStoriesCatalogReady,
} from '../../features/app/services/appHydrationService';
import { getLastReaderSession } from '../../features/reader';
import {
  AppChip,
  AppEmptyState,
  AppImage,
  AppLoadingState,
  AppScreen,
  AppText,
} from '../../components/ui';
import { useStoryImageSource } from '../../features/stories/hooks/useStoryImageSource';
import {
  getStories,
  getStoryById,
} from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import type { Story, StoryAgeGroup } from '../../types/story';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type AgeFilter = 'all' | StoryAgeGroup;

const AGE_FILTERS: { id: AgeFilter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: '4+', label: '4+' },
  { id: '5+', label: '5+' },
  { id: '6+', label: '6+' },
];

/** Mobile bookshelf columns; increase when tablet layout is added. */
const BOOKSHELF_COLUMN_COUNT = 2;

const bookColumnBasisPercent = `${Math.floor(100 / BOOKSHELF_COLUMN_COUNT - 3)}%`;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');
  const [storiesReady, setStoriesReady] = useState(isStoriesCatalogReady());
  const [localDataReady, setLocalDataReady] = useState(isHydrated());
  const { isOnline } = useNetworkStatus();

  useEffect(() => subscribeStoriesCatalogReady(() => setStoriesReady(true)), []);
  useEffect(() => subscribeHydration(() => setLocalDataReady(true)), []);

  const activeStories = useMemo(() => {
    if (!storiesReady) {
      return [];
    }

    return getStories();
  }, [storiesReady]);

  const visibleStories = useMemo(() => {
    if (ageFilter === 'all') {
      return activeStories;
    }

    return activeStories.filter((story) => story.ageGroup === ageFilter);
  }, [activeStories, ageFilter]);

  const continueReading = useMemo(() => {
    if (!localDataReady) {
      return null;
    }

    const session = getLastReaderSession();

    if (!session) {
      return null;
    }

    const story = getStoryById(session.lastOpenedStoryId);

    if (!story) {
      return null;
    }

    return {
      story,
      page: session.lastOpenedPage,
    };
  }, [localDataReady, activeStories]);

  if (!storiesReady) {
    return (
      <AppScreen>
        <AppLoadingState variant="bar" />
      </AppScreen>
    );
  }

  if (activeStories.length === 0) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Поки немає казок"
          message="Незабаром з’являться нові історії."
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
        <View style={styles.topBar}>
          <View style={styles.header}>
            <AppText variant="h1" style={styles.brandTitle}>
              Читайко
            </AppText>
            <AppText variant="body" color="secondary" style={styles.brandSubtitle}>
              Казки для спокійного читання
            </AppText>
          </View>
          <View style={styles.headerActions}>
            <HeaderActionButton
              label="Бібліотека"
              onPress={() => navigation.navigate('Library')}
            />
            <HeaderActionButton
              label="Обране"
              onPress={() => navigation.navigate('Favorites')}
            />
            <HeaderActionButton
              label="Профіль"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {AGE_FILTERS.map((chip) => (
            <AppChip
              key={chip.id}
              label={chip.label}
              selected={ageFilter === chip.id}
              onPress={() => setAgeFilter(chip.id)}
            />
          ))}
        </ScrollView>

        {continueReading ? (
          <ContinueReadingInvite
            story={continueReading.story}
            page={continueReading.page}
            styles={styles}
            onPress={() =>
              navigation.navigate('Reader', {
                storyId: continueReading.story.id,
              })
            }
          />
        ) : null}

        {!isOnline ? (
          <AppText variant="caption" color="secondary" style={styles.offlineNote}>
            Ви офлайн. Збережені казки та прогрес залишаються доступними.
          </AppText>
        ) : null}

        {visibleStories.length === 0 ? (
          <AppEmptyState
            title="Немає казок"
            message="Спробуйте обрати інший вік."
            actionLabel="Усі казки"
            onAction={() => setAgeFilter('all')}
          />
        ) : (
          <View style={styles.catalog}>
            {visibleStories.map((story) => (
              <BookshelfStoryItem
                key={story.id}
                story={story}
                columnBasis={bookColumnBasisPercent}
                styles={styles}
                onPress={() =>
                  navigation.navigate('StoryDetails', { storyId: story.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

type BookshelfStoryItemProps = {
  story: Story;
  columnBasis: string;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
};

function BookshelfStoryItem({
  story,
  columnBasis,
  styles,
  onPress,
}: BookshelfStoryItemProps) {
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={story.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bookItem,
        { flexBasis: columnBasis, maxWidth: columnBasis },
        pressed && styles.bookItemPressed,
      ]}
    >
      <AppImage
        source={coverImage.source}
        fallbackLabel="Обкладинка"
        aspectRatio={3 / 4}
        style={styles.bookCover}
      />
      <AppText variant="body" numberOfLines={2} style={styles.bookTitle}>
        {story.title}
      </AppText>
      <AppText variant="caption" color="muted" numberOfLines={1} style={styles.bookMeta}>
        {story.ageGroup} · {story.pageCount} стор.
      </AppText>
    </Pressable>
  );
}

type ContinueReadingInviteProps = {
  story: Story;
  page: number;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
};

function ContinueReadingInvite({
  story,
  page,
  styles,
  onPress,
}: ContinueReadingInviteProps) {
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Повернемось до казки ${story.title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.continueInvite,
        pressed && styles.continueInvitePressed,
      ]}
    >
      <AppImage
        source={coverImage.source}
        fallbackLabel="Обкладинка"
        aspectRatio={3 / 4}
        style={styles.continueCover}
      />
      <View style={styles.continueBody}>
        <AppText variant="caption" color="muted" style={styles.continuePrompt}>
          Повернемось до казки?
        </AppText>
        <AppText variant="body" numberOfLines={2} style={styles.continueStoryTitle}>
          {story.title}
        </AppText>
        <AppText variant="caption" color="muted" style={styles.continuePage}>
          Сторінка {page}
        </AppText>
      </View>
    </Pressable>
  );
}

type HeaderActionButtonProps = {
  label: string;
  onPress: () => void;
};

function HeaderActionButton({ label, onPress }: HeaderActionButtonProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          minHeight: 44,
          paddingVertical: theme.spacing.space_1,
          paddingHorizontal: theme.spacing.space_2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        pressed: {
          opacity: theme.opacity.pressed,
        },
      }),
    [theme],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AppText variant="caption" color="muted" style={{ opacity: 0.82 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: theme.layout.screenPadding,
      paddingTop: theme.spacing.space_4,
      paddingBottom: theme.spacing.space_16,
      gap: theme.spacing.space_6,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.space_3,
    },
    header: {
      flex: 1,
      gap: theme.spacing.space_1,
    },
    brandTitle: {
      fontWeight: '600',
    },
    brandSubtitle: {
      opacity: 0.78,
    },
    headerActions: {
      gap: theme.spacing.space_1,
      alignItems: 'flex-end',
      paddingTop: theme.spacing.space_1,
    },
    filterRow: {
      gap: theme.spacing.space_2,
      paddingRight: theme.layout.screenPadding,
      opacity: 0.72,
    },
    continueInvite: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.space_3,
      paddingVertical: theme.spacing.space_2,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    continueInvitePressed: {
      opacity: theme.opacity.pressed,
    },
    continueCover: {
      width: 56,
      borderRadius: theme.radius.radius_sm,
    },
    continueBody: {
      flex: 1,
      gap: theme.spacing.space_1,
    },
    continuePrompt: {
      opacity: 0.72,
    },
    continueStoryTitle: {
      fontWeight: '500',
    },
    continuePage: {
      opacity: 0.7,
    },
    offlineNote: {
      opacity: 0.8,
    },
    catalog: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: theme.spacing.space_5,
    },
    bookItem: {
      flexGrow: 0,
      flexShrink: 0,
    },
    bookItemPressed: {
      opacity: theme.opacity.pressed,
    },
    bookCover: {
      width: '100%',
      marginBottom: theme.spacing.space_2,
      borderRadius: theme.radius.radius_sm,
    },
    bookTitle: {
      fontWeight: '500',
      marginBottom: theme.spacing.space_1,
    },
    bookMeta: {
      opacity: 0.72,
    },
  });
}
