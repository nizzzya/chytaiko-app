import { hydrateFavorites } from '../../favorites/services/mockFavoritesService';
import { hydrateReadingProgress } from '../../reader/services/mockReadingProgressService';

type HydrationListener = () => void;

let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<HydrationListener>();

function notifyHydrated(): void {
  hydrated = true;

  for (const listener of listeners) {
    listener();
  }
}

export function isHydrated(): boolean {
  return hydrated;
}

export function subscribeHydration(listener: HydrationListener): () => void {
  listeners.add(listener);

  if (hydrated) {
    listener();
  }

  return () => {
    listeners.delete(listener);
  };
}

export function initializeAppHydration(): Promise<void> {
  if (hydrated) {
    return Promise.resolve();
  }

  if (!hydrationPromise) {
    hydrationPromise = Promise.all([
      hydrateFavorites(),
      hydrateReadingProgress(),
    ])
      .then(() => {
        notifyHydrated();
      })
      .catch(() => {
        notifyHydrated();
      });
  }

  return hydrationPromise;
}
