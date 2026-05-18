import type { ImageSourcePropType } from 'react-native';

/**
 * Maps mock/Firestore asset path strings to bundled local WEBP assets.
 * Metro requires static require() per file — add new entries when stories are added.
 */
const STORY_ASSET_SOURCES: Record<string, ImageSourcePropType> = {
  'assets/stories/kolobok/cover.webp': require('../../../../assets/stories/kolobok/cover.webp'),
  'assets/stories/kolobok/page-001.webp': require('../../../../assets/stories/kolobok/page-001.webp'),
  'assets/stories/kolobok/page-002.webp': require('../../../../assets/stories/kolobok/page-002.webp'),
  'assets/stories/kolobok/page-003.webp': require('../../../../assets/stories/kolobok/page-003.webp'),
  'assets/stories/fox-crane/cover.webp': require('../../../../assets/stories/fox-crane/cover.webp'),
  'assets/stories/fox-crane/page-001.webp': require('../../../../assets/stories/fox-crane/page-001.webp'),
  'assets/stories/fox-crane/page-002.webp': require('../../../../assets/stories/fox-crane/page-002.webp'),
  'assets/stories/fox-crane/page-003.webp': require('../../../../assets/stories/fox-crane/page-003.webp'),
  'assets/stories/koza-dereza/cover.webp': require('../../../../assets/stories/koza-dereza/cover.webp'),
  'assets/stories/koza-dereza/page-001.webp': require('../../../../assets/stories/koza-dereza/page-001.webp'),
  'assets/stories/koza-dereza/page-002.webp': require('../../../../assets/stories/koza-dereza/page-002.webp'),
  'assets/stories/koza-dereza/page-003.webp': require('../../../../assets/stories/koza-dereza/page-003.webp'),
};

export function resolveStoryAsset(
  assetPath: string | null | undefined,
): ImageSourcePropType | null {
  if (!assetPath) {
    return null;
  }

  return STORY_ASSET_SOURCES[assetPath] ?? null;
}

export function hasStoryAsset(assetPath: string | null | undefined): boolean {
  return resolveStoryAsset(assetPath) !== null;
}
