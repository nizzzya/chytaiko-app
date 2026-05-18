import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '../../../services/firebase/firestore';
import { isFirebaseConfigured } from '../../../services/firebase/config';
import type {
  Story,
  StoryAgeGroup,
  StoryCategory,
  StoryPage,
  StoryStatus,
} from '../../../types/story';

const STORIES_COLLECTION = 'stories';
const STORY_PAGES_COLLECTION = 'storyPages';

const STORY_AGE_GROUPS: StoryAgeGroup[] = ['4+', '5+', '6+'];
const STORY_CATEGORIES: StoryCategory[] = [
  'folk',
  'fairy',
  'bedtime',
  'animals',
  'nature',
];
const STORY_STATUSES: StoryStatus[] = ['draft', 'active'];

export type StoriesFirestoreErrorCode =
  | 'not_configured'
  | 'not_found'
  | 'invalid_data'
  | 'unknown';

export type StoriesFirestoreServiceError = {
  code: StoriesFirestoreErrorCode;
  message: string;
};

export type StoriesFirestoreResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: StoriesFirestoreServiceError };

function createError(
  code: StoriesFirestoreErrorCode,
  message: string,
): StoriesFirestoreServiceError {
  return { code, message };
}

function notConfiguredResult<T>(): StoriesFirestoreResult<T> {
  return {
    success: false,
    error: createError(
      'not_configured',
      'Каталог казок недоступний без налаштування Firebase.',
    ),
  };
}

function normalizeFirestoreError(): StoriesFirestoreServiceError {
  return createError(
    'unknown',
    'Не вдалося завантажити казки. Спробуйте пізніше.',
  );
}

function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return '';
}

function isStoryAgeGroup(value: string): value is StoryAgeGroup {
  return STORY_AGE_GROUPS.includes(value as StoryAgeGroup);
}

function isStoryCategory(value: string): value is StoryCategory {
  return STORY_CATEGORIES.includes(value as StoryCategory);
}

function isStoryStatus(value: string): value is StoryStatus {
  return STORY_STATUSES.includes(value as StoryStatus);
}

function mapStoryDocument(
  snapshot: DocumentSnapshot<DocumentData>,
): Story | null {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const id =
    typeof data.id === 'string' && data.id.trim().length > 0
      ? data.id
      : snapshot.id;
  const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description =
    typeof data.description === 'string' ? data.description.trim() : '';
  const ageGroup =
    typeof data.ageGroup === 'string' ? data.ageGroup.trim() : '';
  const category =
    typeof data.category === 'string' ? data.category.trim() : '';
  const coverImage =
    typeof data.coverImage === 'string' ? data.coverImage.trim() : '';
  const status = typeof data.status === 'string' ? data.status.trim() : '';
  const pageCount =
    typeof data.pageCount === 'number' ? data.pageCount : Number(data.pageCount);
  const createdAt = toIsoString(data.createdAt);
  const updatedAt = toIsoString(data.updatedAt);

  if (
    !slug ||
    !title ||
    !description ||
    !isStoryAgeGroup(ageGroup) ||
    !isStoryCategory(category) ||
    !coverImage ||
    !isStoryStatus(status) ||
    !Number.isFinite(pageCount) ||
    pageCount < 1 ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }

  return {
    id,
    slug,
    title,
    description,
    ageGroup,
    category,
    coverImage,
    pageCount,
    status,
    createdAt,
    updatedAt,
  };
}

function mapStoryPageDocument(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): StoryPage | null {
  const data = snapshot.data();
  const id =
    typeof data.id === 'string' && data.id.trim().length > 0
      ? data.id
      : snapshot.id;
  const storyId =
    typeof data.storyId === 'string' ? data.storyId.trim() : '';
  const pageNumber =
    typeof data.pageNumber === 'number'
      ? data.pageNumber
      : Number(data.pageNumber);
  const text = typeof data.text === 'string' ? data.text : '';
  const imageUrl =
    typeof data.imageUrl === 'string' && data.imageUrl.trim().length > 0
      ? data.imageUrl.trim()
      : null;
  const createdAt = toIsoString(data.createdAt);

  if (
    !storyId ||
    !text ||
    !Number.isFinite(pageNumber) ||
    pageNumber < 1 ||
    !createdAt
  ) {
    return null;
  }

  return {
    id,
    storyId,
    pageNumber,
    text,
    imageUrl,
    createdAt,
  };
}

function sortStories(stories: Story[]): Story[] {
  return [...stories].sort((left, right) => {
    const leftTime = Date.parse(left.createdAt);
    const rightTime = Date.parse(right.createdAt);

    if (
      Number.isFinite(leftTime) &&
      Number.isFinite(rightTime) &&
      leftTime !== rightTime
    ) {
      return leftTime - rightTime;
    }

    return left.title.localeCompare(right.title, 'uk');
  });
}

function sortStoryPages(pages: StoryPage[]): StoryPage[] {
  return [...pages].sort((left, right) => left.pageNumber - right.pageNumber);
}

export async function getFirestoreStories(): Promise<
  StoriesFirestoreResult<Story[]>
> {
  if (!isFirebaseConfigured()) {
    return notConfiguredResult();
  }

  try {
    const db = getFirebaseFirestore();
    const storiesQuery = query(
      collection(db, STORIES_COLLECTION),
      where('status', '==', 'active'),
    );
    const snapshot = await getDocs(storiesQuery);

    const stories = snapshot.docs
      .map((document) => mapStoryDocument(document))
      .filter((story): story is Story => story !== null && story.status === 'active');

    return { success: true, data: sortStories(stories) };
  } catch {
    return { success: false, error: normalizeFirestoreError() };
  }
}

export async function getFirestoreStoryById(
  id: string,
): Promise<StoriesFirestoreResult<Story>> {
  if (!id.trim()) {
    return {
      success: false,
      error: createError('not_found', 'Казку не знайдено.'),
    };
  }

  if (!isFirebaseConfigured()) {
    return notConfiguredResult();
  }

  try {
    const db = getFirebaseFirestore();
    const snapshot = await getDoc(doc(db, STORIES_COLLECTION, id));
    const story = mapStoryDocument(snapshot);

    if (!story || story.status !== 'active') {
      return {
        success: false,
        error: createError('not_found', 'Казку не знайдено.'),
      };
    }

    return { success: true, data: story };
  } catch {
    return { success: false, error: normalizeFirestoreError() };
  }
}

export async function getFirestoreStoryPages(
  storyId: string,
): Promise<StoriesFirestoreResult<StoryPage[]>> {
  if (!storyId.trim()) {
    return {
      success: false,
      error: createError('not_found', 'Сторінки казки не знайдено.'),
    };
  }

  if (!isFirebaseConfigured()) {
    return notConfiguredResult();
  }

  try {
    const db = getFirebaseFirestore();
    const pagesQuery = query(
      collection(db, STORY_PAGES_COLLECTION),
      where('storyId', '==', storyId),
    );
    const snapshot = await getDocs(pagesQuery);

    const pages = snapshot.docs
      .map((document) => mapStoryPageDocument(document))
      .filter((page): page is StoryPage => page !== null);

    return { success: true, data: sortStoryPages(pages) };
  } catch {
    return { success: false, error: normalizeFirestoreError() };
  }
}
