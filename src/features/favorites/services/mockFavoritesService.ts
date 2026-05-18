import type {
  Favorite,
  FavoritesResult,
  FavoritesServiceError,
} from '../../../types/favorites';

const MOCK_USER_ID = 'local_user';

const favoritesByStoryId = new Map<string, Favorite>();

function createFavoriteId(storyId: string): string {
  return `${MOCK_USER_ID}_${storyId}`;
}

function createError(
  code: FavoritesServiceError['code'],
  message: string,
): FavoritesServiceError {
  return { code, message };
}

export function getFavorites(): FavoritesResult<Favorite[]> {
  const favorites = Array.from(favoritesByStoryId.values()).filter(
    (item) => item.userId === MOCK_USER_ID,
  );

  return {
    success: true,
    data: favorites.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  };
}

export function addFavorite(storyId: string): FavoritesResult<Favorite> {
  if (favoritesByStoryId.has(storyId)) {
    return {
      success: true,
      data: favoritesByStoryId.get(storyId)!,
    };
  }

  const favorite: Favorite = {
    id: createFavoriteId(storyId),
    userId: MOCK_USER_ID,
    storyId,
    createdAt: new Date().toISOString(),
  };

  favoritesByStoryId.set(storyId, favorite);

  return { success: true, data: favorite };
}

export function removeFavorite(storyId: string): FavoritesResult<void> {
  if (!favoritesByStoryId.has(storyId)) {
    return {
      success: false,
      error: createError('not_found', 'Цю казку не знайдено в обраному.'),
    };
  }

  favoritesByStoryId.delete(storyId);

  return { success: true, data: undefined };
}

export function isFavorite(storyId: string): boolean {
  return favoritesByStoryId.has(storyId);
}
