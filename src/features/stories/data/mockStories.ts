import type { Story, StoryPage } from '../../../types/story';

const MOCK_TIMESTAMP = '2026-01-15T12:00:00.000Z';

export const mockStories: Story[] = [
  {
    id: 'story_kolobok',
    slug: 'kolobok',
    title: 'Колобок',
    description:
      'Весела казка про хитрого Колобка, який вирушив у світ і зустрів різних тварин.',
    ageGroup: '4+',
    category: 'folk',
    coverImage: 'placeholder://kolobok/cover.webp',
    pageCount: 3,
    status: 'published',
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_lisychka',
    slug: 'lisychka-ta-zhuravel',
    title: 'Лисичка та журавель',
    description:
      'Казка про дружбу, взаємну допомогу та важливість тримати слово.',
    ageGroup: '5+',
    category: 'animals',
    coverImage: 'placeholder://lisychka-ta-zhuravel/cover.webp',
    pageCount: 3,
    status: 'published',
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_koza',
    slug: 'koza-dereza',
    title: 'Коза-дереза',
    description:
      'Добра казка на ніч про винахідливість і сміливість маленької кози.',
    ageGroup: '4+',
    category: 'bedtime',
    coverImage: 'placeholder://koza-dereza/cover.webp',
    pageCount: 3,
    status: 'published',
    createdAt: MOCK_TIMESTAMP,
    updatedAt: MOCK_TIMESTAMP,
  },
];

export const mockStoryPages: StoryPage[] = [
  {
    id: 'story_kolobok_page_1',
    storyId: 'story_kolobok',
    pageNumber: 1,
    text: 'Жили-були дід та баба. Одного разу баба спекла колобка — рум’яного та пахучого.',
    imageUrl: 'placeholder://kolobok/page-001.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_kolobok_page_2',
    storyId: 'story_kolobok',
    pageNumber: 2,
    text: 'Колобок покотився з порога і пішов по стежці, співаючи веселу пісеньку.',
    imageUrl: 'placeholder://kolobok/page-002.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_kolobok_page_3',
    storyId: 'story_kolobok',
    pageNumber: 3,
    text: 'Дорогою він зустрічав звірів, але завжди залишався спритним і уважним.',
    imageUrl: 'placeholder://kolobok/page-003.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_lisychka_page_1',
    storyId: 'story_lisychka',
    pageNumber: 1,
    text: 'Лисичка запросила журавля у гості на обід. Вона приготувала кашу в глибокій мискі.',
    imageUrl: 'placeholder://lisychka-ta-zhuravel/page-001.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_lisychka_page_2',
    storyId: 'story_lisychka',
    pageNumber: 2,
    text: 'Журавель не зміг їсти з миски, а лисичка швидко з’їла все сама.',
    imageUrl: 'placeholder://lisychka-ta-zhuravel/page-002.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_lisychka_page_3',
    storyId: 'story_lisychka',
    pageNumber: 3,
    text: 'Потім журавель запросив лисичку і подав їжу в високому глечику — так вони зрозуміли одне одного.',
    imageUrl: 'placeholder://lisychka-ta-zhuravel/page-003.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_koza_page_1',
    storyId: 'story_koza',
    pageNumber: 1,
    text: 'Коза-дереза жила в лісі і любила спокійні вечори біля струмка.',
    imageUrl: 'placeholder://koza-dereza/page-001.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_koza_page_2',
    storyId: 'story_koza',
    pageNumber: 2,
    text: 'Одного дня вона допомогла звірятам перейти через гірський струмок.',
    imageUrl: 'placeholder://koza-dereza/page-002.webp',
    createdAt: MOCK_TIMESTAMP,
  },
  {
    id: 'story_koza_page_3',
    storyId: 'story_koza',
    pageNumber: 3,
    text: 'Усі подякували козі, і вона повернулася додому — спокійна та щаслива.',
    imageUrl: 'placeholder://koza-dereza/page-003.webp',
    createdAt: MOCK_TIMESTAMP,
  },
];
