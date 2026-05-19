import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  Favorite,
  FavoritesResult,
  FavoritesServiceError,
} from '../../../types/favorites';

const MOCK_USER_ID = 'local_user';
const STORAGE_KEY = '@chytaiko/local-favorites';

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

function isFavoriteRecord(value: unknown): value is Favorite {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Favorite;

  return (
    typeof record.id === 'string' &&
    typeof record.userId === 'string' &&
    typeof record.storyId === 'string' &&
    typeof record.createdAt === 'string'
  );
}

function sortFavorites(favorites: Favorite[]): Favorite[] {
  return favorites.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function hydrateFavorites(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return;
    }

    for (const item of parsed) {
      if (!isFavoriteRecord(item) || item.userId !== MOCK_USER_ID) {
        continue;
      }

      if (!favoritesByStoryId.has(item.storyId)) {
        favoritesByStoryId.set(item.storyId, item);
      }
    }
  } catch {
    // Keep in-memory session data if storage is unavailable or corrupt.
  }
}

async function persistFavorites(): Promise<void> {
  try {
    const favorites = Array.from(favoritesByStoryId.values());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Memory remains source of truth for the current session.
  }
}

export function getFavorites(): FavoritesResult<Favorite[]> {
  const favorites = Array.from(favoritesByStoryId.values()).filter(
    (item) => item.userId === MOCK_USER_ID,
  );

  return {
    success: true,
    data: sortFavorites(favorites),
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
  void persistFavorites();

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
  void persistFavorites();

  return { success: true, data: undefined };
}

export function isFavorite(storyId: string): boolean {
  return favoritesByStoryId.has(storyId);
}
