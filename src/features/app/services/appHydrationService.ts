import { initializeStoriesData } from '../../stories/services/storiesService';
import { hydrateFavorites } from '../../favorites/services/mockFavoritesService';
import { hydrateReaderCache } from '../../reader/services/readerCacheService';
import { hydrateReaderSettings } from '../../reader/services/readerSettingsService';
import { hydrateReadingProgress } from '../../reader/services/mockReadingProgressService';

type HydrationListener = () => void;

const STORIES_SOURCE_ENV = 'EXPO_PUBLIC_STORIES_SOURCE';

let localDataHydrated = false;
let storiesCatalogReady = false;
let hydrationPromise: Promise<void> | null = null;

const localDataListeners = new Set<HydrationListener>();
const storiesCatalogListeners = new Set<HydrationListener>();

function usesFirestoreStoriesSource(): boolean {
  return process.env[STORIES_SOURCE_ENV]?.trim().toLowerCase() === 'firestore';
}

function notifyLocalDataHydrated(): void {
  localDataHydrated = true;

  for (const listener of localDataListeners) {
    listener();
  }
}

function notifyStoriesCatalogReady(): void {
  storiesCatalogReady = true;

  for (const listener of storiesCatalogListeners) {
    listener();
  }
}

/** Favorites and reading progress AsyncStorage hydration (unchanged). */
export function isHydrated(): boolean {
  return localDataHydrated;
}

export function subscribeHydration(listener: HydrationListener): () => void {
  localDataListeners.add(listener);

  if (localDataHydrated) {
    listener();
  }

  return () => {
    localDataListeners.delete(listener);
  };
}

/** Stories catalog data source initialization (mock or Firestore). */
export function isStoriesCatalogReady(): boolean {
  if (!usesFirestoreStoriesSource()) {
    return true;
  }

  return storiesCatalogReady;
}

export function subscribeStoriesCatalogReady(
  listener: HydrationListener,
): () => void {
  storiesCatalogListeners.add(listener);

  if (isStoriesCatalogReady()) {
    listener();
  }

  return () => {
    storiesCatalogListeners.delete(listener);
  };
}

export function initializeAppHydration(): Promise<void> {
  if (localDataHydrated && isStoriesCatalogReady()) {
    return Promise.resolve();
  }

  if (!hydrationPromise) {
    hydrationPromise = Promise.all([
      Promise.all([
        hydrateFavorites(),
        hydrateReadingProgress(),
        hydrateReaderCache(),
        hydrateReaderSettings(),
      ])
        .then(() => {
          notifyLocalDataHydrated();
        })
        .catch(() => {
          notifyLocalDataHydrated();
        }),
      initializeStoriesData()
        .then(() => {
          notifyStoriesCatalogReady();
        })
        .catch(() => {
          notifyStoriesCatalogReady();
        }),
    ]).then(() => undefined);
  }

  return hydrationPromise;
}
