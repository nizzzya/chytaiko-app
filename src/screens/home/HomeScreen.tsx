import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  AppCard,
  AppChip,
  AppEmptyState,
  AppIconButton,
  AppImage,
  AppLoadingState,
  AppScreen,
  AppText,
} from '../../components/ui';
import { STORY_CATEGORY_LABELS } from '../../features/stories/constants';
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
            <AppText variant="h1">Читайко</AppText>
            <AppText variant="body" color="secondary">
              Казки для спокійного читання
            </AppText>
          </View>
          <View style={styles.headerActions}>
            <AppIconButton
              accessibilityLabel="Обране"
              label="♥"
              onPress={() => navigation.navigate('Favorites')}
            />
            <AppIconButton
              accessibilityLabel="Профіль"
              label="П"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
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
          <AppCard
            onPress={() =>
              navigation.navigate('Reader', {
                storyId: continueReading.story.id,
              })
            }
          >
            <AppText variant="h3">Продовжити читання</AppText>
            <AppText
              variant="body"
              color="secondary"
              numberOfLines={2}
              style={styles.continueTitle}
            >
              {continueReading.story.title}
            </AppText>
            <AppText variant="caption" color="muted">
              Сторінка {continueReading.page}
            </AppText>
          </AppCard>
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
              <StoryCatalogCard
                key={story.id}
                story={story}
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

type StoryCatalogCardProps = {
  story: Story;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
};

function StoryCatalogCard({ story, styles, onPress }: StoryCatalogCardProps) {
  const categoryLabel = STORY_CATEGORY_LABELS[story.category];
  const coverImage = useStoryImageSource(story.coverImage);

  return (
    <AppCard onPress={onPress}>
      <AppImage
        source={coverImage.source}
        fallbackLabel="Обкладинка"
        height={72}
        style={styles.cardCover}
      />
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
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.space_3,
    },
    header: {
      flex: 1,
      gap: theme.spacing.space_2,
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.space_1,
    },
    chipRow: {
      gap: theme.spacing.space_2,
      paddingRight: theme.layout.screenPadding,
    },
    continueTitle: {
      marginTop: theme.spacing.space_2,
    },
    offlineNote: {
      marginTop: theme.spacing.space_1,
    },
    catalog: {
      gap: theme.layout.cardGap,
    },
    cardCover: {
      marginBottom: theme.spacing.space_3,
    },
    cardDescription: {
      marginTop: theme.spacing.space_3,
    },
    cardMeta: {
      marginTop: theme.spacing.space_3,
    },
  });
}
