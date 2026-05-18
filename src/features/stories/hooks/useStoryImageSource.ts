import { useEffect, useState } from 'react';

import {
  resolveStoryImageSource,
  resolveStoryImageSourceAsync,
  type StoryImageSource,
} from '../services/storyAssetService';

/**
 * Resolves story image paths for UI (local → remote URL → Storage download URL).
 * Cancels in-flight resolution when imagePath changes to avoid stale images.
 */
export function useStoryImageSource(
  imagePath: string | null | undefined,
): StoryImageSource {
  const [resolved, setResolved] = useState<StoryImageSource>(() =>
    resolveStoryImageSource(imagePath),
  );

  useEffect(() => {
    setResolved(resolveStoryImageSource(imagePath));

    let cancelled = false;

    void resolveStoryImageSourceAsync(imagePath).then((result) => {
      if (!cancelled) {
        setResolved(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [imagePath]);

  return resolved;
}
