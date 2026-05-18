import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppEmptyState, AppScreen, AppText } from '../../components/ui';
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from '../../features/favorites';
import { getStoryById } from '../../features/stories/services/storiesService';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StoryDetails'>;

export function StoryDetailsScreen({ navigation, route }: Props) {
  const { storyId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const story = getStoryById(storyId);
  const [isStoryFavorite, setIsStoryFavorite] = useState(false);

  const refreshFavorite = useCallback(() => {
    setIsStoryFavorite(isFavorite(storyId));
  }, [storyId]);

  useFocusEffect(
    useCallback(() => {
      refreshFavorite();
    }, [refreshFavorite]),
  );

  const handleToggleFavorite = () => {
    if (isStoryFavorite) {
      removeFavorite(storyId);
    } else {
      addFavorite(storyId);
    }

    refreshFavorite();
  };

  if (!story) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Казку не знайдено"
          message="Спробуйте повернутися до каталогу."
          actionLabel="Назад"
          onAction={() => navigation.goBack()}
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
        <AppText variant="h1">{story.title}</AppText>
        <AppText variant="bodyLarge" color="secondary" style={styles.description}>
          {story.description}
        </AppText>
        <View style={styles.meta}>
          <AppText variant="caption" color="muted">
            Вік: {story.ageGroup}
          </AppText>
          <AppText variant="caption" color="muted">
            Категорія: {story.category}
          </AppText>
          <AppText variant="caption" color="muted">
            Сторінок: {story.pageCount}
          </AppText>
        </View>
        <View style={styles.actions}>
          <AppButton
            label="Читати"
            onPress={() => navigation.navigate('Reader', { storyId: story.id })}
          />
          <AppButton
            label={
              isStoryFavorite ? 'Прибрати з обраного' : 'Додати в обране'
            }
            variant="secondary"
            onPress={handleToggleFavorite}
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
    },
    description: {
      marginTop: theme.spacing.space_4,
    },
    meta: {
      marginTop: theme.spacing.space_6,
      gap: theme.spacing.space_2,
    },
    actions: {
      marginTop: theme.spacing.space_8,
      gap: theme.spacing.space_3,
    },
  });
}
