import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppEmptyState, AppScreen, AppText } from '../../components/ui';
import { getMockStoryById } from '../../features/stories';
import type { RootStackParamList } from '../../navigation/types';
import { useAppTheme, type AppTheme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StoryDetails'>;

export function StoryDetailsScreen({ navigation, route }: Props) {
  const { storyId } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const story = getMockStoryById(storyId);

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
        <AppButton
          label="Читати"
          onPress={() => navigation.navigate('Reader', { storyId: story.id })}
          style={styles.readButton}
        />
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
    readButton: {
      marginTop: theme.spacing.space_8,
    },
  });
}
