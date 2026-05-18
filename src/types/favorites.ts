export type Favorite = {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
};

export type FavoritesErrorCode = 'not_found' | 'already_exists' | 'unknown';

export type FavoritesServiceError = {
  code: FavoritesErrorCode;
  message: string;
};

export type FavoritesResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: FavoritesServiceError };
